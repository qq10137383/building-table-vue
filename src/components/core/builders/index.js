import TableBuilder from './table-builder'
import FlexBuilder from './flex-builder'

export { createLogicData } from './base-builder'

/**
 * 创建楼盘表逻辑幢构建器
 * @param {Object} logicData 逻辑幢数据
 * @param {String} type 构建器类型
 * @returns 
 */
export function createLogicBuilder(logicData, type) {
    if (type === 'table') {
        return new TableBuilder(logicData);
    }
    else if (type === 'flex') {
        return new FlexBuilder(logicData);
    }
    else {
        throw new Error(`createBuilder(): 找不到找到类型为${type}的楼盘表逻辑幢构建器！`);
    }
}
