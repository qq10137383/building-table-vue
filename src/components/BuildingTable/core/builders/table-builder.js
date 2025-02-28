import BaseBuilder from "./base-builder";

/**
 * Table布局楼盘表逻辑幢构建器
 */
export default class TableBuilder extends BaseBuilder {
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
        for (const house of houses) {
            const { unitName, minAtLayer, layerCount, columnCount } = house
            // 填充房屋到指定楼层、单元位置
            const layerIndex = house._layerIndex = layerMap[minAtLayer].index
            const unitIndex = house._unitIndex = unitMap[unitName].index
            houseList[layerIndex][unitIndex].push(house)
            // 如果跨层需要将跨域每一层的房屋填充数量加跨层房屋的columnCount
            this.walkHouseLayer(house, (layer) => {
                const index = layerMap[layer].index
                houseList[index][unitIndex]._houseCount += columnCount
            })
            // 更新单元跨层区域信息 
            if (layerCount > 1) {
                const startLayer = layerIndex - layerCount + 1
                this.updateSpanBlock(unitMap[unitName].spanBlocks, startLayer, layerIndex)
            }
        }
        // 3、单元排序
        this.orderNormalLayers(unitList, houseList)
        this.orderSpanLayers(unitList, houseList)
        // 4、单元填充平衡
        for (const layer of houseList) {
            layer.forEach((unit, unitIndex) => {
                // 计算需要填充的空白房屋(null)的数量，并填充
                const remain = unitList[unitIndex].columnCount - unit._houseCount
                if (remain > 0) {
                    unit.push(...new Array(remain).fill(null))
                }
                delete unit._houseCount
            })
        }
        return houseList
    }

    // 更新单元跨层区域信息
    updateSpanBlock(spanBlocks, startLayer, endLayer) {
        let hasIntersect = false
        // 如果多个跨层区域存在交叉，合并多个跨层区域
        for (const item of spanBlocks) {
            if (item.startLayer > endLayer || item.endLayer < startLayer) {
                continue
            } else {
                item.startLayer = Math.min(item.startLayer, startLayer)  // 跨层开始
                item.endLayer = Math.max(item.endLayer, endLayer)  // 跨层结束
                hasIntersect = true
                break
            }
        }
        // 没有交叉区域就创建新的跨层区域
        if (!hasIntersect) {
            spanBlocks.push({ startLayer, endLayer })
        }
    }
    // 普通层排序
    orderNormalLayers(unitList, houseList) {
        for (let i = 0; i < unitList.length; i++) {
            const spanBlocks = unitList[i].spanBlocks
            for (let j = houseList.length - 1; j >= 0; j--) {
                // 排除跨层的区域
                const block = spanBlocks.find(m => j >= m.startLayer && j <= m.endLayer)
                if (block) continue
                // 房屋排序
                const layer = houseList[j][i]
                layer.sort((m, n) => this.compareHouse(m, n))
            }
        }
    }
    // 跨层排序
    orderSpanLayers(unitList, houseList) {
        const PLACEHOLD_FLAG = '-' // 跨层占位符
        for (let i = 0; i < unitList.length; i++) {
            const { spanBlocks, columnCount } = unitList[i]
            for (let j = 0; j < spanBlocks.length; j++) {
                const { startLayer, endLayer } = spanBlocks[j]
                // 生成跨层临时表
                const spanLayers = Array.from(
                    { length: endLayer - startLayer + 1 },
                    () => new Array(columnCount).fill(null)
                )
                // 放置跨层房屋到临时表
                for (let k = endLayer; k >= startLayer; k--) {
                    const row = k - startLayer
                    const layer = houseList[k][i]
                    // 放置前先排序房屋
                    layer.sort((m, n) => this.compareHouse(m, n))
                    layer.forEach((house, index) => {
                        // 计算可放置位置，如果当前位置被占用，往后移动
                        let col = index
                        while (spanLayers[row][col]) {
                            col++
                        }
                        if (house.layerCount > 1) {
                            // 跨层房屋需要移位到结束层并生成起始到结束其它层的占位
                            let p = 0
                            while (p < house.layerCount - 1) {
                                spanLayers[row - p][col] = PLACEHOLD_FLAG  // 生成其它层占位符
                                p++;
                            }
                            spanLayers[row - p][col] = house  // 房屋移位到结束层
                            house._layerIndex = k - p
                        } else {
                            spanLayers[row][col] = house  // 非跨层顺序放置
                        }
                    })
                }
                // 从临时表移除占位还原到原始对应层
                for (let k = endLayer; k >= startLayer; k--) {
                    const row = k - startLayer
                    const layer = spanLayers[row].filter(n => !n || n != PLACEHOLD_FLAG) // 去掉占位房屋
                    layer._houseCount = spanLayers[row].length  // 标记已填充平衡
                    houseList[k][i] = layer
                }
            }
        }
    }
}

