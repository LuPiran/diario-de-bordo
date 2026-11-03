/* Cache do app shell. Com rede, atualiza os arquivos. Sem rede, serve o que já foi salvo. */

const NOME_CACHE = "diario-de-bordo-v1";

const ARQUIVOS = [
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./fonts/geist-latin-wght-normal.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(NOME_CACHE).then((cache) => cache.addAll(ARQUIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(chaves.filter((chave) => chave !== NOME_CACHE).map((chave) => caches.delete(chave)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(responder(event.request));
});

async function responder(request) {
  try {
    const resposta = await fetch(request);
    if (resposta && resposta.ok && resposta.type === "basic") {
      const cache = await caches.open(NOME_CACHE);
      cache.put(request, resposta.clone());
    }
    return resposta;
  } catch {
    const emCache = await caches.match(request);
    if (emCache) return emCache;

    if (request.mode === "navigate") {
      const inicio = await caches.match("./index.html");
      if (inicio) return inicio;
    }

    return new Response("Sem conexão.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
