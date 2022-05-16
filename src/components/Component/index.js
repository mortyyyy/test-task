/**
 * @param type
 * @return {string}
 */
const toEventName = (type) => {
  if (!type) return "";
  else return `on${type[0].toUpperCase()}${type.slice(1)}`;
};

export class Component {
  /**
   * @param {HTMLElement} root
   * @param { { listeners: string[], className: string } } options
   */
  constructor(root, { listeners, className, tag = "div", listenOutside }) {
    this.root = root;
    this.el = null;
    this.listeners = listeners;
    this.events = [];
    this.className = className;
    this.tag = tag;
    this.listenOutside = listenOutside;
    this.children = {};
  }

  /**
   * Init DOM elements and all listeners
   */
  init() {
    this.el = document.createElement(this.tag);
    this.el.classList.add(this.className);
    this.events = (this.listeners || []).map((type) => {
      const event = toEventName(type);
      const handler = this[event];
      if (!handler) {
        throw Error(`handler ${type} is not implemented`);
      }
      this.el.addEventListener(type, handler);
      return { type, handler };
    });
  }

  /**
   * Hook which is called after render
   */
  afterRender() {}

  /**
   * Hook which is called after render
   */
  registerChildren() {}

  /**
   * Clean up the dom and then render component HTML
   */
  render() {
    if (this.el) this.destroy();
    this.init();
    this.el.innerHTML = this.toHTML();
    this.root.appendChild(this.el);
    this.children = this.registerChildren();
    this.afterRender();
  }

  /**
   * Returns component template
   * @return {string}
   */
  toHTML() {
    return ``;
  }

  /**
   * Clean up all events and dom elements
   */
  destroy() {
    this.events.forEach(({ type, handler }) => {
      this.el.removeEventListener(type, handler);
    });

    if (this.children) {
      for (const child in this.children) {
        child?.destroy && child.destroy();
      }
    }

    this.events = [];
    this.el.remove();
  }
}
