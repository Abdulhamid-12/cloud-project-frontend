<template>
  <v-app-bar app color="primary" density="comfortable">
    <v-app-bar-title>
      <div style="display: flex; align-items: center; flex-direction: row">
        <h4>COE 558: Cloud & Edge Computing</h4>
        <v-img
          width="50"
          height="50"
          src="@/assets/logo-white.png"
          style="flex: inherit"
          class="ml-2"
        />
      </div>
    </v-app-bar-title>
    <div>
      <v-spacer></v-spacer>
      <v-btn
        variant="tonal"
        class="mr-3 text-none"
        prepend-icon="mdi-weather-cloudy"
        density="comfortable"
        @click="goToWeather"
        >Weather</v-btn
      >
      <v-btn
        variant="tonal"
        class="mr-3 text-none"
        prepend-icon="mdi-creation-outline"
        density="comfortable"
        @click="goToGenAI"
        >Gen-AI</v-btn
      >
      <v-btn
        variant="tonal"
        class="mr-3 text-none"
        prepend-icon="mdi-clipboard-text-clock-outline"
        density="comfortable"
        @click="goToHistory"
        >History</v-btn
      >
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
import router from "@/router";

const goToGenAI = () => {
  router.push("/gen-ai");
};

const goToWeather = () => {
  router.push("/");
};

const goToHistory = () => {
  router.push("/history");
};
</script>
