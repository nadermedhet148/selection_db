<template>
  <div class="messenger-container">
    <v-row class="messenger-row">
      <v-col cols="auto" class="py-0 messenger-col pe-0">
        <messenger-sidebar
          :selected_chat.sync="selected_chat"
        ></messenger-sidebar>
      </v-col>
      <v-col class="messenger-col py-0 ps-0">
        <messenger-content :selected_chat="selected_chat"></messenger-content>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.messenger-container {
  height: calc(100vh - 64px - 50px);
  .messenger-row {
    height: inherit;
    margin-top: 0;
    .messenger-col {
      height: inherit;
    }
  }
}
</style>

<script>
export default {
  name: "messenger",
  components: {
    MessengerSidebar: () => import("@/components/pages/messenger/sidebar"),
    MessengerContent: () => import("@/components/pages/messenger/content")
  },
  mounted() {},
  data: () => ({
    selected_chat: ""
  }),
  methods: {}
};
</script>
