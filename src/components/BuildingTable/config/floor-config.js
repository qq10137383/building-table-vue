import { getBuildingTable } from '../utils'

/**
 * 楼层单元格默认配置
 */
const floorConfig = {
    // 楼层单元格宽度
    width: 50,
    // 楼层自定义类名
    className: '',
    // 楼层自定义样式
    floorStyle: {},
    // 是否显示楼层选择按钮
    showCheck: true,
    // 用来显示楼层字段名
    titleField: 'layer',
    // 楼层默认渲染函数
    render: function (h, { definition, floorInfo, unitInfo, store }) {
        const { className, floorStyle, titleField, showCheck } = definition
        const root = getBuildingTable(this)
        const disabled = !showCheck || store.states.useMode != 'multiple'

        const checkFloor = (checked) => {
            store.commit('selectLayer', floorInfo, unitInfo, checked)
            root && root.$emit('floor-checked', { floorInfo, unitInfo, checked })
        }

        return (
            <div class={['floor-cell-wrap', className]} style={floorStyle}>
                {disabled
                    ? (<span>{floorInfo[titleField]}</span>)
                    : (<el-checkbox class="cell-checkbox" disabled={disabled} on-change={checkFloor}>{floorInfo[titleField]}</el-checkbox>)
                }
            </div>
        )
    }
}

export default floorConfig
