/* O MENU DA LIZ SALVADOS — um só para o site inteiro (prévia, 14/10/2026).
   Pedido do João: o mesmo menu em todas as páginas, o da versão com as tabs todas; ao
   abrir o site o foco é o herói, e o menu só aparece depois de se descer um pouco.
   Serve nas tabs (com nav.css) e nas páginas do site de ontem (início e fichas). */
(() => {
  if (document.querySelector('nav.nav')) return;
  const M = '/liz-salvados-proposta/previa/media/';
  const WA = 'https://wa.me/351915350582?text=' + encodeURIComponent('Olá! Vi o site e queria saber mais sobre um salvado.');
  const ICO_WA = '<svg class="wa" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z"/></svg>';
  const links = [['stock', 'Disponíveis', '/liz-salvados-proposta/viaturas/'], ['vendidos', 'Vendidos', '/liz-salvados-proposta/vendidos/'], ['como', 'Como funciona', '/liz-salvados-proposta/como-funciona/'], ['vender', 'Vender salvado', '/liz-salvados-proposta/vender/'], ['sobre', 'Quem somos', '/liz-salvados-proposta/sobre/']];
  window.LIZNAV = { links };
  /* a página onde se está: nas tabs vem do <body data-pagina>; no site, do endereço */
  const caminho = location.pathname;
  const aqui = document.body.dataset.pagina || (caminho.startsWith('/liz-salvados-proposta/viaturas/') ? 'stock' : caminho.startsWith('/liz-salvados-proposta/vendidos/') ? 'vendidos' : caminho.startsWith('/liz-salvados-proposta/como-funciona/') ? 'como' : caminho.startsWith('/liz-salvados-proposta/vender/') ? 'vender' : caminho.startsWith('/liz-salvados-proposta/sobre/') ? 'sobre' : '');
  if (!document.querySelector('link[href*="family=Barlow"]')) {
    const f = document.createElement('link'); f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700&display=swap';
    document.head.append(f);
  }
  const caixa = document.createElement('div');
  caixa.innerHTML = `<nav class="nav solida" aria-label="Principal">
      <a class="marca" href="/" aria-label="Liz Salvados, início"><img class="cla" src="${M}marca/logotipo-claro.webp" alt=""><img class="esc" src="${M}marca/logotipo.webp" alt=""></a>
      <ul>${links.map(([k, t, h]) => `<li><a href="${h}"${k === aqui ? ' aria-current="page"' : ''}>${t}</a></li>`).join('')}</ul>
      <div class="lado"><a class="bt bt-am" href="${WA}" target="_blank" rel="noopener">${ICO_WA}<span class="txt">WhatsApp</span></a>
      <button class="menu" aria-label="Abrir o menu" aria-expanded="false"><i></i></button></div></nav>
    <div class="folha" aria-hidden="true">${links.map(([, t, h]) => `<a href="${h}">${t}</a>`).join('')}<a class="bt bt-am" href="${WA}">${ICO_WA} Falar por WhatsApp</a></div>`;
  document.body.prepend(...caixa.children);
  const nav = document.querySelector('nav.nav'), btn = nav.querySelector('.menu'), folha = document.querySelector('.folha');
  btn.addEventListener('click', () => {
    const a = document.documentElement.classList.toggle('aberto');
    btn.setAttribute('aria-expanded', a); folha.setAttribute('aria-hidden', !a);
    btn.setAttribute('aria-label', a ? 'Fechar o menu' : 'Abrir o menu');
    document.body.style.overflow = a ? 'hidden' : '';
  });
  /* SÓ NO INÍCIO o menu espera que se desça um pouco: ao abrir o site o foco é o herói.
     Nas outras tabs está sempre à vista, pronto a usar (pedido do João, 14/10). */
  const inicio = caminho === '/' || caminho.endsWith('/liz-salvados-proposta/inicio.html') || document.body.dataset.pagina === 'inicio';
  const poe = () => {
    nav.classList.toggle('oculta', inicio && scrollY < Math.min(innerHeight * 0.25, 220) && !document.documentElement.classList.contains('aberto'));
  };
  addEventListener('scroll', poe, { passive: true }); addEventListener('resize', poe);
  poe(); requestAnimationFrame(poe);
})();
