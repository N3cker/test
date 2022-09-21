import { setTimeElements } from './additions';
import { responseFiveDays, responseFiveDaysMore } from './apiFiveDays';
import { getData } from './chart';
import { getTodayDataByLocation } from './location';
import {
  show5daysElements,
  show5daysMore,
  showTodayElements,
} from './navigation';
import { addCityKey } from './searchCity';
import { getTodayData, printTemperatures } from './todayTemperatures';
import { getCity, setCity } from './variables';

const form = document.querySelector('#search__form');
const inputCity = document.querySelector('[name="searchQuery"]');
const btnToday = document.querySelector("button[class='todaybtn']");
const btn5days = document.querySelector("button[class='fivedaysbtn']");
const btnTodayFrom5days = document.querySelector("button[class='today-btn']");
const btn5daysFrom5days = document.querySelector(
  "button[class='five-days-btn']"
);
const locationBtn = document.querySelector('#btn-location');

async function setTodayPage(city) {
  setCity(city); //ustawienie city do zmiennej globalnej
  const data = await getTodayData(getCity()); //pobranie danych z API
  showTodayElements(); //pokazanie/schowanie odpowiednich elementów interfejsu
  await printTemperatures(data); //ustawienie dziennej pogody
  await setTimeElements(data); //ustawienie elementów czasu
  addCityKey(); //dodanie miasta do karuzeli
}

export function setTodayPageByLocation() {
  let promiseData = getTodayDataByLocation();
  promiseData
    .then(data => {
      showTodayElements(); //pokazanie/schowanie odpowiednich elementów interfejsu
      printTemperatures(data); //ustawienie dziennej pogody
      setTimeElements(data); //ustawienie elementów czasu
      addCityKey(); //dodanie miasta do karuzeli
    })
    .catch(error => Notiflix.Notify.failure(error));
}

async function set5daysPage() {
  show5daysElements(); //pokazanie/schowanie odpowiednich elementów inferfejsu
  await responseFiveDays(); //wywołanie API 5 dni
  const moreInfos = document.getElementsByClassName('more-info');
  [...moreInfos].forEach(element => {
    element.addEventListener('click', () => {
      set5daysMore(element.getAttribute('name'));
    });
  });
  // await getData(); //przygotowanie danych do chartow
}

async function set5daysMore(dt) {
  await responseFiveDaysMore(dt);
  show5daysMore();
}

form.addEventListener('submit', e => {
  //search
  e.preventDefault();
  const city = inputCity.value.trim();
  setTodayPage(city);
});

btnToday.addEventListener('click', () => {
  //refresh today
  setTodayPage(getCity());
});
btnTodayFrom5days.addEventListener('click', () => {
  setTodayPage(getCity());
});

btn5days.addEventListener('click', () => {
  set5daysPage();
});
btn5daysFrom5days.addEventListener('click', () => {
  //refresh 5 days
  set5daysPage();
});

document
  .querySelector('.search__history-list')
  .addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const cityName = e.target.textContent;
      setTodayPage(cityName);
    }
  });

locationBtn.addEventListener('click', setTodayPageByLocation);
