export const BASE_PATH = "/";
/**
 * Router class
 */
export class Router {
  constructor(root, routes) {
    this.root = root;
    this.routes = routes;

    this.currentPath = "";
    this.currentPage = null;

    this.links = document.querySelectorAll('[href^="/"]');

    this.links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const { pathname: path } = new URL(event.target.href);
        window.history.pushState({ path }, path, path);
        this.renderPath(path);
      });
    });
  }

  styleLinks() {
    this.links.forEach((link) => {
      if (link.getAttribute("href") === this.currentPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  renderPath(path) {
    if (this.currentPage) {
      this.currentPage.destroy();
    }
    this.currentPage = new this.routes[path](this.root);
    this.currentPath = path;
    this.currentPage.render();
    this.styleLinks();
  }

  navigate(pathName) {
    if (!this.routes[pathName]) {
      pathName = BASE_PATH;
    }

    window.history.pushState({}, pathName, pathName);
    this.renderPath(pathName);
  }
}
