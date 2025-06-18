<template>
  <div :class="['building-statistic-wrap', `float-${statisticFloat}`, { 'is-collapsed': collapsed }]">
    <div
      class="building-statistic__btn"
      @click="setCollapsed"
    >
      <el-icon
        class="building-statistic__icon el-icon-d-arrow-right"
        title="折叠/收起统计信息"
      />
    </div>
    <div class="building-statistic__content">
      <div
        v-for="(column, columnIndex) in columnData"
        :key="columnIndex"
        :class="[
          'building-statistic__column',
          columnIndex % 2 == 0 ? 'name-column' : 'value-column',
        ]"
      >
        <div
          v-for="(row, rowIndex) in column"
          :key="rowIndex"
          class="building-statistic__row"
        >
          {{ row }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 楼盘表统计数据
 */
export default {
  name: "BuildingStatistic",
  props: {
    // 统计数据
    statisticData: {
      type: Array,
      default: () => [],
    },
    // 最多显示几列
    maxColumn: {
      type: Number,
      default: 6,
    },
    // 统计排列方向
    statisticFloat: {
      type: String,
      validator: (val) => ['left', 'right'].includes(val),
      default: 'left'
    }
  },
  data() {
    return {
      collapsed: false,
    }
  },
  computed: {
    // 视图数据(为了使列宽自适应，行渲染转为列渲染)
    columnData() {
      const statItems = this.statisticData || [];
      const totalCount = statItems.length;
      const columnCount = Math.min(totalCount, this.maxColumn);
      const rowCount =
        columnCount > 0 ? Math.ceil(totalCount / columnCount) : 0;
      const statColumns = Array.from({ length: columnCount * 2 }, () => []);
      for (let i = 0; i < columnCount; i++) {
        for (let j = 0; j < rowCount; j++) {
          const index = j * columnCount + i;
          if (index <= totalCount - 1) {
            statColumns[i * 2].push(statItems[index].name);
            statColumns[i * 2 + 1].push(statItems[index].value);
          }
        }
      }
      return statColumns;
    },
  },
  methods: {
    async setCollapsed() {
      this.collapsed = !this.collapsed
      await this.$nextTick()
      this.$emit('collapse-change', this.collapsed)
    }
  }
};
</script>
