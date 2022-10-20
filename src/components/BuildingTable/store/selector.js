import SelectManager from '../core/select-manager'

/**
 * 楼盘表选择模块
 */
export default {
    data() {
        return {
            states: {
                // 选择模式
                useMode: "",
                // 选择的房屋
                selection: []
            }
        }
    },
    methods: {
        // 初始化选择管理器(query: 楼盘表查询器TableQuery，useMode: 选择模式)
        initSelector(query, useMode) {
            if (useMode) {
                this.states.useMode = useMode
            }
            this._selector = new SelectManager(query, {
                mode: this.states.useMode,
                cb: (value) => {
                    this.states.selection = value
                }
            })
        },
        // 切换逻辑幢，logicId为空时切换第一个逻辑幢
        setSelector(logicId) {
            this._selector.setLogicId(logicId)
        },
        // 切换房屋选择状态
        selectHouse(house, selected) {
            this._selector.selectHouse(house, selected)
        },
        // 切换某单元内房屋选择状态
        selectUnit(unitInfo, selected) {
            this._selector.selectUnit(unitInfo, selected)
        },
        // 切换某楼层某单元内房屋选择状态(unitInfo可为空，为空则只匹配楼层)
        selectLayer(layerInfo, unitInfo, selected) {
            this._selector.selectLayer(layerInfo, unitInfo, selected)
        },
        // 增加选择房屋
        addSelectHouses(houseIds) {
            this._selector.selectHouseByIds(houseIds, true)
        },
        // 移除选择房屋
        removeSelectHouses(houseIds) {
            this._selector.selectHouseByIds(houseIds, false)
        },
        // 全选(onlyEnabled为true，isEnabled为false的房屋不会被选中)
        selectAll(onlyEnabled) {
            this._selector.selectAll(onlyEnabled)
        },
        // 清空选择
        clearSelect() {
            this._selector.clearSelect()
        }
    }
}