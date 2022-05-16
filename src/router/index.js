/**
 * Router class
 */
export class Router {
  constructor(root, routes) {
    this.root = root;
    this.routes = routes;
    this.currentPage = null;

    document.querySelectorAll('[href^="/"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const { pathname: path } = new URL(event.target.href);
        window.history.pushState({ path }, path, path);
        this.renderPath(path);
      });
    });
  }

  renderPath(pathName) {
    if (this.currentPage) {
      this.currentPage.destroy();
    }
    this.currentPage = new this.routes[pathName](this.root);
    this.currentPage.render();
  }

  navigate(pathName) {
    window.history.pushState({}, pathName, pathName);
    this.renderPath(pathName);
  }
}
