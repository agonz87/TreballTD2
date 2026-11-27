(function(){var R=window.RUTES;if(!R||!window.L)return;var COL=['#e6007e','#6a1b9a','#1565c0','#0b7a75','#ef6c00','#2e7d32','#c0392b','#5d4037','#455a64'];
var map=L.map('map',{scrollWheelZoom:false}).setView([42.33,8.95],10);L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',{maxZoom:15,attribution:'© OpenStreetMap, SRTM · OpenTopoMap'}).addTo(map);
var gA=L.layerGroup(),gB=L.layerGroup(),gC=L.layerGroup(),gT=L.layerGroup(),gW=L.layerGroup(),dl={};
function reg(k,l){(dl[k]=dl[k]||[]).push(l);}
Object.keys(R.A).forEach(function(k){var l=L.polyline(R.A[k],{color:COL[k-1],weight:5,opacity:.95}).bindTooltip('Dia '+k+' · Pla A').addTo(gA);reg(k,l);});
Object.keys(R.B).forEach(function(k){var l=L.polyline(R.B[k],{color:'#e07b24',weight:4,dashArray:'9 6'}).bindTooltip('Dia '+k+' · Pla B').addTo(gB);reg(k,l);});
Object.keys(R.C).forEach(function(k){R.C[k].forEach(function(s){var t=s[0]==='taxi';var l=L.polyline(s[1],t?{color:'#555',weight:3,dashArray:'4 8'}:{color:'#c0392b',weight:4,dashArray:'2 7'}).bindTooltip('Dia '+k+' · Pla C · '+(t?'taxi':'a peu')).addTo(t?gT:gC);reg(k,l);});});
R.W.forEach(function(w){L.circleMarker([w[1],w[2]],{radius:5,color:'#fff',weight:1.5,fillColor:'#0b5a5e',fillOpacity:1}).bindTooltip(w[0]+' · '+w[3]+' m').addTo(gW);});
[gA,gB,gC,gT,gW].forEach(function(g){g.addTo(map);});
var ids={lA:gA,lB:gB,lC:gC,lT:gT,lW:gW};Object.keys(ids).forEach(function(i){var e=document.getElementById(i);if(e)e.addEventListener('change',function(){e.checked?ids[i].addTo(map):map.removeLayer(ids[i]);});});
var ds=document.getElementById('dsel');var all=document.createElement('button');all.textContent='Tota la ruta';all.onclick=function(){map.fitBounds(L.featureGroup(gA.getLayers()).getBounds());};ds.appendChild(all);
for(var k=1;k<=9;k++)(function(k){var b=document.createElement('button');b.textContent='Dia '+k;b.onclick=function(){var g=L.featureGroup(dl[k]);map.fitBounds(g.getBounds(),{padding:[30,30]});};ds.appendChild(b);})(k);
map.fitBounds(L.featureGroup(gA.getLayers()).getBounds());
window.addEventListener('load',function(){map.invalidateSize();map.fitBounds(L.featureGroup(gA.getLayers()).getBounds());});map.on('focus',function(){map.scrollWheelZoom.enable();});map.on('blur',function(){map.scrollWheelZoom.disable();});})();