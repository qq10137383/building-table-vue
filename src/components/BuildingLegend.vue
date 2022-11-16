<template>
  <div class="building-legend-wrap">
    <div
      v-for="(legend, index) in legends"
      :key="index"
      class="legend-item"
      :title="legend.name"
    >
      <span class="legend-item__symbol" :style="getStyle(legend)" />
      <span class="legend-item__text">{{ legend.name }}</span>
      <span class="legend-item__count">({{ getCount(legend) }})</span>
    </div>
  </div>
</template>
<script>
import { mapStates } from "./store";
import { toColor } from "./utils";

/**
 * 楼盘表图例
 */
export default {
  name: "BuildingLegend",
  computed: {
    ...mapStates({
      legends: "legends",
      logicBuild: "logicBuild",
    }),
  },
  methods: {
    // 获取图例样式
    getStyle(legend) {
      return {
        backgroundColor: toColor(legend.value),
      };
    },
    // 获取统计数量
    getCount(legend) {
      let count = 0;
      for (const floor of this.logicBuild.houses) {
        for (const unit of floor) {
          for (const house of unit) {
            if (house) {
              const has = (house.symbols || []).some(
                (m) => m.code === legend.code
              );
              has && count++;
            }
          }
        }
      }
      return count;
    },
  },
};
</script>

