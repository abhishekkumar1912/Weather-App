const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".weather-info-container");
const fourzerofour = document.querySelector(".fourzerofour-container");

const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";


grantAccessButton.addEventListener("click", getLocation);

function getLocation(){
    if(navigator.geolocation){                                     //The getCurrentPosition() method returns the current position of the device.
        navigator.geolocation.getCurrentPosition(showPosition);            //to the callback function showPosition
    }
    else{
         console.log("error in grant location")
    }
}

function showPosition(position){

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{                                        //API CALL
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const  data = await response.json();
        
        renderWeatherInfo(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
    }
    catch(err) {
        loadingScreen.classList.remove("active");
      }
}

function renderWeatherInfo(weatherInfo){                         
    
    const cityName = document.querySelector("[data-cityName]");                      //fistly, we have to fetch all the element; 
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
                                                                                 //fetch values from weatherINfo object and put it UI elements    
    cityName.innerText = weatherInfo?.name;                                         
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}


let oldTab = userTab;
oldTab.classList.add("current-tab");                           //Current tab is used to color the current tab like buttom
getfromSessionStorage();

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){                          // if currently UI is not searchForm;
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {       
            fourzerofour.classList.remove("active");                                                          // if UI is searchForm;
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "") return ;
    else fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    fourzerofour.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        if(!response.ok) throw data;                         // you can use this to throw the error 
        const data = await response.json();
       // if(!data.sys) throw data;                          // also you can use this to throw the error                
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        const fourzerofour_msg = document.querySelector("[fourzerofour-msg]");
        loadingScreen.classList.remove("active");
        fourzerofour.classList.add("active");
        fourzerofour_msg.innerText = `${city} not found `;
    }
}


function getfromSessionStorage() {                                            //check if cordinates are already present in session storage
    const localCoordinates = sessionStorage.getItem("user-coordinates");      //if present then we fethch data based on that codinates
    if(!localCoordinates) grantAccessContainer.classList.add("active");       
    else {
        const coordinates = JSON.parse(localCoordinates);                   
        fetchUserWeatherInfo(coordinates);
    }
}
/*
 The sessionStorage object let you store key/value pairs in the browser.
 The sessionStorage object stores data for only one session.
 (The data is deleted when the browser is closed).
*/