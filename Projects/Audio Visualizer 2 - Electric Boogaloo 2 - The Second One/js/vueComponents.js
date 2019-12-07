export let controlSection = {
    props: [`title`],
    template: `
        <div class="sControl">
            <div class="controlHeading">
                <p class="downArrow"></p>
                <h1>{{ title }}</h1>
            </div>
            <div class="controlSection">
                <h3 class="sectionHeader">Effects</h3>

                <h3 class="sectionHeader">Options</h3>
            </div>
        </div>
    `
}

export let audioDiv = {
    props: ['title'],
    template: `
        <div class="sControl">
            <div class="controlHeading">
                <p class="downArrow"></p>
                <h1>{{ title }}</h1>
            </div>
            <div class="controlSection">
                <h3 class="sectionHeader">Effects</h3>
                    <slideControl v-bind:controlType='distortion'></slideControl>
                    <slideControl v-bind:controlType='lowShelf'></slideControl>
                    <slideControl v-bind:controlType='highShelf'></slideControl>

                <h3 class="sectionHeader">Options</h3>
            </div>
        </div>`,
};

export let visualDiv = {
    effects: ``,
    settings: ``
}

let slideControl = {
    props: ['controlType'],
    template: `
        <div class='control'>
            <input type='checkbox' v-model='controlType.enabled'></input>
            <label>{{controlType.name}}</label>
        </div>
        <div class='control'>
            <label>{{controlType.sliderLabel}}</label>
            <template v-if='controlType.enabled'>
                <div class='effectRange'>
                    <input v-bind:min='controlType.min' v-bind:max='controlType.max' v-model='controlType.amount'></input>
                    <label v-model='controlType.amount'></label>
                </div>
            </template>
        </div>`
}
