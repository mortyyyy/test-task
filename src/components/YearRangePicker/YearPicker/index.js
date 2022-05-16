import { Component } from "../../component";

export class YearPicker extends Component {
  /**
   *
   * @param root {HTMLElement}
   * @param from {Number}
   * @param to {Number}
   * @param defaultValue {number}
   * @param onChange {Function}
   */
  constructor(root, from, to, defaultValue, onChange) {
    super(root, {
      className: "select",
      listeners: ["click"],
      listenOutside: true,
    });

    this.value = defaultValue;
    this.from = from;
    this.to = to;
    this.onChange = onChange;

    this.opened = false;

    this.onClick = this.onClick.bind(this);
  }

  createOptionElements(from, to) {
    const options = [];

    while (from <= to) {
      options.push(`<div data-value=${from}>${from}</div>`);
      from++;
    }
    return options.join("").trim();
  }

  /**
   * @param {MouseEvent<HTMLElement>} ev
   */
  onClick(ev) {
    const value = +ev.target.dataset.value;
    if (ev.target.dataset.value !== undefined) {
      this.value = value;
      this.onChange(value);
      this.opened = false;
    } else {
      this.opened = !this.opened;
    }
    this.render();
  }

  handleOutsideClick(event) {
    if (!this.el.contains(event.target) && this.opened) {
      this.opened = false;
      this.render();
    }
  }

  afterRender() {
    super.afterRender();
    console.count();
    document.addEventListener("click", this.handleOutsideClick.bind(this), {
      capture: true,
    });
  }

  destroy() {
    super.destroy();
    document.removeEventListener("click", this.handleOutsideClick, {
      capture: true,
    });
  }

  toHTML() {
    const activeClass = this.opened ? "select_list__active" : "";
    const iconClass = this.opened ? "" : "chevron__bottom";
    return `
              <span class="selected">
                <span>${this.value}</span>
                <span class="chevron ${iconClass}"></span>
              </span>
              <div class="select_list ${activeClass}">
                ${this.createOptionElements(this.from, this.to)}
              </div>
        `.trim();
  }
}
