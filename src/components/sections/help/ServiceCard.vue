<template>
  <div>
    <v-card outlined height="250" shaped>
      <v-card-title class="ma-4">{{ data.title }}</v-card-title>
      <v-card-subtitle>{{ data.serviceType.name }}</v-card-subtitle>
      <v-card-text>{{ data.desc }}</v-card-text>
      <v-card-actions>
        <v-btn @click="showReq = !showReq">عرض المتطلبات</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="showReq" width="600">
      <v-list>
        <v-list-item v-for="(item, i) in data.serviceRequirements" :key="i">
          <v-list-item-icon>
            <v-icon>{{
              item.isRequired ? "mdi-alert" : "mdi-checkbox-blank"
            }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card v-for="(m, y) in data.media" :key="y" class="  pb-10 pr-5">
        <v-card-text>{{ m.title }}</v-card-text>
        <video
          v-if="m.type == 'video'"
          :src="m.path"
          width="550"
          height="500"
          controls
        ></video>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "service-card",
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  mounted: () => {},
  data: () => ({
    showReq: false
  }),
  methods: {}
};
</script>
