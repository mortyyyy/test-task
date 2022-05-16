import { Component } from "../component";
import { YearPicker } from "./YearPicker";

/**
 * YearPicker component
 */
export class YearRangePicker extends Component {
  /**
   *
   * @param root {HTMLElement} - root element
   * @param start {Number} - first item
   * @param end {Number} - last item
   * @param fromValue { Number} - from value
   * @param toValue {Number} - to value
   * @param onChange {Function} - onChange callback
   */
  constructor(root, { start, end, fromValue, toValue, onChange }) {
    super(root, {});
    this.from = fromValue;
    this.to = toValue;
    this.start = start;
    this.end = end;
    this.onChange = onChange;
  }

  toHTML() {
    return `
            <div class="range-picker" id="range-picker">
                <div id="from" class="year-from"></div>
                <div id="to"></div>
            </div>
        `.trim();
  }

  handleChange(from, to) {
    if (from > to) {
      this.to = from;
      this.from = to;
    } else {
      this.from = from;
      this.to = to;
    }
    this.onChange(this.from, this.to);
  }

  registerChildren() {
    const containerFrom = document.getElementById("from");
    const containerTo = document.getElementById("to");
    return {
      pickerFrom: new YearPicker(
        containerFrom,
        this.start,
        this.end,
        this.from,
        (newValue) => {
          this.handleChange(newValue, this.to);
        }
      ),
      pickerTo: new YearPicker(
        containerTo,
        this.start,
        this.end,
        this.to,
        (newValue) => {
          this.handleChange(this.from, newValue);
        }
      ),
    };
  }

  afterRender() {
    this.children.pickerFrom.render();
    this.children.pickerTo.render();
  }
}
