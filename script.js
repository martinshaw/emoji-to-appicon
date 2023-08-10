/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.js
Created:  2023-08-10T02:11:07.993Z
Modified: 2023-08-10T02:11:07.993Z

Description: description
*/

document.addEventListener("DOMContentLoaded", function () {

    const debug = (message, isHeading, ...optionalParams) => { console.log(`%c${message}`, `font-size: ${isHeading ? '.95rem' : '0.8rem'}`, ...optionalParams) };

    debug('Emoji to App Icon Generator by Martin Shaw', true);
    debug('Do you want to see the current state? type window.state in this console and press enter');

    const state = {
        elements: {
            emojiPicker: document.querySelector("emoji-picker"),
            shape: document.querySelector("#shape"),
            borderWidth: document.querySelector("#border-width"),
            borderColour: document.querySelector("#border-colour"),
            backgroundColour: document.querySelector("#background-colour"),
            shadowBlur: document.querySelector("#shadow-blur"),
            shadowX: document.querySelector("#shadow-x"),
            shadowY: document.querySelector("#shadow-y"),
            shadowColour: document.querySelector("#shadow-colour"),
            generateButton: document.querySelector("#generate"),
            output: document.querySelector(".output"),
            canvas: document.querySelector("canvas"),
        },
        data: {
            currentEmojiFont: '"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji", "Source Sans Pro", sans-serif',
            currentEmoji: null,
            currentShape: 'circle', // 'just-emoji' | 'circle' | 'square | 'squircle'
            currentBorderWidth: 30,
            currentBorderColour: "#000000",
            currentBackgroundColour: "#ffffff",
            currentShadowBlur: 20,
            currentShadowX: 0,
            currentShadowY: 0,
            currentShadowColour: "#555555",
            canvasDimension: null,
        },
    };

    window.state = state;
    
    const setElementValuesFromCurrentStateData = () => {
        state.elements.shape.value = state.data.currentShape;
        state.elements.borderWidth.value = state.data.currentBorderWidth;
        state.elements.borderColour.value = state.data.currentBorderColour;
        state.elements.backgroundColour.value = state.data.currentBackgroundColour;
        state.elements.shadowBlur.value = state.data.currentShadowBlur;
        state.elements.shadowX.value = state.data.currentShadowX;
        state.elements.shadowY.value = state.data.currentShadowY;
        state.elements.shadowColour.value = state.data.currentShadowColour;
    };

    setElementValuesFromCurrentStateData();

    const determineCanvasSizeFromElement = () => {
        const dpr = window.devicePixelRatio;

        const smallestWidthOrHeightOfCanvasContainer = Math.min(state.elements.output.clientWidth, state.elements.output.clientHeight);
        const oneOneAspectDimensionWithMargin = smallestWidthOrHeightOfCanvasContainer - 20;

        state.elements.canvas.width = oneOneAspectDimensionWithMargin * dpr;
        state.elements.canvas.height = oneOneAspectDimensionWithMargin * dpr;
        
        state.data.canvasDimension = oneOneAspectDimensionWithMargin * dpr;
    };

    determineCanvasSizeFromElement();

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    const drawJustEmoji = (ctx) => {        
        const circleRadius = Math.min(state.data.canvasDimension, state.data.canvasDimension) / 2;
        const circleCentreX = state.data.canvasDimension / 2;
        const circleCentreY = state.data.canvasDimension / 2;

        const innerCircleRadius = circleRadius - state.data.currentBorderWidth;
        
        ctx.beginPath();

        ctx.shadowColor = state.data.currentShadowColour;
        ctx.shadowBlur = state.data.currentShadowBlur;
        ctx.shadowOffsetX = state.data.currentShadowX;
        ctx.shadowOffsetY = state.data.currentShadowY;

        ctx.font = `${innerCircleRadius}px ${state.data.currentEmojiFont}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(state?.data?.currentEmoji?.unicode || '', circleCentreX, circleCentreY + (innerCircleRadius * .1));

        ctx.shadowColor = 'none';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.closePath();
    };

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    const drawCircle = (ctx) => {
        const outerCircleMargin = state.data.canvasDimension * .075;
        
        const circleRadius = (Math.min(state.data.canvasDimension, state.data.canvasDimension) / 2) - outerCircleMargin;
        const circleCentreX = state.data.canvasDimension / 2;
        const circleCentreY = state.data.canvasDimension / 2;

        ctx.beginPath();
        ctx.shadowColor = state.data.currentShadowColour;
        ctx.shadowBlur = state.data.currentShadowBlur;
        ctx.shadowOffsetX = state.data.currentShadowX;
        ctx.shadowOffsetY = state.data.currentShadowY;
        ctx.arc(circleCentreX, circleCentreY, circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = state.data.currentBorderColour;
        ctx.fill();
        ctx.closePath();

        ctx.shadowColor = 'none';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        const innerCircleRadius = circleRadius - state.data.currentBorderWidth;

        ctx.beginPath();
        ctx.arc(circleCentreX, circleCentreY, innerCircleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = state.data.currentBackgroundColour;
        ctx.fill();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.font = `${innerCircleRadius}px ${state.data.currentEmojiFont}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(state?.data?.currentEmoji?.unicode || '', circleCentreX, circleCentreY + (innerCircleRadius * .1));
        ctx.closePath();
    };

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    const drawSquare = (ctx) => {
        const outerSquareMargin = state.data.canvasDimension * .075;

        ctx.beginPath();
        ctx.shadowColor = state.data.currentShadowColour;
        ctx.shadowBlur = state.data.currentShadowBlur;
        ctx.shadowOffsetX = state.data.currentShadowX;
        ctx.shadowOffsetY = state.data.currentShadowY;
        ctx.rect(outerSquareMargin, outerSquareMargin, state.data.canvasDimension - (outerSquareMargin * 2), state.data.canvasDimension - (outerSquareMargin * 2));
        ctx.fillStyle = state.data.currentBorderColour;
        ctx.fill();
        ctx.closePath();

        ctx.shadowColor = 'none';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath();
        ctx.rect(
            outerSquareMargin + state.data.currentBorderWidth, 
            outerSquareMargin + state.data.currentBorderWidth, 
            state.data.canvasDimension - (outerSquareMargin * 2) - (state.data.currentBorderWidth * 2), 
            state.data.canvasDimension - (outerSquareMargin * 2) - (state.data.currentBorderWidth * 2), 
        );
        ctx.fillStyle = state.data.currentBackgroundColour;
        ctx.fill();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.font = `${400 - state.data.currentBorderWidth}px ${state.data.currentEmojiFont}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(state?.data?.currentEmoji?.unicode || '', state.data.canvasDimension / 2, state.data.canvasDimension / 2 + 26);
        ctx.closePath();
    };

    const drawCanvas = () => {        
        const dpr = window.devicePixelRatio;
        const ctx = state.elements.canvas.getContext("2d");

        ctx.clearRect(0, 0, state.data.canvasDimension, state.data.canvasDimension);

        ctx.scale(dpr, dpr);

        if (state.data.currentShape === 'just-emoji') {
            drawJustEmoji(ctx);
        }

        if (state.data.currentShape === 'circle') {
            drawCircle(ctx);
        }

        else if (state.data.currentShape === 'square') {
            drawSquare(ctx);
        }

        else if (state.data.currentShape === 'squircle') {
            alert('Squircle shape coming soon!');
        }
    }

    drawCanvas();

    const resizeImage = (url, width, height, callback) => {
        var sourceImage = new Image();
    
        sourceImage.onload = function() {
            // Create a canvas with the desired dimensions
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
    
            // Scale and draw the source image to the canvas
            canvas.getContext("2d").drawImage(sourceImage, 0, 0, width, height);
    
            // Convert the canvas to a data URL in PNG format
            callback(canvas.toDataURL());
        }
    
        sourceImage.src = url;
    };

    const generateAllMacOsPngImages = (zip, doneCallback) => {
        const sizes = ['16x16', '24x24', '32x32', '48x48', '64x64', '96x96', '128x128', '256x256', '512x512', '1024x1024'];

        const originalDataUrl = state.elements.canvas.toDataURL();

        const images = [];
        for (let index = 0; index < sizes.length; index++) {
            const size = sizes[index];

            const [x, y] = size.split('x');
            resizeImage(originalDataUrl, x, y, (resizedDataUrl) => {
                images[size] = {
                    url: size + '.png',
                    dataUrl: resizedDataUrl,
                };
            });
        }

        const checkIfAllImagesAreGenerated = setInterval(() => {
            if (Object.keys(images).length === sizes.length) {
                clearInterval(checkIfAllImagesAreGenerated);
        
                zip = zip.folder('Mac OS App Icons');

                Object.entries(images).forEach(async ([size, { url, dataUrl }]) => {
                    const substringPoint = dataUrl.indexOf('base64,') + 'base64,'.length;
                    const content = dataUrl.substring(substringPoint);

                    zip.file(url, content, {base64: true});
                });

                doneCallback();
            }
        }, 200);
    };

    const generateIcoImage = (zip, doneCallback) => {
        state.elements.canvas.toBlob(function(blob) {
            zip.file('favicon.ico', blob);
            zip.file('icon.ico', blob);
            doneCallback();
        }, 'image/vnd.microsoft.icon', '-moz-parse-options:format=bmp;bpp=32');
    };

    const generateFullSizePngImage = (zip, doneCallback) => {
        const originalDataUrl = state.elements.canvas.toDataURL();

        const substringPoint = originalDataUrl.indexOf('base64,') + 'base64,'.length;
        const content = originalDataUrl.substring(substringPoint);

        zip.file('icon.png', content, {base64: true});
        
        doneCallback();
    };

    const compressGeneratedImagesIntoZipFileAndDownload = async () => {
        var zip = new JSZip();

        generateAllMacOsPngImages(zip, () => {
            generateIcoImage(zip, () => {
                generateFullSizePngImage(zip, () => {

                    zip.generateAsync({ type:"blob" }).then(function(content) { saveAs(content, "icons.zip"); });

                });
            });
        });
    };

    const attachEventListenersForSettingStateDataFromElementValues = () => {
        state.elements.emojiPicker.addEventListener('emoji-click', (event, other) => {
            state.data.currentEmoji = event.detail;
            drawCanvas();
        })
        
        state.elements.emojiPicker.addEventListener('skin-tone-change', (event, other) => {
            //
            drawCanvas();
        })

        state.elements.shape.addEventListener("change", (event) => {
            state.data.currentShape = event.target.value;
            drawCanvas();
        });

        state.elements.borderWidth.addEventListener("change", (event) => {
            state.data.currentBorderWidth = Number(event.target.value);
            drawCanvas();
        });

        state.elements.borderColour.addEventListener("change", (event) => {
            state.data.currentBorderColour = event.target.value;
            drawCanvas();
        });

        state.elements.backgroundColour.addEventListener("change", (event) => {
            state.data.currentBackgroundColour = event.target.value;
            drawCanvas();
        });

        state.elements.shadowBlur.addEventListener("change", (event) => {
            state.data.currentShadowBlur = Number(event.target.value);
            drawCanvas();
        });

        state.elements.shadowX.addEventListener("change", (event) => {
            state.data.currentShadowX = Number(event.target.value);
            drawCanvas();
        });

        state.elements.shadowY.addEventListener("change", (event) => {
            state.data.currentShadowY = Number(event.target.value);
            drawCanvas();
        });

        state.elements.shadowColour.addEventListener("change", (event) => {
            state.data.currentShadowColour = event.target.value;
            drawCanvas();
        });

        state.elements.generateButton.addEventListener("click", (event) => {
            compressGeneratedImagesIntoZipFileAndDownload();
        });

        window.addEventListener("resize", () => {
            determineCanvasSizeFromElement();
            drawCanvas();
        });
    };

    attachEventListenersForSettingStateDataFromElementValues();
});