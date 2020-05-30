import './styles.css';
import imgService from './script/apiService';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';
import imageCard from './templates/image-card.hbs';
import 'basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from 'basiclightbox';

import '../node_modules/pnotify/dist/PNotifyBrightTheme.css';

var debounce = require('lodash.debounce');

const search = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('#search-btn');

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

      if (images.totalHits > imgService.page * imgService.perPage) {
        loadBtn.style.display = 'block';
      }
    })
    .catch(error => console.log('Error: ', error));
}

search.addEventListener('input', debounce(displayImage, 750));
loadBtn.addEventListener('click', loadMore);
gallery.addEventListener('click', openModal);

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
  imgService
    .fetchImages()
    .then(data => {
      createImgItem(data);
      let totalDisplayedImg = imgService.page * imgService.perPage;
      if (data.totalHits < totalDisplayedImg) {
        loadBtn.style.display = 'none';
      }
      console.log(totalDisplayedImg);
    })
    .then(scroll);
}

function createImgItem(data) {
  gallery.insertAdjacentHTML('beforeend', imageCard(data.hits));
}

function openModal(e) {
  console.log(e.target.dataset);
  if (e.target.nodeName === 'IMG') {
    const largeImageURL = e.target.dataset.largeimg;
    basicLightbox.create(`<img src="${largeImageURL}">`).show();
  } else return;
}
