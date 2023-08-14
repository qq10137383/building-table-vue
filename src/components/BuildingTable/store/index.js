import State from './state'
import { parsePath, deepAssign } from '../utils'

/**
 * 提交store
 * @param {String} name 命令名
 * @param  {any} payload 负载 
 * @returns 
 */
State.prototype.commit = function(name, ...payload) {
  if (this[name]) {
    return this[name].apply(this, payload)
  } else {
    throw new Error(`commit()：没有找到方法名${name}`)
  }
}

/**
 * 创建store
 * @param {Object} initialState 初始状态
 * @returns
 */
export function createStore(initialState = {}) {
  const store = new State()
  deepAssign(store.states, initialState)
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
      fn = function() {
        const observe = parsePath(value)
        return observe(this.store.states)
      }
    } else if (typeof value === 'function') {
      fn = function() {
        return value.call(this, this.store.states)
      }
    }
    if (fn) {
      item[key] = fn
    }
    return item
  }, {})
  return res
}
