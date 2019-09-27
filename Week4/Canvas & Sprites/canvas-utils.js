function createSprites(num = 20) {
    // create array to hold all of our sprites
    let sprites = [];
    for (let i = 0; i < num; i++) {
        // determine random properties and instantiate new RingSprite
        let x = Math.random() * (canvasWidth - 100) + 50;
        let y = Math.random() * (canvasHeight - 100) + 50;
        let span = 15 + Math.random() * 25;
        let fwd = getRandomUnitVector();
        let speed = Math.random() + 2;
        let color = getRandomColor();
        let s = new RingSprite(x, y, span, fwd, speed, color);

        // add to array
        sprites.push(s);
    } // end for

    // return  array
    return sprites;
}
