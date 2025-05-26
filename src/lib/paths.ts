export const isRouteMatch = (
  path: string,
  route: { type: "equal" | "start"; path: string }
) => {
  const normalizedPath = path.replace(/^\/(en|ar)\//, "/");
  if (route.type === "equal") {
    return normalizedPath === route.path;
  }
  if (!normalizedPath.startsWith(route.path)) {
    return false;
  }
  if (normalizedPath === route.path) {
    return true;
  }
  const nextChar = normalizedPath[route.path.length];
  return nextChar === "/" || nextChar === "?" || nextChar === "#";
};

export const isRoutesMatch = (
  path: string,
  routes: { type: "equal" | "start"; path: string }[]
) => {
  return routes.some((route) => isRouteMatch(path, route));
};

export const getBunnyUrl = (path: string): string => {
  return new URL(
    path,
    `https://${process.env.NEXT_PUBLIC_BUNNYCDN_CDN_HOST}`
  ).toString();
};

export const getPreview = (url?: string | File | null, path?: string) => {
  if (!url) return undefined;

  if (url instanceof File) {
    if (!url.type.startsWith("image/")) {
      return undefined;
    }
    return URL.createObjectURL(url);
  }
  if (typeof url === "string") {
    if (url.startsWith("https")) return url;
    return getBunnyUrl(`${path}/${url}`);
  }
  return undefined;
};

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
