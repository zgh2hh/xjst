<template>
  <div class="operate-wrapper">
    <el-row type="flex" justify="center" style="padding: 5px 0;">
      <label class="el-button el-button--primary el-button--mini">
        <span>选择文件</span>
        <input type="file" ref="file" id="file" style="display: none;" @change="selectFile">
      </label>
    </el-row>
    <!-- 列表 -->
    <el-row :gutter="0">
      <ag-grid-vue class="ag-fresh" :gridOptions="gridOptions" :rowData="rowData" rowSelection="multiple" :rowSelected="onRowSelected">
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
      // console.log('onRowSelected: ' + event.node.data.time)
      this.selectedRows = this.gridOptions.api.getSelectedRows()
      this.$emit('selectedRowsChanged', this.selectedRows)
    },
    /* selectFile(evt) {
      if (evt.target.files && evt.target.files[0]) {
        // 判断文件类型
        // 如果是txt文本
        this.readAsText()
      }
    },
    readAsText() {
      let file = this.$refs['file'].files[0]
      let reader = new FileReader()
      // 将文件以文本形式读入页面
      reader.readAsText(file)
      let that = this
      reader.onload = function(f) {
        // 默认以换行符分割每条记录
        let records = this.result.split('\n')
        if (records) {
          let users = []
          records.forEach(function(row, i) {
            if (row) {
              let item = row.split(' ')
              users.push({
                id: i + 1,
                time: item[0],
                latitude: item[1],
                longitude: item[2],
                desc: item[3]
              })
            }
          })
          // 刷新列表
          that.rowData = users
          // 发送读取的点信息给地图组件
          that.$emit('updated', that.rowData)
        }
      }
    }, */
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
      domLayout: 'autoHeight',
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
  /* height: 600px; */
}
</style>
