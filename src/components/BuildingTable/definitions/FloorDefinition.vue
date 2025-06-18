<script>
import { deepClone } from "../utils";

const props = {
  // 楼层单元格宽度，默认：50px
  width: Number,
  // 楼层单元格自定义类名
  className: String,
  // 楼层单元格自定义样式
  floorStyle: Object,
  // 用来显示楼层字段名，默认：'layer'
  titleField: String,
  // 是否显示楼层选择按钮，默认：true
  showCheck: Boolean,
};

/**
 * 楼层单元格定义组件
 */
export default {
  name: "FloorDefinition",
  props,
  inject: ["store"],
  mounted() {
    this.createFloorDefinition();
  },
  methods: {
    // 创建楼层配置定义
    createFloorDefinition() {
      const definition = deepClone(this.$options.propsData);
      // 定义render函数，如果有自定义模板使用自定义模块，否则使用默认模板
      if (this.$scopedSlots.default) {
        definition.render = (h, context) => {
          return this.$scopedSlots.default(context);
        };
      }
      this.store.commit("setFloorDefinition", definition);
      this.createDefinitionWatchers();
    },
    // 监听楼层配置信息改变并同步到store
    createDefinitionWatchers() {
      Object.keys(props).forEach((key) => {
        this.$watch(key, () => {
          this.store.commit("setFloorDefinition", {
            [key]: this[key],
          });
        });
      });
    },
  },
  render(h) {
    return h("");
  },
};
</script>
