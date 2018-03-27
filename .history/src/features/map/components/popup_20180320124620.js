<template>

</template>

<script>
import L from 'leaflet'
import Vue2leaflet from 'vue2-leaflet'

export default {
  name: 'custom-popup',
  extends: Vue2leaflet.Popup,
  components: {
    'v-popup': Vue2leaflet.Popup
  },
  methods: {
    openPopup() {
      // this.mapObject
    }
  }
}
</script>

<style>

</style>


