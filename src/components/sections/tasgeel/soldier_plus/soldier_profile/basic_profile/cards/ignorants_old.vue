<template>
  <div>
    <v-card :loading="loading" :disabled="loading">
      <v-row class="py-0 my-0">
        <v-col class="py-0 my-0">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            v-model.lazy="search"
            filled
            dense
          >
          </v-text-field>
        </v-col>
        <v-col cols="auto" class="my-0 py-0">
          <div class="pe-4 pt-1">
            <!-- <v-btn
              class="me-2"
              outlined
              v-if="isAdmin()"
              color="error"
              :disabled="selected.length == 0"
            >
              <v-icon>mdi-trash-can</v-icon>
            </v-btn> -->
            <v-btn
              @click="
                (addNew.model = true),
                  (addNew.type = 'create'),
                  (addNew.data.id = null)
              "
              color="primary"
              outlined
            >
              <v-icon class="me-2">mdi-plus</v-icon>
              إضافة جديد
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-data-table
        class="empty-cells-table"
        :items="externals"
        :headers="headers"
        :search.sync="search"
        fixed-header
        v-model="selected"
        item-key="id"
        show-select
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="externals"
            :table="table"
            :filters.sync="tableFilters"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters"
            :table="table"
          ></table-footer-filters>
        </template>
        <template v-slot:item.militaryId="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.militaryId}`"
            @click.right="copyText(item.militaryId)"
          >
            {{ item.militaryId }}
          </v-chip>
        </template>
        <template v-slot:item.fullName="{ item }">
          <v-chip
            color="transparent"
            :to="`/soldiers_plus/${item.militaryId}`"
            @click.right="copyText(item.fullName)"
          >
            {{ item.fullName }}
          </v-chip>
        </template>
        <!-- Non empty -->
        <template v-slot:item.supporterId="{ item }">
          <v-chip
            v-if="item.supporterId"
            small
            class="font-weight-bold"
            :color="colors[item.supporterId]"
          >
            {{ supporterIds[item.supporterId] }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-chip class="transparent">
            <v-btn icon @click="editSession(item.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn v-if="isAdmin()" icon @click="deleteSession(item.id)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      v-model="addNew.model"
      max-width="750"
    >
      <v-card>
        <v-card-title>
          {{ addNew.type == "create" ? "إضافة" : "تعديل" }}
          دورة
          <v-spacer></v-spacer>
          <v-btn icon @click="addNew.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-row>
            <v-col cols="6">
              <v-text-field
                filled
                v-model="addNew.data.sort"
                label="رقم الدورة"
                hint="مسلسل الدورة بالنسبة للجندي"
                persistent-hint
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                filled
                v-model="addNew.data.supporterId"
                label="النتيجة"
                hint="هل نجح الجندي في اجتياز الدورة أم رسب؟"
                persistent-hint
                :items="supporterIds_alt"
              ></v-autocomplete>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="date"
                filled
                v-model="addNew.data.from"
                label="من"
                hint="تاريخ بداية الدورة"
                persistent-hint
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="date"
                filled
                v-model="addNew.data.to"
                label="الى"
                hint="تاريخ نهاية الدورة"
                persistent-hint
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            v-text="'عودة'"
            @click="addNew.model = false"
            class="px-6"
            large
          ></v-btn>
          <v-btn
            color="primary"
            large
            v-text="addNew.type == 'create' ? 'إضافة' : 'تعديل' + ' الدورة'"
            @click="addNewSession()"
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "basic-profile-ignorants",
  props: {
    externals: {
      type: Array,
      default: () => []
    },
    conscripte: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    addNewSession() {
      this.$set(this.addNew, "loading", true);
      let { type, data } = this.addNew,
        id = data.id;
      delete data.id;
      let where = type == "create" ? data : { id };
      this.api(`global/${type == "create" ? "create" : "update"}_one`, {
        table: "failureSessions",
        update: {
          ...data
        },
        where
      })
        .then(x => {
          this.showSuccess("تم حفظ الدورة");
          this.$set(this.addNew, "model", false);
          this.goThere("/soldiers_plus");
          let intVal = setInterval(() => {
            this.goThere(`/soldiers_plus/${this.conscripte.militaryId}`);
            clearInterval(intVal);
          }, 500);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء حفظ الدورة");
        })
        .finally(() => {
          this.$set(this.addNew, "loading", false);
        });
    }
  },
  data: () => ({
    addNew: {
      loading: false,
      model: false,
      type: "",
      data: {
        id: null,
        sort: null,
        from: null,
        to: null,
        supporterId: null
      }
    },
    componentName: "soldiers_plus",
    tableFilters: {},
    supporterIds_alt: [
      {
        text: "ناجح",
        value: "7"
      },
      {
        text: "راسب",
        value: "6"
      }
    ],
    supporterIds: {
      "1": "شهادة محو أمية",
      "8": "خطاب نجاح",
      "4": "بيان نجاح بالدرجات",
      "2": "شهادة ابتدائية",
      "3": "راسب إعدادية",
      "5": "شهادة إعدادية",
      "6": "راسب",
      "7": "ناجح"
    },
    loading: false,
    colors: {
      1: "success",
      2: "error",
      3: "orange",
      4: "default"
    },
    selected: [],
    headers: [
      {
        text: "رقم الدورة",
        sortable: true,
        value: "sort"
      },
      {
        text: "من",
        sortable: true,
        value: "from"
      },
      {
        text: "الى",
        sortable: true,
        value: "to"
      },
      {
        text: "المؤيد",
        sortable: true,
        value: "supporterId"
      },
      {
        text: "",
        sortable: false,
        value: "actions"
      }
    ],
    search: ""
  })
};
</script>
