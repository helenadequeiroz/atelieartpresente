// ════════════════════════════════════════════
//   ATELIÊ ART PRESENTE — main.js
// ════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  if (document.getElementById('produtos-grid')) initProdutos();
  if (document.getElementById('blog-grid'))    initBlog();
  initModal();
});

// ════ NAV ════
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

  const burger = document.querySelector('.nav-burger');
  const mobile = document.querySelector('.nav-mobile');
  if (burger && mobile) {
    burger.addEventListener('click', () => mobile.classList.toggle('open'));
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobile.classList.remove('open')));
  }
}

// ════ SCROLL REVEAL ════
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// ════════════════════════════════════════════
//   PRODUTOS — carregados dos JSONs em _products/
// ════════════════════════════════════════════

// Produtos de demonstração (substituídos pelos JSONs reais via CMS)
const DEMO_PRODUCTS = [
  { slug:'lenco-mandala', title:'Lenço Mandala Amor Agarradinho', category:'lencos', price:'R$ 120,00', technique:'Pintura em tecido', size:'70×70 cm', available:true, featured:true, description:'Pintado à mão durante o aniversário de uma amiga especial. Uma mandala cor de rosa sobre fundo verde batizado, nascida de uma conversa sobre amor e plantas que se agarram.', images:[], emoji:'🌸' },
  { slug:'bolsa-shibori', title:'Bolsa Shibori Índigo', category:'bolsas', price:'R$ 180,00', technique:'Shibori', size:'35×30 cm', available:true, featured:false, description:'Técnica japonesa de dobraduras e amarrações. Cada peça é única — a magia está em abrir o tecido e se surpreender com o padrão revelado.', images:[], emoji:'👜' },
  { slug:'toalha-hortensias', title:'Toalha Hortênsias', category:'mesa', price:'R$ 95,00', technique:'Pintura em tecido', size:'45×45 cm', available:true, featured:false, description:'Toalha de linho com hortênsias pintadas à mão. Técnica exclusiva que cria volume e textura nas pétalas.', images:[], emoji:'🌺' },
  { slug:'canga-sunset', title:'Canga Aquarela Sunset', category:'vestuario', price:'R$ 150,00', technique:'Pintura livre', size:'1,80×1,10 m', available:true, featured:true, description:'Degradê de cores quentes aplicado com pinceladas livres sobre viscose leve. Perfeita para usar como canga, lenço ou decoração.', images:[], emoji:'🌅' },
  { slug:'almofada-shibori', title:'Capa de Almofada Shibori', category:'casa', price:'R$ 85,00', technique:'Shibori + Carimbo', size:'45×45 cm', available:true, featured:false, description:'Padrão orgânico criado pela técnica Shibori com acabamento em carimbo artesanal. União do Japão com a Índia em tecido nacional.', images:[], emoji:'🎋' },
  { slug:'lenco-batik', title:'Lenço Batik Folhas Tropicais', category:'lencos', price:'R$ 110,00', technique:'Batik artesanal', size:'60×60 cm', available:false, featured:false, description:'Pintado com inspiração na flora brasileira. Folhas desenhadas à mão com tinta à base de pigmentos naturais.', images:[], emoji:'🌿' },
  { slug:'bolsa-marmorizacao', title:'Bolsa Marmorizada Ouro', category:'bolsas', price:'R$ 220,00', technique:'Marmorização', size:'30×25 cm', available:true, featured:false, description:'Tinta flutuando em água. O tecido mergulha e absorve um cosmos. Hipnótico, orgânico, irrepetível.', images:[], emoji:'✨' },
  { slug:'painel-solar', title:'Painel Têxtil Mandala Solar', category:'casa', price:'R$ 290,00', technique:'Pintura intuitiva', size:'80×80 cm', available:true, featured:true, description:'Painel decorativo pintado durante ritual de conexão com a energia solar. Frequências e intenção fixadas em cada pincelada.', images:[], emoji:'☀️' },
  { slug:'chapeu-palha', title:'Chapéu de Palha Pintado', category:'vestuario', price:'R$ 130,00', technique:'Pintura em palha', size:'Único (regulável)', available:true, featured:false, description:'Base de palha natural pintada com flores silvestres. A tinta penetra nas fibras respeitando a textura original.', images:[], emoji:'🌻' },
];

const CAT_LABELS = { todos:'Todos', lencos:'Lenços', bolsas:'Bolsas', vestuario:'Vestuário', mesa:'Mesa', casa:'Casa', outros:'Outros' };
const PER_PAGE = 6;
let prodState = { cat:'todos', page:1, data: DEMO_PRODUCTS };

function initProdutos() {
  // Tenta carregar JSONs do CMS; usa demo se não disponíveis
  loadProducts().then(data => {
    if (data && data.length) prodState.data = data;
    renderProdutos();
  });

  document.querySelectorAll('.filtro').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      prodState.cat = btn.dataset.cat;
      prodState.page = 1;
      renderProdutos();
    });
  });
}

async function loadProducts() {
  try {
    // Em produção com CMS, listar os JSONs de _products/
    // Como isso é estático, retornamos null e usamos os dados demo
    return null;
  } catch { return null; }
}

function filteredProducts() {
  if (prodState.cat === 'todos') return prodState.data;
  return prodState.data.filter(p => p.category === prodState.cat);
}

function renderProdutos() {
  const grid = document.getElementById('produtos-grid');
  const paginacao = document.getElementById('paginacao');
  const lista = filteredProducts();
  const total = lista.length;
  const totalPags = Math.ceil(total / PER_PAGE);
  const slice = lista.slice((prodState.page - 1) * PER_PAGE, prodState.page * PER_PAGE);

  grid.innerHTML = '';
  if (!slice.length) {
    grid.innerHTML = `<p style="font-family:var(--f-serif);font-style:italic;color:var(--terra-mid);grid-column:1/-1;text-align:center;padding:40px 0">Nenhuma peça nesta categoria ainda.</p>`;
  }
  slice.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'produto-card reveal';
    card.style.transitionDelay = `${i * 0.07}s`;
    card.dataset.slug = p.slug;
    const hasImg = p.images && p.images.length > 0;
    card.innerHTML = `
      <div class="produto-img">
        ${hasImg ? `<img src="${p.images[0]}" alt="${p.title}" loading="lazy">` : `<span class="produto-img-placeholder">${p.emoji || '🎨'}</span>`}
        <span class="produto-tag">${CAT_LABELS[p.category] || p.category}</span>
        ${!p.available ? `<div class="produto-sold">Esgotado</div>` : ''}
      </div>
      <div class="produto-info">
        <h3 class="produto-nome">${p.title}</h3>
        <p class="produto-desc">${p.description}</p>
        <div class="produto-foot">
          <span class="produto-preco">${p.price}</span>
          <button class="produto-btn">Ver peça →</button>
        </div>
      </div>`;
    card.addEventListener('click', () => abrirModal(p));
    grid.appendChild(card);
  });

  // Paginação
  if (paginacao) {
    paginacao.innerHTML = '';
    if (totalPags > 1) {
      for (let i = 1; i <= totalPags; i++) {
        const btn = document.createElement('button');
        btn.className = 'pag-btn' + (i === prodState.page ? ' active' : '');
        btn.textContent = i;
        btn.addEventListener('click', () => {
          prodState.page = i;
          renderProdutos();
          document.getElementById('produtos').scrollIntoView({ behavior:'smooth' });
        });
        paginacao.appendChild(btn);
      }
    }
  }

  // Re-observe novos cards
  grid.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    obs.observe(el);
  });
}

// ════════════════════════════════════════════
//   MODAL
// ════════════════════════════════════════════
let modalImgIdx = 0;
let modalCurrent = null;

function initModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  document.getElementById('modal-close')?.addEventListener('click', fecharModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) fecharModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });
}

function abrirModal(p) {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  modalCurrent = p;
  modalImgIdx = 0;

  document.getElementById('modal-cat').textContent = CAT_LABELS[p.category] || p.category;
  document.getElementById('modal-nome').textContent = p.title;
  document.getElementById('modal-desc').textContent = p.description;
  document.getElementById('modal-tecnica').textContent = p.technique || '—';
  document.getElementById('modal-tamanho').textContent = p.size || '—';
  document.getElementById('modal-preco').textContent = p.price;

  renderModalGallery(p);

  const msg = encodeURIComponent(`Olá, Helena! Vi sua peça "${p.title}" no site e gostaria de mais informações 🌸`);
  const wppEl = document.getElementById('modal-wpp');
  if (wppEl) {
    if (p.available) {
      wppEl.href = `https://wa.me/5515997193422?text=${msg}`;
      wppEl.style.display = '';
      document.getElementById('modal-unavail').style.display = 'none';
    } else {
      wppEl.style.display = 'none';
      document.getElementById('modal-unavail').style.display = '';
    }
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderModalGallery(p) {
  const mainArea = document.getElementById('modal-main-img');
  const thumbsArea = document.getElementById('modal-thumbs');
  const hasImgs = p.images && p.images.length > 0;

  if (hasImgs) {
    mainArea.innerHTML = `<img src="${p.images[modalImgIdx]}" alt="${p.title}">`;
    thumbsArea.innerHTML = p.images.map((img, i) =>
      `<div class="modal-thumb ${i === modalImgIdx ? 'active' : ''}" data-i="${i}">
         <img src="${img}" alt="">
       </div>`
    ).join('');
    thumbsArea.querySelectorAll('.modal-thumb').forEach(t => {
      t.addEventListener('click', () => {
        modalImgIdx = +t.dataset.i;
        renderModalGallery(modalCurrent);
      });
    });
    thumbsArea.style.display = p.images.length > 1 ? 'flex' : 'none';
  } else {
    mainArea.innerHTML = `<span class="no-img">${p.emoji || '🎨'}</span>`;
    thumbsArea.innerHTML = '';
    thumbsArea.style.display = 'none';
  }
}

function fecharModal() {
  document.getElementById('modal-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
  modalCurrent = null;
}

// ════════════════════════════════════════════
//   BLOG
// ════════════════════════════════════════════
const DEMO_POSTS = [
  {
    slug:'mandala-amor-agarradinho',
    title:'Como a conversa de uma amiga virou uma mandala',
    excerpt:'Ela falou que amava trepadeiras. Eu ouvi o sentimento — e três dias depois levei flores colhidas do quintal junto com uma toalha pintada só para ela.',
    cover:'',
    category:'inspiracoes',
    date:'2025-03-15',
    emoji:'🌸',
    body:`<p>Nem sempre a inspiração vem de uma imagem linda no Pinterest ou de uma aula técnica. Às vezes ela chega numa tarde de conversa, no brilho que aparece no olho de uma amiga quando ela fala de uma planta que ama.</p>
<p>Foi exatamente isso que aconteceu com o Amor Agarradinho.</p>
<p>Minha amiga me contou que tinha fascínio por trepadeiras — plantas que se agarram, que crescem onde encontram apoio, que sobem devagar mas não param. Quando ela descreveu a planta Amor Agarradinho, eu senti algo. <strong>Não foi uma informação. Foi um sentimento.</strong></p>
<p>Três dias depois, no aniversário dela, eu não podia ir até a casa dela. Então peguei um tecido que já tinha o fundo todo manchado em verde — um pano bonito que eu achava que faltava alguma coisa. E vi que ele pedia um círculo.</p>
<blockquote>A inspiração não foi a informação cognitiva. Foi o que eu percebi do sentimento dela.</blockquote>
<p>Comecei a desenhar. Galhos. Folhas. E aí: flores. Inspirada numa técnica de hortênsias que uma professora me ensinou, fiz um amor agarradinho em mandala. Rosa sobre verde.</p>
<p>Quando pude ir até ela, levei as flores colhidas do quintal e a toalha. Essa é a minha forma de criar: não é técnica que vem primeiro. É sentimento.</p>`
  },
  {
    slug:'shibori-a-magia-de-abrir',
    title:'Shibori: a magia de abrir',
    excerpt:'Você dobra, amarra, pinta — e não sabe o que vai encontrar. Essa surpresa é a essência da técnica japonesa que me apaixonou.',
    cover:'',
    category:'tecnicas',
    date:'2025-04-02',
    emoji:'🎋',
    body:`<p>Existe uma técnica japonesa chamada Shibori que funciona assim: você pega um tecido grande, dobra pequeninho, amarra com barbante, pinta algumas partes — e só descobre o que criou quando abre.</p>
<p>É literalmente uma surpresa a cada peça. <strong>Delicioso.</strong></p>
<p>O Shibori tem mais de mil anos de história no Japão. Mas para mim, o que importa não é a história técnica — é aquela sensação de abrir o tecido e se deparar com um padrão que você criou sem controlar completamente.</p>
<p>Às vezes dou uma dobrada diferente e uso carimbo por cima. Às vezes misturo com marmorização. O mundo se encontra no tecido.</p>`
  },
  {
    slug:'varal-de-lencos-ao-sol',
    title:'O dia em que o varal falou mais alto',
    excerpt:'A primeira vez que expus meus lenços em público foi em um varal ao sol. Não esperava nada. O que aconteceu depois me mostrou que estava no caminho certo.',
    cover:'',
    category:'bastidores',
    date:'2025-04-20',
    emoji:'☀️',
    body:`<p>Havia um trabalho especial acontecendo no ranchinho da amizade — uma celebração na energia do sol. Me pediram para levar algumas peças.</p>
<p>Montei uma playlist de frequências solares, me conectei com aquilo, e pintei. Depois estendi um varal enorme de lenços ao sol.</p>
<p>Não era uma exposição formal. Era um varal. Mas as pessoas pararam. Ficaram olhando. Algumas compraram na hora.</p>
<p>Dias depois, pessoas voltaram preocupadas com que não houvesse mais a peça que tinham visto. Uma foi atrás de mim — eu não estava em casa. Ela voltou com a irmã. <strong>Os tecidos de teste — que eu tinha mandado para a costureira avaliar — também foram vendidos.</strong></p>
<p>Foi nesse dia que entendi: as pessoas queriam aquilo que eu tinha construído. E que eu podia continuar construindo.</p>`
  },
];

function initBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;
  renderBlogGrid(DEMO_POSTS, grid);
}

function renderBlogGrid(posts, grid) {
  grid.innerHTML = '';
  posts.slice(0, 6).forEach((post, i) => {
    const card = document.createElement('div');
    card.className = 'post-card reveal';
    card.style.transitionDelay = `${i * 0.08}s`;
    const dateStr = post.date ? new Date(post.date).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' }) : '';
    card.innerHTML = `
      <div class="post-cover">
        ${post.cover ? `<img src="${post.cover}" alt="${post.title}">` : post.emoji || '📝'}
      </div>
      <div class="post-body">
        <p class="post-cat">${CAT_POST[post.category] || post.category}</p>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="post-foot">
          <span class="post-date">${dateStr}</span>
          <span class="post-read">Ler →</span>
        </div>
      </div>`;
    card.addEventListener('click', () => abrirPost(post));
    grid.appendChild(card);
  });

  grid.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    obs.observe(el);
  });
}

const CAT_POST = { tecnicas:'Técnicas', inspiracoes:'Inspirações', bastidores:'Bastidores', presentes:'Presentes' };

function abrirPost(post) {
  const listView  = document.getElementById('blog-list-view');
  const singleView = document.getElementById('post-single-view');
  if (!singleView) return;

  const dateStr = post.date ? new Date(post.date).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' }) : '';
  singleView.innerHTML = `
    <div class="post-single">
      <button onclick="fecharPost()" class="btn btn-outline" style="margin-bottom:32px">← Voltar ao blog</button>
      <div class="post-single-cover">
        ${post.cover ? `<img src="${post.cover}" alt="${post.title}">` : `<div style="width:100%;height:100%;background:var(--grad-subtle);display:flex;align-items:center;justify-content:center;font-size:6rem;">${post.emoji || '📝'}</div>`}
      </div>
      <p class="post-cat">${CAT_POST[post.category] || post.category}</p>
      <h1>${post.title}</h1>
      <p class="post-meta">${dateStr}</p>
      <div class="post-content">${post.body || post.excerpt}</div>
    </div>`;

  if (listView) listView.style.display = 'none';
  singleView.style.display = 'block';
  window.scrollTo({ top: singleView.offsetTop - 80, behavior:'smooth' });
}

function fecharPost() {
  document.getElementById('blog-list-view').style.display = '';
  document.getElementById('post-single-view').style.display = 'none';
  document.getElementById('blog').scrollIntoView({ behavior:'smooth' });
}

document.getElementById('ano').textContent = new Date().getFullYear();
