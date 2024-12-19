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
        <v-card :loading="image.isLoading">
          <v-img
            :src="image.imageURL"
            lazy-src="https://placehold.co/600x400?text=Image+Expired"
            height="300px"
            alt="Generated image"
            cover
            >
          </v-img>
          <v-card-title>
            
          </v-card-title>
          <v-card-text v-if="!image.isEditing">{{ image.prompt }}</v-card-text>
          <template v-if="image.isEditing">
            <v-textarea v-model=newPrompt rows="2" hide-details class="mx-2"></v-textarea>
            <v-btn size="small" color="primary" class="ml-2 mb-1 my-1" @click="onSave(image.id)">Save</v-btn>
            <v-btn size="small" color="primary" class="ml-2 my-1" variant="tonal" @click="image.isEditing = false">Cancel</v-btn>
          </template>
          <v-divider></v-divider>
          <v-card-actions>
            <span class="pl-1" style="font-size: 15px;">
              {{ image.createdAt }}
            </span>
            <v-spacer></v-spacer>
            <v-btn @click="onEdit(image.id)" icon="mdi-pencil" color="primary" size="small"></v-btn>
            <v-btn @click="onDelete(image.id)"icon="mdi-delete" color="error" size="small"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import axios from "axios";
import { useAppStore } from "@/stores/app";

const url ="https://crud-firestore-service-809589673646.us-central1.run.app/api/prompts";
const { showSnackbar } = useAppStore();

interface GeneratedImage {
  id: string;
  prompt: string;
  imageURL: string;
  createdAt: string;
  isEditing: boolean;
  isLoading: boolean;
}

const images = ref<GeneratedImage[]>([]);
const loading = ref(false);
const newPrompt = ref("");

const getImages = async () => {
  try {
    loading.value = true;
    const response = await axios.get(url);
    showSnackbar("success", "Images fetched successfully");
    console.log(response.data);

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
        isEditing: false,
        isLoading: false,
      };
    });
  } catch (error) {
    showSnackbar("error", "Error fetching images");
    console.error("Error fetching images:", error);
    alert(error);
  } finally {
    loading.value = false;
  }
};

const onDelete = async (id: string) => {
  try {
    images.value.find((image) => image.id === id)!.isLoading = true;
    await axios.delete(`${url}/${id}`);
    showSnackbar("success", "Image deleted successfully");
    images.value = images.value.filter((image) => image.id !== id);
  } catch (error) {
    showSnackbar("error", "Error deleting image");
    console.error("Error deleting image:", error);
    alert(error);
  } finally {
    images.value.find((image) => image.id === id)!.isLoading = false;
  }
};

const onEdit = (id: string) => {
  const image = images.value.find((image) => image.id === id);
  if (image) {
    image.isEditing = true;
    newPrompt.value = image.prompt;
  }
};

const onSave = async (id: string) => {
  const image = images.value.find((image) => image.id === id);
  const oldPrompt = image?.prompt || "";

  if (image) {
    try {
      image.isLoading = true;
      image.prompt = newPrompt.value;
      image.isEditing = false;
      const response: any = await axios.put(`${url}/${id}`, { prompt: newPrompt.value });
      image.imageURL = response.data.imageURL;
      console.log("Edit res:", response.data);
      showSnackbar("success", "Image updated successfully");
    } catch (error) {
      image.prompt = oldPrompt;
      showSnackbar("error", "Error updating image");
      console.error("Error updating image:", error);
      alert(error);
    } finally {
      image.isLoading = false;
    }
  }
};

onMounted(async () => {
  await getImages();
});
</script>
