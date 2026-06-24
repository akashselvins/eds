import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Build a semantic list of cards with clearer classes and accessibility
  const ul = document.createElement('ul');
  ul.className = 'cards';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-item';

    // move children from the original row into the list item
    while (row.firstElementChild) li.append(row.firstElementChild);

    // normalize card children: image wrapper vs body wrapper
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';

        // ensure image is wrapped in a figure for semantics
        const pic = div.querySelector('picture');
        if (pic) {
          const figure = document.createElement('figure');
          figure.className = 'cards-figure';
          pic.replaceWith(figure);
          figure.append(pic);
        }
      } else {
        div.className = 'cards-card-body';

        // promote the first paragraph/strong to a heading if appropriate
        const heading = div.querySelector('h1,h2,h3,h4,h5,h6');
        if (heading) {
          heading.classList.add('cards-title');
        } else {
          const strong = div.querySelector('strong,b');
          if (strong) {
            const h = document.createElement('h3');
            h.className = 'cards-title';
            h.innerHTML = strong.innerHTML;
            strong.replaceWith(h);
          } else {
            const p = div.querySelector('p');
            if (p) {
              const h = document.createElement('h3');
              h.className = 'cards-title';
              h.innerHTML = p.innerHTML;
              div.replaceChild(h, p);
            }
          }
        }
      }
    });

    ul.append(li);
  });

  // Replace images with optimized pictures
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
    const pic = img.closest('picture');
    if (pic) pic.replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
