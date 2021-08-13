function setLS() {
  const cart = document.querySelector('.cart');
  localStorage.setItem('cart', JSON.stringify(cart.innerHTML));
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const totalPrice = document.getElementsByClassName('total-price')[0];
  const targetPrice = event.target.innerText.split('$')[1];
  totalPrice.innerText = Number(totalPrice.innerText) - Number(targetPrice);
  event.target.remove();
  setLS();
}

function getLS() {
  const cartContent = localStorage.getItem('cart');
  if (cartContent) {
    const cart = document.querySelector('.cart');
    cart.innerHTML = JSON.parse(cartContent);
    const lis = document.querySelectorAll('.cart__item');
    lis.forEach((li) => {
      li.addEventListener('click', cartItemClickListener);
    });
  }
}

function addLoading() {
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerText = 'loading...';
  document.getElementsByClassName('container')[0].appendChild(span);
}

function removeLoading() {
  const span = document.querySelector('.loading');
  span.remove();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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
  document.querySelector('.cart__items').appendChild(item);
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = Number(totalPrice.innerHTML) + obj.salePrice;
  setLS();
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
  
  removeLoading();
}

// esse é o famoso 'na minha maquina passa'
function fetchItemList() {
  addLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => getItemList(data));
}

function clearCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    document.querySelector('.total-price').innerHTML = 0;
    setLS();
  });
}

window.onload = () => {
  getLS();
  fetchItemList();
  clearCart();
};
