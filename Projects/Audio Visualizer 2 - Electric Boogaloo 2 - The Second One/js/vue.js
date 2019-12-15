//import * as divs from './vueComponents.js';
import * as components from './vueComponents.js';
import './utils.js';

const controls_v = new Vue({
    el: '#controls',
    components: {
        'controlSection': components.controlSection
    },
    data: {
        //
        sections: {
            audio: components.audioDiv,
            visual: components.visualDiv
        },
        showControls: false,
        searchTerms: {
            artist: "Queen",
            track: "Bohemian Rhapsody"
        },
        searchTerm: 'Queen - Bohemian Rhapsody',
        video: {
            id: 0,
            url: ` `,
            title: " ",
            channel: " ",
            channelLink: ` `
        },
        songLyrics: "",

        // Audio Controls
        //audio: components.audioDiv,
        playing: false,
        checkedAudioSettings: [],
        currentAudioTime: 0,
        currentAudioLength: 0,
        audioTime: "0:00 / 3:43",
        selectedSong: "audio/glass%20animals%20flip.mp3",
        songs: [
            {
                name: "Glass Animals - Flip",
                src: "audio/glass%20animals%20flip.mp3"
            },
            {
                name: "Apashe - Lacrimosa",
                src: "audio/Apashe%20-%20Lacrimosa.mp3"
            },
            {
                name: "Confetti - Rob A Bank",
                src: 'audio/Confetti%20-%20Rob%20A%20Bank.mp3'
            }
        ],
        audioEffects: {
            sliders: [{
                name: "Distortion",
                sliderLabel: "Amount:",
                enabled: false,
                amount: 0,
                min: 0,
                max: 100
            }, {
                name: "Low Shelf Filter",
                sliderLabel: "Frequency Amount:",
                enabled: false,
                amount: 0,
                min: 0,
                max: 1000
            }, {
                name: "High Shelf Filter",
                sliderLabel: "Frequency Amount:",
                enabled: false,
                amount: 1000,
                min: 1000,
                max: 2000
            }]
        },
        audioOptions: {},


        // Visual Controls
        checkedVisualSettings: [],
        selectedBlendMode: "xor",
        blendModes: ["source-atop", "destination-over", "destination-out", "lighter", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"],
        includeBackground: false,
        backgroundColor: '#ffffff',
        quadCurves: false,
        visualEffects: {
            blendMode: {
                name: "Blend Mode",
                enabled: true,
                selected: "xor",
                selections: ["source-atop", "destination-over", "destination-out", "lighter", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"],
            },
            gradients: {
                name: "Color Gradient",
                current: 'rainbow',
                selections: ["Rainbow", 'RGB', 'Custom'],
                custom: {
                    amount: 3,
                    colors: ['#4fdeed', '#593daa', '#0ff09f']
                }
            }
        },
        visualOptions: {
            colorPicker: {
                name: "Include Background",
                label: "Background Color",
                enabled: false,
                color: '#ffffff',
                picker: {}
            },
            quadCurves: {
                name: "Quadratic Curve",
                enabled: false
            }
        }
    },
    methods: {
        search() {
            fetch(`https://orion.apiseeds.com/api/music/lyric/${this.searchTerms.artist}/${this.searchTerms.track}?apikey=t0fQtQW56iJKDN85vC3lrI1y3m0hooWfCieVWRcJz7GNg72lhZVCPrjEG1RxWDKk`)
                .then(response => {
                    if (!response.ok) {
                        throw Error(`ERROR: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(json => {
                    //this.result = json.data;
                    this.searchTerm = `${this.searchTerms.artist} - ${this.searchTerms.track}`;
                    this.songLyrics = json.result.track.text;
                    console.log(this.songLyrics);
                });

            //if (! this.term.trim()) return;
            fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${this.searchTerms.artist} - ${this.searchTerms.track}&type=video&maxResults=10&key=AIzaSyDNoaU5HfiTlQLbMIi8_zwDpP560120zzE`)
                .then(response => {
                    if (!response.ok) {
                        throw Error(`ERROR: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(json => {
                    let firstResult = json.items[0];
                    this.video.id = firstResult.id.videoId;
                    this.video.url = `https://www.youtube.com/embed/${this.video.id}?autoplay=0`;
                    this.video.title = firstResult.snippet.title;
                    this.video.channel = firstResult.snippet.channelTitle;
                    this.video.channelLink = `https://www.youtube.com/channel/${firstResult.snippet.channelId}`;

                    console.log(this.video);
                })
        },

        play() {
            this.playing = !this.playing;
        },

        unhideControls() {
            this.showControls = !this.showControls;
        }
    }
})


export let blendMode = controls_v.visualEffects.blendMode,
    gradient = controls_v.visualEffects.gradients,
    backgroundColor = controls_v.visualOptions.colorPicker,
    quadCurves = controls_v.visualOptions.quadCurves,
    songLength = controls_v.currentAudioLength,
    songTime = controls_v.currentAudioTime
