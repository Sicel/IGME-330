Vue.component('joke-footer-2', {
    props: ['year', 'name'],
    template: `<footer class="muted" style="text-align:center">
		   &copy; {{ year }} {{ name }}
		   </footer>`
});

Vue.component('joke-display', {
    props: ['joke'],
    template: `<div class="col-md-12">
                    <!-- joke goes here -->
                    <p><b>{{joke.q}}</b></p>
                    <p><i>{{joke.a}}</i></p>
                </div>`
})
