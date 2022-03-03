import { unitConfig, floorConfig, houseConfig } from '../config'
import { deepClone, deepAssign } from '../utils'

/**
 * 配置模块
 */
export default {
    data() {
        return {
            states: {
                // 楼层配置信息
                floorDefinition: deepClone(floorConfig),
                // 单元配置信息
                unitDefinition: deepClone(unitConfig),
                // 房屋配置信息
                houseDefinition: deepClone(houseConfig)
            }
        }
    },
    methods: {
        setUnitDefinition(definition) {
            deepAssign(this.states.unitDefinition, definition)
        },
        setFloorDefinition(definition) {
            deepAssign(this.states.floorDefinition, definition)
        },
        setHouseDefinition(definition) {
            deepAssign(this.states.houseDefinition, definition)
        }
    }
}