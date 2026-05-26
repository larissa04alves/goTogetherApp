import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/login/index.tsx"),
  route("login", "pages/login/index.tsx", { id: "login" }),
  route("register", "pages/register/index.tsx"),
  route("home", "pages/home/index.tsx"),
  route("perfil", "pages/perfil/index.tsx"),
  route("rotas", "pages/rotas/index.tsx"),
  route("caronas", "pages/caronas/index.tsx"),
  route("configuracoes", "pages/configuracoes/index.tsx"),
] satisfies RouteConfig;
