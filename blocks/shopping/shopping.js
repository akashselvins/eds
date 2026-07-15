export default async function decorate(block) {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    const targetId = link.getAttribute('href');
    const section = document.querySelector(targetId);

    if (!section) return;

    section.classList.remove('shop-open');

    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Close all sections
      document.querySelectorAll('.shop-open').forEach((panel) => {
        panel.classList.remove('shop-open');
      });

      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.classList.remove('active');
      });

      // Open current section
      section.classList.add('shop-open');
      link.classList.add('active');
    });
  });

  document.addEventListener('click', (e) => {
    const clickedLink = e.target.closest('a[href^="#"]');
    const clickedPanel = e.target.closest('.mega-panel');

    if (!clickedLink && !clickedPanel) {
      document.querySelectorAll('.shop-open').forEach((panel) => {
        panel.classList.remove('shop-open');
      });

      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.classList.remove('active');
      });
    }
  });
}