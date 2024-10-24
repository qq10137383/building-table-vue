import BaseBuilder from "./base-builder";

/**
 * Table布局楼盘表逻辑幢构建器
 */
export default class TableBuilder extends BaseBuilder {
    spanData = { // 跨楼层数据
        indexes: {},
        layers: {}
    }

    // 构建房屋(楼层倒序排列)
    buildHouses(layerInfo, unitInfo) {
        const houses = this.data.houses || []
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
            // 构造跨层数据
            if (layerCount > 1) {
                const indexKey = `${layerIndex}&${unitIndex}`
                const layerKey = `${minAtLayer}&${unitIndex}`
                const indexes = this.spanData.indexes[indexKey] || (this.spanData.indexes[indexKey] = new Set());
                indexes.add(layerKey)
                this.spanData.layers[layerKey] = this.spanData.layers[layerKey] || []
            }
        }
        // 3、单元填充平衡
        for (let layer of houseList) {
            layer.forEach((unit, unitIndex) => {
                // 填充跨层数据
                unit.forEach(house => {
                    const { minAtLayer, _unitIndex } = house
                    const layerKey = `${minAtLayer}&${_unitIndex}`
                    this.spanData.layers[layerKey] && this.spanData.layers[layerKey].push(house)
                })
                // 计算需要填充的空白房屋(null)的数量，并填充
                const remain = unitList[unitIndex].columnCount - unit._houseCount
                if (remain > 0) {
                    unit.push(...new Array(remain).fill(null))
                }
                delete unit._houseCount
            })
        }
        // 4、单元排序
        Object.values(this.spanData.layers).forEach(houses => {
            // 跨层原始层房屋排序
            houses.sort((m, n) => this.compareHouse(m, n))
        })
        houseList.forEach((layer, layerIndex) => {
            layer.forEach((unit, unitIndex) => {
                const indexKey = `${layerIndex}&${unitIndex}`
                if (this.spanData.indexes[indexKey]) {
                    this.sortSpanHouse(unit)
                } else {
                    unit.sort((m, n) => this.compareHouse(m, n))
                }
                unit.forEach((house, index) => house && (house._columnIndex = index));
            })
        })
        return houseList
    }

    // 跨行房屋排序
    sortSpanHouse(unit) {
        const spanHouses = new Array(unit.length).fill(undefined)
        // 1、排列跨层房屋位置，与在原始层位置保持一致
        unit.forEach(house => {
            if (house && house.layerCount > 1) {
                const layerKey = `${house.minAtLayer}&${house._unitIndex}`
                const spanIndex = this.spanData.layers[layerKey].indexOf(house)
                spanHouses[spanIndex] = house
            }
        })
        // 2、排列非跨层房屋位置，排除跨层房屋后按顺序排放
        const normalHouses = unit
            .filter(m => !m || m.layerCount == 1)
            .sort((m, n) => this.compareHouse(m, n))
        let normalIndex = 0
        spanHouses.forEach((house, index) => {
            if (house === undefined) {
                unit[index] = normalHouses[normalIndex]
                normalIndex++
            } else {
                unit[index] = spanHouses[index]
            }
        })
    }
} 