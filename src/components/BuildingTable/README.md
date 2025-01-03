# building-table-vue

基于 vue2 的楼盘表组件，以二维表图形方式显示栋楼的 `逻辑区`、`单元`、`楼层`、`房屋` 信息

## 楼盘表基础用法

基础的楼盘表展示用法。

```html
<building-table
  :height="600"
  :buildingData="buildingData"
  @house-click="houseClick"
>
</building-table>

<script>
  import BuildingTable from "@/components/BuildingTable"

  export default {
     components: {
         BuildingTable
     },
     data() {
         return {
              // 楼盘表数据
              buildingData: null,
         }
     },
     created() {
         // 模拟加载数据
         this.buildingData = xxx
     }
     methods: {
         // 房屋单元格点击事件
         houseClick(house) {
             console.log(house)
         }
     }
  }
</script>
```

## 自定义楼盘表单元格

楼盘表渲染组件 `单元`、`楼层`、`房屋` 单元格有内置的模板，内置模板定义了一些属性可以调整显示，  
如果调整属性不能满足显示要求，可以使用 `slot-scope template` 自定义显示内容。

1、通过属性修改房屋单元格的显示

```html
<building-table :buildingData="buildingData">
  <house-definition
    :className="my-house-cell"
    :houseStyle="{backgroundColor:'red'}"
    :excludeFields="excludeFields"
    :showLegend="showLegend"
  />
</building-table>

<script>
  import BuildingTable, { HouseDefinition } from "@/components/BuildingTable";

  export default {
    components: {
      BuildingTable,
      HouseDefinition
    },
    data() {
      return {
        // 楼盘表数据
        buildingData: null,
        // 房屋单元格哪些字段不显示
        excludeFields: ["房屋名称"], // 排除房屋名称
        // 不显示房屋单元格图例
        showLegend: false
      };
    },
    created() {
      // 模拟加载数据
      this.buildingData = xxx;
    }
  };
</script>
```

2、通过自定义模板完全控制房屋单元格的显示

```html
<building-table :buildingData="buildingData">
  <!-- 仅显示房号 -->
  <house-definition :width="70">
    <template slot-scope="scope">
      <div class="house-cell-wrap">{{ scope.houseInfo.houseName }}</div>
    </template>
  </house-definition>
</building-table>

<script>
  import BuildingTable, { HouseDefinition } from "@/components/BuildingTable";

  export default {
    components: {
      BuildingTable,
      HouseDefinition
    },
    data() {
      return {
        // 楼盘表数据
        buildingData: null
      };
    },
    created() {
      // 模拟加载数据
      this.buildingData = xxx;
    }
  };
</script>
```

房屋单元格的事件处理在模板外层的 td，所以自定义模板不需要处理鼠标事件，仅仅控制显示，  
样式可参考代码 `style/house.scss` 。

单元格状态控制：

- 单元格被选中时外层 td 会增加 `house-selected` 样式
- 单元格定位高亮时外层 td 会增加 `house-highlight` 样式

为了不处理这些状态，可以在自定义模板根元素上增加样式 `house-cell-wrap`

3、自定义单元、楼层

`单元`、`楼层` 自定义同上，组件换成对应模板组件，单元格模板与配置组件对应关系如下：

| 模板 | 组件            |
| ---- | --------------- |
| 单元 | UnitDefinition  |
| 楼层 | FloorDefinition |
| 房屋 | HouseDefinition |

## 楼盘表高度

楼盘表单元固定，仅房屋、楼层区域才会滚动，所以需要设置高度，默认值为 `600px`，值可以是数字、百分比(%,vh)、计算高度(calc)、'auto'等，如果设置为'auto'，单元将不会固定，会随着滚动条滚动。

```html
<building-table :height="600" :buildingData="buildingData"> </building-table>
```

## 显示模式  

楼盘表内置两种显示模式模式，通过设置组件 `displayMode` 属性或者组件工具栏切换。

- buildingTable：使用二维楼盘表展示。  
- elementTable：使用element-ui table渲染，以列表形式展示。  

当显示模式为 `buildingTable` 时，可以通过属性 `renderMode` 设置二维楼盘表的布局模式。

- table：使用表格渲染，支持跨行和跨列，楼层始终不换行。  
- flex：使用弹性布局渲染，不支持跨行跨列，单元始终等分楼盘表宽度，楼层中房屋过多时会换行显示。

## BuildingTable 组件说明

### BuildingTable 属性

| 参数               | 说明                                                | 类型           | 默认值                     | 可选值                                      |
| ------------------ | --------------------------------------------------- | -------------- | -------------------------- | ------------------------------------------- |
| className          | 楼盘表自定义样式类名                                | String         | ''                         |                                             |
| tableStyle         | 楼盘表自定义样式                                    | Object         |                            |                                             |
| height             | 楼盘表高度                                          | Number, String | 600                        |                                             |
| buildingData       | 楼盘表数据                                          | Object         |                            |                                             |
| logicBuildId       | 当前逻辑幢 ID，为空时加载第一个逻辑幢               | String         | ''                         |                                             |
| selectionMode      | 楼盘表选择模式，优先级低于 buildingData 的 useMode  | String         | ''                         | "single", "multiple", "disable"             |
| displayMode        | 楼盘表显示模式                                      | String         | ''                         | "buildingTable", "elementTable"             |
| renderMode         | 显示模式为楼盘表(buildingTable)时使用的布局模式     | String         | 'flex'                     | "table", "flex"                             |
| showHeader         | 是否显示导航栏                                      | Boolean        | true                       |                                             |
| showTitle          | 是否显示标题                                        | Boolean        | true                       |                                             |
| tools              | 内置工具栏，"locate", "select", "switchLogic"的组合 | Array          | locate,switchLogic,display | "locate", "select", "switchLogic","display" |
| showSidebar        | 是否显示侧边栏                                      | Boolean        | true                       |                                             |
| sidebarPanels      | 侧边栏面板, "legend","tag"的组合                    | Array          | legend,tag                 | "legend","tag"                              |
| activePanel        | 激活的侧边栏面板，默认激活第一个                    | String         | ''                         | "legend", "tag"                             |
| legendOptions      | 图例选项                                            | Object         | null                       |                                             |
| tagOptions         | 标签选项                                            | Object         | null                       |                                             |
| showFooter         | 是否显示页脚                                        | Boolean        | true                       |                                             |
| statisticData      | 统计数据                                            | Object         | null                       |                                             |
| statisticMaxColumn | 统计最多显示几列                                    | Number         | 6                          |                                             |
| tipText            | 提示信息                                            | String         | '暂无数据'                 |                                             |

### BuildingTable 方法

| 方法             | 说明                                                                        | 参数        |
| ---------------- | --------------------------------------------------------------------------- | ----------- |
| setData          | 设置楼盘表数据源，同属性 buildingData                                       | Object      |
| clearData        | 清空楼盘表数据源                                                            |             |
| getSelections    | 获取楼盘表选择的房屋(onlyId 为 true 时仅返回房屋 ID 集合，否则返回房屋集合) | onlyId      |
| changeLogicBuild | 切换逻辑幢(logicId：逻辑幢 ID)，同属性 logicBuildId                         | logicId     |
| addSelections    | 增加房屋选择(houseIds：房屋 ID 集合)                                        | houseIds    |
| removeSelections | 移除房屋选择(houseIds：房屋 ID 集合)                                        | houseIds    |
| clearSelection   | 移除房屋选择(houseIds：房屋 ID 集合)                                        |             |
| selectAll        | 全选所有房屋(onlyEnabled 为 true，isEnabled 为 false 的房屋不会被选中)      | onlyEnabled |
| setDisplayMode   | 设置显示模式                                                                | mode        |
| setRenderMode    | 设置楼盘表渲染模式                                                          | mode        |
| setCheckedTags   | 设置房屋显示的标签                                                          | tagProps    |
| resize           | 重新布局                                                                    |             |
| refresh          | 使用当前数据重新渲染楼盘表                                                  |             |

### BuildingTable 事件

| 事件名             | 说明                       | 参数                         |
| ------------------ | -------------------------- | ---------------------------- |
| house-title-click  | 房号点击事件               | house,MouseEvent             |
| house-click        | 房屋单元格点击事件         | house,MouseEvent             |
| house-dbclick      | 房屋单元格双击事件         | house,MouseEvent             |
| house-over         | 房屋单元格鼠标进入事件     | house,MouseEvent             |
| house-move         | 房屋单元格鼠标移动事件     | house,MouseEvent             |
| house-out          | 房屋单元格鼠标离开事件     | house,MouseEvent             |
| house-contextmenu  | 房屋单元格鼠标右键菜单事件 | house,MouseEvent             |
| logic-build-change | 逻辑幢改变事件             | logicBuildId                 |
| select-change      | 房屋单元格选择改变事件     | Array\<house>                |
| floor-checked      | 楼层 checkbox 点击事件     | floorInfo, unitInfo, checked |
| unit-checked       | 单元 checkbox 点击事件     | unitInfo, checked            |

### BuildingTable 插槽

| 插槽名      | 说明                                                               |
| ----------- | ------------------------------------------------------------------ |
| default     | 用来放置 UnitDefinition,FloorDefinition,HouseDefinition 自定义模板 |
| headerLeft  | 标题栏左侧工具栏                                                   |
| headerRight | 标题栏右侧工具栏                                                   |
| footer      | 页脚                                                               |

## UnitDefinition 组件说明

### UnitDefinition 属性

| 参数       | 说明                 | 类型    | 默认值     | 可选值 |
| ---------- | -------------------- | ------- | ---------- | ------ |
| height     | 单元单元格高度       | Number  | 50         |        |
| className  | 单元单元格自定义类名 | String  | ''         |        |
| unitStyle  | 单元单元格自定义样式 | Object  |            |        |
| titleField | 用来显示单元字段名   | String  | 'unitName' |        |
| showCheck  | 是否显示单元选择按钮 | Boolean | true       |        |

### UnitDefinition scope 参数

使用 `slot-scope template` 自定义模板时传入的 `scope` 参数

| 参数         | 说明                                                   | 类型   |
| ------------ | ------------------------------------------------------ | ------ |
| definition   | 单元配置信息，即 UnitDefinition 组件定义的属性，见上表 | Object |
| logicBuildId | 逻辑幢 ID                                              | String |
| unitInfo     | 单元信息                                               | Object |
| store        | 楼盘表内部使用的 store 对象                            | Object |

## FloorDefinition 组件说明

### FloorDefinition 属性

| 参数       | 说明                 | 类型    | 默认值  | 可选值 |
| ---------- | -------------------- | ------- | ------- | ------ |
| width      | 楼层单元格宽度       | Number  | 50      |        |
| className  | 楼层单元格自定义类名 | String  | ''      |        |
| floorStyle | 楼层单元格自定义样式 | Object  |         |        |
| titleField | 用来显示楼层字段名   | String  | 'layer' |        |
| showCheck  | 是否显示楼层选择按钮 | Boolean | true    |        |

### FloorDefinition scope 参数

使用 `slot-scope template` 自定义模板时传入的 `scope` 参数

| 参数         | 说明                                                    | 类型   |
| ------------ | ------------------------------------------------------- | ------ |
| definition   | 楼层配置信息，即 FloorDefinition 组件定义的属性，见上表 | Object |
| logicBuildId | 逻辑幢 ID                                               | String |
| floorInfo    | 楼层信息                                                | Object |
| unitInfo     | 单元信息                                                | Object |
| store        | 楼盘表内部使用的 store 对象                             | Object |

## HouseDefinition 组件说明

### HouseDefinition 属性

| 参数                 | 说明                                      | 类型           | 默认值 | 可选值 |
| -------------------- | ----------------------------------------- | -------------- | ------ | ------ |
| width                | 房屋单元格宽度                            | Number         | 220    |        |
| className            | 房屋单元格自定义类名                      | String         | ''     |        |
| houseStyle           | 房屋单元格自定义样式                      | Object         |        |        |
| showBlock            | 是否显示房屋详细(blocks)信息              | Boolean        | true   |        |
| parseBlockValue      | 标签值转换函数                            | Function       |        |        |
| includeFields        | blocks 中要显示的字段，不设置显示所有字段 | Array\<String> | null   |        |
| excludeFields        | blocks 中要排除的字段                     | Array\<String> | null   |        |
| showSymbol           | 是否显示房屋符号(symbols)信息             | Boolean        | true   |        |
| symbolColumn         | 每行显示几个房屋符号(symbol)              | Number         | 2      |        |
| simple               | 是否以精简模式显示                        | Boolean        | false  |        |
| simpleWidth          | 精简模式下单元格宽度                      | Number         | 120    |        |
| showTitle            | 是否显示单元格提示信息                    | Boolean        | false  |        |
| adjustWidthIfNoBlock | 没有标签时是否调整单元格宽度为simpleWidth | Boolean        | true   |        |

### HouseDefinition scope 参数

使用 `slot-scope template` 自定义模板时传入的 `scope` 参数

| 参数         | 说明                                                    | 类型   |
| ------------ | ------------------------------------------------------- | ------ |
| definition   | 房屋配置信息，即 HouseDefinition 组件定义的属性，见上表 | Object |
| logicBuildId | 逻辑幢 ID                                               | String |
| floorInfo    | 楼层信息                                                | Object |
| unitInfo     | 单元信息                                                | Object |
| houseInfo    | 房屋信息                                                | Object |
| store        | 楼盘表内部使用的 store 对象                             | Object |

## HouseTooltip 组件说明

用来显示房屋单元格的 tooltip，可以使用 `slot-scope template` 自定义模板，传入的 `scope` 参数为 house

### HouseTooltip 属性

| 参数      | 说明                      | 类型   | 默认值 | 可选值 |
| --------- | ------------------------- | ------ | ------ | ------ |
| delayTime | 延时显示tooltip时间(毫秒) | Number | 1000   |        |


```html
<building-table :height="600" :buildingData="buildingData">
  <house-tooltip>
    <template slot-scope="house">
      <ul>
        <li>房号：{{ house.houseName }}</li>
        <li>建筑面积：{{ house.jzmj }}㎡</li>
        <li>权利人：{{ house.qlrmc }}</li>
        <li>房屋用途：{{ house.fwytmc }}</li>
        <li>房屋状态：{{ house.fwztmc }}</li>
      </ul>
    </template>
  </house-tooltip>
</building-table>
```
