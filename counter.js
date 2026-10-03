/* €A220 — Counter for AviaTrust ecosystem */
(function(){
  var START_VISITORS = 2030;
  var START_HOLDERS  = 2;
  var START_CLIENTS  = 0;
  var RATE_VISITORS  = 7;
  var RATE_HOLDERS   = 0.05;
  var RATE_CLIENTS   = 0.025;

  var KEY = 'a220_start_time';

  var startTime = parseInt(localStorage.getItem(KEY));
  if (!startTime || isNaN(startTime)) {
    startTime = Date.now();
    try { localStorage.setItem(KEY, String(startTime)); } catch(e){}
  }

  function tick(){
    var elapsed = Math.floor((Date.now() - startTime) / 1000);

    var visitors = START_VISITORS + elapsed * RATE_VISITORS;
    var holders  = START_HOLDERS + Math.floor(elapsed * RATE_HOLDERS);
    var clients  = START_CLIENTS + Math.floor(elapsed * RATE_CLIENTS);

    var vEls = document.querySelectorAll('.counter-visitors');
    for (var i = 0; i < vEls.length; i++) vEls[i].textContent = visitors.toLocaleString();

    var hEls = document.querySelectorAll('.counter-holders');
    for (var j = 0; j < hEls.length; j++) hEls[j].textContent = holders.toLocaleString();

    var cEls = document.querySelectorAll('.counter-clients');
    for (var k = 0; k < cEls.length; k++) cEls[k].textContent = clients.toLocaleString();

    var ts = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    var tEls = document.querySelectorAll('.counter-visitor-time');
    for (var m = 0; m < tEls.length; m++) tEls[m].textContent = 'Updated: ' + ts;
  }

  tick();
  setInterval(tick, 1000);
})();
