"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { CmsEditableField, CmsFieldValue } from "../../lib/cms-types";

const TEXT_SELECTOR = "h1,h2,h3,p,blockquote,dt,dd,li,small,a.button";

function cleanText(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function sectionName(root: Element, index: number, fallback: string) {
  const heading = root.querySelector("h1,h2,h3");
  return cleanText(heading?.textContent).slice(0, 90) || fallback || `Section ${index + 1}`;
}

function editableTextElements(root: Element) {
  return Array.from(root.querySelectorAll<HTMLElement>(TEXT_SELECTOR)).filter((element) => {
    if (element.closest("form") || element.closest("[role='dialog']")) return false;
    if (element.matches("li") && element.querySelector("h1,h2,h3,p,a,button,input")) return false;
    return cleanText(element.textContent).length > 0;
  });
}

function collectRootFields(root: Element, rootId: string, path: string, section: string, targets: Map<string, HTMLElement>) {
  const fields: CmsEditableField[] = [];
  editableTextElements(root).forEach((element, index) => {
    const key = `${rootId}.text.${String(index + 1).padStart(3, "0")}`;
    element.dataset.cmsKey = key;
    targets.set(key, element);
    fields.push({ key, path, section, label: `${section} · Texte ${index + 1}`, type: "text", value: cleanText(element.textContent) });
  });
  Array.from(root.querySelectorAll<HTMLImageElement>("img")).forEach((element, index) => {
    const key = `${rootId}.image.${String(index + 1).padStart(3, "0")}`;
    element.dataset.cmsKey = key;
    targets.set(key, element);
    fields.push({ key, path, section, label: `${section} · Image ${index + 1}`, type: "image", value: element.currentSrc || element.src, alt: element.alt });
  });
  return fields;
}

function discoverFields(pathname: string) {
  const targets = new Map<string, HTMLElement>();
  const fields: CmsEditableField[] = [];
  const main = document.querySelector("main");
  if (main) {
    let roots = Array.from(main.querySelectorAll(":scope > section, :scope > article, :scope > header"));
    if (!roots.length) roots = [main];
    roots.forEach((root, index) => {
      const section = sectionName(root, index, `Section ${index + 1}`);
      fields.push(...collectRootFields(root, `page.s${String(index + 1).padStart(2, "0")}`, pathname, section, targets));
    });
  }
  const header = document.querySelector(".site-header");
  if (header) fields.push(...collectRootFields(header, "global.header", "/__global__", "En-tête du site", targets));
  const footer = document.querySelector(".site-footer");
  if (footer) fields.push(...collectRootFields(footer, "global.footer", "/__global__", "Pied de page", targets));
  return { fields, targets };
}

function applyField(element: HTMLElement, field: CmsFieldValue) {
  if (field.type === "image" && element instanceof HTMLImageElement) {
    if (field.value) element.src = field.value;
    if (typeof field.alt === "string") element.alt = field.alt;
    return;
  }
  if (field.type === "text") element.textContent = field.value;
}

export function CmsRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/administration")) return;
    let disposed = false;
    let applying = false;
    let observer: MutationObserver | undefined;
    let currentOverrides: Record<string, CmsFieldValue> = {};
    let targets = new Map<string, HTMLElement>();
    const preview = new URLSearchParams(window.location.search).get("cmsPreview") === "1" && window.parent !== window;

    const applyOverrides = () => {
      applying = true;
      for (const [key, field] of Object.entries(currentOverrides)) {
        const element = targets.get(key);
        if (element) applyField(element, field);
      }
      window.setTimeout(() => { applying = false; }, 0);
    };

    const blockPreviewInteraction = (event: Event) => {
      if (!preview) return;
      const target = event.target instanceof Element ? event.target.closest("a,button,form") : null;
      if (target) event.preventDefault();
    };

    const reportFields = () => {
      if (!preview) return;
      const discovered = discoverFields(pathname);
      targets = discovered.targets;
      applyOverrides();
      const fields = discovered.fields.map((field) => ({ ...field, ...(currentOverrides[field.key] ?? {}) }));
      window.parent.postMessage({ type: "geef:cms-fields", path: pathname, fields }, window.location.origin);
    };

    const refresh = () => {
      const discovered = discoverFields(pathname);
      targets = discovered.targets;
      applyOverrides();
      if (preview) {
        const fields = discovered.fields.map((field) => ({ ...field, ...(currentOverrides[field.key] ?? {}) }));
        window.parent.postMessage({ type: "geef:cms-fields", path: pathname, fields }, window.location.origin);
      }
    };

    const onMessage = (event: MessageEvent) => {
      if (!preview || event.origin !== window.location.origin || event.data?.type !== "geef:cms-preview") return;
      const { key, field } = event.data as { key?: string; field?: CmsFieldValue };
      if (!key || !field) return;
      currentOverrides[key] = field;
      const element = targets.get(key);
      if (element) applyField(element, field);
    };

    async function start() {
      try {
        const endpoint = preview ? "/api/admin/cms" : "/api/cms/public";
        const response = await fetch(`${endpoint}?path=${encodeURIComponent(pathname)}`, { cache: "no-store", credentials: "same-origin" });
        if (response.ok) {
          currentOverrides = (await response.json()).fields ?? {};
          if (pathname.startsWith("/en")) {
            currentOverrides = Object.fromEntries(Object.entries(currentOverrides).filter(([key]) => !key.startsWith("global.")));
          }
        }
      } catch { /* The static site remains usable if the CMS storage is temporarily unavailable. */ }
      if (disposed) return;
      refresh();
      window.addEventListener("message", onMessage);
      if (preview) {
        document.addEventListener("click", blockPreviewInteraction, true);
        document.addEventListener("submit", blockPreviewInteraction, true);
      }
      let timer = 0;
      observer = new MutationObserver(() => {
        if (applying) return;
        window.clearTimeout(timer);
        timer = window.setTimeout(refresh, 80);
      });
      const main = document.querySelector("main");
      if (main) observer.observe(main, { subtree: true, childList: true, characterData: true });
      if (preview) window.setTimeout(reportFields, 150);
    }

    void start();
    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", blockPreviewInteraction, true);
      document.removeEventListener("submit", blockPreviewInteraction, true);
    };
  }, [pathname]);

  return null;
}
