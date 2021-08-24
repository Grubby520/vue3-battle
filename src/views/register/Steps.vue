<script>
export default {
  name: 'Steps',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    active: {
      type: [Number, String],
      default: 1
    },
    height: {
      type: String,
      default: '4rem'
    },
    activeColor: {
      type: String,
      default: '#3c8dbc'
    },
    defaultColor: {
      type: String,
      default: '#dcf5f9'
    }
  },
  data () {
    return {

    }
  },
  render: function (h) {
    const HEIGHT_VALUE_UNIT = this.getHeightValueAndUnit()
    const HEIGHT_VALUE = HEIGHT_VALUE_UNIT.value
    const HEIGHT_UNIT = HEIGHT_VALUE_UNIT.unit
    const GAP = '0.5rem'
    let bgTrangleStyle = this.getRightTrangleStyle(HEIGHT_VALUE_UNIT, '#fff')
    let stepsLength = this.data.length

    return (
      <div class="sl-step-container" style={{ height: this.height }}>
        {
          this.data.map((item, index) => {
            let stepColors = this.computedStepColors(index + 1)
            let trangleStyle = this.getRightTrangleStyle(HEIGHT_VALUE_UNIT, stepColors.trangle)
            if (stepsLength > 1) {
              // 第一步
              if (index === 0) {
                return (
                  <div class="sl-step" style={{
                    marginRight: GAP,
                    lineHeight: this.height,
                    color: stepColors.font,
                    backgroundColor: stepColors.background,
                    zIndex: stepsLength - index,
                    padding: `0 ${HEIGHT_VALUE / 2}${HEIGHT_UNIT}`
                  }}>
                    {item.title}
                    <span class="trangle" style={{ ...trangleStyle, right: -HEIGHT_VALUE + HEIGHT_UNIT }}></span>
                  </div>
                )
              }

              // 最后一步
              if (index === stepsLength - 1) {
                return (
                  <div class="sl-step" style={{
                    lineHeight: this.height,
                    color: stepColors.font,
                    backgroundColor: stepColors.background,
                    zIndex: stepsLength - index,
                    padding: `0 ${HEIGHT_VALUE / 2}${HEIGHT_UNIT}`
                  }}>
                    {item.title}
                    <span class="trangle" style={{ ...bgTrangleStyle, left: 0 }}></span>
                  </div>
                )
              }

              return (
                <div class="sl-step" style={{
                  marginRight: GAP,
                  lineHeight: this.height,
                  color: stepColors.font,
                  backgroundColor: stepColors.background,
                  zIndex: stepsLength - index,
                  padding: `0 ${HEIGHT_VALUE / 2}${HEIGHT_UNIT}`// 避免因文字变多而被三角遮住
                }}>
                  {item.title}
                  <span class="trangle" style={{ ...bgTrangleStyle, left: 0 }}></span>
                  <span class="trangle" style={{ ...trangleStyle, right: -HEIGHT_VALUE + HEIGHT_UNIT }}></span>
                </div>
              )
            }
          })
        }
      </div >
    )
  },
  computed: {

  },
  methods: {
    getRightTrangleStyle (valueUnit, color) {
      let value = valueUnit.value
      let unit = valueUnit.unit
      let borderHeight = value / 2 + unit

      return {
        borderLeft: `${borderHeight} solid ${color}`,
        borderTop: `${borderHeight} solid transparent`,
        borderRight: `${borderHeight} solid transparent`,
        borderBottom: `${borderHeight} solid transparent`
      }
    },
    computedStepColors (step) {
      if (step <= this.active) {
        // active状态各颜色
        return {
          background: this.activeColor,
          font: '#fff',
          trangle: this.activeColor
        }
      }
      return {
        background: this.defaultColor,
        font: '#555',
        trangle: this.defaultColor
      }
    },
    getHeightValueAndUnit () {
      const VALUE_REG = /[\d.]+/
      let value = this.height.match(VALUE_REG)[0] || 0
      let unit = this.height.replace(VALUE_REG, '')
      return {
        value,
        unit
      }
    }
  },
  mounted: function () {

  }
}
</script>

<style scoped lang="scss">
.sl-step-container {
  white-space: nowrap;
}

.sl-step {
  position: relative;
  display: inline-block;
  height: 100%;
  min-width: 12em;
  line-height: 100%;
  text-align: center;
  box-sizing: border-box;

  .trangle {
    position: absolute;
    top: 0;
  }
}
</style>
