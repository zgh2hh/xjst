<template>
  <el-container>
    <el-main width="70%">
      <div class="map-wrapper">
        <v-map :zoom='zoom' :center='center' class="map" ref='map'>
          <v-tilelayer :url='url'></v-tilelayer>
          <v-marker v-for="(item, i) in tracks" :key="i" :lat-lng='item.marker' :icon="getIcon(item.selected)" :draggable='true' @l-dragend='endDrag'>
            <v-popup :content='item.text'></v-popup>
          </v-marker>
        </v-map>
      </div>
    </el-main>
    <el-aside width="30%">
      <div class="operate-wrapper">
        <el-row type="flex" justify="center" style="padding: 5px 0;">
          <label class="el-button el-button--primary el-button--mini">
            <span>选择文件</span>
            <input type="file" ref="file" id="file" style="display: none;" @change="selectFile">
          </label>
        </el-row>
        <!-- 列表 -->
        <el-row :gutter="0">
          <ag-grid-vue class="ag-fresh" :gridOptions="grid.gridOptions" :columnDefs="grid.columnDefs" :rowData="tracks" rowSelection="multiple" :rowSelected="onRowSelected">
          </ag-grid-vue>
        </el-row>
        <!-- 操作按钮 -->
        <el-row>
          <el-button type='default' icon='el-icon-arrow-up' size="mini"></el-button>
          <el-button type='default' icon='el-icon-plus' size="mini" @click="addPoint"></el-button>
          <el-button type='default' icon='el-icon-minus' size="mini" @click="removePoint"></el-button>
          <el-button type='default' icon='el-icon-arrow-down' size="mini"></el-button>
        </el-row>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import L from 'leaflet'
import Vue2leaflet from 'vue2-leaflet'
import AgGridVue from '@/components/ag-grid'
require('leaflet.pm')

export default {
  name: 'index',
  components: {
    'v-map': Vue2leaflet.Map,
    'v-tilelayer': Vue2leaflet.TileLayer,
    'v-marker': Vue2leaflet.Marker,
    'v-popup': Vue2leaflet.Popup,
    'ag-grid-vue': AgGridVue
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
    return {
      zoom: 13,
      center: [31.23656, 30.234545],
      bounds: [],
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      monitors: [],
      selectedRows: [],
      selectedIds: [],
      // 框选出来的点
      inRangePoints: [],
      _draw: {
        layer: null,
        bounds: []
      },
      grid: {
        gridOptions: {
          domLayout: 'autoHeight',
          context: {
            componentParent: this
          },
          suppressMenuHide: true,
          enableFilter: true
        },
        columnDefs: [
          {
            headerName: '#',
            width: 30,
            checkboxSelection: true,
            suppressSorting: true,
            suppressMenu: true,
            pinned: true
          },
          {
            headerName: '描述',
            field: 'desc',
            width: 100,
            suppressFilter: true
          },
          {
            headerName: '经度',
            field: 'longitude',
            width: 100
          },
          {
            headerName: '纬度',
            field: 'latitude',
            width: 100,
            suppressFilter: true
          },
          {
            headerName: '时间',
            field: 'time',
            width: 100,
            filter: 'text'
          }
        ]
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
        // if (this.monitors && this.monitors.length > 0) {
        //   let bds = []
        //   this.monitors.forEach(user => {
        //     bds.push(user.marker)
        //   })
        //   this.bounds = bds
        // }
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
    endDrag(evt) {
      console.log('end_drag')
      console.log(evt)
    },
    onRowSelected(event) {
      // console.log('onRowSelected: ' + event.node.data.time)
      this.selectedRows = this.gridOptions.api.getSelectedRows()
    }
  }
}
</script>

<style lang='less' scoped>
.el-container {
  height: 100%;

  .el-main {
    padding: 5px;
    .map-wrapper {
      position: relative;
      height: 100%;

      .map {
        z-index: 0;
        .position1 {
          color: springgreen;
        }

        // .position.active {
        //   background-image: url('../../../assets/img/position-active.png');
        //   background-size: 100% 100%;
        // }
      }
    }
  }

  .el-aside {
    position: relative;
    padding: 5px;
    height: 100%;
    .operate {
      z-index: 999;
      opacity: 0.7;
    }
  }
}
</style>
