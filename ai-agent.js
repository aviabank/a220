/* Avia — Scripted AI Bot for AviaTrust €A220
   No API, no server, works offline. Pre-set answers + external AI shortcuts. */
(function () {
  'use strict';

  var state = {
    isOpen: false,
    step: 'menu',        // 'menu' | 'topic' | 'answer'
    currentTopic: null,
  };

  function el(id) { return document.getElementById(id); }

  // ============================================================
  // KNOWLEDGE BASE
  // ============================================================
  var KB = {
    'what': {
      title: 'What is €A220?',
      answer: [
        '**€A220 (Airbus A220)** — utility token of the AviaTrust ecosystem on Solana.',
        '',
        'Airbus A220 — the newest European narrow-body:',
        '· 1,000+ orders worldwide',
        '· AirAsia placed an order for 150 aircraft',
        '· 100-160 seats, 6,700 km range',
        '· 25% lower fuel burn',
        '',
        'The token represents the "New Mass Asset" of AviaTrust — part of a 10-token ecosystem covering 6 currencies.',
        '',
        '📄 Contract: `9e4d52thV9Tk5gSByJBMyzopDDdV1iNAmXYSskHEXtEY`',
        '🌊 Pool: Meteora DAMM V2 (€A220/USDT)',
        '⛓ Chain: Solana (Token-2022, 1% transfer fee)'
      ].join('\n')
    },

    'buy': {
      title: 'How do I buy €A220?',
      answer: [
        '**Three ways to buy €A220:**',
        '',
        '**1. Jupiter (best price)**',
        '→ Swap SOL/USDC → €A220',
        '→ https://jup.ag/swap/SOL-9e4d52thV9Tk5gSByJBMyzopDDdV1iNAmXYSskHEXtEY',
        '',
        '**2. OpenSea (card / crypto)**',
        '→ https://opensea.io/token/solana/9e4d52thV9Tk5gSByJBMyzopDDdV1iNAmXYSskHEXtEY',
        '',
        '**3. Meteora pool (direct)**',
        '→ €A220/USDT pool on Meteora DAMM V2',
        '→ https://www.geckoterminal.com/solana/pools/DZHFtfpdecnJGnBVpUHmeAugTYjWHhSYRmfyQbSBqeDj',
        '',
        '💡 Recommend: Jupiter for lowest slippage. OpenSea for card payment.'
      ].join('\n')
    },

    'contract': {
      title: 'Contract & Pool',
      answer: [
        '**€A220 Contract Address (Solana)**',
        '',
        '`9e4d52thV9Tk5gSByJBMyzopDDdV1iNAmXYSskHEXtEY`',
        '',
        '**Meteora Pool (€A220/USDT)**',
        '',
        '`DZHFtfpdecnJGnBVpUHmeAugTYjWHhSYRmfyQbSBqeDj`',
        '',
        '**Verify on:**',
        '· Solscan: https://solscan.io/token/9e4d52thV9Tk5gSByJBMyzopDDdV1iNAmXYSskHEXtEY',
        '· GeckoTerminal: https://www.geckoterminal.com/solana/pools/DZHFtfpdecnJGnBVpUHmeAugTYjWHhSYRmfyQbSBqeDj',
        '',
        '⚠️ Always verify contract before buying. Never trust links from unknown sources.'
      ].join('\n')
    },

    'price': {
      title: 'Price & Target',
      answer: [
        '**€A220 Price Information**',
        '',
        '· Launch price: **€0.01**',
        '· Community target: **×100 → €1.00**',
        '· Current price: check Jupiter or GeckoTerminal live',
        '',
        '**Live price:**',
        '· Jupiter: https://jup.ag/swap/SOL-9e4d52thV9Tk5gSByJBMyzopDDdV1iNAmXYSskHEXtEY',
        '· GeckoTerminal: https://www.geckoterminal.com/solana/pools/DZHFtfpdecnJGnBVpUHmeAugTYjWHhSYRmfyQbSBqeDj',
        '',
        '⚠️ The ×100 is a **community-stated target**, not a promise. Crypto is volatile. DYOR.'
      ].join('\n')
    },

    'ecosystem': {
      title: 'What is AviaTrust?',
      answer: [
        '**AviaTrust — aircraft tokenization ecosystem on Solana.**',
        '',
        '**10 aircraft tokens across 6 currencies:**',
        '',
        '· **$B787** — Boeing 787 (USD) — Proven Asset',
        '· **€A350** — Airbus A350 (EUR) — Innovation Asset',
        '· **¥C929** — COMAC C929 (CNY) — Horizon Asset',
        '· **€A220** — Airbus A220 (EUR) — New Mass Asset',
        '· **R$E195** — Embraer E195-E2 (BRL) — Efficiency Asset',
        '· **$737MAX10** — Boeing 737 MAX 10 (USD)',
        '· **$F22** — Lockheed F-22 (USD)',
        '· **$FAXX** — Boeing F/A-XX (USD)',
        '· **C$CRJ900** — Bombardier CRJ900 (CAD)',
        '· **₽IL96** — Ilyushin Il-96 (RUB) — Frozen until 2030',
        '',
        '**Use cases:** aircraft sales, leasing, 5,000+ parts, payment rails (SWIFT, SEPA, CIPS, UPI, PIX).',
        '',
        'Built on Solana for speed and low fees.'
      ].join('\n')
    },

    'risk': {
      title: 'Is €A220 risky?',
      answer: [
        '**Honest answer: YES.**',
        '',
        'Every crypto token carries risk. €A220 is no exception.',
        '',
        '**Known risks:**',
        '· Price volatility — crypto can drop 90%+ quickly',
        '· Liquidity risk — early-stage tokens have low volume',
        '· Regulatory risk — crypto rules vary by country',
        '· Smart contract risk — even audited code can have bugs',
        '',
        '**What we do to reduce risk:**',
        '· Mint Authority disabled (no new tokens)',
        '· Freeze Authority disabled (cannot freeze your wallet)',
        '· Utility token of a real ecosystem (AviaTrust)',
        '· Real-world facts: 1,000+ A220 orders, AirAsia 150',
        '',
        '⚠️ **This is not financial advice.** Only invest what you can afford to lose. Always verify the contract before buying.'
      ].join('\n')
    },

    'transfer fee': {
      title: 'Transfer Fee (1%)',
      answer: [
        '**€A220 uses Token-2022 standard with a 1% transfer fee.**',
        '',
        '**What this means:**',
        '· Every transfer of €A220 → **1% fee** is deducted',
        '· Max fee per transfer: **5,000 tokens**',
        '· The fee goes to the protocol treasury (ecosystem development)',
        '',
        '**Example:**',
        '· You send 1,000 €A220 → recipient receives 990 €A220',
        '· You send 1,000,000 €A220 → fee capped at 5,000, recipient gets 995,000',
        '',
        'This is a feature of Token-2022, not a bug. It funds long-term ecosystem growth.',
        '',
        '💡 Not all DEXs support Token-2022 fees — Jupiter and Meteora handle it correctly.'
      ].join('\n')
    },

    'supply': {
      title: 'Total Supply',
      answer: [
        '**€A220 Total Supply**',
        '',
        '· On-chain supply: varies by source (OpenSea may show FDV in trillions)',
        '· Initial intent: 1,000,000,000 (1B) tokens',
        '',
        '**Where to check real supply:**',
        '· Solscan: https://solscan.io/token/9e4d52thV9Tk5gSByJBMyzopDDdV1iNAmXYSskHEXtEY',
        '· Meteora pool: https://www.geckoterminal.com/solana/pools/DZHFtfpdecnJGnBVpUHmeAugTYjWHhSYRmfyQbSBqeDj',
        '',
        '⚠️ **Important:** If you see huge numbers (like 88.83T FDV), this often reflects low float + FDV calculation. Always check on-chain supply directly.'
      ].join('\n')
    },

    'team': {
      title: 'Team & Community',
      answer: [
        '**AviaTrust Team & Community**',
        '',
        '· X (Twitter): https://x.com/aviatrust',
        '· Telegram: https://t.me/aviatrust',
        '· GitHub: https://github.com/aviabank',
        '· Website: https://aviabank.github.io/a220/',
        '',
        'AviaTrust is a community-driven project focused on real-world aircraft finance.',
        'Join the Telegram for updates and discussion.'
      ].join('\n')
    }
  };

  // ============================================================
  // SUGGESTIONS (quick-buttons)
  // ============================================================
  var SUGGESTIONS = [
    { key: 'what',       label: '✈️ What is €A220?' },
    { key: 'buy',        label: '🛒 How to buy?' },
    { key: 'contract',   label: '📜 Contract & Pool' },
    { key: 'price',      label: '💰 Price & Target' },
    { key: 'ecosystem',  label: '🌍 What is AviaTrust?' },
    { key: 'transfer fee', label: '💸 Transfer Fee (1%)' },
    { key: 'supply',     label: '📊 Total Supply' },
    { key: 'risk',       label: '⚠️ Is it risky?' },
    { key: 'team',       label: '👥 Team & Community' }
  ];

  // ============================================================
  // BUILD UI
  // ============================================================
  function createUI() {
    // Floating button
    var btn = document.createElement('button');
    btn.id = 'avia-btn';
    btn.className = 'avia-btn';
    btn.setAttribute('aria-label', 'Open Avia AI assistant');
    btn.innerHTML = '<span class="avia-btn-icon">✈</span><span class="avia-btn-label">Avia</span>';
    document.body.appendChild(btn);

    // Chat window
    var win = document.createElement('div');
    win.id = 'avia-window';
    win.className = 'avia-window';
    win.innerHTML = [
      '<div class="avia-header">',
      '  <div class="avia-header-left">',
      '    <img src="a220_logo.png" alt="Avia" class="avia-avatar" onerror="this.style.display=\'none\'" />',
      '    <div>',
      '      <div class="avia-name">Avia</div>',
      '      <div class="avia-status">AI assistant · AviaTrust</div>',
      '    </div>',
      '  </div>',
      '  <button class="avia-close" id="avia-close" aria-label="Close">×</button>',
      '</div>',
      '<div class="avia-messages" id="avia-messages"></div>',
      '<div class="avia-suggestions" id="avia-suggestions"></div>',
      '<div class="avia-external">',
      '  <a href="https://chat.openai.com/" target="_blank" rel="noopener">🤖 ChatGPT</a>',
      '  <a href="https://claude.ai/new" target="_blank" rel="noopener">🧠 Claude</a>',
      '  <a href="https://t.me/aviatrust" target="_blank" rel="noopener">📱 Telegram</a>',
      '</div>',
      '<div class="avia-footer">Scripted assistant · Not financial advice</div>'
    ].join('');
    document.body.appendChild(win);

    // Bind events
    el('avia-btn').addEventListener('click', toggle);
    el('avia-close').addEventListener('click', toggle);

    // Welcome
    addMessage('agent', 'Hi! I am Avia — assistant for AviaTrust. Pick a topic below or ask me anything about €A220.');

    renderSuggestions();
  }

  function renderSuggestions() {
    var box = el('avia-suggestions');
    if (!box) return;
    box.innerHTML = '';
    SUGGESTIONS.forEach(function (item) {
      var b = document.createElement('button');
      b.className = 'avia-suggestion';
      b.textContent = item.label;
      b.addEventListener('click', function () {
        showAnswer(item.key);
      });
      box.appendChild(b);
    });
  }

  // ============================================================
  // MESSAGE RENDERING
  // ============================================================
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
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
    safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/\n/g, '<br />');
    // clickable URLs
    safe = safe.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    return safe;
  }

  // ============================================================
  // INTERACTION
  // ============================================================
  function showAnswer(key) {
    var item = KB[key];
    if (!item) {
      addMessage('agent', 'Sorry, I don\'t have info on that yet. Try another topic or reach us on Telegram.');
      return;
    }
    addMessage('user', item.title);
    // small delay for realism
    setTimeout(function () {
      addMessage('agent', item.answer);
    }, 250);
  }

  function toggle() {
    state.isOpen = !state.isOpen;
    var win = el('avia-window');
    var btn = el('avia-btn');
    if (!win || !btn) return;
    if (state.isOpen) {
      win.classList.add('avia-open');
      btn.classList.add('avia-btn-hidden');
    } else {
      win.classList.remove('avia-open');
      btn.classList.remove('avia-btn-hidden');
    }
  }

  // ============================================================
  // BOOT
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createUI);
  } else {
    createUI();
  }
})();
