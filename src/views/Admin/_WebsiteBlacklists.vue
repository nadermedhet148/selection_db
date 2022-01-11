<template>
  <div>
    <v-card>
      <v-card-title>
        الروابط المحظورة على الشبكة العسكرية
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "WebsiteBlacklists",
  data: () => ({
    blacklist: {
      items: [],
      loading: false
    },
    newItem: {},
    field: [
      {
        label: "الرابط",
        hint: "قم بنسخ الرابط الذي تريد حظره من المتصفح وألصقه هنا",
        model: "url",
        type: "text"
      },
      {
        label: "رسالة الخطأ",
        hint:
          "الرسالة التي ستظهر للمستخدم إذا حاول الدخول لهذا الرابط, في حال ترك هذا فارغاً سيظهر للمستخدم الرسالة الإفتراضية",
        model: "msg",
        type: "text"
      },
      {
        label: "استثناء للمستخدم الخاص بسلاح حرس الحدود",
        hint:
          "في حال أردت السماح للمستخدم الخاص بسلاح حرس الحدود الدخول على هذا الرابط",
        model: "isExcludedForOurUsername",
        type: "checkbox"
      }
    ]
  }),
  methods: {
    async getBlacklist() {
      this.$set(this.blacklist, "loading", true);
      let blacklist = await this.api("global/get_all", {
        table: "websiteBlacklists"
      });
      this.$set(this.blacklist, "items", blacklist.data);
      this.$set(this.blacklist, "loading", false);
    }
  }
};
</script>
