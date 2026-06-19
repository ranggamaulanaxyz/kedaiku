import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/signin", "modules/auth/routes/signin.tsx"),
] satisfies RouteConfig;
