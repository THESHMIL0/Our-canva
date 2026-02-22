// public/sw.js
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed - App is ready for installation!');
});

self.addEventListener('fetch', (e) => {
    // This allows the app to fetch data normally
});
