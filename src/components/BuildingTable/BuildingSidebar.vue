<template>
  <div
    v-if="sidebarPanels.length > 0"
    :class="[
      'building-sidebar-wrap',
      { 'sidebar-collapsed': sidebarCollapsed },
    ]"
  >
    <div class="building-sidebar__content" v-if="activeTab">
      <transition name="sidebar-fade">
        <component :is="activeTab.name" />
      </transition>
    </div>
    <div class="building-sidebar__tabs">
      <i
        class="el-icon-d-arrow-right sidebar-handle"
        title="收起/展开"
        @click="setLayout"
      />
      <div class="sidebar-tabs-wrap">
        <div
          v-for="item in panelTabs"
          :key="item.key"
          :class="[
            'sidebar-tabs__item',
            {
              'tab-active': item.key == activeKey,
            },
          ]"
          @click="handleTabClick(item)"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BuildingLegend from "./BuildingLegend";
import BuildingTag from "./BuildingTag";
import { mapStates } from "./store";

/**
 * 楼盘表侧边栏
 */
export default {
  name: "BuildingSidebar",
  inject: ["store"],
  components: {
    BuildingLegend,
    BuildingTag,
  },
  props: {
    // 侧边栏面板
    sidebarPanels: {
      type: Array,
      default: () => ["legend", "tag"],
    },
    // 激活的面板
    activePanel: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tabs: [
        { name: "BuildingLegend", title: "房屋状态", key: "legend" },
        { name: "BuildingTag", title: "房屋标签", key: "tag" },
      ],
      activeKey: this.activePanel,
    };
  },
  computed: {
    ...mapStates({
      sidebarCollapsed: "layout.sidebarCollapsed",
      hasTag: "hasTag",
    }),
    panelTabs() {
      // 兼容老数据，如果没有tag，去掉标签面板
      const keys = this.hasTag
        ? this.sidebarPanels
        : this.sidebarPanels.filter((m) => m != "tag");
      return this.tabs.filter((m) => keys.includes(m.key));
    },
    activeTab() {
      return this.panelTabs.find((m) => m.key == this.activeKey);
    },
  },
  watch: {
    activePanel: {
      handler(val) {
        this.activeKey = val || this.sidebarPanels[0];
      },
      immediate: true,
    },
  },
  methods: {
    setLayout() {
      this.store.commit("setLayout", {
        sidebarCollapsed: !this.sidebarCollapsed,
      });
    },
    handleTabClick(item) {
      this.activeKey = item.key;
      this.store.commit("setLayout", {
        sidebarCollapsed: false,
      });
    },
  },
};
</script>
