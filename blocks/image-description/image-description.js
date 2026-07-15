/**
 * Decorates an image with its accompanying description.
 * Expected authoring: one row per item, with an image in the first column and
 * descriptive content in the second column.
 * @param {Element} block The image description block element
 */
export default function decorate(block) {
  const items = [...block.children].map((row) => {
    const item = document.createElement('article');
    item.className = 'image-description-item';

    const columns = [...row.children];
    const imageColumn = columns.find((column) => column.querySelector('picture, img'));

    if (imageColumn) {
      const media = document.createElement('div');
      media.className = 'image-description-media';
      while (imageColumn.firstChild) media.append(imageColumn.firstChild);
      item.append(media);
    }

    const content = document.createElement('div');
    content.className = 'image-description-content';
    columns.filter((column) => column !== imageColumn).forEach((column) => {
      while (column.firstChild) content.append(column.firstChild);
    });

    if (content.childNodes.length) item.append(content);
    return item;
  });

  block.replaceChildren(...items);
}
