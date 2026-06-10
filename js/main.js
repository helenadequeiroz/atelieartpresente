// ════════════════════════════════════════════
//   ATELIÊ ART PRESENTE — main.js
// ════════════════════════════════════════════

const GH_USER = 'helenadequeiroz';
const GH_REPO = 'atelieartpresente';
const GH_API  = `https://api.github.com/repos/${GH_USER}/${GH_REPO}/contents`;

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  if (document.getElementById('produtos-grid')) initProdutos();
  if (document.getElementById('blog-grid'))    initBlog();
  initModal();
  const anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = new Date().getFullYear();
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
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function reObserve(container) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  container.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}

// ════════════════════════════════════════════
//   GITHUB API — buscar arquivos de uma pasta
// ════════════════════════════════════════════
async function fetchFolder(folder) {
  try {
    const res = await fetch(`${GH_API}/${folder}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) return [];
    const files = await res.json();
    // filtrar só JSONs
    const jsonFiles = files.filter(f => f.name.endsWith('.json') && f.type === 'file');
    const items = await Promise.all(
      jsonFiles.map(f =>
        fetch(f.download_url)
          .then(r => r.json())
          .then(data => ({ ...data, slug: f.name.replace('.json', '') }))
          .catch(() => null)
      )
    );
    return items.filter(Boolean);
  } catch {
    return [];
  }
}

// ════════════════════════════════════════════
//   PRODUTOS
// ════════════════════════════════════════════
const CAT_LABELS = { todos:'Todos', lencos:'Lenços', bolsas:'Bolsas', vestuario:'Vestuário', mesa:'Mesa', casa:'Casa', outros:'Outros' };
const PER_PAGE = 6;
let prodState = { cat:'todos', page:1, data:[] };

function initProdutos() {
  const grid = document.getElementById('produtos-grid');

  // Skeleton enquanto carrega
  grid.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:60px 0;font-family:var(--f-serif);font-style:italic;color:var(--terra-mid);font-size:1.1rem">
      Carregando peças…
    </div>`;

  fetchFolder('_products').then(data => {
    // Ordenar: featured primeiro, depois por data desc
    data.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date || 0) - new Date(a.date || 0);
    });
    prodState.data = data;
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

function filteredProducts() {
  if (prodState.cat === 'todos') return prodState.data;
  return prodState.data.filter(p => p.category === prodState.cat);
}

function renderProdutos() {
  const grid = document.getElementById('produtos-grid');
  const paginacao = document.getElementById('paginacao');
  const lista = filteredProducts();
  const totalPags = Math.ceil(lista.length / PER_PAGE);
  const slice = lista.slice((prodState.page - 1) * PER_PAGE, prodState.page * PER_PAGE);

  grid.innerHTML = '';

  if (!slice.length) {
    grid.innerHTML = `<p style="font-family:var(--f-serif);font-style:italic;color:var(--terra-mid);grid-column:1/-1;text-align:center;padding:60px 0;font-size:1.1rem">Nenhuma peça nesta categoria ainda.</p>`;
    if (paginacao) paginacao.innerHTML = '';
    return;
  }

  slice.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'produto-card reveal';
    card.style.transitionDelay = `${i * 0.07}s`;

    // O CMS salva imagens como array de strings com o caminho
    const imgs = normalizeImages(p.images);
    const hasImg = imgs.length > 0;

    card.innerHTML = `
      <div class="produto-img">
        ${hasImg
          ? `<img src="${imgs[0]}" alt="${p.title}" loading="lazy">`
          : `<span class="produto-img-placeholder">🎨</span>`}
        <span class="produto-tag">${CAT_LABELS[p.category] || p.category}</span>
        ${p.available === false ? `<div class="produto-sold">Esgotado</div>` : ''}
      </div>
      <div class="produto-info">
        <h3 class="produto-nome">${p.title}</h3>
        <p class="produto-desc">${p.description || ''}</p>
        <div class="produto-foot">
          <span class="produto-preco">${p.price || ''}</span>
          <button class="produto-btn">Ver peça →</button>
        </div>
      </div>`;

    // Passa imagens normalizadas pro modal
    card.addEventListener('click', () => abrirModal({ ...p, _imgs: imgs }));
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
          document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
        });
        paginacao.appendChild(btn);
      }
    }
  }

  reObserve(grid);
}

// O Decap CMS pode salvar imagens de formas diferentes — normaliza tudo pra array de strings
function normalizeImages(raw) {
  if (!raw) return [];
  if (typeof raw === 'string') return raw ? [raw] : [];
  if (Array.isArray(raw)) {
    return raw
      .map(item => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') return item.image || item.src || item.url || '';
        return '';
      })
      .filter(Boolean);
  }
  return [];
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

  document.getElementById('modal-cat').textContent  = CAT_LABELS[p.category] || p.category || '';
  document.getElementById('modal-nome').textContent = p.title || '';
  document.getElementById('modal-desc').textContent = p.description || '';
  document.getElementById('modal-tecnica').textContent = p.technique || '—';
  document.getElementById('modal-tamanho').textContent = p.size || '—';
  document.getElementById('modal-preco').textContent = p.price || '';

  renderModalGallery(p);

  const msg = encodeURIComponent(`Olá, Helena! Vi sua peça "${p.title}" no site e gostaria de mais informações 🌸`);
  const wppEl = document.getElementById('modal-wpp');
  const unavailEl = document.getElementById('modal-unavail');
  if (wppEl) {
    if (p.available !== false) {
      wppEl.href = `https://wa.me/5515997193422?text=${msg}`;
      wppEl.style.display = '';
      if (unavailEl) unavailEl.style.display = 'none';
    } else {
      wppEl.style.display = 'none';
      if (unavailEl) unavailEl.style.display = '';
    }
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderModalGallery(p) {
  const mainArea  = document.getElementById('modal-main-img');
  const thumbsArea = document.getElementById('modal-thumbs');
  const imgs = p._imgs || normalizeImages(p.images);

  if (imgs.length > 0) {
    mainArea.innerHTML = `<img src="${imgs[modalImgIdx]}" alt="${p.title}">`;
    thumbsArea.style.display = imgs.length > 1 ? 'flex' : 'none';
    thumbsArea.innerHTML = imgs.map((img, i) =>
      `<div class="modal-thumb ${i === modalImgIdx ? 'active' : ''}" data-i="${i}">
         <img src="${img}" alt="">
       </div>`
    ).join('');
    thumbsArea.querySelectorAll('.modal-thumb').forEach(t => {
      t.addEventListener('click', () => {
        modalImgIdx = +t.dataset.i;
        renderModalGallery(p);
      });
    });
  } else {
    mainArea.innerHTML = `<span class="no-img">🎨</span>`;
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
const CAT_POST = { tecnicas:'Técnicas', inspiracoes:'Inspirações', bastidores:'Bastidores', presentes:'Presentes' };

function initBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  grid.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:60px 0;font-family:var(--f-serif);font-style:italic;color:var(--terra-mid);font-size:1.1rem">
      Carregando posts…
    </div>`;

  fetchFolder('_posts').then(posts => {
    // Ordenar por data desc
    posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    if (posts.length === 0) {
      grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:60px 0;font-family:var(--f-serif);font-style:italic;color:var(--terra-mid);font-size:1.1rem">Nenhum post publicado ainda.</p>`;
      return;
    }
    renderBlogGrid(posts, grid);
  });
}

function renderBlogGrid(posts, grid) {
  grid.innerHTML = '';
  posts.slice(0, 6).forEach((post, i) => {
    const card = document.createElement('div');
    card.className = 'post-card reveal';
    card.style.transitionDelay = `${i * 0.08}s`;
    const dateStr = post.date
      ? new Date(post.date).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })
      : '';
    card.innerHTML = `
      <div class="post-cover">
        ${post.cover
          ? `<img src="${post.cover}" alt="${post.title}">`
          : '✦'}
      </div>
      <div class="post-body">
        <p class="post-cat">${CAT_POST[post.category] || post.category || ''}</p>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt || ''}</p>
        <div class="post-foot">
          <span class="post-date">${dateStr}</span>
          <span class="post-read">Ler →</span>
        </div>
      </div>`;
    card.addEventListener('click', () => abrirPost(post));
    grid.appendChild(card);
  });
  reObserve(grid);
}

function abrirPost(post) {
  const listView   = document.getElementById('blog-list-view');
  const singleView = document.getElementById('post-single-view');
  if (!singleView) return;

  const dateStr = post.date
    ? new Date(post.date).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })
    : '';

  // body pode vir como markdown ou html do CMS
  const bodyHtml = post.body
    ? post.body.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>')
    : `<p>${post.excerpt || ''}</p>`;

  singleView.innerHTML = `
    <div class="post-single">
      <button onclick="fecharPost()" class="btn btn-outline" style="margin-bottom:32px">← Voltar ao blog</button>
      <div class="post-single-cover">
        ${post.cover
          ? `<img src="${post.cover}" alt="${post.title}">`
          : `<div style="width:100%;height:100%;background:var(--grad-subtle);display:flex;align-items:center;justify-content:center;font-size:5rem">✦</div>`}
      </div>
      <p class="post-cat">${CAT_POST[post.category] || post.category || ''}</p>
      <h1>${post.title}</h1>
      <p class="post-meta">${dateStr}</p>
      <div class="post-content">${bodyHtml}</div>
    </div>`;

  if (listView) listView.style.display = 'none';
  singleView.style.display = 'block';
  window.scrollTo({ top: singleView.offsetTop - 80, behavior: 'smooth' });
}

function fecharPost() {
  const listView   = document.getElementById('blog-list-view');
  const singleView = document.getElementById('post-single-view');
  if (listView)   listView.style.display = '';
  if (singleView) singleView.style.display = 'none';
  document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
}