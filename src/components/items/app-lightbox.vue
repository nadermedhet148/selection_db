<template>
  <div>
    <v-dialog
      v-model="$store.state.lightbox.model"
      :fullscreen="fullscreen"
      max-width="830"
    >
      <v-card>
        <v-card-title>
          معرض الصور
          <v-spacer></v-spacer>
          <v-btn icon @click="fullscreen = fullscreen == true ? false : true">
            <v-icon
              >mdi-window-{{ fullscreen ? "restore" : "maximize" }}</v-icon
            >
          </v-btn>
          <v-btn icon @click="$store.state.lightbox.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <v-carousel
            continuous
            progress
            show-arrows
            show-arrows-on-hover
            v-model="currentImg"
            height="100%"
          >
            <template v-for="(img, i) in $store.state.lightbox.imgs">
              <v-carousel-item :value="i" :key="i">
                <v-img contain aspect-ratio="1" :src="img"></v-img>
              </v-carousel-item>
            </template>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "app-lightbox",
  mounted() {},
  watch: {
    model(v) {
      if (v == true) {
        this.fixCurrentImg();
      }
    }
  },
  methods: {
    fixCurrentImg() {
      let value = this.$store.state.lightbox.value,
        imgs = this.$store.state.lightbox.imgs;
      if (value) {
        let index = imgs.indexOf(value);
        this.$set(this, "currentImg", index > -1 ? index : 0);
      }
    }
  },
  computed: {
    model: {
      get() {
        return this.$store.state.lightbox.model;
      },
      set(v) {
        return v;
      }
    }
  },
  data: () => ({
    fullscreen: false,
    currentImg: 0
  })
};
</script>
