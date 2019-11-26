export {
    selectedMode,
    currentColorMode,
    currentSongDuration,
    backgroundColor,
    includeBackground,
    useQuadCurves
};
import {
    convertToTime
} from './utils.js';

// General Controls
let controlsShowing = false,
    controlHeaders = document.querySelectorAll(".controlHeading"),
    downArrow = document.querySelector("#arrowContainer"),
    controls = document.querySelector("#controls"),
    playButton = document.querySelector("#play");

// Audio Controls
let songSelect = document.querySelector("#songSelect"),
    audioTime = document.querySelector("#audioTime"),
    lowShelf = document.querySelector("#lowShelf"),
    lowShelfInfo = document.querySelector("#lowShelfInfo"),
    lowShelfSlider = document.querySelector("#lowShelfSlider"),
    lowShelfAmount = document.querySelector("#lowShelfAmount"),
    highShelf = document.querySelector("#highShelf"),
    highShelfInfo = document.querySelector("#highShelfInfo"),
    highShelfSlider = document.querySelector("#highShelfSlider"),
    highShelfAmount = document.querySelector("#highShelfAmount"),
    distortion = document.querySelector("#distortion"),
    distortionInfo = document.querySelector("#distortionInfo"),
    distortionSlider = document.querySelector("#distortionSlider"),
    distortionAmount = document.querySelector("#distortionAmount");

let currentSongTime = 0,
    currentSongDuration = 222;

// Visual Controls
let mode = document.querySelector("#mode"),
    modes = ["source-atop", "destination-over", "destination-out", "lighter", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"],
    selectedMode = 'xor';

let gradMode = document.querySelectorAll("input[name='gradMode']"),
    colorPicker = document.querySelector("#colorPicker"),
    includeBackground = document.querySelector('#includeBackground'),
    backgroundColorElement = document.querySelector('#backgroundColor'),
    useQuadCurves = document.querySelector("#quadCurves"),
    currentColorMode = 'grad',
    backgroundColor = '#fff',
    colorPickerClicked = false;

// Sets up ui controls 
export function setupUI(audio, ctx) {
    audio.element.onloadedmetadata = e => {
        updateTime(0, e.target.duration)
    };

    downArrow.onclick = e => {
        controlsShowing = !controlsShowing;
        showControls();
    };

    playButton.onclick = e => {
        // check if context is in suspended state (autoplay policy)
        if (audio.ctx.state == "suspended") {
            audio.ctx.resume();
        }

        if (e.target.dataset.playing == "no") {
            audio.element.play();
            e.target.dataset.playing = "yes";
            e.target.innerHTML = "Pause";
            // if track is playing pause it
        } else if (e.target.dataset.playing == "yes") {
            audio.element.pause();
            e.target.dataset.playing = "no";
            e.target.innerHTML = "Play";
        }
    };

    for (let i = 0; i < controlHeaders.length; i++) {
        controlHeaders[i].onclick = _ => {
            showSection(controlHeaders[i]);
        };
    }

    songSelect.onchange = e => {
        audio.element.src = e.target.value;
        if (playButton.dataset.playing == "yes")
            playButton.dispatchEvent(new MouseEvent("click"));
    };

    setupVisualUI(ctx);
    setupAudioUI(audio);

}

// Sets up visual section controls
function setupVisualUI(ctx) {
    // Populates the blend mode element
    for (let i = 0; i < modes.length; i++) {
        let option = document.createElement("option");
        option.innerHTML = modes[i];
        let attr = document.createAttribute("value");
        if (modes[i] == selectedMode)
            option.selected = true;
        attr.value = modes[i];
        option.setAttributeNode(attr);
        mode.appendChild(option);
    }

    mode.onchange = e => {
        selectedMode = e.target.value;
        ctx.globalCompositeOperation = selectedMode;
    };

    //colorMode.onchange = e => currentColorMode = e.target.value;
    for (let gMode of gradMode) {
        gMode.onclick = e => currentColorMode = e.target.value;
        if (gMode.checked) {
            currentColorMode = gMode.value;
        }
    }

    // Allows the background to change while color is being selected
    colorPicker.onclick = e => {
        if (!colorPickerClicked) {
            e.target.jscolor.onFineChange = function () {
                updateColor(e.target.jscolor);
            };
            colorPickerClicked = true;
        }
    }

    includeBackground.onclick = e => {
        if (e.target.checked)
            backgroundColorElement.style.display = 'flex';
        else
            backgroundColorElement.style.display = 'none'
    }
}

// Sets up audio section controls
function setupAudioUI(audio) {
    highShelf.onchange = e => {
        if (highShelf.checked) {
            highShelfInfo.style.display = "block";
        } else {
            highShelfInfo.style.display = "none";
        }
        toggleHighShelf(audio);
    };
    toggleHighShelf(audio);

    lowShelf.onchange = e => {
        if (lowShelf.checked) {
            lowShelfInfo.style.display = "block";
        } else {
            lowShelfInfo.style.display = "none";
        }
        toggleLowShelf(audio);
    };
    toggleLowShelf(audio);

    distortion.onchange = e => {
        if (distortion.checked) {
            distortionInfo.style.display = "block";
        } else {
            distortionInfo.style.display = "none";
        }
        toggleDistortion(audio);
    };

    highShelfSlider.oninput = e => {
        highShelfAmount.innerHTML = e.target.value;
        toggleHighShelf(audio);
    };
    lowShelfSlider.oninput = e => {
        lowShelfAmount.innerHTML = e.target.value;
        toggleLowShelf(audio);
    };
    distortionSlider.oninput = e => {
        distortionAmount.innerHTML = e.target.value;
        toggleDistortion(audio);
    };
}

//------Taken from week 5 example------//
function toggleHighShelf(audio) {

    if (highShelf.checked) {
        audio.highShelfBiquadFilter.frequency.setValueAtTime(Number(highShelfAmount.innerHTML), audio.ctx.currentTime);
        audio.highShelfBiquadFilter.gain.setValueAtTime(25, audio.ctx.currentTime);
    } else {
        audio.highShelfBiquadFilter.gain.setValueAtTime(0, audio.ctx.currentTime);
    }
}

function toggleLowShelf(audio) {

    if (lowShelf.checked) {
        audio.lowShelfBiquadFilter.frequency.setValueAtTime(Number(lowShelfAmount.innerHTML), audio.ctx.currentTime);
        audio.lowShelfBiquadFilter.gain.setValueAtTime(15, audio.ctx.currentTime);
    } else {
        audio.lowShelfBiquadFilter.gain.setValueAtTime(0, audio.ctx.currentTime);
    }
}

function toggleDistortion(audio) {

    if (distortion.checked) {
        audio.distortionFilter.curve = null; // being paranoid and trying to trigger garbage collection
        audio.distortionFilter.curve = makeDistortionCurve(Number(distortionAmount.innerHTML));
    } else {
        audio.distortionFilter.curve = null;
    }
}

// from: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
function makeDistortionCurve(amount = 20) {
    let n_samples = 256,
        curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
        let x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}
//------Taken from week 5 example------//

// Displays controls section
function showControls() {
    if (controlsShowing) {
        downArrow.style.transform = "translate(0, -1px)";
        controls.style.transform = `translate(0, 0)`;
    } else {
        downArrow.style.transform = `translate(0, ${-controls.offsetHeight - 1}px)`;
        controls.style.transform = `translate(0, ${-controls.offsetHeight}px)`;
    }
}

// Reveals a section (Audio or Visual) when clicked on its name 
function showSection(header) {
    let arrow = header.firstElementChild;
    let content = header.nextElementSibling;

    if (header.dataset.showing == "false") {
        content.style.animationPlayState = "resume";
        content.style.display = "block";
        content.style.visibility = "visible";
        arrow.style.transform = "rotate(45deg)";
        header.dataset.showing = "true";
    } else {
        content.style.animationPlayState = "pause";
        content.style.display = "none";
        content.style.visibility = "hidden";
        arrow.style.transform = "rotate(-45deg)";
        header.dataset.showing = "false";
    }
}

// Updates song time while playing
export function updateTime(time, songDuration = currentSongDuration) {
    audioTime.innerHTML = `${convertToTime(time)} / ${convertToTime(songDuration)}`;
    currentSongDuration = songDuration;
}

// Updates background based on currentcolor chosen
function updateColor(jscolor) {
    backgroundColor = `#${jscolor}`;
}
