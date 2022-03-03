import { toColor, getBuildingTable } from '../utils'

/**
 * 房屋单元格默认配置
 */
const houseConfig = {
    // 房屋单元格宽度
    width: 200,
    // 房屋单元格自定义类名
    className: '',
    // 房屋单元格自定义样式
    houseStyle: {},
    // 是否显示房屋详细(blocks)信息
    showBlock: true,
    // blocks中要显示的字段，不设置显示所有字段
    includeFields: null,
    // blocks中要排除的字段
    excludeFields: null,
    // 是否显示房屋符号(symbols)信息
    showSymbol: true,
    // 每行显示几个房屋符号
    symbolColumn: 3,
    // 房屋单元格默认渲染函数
    render: function (h, { definition, houseInfo }) {
        const { className, houseStyle, showBlock, includeFields, excludeFields, showSymbol, symbolColumn } = definition
        const { houseName, blocks, symbols } = houseInfo
        const root = getBuildingTable(this)

        const renderBlock = () => {
            const blockVNodes = []
            if (!showBlock) {
                return blockVNodes
            }
            blocks.forEach(({ name, value }) => {
                // blocks字段显示过滤
                if (!((includeFields && !includeFields.includes(name)) ||
                    (excludeFields && excludeFields.includes(name))
                )) {
                    const text = `${name}：${value}`
                    blockVNodes.push(<p class="house-cell__block-item" title={text}>{text}</p>)
                }
            })
            return blockVNodes
        }
        const renderSymbol = () => {
            const symbolVNodes = []
            if (!showSymbol) {
                return symbolVNodes
            }
            for (let index = 0; index < symbols.length; index++) {
                const items = []
                if (index % symbolColumn == 0) {
                    for (let i = index; i < Math.min(index + symbolColumn, symbols.length); i++) {
                        const { color, text } = symbols[i]
                        items.push(<span class="house-cell__symbol-item" style={{ backgroundColor: toColor(color) }} title={text} />)
                    }
                    symbolVNodes.push(<div class="house-cell__symbol-row">{items}</div>)
                }
            }
            return symbolVNodes
        }
        const clickTitle = (event) => {
            event.stopPropagation()
            root && root.$emit('house-title-click', { house: houseInfo, event })
        }

        return (
            <div class={['house-cell-wrap', className]} style={houseStyle}>
                <div class="house-cell__block">
                    <h4 class="house-cell__block-title" title={houseName} on-click={clickTitle}>{houseName}</h4>
                    {renderBlock()}
                </div>
                <div class="house-cell__symbol">
                    {renderSymbol()}
                </div>
            </div>
        )
    }
}

export default houseConfig