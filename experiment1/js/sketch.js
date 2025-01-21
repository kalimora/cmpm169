// sketch.js - purpose and description here
// Author: Kaylee Morales 
// Date: 01/21/2025

const numMolds = 100; // Number of molds
let drawingActive = true;
let baseColors = []; // Array for base colors
let useCurvedLines = false; // To toggle between straight and curved lines

// Globals
let molds = [];
let canvasContainer;
var centerHorz, centerVert;

class Mold {
    constructor() {
        this.x = width / 2; // Start at the center horizontally
        this.y = height / 2; // Start at the center vertically
        this.heading = random(360); // Random initial direction
        this.speed = random(0.5, 1.5); // Slower speed for smoother movement
        this.baseColor = random(baseColors); // Assign a random base color
        this.amplitude = random(15, 35); // Slightly increased wave height
        this.frequency = random(0.02, 0.05); // Slower wave frequency
    }

    update() {
        this.x += this.speed * cos(this.heading);
        this.y += this.speed * sin(this.heading);
        this.x = (this.x + width) % width; // Wrap around the edges
        this.y = (this.y + height) % height;
    }

    display() {
        const pulse = Mold.pulseStroke();
        const dynamicColor = color(
          red(this.baseColor) * pulse / 12,
          green(this.baseColor) * pulse / 12,
          blue(this.baseColor) * pulse / 12
        );
        stroke(dynamicColor);
        strokeWeight(pulse);
        if (useCurvedLines) {
            this.drawWave();
        } else {
            this.drawStraightLine();
        }
    }

    drawStraightLine() {
        line(this.x, this.y, this.x + cos(this.heading) * 10, this.y + sin(this.heading) * 10);
    }

    drawWave() {
        const cx1 = this.x + cos(this.heading + 45) * 10;
        const cy1 = this.y + sin(this.heading + 45) * 10 + this.amplitude * sin(frameCount * this.frequency);
        const cx2 = this.x + cos(this.heading - 45) * 15;
        const cy2 = this.y + sin(this.heading - 45) * 15 - this.amplitude * cos(frameCount * this.frequency);
        const ex = this.x + cos(this.heading) * 20;
        const ey = this.y + sin(this.heading) * 20;
        noFill();
        bezier(this.x, this.y, cx1, cy1, cx2, cy2, ex, ey);
    }

    static pulseStroke() {
        return 2 + 10 * abs(sin(millis() / 2000));
    }
}

function setup() {
    canvasContainer = $("#canvas-container");
    let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
    canvas.parent("canvas-container");

    baseColors = [
        color(143, 89, 153),
        color(112, 170, 240),
        color(194, 222, 219),
        color(234, 179, 248)
    ];

    for (let i = 0; i < numMolds; i++) {
        molds.push(new Mold());
    }

    $(window).resize(function() {
        resizeCanvas(canvasContainer.width(), canvasContainer.height());
    });
}

function draw() {
    if (drawingActive) {
        background(255);
        molds.forEach(mold => {
            mold.update();
            mold.display();
        });

        if (millis() > 10000) {
            drawingActive = false;
        }
    }
}

function mousePressed() {
    useCurvedLines = !useCurvedLines;
}