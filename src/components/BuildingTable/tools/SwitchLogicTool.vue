<template>
  <div class="building-tool switch-logic-tool-wrap">
    <div
      v-for="logic in logicInfos"
      :key="logic.id"
      :class="[
        'logic-item',
        {
          'logic-checked': logic.id == logicBuildId,
        },
      ]"
      @click="changeLogicBuild(logic.id)"
    >
      {{ logic.name }}
    </div>
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
      logicBuildId: "logicBuild.id",
    }),
  },
  methods: {
    // 切换逻辑幢
    changeLogicBuild(logicId) {
      this.store.commit("setLogicBuild", logicId);
    },
  },
};
</script>