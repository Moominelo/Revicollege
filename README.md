# RéviCollège 🎓

![Aperçu de l'application](image.png)

**RéviCollège** est une application web éducative complète, ergonomique et moderne, conçue pour aider les collégiens français (de la 6ème à la 3ème) à réviser toutes les matières conformément au programme officiel.

Elle utilise l'intelligence artificielle (Google Gemini) pour générer des fiches de cours sur mesure, des quiz interactifs, des corrections de copies et même des graphiques scientifiques.

## 🚀 Accès à l'application

L'application est déployée et accessible via le lien suivant :

👉 **[https://revicollege.vercel.app/](https://revicollege.vercel.app/)**

### ⚠️ Comment y accéder ?

Cette application nécessite une configuration spécifique (Clé API). Pour y accéder :
1. **Créez un compte** sur [Vercel](https://vercel.com).
2. **Demandez-moi l'accès** afin que je puisse vous autoriser sur le projet.

---

## 🛠️ Fonctionnalités

- **Fiches de révision** : Générées instantanément sur n'importe quel sujet du programme.
- **Quiz interactifs** : QCM et questions ouvertes corrigées par IA.
- **Mode Examen** : Brevet Blanc complet et Annales.
- **Copie Parfaite** : Modèles de réponses structurées avec analyse pédagogique.
- **Outils visuels** : Graphiques SVT et Géométrie dynamique (GeoGebra).
- **Export PDF** : Impression propre type "Fiche Bristol".

## 💻 Installation en local

Si vous préférez installer le projet sur votre ordinateur :

1. Clonez ce dépôt.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` à la racine avec votre clé API :
   ```env
   API_KEY=votre_cle_gemini_ici
   ```
4. Lancez l'application :
   ```bash
   npm run dev
   ```
