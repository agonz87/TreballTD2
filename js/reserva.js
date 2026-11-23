(function () {
  var TT = window.T, step = 1, d = {};
  function L() { var l = 'ca'; try { l = localStorage.getItem('tc_lang') || l; } catch (e) { } return TT[l] ? l : 'ca'; }
  function tr(k) { return (TT[L()] && TT[L()][k]) || TT.ca[k] || k; }
  var $ = function (s) { return document.querySelector(s); };
  function eur(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; }
  function show(n) {
    step = n;
    [1, 2, 3, 4].forEach(function (i) { $('#s' + i).hidden = i !== n; });
    render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function render() {
    $('#steps').innerHTML = ['rv_s1', 'rv_s2', 'rv_s3', 'rv_s4'].map(function (k, i) { return '<li class="' + (i + 1 === step ? 'on' : i + 1 < step ? 'ok' : '') + '">' + tr(k) + '</li>'; }).join('');
    var n = +(d.p || 1), tot = 1270 * n, res = Math.round(tot * 0.3), rest = tot - res;
    if (step >= 2) $('#sum').innerHTML = [[tr('rv_trip'), 'GR20 Nord · Calenzana → Vizzavona'], [tr('rv_dates'), tr('rv_dates_v')], [tr('f_ppl'), n], [tr('rv_total'), eur(tot)], [tr('rv_dep'), eur(res)], [tr('rv_rest'), eur(rest) + ' · ' + tr('rv_by')]].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('');
    if (step >= 3) { $('#amt').textContent = tr('rv3_amt') + ' ' + eur(res); pbox(); }
    if (step === 4) $('#r4p').textContent = tr('rv4_p').replace('{n}', d.n || '').replace('{a}', eur(res)).replace('{m}', d.pm === 'tj' ? tr('rv3_tj') : tr('rv3_tr'));
  }
  function pbox() {
    var pm = document.querySelector('input[name=pm]:checked').value; d.pm = pm;
    var n = +(d.p || 1), res = Math.round(1270 * n * 0.3);
    $('#pbox').innerHTML = pm === 'tr'
      ? '<div class="kv"><span>IBAN</span><b>ES00 0000 0000 0000 0000 0000</b></div><div class="kv"><span>' + tr('rv3_ben') + '</span><b>Trescamins</b></div><div class="kv"><span>' + tr('rv3_con') + '</span><b>GR20 2027 + ' + (d.n || '…') + '</b></div><div class="kv"><span>' + tr('rv3_imp') + '</span><b>' + eur(res) + '</b></div><p class="mut">' + tr('rv3_tr_n') + '</p>'
      : '<p>' + tr('rv3_tj_n') + '</p>';
  }
  document.addEventListener('DOMContentLoaded', function () {
    $('#f1').addEventListener('submit', function (e) { e.preventDefault(); d.n = $('#rn').value; d.e = $('#re').value; d.t = $('#rt').value; d.p = $('#rp').value; d.m = $('#rm').value; show(2); });
    $('#acc').addEventListener('change', function () { $('#n2').disabled = !this.checked; });
    $('#n2').onclick = function () { show(3); }; $('#b2').onclick = function () { show(1); };
    $('#b3').onclick = function () { show(2); };
    document.querySelectorAll('input[name=pm]').forEach(function (r) { r.addEventListener('change', pbox); });
    $('#n3').onclick = function () {
      var n = +(d.p || 1), res = Math.round(1270 * n * 0.3);
      var body = ['Reserva GR20 Nord 2027 · Trescamins', '', tr('f_name') + ': ' + d.n, tr('f_email') + ': ' + d.e, tr('f_phone') + ': ' + d.t, tr('f_ppl') + ': ' + d.p, tr('rv_dep') + ': ' + eur(res), tr('rv3_h') + ': ' + (d.pm === 'tj' ? tr('rv3_tj') : tr('rv3_tr')), '', d.m || ''].join('\n');
      show(4);
      window.location.href = 'mailto:albert.gongom@gmail.com?subject=' + encodeURIComponent('Reserva GR20 Nord 2027 · ' + d.n) + '&body=' + encodeURIComponent(body);
    };
    render();
    document.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', function () { setTimeout(function () { render(); }, 0); }); });
  });
})();
