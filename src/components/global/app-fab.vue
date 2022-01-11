<template>
  <div>
    <!--<v-fab-transition> -->
    <v-speed-dial
      v-if="items && items.length > 0"
      v-model="speed_dial"
      direction="bottom"
      transition="slide-y-transition"
      :open-on-hover="false"
      fixed
      left
      top
      style="top: 10px; z-index: 999; left: 400px;"
    >
      <template v-slot:activator>
        <v-btn
          v-model="speed_dial"
          :color="color ? color : 'primary'"
          :dark="dark"
          :fab="false"
          large
          class="px-3"
        >
          الخيارات
          <v-icon class="ms-2">mdi-chevron-down</v-icon>
          <!-- <v-icon
            v-text="
              speed_dial ? 'mdi-close' : icon ? icon : 'mdi-dots-vertical'
            "
          ></v-icon> -->
        </v-btn>
      </template>
      <template v-for="(item, i) in items">
        <v-btn
          :key="i"
          dark
          :color="item.color"
          @click="run(item.action)"
          v-text="item.text"
        >
        </v-btn>
        <!-- <v-tooltip bottom :color="item.color" :key="i">
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              fab
              dark
              :color="item.color"
              @click="run(item.action)"
            >
              <v-icon v-text="item.icon"></v-icon>
            </v-btn>
          </template>
          <span v-text="item.text"></span>
        </v-tooltip> -->
      </template>
    </v-speed-dial>
    <!-- </v-fab-transition> -->
  </div>
</template>

<script>
export default {
  name: "app-fab",
  props: ["color", "dark", "icon", "items"],
  /**
   * Defaults
   * ---------
   * color: "primary",
   * icon: "mdi-plus",
   * items: []
   * ----------
   * How items should look like?
   * items: [
   *  {
   *    text: "",
   *    icon: "",
   *    color: "",
   *    action: ""
   *  }
   * ]
   */
  data: () => ({
    speed_dial: false
  }),
  methods: {
    run(method = "") {
      if (method) {
        this.$emit(method);
      } else {
        this.showError("هذا الزر غير مرتبط بأي أكشن");
      }
    }
  }
};
</script>
