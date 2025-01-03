<template>
  <div class="building-tool locate-tool-wrap">
    <el-input
      v-model="locateParams.houseNo"
      placeholder="房号定位"
      size="small"
      class="locate-tool__input"
      @keydown.enter.native="locateHouse"
    >
      <el-select
        v-if="unitInfos.length > 1"
        v-model="locateParams.unitName"
        slot="prepend"
        placeholder="单元"
      >
        <el-option
          v-for="unit in unitInfos"
          :key="unit.unitName"
          :label="unit.unitName"
          :value="unit.unitName"
        ></el-option>
      </el-select>
      <i
        slot="suffix"
        class="el-input__icon el-icon-aim"
        title="定位房屋"
        @click="locateHouse"
      ></i>
    </el-input>
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
