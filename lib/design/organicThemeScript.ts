// Server-safe: imported by the root layout (a Server Component).

export const ORGANIC_THEME_STORAGE_KEY = "ppp-organic-theme";

/**
 * Runs inline in <head> before first paint (see app/layout.tsx) so the
 * careers pages never flash light before switching to dark. An explicit
 * saved choice wins; otherwise the OS `prefers-color-scheme` is used.
 * Keep its logic in sync with `readStoredTheme` / `systemTheme` in ./organicTheme.ts.
 */
export const organicThemeInitScript = `(function(){try{var s=localStorage.getItem("${ORGANIC_THEME_STORAGE_KEY}");var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-organic-theme",d?"dark":"light")}catch(e){}})();`;
