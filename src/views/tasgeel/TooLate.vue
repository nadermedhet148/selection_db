<template>
  <div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="search.model"
      :persistent="!search.model_reselect"
      width="500"
      scrollable
    >
      <!-- :loading="zones_loading || units_loading"
        :disabled="zones_loading || units_loading" -->
      <v-card>
        <v-card-title>
          من فضلك, قم بتحديد ما يلي
          <v-spacer></v-spacer>
          <v-btn
            @click="
              search.model_reselect
                ? (search.model = false)
                : (goThere('/'), deleteRouteByName(componentName))
            "
            icon
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div>
            <v-autocomplete
              :loading="zones_loading"
              :items="zones"
              item-text="zoneText"
              item-value="zoneId"
              v-model="search.selected_zone"
              label="الجيش / المنطقة"
              filled
              hint="بإمكانك عدم تحديد المنطقة, وفي هذه الحالة يجب تحديد الوحدة بالأسفل."
              persistent-hint
              class="mb-4"
              clearable
              :error-messages="zones_error"
              :append-icon="zones_error ? 'mdi-reload' : 'mdi-chevron-down'"
              @click:append="getZones()"
            ></v-autocomplete>
            <v-autocomplete
              :loading="units_loading"
              :items="shown_units"
              item-text="unitText"
              item-value="unitId"
              v-model="search.selected_unit"
              label="الوحدة"
              filled
              hint="في حالة عدم تحديد وحدة, سيتم عرض متأخرات المنطقة بالكامل."
              persistent-hint
              class="mb-4"
              clearable
              :error-messages="units_error"
              :append-icon="units_error ? 'mdi-reload' : 'mdi-chevron-down'"
              @click:append="getUnits()"
            ></v-autocomplete>
          </div>
          <!-- Impossible Condition -->
          <div v-if="params.section == '8'">
            <v-text-field
              v-model="search.late_from_date"
              prepend-inner-icon="mdi-calendar"
              label="متأخر ( منذ تاريخ )"
              hint="في حال أردت عرض المتأخرات منذ تاريخ معين, قم بتحديده."
              persistent-hint
              filled
              type="date"
              clearable
            >
            </v-text-field>
            <!-- <v-dialog
              ref="late_from_date_dialog"
              v-model="search.late_from_date_model"
              :return-value.sync="search.late_from_date"
              width="290px"
              persistent
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="search.late_from_date"
                  prepend-inner-icon="mdi-calendar"
                  label="متأخر ( منذ تاريخ )"
                  hint="في حال أردت عرض المتأخرات منذ تاريخ معين, قم بتحديده."
                  persistent-hint
                  readonly
                  filled
                  v-on="on"
                  clearable
                >
                </v-text-field>
              </template>
              <v-date-picker
                ref="date_from_picker"
                v-model="search.late_from_date"
                scrollable
                color="primary"
              >
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  outlined
                  class="px-6 text-capitalize"
                  @click="search.late_from_date_model = false"
                  >إلغاء</v-btn
                >
                <v-btn
                  color="primary"
                  class="px-6 text-capitalize"
                  @click="
                    $refs.late_from_date_dialog.save(search.late_from_date)
                  "
                  >حفظ</v-btn
                >
              </v-date-picker>
            </v-dialog> -->
            <!-- <v-card
              class="flat tile pa-0 ma-0"
              elevation="0"
              :disabled="!search.late_from_date"
            >
              <v-list rounded class="px-0 mb-2">
                <v-list-item-group v-model="search.hide_null_added_date">
                  <v-list-item
                    three-line
                    value="true"
                    color="primary"
                    :class="
                      search.hide_null_added_date == 'true'
                        ? ''
                        : 'grey lighten-3'
                    "
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="'اخفاء ما ليس له تاريخ بداية'"
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-text="
                          'هل تريد اخفاء المتأخرات التي أصبحت متأخرات قبل عمل function تحديد متى أصبح المتأخر متأخراً؟'
                        "
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon
                        :color="
                          search.hide_null_added_date == 'true' ? 'primary' : ''
                        "
                        >mdi-checkbox-{{
                          search.hide_null_added_date
                            ? "marked"
                            : "blank-outline"
                        }}</v-icon
                      >
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card> -->
            <v-text-field
              v-model="search.late_to_date"
              prepend-inner-icon="mdi-calendar"
              label="متأخر ( حتى تاريخ )"
              hint="في حال أردت عرض المتأخرات المنتهية, قم بتحديد هذا التاريخ."
              persistent-hint
              filled
              type="date"
              clearable
            >
            </v-text-field>
            <!-- <v-dialog
              ref="late_to_date_dialog"
              v-model="search.late_to_date_model"
              :return-value.sync="search.late_to_date"
              width="290px"
              persistent
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="search.late_to_date"
                  prepend-inner-icon="mdi-calendar"
                  label="متأخر ( حتى تاريخ )"
                  hint="في حال أردت عرض المتأخرات المنتهية, قم بتحديد هذا التاريخ."
                  persistent-hint
                  readonly
                  filled
                  
                  v-on="on"
                  clearable
                >
                </v-text-field>
              </template>
              <v-date-picker
                ref="date_to_picker"
                v-model="search.late_to_date"
                scrollable
                color="primary"
              >
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  outlined
                  class="px-6 text-capitalize"
                  @click="search.late_to_date_model = false"
                  >إلغاء</v-btn
                >
                <v-btn
                  color="primary"
                  class="px-6 text-capitalize"
                  @click="$refs.late_to_date_dialog.save(search.late_to_date)"
                  >حفظ</v-btn
                >
              </v-date-picker>
            </v-dialog> -->
          </div>
          <div>
            <v-text-field
              v-model="search.demob_date"
              prepend-inner-icon="mdi-calendar"
              label="التاريخ"
              hint="عرض المتأخرات الخاصة بالجنود الذين تاريخ تسريحهم قبل التاريخ المحدد."
              persistent-hint
              type="date"
              filled
              clearable
            >
            </v-text-field>
            <!-- <v-dialog
              ref="demob_date_dialog"
              v-model="search.demob_date_model"
              :return-value.sync="search.demob_date"
              width="290px"
              persistent
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="search.demob_date"
                  prepend-inner-icon="mdi-calendar"
                  label="التاريخ"
                  hint="عرض المتأخرات الخاصة بالجنود الذين تاريخ تسريحهم قبل التاريخ المحدد."
                  persistent-hint
                  readonly
                  filled
                  
                  v-on="on"
                  clearable
                >
                </v-text-field>
              </template>
              <v-date-picker
                ref="demob_date_picker"
                v-model="search.demob_date"
                scrollable
                color="primary"
              >
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  outlined
                  class="px-6 text-capitalize"
                  @click="search.demob_date_model = false"
                  >إلغاء</v-btn
                >
                <v-btn
                  color="primary"
                  class="px-6 text-capitalize"
                  @click="$refs.demob_date_dialog.save(search.demob_date)"
                  >حفظ</v-btn
                >
              </v-date-picker>
            </v-dialog> -->
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4 pt-4">
          <v-btn
            @click="goThere('/'), deleteRouteByName(componentName)"
            color="primary"
            text
            large
          >
            إغلاق للرئيسية
          </v-btn>
          <v-spacer></v-spacer>
          <!-- <v-btn
            @click="getResults(true)"
            class="px-6 text-capitalize"
            color="primary"
            large
            outlined
          >
            عرض المنتهية
          </v-btn> -->
          <v-btn
            @click="search.model_reselect ? (search.model = false) : goBack()"
            class="px-6 text-capitalize"
            color="primary"
            outlined
            large
          >
            رجوع
          </v-btn>
          <!-- :disabled="
              !search.selected_zone &&
                !search.selected_unit &&
                !search.demob_date
            " -->
          <v-btn
            @click="getResults"
            class="px-6 text-capitalize"
            color="primary"
            large
          >
            عرض المتأخرات
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text class="py-0">
            <v-row class="py-0">
              <v-col>
                الوحدة الحالية:
                {{
                  zones.find(u => u.zoneId == search.selected_zone)
                    ? zones.find(u => u.zoneId == search.selected_zone).zoneText
                    : ""
                }}
                -
                {{
                  shown_units.find(u => u.unitId == search.selected_unit)
                    ? shown_units.find(u => u.unitId == search.selected_unit)
                        .unitText
                    : ""
                }}
                <v-btn color="primary" icon @click="reSelectOptions()">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <printer-menu
                  :disabled="
                    Object.values(rev).filter(f =>
                      f.sections.includes(params.section)
                    )[selected_complex_table_i].records.length == 0
                  "
                  :data="{
                    cons: Object.values(rev).filter(f =>
                      f.sections.includes(params.section)
                    )[selected_complex_table_i].records,
                    excelKey: 'cons',
                    excelHeaders: search.showEnded
                      ? [
                          ...Object.values(rev).filter(f =>
                            f.sections.includes(params.section)
                          )[selected_complex_table_i].headers
                        ]
                      : [
                          ...Object.values(rev).filter(f =>
                            f.sections.includes(params.section)
                          )[selected_complex_table_i].headers
                        ].filter(c => !c.hideIfNotEnded)
                  }"
                  :fab="false"
                  :btn-text="
                    `طباعة ${
                      Object.values(rev).filter(f =>
                        f.sections.includes(params.section)
                      )[selected_complex_table_i].title
                    }`
                  "
                ></printer-menu>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <template v-if="show_type == 'basic'">
        <template v-for="n in 2">
          <v-col cols="12" :key="n">
            <template
              v-for="(val, i) in Object.values(rev).filter(
                f => f.sections.includes(params.section) && f.model
              )"
            >
              <v-card
                class="mb-6"
                v-if="val.model && i + 1 == n + Math.floor(i / 2) * 2"
                :key="i"
              >
                <v-card-title>
                  {{ val.title }}
                  <v-chip class="ms-4">
                    {{ val.records.length }}
                  </v-chip>
                </v-card-title>
                <div>
                  <!-- <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    dense
                    v-model="val.search"
                    filled
                  ></v-text-field> -->
                </div>
                <v-data-table
                  loading-text="جارِ تحميل البيانات"
                  multi-sort
                  :loading="val.loading"
                  :items="val.records"
                  :headers="
                    search.showEnded
                      ? val.headers
                      : val.headers.filter(c => !c.hideIfNotEnded)
                  "
                  :search.sync="val.search"
                  fixed-header
                  hide-default-header
                >
                  <template v-slot:header="table">
                    <table-header-filters
                      :items="val.records"
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
                  <template v-slot:item.openRow="{ item }">
                    <div>
                      <v-btn
                        @click="goThere(`/soldiers_plus/${item.militaryId}`)"
                        color="primary"
                        icon
                      >
                        <v-icon>mdi-link mdi-rotate-135</v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <template v-slot:item.procedures="{ item }">
                    <v-chip
                      outlined
                      small
                      v-for="(proc, ip) in item.procedures"
                      :key="ip"
                    >
                      <span class="font-weight-bold" v-text="proc"></span>
                    </v-chip>
                  </template>
                </v-data-table>
              </v-card>
            </template>
          </v-col>
        </template>
      </template>
      <template v-else>
        <!-- Complex View -->
        <v-col cols="12">
          <v-card>
            <v-tabs
              show-arrows
              v-model="selected_complex_table_i"
              height="60"
              slider-size="3"
            >
              <template
                v-for="(val, i) in Object.values(rev).filter(f =>
                  f.sections.includes(params.section)
                )"
              >
                <v-tab
                  class=" ls-0 text-body-1 grey--text"
                  active-class="primary--text"
                  :key="i + '_' + val.id"
                >
                  {{ val.title }}
                  <v-chip
                    class="ms-3"
                    :color="selected_complex_table_i == i ? 'primary' : ''"
                  >
                    <v-progress-circular
                      indeterminate
                      size="16"
                      width="2"
                      v-if="val.loading"
                    ></v-progress-circular>
                    <span v-else>
                      {{ val.records.length }}
                    </span>
                  </v-chip>
                </v-tab>
              </template>
            </v-tabs>
            <div>
              <!-- <v-text-field
                prepend-inner-icon="mdi-magnify"
                dense
                v-model="
                  Object.values(rev).filter(f =>
                    f.sections.includes(params.section)
                  )[selected_complex_table_i].search
                "
                filled
              ></v-text-field> -->
            </div>
            <v-data-table
              loading-text="جارِ تحميل البيانات"
              multi-sort
              :loading="
                Object.values(rev).filter(f =>
                  f.sections.includes(params.section)
                )[selected_complex_table_i].loading
              "
              :items="
                Object.values(rev).filter(f =>
                  f.sections.includes(params.section)
                )[selected_complex_table_i].records
              "
              :headers="
                search.showEnded
                  ? [
                      ...Object.values(rev).filter(f =>
                        f.sections.includes(params.section)
                      )[selected_complex_table_i].headers
                    ]
                  : [
                      ...Object.values(rev).filter(f =>
                        f.sections.includes(params.section)
                      )[selected_complex_table_i].headers
                    ].filter(c => !c.hideIfNotEnded)
              "
              :search.sync="
                [
                  ...Object.values(rev).filter(f =>
                    f.sections.includes(params.section)
                  )[selected_complex_table_i].headers
                ].search
              "
              fixed-header
              hide-default-header
            >
              <template v-slot:header="table">
                <table-header-filters
                  :items="
                    Object.values(rev).filter(f =>
                      f.sections.includes(params.section)
                    )[selected_complex_table_i].records
                  "
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
              <template v-slot:item.openRow="{ item }">
                <div>
                  <v-btn
                    @click="goThere(`/soldiers_plus/${item.militaryId}`)"
                    color="primary"
                    icon
                  >
                    <v-icon>mdi-link mdi-rotate-135</v-icon>
                  </v-btn>
                </div>
              </template>
              <template v-slot:item.procedures="{ item }">
                <v-chip
                  outlined
                  small
                  v-for="(proc, i) in item.procedures"
                  :key="i"
                >
                  <span class="font-weight-bold" v-text="proc"></span>
                </v-chip>
              </template>
              <template v-slot:item.ignorantProcedures="{ item }">
                <v-chip outlined small>
                  <span
                    class="font-weight-bold"
                    v-text="'بيان محو أمية'"
                  ></span>
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <!--Object.values(rev).filter(f => f.sections.includes(params.section))  -->
    <!-- <military-printer :data="rev" ref="printer_1"></military-printer> -->
    <!-- <app-fab
      color="primary"
      @reSelectOptions="reSelectOptions"
      @show_print_dialog="$refs.printer_1.showDialog()"
      @select_shown_tables="shown_tables_model = true"
      :items="fab_items"
    ></app-fab> -->
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      v-model="shown_tables_model"
      max-width="900"
    >
      <v-card>
        <v-card-title>
          <v-row>
            <v-col class="py-0">
              الإعدادات
            </v-col>
            <v-col cols="auto" class="py-0">
              <v-btn @click="shown_tables_model = false" icon>
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-card tile flat class="pa-0 ma-0">
                <div class="text-body-1  pt-4 pb-1">
                  طريقة العرض
                </div>
                <v-divider></v-divider>
                <v-list three-line rounded class="px-0">
                  <v-list-item-group
                    color="primary"
                    v-model="show_type"
                    mandatory
                  >
                    <template v-for="(type, i) in show_types">
                      <v-list-item :key="i" :value="type.value">
                        <v-list-item-avatar>
                          <v-icon v-text="type.icon"></v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="type.text"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-text="type.desc"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn
                            icon
                            :color="type.value == show_type ? 'primary' : ''"
                          >
                            <v-icon
                              v-text="
                                type.value == show_type
                                  ? 'mdi-checkbox-marked-outline'
                                  : 'mdi-checkbox-blank-outline'
                              "
                            ></v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </template>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
              <v-card
                :disabled="show_type != 'basic'"
                tile
                flat
                class="pa-0 ma-0"
              >
                <div class="text-body-1  pt-4 pb-1">
                  إظهار / اخفاء الجداول
                </div>
                <v-divider></v-divider>
                <v-list rounded class="px-0">
                  <template v-for="(val, key, i) in rev">
                    <v-list-item
                      class="wrap"
                      v-if="val.sections.includes(params.section)"
                      :key="i"
                      @click="val.model = !val.model"
                    >
                      <v-list-item-avatar>
                        <v-icon v-text="val.icon"></v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="val.title"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-text="val.desc"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn icon :color="val.model ? 'primary' : ''">
                          <v-icon
                            v-text="
                              val.model
                                ? 'mdi-checkbox-marked-outline'
                                : 'mdi-checkbox-blank-outline'
                            "
                          ></v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                    <!-- <v-divider
                      v-if="Object.keys(rev).length > i + 1"
                      :key="i + 'd'"
                    ></v-divider> -->
                  </template>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <!-- <v-divider></v-divider>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            large
            class="px-6"
            color="primary"
            outlined
            v-text="'رجوع'"
            @click="shown_tables_model = false"
          ></v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "too_late",
  mounted() {
    this.getUnits();
    this.getZones();
  },
  watch: {
    selected_complex_table_i(v) {
      let key = Object.keys(this.rev)[v];
      this.$set(this, "selected_complex_table", key);
    },
    selected_zone(v) {
      this.$set(
        this,
        "shown_units",
        v || v === 0 ? this.units.filter(u => u.zoneId === v) : this.units
      );
    },
    late_from_date(v) {
      console.log(v);
      if (!v) {
        this.$set(this.search, "hide_null_added_date", "");
      }
    },
    params: {
      handler(a, b) {
        if (a === b) {
          return;
        }
        this.$set(this.search, "model", true);
        this.$set(this.search, "model_reselect", false);
        Object.keys(this.rev).forEach(key => {
          this.$set(this.rev[key], "records", []);
        });
      },
      deep: true
    }
  },
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      console.log("Index : " + index);
      return params;
    },
    late_from_date: {
      get() {
        return this.search.late_from_date;
      },
      set(v) {
        return v;
      }
    },
    selected_zone: {
      get() {
        return this.search.selected_zone;
      },
      set(v) {
        return v;
      }
    }
  },
  data: () => ({
    componentName: "too_late",
    tableFilters: {},
    show_type: "complex",
    selected_complex_table: "injuries",
    selected_complex_table_i: 0,
    show_types: [
      {
        text: "البدائية",
        desc:
          "عرض البيانات في جداول مختلفة, مما يجعل حجم الصفحة أكبر, ويضعف التركيز.",
        value: "basic",
        icon: ""
      },
      {
        text: "المتقدمة",
        desc:
          "عرض البيانات في جدول واحد, مما يزيد قوة التركيز, ويصغر حجم الصفحة.",
        value: "complex",
        icon: ""
      }
    ],
    fab_items: [
      {
        text: "الإعدادات",
        icon: "mdi-cog",
        color: "success",
        action: "select_shown_tables"
      },
      {
        text: "طباعة",
        icon: "mdi-printer",
        color: "orange",
        action: "show_print_dialog"
      },
      {
        text: "تعديل الخيارات",
        icon: "mdi-pencil",
        color: "error",
        action: "reSelectOptions"
      }
    ],
    search: {
      model: true,
      model_reselect: false,
      loading: false,
      selected_unit: null,
      selected_zone: null,
      late_from_date: null,
      hide_null_added_date: "",
      late_from_date_model: false,
      late_to_date: null,
      late_to_date_model: false,
      demob_date: null,
      demob_date_model: false,
      showEnded: false
    },
    openRowHeader: {
      text: "",
      sortable: false,
      value: "openRow"
    },
    rev: {
      injuries: {
        id: "injuries",
        title: "الإصابات",
        sections: ["1", "2"],
        desc: "عرض كل من به إصابة أو مرض.",
        model: true,
        loading: false,
        search: "",
        records: [],
        headers: [
          {
            text: "الرقم العسكري",
            sortable: true,
            value: "militaryId"
          },
          {
            text: "الدرجة",
            sortable: true,
            value: "degree.degreeType"
          },
          {
            text: "الإسم",
            sortable: true,
            value: "fullName"
          },
          {
            text: "الوحدة",
            sortable: true,
            value: "unit.unitText"
          },

          {
            text: "تاريخ التسريح",
            sortable: true,
            value: "demobilizationDate"
          },
          {
            text: "متأخر منذ تاريخ",
            sortable: true,
            value: "injuries.followedAddedDate"
          },
          {
            text: "انتهى بتاريخ",
            sortable: true,
            value: "injuries.followedEndedDate",
            hideIfNotEnded: true
          },
          {
            text: "الإجراءات",
            sortable: true,
            value: "procedures"
          }
        ]
      },
      courts: {
        id: "courts",
        title: "المحاكم",
        sections: ["1", "2"],
        desc: "عرض كل من له محكمة",
        model: true,
        loading: false,
        search: "",
        records: [],
        headers: [
          {
            text: "الرقم العسكري",
            sortable: true,
            value: "militaryId"
          },
          {
            text: "الدرجة",
            sortable: true,
            value: "degree.degreeType"
          },
          {
            text: "الإسم",
            sortable: true,
            value: "fullName"
          },
          {
            text: "الوحدة",
            sortable: true,
            value: "unit.unitText"
          },

          {
            text: "تاريخ التسريح",
            sortable: true,
            value: "demobilizationDate"
          },
          {
            text: "متأخر منذ تاريخ",
            sortable: true,
            value: "courts.followedAddedDate"
          },
          {
            text: "انتهى بتاريخ",
            sortable: true,
            value: "courts.followedEndedDate",
            hideIfNotEnded: true
          },
          {
            text: "الإجراءات",
            sortable: true,
            value: "procedures"
          }
        ]
      },
      ignorants: {
        id: "ignorants",
        title: "الأميين",
        sections: ["1", "2"],
        desc: "عرض الأميين فقط داخل الوحدة",
        model: true,
        loading: false,
        search: "",
        records: [],
        headers: [
          {
            text: "الرقم العسكري",
            sortable: true,
            value: "militaryId"
          },
          {
            text: "الدرجة",
            sortable: true,
            value: "degree.degreeType"
          },
          {
            text: "الإسم",
            sortable: true,
            value: "fullName"
          },
          {
            text: "الوحدة",
            sortable: true,
            value: "unit.unitText"
          },

          {
            text: "تاريخ التسريح",
            sortable: true,
            value: "demobilizationDate"
          },
          {
            text: "متأخر منذ تاريخ",
            sortable: true,
            value: "ignorantFollowedAddedDate"
          },
          {
            text: "انتهى بتاريخ",
            sortable: true,
            value: "ignorantFollowedEndedDate",
            hideIfNotEnded: true
          },
          {
            text: "الإجراءات",
            sortable: true,
            value: "ignorantProcedures"
          }
        ]
      },
      demob_notes: {
        id: "demob_notes",
        title: "ملاحظات تسريح",
        sections: ["2"],
        desc: "عرض كل من له ملاحظات تسريح تمنعه من النقل الى الإحتياط",
        model: true,
        loading: false,
        search: "",
        records: [],
        headers: [
          {
            text: "الرقم العسكري",
            sortable: true,
            value: "militaryId"
          },
          {
            text: "الدرجة",
            sortable: true,
            value: "degree.degreeType"
          },
          {
            text: "الإسم",
            sortable: true,
            value: "fullName"
          },
          {
            text: "الوحدة",
            sortable: true,
            value: "unit.unitText"
          },

          {
            text: "الفئة",
            sortable: true,
            value: "group.groupName"
          },
          {
            text: "تاريخ التسريح",
            sortable: true,
            value: "demobilizationDate"
          },
          // {
          //   text: "متأخر منذ تاريخ",
          //   sortable: true,
          //   value: "demobNotesAddedDate"
          // },
          // {
          //   text: "انتهى بتاريخ",
          //   sortable: true,
          //   value: "demobNotesEndedDate",
          //   hideIfNotEnded: true
          // },
          {
            text: "ملاحظات التسريح",
            sortable: true,
            value: "notesDemobilization"
          }
        ]
      },
      medical_commettees: {
        id: "medical_commettees",
        title: "اللجان الطبية",
        sections: ["3"],
        desc: "عرض كل من له لجنة طبية",
        model: true,
        loading: false,
        search: "",
        records: [],
        headers: [
          {
            text: "الرقم العسكري",
            sortable: true,
            value: "militaryId"
          },
          {
            text: "الدرجة",
            sortable: true,
            value: "degree.degreeType"
          },
          {
            text: "الإسم",
            sortable: true,
            value: "fullName"
          },
          {
            text: "الوحدة",
            sortable: true,
            value: "unit.unitText"
          },

          {
            text: "تاريخ التسريح",
            sortable: true,
            value: "demobilizationDate"
          },
          {
            text: "متأخر منذ تاريخ",
            sortable: true,
            value: "medicalCommittees.followedAddedDate"
          },
          {
            text: "انتهى بتاريخ",
            sortable: true,
            value: "medicalCommittees.followedEndedDate",
            hideIfNotEnded: true
          },
          {
            text: "الإجراءات",
            sortable: true,
            value: "procedures"
          }
        ]
      }
    },
    units: [],
    shown_units: [],
    units_loading: false,
    units_error: "",
    zones: [],
    zones_loading: false,
    zones_error: "",
    shown_tables_model: false
  }),
  methods: {
    reSelectOptions() {
      this.$set(this.search, "model", true);
      this.$set(this.search, "model_reselect", true);
    },
    getResults(getFinished = false) {
      this.$set(
        this.search,
        "showEnded",
        this.search.late_to_date ? true : false
      );
      if (this.params.section == "1") {
        this.getRevIgnorants();
        this.getRevInjuries();
        this.getRevCourts();
      }
      if (this.params.section == "2") {
        this.getRevIgnorants();
        this.getRevDemobNotes();
        this.getRevInjuries();
        this.getRevCourts();
      }
      if (this.params.section == "3") {
        this.getRevMedicalCommettees();
      }
      this.$set(this.search, "model", false);
    },
    getRevIgnorants(getFinished = false) {
      this.$set(this.rev.ignorants, "loading", true);
      this.api("sections/tasgeel/too_late/ignorants", {
        getFinished,
        hide_null_added_date: this.search.hide_null_added_date,
        unit: this.search.selected_unit,
        zone: this.search.selected_zone,
        from_date: this.search.late_from_date,
        to_date: this.search.late_to_date,
        demob_date: this.search.demob_date,
        section: this.params.section
      })
        .then(x => {
          this.$set(
            this.rev["ignorants"],
            "records",
            this.fixDates(x.data, [
              "ignorantFollowedAddedDate",
              "ignorantFollowedEndedDate",
              "demobilizationDate"
            ])
          );
          console.log(x.data);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.$set(this.rev.ignorants, "loading", false);
        });
    },
    getRevDemobNotes(getFinished = false) {
      this.$set(this.rev.demob_notes, "loading", true);
      this.api("sections/tasgeel/too_late/demob_notes", {
        demob_date: this.search.demob_date,
        unit: this.search.selected_unit,
        zone: this.search.selected_zone
      })
        .then(x => {
          this.$set(
            this.rev["demob_notes"],
            "records",
            this.fixDates(x.data, ["demobilizationDate"])
          );
          console.log(x.data);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.$set(this.rev.demob_notes, "loading", false);
        });
    },
    getRevMedicalCommettees(getFinished = false) {
      this.$set(this.rev.medical_commettees, "loading", true);
      this.api("sections/tasgeel/too_late/medical_commettees", {
        getFinished,
        hide_null_added_date: this.search.hide_null_added_date,
        unit: this.search.selected_unit,
        zone: this.search.selected_zone,
        from_date: this.search.late_from_date,
        to_date: this.search.late_to_date
      })
        .then(x => {
          this.$set(
            this.rev["medical_commettees"],
            "records",
            this.fixDates(
              x.data,
              [
                "medicalCommittees.followedAddedDate",
                "medicalCommittees.followedEndedDate",
                "demobilizationDate"
              ],
              true
            )
          );
          console.log(x.data);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.$set(this.rev.medical_commettees, "loading", false);
        });
    },
    getRevInjuries(getFinished = false) {
      this.$set(this.rev.injuries, "loading", true);
      this.api("sections/tasgeel/too_late/injuries", {
        getFinished,
        hide_null_added_date: this.search.hide_null_added_date,
        unit: this.search.selected_unit,
        zone: this.search.selected_zone,
        from_date: this.search.late_from_date,
        to_date: this.search.late_to_date,
        demob_date: this.search.demob_date,
        section: this.params.section
      })
        .then(x => {
          this.$set(
            this.rev["injuries"],
            "records",
            this.fixDates(
              x.data,
              [
                "injuries.followedAddedDate",
                "injuries.followedEndedDate",
                "demobilizationDate"
              ],
              true
            )
          );
          console.log(x.data);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.$set(this.rev.injuries, "loading", false);
        });
    },
    getRevCourts(getFinished = false) {
      this.$set(this.rev.courts, "loading", true);
      this.api("sections/tasgeel/too_late/courts", {
        getFinished,
        hide_null_added_date: this.search.hide_null_added_date,
        unit: this.search.selected_unit,
        zone: this.search.selected_zone,
        from_date: this.search.late_from_date,
        to_date: this.search.late_to_date,
        demob_date: this.search.demob_date,
        section: this.params.section
      })
        .then(x => {
          this.$set(
            this.rev["courts"],
            "records",
            this.fixDates(
              x.data,
              [
                "courts.followedAddedDate",
                "courts.followedEndedDate",
                "demobilizationDate"
              ],
              true
            )
          );
          console.log(x.data);
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.$set(this.rev.courts, "loading", false);
        });
    },
    getUnits() {
      this.units_loading = true;
      this.$set(this, "units_error", "");
      this.api("tables/units/all_units")
        .then(records => {
          this.$set(this, "units", records.data);
          this.$set(this, "shown_units", records.data);
        })
        .catch(error => {
          console.log(error);
          this.$set(this, "units_error", "حدث خطأ أثناء تحميل الوحدات");
        })
        .finally(() => {
          this.units_loading = false;
        });
    },
    getZones() {
      this.zones_loading = true;
      this.$set(this, "zones_error", "");
      this.api("tables/zones/all_zones")
        .then(records => {
          this.$set(this, "zones", records.data);
        })
        .catch(error => {
          console.log(error);
          this.$set(
            this,
            "zones_error",
            "حدث خطأ أثناء تحميل الجيوش / المناطق"
          );
        })
        .finally(() => {
          this.zones_loading = false;
        });
    },
    show_print_dialog() {}
  }
};
</script>
