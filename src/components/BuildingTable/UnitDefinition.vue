<script>
import { deepClone } from "./utils"

const props = {
  // 单元单元格高度，默认：50px
  height: Number,
  // 单元单元格自定义类名
  className: String,
  // 单元单元格自定义样式
  unitStyle: Object,
  // 用来显示单元字段名，默认：'unitName'
  titleField: String,
  // 是否显示单元选择按钮，默认：true
  showCheck: Boolean,
}

/**
 * 楼层单元格定义组件
 */
export default {
  name: 'UnitDefinition',
  props,
  inject: ["store"],
  mounted() {
    this.createUnitDefinition()
  },
  methods: {
    // 创建单元配置定义
    createUnitDefinition() {
      const definition = deepClone(this.$options.propsData)
      // 定义render函数，如果有自定义模板使用自定义模块，否则使用默认模板
      if (this.$scopedSlots.default) {
        definition.render = (h, context) => {
          return this.$scopedSlots.default(context)
        }
      }
      this.store.commit("setUnitDefinition", definition)
      this.createDefinitionWatchers()
    },
    // 监听单元配置信息改变并同步到store
    createDefinitionWatchers() {
      Object.keys(props).forEach((key) => {
        this.$watch(key, () => {
          this.store.commit("setUnitDefinition", {
            [key]: this[key],
          })
        })
      })
    },
  },
  render(h) {
    return h("")
  },
}
</script>