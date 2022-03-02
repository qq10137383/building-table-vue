import LogicBuilder, { createLogicData } from './logic-builder'

/**
 * 楼盘表数据构建器
 */
export default class TableBuilder {
    constructor(tableData) {
        this.data = tableData  // 原始楼盘表数据
        this.cacheBuilder = {} // 逻辑幢构建器缓存
        this.logicInfos = []  // 逻辑幢信息

        this.init()
    }

    init() {
        // 初始化逻辑幢信息
        let logicInfos = this.data.logicBuilds || []
        this.logicInfos = logicInfos.map(m => {
            return {
                id: m.logicBuildId,
                name: m.logicBuildName
            }
        })
    }

    // 构建逻辑幢
    build(logicId) {
        const { logicInfos, data, cacheBuilder } = this
        logicId = logicId || (logicInfos.length && logicInfos[0].id)
        if (!logicId) {
            return createLogicData({ id: logicId })
        }

        // 1、从缓存中获取逻辑幢加载器，没有就创建
        let logicBuilder = cacheBuilder[logicId]
        if (!logicBuilder) {
            const logicData = data.logicBuilds.find(b => b.logicBuildId == logicId)
            if (!logicData) {
                throw new Error(`build(): 没有找到id为${logicId}的逻辑幢，加载逻辑幢失败！`)
            }
            logicBuilder = new LogicBuilder(logicData)
            this.cacheBuilder[logicId] = logicBuilder
        }
        // 2、构建逻辑幢信息
        const res = logicBuilder.build()
        return res
    }
}