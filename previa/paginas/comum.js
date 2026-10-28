/* LIZ SALVADOS — proposta de redesign. Base comum: menu, herói 4K, título cinético,
   entradas, imagens vivas. Um só dono do tempo por elemento. */
(() => {
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const M = '/liz-salvados-proposta/previa/media/';
  const WA = 'https://wa.me/351915350582?text=' + encodeURIComponent('Olá! Vi o site e queria saber mais sobre um salvado.');
  const ICO_WA = '<svg class="wa" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z"/></svg>';
  const SETA = '<svg class="seta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  window.LIZ = { M, WA, ICO_WA, SETA, reduz };

  /* o menu vive em nav.js (o mesmo no site inteiro) */
  const links = window.LIZNAV ? window.LIZNAV.links : [];

  /* o rodapé vive em rodape.js (o mesmo no site inteiro) */

  /* ── título cinético: parte em palavras e letras ── */
  document.querySelectorAll('.cin').forEach((el) => {
    let i = 0;
    const parte = (no) => {
      [...no.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.append(' '); return; }
            const p = document.createElement('span'); p.className = 'p';
            [...w].forEach((c) => { const l = document.createElement('span'); l.className = 'l'; l.style.setProperty('--i', i++); l.textContent = c; p.append(l); });
            frag.append(p);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') parte(n);
      });
    };
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    parte(el);
    el.querySelectorAll('.p').forEach((p) => p.setAttribute('aria-hidden', 'true'));
  });
  const entra = (el) => {
    /* a faixa amarela entra quando chegam as letras dela, não antes */
    el.querySelectorAll('.real').forEach((r) => { const l = r.querySelector('.l'); if (l) r.style.transitionDelay = (+l.style.getPropertyValue('--i') * 26 + 250) + 'ms'; });
    el.classList.add('entra');
    el.querySelectorAll('.real').forEach((r) => setTimeout(() => r.classList.add('brilha'), 900 + (el.querySelectorAll('.l').length * 26)));
  };
  window.LIZ.entra = entra;

  /* ── entradas ao aparecer ── */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { entra(e.target); io.unobserve(e.target); } }), { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.cin:not([data-espera]), .sobe:not([data-espera])').forEach((el) => io.observe(el));

  /* ── durante o scroll, os cartões não reagem ao rato (poupa repinturas a cada fotograma) ── */
  let rolar = 0;
  addEventListener('scroll', () => { document.documentElement.classList.add('a-rolar'); clearTimeout(rolar); rolar = setTimeout(() => document.documentElement.classList.remove('a-rolar'), 140); }, { passive: true });

  /* ── imagens vivas: seguem o rato ── */
  document.addEventListener('pointermove', (e) => {
    const v = e.target.closest && e.target.closest('.viva'); if (!v || e.pointerType !== 'mouse') return;
    const r = v.getBoundingClientRect();
    v.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5) * -14 + 'px');
    v.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5) * -14 + 'px');
  });

  /* ── herói 4K: escolhe a versão pelos píxeis reais do ecrã ── */
  const h = document.querySelector('.heroi');
  if (!h) return;
  const nome = h.dataset.video, palco = h.querySelector('.palco');
  const vertical = innerWidth / innerHeight < 0.8;
  const px = innerWidth * (devicePixelRatio || 1);
  const ver = vertical ? 'vertical' : px >= 3000 ? '2160' : px >= 2000 ? '1440' : '1080';
  const v = document.createElement('video');
  Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: !reduz, preload: 'auto' });
  v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
  v.poster = `${M}heroi/${nome}-cartaz${vertical ? '-vertical' : ''}.webp`;
  v.src = `${M}heroi/${nome}-${ver}.mp4`;
  v.setAttribute('aria-hidden', 'true');
  palco.prepend(v);
  const pausa = document.createElement('button');
  pausa.className = 'pausa';
  const icoP = '<svg viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="3.5" height="12" rx="1"/><rect x="8.5" y="1" width="3.5" height="12" rx="1"/></svg>';
  const icoT = '<svg viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5v11l9.5-5.5z"/></svg>';
  const pinta = () => { pausa.innerHTML = v.paused ? icoT : icoP; pausa.setAttribute('aria-label', v.paused ? 'Tocar o filme' : 'Pausar o filme'); };
  pausa.addEventListener('click', () => { v.paused ? v.play() : v.pause(); pinta(); });
  v.addEventListener('play', pinta); v.addEventListener('pause', pinta);
  palco.append(pausa); pinta();
  if (reduz) v.pause();

  const titulo = h.querySelector('.cin'), resto = h.querySelectorAll('.sobe');
  const mostra = () => { if (titulo) entra(titulo); resto.forEach((r, k) => setTimeout(() => entra(r), 500 + k * 120)); };

  /* abertura de marca (só no início) — fases do AberturaLogo de 14/10: antes → logo → titulo */
  if (h.querySelector('.al') && !reduz) {
    h.dataset.fase = 'antes'; document.documentElement.classList.add('a-abrir');
    requestAnimationFrame(() => requestAnimationFrame(() => { h.dataset.fase = 'logo'; }));
    setTimeout(() => {
      try { v.currentTime = 0; } catch (e) { /* sem dados ainda: não faz falta */ }
      h.dataset.fase = 'titulo'; document.documentElement.classList.remove('a-abrir');
      setTimeout(mostra, 450);
    }, 3400);
  } else {
    if (h.querySelector('.al')) h.dataset.fase = 'titulo';
    setTimeout(mostra, reduz ? 0 : 350);
  }

  /* saída do herói: o ecrã inteiro encolhe para uma moldura */
  if (!reduz) {
    const fora = () => {
      const p = Math.min(1, Math.max(0, scrollY / (h.offsetHeight * 0.9)));
      palco.style.transform = `scale(${1 - p * 0.08}) translateY(${p * 4}%)`;
      palco.style.borderRadius = `${p * 28}px`;
      const t = h.querySelector('.texto'); if (t) { t.style.opacity = 1 - p * 1.6; t.style.transform = `translateY(${-p * 60}px)`; }
    };
    addEventListener('scroll', fora, { passive: true }); fora();
  }
})();
