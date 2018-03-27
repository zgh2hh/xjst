<template>
  <el-container>
    <el-main width="100%">
      <div class="map-wrapper">
        <v-map :zoom='zoom' :center='center' :bounds='bounds' class="map" ref='map'>
          <v-tilelayer :url='url'></v-tilelayer>
          <v-marker v-for="(item, i) in tracks" :key="i" :lat-lng='item.marker' :icon="getIcon(item.selected)" :draggable='true' @l-dragend='endDrag($event, item.id)'>
            <v-popup :content='item.text'></v-popup>
          </v-marker>
        </v-map>
      </div>
      <div class="operate-wrapper">
        <i class="el-icon-d-arrow-right"></i>
        <operate class="operate" @updated="loadTracks" @selectedRowsChanged="selectRecords" :inRangePoints='inRangePoints' :updatedMarker='updatedMarker'></operate>
      </div>
    </el-main>
    <!-- <el-aside width="30%">
      <i class="el-icon-d-arrow-right"></i>
      <operate class="operate" @updated="loadTracks" @selectedRowsChanged="selectRecords" :inRangePoints='inRangePoints' :updatedMarker='updatedMarker'></operate>
    </el-aside> -->
  </el-container>
</template>

<script>
import { config } from '@/assets/config'
import L from 'leaflet'
import Vue2leaflet from 'vue2-leaflet'
import operate from '../components/operate'
require('leaflet.pm')

export default {
  name: 'index',
  components: {
    'v-map': Vue2leaflet.Map,
    'v-tilelayer': Vue2leaflet.TileLayer,
    'v-marker': Vue2leaflet.Marker,
    'v-popup': Vue2leaflet.Popup,
    operate: operate
  },
  computed: {
    tracks: function() {
      for (let j = 0; j < this.monitors.length; j++) {
        if (this.selectedIds.length === 0) {
          this.monitors[j].selected = false
        }
        if (this.selectedIds.indexOf(this.monitors[j].id) !== -1) {
          this.monitors[j].selected = true
        } else {
          this.monitors[j].selected = false
        }
      }
      return this.monitors
    }
  },
  data() {
    let url = config.tileUrl
    return {
      zoom: 13,
      center: [32.78515, 68.953222],
      bounds: [],
      url: config.url,
      monitors: [],
      selectedIds: [],
      // 框选出来的点
      inRangePoints: [],
      // 拖动更新的点
      updatedMarker: null,
      _draw: {
        layer: null,
        bounds: []
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    loadTracks(tracks) {
      if (tracks && tracks.length > 0) {
        let result = []
        tracks.forEach(item => {
          result.push({
            id: item.id,
            marker: L.latLng(
              parseFloat(item.latitude),
              parseFloat(item.longitude)
            ),
            text: function() {
              return `<div>纬度: ${item.latitude}, 经度: ${
                item.longitude
              }<br>时间: ${item.time}<br>描述: ${item.desc}</div>`
            },
            title: item.time,
            selected: false
          })
        })
        this.monitors = result
        // 获取点边界 fitbounds
        if (this.monitors && this.monitors.length > 0) {
          let bds = []
          this.monitors.forEach(user => {
            bds.push(user.marker)
          })
          this.bounds = bds
        }
      }
    },
    selectRecords(recoreds) {
      if (typeof recoreds === 'undefined') {
        return
      }

      if (recoreds.length === 0) {
        this.selectedIds = []
      } else {
        // 存储选中点的id
        let selectedIds = []
        recoreds.forEach(ele => {
          selectedIds.push(ele.id)
        })
        this.selectedIds = selectedIds

        // 定位到该点
        let lastIndex = recoreds.length - 1
        let last = recoreds[recoreds.length - 1]
        this.center = [parseFloat(last.latitude), parseFloat(last.longitude)]
      }
    },
    getIcon(isSelected) {
      let style = isSelected ? 'position active' : 'position'
      return L.divIcon({
        className: style,
        iconSize: [40, 40]
      })
    },
    selectContainedPoint(latLngBounds) {
      if (!latLngBounds) {
        return false
      }
      let points = []
      for (let i = 0; i < this.monitors.length; i++) {
        // 如果点在绘制范围内
        if (latLngBounds.contains(this.monitors[i].marker)) {
          points.push(this.monitors[i].id)
        }
      }
      this.inRangePoints = points
    },
    clearShape() {
      this.inRangePoints = []
    },
    init() {
      let map = this.$refs['map'].mapObject
      map.pm.addControls()

      let _this = this
      map.on('pm:create', function(evt) {
        let latLngBounds = evt.layer.getBounds()
        _this._draw = Object.assign({}, _this._draw, {
          layer: evt.layer,
          bounds: latLngBounds
        })
        _this.selectContainedPoint(latLngBounds)
      })

      map.on('pm:remove', function(evt) {
        if (evt.layer._leaflet_id === _this._draw.layer._leaflet_id) {
          // 删除
          _this._draw = Object.assign({}, _this._draw, {
            layer: null,
            bounds: []
          })
          _this.clearShape()
        }
      })
    },
    getCenter() {
      let map = this.$refs['map'].mapObject
      return map.getCenter()
    },
    /**
     * 点拖动结束
     * @param evt 拖动事件
     * @param id 点id
     */
    endDrag(evt, id) {
      let newPosition = evt.target._latlng
      // 小数点后保留6位
      if (!newPosition) {
        return
      }
      this.updatedMarker = {
        id,
        position: {
          lat: newPosition.lat.toFixed(7),
          lng: newPosition.lng.toFixed(6)
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.el-container {
  height: 100%;

  .el-main {
    position: relative;
    padding: 5px;
    .map-wrapper {
      position: relative;
      height: 100%;

      .map {
        z-index: 0;
        .position {
          background-image: url('../../../assets/img/position.png');
          background-size: 100% 100%;
          &:hover {
            background-image: url('../../../assets/img/position-active.png');
          }
        }

        .position.active {
          background-image: url('../../../assets/img/position-active.png');
          background-size: 100% 100%;
        }
      }
    }
  }

  /* .el-aside {
    position: relative;
    padding: 5px;
    height: 100%;
    .operate {
      z-index: 999;
      opacity: 0.7;
    }
    i {
      position: absolute;
      left: 5px;
      top: 15px;
      font-size: 20px;
      font-weight: bold;
    }
  } */

  .operate-wrapper{

  }
}
</style>
