
const CACHE_NAME = "task-reminder-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/favicon.ico",
];

// Install event: cache aset aplikasi
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: layani aset dari cache jika tersedia
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Activate event: hapus cache lama
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Menangani pesan dari aplikasi utama untuk menampilkan notifikasi
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_NOTIFICATION") {
    const data = event.data;

    // Opsi notifikasi dengan tombol aksi
    const options = {
      body: data.body,
      icon: data.icon || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>',
      badge: data.badge || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔔</text></svg>',
      tag: data.tag || "default-notification",
      renotify: true,
      requireInteraction: true, 
      silent: false, 
      actions: [
        {
          action: "snooze",
          title: "Tunda 5 Menit",
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF9800"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/></svg>',
        },
        {
          action: "complete",
          title: "Tandai Selesai",
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234CAF50"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>',
        },
        {
          action: "dismiss",
          title: "Tutup",
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23F44336"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 13.41 12 19 6.41z"/></svg>',
        },
      ],
      data: data.data || {}, 
    };

    self.registration.showNotification(data.title, options);
  }
});

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const action = event.action;
  const taskId = notification.data && notification.data.taskId;
  notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList && clientList.length > 0) {
        const messagePromises = clientList.map((client) => {
          return client.postMessage({
            type: "STOP_ALARM_IMMEDIATELY",
            taskId: taskId,
            action: action || "dismiss",
          });
        });
        return Promise.all(messagePromises).then(() => {
          return clientList[0].focus();
        });
      }
      return Promise.resolve();
    })
  );
});

// Menangani penutupan notifikasi (user menutup tanpa pilih aksi)
self.addEventListener("notificationclose", (event) => {
  const notification = event.notification;
  const taskId = notification.data && notification.data.taskId;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList && clientList.length > 0) {
        const messagePromises = clientList.map((client) => {
          return client.postMessage({
            type: "STOP_ALARM_IMMEDIATELY",
            taskId: taskId,
            action: "dismiss",
          });
        });
        return Promise.all(messagePromises);
      }
      return Promise.resolve();
    })
  );
});
