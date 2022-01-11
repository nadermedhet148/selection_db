<template>
  <div>
    <v-card :loading="loading">
      <v-card-title>
        {{ title }}
        <v-spacer></v-spacer>
        <v-btn icon @click="showEvent()">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-actions class="d-flex flex-row">
        <v-btn text @click="$refs.calendar.prev()">
          <v-icon small class="me-2">mdi-chevron-right</v-icon>
          السابق
        </v-btn>

        <v-divider vertical class="ms-1"></v-divider>
        <v-divider vertical class="me-1"></v-divider>
        <v-btn text @click="$refs.calendar.next()">
          التالي
          <v-icon small class="ms-2">mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          class="mr-2 filter filter-rows"
          v-model="rows"
          :items="rowsOptions"
          filled
          hide-details
          label="عدد الصفوف"
        ></v-select>
        <v-select
          class="mr-2 filter filter-columns"
          v-model="columns"
          :items="columnsOptions"
          :item-text="'text'"
          :item-vlaue="'value'"
          filled
          hide-details
          label="عدد الأعمدة"
        ></v-select>
        <v-select
          @change="filterCalendar"
          class="mr-2 filter filter-by-degrees"
          v-model="calendarDegreeIds"
          :items="calendarDegrees"
          :item-text="'displayedText'"
          :item-value="'id'"
          filled
          multiple
          hide-details
          clearable
          label="درجة الأهمية"
        ></v-select>
        <v-select
          @change="filterCalendar"
          class="mr-2 filter filter-by-types"
          v-model="calendarTypeIds"
          :items="calendarTypes"
          :item-text="'displayedText'"
          :item-value="'id'"
          hide-details
          filled
          multiple
          clearable
          label="نوع المهمة"
        ></v-select>
      </v-card-actions>
      <v-card-text class="pa-0">
        <div>
          <v-calendar
            ref="calendar"
            color="primary"
            locale-first-day-of-year="6"
            :weekdays="columns"
            :short-weekdays="false"
            :short-months="false"
            type="month"
            locale="ar"
            show-week
            :min-weeks="rows"
            event-overlap-mode="stack"
            :event-color="getEventColor"
            v-model="value"
            :events="eventsAfterFilter"
            @click:event="showEvent"
            @click:date="viewDay"
            @change="calendarChanged()"
          ></v-calendar>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex flex-row">
        <v-btn text @click="$refs.calendar.prev()">
          <v-icon small class="me-2">mdi-chevron-right</v-icon>
          السابق
        </v-btn>

        <v-divider vertical class="ms-1"></v-divider>
        <v-divider vertical class="me-1"></v-divider>
        <v-btn text @click="$refs.calendar.next()">
          التالي
          <v-icon small class="ms-2">mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          class="mr-2 filter filter-by-user"
          filled
          clearable
          multiple
          hide-details
          label="إسم المسئول"
          :items="users"
          :item-value="'userId'"
          :item-text="'realName'"
          v-model="usersId"
          @change="filterCalendar"
        ></v-select>
        <v-select
          class="mr-2 filter filter-by-section"
          filled
          clearable
          multiple
          hide-details
          label="القسم المختص"
        ></v-select>
      </v-card-actions>
    </v-card>
    <v-dialog
      max-width="600"
      persistent
      scrollable
      v-model="currentEvent.model"
    >
      <v-card :disabled="currentEvent.loading" :loading="currentEvent.loading">
        <v-card-title>
          {{ currentEvent.item.id ? "تعديل" : "إضافة" }}
          عنصر
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="currentEvent.model = false || $refs.form.resetValidation()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-row>
              <template v-for="(option, i) in options">
                <v-col
                  :key="i"
                  :cols="option.cols ? option.col : 12"
                  class="mb-0 pb-0"
                >
                  <v-text-field
                    class="mb-0"
                    v-if="option.type == 'text'"
                    :label="option.label"
                    :hint="option.hint"
                    v-model="currentEvent.item[option.model]"
                    filled
                    :rules="option.rules ? option.rules : []"
                    :required="option.required ? true : false"
                    :persistent-hint="option.hint ? true : false"
                    :loading="option.loading"
                    clearable
                  ></v-text-field>
                  <v-textarea
                    v-else-if="option.type == 'textarea'"
                    :label="option.label"
                    :hint="option.hint"
                    :rules="option.rules ? option.rules : []"
                    :required="option.required ? true : false"
                    v-model="currentEvent.item[option.model]"
                    filled
                    :hide-details="true"
                    :persistent-hint="option.hint ? true : false"
                    :loading="option.loading"
                    clearable
                  ></v-textarea>
                  <v-select
                    v-else-if="option.type == 'select'"
                    :label="option.label"
                    :hint="option.hint"
                    v-model="currentEvent.item[option.model]"
                    :items="option.items"
                    :item-value="option.item_value"
                    :item-text="option.item_text"
                    filled
                    :rules="option.rules ? option.rules : []"
                    :required="option.required ? true : false"
                    :persistent-hint="option.hint ? true : false"
                    :loading="option.loading"
                    clearable
                    return-object
                  ></v-select>
                  <v-text-field
                    v-else-if="
                      option.type == 'date' && !$store.state.appInfo.dateDialog
                    "
                    type="date"
                    v-model="currentEvent.item[option.model]"
                    :prepend-inner-icon="option.icon"
                    :label="option.label"
                    :hint="option.hint"
                    filled
                    :rules="option.rules ? option.rules : []"
                    :required="option.required ? true : false"
                    clearable
                    :persistent-hint="option.hint ? true : false"
                    :loading="option.loading"
                  ></v-text-field>
                </v-col>
              </template>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            large
            outlined
            color="primary"
            class="px-6"
            v-text="'رجوع'"
            @click="currentEvent.model = false || $refs.form.resetValidation()"
          ></v-btn>
          <v-btn
            large
            v-if="currentEvent.item.id"
            color="error"
            class="px-6"
            v-text="'حذف العنصر'"
            @click="deleteEvent()"
          ></v-btn>
          <v-btn
            large
            color="primary"
            class="px-6"
            v-text="currentEvent.item.id ? 'تعديل العنصر' : 'إضافة عنصر'"
            @click="saveEvent()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Calendar",
  mounted() {
    this.getEvents().then(this.getUsers);
    this.getDegrees();
    this.getTypes();
  },
  data() {
    let reqRule = [v => !!v || "الحقل إجباري"];
    return {
      loading: false,
      title: "",
      value: "",
      type: "month",
      types: [
        { text: "شهر", value: "month" },
        { text: "أسبوع", value: "week" },
        { text: "4 أيام", value: "4day" },
        { text: "يوم", value: "day" }
      ],
      columns: [6, 0, 1, 2, 3, 4, 5],
      columnsOptions: [
        { text: 2, value: [6, 0] },
        { text: 3, value: [6, 0, 1] },
        { text: 4, value: [6, 0, 1, 2] },
        { text: 5, value: [6, 0, 1, 2, 3] },
        { text: 6, value: [6, 0, 1, 2, 3, 4] },
        { text: 7, value: [6, 0, 1, 2, 3, 4, 5] }
      ],
      rows: 5, // min weeks
      rowsOptions: [5, 6, 7, 8, 9],
      calendarTypeIds: [],
      calendarTypes: [],
      calendarDegreeIds: [],
      calendarDegrees: [],
      usersId: [], // the selected users
      users: [], // have all users to select from it to filter
      events: [],
      eventsAfterFilter: [],
      currentEvent: {
        model: false,
        loading: false,
        item: {}
      },
      currentDay: "",
      options: [
        {
          label: "الإسم",
          model: "name",
          type: "text",
          hint: "حدد إسم المهمة أو الموضوع",
          rules: reqRule,
          required: true
        },
        {
          label: "الوصف",
          model: "description",
          type: "textarea",
          hint: "",
          rules: [],
          required: false
        },
        {
          label: "يبدأ في",
          cols: 6,
          model: "start",
          type: "date",
          hint: "بداية الحدث",
          rules: reqRule,
          required: true
        },
        {
          label: "ينتهي في",
          cols: 6,
          model: "end",
          type: "date",
          hint: "نهاية الحدث",
          rules: reqRule,
          required: true
        },
        {
          label: "الدرجة",
          model: "calendarDegree",
          cols: 6,
          type: "select",
          hint: "درجة الأهمية",
          items: [],
          item_value: "id",
          item_text: "displayedText",
          loading: true,
          rules: reqRule,
          required: true
        },
        {
          label: "نوع",
          model: "calendarType",
          cols: 6,
          type: "select",
          hint: "حدد نوع الموضوع",
          items: [],
          item_value: "id",
          item_text: "displayedText",
          loading: true,
          rules: reqRule,
          required: true
        }
      ]
    };
  },
  methods: {
    calendarChanged() {
      this.$set(this, "title", this.$refs.calendar.title);
    },
    showEvent(e) {
      this.currentEvent.item = e ? e.event : {};

      if (!e) {
        this.currentEvent.item.start = this.currentDay;
        this.currentEvent.item.end = this.currentDay;
      }

      this.$set(this.currentEvent, "model", true);
    },
    viewDay(e) {
      if (this.$refs.form) this.$refs.form.resetValidation();
      this.currentDay = e.date;
      this.showEvent();
      this.currentDay = {};
    },
    getEventColor(e) {
      let color = e.calendarType.color
        ? e.calendarType.color
        : e.calendarDegree
        ? e.calendarDegree.color
        : "secondary";
      return color;
    },
    async getEvents() {
      this.$set(this, "events", []);
      this.$set(this, "loading", true);
      await this.api("global/get_all", {
        table: "calendars",
        include: [
          {
            model: "calendarTypes"
          },
          {
            model: "calendarDegrees"
          },
          {
            model: "users"
          }
        ]
      })
        .then(x => {
          this.$set(this, "events", x.data);

          // filter data
          this.filterCalendar();

          //this.getUsers();
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.$set(this, "loading", false);
        });
    },
    saveEvent() {
      if (!this.$refs.form.validate()) {
        return;
      }
      if (this.currentEvent.item.id) {
        this.api("global/update_one", {
          table: "calendars",
          where: {
            id: this.currentEvent.item.id
          },
          update: {
            ...this.currentEvent.item,
            TypeId: this.currentEvent.item.calendarType.id
              ? this.currentEvent.item.calendarType.id
              : this.currentEvent.item.calendarType,
            DegreeId: this.currentEvent.item.calendarDegree.id
              ? this.currentEvent.item.calendarDegree.id
              : this.currentEvent.item.calendarDegree
          }
        })
          .then(() => {
            //this.getEvents();
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.api("global/create_one", {
          table: "calendars",
          where: {
            ...this.currentEvent.item,
            typeId: this.currentEvent.item.calendarType.id,
            degreeId: this.currentEvent.item.calendarDegree.id,
            addedBy: this.getCurrUserId
          }
        })
          .then(() => {
            this.getEvents();
          })
          .catch(err => {
            console.log(err);
          });
      }
      this.$set(this.currentEvent, "item", {});
      this.$refs.form.resetValidation();
      this.$set(this.currentEvent, "model", false);
    },
    deleteEvent() {
      this.api("global/delete_all", {
        table: "calendars",
        where: {
          id: this.currentEvent.item.id
        }
      })
        .then(() => {
          this.getEvents();
        })
        .catch(err => {
          console.log(err);
        });
      this.$set(this.currentEvent, "item", {});
      this.$set(this.currentEvent, "model", false);
    },
    getDegrees() {
      this.api("global/get_all", {
        table: "calendarDegrees"
      })
        .then(x => {
          this.calendarDegrees = x.data;
          this.options.find(o => o.model == "calendarDegree").items = x.data;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.options.find(o => o.model == "calendarDegree").loading = false;
        });
    },
    getTypes() {
      this.api("global/get_all", {
        table: "calendarTypes"
      })
        .then(x => {
          this.calendarTypes = x.data;
          this.options.find(o => o.model == "calendarType").items = x.data;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.options.find(o => o.model == "calendarType").loading = false;
        });
    },
    filterCalendar() {
      // get all data and then delete the extra events
      let events = this.events,
        degreeIds = this.calendarDegreeIds,
        typeIds = this.calendarTypeIds,
        usersId = this.usersId;
      let eventsAfterFilter = events.filter(event => {
        // if not empty and the id is not exist in the array return false to delete it
        return (degreeIds.length &&
          !degreeIds.includes(event.calendarDegree.id)) ||
          (typeIds.length && !typeIds.includes(event.calendarType.id)) ||
          (usersId.length &&
            event.user !== null &&
            !usersId.includes(event.user.userId))
          ? false
          : true;
      });

      this.eventsAfterFilter = eventsAfterFilter;
    },
    getUsers() {
      let events = this.events,
        users = [];
      events.forEach(event => {
        if (event.user !== null && !users.includes(event.user)) {
          users.push(event.user);
        }
      });

      this.users = users;
    }
  },
  computed: {
    getCurrUserId() {
      return this.$store.getters.getCurrUserId;
    }
  }
};
</script>

<style scoped>
.filter {
  flex: 1;
  display: inline-block;
}
.filter-rows,
.filter-columns {
  flex-grow: 0;
  flex-basis: 100px;
}

.filter-by-user {
  flex: 1;
}
.filter-by-section {
  flex: 0 1 270px;
}
</style>
