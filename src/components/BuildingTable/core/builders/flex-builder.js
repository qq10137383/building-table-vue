import BaseBuilder from "./base-builder";

/**
 * Flex布局楼盘表逻辑幢构建器
 */
export default class FlexBuilder extends BaseBuilder {
    // 构建房屋(楼层倒序排列)
    buildHouses(layerInfo, unitInfo) {
        const houses = this.data.houses
        const { layerList, layerMap } = layerInfo
        const { unitList, unitMap } = unitInfo

        // 1、生成房屋数据结构: houseList->Array<layer>，layer->Array<unit>，unit->Array<house>
        const houseList = Array.from({ length: layerList.length }, () => {
            return Array.from({ length: unitList.length }, () => [])
        })
        // 2、填充房屋
        for (const house of houses) {
            const { unitName, minAtLayer } = house
            const layerIndex = house._layerIndex = layerMap[minAtLayer].index
            const unitIndex = house._unitIndex = unitMap[unitName].index
            // 填充房屋到指定楼层、单元位置
            houseList[layerIndex][unitIndex].push(house)
        }
        // 3、排列房屋在单元中的位置，增加列索引信息
        for (const layer of houseList) {
            layer.forEach((unit) => {
                unit.sort((m, n) => this.compareHouse(m, n))
                unit.forEach((house, index) => (house && (house._columnIndex = index)))
            })
        }
        return houseList
    }
}