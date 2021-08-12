function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getItemById(id) {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await response.json();
  const obj = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };
  const itemToCart = obj;
  const item = createCartItemElement(itemToCart);
  return document.querySelector('.cart__items').appendChild(item);
}

function addItemToCart(e) {
  const section = e.target.parentElement;
  const id = getSkuFromProductItem(section);
  getItemById(id);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.lastChild.addEventListener('click', addItemToCart);
  return section;
}

function getItemList(list) {
  const listSection = document.querySelector('.items');
  const itemList = list.results.map((item) => ({
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
    price: item.price,
  }));

  itemList.forEach((product) => {
    listSection.appendChild(createProductItemElement(product));
  });
}

function fetchItemList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => getItemList(data));
}

window.onload = () => {
  fetchItemList();
};
