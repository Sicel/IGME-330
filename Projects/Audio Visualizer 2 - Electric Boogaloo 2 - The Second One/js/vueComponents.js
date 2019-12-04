export let controlSection = {
    props: [`title`, `effects`, `options`],
    template: `
        <div class="sControl">
            <div class="controlHeading">
                <p class="downArrow"></p>
                <h1>{{ title }}</h1>
            </div>
            <div class="controlSection">
                <h3 class="sectionHeader">Effects</h3>
                <section class="effects" v-html="effects"></section>

                <h3 class="sectionHeader">Options</h3>
                <section class="options" v-html="options"></section>
            </div>
        </div>
    `
}

export let audioDiv = {
    effects: `
        <div class="control">
            <input type="checkbox" id="distortion" v-model="distortionEnabled">
            <label title="Distorts the audio (set to 1 to really see the high frequency circle)">Distortion</label>
        </div>
        <div class="control effectInfo" id="distortionInfo">
            <label>Amount:</label>
            <div class="effectRange">
                <input type="range" min="0" max="100" value="0" id="distortionSlider" :value="distortionAmount" @input="e => distortionAmount = e.target.value">
                <label id="distortionAmount" v-model="distortionAmount">0</label>
            </div>
        </div>

        <div class="control">
            <input type="checkbox" id="lowShelf" v-model="lowShelfEnabled">
            <label title="Makes things bass-y">Low Shelf Filter</label>
        </div>
        <div class="control effectInfo" id="lowShelfInfo">
            <label title="Max frequency">Frequency Cutoff:</label>
            <div class="effectRange" id="lowShelfRange">
                <input type="range" min="0" max="1000" value="1000" id="lowShelfSlider" v-model="lowShelfAmount">
                <label id="lowShelfAmount" v-model="lowShelfAmount></label>
            </div>
        </div>

        <div class="control">
            <input type="checkbox" id="highShelf" v-model="highShelfEnabled">
            <label title="Makes things not bass-y">High Shelf Filter</label>
        </div>
        <div class="control effectInfo" id="highShelfInfo">
            <label title="Min Frequency">Frequency Cutoff:</label>
            <div class="effectRange">
                <input type="range" min="1000" max="2000" value="1000" id="highShelfSlider" v-model="highShelfAmount">
                <label id="highShelfAmount" v-model="highShelfAmount"></label>
            </div>
        </div>`,
    settings: ``
};

export let visualDiv = {
    effects: ``,
    settings: ``
}

let controlDiv = {
    props: ['name'],
    model: {
        event
    }
}
