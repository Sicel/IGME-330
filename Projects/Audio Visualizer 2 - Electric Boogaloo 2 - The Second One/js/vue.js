export const search = new Vue({
    el: '#controls',
    data: {
        searchTerm: 'Queen - We Will Rock You',
        video: {
            id: 0,
            url: ` `,
            title: " ",
            channel: " ",
            channelLink: ` `
        },
        
        // Audio Controls
        checkedAudioSettings: [],
        currentAudioTime: 0,
        currentAudioLength: 0,
        audioTime: "0:00 / 3:43", //`${this.curentAudioTime} / ${this.currentAudioLength}`,
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
        
        // Visual Controls
        checkedVisualSettings: [],
        gradModes: "",
    },
    methods: {
        search() {
            //if (! this.term.trim()) return;
            fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${this.searchTerm}&type=video&maxResults=10&key=AIzaSyBCPZ85si77Z6EjGzx2jTljvneFX760l8Q`)
                .then(response => {
                    if (!response.ok) {
                        throw Error(`ERROR: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(json => {
                    //this.result = json.data;
                    let firstResult = json.items[0];
                    this.video.id = firstResult.id.videoId;
                    this.video.url = `https://www.youtube.com/watch?v=${this.video.id}`,
                    this.video.title = firstResult.snippet.title,
                    this.video.channel = firstResult.snippet.channelTitle,
                    this.video.channelLink = `https://www.youtube.com/channel/${firstResult.snippet.channelId}`

                    console.log(this.video);
                })
        } // end search
    }
})
