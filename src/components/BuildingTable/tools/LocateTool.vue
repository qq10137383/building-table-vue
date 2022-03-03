<template>
  <div class="building-tool locate-tool-wrap">
    <select class="locate-tool__select" v-model="locateParams.unitName">
      <option v-for="unit in unitInfos" :key="unit.unitName">
        {{ unit.unitName }}
      </option>
    </select>
    <input
      class="locate-tool__input"
      v-model="locateParams.houseNo"
      placeholder="房号定位"
      style="width: 60px"
      @keyup.enter="locateHouse"
    />
    <span
      class="building-tool__button locate-button"
      title="定位房屋"
      @click="locateHouse"
    ></span>
  </div>
</template>

<script>
import { mapStates } from "../store";

/**
 * 定位工具组件
 */
export default {
  name: "LocateTool",
  inject: ["store"],
  data() {
    return {
      locateParams: {
        unitName: "", // 选择的单元
        houseNo: "", // 房号
      },
    };
  },
  computed: {
    ...mapStates({
      unitInfos: "logicBuild.units",
    }),
  },
  watch: {
    unitInfos: {
      handler(val) {
        if (val && val.length) {
          this.locateParams.unitName = val[0].unitName;
        }
      },
      immediate: true,
    },
  },
  methods: {
    locateHouse() {
      this.store.commit("setLocateHouse", this.locateParams);
    },
  },
};
</script>