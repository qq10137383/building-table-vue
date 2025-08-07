<template>
  <div
    :class="['building-table-wrap', className, { 'no-data': !logicBuild.id }]"
    :style="wrapStyle"
  >
    <div class="building-table__visual">
      <div v-if="showHeader" class="building-table__header">
        <building-header :show-title="showTitle" :tools="tools" />
      </div>
      <div class="building-table__content">
        <div class="building-table__content-left">
          <building-render />
        </div>
        <div class="building-table__content-right">
          <building-sidebar
            v-if="showSidebar"
            :sidebar-panels="sidebarPanels"
            :active-panel="activePanel"
          />
        </div>
      </div>
    </div>
    <div
      v-if="!logicBuild.id"
      class="building-table__tip"
      :style="{ height: `${layout.height}px` }"
    >
      {{ tipText }}
    </div>
    <div v-if="showFooter" class="building-table__footer">
      <building-statistic
        v-if="statisticData"
        v-loading="statisticLoading"
        :statistic-data="statisticData"
        :max-column="statisticMaxColumn"
        :statistic-float="statisticFloat"
        @collapse-change="resize"
      />
      <slot name="footer" />
    </div>
    <House-tooltip :delay-time="tooltipDelayTime">
      <template v-slot="house">
        <slot name="tooltip" v-bind="house" />
      </template>
    </House-tooltip>
    <slot />
  </div>
</template>

<script>
import { createStore, mapStates } from "./store";
import BuildingHeader from "./BuildingHeader";
import BuildingRender from "./renders";
import BuildingSidebar from "./BuildingSidebar";
import BuildingStatistic from "./BuildingStatistic";
import HouseTooltip from "./HouseTooltip";

/**
 * 楼盘表控件
 */
export default {
  name: "BuildingTable",
  isBuildingTable: true,
  components: {
    BuildingHeader,
    BuildingRender,
    BuildingSidebar,
    BuildingStatistic,
    HouseTooltip,
  },
  props: {
    // 楼盘表自定义样式类名
    className: {
      type: String,
      default: "",
    },
    // 楼盘表自定义样式
    tableStyle: {
      type: Object,
      default: () => {},
    },
    // 楼盘表高度，可以是数字、百分比(%,vh)、计算高度(calc)、'auto'等
    height: {
      type: [Number, String],
      default: 600,
    },
    // 楼盘表数据
    buildingData: {
      type: Object,
      default: () => null,
    },
    // 当前逻辑幢ID，为空时加载第一个逻辑幢
    logicBuildId: {
      type: String,
      default: "",
    },
    // 楼盘表选择模式，在buildingData的useMode不为空时优先级低于buildingData的useMode
    selectionMode: {
      type: String,
      validator: (val) => ["single", "multiple", "disable"].includes(val),
      default: "multiple",
    },
    // 楼盘表显示模式，可以是buildingTable(楼盘表)、elementTable(列表)
    displayMode: {
      type: String,
      validator: (val) => ["buildingTable", "elementTable"].includes(val),
      default: "buildingTable",
    },
    // 显示模式为楼盘表(buildingTable)时使用的布局模式，可以是表格布局(table)、弹性布局(flex)
    renderMode: {
      type: String,
      validator: (val) => ["table", "flex"].includes(val),
      default: "table",
    },
    // 是否显示导航栏
    showHeader: {
      type: Boolean,
      default: true,
    },
    // 是否显示标题
    showTitle: {
      type: Boolean,
      default: true,
    },
    // 楼盘表工具，可以是"locate", "select", "switchLogic"，"display"的组合
    tools: {
      type: Array,
      default: () => ["locate", "switchLogic", "display"],
    },
    // 是否显示侧边栏
    showSidebar: {
      type: Boolean,
      default: true,
    },
    // 侧边栏面板，可以是"legend"、"tag"的组合
    sidebarPanels: {
      type: Array,
      default: () => ["legend", "tag"],
    },
    // 激活的侧边栏面板，默认激活第一个
    activePanel: {
      type: String,
      default: "",
    },
    // 图例选项
    legendOptions: {
      type: Object,
      default: () => null,
    },
    // 标签选项
    tagOptions: {
      type: Object,
      default: () => null,
    },
    // 是否显示页脚
    showFooter: {
      type: Boolean,
      default: true,
    },
    // 统计数据
    statisticData: {
      type: Array,
      default: () => null,
    },
    // 统计最多显示几列
    statisticMaxColumn: {
      type: Number,
      default: 6,
    },
    // 统计加载中
    statisticLoading: {
      type: Boolean,
      default: false,
    },
    // 统计排列方向
    statisticFloat: {
      type: String,
      validator: (val) => ["left", "right"].includes(val),
      default: "left",
    },
    // 延时显示tooltip时间(毫秒)
    tooltipDelayTime: {
      type: Number,
      default: 1000,
    },
    // 提示信息
    tipText: {
      type: String,
      default: "暂无数据",
    },
  },
  data() {
    // 初始化store
    this.store = createStore({
      useMode: this.selectionMode,
      builderType: this.renderMode,
      displayMode: this.displayMode,
    });
    return {};
  },
  computed: {
    ...mapStates({
      selections: "selection",
      logicBuild: "logicBuild",
      layout: "layout",
    }),
    wrapStyle() {
      const style = this.tableStyle || {};
      style.height =
        typeof this.height == "number" ? `${this.height}px` : this.height;
      return style;
    },
  },
  watch: {
    buildingData: "setData",
    logicBuildId: "changeLogicBuild",
    logicBuild(val) {
      this.$emit("logic-build-change", val.id);
    },
    displayMode: "setDisplayMode",
    renderMode: "setRenderMode",
    statisticData() {
      this.$nextTick(() => this.resize());
    },
  },
  mounted() {
    this.observeResize();
    this.refresh();
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  },
  methods: {
    // 设置楼盘表数据源，同属性buildingData
    setData(data) {
      if (data) {
        this.store.commit("setData", data);
        this.store.commit("setLogicBuild", this.logicBuildId);
      } else {
        this.clearData();
      }
      this.$nextTick(() => this.resize());
    },
    // 清除数据源
    clearData() {
      this.store.commit("clearData");
    },
    // 获取楼盘表选择的房屋(onlyId为true时仅返回房屋ID集合，否则返回房屋集合)
    getSelections(onlyId = false) {
      return onlyId
        ? this.selections.map((house) => house.houseId)
        : this.selections;
    },
    // 切换逻辑幢(logicId：逻辑幢ID)，同属性logicBuildId
    changeLogicBuild(logicId) {
      this.store.commit("setLogicBuild", logicId);
    },
    // 增加房屋选择(houseIds：房屋ID集合)
    addSelections(houseIds) {
      this.store.commit("addSelectHouses", houseIds);
    },
    // 移除房屋选择(houseIds：房屋ID集合)
    removeSelections(houseIds) {
      this.store.commit("removeSelectHouses", houseIds);
    },
    // 全选(onlyEnabled为true，isEnabled为false的房屋不会被选中)
    selectAll(onlyEnabled = true) {
      this.store.commit("selectAll", onlyEnabled);
    },
    // 清空选择
    clearSelection() {
      this.store.commit("clearSelect");
    },
    // 设置显示模式
    setDisplayMode(mode) {
      this.store.commit("setDisplayMode", mode);
    },
    // 设置楼盘表布局模式
    setRenderMode(mode) {
      this.store.commit("setBuilerType", mode);
      this.refresh();
    },
    // 设置房屋显示的标签
    setCheckedTags(tagProps) {
      this.store.commit("setCheckedTags", tagProps);
    },
    // 检测高度变化
    observeResize() {
      this.resizeObserver = new ResizeObserver(() => {
        this.resize();
      });
      this.resizeObserver.observe(this.$el);
    },
    // 重新布局
    resize() {
      if (this.height == "auto") return;
      const rs = getComputedStyle(this.$el);
      const ft = this.$el.querySelector(".building-table__footer");
      const fts = getComputedStyle(ft);
      let visualHeight =
        this.$el.clientHeight -
        parseInt(rs.paddingTop || 0) -
        parseInt(rs.paddingBottom || 0) -
        parseInt(fts.marginTop || 0) -
        (ft.clientHeight ? ft.clientHeight + 6 : 0);
      visualHeight = Math.max(visualHeight, 0);
      this.store.commit("setLayout", { height: visualHeight });
    },
    // 刷新楼盘表
    refresh() {
      this.setData(this.buildingData);
    },
  },
  provide() {
    return {
      store: this.store,
      buildingTableProps: this.$props,
    };
  },
};
</script>

<style lang="scss">
@import "./style/index.scss";
</style>
