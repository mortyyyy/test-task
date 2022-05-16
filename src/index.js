import { Router } from "./router";
import { TemperaturePage } from "./pages/temperature";
import { PrecipitationPage } from "./pages/precipitation";

/**
 * Application entry point
 */
(function (window) {
  const root = document.getElementById("root");

  /**
   * Routes List
   */
  const routes = {
    "/": TemperaturePage,
    "/temperature": TemperaturePage,
    "/precipitation": PrecipitationPage,
  };

  const router = new Router(root, routes);

  router.navigate(window.location.pathname || "/");
})(window);
