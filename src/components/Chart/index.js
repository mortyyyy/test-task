import { boundaries, computeXRatio, computeYRatio } from "./utils";
import { Component } from "../Component";

const WIDTH = 1000;
const HEIGHT = 200;
const PADDING = 40;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;
const VIEW_WIDTH = DPI_WIDTH - PADDING;
const ROWS_COUNT = 5;
const COLS_COUNT = 9;
const OFFSET = 10;
const POINTER_WIDTH = 5;
const TOOLTIP_HORIZONTAL_OFFSET = 20;
const TOOLTIP_VERTICAL_OFFSET = 50;

const STYLES = {
  chartLineWidth: 3,
  chartStrokeStyle: "#59a6fe",
  yAxisLineWidth: 1,
  yAxisStrokeWidth: "#bbb",
  yAxisFillStyle: "#96a2aa",
  font: "normal 20px Helvetica,sans-serif",
  dashRange: [5, 10],
};

export class Chart extends Component {
  constructor(root, { isLoading, tooltipFormatter }) {
    super(root, { className: "chart", listeners: ["mousemove", "mouseleave"] });
    this.isLoading = isLoading;
    this.tooltipFormatter = tooltipFormatter;

    this.canvas = null;
    this.pointer = null;
    this.tooltip = null;

    this.data = [];

    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseleave = this.onMouseleave.bind(this);
  }

  update(data, isLoading) {
    this.data = data;
    this.isLoading = isLoading;

    const [min, max] = boundaries(this.data.map((r) => r.v));

    this.min = min;
    this.max = max;

    this.xRatio = computeXRatio(VIEW_WIDTH, this.data.length);
    this.yRatio = computeYRatio(VIEW_HEIGHT, max, min);
    this.render();
  }

  onMousemove({ clientX }) {
    const { left } = this.canvas.getBoundingClientRect();
    const idx = Math.round(((clientX - left - OFFSET) * 2) / this.xRatio);

    if (idx > this.data.length - 1 || idx < 0) {
      return;
    }

    if (this.pointer) {
      this.pointer.style.left =
        (Math.round(idx * this.xRatio) + PADDING - POINTER_WIDTH) / 2 + "px";

      this.pointer.style.top =
        Math.round(
          DPI_HEIGHT - PADDING - (this.data[idx].v - this.min) / this.yRatio
        ) /
          2 -
        POINTER_WIDTH +
        "px";

      this.pointer.style.display = "block";
    }

    if (this.tooltip) {
      this.tooltip.style.left =
        (Math.round(idx * this.xRatio) + PADDING) / 2 +
        TOOLTIP_HORIZONTAL_OFFSET +
        "px";
      this.tooltip.style.top =
        Math.round(
          DPI_HEIGHT - PADDING - (this.data[idx].v - this.min) / this.yRatio
        ) /
          2 -
        TOOLTIP_VERTICAL_OFFSET +
        "px";

      const record = this.data[idx];

      this.tooltip.innerHTML = this.tooltipFormatter
        ? this.tooltipFormatter(record)
        : null;

      this.tooltip.style.display = "block";
    }
  }

  onMouseleave() {
    this.tooltip.style.display = "none";
    this.pointer.style.display = "none";
  }

  /**
   * Draw Y axis
   */
  yAxis() {
    const step = VIEW_HEIGHT / ROWS_COUNT;
    const textStep = (this.max - this.min) / ROWS_COUNT;

    this.context.beginPath();
    this.context.lineWidth = 1;
    this.context.strokeStyle = "#bbb";
    this.context.font = STYLES.font;
    this.context.fillStyle = "#96a2aa";
    for (let i = 1; i <= ROWS_COUNT; i++) {
      const y = step * i;
      const text = Math.round(this.max - textStep * i);
      this.context.fillText(text.toString(), 0, y + PADDING - OFFSET);
      this.context.moveTo(PADDING, y + PADDING);
      this.context.setLineDash([5, 10]);
      this.context.lineTo(DPI_WIDTH, y + PADDING);
    }
    this.context.stroke();
    this.context.restore();
    this.context.closePath();
  }

  /**
   * Draw x axis
   */
  xAxis() {
    const delta = Math.ceil(this.data.length / COLS_COUNT);
    this.context.font = STYLES.font;
    this.context.beginPath();

    for (let i = 1; i < this.data.length; i = i + delta) {
      const x = i * this.xRatio;
      const date = this.data[i].t;
      this.context.fillText(
        date.toLocaleDateString ? date.toLocaleDateString("ru-RU") : "",
        x + PADDING,
        DPI_HEIGHT - OFFSET
      );
    }
    this.context.stroke();
    this.context.closePath();
  }

  line() {
    this.context.beginPath();
    this.context.lineWidth = STYLES.chartLineWidth;
    this.context.strokeStyle = STYLES.chartStrokeStyle;
    for (let i = 0; i < this.data.length; i++) {
      const x = Math.floor(i * this.xRatio) + PADDING;
      const y = Math.floor(
        DPI_HEIGHT - PADDING - (this.data[i].v - this.min) / this.yRatio
      );
      this.context.setLineDash([]);
      this.context.lineTo(x, y);
    }
    this.context.stroke();
    this.context.restore();
    this.context.closePath();
  }

  controls() {
    this.pointer = document.createElement("div");
    this.pointer.classList.add("chart_pointer");

    this.tooltip = document.createElement("div");
    this.tooltip.classList.add("chart_tooltip");

    this.el.appendChild(this.pointer);
    this.el.appendChild(this.tooltip);
  }

  toHTML() {
    const spinnerClass = this.isLoading ? "spinner__visible" : "";
    return `
            <canvas id="canvas" width="1000" height="200"></canvas>
            <div class="spinner ${spinnerClass}"></div>
        `.trim();
  }

  afterRender() {
    this.canvas = document.getElementById("canvas");

    this.context = this.canvas.getContext("2d");

    this.canvas.width = DPI_WIDTH;
    this.canvas.height = DPI_HEIGHT;

    this.canvas.style.width = WIDTH + "px";
    this.canvas.style.height = HEIGHT + "px";

    this.context.imageSmoothingEnabled =
      this.context.mozImageSmoothingEnabled =
      this.context.webkitImageSmoothingEnabled =
        false;

    if (this.data.length) {
      this.yAxis();
      this.xAxis();
      this.line();
      this.controls();
    }
  }
}
