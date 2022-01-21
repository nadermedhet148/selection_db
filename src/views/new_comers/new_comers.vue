<template>
<div>
    <v-card :loading="searchLoading" :disabled="searchLoading">
        <v-card-title>
            بحث متقدم في تمام وصول المستجدين
            <v-spacer></v-spacer>
            <v-btn @click="actionAdd()" large outlined color="primary">
                إضافة تمام جديد
            </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-row>
                <template v-for="(h, i) in newCommersTable.headers.filter(h => h.inSearch)">
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
            <v-btn class="px-6" :v-if="newCommersTable.items.length > 0" @click="findItems()" large color="primary" v-text="'بحث'"></v-btn>
            <v-btn class="px-6" @click="calculateRecRegionWithKnowloadage" large color="primary" v-text="'عرض اليومية العددية للافراد المستجدين'"></v-btn>

        </v-card-actions>
    </v-card>

    <v-dialog persistent v-model="newCommersStatesTable.isDisplayed" scrollable max-width="750">

        <v-card>
            <v-btn @click="newCommersStatesTable.isDisplayed = false" icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <table-bulider :headers="distTable.headers" :printer="distTable.printer" :items="distTable.items" :title="'المخطط الزمني للمرحلة'">

            </table-bulider>

            <table-bulider :headers="newCommersStatesTable.headers" :printer="newCommersStatesTable.printer" :items="newCommersStatesTable.items" :title="'اليومية العددية للافراد المستجدين'">

            </table-bulider>
        </v-card>
    </v-dialog>

    <v-card class="mt-8">
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th v-for="item in groupedValue" :key="item.name">
                            {{ item.title }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td v-for="item in groupedValue" :key="item.name">
                            {{ item.value }}
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>

        <table-bulider :headers="newCommersTable.headers" :printer="newCommersTable.printer" :items="newCommersTable.items" :title="' تمامات الوصول'">
        </table-bulider>
    </v-card>
    <v-dialog v-if="isCurrentRoute(componentName)" scrollable :fullscreen="textDialog.fullscreen" v-model="textDialog.model" max-width="650">
        <v-card>
            <v-card-title>
                {{ textDialog.title }}
                <v-spacer></v-spacer>
                <v-btn icon @click="textDialog.fullscreen = !textDialog.fullscreen">
                    <v-icon>mdi-window-{{
                textDialog.fullscreen ? "restore" : "maximize"
              }}</v-icon>
                </v-btn>
                <v-btn icon @click="textDialog.model = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-4">
                <dynamic-link :prefix="['@', '#']" :text="textDialog.text.replace(/(?:\r\n|\r|\n)/g, '<br />')"></dynamic-link>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog persistent v-model="createdObject.model" scrollable max-width="750">
        <v-card :loading="createdObject.loading" :disabled="createdObject.loading">
            <v-card-title>
                <v-spacer></v-spacer>
                <v-btn @click="createdObject.model = false" icon>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <template v-for="(h, i) in newCommersTable.headers
                .filter(h => h)
                .sort((a, b) => a.sort - b.sort)">
                        <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                            <v-text-field v-if="!h.type || ['text', 'date'].includes(h.type)" filled :type="h.type == 'date' ? 'date' : 'text'" :label="h.text" v-model="createdObject.item[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" :readonly="h.readonly"></v-text-field>
                            <v-autocomplete v-else-if="h.type == 'select'" filled :label="h.text" :multiple="h.multiple" :readonly="h.readonly" v-model="createdObject.item[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" :items="
                    selects[h.searchValue] ? selects[h.searchValue].data : []
                  " :item-value="
                    selects[h.searchValue]
                      ? selects[h.searchValue].value
                      : 'value'
                  " :item-text="
                    selects[h.searchValue]
                      ? selects[h.searchValue].text
                      : 'text'
                  "></v-autocomplete>
                            <v-textarea v-else-if="h.type == 'textarea'" filled :label="h.text" v-model="createdObject.item[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" auto-grow :readonly="h.readonly" rows="1"></v-textarea>
                            <v-card v-else-if="h.type == 'checkbox'" flat tile color="transparent" class="pa-0 ma-0" :disabled="h.readonly">
                                <v-btn-toggle v-model="createdObject.item[h.searchValue]" class="d-block" mandatory>
                                    <v-btn height="58" width="50%" :color="
                        createdObject.item[h.searchValue] === true
                          ? 'error white--text'
                          : ''
                      " :value="true" v-text="h.trueValue"></v-btn>
                                    <v-btn height="58" width="50%" :color="
                        createdObject.item[h.searchValue] === false
                          ? 'success white--text'
                          : ''
                      " :value="false" v-text="h.falseValue"></v-btn>
                                </v-btn-toggle>
                            </v-card>
                        </v-col>
                    </template>
                </v-row>
            </v-card-text>
            <v-card-actions class="px-4">
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined large class="px-6" @click="createdObject.model = false" v-text="'رجوع'"></v-btn>
                <v-btn color="primary" large class="px-6" @click="saveItem()" v-text="'حفظ '"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
    name: "new_commers",
    mounted() {
        this.initDates();
        this.init();
    },
    data: () => ({
        groupedValue: [],
        subjectLimit: 10,
        createdObject: {
            model: false,
            fullscreen: false,
            loading: false,
            deleteModel: false,
            viewModel: false,
            item: {}
        },
        textDialog: {
            model: false,
            fullscreen: false,
            title: "",
            text: ""
        },
        search: {
            Date: new Date()
        },
        searchLoading: false,
        newCommersTable: {
            headers: [{
                    text: "المرحلة",
                    value: "RecuStage",
                    searchValue: "RecuStage",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: true,
                    sort: 5
                },
                {
                    text: "تاريخ الوصول",
                    value: "Date",
                    searchValue: "Date",
                    sortable: true,
                    type: "date",
                    inSearch: true,
                    inTable: true,
                    sort: 2
                },
                {
                    text: "عدد المستجدين",
                    value: "NumberofArrivals",
                    searchValue: "NumberofArrivals",
                    sortable: true,
                    type: "text",
                    inSearch: true,
                    inTable: true,
                    sort: 1
                },
                {
                    text: "منطقة التجنيد",
                    value: "RecuRegion",
                    searchValue: "RecuRegion",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: true,
                    sort: 4
                },
                {
                    text: "المؤهل العلمي",
                    value: "KnowledgeLevel",
                    searchValue: "KnowledgeLevel",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: true,
                    sort: 3
                },

            ],
            items: [],
            printer: {},
        },

        newCommersStatesTable: {
            isDisplayed: false,
            headers: [{
                    text: "منطقة التجنيد",
                    value: "RecuRegion",
                    searchValue: "RecuRegion",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: true,
                    sort: 4
                },
                ...Object.keys(constants.levelMapping).map(ele => ({

                    text: ele,
                    value: constants.levelMapping[ele],
                    sortable: true,
                    inTable: true,
                    sort: 1
                }))
            ],
            items: [],
            printer: {},
        },
        distTable: {
            headers: [{
                    text: "",
                    value: "Dist",
                    searchValue: "Dist",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: true,
                    sort: 4
                },
                ...Object.keys(constants.levelMapping).map(ele => ({

                    text: ele,
                    value: constants.levelMapping[ele],
                    sortable: true,
                    inTable: true,
                    sort: 1
                }))
            ],
            items: [],
            printer: {},
        },
        componentName: "createdObject",
        selects: {
            RecuRegion: {
                text: "text",
                value: "text",
                data: constants.RecuRegion.data
            },
            KnowledgeLevel: {
                text: "text",
                value: "text",
                data: constants.KnowledgeLevel.data
            },
            RecuStage: {
                text: "text",
                value: "text",
                data: lodash.flattenDeep(
                    constants.years.map(year =>
                        constants.RecuStage.data.map(stage => `${stage.text}-${year}`)
                    )
                )
            }
        },
        printer: {}
    }),
    methods: {
        async calculateRecRegionWithKnowloadage() {
            this.$set(this.newCommersStatesTable, "isDisplayed", true);
            const groupdWithRecRegion = _.groupBy(this.newCommersTable.items, 'RecuRegion');
            this.$set(this.newCommersStatesTable, "items", Object.keys(groupdWithRecRegion).map(key => ({
                RecuRegion: key,
                High: groupdWithRecRegion[key].filter(ele => ele.KnowledgeLevel == constants.levelMappingEn.High).length,
                AboveAvg: groupdWithRecRegion[key].filter(ele => ele.KnowledgeLevel == constants.levelMappingEn.AboveAvg).length,
                Avg: groupdWithRecRegion[key].filter(ele => ele.KnowledgeLevel == constants.levelMappingEn.Avg).length,
                Normal: groupdWithRecRegion[key].filter(ele => ele.KnowledgeLevel == constants.levelMappingEn.Normal).length

            })));

            const res = await this.api("global/get_one", {
                table: "RegisterationEssurance",
                where: {
                    Stage: this.search.RecuStage,
                    Dist: "المخطط",

                }
            });
            console.log(res)

            this.$set(this.distTable, "items", [res.data]);

        },
        async saveItem(edirableFromTableItem) {
            this.$set(this.createdObject, "loading", true);

            let saveItem = await this.api(`global/create_one`, {
                table: "NewComersArrivals",
                where: this.createdObject.item
            });

            if (saveItem && saveItem.data && saveItem.ok) {
                this.showSuccess("تم حفظ ");
                this.findItems();
                this.createdObject, "model", false;
            } else {
                this.showError("تعذر حفظ  في قاعدة البيانات");
            }
            this.$set(this.createdObject, "loading", false);
            this.$set(this.createdObject, "model", false);
        },
        findItems() {
            if (!this.search.RecuStage) {
                this.showError("يجب اختيار المرحلة اولا");
                return;
            }
            this.$set(this, "searchLoading", true);
            this.$set(this, "items", []);
            let where = {
                    ...this.search
                },
                likes = [],
                dates = ["Date"],
                multi = [];

            this.api("global/get_all", {
                    table: "NewComersArrivals",
                    where: this.mapToQuery(where, likes, multi, dates),

                    order: [
                        ["Date", "desc"]
                    ]
                })
                .then(x => {
                    let data = this.fixDates(x.data, ["Date"]),
                        printer = {
                            cons: [...data],
                            excelKey: "cons",
                            excelHeaders: this.newCommersTable.headers.filter(f => f.inSearch)
                        };

                    const groupedValues = {};

                    data.forEach(ele => {
                        groupedValues[ele.KnowledgeLevel] =
                            (groupedValues[ele.KnowledgeLevel] || 0) + ele.NumberofArrivals;
                    });
                    this.groupedValue = Object.keys(groupedValues).map(ele => ({
                        title: ele,
                        value: groupedValues[ele]
                    }));

                    this.groupedValue.push({
                        title: "الاجمالي",
                        value: Object.values(groupedValues).reduce((t, ele) => t + ele, 0)
                    });

                    this.$set(this.newCommersTable, "items", data);
                    this.$set(this.newCommersTable, "printer", printer);
                })
                .catch(error => {
                    this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
                    console.log(error);
                })
                .finally(() => {
                    this.$set(this, "searchLoading", false);
                });
        },
        initDates() {
            let dates = this.newCommersTable.headers
                .filter(h => h.type == "date")
                .map(h => h.searchValue);
            dates.forEach(d => {
                this.$set(this.search, d, []);
            });
        },
        actionAdd() {
            this.$set(this.createdObject, "item", {});
            this.$set(this.createdObject, "model", true);
        }
    }
};
</script>
