<template>
  <div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      max-width="450"
      v-model="results.deleteModel"
    >
      <v-card :loading="results.loading" :disabled="results.loading">
        <v-card-title class="white--text error">
          حذف العمليات المحددة
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div>هل أنت متأكد من حذف {{ results.selected.length }} عملية ؟</div>
          <div>
            <span class="font-weight-bold error--text">لاحظ من فضلك</span> : في
            حالة حذف عملية, سيتم حذف الأخطاء المرتبطة بها.
          </div>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            color="error"
            outlined
            v-text="'رجوع'"
            @click="results.deleteModel = false"
          ></v-btn>
          <v-btn
            class="px-6"
            color="error"
            v-text="'حذف'"
            @click="deleteOperations()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-title>
        سجل العمليات
        <v-spacer></v-spacer>
        <v-btn
          v-if="isAdmin()"
          color="error"
          :disabled="!results.selected || results.selected.length == 0"
          icon
          @click="results.deleteModel = true"
        >
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        filled
        dense
        v-model.lazy="results.search"
      ></v-text-field> -->
      <v-data-table
        :search.sync="results.search"
        :headers="results.headers"
        v-model="results.selected"
        fixed-header
        item-key="id"
        show-select
        :loading="results.loading"
        :items="results.items"
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="results.items"
            :table="table"
            :filters.sync="tableFilters.operations"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters.operations"
            :table="table"
          ></table-footer-filters>
        </template>
        <template v-slot:item.errors_count="{ item }">
          <v-chip
            @click="
              item.webOperationErrors && item.webOperationErrors.length > 0
                ? getErrors(item.id)
                : () => {}
            "
          >
            {{ item.webOperationErrors ? item.webOperationErrors.length : 0 }}
          </v-chip>
        </template>
        <template v-slot:item.continue_operation="{ item }">
          <v-btn
            depressed
            color="primary"
            :disabled="item.endAt || !item.stopAt || item.webOperationId == 6"
            :to="`/admin_operations/new/${item.id}`"
          >
            استكمال
          </v-btn>
        </template>
        <template v-slot:item.stopPercent="{ item }">
          <span>{{ item.stopPercent }} %</span>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      persistent
      scrollable
      max-width="1200"
      v-model="errors.model"
    >
      <v-card>
        <v-card-title class="white--text error">
          عرض الأخطاء
          <v-spacer></v-spacer>
          <v-btn @click="errors.model = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-0 ma-0">
          <!-- <v-text-field
            v-model.lazy="errors.search"
            prepend-inner-icon="mdi-magnify"
            filled
            dense
          ></v-text-field> -->
          <v-data-table
            :loading="errors.loading"
            :headers="errors.headers"
            v-model="errors.selected"
            fixed-header
            :items="errors.items"
            :search.sync="errors.search"
            hide-default-header
            multi-sort
          >
            <template v-slot:header="table">
              <table-header-filters
                :items="errors.items"
                :table="table"
                :filters.sync="tableFilters.errors"
              ></table-header-filters>
            </template>
            <template v-slot:footer="table">
              <table-footer-filters
                :filters.sync="tableFilters.errors"
                :table="table"
              ></table-footer-filters>
            </template>
            <template v-slot:item.identifier="{ item }">
              <v-chip
                color="transparent"
                :text-color="
                  Number(item.identifier) == item.identifier
                    ? 'primary'
                    : 'default'
                "
                :to="
                  Number(item.identifier) == item.identifier
                    ? `/soldiers_plus/${item.identifier}`
                    : ''
                "
                @click.right="copyText(item.identifier)"
              >
                {{ item.identifier }}
              </v-chip>
            </template>
            <template v-slot:item.recordedAt="{ item }">
              <div v-if="item.recordedAt">
                <v-tooltip top color="black">
                  <template v-slot:activator="{ on }">
                    <v-chip v-on="on">
                      {{
                        item.recordedAt.substring(
                          0,
                          item.recordedAt.length - 1
                        ) | moment("from", "now")
                      }}
                    </v-chip>
                  </template>
                  <span v-text="item.recordedAt"></span>
                </v-tooltip>
              </div>
            </template>
            <template v-slot:item.errors="{ item }">
              <div v-if="item.errors">
                <template v-for="(error, i) in item.errors.split(' --||-- ')">
                  <v-chip :key="i">
                    {{ error }}
                  </v-chip>
                </template>
              </div>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon
                @click="
                  Number(item.identifier) == item.identifier
                    ? fixError(item.identifier)
                    : () => {}
                "
                color="primary"
                :disabled="Number(item.identifier) != item.identifier"
              >
                <v-icon>mdi-redo-variant</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "history",
  mounted() {
    this.getHistory();
  },
  data: () => ({
    componentName: "admin_operations",
    tableFilters: {
      errors: {},
      operations: {}
    },
    errors: {
      model: false,
      items: [],
      webOperationHistoryId: null,
      loading: false,
      selected: [],
      search: "",
      headers: [
        {
          text: "المعرف",
          value: "identifier"
        },
        {
          text: "الواصف",
          value: "describer"
        },
        {
          text: "الوقت",
          value: "recordedAt"
        },
        {
          text: "الأخطاء",
          value: "errors"
        },
        {
          text: "",
          value: "actions",
          sortable: false
        }
      ]
    },
    results: {
      search: "",
      loading: false,
      deleteModel: false,
      selected: [],
      items: [],
      headers: [
        {
          text: "ID",
          value: "id",
          sortable: true
        },
        {
          text: "الإسم",
          value: "webOperation.name",
          sortable: true
        },
        {
          text: "البداية",
          value: "startAt",
          sortable: true
        },
        {
          text: "آخر توقف",
          value: "stopAt",
          sortable: true
        },
        {
          text: "آخر توقف عند",
          value: "stopIn",
          sortable: true
        },
        {
          text: "آخر توقف %",
          value: "stopPercent",
          sortable: true
        },
        {
          text: "النهاية",
          value: "endAt",
          sortable: true
        },
        {
          text: "الأخطاء",
          value: "errors_count"
        },
        {
          text: "",
          value: "continue_operation"
        }
      ]
    }
  }),
  methods: {
    fixError(id) {
      //
    },
    async getErrors(id = "") {
      this.$set(this.errors, "items", []);
      if (!id) {
        this.showError("من فضلك حدد العملية المراد عرض أخطاءها.");
        return;
      }
      this.$set(this.errors, "loading", true);
      this.$set(this.errors, "model", true);
      let items = await this.api("global/get_all", {
        table: "webOperationErrors",
        where: {
          webOperationHistoryId: id
        }
      });
      if (items && items.ok && items.data) {
        this.$set(this.errors, "items", items.data);
      } else {
        this.showError(
          "حدث خطأ أثناء استدعاء أخطاء العملية من قاعدة البيانات."
        );
      }
      this.$set(this.errors, "loading", false);
    },
    async deleteOperations() {
      this.$set(this.results, "loading", true);
      let operations = this.results.selected,
        ids = operations.map(o => o.id),
        deleteErrors = await this.api("global/delete_all", {
          table: "webOperationErrors",
          where: {
            webOperationHistoryId: {
              $in: ids
            }
          }
        }),
        deleteHistory = await this.api("global/delete_all", {
          table: "webOperationHistories",
          where: {
            id: {
              $in: ids
            }
          }
        });
      this.$set(this.results, "deleteModel", false);
      this.$set(this.results, "selected", []);
      this.showSuccess("تم حذف العمليات المحددة.");
      this.getHistory();
    },
    async getHistory() {
      this.$set(this.results, "loading", true);
      let history = await this.api("global/get_all", {
        table: "webOperationHistories",
        include: [
          {
            model: "webOperations"
          },
          {
            model: "webOperationErrors"
          }
        ],
        returnObject: true
      });
      if (history && history.ok) {
        this.$set(
          this.results,
          "items",
          this.fixDates(history.data, ["startAt", "stopAt", "endAt"])
        );
      } else {
        this.showError("حدث خطأ أثناء استدعاء سجل العمليات.");
      }
      this.$set(this.results, "loading", false);
    }
  }
};
</script>
