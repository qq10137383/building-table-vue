const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

const bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));

/**
 * 属性路径转换为属性访问
 * 如: 路径'a.b.c' 转换为 obj[a][b][c]
 * @param {string} path 属性路径 
 * @returns 
 */
export function parsePath(path) {
    if (bailRE.test(path)) {
        return
    }
    const segments = path.split('.');
    return function (obj) {
        for (var i = 0; i < segments.length; i++) {
            if (!obj) return
            obj = obj[segments[i]];
        }
        return obj
    }
}

/**
 * 属性拷贝
 * @param {Object} source 
 * @param {Object} target 
 * @param {string []} keys 属性key
 */
export function copyProperties(source, target, keys) {
    for (let key of keys) {
        if (key in source && key in target) {
            source[key] = target[key]
        }
    }
}

/**
 * 对象深拷贝
 * @param {Object} source 
 * @returns 
 */
export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

/**
 * 深度复制属性
 * @param {Object} source 
 * @param {Object} target 
 */
export function deepAssign(target, source) {
    Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object') {
            deepAssign(target[key], source[key])
        } else {
            target[key] = source[key]
        }
    })
}

/**
 * 生成6位长度唯一ID字符串
 * @returns 
 */
export function uniqueId() {
    return (~~(Math.random() * (1 << 30))).toString(36);
}

/**
 * 颜色转换
 * @param {String} color 颜色字符串
 */
export function toColor(color) {
    let segs = color.split(',')
    if (segs.length === 0) {
        return color.indexOf('#') >= 0 ? color : `#${color}`
    } else if (segs.length === 3) {
        return color.indexOf('rgb') >= 0 ? color : `rgb(${color})`
    } else if (segs.length === 4) {
        return color.indexOf('rgba') >= 0 ? color : `rgba(${color})`
    }
    return color
}