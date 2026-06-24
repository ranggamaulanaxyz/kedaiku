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

export function Breadcrumbs() {
  const matches = useMatches();

  const crumbs = matches
    .filter((match) => match.handle && (match.handle as any).breadcrumb)
    .map((match) => {
      const handle = match.handle as any;
      const breadcrumb =
        typeof handle.breadcrumb === "function"
          ? handle.breadcrumb(match)
          : handle.breadcrumb;

      return {
        id: match.id,
        pathname: match.pathname,
        breadcrumb,
      };
    });

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <React.Fragment key={crumb.id}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold truncate max-w-[120px] sm:max-w-[200px]">
                    {crumb.breadcrumb}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="truncate max-w-[120px] sm:max-w-[200px]">
                    <Link to={crumb.pathname}>{crumb.breadcrumb}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
