<script>
import { deepClone } from '../utils'
import houseConfig from "../config/house-config"

const props = {
  // 房屋单元格宽度，默认：220px
  width: Number,
  // 房屋单元格自定义类名
  className: String,
  // 房屋单元格自定义样式
  houseStyle: Object,
  // 是否显示房屋标签信息，默认：true
  showBlock: Boolean,
  // 标签值转换函数
  parseBlockValue: Function,
  // 标签中要显示的字段，不设置显示所有字段，默认: null
  includeFields: Array,
  // 标签中要排除的字段，默认：null
  excludeFields: Array,
  // 是否显示房屋符号(symbols)信息，默认：true
  showSymbol: Boolean,
  // 每行显示几个房屋符号(symbol)，默认：2
  symbolColumn: Number,
  // 是否以精简模式显示
  simple: Boolean,
  // 精简模式下单元格宽度，默认：120
  simpleWidth: Number,
  // 是否显示单元格提示信息，默认：false
  showTitle: Boolean,
  // 没有标签时是否调整单元格宽度为simpleWidth，默认：true
  adjustWidthIfNoBlock: Boolean
}

/**
 * 房屋单元格定义组件
 */
export default {
  name: 'HouseDefinition',
  props,
  inject: ['store'],
  mounted() {
    this.createHouseDefinition()
  },
  methods: {
    // 创建房屋配置定义
    createHouseDefinition() {
      const definition = deepClone(this.$options.propsData)
      // 精简模式
      if (definition.simple) {
        definition.className = 'simple-cell'
        definition.showBlock = false
        definition.width = houseConfig.simpleWidth
      }
      // 定义render函数，如果有自定义模板使用自定义模块，否则使用默认模板
      if (this.$scopedSlots.default) {
        definition.render = (h, context) => {
          return this.$scopedSlots.default(context)
        }
      }
      this.store.commit('setHouseDefinition', definition)
      this.createDefinitionWatchers()
    },
    // 监听房屋配置信息改变并同步到store
    createDefinitionWatchers() {
      Object.keys(props).forEach((key) => {
        this.$watch(key, () => {
          this.store.commit('setHouseDefinition', {
            [key]: this[key]
          })
        })
      })
    }
  },
  render(h) {
    return h('')
  }
}
</script>
