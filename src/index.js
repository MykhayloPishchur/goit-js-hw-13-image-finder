import './styles.css';
import imgService from './script/apiService';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';
import imageCard from './templates/image-card.hbs';
import basicLightbox from './script/basicLightbox';

import '../node_modules/pnotify/dist/PNotifyBrightTheme.css';

var debounce = require('lodash.debounce');

const search = document.querySelector('#search-form');
const gallery = document.querySelector('#gallery');
const loadBtn = document.querySelector('#search-btn');
const galleryItem = gallery.children;


function displayImage(e) {
  e.preventDefault();
  clearOutput();
  PNotify.closeAll();

  const inputValue = e.target.value;
  imgService.query = inputValue;

  imgService
    .fetchImages()
    .then(images => {
      if (images.total === 0) {
        PNotify.error({
          text: 'Please enter a more specific query!',
        });
        return;
      }
      console.log(images);
      createImgItem(images);
    })
    .catch(error => console.log('Error: ', error));
}

search.addEventListener('input', debounce(displayImage, 750));
loadBtn.addEventListener('click', loadMore);
gallery.addEventListener('click', basicLightbox);


function clearOutput() {
  gallery.innerHTML = '';
}

function scroll() {
  window.scrollTo({
    top: window.innerHeight + window.scrollY,
    behavior: 'smooth',
  });
}

function loadMore() {
  ++imgService.page;
  // imgService.perPage = imgService.perPage + 12;
  imgService.fetchImages().then(createImgItem).then(scroll);
}

function createImgItem(data) {
  gallery.insertAdjacentHTML('beforeend', imageCard(data.hits));
}
