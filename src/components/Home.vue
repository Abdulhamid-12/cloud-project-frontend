<template>
  <v-container class="fill-height align-center justify-center">
          <v-card
            class="py-4"
            color="blue-lighten-5"
            prepend-icon="mdi-weather-cloudy"
            rounded="lg"
            title="Weather"
            max-width="700"
            :loading="loadingWeather"
          >
            <v-card-text>
              <h3>{{ weather.location.name }}, {{ weather.location.region }}, {{ weather.location.country }}</h3>
              <div class="d-flex align-center">
                <img :src="weather.current.condition.icon" alt="icon" style="width: 50px; height: auto;"></img>
                <h1>{{ displayedTemperature }}</h1> 
              </div>
              <v-row>
                <v-col cols="6">
                  <v-card title="UV index" class="mt-5" prepend-icon="mdi-weather-sunny" rounded="lg">
                    <v-card-text>
                      {{ weather.current.uv }}
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card title="Humidity" class="mt-5" prepend-icon="mdi-water-percent" rounded="lg">
                    <v-card-text>
                      {{ weather.current.humidity }}
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card title="Wind" class="mt-5" prepend-icon="mdi-weather-windy" rounded="lg">
                    <v-card-text>
                      <v-icon>{{ windDirection }}</v-icon>
                      {{ weather.current.wind_kph }} km/h
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card title="Dew point" class="mt-5" prepend-icon="mdi-thermometer-water" rounded="lg">
                    <v-card-text>
                      {{ weather.current.dewpoint_c }} &deg;C
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card title="Pressure" class="mt-5" prepend-icon="mdi-format-vertical-align-center" rounded="lg">
                    <v-card-text>
                      {{ weather.current.pressure_mb }} mb
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card title="Visibility" class="mt-5" prepend-icon="mdi-eye" rounded="lg">
                    <v-card-text>
                      {{ weather.current.vis_km }} km
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-btn
                @click="getWeatherForCurrentUser"
                :loading="loadingBtn"
                class="mt-5 text-none"
                prepend-icon="mdi-map-marker"
                rounded
                color="primary"
                >My location</v-btn
              >
              <v-btn
                @click="toggleTemperatureUnit"
                class="mt-5 ml-3 text-none"
                :append-icon="temperatureUnit === 'C' ? 'mdi-temperature-fahrenheit' : 'mdi-temperature-celsius'"
                rounded
                color="primary"
                >Change to</v-btn
              >
            </v-card-text>
          </v-card>
  </v-container>
</template>

<script setup lang="ts">
import axios from "axios";

const BASE_URL = "https://us-central1-kfupm-241-coe558-alsaleh.cloudfunctions.net";

const weather = ref({
    "location": {
        "name": "",
        "region": "",
        "country": "",
        "lat": 0,
        "lon": 0,
        "tz_id": "",
        "localtime_epoch": 0,
        "localtime": ""
    },
    "current": {
        "last_updated_epoch": 0,
        "last_updated": "",
        "temp_c": 0,
        "temp_f": 0,
        "is_day": 0,
        "condition": {
            "text": "",
            "icon": "",
            "code": 0
        },
        "wind_mph": 0,
        "wind_kph": 0,
        "wind_degree": 0,
        "wind_dir": "",
        "pressure_mb": 0,
        "pressure_in": 0,
        "precip_mm": 0,
        "precip_in": 0,
        "humidity": 0,
        "cloud": 0,
        "feelslike_c": 0,
        "feelslike_f": 0,
        "windchill_c": 0,
        "windchill_f": 0,
        "heatindex_c": 0,
        "heatindex_f": 0,
        "dewpoint_c": 0,
        "dewpoint_f": 0,
        "vis_km": 0,
        "vis_miles": 0,
        "uv": 0,
        "gust_mph": 0,
        "gust_kph": 0
    }
});

const windDirection = computed(() => {
  const degrees = weather.value.current.wind_degree;
  const directions = [
    { dir: "N", icon: "mdi-arrow-up" },
    { dir: "NNE", icon: "mdi-arrow-up-right" },
    { dir: "NE", icon: "mdi-arrow-top-right" },
    { dir: "ENE", icon: "mdi-arrow-right-top" },
    { dir: "E", icon: "mdi-arrow-right" },
    { dir: "ESE", icon: "mdi-arrow-right-bottom" },
    { dir: "SE", icon: "mdi-arrow-bottom-right" },
    { dir: "SSE", icon: "mdi-arrow-down-right" },
    { dir: "S", icon: "mdi-arrow-down" },
    { dir: "SSW", icon: "mdi-arrow-down-left" },
    { dir: "SW", icon: "mdi-arrow-bottom-left" },
    { dir: "WSW", icon: "mdi-arrow-left-bottom" },
    { dir: "W", icon: "mdi-arrow-left" },
    { dir: "WNW", icon: "mdi-arrow-left-top" },
    { dir: "NW", icon: "mdi-arrow-top-left" },
    { dir: "NNW", icon: "mdi-arrow-up-left" }
  ];
  const index = Math.floor((degrees / 22.5) + 0.5) % 16;
  return directions[index].icon;
});

const temperatureUnit = ref('C');
const loadingWeather = ref(false);
const loadingBtn = ref(false);

const getWeather = async (location = '') => {
  const response = await axios.get(`${BASE_URL}/weather/?location=${location}`);
  weather.value = response.data;
};

const getUserLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(`${position.coords.latitude},${position.coords.longitude}`);
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};

const getWeatherForCurrentUser = async () => {
  try {
    loadingBtn.value = true;
    const location: any = await getUserLocation();
    loadingBtn.value = false;

    loadingWeather.value = true;
    await getWeather(location);
    loadingWeather.value = false;
    
  } catch (error) {
    loadingBtn.value = false;
    loadingWeather.value = false;
    alert(error);
  }
};

onMounted(async () => {
  loadingWeather.value = true;
  await getWeather();
  loadingWeather.value = false;
});

const toggleTemperatureUnit = () => { 
  temperatureUnit.value = temperatureUnit.value === 'C' ? 'F' : 'C'; 
}; 

const displayedTemperature = computed(() => { 
  return temperatureUnit.value === 'C' ? `${weather.value.current.temp_c} °C` : `${weather.value.current.temp_f} °F`
});

</script>