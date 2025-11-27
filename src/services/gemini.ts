
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SheetContent, QuizContent, QuizConfig, GradingResult, ChartContent } from "../types";

// --- LAZY INITIALIZATION ---
// On n'initialise pas tout de suite pour éviter le crash au chargement de la page
// si la clé API est mal configurée ou absente au démarrage.
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY manquante ! Vérifiez votre configuration Vercel.");
      throw new Error("Clé API manquante. Impossible de contacter l'IA.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

// --- SCHEMAS ---

const CHART_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    xAxisLabel: { type: Type.STRING },
    yAxisLabel: { type: Type.STRING },
    type: { type: Type.STRING, enum: ['bar', 'line'] },
    data: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          value: { type: Type.NUMBER }
        },
        required: ["name", "value"]
      }
    }
  },
  required: ["title", "xAxisLabel", "yAxisLabel", "type", "data"]
};

const SHEET_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Titre du chapitre" },
    objectives: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Liste des objectifs pédagogiques" 
    },
    keyPoints: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Points essentiels à retenir (résumé concis, bullet points)" 
    },
    detailedContent: {
      type: Type.STRING,
      description: "Un paragraphe explicatif très détaillé qui approfondit les notions clés."
    },
    examples: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Exemples concrets illustrant le cours" 
    },
    geogebraCommand: {
      type: Type.STRING,
      description: "UNIQUEMENT POUR LES MATHS: Une ou plusieurs commandes GeoGebra valides séparées par des points-virgules pour illustrer le concept (ex: 'f(x)=x^2; A=(1,1)'). Sinon laisser vide.",
      nullable: true
    },
    chartContent: {
      ...CHART_SCHEMA,
      description: "UNIQUEMENT POUR SVT si un graphique est pertinent. Sinon null.",
      nullable: true
    },
    examSample: {
      type: Type.OBJECT,
      properties: {
        instruction: { type: Type.STRING, description: "Une consigne type d'examen (Brevet ou contrôle) ou d'exercice." },
        perfectCopy: { type: Type.STRING, description: "La 'copie parfaite' ou réponse idéale attendue, rédigée entièrement avec structure rigoureuse (Intro, Développement, Conclusion), citations et références." },
        tips: { type: Type.STRING, description: "Conseils de méthode pour réussir cet exercice spécifique." }
      },
      required: ["instruction", "perfectCopy", "tips"]
    }
  },
  required: ["title", "objectives", "keyPoints", "detailedContent", "examples", "examSample"]
};

const QUIZ_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    difficulty: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          type: { type: Type.STRING, enum: ["MCQ", "OPEN"], description: "Type de question: QCM ou réponse libre." },
          question: { type: Type.STRING, description: "L'énoncé de la question." },
          textToRead: { type: Type.STRING, description: "Laisser vide (plus de dictée).", nullable: true },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Liste de 4 choix de réponse (Uniquement si type='MCQ'). Laisser vide si OPEN." 
          },
          correctAnswerIndex: { type: Type.INTEGER, description: "Index (0-3) de la bonne réponse (Uniquement si type='MCQ')." },
          correctAnswerText: { type: Type.STRING, description: "La réponse attendue détaillée (Uniquement si type='OPEN')." },
          explanation: { type: Type.STRING, description: "Explication pédagogique de la réponse." }
        },
        required: ["id", "type", "question", "explanation"]
      }
    }
  },
  required: ["topic", "difficulty", "questions"]
};

const GRADING_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    isCorrect: { type: Type.BOOLEAN, description: "La réponse est-elle globalement correcte ?" },
    score: { type: Type.INTEGER, description: "1 si la réponse est acceptable, 0 sinon." },
    feedback: { type: Type.STRING, description: "Commentaire pédagogique adressé à l'élève. Explique l'erreur ou félicite." }
  },
  required: ["isCorrect", "score", "feedback"]
};

// --- FUNCTIONS ---

export async function askQuickQuestion(question: string): Promise<string> {
  try {
    const ai = getAI();
    const prompt = `Tu es un assistant pédagogique virtuel pour des collégiens français (11-15 ans).
    
    Ta mission : Répondre à une question rapide sur un cours.
    
    RÈGLES DE SÉCURITÉ ET DE PÉRIMÈTRE (TRÈS IMPORTANT) :
    1. Tu ne réponds QU'AUX questions scolaires (Maths, Français, Histoire, Sciences, Langues, etc.).
    2. Si la question porte sur : la politique, la religion, la sexualité, la violence, les jeux vidéo, les célébrités, ou des conseils personnels/médicaux -> TU REFUSES poliment en disant : "Je suis là uniquement pour t'aider dans tes devoirs et tes révisions scolaires."
    3. Ton ton doit être encourageant, clair, et adapté à un collégien. Pas de jargon universitaire.
    4. Sois concis (max 3-4 phrases) pour une réponse rapide.
    
    Question de l'élève : "${question}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Désolé, je n'ai pas pu traiter ta demande.";
  } catch (error) {
    console.error("Error asking quick question:", error);
    return "Une erreur de connexion est survenue. Vérifiez votre clé API.";
  }
}

export async function generateRevisionSheet(level: string, subject: string, topic: string): Promise<SheetContent | null> {
  try {
    const ai = getAI();
    const isMath = subject === 'Mathématiques';
    const isSVT = subject === 'SVT';
    
    let specificPrompt = "";
    if (isMath) {
      specificPrompt = "IMPORTANT: Comme c'est des maths, génère une commande GeoGebra pertinente pour le champ 'geogebraCommand' (ex: pour les fonctions, donne la fonction; pour la géométrie, les coordonnées).";
    } else if (isSVT) {
      specificPrompt = "IMPORTANT: Comme c'est des SVT, si une notion quantitative ou évolutive est abordée (ex: courbe, histogramme), remplis le champ 'chartContent' avec des données précises (type 'line' ou 'bar') pour que je puisse tracer le graphique. Sinon laisse chartContent à null.";
    }

    const prompt = `Génère une fiche de révision complète pour un élève de ${level} en ${subject} sur le thème : "${topic}".
    
    ${specificPrompt}
    
    La fiche doit contenir :
    1. Des objectifs clairs.
    2. L'essentiel du cours en points clés.
    3. Un contenu détaillé.
    4. Des exemples concrets.
    5. UN EXEMPLE TYPE CONTRÔLE avec une consigne et une "copie parfaite" structurée (introduction, développement avec arguments/citations, conclusion). La copie parfaite doit être EXCELLENTE.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: SHEET_SCHEMA,
        temperature: 0.3, 
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as SheetContent;
    }
    return null;

  } catch (error) {
    console.error("Error generating sheet:", error);
    return null;
  }
}

// --- NEW FEATURES FOR PERFECT COPY ---

export async function getCopyExplanation(instruction: string, copy: string): Promise<string> {
  try {
    const ai = getAI();
    const prompt = `Agis comme un professeur correcteur expert.
    Consigne : "${instruction}"
    Copie de l'élève (modèle) : "${copy}"
    
    Explique pourquoi cette copie est excellente. Analyse :
    1. La structure (Introduction/Plan).
    2. L'utilisation des connaissances (Citations, théorèmes, dates).
    3. La méthode de rédaction.
    
    Sois pédagogique, direct et encourageant.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Pas d'explication disponible.";
  } catch (error) {
    return "Erreur lors de l'analyse.";
  }
}

export async function getReformulatedCopy(copy: string, complexity: 'SIMPLE' | 'EXPERT'): Promise<string> {
  try {
    const ai = getAI();
    let instruction = "";
    if (complexity === 'SIMPLE') {
      instruction = "Reformule cette copie pour un élève en difficulté : utilise des phrases plus courtes, un vocabulaire plus simple, et explique davantage les sous-entendus. Garde le même sens.";
    } else {
      instruction = "Reformule cette copie pour un niveau 'Excellence' (Lycée/Concours) : utilise un vocabulaire soutenu, des tournures complexes, et densifie l'argumentation ou la précision mathématique.";
    }

    const prompt = `${instruction}
    
    Texte original : "${copy}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || copy;
  } catch (error) {
    return copy;
  }
}

export async function getNewExamSample(level: string, subject: string, topic: string): Promise<SheetContent['examSample'] | null> {
  try {
    const ai = getAI();
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        instruction: { type: Type.STRING },
        perfectCopy: { type: Type.STRING },
        tips: { type: Type.STRING }
      },
      required: ["instruction", "perfectCopy", "tips"]
    };

    const prompt = `Génère UNIQUEMENT un nouvel exemple d'exercice type contrôle (différent des précédents) pour ${level} en ${subject} sur "${topic}".
    Il me faut : une consigne, une réponse rédigée parfaite, et des conseils.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7, 
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as SheetContent['examSample'];
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function getNewChartData(level: string, topic: string): Promise<ChartContent | null> {
  try {
    const ai = getAI();
    const prompt = `Génère UNIQUEMENT des données chiffrées pour un graphique SVT pertinent sur le thème "${topic}" (Niveau ${level}).
    Exemple: Évolution d'une population, Rythme cardiaque, Taux d'O2...
    Je veux titre, axes et data points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: CHART_SCHEMA,
        temperature: 0.5,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ChartContent;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// --- QUIZ & BREVET ---

export async function generateQuiz(level: string, subject: string, topic: string, config: QuizConfig): Promise<QuizContent | null> {
  try {
    const ai = getAI();
    const { questionCount, difficulty } = config;
    
    let difficultyPrompt = "";
    switch(difficulty) {
      case 'intro': difficultyPrompt = "Niveau 'Première approche' : questions simples."; break;
      case 'revision': difficultyPrompt = "Niveau 'Révision' : difficulté moyenne."; break;
      case 'mastery': difficultyPrompt = "Niveau 'Maîtrise complète' : questions complexes."; break;
    }

    const prompt = `Génère un quiz de ${questionCount} questions pour un élève de ${level} en ${subject} sur le thème : "${topic}".
    
    Difficulté : ${difficultyPrompt}
    
    IMPORTANT :
    - Mélange des questions de type "MCQ" (QCM) et "OPEN" (Réponse libre).
    - Pour les questions "OPEN", l'élève devra saisir sa réponse. Ne fournis pas d'options, mais remplis bien 'correctAnswerText' pour que je puisse corriger.
    - Pour les "MCQ", fournis 4 options.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: QUIZ_SCHEMA,
        temperature: 0.5,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizContent;
    }
    return null;

  } catch (error) {
    console.error("Error generating quiz:", error);
    return null;
  }
}

export async function generateBrevetQuiz(): Promise<QuizContent | null> {
  try {
    const ai = getAI();
    const prompt = `Tu es un examinateur officiel du Brevet des Collèges.
    Génère un QUIZ "Brevet Blanc" de 20 questions couvrant les 4 épreuves principales pour un élève de 3ème :
    - 5 questions de Mathématiques (Algèbre, Géométrie, Proba).
    - 5 questions de Français (Grammaire, Compréhension, Réécriture). PAS DE DICTÉE.
    - 5 questions d'Histoire-Géographie-EMC.
    - 5 questions de Sciences (SVT, Physique-Chimie, Techno).
    
    Le niveau doit être celui de l'examen final.
    Mélange questions QCM ("MCQ") et Réponses courtes ("OPEN").
    Pour les questions OPEN, donne une réponse attendue précise.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: QUIZ_SCHEMA,
        temperature: 0.4,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizContent;
    }
    return null;
  } catch (error) {
    console.error("Error generating brevet quiz:", error);
    return null;
  }
}

export async function generateAnnalesQuiz(yearTopic: string): Promise<QuizContent | null> {
  try {
    const ai = getAI();
    const prompt = `ROLE: Tu es une base de données d'archives du Diplôme National du Brevet (DNB).
    
    MISSION: Restituer 5 exercices emblématiques issus du sujet : "${yearTopic}".
    
    CONTRAINTES STRICTES :
    1. Si tu possèdes le sujet EXACT de cette année-là dans tes données d'entraînement, utilise les vraies questions.
    2. Si tu ne connais pas le sujet exact par cœur, génère des exercices "miroirs" fidèles.
    3. EXCLUSION DICTÉE : Si le sujet original comportait une dictée, NE LA GÉNÈRE PAS. Remplace-la par une question de grammaire, de réécriture ou d'analyse d'image supplémentaire.
    
    4. PAS DE QCM ! Utilisez uniquement le type "OPEN", sauf si une question QCM existait réellement.
    5. Inclus tout le contexte nécessaire dans 'question'.
    
    Format attendu: 5 questions complexes (mix Maths, Français, Hist-Géo, Sciences).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: QUIZ_SCHEMA,
        temperature: 0.2, // Température basse pour plus de fidélité historique
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizContent;
    }
    return null;
  } catch (error) {
    console.error("Error generating annales:", error);
    return null;
  }
}

export async function gradeStudentAnswer(question: string, studentAnswer: string, correctAnswerContext: string, level: string): Promise<GradingResult> {
  try {
    const ai = getAI();
    const prompt = `Tu es un professeur de collège (${level}). Tu dois corriger la réponse d'un élève.
    
    Question : "${question}"
    Réponse attendue / Contexte : "${correctAnswerContext}"
    Réponse de l'élève : "${studentAnswer}"
    
    Tâche :
    1. Détermine si la réponse est juste (accepte les fautes d'orthographe légères si le sens est bon).
    2. Attribue 1 point (correct) ou 0 point (incorrect).
    3. Rédige un feedback court et pédagogique s'adressant directement à l'élève (tutoiement).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: GRADING_SCHEMA,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GradingResult;
    }
    return { isCorrect: false, score: 0, feedback: "Erreur de correction." };

  } catch (error) {
    console.error("Error grading answer:", error);
    return { isCorrect: false, score: 0, feedback: "Impossible de joindre le professeur pour la correction." };
  }
}
