<template>
  <div class="house-list-wrap" :style="{ height: tableHeight + 'px' }">
    <template v-if="!emptyText">
      <div class="house-list__table">
        <el-table
          ref="table"
          height="100%"
          v-loading="loading"
          :data="pageHouses"
          border
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            v-if="useMode == 'multiple'"
            type="selection"
            width="40"
            :selectable="checkSelectable"
          />
          <el-table-column
            v-if="useMode == 'single'"
            fixed="left"
            width="40"
            align="center"
          >
            <template v-slot="scope">
              <el-radio
                class="single-select"
                :disabled="!scope.row.isEnabled"
                v-model="checkedId"
                :value="scope.row.houseId"
              />
            </template>
          </el-table-column>
          <el-table-column
            fixed="left"
            type="index"
            width="60"
            align="center"
            label="序号"
          />
          <el-table-column
            v-for="item in tableProps"
            :key="item.prop"
            :prop="`list.${item.prop}`"
            :label="item.name"
            :width="140"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            fixed="right"
            width="150"
            align="center"
            label="图例"
          >
            <template v-slot="scope">
              <div class="list-symbol">
                <legend-symbol
                  v-for="(item, index) in scope.row.symbols"
                  :key="index"
                  :item="item"
                  mode="legend"
                />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="house-list__footer">
        <el-pagination
          background
          layout="total,sizes,prev,pager,next"
          :total="houseList.length"
          :page-size.sync="pageSize"
          :current-page.sync="pageNo"
        />
      </div>
    </template>
    <div v-else class="building-table__empty">{{ emptyText }}</div>
  </div>
</template>

<script>
import { mapStates } from "../../store";
import { headerHeight } from "../../style/variables.scss";
import LegendSymbol from "../../LegendSymbol";

/**
 * 房屋渲染组件(列表)
 */
export default {
  inject: ["store"],
  components: {
    LegendSymbol,
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      pageNo: 1,
      checkedId: "", // 单选模式，选择的房屋id
    };
  },
  computed: {
    ...mapStates({
      useMode: "useMode",
      locate: "locate",
    }),
    tableHeight() {
      return this.store.states.layout.height - parseInt(headerHeight);
    },
    // 表格列
    tableProps() {
      return this.store.states.logicBuild.props || [];
    },
    // 房屋数据(房屋从1层到顶层顺序排列)
    houseList() {
      const { houses } = this.store.states.logicBuild;
      const data = [];
      for (let layerIndex = houses.length - 1; layerIndex >= 0; layerIndex--) {
        const unitList = houses[layerIndex];
        for (const unit of unitList) {
          for (const house of unit) {
            // 去除占位房屋
            house && data.push(house);
          }
        }
      }
      return data;
    },
    // 分页房屋数据
    pageHouses() {
      const startIndex = (this.pageNo - 1) * this.pageSize;
      const endIndex = Math.min(
        this.pageNo * this.pageSize,
        this.houseList.length
      );
      const data = this.houseList.slice(startIndex, endIndex);
      return data;
    },
    emptyText() {
      let text = "";
      if (this.houseList.length == 0) {
        text = "暂无数据";
      } else if (this.tableProps.length == 0) {
        text = "未配置列表显示属性";
      }
      return text;
    },
  },
  watch: {
    checkedId(val) {
      if (!val) return;
      const house = this.pageHouses.find((m) => m.houseId == val);
      house && this.store.commit("selectHouse", house, true);
    },
    pageHouses: {
      handler() {
        this.loading = true;
        // 模拟加载loading的数据变化的视觉效果
        setTimeout(() => {
          this.loading = false;
          this.$nextTick(() => this.initSelect());
        }, 200);
      },
      immediate: true,
    },
    // 房号定位(定位到分页位置)
    "locate.key"() {
      const house = this.locate.house;
      if (house) {
        const idx = this.houseList.findIndex((m) => m.houseId == house.houseId);
        this.pageNo = Math.floor(idx / this.pageSize) + 1;
      } else {
        this.$message.warning("未定位到房屋！");
      }
    },
  },
  methods: {
    // 房屋定位样式
    tableRowClassName({ row }) {
      return this.locate.house && this.locate.house.houseId == row.houseId
        ? "locate-house-row"
        : "";
    },
    checkSelectable(house) {
      return house.isEnabled;
    },
    handleSelectionChange(val) {
      val.forEach((m) => this.store.commit("selectHouse", m, true));
    },
    // 初始化选择
    initSelect() {
      if (this.useMode == "single") {
        const item = this.pageHouses.find((m) => m.isSelected);
        item && (this.checkedId = item.houseId);
      } else if (this.useMode == "multiple") {
        const items = this.pageHouses.filter((m) => m.isSelected);
        items.forEach((m) => this.$refs.table.toggleRowSelection(m, true));
      }
    },
  },
};
</script>
