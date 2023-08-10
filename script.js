/*
All Rights Reserved, (c) 2023 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: index.js
Created:  2023-08-10T02:11:07.993Z
Modified: 2023-08-10T02:11:07.993Z

Description: description
*/

document.addEventListener("DOMContentLoaded", function () {

    const state = {
        elements: {
            emojiPicker: document.querySelector("emoji-picker"),
            shape: document.querySelector("#shape"),
            // borderRadius: document.querySelector("#border-radius"),
            borderWidth: document.querySelector("#border-width"),
            borderColour: document.querySelector("#border-colour"),
            shadowBlur: document.querySelector("#shadow-blur"),
            shadowX: document.querySelector("#shadow-x"),
            shadowY: document.querySelector("#shadow-y"),
            shadowColour: document.querySelector("#shadow-colour"),
            output: document.querySelector(".output"),
            canvas: document.querySelector("canvas"),
        },
        data: {
            currentEmoji: null,
            currentShape: 'circle', // 'circle' | 'square | 'squircle'
            // currentBorderRadius: 14,
            currentBorderWidth: 30,
            currentBorderColour: "#000000",
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
        // state.elements.borderRadius.value = state.data.currentBorderRadius;
        state.elements.borderWidth.value = state.data.currentBorderWidth;
        state.elements.borderColour.value = state.data.currentBorderColour;
        state.elements.shadowBlur.value = state.data.currentShadowBlur;
        state.elements.shadowX.value = state.data.currentShadowX;
        state.elements.shadowY.value = state.data.currentShadowY;
        state.elements.shadowColour.value = state.data.currentShadowColour;
    };

    setElementValuesFromCurrentStateData();

    const determineCanvasSizeFromElement = () => {
        const smallestWidthOrHeightOfCanvasContainer = Math.min(state.elements.output.clientWidth, state.elements.output.clientHeight);
        const oneOneAspectDimensionWithMargin = smallestWidthOrHeightOfCanvasContainer - 20;

        state.elements.canvas.width = oneOneAspectDimensionWithMargin;
        state.elements.canvas.height = oneOneAspectDimensionWithMargin;
        
        state.data.canvasDimension = oneOneAspectDimensionWithMargin;
    };

    determineCanvasSizeFromElement();

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
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.font = `${innerCircleRadius}px serif`;
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
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.closePath();
        
        ctx.beginPath();
        ctx.font = `${400 - state.data.currentBorderWidth}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(state?.data?.currentEmoji?.unicode || '', state.data.canvasDimension / 2, state.data.canvasDimension / 2 + 26);
        ctx.closePath();
    };

    const drawCanvas = () => {
        const ctx = state.elements.canvas.getContext("2d");

        ctx.clearRect(0, 0, state.data.canvasDimension, state.data.canvasDimension);

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

        // state.elements.borderRadius.addEventListener("change", (event) => {
        //     state.data.currentBorderRadius = Number(event.target.value);
        //     drawCanvas();
        // });

        state.elements.borderWidth.addEventListener("change", (event) => {
            state.data.currentBorderWidth = Number(event.target.value);
            drawCanvas();
        });

        state.elements.borderColour.addEventListener("change", (event) => {
            state.data.currentBorderColour = event.target.value;
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

        window.addEventListener("resize", () => {
            determineCanvasSizeFromElement();
            drawCanvas();
        });
    };

    attachEventListenersForSettingStateDataFromElementValues();
});