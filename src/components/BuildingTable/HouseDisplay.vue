<script>
import { mapStates } from "./store";
import { uniqueId } from "./utils";

/**
 * 楼盘表房屋、楼层显示组件
 */
export default {
  name: "HouseDisplay",
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
    tableWidth() {
      let value = this.units.reduce((width, unit) => {
        width +=
          this.floorDefinition.width +
          this.houseDefinition.width * unit.columnCount;
        return width;
      }, 0);
      return value;
    },
    tableHeight() {
      return this.layout.height - this.unitDefinition.height;
    },
  },
  methods: {
    // 设置楼盘表内容区域布局参数
    setLayout() {
      const hasGutter = this.$el.scrollHeight > this.$el.clientHeight;
      const scrollLeft = this.$el.scrollLeft;
      this.store.commit("setLayout", {
        hasGutter,
        scrollLeft,
      });
    },
    // 同步楼盘表内容区域滚动参数
    handleScroll(e) {
      if (e.target.scrollLeft != this.layout.scrollLeft) {
        this.store.commit("setLayout", {
          scrollLeft: e.target.scrollLeft,
        });
      }
    },
    // 点击测试，过滤填充单元格，而且只响应td单元格内部的事件，因为单元格有内边距
    clickTest(house, args) {
      return house && args.target && args.target.tagName.toLowerCase() != "td";
    },
    // 触发房屋单元格事件
    raiseHouseEvent(eventName, house, args) {
      if (this.clickTest(house, args)) {
        this.$parent.$emit(eventName, house, args);
      }
    },
    // 点击房屋时切换选中状态
    handleHouseClick(house, args) {
      if (this.clickTest(house, args) && house.isEnabled) {
        this.store.commit("selectHouse", house, !house.isSelected);
        this.$parent.$emit("house-click", house, args);
      }
    },
    // 滚动房屋到视图区域，尽可能居中显示
    scrollHouseIntoView(house) {
      const { _rowIndex, _columnIndex } = house;
      const el = this.$el.querySelector(
        `table>tbody>tr:nth-child(${_rowIndex + 1})>td:nth-child(${
          _columnIndex + 1
        })`
      );
      el && el.scrollIntoView();
    },
    // 生成楼盘表房屋列定义
    renderCols() {
      const colVNodes = [];
      let nodeKey;
      for (let unit of this.units) {
        nodeKey = `col-floor-${this.logicBuildId}-${unit.unitName}`;
        colVNodes.push(
          <col
            name={nodeKey}
            key={nodeKey}
            width={this.floorDefinition.width}
          />
        );
        for (let i = 0; i < unit.columnCount; i++) {
          nodeKey = `col-house-${this.logicBuildId}-${unit.unitName}-${i}`;
          colVNodes.push(
            <col
              name={nodeKey}
              key={nodeKey}
              width={this.houseDefinition.width}
            />
          );
        }
      }
      return colVNodes;
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
        <td
          key={`td-floor-${this.logicBuildId}-${floorInfo.layer}-${unitInfo.unitName}`}
          rowspan="1"
          colspan="1"
          class="building-td__floor"
        >
          {floorVNode}
        </td>
      );
    },
    // 生成房屋单元格
    renderHouseCell(house, floorInfo, unitInfo) {
      let nodeKey = "",
        houseVNode = "",
        layerCount = 1,
        columnCount = 1,
        className = "",
        isSelected = false,
        isHighlight = false;

      // 生成房屋单元格，填充占位单元格(house:null)设置为blank
      if (house) {
        nodeKey = `td-house-${house.houseId}`;
        className = "building-td__house";
        layerCount = house.layerCount;
        columnCount = house.columnCount;
        isSelected = house.isSelected; // 选择
        isHighlight = this.locate.house
          ? house.houseId == this.locate.house.houseId
          : false; // 定位高亮
        houseVNode = this.houseDefinition.render.call(
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
      } else {
        nodeKey = `td-blank-${uniqueId()}`;
        className = "building-td__house";
      }

      return (
        <td
          key={nodeKey}
          rowspan={layerCount}
          colspan={columnCount}
          class={[
            className,
            layerCount > 1 ? "td-colspan" : "",
            isSelected ? "td-selected" : "",
            isHighlight ? "td-highlight" : "",
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
        </td>
      );
    },
    // 生成楼盘表房屋行
    renderRow(floor, floorIndex) {
      const rowVNodes = [];
      const floorInfo = this.floors[floorIndex];
      let columnIndex = 0;
      floor.forEach((unit, unitIndex) => {
        const unitInfo = this.units[unitIndex];
        // 1、生成单元内的楼层单元格
        rowVNodes.push(this.renderFloorCell(floorInfo, unitInfo));
        columnIndex++;
        // 2、生成单元内的房屋单元格，并给房屋增加行列索引用来定位房屋
        unit.forEach((house) => {
          if (house) {
            house._rowIndex = floorIndex;
            house._columnIndex = columnIndex;
          }
          rowVNodes.push(this.renderHouseCell(house, floorInfo, unitInfo));
          columnIndex++;
        });
      });
      return rowVNodes;
    },
    // 生成楼盘表房屋
    renderBody() {
      const rowVNodes = [];
      this.houses.forEach((floor, index) => {
        const { layer } = this.floors[index];
        rowVNodes.push(
          <tr
            key={`tr-floor-${this.logicBuildId}-${layer}`}
            class="building-tr_floor"
          >
            {this.renderRow(floor, index)}
          </tr>
        );
      });
      return rowVNodes;
    },
  },
  watch: {
    selections(val) {
      this.$parent.$emit("select-change", val);
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
  render() {
    return (
      <div
        class="house-display-wrap"
        style={{
          height: `${this.tableHeight}px`,
        }}
        on-scroll={this.handleScroll}
      >
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="house-display-table"
          width={`${this.tableWidth}px`}
        >
          <colgroup>{this.renderCols()}</colgroup>
          <tbody>{this.renderBody()}</tbody>
        </table>
      </div>
    );
  },
};
</script>
