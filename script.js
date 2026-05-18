/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   WORKBYGABIN.COM — script.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

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


/* ─── Active nav link ────────────────────── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('#nav .nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.style.color = 'var(--c-white)';
  }
});
