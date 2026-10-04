/* Avia — AI Agent for AviaTrust €A220 */
(function () {
  'use strict';

  var WORKER_URL = 'https://aviatrust-a220.YOUR-SUBDOMAIN.workers.dev';

  var state = {
    history: [],
    isOpen: false,
    isThinking: false,
  };

  function el(id) { return document.getElementById(id); }

  function createUI() {
    var btn = document.createElement('button');
    btn.id = 'avia-btn';
    btn.className = 'avia-btn';
    btn.setAttribute('aria-label', 'Open Avia AI assistant');
    btn.innerHTML = '<span class="avia-btn-icon">✈</span><span class="avia-btn-label">Avia</span>';
    document.body.appendChild(btn);

    var win = document.createElement('div');
    win.id = 'avia-window';
    win.className = 'avia-window';
    win.innerHTML = [
      '<div class="avia-header">',
      '  <div class="avia-header-left">',
      '    <img src="a220_logo.png" alt="Avia" class="avia-avatar" />',
      '    <div>',
      '      <div class="avia-name">Avia</div>',
      '      <div class="avia-status">AI assistant · AviaTrust</div>',
      '    </div>',
      '  </div>',
      '  <button class="avia-close" id="avia-close" aria-label="Close">×</button>',
      '</div>',
      '<div class="avia-messages" id="avia-messages"></div>',
      '<div class="avia-suggestions" id="avia-suggestions"></div>',
      '<div class="avia-input-row">',
      '  <input id="avia-input" class="avia-input" type="text" placeholder="Ask about €A220..." autocomplete="off" />',
      '  <button id="avia-send" class="avia-send" aria-label="Send">➤</button>',
      '</div>',
      '<div class="avia-footer">Powered by AviaTrust · Not financial advice</div>'
    ].join('');
    document.body.appendChild(win);

    el('avia-btn').addEventListener('click', toggle);
    el('avia-close').addEventListener('click', toggle);
    el('avia-send').addEventListener('click', sendMessage);
    el('avia-input').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage();
    });

    renderSuggestions([
      'What is €A220?',
      'How do I buy €A220?',
      'Show contract & pool',
      'What is AviaTrust?',
      'Is €A220 risky?',
    ]);

    addMessage('agent', 'Hi! I am Avia — AI assistant for AviaTrust. I can help with €A220: price, purchase, contract, ecosystem. What would you like to know?');
  }

  function renderSuggestions(items) {
    var box = el('avia-suggestions');
    if (!box) return;
    box.innerHTML = '';
    items.forEach(function (text) {
      var b = document.createElement('button');
      b.className = 'avia-suggestion';
      b.textContent = text;
      b.addEventListener('click', function () {
        el('avia-input').value = text;
        sendMessage();
      });
      box.appendChild(b);
    });
  }

  function addMessage(role, text) {
    var box = el('avia-messages');
    if (!box) return;

    var msg = document.createElement('div');
    msg.className = 'avia-msg avia-msg-' + role;

    var bubble = document.createElement('div');
    bubble.className = 'avia-bubble';
    bubble.innerHTML = formatText(text);

    msg.appendChild(bubble);
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
  }

  function formatText(text) {
    var safe = String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/\n/g, '<br />');
    return safe;
  }

  function toggle() {
    state.isOpen = !state.isOpen;
    var win = el('avia-window');
    var btn = el('avia-btn');
    if (!win || !btn) return;
    if (state.isOpen) {
      win.classList.add('avia-open');
      btn.classList.add('avia-btn-hidden');
      setTimeout(function () { el('avia-input').focus(); }, 250);
    } else {
      win.classList.remove('avia-open');
      btn.classList.remove('avia-btn-hidden');
    }
  }

  async function sendMessage() {
    if (state.isThinking) return;
    var input = el('avia-input');
    var text = (input.value || '').trim();
    if (!text) return;

    input.value = '';
    addMessage('user', text);

    state.history.push({ role: 'user', content: text });

    state.isThinking = true;
    addMessage('agent', '…');

    try {
      var r = await fetch(WORKER_URL + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: state.history.slice(-8),
        }),
      });

      var data = await r.json();
      var reply = data.reply || 'Sorry, no response.';

      var box = el('avia-messages');
      var last = box.lastChild;
      if (last && last.querySelector && last.querySelector('.avia-bubble').textContent === '…') {
        box.removeChild(last);
      }

      addMessage('agent', reply);
      state.history.push({ role: 'assistant', content: reply });
    } catch (e) {
      var box2 = el('avia-messages');
      var last2 = box2.lastChild;
      if (last2 && last2.querySelector && last2.querySelector('.avia-bubble').textContent === '…') {
        box2.removeChild(last2);
      }
      addMessage('agent', 'Connection error. Please try again.');
    } finally {
      state.isThinking = false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createUI);
  } else {
    createUI();
  }
})();
