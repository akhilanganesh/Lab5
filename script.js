// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const clearBtn = document.querySelector("[type='reset']");
const readTxtBtn = document.querySelector("[type='button']");
const generateBtn = document.querySelector("[type='submit']");
const canvas = document.getElementById('user-image');
const voiceSelector = document.getElementById('voice-selection');
const ctx = canvas.getContext('2d');

const volumeSldr = document.getElementById('volume-group');
const vlmBar = volumeSldr.querySelector("[type='range']");
const vlmImg = volumeSldr.querySelector("img");

let volume = vlmBar.value/100.0;

function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  let voices = speechSynthesis.getVoices();

  // if the system has voices, then we get rid of the 'no available voice options' option and enable the selector
  if(voices.length > 0) {
    document.querySelector('#voice-selection > option').remove();
    voiceSelector.disabled = false;
    
    // loop through the voices and add them as options to the selector
    for(let i = 0; i < voices.length; i++) {
      let option = document.createElement('option');
      option.label = voices[i].name + ' (' + voices[i].lang + ')';

      if(voices[i].default) {
        option.label += ' -- DEFAULT';
      }

      option.value = voices[i].lang;
      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voiceSelector.appendChild(option);
    }
  }
}

// make sure to update list as more voices are added
populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const imgDims = getDimensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, imgDims.startX, imgDims.startY, imgDims.width, imgDims.height);

  generateBtn.disabled = false;
  clearBtn.disabled = true;
  readTxtBtn.disabled = true;
});

const imgInput = document.getElementById('image-input');
imgInput.addEventListener('change', () => {
  img.src = URL.createObjectURL(imgInput.files[0]);
  img.alt = imgInput.files[0].name;
  canvas.alt = imgInput.files[0].name;

});

const form = document.getElementById('generate-meme');
const topText = document.getElementById('text-top');
const bottomText = document.getElementById('text-bottom');
form.addEventListener('submit', (event) => {
  // prevents form from refreshing and being cleared on submit
  event.preventDefault();

  // text retrieval and rendering
  const top = topText.value.toUpperCase();
  const bottom = bottomText.value.toUpperCase();
  
  const txtOffset = 10;
  const fontSize = 50;
  
  ctx.font = fontSize + 'px arial';
  ctx.fillStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';

  const topWidth = ctx.measureText(top).width;
  const topHeight = ctx.measureText(top).actualBoundingBoxAscent;
  const btmWidth = ctx.measureText(bottom).width;

  ctx.fillText(top, (canvas.width - topWidth) / 2, topHeight + txtOffset, canvas.width);
  ctx.strokeText(top, (canvas.width - topWidth) / 2, topHeight + txtOffset, canvas.width);
  
  ctx.fillText(bottom, (canvas.width - btmWidth) / 2, canvas.height - txtOffset, canvas.width);
  ctx.strokeText(bottom, (canvas.width - btmWidth) / 2, canvas.height - txtOffset, canvas.width);

  // changing button enables
  generateBtn.disabled = true;
  clearBtn.disabled = false;
  readTxtBtn.disabled = false;
});

clearBtn.addEventListener('click', (event) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // prevents form from refreshing and being cleared on submit
  event.preventDefault();

  clearBtn.disabled = true;
  readTxtBtn.disabled = true;
  generateBtn.disabled = false;
});

readTxtBtn.addEventListener('click', () => {
  const top = topText.value.toUpperCase();
  const bottom = bottomText.value.toUpperCase();

  let utterance = new SpeechSynthesisUtterance(top + ' ' + bottom);
  utterance.lang = voiceSelector.value;
  utterance.volume = volume;
  speechSynthesis.speak(utterance);
});



const iconArr = [];
iconArr.length = 4;
for (let i = 0; i < iconArr.length; i++) 
  iconArr[i] = "icons/volume-level-" + i + ".svg";

volumeSldr.addEventListener('input', () => {
  let vol = vlmBar.value;
  let level = 3;
  if (vol >= 67) level = 3;
  else if (vol >= 34) level = 2;
  else if (vol >= 1) level = 1;
  else vlmImg.src = level = 0;
  vlmImg.src = iconArr[level];
  vlmImg.alt = "Volume Level " + level;

  volume = vol/100.0;
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
