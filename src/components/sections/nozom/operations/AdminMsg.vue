<template>
  <div>
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>
        تجربة ارسال رسالة من الأدمن
      </v-card-title>
      <v-card-text>
        <v-text-field
          label="العنوان"
          hint="في حال ترك العنوان فارغ, يستم كتابة 'تنبيه'"
          persistent-hint
          filled
          v-model="msg.title"
        ></v-text-field>
        <v-textarea
          label="نص الرسالة"
          hint="اضغط Enter لإضافة سطر جديد"
          persistent-hint
          filled
          rows="1"
          auto-grow
          v-model="msg.msg"
        ></v-textarea>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn outlined large color="primary" class="px-6" @click="sendMsg()">
          ارسال الرسالة
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "AdminMsg",
  data: () => ({
    msg: {
      title: "",
      msg: "",
      type: "info"
    },
    loading: false
  }),
  methods: {
    async sendMsg() {
      this.$set(this, "loading", true);
      let msg = this.msg,
        sendMsg = await this.api("admin-eye/msg-box", msg);
      console.log("msg sent");
      this.$set(this, "loading", false);
    }
  }
};
</script>
