<template>
  <div class="ProductSize">
    <el-card>
      <div slot="header" class="title">
        <span>尺码表</span>
      </div>
      <div class="form">
        <el-form :model="form" ref="form" class="ProductSize-from">
          <div class="ProductSize-from__table">
            <el-table :data="form.info" style="width:100%;" row-key="key" border>
              <el-table-column
                v-for="(item,index) in tableHeadData"
                :key="index"
                :label="item.label"
                :width="item.width"
                align="center"
              >
                <template slot-scope="scope">
                  <el-form-item>
                    <div v-if="item.status==='text'">{{scope.row[item.name].attrTermName}}</div>
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
export default {
  data () {
    return {
      form: {
        info: []
      },
      tableHeadData: [// 表头字段
        {
          name: 'size',
          label: '尺码',
          status: 'text'
        },
        {
          name: 'supplyPrice',
          label: '胸围'
        },
        {
          name: 'supplierSkuCode',
          label: '腰围'
        },
        {
          name: 'tagSize',
          label: '臀围'
        },
        {
          name: 'back',
          label: '背长'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('product', ['sizeOptions'])
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
  created () {

  },
  mounted () {

  },
  methods: {
    addListItem (sizes) {
      // 增加行
      const condition = (sizes && sizes.length > 0)
      if (condition) {
        const arr = []
        sizes.forEach(size => {
          const addItem = { size: size }
          arr.push(addItem)
        })
        this.form.info = arr
      }
    },
    result () {
      return new Promise(resolve => {
        resolve({ 'productSize': [] })
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
