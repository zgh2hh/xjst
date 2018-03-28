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
