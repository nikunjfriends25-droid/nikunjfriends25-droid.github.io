/* Analytics for nikunjjambu.in.
   - Cloudflare Web Analytics: cookieless, loads for everyone.
   - Google Analytics 4: loads only after the visitor clicks Accept; the choice is remembered on this device. */
(function () {
  var GA = 'G-8Y8T9G3RH2';
  var CF = '1897f352c301416c8e21a79ffb97cf0b';
  var KEY = 'nj_analytics';

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  function loadCloudflare() {
    var s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: CF }));
    document.head.appendChild(s);
  }

  function loadGoogle() {
    if (window.__njGa) return;
    window.__njGa = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
    document.head.appendChild(s);
    window.gtag('js', new Date());
    window.gtag('config', GA, { anonymize_ip: true });
  }

  function banner() {
    if (document.getElementById('nj-consent')) return;
    var b = document.createElement('div');
    b.id = 'nj-consent';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Analytics choice');
    b.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;max-width:640px;margin:0 auto;z-index:2000;' +
      'background:#faf7ec;color:#1a1c19;border:1px solid rgba(26,28,25,.45);box-shadow:0 10px 30px rgba(0,0,0,.22);' +
      'padding:14px 16px;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;' +
      'font:15px/1.5 "Space Grotesk",system-ui,sans-serif';
    var btn = 'cursor:pointer;font:600 14px "Space Grotesk",system-ui,sans-serif;padding:9px 16px;border:1px solid #1a1c19;';
    b.innerHTML = '<span style="flex:1 1 260px">I use Google Analytics to count visits. It sets cookies only if you accept. ' +
      '<a href="/privacy.html" style="color:#7a2f2f">Privacy</a></span>' +
      '<span style="display:flex;gap:8px">' +
      '<button type="button" data-a="no" style="' + btn + 'background:transparent;color:#1a1c19">Decline</button>' +
      '<button type="button" data-a="yes" style="' + btn + 'background:#1a1c19;color:#faf7ec">Accept</button></span>';
    b.addEventListener('click', function (e) {
      var a = e.target && e.target.getAttribute && e.target.getAttribute('data-a');
      if (!a) return;
      write(a);
      if (a === 'yes') loadGoogle();
      b.remove();
    });
    document.body.appendChild(b);
  }

  // used by the "Analytics choices" button on the privacy page
  window.njAnalyticsChoices = function () { clear(); banner(); };

  loadCloudflare();
  var saved = read();
  if (saved === 'yes') loadGoogle();
  else if (saved !== 'no') {
    if (document.body) banner();
    else document.addEventListener('DOMContentLoaded', banner);
  }
})();
