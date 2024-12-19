<template>
    <v-container class="fill-height d-flex align-center justify-center">
      <v-card color="primary" dark class="text-center">
        <v-card-title class="headline">Page Not Found</v-card-title>
        <v-card-text>The page you are looking for does not exist.</v-card-text>
        <v-card-actions>
          <v-btn to="/" variant="outlined" append-icon="mdi-home" block>Go Home</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  }
  </script>