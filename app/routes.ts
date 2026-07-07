import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("modules/auth/routes/signin.tsx"),
  route("/signout", "modules/auth/routes/signout.tsx"),
  route("/password/reset", "modules/auth/routes/reset-password.tsx"),

  route("/app", "modules/desk/routes/layout.tsx", [
    index("modules/desk/routes/desk.tsx"),
    route("/app/dashboard", "modules/dashboard/routes/dashboard.tsx"),
  ]),

  // layout("modules/layout/routes/layout.tsx", [
  //   route("/app/dashboard", "modules/dashboard/routes/dashboard.tsx"),

  //   // Country
  //   route("/app/countries", "modules/country/routes/country.tsx", [
  //     index("modules/country/routes/list.tsx"),
  //   ]),

  //   // Contact
  //   route("/app/partners", "modules/partner/routes/partner.tsx", [
  //     index("modules/partner/routes/list.tsx"),
  //     route("/app/partners/:id", "modules/partner/routes/form.tsx"),
  //   ]),
  // ]),
] satisfies RouteConfig;
