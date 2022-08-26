const init = async () => {
  let city = document.querySelector('input').value;

  if (!city) return;

  let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  let d = await fetch(url).then(data => data.json());



  document.querySelector('#current-container').innerHTML = `
    <h2>
      ${city} (${new Date(d.list[0].dt * 1000).toDateString()})
    </h2>
      <img src="http://openweathermap.org/img/wn/${d.list[0].weather[0].icon}@2x.png">

      <p>Temp: ${d.list[0].main.temp}</p>
      <p>Wind: ${d.list[0].wind.speed}</p>
      <p>Humidity: ${d.list[0].main.humidity}</p>`;

  let forecast = document.getElementById('five-day-container');

  for (let i = 7; i < d.list.length; i = i + 7) {

    forecast.innerHTML += `
    <div class="card">
      <h3>${new Date(d.list[i].dt * 1000).toDateString()}</h3>

      <img src="http://openweathermap.org/img/wn/${d.list[i].weather[0].icon}@2x.png">

      <p>Temp: ${d.list[i].main.temp}</p>
      <p>Wind: ${d.list[i].wind.speed} m/h</p>
      <p>Humidity: ${d.list[i].main.humidity}</p> 
    </div>`;
  };
};

document.querySelector('button').addEventListener('click', init);