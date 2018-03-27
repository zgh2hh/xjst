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
  methods: {
    openPopup() {
      this.$parent.mapObject.openPopup()
    }
  }
}
</script>

<style>

</style>
