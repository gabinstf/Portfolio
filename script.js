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
  document.querySelectorAll('a, button, .project, .skill-tag, .contact-item, .nova-block').forEach(el => {
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


/* ─── Gallery — pause vidéos hors viewport ─── */
const galleryVideos = document.querySelectorAll('#gallery video');

if (galleryVideos.length) {
  const vObserver = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      isIntersecting ? target.play().catch(() => {}) : target.pause();
    });
  }, { threshold: 0.05 });

  galleryVideos.forEach(v => vObserver.observe(v));
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
        heroPhoto.style.transform = `scale(1.08) translateY(${-window.scrollY * 0.12}px)`;
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
