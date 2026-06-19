/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   WORKBYGABIN.COM — script.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ─── Loader ──────────────────────────────── */
const loader = document.getElementById('loader');
if (loader) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    loader.remove();
  } else {
    setTimeout(() => {
      loader.classList.add('done');
      loader.addEventListener('transitionend', e => {
        if (e.propertyName === 'transform') loader.remove();
      }, { once: true });
    }, 800);
  }
}


/* ─── Cursor personnalisé ─────────────────── */
const cursor = document.getElementById('cursor');

if (cursor && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  /* Expand sur les éléments interactifs */
  document.querySelectorAll('a, button, .gallery-filter-option, .project, .skill-tag, .contact-item, .nova-block').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
  });

  document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));
}


/* ─── Nav — effet scroll ──────────────────── */
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ─── Scroll Reveal (Intersection Observer) ── */
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

if (revealEls.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}


/* ─── Gallery — lazy-load + pause vidéos hors viewport ─── */
const galleryVideos = document.querySelectorAll('#gallery video');

if (galleryVideos.length) {
  const vObserver = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        /* Injecte la source au premier passage seulement */
        if (!target.src && target.dataset.src) target.src = target.dataset.src;
        target.play().catch(() => {});
      } else {
        target.pause();
      }
    });
  }, { threshold: 0.05, rootMargin: '200px 0px' });

  galleryVideos.forEach(v => vObserver.observe(v));
}


/* ─── Gallery — filtres catégorie + année ── */
const galleryToggle = document.querySelector('.gallery-toggle');

if (galleryToggle) {
  const toggleBtns   = galleryToggle.querySelectorAll('.gallery-toggle-btn');
  const projectTiles = document.querySelectorAll('#gallery .project');
  const emptyMsg     = document.querySelector('.gallery-empty');

  const yearFilter  = document.querySelector('.gallery-filter');
  const yearTrigger = yearFilter && yearFilter.querySelector('.gallery-filter-trigger');
  const yearLabel   = yearFilter && yearFilter.querySelector('.gallery-filter-label');
  const yearOptions = yearFilter ? [...yearFilter.querySelectorAll('.gallery-filter-option')] : [];

  let currentCategory = 'pro';   // défaut
  let currentYear     = 'all';   // défaut

  /* Années disponibles par catégorie */
  const yearsByCat = {};
  projectTiles.forEach(t => {
    (yearsByCat[t.dataset.category] = yearsByCat[t.dataset.category] || new Set()).add(t.dataset.year);
  });

  const setYear = value => {
    currentYear = value;
    yearOptions.forEach(opt => {
      const sel = opt.dataset.value === value;
      opt.classList.toggle('is-selected', sel);
      opt.setAttribute('aria-selected', String(sel));
      if (sel && yearLabel) yearLabel.textContent = opt.textContent;
    });
  };

  /* Masque les années sans projet dans la catégorie active */
  const syncYearOptions = () => {
    if (!yearFilter) return;
    const avail = yearsByCat[currentCategory] || new Set();
    yearOptions.forEach(opt => {
      if (opt.dataset.value === 'all') return;
      opt.classList.toggle('is-unavailable', !avail.has(opt.dataset.value));
    });
    if (currentYear !== 'all' && !avail.has(currentYear)) setYear('all');
  };

  const applyFilters = () => {
    galleryToggle.classList.toggle('is-academique', currentCategory === 'academique');
    toggleBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === currentCategory)));

    let visible = 0;
    projectTiles.forEach(tile => {
      const show = tile.dataset.category === currentCategory
                && (currentYear === 'all' || tile.dataset.year === currentYear);
      tile.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });

    if (emptyMsg) emptyMsg.classList.toggle('visible', visible === 0);
  };

  /* Catégorie */
  toggleBtns.forEach(btn => btn.addEventListener('click', () => {
    currentCategory = btn.dataset.filter;
    syncYearOptions();
    applyFilters();
  }));

  /* Année — dropdown custom */
  if (yearFilter) {
    const closeYear = () => {
      yearFilter.classList.remove('is-open');
      yearTrigger.setAttribute('aria-expanded', 'false');
    };

    yearTrigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = yearFilter.classList.toggle('is-open');
      yearTrigger.setAttribute('aria-expanded', String(open));
    });

    yearOptions.forEach(opt => {
      const choose = () => { setYear(opt.dataset.value); closeYear(); applyFilters(); };
      opt.addEventListener('click', choose);
      opt.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); }
      });
    });

    document.addEventListener('click', e => {
      if (!yearFilter.contains(e.target)) closeYear();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeYear();
    });
  }

  syncYearOptions();
  applyFilters();
}


/* ─── Alternance auto texte/image sur pages projet ── */
document.querySelectorAll('.p-content .p-grid').forEach((el, i) => {
  if (i % 2 === 1) el.classList.add('reverse');
});


/* ─── Parallax hero photo ─────────────────── */
const heroPhoto = document.querySelector('.hero-photo');
const heroSection = document.getElementById('hero');
if (heroPhoto && heroSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > heroSection.offsetHeight) return;
    if (!ticking) {
      requestAnimationFrame(() => {
        heroPhoto.style.transform = `scale(1.15) translateY(${-window.scrollY * 0.12}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}


/* ─── Active nav link ────────────────────── */
const p = window.location.pathname;
const currentPage = (p === '/' || p.endsWith('index.html')) ? 'index.html' : p.split('/').pop();
document.querySelectorAll('#nav .nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.style.color = 'var(--c-white)';
  }
});
