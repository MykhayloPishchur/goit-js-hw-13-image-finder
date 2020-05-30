import * as basicLightbox from 'basiclightbox';

export default function openModal(e) {
  console.log(e.target);
  if (e.target.nodeName === 'IMG') {
    const largeImageURL = e.target.dataset.large;
    basicLightbox.create(`<img  src="${largeImageURL}">`).show();
  } else return;
}
