
let key = "1ccbc564340c43655f5d22dbd7a6d7e4";
let url = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

window.addEventListener("DOMContentLoaded", () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        check(lastCity);
    }
});

async function check(city) {
    document.getElementById("loading").style.display = "block";
    document.getElementById("error").style.display = "none";

    try {
        let response = await fetch(`${url}q=${city}&appid=${key}`);
        if (!response.ok) throw new Error("City not found");

        let data = await response.json();
        console.log(data);

        setIcon(data.weather[0].main, data);
        updateBackground(data.weather[0].main, data.weather[0].icon);
        document.getElementById("temp").innerText = `${Math.round(data.main.temp)} °C`;
        document.getElementById("location").innerText = data.name;
        document.getElementById("humi").innerText = `${data.main.humidity} %`;
        document.getElementById("wind").innerText = `${data.wind.speed} Km/h`;
        document.getElementById("description").innerText = capitalize(data.weather[0].description);
        localStorage.setItem("lastCity", city);
    } catch (err) {
        console.error(err);
        document.getElementById("error").style.display = "block";
    }

    document.getElementById("loading").style.display = "none";
}

function setIcon(weather, data) {
    const img = document.getElementById("weather-icon");
    img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function updateBackground(weather, iconCode) {
    const body = document.body;

    if (iconCode.includes("d")) {
        // Daytime backgrounds
        if (weather === "Clear") {
            body.style.background = "linear-gradient(135deg, #fceabb, #f8b500)";
        } else if (weather === "Clouds") {
            body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
        } else if (weather === "Rain" || weather === "Drizzle" || weather === "Thunderstorm") {
            body.style.background = "linear-gradient(135deg, #2c3e50, #4ca1af)";
        } else if (weather === "Snow") {
            body.style.background = "linear-gradient(135deg, #e6dada, #274046)";
        } else {
            body.style.background = "linear-gradient(135deg, #606c88, #3f4c6b)";
        }
    } else {
        // Nighttime background
        body.style.background = "linear-gradient(135deg, #141e30, #243b55)";
    }
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

let search = document.getElementById("search");
search.addEventListener("click", () => {
    let city = document.getElementById("city");
    check(city.value.trim());
    city.value = "";
});

document.getElementById("city").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("search").click();
    }
});
