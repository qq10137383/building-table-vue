<script>
import { toColor } from "./utils";

/**
 * 图例符号
 */
export default {
  functional: true,
  props: {
    // 图例信息
    item: {
      type: Object,
      default: () => null,
    },
    // 显示模式：图例(legend)、符号(symbol)
    mode: {
      type: String,
      default: "legend",
    },
  },
  render(h, { props }) {
    if (!props.item) return <span class="legend-item__empty"></span>;

    const { tlxsms, color, value, tldsdm, tlbqzf, ztysdm, icon, text, tlmc } =
      props.item;
    const legendMode = tlxsms || 1;
    // 老数据兼容
    const blockColor = toColor(color || tldsdm || value);
    const title = text || tlmc;

    if (legendMode == 1 || (props.mode == "legend" && legendMode == 2)) {
      // 色块(图例模式:背景色显示为色块，符号模式:背景色不在符号区域显示)
      return (
        <div
          class="legend-item__block"
          title={title}
          style={{ backgroundColor: blockColor }}
        ></div>
      );
    } else if (legendMode == 3) {
      // 标签字符
      const charColor = toColor(ztysdm || "");
      return (
        <div
          class="legend-item__char"
          title={title}
          style={{ background: charColor }}
        >
          {tlbqzf}
        </div>
      );
    } else if (legendMode == 4) {
      // 图标
      return (
        <div
          class="legend-item__icon"
          style={{ color: blockColor }}
          title={title}
        >
          <i class={["legend-iconfont", `icon-${icon}`]} />
        </div>
      );
    } else {
      return <span class="legend-item__empty"></span>;
    }
  },
};
</script>
