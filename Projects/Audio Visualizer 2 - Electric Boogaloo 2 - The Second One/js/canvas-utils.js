export const canvas = {
    ctx: null,
    gradient: null,
    init(width, height, mode) {
        this.ctx = document.querySelector('#canvas').getContext('2d');
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;
        this.blendMode = mode;
    },
    resize(width, height, mode) {
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;
        this.defaultGradient();
        this.blendMode = mode;
        this.ctx.strokeStyle = this.gradient;
    },
    defaultGradient() {
        this.gradient = this.ctx.createRadialGradient(this.halfWidth, this.halfHeight, 1, this.halfWidth, this.halfHeight, this.max);

        this.gradient.addColorStop(0, '#fff');
        this.gradient.addColorStop(1 / 6, '#0088FF');
        this.gradient.addColorStop(1 / 3, '#FFAA00');
        this.gradient.addColorStop(1 / 2, '#FF7700');
        this.gradient.addColorStop(2 / 3, '#FF0033');
        this.gradient.addColorStop(5 / 6, '#9911AA');
        this.gradient.addColorStop(1, '#AADD22');

        this.ctx.strokeStyle = this.gradient;

    },
    rgbGradient(r, g, b) {
        this.gradient = this.ctx.createRadialGradient(this.halfWidth, this.halfHeight, 1, this.halfWidth, this.halfHeight, this.max);
        this.gradient.addColorStop(0, `rgb( ${r}, 0, 0)`);
        this.gradient.addColorStop(1 / 3, `rgb(0, ${g}, 0)`);
        this.gradient.addColorStop(2 / 3, `rgb(0, 0, ${b})`);

        this.ctx.strokeStyle = this.gradient;
    },
    customGradient(colors) {
        this.gradient = this.ctx.createRadialGradient(this.halfWidth, this.halfHeight, 1, this.halfWidth, this.halfHeight, this.max);

        for (let i = 0; i < colors.length; i++) {
            let currentStop = i / (color.length - 1);
            this.gradient.addColorStop(currentStop, colors[i]);
        }

        this.ctx.strokeStyle = this.gradient;
    },
    set blendMode(mode) {
        this.ctx.globalCompositeOperation = mode;
    },
    get width() {
        return this.ctx.canvas.width;
    },
    get height() {
        return this.ctx.canvas.height;
    },
    get halfWidth() {
        return this.width / 2;
    },
    get halfHeight() {
        return this.height / 2;
    },
    get max() {
        return this.width >= this.height ? this.width : this.height;
    }
}

let ctx;

let gradient;

function initCanvas(width, height, mode) {
    ctx = document.querySelector('#canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    setBlendMode(mode);
}

function setBlendMode(mode) {
    ctx.globalCompositeOperation = mode;
}

function resizeCanvas(width, height, mode) {
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    setGradient();
    setBlendMode(mode);
    ctx.strokeStyle = gradient;
}

// Creates rainbow gradient
function setGradient() {
    gradient = ctx.createRadialGradient(getHalfWidth(), getHalfHeight(), 1, getHalfWidth(), getHalfHeight(), getMax());

    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(1 / 6, '#0088FF');
    gradient.addColorStop(1 / 3, '#FFAA00');
    gradient.addColorStop(1 / 2, '#FF7700');
    gradient.addColorStop(2 / 3, '#FF0033');
    gradient.addColorStop(5 / 6, '#9911AA');
    gradient.addColorStop(1, '#AADD22');

    ctx.strokeStyle = gradient;
}

// Creates RGB gradient based on frequency values 
function setRGBGradient(r, g, b) {
    gradient = ctx.createRadialGradient(getHalfWidth(), getHalfHeight(), 1, getHalfWidth(), getHalfHeight(), getMax());

    gradient.addColorStop(0, `rgb( ${r}, 0, 0)`);
    gradient.addColorStop(.5, `rgb(0, ${g}, 0)`);
    gradient.addColorStop(1, `rgb(0, 0, ${b})`);

    ctx.strokeStyle = gradient;
}

function setCustomGradient(colors) {
    gradient = ctx.createRadialGradient(getHalfWidth(), getHalfHeight(), 1, getHalfWidth(), getHalfHeight(), getMax());

    for (let i = 0; i < colors.length; i++) {
        let currentStop = i / (color.length - 1);
        gradient.addColorStop(currentStop, colors[i]);
    }

    ctx.strokeStyle = gradient;
}

function getMax() {
    return getWidth() >= getHeight() ? getWidth : getHeight();
}

function getWidth() {
    return ctx.canvas.width;
}

function getHeight() {
    return ctx.canvas.height;
}

function getHalfWidth() {
    return getWidth() / 2;
}

function getHalfHeight() {
    return getHeight / 2;
}
