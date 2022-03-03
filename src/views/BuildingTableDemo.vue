<template>
  <div class="building-table-demo">
    <building-table
      :buildingData="buildingData"
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
      <house-definition :excludeFields="excludeFields">
        <!-- <template slot-scope="scope">
          <div class="house-cell-wrap">{{ scope.houseInfo.houseName }}</div>
        </template> -->
      </house-definition>
      <!-- 自定义标题栏左侧工具栏 -->
      <!-- <template v-slot:headerLeft>
        <div class="building-tool">left-slot</div>
      </template> -->
      <!-- 自定义标题栏右侧工具栏 -->
      <!-- <template v-slot:headerRight>
        <div class="building-tool">right-slot</div>
      </template> -->
    </building-table>
  </div>
</template>

<script>
import BuildingTable, {
  // UnitDefinition,
  // FloorDefinition,
  HouseDefinition,
} from "@/components/BuildingTable";

export default {
  name: "BuildingTableDemo",
  components: {
    BuildingTable,
    // UnitDefinition,
    // FloorDefinition,
    HouseDefinition,
  },
  data() {
    return {
      buildingData: null,
      excludeFields: ["房屋名称"], //  排除显示字段
    };
  },
  created() {
    // 创建测试数据
    let data = this.createTestData();
    // 测试跨多层
    data.logicBuilds[0].houses[0].layerCount = 3;
    data.logicBuilds[0].houses[0].columnCount = 2;
    // 加载数据
    // this.$refs.buildingTable.setData(jsonData.data);
    this.buildingData = data;
  },
  methods: {
    createTestData() {
      let data = {
        useMode: "multiple",
        buildId: "787CE3FF7ED54E55BE015DC5085B54B9",
        buildName: "碧桂园13栋",
        buildAddress: "香港路234号碧桂园13栋",
        logicBuilds: [],
        legends: [
          {
            name: "初始状态",
            value: "255,255,255",
          },
          {
            name: "不可售",
            value: "165,165,165",
          },
          {
            name: "转移登记",
            value: "153,56,8",
          },
          {
            name: "查封登记",
            value: "90,87,73",
          },
          {
            name: "抵押登记",
            value: "94,4,65",
          },
          {
            name: "在建工程抵押登记",
            value: "94,4,65",
          },
        ],
      };
      data.logicBuilds.push(this.createLogicBuild("1", "住宅", 100, 4, 4));
      data.logicBuilds.push(this.createLogicBuild("2", "商铺", 100, 4, 4));
      return data;
    },
    createLogicBuild(id, name, ic, jc, kc) {
      let data = {
        logicBuildId: id,
        logicBuildName: name,
        houses: [],
      };
      let index = 1;
      let houseId = id + index;
      for (let i = 0; i < ic; i++) {
        for (let j = 0; j < jc; j++) {
          for (let k = 0; k < kc; k++) {
            let house = this.createHouse(i, j, k, houseId);
            data.houses.push(house);
            index++;
            houseId = id + index;
          }
        }
      }
      return data;
    },
    createHouse(i, j, k, index) {
      let houseName = i + 1 + String(k + 1).padStart(2, "0");
      let house = {
        // 房屋ID
        houseId: index,
        // 房屋显示名称
        houseName,
        // 房屋房号
        houseNo: houseName,
        // 单元名称
        unitName: `${j + 1}单元`,
        // 单元排序号
        unitOrder: j + 1,
        // 占有楼层
        layerCount: 1,
        // 起始楼层
        minAtLayer: i + 1,
        // 横跨房间数
        columnCount: 1,
        // 楼层显示名称
        layerName: `${i + 1}层`,
        // 排序号
        order: k + 1,
        // 是否可操作
        isEnabled: true,
        // 是否选中
        isSelected: i === 6,
        // 色块符号信息
        symbols: [
          {
            text: "转移登记",
            color: "153,56,8",
          },
          {
            text: "抵押登记",
            color: "94,4,65",
          },
          {
            text: "查封登记",
            color: "153,56,8",
          },
          {
            text: "抵押登记",
            color: "94,4,65",
          },
        ],
        // 字段显示信息
        blocks: [
          {
            name: "房屋名称",
            value: houseName,
          },
          {
            name: "建筑面积",
            value: "100.29",
          },
          {
            name: "权利人",
            value: "张三" + index,
          },
        ],
      };
      return house;
    },
    houseClick() {
      console.log("house-click:");
    },
    houseTitleClick() {
      console.log("house-title-click:");
    },
    selectChange() {
      console.log("select-change:");
    },
  },
};
</script>
