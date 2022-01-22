<template>
<div>
    <v-card v-if="!parentFilters" :loading="searchLoading" :disabled="searchLoading">
        <v-card-title>
            مقترح ملاحق المرحلة
            <v-spacer></v-spacer>
            <v-btn @click="actionAdd()" large outlined color="primary">
                إضافة التحاق
            </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-row>
                <template v-for="(h, i) in followingSuggestTabel.headers.filter(h => h.inSearch)">
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
                        <v-card v-else-if="h.type == 'checkbox'" flat tile color="transparent" class="pa-0 ma-0" :disabled="h.readonly">
                            <v-checkbox v-model="search[h.searchValue]" :label="h.text"></v-checkbox>

                        </v-card>
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
            <v-btn class="px-6" @click="findItems()" large color="primary" v-text="'بحث'"></v-btn>
            <v-btn class="px-6" @click="calculateStatsWithFollowRigion()" v-if="followingSuggestTabel.items.length > 0" large color="primary" v-text="'عرض اليومية بالملاحق'"></v-btn>

            <v-btn class="px-6" @click="calculateStatsWithUnit()" v-if="followingSuggestTabel.items.length > 0" large color="primary" v-text="'يومية بالأعداد الملحقة من كل وحدة'"></v-btn>
        </v-card-actions>
    </v-card>

    <table-bulider :headers="followingSuggestTabel.headers" :printer="followingSuggestTabel.printer" :items="followingSuggestTabel.items" :title="'الملاحق'">

        <template v-slot:item.ID="{ item }">
            <v-chip color="transparent" :to="`/soldiers_plus/${item.ID}`" @click.right="copyText(item.ID)">
                {{ item.ID }}
            </v-chip>
        </template>

        <template v-slot:item.Acceptance="{ item }">
            <v-chip @click="changeStatus(item)" :color="
              item.Acceptance == true
                ? 'success'
                : 'gray'
            ">
                {{
              item.Acceptance == true
                ? "تمت الموافقة"
                : "في انتظار الموافقة"
            }}
            </v-chip>
        </template>

    </table-bulider>

    <v-dialog persistent v-model="followingSuggestStatsTabel.isDisplayed" scrollable max-width="750">
        <v-card>
            <v-btn @click="followingSuggestStatsTabel.isDisplayed = false" icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <table-bulider :headers="followingSuggestStatsTabel.headers" :printer="followingSuggestStatsTabel.printer" :items="followingSuggestStatsTabel.items" :title="'يومية عددية بالملاحق'">

            </table-bulider>
        </v-card>
    </v-dialog>

    <v-dialog persistent v-model="unitFollowingSuggestStatsTabel.isDisplayed" scrollable max-width="750">
        <v-card>
            <v-btn @click="unitFollowingSuggestStatsTabel.isDisplayed = false" icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <table-bulider :headers="unitFollowingSuggestStatsTabel.headers" :printer="unitFollowingSuggestStatsTabel.printer" :items="unitFollowingSuggestStatsTabel.items" :title="'يومية عددية بالملاحق من كل وحدة'">

            </table-bulider>
        </v-card>
    </v-dialog>

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
                    <template v-for="(h, i) in followingSuggestTabel.headers
                .filter(h => h.inModel)
                .sort((a, b) => a.sort - b.sort)">
                        <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                            <v-text-field v-if="!h.type || ['text', 'date'].includes(h.type)" filled :type="h.type == 'date' ? 'date' : 'text'" :label="h.text" v-model="followingSuggest[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" :readonly="h.readonly" @keypress.enter="findSolider()"></v-text-field>
                            <v-autocomplete v-else-if="h.type == 'select'" filled :label="h.text" :multiple="h.multiple" :readonly="h.readonly" v-model="followingSuggest[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" :items="
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
                            <v-textarea v-else-if="h.type == 'textarea'" filled :label="h.text" v-model="followingSuggest[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" auto-grow :readonly="h.readonly" rows="1"></v-textarea>
                            <v-card v-else-if="h.type == 'checkbox'" flat tile color="transparent" class="pa-0 ma-0" :disabled="h.readonly">
                                <v-checkbox v-model="followingSuggest[h.searchValue]" :label="h.text"></v-checkbox>

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
    name: "followingSuggest",
    props: {
        parentFilters: {
            type: Boolean,
            default: () => {}
        }
    },
    mounted() {
        // this.initDates();
        this.init();
    },
    data: () => ({
        followingSuggest: {

        },
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
        search: {},
        searchLoading: false,
        followingSuggestTabel: {
            headers: [{
                    text: "",
                    value: "actions",
                    searchValue: "actions",
                    sortable: false,
                    inSearch: false,
                    inTable: true,
                    inModel: false,
                    sort: 0
                },
                {
                    text: "الرقم العسكري",
                    value: "ID",
                    searchValue: "ID",
                    sortable: true,
                    type: "text",
                    inSearch: true,
                    inTable: true,
                    inModel: true,
                    sort: 1
                }, {
                    text: "الاسم",
                    value: "Soldier.Name",
                    searchValue: "Name",
                    sortable: true,
                    type: "text",
                    inSearch: true,
                    inTable: true,
                    inModel: true,
                    readonly: true,
                    sort: 1
                },
                {
                    text: "المستوى الثقافي",
                    value: "Soldier.KnowledgeLevel",
                    searchValue: "Soldier.KnowledgeLevel",
                    sortable: true,
                    type: "select",
                    inSearch: false,
                    inTable: true,
                    inModel: false,
                    sort: 2
                },
                {
                    text: "الوحدة",
                    value: "Soldier.Unit.Unit",
                    searchValue: "UnitID",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: true,
                    inModel: false,
                    sort: 2
                },
                {
                    text: "الإتجاه",
                    value: "Soldier.Unit.Directionforunit",
                    searchValue: "UnitID",
                    sortable: true,
                    type: "select",
                    inSearch: false,
                    inTable: true,
                    inModel: false,
                    sort: 2
                },
                {
                    text: "الجهة لملحق ليها",
                    value: "FollowingRigion.FollowRigionName",
                    searchValue: "FollowRigionID",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: true,
                    inModel: true,
                    sort: 2
                },
                {
                    text: "الموصي",
                    value: "FollowingRecommender",
                    searchValue: "FollowingRecommender",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: true,
                    inModel: true,
                    sort: 4
                },
                {
                    text: "الأمر بالإلحاق",
                    value: "FollowingOrder",
                    searchValue: "FollowingOrder",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: true,
                    inModel: true,
                    sort: 3
                },
                {
                    text: "المرحلة",
                    value: "RecuStage",
                    searchValue: "RecuStage",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: false,
                    inModel: true,
                    sort: 5
                },
                {
                    text: "تمت الموافقة",
                    value: "Acceptance",
                    searchValue: "Acceptance",
                    sortable: true,
                    type: "checkbox",
                    inSearch: true,
                    inTable: true,
                    inModel: false,
                    sort: 5
                },
            ],
            items: [],
            printer: {}

        },

        followingSuggestStatsTabel: {
            isDisplayed: false,
            headers: [{
                    text: "جهة الالتحاق",
                    value: "FollowRigionName",
                    sortable: true,
                    inTable: true,
                    sort: 2
                },
                {
                    text: "المصدق عليه",
                    value: "totalAccpted",
                    sortable: true,
                    inTable: true,
                    sort: 1
                },
                {
                    text: "المصدق عليه",
                    value: "totalPending",
                    sortable: true,
                    inTable: true,
                    sort: 1
                },

            ],
            items: [],
            printer: {}
        },

        unitFollowingSuggestStatsTabel: {
            isDisplayed: false,
            headers: [{
                    text: "الوحدة",
                    value: "Unit",
                    sortable: true,
                    inTable: true,
                    sort: 2
                },
                {
                    text: "جهة الالتحاق",
                    value: "FollowRigion",
                    sortable: true,
                    inTable: true,
                    sort: 2
                },
                {
                    text: "العدد الملحق",
                    value: "TotalFollowers",
                    sortable: true,
                    inTable: true,
                    sort: 2
                },

            ],
            items: [],
            printer: {}
        },

        componentName: "createdObject",
        selects: {
            UnitID: {
                table: "Unit",
                value: "UnitID",
                text: "Unit"
            },
            FollowRigionID: {
                table: "FollowingRigion",
                value: "FollowRigionID",
                text: "FollowRigionName"
            },
            FollowingRecommender: {
                text: "text",
                value: "text",
                data: constants.FollowingRecommender.data
            },
            FollowingOrder: {
                text: "text",
                value: "text",
                data: constants.FollowingOrder.data
            },
            RecuStage: {
                text: "text",
                value: "text",
                data: lodash.flattenDeep(
                    constants.years.map(year =>
                        constants.RecuStage.data.map(stage => `${stage.text}-${year}`)
                    )
                )
            },
            KnowledgeLevel: {
                text: "text",
                value: "text",
                data: constants.KnowledgeLevel.data
            },
        },
        printer: {}
    }),
    watch: {},
    methods: {
        log(item) {
            console.log("====================================");
            console.log("item", item);
            console.log("====================================");
        },
        runFun(f) {
            return this[f]();
        },

        async saveItem(edirableFromTableItem) {
            this.$set(this.createdObject, "loading", true);

            let saveItem = await this.api(`global/create_one`, {
                table: "Followers",
                where: this.followingSuggest
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
            this.$set(this, "searchLoading", true);
            this.$set(this, "items", []);
            let where = {
                    ...this.search,
                    RecuStage: null,
                    UnitID: null
                },
                likes = ["ID", "Name"],
                multi = [];

            this.api("global/get_all", {
                    table: "Followers",
                    where: this.mapToQuery(where, likes, multi),
                    include: [{
                            model: "FollowingRigion"
                        },
                        {
                            model: "Soldier",
                            where: this.cleanObject({
                                UnitID: this.search.UnitID,
                                RecuStage: this.search.RecuStage,
                            }),
                            include: [{
                                    model: 'Unit'
                                }

                            ]
                        },

                    ]
                })
                .then(x => {
                    let data = x.data,
                        printer = {
                            cons: [...data],
                            excelKey: "cons",
                            excelHeaders: this.followingSuggestTabel.headers.filter(f => f.inSearch)
                        };
                    this.$set(this.followingSuggestTabel, "items", data);
                    this.$set(this.followingSuggestTabel, "printer", printer);

                })
                .catch(error => {
                    this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
                    console.log(error);
                })
                .finally(() => {
                    this.$set(this, "searchLoading", false);
                });
        },

        calculateStatsWithFollowRigion() {
            this.$set(this.followingSuggestStatsTabel, 'isDisplayed', true)
            const groupdWithFollowRigionName = _.groupBy(this.followingSuggestTabel.items, 'FollowingRigion.FollowRigionName');

            this.$set(this.followingSuggestStatsTabel, "items", Object.keys(groupdWithFollowRigionName).map(key => ({
                FollowRigionName: key,
                totalAccpted: groupdWithFollowRigionName[key].filter(ele => ele.Acceptance).length,
                totalPending: groupdWithFollowRigionName[key].filter(ele => !ele.Acceptance).length,

            })));
            this.$set(this.followingSuggestStatsTabel, "printer", {
                data: this.followingSuggestStatsTabel.items,
                excelKey: "data",
                excelHeaders: this.followingSuggestStatsTabel.headers.filter(f => f.inTable)
            });
        },
        calculateStatsWithUnit() {
            this.$set(this.unitFollowingSuggestStatsTabel, 'isDisplayed', true)
            const groupdWithUnit = _.groupBy(this.followingSuggestTabel.items, 'Soldier.Unit.Unit');
            this.$set(this.unitFollowingSuggestStatsTabel, "items", _.flatten(Object.keys(groupdWithUnit).map(key => {

                const groupdWithFollowRigion = _.groupBy(groupdWithUnit[key], 'FollowingRigion.FollowRigionName')

                return Object.keys(groupdWithFollowRigion).map(FollowRigion => ({
                    Unit: key,
                    FollowRigion,
                    TotalFollowers: groupdWithFollowRigion[FollowRigion].length
                }))

            })));
            this.$set(this.unitFollowingSuggestStatsTabel, "printer", {
                data: this.unitFollowingSuggestStatsTabel.items,
                excelKey: "data",
                excelHeaders: this.unitFollowingSuggestStatsTabel.headers.filter(f => f.inTable)
            });
        },
        findSolider() {
            let search = this.search;
            this.api("global/get_one", {
                    table: "Soldier",
                    search: {
                        ID: this.search.ID
                    }
                }).then((x) => {
                    this.$set(this.followingSuggest, 'Name', x.data.Name)
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {});
        },
        initDates() {
            let dates = this.headers
                .filter(h => h.type == "date")
                .map(h => h.searchValue);
            dates.forEach(d => {
                this.$set(this.search, d, []);
            });
        },
        actionAdd() {
            this.$set(this.createdObject, "item", {});
            this.$set(this.createdObject, "model", true);
        },
        changeStatus(item) {
            this.$confirm(`هل انت متاكد من تغير الحالة`, {
                title: ``
            }).then(async res => {
                if (res) {

                    if (!item.Acceptance) {
                        await this.api(`global/update_one`, {
                            table: "Followers",

                            where: {
                                ID: item.ID,
                            },
                            update: {
                                Acceptance: false
                            }
                        });
                        await this.api(`global/update_one`, {
                            table: "Followers",
                            where: {
                                ID: item.ID,
                                FollowRigionID: item.FollowRigionID
                            },
                            update: {
                                Acceptance: !item.Acceptance
                            }
                        });
                    }
                    this.findItems();
                }
            });
        }
    },

}
</script>
