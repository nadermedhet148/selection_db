<template>
  <div>
    <v-dialog
      persistent
      max-width="400"
      scrollable
      v-model="$store.state.appSuccess.model"
    >
      <v-card :disabled="loading" :loading="loading">
        <v-card-title class="success white--text">
          <span
            v-if="$store.state.appSuccess.name"
            v-text="$store.state.appSuccess.name"
          ></span>
          <span v-else>
            <span>تمت </span>
            <span class=""> العملية</span>
          </span>
          <v-spacer></v-spacer>
          <v-btn @click="$store.state.appSuccess.model = false" dark icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-subtitle-1 pt-4 pb-4">
          <div>
            <span v-html="$store.state.appSuccess.msg"></span>
          </div>
        </v-card-text>
        <v-divider class="mb-1"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            class="text-capitalize px-6"
            large
            outlined
            @click="$store.state.appSuccess.model = false"
            >حسناً</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "global-success-dialog",
  data: () => ({
    loading: false
  })
};
</script>
