/* O RODAPÉ DA LIZ SALVADOS — um só para o site inteiro (prévia, 14/10/2026).
   Os dados da casa vêm de src/content/stand.publico.json: o tools/previa-joel.mjs troca
   o marcador CASA_DO_SITE pelos dados reais quando monta a prévia. Fora da prévia
   (a proposta solta) fica só o que não depende deles. */
(() => {
  if (document.querySelector('footer.rodape')) return;
  const CASA = {
  "nome_comercial": "LIZSALVADOS",
  "actividade": "Compra e venda de viaturas sinistradas (salvados)",
  "morada": {
    "linha": "Estrada Nacional 356, 49 A, Jardoeira",
    "codigo_postal": null,
    "localidade": "Leiria",
    "lat": 39.668035,
    "lon": -8.842434
  },
  "telefone_e164": "+351915350582",
  "whatsapp": "351915350582",
  "facebook": "https://www.facebook.com/profile.php?id=61578514086135",
  "olx": "https://www.olx.pt/ads/user/Ic6F/",
  "horario": [
    {
      "dia": "Segunda a domingo",
      "abre": "08:30",
      "fecha": "20:00"
    }
  ],
  "percurso": {
    "inicio": 2021,
    "anos_experiencia": 7,
    "anos_por_conta_propria": 5,
    "de_casa_para_pavilhao": true
  },
  "volume": {
    "viaturas_por_semana": 20,
    "viaturas_por_ano_aprox": 1000
  },
  "servicos": [
    {
      "chave": "reboque",
      "nome": "Recolha e entrega em reboque",
      "confirmado": true
    }
  ],
  "mercado": "Nacional, apenas Portugal",
  "nao_faz": [
    "crédito ou financiamento — vende tudo a pronto",
    "trocas",
    "retomas",
    "importação"
  ],
  "apresentacao_dele": "LizSalvados é uma empresa de compra e venda de viaturas salvadas/ sinistradas.",
  "prova_publica": {
    "facebook_seguidores": 860,
    "facebook_seguidores_em": "2026-08-20",
    "facebook_categoria": "Automóveis, aeronaves e embarcações",
    "criticas": 1,
    "classificacao": null
  }
};
  const M = '/liz-salvados-proposta/previa/media/';
  const n = (window.LIZNAV && window.LIZNAV.links) || [];
  const rota = (h) => h; // as ligações das tabs já vêm trocadas pela prévia
  const WA_ICO = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2Z"/></svg>';
  const c = CASA || {};
  const h = (c.horario && c.horario[0]) || { dia: 'Segunda a domingo', abre: '08:30', fecha: '20:00' };
  const wa = 'https://wa.me/' + (c.whatsapp || '') + '?text=' + encodeURIComponent('Olá! Vi o site e queria saber mais sobre um salvado.');
  const tel = c.telefone_e164 ? c.telefone_e164.replace(/^\+351/, '').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : '';
  const mapa = c.morada && c.morada.lat ? `https://www.google.com/maps/search/?api=1&query=${c.morada.lat},${c.morada.lon}` : '';
  const ext = 'target="_blank" rel="noopener noreferrer"';
  const f = document.createElement('footer');
  f.className = 'rodape'; f.dataset.sitio = 'rodape';
  f.innerHTML = `<div class="env"><div class="grelha-r">
      <div><img class="marca-r" src="${M}marca/logotipo-claro.webp" alt="Liz Salvados">
        <p style="margin-top:14px;max-width:34ch">${c.actividade ? c.actividade + '.' : 'Compra e venda de viaturas salvadas.'}</p>
        ${c.percurso && c.percurso.inicio ? `<p style="margin-top:6px">Desde ${c.percurso.inicio}, em ${(c.morada && c.morada.localidade) || 'Leiria'}.</p>` : ''}</div>
      <div><h2>Navegar</h2><ul>${n.map(([, t, href]) => `<li><a href="${rota(href)}">${t}</a></li>`).join('')}</ul></div>
      <div><h2>Pavilhão</h2>${c.morada ? `<address style="font-style:normal">${c.morada.linha ? c.morada.linha + '<br>' : ''}${c.morada.localidade || ''}</address>` : ''}
        ${mapa ? `<p style="margin-top:8px"><a href="${mapa}" ${ext}>Abrir no Google Maps</a></p>` : ''}
        <p style="margin-top:8px">Atendimento ${h.dia.toLocaleLowerCase('pt-PT')}, ${h.abre}–${h.fecha}</p></div>
      <div><h2>Contacto</h2>${tel ? `<a class="tel" href="tel:${c.telefone_e164}" data-tel="ligar">${tel}</a>` : ''}
        <ul style="margin-top:6px">${c.facebook ? `<li><a href="${c.facebook}" ${ext}>Facebook</a></li>` : ''}${c.olx ? `<li><a href="${c.olx}" ${ext}>Loja OLX</a></li>` : ''}</ul>
        <a class="bt-r" href="${wa}" ${ext}>${WA_ICO} WhatsApp</a></div>
    </div>
    <div class="base"><p>© ${new Date().getFullYear()} ${c.nome_comercial || 'LIZSALVADOS'}</p>
      <ul><li><a href="/liz-salvados-proposta/informacao-legal/">Informação legal</a></li><li><a href="/liz-salvados-proposta/privacidade/">Privacidade</a></li><li><a href="/liz-salvados-proposta/cookies/">Cookies</a></li>
        <li><button type="button" data-preferencias-cookies="">Preferências de cookies</button></li>
        <li><a class="livro" href="https://www.livroreclamacoes.pt/inicio" ${ext}>Livro de Reclamações</a></li></ul></div>
    <p class="litigios">Litígios de consumo: <a href="https://www.cniacc.pt" ${ext}>CNIACC (www.cniacc.pt)</a> e as restantes entidades autorizadas, na lista do <a href="https://www.consumidor.gov.pt" ${ext}>Portal do Consumidor</a>. <a href="/liz-salvados-proposta/informacao-legal/">Saber mais</a></p></div>`;
  /* nas fichas há uma barra fixa em baixo («Quero conversar sobre este carro»): o rodapé ganha espaço para ela */
  if (/^\/viaturas\/(?!pagina\/)[^/]+\/$/.test(location.pathname)) f.classList.add('com-barra');
  document.body.append(f);
  /* nas páginas do site quem abre as preferências é o aviso de cookies (ui/Medicao.tsx);
     onde ele não existe (as tabs), o botão leva à página de cookies */
  if (document.body.dataset.pagina) f.querySelector('[data-preferencias-cookies]').addEventListener('click', () => { location.href = '/liz-salvados-proposta/cookies/'; });
})();
