/**
 * 默认选项
 */
const defaultOpts = {
    mode: 'multiple', // 选择模式，支持'disable','single','multiple'
    cb: null // 选择改变事件
}

/**
 * 房屋选择管理器，负责对逻辑幢房屋选择管理
 */
export default class SelectionManager {
    constructor(query, opts) {
        this.query = query  // 楼盘表数据查询器(TableQuery)
        this.options = Object.assign({}, defaultOpts, opts)
        this.disabled = this.options.mode === 'disable'
        this.selection = {}  // 选择的房屋

        this.init()
    }

    // 初始化选择的房屋
    init() {
        this.query.querySelectHouses().forEach(house => {
            this.selection[house.houseId] = house
        })
        if (this.options.mode == 'single' && Object.keys(this.selection).length > 1) {
            throw new Error('init(): 单选模式下不能有多个选中房屋！')
        }
        this.raiseEvent()
    }

    // 获取选择的房屋
    getSelection() {
        return Object.values(this.selection)
    }

    // 清除选择(内部使用)
    clear() {
        this.getSelection().forEach(s => (s.isSelected = false))
        this.selection = {}
    }

    // 增加房屋前的单选判断
    checkBeforeAdd() {
        this.options.mode === 'single' && this.clear()
    }

    // 设置房屋选中状态(内部使用)
    setHouseCell(house, selected) {
        if (selected) {
            this.checkBeforeAdd()
            this.selection[house.houseId] = house
        } else {
            delete this.selection[house.houseId]
        }
        house.isSelected = selected
    }

    // 通过房屋ID设置房屋选中状态(内部使用)
    setHouseCellByIds(houseIds, selected) {
        this.query.queryHousesByIds(houseIds).forEach(house => {
            this.setHouseCell(house, selected)
        })
    }

    // 切换房屋选择状态
    selectHouse(house, selected) {
        if (this.disabled) return

        this.setHouseCell(house, selected)
        this.raiseEvent()
    }

    // 通过房屋ID切换房屋选中状态
    selectHouseByIds(houseIds, selected) {
        if (this.disabled) return

        this.setHouseCellByIds(houseIds, selected)
        this.raiseEvent()
    }

    // 切换某单元内房屋选择状态
    selectUnit(unitInfo, selected) {
        if (this.disabled) return

        this.query.queryHousesByUnit(unitInfo).forEach(house => {
            if (house.isEnabled) {
                this.setHouseCell(house, selected)
            }
        })
        this.raiseEvent()
    }

    // 切换某楼层某单元内房屋选择状态(unitInfo可为空，为空则只匹配楼层)
    selectLayer(layerInfo, unitInfo, selected) {
        if (this.disabled) return

        this.query.queryHousesByLayer(layerInfo, unitInfo).forEach(house => {
            if (house.isEnabled) {
                this.setHouseCell(house, selected)
            }
        })
        this.raiseEvent()
    }

    // 全选
    selectAll(onlyEnabled) {
        if (this.disabled) return

        this.query.queryAll().forEach(house => {
            if (!onlyEnabled || (onlyEnabled && house.isEnabled)) {
                this.setHouseCell(house, true)
            }
        })
        this.raiseEvent()
    }

    // 清空选择
    clearSelect() {
        if (this.disabled) return

        this.clear()
        this.raiseEvent()
    }

    // 触发选择改变事件
    raiseEvent() {
        if (!this.options.cb) return

        const value = this.getSelection()
        this.options.cb(value)
    }
}

