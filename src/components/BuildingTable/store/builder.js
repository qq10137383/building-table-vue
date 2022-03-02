import TableBuilder from '../core/table-builder'
import { createLogicData } from '../core/logic-builder'

/**
 * 楼盘表构建模块
 */
export default {
    data() {
        return {
            states: {
                // 逻辑幢信息
                logicInfos: [],
                // 当前逻辑幢信息
                logicBuild: createLogicData()
            }
        }
    },
    methods: {
        // 初始化楼盘表构建器
        initBuilder(data) {
            this._builder = new TableBuilder(data)
            this.states.logicInfos = this._builder.logicInfos
        },
        // 构建指定逻辑幢，logicId为空时构建第一个逻辑幢
        setBuilder(logicId) {
            if (this.states.logicBuild.id != logicId) {
                this.states.logicBuild = this._builder.build(logicId)
            }
        }
    },
}