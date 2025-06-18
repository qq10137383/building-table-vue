<template>
  <div
    v-if="useMode === 'multiple'"
    class="building-tool select-tool-wrap"
  >
    <el-checkbox
      v-model="selectAll"
      @change="handleChange"
    >
      全选/反选
    </el-checkbox>
  </div>
</template>

<script>
import { mapStates } from "../store";

/**
 * 选择工具，仅多选模式时可用
 */
export default {
  name: "SelectTool",
  inject: ["store"],
  computed: {
    ...mapStates({
      useMode: "useMode",
      dataKey: "dataKey",
    }),
  },
  data() {
    return {
      selectAll: false,
    };
  },
  watch: {
    // 数据更新时重置
    dataKey() {
      this.selectAll = false;
    },
  },
  methods: {
    handleChange(checked) {
      if (checked) {
        this.store.commit("selectAll", true);
      } else {
        this.store.commit("clearSelect");
      }
    },
  },
};
</script>
