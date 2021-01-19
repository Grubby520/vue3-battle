<template>
  <div class="ProductSize">
    <el-card>
      <div slot="header" class="title">
        <span>尺码表{{sizeattr.name}}</span>
      </div>
      <div class="form">
        <el-form :model="form" ref="form" class="ProductSize-from">
          <div class="ProductSize-from__table">
            <el-table :data="form.productSizeTemplates" style="width:100%;" row-key="key" border>
              <el-table-column
                v-for="(item,index) in tableHeadData"
                :key="index"
                :label="item.label"
                :width="item.width"
                align="center"
              >
                <template slot-scope="scope">
                  <el-form-item>
                    <div v-if="item.status==='text'">{{showLabels[scope.row.attributeTermId+'']}}</div>
                    <el-input v-else v-model="scope.row[item.name]" />
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
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        productSizeTemplates: []
      },
      showLabels: {},
      tableData: []
    }
  },
  computed: {
    ...mapGetters('product', ['sizeOptions', 'sizeattr']),
    tableHeadData () {
      // 表头信息
      const sizes = {
        name: 'size',
        label: this.sizeattr.name,
        status: 'text'
      }
      const headData = this.tableData
      this.sizeattr.name && headData.unshift(sizes)
      return headData
    }
  },
  watch: {
    'sizeOptions': {
      handler (newValue) {
        this.load(newValue)
        this.addListItem(newValue)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    load () {
      axios.get('http://10.250.0.66:7300/mock/6006379be8759301dc974c8b/exaple/attrs')
        .then(res => {
          this.tableData = res.data
        })
    },
    addListItem (sizes) {
      // 增加行
      const productSizeTemplates = []
      const showLabels = {}
      sizes.forEach(size => {
        const addItem = {
          attributeTermId: size.id,
          attributeId: this.sizeattr.attributeId,
          sizePositions: []
        }
        productSizeTemplates.push(addItem)
        showLabels[size.id] = size.name
        this.form.productSizeTemplates.push(addItem)
      })
      this.form.productSizeTemplates = productSizeTemplates
      this.showLabels = showLabels
    },
    result () {
      return new Promise(resolve => {
        resolve({ 'productSize': this.form })
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
