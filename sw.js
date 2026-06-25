/* 별 영어 — 오프라인 캐싱 + 자동 업데이트 서비스워커 */
/* HTML은 '네트워크 우선'이라 index.html을 고쳐 배포하면 다음 실행 때 자동 반영됩니다.
   그림(img/*.svg)·단어데이터·아이콘은 '캐시 우선'이라, 한 번 본 그림은 오프라인에서도 떠요.
   ⚠️ data/words.js 를 바꾸거나 ASSETS 목록을 바꾸면 아래 버전 숫자(v1→v2)를 올려야
      캐시가 갱신됩니다. (index.html 만 고칠 땐 올릴 필요 없음) */
const CACHE = "byeolenglish-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./data/words.js",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const req = e.request;
  const isHTML = req.mode === "navigation" || (req.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    // 화면(HTML)은 네트워크 우선: 온라인이면 항상 최신, 실패(오프라인)하면 캐시
    e.respondWith(
      fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put("./index.html", copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // 그 외(그림·단어데이터·아이콘 등)는 캐시 우선 + 처음 받으면 캐시에 저장(런타임 캐시)
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return resp;
      }).catch(() => cached);
    })
  );
});
