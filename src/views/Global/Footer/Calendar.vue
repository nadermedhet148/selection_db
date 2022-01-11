<template>
  <div>
    <v-card :loading="loading">
      <calendar-header
        :selects.sync="selects"
        :options.sync="options"
        :title.sync="title"
        @showEvent="showEvent"
        @calendarMove="calendarMove"
      ></calendar-header>
      <v-card-text class="px-0">
        <div v-if="showCalendar">
          <v-calendar
            ref="calendar"
            color="primary"
            locale-first-day-of-year="6"
            :weekdays="options.weekdays"
            :short-weekdays="false"
            show-week
            :min-weeks="options.minWeeks"
            :short-months="false"
            :event-more="false"
            show-month-on-first
            type="month"
            locale="ar"
            event-overlap-mode="stack"
            :event-color="getEventColor"
            v-model="value"
            :events="filteredEvents"
            @click:event="showEvent"
            @click:date="viewDay"
            @change="calendarChanged()"
          >
            <template v-slot:event="{ event, timed, eventSummary }">
              <div class="v-event-draggable">
                <span class="me-2" v-if="event.typeId">
                  <v-icon
                    :dark="
                      event.rndColor && event.rndColor.includes('black--text')
                        ? false
                        : true
                    "
                    v-text="eventTypeIcons[event.typeId]"
                  ></v-icon>
                </span>
                <!-- <span>
                  (
                  {{ event.calendarDegree.color }}
                  )
                </span> -->
                <span v-html="eventSummary()"></span>
              </div>
              <div v-if="timed" class="v-event-drag-bottom"></div>
            </template>
          </v-calendar>
        </div>
      </v-card-text>
      <calendar-header
        reversed
        :selects.sync="selects"
        :options.sync="options"
        :title.sync="title"
        @showEvent="showEvent"
        @calendarMove="calendarMove"
      ></calendar-header>
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
          <v-btn icon @click="currentEvent.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(f, i) in eventFields">
              <v-col :key="i" cols="12" :lg="f.halfWidth ? '6' : '12'">
                <v-text-field
                  v-if="['text', 'date'].includes(f.type)"
                  :type="f.type"
                  filled
                  :persistent-hint="f.hint ? true : false"
                  :hide-details="f.hint ? false : true"
                  :label="f.label"
                  v-model="currentEvent.item[f.value]"
                  :hint="f.hint"
                  clearable
                ></v-text-field>
                <v-textarea
                  v-else-if="f.type == 'textarea'"
                  filled
                  :persistent-hint="f.hint ? true : false"
                  :hide-details="f.hint ? false : true"
                  :label="f.label"
                  v-model="currentEvent.item[f.value]"
                  :hint="f.hint"
                  auto-grow
                  rows="1"
                  clearable
                ></v-textarea>
                <v-autocomplete
                  :disabled="f.disabled"
                  filled
                  v-else-if="f.type == 'select'"
                  :persistent-hint="f.hint ? true : false"
                  :hide-details="f.hint ? false : true"
                  :label="f.label"
                  v-model="currentEvent.item[f.value]"
                  :hint="f.hint"
                  :items="
                    selects && selects[f.value] && selects[f.value].data
                      ? selects[f.value].data
                      : []
                  "
                  :item-text="
                    selects && selects[f.value] && selects[f.value].itemText
                      ? selects[f.value].itemText
                      : 'displayedText'
                  "
                  :item-value="
                    selects && selects[f.value] && selects[f.value].itemValue
                      ? selects[f.value].itemValue
                      : 'id'
                  "
                  clearable
                ></v-autocomplete>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            large
            outlined
            color="primary"
            class="px-6"
            v-text="'رجوع'"
            @click="currentEvent.model = false"
          ></v-btn>
          <v-btn
            large
            color="primary"
            class="px-6"
            v-text="'حفظ العنصر'"
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
  components: {
    CalendarHeader: () => import("@/components/footer/calendar/header.vue")
  },
  mounted() {
    this.init();
    this.getEvents();
  },
  watch: {
    "options.sectionId"() {
      this.filterEvents();
    },
    "options.typeId"() {
      this.filterEvents();
    },
    "options.degreeId"() {
      this.filterEvents();
    },
    "options.start"() {
      this.filterEvents();
    },
    "currentEvent.item.typeId"(v) {
      let fields = this.eventFields.filter(f =>
          ["sectionId", "alarmId", "degreeId"].includes(f.value)
        ),
        disabled = false;
      if ([3, 4].includes(v)) {
        // لو أجازة أو راحة
        disabled = true;
      }
      fields.forEach(f => {
        f.disabled = disabled;
        if (disabled) {
          this.$set(this.currentEvent.item, f.value, null);
        }
      });
    }
  },
  data: () => ({
    showCalendar: false,
    loading: false,
    title: "",
    value: "",
    events: [],
    filteredEvents: [],
    currentEvent: {
      model: false,
      loading: false,
      item: {}
    },
    options: {
      minWeeks: "6",
      sectionId: [],
      typeId: [1],
      degreeId: [],
      weekdays: [6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5],
      start: null
    },
    eventTypeIcons: {
      1: "mdi-information-outline",
      2: "",
      3: "mdi-vector-ellipse",
      4: "mdi-vector-circle-variant"
    },
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange darken-1",
      "grey darken-2",
      "error",
      "error darken-3",
      "success",
      "info",
      "purple",
      "success lighten-4 black--text",
      "error lighten-4 black--text",
      "indigo lighten-4 black--text",
      "primary darken-4",
      "primary",
      "primary lighten-4 black--text"
      // "warning"
    ],
    eventFields: [
      {
        label: "العنوان",
        hint: "عنوان الحدث أو الموضوع",
        type: "text",
        value: "name",
        disabled: false
      },
      {
        label: "توضيح الموضوع",
        hint:
          "حقل اختياري. يمكنك وضع شرح للحدث أو الموضوع الذي سيحدث في هذا اليوم",
        type: "textarea",
        value: "description",
        disabled: false
      },
      {
        label: "تاريخ البداية",
        hint: "",
        halfWidth: true,
        type: "date",
        value: "start",
        disabled: false
      },
      {
        label: "تاريخ النهاية",
        halfWidth: true,
        hint: "",
        type: "date",
        value: "end",
        disabled: false
      },
      {
        label: "النوع",
        hint: "",
        halfWidth: true,
        type: "select",
        value: "typeId",
        disabled: false
      },
      {
        label: "درجة الأهمية",
        halfWidth: true,
        _hint: "سيتغير لون الحدث في جدول التقويم بناءاً على درجة الأهمية",
        type: "select",
        value: "degreeId",
        disabled: false
      },
      {
        label: "ميعاد التنبيه",
        hint: "متى يبدأ التنبيه للحدث؟",
        halfWidth: true,
        type: "select",
        value: "alarmId",
        disabled: false
      },
      {
        label: "القسم المختص",
        halfWidth: true,
        hint: "",
        type: "select",
        value: "sectionId",
        disabled: false
      }
    ],
    selects: {
      typeId: {
        table: "calendarTypes",
        itemText: "displayedText",
        itemValue: "id"
      },
      degreeId: {
        table: "calendarDegrees",
        itemText: "displayedText",
        itemValue: "id"
      },
      alarmId: {
        table: "calendarAlarms",
        itemText: "displayedText",
        itemValue: "id"
      },
      sectionId: {
        table: "sections",
        itemText: "displayedText",
        itemValue: "sectionId"
      },
      minWeeks: {
        data: ["6", "8", "10", "12"]
      },
      weekdays: {
        data: [
          {
            text: "7",
            value: [6, 0, 1, 2, 3, 4, 5]
          },
          {
            text: "14",
            value: [6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5]
          }
        ]
      }
    }
  }),
  methods: {
    calendarChanged() {
      this.$set(this, "title", this.$refs.calendar.title);
    },
    calendarMove(direction) {
      return this.$refs.calendar[direction]();
    },
    filterEvents() {
      this.$set(this, "filteredEvents", []);
      let events = this.events,
        { start, sectionId, typeId, degreeId } = this.options,
        filteredEvents = events.filter(
          e =>
            (sectionId.length == 0 || sectionId.includes(e.sectionId)) &&
            (typeId.length == 0 || typeId.includes(e.typeId)) &&
            (degreeId.length == 0 || degreeId.includes(e.degreeId)) &&
            (!start || e.start == start)
        );
      filteredEvents.forEach(e => {
        e.rndColor = this.rndColor();
      });
      this.$set(this, "filteredEvents", filteredEvents);
    },
    showEvent(e) {
      // console.log(e);
      // console.log("Event Emitted");
      this.$set(this.currentEvent, "item", {});
      this.$nextTick(() => {
        this.$set(
          this.currentEvent,
          "item",
          e && e.event ? { ...e.event } : {}
        );
        if (!e || !e.event) {
          this.$set(this.currentEvent.item, "typeId", 1);
          this.$set(this.currentEvent.item, "degreeId", 1);
          this.$set(this.currentEvent.item, "alarmId", 2);
          if (e && e.date) {
            this.$set(this.currentEvent.item, "start", e.date);
          }
        }
        this.$set(this.currentEvent, "model", true);
      });
    },
    viewDay(e) {
      // console.log(e);
      this.showEvent(e);
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    rndColor() {
      let colors = this.colors;
      // .filter(
      //   c => !this.filteredEvents.find(e => e.rndColor == c)
      // )
      return colors[this.rnd(0, colors.length - 1)];
    },
    getEventColor(e) {
      let color = "",
        typeId = this.options.typeId;
      if (
        !typeId.includes(1) &&
        !typeId.includes(2) &&
        (typeId.includes(3) || typeId.includes(4))
      ) {
        color = e.rndColor;
      } else {
        color =
          e.calendarType && e.calendarType.color
            ? e.calendarType.color
            : e.calendarDegree && e.calendarDegree.color
            ? e.calendarDegree.color
            : "secondary";
      }
      return color;
    },
    saveEvent() {
      let event = this.currentEvent.item,
        isUpdate = event.id ? true : false,
        index = isUpdate
          ? this.events.findIndex(e => e.id == event.id)
          : this.events.length;
      if (!event.name) {
        this.showError("من فضلك أدخل عنواناً للعنصر");
        return;
      }
      if (!event.start) {
        this.showError("من فضلك أدخل تاريخ بداية");
        return;
      }
      if (!event.end) {
        event.end = event.start;
      }
      if (!event.typeId) {
        event.typeId = 1;
      }
      if (!event.degreeId) {
        event.degreeId = 1;
      }
      if (!isUpdate) {
        event.addedBy = this.$store.state.currentUser.userId;
      }
      delete event.TypeId;
      delete event.DegreeId;
      this.$set(this, "showCalendar", false);
      this.$set(this.currentEvent, "loading", true);
      this.api(`global/${isUpdate ? "update" : "create"}_one`, {
        table: "calendars",
        where: isUpdate
          ? {
              id: event.id
            }
          : event,
        update: event,
        returner: "id"
      })
        .then(async x => {
          let newEvent = await this.api("global/get_one", {
            table: "calendars",
            where: {
              id: isUpdate ? event.id : x.data
            },
            include: [
              {
                model: "calendarTypes"
              },
              {
                model: "calendarDegrees"
              }
            ]
          });
          this.$set(
            this.events,
            index,
            newEvent.data
            // this.fixDates([newEvent.data], ["start", "end"])[0]
          );
          this.$set(this.currentEvent, "model", false);
          this.filterEvents();
          this.$set(this, "showCalendar", true);
        })
        .catch(error => {
          this.showError("عفواً, تعذر إضافة العنصر لقاعدة البيانات");
          this.$set(this, "showCalendar", true);
        })
        .finally(() => {
          this.$set(this.currentEvent, "loading", false);
        });
    },
    getEvents() {
      this.$set(this, "events", []);
      this.$set(this, "loading", true);
      let isAdmin = this.isAdmin(),
        mySectionId = this.$store.state.currentUser.section,
        where = {};
      if (!isAdmin) {
        where.sectionId = {
          $or: {
            $is: null,
            $eq: mySectionId
          }
        };
      }
      console.log(where);
      this.api("global/get_all", {
        table: "calendars",
        where,
        include: [
          {
            model: "calendarTypes"
          },
          {
            model: "calendarDegrees"
          }
        ]
      })
        .then(x => {
          // console.log(x.data);
          this.$set(this, "events", x.data);
          this.filterEvents();
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.$set(this, "loading", false);
          this.$set(this, "showCalendar", true);
        });
    },
    init() {
      let selects = this.selects;
      Object.keys(selects).forEach(key => {
        let { table, itemValue, itemText } = selects[key];
        if (table) {
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", {
            table,
            attrs: [itemValue, itemText]
          })
            .then(x => {
              this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
              console.log("Error loading: " + table);
              console.log(error);
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        }
      });
    }
  }
};
</script>
