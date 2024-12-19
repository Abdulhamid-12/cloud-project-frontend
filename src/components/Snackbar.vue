<template>
    <div class="text-center">
      <v-snackbar
        v-model="appStore.snackbar"
        :timeout="appStore.snackbarTimeout"
        :color="appStore.snackbarColor"
      >
        {{ appStore.snackbarText }}
  
        <template v-slot:actions>
          <v-btn
            variant="text"
            icon="mdi-close"
            @click="appStore.snackbar = false"
          >
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
</script>