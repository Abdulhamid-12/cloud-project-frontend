<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto" max-width="900">
      <v-img class="mb-4" height="150" src="@/assets/logo.png" />

      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-n1">
          COE 558: Cloud & Edge Computing
        </div>

        <h1 class="text-h2 font-weight-bold">Cource Project</h1>
      </div>

      <div class="py-4" />

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-weather-cloudy"
            rounded="lg"
            title="Weather"
            :loading="loadingWeather"
          >
            <v-card-text v-if="!loadingWeather">
              <v-img :src="weatherIcon" width="50"></v-img>
              <h1>Data:</h1>
              <p>{{ weather }}</p>
              <v-btn
                @click="getWeatherForCurrentUser"
                :loading="loadingBtn"
                class="mt-5"
                prepend-icon="mdi-map-marker"
                >my location</v-btn
              >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import axios from "axios";

const BASE_URL =
  "https://us-central1-kfupm-241-coe558-alsaleh.cloudfunctions.net";

const weather = ref<any>();
const weatherIcon = ref("");
const loadingWeather = ref(false);
const loadingBtn = ref(false);

const getWeather = async (location = '') => {
  const response = await axios.get(`${BASE_URL}/weather/?location=${location}`);
  weather.value = response.data;
  weatherIcon.value = response.data.current.condition.icon;
  // console.log(weather.value);
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
</script>
