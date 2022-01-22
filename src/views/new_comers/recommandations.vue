<template>
<div>
    <div v-if="dialog">
        <v-card :loading="searchLoading" :disabled="searchLoading">
            <v-card-title>
                بحث متقدم في التوصيات
                <v-spacer></v-spacer>
                <v-btn @click="actionAdd()" large outlined color="primary">
                    إضافة توصية جديدة
                </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-row>
                    <template v-for="(h, i) in recommandationsTable.headers.filter(h => h.inSearch)">
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
                <v-btn class="px-6" @click="findItems()" large color="primary" v-text="'بحث'"></v-btn>
                <v-btn class="px-6" v-if="recommandationsTable.items.length > 0" @click="calculateUnitWithCertificatorsStats()" large color="primary" v-text="'يومية عددية بالمصدقين علي الوحدات'"></v-btn>

            </v-card-actions>
        </v-card>

        <v-card class="mt-8">

            <table-bulider :headers="recommandationsTable.headers" :printer="recommandationsTable.printer" :items="recommandationsTable.items" :title="'التوصيات'">
                <template v-slot:item.ID="{ item }">
                    <v-chip color="transparent" :to="`/soldiers_plus/${item.ID}`" @click.right="copyText(item.ID)">
                        {{ item.ID }}
                    </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-chip class="transparent">
                        <v-btn icon @click="actionEdit(item)" color="primary">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>

                    </v-chip>
                </template>

                <template v-slot:item.Certification="{ item }">
                    <v-chip @click="actionCertificatie(item)" :color="
              item.Certification == true
                ? 'success'
                : 'gray'
            ">
                        {{
              item.Certification == true
                ? "تمت الموافقة"
                : "في انتظار الموافقة"
            }}
                    </v-chip>
                </template>
            </table-bulider>
        </v-card>

        <v-dialog persistent v-model="unitWithCertificatorsStatsTabel.isDisplayed" scrollable >
            <v-card>
                <v-btn @click="unitWithCertificatorsStatsTabel.isDisplayed = false" icon>
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <table-bulider :headers="unitWithCertificatorsStatsTabel.headers" :printer="unitWithCertificatorsStatsTabel.printer" :items="unitWithCertificatorsStatsTabel.items" :title="'يومية عددية بالمصدقين علي الوحدات'">

                </table-bulider>
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
                        <template v-for="(h, i) in recommandationsTable.headers
                .filter(h => h.inModel)
                .sort((a, b) => a.sort - b.sort)">
                            <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                                <v-text-field v-if="!h.type || ['text', 'date'].includes(h.type)" filled :type="h.type == 'date' ? 'date' : 'text'" :label="h.text" v-model="Recommandation[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" :readonly="h.readonly" @keypress.enter="findSolider()"></v-text-field>
                                <v-autocomplete v-else-if="h.type == 'select'" filled :label="h.text" :multiple="h.multiple" :readonly="h.readonly" v-model="Recommandation[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" :items="
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
                                <v-textarea v-else-if="h.type == 'textarea'" filled :label="h.text" v-model="Recommandation[h.searchValue]" :hide-details="h.hint ? false : true" :persistent-hint="h.hint ? true : false" auto-grow :readonly="h.readonly" rows="1"></v-textarea>
                                <v-card v-else-if="h.type == 'checkbox'" flat tile color="transparent" class="pa-0 ma-0" :disabled="h.readonly">
                                    <v-btn-toggle v-model="Recommandation[h.searchValue]" class="d-block" mandatory>
                                        <v-btn height="58" width="50%" :color="
                        Recommandation[h.searchValue] === true
                          ? 'error white--text'
                          : ''
                      " :value="true" v-text="h.trueValue"></v-btn>
                                        <v-btn height="58" width="50%" :color="
                        Recommandation[h.searchValue] === false
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
    <!--
    <v-dialog v-model="dialog" persistent width="500" style="background: rgba(0,0,0,0.5)">
        <v-card>
            <v-card-title class="red text-algin-center">رسالة تحذيرية</v-card-title>

            <v-card-text style="padding:20px">تلك الصفحة بها بيانات سرية ان كنت لا تعرف كلمة السر لا تحاول</v-card-text>

            <v-text-field label="كلمة السر" v-model="password" type="password" :rules="passwordRules" style="padding:8px; margin-bottom:5px;" color="red"></v-text-field>
            <p id="uncorrectPassword" style="color: #F44336; margin-right: 10px; padding-bottom:5px;"></p>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="gray" text @click="checkPasswordValidation()"> دخول </v-btn>
                <v-btn style="margin-left:auto;" color="red" text @click="goThere('/'), deleteRouteByName(componentName)">عودة للصفحة الرئيسية</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    -->
</div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
    name: "recommandations",
    mounted() {
        // this.initDates();
        this.init();
    },
    data: () => ({
        valid: true,
        password: '',
        dialog: true,
        passwordRules: [
            v => !!v || 'يجب إدخال كلمة السر',
        ],
        Recommandation: {

        },
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
        recommandationsTable: {
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
                },
                {
                    text: "الوحدة",
                    value: "Unit.Unit",
                    searchValue: "UnitID",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: true,
                    inModel: true,
                    sort: 2
                },
                {
                    text: "الموصي",
                    value: "Recommender",
                    searchValue: "Recommender",
                    sortable: true,
                    type: "text",
                    inSearch: true,
                    inTable: true,
                    inModel: true,
                    sort: 4
                },
                {
                    text: "المصدق",
                    value: "Certificator",
                    searchValue: "Certificator",
                    sortable: true,
                    type: "select",
                    inSearch: true,
                    inTable: true,
                    inModel: true,
                    sort: 3
                },
                {
                    text: "اتجاه الوحدة",
                    value: "UnitDirection",
                    searchValue: "UnitDirection",
                    sortable: true,
                    type: "text",
                    inSearch: false,
                    inTable: true,
                    inModel: true,
                    readonly: true,
                    sort: 5
                },
                {
                    text: "اتجاه الجندي",
                    value: "soldierDirection",
                    searchValue: "soldierDirection",
                    sortable: true,
                    type: "text",
                    inSearch: false,
                    inTable: true,
                    inModel: true,
                    readonly: true,
                    sort: 5
                },
                {
                    text: "تم التصديق",
                    value: "Certification",
                    searchValue: "Certification",
                    sortable: true,
                    type: "checkbox",
                    inSearch: false,
                    inTable: true,
                    inModel: false,
                    sort: 5
                },
                {
                    text: "التطابق",
                    value: "Matching",
                    searchValue: "Matching",
                    sortable: true,
                    type: "text",
                    inSearch: false,
                    inTable: true,
                    inModel: true,
                    readonly: true,
                    sort: 5
                },
                {
                    text: "الاسم",
                    value: "Name",
                    searchValue: "Name",
                    sortable: true,
                    type: "text",
                    inSearch: false,
                    inModel: true,
                    readonly: true,
                    sort: 5
                },
                {
                    text: "الملاحظات",
                    value: "Notes",
                    searchValue: "Notes",
                    sortable: true,
                    type: "textarea",
                    inSearch: false,
                    inTable: true,
                    inModel: true,
                    sort: 5
                },
                {
                    text: "",
                    value: "actionsStart",
                    searchValue: "actionsStart",
                    sortable: false,
                    inTable: true,
                    sort: 0
                },
            ],
            items: [],
            printer: {}

        },

        unitWithCertificatorsStatsTabel: {
            isDisplayed: false,
            headers: [{
                    text: "الوحدة",
                    value: "Unit",
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
            Certificator: {
                text: "text",
                value: "text",
                data: constants.Certificator.data
            },
            KnowledgeLevel: {
                text: "text",
                value: "text",
                data: constants.KnowledgeLevel.data
            },
        },
    }),
    watch: {
        "Recommandation.UnitID"(v) {
            this.$set(
                this.Recommandation,
                "UnitDirection",
                this.selects.UnitID.data.find(ele => ele.UnitID == v).Directionforunit
            );
            this.changeMatching();

        },
        "Recommandation.soldierDirection"(v) {

            this.changeMatching();

        }
    },
    methods: {
        changeMatching() {
            if (this.Recommandation.soldierDirection && this.Recommandation.UnitDirection) {

                this.$set(
                    this.Recommandation,
                    "Matching",
                    this.Recommandation.soldierDirection == this.Recommandation.UnitDirection ? 'مطابق' : 'مخالف'
                );
            }
        },
        calculateUnitWithCertificatorsStats() {
            this.$set(this.unitWithCertificatorsStatsTabel, 'isDisplayed', true)
            const groupdWithCertificator = _.groupBy(this.recommandationsTable.items, 'Certificator');
            const groupdWithUnit = _.groupBy(this.recommandationsTable.items, 'Unit.Unit');
            this.$set(this.unitWithCertificatorsStatsTabel, 'headers', [
                ...this.unitWithCertificatorsStatsTabel.headers,
                ...Object.keys(groupdWithCertificator).map(key => ({
                    text: key,
                    value: key,
                    sortable: true,
                    inTable: true,
                    sort: 2
                }))
            ])

            this.$set(this.unitWithCertificatorsStatsTabel, 'items', Object.keys(groupdWithUnit).map(Unit => {

                const unitStats = {
                    Unit
                }
                Object.keys(groupdWithCertificator).forEach(key => {
                    unitStats[key] = groupdWithUnit[Unit].filter(ele => ele.Certificator == key).length

                })

                return unitStats;
            }))

            console.log(this.unitWithCertificatorsStatsTabel.items)

            this.$set(this.unitWithCertificatorsStatsTabel, "printer", {
                data: this.unitWithCertificatorsStatsTabel.items,
                excelKey: "data",
                excelHeaders: this.unitWithCertificatorsStatsTabel.headers.filter(f => f.inTable)
            });
        },
        async saveItem(edirableFromTableItem) {
            this.$set(this.createdObject, "loading", true);
            let saveItem;
            if (this.Recommandation.isEdit) {
                saveItem = await this.api(`global/update_one`, {
                    table: "Recommendations",
                    where: {
                        ID: this.Recommandation.ID
                    },
                    update: this.Recommandation
                });

            } else {
                saveItem = await this.api(`global/create_one`, {
                    table: "Recommendations",
                    where: this.Recommandation
                });
            }

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
                    ...this.search
                },
                likes = ["ID", "Recommender"],
                multi = [];

            this.api("global/get_all", {
                    table: "Recommendations",
                    include: [{
                        model: 'Unit'
                    }],
                    where: this.mapToQuery(where, likes, multi)
                })
                .then(x => {
                    let data = x.data,
                        printer = {
                            cons: [...data],
                            excelKey: "cons",
                            excelHeaders: this.recommandationsTable.headers.filter(f => f.inSearch)
                        };

                    this.$set(this.recommandationsTable, "items", data);
                    this.$set(this.recommandationsTable, "printer", printer);
                })
                .catch(error => {
                    this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
                    console.log(error)
                })
                .finally(() => {
                    this.$set(this, "searchLoading", false);
                });
        },
        findSolider() {

            let search = this.search;
            this.api("global/get_one", {
                    table: "Soldier",
                    search: {
                        ID: this.search.ID
                    }
                })
                .then(x => {
                    this.$set(this.Recommandation, 'Name', x.data.Name)

                    this.$set(this.Recommandation, 'soldierDirection', x.data.Directionforunit)

                })
                .catch(error => {
                    this.findItems();
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
        actionEdit(item) {
            this.$set(this.createdObject, "model", true);
            this.$set(this, "Recommandation", {
                ...item,
                isEdit: true
            });
        },
        checkPasswordValidation: function () {
            if (this.password === constants.recommendationPassword) {
                this.dialog = false;
            } else {
                document.getElementById("uncorrectPassword").innerText = "كلمة السر غير صحيحة";
            }

        },
        actionCertificatie(item) {
            this.$confirm(`هل انت متاكد من تغير الحالة`, {
                title: ``
            }).then(async res => {
                if (res) {
                    await this.api(`global/update_one`, {
                        table: "Recommendations",
                        where: {
                            ID: item.ID
                        },
                        update: {
                            Certification: false
                        }
                    });
                    await this.api(`global/update_one`, {
                        table: "Recommendations",
                        where: {
                            ID: item.ID,
                            UnitID: item.UnitID
                        },
                        update: {
                            Certification: true
                        }
                    });
                    this.findItems();

                }
            })
        }
    }
};
</script>
