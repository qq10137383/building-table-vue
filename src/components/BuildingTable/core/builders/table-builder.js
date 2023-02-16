import BaseBuilder from "./base-builder";

/**
 * Table布局楼盘表逻辑幢构建器
 */
export default class TableBuilder extends BaseBuilder {
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
        for (const house of houses) {
            const { unitName, minAtLayer, columnCount } = house
            const layerIndex = house._layerIndex = layerMap[minAtLayer].index
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
        for (const layer of houseList) {
            layer.forEach((unit, unitIndex) => {
                // 计算需要填充的空白房屋(null)的数量，并填充
                const remain = unitList[unitIndex].columnCount - unit._houseCount
                if (remain > 0) {
                    unit.push(...new Array(remain).fill(null))
                }
                // 单元内房屋排序，增加列索引信息
                unit.sort((m, n) => this.compareHouse(m, n))
                unit.forEach((house, index) => (house._columnIndex = index))
                delete unit._houseCount
            })
        }
        return houseList
    }
} 