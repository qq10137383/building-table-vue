<template>
  <div class="building-tool display-tool-wrap">
    <el-radio-group v-model="displayMode" size="small">
      <el-radio-button
        v-for="item in modes"
        :key="item.code"
        :label="item.code"
      >
        {{ item.name }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
/**
 * 楼盘表显示切换工具(楼盘表/列表)
 */
export default {
  name: "DisplayTool",
  inject: ["store"],
  data() {
    return {
      modes: [
        { name: "平面", code: "buildingTable" },
        { name: "列表", code: "elementTable" },
      ],
    };
  },
  computed: {
    displayMode: {
      get() {
        return this.store.states.displayMode;
      },
      set(val) {
        this.store.commit("setDisplayMode", val);
      },
    },
  },
};
</script>
