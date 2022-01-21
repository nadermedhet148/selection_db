<template>
<div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
        <v-card-text>
            <v-row>
                <template v-for="(h, i) in headers.filter(h => h.inSearch)">
                    <v-col v-if="h.type !== 'date'" :key="i" cols="6" lg="4">
                        <v-text-field v-if="!h.type || h.type == 'text'" filled :label="h.text" v-model="search[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" @keypress.enter="findItems()"></v-text-field>
                        <v-autocomplete v-else-if="h.type == 'select'" filled :multiple="h.multiple" :label="h.text" v-model="search[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" :items="
                  selects[h.searchValue] ? selects[h.searchValue].data : []
                " :item-value="
                  selects[h.searchValue]
                    ? selects[h.searchValue].value
                    : 'value'
                " :item-text="
                  selects[h.searchValue] ? selects[h.searchValue].text : 'text'
                "></v-autocomplete>
                        <v-textarea v-else-if="h.type == 'textarea'" filled :label="h.text" v-model="search[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" auto-grow rows="1"></v-textarea>
                        <v-btn-toggle v-else-if="h.type == 'checkbox'" v-model="search[h.searchValue]" class="d-block">
                            <v-btn height="58" width="50%" :color="
                    search[h.searchValue] === true ? 'error white--text' : ''
                  " :value="true" v-text="h.trueValue"></v-btn>
                            <v-btn height="58" width="50%" :color="
                    search[h.searchValue] === false ? 'success white--text' : ''
                  " :value="false" v-text="h.falseValue"></v-btn>
                        </v-btn-toggle>
                    </v-col>
                    <v-col class="py-0" cols="8" :key="i + '_date'" v-else-if="h.type == 'date'">
                        <v-row v-if="search[h.searchValue]">
                            <v-col cols="6">
                                <v-text-field filled type="date" :label="h.text + ' (من)'" v-model="search[h.searchValue][0]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false"></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field filled :label="h.text + ' (الى)'" type="date" v-model="search[h.searchValue][1]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                </template>
            </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4 py-4">
            <v-btn class="px-6" @click="calculateReqRegionWithDirction()" large color="primary" v-text="'يومية عددية بمناطق التجنيد والإتجاهات'"></v-btn>
            <v-btn class="px-6" @click="calculateReqRegionWithKnowloadage()" large color="primary" v-text="'يومية عددية بمناطق التجنيد والمؤهلات'"></v-btn>
            <v-btn class="px-6" @click="calculateCityWithKnowloadage()" large color="primary" v-text="'يومية عددية بالمحافظات والمؤهلات'"></v-btn>
        </v-card-actions>
    </v-card>

    <v-card class="mt-8" v-if="items.length > 0">
        <v-card-title>
            <v-spacer></v-spacer>
            <printer-menu :disabled="items.length == 0" :data="printer" :fab="false"></printer-menu>
        </v-card-title>
        <v-divider></v-divider>
        <v-data-table :headers="headers.filter(h => h.inTable)" :items="items" hide-default-header fixed-header multi-sort>
            <template v-slot:header="table">
                <table-header-filters :items="items" :table="table" :filters.sync="tableFilters"></table-header-filters>
            </template>
            <template v-slot:footer="table">
                <table-footer-filters :filters.sync="tableFilters" :table="table"></table-footer-filters>
            </template>
            <template v-slot:item.ID="{ item }">
                <v-chip color="transparent" :to="`/soldiers_plus/${item.ID}`" @click.right="copyText(item.ID)">
                    {{ item.ID }}
                </v-chip>
            </template>
            <template v-slot:item.ID="{ item }">
                <v-chip color="transparent" :to="`/soldiers_plus/${item.ID}`" @click.right="copyText(item.ID)">
                    {{ item.ID }}
                </v-chip>
            </template>

            <template v-slot:item.Contnuity="{ item }">
                <v-chip @click="actionCertificatie(item)" :color="item.Contnuity == 'متابع' ? 'success' : 'gray'">
                    {{
              item.Contnuity
            }}
                </v-chip>
            </template>
        </v-data-table>
    </v-card>

</div>
</template>

<script>
const constants = require("../../Constant").default;
const levelsHeaders = [
    ...Object.keys(constants.levelMapping).map(ele => ({

        text: ele,
        value: constants.levelMapping[ele],
        sortable: true,
        inTable: true,
        sort: 1
    }))
];
const lodash = require("lodash");
const searchHeaders = [{
        text: "المرحلة",
        value: "RecuStage",
        searchValue: "RecuStage",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: false,
        inModel: false,
        sort: 1
    },
    {
        text: "الوحدة",
        value: "Unit",
        searchValue: "UnitID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: false,
        inModel: false,
        sort: 1
    },
]
export default {
    name: "dalies",
    mounted() {
        this.init();
    },
    filters: {
        filterStrLimit(str, limit) {
            return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
        }
    },
    data: () => ({
        groupedValue: [],
        subjectLimit: 10,
        search: {},
        searchLoading: false,
        headers: [
            ...searchHeaders

        ],
        items: [],
        tableFilters: {},
        componentName: "createdObject",
        selects: {
            RecuStage: {
                text: "text",
                value: "text",
                data: lodash.flattenDeep(
                    constants.years.map(year =>
                        constants.RecuStage.data.map(stage => `${stage.text}-${year}`)
                    )
                )
            },
            UnitID: {
                table: "Unit",
                value: "UnitID",
                text: "Unit"
            },
        },
        printer: {}
    }),
    watch: {},
    methods: {
        findItems() {
            this.$set(this, "searchLoading", true);
            this.$set(this, "items", []);
            let where = {
                    ...this.search
                },
                likes = ["ID"],
                multi = [];
         
            return this.api("global/get_all", {
                table: "Soldier",
                where : this.mapToQuery(where, likes , multi),
                include: [{
                    model: 'City'
                }]
            })
        },
        calculateReqRegionWithDirction() {

            this.findItems().then(x => {
                    let data = x.data,
                        printer = {
                            cons: [...data],
                            excelKey: "cons",
                            excelHeaders: this.headers.filter(f => f.inSearch)
                        };

                    const groupdData = {}

                    data.forEach(ele => {
                        const key = `${ele.RecuRegion}_${ele.Direction}`;
                        groupdData[key] = groupdData[key] || {
                            RecuRegion: ele.RecuRegion,
                            Direction: ele.Direction,
                            High: 0,
                            AboveAvg: 0,
                            Avg: 0,
                            Normal: 0,
                        }
                        groupdData[key][constants.levelMapping[ele.KnowledgeLevel]] =
                            groupdData[key][constants.levelMapping[ele.KnowledgeLevel]] + 1
                    })
                    this.$set(this, "headers", [
                        ...searchHeaders,
                        {
                            text: "منطقة التجنيد",
                            value: "RecuRegion",
                            sortable: true,
                            inTable: true,
                            sort: 1
                        },
                        {
                            text: "الاتجاه",
                            value: "Direction",
                            sortable: true,
                            inTable: true,
                            sort: 1
                        },
                        ...levelsHeaders

                    ]);

                    this.$set(this, "items", Object.values(groupdData));
                    this.$set(this, "printer", printer);
                })
                .catch(error => {

                    this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
                })
                .finally(() => {
                    this.$set(this, "searchLoading", false);
                });
        },
        calculateReqRegionWithKnowloadage() {
            this.findItems().then(x => {
                    let data = x.data,
                        printer = {
                            cons: [...data],
                            excelKey: "cons",
                            excelHeaders: this.headers.filter(f => f.inSearch)
                        };

                    const groupdData = {}

                    data.forEach(ele => {
                        groupdData[`${ele.RecuRegion}`] = groupdData[`${ele.RecuRegion}`] || {
                            RecuRegion: ele.RecuRegion,
                            High: 0,
                            AboveAvg: 0,
                            Avg: 0,
                            Normal: 0,
                        }
                        groupdData[`${ele.RecuRegion}`][constants.levelMapping[ele.KnowledgeLevel]] =
                            groupdData[`${ele.RecuRegion}`][constants.levelMapping[ele.KnowledgeLevel]] + 1
                    })
                    this.$set(this, "headers", [
                        ...searchHeaders,
                        {
                            text: "منطقة التجنيد",
                            value: "RecuRegion",
                            sortable: true,
                            inTable: true,
                            sort: 1
                        },
                        ...levelsHeaders

                    ]);

                    this.$set(this, "items", Object.values(groupdData));
                    this.$set(this, "printer", printer);
                })
                .catch(error => {
                    this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
                })
                .finally(() => {
                    this.$set(this, "searchLoading", false);
                });
        },
        calculateCityWithKnowloadage() {
            this.findItems().then(x => {
                    let data = x.data,
                        printer = {
                            cons: [...data],
                            excelKey: "cons",
                            excelHeaders: this.headers.filter(f => f.inSearch)
                        };

                    const groupdData = {}

                    data.forEach(ele => {
                        groupdData[`${ele.City.City}`] = groupdData[`${ele.City.City}`] || {
                            City: ele.City.City,
                            High: 0,
                            AboveAvg: 0,
                            Avg: 0,
                            Normal: 0,
                        }
                        groupdData[`${ele.City.City}`][constants.levelMapping[ele.KnowledgeLevel]] =
                            groupdData[`${ele.City.City}`][constants.levelMapping[ele.KnowledgeLevel]] + 1
                    })
                    this.$set(this, "headers", [
                        ...searchHeaders,
                        {
                            text: "المحافظة",
                            value: "City",
                            sortable: true,
                            inTable: true,
                            sort: 1
                        },
                        ...levelsHeaders

                    ]);
                    this.$set(this, "items", Object.values(groupdData));
                    this.$set(this, "printer", printer);
                })
                .catch(error => {
                    this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
                })
                .finally(() => {
                    this.$set(this, "searchLoading", false);
                });
        },
        init(specificTable = "") {
            // Get selects
            Object.keys(this.selects).forEach(key => {
                let {
                    table,
                    localTable,
                    text,
                    value
                } = this.selects[key];
                if (table) {
                    let obj = {
                        table
                    };
                    // obj.attrs = [text, value];
                    this.$set(this.selects[key], "loading", true);
                    this.api("global/get_all", obj)
                        .then(x => {
                            this.$set(this.selects[key], "data", x.data);
                        })
                        .catch(error => {
                            this.$set(
                                this.selects[key],
                                "error",
                                "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
                            );
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
