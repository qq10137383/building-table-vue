<template>
  <transition name="tooltip">
    <div
      v-show="show"
      class="house-tooltip-wrap"
      :style="{
        left: x + 'px',
        top: y + 'px',
      }"
    >
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
      default: 1000,
    },
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
    };
  },
  created() {
    this.$parent.$on("house-enter", this.handleHouseEnter);
    this.$parent.$on("house-move", this.handleHouseMove);
    this.$parent.$on("house-leave", this.handleHouseLeave);
  },
  beforeDestroy() {
    this.$parent.$off("house-enter", this.handleHouseEnter);
    this.$parent.$off("house-move", this.handleHouseMove);
    this.$parent.$off("house-leave", this.handleHouseLeave);
  },
  methods: {
    handleHouseEnter(args) {
      this.hoverState.isIn = true;
      const { house, event } = args;
      this.setPosition(event);
      this.showTooltip(house);
    },
    handleHouseMove({ event }) {
      this.setPosition(event);
    },
    handleHouseLeave() {
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
        const { posX, posY } = this.hoverState;
        this.x = posX;
        this.y = posY;
        this.house = house;
        this.show = true;
        this.adjustEdge();
      }, this.delayTime);
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
          this.x = Math.max(this.x - clientWidth - 8, 8);
        }
        if (this.y + clientHeight > height - 10) {
          this.y = Math.max(this.y - clientHeight - 8, 8);
        }
      });
    },
  },
};
</script>
