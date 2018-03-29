<template>
  <el-container>
    <el-main width="100%">
      <div class="map-wrapper">
        <v-map :zoom='zoom' :center='center' :bounds='bounds' class="map" ref='map'>
          <v-tilelayer :url='url'></v-tilelayer>
          <v-marker v-for="(item, i) in tracks" :key="i" :lat-lng='item.marker' :icon="getIcon(item)" :draggable='true' @l-dragend='endDrag($event, item.id)'>
            <v-popup :content='item.text' :open='popupVisible'></v-popup>
          </v-marker>
          <v-polyline :latLngs='track.data' :visible='track.show'></v-polyline>
        </v-map>
      </div>
      <div class="side" v-show="showAside">
        <i class="el-icon-d-arrow-right" @click="toggle"></i>
        <operate class="operate" @updated="loadTracks" @selectedRowsChanged="selectRecords" @display='display' @popupDisplay='showPopup' :inRangePoints='inRangePoints' :updatedMarker='updatedMarker'></operate>
      </div>
      <span class="show-btn" v-show="!showAside">
        <i class="el-icon-d-arrow-left" @click="toggle"></i>
      </span>
    </el-main>
  </el-container>
</template>

<script>
import { config } from '@/assets/config'
import L from 'leaflet'
import Vue2leaflet from 'vue2-leaflet'
import popup from '../components/popup'
import operate from '../components/operate'
require('leaflet.pm')

export default {
  name: 'index',
  components: {
    'v-map': Vue2leaflet.Map,
    'v-tilelayer': Vue2leaflet.TileLayer,
    'v-marker': Vue2leaflet.Marker,
    'v-popup': popup,
    'v-polyline': Vue2leaflet.Polyline,
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
      center: [33.36, 44.49],
      bounds: [
        [34.524316150465104, 69.14186843865969],
        [34.524033291265916, 69.20598396295168],
        [34.559383245309505, 69.20795806878664]
      ],
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
      },
      showAside: true,
      track: {
        show: false,
        data: []
      },
      popupVisible: false
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
            selected: false,
            color: item.color || '#000'
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
      } else {
        this.monitors = []
      }
    },
    /**
     * 展示轨迹或点
     * @param type
     * @return
     * */
    display(type) {
      if (type === 'track') {
        this.track = Object.assign({}, this.track, {
          show: true,
          data: this.bounds
        })
      } else {
        this.track = Object.assign({}, this.track, {
          show: false,
          data: []
        })
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

        // 定位到该点,暂时注销掉
        // let lastIndex = recoreds.length - 1
        // let last = recoreds[recoreds.length - 1]
        // this.center = [parseFloat(last.latitude), parseFloat(last.longitude)]
      }
    },
    getIcon(item) {
      let color = item.color || '#583470'
      let isSelected = item.selected
      let className = isSelected
        ? 'iconfont icon-position1 active'
        : 'iconfont icon-position1'
      // return L.divIcon({
      //   className: className,
      //   iconSize: [40, 40],
      //   iconAnchor: [20, 38]
      // })

      const myCustomColour = color

      const markerHtmlStyles = `
        color: ${myCustomColour};
        `

      return L.divIcon({
        // className: className,
        iconSize: [40, 40],
        iconAnchor: [20, 38],
        html: `<span style="${markerHtmlStyles}" class="${className}" />`
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
        // 排除从列表删除点的情况
        if (!_this._draw || !_this._draw.layer) {
          return
        }
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
    },
    /**
     * 切换右侧面板显示隐藏
     * @param
     * * */
    toggle() {
      this.showAside = !this.showAside
    },
    showPopup(val) {
      this.popupVisible = val
    }
  }
}
</script>

<style lang='less' scoped>
.el-container {
  height: 100%;

  .el-main {
    position: relative;
    padding: 0;
    .map-wrapper {
      position: relative;
      height: 100%;

      .map {
        z-index: 0;
      }
    }

    .side {
      position: absolute;
      top: 5px;
      right: 5px;
      i {
        position: absolute;
        left: 5px;
        top: 15px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        z-index: 999;
      }
    }

    .show-btn {
      position: fixed;
      right: 0;
      top: 300px;
      i {
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        z-index: 999;
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
}
</style>
