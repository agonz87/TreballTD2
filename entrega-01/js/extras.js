(function () {
  function lang() { var l = 'ca'; try { l = localStorage.getItem('tc_lang') || l; } catch (e) { } return window.T[l] ? l : 'ca'; }
  var cur = lang();
  function tr(k) { return (window.T[cur] && window.T[cur][k]) || window.T.ca[k] || k; }
  document.addEventListener('DOMContentLoaded', function () {
    var wa = document.createElement('a');
    wa.id = 'wa'; wa.href = 'https://wa.me/34600000000'; wa.target = '_blank'; wa.rel = 'noopener'; wa.setAttribute('aria-label', 'WhatsApp');
    wa.innerHTML = '<svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-2c1.8 1 3.800 1.500 5.900 1.500 6.900 0 12.500-5.600 12.500-12.500S22.900 3 16 3zm0 22.900c-1.900 0-3.700-.5-5.300-1.500l-.4-.2-4.400 1.200 1.200-4.300-.3-.4a10.400 10.400 0 1 1 9.200 5.200zm5.700-7.800c-.3-.2-1.900-.9-2.200-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7.100a8.500 8.500 0 0 1-4.200-3.700c-.3-.6.300-.5.900-1.700.1-.2 0-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.100-.9.400-.3.300-1.200 1.200-1.200 2.800s1.200 3.300 1.400 3.500c.2.200 2.400 3.700 5.800 5.100 2.100.9 2.900 1 3.900.8.600-.1 1.900-.8 2.200-1.500.3-.8.300-1.400.2-1.500l-.6-.4z"/></svg>';
    document.body.appendChild(wa);
    var b = document.createElement('button'); b.id = 'cb'; b.setAttribute('data-i18n', 'cb_t'); b.textContent = tr('cb_t'); document.body.appendChild(b);
    var p = document.createElement('div'); p.id = 'cp';
    p.innerHTML = '<div class="ch"><span data-i18n="cb_h"></span><button aria-label="x">×</button></div><div class="cm"><div class="bub" data-i18n="cb_hi"></div></div><div class="qs"></div><a class="cl" href="mailto:info@trescamins.cat" data-i18n="cb_mail"></a>';
    document.body.appendChild(p);
    function fill() {
      cur = lang();
      p.querySelectorAll('[data-i18n]').forEach(function (e) { e.textContent = tr(e.getAttribute('data-i18n')); });
      b.textContent = tr('cb_t');
      var q = tr('cb_q').split('|'), s = p.querySelector('.qs'); s.innerHTML = '';
      for (var i = 0; i < q.length; i += 2) (function (qq, aa) {
        var x = document.createElement('button'); x.textContent = qq;
        x.onclick = function () { var m = p.querySelector('.cm'); m.insertAdjacentHTML('beforeend', '<div class="bub me">' + qq + '</div><div class="bub">' + aa + '</div>'); m.scrollTop = m.scrollHeight; };
        s.appendChild(x);
      })(q[i], q[i + 1]);
    }
    fill();
    b.onclick = function () { p.classList.toggle('open'); };
    p.querySelector('.ch button').onclick = function () { p.classList.remove('open'); };
    document.querySelectorAll('.lang button').forEach(function (x) { x.addEventListener('click', function () { setTimeout(function () { var m = p.querySelector('.cm'); m.innerHTML = '<div class="bub" data-i18n="cb_hi"></div>'; fill(); }, 0); }); });
    var nl = document.getElementById('nl');
    if (nl) {
      var ph = document.getElementById('nle');
      var setph = function () { ph.placeholder = tr('nl_ph'); }; setph();
      document.querySelectorAll('.lang button').forEach(function (x) { x.addEventListener('click', function () { setTimeout(function () { cur = lang(); setph(); }, 0); }); });
      nl.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var url = 'mailto:albert.gongom@gmail.com?subject=' + encodeURIComponent('Alta al butlletí Trescamins') + '&body=' + encodeURIComponent('Vull rebre el butlletí de Trescamins.\nCorreu: ' + ph.value);
        var ok = document.getElementById('nlok'); ok.style.display = 'block'; ok.textContent = tr('nl_ok');
        window.location.href = url;
      });
    }
  });
})();
