import _ from 'lodash';
import Notiflix from 'notiflix';
import './sass/styles.scss';

const DEBOUNCE_DELAY = 300;

import { fetchCountries } from './fetchCountries';

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

const fetchCountry = () => {
  const countryName = refs.searchBox.value.trim();
  if (countryName) {
    fetchCountries(countryName)
      .then(countries => {
        refs.countryListEl.innerHTML = '';
        refs.countryInfoEl.innerHTML = '';

        if (countries.length > 10)
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        if (countries.length >= 2 && countries.length <= 10) {
          showMatchedCountries(countries);
        }
        if (countries.length === 1) {
          showMatchedCountry(countries[0]);
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
};

const debouncedFetchCountry = _.debounce(fetchCountry, DEBOUNCE_DELAY);

refs.searchBox.addEventListener('input', debouncedFetchCountry);

const showMatchedCountries = countries => {
  let countriesList = '';

  countries.forEach(country => {
    countriesList += `<li class="country-list__item"><img class="country-list__flag" src="${country.flags.svg}"><p class="country-list__name">${country.name.common}<p></li>`;
  });
  refs.countryListEl.innerHTML = countriesList;
};

const showMatchedCountry = country => {
  const {
    name: { official: countryName },
    flags: { svg: countryFlagURL },
    capital,
    population,
    languages,
  } = country;

  const countryCard = `
    <section class="country">
      <h1 class="country__title">
        <img class="country__flag" src="${countryFlagURL}">
        <p class="country__name">${countryName}<p>
      </h1>
      <ul class="country__list">
        <li class="country__list-item"><p><strong>Capital:</strong> ${capital}</p></li>
        <li class="country__list-item"><p><strong>Population:</strong> ${population}</p></li>
        <li class="country__list-item"><p><strong>Languages:</strong> ${Object.values(
          languages
        ).join(', ')}</p></li>
      </ul>
    </section>
  `;

  refs.countryInfoEl.innerHTML = countryCard;
};
