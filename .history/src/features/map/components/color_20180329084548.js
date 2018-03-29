import Vue from 'vue'

export default Vue.extend({
  template: '<div :style="style" @click="choseColor"></div>',
  computed: {
    style: function() {
      return {
        'background-color': '#ccc',
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
    choseColor() {
      this.$emit('colorChanged')
    }
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
