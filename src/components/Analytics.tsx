"use client";

import { useEffect } from "react";

/**
 * Config-driven analytics. Add one env var to enable:
 *  - NEXT_PUBLIC_PLAUSIBLE_DOMAIN  → Plausible (lighter, cookieless)
 *  - NEXT_PUBLIC_POSTHOG_KEY       → PostHog (product analytics / events)
 * Loads nothing until a key is present, so it's safe in all envs.
 */
export default function Analytics() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

    if (plausible) {
      const s = document.createElement("script");
      s.defer = true;
      s.dataset.domain = plausible;
      s.src = "https://plausible.io/js/script.js";
      document.head.appendChild(s);
      return;
    }

    if (posthogKey) {
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
      // PostHog loading snippet
      const script = `!function(t,e){var o,n,p,r;e.__i||(p=e.__i=function(){p.d||(p.d=1,(p.q=[]).push(arguments))},p._=t,p._i=[],p.ui=function(t,e,o,n){p.push(["t",new Date(),t,e,o,n])},p.fn=function(){var a=[].slice.call(arguments);return p.q.push(["f",a[0].concat(a.splice(1))]),this},(o=t.createElement(e)).async=!0,o.src="${host}/static/array.js",(n=t.getElementsByTagName(e)[0]).parentNode.insertBefore(o,n))}(document,"script");posthog.init("${posthogKey}",{api_host:"${host}"});`;
      const s = document.createElement("script");
      s.text = script;
      document.head.appendChild(s);
    }
  }, []);

  return null;
}
