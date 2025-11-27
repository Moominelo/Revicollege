
import { Curriculum, Level } from '../types';

export const LEVELS: Level[] = ['6ème', '5ème', '4ème', '3ème'];

export const SUBJECTS_ICONS: Record<string, string> = {
  'Mathématiques': '📐',
  'Français': '📚',
  'Histoire-Géographie': '🌍',
  'SVT': '🧬',
  'Physique-Chimie': '🧪',
  'Technologie': '🔧',
  'Anglais': '🇬🇧',
  'Espagnol': '🇪🇸',
  'Allemand': '🇩🇪',
  'Italien': '🇮🇹',
  'EMC': '🤝',
  'Arts Plastiques': '🎨',
  'Éducation Musicale': '🎵',
  'Brevet Blanc': '📜',
  'Annales Brevet': '🏛️'
};

export const CUSTOM_TOPIC_TRIGGER = "Autre œuvre / Livre spécifique (Saisir le titre)";

export const CURRICULUM_DATA: Curriculum[] = [
  {
    level: '6ème',
    subjects: [
      {
        name: 'Mathématiques',
        topics: [
          'Nombres entiers : écriture et comparaison',
          'Nombres décimaux : repérage et opérations',
          'Addition, soustraction et multiplication',
          'Division euclidienne',
          'Fractions : partage et quotient',
          'Proportionnalité : premières notions',
          'Pourcentages : appliquer un taux',
          'Organisation et gestion de données',
          'Droites, demi-droites et segments',
          'Droites parallèles et perpendiculaires',
          'Le cercle : vocabulaire et construction',
          'Les angles : nommer, mesurer, tracer',
          'Figures usuelles (triangles, quadrilatères)',
          'Symétrie axiale : construction et propriétés',
          'Périmètres et longueurs',
          'Aires : rectangle, carré, triangle rectangle',
          'Volumes : pavé droit',
          'Espace : patrons et perspectives'
        ]
      },
      {
        name: 'Français',
        topics: [
          'Le monstre, aux limites de l’humain (Contes et légendes)',
          'Récits d’aventures (Robinson Crusoé, L’Odyssée)',
          'Récits de création (Bible, Métamorphoses d’Ovide)',
          'La ruse et le mensonge (Fables, Renart)',
          'Grammaire : Classes grammaticales',
          'Grammaire : Fonctions (Sujet, COD, Attribut)',
          'Conjugaison : Présent de l’indicatif',
          'Conjugaison : Imparfait et Passé Simple',
          'Conjugaison : Passé composé',
          'Orthographe : Accords dans le groupe nominal',
          'Orthographe : Accord verbe-sujet',
          'Lexique : Formation des mots (préfixes, suffixes)',
          CUSTOM_TOPIC_TRIGGER
        ]
      },
      {
        name: 'Histoire-Géographie',
        topics: [
          'Les débuts de l’humanité (Paléolithique/Néolithique)',
          'Premiers États, premières écritures (Orient ancien)',
          'Le monde des cités grecques',
          'Rome : du mythe à l’histoire',
          'La naissance du monothéisme juif',
          'L’Empire romain dans le monde antique',
          'Habiter une métropole (Mégapoles)',
          'Habiter un espace à fortes contraintes',
          'Habiter les littoraux',
          'Le monde habité (Répartition de la population)'
        ]
      },
      {
        name: 'SVT',
        topics: [
          'Développement et reproduction des êtres vivants',
          'Cycle de vie et milieu de vie',
          'La matière organique et sa transformation',
          'Besoins alimentaires de l’homme',
          'Classification des êtres vivants (liens de parenté)',
          'La planète Terre : paysages et activité géologique',
          'La cellule : unité du vivant'
        ]
      },
      {
        name: 'Physique-Chimie',
        topics: [
          'États et constitution de la matière',
          'Mélanges et séparation (décantation, filtration)',
          'Mouvement : trajectoire et vitesse',
          'Énergie : formes et conversions',
          'Signal et information'
        ]
      },
      {
        name: 'Technologie',
        topics: [
          'Besoin et fonction d’usage',
          'Fonction technique et solutions techniques',
          'Les familles de matériaux',
          'Énergies : sources et chaine d\'énergie',
          'Algorithmique : déplacements et boucles',
          'L’ordinateur et les périphériques'
        ]
      },
      {
        name: 'Anglais',
        topics: [
          'Se présenter (Be, Have got)',
          'La famille (Génitif)',
          'La maison et les pièces',
          'Les habitudes (Présent simple)',
          'L’heure et la date',
          'Les pays anglophones',
          'Exprimer ses goûts (Like/Hate)'
        ]
      },
      {
        name: 'Allemand',
        topics: [
          'Se présenter (Wie heißt du?)',
          'Compter et l\'âge',
          'La famille',
          'Les couleurs et les jours',
          'L\'école en Allemagne'
        ]
      },
      {
        name: 'EMC',
        topics: [
          'Le collégien et la communauté éducative',
          'La laïcité à l\'école',
          'Les droits et devoirs de l\'enfant',
          'L\'égalité filles-garçons'
        ]
      },
      {
        name: 'Arts Plastiques',
        topics: [
          'La représentation du monde',
          'La ressemblance',
          'Les couleurs et leurs mélanges',
          'La matérialité (outils et supports)'
        ]
      },
      {
        name: 'Éducation Musicale',
        topics: [
          'La voix et le souffle',
          'Le rythme et la pulsation',
          'Timbre et hauteur',
          'Écoute comparée'
        ]
      }
    ]
  },
  {
    level: '5ème',
    subjects: [
      {
        name: 'Mathématiques',
        topics: [
          'Priorités opératoires',
          'Nombres relatifs : repérage et comparaison',
          'Nombres relatifs : addition et soustraction',
          'Fractions : égalité et simplification',
          'Fractions : addition et soustraction (m.d)',
          'Calcul littéral : simplifier une expression',
          'Calcul littéral : distributivité simple',
          'Proportionnalité : échelles, vitesse, pourcentages',
          'Statistiques : moyenne et fréquence',
          'Symétrie centrale',
          'Angles et parallélisme (alternes-internes)',
          'Triangles : inégalité triangulaire et construction',
          'Somme des angles d\'un triangle',
          'Parallélogrammes : propriétés et construction',
          'Aires et périmètres (figures usuelles)',
          'Prismes et cylindres : volumes'
        ]
      },
      {
        name: 'Français',
        topics: [
          'Le voyage et l’aventure (Marco Polo, Vendredi)',
          'Vivre en société, participer à la société (Molière)',
          'Regarder le monde, inventer des mondes (SF/Fantasy)',
          'Agir sur le monde : Héros et héroïsmes (Chevalerie)',
          'L’homme est-il maître de la nature ?',
          'Grammaire : Expansion du nom (adj, compl, relative)',
          'Conjugaison : Temps composés de l\'indicatif',
          'Conjugaison : Le conditionnel',
          'Analyse de phrase : Juxtaposition, coordination',
          CUSTOM_TOPIC_TRIGGER
        ]
      },
      {
        name: 'Histoire-Géographie',
        topics: [
          'L’Empire byzantin et l’Europe carolingienne',
          'L’Islam : pouvoirs, sociétés et cultures',
          'La féodalité et l’Église au Moyen Âge',
          'Formation de l’État monarchique en France',
          'Le monde au temps de Charles Quint et Soliman',
          'Humanisme, Renaissance et réformes religieuses',
          'La croissance démographique et ses effets',
          'Richesse et pauvreté dans le monde',
          'L’alimentation : nourrir les hommes',
          'L’eau et l’énergie : gestion des ressources',
          'Le changement global'
        ]
      },
      {
        name: 'Physique-Chimie',
        topics: [
          'L’eau dans tous ses états',
          'Mélanges aqueux et corps purs',
          'Solubilité et miscibilité',
          'Masse et volume (Masse volumique)',
          'Les changements d’état',
          'Circuit électrique en série',
          'Circuit électrique en dérivation',
          'Sens du courant et symboles normalisés',
          'Conducteurs et isolants',
          'Sources et propagation de la lumière',
          'Le système Soleil-Terre-Lune'
        ]
      },
      {
        name: 'SVT',
        topics: [
          'La respiration chez les êtres vivants',
          'La répartition des êtres vivants',
          'Le fonctionnement de l’organisme à l’effort',
          'La digestion et l’apport des nutriments',
          'L’élimination des déchets par l’organisme',
          'La circulation sanguine',
          'Géologie : phénomènes externes (érosion)'
        ]
      },
      {
        name: 'Technologie',
        topics: [
          'Design et innovation',
          'Modélisation 3D (SketchUp/Tinkercad)',
          'Les réseaux informatiques (Architecture)',
          'Programmation : Capteurs et actionneurs',
          'Habitat et ouvrages (Structure, Ponts)'
        ]
      },
      {
        name: 'Anglais',
        topics: [
          'Daily routine (Adverbes de fréquence)',
          'Capacités et talents (Can/Can\'t)',
          'Description physique détaillée',
          'Prétérit simple (Verbes réguliers/irréguliers)',
          'Comparatifs et superlatifs',
          'Nourriture et recettes',
          'Légendes arthuriennes'
        ]
      },
      {
        name: 'Espagnol',
        topics: [
          'Saluer et se présenter (Ser/Llamarse)',
          'La salle de classe et le matériel',
          'La famille et les animaux',
          'Description physique (Tener/Llevar)',
          'Les goûts (Gustar)',
          'Les nombres et l\'heure'
        ]
      },
      {
        name: 'Allemand',
        topics: [
          'Se présenter et présenter quelqu\'un',
          'Les verbes forts au présent',
          'Les animaux domestiques',
          'Les loisirs et le sport',
          'La nourriture (Petit-déjeuner)',
          'L\'accusatif'
        ]
      },
      {
        name: 'Italien',
        topics: [
          'Salutations et présentation',
          'Le présent de l\'indicatif',
          'Articles définis et indéfinis',
          'La famille',
          'La description physique',
          'Les nombres'
        ]
      },
      {
        name: 'EMC',
        topics: [
          'L’égalité et la lutte contre les discriminations',
          'La sécurité et les risques majeurs',
          'La solidarité (Associations)'
        ]
      },
      {
        name: 'Arts Plastiques',
        topics: [
          'L\'image et la fiction',
          'La construction et la fabrication',
          'L\'architecture et l\'espace'
        ]
      },
      {
        name: 'Éducation Musicale',
        topics: [
          'Musique et images',
          'Le rôle de la musique dans la société',
          'Formes et structures musicales'
        ]
      }
    ]
  },
  {
    level: '4ème',
    subjects: [
      {
        name: 'Mathématiques',
        topics: [
          'Nombres relatifs : multiplication et division',
          'Fractions : multiplication et division',
          'Puissances de 10 et notation scientifique',
          'Puissances d\'un nombre relatif',
          'Calcul littéral : double distributivité',
          'Calcul littéral : factorisation simple',
          'Équations du premier degré',
          'Théorème de Pythagore (Calculs)',
          'Réciproque de Pythagore',
          'Translation et rotation',
          'Cône et pyramide : patrons et volumes',
          'Vitesse moyenne, distance, temps',
          'Probabilités : premières notions',
          'Cos, Sin, Tan (Introduction Triangle Rectangle)'
        ]
      },
      {
        name: 'Français',
        topics: [
          'Dire l’amour (Poésie lyrique, Cyrano)',
          'Individu et pouvoir : presse, médias, information',
          'La fiction pour interroger le réel (Maupassant, Balzac)',
          'Informer, s’informer, déformer (Fake news)',
          'La ville, lieu de tous les possibles ?',
          'Grammaire : La phrase complexe (Subordonnées)',
          'Conjugaison : Subjonctif présent',
          'Conjugaison : Voix active / Voix passive',
          'Figures de style (Comparaison, métaphore, hyperbole)',
          CUSTOM_TOPIC_TRIGGER
        ]
      },
      {
        name: 'Histoire-Géographie',
        topics: [
          'L’Europe des Lumières',
          'La Révolution française et l’Empire',
          'L’Europe et la Révolution industrielle',
          'Conquêtes et sociétés coloniales',
          'L’urbanisation du monde',
          'Les mobilités humaines transnationales',
          'Les espaces de faible densité (Tourisme, Agriculture)',
          'La mondialisation (Firme transnationale)'
        ]
      },
      {
        name: 'Physique-Chimie',
        topics: [
          'La constitution de la matière (Atomes/Molécules)',
          'Combustions et transformations chimiques',
          'Loi de conservation de la masse (Lavoisier)',
          'La tension électrique et la loi des mailles',
          'L\'intensité électrique et la loi des nœuds',
          'La résistance et la Loi d\'Ohm',
          'La vitesse de la lumière',
          'La propagation du son'
        ]
      },
      {
        name: 'SVT',
        topics: [
          'La reproduction sexuée des êtres vivants',
          'La reproduction humaine et la contraception',
          'Le système nerveux et la commande du mouvement',
          'Les perturbations du système nerveux',
          'La dynamique interne de la Terre (Séismes/Volcans)',
          'La tectonique des plaques'
        ]
      },
      {
        name: 'Technologie',
        topics: [
          'Les objets connectés (IoT)',
          'Algorithmique : Variables et listes',
          'Chaine d\'information et chaine d\'énergie',
          'Invention, innovation et découverte'
        ]
      },
      {
        name: 'Anglais',
        topics: [
          'Biographies (Ago, For, Since)',
          'Raconter au passé (Prétérit vs Be-ing)',
          'Anticipation et futur (Will/Be going to)',
          'Le monde du travail',
          'New York et les USA',
          'Le Harcèlement scolaire (Bullying)',
          'Detective stories'
        ]
      },
      {
        name: 'Espagnol',
        topics: [
          'La vie quotidienne (Horaires, Routine)',
          'Raconter ses vacances (Passé Composé)',
          'L\'imparfait et la description passée',
          'L\'obligation (Tener que / Hay que)',
          'La ville et les directions',
          'La nourriture et le restaurant'
        ]
      },
      {
        name: 'Allemand',
        topics: [
          'Le parfait (Passé composé)',
          'Les verbes de modalité',
          'La ville et l\'orientation',
          'Les fêtes et traditions',
          'La mode et les vêtements'
        ]
      },
      {
        name: 'Italien',
        topics: [
          'La vie quotidienne',
          'Les prépositions articulées',
          'Le passé composé (Passato prossimo)',
          'La ville et les transports',
          'L\'alimentation'
        ]
      },
      {
        name: 'EMC',
        topics: [
          'Les libertés individuelles et collectives',
          'La justice et le droit en France',
          'L’engagement citoyen'
        ]
      },
      {
        name: 'Arts Plastiques',
        topics: [
          'L\'œuvre, l\'espace, l\'auteur, le spectateur',
          'La mise en scène',
          'L\'art engagé'
        ]
      },
      {
        name: 'Éducation Musicale',
        topics: [
          'Musique et arts du spectacle',
          'Le métissage musical',
          'Musique et engagement'
        ]
      }
    ]
  },
  {
    level: '3ème',
    subjects: [
      {
        name: 'Annales Brevet',
        topics: [
            'Sujet Métropole 2024 (Juin)',
            'Sujet Métropole 2023 (Juin)',
            'Sujet Amérique du Nord 2023 (Juin)',
            'Sujet Métropole 2022 (Juin)',
            'Sujet Centres Étrangers 2022 (Juin)',
            'Sujet Métropole 2021 (Juin)',
            'Sujet Métropole 2019 (Juin)'
        ]
      },
      {
        name: 'Brevet Blanc',
        topics: ['Épreuve Complète (Maths, Français, Histoire-Géo, Sciences)']
      },
      {
        name: 'Mathématiques',
        topics: [
          'Arithmétique : Diviseurs et nombres premiers',
          'Théorème de Thalès et réciproque',
          'Trigonométrie (Cos, Sin, Tan, Angles)',
          'Calcul littéral : Identités remarquables',
          'Équations produit-nul',
          'Inéquations',
          'Notion de fonction (Image, Antécédent)',
          'Fonctions linéaires et affines',
          'Homothéties',
          'Solides : Sections de plans',
          'Sphères et boules (Aire et Volume)',
          'Probabilités (Expérience à 2 épreuves)',
          'Statistiques (Médiane, Étendue)',
          'Algorithmique et Programmation'
        ]
      },
      {
        name: 'Français',
        topics: [
          'Se raconter, se représenter (Autobiographie)',
          'Dénoncer les travers de la société (Satire/Caricature)',
          'Visions poétiques du monde (Engagée/Lyrique)',
          'Agir dans la cité : individu et pouvoir (Antigone)',
          'Progrès et rêves scientifiques',
          'Révisions Brevet : Grammaire et Réécriture',
          'Grammaire : Valeurs des temps',
          'Grammaire : Analyse logique complète',
          'Vocabulaire : Mélioratif / Péjoratif',
          CUSTOM_TOPIC_TRIGGER
        ]
      },
      {
        name: 'Histoire-Géographie',
        topics: [
          'Civils et militaires dans la Première Guerre mondiale',
          'Démocraties et régimes totalitaires (Entre-deux-guerres)',
          'La Seconde Guerre mondiale (Génocide, Résistance)',
          'La France défaite et occupée (Vichy / De Gaulle)',
          'Le monde bipolaire (Guerre Froide)',
          'Indépendances et construction de nouveaux États',
          'La construction européenne',
          'La Vème République (De 1958 à nos jours)',
          'Les aires urbaines en France',
          'Les espaces productifs français',
          'Les espaces de faible densité',
          'La France et l’Union européenne'
        ]
      },
      {
        name: 'Physique-Chimie',
        topics: [
          'Les ions et le pH (Acide/Basique)',
          'Réaction entre acide et métal',
          'Structure de l’atome (Noyau/Électrons)',
          'Forces et interactions (Gravitation)',
          'Poids et masse',
          'Énergie cinétique et potentielle',
          'Énergie mécanique et sécurité routière',
          'Puissance et énergie électrique'
        ]
      },
      {
        name: 'SVT',
        topics: [
          'La génétique : Chromosomes et ADN',
          'Diversité et stabilité génétique des êtres vivants',
          'L’évolution des espèces et biodiversité',
          'Le système immunitaire (Défenses de l’organisme)',
          'Vaccination et antibiotiques',
          'Responsabilité humaine : Santé et environnement'
        ]
      },
      {
        name: 'Technologie',
        topics: [
          'Cycle de vie d\'un produit',
          'Design et créativité',
          'Systèmes automatisés et embarqués',
          'Transmission de signal (Réseaux)',
          'Projet collectif (Mini-entreprise)'
        ]
      },
      {
        name: 'Anglais',
        topics: [
          'Environment and Ecology',
          'Dystopian Worlds (Black Mirror, 1984)',
          'Civil Rights Movement (USA)',
          'Australia and Aborigines',
          'Art and Street Art (Banksy)',
          'War and Remembrance',
          'Social Media and Fake News'
        ]
      },
      {
        name: 'Espagnol',
        topics: [
          'Voyages et découvertes (Amérique Latine)',
          'Mythes et légendes',
          'L’art engagé (Guernica, Frida Kahlo)',
          'La guerre civile espagnole',
          'L’environnement et l’écologie',
          'Projets d\'avenir'
        ]
      },
      {
        name: 'Allemand',
        topics: [
          'Berlin, capitale historique',
          'La Seconde Guerre mondiale et le Mur',
          'L\'écologie et l\'environnement',
          'Les métiers et l\'avenir',
          'L\'Autriche et la Suisse'
        ]
      },
      {
        name: 'Italien',
        topics: [
          'Le système scolaire italien',
          'Le patrimoine culturel et artistique',
          'Le "Made in Italy" (Mode, Design)',
          'L\'environnement',
          'L\'imparfait et le futur'
        ]
      },
      {
        name: 'EMC',
        topics: [
          'La citoyenneté française et européenne',
          'La vie démocratique (Vote, Partis)',
          'La Défense et la paix'
        ]
      },
      {
        name: 'Arts Plastiques',
        topics: [
          'L\'œuvre et le corps',
          'L\'œuvre et l\'architecture',
          'Le numérique dans l\'art'
        ]
      },
      {
        name: 'Éducation Musicale',
        topics: [
          'Musique et mémoire',
          'L\'interprétation et l\'arrangement',
          'Création musicale numérique'
        ]
      }
    ]
  }
];

export const getSubjectsForLevel = (level: Level) => {
  return CURRICULUM_DATA.find(c => c.level === level)?.subjects || [];
};
