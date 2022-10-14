import './css/styles.css';
import { refs } from '../src/js/refs';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from '../src/js/createMarkup';

// https://pixabay.com/api/videos/?key={ KEY }&q=yellow+flowers

import Notiflix from 'notiflix';

axios.defaults.baseURL = 'https://pixabay.com/api/'

let page = 1;
let dataQuery = '';
let totalPages = 0;

refs.form.addEventListener('submit', searchResult);
refs.gallery.addEventListener('click', getImage);

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};
const callback = async function (entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting && entry.intersectionRect.bottom > 100) {
      console.log(entry.intersectionRect)
      page += 1;
      observer.unobserve(entry.target);

      try {
        await getData();
      } catch (error) {
        console.log(error);
        Notiflix.Notify.failure(error.message, 'Error!!');
      }
    }
  });
};
const io = new IntersectionObserver(callback, options);

function reset() {
  refs.gallery.innerHTML = '';
  page = 1
}

function getImage(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'IMG') {
    return;
  }
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function searchResult(e) {
  e.preventDefault();
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  if (!searchQuery) {
    return;
  }
  dataQuery = searchQuery;
  page = 1;
  getData();
  reset();
}
async function getData() {
  const options = {
    API_KEY: 'key=30526563-3a19cb9b5f514848ef7bbd71f',
    per_page: 40,
    orientation: 'orientation=horizontal',
    imageType: 'image_type=photo',
    filterSearch: 'safesearch=true',
  }
  try {
    const response = await axios.get(`?${options.API_KEY}&q=${dataQuery}&${options.imageType}&${options.orientation}&${options.filterSearch}&page=${page}&per_page=${options.per_page}`)
    console.log(response);

    if (response.data.hits.length !== 0) {
      Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);

      const markup = createMarkup(response.data.hits)
      refs.gallery.insertAdjacentHTML('beforeend', markup);

      const target = document.querySelector('.photo-card:last-child');

      console.log(target);
      
      io.observe(target);
      lightbox.refresh();
      return;
    }

    if (response.data.hits.length < options.per_page) {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      return;
    }

    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    } 
      
    } catch (error) {
        console.log(error);
      if (error.status === 400 || error.status === 404) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      }
    }
}