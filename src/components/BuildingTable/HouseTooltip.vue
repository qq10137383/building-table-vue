<template>
  <transition name="tooltip">
    <div v-show="show" class="house-tooltip-wrap" :style="{
      left: x + 'px',
      top: y + 'px',
    }">
      <slot v-bind="house" />
    </div>
  </transition>
</template>

<script>
/**
 * 房屋tooltip
 */
export default {
  name: "HouseTooltip",
  props: {
    // 延时显示tooltip时间(毫秒)
    delayTime: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      house: {},
      show: false,
      x: 0,
      y: 0,
    };
  },
  beforeCreate() {
    this.hoverState = {
      isIn: false, // 鼠标是否在单元格内
      current: null, // 当前显示房屋
      posX: 0, // 横坐标
      posY: 0, // 纵坐标
      showTimer: undefined, // 防抖定时器
    }
  },
  created() {
    this.$parent.$on("house-over", this.handleHouseOver);
    this.$parent.$on("house-move", this.handleHouseMove);
    this.$parent.$on("house-out", this.handleHouseOut);
  },
  beforeDestroy() {
    this.$parent.$off("house-over", this.handleHouseOver);
    this.$parent.$off("house-move", this.handleHouseMove);
    this.$parent.$off("house-out", this.handleHouseOut);
  },
  methods: {
    handleHouseOver(args) {
      this.hoverState.isIn = true;

      const { house, event } = args;
      this.setPosition(event);

      const { current } = this.hoverState;
      if (current) {
        // 鼠标通过悬浮提示框移动到其他单元格时没有mouseout事件，直接更新提示框位置
        if (current.houseId !== house.houseId) {
          this.updateTooltip(house);
        }
      }
      else {
        this.showTooltip(house);
      }
    },
    handleHouseMove({ house, event }) {
      this.setPosition(event);

      // 悬浮框没有显示时防抖处理
      const { isIn, current } = this.hoverState;
      isIn && !current && this.showTooltip(house);
    },
    handleHouseOut({ event }) {
      // 由于事件冒泡td内子元素会抛出事件，需要过滤掉除根节点的子元素
      if (event.target.parentElement.tagName.toLowerCase() !== "td") return;

      this.hoverState.isIn = false;
      this.closeTooltip();
    },
    clearShowTimer() {
      const { showTimer } = this.hoverState;
      showTimer && clearTimeout(showTimer);
      this.hoverState.showTimer = undefined;
    },
    setPosition(event) {
      const rect = this.$parent.$el.getBoundingClientRect();
      this.hoverState.posX = event.clientX - rect.left + 8;
      this.hoverState.posY = event.clientY - rect.top + 8;
    },
    // 延时显示Tooltip
    showTooltip(house) {
      this.clearShowTimer();

      this.hoverState.showTimer = setTimeout(() => {
        this.hoverState.current = house;
        const { posX, posY } = this.hoverState
        this.x = posX;
        this.y = posY;
        this.house = house;
        this.show = true;
        this.adjustEdge();
      }, this.delayTime || 500)
    },
    updateTooltip(house) {
      this.hoverState.current = house;
      const { posX, posY } = this.hoverState
      this.x = posX;
      this.y = posY;
      this.house = house;
      this.adjustEdge();
    },
    closeTooltip() {
      this.clearShowTimer();

      this.hoverState.current = null;
      this.house = {};
      this.show = false;
    },
    // 如果tooltip超出视图范围，调整边界
    adjustEdge() {
      this.$nextTick(() => {
        const houseWrap = this.$parent.$el.querySelector(".house-render-wrap");
        const { width, height } = houseWrap.getBoundingClientRect();
        const { clientWidth, clientHeight } = this.$el;
        if (this.x + clientWidth > width - 10) {
          this.x = this.x - clientWidth - 8;
        }
        if (this.y + clientHeight > height - 10) {
          this.y = this.y - clientHeight - 8;
        }
      })
    },
  },
};
</script>
