<template>
  <div>
    <v-dialog
      persistent
      max-width="400"
      scrollable
      v-model="$store.state.appError.model"
    >
      <v-card :disabled="loading" :loading="loading">
        <v-card-title class="error white--text">
          <span
            v-if="$store.state.appError.name"
            v-text="$store.state.appError.name"
          ></span>
          <span v-else>
            <span>حدث </span>
            <span class=""> خطأ</span>
          </span>
          <v-spacer></v-spacer>
          <v-btn @click="$store.state.appError.model = false" dark icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-subtitle-1 pt-4 pb-4">
          <div>
            <span v-html="$store.state.appError.msg"></span>
          </div>
        </v-card-text>
        <v-divider class="mb-1"></v-divider>
        <!-- <v-card-text class="pb-0" v-if="$store.state.appError.server">
          <span class="font-weight-bold">السيرفر: </span>
          <span v-text="$store.state.appError.server"></span>
        </v-card-text> -->
        <!-- <v-divider v-if="$store.state.appError.server"></v-divider> -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            class="text-capitalize px-6"
            large
            outlined
            @click="$store.state.appError.model = false"
            >رجوع</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "global-error-dialog",
  data: () => ({
    loading: false
  })
};
</script>
