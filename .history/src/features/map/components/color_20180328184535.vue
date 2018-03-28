<template>
  <color-picker v-model="color" v-on:change="headleChangeColor" ref="colorPicker"></color-picker>
</template>

<script>
import colorPicker from '@/components/vue-color-picker/picker'

export default {
  name: 'color',
  components: {
    'color-picker': colorPicker
  },
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
  },
  methods: {
    headleChangeColor(val) {
      this.color = val
    }
  }
}
</script>

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
