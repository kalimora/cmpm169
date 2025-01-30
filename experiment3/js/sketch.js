// sketch.js - Applies a dynamic red holographic glitch effect to moving subjects in video.
// Author: Kaylee Morales
// Date: 01/30/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
// Globals
let video;
let prevFrame;
let hoverColorChangeDistance = 50; // Distance in pixels for the hover effect to activate
let hoverEffectIntensity = []; // Array to store the intensity of the hover effect
let threshold = 20; // Changes the capture sensitivity for the effect
let canvasContainer;

// Setup p5.js project with responsive canvas
function setup() {
  canvasContainer = select('#canvas-container'); // p5.js function to select DOM element
  let canvas = createCanvas(canvasContainer.size().width, canvasContainer.size().height); // Corrected property access
  canvas.parent('canvas-container');

  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width, height); // Use p5.js 'width' and 'height' directly
  video.hide();
  prevFrame = null;

  hoverEffectIntensity = new Array(width * height).fill(0);

  window.addEventListener('resize', resizeScreen); // Use addEventListener for resizing
  resizeScreen();
}

// Resize screen and adjust canvas size dynamically
function resizeScreen() {
  resizeCanvas(canvasContainer.size().width, canvasContainer.size().height);
  video.size(canvasContainer.size().width, canvasContainer.size().height);
  console.log("Resizing... new width: " + canvasContainer.size().width + ", new height: " + canvasContainer.size().height);
  hoverEffectIntensity = new Array(canvasContainer.size().width * canvasContainer.size().height).fill(0); // Reset the intensity array for new dimensions
}

// Main animation loop that applies video effects
function draw() {
  background(0);

  video.loadPixels();

  if (prevFrame) {
    loadPixels();
    for (let y = 0; y < video.height; y++) {
      for (let x = 0; x < video.width; x++) {
        let index = (x + y * video.width) * 4;
        let r = video.pixels[index + 0];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];
        let prevR = prevFrame[index + 0];
        let prevG = prevFrame[index + 1];
        let prevB = prevFrame[index + 2];

        let diff = dist(r, g, b, prevR, prevG, prevB);
        if (diff > threshold) {
          if (dist(mouseX, mouseY, x, y) < hoverColorChangeDistance) {
            hoverEffectIntensity[x + y * video.width] = 255;
          }
          
          let intensity = hoverEffectIntensity[x + y * video.width];
          if (intensity > 0) {
            pixels[index + 0] = intensity;
            pixels[index + 1] = 255 - intensity;
            pixels[index + 2] = 255;
          } else {
            pixels[index + 0] = 255;
            pixels[index + 1] = random(0, 60);
            pixels[index + 2] = random(0, 60);
          }
        } else {
          pixels[index + 0] = 0;
          pixels[index + 1] = 0;
          pixels[index + 2] = 0;
        }
        pixels[index + 3] = 255;
        hoverEffectIntensity[x + y * video.width] *= 0.9;
      }
    }
    updatePixels();
  }
  prevFrame = video.pixels.slice(); // Store the current frame for comparison in the next draw cycle
}