<template>
<div>
    <v-card class="mt-8">
        <v-card-title>
            {{title}}
            <v-spacer></v-spacer>
            <printer-menu :disabled="items.length == 0" :data="printer" :fab="false"></printer-menu>
        </v-card-title>
        <v-divider></v-divider>
        <v-data-table :headers="headers.filter(h => h.inTable)" :items="items" hide-default-header fixed-header multi-sort ref="mainTable">

            <template v-slot:header="table">
                <table-header-filters :items="items" :table="table" :filters.sync="tableFilters"></table-header-filters>
            </template>
            <template v-slot:footer="table">
                <table-footer-filters :filters.sync="tableFilters" :table="table"></table-footer-filters>
            </template>

            <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="scope">
                <slot :name="slot" v-bind="scope" /></template>

        </v-data-table>
    </v-card>
</div>
</template>

<script>
export default {
    name: "table-bulider",
    filters: {
        filterStrLimit(str, limit) {
            return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
        }
    },
    props: {
        headers: {
            type: Array,
            default: () => ([])
        },
        items: {
            type: Array,
            default: () => ([])
        },
        printer: {
            type: Object,
            default: () => ({})
        },
        title: {
           type: String,
            default: () => ""
        }
    },
    data: () => ({
        tableFilters: {},
    }),
    methods: {
        removeFilter(key) {
            this.$set(this.filters, key, undefined);
        }
    }
};
</script>
