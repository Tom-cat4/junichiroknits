/* ========================================
   post.js — Blog Post Interactive Features
   ======================================== */

// --- Reading Progress Bar ---
const progressBar = document.getElementById('readingProgress');
window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = ((window.scrollY / total) * 100) + '%';
}, { passive: true });

// --- Back to Top ---
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopBtn?.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// --- Generic Fade-in on Scroll ---
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => fadeObserver.observe(el));

// --- Animated Route Timeline ---
const timelineSection = document.getElementById('route');
const routeStops = document.querySelectorAll('.route-stop');
const branchGroup = document.querySelector('.route-branch-group');
const roadTripBadge = document.querySelector('.route-road-trip-badge');

if (timelineSection) {
  const tlObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Stagger each stop appearing
      routeStops.forEach((stop, i) => {
        setTimeout(() => stop.classList.add('visible'), i * 200);
      });
      if (branchGroup) setTimeout(() => branchGroup.classList.add('visible'), 250);
      if (roadTripBadge) setTimeout(() => roadTripBadge.classList.add('visible'), 1000);
      tlObserver.disconnect();
    }
  }, { threshold: 0.2 });
  tlObserver.observe(timelineSection);
}

// --- Before/After Sliders (Sound of Music) ---
document.querySelectorAll('.before-after-slider').forEach(slider => {
  const afterEl = slider.querySelector('.ba-after');
  const handle  = slider.querySelector('.ba-handle');
  let dragging = false;

  function setPos(clientX) {
    const rect = slider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(3, Math.min(97, pct));
    afterEl.style.clipPath = `inset(0 0 0 ${pct}%)`;
    handle.style.left = pct + '%';
  }

  slider.addEventListener('mousedown',  (e) => { dragging = true; setPos(e.clientX); e.preventDefault(); });
  slider.addEventListener('touchstart', (e) => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mousemove',  (e) => { if (dragging) setPos(e.clientX); });
  window.addEventListener('touchmove',  (e) => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mouseup',  () => { dragging = false; });
  window.addEventListener('touchend', () => { dragging = false; });
});

// --- Luxembourg Reveal Game ---
document.querySelectorAll('.lux-guess-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.answer === 'wrong') {
      btn.classList.add('wrong-answer');
      setTimeout(() => btn.classList.remove('wrong-answer'), 600);
    } else {
      btn.classList.add('right-answer');
      document.querySelectorAll('.lux-guess-btn').forEach(b => {
        if (b !== btn) { b.style.opacity = '0.35'; b.style.pointerEvents = 'none'; }
      });
      const reveal = document.getElementById('luxReveal');
      if (reveal) {
        reveal.classList.add('visible');
        setTimeout(() => reveal.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      }
    }
  });
});

// --- Lightbox ---
const lightbox   = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

const zoomableSelectors = [
  '.trip-photo-grid img',
  '.trier-grid img',
  '.cologne-grid img',
  '.cologne-feature',
  '.berchtesgaden-gallery img',
  '.hallstatt-grid img',
  '.hallstatt-hero',
  '.rothenburg-grid img',
  '.salzburg-extras img',
  '.standby-grid img',
  '.dahenfeld-img img',
  '.amsterdam-grid img',
  '.lux-extras img',
  '.friends-flashback img',
].join(', ');

document.querySelectorAll(zoomableSelectors).forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

// --- Parallax Hero ---
const heroBg = document.querySelector('.post-hero-bg');
window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.18}px)`;
  }
}, { passive: true });
