<template>
  <div class="operate-wrapper">
    <el-row type="flex" justify="center" style="padding: 5px 0;">
      <el-col :span="10">
        <label class="el-button el-button--primary el-button--mini">
          <span>选择文件</span>
          <input type="file" ref="file" id="file" style="display: none;" @change="selectFile">
        </label>
      </el-col>
      <el-col :span="10" :offset="2">
        <el-select v-model="value" placeholder="please select" size="mini">
          <el-option>12</el-option>
        </el-select>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-row :gutter="0">
      <ag-grid-vue class="ag-fresh" style="height:600px;" :gridOptions="gridOptions" :rowData="rowData" rowSelection="multiple" :rowSelected="onRowSelected">
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
</template>

<script>
import AgGridVue from '@/components/ag-grid'
import readFile from '../mixins/readText'

export default {
  mixins: [readFile],
  name: 'operate',
  components: {
    'ag-grid-vue': AgGridVue
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
      selectedRows: []
    }
  },
  methods: {
    createColumnDefs() {
      return [
        {
          headerName: '#',
          width: 30,
          checkboxSelection: true,
          suppressSorting: true,
          suppressMenu: true,
          pinned: true
        },
        {
          headerName: 'description',
          field: 'desc',
          width: 100,
          suppressFilter: true,
          editable: true
        },
        {
          headerName: 'longitude',
          field: 'longitude',
          width: 100,
          editable: true
        },
        {
          headerName: 'latitude',
          field: 'latitude',
          width: 100,
          suppressFilter: true,
          editable: true
        },
        {
          headerName: 'time',
          field: 'time',
          width: 100,
          filter: 'text',
          editable: true
        }
      ]
    },
    onRowSelected(event) {
      // console.log('onRowSelected: ' + event.node.data.time)
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
