<script>
import { mapStates } from "../../store";
import getScrollbarWidth from "../../utils/scrollbar-width";

/**
 * Flex布局楼盘表单元显示组件
 */
export default {
  name: "UnitFlexRender",
  inject: ["store"],
  computed: {
    ...mapStates({
      logicBuildId: "logicBuild.id",
      units: "logicBuild.units",
      layout: "layout",
      unitDefinition: "unitDefinition",
      floorDefinition: "floorDefinition",
    }),
  },
  methods: {
    // 生成楼盘表单元列
    renderUnitCell(unitInfo) {
      const unitVNode = this.unitDefinition.render.call(
        this._renderProxy,
        this.$createElement,
        {
          definition: this.unitDefinition,
          store: this.store,
          logicBuildId: this.logicBuildId,
          unitInfo,
        }
      );
      return (
        <div
          key={`fd-unit-${this.logicBuildId}-${unitInfo.unitName}`}
          class="building-fd__unit"
        >
          {unitVNode}
        </div>
      );
    },
  },
  render() {
    return (
      <div
        class="unit-render-wrap unit-flex-render"
        style={{
          "--ufr-floor-width": `${this.floorDefinition.width}px`,
          "--ufr-unit-height": `${this.unitDefinition.height}px`,
        }}
      >
        <div class="unit-flex__content">
          {this.units.map((unitInfo) => {
            return (
              <div
                key={`unit-wrap-${this.logicBuildId}-${unitInfo.unitName}`}
                class="building-unit-wrap"
              >
                <div class="building-fd__header" />
                {this.renderUnitCell(unitInfo)}
              </div>
            );
          })}
        </div>
        {this.layout.hasGutter && (
          <div
            class="building-fd__gutter"
            style={{ width: `${getScrollbarWidth()}px` }}
          />
        )}
      </div>
    );
  },
};
</script>