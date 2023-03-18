const weatherBlock = document.querySelector('#weather');

async function loadWeather(city) {
    weatherBlock.innerHTML = loaderTemplate();

    if (!city) {
        city = 'Kyiv';
    }

    let responseResult;

    const now = Date.now() / 1000;
    const lastRequestTime = localStorage.getItem('lastRequestTime') || 0;

    if (now - lastRequestTime > 7200 || city !== localStorage.getItem('city')) {
        const server = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=9fa975a50f55cba15c61899146d93e7a`;
        const response = await fetch(server, {
            method: 'GET',
        });
        responseResult = await response.json();

        if (response.ok) {
            localStorage.setItem('weather', JSON.stringify(responseResult));
            localStorage.setItem('lastRequestTime', Date.now() / 1000);
            localStorage.setItem('city', city);
            getWeather(responseResult);
        } else {
            weatherBlock.innerHTML = responseResult.message;
        }
    } else {
        responseResult = JSON.parse(localStorage.getItem('weather'));
        getWeather(responseResult);
    }
}

let interval;
function getWeather(data) {
  weatherBlock.innerHTML = widgetTemplate({
      location: data.name,
      weatherStatus: data.weather[0].main,
      weatherIcon: data.weather[0].icon,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like)
  });
  addListeners();
}

if (weatherBlock) {
    loadWeather();
}

function loaderTemplate()
{
    return `
    <div class="weather__loading">
        <img src="../img/loading.gif" alt="Loading...">
        </div>
`;
}

function widgetTemplate(data) {
    return `
        <div>
             <form name="publish">
                 <input type="text" id="city-id" name="message" placeholder="Введите название города на ангийском">
                 <button id="btn" type="submit">Search</button>
            </form>
        </div>
        <div class="weather__header">
            <div class="weather__main">
                <div class="weather__city">${data.location}</div>
                <div class="weather__status">${data.weatherStatus}</div>
            </div>
            <div class="weather__icon">
                <img src="http://openweathermap.org/img/w/${data.weatherIcon}.png" alt="${data.weatherStatus}">
            </div>
        </div>
        <div class="weather__temp">${data.temp}</div>
        <div class="weather__feels-like">Feels like : ${data.feelsLike}</div>
`;
}

function addListeners() {
    const btn = document.getElementById('btn');
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        let city = document.getElementById("city-id").value;
        await loadWeather(city);
    })
}


