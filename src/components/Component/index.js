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

  afterRender() {}

  registerChildren() {}

  render() {
    if (this.el) this.destroy();
    this.init();
    this.el.innerHTML = this.toHTML();
    this.root.appendChild(this.el);
    this.children = this.registerChildren();
    this.afterRender();
  }

  toHTML() {
    return ``;
  }

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
