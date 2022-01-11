<template>
  <div>
    <v-snackbar
      :timeout="1000"
      app
      bottom
      style="z-index: 9999"
      absolute
      :color="$store.state.snackbar.color"
      v-model="$store.state.snackbar.model"
    >
      {{ $store.state.snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "AppSnackbar",
  data: () => ({})
};
</script>
