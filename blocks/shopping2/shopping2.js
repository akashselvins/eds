export default async function decorate(block) {
  const shopLink = document.querySelector('a[href="#shopping2"]');
  const shopSection = document.querySelector('#shopping2');

  if (!shopLink || !shopSection) {
    return;
  }

  // Hide initially
  shopSection.classList.remove('shop-open');

  // Open / Close dropdown
  shopLink.addEventListener('click', (e) => {
    e.preventDefault();
    shopSection.classList.toggle('shop-open');
    shopLink.classList.toggle('active');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const clickInsideDropdown = shopSection.contains(e.target);
    const clickOnShop = shopLink.contains(e.target);

    if (!clickInsideDropdown && !clickOnShop) {
      shopSection.classList.remove('shop-open');
      shopLink.classList.remove('active');
    }
  });
}