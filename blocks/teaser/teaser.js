import { createOptimizedPicture } from '../../scripts/aem.js';

const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function optimizeImage(picture) {
  const img = picture.querySelector('img');
  if (!img?.src) return picture;

  const optimized = createOptimizedPicture(
    img.src,
    img.alt || '',
    false,
    [
      { media: '(min-width: 900px)', width: '1200' },
      { width: '750' },
    ],
  );
  optimized.className = picture.className;
  return optimized;
}

function addPointerEffect(item) {
  if (!pointerQuery.matches || motionQuery.matches) return;

  let frame;
  item.addEventListener('pointermove', (event) => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = item.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;

      item.style.setProperty('--teaser-pointer-x', `${x * 100}%`);
      item.style.setProperty('--teaser-pointer-y', `${y * 100}%`);
      item.style.setProperty('--teaser-rotate-x', `${(0.5 - y) * 2}deg`);
      item.style.setProperty('--teaser-rotate-y', `${(x - 0.5) * 2}deg`);
    });
  });

  item.addEventListener('pointerleave', () => {
    if (frame) cancelAnimationFrame(frame);
    item.style.removeProperty('--teaser-pointer-x');
    item.style.removeProperty('--teaser-pointer-y');
    item.style.removeProperty('--teaser-rotate-x');
    item.style.removeProperty('--teaser-rotate-y');
  });
}

function decorateItem(row, index) {
  const item = document.createElement('article');
  item.className = 'teaser-item';
  item.style.setProperty('--teaser-index', index);

  const columns = [...row.children];
  const imageColumn = columns.find((column) => column.querySelector('picture'));
  const picture = imageColumn?.querySelector('picture');

  if (picture) {
    const media = document.createElement('div');
    const figure = document.createElement('figure');
    media.className = 'teaser-media';
    figure.className = 'teaser-figure';

    picture.replaceWith(optimizeImage(picture));
    figure.append(imageColumn.querySelector('picture'));
    media.append(figure);
    item.append(media);
  } else {
    item.classList.add('teaser-item-no-image');
  }

  const content = document.createElement('div');
  content.className = 'teaser-content';

  columns.forEach((column) => {
    while (column.firstChild) content.append(column.firstChild);
  });

  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  heading?.classList.add('teaser-title');

  const kicker = heading?.previousElementSibling;
  if (kicker?.matches('p') && !kicker.querySelector('a, picture')) {
    kicker.classList.add('teaser-kicker');
  }

  content.querySelectorAll('a.button').forEach((link) => {
    link.classList.add('teaser-cta');
    const arrow = document.createElement('span');
    arrow.className = 'teaser-cta-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    link.append(arrow);
  });

  item.append(content);
  addPointerEffect(item);
  return item;
}

/**
 * Decorates an editorial teaser.
 * Expected authoring: one row per teaser with an image column and a content column.
 * @param {Element} block The teaser block element
 */
export default function decorate(block) {
  const items = [...block.children].map(decorateItem);
  block.replaceChildren(...items);

  if (!('IntersectionObserver' in window) || motionQuery.matches) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
}
