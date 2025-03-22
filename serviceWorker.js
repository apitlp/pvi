const cacheName = "v1";
const cacheAssets = [
    "students.html",
    "messages.html",
    "profile.html",
    "dashboard.html",
    "tasks.html",
    "/styles/index.css",
    "/styles/header.css",
    "/styles/side-menu.css",
    "/styles/students.css",
    "/scripts/index.js",
    "/scripts/header.js",
    "/scripts/sideMenu.js",
    "/scripts/students.js"
];

self.addEventListener("install", (e) => {
    console.log("Service worker: Installed");

    // e.waitUntil(
    //     caches
    //         .open(cacheName)
    //         .then(cache => {
    //             console.log("Service worker: Caching Files");
    //             cache.addAll(cacheAssets);
    //         })
    //         .then(() => self.skipWaiting())
    // )
})

self.addEventListener("activate", (e) => {
    console.log("Service worker: Activated")

    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cache => cache !== cacheName)
                        .map(cache => caches.delete(cache))
                );
            })
    )
})

self.addEventListener("fetch", (e) => {
    console.log("Service worker: Fetching");
    e.respondWith(
        fetch(e.request)
            .then(res => {
                const resClone = res.clone();

                caches
                    .open(cacheName)
                    .then(cache => {
                        cache.put(e.request, resClone);
                    });
                
                return res;
            })
            .catch((err) => caches.match(e.request).then(res => res))
    );
})