(() => {
  var __freeze = Object.freeze;
  var __defProp = Object.defineProperty;
  var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));

  // node_modules/swtl/symbol.js
  var COMPONENT_SYMBOL = Symbol("component");
  var ASYNC_SYMBOL = Symbol("async");

  // node_modules/swtl/html.js
  var TEXT = "TEXT";
  var COMPONENT = "COMPONENT";
  var NONE = "NONE";
  var PROP = "PROP";
  var CHILDREN = "CHILDREN";
  var SET_PROP = "SET_PROP";
  var PROP_VAL = "PROP_VAL";
  function* html(statics, ...dynamics) {
    if (!dynamics.length) {
      yield* statics;
    } else if (!dynamics.some((d) => typeof d === "function")) {
      yield* statics.reduce((acc, s, i) => [...acc, s, ...dynamics.length > i ? [dynamics[i]] : []], []);
    } else {
      let MODE = TEXT;
      let COMPONENT_MODE = NONE;
      let PROP_MODE = NONE;
      const componentStack = [];
      for (let i = 0; i < statics.length; i++) {
        let result = "";
        const component = {
          kind: COMPONENT_SYMBOL,
          properties: [],
          children: [],
          fn: void 0
        };
        for (let j = 0; j < statics[i].length; j++) {
          let c = statics[i][j];
          if (MODE === TEXT) {
            if (c === "<" && /**
             * @example <${Foo}>
             *           ^
             */
            !statics[i][j + 1] && typeof dynamics[i] === "function") {
              MODE = COMPONENT;
              component.fn = dynamics[i];
              componentStack.push(component);
            } else {
              result += c;
            }
          } else if (MODE === COMPONENT) {
            if (COMPONENT_MODE === PROP) {
              const component2 = componentStack[componentStack.length - 1];
              const property = component2?.properties[component2.properties.length - 1];
              if (PROP_MODE === SET_PROP) {
                let property2 = "";
                while (statics[i][j] !== "=" && statics[i][j] !== "/" && statics[i][j] !== ">" && statics[i][j] !== '"' && statics[i][j] !== "'" && statics[i][j] !== " " && property2 !== "...") {
                  property2 += statics[i][j];
                  j++;
                }
                if (statics[i][j] === "=") {
                  PROP_MODE = PROP_VAL;
                } else if (statics[i][j] === "/" && COMPONENT_MODE === PROP) {
                  COMPONENT_MODE = NONE;
                  PROP_MODE = NONE;
                  const component3 = componentStack.pop();
                  if (!componentStack.length) {
                    result = "";
                    yield component3;
                  }
                } else if (statics[i][j] === ">" && COMPONENT_MODE === PROP) {
                  COMPONENT_MODE = CHILDREN;
                  PROP_MODE = NONE;
                }
                if (property2 === "...") {
                  component2.properties.push(...Object.entries(dynamics[i]).map(([name, value]) => ({ name, value })));
                } else if (property2) {
                  component2.properties.push({ name: property2, value: true });
                }
              } else if (PROP_MODE === PROP_VAL) {
                if (statics[i][j] === '"' || statics[i][j] === "'") {
                  const quote = statics[i][j];
                  if (!statics[i][j + 1]) {
                    property.value = dynamics[i];
                    PROP_MODE = SET_PROP;
                  } else {
                    let val = "";
                    j++;
                    while (statics[i][j] !== quote) {
                      val += statics[i][j];
                      j++;
                    }
                    property.value = val || "";
                    PROP_MODE = SET_PROP;
                  }
                } else if (!statics[i][j - 1]) {
                  property.value = dynamics[i - 1];
                  PROP_MODE = SET_PROP;
                  if (statics[i][j] === ">") {
                    PROP_MODE = NONE;
                    COMPONENT_MODE = CHILDREN;
                  } else if (statics[i][j] === "/") {
                    const component3 = componentStack.pop();
                    if (!componentStack.length) {
                      yield component3;
                    }
                  }
                } else {
                  let val = "";
                  while (statics[i][j] !== " " && statics[i][j] !== "/" && statics[i][j] !== ">") {
                    val += statics[i][j];
                    j++;
                  }
                  property.value = val || "";
                  PROP_MODE = SET_PROP;
                  if (statics[i][j] === "/") {
                    const component3 = componentStack.pop();
                    if (!componentStack.length) {
                      yield component3;
                    }
                  }
                }
              }
            } else if (COMPONENT_MODE === CHILDREN) {
              const currentComponent = componentStack[componentStack.length - 1];
              if (statics[i][j + 1] === "/" && statics[i][j + 2] === "/") {
                if (result) {
                  currentComponent.children.push(result);
                  result = "";
                }
                j += 3;
                const component2 = componentStack.pop();
                if (!componentStack.length) {
                  MODE = TEXT;
                  COMPONENT_MODE = NONE;
                  yield component2;
                }
              } else if (statics[i][j] === "<" && !statics[i][j + 1] && typeof dynamics[i] === "function") {
                if (result) {
                  currentComponent.children.push(result);
                  result = "";
                }
                COMPONENT_MODE = PROP;
                PROP_MODE = SET_PROP;
                component.fn = dynamics[i];
                componentStack.push(component);
              } else if (!statics[i][j + 1]) {
                if (result && dynamics.length > i) {
                  result += statics[i][j];
                  currentComponent.children.push(result);
                  currentComponent.children.push(dynamics[i]);
                }
              } else {
                result += statics[i][j];
              }
            } else if (c === ">") {
              COMPONENT_MODE = CHILDREN;
            } else if (c === " ") {
              COMPONENT_MODE = PROP;
              PROP_MODE = SET_PROP;
            } else if (c === "/" && statics[i][j + 1] === ">") {
              MODE = TEXT;
              COMPONENT_MODE = NONE;
              const component2 = componentStack.pop();
              if (!componentStack.length) {
                result = "";
                yield component2;
              }
              j++;
            } else {
              result += c;
            }
          } else {
            result += c;
          }
        }
        if (result && COMPONENT_MODE !== CHILDREN) {
          yield result;
        }
        if (componentStack.length > 1 && component.fn) {
          componentStack[componentStack.length - 2].children.push(component);
        }
        if (dynamics.length > i && MODE !== COMPONENT) {
          yield dynamics[i];
        }
      }
    }
  }

  // node_modules/swtl/async.js
  function Async({ task, children }) {
    return {
      task,
      template: children.find((c) => typeof c === "function")
    };
  }
  Async.kind = ASYNC_SYMBOL;
  var when = (condition, template) => condition ? template() : "";

  // node_modules/swtl/render.js
  function hasGetReader(obj) {
    return typeof obj.getReader === "function";
  }
  async function* streamAsyncIterator(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          return;
        yield decoder.decode(value);
      }
    } finally {
      reader.releaseLock();
    }
  }
  async function* handleIterator(iterable) {
    if (hasGetReader(iterable)) {
      for await (const chunk of streamAsyncIterator(iterable)) {
        yield chunk;
      }
    } else {
      for await (const chunk of iterable) {
        yield chunk;
      }
    }
  }
  async function* handle(chunk, promises) {
    if (typeof chunk === "string") {
      yield chunk;
    } else if (Array.isArray(chunk)) {
      yield* _render(chunk, promises);
    } else if (typeof chunk.then === "function") {
      const v = await chunk;
      yield* handle(v, promises);
    } else if (chunk instanceof Response && chunk.body) {
      yield* handleIterator(chunk.body);
    } else if (chunk[Symbol.asyncIterator] || chunk[Symbol.iterator]) {
      yield* _render(chunk, promises);
    } else if (chunk?.fn?.kind === ASYNC_SYMBOL) {
      const { task, template } = chunk.fn({
        ...chunk.properties.reduce((acc, prop) => ({ ...acc, [prop.name]: prop.value }), {}),
        children: chunk.children
      });
      const id = promises.length;
      promises.push(
        task().then((data) => ({
          id,
          template: template({ state: "success", data })
        })).catch((error) => ({
          id,
          template: template({ state: "error", error })
        }))
      );
      yield* _render(html`<pending-task style="display: contents;" data-id="${id.toString()}">${template({ state: "pending" })}</pending-task>`, promises);
    } else if (chunk.kind === COMPONENT_SYMBOL) {
      yield* _render(
        await chunk.fn({
          ...chunk.properties.reduce((acc, prop) => ({ ...acc, [prop.name]: prop.value }), {}),
          children: chunk.children
        }),
        promises
      );
    } else {
      yield chunk.toString();
    }
  }
  async function* _render(template, promises) {
    for await (const chunk of template) {
      yield* handle(chunk, promises);
    }
  }
  var _a;
  async function* render(template) {
    let promises = [];
    yield* _render(template, promises);
    promises = promises.map((promise) => {
      let p = promise.then((val) => {
        promises.splice(promises.indexOf(p), 1);
        return val;
      });
      return p;
    });
    while (promises.length > 0) {
      const nextPromise = await Promise.race(promises);
      const { id, template: template2 } = nextPromise;
      yield* render(html(_a || (_a = __template(['\n      <template data-id="', '">', `</template>
      <script>
        {
          let toReplace = document.querySelector('pending-task[data-id="`, `"]');
          const template = document.querySelector('template[data-id="`, `"]').content.cloneNode(true);
          toReplace.replaceWith(template);
        }
      <\/script>
    `])), id.toString(), template2, id.toString(), id.toString()));
    }
  }

  // node_modules/swtl/router.js
  var Router = class {
    constructor({ routes, fallback, baseHref = "" }) {
      this.fallback = {
        render: fallback,
        params: {}
      };
      this.routes = routes.map((route) => ({
        ...route,
        urlPattern: new URLPattern({
          pathname: route.path,
          baseURL: `${self.location.origin}${baseHref}`,
          search: "*",
          hash: "*"
        })
      }));
    }
    async handleRequest(request) {
      const url = new URL(request.url);
      let matchedRoute;
      for (const route2 of this.routes) {
        const match = route2.urlPattern.exec(url);
        if (match) {
          matchedRoute = {
            render: route2.render,
            params: match?.pathname?.groups ?? {}
          };
          break;
        }
      }
      const route = matchedRoute?.render ?? this?.fallback?.render;
      if (route) {
        const query = Object.fromEntries(new URLSearchParams(request.url.search));
        const iterator = render(route({ query, params: matchedRoute?.params, request }));
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async pull(controller) {
            const { value, done } = await iterator.next();
            if (done) {
              controller.close();
            } else {
              controller.enqueue(encoder.encode(value));
            }
          }
        });
        return new Response(stream, {
          status: 200,
          headers: {
            "Content-Type": "text/html",
            "Transfer-Encoding": "chunked"
          }
        });
      }
    }
  };

  // src/pages/Html.js
  var _a2;
  function Html({ children, title, styles = [] }) {
    return html(_a2 || (_a2 = __template(['\n    <html lang="en">\n      <head>\n        <meta charset="utf-8" />\n        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n        <meta name="Description" content="swtl demo">\n        <title>', "</title>\n        <style>\n          img {\n            max-width: 500px;\n          }\n\n          footer {\n            margin-top: 50px;\n          }\n        </style>\n        ", '\n      </head>\n      <body>\n        <h1>swtl</h1>\n        <nav>\n          <ul>\n            <li><a href="/">home</a></li>\n            <li><a href="/generator">generator</a></li>\n            <li><a href="/really-long-list">render a really long list</a></li>\n            <li><a href="/out-of-order">out-of-order streaming</a></li>\n            <li>Blogs</li>\n            <ul>\n              <li><a href="/blog/swtl">Service Worker Templating Language</a></li>\n              <li><a href="/blog/swsr">Service Worker Side Rendering</a></li>\n            </ul>\n            <li><a href="/not-found">not found</a></li>\n          </ul>\n        </nav>\n        ', `
        <footer>
          This is the footer. 
          <ul>
            <li><a href="https://github.com/thepassle/swtl">Github</a></li>
            <li><a href="https://twitter.com/passle_">Twitter</a></li>
          </ul>
        </footer>
        <script>
          let refreshing;
          async function handleUpdate() {
            // check to see if there is a current active service worker
            const oldSw = (await navigator.serviceWorker.getRegistration())?.active?.state;

            navigator.serviceWorker.addEventListener('controllerchange', async () => {
              if (refreshing) return;

              // when the controllerchange event has fired, we get the new service worker
              const newSw = (await navigator.serviceWorker.getRegistration())?.active?.state;

              // if there was already an old activated service worker, and a new activating service worker, do the reload
              if (oldSw === 'activated' && newSw === 'activating') {
                refreshing = true;
                window.location.reload();
              }
            });
          }

          handleUpdate();
        <\/script>
      </body>
    </html>
  `])), title ?? "", styles, children);
  }

  // src/sw.js
  async function* generator() {
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    yield* html`<li>1</li>`;
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    yield* html`<li>2</li>`;
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    yield* html`<li>3</li>`;
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    yield* html`<li>4</li>`;
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    yield* html`<li>5</li>`;
  }
  function* reallyLongList() {
    let i = 0;
    while (i < 2e4) {
      yield* html`<li>${i++}</li>`;
    }
  }
  var router = new Router({
    routes: [
      {
        path: "/",
        render: ({ params, query, request }) => html`
        <${Html} title="swtl">
          Home
        <//>
      `
      },
      {
        path: "/out-of-order",
        render: ({ params, query, request }) => html`
        <${Html} title="out of order">
          <ul>
            <li>
              <${Async} task=${() => new Promise((r) => setTimeout(() => r({ foo: "foo" }), 3e3))}>
                ${({ state, data }) => html`
                  ${when(state === "pending", () => html`[PENDING] slow`)}
                  ${when(state === "success", () => html`[RESOLVED] slow ${data.foo}`)}
                `}
              <//>
            </li>
            <li>
              <${Async} task=${() => new Promise((r) => setTimeout(() => r({ bar: "bar" }), 1500))}>
                ${({ state, data }) => html`
                  ${when(state === "pending", () => html`[PENDING] fast`)}
                  ${when(state === "success", () => html`[RESOLVED] fast ${data.bar}`)}
                `}
              <//>
            </li>
          </ul>
        <//>
      `
      },
      {
        path: "/blog/:id",
        render: ({ params, query, request }) => html`
        <${Html} title=${`blog ${params.id}`}>
          ${fetch(`./blogs/${params.id}.html`)}
        <//>
      `
      },
      {
        path: "/generator",
        render: ({ params, query, request }) => html`<${Html} title="generator"><ul>${generator()}</ul><//>`
      },
      {
        path: "/really-long-list",
        render: ({ params, query, request }) => html`<${Html} title="really long list"><ul>${reallyLongList()}</ul><//>`
      }
    ],
    fallback: () => html`<${Html} title="not found">Not found!<//>`
  });
  self.addEventListener("install", () => {
    self.skipWaiting();
  });
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      clients.claim().then(() => {
        self.clients.matchAll().then((clients2) => {
          clients2.forEach(
            (client) => client.postMessage({ type: "SW_ACTIVATED" })
          );
        });
      })
    );
  });
  self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate") {
      event.respondWith(router.handleRequest(event.request));
    }
  });
})();
