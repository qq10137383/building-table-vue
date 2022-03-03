<script>
import SwitchTool from "./tools/SwitchTool";
import LocateTool from "./tools/LocateTool";

/**
 * 楼盘表标题栏
 */
export default {
  name: "BuildingHeader",
  inject: ["store"],
  components: {
    SwitchTool,
    LocateTool,
  },
  computed: {
    title() {
      const { buildName, buildAddress } = this.store.states;
      return buildName ? `${buildName}(${buildAddress})` : "";
    },
  },
  render() {
    // 渲染父元素插槽
    const { headerLeft, headerRight } = this.$parent.$slots;

    return (
      <div class="building-header-wrap">
        <h4 class="building-header_title" title={this.title}>
          {this.title}
        </h4>
        <div class="building-header__left">
          <switch-tool />
          {headerLeft}
        </div>
        <div class="building-header__right">
          <locate-tool />
          {headerRight}
        </div>
      </div>
    );
  },
};
</script>