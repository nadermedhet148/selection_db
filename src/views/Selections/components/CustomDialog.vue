<template>
  <v-dialog persistent v-model="open" scrollable max-width="1000">
    <v-card :loading="loading" :disabled="loading">
      <v-card-title>
        {{ title }}

        <v-spacer />

        <v-btn @click="$emit('on-close')" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="fields != null">
        <v-row>
          <template v-for="(f, i) in fields.filter(f => f.inModel)">
            <v-col :cols="f.cols ? f.cols : '4'" :key="i">
              <v-text-field
                v-if="!f.type || ['text', 'date'].includes(f.type)"
                filled
                :type="f.type == 'date' ? 'date' : 'text'"
                :label="f.text"
                v-model="data[f.searchValue]"
                :hide-details="!f.hint"
                :persistent-hint="f.hint"
                :readonly="f.readonly"
                @keypress.enter="$emit('on-submit', data)"
              />

              <v-autocomplete
                v-else-if="f.type == 'select'"
                filled
                :label="f.text"
                :multiple="f.multiple"
                :readonly="f.readonly"
                v-model="data[f.searchValue]"
                :hide-details="!f.hint"
                :persistent-hint="f.hint"
                :items="
                  selects[f.searchValue] ? selects[f.searchValue].data : []
                "
                :item-value="
                  selects[f.searchValue]
                    ? selects[f.searchValue].value
                    : 'value'
                "
                :item-text="
                  selects[f.searchValue] ? selects[f.searchValue].text : 'text'
                "
              />

              <v-textarea
                v-else-if="f.type == 'textarea'"
                filled
                :label="f.text"
                v-model="data[f.searchValue]"
                :hide-details="!f.hint"
                :persistent-hint="f.hint"
                auto-grow
                :readonly="f.readonly"
                rows="1"
              />

              <v-card
                v-else-if="f.type == 'checkbox'"
                flat
                tile
                color="transparent"
                class="pa-0 ma-0"
                :disabled="f.readonly"
              >
                <v-btn-toggle
                  v-model="data[f.searchValue]"
                  class="d-block"
                  mandatory
                >
                  <v-btn
                    height="58"
                    width="50%"
                    :color="
                      data[f.searchValue] === true ? 'error white--text' : ''
                    "
                    :value="true"
                    v-text="f.trueValue"
                  />
                  <v-btn
                    height="58"
                    width="50%"
                    :color="
                      data[f.searchValue] === false ? 'success white--text' : ''
                    "
                    :value="false"
                    v-text="f.falseValue"
                  />
                </v-btn-toggle>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-card-text>

      <v-card-actions class="px-4">
        <v-spacer />

        <v-btn
          color="primary"
          outlined
          large
          class="px-6"
          @click="$emit('on-close')"
          v-text="'رجوع'"
        />

        <v-btn
          color="primary"
          large
          class="px-6"
          @click="$emit('on-submit', data)"
          v-text="'حفظ '"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CustomDialog",

  data: () => ({
    data: {}
  }),

  emits: ["on-close", "on-submit"],

  props: {
    title: {
      type: String,
      default: null
    },
    open: {
      type: Boolean,
      default: false
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
      default: () => ({})
    }
  }
};
</script>
