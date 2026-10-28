/* O cartão de viatura e a janela da viatura — a partir do desenho de 14/10/2026
   (ramo integra/live-mais-promax): cartão sem caixa, fotografia grande com uma placa
   só de letra; o dano visto de cima (a planta lê as zonas tal como estão escritas);
   clicar abre uma janela escura com galeria, factos e WhatsApp.
   O que a proposta acrescenta por cima: fotografias que deslizam com o dedo (e
   folheiam com o rato), o visor da peritagem ao passar, as peças da planta a
   acenderem uma a uma, e a janela a abrir-se a partir do cartão.
   Regras de verdade iguais às do site: airbags sempre com o valor; a inspeção B
   como está declarada; WhatsApp com a mensagem limpa e o endereço da ficha. */
(() => {
  /* ── a planta vista de cima (porta de src/ui/PlantaDano.tsx) ── */
  const semAcentos = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const celulas = (zonas) => {
    const a = new Set();
    for (const zona of zonas) {
      const z = semAcentos(zona), esq = /esquerd/.test(z), dir = /direit/.test(z), ambos = !esq && !dir;
      const frente = /frente|diant|frontal/.test(z), tras = /tras|retaguarda/.test(z);
      if (/eixo|roda|jante|suspens|pneu/.test(z)) {
        if (frente || !tras) { if (esq || ambos) a.add('roda-fe'); if (dir || ambos) a.add('roda-fd'); }
        if (tras || !frente) { if (esq || ambos) a.add('roda-te'); if (dir || ambos) a.add('roda-td'); }
        continue;
      }
      if (/motor|capot|capo\b/.test(z)) a.add('capot');
      if (/radiador/.test(z)) a.add('frente-centro');
      if (/longarina/.test(z)) a.add('longarinas');
      if (/tecto|teto|tejadilho|capotamento/.test(z)) a.add('tecto');
      if (/lado|lateral|porta|embaladeira/.test(z) && !frente && !tras) { if (esq || ambos) a.add('lado-esq'); if (dir || ambos) a.add('lado-dir'); continue; }
      if (frente) { if (esq || ambos) a.add('frente-esq'); if (dir || ambos) a.add('frente-dir'); if (ambos) a.add('frente-centro'); }
      if (tras) { if (esq || ambos) a.add('tras-esq'); if (dir || ambos) a.add('tras-dir'); if (ambos) a.add('tras-centro'); }
    }
    return [...a];
  };
  const CORPO = 'M62 28Q100 16 138 28Q158 36 160 72L160 328Q158 364 138 372Q100 382 62 372Q42 364 40 328L40 72Q42 36 62 28Z';
  const PECAS = { 'frente-esq': [40, 10, 40, 104], 'frente-centro': [80, 10, 40, 56], 'frente-dir': [120, 10, 40, 104], capot: [66, 66, 68, 48], 'lado-esq': [40, 114, 24, 190], 'lado-dir': [136, 114, 24, 190], tecto: [64, 156, 72, 128], 'tras-esq': [40, 304, 40, 86], 'tras-centro': [80, 336, 40, 54], 'tras-dir': [120, 304, 40, 86] };
  const RODAS = { 'roda-fe': [27, 74], 'roda-fd': [159, 74], 'roda-te': [27, 276], 'roda-td': [159, 276] };
  let nPl = 0;
  /* todas = desenha todas as peças (apagadas) para se poderem acender depois — é o que o «Como funciona» usa */
  const planta = (zonas, { rotulos = false, todas = false, cls = '' } = {}) => {
    const ac = new Set(celulas(zonas)), id = 'pl' + nPl++;
    const caixa = rotulos ? '-34 -22 268 444' : '14 6 172 388';
    let k = 0;
    const peca = (p, [x, y, w, h]) => (ac.has(p) || todas) ? `<rect data-c="${p}" x="${x}" y="${y}" width="${w}" height="${h}" class="${ac.has(p) ? 'on' : 'off'}" style="--k:${k++}"/>` : '';
    return `<svg class="planta ${cls}" viewBox="${caixa}" fill="none" aria-hidden="true"><defs><clipPath id="${id}"><path d="${CORPO}"/></clipPath></defs>
      ${Object.entries(RODAS).map(([r, [x, y]]) => `<rect data-c="${r}" x="${x}" y="${y}" width="14" height="52" rx="5" class="roda ${ac.has(r) ? 'on' : ''}" style="--k:${k++}"/>`).join('')}
      <path d="${CORPO}" class="corpo"/>
      <g clip-path="url(#${id})">${Object.entries(PECAS).map(([p, r]) => peca(p, r)).join('')}${ac.has('longarinas') ? `<rect x="70" y="34" width="9" height="84" class="on"/><rect x="121" y="34" width="9" height="84" class="on"/>` : ''}</g>
      <path d="M56 124Q100 106 144 124L136 156Q100 146 64 156Z" class="vidro"/><path d="M64 284Q100 294 136 284L144 308Q100 322 56 308Z" class="vidro"/>
      <path d="M64 156Q100 146 136 156L136 284Q100 294 64 284Z" class="traco"/><path d="M48 62Q100 44 152 62" class="traco"/><path d="M40 132 30 128M160 132 170 128" class="traco"/>
      <path d="${CORPO}" class="contorno" pathLength="1"/>
      ${rotulos ? `<g class="rot"><text x="100" y="-6" text-anchor="middle">FRENTE</text><text x="100" y="412" text-anchor="middle">TRASEIRA</text><text x="-8" y="204" text-anchor="middle" transform="rotate(-90 -8 204)">ESQUERDA</text><text x="208" y="204" text-anchor="middle" transform="rotate(90 208 204)">DIREITA</text></g>` : ''}</svg>`;
  };

  /* ── WhatsApp: a mensagem limpa, com o endereço da ficha numa linha só dele (casa.ts, 13/10) ── */
  const SITE = 'https://lizsalvados.pt';
  const waViatura = (v) => {
    const t = v.titulo.split(' ');
    const frase = `Boa tarde. Tenho interesse no ${v.marca} ${t.slice(1).join(' ')}${v.ano ? ` de ${v.ano}` : ''}. Ainda está disponível?`.replace(/\s+/g, ' ');
    return 'https://wa.me/351915350582?text=' + encodeURIComponent(`${frase}\n/viaturas/${v.slug}/`);
  };

  const km = (n) => n.toLocaleString('pt-PT');
  const modelo = (v) => v.titulo.replace(v.marca, '').trim();
  const cartao = (v, i = 0) => {
    const vend = v.estado === 'vendido';
    const fotos = v.fotos.map((f, k) => `<img src="/liz-salvados-proposta/previa/${f.m}" ${k || i > 5 ? 'loading="lazy"' : ''} alt="${v.titulo}, fotografia ${k + 1}" width="960" height="740">`).join('');
    return `<article class="cv${vend ? ' vend' : ''}" style="--i:${i % 12}" data-slug="${v.slug}">
      <div class="foto">
        <a class="rolo viva" href="/liz-salvados-proposta/viaturas/${v.slug}/" data-abre aria-label="Abrir ${v.titulo}">${fotos}</a>
        <span class="visor"><i></i><i></i><i></i><i></i></span>
        ${v.fotos.length > 1 ? `<span class="pontos">${v.fotos.map((_, k) => `<i${k ? '' : ' class="on"'}></i>`).join('')}</span>` : ''}
        <button class="fav" aria-label="Guardar ${v.titulo}" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg></button>
        ${vend ? '<span class="carimbo">Vendido</span>' : ''}
      </div>
      <a class="placa" href="/liz-salvados-proposta/viaturas/${v.slug}/" data-abre>
        <span class="ano">${v.ano}</span>
        <span class="txt"><span class="marca">${v.marca}</span><span class="mod">${modelo(v)}</span>
          <span class="meta">${km(v.km)} km · ${v.comb.toLowerCase()} · ${v.cv} cv</span><span class="zona">${v.zonas.join(', ') || 'Sob consulta'}</span></span>
        ${v.zonas.length ? planta(v.zonas) : ''}
      </a></article>`;
  };

  /* ── a janela da viatura ── */
  let lista = [], jan;
  const janela = () => {
    if (jan) return jan;
    jan = document.createElement('div');
    jan.className = 'jan'; jan.setAttribute('role', 'dialog'); jan.setAttribute('aria-modal', 'true'); jan.setAttribute('aria-label', 'Viatura');
    jan.innerHTML = `<div class="jan-fundo" data-fecha></div><div class="jan-caixa"><div class="jan-gal"><div class="jan-rolo"></div><button class="jan-s a" aria-label="Fotografia anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button><button class="jan-s b" aria-label="Fotografia seguinte"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button><span class="jan-n"></span></div><div class="jan-info"></div><button class="jan-x" data-fecha aria-label="Fechar"><svg viewBox="0 0 16 16" stroke="currentColor" stroke-width="2"><path d="m3 3 10 10M13 3 3 13"/></svg></button></div>`;
    document.body.append(jan);
    jan.addEventListener('click', (e) => { if (e.target.closest('[data-fecha]')) fecha(); });
    const rolo = jan.querySelector('.jan-rolo'), n = jan.querySelector('.jan-n');
    const vai = (d) => rolo.scrollBy({ left: d * rolo.clientWidth, behavior: 'smooth' });
    jan.querySelector('.a').onclick = () => vai(-1); jan.querySelector('.b').onclick = () => vai(1);
    rolo.addEventListener('scroll', () => { n.textContent = `${Math.round(rolo.scrollLeft / rolo.clientWidth) + 1} / ${rolo.children.length}`; }, { passive: true });
    addEventListener('keydown', (e) => { if (!jan.classList.contains('on')) return; if (e.key === 'Escape') fecha(); if (e.key === 'ArrowRight') vai(1); if (e.key === 'ArrowLeft') vai(-1); });
    return jan;
  };
  let origem = null;
  const abre = (v, de) => {
    const j = janela(); origem = de;
    j.querySelector('.jan-rolo').innerHTML = v.fotos.map((f, k) => `<img src="/liz-salvados-proposta/previa/${f.m}" alt="${v.titulo}, fotografia ${k + 1}">`).join('');
    j.querySelector('.jan-n').textContent = `1 / ${v.fotos.length}`;
    const linhas = [['Airbags', v.airbags], ['Inspeção B', v.inspecao], ['Documentos', v.documentos]].filter(([, x]) => x);
    j.querySelector('.jan-info').innerHTML = `<p class="jm">${v.marca}</p><h2 class="d">${modelo(v)}</h2><p class="jmeta">${v.ano}${v.mes ? '/' + String(v.mes).padStart(2, '0') : ''} · ${km(v.km)} km · ${v.comb} · ${v.cv} cv</p>
      <div class="jdano">${planta(v.zonas, { rotulos: true })}<div><span>Onde está o dano</span>${v.zonas.map((z) => `<b>${z}</b>`).join('') || '<b>Sob consulta</b>'}</div></div>
      <dl>${linhas.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>
      ${v.estado === 'vendido' ? '<p class="jvend">Já vendido.</p>' : `<a class="bt bt-am jwa" href="${waViatura(v)}" target="_blank" rel="noopener">${LIZ.ICO_WA} Falar por WhatsApp</a>`}
      <p class="jref">${v.ref}</p>`;
    /* a janela nasce no sítio do cartão e cresce até ao centro */
    const r = de.getBoundingClientRect(), cx = innerWidth / 2, cy = innerHeight / 2;
    j.style.setProperty('--ox', (r.left + r.width / 2 - cx) + 'px'); j.style.setProperty('--oy', (r.top + r.height / 2 - cy) + 'px');
    j.style.setProperty('--os', Math.min(0.6, r.width / innerWidth).toFixed(2));
    j.classList.remove('on'); void j.offsetWidth; j.classList.add('on');
    document.documentElement.classList.add('jan-aberta');
    j.querySelector('.jan-x').focus({ preventScroll: true });
  };
  const fecha = () => { if (!jan) return; jan.classList.remove('on'); document.documentElement.classList.remove('jan-aberta'); origem && origem.querySelector('[data-abre]')?.focus({ preventScroll: true }); };

  const liga = (raiz, vs) => {
    if (vs) lista = vs;
    raiz.querySelectorAll('.cv').forEach((c) => {
      const rolo = c.querySelector('.rolo'), pts = c.querySelectorAll('.pontos i');
      rolo.addEventListener('scroll', () => { const k = Math.round(rolo.scrollLeft / rolo.clientWidth); pts.forEach((p, j) => p.classList.toggle('on', j === k)); }, { passive: true });
      rolo.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse' || pts.length < 2) return; const r = rolo.getBoundingClientRect(); const k = Math.min(pts.length - 1, Math.floor((e.clientX - r.left) / r.width * pts.length)); rolo.scrollTo({ left: k * rolo.clientWidth, behavior: 'instant' }); });
      rolo.addEventListener('pointerleave', () => rolo.scrollTo({ left: 0, behavior: 'instant' }));
      const f = c.querySelector('.fav');
      f.addEventListener('click', () => f.setAttribute('aria-pressed', f.getAttribute('aria-pressed') !== 'true'));
      c.querySelectorAll('[data-abre]').forEach((a) => a.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey) return;
        const v = lista.find((x) => x.slug === c.dataset.slug); if (!v) return;
        e.preventDefault(); abre(v, c);
      }));
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('entra'); io.unobserve(e.target); } }), { threshold: 0.15 });
    raiz.querySelectorAll('.cv').forEach((c) => io.observe(c));
  };
  window.LIZV = { planta, celulas, cartao, liga, waViatura, carregar: () => fetch('/liz-salvados-proposta/previa/dados/stock.json').then((r) => r.json()).then((d) => (lista = d)) };
})();
