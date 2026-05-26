import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/login/index.tsx"),
  route("login", "pages/login/index.tsx", { id: "login" }),
  route("register", "pages/register/index.tsx"),
  route("home", "pages/home/index.tsx"),
  route("perfil", "pages/profile/index.tsx"),
  route("rotas", "pages/route/index.tsx"),
  route("historico", "pages/history/index.tsx"),
  route("hubs/novo", "pages/create-hub/index.tsx"),
  route("configuracoes", "pages/settings/index.tsx"),
] satisfies RouteConfig;
