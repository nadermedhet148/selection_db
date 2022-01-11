<template>
  <thead class="v-data-table-header">
    <tr v-if="groups && groups.length > 0">
      <template v-for="(group, i) in groups">
        <th
          :style="
            `text-align: ${center ? 'center' : 'right'}; background-color: ${
              $vuetify.theme.dark ? '#333' : '#f5f5f5'
            }; border-bottom: 2px solid ${
              $vuetify.theme.dark ? '#777' : '#ddd'
            }; border-top: 2px solid ${
              $vuetify.theme.dark ? '#777' : '#ddd'
            }; ${
              i == groups.length - 1
                ? 'border-left: none !important;'
                : `border-left: 2px solid ${
                    $vuetify.theme.dark ? '#777' : '#ddd'
                  };`
            }`
          "
          :key="i"
          :colspan="headers.filter(h => h.group == group.id).length"
        >
          {{ group.title ? group.title : group.text }}
        </th>
      </template>
    </tr>
  </thead>
</template>

<script>
export default {
  name: "table-header-groups",
  props: {
    center: {
      type: Boolean,
      default: false
    },
    groups: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({})
};
</script>
