<script>
import { mapStates } from "../../store";
import { getBuildingTable } from "../../utils";
import { headerHeight } from "../../style/variables.scss";

/**
 * Flex布局楼盘表房屋、楼层显示组件
 */
export default {
  name: "HouseFlexRender",
  inject: ["store"],
  computed: {
    ...mapStates({
      logicBuildId: "logicBuild.id",
      floors: "logicBuild.floors",
      units: "logicBuild.units",
      houses: "logicBuild.houses",
      selections: "selection",
      locate: "locate",
      layout: "layout",
      unitDefinition: "unitDefinition",
      floorDefinition: "floorDefinition",
      houseDefinition: "houseDefinition",
    }),
    tableHeight() {
      return (
        this.layout.height - parseInt(headerHeight) - this.unitDefinition.height
      );
    },
  },
  watch: {
    selections(val) {
      const root = getBuildingTable(this);
      root && root.$emit("select-change", val);
    },
    "locate.key"() {
      const house = this.locate.house;
      if (house) {
        this.scrollHouseIntoView(house);
      }
    },
  },
  updated() {
    this.setLayout();
  },
  mounted() {
    this.setLayout();
  },
  methods: {
    // 设置楼盘表内容区域布局参数
    setLayout() {
      const hasGutter = this.$el.scrollHeight > this.$el.clientHeight;
      this.store.commit("setLayout", {
        hasGutter,
      });
    },
    // 点击测试，只响应单元格内部的事件，因为单元格有内边距
    clickTest(args) {
      return !args.target.classList.contains("building-fd__house");
    },
    // 触发房屋单元格事件
    raiseHouseEvent(eventName, house, event) {
      if (this.clickTest(event)) {
        const root = getBuildingTable(this);
        root && root.$emit(eventName, { house, event });
      }
    },
    // 点击房屋时切换选中状态
    handleHouseClick(house, event) {
      if (this.clickTest(event) && house.isEnabled) {
        this.store.commit("selectHouse", house, !house.isSelected);
        const root = getBuildingTable(this);
        root && root.$emit("house-click", { house, event });
      }
    },
    // 滚动房屋到视图区域，尽可能居中显示
    scrollHouseIntoView(house) {
      const el = this.$el.querySelector(`[data-id='${house.houseId}']`);
      el && el.scrollIntoView();
    },
    // 生成楼层单元格
    renderFloorCell(floorInfo, unitInfo) {
      const floorVNode = this.floorDefinition.render.call(
        this._renderProxy,
        this.$createElement,
        {
          definition: this.floorDefinition,
          store: this.store,
          logicBuildId: this.logicBuildId,
          floorInfo,
          unitInfo,
        }
      );
      return (
        <div
          key={`fd-floor-${this.logicBuildId}-${floorInfo.layer}-${unitInfo.unitName}`}
          class="building-fd__floor"
        >
          {floorVNode}
        </div>
      );
    },
    // 生成房屋单元格
    renderHouseCell(house, floorInfo, unitInfo) {
      const isHighlight = this.locate.house
        ? house.houseId === this.locate.house.houseId
        : false; // 定位高亮
      const houseVNode = this.houseDefinition.render.call(
        this._renderProxy,
        this.$createElement,
        {
          definition: this.houseDefinition,
          store: this.store,
          logicBuildId: this.logicBuildId,
          floorInfo,
          unitInfo,
          houseInfo: house,
        }
      );
      return (
        <div
          key={`fd-house-${house.houseId}`}
          data-id={house.houseId}
          class={[
            "building-fd__house",
            house.isSelected ? "house-selected" : "",
            isHighlight ? "house-highlight" : "",
          ]}
          on-click={($event) => this.handleHouseClick(house, $event)}
          on-dblclick={($event) =>
            this.raiseHouseEvent("house-dbclick", house, $event)
          }
          on-mouseover={($event) =>
            this.raiseHouseEvent("house-over", house, $event)
          }
          on-mouseout={($event) =>
            this.raiseHouseEvent("house-out", house, $event)
          }
          on-contextmenu={($event) =>
            this.raiseHouseEvent("house-contextmenu", house, $event)
          }
        >
          {houseVNode}
        </div>
      );
    },
    // 生成楼盘表房屋行
    renderRow(floor, floorIndex) {
      const floorInfo = this.floors[floorIndex];
      return floor.map((unit, unitIndex) => {
        const unitInfo = this.units[unitIndex];
        return (
          <div
            key={`fr-unit-${this.logicBuildId}-${floorInfo.layer}-${unitInfo.unitName}`}
            class="building-fr__unit-wrap"
          >
            {this.renderFloorCell(floorInfo, unitInfo)}
            <div class="building-fr__house-wrap">
              <div class="building-fr__house-inner">
                {unit.map((house) => {
                  return this.renderHouseCell(house, floorInfo, unitInfo);
                })}
              </div>
            </div>
          </div>
        );
      });
    },
  },
  render() {
    return (
      <div
        class="house-render-wrap house-flex-render"
        style={{
          height: `${this.tableHeight}px`,
          "--hfr-floor-width": `${this.floorDefinition.width}px`,
          "--hfr-house-width": `${this.houseDefinition.width}px`,
        }}
      >
        {this.houses.map((floor, index) => {
          const { layer } = this.floors[index];
          return (
            <div
              key={`fr-floor-${this.logicBuildId}-${layer}`}
              class="building-fr_floor"
            >
              {this.renderRow(floor, index)}
            </div>
          );
        })}
      </div>
    );
  },
};
</script>