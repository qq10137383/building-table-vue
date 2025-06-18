<template>
  <div class="building-tag-wrap sidebar-content__item">
    <h4 class="sidebar-content__title">
      房屋标签
    </h4>
    <div class="sidebar-content__visual building-tag__content">
      <el-checkbox-group v-model="checkedTags">
        <div
          v-for="group in Object.keys(tagGroups)"
          :key="group"
          class="sidebar-item__group"
        >
          <el-checkbox
            v-for="(tag, index) in tagGroups[group]"
            :key="index"
            class="tag-item"
            :label="tag.prop"
          >
            {{ tag.name }}
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import { deepClone } from "./utils";

const defaultOptions = {
  // 是否分组显示
  showGroup: true,
  // 分组字段
  groupField: "type",
};

/**
 * 楼盘表标签设置
 */
export default {
  name: "BuildingTag",
  inject: ["store", "buildingTableProps"],
  computed: {
    // 获取buildingTable的tagOptions属性
    tagOptions() {
      const { tagOptions } = this.buildingTableProps;
      const options = Object.assign({}, defaultOptions, tagOptions || {});
      return options;
    },
    tagGroups() {
      const tags = deepClone(this.store.states.allBlocks || []);
      const groups = this.groupTags(tags);
      return groups;
    },
    checkedTags: {
      get() {
        return this.store.states.checkedTags.map((m) => m.prop);
      },
      set(val) {
        this.store.commit("setCheckedTags", val);
      },
    },
  },
  methods: {
    groupTags(tags) {
      const { showGroup, groupField } = this.tagOptions;
      const groups = {};
      const hasGroup = showGroup && !!groupField;
      for (const item of tags) {
        const key = (hasGroup && item[groupField]) || "default";
        const children = groups[key] || (groups[key] = []);
        children.push(item);
      }
      // 排序
      for (const item in groups) {
        groups[item].sort((m, n) => m.pxh - n.pxh);
      }
      return groups;
    },
  },
};
</script>
