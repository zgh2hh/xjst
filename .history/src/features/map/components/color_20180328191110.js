import Vue from 'vue'

export default Vue.extend({
  template: '<div :style="style">12</div>',
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
  }
})
