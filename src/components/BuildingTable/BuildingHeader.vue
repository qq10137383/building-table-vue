<template>
  <div class="building-header-wrap">
    <h4 class="building-header_title">{{ title }}</h4>
    <div class="building-header__left">
      <switch-tool />
    </div>
    <div class="building-header__right">
      <locate-tool />
    </div>
  </div>
</template>

<script>
import SwitchTool from "./tools/SwitchTool";
import LocateTool from "./tools/LocateTool";

/**
 * 楼盘表标题栏
 */
export default {
  name: "BuildingHeader",
  inject: ["store"],
  components: {
    SwitchTool,
    LocateTool,
  },
  computed: {
    title() {
      const { buildName, buildAddress } = this.store.states;
      return buildName ? `${buildName}(${buildAddress})` : "";
    },
  },
};
</script>