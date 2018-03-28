<script>
import colorPicker from './colorPicker'
export default {
  name: 'picker',
  extends: colorPicker,
  methods: {
    openPicker() {
      this.openStatus = true
    },
    closePicker() {
      this.openStatus = false
    }
  }
}
</script>

<style lang='less'>
.m-colorPicker .box.open {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}
</style>

