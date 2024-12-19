<template>
  <v-container>
    <v-form @submit.prevent="onGenerate">
      <v-textarea
        label="Enter a description for your image"
        v-model="description"
        :rules="textRules"
        clearable
        rows="3"
        auto-grow
        prepend-inner-icon="mdi-pencil"
      ></v-textarea>
      <v-btn
        type="submit"
        class="text-none mb-3 mt-2"
        append-icon="mdi-creation"
        color="primary"
        rounded
        :loading="loading"
        :disabled="loading"
        >Generate</v-btn
      >
    </v-form>
    <v-img
      class="mx-auto"
      max-width="700"
      :src="generatedImage"
    >
    </v-img>
  </v-container>
</template>

<script lang="ts" setup>
import axios from "axios";

const url = "https://us-central1-kfupm-241-coe558-alsaleh.cloudfunctions.net/GenAI-1";
const generatedImage = ref("");
const description = ref("");
const loading = ref(false);

const textRules = [
  (value: string) => {
    if (value) return true;
    return "Please describe your image";
  },
];

const onGenerate = async () => {
  try {
    loading.value = true;
    const response: any = await axios.post(url, { "prompt": description.value });
    generatedImage.value = response.data.imageURL;
  } catch (error) {
    console.error("Error generating image:", error);
  } finally {
    loading.value = false;
  }
};
</script>
