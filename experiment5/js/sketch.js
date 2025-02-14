// sketch.js - ASCII Art Human Experiment
// Author: Kaylee Morales
// Date: 02/14/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
// Globals
let video;
let phrase = "I am human";
let alternatePhrase = "I am not";
let currentPhrase;
let index = 0;
let useAlternate = false; // Boolean flag to toggle between phrases
let canvasContainer;

function setup() {
  canvasContainer = select('#canvas-container');
  let canvas = createCanvas(canvasContainer.width, canvasContainer.height);
  canvas.parent('canvas-container');

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  textSize(32); // Adjust text size if necessary based on new canvas size
  noStroke();
  currentPhrase = phrase; // Start with the initial phrase
}

function draw() {
  background(0);

  let pixelSize = 32; // This can be adjusted if necessary

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      let col = video.get(x, y);
      fill(col);
      
      let letter = currentPhrase[index % currentPhrase.length];
      text(letter, x, y + pixelSize);
    }
    index++;
  }
}

function mousePressed() {
  useAlternate = !useAlternate;
  if (useAlternate) {
    currentPhrase = alternatePhrase;
  } else {
    currentPhrase = phrase;
  }
  index = 0;
}

function windowResized() {
  resizeCanvas(canvasContainer.width, canvasContainer.height);
  video.size(width, height); // Ensure video size matches the new canvas size
}
