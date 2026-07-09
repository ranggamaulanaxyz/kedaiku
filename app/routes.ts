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
    route("dashboard", "modules/dashboard/routes/dashboard.tsx"),

    route("countries", "modules/country/routes/country.tsx", [
      index("modules/country/routes/list.tsx"),
      route(":id", "modules/country/routes/form.tsx"),
    ]),

    route("country/states", "modules/country/routes/state.tsx", [
      index("modules/country/routes/state_list.tsx"),
      route(":id", "modules/country/routes/state_form.tsx"),
    ]),

    route("partners", "modules/partner/routes/partner.tsx", [
      index("modules/partner/routes/list.tsx"),
      route(":id", "modules/partner/routes/form.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
