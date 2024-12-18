<template>
  <v-container class="fill-height align-center justify-center">
          <v-card
            class="py-4"
            color="blue-lighten-5"
            prepend-icon="mdi-weather-cloudy"
            rounded="lg"
            title="Weather"
            max-width="1000"
            :loading="loadingWeather"
          >
          <v-row>
            <v-col cols="6">
              <v-card-text>
              <h3>{{ weather.location.name }}, {{ weather.location.region }}, {{ weather.location.country }}</h3>
              <div class="d-flex align-center mt-2">
                <img :src="weather.current.condition.icon" alt="icon" style="width: 50px; height: auto;"></img>
                <h1>{{ displayedTemperature }}</h1> 
              </div>
              <v-row>
                <v-col cols="6">
                  <v-card title="UV index" class="mt-3" prepend-icon="mdi-weather-sunny" rounded="lg">
                    <v-card-text>
                      {{ weather.current.uv }}
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card title="Humidity" class="mt-3" prepend-icon="mdi-water-percent" rounded="lg">
                    <v-card-text>
                      {{ weather.current.humidity }}
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card title="Wind" class="mt-3" prepend-icon="mdi-weather-windy" rounded="lg">
                    <v-card-text>
                      <v-icon>{{ windDirection }}</v-icon>
                      {{ weather.current.wind_kph }} km/h
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card title="Dew point" class="mt-3" prepend-icon="mdi-thermometer-water" rounded="lg">
                    <v-card-text>
                      {{ weather.current.dewpoint_c }} &deg;C
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card title="Pressure" class="mt-3" prepend-icon="mdi-format-vertical-align-center" rounded="lg">
                    <v-card-text>
                      {{ weather.current.pressure_mb }} mb
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card title="Visibility" class="mt-3" prepend-icon="mdi-eye" rounded="lg">
                    <v-card-text>
                      {{ weather.current.vis_km }} km
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-col>
          <v-col cols="6">
            <div ref="mapContainer" style="width: 450px; height: 500px; border: 1px solid #ccc; border-radius: 5px;">
            </div>
            <v-btn class="text-none mb-1 mt-2" append-icon="mdi-map-marker" color="primary" rounded variant="outlined" style="position: absolute ; top: 80px; right: 50px; z-index: 1000;" @click="moveToMarker">View Marker</v-btn>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-btn
            @click="getWeatherForCurrentUser"
            :loading="loadingBtn"
            class="ml-3 text-none"
            prepend-icon="mdi-human-greeting-variant"
            rounded
            color="primary"
            variant="tonal"
            >My location</v-btn
          >
          <v-btn
            @click="getMarkerLocation"
            :loading="loadingBtn"
            class="ml-3 text-none"
            prepend-icon="mdi-map-marker"
            rounded
            color="primary"
            variant="tonal"
            >Marker location</v-btn
          >
          <v-btn
            @click="toggleTemperatureUnit"
            class="ml-3 text-none"
            :append-icon="temperatureUnit === 'C' ? 'mdi-temperature-fahrenheit' : 'mdi-temperature-celsius'"
            rounded
            color="primary"
            variant="tonal"
            >Change to</v-btn
          >
        </v-card-actions>
      </v-card>
  </v-container>
</template>

<script setup lang="ts">
import axios from "axios";
import L from "leaflet";

const BASE_URL = "https://us-central1-kfupm-241-coe558-alsaleh.cloudfunctions.net";

const map = ref(null);
const mapContainer = ref(null);
const marker = ref(null);
// default location is Riyadh
const lat = ref(24.7743);
const lng = ref(46.7386);
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
          lat.value = position.coords.latitude;
          lng.value = position.coords.longitude;
          map.value.setView([lat.value, lng.value], 10);
          marker.value.setLatLng([lat.value, lng.value]);
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
    loadingWeather.value = true;
    const location: any = await getUserLocation();
    await getWeather(location);
    
  } catch (error) {
    alert(error);
  }
  finally {
    loadingBtn.value = false;
    loadingWeather.value = false;
  }
};

const getMarkerLocation = async () => {
  loadingWeather.value = true;
  const location = `${marker.value._latlng.lat},${marker.value._latlng.lng}`;
  try {
    await getWeather(location);
  } catch (error) {
    alert(error);
  }
  finally {
    loadingWeather.value = false;
  }
};

const moveToMarker = () => {
  map.value.setView([marker.value._latlng.lat, marker.value._latlng.lng], 13);
};

onMounted(async () => {
  loadingWeather.value = true;
  await getWeather();
  loadingWeather.value = false;

  map.value = L.map(mapContainer.value).setView([lat.value, lng.value, ], 10);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map.value);

  marker.value = L.marker([lat.value, lng.value], { draggable: true }).addTo(map.value);
  marker.value.on("dragend", (event) => {
    lat.value = event.target._latlng.lat;
    lng.value = event.target._latlng.lng;
  });

});

const toggleTemperatureUnit = () => { 
  temperatureUnit.value = temperatureUnit.value === 'C' ? 'F' : 'C'; 
}; 

const displayedTemperature = computed(() => { 
  return temperatureUnit.value === 'C' ? `${weather.value.current.temp_c} °C` : `${weather.value.current.temp_f} °F`
});

</script>