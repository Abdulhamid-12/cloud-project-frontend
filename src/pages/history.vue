<template>
  <v-container>
    <v-row>
      <v-col v-if="!images.length" v-for="n in 6" :key="n" cols="4">
        <v-skeleton-loader
          class="mx-auto border"
          max-width="300"
          type="image, article"
        ></v-skeleton-loader>
      </v-col>
      <v-col v-for="image in images" :key="image.id" cols="4">
        <v-card>
          <v-img :src="image.imageURL" alt="Generated Image"></v-img>
          <v-card-title>{{ image.prompt }}</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :href="image.historyURL" target="_blank" color="primary"
              >View History</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import axios from "axios";

const url ="https://crud-firestore-service-809589673646.us-central1.run.app/api/prompts";

interface GeneratedImage {
  id: string;
  prompt: string;
  imageURL: string;
  historyURL: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

const images = ref<GeneratedImage[]>([]);
const loading = ref(false);

const getImages = async () => {
  try {
    loading.value = true;
    const response = await axios.get(url);
    images.value = response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    alert(error);
  }
  finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getImages();
});
</script>
