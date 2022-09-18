import { Home } from "../pages/Home/index.js";
import { Search } from "../pages/search/index.js";
import { executeCleanUp, initHooks } from "./hooks.js";
import { appInit } from "./view.js";

const routes = {
  "/": Home,
  "/search": Search,
};

export function initRounter() {
  window.onpopstate = () => {
    executeCleanUp();
    initHooks();
    appInit(document.querySelector("#root"), router());
  };
}

export function push(pathname) {
  history.pushState({}, "", location.origin + pathname);
  appInit(document.querySelector("#root"), router());
}

export function router() {
  return routes[window.location.pathname];
}
