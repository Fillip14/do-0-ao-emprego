import { fetchAddress } from './address.js';
const form = document.querySelector('#cep-form');
const cepInput = document.querySelector('#cep-input');
const searchBtn = document.querySelector('#search-btn');
const resultDiv = document.querySelector('#result');

const street = document.createElement('p');
const district = document.createElement('p');
const city = document.createElement('p');
const state = document.createElement('p');
const error = document.createElement('p');

//01001-000
//99999-999

const searchCep = async (cep) => {
  searchBtn.disabled = true;
  searchBtn.textContent = '...';

  try {
    const res = await fetchAddress(cep);

    error.remove();

    resultDiv.appendChild(street);
    resultDiv.appendChild(district);
    resultDiv.appendChild(city);
    resultDiv.appendChild(state);

    street.textContent = res.street;
    district.textContent = res.district;
    city.textContent = res.city;
    state.textContent = res.state;
  } catch (err) {
    street.remove();
    district.remove();
    city.remove();
    state.remove();

    resultDiv.appendChild(error);
    error.className = 'error';
    error.textContent = err.message;
  }

  searchBtn.textContent = 'Search';
  searchBtn.disabled = false;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const cep = cepInput.value;

  searchCep(cep);
});
