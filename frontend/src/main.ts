import { getAdminHTML, initAdmin } from "./admin";
import { getClientHTML, initClient } from "./client";

const appRoot = document.querySelector<HTMLDivElement>("#app");
if (!appRoot) {
  throw new Error("Root #app not found");
}

function route(): void {
  const path = window.location.pathname;
  const isAdmin = path === "/admin" || path.startsWith("/admin/");
  document.body.className = isAdmin ? "admin-route" : "client-route";
  document.title = isAdmin ? "Autello — админ" : "Autello — заявка";
  if (isAdmin) {
    appRoot.innerHTML = getAdminHTML();
    initAdmin();
  } else {
    appRoot.innerHTML = getClientHTML();
    initClient();
  }
}

route();
window.addEventListener("popstate", route);
