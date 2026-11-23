(function () {
  var D = window.GR20 || [], TT = window.T;
  var STG = [
    { n: 'Calenzana → Ortu di u Piobbu', night: 'Ortu di u Piobbu', ty: 'tent' },
    { n: 'Ortu → Bocca di Pisciaghja → Carrozzu', night: 'Carrozzu', ty: 'hut' },
    { n: 'Carrozzu → Spasimata → Asco Stagnu', night: 'Asco Stagnu', ty: 'hut' },
    { n: 'Asco Stagnu → Pointe des Éboulis → Tighjettu', night: 'Tighjettu', ty: 'hut' },
    { n: 'Tighjettu → Ciottulu → Col de Vergio', night: 'Col de Vergio', ty: 'gite' },
    { n: 'Vergio → Bocca a Reta → Manganu', night: 'Manganu', ty: 'hut' },
    { n: 'Manganu → Brèche de Capitello → Petra Piana', night: 'Petra Piana', ty: 'hut' },
    { n: 'Petra Piana → Tolla → L’Onda', night: 'L’Onda', ty: 'hut' },
    { n: 'L’Onda → Punta Muratello → Vizzavona', night: null, ty: null }
  ];
  var lang = 'ca', map, layers = [], markers = [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function put(sel, html) { var e = $(sel); if (e) e.innerHTML = html; }
  function fmtH(min) { var h = Math.floor(min / 60), m = min % 60; return h + ' h' + (m ? ' ' + String(m).padStart(2, '0') : ''); }
  function fmtN(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function tr(k) { return (TT[lang] && TT[lang][k]) || TT.ca[k] || k; }

  function setLang(l) {
    lang = l; try { localStorage.setItem('tc_lang', l); } catch (e) { }
    document.documentElement.lang = l;
    $$('[data-i18n]').forEach(function (el) { el.textContent = tr(el.getAttribute('data-i18n')); });
    $$('[data-list]').forEach(function (el) { el.innerHTML = tr(el.getAttribute('data-list')).split('|').map(function (x) { return '<li>' + x + '</li>'; }).join(''); });
    $$('.lang button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-l') === l); });
    // fitxes
    if (!D) D = []; var tot = D.reduce(function (a, d) { return { km: a.km + d.km, up: a.up + d.up, dn: a.dn + d.dn, min: a.min + d.min }; }, { km: 0, up: 0, dn: 0, min: 0 });
    put('#stats', [[String(tot.km).replace('.', ','), tr('st_km')], [fmtN(tot.up), tr('st_up')], [fmtN(tot.dn), tr('st_dn')], [Math.round(tot.min / 60), tr('st_h')], ['2.607 m', tr('st_max')]].map(function (x) { return '<div><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join(''));
    put('#days', D.map(function (d, i) {
      var s = STG[i];
      var nt = s.night ? s.night + ' · ' + tr('t_' + s.ty) : tr('end');
      return '<div class="day" data-d="' + i + '" style="--c:' + d.color + '"><div class="dn">' + tr('day') + ' ' + d.k + '</div><h4>' + s.n + '</h4><div class="m"><span>' + String(d.km).replace('.', ',') + ' km</span><span>↑ ' + fmtN(d.up) + ' m</span><span>↓ ' + fmtN(d.dn) + ' m</span><span>' + tr('walk') + ' ' + fmtH(d.min) + '</span></div><p>' + tr('s' + d.k) + '</p><div class="ng">' + tr('night') + ': ' + nt + '</div></div>';
    }).join(''));
    $$('.day').forEach(function (el) { el.addEventListener('click', function () { focusDay(+el.getAttribute('data-d')); document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' }); }); });
    var pr = tr('p_rows').split('|'), h = '';
    for (var i = 0; i < pr.length; i += 2) h += '<tr><td>' + pr[i] + '</td><td>' + pr[i + 1] + '</td></tr>';
    put('#prow', h);
    var th = tr('p_canc_th').split('|'), c = tr('p_canc').split('|'), ch = '<tr><th>' + th[0] + '</th><th>' + th[1] + '</th></tr>';
    for (var j = 0; j < c.length; j += 2) ch += '<tr><td>' + c[j] + '</td><td>' + c[j + 1] + '</td></tr>';
    put('#canc', ch);
    put('#badges', tr('g_b').split('|').map(function (x) { return '<span>' + x + '</span>'; }).join(''));
    var f = tr('faq').split('|'), fh = '';
    for (var k = 0; k < f.length; k += 2) fh += '<details><summary>' + f[k] + '</summary><p>' + f[k + 1] + '</p></details>';
    put('#faqs', fh);
    put('#fx', tr('f_exp_o').split('|').map(function (x) { return '<option>' + x + '</option>'; }).join(''));
    if ($('#stats')) document.title = 'GR20 Nord · Trescamins';
    if ($('#prof')) drawProfile(); if (map) drawMarkers();
  }

  function initMap() {
    map = L.map('map', { scrollWheelZoom: false });
    L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 16, attribution: '© OpenStreetMap contributors, SRTM | © OpenTopoMap (CC-BY-SA)' }).addTo(map);
    var all = [];
    D.forEach(function (d, i) {
      var pl = L.polyline(d.line, { color: d.color, weight: 5, opacity: .9 }).addTo(map);
      pl.on('click', function () { focusDay(i); });
      layers.push(pl); all = all.concat(d.line);
    });
    map.fitBounds(L.latLngBounds(all), { padding: [20, 20] });
    drawMarkers();
  }
  function drawMarkers() {
    markers.forEach(function (m) { map.removeLayer(m); }); markers = [];
    markers.push(L.marker([D[0].line[0][0], D[0].line[0][1]], { icon: L.divIcon({ className: '', html: '<div class="mk s">S</div>', iconSize: [24, 24] }) }).addTo(map).bindTooltip('Calenzana'));
    D.forEach(function (d, i) {
      var e = d.line[d.line.length - 1], nm = STG[i].night || 'Vizzavona';
      markers.push(L.marker(e, { icon: L.divIcon({ className: '', html: '<div class="mk' + (i === 8 ? ' s' : '') + '">' + d.k + '</div>', iconSize: [24, 24] }) }).addTo(map).bindTooltip(tr('day') + ' ' + d.k + ' · ' + nm));
    });
  }
  function focusDay(i) {
    layers.forEach(function (l, j) { l.setStyle({ weight: j === i ? 8 : 4, opacity: j === i ? 1 : .35 }); });
    map.fitBounds(layers[i].getBounds(), { padding: [30, 30] });
    $$('.day').forEach(function (el, j) { el.classList.toggle('on', j === i); });
  }
  function drawProfile() {
    var W = 1000, H = 250, L0 = 46, R0 = 10, T0 = 22, B0 = 28, off = 0, pts = [];
    D.forEach(function (d) { d.prof.forEach(function (p) { pts.push([off + p[0], p[1], d.color]); }); off += d.km; });
    var tot = off, X = function (x) { return L0 + x / tot * (W - L0 - R0); }, Y = function (v) { return T0 + (1 - v / 2800) * (H - T0 - B0); };
    var s = '<rect width="1000" height="250" fill="#fff"/><text x="' + (W / 2) + '" y="14" font-size="12" text-anchor="middle" font-weight="700" fill="#0b5a5e">' + tr('prof_t') + '</text>';
    for (var v = 0; v <= 2800; v += 700) s += '<line x1="' + L0 + '" x2="' + (W - R0) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#e3ecec"/><text x="' + (L0 - 6) + '" y="' + (Y(v) + 4) + '" font-size="10" text-anchor="end" fill="#5b6d70">' + v + '</text>';
    var o = 0;
    D.forEach(function (d) {
      var seg = d.prof.map(function (p) { return [X(o + p[0]), Y(p[1])]; });
      var path = 'M' + seg[0][0] + ',' + Y(0) + ' ' + seg.map(function (p) { return 'L' + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + ' L' + seg[seg.length - 1][0] + ',' + Y(0) + 'Z';
      s += '<path d="' + path + '" fill="' + d.color + '" fill-opacity=".28" stroke="' + d.color + '" stroke-width="2"/><text x="' + ((seg[0][0] + seg[seg.length - 1][0]) / 2) + '" y="' + (H - 10) + '" font-size="12" text-anchor="middle" font-weight="800" fill="' + d.color + '">' + d.k + '</text>';
      o += d.km;
    });
    for (var k = 0; k <= tot; k += 20) s += '<text x="' + X(k) + '" y="' + (H - 1) + '" font-size="9" text-anchor="middle" fill="#8a9a9c" opacity="0">' + k + '</text>';
    put('#prof', s);
  }

  document.addEventListener('DOMContentLoaded', function () {
    $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-l')); }); });
    var l0 = 'ca'; try { l0 = localStorage.getItem('tc_lang') || ((navigator.language || 'ca').slice(0, 2)); } catch (e) { }
    if (!TT[l0]) l0 = 'ca';
    setLang(l0); if ($('#map') && window.L) initMap();
    $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { $('#nav').classList.remove('open'); }); });
    if ($('#form')) $('#form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var body = ['Preinscripció GR20 Nord 2027 · Trescamins', '', tr('f_name') + ': ' + $('#fn').value, tr('f_email') + ': ' + $('#fe').value, tr('f_phone') + ': ' + $('#ft').value, tr('f_ppl') + ': ' + $('#fp').value, tr('f_exp') + ': ' + $('#fx').value, '', tr('f_msg') + ':', $('#fm').value, '', '(Idioma: ' + lang + ')'].join('\n');
      var url = 'mailto:albert.gongom@gmail.com?subject=' + encodeURIComponent('Preinscripció GR20 Nord 2027') + '&body=' + encodeURIComponent(body);
      $('#done').style.display = 'block'; $('#done').textContent = tr('f_done');
      window.location.href = url;
    });
  });
})();
