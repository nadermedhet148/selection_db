<template>
  <v-card :loading="loading" :disabled="loading">
    <v-card-title>
      {{ title }}

      <v-spacer />

      <v-btn @click="$emit('on-add')" large outlined color="primary">
        {{ addBtnTitle }}
      </v-btn>
    </v-card-title>

    <v-divider />

    <v-card-text v-if="fields != null">
      <v-row>
        <template v-for="(f, i) in fields.filter(f => f.inSearch)">
          <v-col v-if="f.type !== 'date'" :key="i" cols="6" lg="4">
            <v-text-field
              v-if="!f.type || f.type == 'text'"
              filled
              :label="f.text"
              v-model="search[f.searchValue]"
              :hide-details="!f.hint"
              :persistent-hint="f.hint"
              @keypress.enter="$emit('on-search', search)"
            />

            <v-autocomplete
              v-else-if="f.type == 'select'"
              filled
              :multiple="f.multiple"
              :label="f.text"
              v-model="search[f.searchValue]"
              :hide-details="!f.hint"
              :persistent-hint="f.hint"
              :items="selects[f.searchValue] ? selects[f.searchValue].data : []"
              :item-value="
                selects[f.searchValue] ? selects[f.searchValue].value : 'value'
              "
              :item-text="
                selects[f.searchValue] ? selects[f.searchValue].text : 'text'
              "
            />

            <v-textarea
              v-else-if="f.type == 'textarea'"
              filled
              :label="f.text"
              v-model="search[f.searchValue]"
              :hide-details="!f.hint"
              :persistent-hint="f.hint"
              auto-grow
              rows="1"
            />

            <v-btn-toggle
              v-else-if="f.type == 'checkbox'"
              v-model="search[f.searchValue]"
              class="d-block"
            >
              <v-btn
                height="58"
                width="50%"
                :color="
                  search[f.searchValue] === true ? 'error white--text' : ''
                "
                :value="true"
                v-text="f.trueValue"
              />
              <v-btn
                height="58"
                width="50%"
                :color="
                  search[f.searchValue] === false ? 'success white--text' : ''
                "
                :value="false"
                v-text="f.falseValue"
              />
            </v-btn-toggle>
          </v-col>

          <v-col
            class="py-0"
            cols="8"
            :key="i + '_date'"
            v-else-if="f.type == 'date'"
          >
            <v-row v-if="search[f.searchValue]">
              <v-col cols="6">
                <v-text-field
                  filled
                  type="date"
                  :label="f.text + ' (من)'"
                  v-model="search[f.searchValue][0]"
                  :hide-details="!f.hint"
                  :persistent-hint="f.hint"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  filled
                  :label="f.text + ' (الى)'"
                  type="date"
                  v-model="search[f.searchValue][1]"
                  :hide-details="!f.hint"
                  :persistent-hint="f.hint"
                />
              </v-col>
            </v-row>
          </v-col>
        </template>
      </v-row>
    </v-card-text>

    <v-divider />

    <v-card-actions class="px-4 py-4">
      <v-btn
        class="px-6"
        @click="$emit('on-search', search)"
        large
        color="primary"
        v-text="'بحث'"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "CustomSearch",

  data: () => ({
    search: {}
  }),

  emits: ["on-search", "on-add"],

  props: {
    title: {
      type: String,
      default: "بحث متقدم"
    },
    addBtnTitle: {
      type: String,
      default: "إضافة"
    },
    loading: {
      type: Boolean,
      default: false
    },
    fields: {
      type: Array,
      default: () => []
    },
    selects: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
