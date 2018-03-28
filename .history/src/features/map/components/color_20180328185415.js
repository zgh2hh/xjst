import Vue from 'vue'
import colorPicker from '@/components/vue-color-picker/picker'

export default Vue.extend({
  components: {
    'color-picker': colorPicker
  },
  template: '<color-picker v-model="color" v-on:change="headleChangeColor" ref="colorPicker"></color-picker>',
  data() {
    return {
      color: '#ccc'
    }
  },
  methods: {
    headleChangeColor(val) {
      this.color = val
    }
  }
})
