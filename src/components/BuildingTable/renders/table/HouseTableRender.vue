<script>
import { mapStates } from "../../store";
import { uniqueId, getBuildingTable } from "../../utils";
import { headerHeight } from "../../style/variables.scss";

/**
 * 表格布局楼盘表房屋、楼层显示组件
 */
export default {
  name: "HouseTableRender",
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
      const value = this.units.reduce((width, unit) => {
        width +=
          this.floorDefinition.width +
          this.houseDefinition.width * unit.columnCount;
        return width;
      }, 0);
      return value;
    },
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
    // 设置楼盘表内容区域布局参数和空楼层高度
    setLayout() {
      const hasGutter = this.tableWidth >= this.$el.clientWidth
        && this.$el.scrollHeight > this.$el.clientHeight;
      const scrollLeft = this.$el.scrollLeft;
      this.store.commit("setLayout", {
        hasGutter,
        scrollLeft,
      });
      this.setFloorsHeight();
    },
    // 设置楼层高度(空楼层、跨行楼层没有单元格支撑高度，需要从其他行高度设置)
    setFloorsHeight() {
      const heights = Array.from(this.$el.querySelectorAll("tbody>tr")).map(
        (m) => m.clientHeight
      );
      if (heights.length == 0) return;
      // 计算出最大层高，将小于最大层高的楼层设为最大层高
      const maxHeight = Math.max.apply(null, heights);
      heights.forEach((h, index) => {
        if (h != maxHeight) {
          const row = this.$el.querySelector(`tbody>:nth-child(${index + 1})`);
          row && (row.style.height = `${maxHeight}px`);
        }
      });
    },
    // 同步楼盘表内容区域滚动参数
    handleScroll(e) {
      if (e.target.scrollLeft !== this.layout.scrollLeft) {
        this.store.commit("setLayout", {
          scrollLeft: e.target.scrollLeft,
        });
      }
    },
    // 点击测试，过滤填充单元格，而且只响应td单元格内部的事件，因为单元格有内边距
    clickTest(house, args) {
      return house && args.target && args.target.tagName.toLowerCase() !== "td";
    },
    // 触发房屋单元格事件
    raiseHouseEvent(eventName, house, event) {
      if (this.clickTest(house, event)) {
        const root = getBuildingTable(this);
        root && root.$emit(eventName, { house, event });
      }
    },
    // 点击房屋时切换选中状态
    handleHouseClick(house, event) {
      if (this.clickTest(house, event) && house.isEnabled) {
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
    // 生成楼盘表房屋列定义
    renderCols() {
      const colVNodes = [];
      let nodeKey;
      for (const unit of this.units) {
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
      let nodeKey = "";
      let houseVNode = "";
      let layerCount = 1;
      let columnCount = 1;
      let className = "";
      let isSelected = false;
      let isHighlight = false;

      // 生成房屋单元格，填充占位单元格(house:null)设置为blank
      if (house) {
        nodeKey = `td-house-${house.houseId}`;
        className = "building-td__house";
        layerCount = house.layerCount;
        columnCount = house.columnCount;
        isSelected = house.isSelected; // 选择
        isHighlight = this.locate.house
          ? house.houseId === this.locate.house.houseId
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
          data-id={house && house.houseId}
          rowspan={layerCount}
          colspan={columnCount}
          class={[
            className,
            layerCount > 1 ? "house-colspan" : "",
            isSelected ? "house-selected" : "",
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
          on-mousemove={($event) =>
            this.raiseHouseEvent("house-move", house, $event)
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
      return this.houses.map((floor, index) => {
        const { layer } = this.floors[index];
        // 判断是否是空楼层空楼层需要填充高度
        const isEmpty = !floor.some(unit =>
          unit.some(m => Boolean(m && m.layerCount == 1))
        );
        return (
          <tr
            key={`tr-floor-${this.logicBuildId}-${layer}`}
            data-empty={isEmpty}
            class="building-tr_floor"
          >
            {this.renderRow(floor, index)}
          </tr>
        );
      });
    },
  },
  render() {
    return (
      <div
        class="house-render-wrap house-table-render"
        style={{
          height: `${this.tableHeight}px`,
        }}
        on-scroll={this.handleScroll}
      >
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="house-table"
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
