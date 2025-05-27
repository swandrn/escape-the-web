# Escape The Web

Mini‐jeu d’escape en JavaScript/React/Vite

---

## Installation et démarrage

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/ton-orga/escape-the-web.git
   cd escape-the-web
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   # puis ouvrir http://localhost:3000 dans votre navigateur
   ```

4. **Tests unitaires**
   ```bash
   npm run test:unit
   # (ne lance que les tests situés dans src/tests/*.test.ts(x))
   ```

5. **Tests E2E Playwright**
   ```bash
   npx playwright test
   ```

6. **Linting**
   ```bash
   npm run lint
   ```

---

## Les énigmes

### 1. Coffre-fort (SafePuzzle)

- **Indice (riddle)**
  > “I start at one and climb, no tricks or sudden dips.\
  > My first four steps are all you need to slip.”

- **Mécanique** : saisir un code à 4 chiffres.
- **Réponse** :
  ```text
  1234
  ```

---

### 2. Mot caché (HiddenWordPuzzle)

- **Indice (riddle)**
  > “I power web UIs with components and hooks;\
  > Five letters name me—now shuffle my books.”

- **Mécanique** : reconstituer le mot en devinant la combinaison des lettres
  - Affichage partiel : `R _ _ _ T`
  - Pool de lettres mélangées : `A C E`

- **Réponse** :
  ```text
  REACT
  ```

---

### 3. Ordre des couleurs (ColorOrderPuzzle)

- **Indice (riddle)**
  > “First the calm before the storm,\
  > Then passion’s fire to keep you warm,\
  > Lastly sunshine crowns the day—\
  > Tap in order, don’t lose your way.”

- **Mécanique**
  1. Huit pastilles de couleur sont affichées (dont 3 bonnes + 5 distracteurs)
  2. Cliquer successivement sur **bleu**, **rouge**, **jaune**
  3. À la 3ᵉ sélection, l’ordre est validé :
     - si exact → puzzle résolu
     - sinon → message d’erreur, réinitialisation de la sélection

- **Réponse** :
  1. **blue**
  2. **red**
  3. **yellow**

---

Vous avez terminé toutes les énigmes !

N’hésitez pas à relancer le serveur ou à recharger la page pour recommencer
l’aventure.
