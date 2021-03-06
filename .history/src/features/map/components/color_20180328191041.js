import Vue from 'vue'

export default Vue.extend({
  template: '<div :style="style"></div>',
  computed: {
    style: function() {
      return {
        'background-color': '#ccc'
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
})
