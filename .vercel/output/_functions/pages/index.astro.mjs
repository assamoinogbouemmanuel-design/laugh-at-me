import { a2 as createComponent, af as renderHead, ad as renderComponent, ak as renderTemplate, ai as renderSlot } from '../chunks/astro/server_nO79oFPx.mjs';
import 'piccolore';
export { renderers } from '../renderers.mjs';

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="fr"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>LaughHub 😂</title>${renderHead()}</head> <body class="bg-zinc-950 text-white min-h-screen"> <div id="app"> ${renderComponent($$result, "ConvexClientProvider", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/ASSAMOI/Desktop/myfunnyapp/laughhub/src/lib/convex.tsx", "client:component-export": "default" }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })} </div> </body></html>`;
}, "C:/Users/ASSAMOI/Desktop/myfunnyapp/laughhub/src/layouts/Layout.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "MainApp", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/ASSAMOI/Desktop/myfunnyapp/laughhub/src/components/MainApp.tsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/ASSAMOI/Desktop/myfunnyapp/laughhub/src/pages/index.astro", void 0);

const $$file = "C:/Users/ASSAMOI/Desktop/myfunnyapp/laughhub/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
