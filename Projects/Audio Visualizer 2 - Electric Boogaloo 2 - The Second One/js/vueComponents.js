export let audioDiv = {
    props: {
        effects: Array,
        inTypes: Object
    },
    template: `
        <div class="sControl">
            <div class="controlHeading">
                <p class="downArrow"></p>
                <h1>Audio</h1>
            </div>
            <div class="controlSection">
                <h3 class="sectionHeader">Effects</h3>
                    <hider v-for="effect in effects" :control-type="effect" :in-type="inTypes.slider"></hider> 
            </div>
        </div>`,
};

export let visualDiv = {
    props: {
        options: Object,
        inTypes: Object
    },
    template: `
        <div class="sControl">
            <div class="controlHeading">
                <p class="downArrow"></p>
                <h1>Visual</h1>
            </div>
            <div class="controlSection">
                <h3 class="sectionHeader">Effects</h3>
                <h3 class="sectionHeader">Options</h3>
                    <!--
                    <hider :control-type="options.colorPicker" :in-type="inTypes.colorPicker"></hider>
                    -->
                    <color-picker :control-type="options.colorPicker"></color-picker>
            </div>
        </div>`
}

export let slider = {
    props: {
        controlType: Object
    },
    template: `
        <div class='control'>
            <label>{{controlType.sliderLabel}}</label>
            <div class='effectRange'>
                <input type="range" :min='controlType.min' :max='controlType.max' v-model='controlType.amount'></input>
                <label v-text='controlType.amount'></label>
            </div>
        </div>`
}

Vue.component('hider', {
    props: {
        inType: Object,
        controlType: Object
    },
    template: `
    <div class="controlBlock">
        <div class='control'>
            <input type='checkbox' v-model="controlType.enabled"></input>
            <label v-text="controlType.name"></label>
        </div>
        <template v-if="controlType.enabled">
            <component :is="inType" :control-type="controlType"></component>
        </template>
    </div>`
})

export let colorPicker = {
    props: {
        controlType: Object
    },
    template: `
    <div id="backgroundColor" class="control">
        <label v-text="controlType.label"></label>
        <input ref="colorPicker" type="text">
    </div>`,
    mounted() {
        this.controlType.picker = new CP(this.$refs.colorPicker);
        this.controlType.picker.on("drag", function (color) {
            console.log(this);
        })
        console.log(this.controlType);
    }
}

Vue.component('color-picker', colorPicker);
