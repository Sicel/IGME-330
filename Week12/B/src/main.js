const app = new Vue({
    el: '#app',
    data: {
        title: "Vuew & Ajax Model",
        result: {
            "q": "???",
            "a": "!!!"
        },
        copyrightYear: "2019",
        copyrightName: "That One Programmer"
    },
    created() {
        this.search();
    },
    methods: {
        search() {
            //if (! this.term.trim()) return;
            fetch("http://igm.rit.edu/~acjvks/courses/2018-fall/330/php/get-a-joke.php")
                .then(response => {
                    if (!response.ok) {
                        throw Error(`ERROR: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(json => {
                    this.result = json;
                    console.log(json);
                })
        } // end search
    } // end methods
});
