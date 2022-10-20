import Vue from 'vue'
import TableQuery from '../core/table-query'
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
  legends: []
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
        // 布局参数
        layout: {
          // 楼盘表高度
          height: 0,
          // 楼盘表横向滚动距离
          scrollLeft: 0,
          // 楼盘表是否有纵向滚动条
          hasGutter: false
        },
        dataKey: 0, // 数据刷新key
      }
    }
  },
  methods: {
    // 设置楼盘表数据
    setData(data) {
      // 初始化states
      copyProperties(this.states, data, Object.keys(basicStates))
      // 初始化楼盘表查询器
      this._query = new TableQuery(data)
      // 初始化逻辑幢构建器
      this.initBuilder(data)
      // 初始化选择管理器
      this.initSelector(this._query, data.useMode)
      // 更新计数器
      this.states.dataKey++;
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
    }
  }
})
