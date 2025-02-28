// sketch.js - filter
// Author: Kaylee Morales
// Date: 03/05/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
// Globals
let video; // Webcam input
let model; // BlazeFace machine-learning model
let face; // Detected face
let mouthOpen = false;
let fishX, fishY, score = 0;
let canvasContainer;

function setup() {
    // Select the canvas container and create the canvas inside it
    canvasContainer = select('#canvas-container');
    let canvas = createCanvas(canvasContainer.width, canvasContainer.height);
    canvas.parent('canvas-container');

    video = createCapture(VIDEO);
    video.hide();
    loadFaceModel();
    spawnFish(); // Spawn the first fish

    // Add fullscreen functionality
    select("#fullscreen").mousePressed(() => {
        let fs = fullscreen();
        fullscreen(!fs);
    });
}

async function loadFaceModel() {
    model = await blazeface.load();
}

function draw() {
    background(255, 230, 250); // Soft pastel background

    if (video.loadedmetadata && model !== undefined) {
        getFace();
    }

    if (face !== undefined) {
        image(video, 0, 0, width, height);

        let nose = scalePoint(face.landmarks[2]);
        let mouth = scalePoint(face.landmarks[3]);
        let rightEar = scalePoint(face.landmarks[4]);
        let leftEar = scalePoint(face.landmarks[5]);

        // Animate mouth opening and closing every second
        let mouthHeight = mouthOpen ? 25 : 10;
        if (frameCount % 60 === 0) {
            mouthOpen = !mouthOpen;
        }

        // Draw super cute cat features!
        drawHigherCatEars(leftEar, rightEar, nose);
        drawTinyCatNose(nose);
        drawSweetCatMouth(mouth, mouthHeight);
        drawDelicateWhiskers(nose);

        // Draw the floating fish & check for catch
        drawFish();
        checkFishCatch(mouth);

        // Display Score
        drawScore();
    }
}

// 🎮 Fish Catching Game Functions 🎮

// Spawns a new fish at a random position
function spawnFish() {
    fishX = random(50, width - 50);
    fishY = random(50, height - 150);
}

// Draws the fish on the screen
function drawFish() {
    fill(255, 204, 100);
    ellipse(fishX, fishY, 40, 20); // Fish body
    triangle(fishX - 20, fishY, fishX - 40, fishY - 10, fishX - 40, fishY + 10); // Tail fin
}

// Checks if the fish is caught when mouth is open
function checkFishCatch(mouth) {
    if (mouthOpen && dist(mouth.x, mouth.y, fishX, fishY) < 50) {
        score++; // Increase score
        spawnFish(); // Move fish to a new location
    }
}

// Displays the score on the screen
function drawScore() {
    fill(0);
    textSize(24);
    textAlign(RIGHT);
    text(`Score: ${score}`, width - 20, 40);
}

// 🐱 Cat Filter Functions 🐱

function drawHigherCatEars(leftEar, rightEar, nose) {
    fill(255, 180, 200);
    noStroke();

    let earOffset = 150; // Moves ears up higher

    // Left Ear (Higher & Fluffier)
    ellipse(leftEar.x - 20, leftEar.y - earOffset, 90, 110);
    fill(250, 120, 150);
    ellipse(leftEar.x - 20, leftEar.y - earOffset + 10, 60, 80);

    // Right Ear (Higher & Fluffier)
    fill(255, 180, 200);
    ellipse(rightEar.x + 20, rightEar.y - earOffset, 90, 110);
    fill(250, 120, 150);
    ellipse(rightEar.x + 20, rightEar.y - earOffset + 10, 60, 80);
}

function drawTinyCatNose(nose) {
    fill(255, 120, 150);
    noStroke();
    ellipse(nose.x, nose.y, 20, 15);
}

function drawSweetCatMouth(mouth, mouthHeight) {
    stroke(255, 100, 100);
    strokeWeight(4);
    noFill();

    // Gentle, soft smile
    arc(mouth.x - 10, mouth.y + 10, 25, mouthHeight, 0, PI);
    arc(mouth.x + 10, mouth.y + 10, 25, mouthHeight, 0, PI);
}

function drawDelicateWhiskers(nose) {
    stroke(255, 180, 200);
    strokeWeight(2);

    // Left Side (Curvier whiskers)
    bezier(nose.x - 20, nose.y + 5, nose.x - 60, nose.y - 10, nose.x - 80, nose.y + 30, nose.x - 100, nose.y);
    bezier(nose.x - 20, nose.y + 15, nose.x - 60, nose.y, nose.x - 80, nose.y + 40, nose.x - 100, nose.y + 10);
    bezier(nose.x - 20, nose.y + 25, nose.x - 60, nose.y + 10, nose.x - 80, nose.y + 50, nose.x - 100, nose.y + 20);

    // Right Side (Curvier whiskers)
    bezier(nose.x + 20, nose.y + 5, nose.x + 60, nose.y - 10, nose.x + 80, nose.y + 30, nose.x + 100, nose.y);
    bezier(nose.x + 20, nose.y + 15, nose.x + 60, nose.y, nose.x + 80, nose.y + 40, nose.x + 100, nose.y + 10);
    bezier(nose.x + 20, nose.y + 25, nose.x + 60, nose.y + 10, nose.x + 80, nose.y + 50, nose.x + 100, nose.y + 20);
}


function scalePoint(pt) {
    let x = map(pt[0], 0, video.width, 0, width);
    let y = map(pt[1], 0, video.height, 0, height);
    return createVector(x, y);
}

async function getFace() {
    const predictions = await model.estimateFaces(document.querySelector("video"), false);
    face = predictions.length > 0 ? predictions[0] : undefined;
}
