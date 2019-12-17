import {
    canvas
} from './canvas-utils.js'

export let controlSection = {
    props: {
        name: String,
        section: Object,
        effects: Object,
        options: Object,
    },
    data() {
        return {
            showSection: false
        }
    },
    template: `
        <div class="sControl">
            <div class="controlHeading" @click="showSection=!showSection">
                <p class="downArrow"></p>
                <h1 v-text="name"></h1>
            </div>
            <template v-if="showSection">
                <component :is="section" :effects="effects" :options="options"></component>
            </template>
        </div>`,
};

export let audioDiv = {
    props: {
        effects: Object,
        options: Object,
    },
    template: `
            <div class="controlSection">
                <h3 class="sectionHeader">Effects</h3>
                    <hider v-for="effect in effects.sliders" :control-type="effect">
                        <slider :option="effect"></slider>
                    </hider>
            </div>`,
};

export let visualDiv = {
    props: {
        effects: Object,
        options: Object,
    },
    template: `
            <div class="controlSection">
                <h3 class="sectionHeader">Effects</h3>
                    <dropdown :option="effects.blendMode"></dropdown>
                    <radio-group :option="effects.gradients"></radio-group>

                <h3 class="sectionHeader">Options</h3>
                    <hider :control-type="options.colorPicker">
                        <color-picker :control-type="options.colorPicker"></color-picker>
                    </hider>
                    <checkbox :option="options.quadCurves"></checkbox>
            </div>`
}

Vue.component('cp', {
    props: {
        song: String,
        loaded: Boolean,
        buttonText: String
    },
    template: `
    <div id='cpDiv'>
        <slot></slot>
        <h4 id='cpHead'>Current Song: <slot name='time'></slot></h4>
        <p id='cp' v-text='song'></p>
    </div>`
})

Vue.component('search', {
    props: {
        value: String,
        find: Function
    },
    template: `
    <div id=search>
        <label>Search: </label>
        <input :value='value' @input="$emit('input', $event.target.value)" id='searchBar'>
        <button @click='find()' id='searchButton'>Search</button>
    </div>`
})

Vue.component('slider', {
    props: {
        option: Object
    },
    template: `
        <div class='control'>
            <label>{{option.sliderLabel}}</label>
            <div class='effectRange'>
                <template v-if='option.polls'>
                    <input type="range" :min='option.min' :max='option.max' v-model='option.amount' @input='option.update(option.amount)'></input>
                </template>
                <template v-else>
                    <input type="range" :min='option.min' :max='option.max' v-model='option.amount'></input>
                </template>
                <label v-text='option.amount'></label>
            </div>
        </div>`
})

Vue.component('hider', {
    props: {
        controlType: Object,
    },
    template: `
    <div>
        <div class='control'>
            <template v-if='controlType.polls'>
                <input type='checkbox' v-model="controlType.enabled" @change='controlType.toggle(controlType.enabled, controlType.amount)'></input>
            </template>
            <template v-else>
                <input type='checkbox' v-model="controlType.enabled"></input>
            </template>
            <label v-text="controlType.name"></label>
        </div>
        <template v-if="controlType.enabled">
            <slot><slot>
        </template>
    </div>`
})

Vue.component('color-picker', {
    props: {
        controlType: Object
    },
    template: `
    <div id="backgroundColor" class="control">
        <label v-text="controlType.label"></label>
        <input ref="colorPicker" type="color" @click="$event.preventDefault()">
    </div>`,
    mounted() {
        let self = this;
        self.controlType.picker = new CP(this.$refs.colorPicker);
        self.controlType.picker.on('create', function () {
            this.source.value = self.controlType.color;
        });
        self.controlType.picker.on("start", function (color, controlType) {
            this.source.value = `#${color}`;
            self.controlType.color = `#${color}`;
        });
        self.controlType.picker.on("drag", function (color, controlType) {
            this.source.value = `#${color}`;
            self.controlType.color = `#${color}`;
        });
    },
});

Vue.component('dropdown', {
    props: {
        option: Object
    },
    data() {
        return {
            toUpdate: null
        }
    },
    template: `
    <div class="control">
        <label v-text="option.name"></label>
        <select v-model='option.selected' @change="toUpdate.blendMode = option.selected">
            <option v-for="selection in option.selections" :value="selection">{{ selection }}</option>
        <select>
    </div>`,
    created() {
        this.toUpdate = canvas;
    }
})

Vue.component('radio-group', {
    props: {
        option: Object
    },
    template: `
    <div class="control">
        <label v-text="option.name"></label>
        <template v-for="selection in option.selections">
            <input type='radio' :value="selection.toLowerCase()" v-model='option.current'>
            <label v-text='selection'>
        </template>
    <div>`
})

Vue.component('checkbox', {
    props: {
        option: Object
    },
    template: `
    <div class="control">
        <input type="checkbox" v-model="option.enabled">
        <label v-text="option.name"></label>
    </div>`
})

Vue.component('lyrics', {
    props: {
        lyrics: String,
        screenWidth: Number
    },
    data() {
        return {
            showing: false
        }
    },
    template: `
    <div id='lyrics'>
        <div ref='rightArrow' class='container left' @click="display($event)">
            <p class='leftArrow'></p>
            <h3>Lyrics</h3>
        </div>
        
        <div id='lyricsDisplay' ref='lyricsDisplay'>
            <p v-text='lyrics'></p>
        </div>
    </div>`,
    mounted() {
        let arrow = this.$refs.rightArrow;
        let lyrics = this.$refs.lyricsDisplay;
        let aPos = arrow.getBoundingClientRect().left;
        let lPos = lyrics.getBoundingClientRect().right;

        arrow.style.transform = `translate(${-aPos}px, 0px)`;
        lyrics.style.transform = `translate(${-lPos}px, 0)`;
    },
    methods: {
        display(e) {
            let arrow = e.target;
            let lyrics = this.$refs.lyricsDisplay;

            let aHid = -arrow.getBoundingClientRect().left;
            let lHid = -lyrics.getBoundingClientRect().right;

            let aShow = aHid + lyrics.innerWidth;
            let lShow = lHid + lyrics.innerWidth;
            this.showing = !this.showing;

            if (this.showing) {
                arrow.style.transform = `translate(${aShow}px, 0)`;
                lyrics.style.transform = `translate(${lShow}, 0)`;
            } else {
                arrow.style.transform = `translate(${aHid}px, 0px)`;
                lyrics.style.transform = `translate(${lHid}px, 0)`;
            }
        }
    }
})
