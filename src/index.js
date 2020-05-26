import './styles.css';
import imgService from './script/apiService';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';
import imageCard from './templates/image-card.hbs';

import '../node_modules/pnotify/dist/PNotifyBrightTheme.css';

var debounce = require('lodash.debounce');

const search = document.querySelector('#search-form');
const gallery = document.querySelector('#gallery');
const loadBtn = document.querySelector('#search-btn');

function displayImage(e) {
  e.preventDefault();
  clearOutput();
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
      //   console.log(images)
      createImgItem(images.hits);
    })
    .catch(error => console.log('Error: ', error));
}

search.addEventListener('input', debounce(displayImage, 750));
loadBtn.addEventListener('click', loadMore);

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
  imgService.fetchImages().then(createImgItem).then(scroll);
}

function createImgItem(data) {
  const markupImages = imageCard(data);
  gallery.insertAdjacentHTML('beforeend', markupImages);
}
