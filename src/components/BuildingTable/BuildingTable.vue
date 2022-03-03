<template>
  <div :class="['building-table-wrap', className]" :style="tableStyle">
    <div v-if="logicBuild.id" class="building-table__visual">
      <div class="building-table__header">
        <building-header />
      </div>
      <div class="building-table__content">
        <div class="building-table__content-left">
          <unit-display />
          <house-display />
        </div>
        <div class="building-table__content-right">
          <building-legend />
        </div>
      </div>
    </div>
    <div
      v-else
      class="building-table__tip"
      :style="{ height: `${this.height}px` }"
    >
      {{ tipText }}
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { createStore, mapStates } from "./store";
import { headerHeight } from "./style/variables.scss";
import BuildingHeader from "./BuildingHeader";
import UnitDisplay from "./UnitDisplay";
import HouseDisplay from "./HouseDisplay";
import BuildingLegend from "./BuildingLegend";

/**
 * 楼盘表控件
 */
export default {
  name: "BuildingTable",
  components: {
    BuildingHeader,
    UnitDisplay,
    HouseDisplay,
    BuildingLegend,
  },
  props: {
    // 楼盘表自定义样式类名
    className: String,
    // 楼盘表自定义样式
    tableStyle: Object,
    // 楼盘表高度
    height: {
      type: Number,
      default: 600,
    },
    // 楼盘表数据
    buildingData: Object,
    // 当前逻辑幢ID，为空时加载第一个逻辑幢，使用.sync可双向绑定
    logicBuildId: String,
    // 楼盘表选择模式，优先级低于buildingData的useMode
    useMode: {
      type: String,
      validator: (val) => ["single", "multiple", "disable"].includes(val),
      default: "multiple",
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
      useMode: this.useMode,
      layout: {
        height: this.height - parseInt(headerHeight),
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
  methods: {
    // 设置楼盘表数据源，同属性buildingData
    setData(data) {
      if (data) {
        this.store.commit("setData", data);
        this.store.commit("setLogicBuild", this.logicBuildId);
      }
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
    // 清空选择
    clearSelection() {
      this.store.commit("clearSelect");
    },
  },
  watch: {
    buildingData: "setData",
    logicBuildId: "changeLogicBuild",
    logicBuild(val) {
      this.$emit("logic-build-change", val.id);
      this.$emit("update:logicBuildId", val.id);
    },
    height(val) {
      this.store.commit("setLayout", {
        height: val - parseInt(headerHeight),
      });
    },
  },
  provide() {
    return {
      store: this.store,
    };
  },
  mounted() {
    this.setData(this.buildingData);
  },
};
</script>

<style lang="scss">
@import "./style/index.scss";
</style>