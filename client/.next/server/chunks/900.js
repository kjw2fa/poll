"use strict";exports.id=900,exports.ids=[900],exports.modules={13900:(a,b,c)=>{function d(a){return JSON.stringify(a).replace("<","\\u003c").replace(">","\\u003e").replace("&","\\u0026").replace("'","\\u0027")}c.d(b,{ApolloServerPluginLandingPageLocalDefault:()=>h,ApolloServerPluginLandingPageProductionDefault:()=>i});var e=c(76905),f=c(36055),g=c(42364);function h(a={}){let{version:b,__internal_apolloStudioEnv__:c,...d}={embed:!0,...a};return k(b,{isProd:!1,apolloStudioEnv:c,...d})}function i(a={}){let{version:b,__internal_apolloStudioEnv__:c,...d}=a;return k(b,{isProd:!0,apolloStudioEnv:c,...d})}let j=(a,b,c,d)=>{let e=JSON.stringify(encodeURIComponent(JSON.stringify(b)));return`
 <div class="fallback">
  <h1>Welcome to Apollo Server</h1>
  <p>The full landing page cannot be loaded; it appears that you might be offline.</p>
</div>
<script nonce="${d}">window.landingPage = ${e};</script>
<script nonce="${d}" src="https://apollo-server-landing-page.cdn.apollographql.com/${encodeURIComponent(a)}/static/js/main.js?runtime=${c}"></script>`};function k(a,b){let c=a??"v3",h=a??"v2",i=a??"_latest",k=`@apollo/server@${e.T}`;return{__internal_installed_implicitly__:!1,serverWillStart:async()=>({async renderLandingPage(){let a=encodeURIComponent(i);return{html:async function(){let e=(0,f.createHash)("sha256").update((0,g.A)()).digest("hex"),l=`script-src 'self' 'nonce-${e}' https://apollo-server-landing-page.cdn.apollographql.com https://embeddable-sandbox.cdn.apollographql.com https://embeddable-explorer.cdn.apollographql.com`,m=`style-src 'nonce-${e}' https://apollo-server-landing-page.cdn.apollographql.com https://embeddable-sandbox.cdn.apollographql.com https://embeddable-explorer.cdn.apollographql.com https://fonts.googleapis.com`;return`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="${l}; ${m}; img-src https://apollo-server-landing-page.cdn.apollographql.com; manifest-src https://apollo-server-landing-page.cdn.apollographql.com; frame-src https://explorer.embed.apollographql.com https://sandbox.embed.apollographql.com https://embed.apollo.local:3000" />
    <link
      rel="icon"
      href="https://apollo-server-landing-page.cdn.apollographql.com/${a}/assets/favicon.png"
    />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap"
      rel="stylesheet"
    />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Apollo server landing page" />
    <link
      rel="apple-touch-icon"
      href="https://apollo-server-landing-page.cdn.apollographql.com/${a}/assets/favicon.png"
    />
    <link
      rel="manifest"
      href="https://apollo-server-landing-page.cdn.apollographql.com/${a}/manifest.json"
    />
    <title>Apollo Server</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="react-root">
      <style nonce=${e}>
        body {
          margin: 0;
          overflow-x: hidden;
          overflow-y: hidden;
        }
        .fallback {
          opacity: 0;
          animation: fadeIn 1s 1s;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
          padding: 1em;
        }
        @keyframes fadeIn {
          0% {opacity:0;}
          100% {opacity:1; }
        }
      </style>
    ${b.embed?"graphRef"in b&&b.graphRef?((a,b,c,e)=>{let f={displayOptions:{},persistExplorerState:!1,runTelemetry:!0,..."boolean"==typeof b.embed?{}:b.embed},g={graphRef:b.graphRef,target:"#embeddableExplorer",initialState:{..."document"in b||"headers"in b||"variables"in b?{document:b.document,headers:b.headers,variables:b.variables}:{},..."collectionId"in b?{collectionId:b.collectionId,operationId:b.operationId}:{},displayOptions:{...f.displayOptions}},persistExplorerState:f.persistExplorerState,includeCookies:b.includeCookies,runtime:c,runTelemetry:f.runTelemetry,allowDynamicStyles:!1};return`
<div class="fallback">
  <h1>Welcome to Apollo Server</h1>
  <p>Apollo Explorer cannot be loaded; it appears that you might be offline.</p>
</div>
<style nonce=${e}>
  iframe {
    background-color: white;
    height: 100%;
    width: 100%;
    border: none;
  }
  #embeddableExplorer {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
  }
</style>
<div id="embeddableExplorer"></div>
<script nonce="${e}" src="https://embeddable-explorer.cdn.apollographql.com/${encodeURIComponent(a)}/embeddable-explorer.umd.production.min.js?runtime=${encodeURIComponent(c)}"></script>
<script nonce="${e}">
  var endpointUrl = window.location.href;
  var embeddedExplorerConfig = ${d(g)};
  new window.EmbeddedExplorer({
    ...embeddedExplorerConfig,
    endpointUrl,
  });
</script>
`})(c,b,k,e):!("graphRef"in b)?((a,b,c,e)=>{let f={runTelemetry:!0,endpointIsEditable:!1,initialState:{},..."boolean"==typeof b.embed?{}:b.embed??{}},g={target:"#embeddableSandbox",initialState:{..."document"in b||"headers"in b||"variables"in b?{document:b.document,variables:b.variables,headers:b.headers}:{},..."collectionId"in b?{collectionId:b.collectionId,operationId:b.operationId}:{},includeCookies:b.includeCookies,...f.initialState},hideCookieToggle:!1,endpointIsEditable:f.endpointIsEditable,runtime:c,runTelemetry:f.runTelemetry,allowDynamicStyles:!1};return`
<div class="fallback">
  <h1>Welcome to Apollo Server</h1>
  <p>Apollo Sandbox cannot be loaded; it appears that you might be offline.</p>
</div>
<style nonce=${e}>
  iframe {
    background-color: white;
    height: 100%;
    width: 100%;
    border: none;
  }
  #embeddableSandbox {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
  }
</style>
<div id="embeddableSandbox"></div>
<script nonce="${e}" src="https://embeddable-sandbox.cdn.apollographql.com/${encodeURIComponent(a)}/embeddable-sandbox.umd.production.min.js?runtime=${encodeURIComponent(c)}"></script>
<script nonce="${e}">
  var initialEndpoint = window.location.href;
  var embeddedSandboxConfig = ${d(g)};
  new window.EmbeddedSandbox(
    {
      ...embeddedSandboxConfig,
      initialEndpoint,
    }
  );
</script>
`})(h,b,k,e):j(i,b,k,e):j(i,b,k,e)}
    </div>
  </body>
</html>
          `}}}})}}},42364:(a,b,c)=>{c.d(b,{A:()=>i});var d=c(55511);let e={randomUUID:d.randomUUID},f=new Uint8Array(256),g=f.length,h=[];for(let a=0;a<256;++a)h.push((a+256).toString(16).slice(1));let i=function(a,b,c){if(e.randomUUID&&!b&&!a)return e.randomUUID();let i=(a=a||{}).random??a.rng?.()??(g>f.length-16&&((0,d.randomFillSync)(f),g=0),f.slice(g,g+=16));if(i.length<16)throw Error("Random bytes length must be >= 16");if(i[6]=15&i[6]|64,i[8]=63&i[8]|128,b){if((c=c||0)<0||c+16>b.length)throw RangeError(`UUID byte range ${c}:${c+15} is out of buffer bounds`);for(let a=0;a<16;++a)b[c+a]=i[a];return b}return function(a,b=0){return(h[a[b+0]]+h[a[b+1]]+h[a[b+2]]+h[a[b+3]]+"-"+h[a[b+4]]+h[a[b+5]]+"-"+h[a[b+6]]+h[a[b+7]]+"-"+h[a[b+8]]+h[a[b+9]]+"-"+h[a[b+10]]+h[a[b+11]]+h[a[b+12]]+h[a[b+13]]+h[a[b+14]]+h[a[b+15]]).toLowerCase()}(i)}},76905:(a,b,c)=>{c.d(b,{T:()=>d});let d="5.0.0"}};