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

    draw(ctx, lineWidth = 10) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.restore();
        this.radius += this.radius * this.speed;
    }

    radius() {
        return this.radius;
    }
}
