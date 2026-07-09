export default function decorate(block) {
  const links = [...block.querySelectorAll('a')];

  links.forEach((link) => {
    const wrapper = link.closest(':scope > div, div'); // the row itself
    wrapper.classList.add('tab-item');

    link.addEventListener('click', () => {
      setActive(wrapper);
    });
  });

  const sections = links
    .map((l) => document.getElementById(l.getAttribute('href').replace('#', '')))
    .filter(Boolean);

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = links.find(
              (l) => l.getAttribute('href') === `#${entry.target.id}`,
            );
            if (match) setActive(match.closest('div'));
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
  }

  function setActive(activeWrapper) {
    block.querySelectorAll('.tab-item').forEach((el) => el.classList.remove('active'));
    activeWrapper.classList.add('active');
  }

  if (links.length) links[0].closest('div').classList.add('active');
}