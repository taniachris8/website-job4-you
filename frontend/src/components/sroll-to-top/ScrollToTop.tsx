import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const docEl = document.documentElement;
    const prev = docEl.style.scrollBehavior;
    docEl.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    const raf = requestAnimationFrame(() => {
      docEl.style.scrollBehavior = prev;
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
