const menuButton = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
const header = document.querySelector('[data-header]');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 }) : null;

document.querySelectorAll('.reveal').forEach(el => {
  if (observer) observer.observe(el);
  else el.classList.add('in');
});

// Highlight the section currently visible in the main navigation.
const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')]
  .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter(item => item.section);

if ('IntersectionObserver' in window && sectionLinks.length) {
  const navObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach(({ link, section }) => {
      if (section === visible.target) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .2, .45] });
  sectionLinks.forEach(({ section }) => navObserver.observe(section));
}
