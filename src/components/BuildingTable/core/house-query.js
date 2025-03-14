/**
 * 楼盘表数据查询器
 */
export default class HouseQuery {
  constructor(data) {
    this.logicBuilds = data.logicBuilds || [] // 逻辑幢信息
    this.currentLogic = null // 当前逻辑幢
  }

  // 切换逻辑幢，logicId为空时切换第一个逻辑幢
  setLogicId(logicId) {
    if (!this.currentLogic || this.currentLogic.logicBuildId !== logicId) {
      logicId = logicId || (this.logicBuilds.length && this.logicBuilds[0].logicBuildId)
      this.currentLogic = this.logicBuilds.find(m => m.logicBuildId === logicId)
    }
  }

  // 查询所有房屋
  queryAll() {
    const result = []
    for (const logic of this.logicBuilds) {
      for (const house of logic.houses) {
        result.push(house)
      }
    }
    return result
  }

  // 查询所有选择的房屋
  querySelectHouses() {
    const result = []
    for (const logic of this.logicBuilds) {
      for (const house of logic.houses) {
        if (house.isSelected) {
          result.push(house)
        }
      }
    }
    return result
  }

  // 通过房屋ID查询房屋(houseIds可以是单值也可以是集合)
  queryHousesByIds(houseIds) {
    let ids = []; const result = []
    if (Array.isArray(houseIds)) {
      ids = houseIds
    } else {
      ids.push(houseIds)
    }
    for (const logic of this.logicBuilds) {
      for (const house of logic.houses) {
        if (ids.includes(house.houseId)) {
          result.push(house)
        }
      }
    }
    return result
  }

  // 查询当前逻辑幢下指定单元的房屋
  queryHousesByUnit(unitInfo) {
    const result = []
    if (!this.currentLogic) {
      return result
    }
    for (const house of this.currentLogic.houses) {
      if (house.unitName === unitInfo.unitName) {
        result.push(house)
      }
    }
    return result
  }

  // 查询当前逻辑幢下某楼层某单元内所有房屋(unitInfo可为空，为空则只匹配楼层)
  queryHousesByLayer(layerInfo, unitInfo) {
    const result = []
    if (!this.currentLogic) {
      return result
    }
    for (const house of this.currentLogic.houses) {
      const { minAtLayer, layerCount } = house
      const layers = []
      let layer
      // 处理楼层为负数的(地下室)，跳过0层
      for (let i = 0; i < layerCount; i++) {
        layer = minAtLayer - i
        layer = layer === 0 ? layer - 1 : layer
        layers.push(layer)
      }
      if (layers.includes(layerInfo.layer)) {
        if (!unitInfo || (unitInfo && unitInfo.unitName === house.unitName)) {
          result.push(house)
        }
      }
    }
    return result
  }

  // 查询当前逻辑幢下某单元的某房屋，unitName：单元名，houseNo：房屋名
  queryHouseByUnitAndName({ unitName, houseNo }) {
    if (!this.currentLogic) {
      return null
    }
    for (const house of this.currentLogic.houses) {
      if (house.unitName === unitName && house.houseNo === houseNo) {
        return house
      }
    }
    return null
  }
}
