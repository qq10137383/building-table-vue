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
  data() {
    return {
      house: {},
      show: false,
      x: 0,
      y: 0,
    };
  },
  created() {
    this.$parent.$on("house-over", this.handleHouseOver);
    this.$parent.$on("house-out", this.handleHouseOut);
  },
  beforeDestroy() {
    this.$parent.$off("house-over", this.handleHouseOver);
    this.$parent.$off("house-out", this.handleHouseOut);
  },
  methods: {
    handleHouseOver({ house, event }) {
      const rect = this.$parent.$el.getBoundingClientRect();
      this.x = event.clientX - rect.left + 8;
      this.y = event.clientY - rect.top + 8;
      this.house = house;
      this.show = true;
      this.$nextTick(() => this.adjustEdge());
    },
    handleHouseOut() {
      this.show = false;
    },
    // 如果tooltip超出视图范围，调整边界
    adjustEdge() {
      const houseWrap = this.$parent.$el.querySelector(".house-display-wrap");
      const { width, height } = houseWrap.getBoundingClientRect();
      const { clientWidth, clientHeight } = this.$el;
      if (this.x + clientWidth > width - 10) {
        this.x = this.x - clientWidth - 8;
      }
      if (this.y + clientHeight > height - 10) {
        this.y = this.y - clientHeight - 8;
      }
    },
  },
};
</script>
