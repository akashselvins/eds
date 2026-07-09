export default function decorate(block) {
  const links = [...block.querySelectorAll('a')];

  links.forEach((link) => {
    const targetId = link.getAttribute('href').replace('#', '');
    const wrapper = link.closest('div'); // the column cell
    wrapper.classList.add('tab-item');

    link.addEventListener('click', () => {
      setActive(wrapper);
    });
  });

  // Highlight tab matching the section currently in view
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
      { rootMargin: '-40% 0px -50% 0px' }, // triggers when section is roughly centered
    );
    sections.forEach((s) => observer.observe(s));
  }

  function setActive(activeWrapper) {
    block.querySelectorAll('.tab-item').forEach((el) => el.classList.remove('active'));
    activeWrapper.classList.add('active');
  }

  // set first tab active by default
  if (links.length) links[0].closest('div').classList.add('active');
}