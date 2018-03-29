<template>
  <div>
    <color-picker v-model="color" v-on:change="headleChangeColor" ref="colorPicker"></color-picker>
  </div>
</template>

<script>
import Vue from 'vue'
import picker from '@/components/vue-color-picker/picker'

export default Vue.extend({
  components: {
    'color-picker': picker
  },
  name: 'color-editor',
  data() {
    return {
      color: ''
    }
  },
  methods: {
    headleChangeColor(val) {
      this.color = val
    }
  }
})
</script>

