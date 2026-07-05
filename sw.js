// DDL Radar Service Worker — 网络优先、缓存兜底：
// 在线时永远拿最新（不会再被缓存坑），离线时整站照常可用
const CACHE = "ddlradar-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data.js",
  "./data.json",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(e.request, { ignoreSearch: e.request.mode === "navigate" });
        // 导航请求兜底到缓存的首页（带任意 query 参数也能命中）
        return hit || (e.request.mode === "navigate" ? caches.match("./index.html") : Response.error());
      })
  );
});
