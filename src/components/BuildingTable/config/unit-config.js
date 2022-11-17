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
  render: function(h, { definition, logicBuildId, unitInfo, store }) {
    const { className, unitStyle, titleField, showCheck } = definition
    const root = getBuildingTable(this)
    const disabled = store.states.useMode !== 'multiple'
    const id = `check-unit-${logicBuildId}-${unitInfo.unitName}`

    const checkUnit = (e) => {
      store.commit('selectUnit', unitInfo, e.target.checked)
      root && root.$emit('unit-checked', { unitInfo, checked: e.target.checked })
    }
    return (
      <div class={['unit-cell-wrap', className]} style={unitStyle}>
        <div class='bt-checkbox'>
          {showCheck ? <input type='checkbox' id={id} domPropsDisabled={disabled} class='bt-checkbox__input' on-click={checkUnit} /> : ''}
          <label for={id} class='bt-checkbox__text'>{unitInfo[titleField]}</label>
        </div>
      </div>
    )
  }
}

export default unitConfig
