const dialog = document.querySelector('#inquiry');
const form = document.querySelector('#inquiry-form');
const status = document.querySelector('#form-status');
document.querySelectorAll('[data-inquiry]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.topic) form.elements.message.value = button.dataset.topic;
    status.textContent = '';
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
});
let closing = false;
function closeDialog() {
  if (closing) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { dialog.close(); return; }
  closing = true;
  dialog.classList.add('is-closing');
  window.setTimeout(() => { dialog.close(); dialog.classList.remove('is-closing'); closing = false; }, 300);
}
document.querySelector('.close-modal').addEventListener('click', closeDialog);
dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeDialog();
});
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
form.addEventListener('submit', event => {
  event.preventDefault();
  const values = new FormData(form);
  const body = `Имя: ${values.get('name')}\nТелефон: ${values.get('phone')}\n\nЗадача: ${values.get('message') || 'Подбор системы кондиционирования'}`;
  window.location.href = `mailto:info@satsvyaz.ru?subject=${encodeURIComponent('Заявка на систему кондиционирования')}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Заявка подготовлена. Отправьте её в почтовой программе. Если она не открылась, свяжитесь с нами: 8 800 555-69-92.';
});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  document.querySelectorAll('.clients > span, .tags > span').forEach(element => element.classList.add('reveal'));
  document.querySelectorAll('.solutions-grid, .price-grid, .facts-grid, .clients, .tags').forEach(group => {
    [...group.children].forEach((element, index) => element.style.setProperty('--reveal-delay', `${index * 100}ms`));
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -25px 0px" });
  document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('pending');
    observer.observe(element);
  });
}
const progress = document.querySelector('.scroll-progress');
let scheduled = false;
function updateProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// Small scroll-linked motion, without replacing native scrolling.
const hero = document.querySelector('.hero');
const heroWord = document.querySelector('.hero-word');
let motionFrame = 0;
let currentOffset = 0;
let lastFrame = 0;
function animateHero(time) {
  const target = reducedMotion.matches ? 0 : Math.min(window.scrollY, hero.offsetHeight) * .13;
  const elapsed = lastFrame ? Math.min(time - lastFrame, 50) : 16;
  lastFrame = time;
  currentOffset += (target - currentOffset) * (1 - Math.exp(-elapsed / 130));
  heroWord.style.setProperty('--word-y', `${currentOffset.toFixed(2)}px`);
  if (Math.abs(target - currentOffset) > .1) motionFrame = requestAnimationFrame(animateHero);
  else { motionFrame = 0; lastFrame = 0; }
}
function requestMotion() { if (!motionFrame) motionFrame = requestAnimationFrame(animateHero); }
window.addEventListener('scroll', requestMotion, { passive:true });
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) document.querySelectorAll('.pending').forEach(el => el.classList.remove('pending'));
  requestMotion();
});
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.solution').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - rect.top) / rect.height) * 5}deg`);
    card.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - 0.5) * 5}deg`);
  });
  card.addEventListener('pointerleave', () => { card.style.setProperty('--tilt-x','0deg'); card.style.setProperty('--tilt-y','0deg'); });
});
