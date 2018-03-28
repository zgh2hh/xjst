<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import '@/assets/iconfont/iconfont.css'
import '@/assets/style/common.less'
import L from 'leaflet'
import 'leaflet.pm/dist/leaflet.pm.css'

// 修复marker图标路径错误
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'App'
}
</script>

<style lang='less'>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #f7fafc;
  min-width: 1200px;
  font-family: 'Microsoft YaHei';
}

#app {
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
