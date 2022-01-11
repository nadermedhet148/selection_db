<template>
  <v-dialog
    v-model="model"
    scrollable
    :max-width="
      windows[window] && windows[window].width ? windows[window].width : '500'
    "
    persistent
    internal-activator
    v-if="isCurrentRoute('admin_holder')"
  >
    <v-card
      :loading="results.loading ? (window !== 0 ? 'white' : 'primary') : false"
      :disabled="results.loading"
    >
      <v-card-title
        :class="`${window !== 0 ? 'primary white--text' : ''} px-6 d-block`"
      >
        <v-row class="my-0 py-0">
          <v-col class="my-0 py-0 text-center align-self-center" cols="auto">
            <v-btn icon @click="tabTo()" v-if="window !== 0" dark>
              <v-icon>mdi-keyboard-backspace mdi-rotate-180</v-icon>
            </v-btn>
          </v-col>
          <v-col class="py-0 my-0 text-center">
            <div :class="`${window !== 0 ? '' : 'primary--text'}`">
              <div v-text="windows[window].title"></div>
              <div
                v-if="windows[window].desc"
                class="mt-2 text-body-1"
                v-text="windows[window].desc"
              ></div>
            </div>
          </v-col>
          <v-col class="my-0 py-0 text-center align-self-center" cols="auto">
            <v-btn icon @click="goThere('/'), deleteRouteByName(componentName)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-0 ma-0">
        <v-window v-model="window">
          <v-window-item>
            <v-list>
              <v-list-item-group v-model="window">
                <template v-for="(w, i) in windows[0].childs">
                  <v-list-item
                    @click="w.close ? closeRoute() : () => {}"
                    class="wrap"
                    :key="i"
                    :value="w.href ? false : w.to"
                    :disabled="w.disabled"
                    :to="w.href ? w.href : ''"
                  >
                    <v-list-item-avatar>
                      <v-icon size="30" v-text="w.icon"></v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title
                        class="primary--text font-weight-bold"
                        v-text="w.title"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="w.desc"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "intrance",
  data: () => ({
    componentName: "admin_holder",
    model: true,
    results: {
      loading: false
    },
    window: 0,
    windows: [
      {
        title: "هولدر رئيس الفرع",
        desc: "[تقارير]",
        childs: [
          {
            title: "البطاقات العلاجية",
            desc: "يقوم بعرض تقرير عن عدد البطاقات التي تم إصدارها",
            href: "/admin_holder/cards",
            close: true
          },
          {
            title: "الهاربين",
            desc: "يقوم بعرض تقرير عن الهاربين من الراتب عالي والمجندين",
            href: "/admin_holder/fugitives",
            close: false
          }
        ]
      }
    ]
  })
};
</script>
