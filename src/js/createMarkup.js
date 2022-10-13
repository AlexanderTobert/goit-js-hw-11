export function createMarkup(photos) {
  const markupGallery = photos
    .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => {
      return `<div class="photo-card">
        <a href="${largeImageURL}"><img class='photo-card__img' src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
        <div class="info">
            <p class="info-item">
              <b>Likes</b><br>${likes}
            </p>
            <p class="info-item">
              <b>Views</b><br>${views}
            </p>
            <p class="info-item">
              <b>Comments</b><br>${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b><br>${downloads}
            </p>
        </div>
  </div>`;
    })
    .join('');
  return markupGallery;
}