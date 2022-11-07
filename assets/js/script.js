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

