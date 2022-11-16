<script>
import { getBuildingTable } from "./utils";
import SwitchLogicTool from "./tools/SwitchLogicTool";
import SelectTool from "./tools/SelectTool";
import LocateTool from "./tools/LocateTool";

/**
 * 楼盘表标题栏
 */
export default {
  name: "BuildingHeader",
  inject: ["store"],
  components: {
    SwitchLogicTool,
    SelectTool,
    LocateTool,
  },
  props: {
    // 是否显示标题
    showTitle: {
      type: Boolean,
      default: false,
    },
    // 楼盘表工具
    tools: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    title() {
      const { buildName, buildAddress } = this.store.states;
      return buildName ? `${buildName}(${buildAddress})` : "";
    },
  },
  render() {
    // 渲染父元素插槽
    const root = getBuildingTable(this);
    const { headerLeft, headerRight } = root.$slots;

    return (
      <div class="building-header-wrap">
        {this.showTitle && (
          <h4 class="building-header_title" title={this.title}>
            {this.title}
          </h4>
        )}
        <div class="building-header__left">
          {this.tools.includes("switchLogic") && <switch-logic-tool />}
          {this.tools.includes("select") && <select-tool />}
          {headerLeft}
        </div>
        <div class="building-header__right">
          {headerRight}
          {this.tools.includes("locate") && <locate-tool />}
        </div>
      </div>
    );
  },
};
</script>
