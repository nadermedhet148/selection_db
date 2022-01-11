import Vue from "vue";
Vue.mixin({
  methods: {
    admin() {
      let that = this;
      return {
        openUserScreen(socketid) {
          that.$socket.client.emit("admin_openUserScreen", socketid);
        }
      };
    }
  }
});
