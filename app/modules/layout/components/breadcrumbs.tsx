import * as React from "react";
import { Link, useMatches, useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import type { RouteHandle } from "../types";

const getBreadcrumbLabel = (match: any): string => {
  const handle = match.handle as any;
  if (!handle) return "";
  if (typeof handle.handleBreadcrumbs === "function") {
    return handle.handleBreadcrumbs(match);
  }
  if (typeof handle.breadcrumb === "function") {
    return handle.breadcrumb(match);
  }
  if (typeof handle.breadcrumb === "string") {
    return handle.breadcrumb;
  }
  return "";
};

export function Breadcrumbs() {
  const matches = useMatches();
  const location = useLocation();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`search:${location.pathname}`, location.search);
    }
  }, [location.pathname, location.search]);

  const breadcrumbs = matches
    .map((match) => ({
      label: getBreadcrumbLabel(match),
      to: match.pathname,
    }))
    .filter((crumb) => Boolean(crumb.label))
    .filter(
      (crumb, index, self) =>
        self.findIndex((c) => c.to === crumb.to) === index,
    );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const savedSearch = typeof window !== "undefined" ? sessionStorage.getItem(`search:${crumb.to}`) || "" : "";
          return (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.to && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link to={`${crumb.to}${savedSearch}`}>{crumb.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

