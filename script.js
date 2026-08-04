const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = [...document.querySelectorAll('.nav-links a')];

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});

navAnchors.forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

const revealItems = document.querySelectorAll('.reveal');
revealItems.forEach(item => {
  const delay = item.dataset.delay;
  if (delay) item.style.setProperty('--delay', `${delay}ms`);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach(item => revealObserver.observe(item));

const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    formStatus.textContent = 'Please complete the required fields.';
    formStatus.style.color = '#ffb767';
    contactForm.reportValidity();
    return;
  }
  const firstName = contactForm.elements.name.value.trim().split(' ')[0];
  formStatus.textContent = `Thanks, ${firstName}! Your personalized path request is ready.`;
  formStatus.style.color = '#63e7ad';
  contactForm.reset();
});

const chatLauncher = document.querySelector('.chat-launcher');
const chatWidget = document.querySelector('.chat-widget');
const chatClose = document.querySelector('.chat-close');
const chatForm = document.querySelector('.chat-form');
const chatInput = chatForm.querySelector('input');
const chatBody = document.querySelector('.chat-body');

function setChat(open) {
  chatWidget.classList.toggle('open', open);
  chatWidget.setAttribute('aria-hidden', String(!open));
  if (open) setTimeout(() => chatInput.focus(), 220);
}
chatLauncher.addEventListener('click', () => setChat(!chatWidget.classList.contains('open')));
chatClose.addEventListener('click', () => setChat(false));

document.querySelectorAll('.quick-replies button').forEach(button => {
  button.addEventListener('click', () => {
    chatInput.value = button.textContent;
    chatInput.focus();
  });
});

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  const bubble = document.createElement('div');
  bubble.className = 'user-message';
  bubble.textContent = message;
  chatBody.appendChild(bubble);
  chatInput.value = '';
  setTimeout(() => {
    const reply = document.createElement('div');
    reply.className = 'bot-message';
    reply.textContent = 'Great choice! I can build a beginner-friendly roadmap with lessons, quizzes, and a project.';
    chatBody.appendChild(reply);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 450);
});
