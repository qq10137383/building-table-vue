<template>
  <div class="building-table-demo">
    <el-button type="primary" @click="open">打开楼盘表</el-button>
    <el-dialog title="楼盘表" top="50px" width="90%" :visible.sync="visible">
      <building-table
        height="calc(100vh - 165px)"
        v-bind="$attrs"
        :building-data="buildingData"
        :statistic-data="statisticData"
        @house-click="houseClick"
        @house-title-click="houseTitleClick"
        @select-change="selectChange"
      >
        <!-- 单元单元格配置定义，如需要完全自定义单元单元格内容模板，使用slot-scope -->
        <!-- <unit-definition>
        <template slot-scope="scope">
          <div class="unit">{{ scope.unitInfo.unitName }}</div>
        </template>
      </unit-definition> -->
        <!-- 楼层单元格配置定义，如需要完全自定义楼层单元格内容模板，使用slot-scope -->
        <!-- <floor-definition>
        <template slot-scope="scope">
          <div class="floor">{{ scope.floorInfo.name }}</div>
        </template>
      </floor-definition> -->
        <!-- 房屋单元格配置定义，如需要完全自定义房屋单元格内容模板，使用slot-scope -->
        <!-- <house-definition :excludeFields="excludeFields">
        <template slot-scope="scope">
          <div class="house-cell-wrap">{{ scope.houseInfo.houseName }}</div>
        </template>
      </house-definition> -->
        <!-- 自定义标题栏左侧工具栏 -->
        <!-- <template v-slot:headerLeft>
        <div class="building-tool">left-slot</div>
      </template> -->
        <!-- 自定义标题栏右侧工具栏 -->
        <!-- <template v-slot:headerRight>
        <div class="building-tool">right-slot</div>
      </template> -->
        <!-- tooltip组件 -->
        <!-- <house-tooltip>
        <template slot-scope="house">
          <ul v-if="house.list">
            <li>房号:{{ house.houseNo }}</li>
            <li>建筑面积(㎡)：{{ house.list.jzmj }}</li>
            <li>权利人：{{ house.list.cqrxm }}</li>
          </ul>
        </template>
      </house-tooltip> -->
      </building-table>
    </el-dialog>
  </div>
</template>

<script>
import BuildingTable from "@/components/BuildingTable";
// import {
//   HouseDefinition,
//   FloorDefinition,
//   UnitDefinition,
//   HouseTooltip,
// } from "@/components/BuildingTable";
import data from "../data.json";

// 楼盘表测试
export default {
  name: "BuildingTableDemo",
  components: {
    BuildingTable,
    // UnitDefinition,
    // FloorDefinition,
    // HouseDefinition,
    // HouseTooltip,
  },
  data() {
    return {
      visible: true,
      buildingData: null,
      statisticData: [
        { name: "总面积", value: "30078.54㎡" },
        { name: "总套数", value: "360套" },
        { name: "地上面积", value: "30078.54㎡" },
        { name: "地上套数", value: "372套" },
        { name: "地下面积", value: "0㎡" },
        { name: "地下套数", value: "0套" },
        { name: "签约面积", value: "1687.58㎡" },
        { name: "签约套数", value: "21套" },
        { name: "备案面积", value: "28390.96㎡" },
        { name: "备案套数", value: "351套" },
        { name: "签约未缴费面积", value: "30078.54㎡" },
        { name: "签约未缴费套数", value: "372套" },
      ],
    };
  },
  created() {
    this.buildingData = data.data;
  },
  methods: {
    open() {
      this.visible = true;
    },
    houseClick(e) {
      console.log("house-click:", e);
    },
    houseTitleClick(e) {
      console.log("house-title-click:", e);
    },
    selectChange(e) {
      console.log("select-change:", e);
    },
  },
};
</script>

<style lang="scss">
.building-table-demo {
  padding: 10px;

  .el-dialog__body {
    padding: 5px;
  }
}
</style>
