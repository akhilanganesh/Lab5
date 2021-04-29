// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const clearBtn = document.querySelector("[type='reset']");
const readTxtBtn = document.querySelector("[type='button']");
const generateBtn = document.querySelector("[type='submit']");
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');

function renderImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const imgDims = getDimensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, imgDims.startX, imgDims.startY, imgDims.width, imgDims.height);
}

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  renderImage();

  generateBtn.disabled = false;
  clearBtn.disabled = true;
  readTxtBtn.disabled = true;

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const imgInput = document.getElementById('image-input');
imgInput.addEventListener('change', () => {
  img.src = URL.createObjectURL(imgInput.files[0]);
  img.alt = imgInput.files[0].name;
  //canvas.alt = imgInput.files[0].name;
});

const form = document.getElementById('generate-meme');
const topText = document.getElementById('text-top');
const bottomText = document.getElementById('text-bottom');
form.addEventListener('submit', (event) => {
  // prevents form from refreshing and being cleared on submit
  event.preventDefault();

  renderImage();

  // text retrieval and rendering
  let top = topText.value.toUpperCase();
  let bottom = bottomText.value.toUpperCase();
  
  const txtOffset = 0;
  const fontSize = 50;
  
  ctx.font = fontSize + 'px arial';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';

  const topWidth = ctx.measureText(top).width;
  const topHeight = ctx.measureText(top).height;
  const btmWidth = ctx.measureText(bottom).width;
  console.log(topHeight);

  ctx.fillText(top, (canvas.width - topWidth) / 2, topHeight + txtOffset, canvas.width);
  ctx.strokeText(top, (canvas.width - topWidth) / 2, topHeight + txtOffset, canvas.width);
  
  ctx.fillText(bottom, (canvas.width - btmWidth) / 2, canvas.height - txtOffset, canvas.width);
  ctx.strokeText(bottom, (canvas.width - btmWidth) / 2, canvas.height - txtOffset, canvas.width);

  // changing button enables
  generateBtn.disabled = true;
  clearBtn.disabled = false;
  readTxtBtn.disabled = false;
});

clearBtn.addEventListener('click', () => {
  clearBtn.disabled = true;
  readTxtBtn.disabled = true;
  generateBtn.disabled = false;
});

readTxtBtn.addEventListener('click', () => {
  
});

const volumeSldr = document.getElementById('volume-group');
volumeSldr.addEventListener('input', () => {
  
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
