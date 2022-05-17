import { Component } from "../../Component";

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
      className: "year-picker",
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
      const optionClass =
        this.value === from ? "year-picker_option__selected" : "";
      options.push(
        `<div data-value=${from} class="year-picker_option ${optionClass}">${from}</div>`
      );
      from++;
    }
    return options.join("").trim();
  }

  /**
   * @param {MouseEvent<HTMLElement>} ev
   */
  onClick(event) {
    const value = +event.target.dataset.value;
    if (event.target.dataset.value !== undefined) {
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
    const activeClass = this.opened ? "year-picker_option__active" : "";
    const iconClass = this.opened ? "" : "chevron__bottom";
    return `
              <span class="year-picker_selected">
                <span>${this.value}</span>
                <span class="chevron ${iconClass}"></span>
              </span>
              <div class="year-picker_options ${activeClass}">
                ${this.createOptionElements(this.from, this.to)}
              </div>
        `.trim();
  }
}
