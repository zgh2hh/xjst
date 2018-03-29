import Vue from 'vue'

export default Vue.extend({
  template: '<div :style="style"></div>',
  computed: {
    style: function() {
      return {
        'background-color': this.color,
        'width': '20px',
        'height': '20px'
      }
    }
  },
  data() {
    return {
      color: '#ccc'
    }
  },
  methods: {
    setColor(params) {
      let color = params.value
      this.color = color
    }
  },
  created() {
    this.setColor(this.params)
  }
})

/* import Vue from 'vue'
import picker from '@/components/vue-color-picker/picker'

export default Vue.extend({
  components: {
    'color-picker': picker
  },
  template:
    '<color-picker v-model="color" v-on:change="headleChangeColor" ref="colorPicker"></color-picker>',
  computed: {
    style: function() {
      return {
        'background-color': '#ccc',
        width: '20px',
        height: '20px'
      }
    }
  },
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
}) */
