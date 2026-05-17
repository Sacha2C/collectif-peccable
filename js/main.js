/* ── Nav scroll effect ── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Mobile menu ── */
const toggleBtn = document.querySelector('.nav__toggle');
const mobileMenu = document.querySelector('.nav__mobile');
const closeBtn = document.querySelector('.nav__mobile-close');

toggleBtn?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
  document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
});
closeBtn?.addEventListener('click', () => {
  mobileMenu?.classList.remove('open');
  document.body.style.overflow = '';
});
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Active nav link ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── Accordion ── */
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const body = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');
    document.querySelectorAll('.accordion-btn').forEach(b => {
      b.classList.remove('open');
      b.nextElementSibling?.classList.remove('open');
    });
    if (!isOpen) {
      btn.classList.add('open');
      body?.classList.add('open');
    }
  });
});

/* ── Fade-up on scroll (IntersectionObserver) ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'none';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0 });

document.querySelectorAll('[data-reveal]').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  observer.observe(el);
});

/* ── Idea box form ── */
const ideaForm = document.getElementById('idea-form');
ideaForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = ideaForm.querySelector('[type="submit"]');
  btn.textContent = 'Envoi…';
  btn.disabled = true;
  try {
    const res = await fetch('https://formspree.io/f/mqejzvpn', {
      method: 'POST',
      body: new FormData(ideaForm),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      btn.textContent = 'Idée envoyée ✓';
      btn.style.background = '#1A4028';
      setTimeout(() => {
        ideaForm.reset();
        btn.textContent = 'Envoyer l\'idée →';
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    } else {
      btn.textContent = 'Erreur — réessaie';
      btn.disabled = false;
    }
  } catch {
    btn.textContent = 'Erreur — réessaie';
    btn.disabled = false;
  }
});

/* ── Application form ── */
const appForm = document.getElementById('application-form');
appForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = appForm.querySelector('[type="submit"]');
  btn.textContent = 'Envoi…';
  btn.disabled = true;
  try {
    const res = await fetch('https://formspree.io/f/mlgvryjv', {
      method: 'POST',
      body: new FormData(appForm),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      btn.textContent = "Candidature reçue — on verra si t'es à la hauteur";
    } else {
      btn.textContent = 'Erreur — réessaie';
      btn.disabled = false;
    }
  } catch {
    btn.textContent = 'Erreur — réessaie';
    btn.disabled = false;
  }
});

/* ── Score counter (recrutement) ── */
function updateScore() {
  const checked = document.querySelectorAll('.criterion-check:checked');
  let score = 0;
  checked.forEach(c => score += parseInt(c.dataset.pts || 0));
  const scoreEl = document.getElementById('live-score');
  if (scoreEl) scoreEl.textContent = score;
  const verdictEl = document.getElementById('score-verdict');
  if (verdictEl) {
    if (score === 0) verdictEl.textContent = 'Coche les cases pour voir ton verdict.';
    else if (score < 30) verdictEl.textContent = 'Pas encore Peccable. Reprends la rando.';
    else if (score < 50) verdictEl.textContent = 'Du potentiel. À confirmer sur le terrain.';
    else if (score < 70) verdictEl.textContent = 'Plutôt Peccable. Le dossier mérite d\'être ouvert.';
    else if (score < 90) verdictEl.textContent = 'Clairement Peccable. Envoie ta candidature.';
    else verdictEl.textContent = 'Tu mens probablement. Mais on t\'aime quand même.';
  }
}
document.querySelectorAll('.criterion-check').forEach(c => {
  c.addEventListener('change', updateScore);
});
