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
    },
    closePopup() {
      this.$parent.mapObject.closePopup()
    }
  },
  watch: {
    open: function(val, old) {
      val ? this.openPopup() : this.closePopup()
    }
  }
}
</script>

<style>

</style>
