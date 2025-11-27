
import React, { useState, useEffect } from 'react';
import { AppState, Level, Subject, SheetContent, QuizContent, QuizConfig, QuizDifficulty, QuestionCount, GradingResult } from './types';
import { LEVELS, getSubjectsForLevel, SUBJECTS_ICONS, CUSTOM_TOPIC_TRIGGER } from './data/curriculum';
import { generateRevisionSheet, generateQuiz, gradeStudentAnswer, getCopyExplanation, getReformulatedCopy, getNewExamSample, getNewChartData, generateBrevetQuiz, generateAnnalesQuiz, askQuickQuestion } from './services/gemini';
import Header from './components/Header';
import Button from './components/Button';
import LoadingSpinner from './components/LoadingSpinner';
import GeoGebraViewer from './components/GeoGebraViewer';
import SVTChartViewer from './components/SVTChartViewer';
import { ArrowRight, Book, GraduationCap, CheckCircle2, AlertCircle, RefreshCcw, Trophy, PenTool, Star, Send, Lightbulb, Baby, BrainCircuit, Wand2, MessageCircle, X, Printer, Volume2, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('HOME');
  
  // Selection State
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState<string>('');
  
  // Content State
  const [sheetContent, setSheetContent] = useState<SheetContent | null>(null);
  
  // -- Perfect Copy Interactive State --
  const [currentExamSample, setCurrentExamSample] = useState<SheetContent['examSample'] | null>(null);
  const [copyVariant, setCopyVariant] = useState<'ORIGINAL' | 'SIMPLE' | 'EXPERT'>('ORIGINAL');
  const [cachedCopies, setCachedCopies] = useState<{SIMPLE?: string, EXPERT?: string}>({});
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isProcessingCopy, setIsProcessingCopy] = useState(false);
  
  // -- SVT Chart State --
  const [currentChartData, setCurrentChartData] = useState<SheetContent['chartContent'] | null | undefined>(null);
  const [isRegeneratingChart, setIsRegeneratingChart] = useState(false);

  // -- Quick Question (Home) State --
  const [quickQuestion, setQuickQuestion] = useState("");
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);
  const [isAskingQuick, setIsAskingQuick] = useState(false);

  // Quiz Content State
  const [quizContent, setQuizContent] = useState<QuizContent | null>(null);
  
  // Quiz Config State
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({ questionCount: 10, difficulty: 'revision' });

  // Quiz Running State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // MCQ State
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  
  // Open Question State
  const [userTextAnswer, setUserTextAnswer] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  
  // Audio State for Dictations
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Initialize Exam Sample when sheet loads
  useEffect(() => {
    if (sheetContent) {
      setCurrentExamSample(sheetContent.examSample);
      setCopyVariant('ORIGINAL');
      setCachedCopies({});
      setExplanation(null);
      setCurrentChartData(sheetContent.chartContent);
    }
  }, [sheetContent]);

  const resetSelection = () => {
    setSelectedLevel(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setCustomTopic('');
    setAppState('SELECTION');
  };

  const handleStart = () => {
    setAppState('SELECTION');
  };

  const getEffectiveTopic = (): string | null => {
    if (!selectedTopic) return null;
    if (selectedTopic === CUSTOM_TOPIC_TRIGGER) {
      return customTopic.trim().length > 0 ? customTopic : null;
    }
    return selectedTopic;
  };

  const handleGenerateSheet = async () => {
    const effectiveTopic = getEffectiveTopic();
    if (!selectedLevel || !selectedSubject || !effectiveTopic) return;
    
    setAppState('LOADING_SHEET');
    const content = await generateRevisionSheet(selectedLevel, selectedSubject, effectiveTopic);
    
    if (content) {
      setSheetContent(content);
      setAppState('SHEET');
    } else {
      alert("Une erreur est survenue lors de la génération. Veuillez réessayer.");
      setAppState('SELECTION');
    }
  };

  const handlePrint = () => {
    const element = document.getElementById('printable-sheet');
    if (!element) return;

    // Use html2pdf library attached to window
    const html2pdf = (window as any).html2pdf;
    
    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin:       10,
        filename:     `Fiche_Revision_${selectedSubject || 'Cours'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: 'avoid-all' }
      };

      html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  };

  // --- HOME QUICK QUESTION ---

  const handleQuickQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    
    setIsAskingQuick(true);
    setQuickAnswer(null);
    const answer = await askQuickQuestion(quickQuestion);
    setQuickAnswer(answer);
    setIsAskingQuick(false);
  };

  // --- PERFECT COPY INTERACTION HANDLERS ---

  const handleExplainCopy = async () => {
    if (!currentExamSample) return;
    if (explanation) {
      setExplanation(null); // Toggle off
      return;
    }
    
    setIsProcessingCopy(true);
    const textToExplain = copyVariant === 'ORIGINAL' ? currentExamSample.perfectCopy : (cachedCopies[copyVariant] || currentExamSample.perfectCopy);
    const result = await getCopyExplanation(currentExamSample.instruction, textToExplain);
    setExplanation(result);
    setIsProcessingCopy(false);
  };

  const handleChangeVariant = async (variant: 'ORIGINAL' | 'SIMPLE' | 'EXPERT') => {
    if (variant === copyVariant) return;
    if (variant === 'ORIGINAL') {
      setCopyVariant(variant);
      return;
    }

    if (cachedCopies[variant]) {
      setCopyVariant(variant);
    } else {
      if (!currentExamSample) return;
      setIsProcessingCopy(true);
      const reformulated = await getReformulatedCopy(currentExamSample.perfectCopy, variant);
      setCachedCopies(prev => ({...prev, [variant]: reformulated}));
      setCopyVariant(variant);
      setIsProcessingCopy(false);
    }
  };

  const handleNewExamSample = async () => {
    const effectiveTopic = getEffectiveTopic();
    if (!selectedLevel || !selectedSubject || !effectiveTopic) return;

    setIsProcessingCopy(true);
    const newSample = await getNewExamSample(selectedLevel, selectedSubject, effectiveTopic);
    if (newSample) {
      setCurrentExamSample(newSample);
      setCopyVariant('ORIGINAL');
      setCachedCopies({});
      setExplanation(null);
    }
    setIsProcessingCopy(false);
  };

  const handleRegenerateChart = async () => {
     const effectiveTopic = getEffectiveTopic();
     if (!selectedLevel || !effectiveTopic) return;
     
     setIsRegeneratingChart(true);
     const newChart = await getNewChartData(selectedLevel, effectiveTopic);
     if (newChart) {
       setCurrentChartData(newChart);
     }
     setIsRegeneratingChart(false);
  };

  // --- QUIZ HANDLERS ---

  const handleSetupQuiz = () => {
    setAppState('QUIZ_SETUP');
  };

  const handleLaunchQuiz = async () => {
    const effectiveTopic = getEffectiveTopic();
    if (!selectedLevel || !selectedSubject || !effectiveTopic) return;
    
    setAppState('LOADING_QUIZ');
    const content = await generateQuiz(selectedLevel, selectedSubject, effectiveTopic, quizConfig);
    
    if (content) {
      setQuizContent(content);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowAnswer(false);
      setSelectedAnswerIndex(null);
      setUserTextAnswer("");
      setGradingResult(null);
      setAppState('QUIZ');
    } else {
      alert("Impossible de générer le quiz. Réessayez.");
      setAppState('SHEET');
    }
  };

  const handleLaunchBrevet = async () => {
    setAppState('LOADING_QUIZ');
    const content = await generateBrevetQuiz();
    if (content) {
       setQuizContent(content);
       setCurrentQuestionIndex(0);
       setScore(0);
       setShowAnswer(false);
       setSelectedAnswerIndex(null);
       setUserTextAnswer("");
       setGradingResult(null);
       setAppState('QUIZ');
    } else {
       alert("Impossible de générer le Brevet Blanc. Réessayez.");
       setAppState('SELECTION');
    }
  };

  const handleLaunchAnnales = async () => {
    const effectiveTopic = getEffectiveTopic();
    if (!effectiveTopic) return;
    
    setAppState('LOADING_QUIZ');
    const content = await generateAnnalesQuiz(effectiveTopic);
    
    if (content) {
      setQuizContent(content);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowAnswer(false);
      setSelectedAnswerIndex(null);
      setUserTextAnswer("");
      setGradingResult(null);
      setAppState('QUIZ');
    } else {
      alert("Impossible de générer le sujet d'annales. Réessayez.");
      setAppState('SELECTION');
    }
  };

  const handleMCQAnswer = (index: number) => {
    if (showAnswer) return;
    
    setSelectedAnswerIndex(index);
    setShowAnswer(true);
    
    if (quizContent && index === quizContent.questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleOpenAnswerSubmit = async () => {
    if (!quizContent || !userTextAnswer.trim() || isGrading) return;
    
    setIsGrading(true);
    const currentQ = quizContent.questions[currentQuestionIndex];
    
    const result = await gradeStudentAnswer(
      currentQ.question, 
      userTextAnswer, 
      currentQ.correctAnswerText || "",
      selectedLevel || '3ème'
    );
    
    setGradingResult(result);
    setScore(prev => prev + result.score);
    setShowAnswer(true);
    setIsGrading(false);
  };

  const handleNextQuestion = () => {
    if (!quizContent) return;
    
    // Stop audio if playing
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);

    if (currentQuestionIndex < quizContent.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswerIndex(null);
      setUserTextAnswer("");
      setGradingResult(null);
    } else {
      setAppState('RESULT');
    }
  };

  const handlePlayAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.8; // Slightly slower for dictation
      
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Désolé, votre navigateur ne supporte pas la synthèse vocale.");
    }
  };

  const handleOpenSourcePDF = () => {
    const topic = quizContent?.topic || getEffectiveTopic();
    if (!topic) return;
    // Remove potential extra spaces or specific chars
    const query = `Sujet Brevet DNB ${topic} officiel pdf`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  const getScoreMessage = () => {
    const percentage = (score / (quizContent?.questions.length || 1)) * 100;
    if (percentage === 100) return "Parfait ! Tu es un expert ! 🏆";
    if (percentage >= 80) return "Excellent travail ! 🌟";
    if (percentage >= 60) return "Bien joué ! Encore un petit effort. 👍";
    return "Continue de réviser, tu vas y arriver ! 💪";
  };

  // --- RENDER HELPERS ---

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 py-8">
      <div className="bg-indigo-100 p-6 rounded-full mb-8 animate-bounce">
        <GraduationCap className="w-16 h-16 text-indigo-600" />
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Révise ton Collège <br />
        <span className="text-indigo-600">simplement & efficacement</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
        Accède à des fiches de révision sur mesure et des quiz interactifs pour toutes les matières de la 6ème à la 3ème. Conforme au programme officiel.
      </p>
      
      <div className="flex flex-col w-full max-w-md gap-4">
        <Button size="lg" onClick={handleStart} className="shadow-xl shadow-indigo-200 w-full">
          Commencer à réviser <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        {/* Quick Question Box */}
        <div className="mt-8 bg-white p-5 rounded-2xl shadow-lg border border-slate-200 text-left relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-indigo-400"></div>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800">Une question rapide sur un cours ?</h3>
          </div>
          
          <form onSubmit={handleQuickQuestionSubmit} className="relative">
            <input 
              type="text" 
              placeholder="Ex: C'est quoi le théorème de Thalès ?" 
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
              value={quickQuestion}
              onChange={(e) => setQuickQuestion(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!quickQuestion.trim() || isAskingQuick}
              className="absolute right-1 top-1 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
              {isAskingQuick ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>

          {/* Quick Answer Display */}
          {quickAnswer && (
             <div className="mt-4 bg-indigo-50 p-4 rounded-xl text-sm text-slate-700 border border-indigo-100 relative animate-in fade-in slide-in-from-top-2">
               <button onClick={() => setQuickAnswer(null)} className="absolute top-2 right-2 text-indigo-300 hover:text-indigo-500">
                 <X className="w-4 h-4" />
               </button>
               <span className="font-bold text-indigo-600 block mb-1">Réponse :</span>
               {quickAnswer}
               <div className="mt-2 text-[10px] text-slate-400 italic">
                 * Je réponds uniquement aux questions scolaires.
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSelection = () => (
    <div className="max-w-3xl mx-auto w-full py-10 px-4">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Configure ta séance</h2>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-8">
        {/* LEVEL SELECTION */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Niveau</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                onClick={() => { setSelectedLevel(lvl); setSelectedSubject(null); setSelectedTopic(null); setCustomTopic(''); }}
                className={`p-3 rounded-xl border-2 transition-all font-bold ${
                  selectedLevel === lvl 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 hover:border-indigo-300 text-slate-600'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* SUBJECT SELECTION */}
        {selectedLevel && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Matière</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getSubjectsForLevel(selectedLevel).map(subj => {
                const isBrevet = subj.name === 'Brevet Blanc';
                const isAnnales = subj.name === 'Annales Brevet';
                const isFullWidth = isBrevet || isAnnales;

                return (
                  <button
                    key={subj.name}
                    onClick={() => { 
                      setSelectedSubject(subj.name); 
                      // Auto-select topic for Brevet to skip step
                      if(isBrevet) setSelectedTopic(subj.topics[0]);
                      else setSelectedTopic(null); 
                      setCustomTopic(''); 
                    }}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      selectedSubject === subj.name
                        ? isBrevet || isAnnales
                          ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                          : 'border-teal-500 bg-teal-50 text-teal-800 ring-1 ring-teal-500'
                        : isBrevet || isAnnales
                          ? 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    } ${isFullWidth ? 'col-span-2 md:col-span-3' : ''}`}
                  >
                    <span className="text-2xl" role="img" aria-label={subj.name}>
                      {SUBJECTS_ICONS[subj.name] || '📚'}
                    </span>
                    <span className="font-medium text-sm">{subj.name}</span>
                    {(isBrevet || isAnnales) && <span className="ml-auto text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded-full">Examen</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TOPIC SELECTION (Hidden for Brevet Blanc, but SHOWN for Annales Brevet) */}
        {selectedLevel && selectedSubject && selectedSubject !== 'Brevet Blanc' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
               {selectedSubject === 'Annales Brevet' ? 'Choisir un sujet' : 'Thème du chapitre'}
            </label>
            <select
              value={selectedTopic || ''}
              onChange={(e) => { setSelectedTopic(e.target.value); if (e.target.value !== CUSTOM_TOPIC_TRIGGER) setCustomTopic(''); }}
              className="w-full p-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-800 font-medium focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">-- Choisir --</option>
              {getSubjectsForLevel(selectedLevel)
                .find(s => s.name === selectedSubject)?.topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
            </select>
          </div>
        )}

        {/* CUSTOM TOPIC INPUT */}
        {selectedTopic === CUSTOM_TOPIC_TRIGGER && (
           <div className="animate-in fade-in slide-in-from-top-2 duration-300">
             <label className="block text-sm font-semibold text-indigo-700 mb-2">Titre du livre ou sujet spécifique</label>
             <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Ex: Le Petit Prince, Les Misérables..."
                className="w-full p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/50 text-indigo-900 font-medium focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all"
                autoFocus
             />
           </div>
        )}

        {/* SUBMIT */}
        <div className="pt-4">
          {selectedSubject === 'Brevet Blanc' ? (
             <Button 
               onClick={handleLaunchBrevet}
               className="w-full justify-center bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200"
               size="lg"
             >
               <Trophy className="mr-2 w-5 h-5"/> Lancer l'Épreuve Blanche
             </Button>
          ) : selectedSubject === 'Annales Brevet' ? (
            <Button 
               disabled={!selectedTopic} 
               onClick={handleLaunchAnnales}
               className="w-full justify-center bg-teal-600 hover:bg-teal-700 text-white shadow-teal-200"
               size="lg"
             >
               <Trophy className="mr-2 w-5 h-5"/> S'entraîner sur ce Sujet
             </Button>
          ) : (
            <Button 
              disabled={!selectedLevel || !selectedSubject || !selectedTopic || (selectedTopic === CUSTOM_TOPIC_TRIGGER && !customTopic.trim())} 
              onClick={handleGenerateSheet}
              className="w-full justify-center"
              size="lg"
            >
              Générer la fiche de révision
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderSheet = () => {
    if (!sheetContent) return null;

    // Use currentExamSample if available (it handles refreshing) or fallback to sheet default
    const displaySample = currentExamSample || sheetContent.examSample;
    
    // Determine text to show based on variant
    let displayText = displaySample.perfectCopy;
    if (copyVariant === 'SIMPLE' && cachedCopies.SIMPLE) displayText = cachedCopies.SIMPLE;
    if (copyVariant === 'EXPERT' && cachedCopies.EXPERT) displayText = cachedCopies.EXPERT;

    return (
      <div id="printable-sheet" className="max-w-4xl mx-auto w-full py-8 px-4 animate-in fade-in slide-in-from-bottom-8 duration-500 sheet-container">
        <div className="flex justify-between items-center mb-6 no-print" data-html2canvas-ignore="true">
          <Button variant="outline" size="sm" onClick={resetSelection}>
            ← Changer de thème
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="w-4 h-4" /> Imprimer / PDF
            </Button>
            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center">
              {selectedLevel} • {selectedSubject}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-2">{sheetContent.title}</h2>
              <div className="flex flex-wrap gap-2 mt-4">
                 {sheetContent.objectives.map((obj, i) => (
                   <span key={i} className="bg-white/20 backdrop-blur-sm text-sm px-3 py-1 rounded-full text-indigo-50 border border-indigo-400/30">
                     🎯 {obj}
                   </span>
                 ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 no-print" data-html2canvas-ignore="true"></div>
          </div>

          <div className="p-8 space-y-10">
            {/* GeoGebra Integration for Maths */}
            {sheetContent.geogebraCommand && (
               <div data-html2canvas-ignore="true">
                  <GeoGebraViewer command={sheetContent.geogebraCommand} />
               </div>
            )}
            
            {/* SVT Chart Integration */}
            {currentChartData && (
              <SVTChartViewer 
                data={currentChartData} 
                onRegenerate={handleRegenerateChart}
                isRegenerating={isRegeneratingChart}
              />
            )}

            {/* Key Points */}
            <section style={{ pageBreakInside: 'avoid' }}>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 no-print" data-html2canvas-ignore="true">
                  ⚡
                </div>
                L'essentiel à retenir
              </h3>
              <ul className="space-y-3">
                {sheetContent.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 bg-yellow-50/50 p-3 rounded-lg border border-yellow-100/50">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </section>

             {/* Detailed Content */}
             <section style={{ pageBreakInside: 'avoid' }}>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 no-print" data-html2canvas-ignore="true">
                  📖
                </div>
                Comprendre le cours
              </h3>
              <div className="prose prose-slate max-w-none text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-line">
                {sheetContent.detailedContent}
              </div>
            </section>

            {/* Examples */}
            <section style={{ pageBreakInside: 'avoid' }}>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 no-print" data-html2canvas-ignore="true">
                  💡
                </div>
                Exemples concrets
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {sheetContent.examples.map((ex, i) => (
                  <div key={i} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-blue-800 italic flex gap-3">
                    <span className="text-2xl opacity-50">“</span>
                    {ex}
                  </div>
                ))}
              </div>
            </section>

            {/* Perfect Copy / Exam Sample - INTERACTIVE */}
            <section style={{ pageBreakInside: 'avoid' }} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 relative">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                 <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                   <PenTool className="w-6 h-6" />
                   Vers la mention Très Bien
                 </h3>
                 <button 
                    onClick={handleNewExamSample} 
                    disabled={isProcessingCopy}
                    className="text-xs font-bold text-indigo-600 bg-white border border-indigo-200 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 no-print"
                    data-html2canvas-ignore="true"
                 >
                   {isProcessingCopy ? <div className="w-3 h-3 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"/> : <RefreshCcw className="w-3 h-3" />}
                   Nouvel exemple
                 </button>
              </div>
              
              <div className="space-y-6">
                {/* Instruction */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2 block">Consigne</span>
                  <p className="font-semibold text-slate-800">{displaySample.instruction}</p>
                </div>

                {/* Interactive Copy Section */}
                <div className="relative border-l-4 border-teal-400 pl-0 sm:pl-6 transition-all">
                   <div className="bg-white sm:bg-teal-50 rounded-r-xl border border-teal-100 overflow-hidden shadow-sm sm:shadow-none">
                    
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-teal-100/50 border-b border-teal-200 no-print" data-html2canvas-ignore="true">
                       <div className="flex items-center gap-1 px-2">
                         <Star className="w-4 h-4 text-teal-600" />
                         <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">Copie Parfaite</span>
                       </div>
                       
                       <div className="flex gap-1">
                          <button 
                            onClick={() => handleChangeVariant('SIMPLE')}
                            disabled={isProcessingCopy}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors flex items-center gap-1 ${copyVariant === 'SIMPLE' ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 hover:bg-teal-50'}`}
                          >
                             <Baby className="w-3 h-3" /> Simplifier
                          </button>
                          <button 
                            onClick={() => handleChangeVariant('ORIGINAL')}
                            disabled={isProcessingCopy}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${copyVariant === 'ORIGINAL' ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 hover:bg-teal-50'}`}
                          >
                             Standard
                          </button>
                          <button 
                            onClick={() => handleChangeVariant('EXPERT')}
                            disabled={isProcessingCopy}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors flex items-center gap-1 ${copyVariant === 'EXPERT' ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 hover:bg-teal-50'}`}
                          >
                             <BrainCircuit className="w-3 h-3" /> Expert
                          </button>
                       </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 bg-teal-50 relative min-h-[150px]">
                      {isProcessingCopy ? (
                         <div className="absolute inset-0 flex items-center justify-center bg-teal-50/80 backdrop-blur-sm z-10" data-html2canvas-ignore="true">
                            <LoadingSpinner message="Rédaction en cours..." />
                         </div>
                      ) : null}
                      
                      <p className="whitespace-pre-line leading-relaxed text-slate-700 font-serif text-lg">
                        {displayText}
                      </p>

                      <div className="mt-6 pt-4 border-t border-teal-200 flex justify-end no-print" data-html2canvas-ignore="true">
                         <button 
                           onClick={handleExplainCopy}
                           disabled={isProcessingCopy}
                           className="text-sm font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors"
                         >
                            <Lightbulb className="w-4 h-4" />
                            {explanation ? "Masquer l'analyse" : "Analyser cette copie"}
                         </button>
                      </div>
                    </div>

                    {/* Explanation Drawer */}
                    {explanation && (
                       <div className="bg-yellow-50 p-5 border-t border-yellow-200 animate-in slide-in-from-top-2">
                          <h4 className="text-sm font-bold text-yellow-800 uppercase mb-2 flex items-center gap-2">
                             <Wand2 className="w-4 h-4" /> Analyse du professeur
                          </h4>
                          <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                             {explanation}
                          </p>
                       </div>
                    )}
                   </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3 text-sm text-orange-800">
                  <div className="font-bold flex-shrink-0">Conseil :</div>
                  <p>{displaySample.tips}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Action Bar */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-4 justify-center items-center no-print" data-html2canvas-ignore="true">
            <p className="text-slate-500 text-sm font-medium">As-tu bien tout compris ?</p>
            <Button onClick={handleSetupQuiz} size="lg" variant="secondary" className="w-full sm:w-auto shadow-teal-200">
              Lancer le Quiz <span className="ml-2">📝</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuizSetup = () => (
    <div className="max-w-xl mx-auto w-full py-12 px-4 animate-in fade-in slide-in-from-bottom-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Paramètre ton Quiz</h2>
        <p className="text-slate-500 mb-8">Choisis la longueur et la difficulté de ton entraînement.</p>

        <div className="space-y-8 text-left">
          {/* Question Count */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Nombre de questions</label>
            <div className="flex gap-4">
              {[5, 10, 20].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuizConfig({ ...quizConfig, questionCount: count as QuestionCount })}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold text-lg transition-all ${
                    quizConfig.questionCount === count
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 hover:border-indigo-200 text-slate-400'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Difficulté</label>
            <div className="space-y-3">
              {[
                { id: 'intro', label: 'Première approche', emoji: '🌱', desc: 'Pour découvrir le sujet en douceur' },
                { id: 'revision', label: 'Révision', emoji: '📚', desc: 'Niveau standard pour un contrôle' },
                { id: 'mastery', label: 'Maîtrise complète', emoji: '🥋', desc: 'Questions pièges et approfondies' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setQuizConfig({ ...quizConfig, difficulty: opt.id as QuizDifficulty })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                    quizConfig.difficulty === opt.id
                      ? 'border-teal-500 bg-teal-50 text-teal-900 ring-1 ring-teal-500'
                      : 'border-slate-200 hover:border-teal-200 text-slate-500'
                  }`}
                >
                  <div className="text-2xl bg-white p-2 rounded-lg shadow-sm">{opt.emoji}</div>
                  <div>
                    <div className="font-bold">{opt.label}</div>
                    <div className="text-xs opacity-70 font-normal">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-3">
            <Button variant="outline" onClick={() => setAppState('SHEET')} className="flex-1">
              Retour
            </Button>
            <Button onClick={handleLaunchQuiz} className="flex-[2] shadow-indigo-200">
              C'est parti ! 🚀
            </Button>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    if (!quizContent) return null;
    const currentQuestion = quizContent.questions[currentQuestionIndex];
    const isMCQ = currentQuestion.type === 'MCQ';
    const isBrevet = selectedSubject === 'Brevet Blanc';
    const isAnnales = selectedSubject === 'Annales Brevet';
    const isDictation = !!currentQuestion.textToRead;

    return (
      <div className="max-w-2xl mx-auto w-full py-10 px-4">
        {/* Header Quiz */}
        <div className="flex justify-between items-end mb-4">
             <div className="flex gap-2">
               <Button variant="outline" size="sm" onClick={() => isBrevet || isAnnales ? setAppState('SELECTION') : setAppState('SHEET')} className="text-xs py-1 px-2 h-auto">
                  Quitter
               </Button>
               {isAnnales && (
                 <Button variant="outline" size="sm" onClick={handleOpenSourcePDF} className="text-xs py-1 px-2 h-auto text-teal-700 border-teal-200 bg-teal-50 hover:bg-teal-100 flex items-center gap-1">
                   <FileText className="w-3 h-3" /> Voir PDF original
                 </Button>
               )}
             </div>
             <div className="text-right">
               <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">
                 {isBrevet || isAnnales ? 'BREVET BLANC' : quizContent.difficulty.toUpperCase()}
               </div>
               <div className="text-slate-900 font-bold">Score: {score}</div>
             </div>
        </div>

        {/* Progress */}
        <div className="mb-2 flex items-center justify-between text-slate-400 font-semibold text-xs">
          <span>Question {currentQuestionIndex + 1} / {quizContent.questions.length}</span>
        </div>
        
        <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentQuestionIndex + 1) / quizContent.questions.length) * 100}%` }}
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <div className="flex justify-between items-start gap-4 mb-6">
             <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
               {currentQuestion.question}
             </h2>
             <span className="shrink-0 text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                {isDictation ? 'DICTÉE' : (isMCQ ? 'QCM' : 'RÉDACTION')}
             </span>
          </div>

          {/* Special Dictation Audio Button */}
          {isDictation && currentQuestion.textToRead && (
            <div className="mb-6 flex flex-col items-center">
               <button
                 onClick={() => handlePlayAudio(currentQuestion.textToRead!)}
                 disabled={isPlayingAudio}
                 className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${isPlayingAudio ? 'bg-indigo-400 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'}`}
               >
                 <Volume2 className="w-8 h-8 text-white" />
               </button>
               <span className="mt-3 text-sm font-medium text-slate-600">
                 {isPlayingAudio ? "Lecture en cours..." : "Écouter la dictée"}
               </span>
            </div>
          )}

          {/* MCQ Logic */}
          {isMCQ && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswerIndex === idx;
                const isCorrect = idx === currentQuestion.correctAnswerIndex;
                
                let styleClass = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                
                if (showAnswer) {
                  if (isCorrect) styleClass = "bg-green-100 border-green-500 text-green-800";
                  else if (isSelected) styleClass = "bg-red-50 border-red-300 text-red-700";
                  else styleClass = "opacity-50 border-slate-200";
                } else if (isSelected) {
                   styleClass = "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleMCQAnswer(idx)}
                    disabled={showAnswer}
                    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 flex items-center justify-between ${styleClass}`}
                  >
                    <span>{option}</span>
                    {showAnswer && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {showAnswer && isSelected && !isCorrect && <AlertCircle className="w-5 h-5 text-red-500" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Open Question Logic (Used for Dictation too) */}
          {!isMCQ && (
            <div className="space-y-4">
              <textarea
                value={userTextAnswer}
                onChange={(e) => setUserTextAnswer(e.target.value)}
                disabled={showAnswer || isGrading}
                placeholder={isDictation ? "Écris le texte que tu entends ici..." : "Écris ta réponse ici..."}
                className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 outline-none h-32 resize-none disabled:bg-slate-50"
              />
              {!showAnswer && (
                <Button 
                  onClick={handleOpenAnswerSubmit} 
                  disabled={!userTextAnswer.trim() || isGrading}
                  className="w-full"
                >
                  {isGrading ? (
                    <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Correction par le prof...</span>
                  ) : (
                    <span className="flex items-center gap-2">Valider ma réponse <Send className="w-4 h-4" /></span>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Grading Result / Explanation */}
          {showAnswer && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Grading for OPEN question */}
              {!isMCQ && gradingResult && (
                 <div className={`p-4 rounded-xl mb-6 border ${gradingResult.isCorrect ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                       {gradingResult.isCorrect ? <CheckCircle2 className="text-green-600 w-5 h-5"/> : <AlertCircle className="text-orange-500 w-5 h-5"/>}
                       <span className={`font-bold ${gradingResult.isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                         {gradingResult.isCorrect ? 'Correct (+1 pt)' : 'À revoir (0 pt)'}
                       </span>
                    </div>
                    <p className="text-slate-700 italic border-l-2 pl-3 border-black/10">
                      "{gradingResult.feedback}"
                    </p>
                    <div className="mt-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">Réponse attendue :</div>
                    <p className="text-sm text-slate-700 mt-1">{currentQuestion.correctAnswerText}</p>
                 </div>
              )}

              {/* Standard explanation for MCQ */}
              {isMCQ && (
                 <div className={`p-4 rounded-xl mb-6 ${
                  selectedAnswerIndex === currentQuestion.correctAnswerIndex 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-indigo-50 border border-indigo-200'
                }`}>
                  <p className="font-bold text-slate-800 mb-1">
                    {selectedAnswerIndex === currentQuestion.correctAnswerIndex ? 'Bien joué !' : 'Explication :'}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
              
              <Button onClick={handleNextQuestion} className="w-full">
                {currentQuestionIndex < quizContent.questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResult = () => {
    if (!quizContent) return null;
    const percentage = Math.round((score / quizContent.questions.length) * 100);
    const isBrevet = selectedSubject === 'Brevet Blanc';
    const isAnnales = selectedSubject === 'Annales Brevet';

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-in zoom-in duration-300">
        <div className="bg-yellow-100 p-6 rounded-full mb-6 relative">
          <Trophy className="w-16 h-16 text-yellow-600" />
          {percentage === 100 && (
            <div className="absolute top-0 right-0 text-3xl animate-bounce">⭐</div>
          )}
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2">{isBrevet || isAnnales ? 'Épreuve terminée !' : 'Quiz terminé !'}</h2>
        <p className="text-2xl font-semibold text-indigo-600 mb-6">{score} / {quizContent.questions.length}</p>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 max-w-md w-full mb-8">
          <p className="text-lg text-slate-700 font-medium">
            {getScoreMessage()}
          </p>
          <div className="w-full bg-slate-100 h-4 rounded-full mt-4 overflow-hidden relative">
             <div 
              className={`h-full absolute top-0 left-0 transition-all duration-1000 ${percentage >= 50 ? 'bg-green-500' : 'bg-orange-500'}`} 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          {!isBrevet && !isAnnales && (
            <Button onClick={() => setAppState('SHEET')} variant="outline" className="flex-1">
              <Book className="w-4 h-4 mr-2" /> Relire la fiche
            </Button>
          )}
          {isBrevet ? (
            <Button onClick={handleLaunchBrevet} variant="secondary" className="flex-1">
              <RefreshCcw className="w-4 h-4 mr-2" /> Refaire un Brevet Blanc
            </Button>
          ) : isAnnales ? (
            <Button onClick={handleLaunchAnnales} variant="secondary" className="flex-1">
              <RefreshCcw className="w-4 h-4 mr-2" /> Refaire ce sujet
            </Button>
          ) : (
            <Button onClick={handleSetupQuiz} variant="secondary" className="flex-1">
              <RefreshCcw className="w-4 h-4 mr-2" /> Refaire un quiz
            </Button>
          )}
        </div>
        <button onClick={resetSelection} className="mt-6 text-slate-400 hover:text-slate-600 text-sm font-semibold underline">
            Choisir un autre thème
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <Header onHomeClick={() => setAppState('HOME')} />
      <main className="container mx-auto">
        {appState === 'HOME' && renderHome()}
        {appState === 'SELECTION' && renderSelection()}
        {appState === 'LOADING_SHEET' && <LoadingSpinner message="L'IA rédige ta fiche de révision..." />}
        {appState === 'SHEET' && renderSheet()}
        {appState === 'QUIZ_SETUP' && renderQuizSetup()}
        {(appState === 'LOADING_QUIZ' && selectedSubject === 'Brevet Blanc') && <LoadingSpinner message="L'examinateur prépare le sujet complet..." />}
        {(appState === 'LOADING_QUIZ' && selectedSubject === 'Annales Brevet') && <LoadingSpinner message="L'IA récupère les archives du Brevet..." />}
        {(appState === 'LOADING_QUIZ' && selectedSubject !== 'Brevet Blanc' && selectedSubject !== 'Annales Brevet') && <LoadingSpinner message="L'IA prépare tes questions sur mesure..." />}
        {appState === 'QUIZ' && renderQuiz()}
        {appState === 'RESULT' && renderResult()}
      </main>
    </div>
  );
};

export default App;
