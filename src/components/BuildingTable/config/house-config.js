import { getBuildingTable, toColor } from '../utils'
import LegendSymbol from "../LegendSymbol";

/**
 * 房屋单元格默认配置
 */
const houseConfig = {
  // 房屋单元格宽度
  width: 220,
  // 房屋单元格自定义类名
  className: '',
  // 房屋单元格自定义样式
  houseStyle: {},
  // 是否显示房屋标签信息
  showBlock: true,
  // 标签信息转换函数
  parseBlockValue: (houseInfo, blockInfo) => houseInfo.list[blockInfo.prop] || "",
  // blocks中要显示的字段，不设置显示所有字段
  includeFields: null,
  // blocks中要排除的字段
  excludeFields: null,
  // 是否显示房屋符号(symbols)信息
  showSymbol: true,
  // 每行显示几个房屋符号
  symbolColumn: 2,
  // 是否以精简模式显示
  simple: false,
  // 精简模式下单元格宽度
  simpleWidth: 120,
  // 是否显示单元格标题提示信息
  showTitle: true,
  // 是否显示房屋详情(blocks)提示新
  showBlockTitle: false,
  // 没有标签时是否调整单元格宽度为simpleWidth
  adjustWidthIfNoBlock: true,
  // 房屋单元格默认渲染函数
  render: function (h, { definition, houseInfo, store }) {
    const {
      className, houseStyle, showBlock, parseBlockValue, includeFields, excludeFields,
      showSymbol, symbolColumn, simple, showTitle, showBlockTitle
    } = definition
    const { houseNo, houseName, blocks, symbols, customClasses = [], customStyles = {} } = houseInfo
    const root = getBuildingTable(this)

    const renderBlock = () => {
      const blockVNodes = []
      if (!showBlock) {
        return blockVNodes
      }
      // 兼容老数据
      const { hasTag, checkedTags } = store.states
      const tags = hasTag ? checkedTags : blocks
      tags.forEach(blockInfo => {
        const { name, prop } = blockInfo
        // blocks字段显示过滤
        if (!((includeFields && !includeFields.includes(prop)) ||
          (excludeFields && excludeFields.includes(prop))
        )) {
          // block值转换
          const value = hasTag ? parseBlockValue(houseInfo, blockInfo) : blockInfo.value;
          const text = `${name}：${value}`
          blockVNodes.push(<p class='house-cell__block-item' title={showBlockTitle ? text : ''}>{text}</p>)
        }
      })
      return blockVNodes
    }
    const renderSymbol = () => {
      const symbolVNodes = []
      if (!showSymbol) {
        return symbolVNodes
      }
      // 过滤背景颜色符号
      const filterSymbols = symbols.filter((m) => m.tlxsms != 2);
      for (let index = 0; index < filterSymbols.length; index++) {
        const items = []
        if (index % symbolColumn == 0) {
          for (let i = index; i < Math.min(index + symbolColumn, filterSymbols.length); i++) {
            items.push(<LegendSymbol item={filterSymbols[i]} mode="symbol" />)
          }
          symbolVNodes.push(<div class="house-cell__symbol-row">{items}</div>)
        }
      }
      return symbolVNodes
    }
    const clickTitle = (event) => {
      !simple && event.stopPropagation()
      root && root.$emit('house-title-click', { house: houseInfo, event })
    }

   // mouseenter、mouseleave不能冒泡，只能写在元素上，td不能捕获
    const raiseHouseEvent = (eventName, event) => {
      root && root.$emit(eventName, { house: houseInfo, event })
    }

    // 自定义样式
    const mergeStyles = Object.assign({}, houseStyle, customStyles)
    // 获取背景色符号
    const bgSymbol = (symbols || []).find((m) => m.tlxsms == 2)
    if (bgSymbol) {
      mergeStyles.backgroundColor = toColor(bgSymbol.color || bgSymbol.tldsdm)
      customClasses.push("has-bg");
    }

    return (
      <div class={['house-cell-wrap', className, ...customClasses]} style={mergeStyles} 
        onMouseenter={e => raiseHouseEvent('house-enter', e)}
        onMouseleave={ e => raiseHouseEvent('house-leave', e)}
      >
        <div class='house-cell__block'>
          <h4 class='house-cell__block-title' on-click={clickTitle} title={showTitle ? houseName : ''}>{houseNo}</h4>
          {renderBlock()}
        </div>
        <div class='house-cell__symbol'>
          {renderSymbol()}
        </div>
      </div>
    )
  }
}

export default houseConfig
