import { Outlet } from "react-router";
import Layout from "../components/layout";

export default function LayoutRoute() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
