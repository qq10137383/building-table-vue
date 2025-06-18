<template>
  <div
    v-if="showLogic"
    class="building-tool switch-logic-tool-wrap"
  >
    <el-radio-group
      v-model="logicId"
      size="small"
    >
      <el-radio-button
        v-for="logic in logicInfos"
        :key="logic.id"
        :label="logic.id"
      >
        {{ logic.name }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import { mapStates } from "../store";

/**
 * 逻辑幢选择组件
 */
export default {
  name: "SwitchLogicTool",
  inject: ["store"],
  computed: {
    ...mapStates({
      logicInfos: "logicInfos",
    }),
    showLogic() {
      return !(
        this.logicInfos.length == 1 && this.logicInfos[0].name == "未分区"
      );
    },
    logicId: {
      get() {
        return this.store.states.logicBuild.id;
      },
      set(val) {
        this.store.commit("setLogicBuild", val);
      },
    },
  },
};
</script>
