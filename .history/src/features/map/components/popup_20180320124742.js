import Vue2leaflet from 'vue2-leaflet'
export default {
  extends: Vue2leaflet.Popup,
  methods: {
    openPopup() {
      this.$parent.mapObject.openPopup()
    }
  }
}
