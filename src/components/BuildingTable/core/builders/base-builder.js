import { val } from '../../utils'

/**
 * 生成逻辑幢数据
 * @param {Object} options 
 * @returns 
 */
export function createLogicData(options = {}) {
    return {
        id: options.id,  // 逻辑幢ID
        name: options.name || '', // 逻辑幢名称
        floors: options.floors || [], // 逻辑幢楼层信息
        units: options.units || [], // 逻辑幢单元信息
        houses: options.houses || []  // 逻辑幢房屋信息
    }
}

/**
 * 构建器基类
 */
export default class BaseBuilder {
    constructor(logicData) {
        this.data = logicData // 原始逻辑幢数据
        this.buildData = null // 构建后的逻辑幢数据
    }

    // 房屋数据兼容处理
    transformHouse(house) {
        house.houseName = house.houseName || house.houseNo || '' // 房屋名称
        house.unitOrder = Number(val(house, 'unitOrder', 1)) // 单元序号
        house.unitName = val(house, 'unitName', '') // 单元名称
        house.minAtLayer = Number(val(house, 'minAtLayer', 1)) // 起始楼层
        house.layerName = house.layerName || `${house.minAtLayer}` // 楼层名称
        house.layerCount = Number(house.layerCount || 1) // 占有楼层数(纵向)
        house.columnCount = Number(house.columnCount || 1) // 占用房间数(横向)
        house.order = Number(house.order || 1) // 排序号
        house.isEnabled = Boolean(val(house, 'isEnabled', true)) // 是否可操作
        house.isSelected = Boolean(val(house, 'isSelected', false)) // 是否已选中
        house.symbols = house.symbols || [] // 色块符号信息
        house.blocks = house.blocks || [] // 字段显示信息
    }

    // 房屋排序比较(相等返回0，大于 返回 1，小于 返回 -1)
    compareHouse(ln, rn) {
        // 1、占位空白房屋(null)需要排在最后
        if (!ln && !rn) return 0
        if (!ln) return 1
        if (!rn) return -1

        // 2、比较排序号，排序号越大，房屋越大
        if ('order' in ln && 'order' in rn) {
            if (ln.order > rn.order) return 1
            if (ln.order < rn.order) return -1
        }

        // 3、比较房号，房号越大，房屋越大
        if (ln.houseNo > rn.houseNo) return 1
        if (ln.houseNo < rn.houseNo) return -1

        return 0
    }

    // 遍历房屋跨层，执行回调
    walkHouseLayer(house, fn) {
        const { minAtLayer, layerCount } = house
        let layer
        for (let i = 0; i < layerCount; i++) {
            // 处理楼层为负数的(地下室)，跳过0层
            layer = minAtLayer - i
            layer = layer === 0 ? layer - 1 : layer
            fn(layer, minAtLayer, layerCount)
        }
    }

    // 构建楼层(倒序排列)
    buildLayers() {
        const houses = this.data.houses
        const layerMap = {}
        for (const house of houses) {
            this.transformHouse(house)
            this.walkHouseLayer(house, (layer, minAtLayer) => {
                if (!(layer in layerMap)) {
                    const name = layer !== minAtLayer ? `${layer}层` : house.layerName
                    layerMap[layer] = { layer, name }
                }
            })
        }
        // 倒序排序，楼层是从上往下排的
        const layerList = Object.values(layerMap).sort((a, b) => b.layer - a.layer)
        // 生成楼层索引
        layerList.forEach((layer, index) => (layer.index = index))
        return { layerList, layerMap }
    }

    // 构建单元
    buildUnits(layerInfo) {
        const houses = this.data.houses
        const { layerList, layerMap } = layerInfo
        const unitMap = {}
        for (const house of houses) {
            const { unitName, unitOrder, columnCount } = house
            let unit = unitMap[unitName]
            if (!unit) {
                // 单元房屋计数器，用来记录单元内每一层的房屋数量
                const _counter = new Array(layerList.length).fill(0)
                unit = unitMap[unitName] = { unitName, unitOrder, _counter }
            }
            // 如果跨层需要将跨域每一层的房屋数量加跨层房屋的columnCount
            this.walkHouseLayer(house, (layer) => {
                const layerIndex = layerMap[layer].index
                unit._counter[layerIndex] += columnCount
            })
        }
        // 单元排序
        const unitList = Object.values(unitMap).sort((m, n) => m.unitOrder - n.unitOrder)
        // 统计每个单元的的列数(columnCount)，并生成单元索引
        unitList.forEach((m, index) => {
            m.columnCount = Math.max.apply(null, Object.values(m._counter))
            m.index = index
            delete m._counter
        })
        return { unitList, unitMap }
    }

    // 构建房屋
    // eslint-disable-next-line no-unused-vars
    buildHouses(_layerInfo, _unitInfo) {
        throw new Error('buildHouses(): 子类需实现buildHouses方法！');
    }

    // 构建逻辑幢数据
    build() {
        if (this.buildData) return this.buildData

        const layerInfo = this.buildLayers()
        const unitInfo = this.buildUnits(layerInfo)
        const houses = this.buildHouses(layerInfo, unitInfo)

        const { logicBuildId, logicBuildName } = this.data
        this.buildData = createLogicData({
            id: logicBuildId,
            name: logicBuildName,
            floors: layerInfo.layerList,
            units: unitInfo.unitList,
            houses
        })
        return this.buildData
    }
}