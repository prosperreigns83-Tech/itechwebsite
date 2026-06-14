export function resolveAssetPath(path) {
  if (!path) return path;
  if (/^(https?:|data:|blob:|mailto:|tel:|\/\/)/.test(path)) {
    return path;
  }

  // Get BASE_URL from import.meta.env for development, or detect from location for production
  let base = import.meta.env.BASE_URL;
  
  // If BASE_URL is not available or is just '/', detect it from the current pathname
  if (!base || base === '/') {
    // Extract base path from location pathname
    // For deployed sites, detect the subpath automatically
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(Boolean);
    
    // If we're in a subpath (e.g., /itechwebsite/...), use that as base
    if (pathParts.length > 0 && pathParts[0] !== 'index.html') {
      base = `/${pathParts[0]}/`;
    } else {
      base = '/';
    }
  }
  
  const normalized = path.replace(/^\/+/, '');
  return `${base}${normalized}`;
}
