export default Vue.component(`color-picker`, {
    template: '<button type="text" id="colorPicker"@click="console.log(backgroundColor)" class="jscolor { width: 100, onFineChange:"this.targetElement.value = this.targetElement.innerHTML"}" v-model="backgroundColor">',
})
