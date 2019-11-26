// Shapes able to be drawn on the canvas
class Shape {
    constructor(x = 0, y = 0, speed = .1, span = 10, color = "black") {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.span = span
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.rect(-this.span / 2, -this.span / 2, this.span, this.span);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

export class Circle extends Shape {
    constructor(startingRadius, speed = 1.5, x = 0, y = 0, span = 10, color = "black") {
        super(x = 0, y = 0, speed = .1, span = 10, color = "black");
        this.radius = startingRadius;
    }

    draw(ctx, locX = ctx.canvas.width / 2, locY = ctx.canvas.height / 2, lineWidth = 10) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(locX, locY, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.restore();
        this.radius += this.radius * this.speed;
    }

    drawRotating(ctx, locX = ctx.canvas.width / 2, locY = ctx.canvas.height / 2, radius = 3, lineWidth = 10) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI / 180);
        ctx.beginPath();
        ctx.arc(locX, locY, radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.lineWidth = lineWidth;
        //ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.restore();
    }

    radius() {
        return this.radius;
    }

    speed() {
        return this.speed;
    }
}

export class Line extends Shape {
    constructor(speed = 1.5, x = 0, y = 0, span = 10, color = "black") {
        super(x = 0, y = 0, speed = .1, span = 10, color = "black");
    }

    draw(ctx, startX, startY, endX, endY) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.closePath();
        ctx.lineWidth = this.span;
        ctx.stroke();
        ctx.restore();
    }
}

export class QuadCurve extends Shape {
    constructor(speed = 1.5, x = 0, y = 0, span = 10, color = "black") {
        super(x = 0, y = 0, speed = .1, span = 10, color = "black");
    }

    draw(ctx, startX, startY, controlX, controlY, endX, endY) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.closePath();
        ctx.lineWidth = this.span;
        ctx.stroke();
        ctx.restore();
    }

}
