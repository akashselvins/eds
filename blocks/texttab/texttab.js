export default function decorate(block) {
  const links = [...block.querySelectorAll('a')];

  links.forEach((link) => {
    const wrapper = link.closest(':scope > div, div');
    wrapper.classList.add('tab-item');

    link.addEventListener('click', (e) => {
      e.preventDefault();
      setActive(wrapper);
      const targetId = link.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const tabsHeight = block.offsetHeight;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - tabsHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  const sections = links
    .map((l) => ({
      id: l.getAttribute('href').replace('#', ''),
      el: document.getElementById(l.getAttribute('href').replace('#', '')),
      link: l,
    }))
    .filter((s) => s.el);

  function setActive(activeWrapper) {
    block.querySelectorAll('.tab-item').forEach((el) => el.classList.remove('active'));
    activeWrapper.classList.add('active');
  }

  function updateActiveOnScroll() {
    const tabsHeight = block.offsetHeight;
    const scrollPos = window.scrollY + tabsHeight + 10;

    let current = sections[0];
    sections.forEach((s) => {
      if (s.el.offsetTop <= scrollPos) {
        current = s;
      }
    });

    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 5;
    if (atBottom) {
      current = sections[sections.length - 1];
    }

    if (current) {
      setActive(current.link.closest('div'));
    }
  }

  const placeholder = document.createElement('div');
  placeholder.className = 'texttab-placeholder';
  block.parentNode.insertBefore(placeholder, block);

  const originalOffsetTop = block.getBoundingClientRect().top + window.scrollY;

  function updateFixedState() {
    const tabsHeight = block.offsetHeight;
    if (window.scrollY >= originalOffsetTop) {
      block.classList.add('is-fixed');
      block.style.width = `${block.parentNode.offsetWidth}px`;
      placeholder.style.height = `${tabsHeight}px`;
      placeholder.classList.add('is-active');
    } else {
      block.classList.remove('is-fixed');
      block.style.width = '';
      placeholder.classList.remove('is-active');
    }
  }

  window.addEventListener('scroll', () => {
    updateFixedState();
    updateActiveOnScroll();
  }, { passive: true });

  window.addEventListener('resize', updateFixedState);

  updateFixedState();
  updateActiveOnScroll();
}