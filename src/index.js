import { Router } from "./router";
import { TemperaturePage } from "./pages/Temperature";
import { PrecipitationPage } from "./pages/PrecipitationPage";
import { Sidebar } from "./components/Sidebar";

/**
 * Application entry point
 */
(function (window) {
  const root = document.getElementById("root");
  const sidebarElement = document.getElementById("sidebar");

  const sidebar = new Sidebar(sidebarElement, {
    className: "app-sidebar_inner",
  });
  sidebar.render();
  /**
   * Routes List
   */
  const routes = {
    "/": TemperaturePage,
    "/precipitation": PrecipitationPage,
  };

  const router = new Router(root, routes);

  router.navigate(window.location.pathname || "/");
})(window);
