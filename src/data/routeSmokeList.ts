import { navigationItems } from "./navigation";

export interface RouteSmokeEntry {
  route: string;
  title: string;
  category: string;
  source: "navigation";
  intentionallyHidden?: boolean;
}

export const routeSmokeList: RouteSmokeEntry[] = navigationItems
  .map((item) => ({
    route: item.route,
    title: item.label,
    category: item.category,
    source: "navigation" as const,
  }))
  .sort((left, right) => left.route.localeCompare(right.route));

export const routeSmokeRoutes = routeSmokeList.map((entry) => entry.route);
