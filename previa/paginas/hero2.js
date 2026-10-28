/* HERO REFEITO — o motor das três direções (14/10/2026).
   Um só dono do tempo: o relógio do vídeo (A e C) ou um relógio próprio (B). Tudo o que
   anima é transform/opacity. O título nasce escondido e entra no sítio certo. */
(() => {
  const h = document.querySelector('.hero2'); if (!h) return;
  const dir = h.dataset.direcao, reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const M = h.dataset.media || '/liz-salvados-proposta/previa/media/hero2/';
  const q = new URLSearchParams(location.search).get('q');
  const vertical = innerWidth / innerHeight < 0.8;
  const px = innerWidth * (devicePixelRatio || 1);
  const ver = q || (vertical ? 'vertical' : px >= 3000 ? '2160' : px >= 2000 ? '1440' : '1080');
  const palco = h.querySelector('.palco');

  /* ── título letra a letra (sem desfoque) ── */
  const titulo = h.querySelector('.cin');
  let i = 0;
  const parte = (no) => [...no.childNodes].forEach((n) => {
    if (n.nodeType === 3) { const f = document.createDocumentFragment(); n.textContent.split(/(\s+)/).forEach((w) => { if (!w) return; if (/^\s+$/.test(w)) { f.append(' '); return; } const p = document.createElement('span'); p.className = 'p'; p.setAttribute('aria-hidden', 'true'); [...w].forEach((c) => { const l = document.createElement('span'); l.className = 'l'; l.style.setProperty('--i', i++); l.textContent = c; p.append(l); }); f.append(p); }); n.replaceWith(f); }
    else if (n.nodeType === 1 && n.tagName !== 'BR') parte(n);
  });
  if (titulo) { titulo.setAttribute('aria-label', titulo.textContent.replace(/\s+/g, ' ').trim()); parte(titulo); }
  let mostrado = false;
  /* a faixa amarela só se enche quando chegam as letras dela */
  if (titulo) titulo.querySelectorAll('.real').forEach((r) => { const l = r.querySelector('.l'); if (l) r.style.transitionDelay = (+l.style.getPropertyValue('--i') * 22 + 260) + 'ms'; });
  const mostra = () => { if (mostrado) return; mostrado = true; titulo && titulo.classList.add('entra'); h.querySelectorAll('.sobe').forEach((s, k) => setTimeout(() => s.classList.add('entra'), 450 + k * 120)); };
  const esconde = () => { mostrado = false; titulo && titulo.classList.remove('entra'); h.querySelectorAll('.sobe').forEach((s) => s.classList.remove('entra')); };

  /* ── vídeo: nasce com src e poster no HTML; aqui só se troca pela versão certa ── */
  const v = h.querySelector('video');
  if (v) {
    const nome = h.dataset.video;
    v.poster = `${M}${nome}-cartaz${vertical ? '-vertical' : ''}.webp`;
    const alvo = `${M}${nome}-${ver}.mp4`;
    if (!(v.getAttribute('src') || '').endsWith(alvo.split('/').pop())) v.src = alvo; /* o HTML pode já trazer a fonte certa (escolhida por um script inline antes da hidratação) */
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = true;
    const toca = () => { if (!reduz) v.play().catch(() => {}); };
    /* movimento reduzido: o filme fica parado no cartaz até a pessoa carregar no play */
    if (reduz) { v.autoplay = false; v.removeAttribute('autoplay'); v.pause(); }
    ['loadeddata', 'canplay'].forEach((e) => v.addEventListener(e, toca));
    addEventListener('pageshow', toca); document.addEventListener('visibilitychange', () => { if (!document.hidden) toca(); });
    addEventListener('pointerdown', toca, { once: true }); addEventListener('touchstart', toca, { once: true, passive: true });
    toca();
    const pausa = h.querySelector('.pausa');
    if (pausa) { const pinta = () => { pausa.innerHTML = v.paused ? '<svg viewBox="0 0 14 14"><path d="M3 1.5v11l9.5-5.5z"/></svg>' : '<svg viewBox="0 0 14 14"><rect x="2" y="1" width="3.5" height="12" rx="1"/><rect x="8.5" y="1" width="3.5" height="12" rx="1"/></svg>'; pausa.setAttribute('aria-label', v.paused ? 'Tocar o filme' : 'Pausar o filme'); }; pausa.onclick = () => { v.paused ? v.play() : v.pause(); pinta(); }; v.addEventListener('play', pinta); v.addEventListener('pause', pinta); pinta(); }
  }

  if (reduz && dir !== 'd') { h.querySelectorAll('.foto').forEach((f) => f.classList.add('on')); mostra(); }
  else if (dir === 'a') {
    /* A · A PERITAGEM: o filme arranca no plano do homem a fotografar o carro batido.
       Aos 0,9 s o visor fecha-se sobre o carro; aos 2,1 s o flash dispara (a fotografia
       está tirada) e o título entra. O ciclo repete a cada volta do filme. */
    let fase = 0;
    const relogio = () => {
      const t = v.currentTime;
      if (t < 0.5) { if (fase !== 0) { fase = 0; h.classList.remove('ab', 'sai', 'flash'); esconde(); } }
      else if (t < 2.1) { if (fase !== 1) { fase = 1; h.classList.add('ab'); } }
      else if (fase !== 2) { fase = 2; h.classList.add('flash', 'sai'); setTimeout(mostra, 180); }
      requestAnimationFrame(relogio);
    };
    v.addEventListener('playing', () => requestAnimationFrame(relogio), { once: true });
    setTimeout(() => { if (!mostrado) mostra(); }, 3500); /* sem vídeo, o título não espera */
  } else if (dir === 'b') {
    /* B · LUZ DE OFICINA: fotogramas 4K reais. Começa escuro, a lanterna procura o
       embate, encontra-o, a luz abre e o título entra. Depois as fotografias trocam
       com movimento de câmara em código, a cada 6 s. Arranca no primeiro instante. */
    const fotos = [...h.querySelectorAll('.foto')];
    /* a primeira fotografia já; as outras só depois de o hero ter arrancado (fora do caminho crítico) */
    const srcDe = (f) => `${M}foto-${f.dataset.nome}-${vertical ? 'vertical' : px >= 2600 ? '3840' : '1920'}.webp`;
    fotos[0].src = srcDe(fotos[0]);
    setTimeout(() => fotos.slice(1).forEach((f) => { f.src = srcDe(f); }), 2500);
    fotos[0].classList.add('on');
    requestAnimationFrame(() => { h.classList.add('luz1'); });
    setTimeout(() => { h.classList.add('ab'); }, 1700);
    setTimeout(() => { h.classList.add('flash', 'sai', 'luz2'); setTimeout(mostra, 200); }, 2900);
    setTimeout(() => h.classList.add('luz3'), 4200);
    /* Ken Burns: só transform, 9 s por fotografia */
    let k = 0; const kb = (f) => { f.style.transition = 'opacity 1.2s linear, transform 9s linear'; f.style.transform = `scale(${1.06 + (k % 2) * 0.06}) translate(${(k % 2 ? -1 : 1) * 1.2}%, ${(k % 3 - 1) * 0.8}%)`; };
    kb(fotos[0]);
    setInterval(() => { const atual = fotos[k % fotos.length]; k++; const prox = fotos[k % fotos.length]; prox.style.transition = 'none'; prox.style.transform = 'scale(1.06)'; void prox.offsetWidth; kb(prox); prox.classList.add('on'); setTimeout(() => atual.classList.remove('on'), 1300); }, 6000);
  } else if (dir === 'd') {
    /* D · A MARCA MONTA-SE E FICA (15/10, refeita a pedido do João: «a marcar presença»). O logótipo verdadeiro chega em
       peças recortadas pela própria máscara (sem cópias por cima, por isso sem fantasmas):
       a linha de velocidade dispara, J·H·S entram de travão a fundo, o carro do logótipo
       estaciona, LIZ SALVADOS sobe letra a letra e uma luz corre dentro do desenho. Depois a marca
       não sai: encolhe e sobe para o canto de cima, como assinatura, e fica (por cima do título
       era informação a mais, disse o João); os cantos da
       peritagem largam-na e fecham-se sobre o carro batido; flash; o título entra por baixo dela.
       Assentada, uma luz passa-lhe por dentro de tempos a tempos. Relógio: o do vídeo. Tudo transform/opacity. */
    const V = h.querySelector('.visor3'), cantos = [...V.querySelectorAll('i')], rot = V.querySelector('b');
    const marca = h.querySelector('.marca2 .q');
    const PECAS = {"j":[1.346,3.43,21.802,64.644],"h":[16.986,3.43,26.411,64.38],"s":[37.39,3.166,23.563,64.38],"carro":[59.089,3.166,40.394,66.491],"linha":[0.621,72.296,98.55,6.069],"l0":[0.57,84.169,2.33,12.929],"l1":[8.959,84.169,1.191,12.929],"l2":[15.898,84.169,3.107,12.929],"l3":[32.781,84.169,2.589,12.929],"l4":[41.636,84.433,2.796,12.665],"l5":[51.062,84.433,2.02,12.665],"l6":[59.658,84.433,2.589,12.665],"l7":[68.203,84.433,2.745,12.665],"l8":[77.525,84.169,2.693,12.929],"l9":[86.639,84.169,2.693,12.929],"l10":[95.753,84.169,2.538,12.929]};
    const base = marca.dataset.pecas || '/liz-salvados-proposta/previa/media/marca/pecas/';
    marca.textContent = '';
    let nl = 0;
    Object.entries(PECAS).forEach(([nome, [x, y, w, hh]]) => {
      const p = document.createElement('span'), im = document.createElement('img');
      const letra = nome[0] === 'l' && nome !== 'linha';
      p.className = 'mp ' + (letra ? 'mp-l' : 'mp-' + nome);
      p.style.cssText = `left:${x}%;top:${y}%;width:${w}%;height:${hh}%`;
      if (letra) p.style.setProperty('--d', (nl++ * 38) + 'ms');
      im.src = base + nome + '.webp'; im.alt = ''; im.decoding = 'async'; p.append(im); marca.append(p);
    });
    const luz = document.createElement('span'); luz.className = 'mp-luz'; luz.style.setProperty('--m', `url(${base.replace(/pecas\/?$/, '')}logotipo-claro.webp)`); luz.append(document.createElement('i')); marca.append(luz);
    /* o lugar onde a marca fica: o canto de cima, como assinatura; o título fica sozinho em baixo */
    const lugar = document.createElement('div');
    lugar.className = 'marca-lugar'; lugar.setAttribute('aria-hidden', 'true'); palco.append(lugar);
    let docada = false;
    const doca = (ja) => {
      if (docada) return; docada = true;
      const fim = () => { marca.style.transition = 'none'; marca.style.transform = ''; lugar.append(marca); h.classList.add('m-doca'); };
      if (ja) { fim(); return; }
      const r = marca.getBoundingClientRect(), t = lugar.getBoundingClientRect(), s = t.width / r.width;
      marca.style.transformOrigin = '0 0'; marca.style.transition = 'transform 1.05s cubic-bezier(.75,0,.2,1)';
      marca.style.transform = `translate(${t.left - r.left}px, ${t.top - r.top}px) scale(${s})`;
      let feito = false; const uma = () => { if (!feito) { feito = true; fim(); } };
      marca.addEventListener('transitionend', (e) => { if (e.target === marca) uma(); }, { once: true }); setTimeout(uma, 1200);
    };
    const caixa = (n) => { const r = h.dataset[n] || '0.25 0.25 0.5 0.5'; const [x, y, w, hh] = r.split(/[\s,]+/).map(Number); return { x, y, w, h: hh }; };
    const poe = (bx, folga = 0) => {
      const W = palco.clientWidth, H = palco.clientHeight, cw = cantos[0].offsetWidth;
      const x0 = (bx.x - folga) * W, y0 = (bx.y - folga) * H, x1 = (bx.x + bx.w + folga) * W - cw, y1 = (bx.y + bx.h + folga) * H - cw;
      [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].forEach(([x, y], k) => { cantos[k].style.transform = `translate(${x}px, ${y}px)`; });
      /* o letreiro vai por baixo do visor: em cima, o canto é da marca */
      rot.style.transform = `translate(${x0}px, ${y1 + cw + 12}px)`;
    };
    const logoBox = () => { const r = marca.getBoundingClientRect(), p = palco.getBoundingClientRect(); return { x: (r.left - p.left) / p.width - 0.03, y: (r.top - p.top) / p.height - 0.1, w: r.width / p.width + 0.06, h: r.height / p.height + 0.2 }; };
    const carro = () => caixa(vertical ? 'carroTel' : 'carro');
    /* movimento reduzido: a marca já está no sítio, o título também, e nada mais corre */
    if (reduz) { h.classList.add('m-sem', 'm1', 'm2'); doca(true); h.classList.remove('m-sem'); mostra(); }
    let fase = -1;
    const zera = () => {
      h.classList.add('m-sem'); h.classList.remove('v-on', 'v-off', 'm1', 'm2', 'flash');
      esconde(); cantos.forEach((c) => (c.style.transition = 'none')); poe(logoBox(), 0.12); void V.offsetWidth;
      cantos.forEach((c) => (c.style.transition = '')); h.classList.remove('m-sem');
    };
    /* a abertura corre uma vez por carregamento; quando o filme dá a volta, a marca fica onde está */
    const relogio = () => {
      const t = v.currentTime;
      if (fase < 2 && t < 0.12) { if (fase !== 0) { fase = 0; zera(); } }
      else if (fase < 2 && t < 1.95) { if (fase !== 1) { if (fase < 0) zera(); fase = 1; h.classList.add('v-on', 'm1'); poe(logoBox()); } }
      else if (fase < 2) { fase = 2; h.classList.add('v-on', 'm1', 'm2'); doca(); poe(carro()); }
      else if (fase === 2 && t >= 2.95) { fase = 4; h.classList.add('flash', 'v-off'); setTimeout(mostra, 150); }
      if (fase < 4) requestAnimationFrame(relogio);
    };
    if (!reduz) v.addEventListener('playing', () => requestAnimationFrame(relogio), { once: true });
    addEventListener('resize', () => { if (fase === 2) poe(carro()); else if (fase >= 0 && fase < 2) poe(logoBox()); });
    if (!reduz) setTimeout(() => { if (!mostrado) { h.classList.add('m1', 'm2'); doca(true); mostra(); } }, 4500);
  } else if (dir === 'c') {
    /* C · A MARCA SOBRE O FILME: o filme não espera — corre desde o primeiro instante,
       escurecido; o logótipo verdadeiro (uma camada) entra com uma luz a varrê-lo,
       fica 1,6 s, dissolve, e o título entra no mesmo sítio. */
    let fase = 0;
    const relogio = () => {
      const t = v.currentTime;
      if (t < 0.3) { if (fase !== 0) { fase = 0; h.classList.remove('mb', 'mc'); esconde(); } }
      else if (t < 3.4) { if (fase !== 1) { fase = 1; h.classList.add('mb'); h.classList.remove('mc'); } }
      else if (fase !== 2) { fase = 2; h.classList.add('mc'); setTimeout(mostra, 350); }
      requestAnimationFrame(relogio);
    };
    v.addEventListener('playing', () => requestAnimationFrame(relogio), { once: true });
    setTimeout(() => { if (!mostrado) { h.classList.add('mc'); mostra(); } }, 4000);
  }

  /* ── saída suave ao scroll: o ecrã encolhe para uma moldura (transform só) ── */
  if (!reduz) {
    const texto = h.querySelector('.texto');
    let raf = 0;
    const fora = () => { raf = 0; const p = Math.min(1, Math.max(0, scrollY / (h.offsetHeight * 0.9))); palco.style.transform = `scale(${1 - p * 0.08}) translateY(${p * 4}%)`; palco.style.borderRadius = `${p * 28}px`; if (texto) { texto.style.opacity = 1 - p * 1.6; texto.style.transform = `translateY(${-p * 60}px)`; } const lg = h.querySelector('.marca-lugar'); if (lg) lg.style.opacity = Math.max(0, 1 - p * 3); };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(fora); }, { passive: true }); fora();
  }
})();

/* ── a escolha do João: fica no servidor da prévia (POST /escolha) e no browser ── */
(() => {
  const botoes = document.querySelectorAll('[data-escolher]'); if (!botoes.length) return;
  const estado = document.getElementById('estado');
  const pinta = (d) => { document.querySelectorAll('.dir article').forEach((a) => a.classList.toggle('escolhida', a.dataset.dir === d)); if (estado) { estado.textContent = d ? `Escolhida: direção ${d.toUpperCase()} — o João manda, eu acabo esta.` : ''; estado.classList.toggle('on', !!d); } };
  try { pinta(localStorage.getItem('liz-hero-escolha')); } catch (e) {}
  botoes.forEach((b) => b.addEventListener('click', async () => {
    const d = b.dataset.escolher;
    try { localStorage.setItem('liz-hero-escolha', d); } catch (e) {}
    pinta(d);
    try { await fetch('/liz-salvados-proposta/escolha', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hero: d, quando: new Date().toISOString() }) }); } catch (e) {}
  }));
})();
