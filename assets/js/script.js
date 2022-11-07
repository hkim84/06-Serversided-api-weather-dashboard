// 1.Search for city
// 2. present condition of weather current and futer
// 3. add city to history
// 4. current weather conditions for that city
// 5. city name, the date, an icon representation of weather conditions, 
// 6. temperature, the humidity, the wind speed, and the UV index
// 7. I view the UV index
// 8. presented with a color that indicates whether the conditions are favorable, moderate, or severe
// 9. view future weather conditions for that city
// 10. presented with a 5-day forecast that displays the date, 
// 11. icon representation of weather conditions, the temperature, the wind speed, and the humidity
// 12. click on a city in the search history
// 13. presented with current and future conditions for that city
// 14. my api key 95028fce1cd337d92f5a1a326f72a774


// var for current date
var today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
var today = mm + '/' + dd + '/' + yyyy;

// DOM TO API info
let apiKey = "95028fce1cd337d92f5a1a326f72a774";
let searchBtn = $(".searchBtn");
let searchInput = $(".searchInput");

// Dom to city,date,icon,history
let cityNameEl = $(".cityName");
let currentDateEl = $(".currentDate");
let weatherIconEl = $(".weatherIcon");
let searchHistoryEl = $(".historyItems");

// Dom to weather patterns
let tempEl = $(".temp");
let humidityEl = $(".humidity");
let windSpeedEl = $(".windSpeed");
let uvIndexEl = $(".uvIndex");
let cardRow = $(".card-row");

if (JSON.parse(localStorage.getItem("searchHistory")) === null) {
    console.log("searchHistory not found")
}else{
    console.log("searchHistory loaded into searchHistoryArr");
    renderSearchHistory();
}

searchBtn.on("click", function(e) {
    e.preventDefault();
    if (searchInput.val() === "") {
        alert("You must enter a city");
        return;
    }
    getWeather(searchInput.val());
});


$(document).on("click", ".historyEntry", function() {
    let thisElement = $(this);
    getWeather(thisElement.text());
})
function renderSearchHistory(cityName) {
    searchHistoryEl.empty();
    let searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
    for (let i = 0; i < searchHistoryArr.length; i++) {
        let newListItem = $("<li>").attr("class", "historyEntry");
        newListItem.text(searchHistoryArr[i]);
        searchHistoryEl.prepend(newListItem);
    }
}
// gather and display weather
function renderWeatherData(cityName, cityTemp, cityHumidity, cityWindSpeed, cityWeatherIcon, uvVal) {
    cityNameEl.text(cityName)
    currentDateEl.text(`(${today})`)
    tempEl.text(`Temperature: ${cityTemp} °F`);
    humidityEl.text(`Humidity: ${cityHumidity}%`);
    windSpeedEl.text(`Wind Speed: ${cityWindSpeed} MPH`);
    uvIndexEl.text(`UV Index: ${uvVal}`);
    weatherIconEl.attr("src", cityWeatherIcon);
}

// retrieven with response of weather from api
function getWeather(desiredCity) {
    let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${desiredCity}&APPID=${apiKey}&units=imperial`;
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
    .then(function(weatherData) {
        let cityObj = {
            cityName: weatherData.name,
            cityTemp: weatherData.main.temp,
            cityHumidity: weatherData.main.humidity,
            cityWindSpeed: weatherData.wind.speed,
            cityUVIndex: weatherData.coord,
            cityWeatherIconName: weatherData.weather[0].icon
        }
    let queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cityObj.cityUVIndex.lat}&lon=${cityObj.cityUVIndex.lon}&APPID=${apiKey}&units=imperial`
    $.ajax({
        url: queryUrl,
        method: 'GET'
    })
    .then(function(uvData) {
        if (JSON.parse(localStorage.getItem("searchHistory")) == null) {
            let searchHistoryArr = [];
        
            if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                searchHistoryArr.push(cityObj.cityName);
                // saving and storing our arrays
                localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                renderSearchHistory(cityObj.cityName);
            }else{
                console.log("City already in searchHistory. Not adding to history list")
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
            }
        }else{
            let searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));

            // save and store arrays
            if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                searchHistoryArr.push(cityObj.cityName);
                
                localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                renderSearchHistory(cityObj.cityName);
            }else{
                console.log("City already in searchHistory. Not adding to history list")
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
            }
        }
    })  
        });

        getFiveDayForecast();

        // Retrieving the five day forecast
        function getFiveDayForecast() {
            cardRow.empty();
            let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${desiredCity}&APPID=${apiKey}&units=imperial`;
            $.ajax({
                url: queryUrl,
                method: "GET"
            })
            .then(function(fiveDayReponse) {
                for (let i = 0; i != fiveDayReponse.list.length; i+=8 ) {
                    let cityObj = {
                        date: fiveDayReponse.list[i].dt_txt,
                        icon: fiveDayReponse.list[i].weather[0].icon,
                        temp: fiveDayReponse.list[i].main.temp,
                        humidity: fiveDayReponse.list[i].main.humidity
                    }
                    let dateStr = cityObj.date;
                    let trimmedDate = dateStr.substring(0, 10); 
                    let weatherIco = `https:///openweathermap.org/img/w/${cityObj.icon}.png`;
                    createForecastCard(trimmedDate, weatherIco, cityObj.temp, cityObj.humidity);
                }
            })
        }   
    }
    
    //5 day card for weahter
    function createForecastCard(date, icon, temp, humidity) {
    
        // weather data
        let fiveDayCardEl = $("<div>").attr("class", "five-day-card");
        let cardDate = $("<h3>").attr("class", "card-text");
        let cardIcon = $("<img>").attr("class", "weatherIcon");
        let cardTemp = $("<p>").attr("class", "card-text");
        let cardHumidity = $("<p>").attr("class", "card-text");
    
        // data for forecast
        cardRow.append(fiveDayCardEl);
        cardDate.text(date);
        cardIcon.attr("src", icon);
        cardTemp.text(`Temp: ${temp} °F`);
        cardHumidity.text(`Humidity: ${humidity}%`);
        fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);
    }


