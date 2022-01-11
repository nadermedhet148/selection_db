<template>
  <div>
    <v-dialog
      persistent
      max-width="400"
      scrollable
      v-model="$store.state.appInfo.model"
    >
      <v-card :disabled="loading" :loading="loading">
        <v-card-title class="info white--text">
          <span
            v-if="$store.state.appInfo.name"
            v-text="$store.state.appInfo.name"
          ></span>
          <span v-else>
            <span>تنبيه </span>
          </span>
          <v-spacer></v-spacer>
          <v-btn @click="$store.state.appInfo.model = false" dark icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-subtitle-1 pt-4 pb-4">
          <div>
            <span v-html="$store.state.appInfo.msg"></span>
          </div>
        </v-card-text>
        <v-divider class="mb-1"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="info"
            class="text-capitalize px-6"
            large
            outlined
            @click="$store.state.appInfo.model = false"
            >حسناً</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "global-info-dialog",
  data: () => ({
    loading: false
  })
};
</script>
