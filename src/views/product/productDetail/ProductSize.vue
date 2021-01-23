<template>
  <div class="ProductSize">
    <el-card v-if="sizestandard.terms&&sizestandard.terms.length > 0">
      <div slot="header" class="title">
        <span>尺码表</span>
      </div>
      <div class="form">
        <el-form :model="form" ref="form" class="ProductSize-from">
          <div class="ProductSize-from__table">
            <el-table :data="form.sizeInfoList" style="width:100%;" row-key="key" border>
              <el-table-column
                v-for="(item,index) in tableHeadData"
                :key="index"
                :label="item.name"
                align="center"
              >
                <template slot-scope="scope">
                  <el-form-item>
                    <div v-if="item.status==='text'">{{showLabels[scope.row.attributeTermId+'']}}</div>
                    <el-input v-else v-model="scope.row[item.id]" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      form: {
        sizeInfoList: []
      },
      showLabels: {},
      tableData: []
    }
  },
  computed: {
    ...mapGetters('product', ['sizeOptions', 'sizeAttr', 'sizestandard']),
    tableHeadData () {
      // 表头信息
      const sizes = {
        id: 'size',
        name: this.sizeAttr.name,
        status: 'text'
      }
      return this.deduplication([sizes, ...this.sizestandard.terms], 'id')
    }
  },
  watch: {
    'sizeOptions': {
      handler (newValue) {
        this.addListItem(newValue)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    addListItem (sizes) {
      // 增加行
      const sizeInfoList = []
      const showLabels = {}
      sizes.forEach(size => {
        const addItem = {
          attributeTermId: size.id,
          attributeId: this.sizeAttr.attributeId
        }
        sizeInfoList.push(addItem)
        showLabels[size.id] = size.name
        this.form.sizeInfoList.push(addItem)
      })
      this.form.sizeInfoList = sizeInfoList
      this.showLabels = showLabels
    },
    deduplication (data, primaryKey) {
      // 数组对象去重
      return data.reduce((pre, cur) => {
        const locationData = pre.find((item) => item[primaryKey] === cur[primaryKey])
        return locationData ? pre : pre.concat(cur)
      }, [])
    },
    result () {
      return new Promise(resolve => {
        const productSize = this.form.sizeInfoList.map((size) => {
          const { attributeTermId, attributeId, ...rest } = size
          const sizePositions = []
          for (const key in rest) {
            const sizeItem = {}
            sizeItem['attributeTermId'] = key
            sizeItem['value'] = rest[key]
            sizePositions.push(sizeItem)
          }
          return { sizePositions, attributeTermId, attributeId }
        })
        resolve({ 'productSize': productSize })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.ProductSize {
  margin-bottom: 2rem;
  &-from {
    padding: 0 0 0 120px;
    &__table {
      /deep/ .el-form-item {
        margin-bottom: 0 !important;
      }
    }
  }
}
</style>
