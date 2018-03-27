/**
 * 读取txt文本
 */

export default {
  mounted() {},
  methods: {
    // 选择文本文件
    selectFile(evt) {
      if (evt.target.files && evt.target.files[0]) {
        // 判断文件类型
        // 如果是txt文本
        this.readAsText()
      }
    },
    /**
     * 将文件以文本形式读入页面
     */
    readAsText() {
      let file = this.$refs['file'].files[0]
      let reader = new FileReader()
      reader.readAsText(file)
      let that = this
      reader.onload = function(f) {
        // 默认以换行符分割每条记录
        let records = this.result.split('\n')
        if (records) {
          let users = []
          // 提供的测试文件
          if (records && records[0] && records[0].startsWith('; unicode')) {
            console.log('test')
            if (records[2]) {
              let items = records[2].split(' ')
              console.log(items)
              if (items && items.length > 0) {
                items = items.filter(function(e) {
                  return e !== '' && e !== ';'
                })
              }
              console.log(items)
              debugger
            }
          } else {
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
          }
          // 刷新列表
          that.rowData = users
          // 发送读取的点信息给地图组件
          that.$emit('updated', that.rowData)
        }
      }
    }
  }
}
