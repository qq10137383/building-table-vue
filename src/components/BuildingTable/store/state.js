import Vue from 'vue'
import HouseQuery from '../core/house-query'
import builder from './builder'
import definition from './definition'
import selector from './selector'
import locator from './locator'
import { copyProperties, deepAssign } from '../utils'

const basicStates = {
  // 幢ID
  buildId: '',
  // 幢名称
  buildName: '',
  // 幢地址
  buildAddress: '',
  // 图例
  legends: [],
  // 标签
  allBlocks: []
}

/**
 * 楼盘表store模块
 */
export default Vue.extend({
  mixins: [builder, definition, selector, locator],
  data() {
    return {
      states: {
        ...basicStates,
        // 是否有标签字段
        hasTag: false,
        // 房屋显示的标签
        checkedTags: [],
        // 显示模式
        displayMode: "buildingTable",
        // 布局参数
        layout: {
          // 楼盘表高度
          height: 0,
          // 楼盘表横向滚动距离
          scrollLeft: 0,
          // 楼盘表是否有纵向滚动条
          hasGutter: false,
          // 侧边栏是否折叠
          sidebarCollapsed: false
        },
        dataKey: 0, // 数据刷新key
      }
    }
  },
  methods: {
    // 设置楼盘表数据
    setData(data) {
      // 过滤分区数据
      data.logicBuilds = data.logicBuilds.filter((m) => m.houses.length > 0)
      // 初始化states
      copyProperties(this.states, data, Object.keys(basicStates))
      // 初始化tags
      this.states.hasTag = "allBlocks" in data
      this.states.checkedTags = this.states.allBlocks.filter(m => m.selected)
      // 初始化楼盘表查询器
      this._query = new HouseQuery(data)
      // 初始化逻辑幢构建器
      this.initBuilder(data)
      // 初始化选择管理器
      this.initSelector(this._query, data.useMode)
      // 更新计数器
      this.states.dataKey++;
    },
    // 清除楼盘表数据
    clearData() {
      if (this.states.dataKey == 0) return
      const data = { ...basicStates, logicBuilds: [] }
      this.setData(data)
      this.clearBuilder()
    },
    // 加载逻辑幢，logincId为空时加载第一个逻辑幢
    setLogicBuild(logicId) {
      this._query.setLogicId(logicId)
      this.setBuilder(logicId)
    },
    // 设置布局参数
    setLayout(layout) {
      deepAssign(this.states.layout, layout)
    },
    // 设置state值
    setState(state) {
      deepAssign(this.states, state)
    },
    // 设置显示模式
    setDisplayMode(mode) {
      this.states.displayMode = mode
    },
    // 设置房屋显示的标签
    setCheckedTags(values = []) {
      const items = this.states.allBlocks.filter(m => values.includes(m.prop));
      this.states.checkedTags = items;
      // 单元格不显示标签时，调整单元格宽度
      this.adjustHouseDefinitioWidth(items.length == 0);
    }
  }
})
