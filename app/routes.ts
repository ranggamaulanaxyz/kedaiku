import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("modules/auth/routes/signin.tsx"),
  route("/signout", "modules/auth/routes/signout.tsx"),
  route("/password/reset", "modules/auth/routes/reset-password.tsx"),

  layout('modules/layout/routes/layout.tsx', [
    route('/app/dashboard', 'modules/dashboard/routes/dashboard.tsx')
  ])
] satisfies RouteConfig;
