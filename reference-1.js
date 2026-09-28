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
document.querySelector('.close-modal').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
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
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
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
