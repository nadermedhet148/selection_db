<template>
  <div>
    <v-card class="">
      <v-card-title class="mb-1">
        تجربة SMBA
      </v-card-title>
      <v-card-subtitle>
        المفروض إني دلوقتي هقدر أ access على الأجهزة اللي معايا في الشبكة
        بباسورداتها
      </v-card-subtitle>
      <v-card-actions>
        <v-btn
          class="px-6"
          large
          color="primary"
          outlined
          @click="startTesting()"
        >
          بدأ العمل
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TestingSMBA",
  data: () => ({}),
  methods: {
    startTesting() {
      this.$socket.client.emit("test-smba", "tests");
    }
  }
};
</script>
