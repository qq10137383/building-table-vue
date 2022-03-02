/**
 * 生成逻辑幢数据
 * @param {Object} options 
 * @returns 
 */
export function createLogicData(options = {}) {
    return {
        id: options.id || '',  // 逻辑幢ID
        name: options.name || '', // 逻辑幢名称
        floors: options.floors || [], // 逻辑幢楼层信息
        units: options.units || [], // 逻辑幢单元信息
        houses: options.houses || []  // 逻辑幢房屋信息
    }
}

/**
 * 逻辑幢数据构建器
 */
export default class LogicBuilder {
    constructor(logicData) {
        this.data = logicData  // 原始逻辑幢数据
        this.buildData = null  // 构建后的逻辑幢数据
    }

    // 房屋数据兼容处理
    transformHouse(house) {
        house.houseName = house.houseName || house.houseNo || '' // 房屋名称
        house.unitOrder = Number(house.unitOrder || 1)  // 单元序号
        house.unitName = house.unitName || `${house.unitOrder}单元`   // 单元名称
        house.minAtLayer = Number(house.minAtLayer || 1) // 起始楼层
        house.layerName = house.layerName || `${house.minAtLayer}层` // 楼层名称
        house.layerCount = Number(house.layerCount || 1) // 占有楼层数(纵向)
        house.columnCount = Number(house.columnCount || 1)  // 占用房间数(横向)
        house.order = Number(house.order || 1) // 排序号
        house.isEnabled = Boolean('isEnabled' in house ? house.isEnabled : true) // 是否可操作
        house.isSelected = Boolean('isSelected' in house ? house.isSelected : false) // 是否已选中
        house.symbols = house.symbols || [] // 色块符号信息
        house.blocks = house.blocks || [] // 字段显示信息
    }

    // 房屋排序比较(相等返回0，大于 返回 1，小于 返回 -1)
    compareHouse(ln, rn) {
        // 1、占位空白房屋(null)需要排在最后
        if (!ln && !rn) return 0
        if (!ln) return 1
        if (!rn) return -1

        // 2、比较层 层越高，房屋越大
        if (ln.minAtLayer > rn.minAtLayer) return 1
        if (ln.minAtLayer < rn.minAtLayer) return -1

        // 3、比较单元排序号，单元排序号越大，房屋越大
        if ('unitOrder' in ln && 'unitOrder' in rn) {
            if (ln.unitOrder > rn.unitOrder) return 1
            if (ln.unitOrder < rn.unitOrder) return -1
        }

        // 4、比较单元名称，单元越大，房屋越大
        if (ln.unitName > rn.unitName) return 1
        if (ln.unitName < rn.unitName) return -1

        // 5、比较排序号，排序号越大，房屋越大
        if ('order' in ln && 'order' in rn) {
            if (ln.order > rn.order) return 1
            if (ln.order < rn.order) return -1
        }

        // 6、比较房号，房号越大，房屋越大
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
            if (minAtLayer < 0) {
                layer = (minAtLayer + i) >= 0 ? (minAtLayer + i + 1) : (minAtLayer + i)
            } else {
                layer = (minAtLayer + i)
            }
            fn(layer, minAtLayer, layerCount)
        }
    }

    // 构建楼层(倒序排列)
    buildLayers() {
        const houses = this.data.houses
        const layerMap = {}
        for (let house of houses) {
            this.transformHouse(house)
            this.walkHouseLayer(house, (layer, minAtLayer) => {
                if (!(layer in layerMap)) {
                    const name = layer != minAtLayer ? `${layer}层` : house.layerName
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
        for (let house of houses) {
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
        let unitList = Object.values(unitMap).sort((m, n) => m.unitOrder - n.unitOrder)
        // 统计每个单元的的列数(columnCount)，并生成单元索引
        unitList.forEach((m, index) => {
            m.columnCount = Math.max.apply(null, Object.values(m._counter))
            m.index = index
            delete m._counter
        })
        return { unitList, unitMap }
    }

    // 构建房屋(楼层倒序排列)
    buildHouses(layerInfo, unitInfo) {
        const houses = this.data.houses
        const { layerList, layerMap } = layerInfo
        const { unitList, unitMap } = unitInfo
        // 1、生成房屋数据结构: houseList->Array<layer>，layer->Array<unit>，unit->Array<house>
        const houseList = Array.from({ length: layerList.length }, () => {
            return Array.from({ length: unitList.length }, () => {
                const unit = []
                // 单元已填充房屋计数器，填充平衡时用来计算还需要填充的空白房屋(null)数量
                unit._houseCount = 0
                return unit
            })
        })
        // 2、填充房屋
        for (let house of houses) {
            const { unitName, minAtLayer, layerCount, columnCount } = house
            // 跨层的房屋需要将起始楼层上移(layerCount)，因为表格colspan是从上往下的，楼层却是从下往上
            const layerIndex = house._layerIndex = layerMap[minAtLayer].index - layerCount + 1
            const unitIndex = house._unitIndex = unitMap[unitName].index
            // 填充房屋到指定楼层、单元位置
            houseList[layerIndex][unitIndex].push(house)
            // 如果跨层需要将跨域每一层的房屋填充数量加跨层房屋的columnCount
            this.walkHouseLayer(house, (layer) => {
                const index = layerMap[layer].index
                houseList[index][unitIndex]._houseCount += columnCount
            })
        }
        // 3、单元填充平衡，并排列房屋在单元中的位置
        for (let layer of houseList) {
            layer.forEach((unit, unitIndex) => {
                // 计算需要填充的空白房屋(null)的数量，并填充
                const remain = unitList[unitIndex].columnCount - unit._houseCount
                if (remain > 0) {
                    unit.push(...new Array(remain).fill(null))
                }
                // 单元内房屋排序
                unit.sort((m, n) => this.compareHouse(m, n))
                delete unit._houseCount
            })
        }
        return houseList
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
