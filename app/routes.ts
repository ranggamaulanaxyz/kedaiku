import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("modules/auth/routes/signin.tsx"),
  route("/signout", "modules/auth/routes/signout.tsx"),
  route("/password/reset", "modules/auth/routes/reset-password.tsx"),
] satisfies RouteConfig;
