<script>
import EchartsBar from '@components/echarts/EchartsBar'
import { API } from '@shared/api'
import { setLang } from '@shared/util'

export default {
  name: 'doc',
  data: () => {
    return {
      lang: process.env.VUE_APP_LANG,
      inputText: '',
      showInput: true,
      elCalendarDate: new Date(),
      barOpt: {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      }
    }
  },
  methods: {
    btnClick () {
      this.showInput = !this.showInput
    },
    langClick (lang) {
      this.lang = lang
      this.$i18n.locale = lang
      setLang(lang)
    }
  },
  components: {
    EchartsBar
  },
  render: function (h) {
    return (
      <div>
        {
          // 注释写法需要用{}括起来
          /* 这也是注释 */
          // <input value="注释dom"/>
        }
        <h1>国际化测试--{this.lang}</h1>
        <a href="javascript:void(0)" onClick={() => this.langClick('en')}>English</a>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="javascript:void(0)" onClick={() => this.langClick('zh')}>中文</a>
        <div>标签:{this.$t('home.label')}</div>
        <div>ElementUI国际化</div>
        <el-date-picker
          vModel={this.elCalendarDate}
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <br/>
        <h1>jsx功能测试</h1>
        <div>属性和事件</div>
        <input vShow={this.showInput} vModel={this.inputText}/>&nbsp;&nbsp;<span>{this.inputText}</span>
        <button onClick={this.btnClick}>隐藏/显示输入框</button>
        <h1>图标功能测试</h1>
        <echarts-bar options={this.barOpt}></echarts-bar>
      </div>
    )
  },
  mounted: function () {
    this.$get(API.def).then(data => {
      this.$console.log(data)
    })
  }
}
</script>

<style scoped lang="scss">

    h1 {
        margin:0;
        padding: 0;
        font-size: 1em;
    }

</style>
