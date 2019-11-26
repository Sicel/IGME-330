export const search = new Vue({
    el: '#searchControl',
    data: {
        searchTerm: 'Queen - We Will Rock You',
        firstResult: { },
        video: {
            id: 0,
            url: ` `,
            title: " ",
            channel: " ",
            channelLink: ` `
        }
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
                    this.firstResult = json.items[0];
                    this.video.id = this.firstResult.id.videoId;
                    this.video.url = `https://www.youtube.com/watch?v=${this.video.id}`,
                    this.video.title = this.firstResult.snippet.title,
                    this.video.channel = this.firstResult.snippet.channelTitle,
                    this.video.channelLink = `https://www.youtube.com/channel/${this.firstResult.snippet.channelId}`

                    console.log(this.video);
                })
        } // end search
    }
})
