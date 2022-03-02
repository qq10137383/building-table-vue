<template>
  <div class="building-legend-wrap">
    <div
      class="legend-item"
      v-for="(legend, index) in legends"
      :key="index"
      :title="legend.name"
    >
      <span class="legend-item__symbol" :style="getStyle(legend)"></span>
      <span class="legend-item__text">{{ legend.name }}</span>
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
    }),
  },
  methods: {
    // 获取图例样式
    getStyle(legend) {
      return {
        backgroundColor: toColor(legend.value),
      };
    },
  },
};
</script>

