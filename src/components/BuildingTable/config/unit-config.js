import { getBuildingTable } from '../utils'

/**
 * 单元单元格默认配置
 */
const unitConfig = {
  // 单元单元格高度
  height: 50,
  // 单元自定义类名
  className: '',
  // 单元自定义样式
  unitStyle: {},
  // 是否显示单元选择按钮
  showCheck: true,
  // 用来显示单元字段名
  titleField: 'unitName',
  // 单元默认渲染函数
  render: function (h, { definition, unitInfo, store }) {
    const { className, unitStyle, titleField, showCheck } = definition
    const root = getBuildingTable(this)
    const disabled = !showCheck || store.states.useMode !== "multiple"

    const checkUnit = (checked) => {
      store.commit('selectUnit', unitInfo, checked)
      root && root.$emit('unit-checked', { unitInfo, checked })
    }
    return (
      <div class={['unit-cell-wrap', className]} style={unitStyle}>
        {disabled
          ? (<span>{unitInfo[titleField]}</span>)
          : (<el-checkbox class="cell-checkbox" disabled={disabled} on-change={checkUnit}>{unitInfo[titleField]}</el-checkbox>)
        }
      </div>
    )
  }
}

export default unitConfig
