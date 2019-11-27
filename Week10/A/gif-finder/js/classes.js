export class GiphyResult {
    constructor(result) {
        this.smallURL = result.images.fixed_width_small.url;
        if (!this.smallURL)
            this.smallURL = "images/no-images-found.png";

        this.gifURL = result.url;

        let line = `<div class='result'><img src='${this.smallURL}' title='${result.id}' /><p>Rated  ${result.rating.toUpperCase()}</p>`;
        line += `<span><a target='_blank' href='${this.gifURL}'>View on Giphy</a></span></div>`;
        this.line = line;
    }
}