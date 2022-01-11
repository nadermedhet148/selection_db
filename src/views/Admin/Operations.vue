<template>
  <div>
    <div v-if="!params.section">
      <v-dialog
        v-if="isCurrentRoute(componentName)"
        persistent
        v-model="model"
        scrollable
        max-width="450"
      >
        <v-card>
          <v-card-title class="white--text primary">
            <v-spacer></v-spacer>
            عمليات مدير النظام
            <v-spacer></v-spacer>
            <v-btn
              @click="goThere('/'), deleteRouteByName(componentName)"
              dark
              icon
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item-group>
                <template v-for="(item, i) in list">
                  <v-list-item
                    class="wrap"
                    :key="i"
                    :to="`/admin_operations/${item.to}`"
                  >
                    <v-list-item-avatar>
                      <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.title"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="item.desc"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <complete-fugitive-data
      v-else-if="params.section == 'new'"
    ></complete-fugitive-data>
    <operation-history
      v-else-if="params.section == 'history'"
    ></operation-history>
    <operation-functions
      v-else-if="params.section == 'functions'"
    ></operation-functions>
  </div>
</template>

<script>
export default {
  name: "admin_operations",
  components: {
    CompleteFugitiveData: () =>
      import("@/components/sections/admin/operations/CompleteFugitiveData.vue"),
    OperationHistory: () =>
      import("@/components/sections/admin/operations/History.vue"),
    OperationFunctions: () =>
      import("@/components/sections/admin/operations/Functions.vue")
  },
  data: () => ({
    componentName: "admin_operations",
    model: true,
    list: [
      {
        title: "جديد",
        desc: "تشغيل عملية جديدة",
        to: "new",
        icon: "mdi-plus"
      },
      {
        title: "عرض الكل",
        desc: "عرض سجل العمليات, مع إمكانية استكمال غير المكتمل منها.",
        to: "history",
        icon: "mdi-file-document-outline"
      },
      {
        title: "Functions",
        desc:
          "خاصة بالنظم, وفيها يتم عرض وتعديل الـ functions الخاصة بالعمليات.",
        to: "functions",
        icon: "mdi-code-not-equal-variant"
      }
    ]
  }),
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  }
};
</script>
