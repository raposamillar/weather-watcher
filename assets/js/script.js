let store = eval(localStorage.cities) || [];

const handleStore = city => {
  document.querySelector('input').value = city;
  init();
};

const updateHistory = () => {
  if (store.length) {
    document.querySelector('.history').innerHTML = '';

    store.forEach(city => {
      document.querySelector('.history').innerHTML += `<button onclick = "handleStore('${city}')"> ${city}</button>`
    });
  }
};

updateHistory();

const init = async () => {
  let city = document.querySelector('input').value;

  let latLonUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  let latLon = await fetch(latLonUrl).then(data => data.json());
  let { lat, lon } = latLon[0];
  let uvUrl = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  uvi = await fetch(uvUrl).then(data => data.json());

  if (!city) return;

  let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  let d = await fetch(url).then(data => data.json());

  if (!store.includes(city)) store.push(city);
  localStorage.cities = JSON.stringify(store);
  updateHistory();

  document.querySelector('#current-container').innerHTML = `
    <h2>
      ${city} (${new Date(d.list[0].dt * 1000).toDateString()})
    </h2>
      <img src="http://openweathermap.org/img/wn/${d.list[0].weather[0].icon}@2x.png">

      <p>Temp: ${d.list[0].main.temp}&deg;</p>
      <p>Wind: ${d.list[0].wind.speed} mph</p>
      <p>Humidity: ${d.list[0].main.humidity}&percnt;</p>
      <p class = "${uvi.value < 3 ? 'favorable' : uvi.value < 8 ? 'moderate' : 'severe'}">UV Index: ${uvi.value}</p>`;

  let forecast = document.getElementById('five-day-container');
  forecast.innerHTML = '';

  for (let i = 0; i < d.list.length; i = i + 8) {

    forecast.innerHTML += `
    <div class="card">
      <h3>${new Date(d.list[i].dt * 1000).toDateString()}</h3>

      <img src="http://openweathermap.org/img/wn/${d.list[i].weather[0].icon}@2x.png">

      <p>Temp: ${d.list[i].main.temp}&deg;</p>
      <p>Wind: ${d.list[i].wind.speed} mph</p>
      <p>Humidity: ${d.list[i].main.humidity}&percnt;</p> 
    </div>`;
  };
};


document.querySelector('button').addEventListener('click', init);
