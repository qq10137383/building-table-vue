import State from './state'
import { parsePath, deepAssign } from '../utils'

State.prototype.commit = function (name, ...payload) {
    if (this[name]) {
        return this[name].apply(this, payload)
    }
    else {
        throw new Error(`commit()：没有找到方法名${name}`)
    }
}

let store

/**
 * 创建store
 * @param {Object} initialState 初始状态
 * @returns 
 */
export function createStore(initialState = {}) {
    store = new State()
    deepAssign(store.states, initialState)
    return store
}

/**
 * 获取store
 * @returns 
 */
export function getStore() {
    return store
}

/**
 * 映射store数据
 * @param {Object} mapper 
 * @returns 
 */
export function mapStates(mapper) {
    const res = Object.keys(mapper).reduce((item, key) => {
        const value = mapper[key]
        let fn
        if (typeof value === 'string') {
            fn = function () {
                const observe = parsePath(value)
                return observe(store.states)
            };
        } else if (typeof value === 'function') {
            fn = function () {
                return value.call(this, store.states)
            };
        }
        if (fn) {
            item[key] = fn
        }
        return item
    }, {});
    return res
}
