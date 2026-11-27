// 한 번 열어 둔 뒤에는 인터넷 없이도 열리게 한다. 학생 자료는 여기 담지 않는다(프로그램 파일만).
const C='suhaeng-reason-v8';
const FILES=['./','./index.html','./vendor/pdf.min.js','./vendor/pdf.worker.min.js','./vendor/pdf-lib.min.js','./manifest.webmanifest','./icon-180.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r;}).catch(()=>null);
    return hit||(await net)||new Response('오프라인',{status:503});
  }));
});
