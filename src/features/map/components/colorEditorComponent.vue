<template>
  <color-picker v-model="color" v-on:change="headleChangeColor" ref="colorPicker"></color-picker>
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
    getValue() {
      return this.color
    },
    isPopup() {
      return true
    },
    headleChangeColor(val) {
      this.color = val
      this.params.api.stopEditing()
    },
    setColor(color) {
      this.color = color
    }
  },
  created() {
    this.setColor(this.params.value)
  }
})
</script>

