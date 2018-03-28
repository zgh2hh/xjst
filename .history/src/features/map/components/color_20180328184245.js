import Vue from 'vue'

export default Vue.extend({
  template: '<div :style="style">12</div>',
  computed: {
    style: function() {
      return {
        width: '10px',
        height: '10px',
        'background-color': this.color
      }
    }
  },
  data() {
    return {
      color: '#ccc'
    }
  }
})
