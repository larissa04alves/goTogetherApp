import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/login/index.tsx"),
  route("login", "pages/login/index.tsx", { id: "login" }),
  route("register", "pages/register/index.tsx"),
  route("home", "pages/home/index.tsx"),
] satisfies RouteConfig;
