<template>
  <div>
    <v-card>
      <v-card-title>
        الأجهزة المتصلة
        <v-spacer></v-spacer>
        <v-btn icon @click="adminEyeRefresh()">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <all-screens ref="screens"></all-screens>
      </v-card-text>
      <!-- <v-data-table :items="items" :headers="devices.headers" fixed-header>
        <template v-slot:item.actions="{ item }">
          <v-chip color="transparent">
            <v-btn icon @click="openDeviceScreen(item)" color="primary">
              <v-icon>mdi-television</v-icon>
            </v-btn>
            <v-btn icon @click="openDeviceReport(item)" color="primary">
              <v-icon>mdi-file-document</v-icon>
            </v-btn>
          </v-chip>
        </template>
        <template v-slot:item.ips="{ item }">
          <div v-if="item.ips && item.ips.length > 0">
            <template v-for="(ip, i) in item.ips">
              <v-chip :key="i">
                {{ ip }}
              </v-chip>
            </template>
          </div>
        </template>
        <template v-slot:item.time="{ item }">
          <div v-if="item.time">
            {{ item.time | moment("from", "now") | removeMonzo }}
          </div>
        </template>
      </v-data-table> -->
    </v-card>
    <!-- <div v-if="sharing">
      <device-screen
        @sharing-stopped="sharingStopped"
        ref="device_screen"
      ></device-screen>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "ConnectedDevices",
  filters: {
    removeMonzo(v) {
      return v.replace("منذ ", "");
    }
  },
  components: {
    DeviceScreen: () =>
      import("@/components/sections/admin/connected-devices/device-screen.vue"),
    AllScreens: () =>
      import("@/components/sections/admin/connected-devices/all-screens.vue")
  },
  data: () => ({
    sharing: false,
    screens: []
    // devices: {
    //   headers: [
    //     {
    //       text: "الجهاز",
    //       value: "name",
    //       sortable: true
    //     },
    //     {
    //       text: "مفتوح منذ",
    //       value: "time",
    //       sortable: true
    //     },
    //     {
    //       text: "IPs",
    //       value: "ips",
    //       sortable: true
    //     },
    //     {
    //       text: "",
    //       value: "actions",
    //       sortable: false
    //     }
    //   ]
    // }
  }),
  computed: {
    // items: {
    //   get() {
    //     let devices = this.$store.state.rtc_sockets.devices,
    //       fixedDevices = [];
    //     Object.keys(devices).forEach(key => {
    //       let value = devices[key];
    //       fixedDevices.push({
    //         id: key,
    //         ips: value.ips,
    //         time: value.time
    //       });
    //     });
    //     return fixedDevices;
    //   },
    //   set(v) {
    //     return v;
    //   }
    // }
  },
  methods: {
    adminEyeRefresh() {
      this.$socket.client.emit("adminEyeRefresh", true);
      this.$refs.screens.restart();
    },
    openDeviceScreen(item) {
      this.$set(this, "sharing", true);
      this.$nextTick(() => {
        let intVal = setInterval(() => {
          // this.$refs.device_screen.roomId = item.id;
          this.$refs.device_screen.loadScreen();
          clearInterval(intVal);
        }, 100);
      });
    },
    sharingStopped(roomId) {
      this.$set(this, "sharing", false);
      this.$socket.client.emit("forceShareScreenStop", roomId);
    },
    openDeviceReport() {}
  }
};
</script>
