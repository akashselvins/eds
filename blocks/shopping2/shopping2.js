export default function decorate(block) {
  console.log('SHOPPING2 LOADED');
  block.style.border = '5px solid red';
  block.innerHTML = '<h1>SHOPPING2 WORKS</h1>';
}