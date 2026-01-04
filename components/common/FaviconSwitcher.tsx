"use client";

import { useEffect } from "react";

export default function FaviconSwitcher() {
  useEffect(() => {
    const ensureLink = () => {
      let link = document.querySelector(
        'link[rel="icon"][data-dynamic-favicon="true"]'
      ) as HTMLLinkElement | null;

      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/x-icon";
        link.setAttribute("data-dynamic-favicon", "true");
        document.head.appendChild(link);
      }

      return link;
    };

    const apply = () => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const baseHref = prefersDark ? "/favicon-light.ico" : "/favicon-dark.ico";

      const bust =
        process.env.NODE_ENV === "development" ? `?v=${Date.now()}` : "";

      const link = ensureLink();
      const nextHref = `${baseHref}${bust}`;

      if (link.getAttribute("href") !== nextHref) {
        link.setAttribute("href", nextHref);
      }
    };

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply();

    mq.addEventListener("change", onChange);

    const headObserver = new MutationObserver(() => {
      const exists = document.querySelector(
        'link[rel="icon"][data-dynamic-favicon="true"]'
      );
      if (!exists) apply();
    });

    headObserver.observe(document.head, { childList: true });

    apply();

    return () => {
      mq.removeEventListener("change", onChange);
      headObserver.disconnect();
    };
  }, []);

  return null;
}
