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
            if (records[2]) {
              let fields = records[2].split(/\s+/)
              if (fields && fields.length > 0) {
                fields = fields.filter(function(e) {
                  return e !== '' && e !== ';'
                })
              }
              if (records.length > 0) {
                for (let i = 0; i < records.length; i++) {
                  if (records[i].length > 0 && !records[i].startsWith(';')) {
                    let eles = records[i].split(/\s+/)
                    if (eles.length > 2) {
                      for (let j = 0; j < eles.length; j++) {
                        users.push({
                          id: i,
                          time: eles[2],
                          latitude: eles[1],
                          longitude: eles[0],
                          desc: ''
                        })
                      }
                    }
                  }
                }
              }
            }
          } else {
            // 自己造的数据
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
          debugger
          // 刷新列表
          that.rowData = users
          // 发送读取的点信息给地图组件
          that.$emit('updated', that.rowData)
        }
      }
    }
  }
}
