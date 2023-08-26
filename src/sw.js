import { Router, html } from 'swtl';
import { Async, when } from 'swtl/async.js';
import { Html } from './pages/Html.js';

async function* generator() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  yield* html`<li>1</li>`;
  await new Promise(resolve => setTimeout(resolve, 1000));
  yield* html`<li>2</li>`;
  await new Promise(resolve => setTimeout(resolve, 1000));
  yield* html`<li>3</li>`;
  await new Promise(resolve => setTimeout(resolve, 1000));
  yield* html`<li>4</li>`;
  await new Promise(resolve => setTimeout(resolve, 1000));
  yield* html`<li>5</li>`;
}

function* reallyLongList() {
  let i = 0;
  while(i < 20000) {
    yield* html`<li>${i++}</li>`;
  }
}

const router = new Router({
  routes: [
    {
      path: '/',
      render: ({params, query, request}) => html`
        <${Html} title="swtl">
          Home
        <//>
      `
    },
    {
      path: '/out-of-order',
      render: ({params, query, request}) => html`
        <${Html} title="out of order">
          <ul>
            <li>
              <${Async} task=${() => new Promise(r => setTimeout(() => r({foo:'foo'}), 3000))}>
                ${({state, data}) => html`
                  ${when(state === 'pending', () => html`[PENDING] slow`)}
                  ${when(state === 'success', () => html`[RESOLVED] slow ${data.foo}`)}
                `}
              <//>
            </li>
            <li>
              <${Async} task=${() => new Promise(r => setTimeout(() => r({bar:'bar'}), 1500))}>
                ${({state, data}) => html`
                  ${when(state === 'pending', () => html`[PENDING] fast`)}
                  ${when(state === 'success', () => html`[RESOLVED] fast ${data.bar}`)}
                `}
              <//>
            </li>
          </ul>
        <//>
      `
    },
    {
      path: '/blog/:id',
      render: ({params, query, request}) => html`
        <${Html} title=${`blog ${params.id}`}>
          ${fetch(`./blogs/${params.id}.html`)}
        <//>
      `
    },
    {
      path: '/generator',
      render: ({params, query, request}) => html`<${Html} title="generator"><ul>${generator()}</ul><//>`
    },
    {
      path: '/really-long-list',
      render: ({params, query, request}) => html`<${Html} title="really long list"><ul>${reallyLongList()}</ul><//>`
    },
  ],
  fallback: () => html`<${Html} title="not found">Not found!<//>`,
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim().then(() => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({ type: "SW_ACTIVATED" })
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

