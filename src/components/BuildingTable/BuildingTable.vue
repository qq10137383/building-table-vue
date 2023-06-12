<template>
  <div :class="['building-table-wrap', className]" :style="tableStyle">
    <div v-if="logicBuild.id" class="building-table__visual">
      <div class="building-table__header">
        <building-header :show-title="showTitle" :tools="tools" />
      </div>
      <div :class="['building-table__content', { 'has-legend': showLegends }]">
        <div class="building-table__content-left">
          <building-render />
        </div>
        <div class="building-table__content-right">
          <building-legend />
        </div>
      </div>
    </div>
    <div v-else class="building-table__tip" :style="{ height: `${height}px` }">
      {{ tipText }}
    </div>
    <slot />
  </div>
</template>

<script>
import { createStore, mapStates } from "./store";
import BuildingHeader from "./BuildingHeader";
import BuildingRender from "./renders";
import BuildingLegend from "./BuildingLegend";

/**
 * 楼盘表控件
 */
export default {
  name: "BuildingTable",
  isBuildingTable: true,
  components: {
    BuildingHeader,
    BuildingRender,
    BuildingLegend,
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
      default: () => { },
    },
    // 楼盘表高度
    height: {
      type: Number,
      default: 600,
    },
    // 楼盘表数据
    buildingData: {
      type: Object,
      default: () => { },
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
    // 楼盘表渲染模式，可以是表格布局(table)、弹性布局(flex)
    renderMode: {
      type: String,
      validator: (val) => ["table", "flex"].includes(val),
      default: "table",
    },
    // 是否显示标题
    showTitle: {
      type: Boolean,
      default: false,
    },
    // 是否显示图例
    showLegends: {
      type: Boolean,
      default: true,
    },
    // 楼盘表工具，可以是"locate", "select", "switchLogic"的组合
    tools: {
      type: Array,
      default: () => ["locate", "switchLogic"],
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
      layout: {
        height: this.height,
      },
    });
    return {};
  },
  computed: {
    ...mapStates({
      selections: "selection",
      logicBuild: "logicBuild",
    }),
  },
  watch: {
    buildingData: "setData",
    logicBuildId: "changeLogicBuild",
    logicBuild(val) {
      this.$emit("logic-build-change", val.id);
    },
    height(val) {
      this.store.commit("setLayout", {
        height: val,
      });
    },
    renderMode: "setRenderMode",
  },
  mounted() {
    this.refresh();
  },
  methods: {
    // 设置楼盘表数据源，同属性buildingData
    setData(data) {
      if (data) {
        this.store.commit("setData", data);
        this.store.commit("setLogicBuild", this.logicBuildId);
      } else {
        this.clearData()
      }
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
    // 设置渲染模式
    setRenderMode(mode) {
      this.store.commit("setBuilerType", mode);
      this.refresh();
    },
    // 刷新楼盘表
    refresh() {
      this.setData(this.buildingData);
    },
  },
  provide() {
    return {
      store: this.store,
    };
  },
};
</script>

<style lang="scss">
@import "./style/index.scss";
</style>
