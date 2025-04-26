// Variable pour savoir quel écran afficher
let currentScreen = 1;

// Diamètres des cercles
const ELEMENT_CIRCLE_DIAMETER = 100;
const TARGET_CIRCLE_DIAMETER = 150;

// Tableau pour stocker les infos des cercles éléments (gauche)
let elementCircles = [];

// Variables pour le cercle cible (droite)
let targetCirclePos;
let targetStoredColors = []; // Stocke les couleurs p5.js déposées (max 2)
let currentTargetColor; // La couleur affichée (mélange)

// Variables pour gérer le glisser-déposer
let draggedCircleIndex = -1;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Constantes pour les labels
const LABEL_TEXT_SIZE = 16;
const LABEL_PADDING = 8;

// Variables pour le bouton Reset
let resetButton; // On utilisera un bouton p5.dom

// --- Fonction setup() ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(LABEL_TEXT_SIZE);

  // Définir les propriétés des 4 cercles éléments
  elementCircles = [
    { name: "Zinc", color: color(128, 0, 128), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }, // Pourpre
    { name: "Cuivre", color: color(184, 115, 51), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }, // #B87333
    { name: "Azote", color: color(0, 128, 128), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }, // #008080
    { name: "Soufre", color: color(176, 196, 222), initialPos: createVector(0, 0), currentPos: createVector(0, 0), isDragging: false, diameter: ELEMENT_CIRCLE_DIAMETER }  // #B0C4DE
  ];

  // Initialiser/calculer les positions
  initializePositions();

  // Calculer la couleur initiale de la cible (blanc)
  updateTargetColor();

  // Créer le bouton Reset
  resetButton = createButton('Vider');
  // Positionner le bouton (sera fait dans initializePositions et windowResized)
  styleResetButton(); // Appliquer style CSS si besoin
  resetButton.mousePressed(resetTargetColor); // Associer la fonction au clic
}

// --- Fonction pour styler et positionner le bouton ---
function styleResetButton() {
    if (!resetButton) return; // Sécurité si le bouton n'est pas encore créé

    // Positionnement DYNAMIQUE basé sur la position de la cible
    let buttonX = targetCirclePos.x; // Centré horizontalement avec la cible
    let buttonY = targetCirclePos.y + TARGET_CIRCLE_DIAMETER / 2 + 30; // En dessous de la cible + marge

    resetButton.position(buttonX - resetButton.width / 2, buttonY - resetButton.height / 2); // position() prend le coin sup gauche

    // Style (optionnel, peut aussi être fait en CSS)
    resetButton.style('padding', '10px');
    resetButton.style('font-size', '16px');
    resetButton.style('cursor', 'pointer');
}

// --- Fonction pour initialiser/réinitialiser les positions ---
function initializePositions() {
  let elementRadius = ELEMENT_CIRCLE_DIAMETER / 2;
  let numElements = elementCircles.length;

  // 1) Disposition en carré sur la moitié gauche
  let squareCenterX = width / 4; // Centre X de la zone gauche
  let squareCenterY = height / 2; // Centre Y de l'écran
  let squareSpacing = ELEMENT_CIRCLE_DIAMETER * 0.8; // Espace entre les cercles et le centre du carré

  // Calculer les 4 positions du carré
  let positions = [
    createVector(squareCenterX - squareSpacing, squareCenterY - squareSpacing), // Haut-Gauche
    createVector(squareCenterX + squareSpacing, squareCenterY - squareSpacing), // Haut-Droit
    createVector(squareCenterX - squareSpacing, squareCenterY + squareSpacing), // Bas-Gauche
    createVector(squareCenterX + squareSpacing, squareCenterY + squareSpacing)  // Bas-Droit
  ];

  // Assigner les positions aux cercles
  for (let i = 0; i < numElements; i++) {
    let circle = elementCircles[i];
    circle.initialPos.set(positions[i]);
    if (!circle.isDragging) {
      circle.currentPos.set(circle.initialPos);
    }
  }

  // Calculer la position du cercle cible (droite)
  targetCirclePos = createVector(width * 3 / 4, height / 2);

  // Repositionner le bouton Reset après avoir recalculé targetCirclePos
   styleResetButton();
}

// --- Fonction pour mettre à jour la couleur de la cible ---
function updateTargetColor() {
  if (targetStoredColors.length === 0) {
    currentTargetColor = color(255); // Blanc
  } else if (targetStoredColors.length === 1) {
    currentTargetColor = targetStoredColors[0];
  } else { // 2 couleurs stockées
    // Mélanger les deux couleurs avec lerpColor
    currentTargetColor = lerpColor(targetStoredColors[0], targetStoredColors[1], 0.5);
  }
}

// --- Fonction appelée par le bouton Reset ---
function resetTargetColor() {
    targetStoredColors = []; // Vider le tableau
    updateTargetColor(); // Mettre à jour la couleur affichée
}



// --- Fonction draw() ---
function draw() {
  background('#d3d3d3');

  if (currentScreen === 1) {
    laboSreen();
  } else if (currentScreen === 2) {
    mapScreen();
  }
}



// --- Fonction pour dessiner l'écran 1 ---
function laboSreen() {
  // --- Dessiner le cercle cible (droite) ---
  // 2) Utiliser la couleur calculée (initialement blanc)
  fill(currentTargetColor);
  stroke(0);
  strokeWeight(1);
  ellipse(targetCirclePos.x, targetCirclePos.y, TARGET_CIRCLE_DIAMETER, TARGET_CIRCLE_DIAMETER);

  // --- Dessiner les cercles éléments (gauche) et leurs labels ---
  let radius = ELEMENT_CIRCLE_DIAMETER / 2;
  for (let i = 0; i < elementCircles.length; i++) {
    let circle = elementCircles[i];
    // Dessiner le cercle
    fill(circle.color);
    stroke(0);
    strokeWeight(1);
    ellipse(circle.currentPos.x, circle.currentPos.y, circle.diameter, circle.diameter);
    // Dessiner le label (code inchangé)
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
   // Le bouton est un élément HTML, p5 le dessine automatiquement
}






// --- Fonction pour dessiner l'écran 2 ---
function mapScreen() {
  fill(0); noStroke(); textSize(32); textAlign(CENTER, CENTER);
  text("Écran 2", width / 2, height / 2);
}






// --- Fonction keyPressed() ---
function keyPressed() {
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    currentScreen = (currentScreen === 1) ? 2 : 1;
  }
}

// --- Fonctions pour gérer le glisser-déposer ---
function mousePressed() {
    // Important : Vérifier d'abord si on clique sur un bouton p5.dom existant
    // Si on clique sur le bouton, p5.dom gère l'appel à resetTargetColor()
    // et on ne veut PAS lancer un drag de cercle en même temps.
    // On vérifie si la souris est SUR le bouton. Si oui, on ne fait rien ici.
    let dButton = dist(mouseX, mouseY, resetButton.x + resetButton.width/2, resetButton.y + resetButton.height/2);
     // Approximatif car position() est top-left, mais suffisant ici.
    if (dButton < max(resetButton.width, resetButton.height) / 2) { // Zone large autour du bouton
        return; // Ne pas traiter le drag si on est sur le bouton
    }


  // Si on ne clique pas sur le bouton, on vérifie le drag des cercles
  draggedCircleIndex = -1; // Réinitialiser au cas où
  for (let i = elementCircles.length - 1; i >= 0; i--) {
    let circle = elementCircles[i];
    let distance = dist(mouseX, mouseY, circle.currentPos.x, circle.currentPos.y);
    if (distance < circle.diameter / 2) {
      circle.isDragging = true;
      draggedCircleIndex = i;
      dragOffsetX = mouseX - circle.currentPos.x;
      dragOffsetY = mouseY - circle.currentPos.y;
      // Mettre le cercle glissé au premier plan (en le redessinant en dernier) - Optionnel mais mieux
      // Pour cela, on le retire et on le remet à la fin du tableau
      // let dragged = elementCircles.splice(i, 1)[0];
      // elementCircles.push(dragged);
      // draggedCircleIndex = elementCircles.length - 1; // Mettre à jour l'index !
      // Note: Cette optimisation du dessin rend la logique plus complexe, à évaluer. Pour l'instant, on laisse sans.
      break;
    }
  }
}

function mouseDragged() {
  if (draggedCircleIndex !== -1) {
    let circle = elementCircles[draggedCircleIndex];
    circle.currentPos.x = mouseX - dragOffsetX;
    circle.currentPos.y = mouseY - dragOffsetY;
  }
}

function mouseReleased() {
  if (draggedCircleIndex !== -1) {
    let circle = elementCircles[draggedCircleIndex];
    circle.isDragging = false;

    // 3) Vérifier si on lâche sur la cible
    let distToTarget = dist(circle.currentPos.x, circle.currentPos.y, targetCirclePos.x, targetCirclePos.y);

    if (distToTarget < TARGET_CIRCLE_DIAMETER / 2) {
      // 4) Collision ! Ajouter la couleur si moins de 2 couleurs déjà présentes
      if (targetStoredColors.length < 2) {
        // Éviter d'ajouter la même couleur deux fois de suite ? (optionnel)
         // if (!targetStoredColors.includes(circle.color)) { // Ne fonctionne pas directement avec les objets color p5js
         //   targetStoredColors.push(circle.color);
         //   updateTargetColor(); // Mettre à jour le mélange
         // }
         // Version simple: on ajoute toujours si < 2
         targetStoredColors.push(circle.color);
         updateTargetColor(); // Mettre à jour le mélange
      }
      // Si 2 couleurs ou plus, on n'ajoute rien.
    }

    // 6) Toujours ramener le cercle à sa position initiale
    circle.currentPos.set(circle.initialPos);
    draggedCircleIndex = -1;
  }
}

// --- Fonction pour gérer le redimensionnement ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Recalculer toutes les positions
  initializePositions();
  // Pas besoin de rappeler updateTargetColor ici, la couleur reste la même.
}


function name(params) {
  
}