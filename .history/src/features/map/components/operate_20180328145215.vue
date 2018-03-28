<template>
  <div class="operate-wrapper">
    <el-row type="flex" justify="center" style="padding: 5px 0;">
      <el-col :span="10">
        <label class="el-button el-button--primary el-button--mini">
          <span>选择文件</span>
          <input type="file" ref="file" id="file" style="display: none;" @change="selectFile">
        </label>
      </el-col>
      <el-col :span="2">
        <el-checkbox @change='checkToggle'>popup</el-checkbox>
      </el-col>
      <el-col :span="10">
        <el-select v-model="display" placeholder="please select" size="mini" @change='displayData'>
          <el-option label="点" :value="1"></el-option>
          <el-option label="轨迹" :value="2"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-row :gutter="0">
      <ag-grid-vue class="ag-fresh" style="height:600px;" :gridOptions="gridOptions" :rowData="rowData" rowSelection="multiple" :rowSelected="onRowSelected" :localeText='localeText' :enableSorting='true'>
      </ag-grid-vue>
    </el-row>
    <!-- 操作按钮 -->
    <el-row>
      <color-picker v-model="color" ref="colorPicker"></color-picker>
      <el-button type='default' icon='el-icon-arrow-up' size="mini"></el-button>
      <el-button type='default' icon='el-icon-plus' size="mini" @click="addPoint"></el-button>
      <el-button type='default' icon='el-icon-minus' size="mini" @click="removePoint"></el-button>
      <el-button type='default' icon='el-icon-arrow-down' size="mini"></el-button>
    </el-row>
  </div>
</template>

<script>
import AgGridVue from '@/components/ag-grid'
import colorPicker from '@/components/vue-color-picker/picker'
import readFile from '../mixins/readText'
import {config} from '@/assets/config'

export default {
  mixins: [readFile],
  name: 'operate',
  components: {
    'ag-grid-vue': AgGridVue,
    'color-picker': colorPicker
  },
  props: {
    inRangePoints: {
      type: Array,
      default: () => []
    },
    updatedMarker: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    nextId: function() {
      // 求出已加载记录的最大id
      let maxId = 0
      for (let i = 0; i < this.rowData.length; i++) {
        if (this.rowData[i].id > maxId) {
          maxId = this.rowData[i].id
        }
      }
      return maxId + 1
    },
    selectedIds: function() {
      let rs = []
      for (let i = 0; i < this.selectedRows.length; i++) {
        rs.push(this.selectedRows[i].id)
      }
      return rs
    }
  },
  data() {
    return {
      track: [],
      gridOptions: null,
      rowData: [],
      selectedRows: [],
      display: 1,
      color: '',
      menus: [{
        name: '设置颜色',
        action: this.setColor,
        icon: '',
        position: 'left'
      }]
    }
  },
  methods: {
    createColumnDefs() {
      return [
        {
          headerName: '#',
          width: 30,
          checkboxSelection: true,
          // suppressSorting: true,
          suppressMenu: true,
          pinned: true
        },
        {
          headerName: '描述',
          field: 'desc',
          width: 100,
          suppressFilter: true,
          editable: true
        },
        {
          headerName: '经度',
          field: 'longitude',
          width: 100,
          editable: true
        },
        {
          headerName: '纬度',
          field: 'latitude',
          width: 100,
          suppressFilter: true,
          editable: true
        },
        {
          headerName: '时间',
          field: 'time',
          width: 100,
          filter: 'text',
          editable: true
        }
      ]
    },
    onRowSelected(event) {
      this.selectedRows = this.gridOptions.api.getSelectedRows()
      this.$emit('selectedRowsChanged', this.selectedRows)
    },
    /**
     * 添加点
     * @param 空
     */
    addPoint() {
      let mapCenter = this.$parent.$parent.$parent.getCenter()
      // TODO 根据经纬度查询出poi信息，填入desc
      this.rowData.push({
        id: this.nextId,
        time: '454',
        latitude: mapCenter.lat,
        longitude: mapCenter.lng,
        desc: this.nextId
      })
      // 发送读取的点信息给地图组件
      this.$emit('updated', this.rowData)
    },
    /**
     * 删除点
     */
    removePoint() {
      this.rowData = this.rowData.filter((item, i) => {
        return !this.selectedIds.includes(item.id)
      })
      // 发送读取的点信息给地图组件
      this.$emit('updated', this.rowData)
    },
    displayData(type) {
      this.$emit('display', type === 2 ? 'track' : 'point')
    },
    checkToggle(val) {
      this.$emit('popupDisplay', val)
    },
    setColor() {
      this.$refs.colorPicker.openPicker()
    }
  },
  beforeMount() {
    this.gridOptions = {
      // domLayout: 'autoHeight',
      context: {
        componentParent: this
      },
      suppressMenuHide: true,
      enableFilter: true
    }
    let that = this
    this.gridOptions.columnDefs = this.createColumnDefs()
    this.gridOptions.stopEditingWhenGridLosesFocus = true
    this.gridOptions.onCellValueChanged = function(event) {
      // console.log('changed', event.data)
      // 发送更改的点信息给地图组件
      // TODO 编辑需要优化
      that.$emit('updated', that.rowData)
    }
    this.localeText = config.localeText
  },
  watch: {
    inRangePoints: function(val, old) {
      // 清除地图上的geometry
      if (val && val.length === 0) {
        this.gridOptions.api.deselectAll()
      } else {
        this.gridOptions.api.forEachNode(function(node) {
          if (val.includes(node.data.id)) {
            node.setSelected(true)
          }
        })
      }
    },
    // 更新点
    updatedMarker: function(val, old) {
      if (!val || val.length === 0) {
        return
      }
      this.rowData = this.rowData.map(item => {
        if (item.id === val.id) {
          item.latitude = val.position.lat
          item.longitude = val.position.lng
        }
        return item
      })
      // 发送读取的点信息给地图组件
      this.$emit('updated', this.rowData)
    }
  }
}
</script>

<style scoped>
.operate-wrapper {
  background-color: #ccc;
  border-radius: 4px;
  width: 432px;
}
</style>
