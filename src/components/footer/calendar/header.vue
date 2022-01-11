<template>
  <v-layout style="display: grid">
    <v-flex grow :style="`order: ${reversed ? '3' : '1'}`">
      <v-card-title>
        {{ title }}
        <v-spacer></v-spacer>
        <v-btn icon @click="emit('showEvent', null)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
    </v-flex>
    <v-flex grow order-sm-2>
      <v-divider></v-divider>
    </v-flex>
    <v-flex grow :style="`order: ${reversed ? '1' : '3'}`">
      <v-card-actions>
        <v-btn large text @click="emit('calendarMove', 'prev')">
          <v-icon small class="me-2">mdi-chevron-right</v-icon>
          السابق
        </v-btn>
        <v-divider vertical class="ms-1"></v-divider>
        <v-divider vertical class="me-1"></v-divider>
        <v-btn large text @click="emit('calendarMove', 'next')">
          التالي
          <v-icon small class="ms-2">mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-row :style="`max-width: ${isAdmin() ? '1150' : '950'}px`" dense>
          <v-col class="py-0">
            <v-autocomplete
              label="النوع"
              hide-details
              :items="selects.typeId.data"
              :item-text="selects.typeId.itemText"
              :item-value="selects.typeId.itemValue"
              filled
              v-model="options.typeId"
              multiple
            ></v-autocomplete>
          </v-col>
          <v-col class="py-0">
            <v-autocomplete
              label="درجة الأهمية"
              hide-details
              :items="selects.degreeId.data"
              :item-text="selects.degreeId.itemText"
              :item-value="selects.degreeId.itemValue"
              filled
              v-model="options.degreeId"
              multiple
            ></v-autocomplete>
          </v-col>
          <v-col class="py-0" v-if="isAdmin()">
            <v-autocomplete
              label="القسم المختص"
              hide-details
              :items="selects.sectionId.data"
              :item-text="selects.sectionId.itemText"
              :item-value="selects.sectionId.itemValue"
              v-model="options.sectionId"
              filled
              multiple
            ></v-autocomplete>
          </v-col>
          <v-col class="py-0">
            <v-text-field
              type="date"
              label="بداية الحدث"
              hide-details
              v-model="options.start"
              filled
            ></v-text-field>
          </v-col>
          <v-col class="py-0" style="max-width: 150px">
            <v-autocomplete
              label="الصفوف"
              hide-details
              :items="selects.minWeeks.data"
              v-model="options.minWeeks"
              filled
            ></v-autocomplete>
          </v-col>
          <v-col class="py-0" style="max-width: 150px">
            <v-autocomplete
              label="الأعمدة"
              hide-details
              :items="selects.weekdays.data"
              v-model="options.weekdays"
              filled
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "CalendarHeader",
  props: {
    reversed: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    selects: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({}),
  methods: {
    emit(method, param) {
      this.$emit(method, param);
    }
  }
};
</script>
