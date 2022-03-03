<template>
  <div class="building-content-wrap">
    <template v-if="hasData">
      <unit-display />
      <house-display />
    </template>
    <div
      v-else
      class="building-table__empty"
      :style="{ height: `${contentHeight}px` }"
    >
      分区无数据
    </div>
  </div>
</template>

<script>
import UnitDisplay from "./UnitDisplay";
import HouseDisplay from "./HouseDisplay";
import { headerHeight } from "./style/variables.scss";

export default {
  name: "BuildingContent",
  components: {
    UnitDisplay,
    HouseDisplay,
  },
  inject: ["store"],
  computed: {
    hasData() {
      const { houses } = this.store.states.logicBuild;
      return houses && houses.length > 0;
    },
    contentHeight() {
      return this.store.states.layout.height - parseInt(headerHeight) - 3;
    },
  },
};
</script>
