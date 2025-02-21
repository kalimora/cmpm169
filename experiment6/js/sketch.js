// sketch.js - Mood Tracker
// Author: Kaylee Morales
// Date: 02/24/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
// Globals
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Days in each month for a common year
let cellSize = 20; // Size of each day cell
let canvasContainer;
let input, updateButton, saveButton, year, notesTextArea;
let dayColors = []; // Array to store colors for each day
let dayNotes = new Array(365).fill(""); // Store notes for each day
let selectedColor = "#FFFFFF"; // Default color
let moods = {
    "Happy": "#FFD700",
    "Sad": "#87CEEB",
    "Angry": "#FF6347",
    "Excited": "#7FFF00"
};

function setup() {
    canvasContainer = select('#canvas-container');
    let canvas = createCanvas(canvasContainer.width, canvasContainer.height);
    canvas.parent('canvas-container');
    textSize(10);
    noLoop();

    input = createInput('');
    input.position(55, 100);
    input.size(100);
    input.attribute('placeholder', 'Enter Year');

    updateButton = createButton('Update Calendar');
    updateButton.position(input.x + input.width + 10, 100);
    updateButton.mousePressed(updateCalendar);

    saveButton = createButton('Save Data');
    saveButton.position(updateButton.x + updateButton.width + 50, 100);
    saveButton.mousePressed(saveData);

    let xPosition = saveButton.x + saveButton.width + 20;
    for (const [mood, color] of Object.entries(moods)) {
        let button = createButton(mood);
        button.position(xPosition + 130, 100);
        button.mousePressed(() => selectedColor = color);
        xPosition += button.width + 10;
    }

    notesTextArea = createElement('textarea', '');
    notesTextArea.position(80, 430);
    notesTextArea.size(780, 90);
    notesTextArea.attribute('placeholder', 'Click a day to add/view notes...');

    year = new Date().getFullYear();
    loadData();
    drawCalendar();
}

function drawCalendar() {
    background(255);
    let currentDayIndex = getCurrentDayIndex();
    let dayIndex = 0;

    for (let m = 0; m < months.length; m++) {
        let days = monthDays[m];
        noFill();
        stroke(0);
        text(months[m], 5, m * cellSize + cellSize / 2 + 50);

        for (let d = 0; d < 31; d++) {
            let x = d * cellSize + 40;
            let y = m * cellSize + 50;
            if (d < days) {
                fill(dayColors[dayIndex]);
                stroke(0);
                if (dayIndex === currentDayIndex) {
                    strokeWeight(2);
                    stroke('#FF0000');
                } else {
                    strokeWeight(1);
                }
                rect(x, y, cellSize, cellSize);
                dayIndex++;
            } else {
                fill(240);
                rect(x, y, cellSize, cellSize);
            }
        }
    }
}

function updateCalendar() {
    year = parseInt(input.value());
    if (isNaN(year)) {
        alert("Please enter a valid year.");
        return;
    }
    loadData();
    drawCalendar();
}

function saveData() {
    localStorage.setItem('colors-' + year, JSON.stringify(dayColors));
    localStorage.setItem('notes-' + year, JSON.stringify(dayNotes));
    alert('Data saved successfully!');
}

function loadData() {
    let storedColors = localStorage.getItem('colors-' + year);
    let storedNotes = localStorage.getItem('notes-' + year);
    if (storedColors && storedNotes) {
        dayColors = JSON.parse(storedColors);
        dayNotes = JSON.parse(storedNotes);
    } else {
        initializeColors();
    }
}

function initializeColors() {
    dayColors = new Array(365).fill('#FFFFFF');
    dayNotes = new Array(365).fill("");
}

function getCurrentDayIndex() {
    let today = new Date();
    let firstDayOfYear = new Date(today.getFullYear(), 0, 0);
    let diff = today - firstDayOfYear;
    let oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function mousePressed() {
    if (mouseY > 50 && mouseY < height) {
        let col = Math.floor((mouseX - 40) / cellSize);
        let row = Math.floor((mouseY - 50) / cellSize);
        let dayIndex = sumDays(row) + col;

        if (col < monthDays[row] && dayIndex < dayColors.length) {
            dayColors[dayIndex] = selectedColor; // Update color of selected day
            notesTextArea.value(dayNotes[dayIndex]);
            notesTextArea.input(() => {
                dayNotes[dayIndex] = notesTextArea.value();
            });
            drawCalendar(); // Redraw the calendar with updated colors
        }
    }
}

function sumDays(monthIndex) {
    let sum = 0;
    for (let i = 0; i < monthIndex; i++) {
        sum += monthDays[i];
    }
    return sum;
}


function windowResized() {
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // Reposition elements based on the new canvas size
  input.position(canvas.position().x + 10, canvas.position().y + 10);
  updateButton.position(input.x + input.width + 10, input.y);
  saveButton.position(updateButton.x + updateButton.width + 10, updateButton.y);

  let xPosition = saveButton.x + saveButton.width + 20;
  for (const [mood, color] of Object.entries(moods)) {
      let button = select(mood);
      button.position(xPosition, saveButton.y);
      xPosition += button.width + 10;
  }

  notesTextArea.position(canvas.position().x + 10, canvas.position().y + height + 10);
  notesTextArea.size(width - 20, 90);
  drawCalendar();
}


