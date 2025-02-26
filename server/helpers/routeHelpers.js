function isActiveRoute(route, currentRoute) {
  return route === currentRoute ? "active" : "";
}

module.exports = { isActiveRoute }; // {} used for multiple exports
