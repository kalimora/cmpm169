// sketch.js - 3d shapes that have a prompt for the user that deals with word count to create a glitch and falling particles
// Author: Kaylee Morales
// Date: 02/06/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
// Globals
let xOff = 0;
let yOff = 1;
let zOff = 2;
let userInput = "";
let impact = false;
let wordCount = 0;
let shapeType = true;
let particles = [];

class Particle {
    constructor() {
        this.x = random(-width / 2, width / 2);
        this.y = -height / 2;
        this.z = random(-500, 500);
        this.size = random(20, 50);
        this.speed = random(1, 5);
    }

    update() {
        this.y += this.speed;
        if (this.y - this.size > height / 2) {
            let index = particles.indexOf(this);
            particles.splice(index, 1);
        }
    }

    display() {
        push();
        translate(this.x, this.y, this.z);
        noFill();
        stroke(204, 153, 255);
        if (shapeType) {
            sphere(this.size);
        } else {
            rotateX(frameCount * 0.01);
            rotateY(frameCount * 0.01);
            box(this.size, this.size, this.size);
        }
        pop();
    }
}

function setup() {
  let canvasContainer = select('#canvas-container');
  let canvas = createCanvas(canvasContainer.width, canvasContainer.height, WEBGL);
  canvas.parent('canvas-container');
  textSize(18);

  let input = createInput();
  input.style('width', '200px');
  input.position((width - input.width) / 2, height / 2 + 40); // Position input slightly lower from the center

  let button = createButton('submit');
  button.position(input.x + input.width + 10, input.y); // Right next to the input
  button.mousePressed(() => {
      userInput = input.value();
      wordCount = userInput.trim().split(/\s+/).length;
      impact = true;
      shapeType = !shapeType;
      input.value('');
  });

  // Create and position the prompt
  let prompt = createDiv('What do you wish you had said?');
  prompt.id('prompt');
  prompt.parent('canvas-container');
  prompt.style('color', '#FFFFFF');
  prompt.style('text-align', 'center');
  prompt.style('width', '250px');
  prompt.style('position', 'absolute');
  prompt.style('top', (height / 2 - 00) + 'px'); // Adjust this value to position above the input
  prompt.style('left', '50%');
  prompt.style('transform', 'translateX(-50%)');
}


function draw() {
    background(0);
    fill(255);
    noStroke();
    text(userInput, -width / 2 + 10, -height / 2 + 20);

    noFill();
    stroke(204, 153, 255);
    translate(noise(xOff) * 100, noise(yOff) * height * 0.10, 0);
    rotateY(millis() / 10000);

    if (impact) {
        stroke(255, 0, 0);
        if (shapeType) {
            sphere(300 + wordCount * 10);
        } else {
            cube(50 + wordCount * 10, 255, 0, 0);
            cube(75 + wordCount * 10, 255, 0, 0);
            cube(100 + wordCount * 10, 255, 0, 0);
            cube(150 + wordCount * 10, 255, 0, 0);
            cube(200 + wordCount * 10, 255, 0, 0);
            cube(275 + wordCount * 10, 255, 0, 0);
        }
        impact = false;
    } else {
        if (shapeType) {
            sphere(300);
        } else {
            cube(50, 255, 255, 255);
            cube(75, 204, 153, 255);
            cube(100, 255, 255, 255);
            cube(150, 204, 153, 255);
            cube(200, 255, 255, 255);
            cube(275, 204, 153, 255);
        }
    }

    if (frameCount % 60 == 0) {
        particles.push(new Particle());
    }
    particles.forEach(p => {
        p.update();
        p.display();
    });

    xOff += 0.001;
    yOff += 0.001;
    zOff += 0.001;
}

function cube(size, r, g, b) {
    push();
    noFill();
    stroke(r, g, b);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    box(size, size, size);
    pop();
}
