// Variable pour savoir quel écran afficher
let currentScreen = 1;

// Variable tour par tour
let nbrTurn;

// Diamètres des cercles
const ELEMENT_CIRCLE_DIAMETER = 100;
const TARGET_CIRCLE_DIAMETER = 150;

// Colision pour changement de vue
const LABO_CIRCLE_DIAMETER = 100;
const MAP_CIRCLE_DIAMETER = 100;
let laboCircleX, laboCircleY, mapCircleX, mapCircleY;

// Tableau pour stocker les infos des cercles éléments (gauche - écran 1)
let elementCircles = [];

// Images
let purpleSeaweed0, purpleSeaweed10, purpleSeaweed20, purpleSeaweed30, purpleSeaweed40, purpleSeaweed50, purpleSeaweed60, purpleSeaweed70, purpleSeaweed80, purpleSeaweed90, purpleSeaweed100; 
let redSeaweed0, redSeaweed10, redSeaweed20, redSeaweed30, redSeaweed40, redSeaweed50, redSeaweed60, redSeaweed70, redSeaweed80, redSeaweed90, redSeaweed100;
let greenSeaweed0, greenSeaweed10, greenSeaweed20, greenSeaweed30, greenSeaweed40, greenSeaweed50, greenSeaweed60, greenSeaweed70, greenSeaweed80, greenSeaweed90, greenSeaweed100;

// Variables pour le cercle cible (droite - écran 2)
let targetCirclePos;
let targetStoredColors = []; // Stocke les objets color p5.js déposés (max 2)
let targetStoredNames = []; // Stocke les noms correspondants
let currentTargetColor; // La couleur affichée (mélange)

// Variables pour gérer le glisser-déposer (écran 2 uniquement)
let draggedCircleIndex = -1;
let dragOffsetX = 0;
let dragOffsetY = 0;


//////  Bouton  //////

// Écran 1
let passTurnButton;

// Écran 2
let resetButton;
let testButton;

// Écran 2 & 3
let backButton;

// Variable pour stocker les données à tester sur l'écran 3
let testData = null; // Sera { colors: [...], names: [...] }

// Constantes pour les labels
const LABEL_TEXT_SIZE = 16;
const LABEL_PADDING = 8;

// Variable check
let ifPreloadLaboScreen = false;
let ifPreloadMenuScreen = true;

// Variables pour les cercles de l'écran 2 (Map)
let mapCircles = [];
const MAP_CIRCLE_BASE_DIAMETER = 120;

/*
function preload() {
  //Image Algues Violette
  purpleSeaweed10 = loadImage("/Algue_Violette/algue_rouge_1.png"); 
  purpleSeaweed20 = loadImage("/Algue_Violette/algue_rouge_2.png"); 
  purpleSeaweed30 = loadImage("/Algue_Violette/algue_rouge_3.png"); 
  purpleSeaweed40 = loadImage("/Algue_Violette/algue_rouge_4.png"); 
  purpleSeaweed50 = loadImage("/Algue_Violette/algue_rouge_5.png"); 
  purpleSeaweed60 = loadImage("/Algue_Violette/algue_rouge_6.png"); 
  purpleSeaweed70 = loadImage("/Algue_Violette/algue_rouge_7.png"); 
  purpleSeaweed80 = loadImage("/Algue_Violette/algue_rouge_8.png"); 
  purpleSeaweed90 = loadImage("/Algue_Violette/algue_rouge_9.png"); 
  purpleSeaweed100 = loadImage("/Algue_Violette/algue_rouge_10.png"); 
  

  //Images Algues Rouge
  redSeaweed0
}
*/

// --- Fonction setup() ---
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Définir les propriétés des 3 cercles de la carte (écran 2)
  mapCircles = [
    { name: "Zone Verte", color: color(0, 150, 0), pos: createVector(0, 0), currentDiameter: MAP_CIRCLE_BASE_DIAMETER, growthSpeed: 6}, // Vert
    { name: "Zone Rouge", color: color(200, 0, 0), pos: createVector(0, 0), currentDiameter: MAP_CIRCLE_BASE_DIAMETER, growthSpeed: 9 }, // Rouge
    { name: "Zone Bleue", color: color(0, 0, 200), pos: createVector(0, 0), currentDiameter: MAP_CIRCLE_BASE_DIAMETER, growthSpeed: 13 }  // Bleu
  ];

  // Initialiser/calculer les positions des cercles dans la Map
  initializePositions();

  // Définir les propriétés des 4 cercles éléments (écran 1)
  elementCircles = [
    { name: "Zinc", color: color(128, 0, 128), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }, // Pourpre
    { name: "Cuivre", color: color(184, 115, 51), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }, // #B87333
    { name: "Azote", color: color(0, 128, 128), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }, // #008080
    { name: "Soufre", color: color(176, 196, 222), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }  // #B0C4DE
  ];

  // Positionner et styler les boutons
  styleActionButtons();
}


// --- Fonction draw() ---
function draw() {
  background('#d3d3d3');

  // Menu
  if (currentScreen === 1) {
    //Charger la vue
    if(ifPreloadLaboScreen == true){
      preloadLaboScreen();
    }  
    
    menuScreen();
    // S'assurer que les boutons sont visibles (au cas où on reviendrait à l'écran 1)
    if (resetButton && testButton && backButton) {
        resetButton.hide();
        testButton.hide();
        backButton.hide();
    }
  
  //Labo  
  } else if (currentScreen === 2) {
    //Charger la vue
    if(ifPreloadLaboScreen == true){
      preloadLaboScreen();
    }  
    //Afficher la vue
    laboSreen();
    
    // S'assurer que les boutons sont visibles (au cas où on reviendrait à l'écran 1)
    if (resetButton && testButton && backButton) {
      resetButton.show();
      testButton.show();
      backButton.show();
    }
  }
}

// --- Fonction pour dessiner l'écran 3 (Map) ---
function preloadMenuScreen() {
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(LABEL_TEXT_SIZE);

  // Initialiser/calculer les positions des cercles dans la Map
  initializePositions();

  // Calculer la couleur initiale de la cible (blanc)
  updateTargetColor();

  // Créer les boutons
  passTurnButton = createButton('Passer le tour');
  resetButton = createButton('Vider');
  testButton = createButton('Faire tester');
  backButton = createButton('Retour'); // Création du nouveau bouton

  // Positionner et styler les boutons
  styleActionButtons();

  // Associer les fonctions aux clics
  passTurnButton.mousePressed(udpdateSeaweedGrowth);
  resetButton.mousePressed(resetTargetColor);
  testButton.mousePressed(prepareColorTest);
  backButton.mousePressed(goBackView); // Associer la nouvelle fonction

  //Faire en sorte que ça ne se charge qu'une fois
  ifPreloadMenuScreen = false;
}

// --- Fonction pour dessiner l'écran 1 (Labo) ---
function menuScreen() {
  fill(0);
  text("menu", width/2, height/2)

  //Bouton pour changer de vue
  laboCircleX = 3*width/4;
  laboCircleY = height/2;
  circle(laboCircleX, laboCircleY, LABO_CIRCLE_DIAMETER);

  //Afficher la map
  mapScreen();
}

// --- Charger la vue du labo ---
function preloadLaboScreen() {
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(LABEL_TEXT_SIZE);
  
  // Initialiser/calculer les positions des cercles dans la Map
  initializePositions();

  // Calculer la couleur initiale de la cible (blanc)
  updateTargetColor();

  // Créer les boutons
  passTurnButton = createButton('Passer le tour');
  resetButton = createButton('Vider');
  testButton = createButton('Faire tester');
  backButton = createButton('Retour'); // Création du nouveau bouton

  // Positionner et styler les boutons
  styleActionButtons();

  // Associer les fonctions aux clics
  passTurnButton.mousePressed(udpdateSeaweedGrowth);
  resetButton.mousePressed(resetTargetColor);
  testButton.mousePressed(prepareColorTest);
  backButton.mousePressed(goBackView); // Associer la nouvelle fonction

  //Faire en sorte que ça ne se charge qu'une fois
  ifPreloadLaboScreen = false;
}

// --- Fonction pour dessiner l'écran 2 (Labo) ---
function laboSreen() {
  // Dessiner le cercle cible (droite)
  fill(currentTargetColor);
  stroke(0); strokeWeight(1);
  ellipse(targetCirclePos.x, targetCirclePos.y, TARGET_CIRCLE_DIAMETER, TARGET_CIRCLE_DIAMETER);

  // Dessiner les cercles éléments (gauche) et leurs labels
  let radius = ELEMENT_CIRCLE_DIAMETER / 2;
  for (let i = 0; i < elementCircles.length; i++) {
    let circle = elementCircles[i];
    // Dessiner le cercle
    fill(circle.color); stroke(0); strokeWeight(1);
    ellipse(circle.currentPos.x, circle.currentPos.y, circle.diameter, circle.diameter);
    // Dessiner le label
    let labelY = circle.currentPos.y + radius + LABEL_PADDING + LABEL_TEXT_SIZE / 2;
    let textContent = circle.name;
    let textW = textWidth(textContent);
    let rectWidth = textW + LABEL_PADDING * 2;
    let rectHeight = LABEL_TEXT_SIZE + LABEL_PADDING;
    fill(255); noStroke(); rectMode(CENTER);
    rect(circle.currentPos.x, labelY, rectWidth, rectHeight, 5);
    fill(0); textAlign(CENTER, CENTER); textSize(LABEL_TEXT_SIZE);
    text(textContent, circle.currentPos.x, labelY);
  }
  // Les boutons sont gérés par draw() et p5.dom
}

// --- Fonction pour dessiner l'écran 3 (Map) ---
function mapScreen() {
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(LABEL_TEXT_SIZE);

  // 2) Dessiner les 3 cercles de la carte
  for (let i = 0; i < mapCircles.length; i++) {
      let mapCircle = mapCircles[i];
      fill(mapCircle.color);
      stroke(0);
      strokeWeight(1);
      // Utiliser currentDiameter pour permettre le changement de taille
      circle(mapCircle.pos.x, mapCircle.pos.y, mapCircle.currentDiameter);

      // Optionnel: Afficher le nom de la zone
      fill(255); // Texte blanc
      noStroke();
      textSize(LABEL_TEXT_SIZE);
      text(mapCircle.name, mapCircle.pos.x, mapCircle.pos.y);
  }
}


//////  Bouton  //////

// --- Fonction pour styler et positionner les boutons ---
function styleActionButtons() {
  if (!resetButton || !testButton || !backButton || passTurnButton) return; // Sécurité

  // Positionnement DYNAMIQUE basé sur la position de la cible
  let commonY = targetCirclePos.y + TARGET_CIRCLE_DIAMETER / 2 + 30; // Y commun sous la cible
  let spacing = 10; // Espace entre les boutons

  // Positionner Vider (à gauche)
  let resetButtonX = targetCirclePos.x - resetButton.width - spacing;
  resetButton.position(resetButtonX, commonY - resetButton.height / 2);

  // Positionner Faire tester (à droite)
  let testButtonX = targetCirclePos.x + testButton.width + spacing;
  testButton.position(testButtonX - testButton.width, commonY - testButton.height / 2); // Ajustement pour aligner à droite du centre

  // Positionner Retour (au centre)
  let backButtonX = width/2 - backButton.width/2;
  let backButtonY = 9*height/10;
  backButton.position(backButtonX, backButtonY); // Ajustement pour aligner à droite du centre

  // Positionner Tour Suivant
  let passTurnButtonX = width/2;
  let passTurnButtonY = 9*height/10;
  passTurnButton.position(passTurnButtonX, passTurnButtonY); // Ajustement pour aligner à droite du centre  

  // Style commun (optionnel)
  [resetButton, testButton, backButton, passTurnButton].forEach(button => {
      button.style('padding', '10px');
      button.style('font-size', '16px');
      button.style('cursor', 'pointer');
      // Initialement, cacher les boutons s'ils ne doivent pas être visibles
      if (currentScreen == 2){
        passTurnButton.hide();
        resetButton.show();
        testButton.show();
        backButton.show();
      } else {
        passTurnButton.show();
        resetButton.hide();
        testButton.hide();
        backButton.hide();
      }
  });
}

// --- Fonction pour initialiser/réinitialiser les positions ---
function initializePositions() {
  // --- Écran 1: Cercles éléments ---
  let squareCenterX = width / 4;
  let squareCenterY = height / 2;
  let squareSpacing = ELEMENT_CIRCLE_DIAMETER * 0.8;
  let elementPositions = [
    createVector(squareCenterX - squareSpacing, squareCenterY - squareSpacing),
    createVector(squareCenterX + squareSpacing, squareCenterY - squareSpacing),
    createVector(squareCenterX - squareSpacing, squareCenterY + squareSpacing),
    createVector(squareCenterX + squareSpacing, squareCenterY + squareSpacing)
  ];
  for (let i = 0; i < elementCircles.length; i++) {
    let circle = elementCircles[i];
    circle.initialPos.set(elementPositions[i]);
    if (!circle.isDragging) {
      circle.currentPos.set(circle.initialPos);
    }
  }

  // --- Écran 1: Cercle cible ---
  targetCirclePos = createVector(width * 3 / 4, height / 2);

  // --- Écran 2: Cercles carte ---
  let mapCenterX = width / 2;
  let mapCenterY = height / 2;
  let mapRadius = min(width, height) / 4; // Rayon pour disposer les 3 cercles
  for(let i = 0; i < mapCircles.length; i++) {
      let angle = TWO_PI / mapCircles.length * i - HALF_PI; // Répartir en cercle, commencer en haut
      let x = mapCenterX + cos(angle) * mapRadius;
      let y = mapCenterY + sin(angle) * mapRadius;
      mapCircles[i].pos.set(x, y);
      // Réinitialiser la taille si nécessaire (par exemple, si on quitte et revient)
      // mapCircles[i].currentDiameter = MAP_CIRCLE_BASE_DIAMETER; // Décommenter si besoin
  }
}

// --- Retourner dans la scène principale
function goBackView() {
  currentScreen = 1;
  ifSolutionIsTest = false;
  resetTargetColor();
}


//////  Color fioles  /////

// --- Fonction pour mettre à jour la couleur de la cible (Écran 1) ---
function updateTargetColor() {
  if (targetStoredColors.length === 0) {
    currentTargetColor = color(255); // Blanc
  } else if (targetStoredColors.length === 1) {
    currentTargetColor = targetStoredColors[0];
  } else { // 2 couleurs stockées
    currentTargetColor = lerpColor(targetStoredColors[0], targetStoredColors[1], 0.5);
  }
}

// --- Fonction appelée par le bouton Reset (Écran 1) ---
function resetTargetColor() {
    targetStoredColors = []; // Vider le tableau des couleurs
    targetStoredNames = []; // Vider aussi le tableau des noms
    updateTargetColor(); // Mettre à jour la couleur affichée
}

// --- Fonction appelée par le bouton "Faire tester" (Écran 1) ---
function prepareColorTest() {
    if (targetStoredColors.length > 0) { // Ne transférer que s'il y a quelque chose
        // Copier les données actuelles pour le test
        testData = {
            colors: [...targetStoredColors], // Copie des couleurs
            names: [...targetStoredNames]   // Copie des noms
        };
        // Passer à l'écran 3
        currentScreen = 3;
        // Cacher les boutons de l'écran 2
        resetButton.hide();
        testButton.hide();
        backButton.hide();
    } else {
        console.log("Aucune couleur à tester !"); // Message si la cible est vide
    }
}


//////  Gestions des intéractions  //////

// --- Fonctions pour gérer les interactions souris ---
function mousePressed() {
  // --- Logique pour l'ÉCRAN 1: Glisser-déposer & Boutons ---
  if (currentScreen === 1) {
    if (dist(mouseX, mouseY,laboCircleX, laboCircleY) < LABO_CIRCLE_DIAMETER) {
      currentScreen = 2;
      ifPreloadLaboScreen = true;
    }
  }

  // --- Logique pour l'ÉCRAN 2: Glisser-déposer & Boutons ---
  if (currentScreen === 2) {
    // Vérifier clic sur les boutons d'abord
    let dReset = dist(mouseX, mouseY, resetButton.x + resetButton.width / 2, resetButton.y + resetButton.height / 2);
    let dTest = dist(mouseX, mouseY, testButton.x + testButton.width / 2, testButton.y + testButton.height / 2);

    if (dReset < max(resetButton.width, resetButton.height) / 2 || dTest < max(testButton.width, testButton.height) / 2) {
      // Clic sur un bouton, p5.dom s'en occupe, ne pas démarrer de drag
      return;
    }

    // Si pas sur un bouton, vérifier le drag des cercles éléments
    draggedCircleIndex = -1;
    for (let i = elementCircles.length - 1; i >= 0; i--) {
      let circle = elementCircles[i];
      let distance = dist(mouseX, mouseY, circle.currentPos.x, circle.currentPos.y);
      if (distance < circle.diameter / 2) {
        circle.isDragging = true;
        draggedCircleIndex = i;
        dragOffsetX = mouseX - circle.currentPos.x;
        dragOffsetY = mouseY - circle.currentPos.y;
        break;
      }
    }
  }
}

// --- Fonction pour appliquer l'effet du test (Écran 2) ---
function applyTestEffect(targetMapCircle, data) {
    console.log(`Test appliqué sur ${targetMapCircle.name} avec : ${data.names.join(' + ')}`);

    // 4) Interaction spécifique: Zinc sur Zone Verte
    // Vérifier si 'Zinc' est dans les noms testés ET si la cible est la verte
    if (data.names.includes("Zinc") && targetMapCircle.name === "Zone Verte") {
        console.log("Effet spécial: Zinc sur Zone Verte !");
        targetMapCircle.currentDiameter += 50; // Augmenter la taille
    }

    // Ajouter d'autres interactions ici si besoin
    // else if (data.names.includes("Cuivre") && targetMapCircle.name === "Zone Rouge") { ... }
}

function mouseDragged() {
  // Ne glisser que sur l'écran 1
  if (currentScreen !== 2 || draggedCircleIndex === -1) {
    return;
  }
  let circle = elementCircles[draggedCircleIndex];
  circle.currentPos.x = mouseX - dragOffsetX;
  circle.currentPos.y = mouseY - dragOffsetY;
}

function mouseReleased() {
  // Ne gérer le relâchement que sur l'écran 1
  if (currentScreen !== 2 || draggedCircleIndex === -1) {
    return;
  }

  let circle = elementCircles[draggedCircleIndex];
  circle.isDragging = false;

  // Vérifier si on lâche sur la cible (Écran 1)
  let distToTarget = dist(circle.currentPos.x, circle.currentPos.y, targetCirclePos.x, targetCirclePos.y);

  if (distToTarget < TARGET_CIRCLE_DIAMETER / 2) {
    // Collision ! Ajouter couleur et nom si possible
    if (targetStoredColors.length < 2) {
       // Éviter les doublons (vérifier par nom)
       if (!targetStoredNames.includes(circle.name)) {
           targetStoredColors.push(circle.color);
           targetStoredNames.push(circle.name); // Stocker aussi le nom !
           updateTargetColor();
       } else {
           console.log(`${circle.name} est déjà dans la cible.`);
       }
    } else {
        console.log("Cible pleine (max 2 couleurs).");
    }
  }

  // Toujours ramener le cercle à sa position initiale
  circle.currentPos.set(circle.initialPos);
  draggedCircleIndex = -1;
}

// --- Fonction pour gérer le redimensionnement ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Recalculer toutes les positions
  initializePositions();
  // Pas besoin de rappeler updateTargetColor ici.
  // Le repositionnement des boutons est géré dans initializePositions via styleActionButtons.
}


//////  Tour par tour  //////

function udpdateSeaweedGrowth() {
  // Augmenter le diamètre du cercle par tour
  for (let i = 0; i < mapCircles.length; i++) {
    let mapCircle = mapCircles[i];
    
    mapCircle.currentDiameter += mapCircle.growthSpeed;
  }
}

// Supprimer la fonction vide "name(params)"