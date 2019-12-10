Vue.component('friend-list-row', {
    props: ['name', 'index'],
    template: `<tr>
			<td>{{ index + 1}}</td>
			<td v-text="name"></td>
		   </tr>`
});

Vue.component('friend-list', {
    props: ['names', 'title'],
    template: `<div>
                        <h2 v-text="title"></h2>
                        <table class="pure-table-striped">
                            <thead><th>Guest #</th><th>Guest Name</th></thead>
                            <tr is="friend-list-row" v-for="(name,index) in names" v-bind:name="name" v-bind:index="index"></tr>
                        </table>
                       </div>`
});

let app = new Vue({
    el: '#root',
    data: {
        newName: "",
        names: ["Adam", "Betty", "Charlie", "Doris"],
        title: "Guest List"
    },
    methods: {
        addName() {
            if (!this.newName) return;
            this.names.push(this.newName);
            this.newName = "";
        }
    }
});
