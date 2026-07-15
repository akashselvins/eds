import { decorateIcons } from '../../scripts/aem.js';

function closeAll() {
  document.querySelectorAll('.mega-panel').forEach((panel) => {
    panel.classList.remove('is-open');
  });

  document.querySelectorAll('.nav-item-trigger').forEach((link) => {
    link.classList.remove('active');
    link.setAttribute('aria-expanded', 'false');
  });
}

function openPanel(link) {
  const target = link.getAttribute('href');

  if (!target || !target.startsWith('#')) {
    return;
  }

  const panel = document.querySelector(target);

  if (!panel) {
    return;
  }

  closeAll();

  panel.classList.add('is-open');
  link.classList.add('active');
  link.setAttribute('aria-expanded', 'true');
}

export default function decorate(block) {
  decorateIcons(block);

  const rows = [...block.children];

  const logoRow = rows.find((row) => row.querySelector('picture, img'));

  const menuRows = rows.filter((row) => row !== logoRow);

  block.textContent = '';

  const nav = document.createElement('nav');
  nav.className = 'nav-wrapper';

  /* ---------- Brand ---------- */

  if (logoRow) {
    const brand = document.createElement('a');
    brand.className = 'nav-brand';

    const link =
      logoRow.querySelector('a')?.getAttribute('href') || '/';

    brand.href = link;

    const media = logoRow.querySelector('picture, img');

    if (media) {
      brand.append(media);
    }

    const title = document.createElement('span');
    title.className = 'nav-brand-text';
    title.textContent = 'TOYOTA';

    brand.append(title);

    nav.append(brand);
  }

  /* ---------- Menu ---------- */

  const menu = document.createElement('ul');
  menu.className = 'nav-menu';
    menuRows.forEach((row) => {
    const cells = [...row.children];

    if (!cells.length) return;

    const labelCell = cells[0];

    const label =
      labelCell.textContent.trim();

    if (!label) return;

    const link =
      labelCell.querySelector('a');

    const href =
      link?.getAttribute('href') || '#';

    const item = document.createElement('li');
    item.className = 'nav-item';

    if (/^account$/i.test(label)) {
      item.classList.add('nav-item-account');
    }

    const trigger = document.createElement('a');
    trigger.className = 'nav-item-trigger';
    trigger.href = href;
    trigger.textContent = label;

    if (href.startsWith('#')) {
      trigger.setAttribute('aria-expanded', 'false');

      trigger.addEventListener('click', (e) => {
        e.preventDefault();

        const panel = document.querySelector(href);

        if (!panel) {
          return;
        }

        if (panel.classList.contains('is-open')) {
          closeAll();
        } else {
          openPanel(trigger);
        }
      });
    }

    /* Account icon */

    if (/^account$/i.test(label)) {
      trigger.classList.add('nav-item-trigger-account');

      const icon = document.createElement('span');
      icon.className = 'nav-item-icon';

      trigger.prepend(icon);
    }

    item.append(trigger);

    menu.append(item);
  });

  nav.append(menu);

  block.append(nav);
    /* ------------------------------
     Close when clicking outside
  ------------------------------ */

  document.addEventListener('click', (e) => {
    const insideNav = nav.contains(e.target);

    const insidePanel = [...document.querySelectorAll('.mega-panel')]
      .some((panel) => panel.contains(e.target));

    if (!insideNav && !insidePanel) {
      closeAll();
    }
  });

  /* ------------------------------
     ESC closes all panels
  ------------------------------ */

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAll();
    }
  });

  /* ------------------------------
     Keyboard Support
  ------------------------------ */

  menu.querySelectorAll('.nav-item-trigger').forEach((link) => {
    link.addEventListener('keydown', (e) => {
      if (
        e.key === 'Enter' ||
        e.key === ' '
      ) {
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          openPanel(link);
        }
      }
    });
  });
}