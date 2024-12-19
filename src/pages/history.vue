<template>
  <v-container>
    <v-row>
      <v-col v-if="!images.length" v-for="n in 6" :key="n" cols="4">
        <v-skeleton-loader
          class="mx-auto border"
          max-width="500"
          type="image, article"
        ></v-skeleton-loader>
      </v-col>
      <v-col v-for="image in images" :key="image.id" cols="4">
        <v-card>
          <v-img
            :src="image.imageURL"
            height="200px"
            alt="Generated Image"
            cover
            >
          </v-img>
          <v-card-title>
            Prompts
          </v-card-title>
          <v-card-text>{{ image.prompt }}</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <span class="pl-1" style="font-size: 15px;">
              {{ image.createdAt }}
            </span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-delete" color="error" size="small"></v-btn>
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
  createdAt: string;
}

const images = ref<GeneratedImage[]>([]);
const loading = ref(false);

const getImages = async () => {
  try {
    loading.value = true;
    const response = await axios.get(url);

    images.value = response.data.map((image: any) => {
      // Convert seconds to milliseconds
      const milliseconds = image.createdAt._seconds * 1000;
      // Create a Date object
      const date = new Date(milliseconds);

      // Format the date as 'Jan 1, 2024'
      const options: any = { year: "numeric", month: "short", day: "numeric" };
      const formattedDate = date.toLocaleDateString("en-US", options);

      return {
        ...image,
        createdAt: formattedDate,
      };
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    alert(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getImages();
});
</script>
