import * as React from "react";
import { Link, useMatches } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import type { RouteHandle } from "../types";

export function Breadcrumbs() {
  const matches = useMatches();

  const breadcrumbs = matches
    .filter((match) =>
      Boolean((match.handle as RouteHandle)?.handleBreadcrumbs),
    )
    .map((match) => {
      return {
        label: (match.handle as RouteHandle)?.handleBreadcrumbs?.(match) ?? "",
        to: match.pathname,
      };
    });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          return (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.to ? (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.to}>{crumb.label}</Link>
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
