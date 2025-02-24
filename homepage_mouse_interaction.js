// CONSTANTS
const NODES = 5; // Number of nodes in the shape
const RADIUS = 45; // Radius of the shape
const SPRINGING = 0.09; // Springing factor for smooth motion
const DAMPING = 0.98; // Damping factor to slow down motion
const BACKGROUND_COLOR = 0; // Background color (black)

// VARIABLES
let centerX, centerY, accelX, accelY, deltaX, deltaY, rotAngle;
let nodeStartX = [],
  nodeStartY = [],
  nodeX = [],
  nodeY = [],
  angle = [],
  frequency = [];
let organicConstant;

function setup() {
  // Create canvas that fills the window
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.style("position", "fixed");
  cnv.style("inset", 0);
  cnv.style("z-index", -1);

  // Initialize center of shape to the middle of the screen
  centerX = width / 2;
  centerY = height / 2;
  accelX = 0;
  accelY = 0;
  deltaX = 0;
  deltaY = 0;
  rotAngle = -90; // Initial rotation angle
  organicConstant = 1.0;

  // Initialize node positions and angles
  for (let i = 0; i < NODES; i++) {
    nodeStartX[i] = 0;
    nodeStartY[i] = 0;
    nodeX[i] = 0;
    nodeY[i] = 0;
    angle[i] = 0;
    frequency[i] = random(3, 4); // Assign random frequency to each node
  }

  noStroke();
  angleMode(DEGREES); // Use degrees instead of radians
}

function draw() {
  background(BACKGROUND_COLOR, 50); // Semi-transparent background for a fading effect
  drawShape(); // Draw the organic shape
  moveShape(); // Apply motion effects
}

function drawShape() {
  // Calculate node starting positions in a circular pattern
  for (let i = 0; i < NODES; i++) {
    nodeStartX[i] = centerX + cos(rotAngle) * RADIUS;
    nodeStartY[i] = centerY + sin(rotAngle) * RADIUS;
    rotAngle += 360 / NODES; // Evenly distribute nodes around the circle
  }

  // Adjust the shape's tightness dynamically
  curveTightness(organicConstant);
  let shapeColor = lerpColor(color("red"), color("yellow"), organicConstant); // Interpolate between red and yellow
  fill(shapeColor);

  // Draw the shape using curveVertex to create a smooth organic form
  beginShape();
  for (let i = 0; i < NODES; i++) {
    curveVertex(nodeX[i], nodeY[i]);
  }
  endShape(CLOSE);
}

function moveShape() {
  // Calculate movement based on mouse position
  deltaX = mouseX - centerX;
  deltaY = mouseY - centerY;

  // Apply springing effect to make movement feel elastic
  deltaX *= SPRINGING;
  deltaY *= SPRINGING;
  accelX += deltaX;
  accelY += deltaY;

  // Update center position
  centerX += accelX;
  centerY += accelY;

  // Apply damping to slow down movement over time
  accelX *= DAMPING;
  accelY *= DAMPING;

  // Adjust curve tightness based on movement speed
  organicConstant = 1 - (abs(accelX) + abs(accelY)) * 0.1;

  // Move nodes to create fluid, wavy motion
  for (let i = 0; i < NODES; i++) {
    nodeX[i] = nodeStartX[i] + sin(angle[i]) * (accelX * 2);
    nodeY[i] = nodeStartY[i] + sin(angle[i]) * (accelY * 2);
    angle[i] += frequency[i]; // Increment angle for continuous oscillation
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Adjust canvas when window resizes
}
