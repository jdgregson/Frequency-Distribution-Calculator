const appName = 'fdc';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(appName).then(cache =>
      cache.addAll([
        // Base Stardust app files
        'index.html',
        'js/app.js',
        'css/app-theme-dark.css',
        'css/app-theme-light.css',
        'lib/stardust/js/stardust.js',
        'lib/stardust/css/stardust-preload.css',
        'lib/stardust/css/stardust-theme-dark.css',
        'lib/stardust/css/stardust-theme-light.css',
        'art/appicon-32.png',
        'art/appicon-64.png',
        'art/appicon-128.png',
        'art/appicon-192.png',
        'art/appicon-256.png',
        'art/appicon-512.png',
        // App-specific files
        'js/text-frequency-analyzer.js',
      ])
    )
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
