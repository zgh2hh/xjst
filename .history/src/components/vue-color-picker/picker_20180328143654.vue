<script>
import colorPicker from './colorPicker'
export default {
  name: 'picker',
  extends: colorPicker,
  methods: {
    openPicker() {
      this.openStatus = true
    },
    colorPicker() {
      this.openStatus = false
    }
  }
}
</script>
