(()=>{var q=Object.freeze,D=Object.defineProperty;var R=(e,t)=>q(D(e,"raw",{value:q(t||e.slice())}));var T=Symbol("component"),N=Symbol("async");var L="TEXT",b="COMPONENT",m="NONE",S="PROP",$="CHILDREN",g="SET_PROP",M="PROP_VAL";function*s(e,...t){if(!t.length)yield*e;else if(!t.some(l=>typeof l=="function"))yield*e.reduce((l,n,i)=>[...l,n,...t.length>i?[t[i]]:[]],[]);else{let l=L,n=m,i=m,a=[];for(let r=0;r<e.length;r++){let f="",u={kind:T,properties:[],children:[],fn:void 0};for(let o=0;o<e[r].length;o++){let c=e[r][o];if(l===L)c==="<"&&!e[r][o+1]&&typeof t[r]=="function"?(l=b,u.fn=t[r],a.push(u)):f+=c;else if(l===b)if(n===S){let d=a[a.length-1],w=d?.properties[d.properties.length-1];if(i===g){let p="";for(;e[r][o]!=="="&&e[r][o]!=="/"&&e[r][o]!==">"&&e[r][o]!=='"'&&e[r][o]!=="'"&&e[r][o]!==" "&&p!=="...";)p+=e[r][o],o++;if(e[r][o]==="=")i=M;else if(e[r][o]==="/"&&n===S){n=m,i=m;let h=a.pop();a.length||(f="",yield h)}else e[r][o]===">"&&n===S&&(n=$,i=m);p==="..."?d.properties.push(...Object.entries(t[r]).map(([h,k])=>({name:h,value:k}))):p&&d.properties.push({name:p,value:!0})}else if(i===M){if(e[r][o]==='"'||e[r][o]==="'"){let p=e[r][o];if(!e[r][o+1])w.value=t[r],i=g;else{let h="";for(o++;e[r][o]!==p;)h+=e[r][o],o++;w.value=h||"",i=g}}else if(e[r][o-1]){let p="";for(;e[r][o]!==" "&&e[r][o]!=="/"&&e[r][o]!==">";)p+=e[r][o],o++;if(w.value=p||"",i=g,e[r][o]==="/"){let h=a.pop();a.length||(yield h)}}else if(w.value=t[r-1],i=g,e[r][o]===">")i=m,n=$;else if(e[r][o]==="/"){let p=a.pop();a.length||(yield p)}}}else if(n===$){let d=a[a.length-1];if(e[r][o+1]==="/"&&e[r][o+2]==="/"){f&&(d.children.push(f),f=""),o+=3;let w=a.pop();a.length||(l=L,n=m,yield w)}else e[r][o]==="<"&&!e[r][o+1]&&typeof t[r]=="function"?(f&&(d.children.push(f),f=""),n=S,i=g,u.fn=t[r],a.push(u)):e[r][o+1]?f+=e[r][o]:f&&t.length>r&&(f+=e[r][o],d.children.push(f),d.children.push(t[r]))}else if(c===">")n=$;else if(c===" ")n=S,i=g;else if(c==="/"&&e[r][o+1]===">"){l=L,n=m;let d=a.pop();a.length||(f="",yield d),o++}else f+=c;else f+=c}f&&n!==$&&(yield f),a.length>1&&u.fn&&a[a.length-2].children.push(u),t.length>r&&l!==b&&(yield t[r])}}}function O({task:e,children:t}){return{task:e,template:t.find(l=>typeof l=="function")}}O.kind=N;var v=(e,t)=>e?t():"";function W(e){return typeof e.getReader=="function"}async function*Y(e){let t=e.getReader(),l=new TextDecoder("utf-8");try{for(;;){let{done:n,value:i}=await t.read();if(n)return;yield l.decode(i)}}finally{t.releaseLock()}}async function*I(e){if(W(e))for await(let t of Y(e))yield t;else for await(let t of e)yield t}async function*C(e,t){if(typeof e=="string")yield e;else if(Array.isArray(e))yield*P(e,t);else if(typeof e.then=="function"){let l=await e;yield*C(l,t)}else if(e instanceof Response&&e.body)yield*I(e.body);else if(e[Symbol.asyncIterator]||e[Symbol.iterator])yield*P(e,t);else if(e?.fn?.kind===N){let{task:l,template:n}=e.fn({...e.properties.reduce((a,r)=>({...a,[r.name]:r.value}),{}),children:e.children}),i=t.length;t.push(l().then(a=>({id:i,template:n({state:"success",data:a})})).catch(a=>({id:i,template:n({state:"error",error:a})}))),yield*P(s`<pending-task style="display: contents;" data-id="${i.toString()}">${n({state:"pending"})}</pending-task>`,t)}else e.kind===T?yield*P(await e.fn({...e.properties.reduce((l,n)=>({...l,[n.name]:n.value}),{}),children:e.children}),t):yield e.toString()}async function*P(e,t){for await(let l of e)yield*C(l,t)}var A;async function*x(e){let t=[];for(yield*P(e,t),t=t.map(l=>{let n=l.then(i=>(t.splice(t.indexOf(n),1),i));return n});t.length>0;){let l=await Promise.race(t),{id:n,template:i}=l;yield*x(s(A||(A=R([`
      <template data-id="`,'">',`</template>
      <script>
        {
          let toReplace = document.querySelector('pending-task[data-id="`,`"]');
          const template = document.querySelector('template[data-id="`,`"]').content.cloneNode(true);
          toReplace.replaceWith(template);
        }
      <\/script>
    `])),n.toString(),i,n.toString(),n.toString()))}}var E=class{constructor({routes:t,fallback:l,baseHref:n=""}){this.fallback={render:l,params:{}},this.routes=t.map(i=>({...i,urlPattern:new URLPattern({pathname:i.path,baseURL:`${self.location.origin}${n}`,search:"*",hash:"*"})}))}async handleRequest(t){let l=new URL(t.url),n;for(let a of this.routes){let r=a.urlPattern.exec(l);if(r){n={render:a.render,params:r?.pathname?.groups??{}};break}}let i=n?.render??this?.fallback?.render;if(i){let a=Object.fromEntries(new URLSearchParams(t.url.search)),r=x(i({query:a,params:n?.params,request:t})),f=new TextEncoder,u=new ReadableStream({async pull(o){let{value:c,done:d}=await r.next();d?o.close():o.enqueue(f.encode(c))}});return new Response(u,{status:200,headers:{"Content-Type":"text/html","Transfer-Encoding":"chunked"}})}}};var _;function y({children:e,title:t,styles:l=[]}){return s(_||(_=R([`
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
        <meta name="Description" content="swtl demo">
        <title>`,`</title>
        <style>
          img {
            max-width: 500px;
          }
        </style>
        `,`
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
        `,`
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
  `])),t??"",l,e)}async function*B(){await new Promise(e=>setTimeout(e,1e3)),yield*s`<li>1</li>`,await new Promise(e=>setTimeout(e,1e3)),yield*s`<li>2</li>`,await new Promise(e=>setTimeout(e,1e3)),yield*s`<li>3</li>`,await new Promise(e=>setTimeout(e,1e3)),yield*s`<li>4</li>`,await new Promise(e=>setTimeout(e,1e3)),yield*s`<li>5</li>`}function*U(){let e=0;for(;e<2e4;)yield*s`<li>${e++}</li>`}var H=new E({routes:[{path:"/",render:({params:e,query:t,request:l})=>s`
        <${y} title="swtl">
          Home
        <//>
      `},{path:"/out-of-order",render:({params:e,query:t,request:l})=>s`
        <${y} title="out of order">
          <ul>
            <li>
              <${O} task=${()=>new Promise(n=>setTimeout(()=>n({foo:"foo"}),3e3))}>
                ${({state:n,data:i})=>s`
                  ${v(n==="pending",()=>s`[PENDING] slow`)}
                  ${v(n==="success",()=>s`[RESOLVED] slow ${i.foo}`)}
                `}
              <//>
            </li>
            <li>
              <${O} task=${()=>new Promise(n=>setTimeout(()=>n({bar:"bar"}),1500))}>
                ${({state:n,data:i})=>s`
                  ${v(n==="pending",()=>s`[PENDING] fast`)}
                  ${v(n==="success",()=>s`[RESOLVED] fast ${i.bar}`)}
                `}
              <//>
            </li>
          </ul>
        <//>
      `},{path:"/blog/:id",render:({params:e,query:t,request:l})=>s`
        <${y} title=${`blog ${e.id}`}>
          ${fetch(`./blogs/${e.id}.html`)}
        <//>
      `},{path:"/generator",render:({params:e,query:t,request:l})=>s`<${y} title="generator"><ul>${B()}</ul><//>`},{path:"/really-long-list",render:({params:e,query:t,request:l})=>s`<${y} title="really long list"><ul>${U()}</ul><//>`}],fallback:()=>s`<${y} title="not found">Not found!<//>`});self.addEventListener("install",()=>{self.skipWaiting()});self.addEventListener("activate",e=>{e.waitUntil(clients.claim().then(()=>{self.clients.matchAll().then(t=>{t.forEach(l=>l.postMessage({type:"SW_ACTIVATED"}))})}))});self.addEventListener("fetch",e=>{e.request.mode==="navigate"&&e.respondWith(H.handleRequest(e.request))});})();
//# sourceMappingURL=sw.js.map
