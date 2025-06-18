<template>
  <div class="building-legend-wrap sidebar-content__item">
    <h4 class="sidebar-content__title">
      房屋状态
    </h4>
    <div class="sidebar-content__visual building-legend__content">
      <div
        v-for="group in Object.keys(legendGroups)"
        :key="group"
        class="sidebar-item__group"
      >
        <div
          v-for="(legend, index) in legendGroups[group]"
          :key="index"
          class="legend-item"
          :title="getName(legend)"
        >
          <legend-symbol
            :item="legend"
            mode="legend"
          />
          <span class="legend-item__text"> {{ getName(legend) }}</span>
          <span class="legend-item__count">({{ legend.count }})</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { deepClone } from "./utils";
import LegendSymbol from "./LegendSymbol";

const defaultOptions = {
  // 是否分组显示
  showGroup: true,
  // 分组字段
  groupField: "tllx",
};

/**
 * 楼盘表图例
 */
export default {
  name: "BuildingLegend",
  inject: ["store", "buildingTableProps"],
  components: {
    LegendSymbol,
  },
  computed: {
    // 获取buildingTable的legendOptions属性
    legendOptions() {
      const { legendOptions } = this.buildingTableProps;
      const options = Object.assign({}, defaultOptions, legendOptions || {});
      return options;
    },
    legendGroups() {
      const legends = deepClone(this.store.states.legends || []);
      this.statisticLegends(legends);
      const groups = this.groupLegends(legends);
      return groups;
    },
  },
  methods: {
    // 获取图例名称(兼容老数据)
    getName(m) {
      return m.text || m.tlmc || m.name;
    },
    // 统计图例数量
    statisticLegends(legends) {
      const houses = this.store.states.logicBuild.houses || [];
      const countMap = {};
      houses.forEach((layer) => {
        layer.forEach((unit) => {
          unit.forEach((house) => {
            if (!house) return;
            (house.symbols || []).forEach((n) => {
              const key = this.getName(n);
              countMap[key] = (countMap[key] || 0) + 1;
            });
          });
        });
      });
      legends.forEach((m) => {
        const key = this.getName(m);
        m.count = countMap[key] || 0;
      });
      return legends;
    },
    // 图例分组
    groupLegends(legends) {
      const { showGroup, groupField } = this.legendOptions;
      const groups = {};
      const hasGroup = showGroup && !!groupField;
      for (const item of legends) {
        const key = (hasGroup && item[groupField]) || "default";
        const children = groups[key] || (groups[key] = []);
        children.push(item);
      }
      // 排序
      for (const item in groups) {
        groups[item].sort((m, n) => m.pxh - n.pxh);
      }
      return groups;
    },
  },
};
</script>
