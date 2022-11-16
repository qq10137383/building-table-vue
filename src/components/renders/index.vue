<template>
  <div class="building-render-wrap">
    <template v-if="hasData">
      <template v-if="builderType === 'table'">
        <unit-table-render />
        <house-table-render />
      </template>
      <template v-else-if="builderType === 'flex'">
        <unit-flex-render />
        <house-flex-render />
      </template>
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
import { mapStates } from "../store";
import { headerHeight } from "../style/variables.scss";

// table布局
import UnitTableRender from "./table/UnitTableRender";
import HouseTableRender from "./table/HouseTableRender";

// flex布局
import UnitFlexRender from "./flex/UnitFlexRender";
import HouseFlexRender from "./flex/HouseFlexRender";

/**
 * 楼盘表视图渲染器
 */
export default {
  name: "BuildingRender",
  components: {
    UnitTableRender,
    HouseTableRender,
    UnitFlexRender,
    HouseFlexRender,
  },
  inject: ["store"],
  computed: {
    ...mapStates({
      builderType: "builderType",
    }),
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
