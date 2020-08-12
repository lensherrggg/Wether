var city = "北京市";
var whichDay = ["今天", "明天", "后天"];

var apiCity = "http://api.map.baidu.com/location/ip?ak=" + baiduKey;

loadCity();
function loadCity() {
  $.ajax({
    type: "GET",
    url: apiCity,
    async: false,
    success: function (response) {
      // setCity(response);
      city = response.content.address_detail.city;
    }
  })
}

var apiDay = "https://api.seniverse.com/v3/weather/now.json?key=" + seniverseKey + "&location=" + city + "&language=zh-Hans&unit=c";
var apiDaily = "https://api.seniverse.com/v3/weather/daily.json?key=" + seniverseKey + "&location=" + city + "&language=zh-Hans&unit=c&start=0&days=3";

loadDay();
loadDaily();


function setCity(data) {
  city = data.content.address_detail.city;
}

function loadDay () {
  $.ajax({
    type: "GET",
    url: apiDay,
    async: false,
    success: function (response) {
      setDayInfo(response);
    }
  })
}

function loadDaily() {
  $.ajax({
    type: "GET",
    url: apiDaily,
    async: false,
    success: function (response) {
      setDailyInfo(response);
    }
  });
}

function addItem(data) {
  var item = document.createElement("p");
  item.innerHTML = data;
  document.body.appendChild(item);
}

function setDayInfo(d) {
  var lastUpdate = d.results[0].last_update; //
  var date = new Date(lastUpdate);
  var city = d.results[0].location.name; //
  var hour = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();//
  var minutes = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes(); // 
  var data = d.results[0].now;
  var weather = data.text; //
  var code = data.code; // 
  var temperature = data.temperature; // 

  document.body.appendChild(createTodayInfo({
    city: city,
    hour: hour, 
    minutes: minutes,
    codeDay: code,
    temperature: temperature,
    weather: weather,
  }));
}

function createTodayInfo(data) {
  var divItem = document.createElement("div");
  divItem.setAttribute("id", "today");
  var city = document.createElement("h1");
  city.setAttribute("id", "city");
  city.innerText = data.city;
  var updateTime = document.createElement("h3");
  updateTime.setAttribute("id", "updateTime");
  updateTime.innerText = `${data.hour}:${data.minutes}发布`
  var pic = createPic(data.codeDay, data.temperature, data.weather);
  divItem.appendChild(city);
  divItem.appendChild(updateTime);
  divItem.appendChild(pic);
  return divItem;
}

function createPic(codeDay, temperature, weather) {
  var pic = document.createElement("div");
  pic.setAttribute("id", "pic");
  var image = document.createElement("img");
  image.setAttribute("src", `./imgs/${codeDay}.svg`);
  var temp = document.createElement("p")
  temp.innerText = temperature + "℃";
  var weath = document.createElement("p");
  weath.innerText = weather;
  pic.appendChild(image);
  pic.appendChild(temp);
  pic.appendChild(weath);
  return pic;
}

function setDailyInfo(d) {
  var data = d.results[0].daily;
  var len = data.length;
  var dates = [];
  var textDay = []; //
  var codeDay = []; //
  var textNight = []; //
  var codeNight = []; //
  var highTemp = []; //
  var lowTemp = []; //
  var rainfall = []; //
  var windDirection = []; //
  var windScale = []; //
  var humidity = []; //
  for (var i = 0; i < len; i++) {
    dates[i] = data[i].date;
    textDay[i] = data[i].text_day;
    codeDay[i] = data[i].code_day;
    textNight[i] = data[i].text_night;
    codeNight[i] = data[i].code_night;
    highTemp[i] = data[i].high;
    lowTemp[i] = data[i].low;
    rainfall[i] = data[i].rainfall;
    windDirection[i] = data[i].wind_direction;
    windScale[i] = data[i].wind_scale;
    humidity[i] = data[i].humidity;
  }
  var months = []; //
  var todays = []; //
  for (var i = 0; i < len; i++) {
    months[i] = new Date(dates[i]).getMonth() + 1,
    todays[i] = new Date(dates[i]).getDate()
  }

  var node = createFuture({
    date: {
      day: whichDay,
      month: months,
      today: todays
    },
    weather: {
      codeDay: codeDay,
      textDay: textDay,
      textNight: textNight
    },
    tempRange: {
      low: lowTemp,
      high: highTemp,
    }
  })
  document.body.appendChild(node);
}

function createFuture(data) {
  var divItem = document.createElement("div");
  divItem.setAttribute("id", "future");
  var list = createList(data.date, data.weather, data.tempRange);
  divItem.appendChild(list);
  return divItem;
}

function createList(date, weather, tempRange) {
  var list = document.createElement("ul");
  list.setAttribute("id", "list");
  for (var i = 0; i < 3; i++) {
    var dateItem = createDate(date.day[i], date.month[i], date.today[i]);
    var weatherItem = createWeather(weather.codeDay[i], weather.textDay[i], weather.textNight[i]);
    var tempItem = createTempRange(tempRange.low[i], tempRange.high[i]);
    var listItem = document.createElement("li");
    listItem.appendChild(dateItem);
    listItem.appendChild(weatherItem);
    listItem.appendChild(tempItem);
    list.appendChild(listItem);
  }
  return list;
}

function createDate(day, month, today) {
  var divItem = document.createElement("div");
  divItem.setAttribute("class", "date");
  divItem.innerText = `${day} ${month}/${today}`;
  return divItem;
}

function createWeather(codeDay, textDay, textNight) {
  var divItem = document.createElement("div");
  divItem.setAttribute("class", "weather");
  var image = document.createElement("img");
  image.setAttribute("src", `./imgs/${codeDay}.svg`);
  var span = document.createElement("span");
  span.innerText = `${textDay}/${textNight}`;
  divItem.appendChild(image);
  divItem.appendChild(span);
  return divItem;
}

function createTempRange(low, high) {
  var divItem = document.createElement("div");
  divItem.setAttribute("class", "tempRange");
  divItem.innerText = `${low}/${high}℃`;
  return divItem;
}