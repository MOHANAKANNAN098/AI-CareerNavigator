// ============================================================
// install-app.js — PWA Install Button + Service Worker
// ============================================================
(function () {
  var deferredPrompt = null;
  var installBtn = null;
  var heroBtn = null;
  var floatingBanner = null;

  // Global PWA Controller
  window.CareerForgePWA = {
    isInstallable: () => !!deferredPrompt,
    triggerPrompt: () => {
      if (!deferredPrompt) return false;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') hideInstallButton();
        deferredPrompt = null;
      });
      return true;
    },
    isStandalone: () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  };

  function init() {
    installBtn = document.getElementById('btn-install-pwa');
    heroBtn = document.getElementById('btn-install-pwa-hero');
    if (installBtn) installBtn.addEventListener('click', () => window.CareerForgePWA.triggerPrompt());
    if (heroBtn) heroBtn.addEventListener('click', () => window.CareerForgePWA.triggerPrompt());
  }

  function showInstallButton() {
    if (installBtn) installBtn.style.display = 'inline-flex';
    if (!floatingBanner && window.innerWidth <= 768 && !window.CareerForgePWA.isStandalone()) {
      floatingBanner = document.createElement('div');
      floatingBanner.id = "pwa-floating-banner";
      floatingBanner.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px; flex:1;">
          <img src="./icons/icon-192.png" style="width:44px; height:44px; border-radius:12px; border:2px solid rgba(255,255,255,0.1);">
          <div style="display:flex; flex-direction:column; line-height:1.2;">
            <strong style="font-size:15px; color:#fff;">CareerForge AI</strong>
            <span style="font-size:12px; color:#94a3b8;">Install our official App</span>
          </div>
        </div>
        <div style="display:flex; gap:12px; align-items:center;">
          <button id="floating-btn-pwa" style="background:linear-gradient(135deg, #3b82f6, #8b5cf6); color:#fff; border:none; padding:10px 20px; border-radius:30px; font-weight:700; font-size:14px; cursor:pointer; box-shadow:0 10px 20px rgba(59,130,246,0.3);">Get App</button>
          <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer; line-height:1; padding:0;">&times;</button>
        </div>
      `;
      floatingBanner.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); width:94%; max-width:420px; background:rgba(15, 23, 42, 0.98); backdrop-filter:blur(15px); padding:16px; border-radius:24px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 25px 50px rgba(0,0,0,0.5); z-index:999999; border:1px solid rgba(255,255,255,0.1); animation: pwaSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);';
      document.body.appendChild(floatingBanner);
      document.getElementById('floating-btn-pwa').addEventListener('click', () => window.CareerForgePWA.triggerPrompt());
    }
  }

  function hideInstallButton() {
    if (installBtn) installBtn.style.display = 'none';
    if (floatingBanner) floatingBanner.remove();
  }

  if (!document.getElementById('pwa-anim-style')) {
    var style = document.createElement('style');
    style.id = 'pwa-anim-style';
    style.innerHTML = '@keyframes pwaSlideUp { from { transform: translate(-50%, 120%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }';
    document.head.appendChild(style);
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    hideInstallButton();
    deferredPrompt = null;
  });

  // iOS Tip
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIOS && !window.CareerForgePWA.isStandalone() && !sessionStorage.getItem('ios_tip_shown')) {
    sessionStorage.setItem('ios_tip_shown', '1');
    const tip = document.createElement('div');
    tip.innerHTML = `📱 Tap <b>Share</b> then <b>Add to Home Screen</b> <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer;margin-left:8px;">✕</button>`;
    tip.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:16px 24px;border-radius:20px;display:flex;align-items:center;gap:12px;font-size:14px;z-index:999999;box-shadow:0 20px 40px rgba(0,0,0,0.4);border:1px solid rgba(59,130,246,0.3);width:90vw;';
    document.body.appendChild(tip);
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
