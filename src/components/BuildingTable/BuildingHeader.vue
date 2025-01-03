<script>
import { getBuildingTable } from "./utils";
import SwitchLogicTool from "./tools/SwitchLogicTool";
import SelectTool from "./tools/SelectTool";
import LocateTool from "./tools/LocateTool";
import DisplayTool from "./tools/DisplayTool";

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
    DisplayTool
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
  render() {
    // 渲染父元素插槽
    const root = getBuildingTable(this);
    const { headerLeft, headerRight } = root.$slots;
    const { buildName, buildAddress } = this.store.states;

    return (
      <div class="building-header-wrap">
        <div class="building-header__left">
          {headerLeft}
        </div>
        {this.showTitle && (
          <div class="building-header__center">
            <div class="building-title__primary">{buildName}</div>
            <div class="building-title__second" title={buildAddress}>
              ({ buildAddress })
            </div>
          </div>
        )}
        <div class="building-header__right">
          {headerRight}
          {this.tools.includes("select") && <select-tool />}
          {this.tools.includes("locate") && <locate-tool />}
          {this.tools.includes("switchLogic") && <switch-logic-tool />}
          {this.tools.includes("display") && <display-tool />}
        </div>
      </div>
    );
  },
};
</script>
