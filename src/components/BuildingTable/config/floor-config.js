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
    render: function (h, { definition, logicBuildId, floorInfo, unitInfo, store }) {
        const { className, floorStyle, titleField, showCheck } = definition
        const id = `check-floor-${logicBuildId}-${floorInfo.layer}-${unitInfo.unitName}`

        const checkFloor = (e) => {
            store.commit('selectLayer', floorInfo, unitInfo, e.target.checked)
            this.$parent.$emit('floor-checked', floorInfo, unitInfo, e.target.checked)
        }
        return (
            <div class={['floor-cell-wrap', className]} style={floorStyle}>
                <div class="bt-checkbox">
                    {showCheck ? <input type="checkbox" id={id} class='bt-checkbox__input' on-click={checkFloor} /> : ''}
                    <label for={id} class="bt-checkbox__text">{floorInfo[titleField]}</label>
                </div>
            </div>
        )
    }
}

export default floorConfig
