<script>
import { mapStates } from '../../store'
import getScrollbarWidth from '../../utils/scrollbar-width'

/**
 * 表格布局楼盘表单元显示组件
 */
export default {
  name: 'UnitTableRender',
  inject: ['store'],
  computed: {
    ...mapStates({
      logicBuildId: 'logicBuild.id',
      units: 'logicBuild.units',
      layout: 'layout',
      unitDefinition: 'unitDefinition',
      floorDefinition: 'floorDefinition',
      houseDefinition: 'houseDefinition'
    }),
    tableWidth() {
      let value = this.units.reduce((width, unit) => {
        width +=
          this.floorDefinition.width +
          this.houseDefinition.width * unit.columnCount
        return width
      }, 0)
      if (this.layout.hasGutter) {
        value += getScrollbarWidth()
      }
      return value
    }
  },
  methods: {
    // 生成楼盘表单元列定义
    renderCols() {
      const colVNodes = []
      let nodeKey
      for (const unit of this.units) {
        nodeKey = `col-header-${this.logicBuildId}-${unit.unitName}`
        colVNodes.push(
          <col
            name={nodeKey}
            key={nodeKey}
            width={this.floorDefinition.width}
          />
        )
        for (let i = 0; i < unit.columnCount; i++) {
          nodeKey = `col-unit-${this.logicBuildId}-${unit.unitName}-${i}`
          colVNodes.push(
            <col
              name={nodeKey}
              key={nodeKey}
              width={this.houseDefinition.width}
            />
          )
        }
      }
      // 如果有滚动条，生成滚动条占位列定义
      if (this.layout.hasGutter) {
        nodeKey = `col-gutter-${this.logicBuildId}`
        colVNodes.push(
          <col name={nodeKey} key={nodeKey} width={getScrollbarWidth()} />
        )
      }
      return colVNodes
    },
    // 生成楼盘表单元列
    renderUnitCell(unitInfo) {
      const unitVNode = this.unitDefinition.render.call(
        this._renderProxy,
        this.$createElement,
        {
          definition: this.unitDefinition,
          store: this.store,
          logicBuildId: this.logicBuildId,
          unitInfo
        }
      )
      return (
        <td
          key={`td-unit-${this.logicBuildId}-${unitInfo.unitName}`}
          rowspan='1'
          colspan={unitInfo.columnCount}
          class='building-td__unit'
        >
          {unitVNode}
        </td>
      )
    },
    // 生成楼盘表单元行
    renderRow() {
      const rowVNodes = []
      this.units.forEach((unitInfo) => {
        rowVNodes.push(
          <td
            key={`td-header-${this.logicBuildId}-${unitInfo.unitName}`}
            rowspan='1'
            colspan='1'
            class='building-td__header'
          ></td>
        )
        rowVNodes.push(this.renderUnitCell(unitInfo))
      })
      // 如果有滚动条，生成滚动条占位列
      if (this.layout.hasGutter) {
        rowVNodes.push(
          <td
            key={`td-gutter-${this.logicBuildId}`}
            rowspan='1'
            colspan='1'
            class='building-td__gutter'
          />
        )
      }
      return rowVNodes
    }
  },
  render() {
    return (
      <div class='unit-render-wrap unit-table-render'>
        <table
          cellspacing='0'
          cellpadding='0'
          border='0'
          class='unit-table'
          width={`${this.tableWidth}px`}
          style={{ marginLeft: `${-this.layout.scrollLeft}px` }}
        >
          <colgroup>{this.renderCols()}</colgroup>
          <tbody>
            <tr
              key={`tr-unit-${this.logicBuildId}`}
              class='building-tr__unit'
              height={`${this.unitDefinition.height}px`}
            >
              {this.renderRow()}
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
</script>
