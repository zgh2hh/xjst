<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import L from 'leaflet'
import Vue2leaflet from 'vue2-leaflet'

export default {
  name: 'custom-popup',
  extends: Vue2leaflet.Popup,
  props: ['open'],
  methods: {
    openPopup() {
      this.$parent.mapObject.openPopup()
    }
  },
  mounted() {
    // this.openPopup()
  },
  watch: {
    open: function(val, old) {
      if (val) {
        this.openPopup()
      }
    }
  }
}
</script>

<style>

</style>
