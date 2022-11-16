import { createLogicBuilder, createLogicData } from './builders'

/**
 * 楼盘表数据构建器
 */
export default class HouseBuilder {
  /**
   * 初始化
   * @param {Object} tableData 楼盘表数据
   * @param {String} builderType 构建器类型，可以是"table"、"flex"
   */
  constructor(tableData, builderType) {
    this.type = builderType;
    this.data = tableData // 原始楼盘表数据
    this.cacheBuilder = {} // 逻辑幢构建器缓存
    this.logicInfos = [] // 逻辑幢信息

    this.init()
  }

  init() {
    // 初始化逻辑幢信息
    const logicInfos = this.data.logicBuilds || []
    this.logicInfos = logicInfos.map(m => {
      return {
        id: m.logicBuildId,
        name: m.logicBuildName
      }
    })
  }

  // 构建逻辑幢
  build(logicId) {
    const { type, logicInfos, data, cacheBuilder } = this
    logicId = logicId || (logicInfos.length && logicInfos[0].id)
    if (!logicId) {
      return createLogicData({ id: logicId })
    }

    // 1、从缓存中获取逻辑幢加载器，没有就创建
    let logicBuilder = cacheBuilder[logicId]
    if (!logicBuilder) {
      const logicData = data.logicBuilds.find(b => b.logicBuildId === logicId)
      if (!logicData) {
        throw new Error(`build(): 没有找到id为${logicId}的逻辑幢，加载逻辑幢失败！`)
      }
      logicBuilder = createLogicBuilder(logicData, type)
      this.cacheBuilder[logicId] = logicBuilder
    }
    // 2、构建逻辑幢信息
    const res = logicBuilder.build()
    return res
  }
}
