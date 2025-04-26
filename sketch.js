// Variable pour savoir quel écran afficher
// 1: Menu (avec carte et bouton vers Labo)
// 2: Labo (avec éléments à glisser, cible, boutons Vider/Tester/Retour)
// 3: Écran de Test (affiche les résultats - à développer)
let currentScreen = 1;

// Variable tour par tour (si utilisée)
// let nbrTurn; // Décommenter si nécessaire

// Diamètres des cercles
const ELEMENT_CIRCLE_DIAMETER = 100;
const TARGET_CIRCLE_DIAMETER = 150;
const LABO_CIRCLE_DIAMETER = 100; // Pour le "bouton" dessiné allant au labo
const MAP_CIRCLE_BASE_DIAMETER = 120;

// Position du "bouton" dessiné pour aller au Labo (calculée dans menuScreen)
let laboCircleX, laboCircleY;

// Tableau pour stocker les infos des cercles éléments (gauche - écran 2 Labo)
let elementCircles = [];

// Images (à décommenter et charger si nécessaire dans preload)
/*
let purpleSeaweed0, purpleSeaweed10, purpleSeaweed20, purpleSeaweed30, purpleSeaweed40, purpleSeaweed50, purpleSeaweed60, purpleSeaweed70, purpleSeaweed80, purpleSeaweed90, purpleSeaweed100;
let redSeaweed0, redSeaweed10, redSeaweed20, redSeaweed30, redSeaweed40, redSeaweed50, redSeaweed60, redSeaweed70, redSeaweed80, redSeaweed90, redSeaweed100;
let greenSeaweed0, greenSeaweed10, greenSeaweed20, greenSeaweed30, greenSeaweed40, greenSeaweed50, greenSeaweed60, greenSeaweed70, greenSeaweed80, greenSeaweed90, greenSeaweed100;
*/

// Variables pour le cercle cible (droite - écran 2 Labo)
let targetCirclePos;
let targetStoredColors = []; // Stocke les objets color p5.js déposés (max 2)
let targetStoredNames = []; // Stocke les noms correspondants
let currentTargetColor; // La couleur affichée (mélange)

// Variables pour gérer le glisser-déposer (écran 2 uniquement)
let draggedCircleIndex = -1;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Variables pour les cercles de la carte (affichée sur l'écran 1)
let mapCircles = [];

//////  Boutons p5.dom //////
let passTurnButton; // Écran 1 (Menu/Map)
let resetButton;    // Écran 2 (Labo)
let testButton;     // Écran 2 (Labo)
let backButton;     // Écran 2 (Labo) & 3 (Test)

// Variable pour stocker les données à tester sur l'écran 3
let testData = null; // Sera { colors: [...], names: [...] }

// Constantes pour les labels des éléments
const LABEL_TEXT_SIZE = 16;
const LABEL_PADDING = 8;

// -----------------------------------------------------------------------------
// --- PRELOAD (si besoin pour les images) ---
// -----------------------------------------------------------------------------
/*
function preload() {
  // Décommentez et chargez vos images ici
  // purpleSeaweed10 = loadImage("/Algue_Violette/algue_rouge_1.png");
  // ... etc ...
}
*/

// -----------------------------------------------------------------------------
// --- SETUP ---
// -----------------------------------------------------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(LABEL_TEXT_SIZE);
  rectMode(CENTER); // Utile pour les labels

  // Définir les propriétés des 3 cercles de la carte (écran 1)
  mapCircles = [
    { name: "Zone Verte", color: color(0, 150, 0), pos: createVector(0, 0), currentDiameter: MAP_CIRCLE_BASE_DIAMETER, growthSpeed: 6 }, // Vert
    { name: "Zone Rouge", color: color(200, 0, 0), pos: createVector(0, 0), currentDiameter: MAP_CIRCLE_BASE_DIAMETER, growthSpeed: 9 }, // Rouge
    { name: "Zone Bleue", color: color(0, 0, 200), pos: createVector(0, 0), currentDiameter: MAP_CIRCLE_BASE_DIAMETER, growthSpeed: 13 }  // Bleu
  ];

  // Définir les propriétés des 4 cercles éléments (écran 2 Labo)
  elementCircles = [
    { name: "Zinc", color: color(128, 0, 128), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }, // Pourpre
    { name: "Cuivre", color: color(184, 115, 51), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }, // #B87333
    { name: "Azote", color: color(0, 128, 128), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }, // #008080
    { name: "Soufre", color: color(176, 196, 222), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }  // #B0C4DE
  ];

  // IMPORTANT: Calculer les positions initiales AVANT de créer/styler les boutons
  initializePositions(); // Calcule targetCirclePos, positions des éléments, positions de la carte

  // --- CRÉATION DES BOUTONS p5.dom ---
  passTurnButton = createButton('Passer le tour');
  resetButton = createButton('Vider');
  testButton = createButton('Faire tester');
  backButton = createButton('Retour'); // Retour du Labo au Menu, ou du Test au Labo

  // --- ASSOCIER LES FONCTIONS AUX CLICS ---
  passTurnButton.mousePressed(updateSeaweedGrowth); // Correction typo: update et pas udpdate
  resetButton.mousePressed(resetTargetColor);
  testButton.mousePressed(goToTestResultsScreen); // Fonction pour aller à l'écran 3
  backButton.mousePressed(handleBackButton); // Fonction unique pour gérer le retour

  // --- POSITIONNER ET STYLER LES BOUTONS ---
  styleActionButtons();

  // --- DÉFINIR LA VISIBILITÉ INITIALE DES BOUTONS ---
  updateButtonVisibility(); // Fonction qui gère show()/hide() selon currentScreen

  // Calculer la couleur initiale de la cible (écran 2 Labo)
  updateTargetColor(); // Initialise à blanc

  console.log("Setup terminé. Écran actuel :", currentScreen);
}

// -----------------------------------------------------------------------------
// --- DRAW (Boucle principale) ---
// -----------------------------------------------------------------------------
function draw() {
  background('#d3d3d3'); // Gris clair

  // Afficher l'écran approprié
  if (currentScreen === 1) {
    menuScreen();
  } else if (currentScreen === 2) {
    laboSreen();
  } else if (currentScreen === 3) {
    testResultScreen(); // Afficher l'écran de résultats
  }
  // Ajouter d'autres écrans si nécessaire
}

// -----------------------------------------------------------------------------
// --- FONCTIONS D'AFFICHAGE DES ÉCRANS ---
// -----------------------------------------------------------------------------

// --- Fonction pour dessiner l'écran 1 (Menu) ---
function menuScreen() {
  // Afficher la carte
  mapScreen(); // Dessine les cercles de la carte

  // Afficher le "bouton" dessiné pour aller au Labo
  laboCircleX = width * 0.85; // Position à droite
  laboCircleY = height / 2;
  fill(100, 100, 200, 200); // Bleu-gris transparent
  stroke(50);
  strokeWeight(2);
  ellipse(laboCircleX, laboCircleY, LABO_CIRCLE_DIAMETER, LABO_CIRCLE_DIAMETER);
  noStroke();
  fill(255);
  textSize(18);
  text("Labo", laboCircleX, laboCircleY);
  textSize(LABEL_TEXT_SIZE); // Rétablir la taille par défaut
}

// --- Fonction pour dessiner l'écran 2 (Labo) ---
function laboSreen() {
  // Dessiner le cercle cible (droite)
  fill(currentTargetColor);
  stroke(0);
  strokeWeight(1);
  ellipse(targetCirclePos.x, targetCirclePos.y, TARGET_CIRCLE_DIAMETER, TARGET_CIRCLE_DIAMETER);
  noStroke();
  fill(0);
  text("Cible (max 2)", targetCirclePos.x, targetCirclePos.y - TARGET_CIRCLE_DIAMETER / 2 - 15);


  // Dessiner les cercles éléments (gauche) et leurs labels
  let radius = ELEMENT_CIRCLE_DIAMETER / 2;
  for (let i = 0; i < elementCircles.length; i++) {
    let circle = elementCircles[i];

    // Dessiner le cercle (utiliser currentPos pour le drag)
    fill(circle.color);
    stroke(0);
    strokeWeight(1);
    ellipse(circle.currentPos.x, circle.currentPos.y, circle.diameter, circle.diameter);

    // Dessiner le label sous le cercle
    if (!circle.isDragging) { // N'afficher le label que si non glissé
      let labelY = circle.currentPos.y + radius + LABEL_PADDING + LABEL_TEXT_SIZE / 2;
      let textContent = circle.name;
      let textW = textWidth(textContent);
      let rectWidth = textW + LABEL_PADDING * 2;
      let rectHeight = LABEL_TEXT_SIZE + LABEL_PADDING;
      fill(255, 220); // Blanc semi-transparent
      noStroke();
      // rectMode(CENTER) est défini dans setup
      rect(circle.currentPos.x, labelY, rectWidth, rectHeight, 5); // Rectangle arrondi
      fill(0); // Texte noir
      textAlign(CENTER, CENTER);
      textSize(LABEL_TEXT_SIZE);
      text(textContent, circle.currentPos.x, labelY);
    }
  }
  // Les boutons p5.dom sont gérés par p5.js (positionnés dans styleActionButtons)
}

// --- Fonction pour dessiner l'écran 3 (Résultats du Test) ---
function testResultScreen() {
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Résultats du Test", width / 2, height / 3);

  if (testData && testData.names.length > 0) {
    textSize(18);
    text("Éléments testés : " + testData.names.join(' + '), width / 2, height / 2);
    // Ici, tu ajouterais la logique pour appliquer l'effet sur une zone cible
    // et afficher le résultat.
    // Exemple: applyTestEffect(mapCircles[0], testData); // Tester sur la zone verte par défaut
    text("Interaction à implémenter...", width/2, height/2 + 40);
  } else {
    textSize(18);
    text("Aucune donnée de test disponible.", width / 2, height / 2);
  }

  // Le bouton Retour est géré par updateButtonVisibility()
}

// --- Fonction pour dessiner la carte (utilisée dans menuScreen) ---
function mapScreen() {
  // Dessiner les 3 cercles de la carte
  for (let i = 0; i < mapCircles.length; i++) {
    let mapCircle = mapCircles[i];
    fill(mapCircle.color);
    stroke(0);
    strokeWeight(1);
    // Utiliser currentDiameter pour permettre le changement de taille
    ellipse(mapCircle.pos.x, mapCircle.pos.y, mapCircle.currentDiameter, mapCircle.currentDiameter);

    // Afficher le nom de la zone au centre du cercle
    fill(255); // Texte blanc
    noStroke();
    textSize(LABEL_TEXT_SIZE);
    text(mapCircle.name, mapCircle.pos.x, mapCircle.pos.y);
  }
}

// -----------------------------------------------------------------------------
// --- FONCTIONS UTILITAIRES (Boutons, Positions, Couleurs) ---
// -----------------------------------------------------------------------------

// --- Fonction pour styler et positionner les boutons ---
function styleActionButtons() {
  // Vérifier si les boutons et targetCirclePos existent (sécurité)
  if (!resetButton || !testButton || !backButton || !passTurnButton || !targetCirclePos) {
    console.warn("Impossible de styler les boutons : éléments non initialisés.");
    return;
  }

  // --- Positions Écran 2 (Labo) ---
  let laboButtonY = targetCirclePos.y + TARGET_CIRCLE_DIAMETER / 2 + 40;
  let laboButtonSpacing = 20;

  // Positionner Vider (sous la cible, à gauche)
  resetButton.position(targetCirclePos.x - resetButton.width - laboButtonSpacing / 2, laboButtonY);

  // Positionner Faire tester (sous la cible, à droite)
  testButton.position(targetCirclePos.x + laboButtonSpacing / 2, laboButtonY);

  // --- Position Bouton Retour (Écran 2 & 3) ---
  // En bas au centre
  backButton.position(width / 2 - backButton.width / 2, height * 0.92);

  // --- Position Bouton Passer Tour (Écran 1) ---
  // En bas au centre (même endroit que Retour, mais visible sur écran différent)
  passTurnButton.position(width / 2 - passTurnButton.width / 2, height * 0.92);


  // Style commun
  [resetButton, testButton, backButton, passTurnButton].forEach(button => {
    button.style('padding', '10px 15px');
    button.style('font-size', '16px');
    button.style('cursor', 'pointer');
    button.style('border-radius', '5px');
    button.style('border', '1px solid #555');
    button.style('background-color', '#eee');
  });

  // Styles spécifiques si besoin
  // testButton.style('background-color', '#aeeaaa'); // Vert clair
  // resetButton.style('background-color', '#ffaaaa'); // Rouge clair
}

// --- Fonction pour mettre à jour la visibilité des boutons ---
function updateButtonVisibility() {
  if (!resetButton || !testButton || !backButton || !passTurnButton) return; // Sécurité

  if (currentScreen === 1) { // Menu avec Carte
    passTurnButton.show();
    resetButton.hide();
    testButton.hide();
    backButton.hide(); // Pas de retour depuis l'écran principal
  } else if (currentScreen === 2) { // Labo
    passTurnButton.hide();
    resetButton.show();
    testButton.show();
    backButton.show(); // Pour retourner au Menu (Écran 1)
  } else if (currentScreen === 3) { // Écran de Test
    passTurnButton.hide();
    resetButton.hide();
    testButton.hide(); // On vient de tester
    backButton.show(); // Pour retourner au Labo (Écran 2)
  }
  // Ajouter d'autres écrans si nécessaire
}

// --- Fonction pour initialiser/réinitialiser les positions ---
function initializePositions() {
  // --- Écran 2: Cercles éléments (Labo) ---
  // Positionnés en carré à gauche
  let squareCenterX = width / 4;
  let squareCenterY = height / 2;
  let squareSpacing = ELEMENT_CIRCLE_DIAMETER * 0.9; // Un peu plus espacé
  let elementPositions = [
    createVector(squareCenterX - squareSpacing, squareCenterY - squareSpacing), // Haut Gauche
    createVector(squareCenterX + squareSpacing, squareCenterY - squareSpacing), // Haut Droite
    createVector(squareCenterX - squareSpacing, squareCenterY + squareSpacing), // Bas Gauche
    createVector(squareCenterX + squareSpacing, squareCenterY + squareSpacing)  // Bas Droite
  ];
  for (let i = 0; i < elementCircles.length; i++) {
    let circle = elementCircles[i];
    circle.initialPos.set(elementPositions[i]);
    // Ne réinitialiser la position que si on n'est pas en train de glisser
    if (!circle.isDragging) {
      circle.currentPos.set(circle.initialPos);
    }
  }

  // --- Écran 2: Cercle cible (Labo) ---
  // Positionné à droite
  targetCirclePos = createVector(width * 3 / 4, height / 2);

  // --- Écran 1: Cercles carte (Menu) ---
  // Positionnés en triangle au centre-gauche
  let mapCenterX = width / 3; // Décalé vers la gauche
  let mapCenterY = height / 2;
  let mapRadius = min(width, height) / 5; // Rayon pour disposer les 3 cercles
  for (let i = 0; i < mapCircles.length; i++) {
    let angle = TWO_PI / mapCircles.length * i - HALF_PI; // Répartir en cercle, commencer en haut
    let x = mapCenterX + cos(angle) * mapRadius;
    let y = mapCenterY + sin(angle) * mapRadius;
    mapCircles[i].pos.set(x, y);
    // Optionnel: Réinitialiser la taille si besoin
    // mapCircles[i].currentDiameter = MAP_CIRCLE_BASE_DIAMETER;
  }
}

// --- Fonctions de manipulation de la cible (Écran 2 Labo) ---
function updateTargetColor() {
  if (targetStoredColors.length === 0) {
    currentTargetColor = color(255); // Blanc si vide
  } else if (targetStoredColors.length === 1) {
    currentTargetColor = targetStoredColors[0]; // Couleur unique
  } else { // 2 couleurs stockées -> mélange
    currentTargetColor = lerpColor(targetStoredColors[0], targetStoredColors[1], 0.5);
  }
}

function resetTargetColor() {
  if (currentScreen === 2) { // Action possible seulement dans le Labo
    targetStoredColors = []; // Vider le tableau des couleurs
    targetStoredNames = []; // Vider aussi le tableau des noms
    updateTargetColor(); // Mettre à jour la couleur affichée (devient blanc)
    console.log("Cible vidée.");
  }
}

// --- Fonction pour appliquer l'effet du test (appelée depuis l'écran 3) ---
function applyTestEffect(targetMapCircle, data) {
  if (!targetMapCircle || !data) return;

  console.log(`Application du test sur ${targetMapCircle.name} avec : ${data.names.join(' + ')}`);

  // Logique d'interaction spécifique: Zinc sur Zone Verte
  if (data.names.includes("Zinc") && targetMapCircle.name === "Zone Verte") {
    console.log("Effet spécial: Zinc sur Zone Verte ! Augmentation de taille.");
    targetMapCircle.currentDiameter = min(targetMapCircle.currentDiameter + 50, width/2); // Augmenter la taille (avec limite)
  }
  // Ajouter d'autres interactions ici
  // else if (data.names.includes("Cuivre") && targetMapCircle.name === "Zone Rouge") { ... }
  else {
      console.log("Aucun effet spécial défini pour cette combinaison.");
  }
}

// -----------------------------------------------------------------------------
// --- FONCTIONS DE NAVIGATION / CHANGEMENT D'ÉCRAN ---
// -----------------------------------------------------------------------------

function goToLaboScreen() {
  currentScreen = 2;
  updateButtonVisibility();
  console.log("Transition vers Écran 2: Labo");
}

function goToMenuScreen() {
  currentScreen = 1;
  resetTargetColor(); // Vider la cible en quittant le labo
  updateButtonVisibility();
  console.log("Transition vers Écran 1: Menu");
}

function goToTestResultsScreen() {
  if (currentScreen === 2) { // Ne peut être appelé que depuis le Labo
    if (targetStoredColors.length > 0) { // Ne transférer que s'il y a quelque chose
      // Copier les données actuelles pour le test
      testData = {
        colors: [...targetStoredColors], // Copie des couleurs
        names: [...targetStoredNames]    // Copie des noms
      };
      currentScreen = 3;
      updateButtonVisibility();
      console.log("Transition vers Écran 3: Test avec", testData.names);
    } else {
      console.log("Cible vide. Ajoutez des éléments avant de tester."); // Message si la cible est vide
    }
  }
}

// Gère le clic sur le bouton "Retour"
function handleBackButton() {
  if (currentScreen === 2) { // Si on est dans le Labo -> Retour au Menu
    goToMenuScreen();
  } else if (currentScreen === 3) { // Si on est sur l'écran Test -> Retour au Labo
    currentScreen = 2; // Retourne simplement au labo sans reset
    testData = null; // Effacer les données du test précédent
    updateButtonVisibility();
    console.log("Transition retour vers Écran 2: Labo");
  }
}


// -----------------------------------------------------------------------------
// --- FONCTIONS DE GESTION DES INTERACTIONS UTILISATEUR ---
// -----------------------------------------------------------------------------

function mousePressed() {
  // --- Interaction Écran 1 (Menu) ---
  if (currentScreen === 1) {
    // Vérifier clic sur le "bouton" dessiné pour aller au Labo
    let d = dist(mouseX, mouseY, laboCircleX, laboCircleY);
    if (d < LABO_CIRCLE_DIAMETER / 2) {
      goToLaboScreen();
      return; // Important: ne pas vérifier autre chose si on a cliqué ici
    }
    // Ici, tu pourrais ajouter des interactions avec la carte si nécessaire
  }

  // --- Interaction Écran 2 (Labo) ---
  else if (currentScreen === 2) {
    // Vérifier le début du glisser-déposer des cercles éléments
    // (p5.dom gère les clics sur les boutons créés avec createButton)
    draggedCircleIndex = -1; // Réinitialiser
    // Parcourir en sens inverse pour prioriser les cercles du dessus
    for (let i = elementCircles.length - 1; i >= 0; i--) {
      let circle = elementCircles[i];
      let distance = dist(mouseX, mouseY, circle.currentPos.x, circle.currentPos.y);
      if (distance < circle.diameter / 2) {
        // Commencer le drag SI la souris est bien SUR le cercle
        circle.isDragging = true;
        draggedCircleIndex = i;
        // Calculer l'offset entre le clic et le centre du cercle
        dragOffsetX = mouseX - circle.currentPos.x;
        dragOffsetY = mouseY - circle.currentPos.y;
        console.log("Dragging started:", circle.name);
        break; // Arrêter dès qu'un cercle est trouvé
      }
    }
  }
  // --- Interactions autres écrans ---
  // else if (currentScreen === 3) { ... }
}

function mouseDragged() {
  // Gérer le glissement SI on est sur l'écran Labo ET qu'un cercle est sélectionné
  if (currentScreen === 2 && draggedCircleIndex !== -1) {
    let circle = elementCircles[draggedCircleIndex];
    // Mettre à jour la position du cercle pour suivre la souris, en tenant compte de l'offset
    circle.currentPos.x = mouseX - dragOffsetX;
    circle.currentPos.y = mouseY - dragOffsetY;
  }
}

function mouseReleased() {
  // Gérer le relâchement SI on était en train de glisser sur l'écran Labo
  if (currentScreen === 2 && draggedCircleIndex !== -1) {
    let circle = elementCircles[draggedCircleIndex];
    console.log("Dragging stopped:", circle.name);
    circle.isDragging = false;

    // Vérifier la collision avec la cible
    let distToTarget = dist(circle.currentPos.x, circle.currentPos.y, targetCirclePos.x, targetCirclePos.y);

    if (distToTarget < TARGET_CIRCLE_DIAMETER / 2 + circle.diameter / 2) { // Collision détectée
      console.log("Dropped", circle.name, "on target");
      // Ajouter couleur et nom si possible (max 2 et pas de doublon)
      if (targetStoredColors.length < 2) {
        // Vérifier si le nom n'est pas déjà présent
        if (!targetStoredNames.includes(circle.name)) {
          targetStoredColors.push(circle.color);
          targetStoredNames.push(circle.name);
          updateTargetColor(); // Mettre à jour la couleur affichée de la cible
          console.log("Added", circle.name, "to target. Current target:", targetStoredNames);
        } else {
          console.log(circle.name, "is already in the target.");
        }
      } else {
        console.log("Target is full (max 2 elements).");
      }
      // Ramener le cercle à sa position initiale après le drop sur la cible
      circle.currentPos.set(circle.initialPos);

    } else {
      // Si relâché ailleurs, ramener simplement à la position initiale
      console.log("Dropped", circle.name, "outside target.");
      circle.currentPos.set(circle.initialPos);
    }

    // Réinitialiser l'index du cercle glissé
    draggedCircleIndex = -1;
  }
}

// --- Fonction pour gérer le redimensionnement de la fenêtre ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Recalculer toutes les positions qui dépendent de la taille
  initializePositions();
  // Repositionner les boutons p5.dom
  styleActionButtons();
  // Assurer que la visibilité est correcte (au cas où)
  updateButtonVisibility();
  console.log("Window resized");
}

// -----------------------------------------------------------------------------
// --- FONCTIONS LIÉES À LA LOGIQUE DU JEU (Tour par tour, etc.) ---
// -----------------------------------------------------------------------------

// --- Fonction appelée par le bouton "Passer le tour" (Écran 1) ---
function updateSeaweedGrowth() {
  if (currentScreen === 1) {
      console.log("Passing turn, updating seaweed growth...");
      // Augmenter le diamètre des cercles de la carte
      for (let i = 0; i < mapCircles.length; i++) {
        let mapCircle = mapCircles[i];
        mapCircle.currentDiameter += mapCircle.growthSpeed;
        // Ajouter une limite de taille si nécessaire
        // mapCircle.currentDiameter = min(mapCircle.currentDiameter, maxDiameter);
      }
      // Ici tu pourrais ajouter d'autres logiques de fin de tour
      // comme l'évolution de l'environnement, etc.
  }
}