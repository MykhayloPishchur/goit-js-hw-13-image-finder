import * as basicLightbox from 'basiclightbox';

export default function openModal(e) {
  e.preventDefault();
  console.log(e.target)

  const imgUrl = e.target.largeImageURL;
  const instance = basicLightbox.create(`
    <img src="${imgUrl}" width="1280" >
`);
  instance.show();
}
