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

<style lang='less' scoped>
.m-colorPicker .box.open {
  z-index: 99;
}
</style>

