import { html } from 'swtl';

export function Html({children, title, styles = []}) {
  return html`
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
        <meta name="Description" content="swtl demo">
        <title>${title ?? ''}</title>
        <style>
          img {
            max-width: 500px;
          }
        </style>
        ${styles}
      </head>
      <body>
        <h1>swtl</h1>
        <nav>
          <ul>
            <li><a href="/">home</a></li>
            <li><a href="/generator">generator</a></li>
            <li><a href="/really-long-list">render a really long list</a></li>
            <li><a href="/out-of-order">out-of-order streaming</a></li>
            <li>Blogs</li>
            <ul>
              <li><a href="/blog/swtl">Service Worker Templating Language</a></li>
              <li><a href="/blog/swsr">Service Worker Side Rendering</a></li>
            </ul>
            <li><a href="/not-found">not found</a></li>
          </ul>
        </nav>
        ${children}
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
        </script>
      </body>
    </html>
  `
}
