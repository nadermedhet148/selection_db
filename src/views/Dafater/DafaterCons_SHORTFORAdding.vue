<template>
  <div>
    <v-row>
      <v-col md="12">
        <v-row>
          <v-col class="pr-4">
            <!-- الدفاتر الخاصه بك هي
            {{ myDafater }} -->
            <!-- رجب -->
            <v-fab-transition v-for="(dafter, i) in myDafater" :key="i">
              <v-btn
                v-show="!dafaterFBtnHidden && !inputs.img.path"
                @click="choseDafterFromFBtn(dafter)"
                class="ma-3"
                :color="btnColors[PickrandomColorforFbtn()]"
                fab
                dark
                medium
              >
                <v-icon>{{ dafter.code }}</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete
              label="اختر الدفتر"
              v-model="inputs.dafter.value"
              :items="inputs.dafter.options.data"
              :item-value="inputs.dafter.options.value"
              :item-text="inputs.dafter.options.text"
              filled
              :loading="inputs.dafter.options.loading"
              clearable
              :disabled="Boolean(inputs.img.id)"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <v-btn
            @click="openDafaterModal()"
            v-if="!inputs.img.path"
            color="primary"
            :disabled="!inputs.dafter.value.id"
          >
            تصفح الصور
          </v-btn>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="dafaterFBtnHidden = !dafaterFBtnHidden"
                v-if="!inputs.img.path"
              >
                {{ !dafaterFBtnHidden ? "اخفاء الدفاتر" : "اظهار الدفاتر" }}
              </v-btn>
            </template>
            <span>اظهار الدفاتر المخصصه لي.</span>
          </v-tooltip>

          <v-btn
            @click="
              $router
                .push({
                  path: `/dafater_cons`
                })
                .catch(() => {
                  emptyData();
                  $router.push(0);
                })
            "
            v-if="inputs.img.path"
          >
            اختر دفتر اخر
          </v-btn>
          <span v-if="counter && inputs.img.path"
            >اجمالي عدد الافراد التي تم تسجيلها : {{ counter }}</span
          >
          <v-btn
            @click="openExternal(inputs.img.path)"
            color="primary"
            v-if="inputs.img.path"
          >
            تكبير الصورة
          </v-btn>
        </v-row>
        <v-img
          :src="inputs.img.base64"
          height="300"
          class="mt-5"
          v-if="inputs.img.path"
          contain
          @click="openExternal(inputs.img.path)"
        ></v-img>
        <v-row
          justify="space-around"
          v-if="inputs.img.path && !params.imgId"
          class="mt-5"
        >
          <v-col class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="pickImage(inputs.imgCurrentIndex - 1)"
                  :disabled="inputs.imgCurrentIndex == 1"
                  v-on="on"
                  icon
                >
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </template>
              <span>السابق</span>
            </v-tooltip>
          </v-col>
          <v-col class="text-center">
            صورة رقم
            {{ inputs.imgCurrentIndex }}
            من اصل
            {{ imagePicker.imgs.length - 1 }}
            صورة
          </v-col>
          <v-col class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="pickImage(inputs.imgCurrentIndex + 1)"
                  :disabled="
                    inputs.imgCurrentIndex == imagePicker.imgs.length - 1
                  "
                  v-on="on"
                  icon
                >
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
              </template>
              <span>التالي</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-col>
      <v-col md="12">
        <v-card>
          <v-card-title>
            الافراد العسكرية
            <v-spacer></v-spacer>
            <!-- <v-btn icon @click="getconscriptes()">
              <v-icon>mdi-reload</v-icon> -->
            <!-- </v-btn> -->
            <v-btn
              icon
              @click="openFormDialog('select')"
              :disabled="!inputs.img.path"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <!-- <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model.lazy="result.conscriptes.search"
        filled
        dense
      ></v-text-field> -->
          <v-data-table
            :headers="result.conscriptes.headers"
            :items="result.conscriptes.items"
            v-model="result.conscriptes.selected"
            fixed-header
            :loading="result.conscriptes.loading"
            :search.sync="result.conscriptes.search"
            hide-default-header
            multi-sort
          >
            <template v-slot:header="table">
              <table-header-filters
                :items="result.conscriptes.items"
                :table="table"
                :filters.sync="tableFilters.conscriptes"
              ></table-header-filters>
            </template>
            <template v-slot:footer="table">
              <table-footer-filters
                :filters.sync="tableFilters.conscriptes"
                :table="table"
              ></table-footer-filters>
            </template>
            <template v-slot:item.units_length="{ item }">
              <div>
                <v-chip color="transparent">
                  {{ item.units.length }}
                </v-chip>
              </div>
            </template>
            <template v-slot:item.delete_me="{ item }">
              <div>
                <v-chip color="transparent">
                  <v-btn
                    icon
                    color="error"
                    @click="
                      (del.type = 'conscripte'),
                        (del.id = item.relId),
                        (del.model = true),
                        (del.name = item.fullName)
                    "
                  >
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </v-chip>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <!-- Confirm Delete Dialog -->
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      persistent
      max-width="550"
      v-model="del.model"
    >
      <v-card :loading="del.loading" :disabled="del.loading">
        <v-card-title class="white--text error">
          حذف الفرد العسكري
          <v-spacer></v-spacer>
          <v-btn icon dark @click="del.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div>هل تريد بالتأكيد حذف الفرد : {{ del.name }}</div>
          <div>
            <span class="error--text">
              لاحظ من فضلك :
            </span>
            لن يمكنك استرجاع البيانات المحذوفه
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            outlined
            @click="del.model = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
          <v-btn
            color="error"
            @click="deleteRecord()"
            v-text="'حذف'"
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      persistent
      max-width="750"
      v-model="edit.model"
    >
      <v-card :loading="edit.loading" :disabled="edit.loading">
        <v-card-title class="white--text primary">
          {{ edit.actionType == "insert" ? "إضافة" : "اختر" }}
          الفرد العسكري
          <v-spacer></v-spacer>
          <v-btn dark icon @click="edit.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <v-row v-if="inputs && inputs[edit.type]">
            <v-col cols="6" v-if="edit.actionType == 'select'">
              <v-text-field
                label="بحث بالاسم"
                v-model="search.fullName"
                @keypress.enter="findCons()"
                @keypress="triggerKeyPress"
                filled
                class="my-3"
                hint="اضغط enter للبحث"
              ></v-text-field>
            </v-col>
            <v-col cols="6" v-if="edit.actionType == 'select'">
              <v-text-field
                ref="searchByIdField"
                v-model="search.militaryId"
                label="بحث بالرقم العسكري"
                @keypress.enter="findCons()"
                @keypress="triggerKeyPress"
                filled
                class="my-3"
                hint="اضغط enter للبحث"
              ></v-text-field>
            </v-col>
            <v-col class="py-0" md="12" v-if="edit.actionType == 'select'">
              <v-list
                flat
                subheader
                v-if="listCheckboxes.allData && listCheckboxes.allData.length"
              >
                <v-virtual-scroll
                  :height="64 * 3"
                  item-height="64"
                  :items="listCheckboxes.data"
                >
                  <template v-slot:default="{ item }">
                    <v-list-item @click="toggleDafaterCons(item)" two-line>
                      <v-list-item-icon>
                        <v-icon
                          color="primary"
                          v-text="
                            listCheckboxes.selected
                              .map(i => i.militaryId.trim())
                              .includes(item.militaryId.trim())
                              ? 'mdi-checkbox-marked'
                              : 'mdi-checkbox-blank-outline'
                          "
                        ></v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          item.fullName
                        }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          item.militaryId
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-virtual-scroll>
              </v-list>
              <v-skeleton-loader
                v-if="listCheckboxes.loading"
                class="mx-auto"
                max-width="300"
                type="card"
              ></v-skeleton-loader>
            </v-col>
            <v-alert type="info" v-else width="100%">
              في حالة عدم وجود الفرد بقاعدة البيانات
              <br />
              يمكنك اضافة افراد جديده او تعديل افراد موجوده من قبل و اضافتها
              للدفتر
            </v-alert>
            <template v-for="(item, i) in inputs[edit.type]">
              <v-col
                :key="i"
                :cols="item.type == 'textarea' ? 12 : 6"
                class="py-0"
              >
                <v-text-field
                  v-if="item.type == 'text' && edit.actionType == 'insert'"
                  :label="item.label"
                  @keypress.enter="addOrUpdateCons()"
                  ref="addingInputs"
                  filled
                  v-model="edit[edit.type][item.model]"
                  :counter="item.model == 'militaryId' ? 13 : false"
                  class="my-3"
                  :hint="item.hint"
                ></v-text-field>
                <v-textarea
                  v-if="!item.type || item.type == 'textarea'"
                  :label="item.label"
                  hide-details
                  filled
                  auto-grow
                  rows="1"
                  v-model="edit[edit.type][item.model]"
                  class="my-3"
                >
                </v-textarea>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-alert type="success" width="100%">
          الافراد الذين تم اختيارهم
        </v-alert>
        <v-data-table
          :headers="selectedCons.headers"
          :items="selectedCons.items"
          fixed-header
          hide-default-header
          multi-sort
        >
          <template v-slot:header="table">
            <table-header-filters
              :items="selectedCons.items"
              :table="table"
              :filters.sync="tableFilters.conscriptes"
            ></table-header-filters>
          </template>
          <template v-slot:footer="table">
            <table-footer-filters
              :filters.sync="tableFilters.conscriptes"
              :table="table"
            ></table-footer-filters>
          </template>
          <template v-slot:item.fullName="{ item }">
            <v-chip color="transparent" @click="fillForm(item)">
              {{ item.fullName }}
            </v-chip>
          </template>
          <template v-slot:item.militaryId="{ item }">
            <v-chip color="transparent" @click="fillForm(item)">
              {{ item.militaryId }}
            </v-chip>
          </template>
          <template v-slot:item.remove_me="{ item }">
            <div>
              <v-chip color="transparent">
                <v-btn icon color="error" @click="removeCon(item)">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </v-chip>
            </div>
          </template>
        </v-data-table>
        <v-card-actions class="px-4">
          <v-btn-toggle v-model="edit.actionType" mandatory>
            <v-btn
              value="insert"
              :color="edit.actionType == 'insert' ? 'success white--text' : ''"
              v-text="'اضافة/تعديل فرد '"
            ></v-btn>
            <v-btn
              value="select"
              :color="edit.actionType == 'select' ? 'primary white--text' : ''"
              v-text="'اختر فرد'"
            ></v-btn>
          </v-btn-toggle>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="edit.model = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
          <v-btn
            color="success"
            @click="editRecord(edit.actionType)"
            v-text="'حفظ'"
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- tree -->
    <v-dialog
      v-if="isCurrentRoute(componentName) && tree.model"
      scrollable
      persistent
      max-width="550"
      v-model="tree.model"
    >
      <v-card :loading="tree.loading" :disabled="tree.loading">
        <v-card-title class="white--text primary">
          قائمة الدفاتر
          <v-spacer></v-spacer>
          <v-btn icon dark @click="tree.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <v-treeview
            transition
            hoverable
            :open.sync="open"
            :active.sync="active"
            :load-children="getDafater"
            activatable
            open-on-click
            :items="items"
          >
            <template v-slot:prepend="{ item }">
              <v-btn icon v-if="!item.children" @click="openImagePicker(item)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
          </v-treeview>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="tree.model = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="imagePicker.model" scrollable max-width="800" persistent>
      <v-card :disabled="imagePicker.loading" :loading="imagePicker.loading">
        <v-card-title>
          من فضلك اختر صورة
        </v-card-title>
        <v-divider> </v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(img, i) in imagePicker.imgs">
              <v-col :key="i">
                <v-btn @click="pickImage(i)" v-if="i != 0">
                  {{ i }}
                </v-btn>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="(imagePicker.model = false), (tree.model = false)"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "DafaterCons",
  mounted() {
    window.addEventListener("keydown", e => {
      console.log(!this.inputs?.img?.path);
      if (this.edit.model == true || !this.inputs?.img?.path) {
        // model is opened
        // or there's no image
        // don't do anything
        return true;
      } else {
        if (e.key == "ArrowLeft") {
          // التالي
          this.pickImage(this.inputs.imgCurrentIndex + 1);
        } else if (e.key == "ArrowRight") {
          // السابق
          this.pickImage(this.inputs.imgCurrentIndex - 1);
        } else if (e.key == "Enter") {
          this.openExternal(this.inputs.img.path);
        } else if (e.key == "+") {
          this.openFormDialog("select");
        }
        return false;
      }
    });
    // this.fixAllImgs();
    this.getAllDafater();
    this.getConsCounter(this.getCurrUserId);
    if (this.params.imgId) {
      //edit mode
      this.fetchData(this.params.imgId);
    }
  },
  watch: {
    "params.imgId"(v) {
      if (v) {
        this.fetchData(v);
      } else {
        this.emptyData();
      }
    },
    "listCheckboxes.selected"(v) {
      console.log(v);
      this.$set(this.selectedCons, "items", v);
    }
  },
  data: () => ({
    componentName: "dafater_cons",
    myDafater: "",
    dafaterFBtnHidden: true,
    counter: 0,
    tableFilters: {
      conscriptes: {}
    },
    soldTest: ["mohsen", "ali", "ss"],
    imagePicker: {
      model: false,
      loading: false,
      imgs: []
    },
    listCheckboxes: {
      selected: [],
      allData: [],
      loading: false
    },
    inputs: {
      conscripte: [
        {
          label: "الاسم",
          model: "fullName",
          type: "text",
          hint: "اضغط enter للإضافة"
        },
        {
          label: "الرقم العسكري",
          model: "militaryId",
          type: "text",
          hint: "اضغط enter للإضافة"
        }
        // {
        //   label: "الاسم",
        //   model: "fullName",
        //   type: "select",
        //   hint: "",
        //   icon: ""
        // },
        // {
        //   label: "الرقم العسكري",
        //   model: "militaryId",
        //   type: "select",
        //   hint: "",
        //   icon: ""
        // },
        // {
        //   label: "ملاحظات",
        //   model: "notes",
        //   type: "textarea"
        // }
      ],
      img: {},
      dafter: {
        value: {},
        options: {
          value: "value",
          text: "text",
          loading: true,
          data: []
        }
      },
      imgCurrentIndex: 0
    },
    del: {
      loading: false,
      model: false,
      id: null,
      type: "",
      name: ""
    },
    tree: {
      loading: false,
      model: false,
      id: null,
      type: ""
    },
    edit: {
      loading: false,
      model: false,
      type: "conscripte",
      actionType: "insert",
      conscripte: {}
    },
    selectedCons: {
      items: [],
      headers: [
        {
          text: "الاسم",
          value: "fullName"
        },
        {
          text: "الرقم العسكري",
          value: "militaryId"
        },
        {
          text: "حذف",
          value: "remove_me",
          sortable: false
        }
      ]
    },

    result: {
      conscriptes: {
        loading: false,
        search: "",
        items: [],
        selected: [],
        headers: [
          {
            text: "الاسم",
            value: "fullName"
          },
          {
            text: "الرقم العسكري",
            value: "militaryId"
          },
          // {
          //   text: "الملاحظات",
          //   value: "notes",
          //   noFilter: true
          // },
          {
            text: "حذف",
            value: "delete_me",
            sortable: false
          }
        ]
      }
    },
    selects: {
      militaryId: {
        table: "conscriptes",
        value: "militaryId",
        text: "militaryId",
        fetchOnInput: null
      },
      fullName: {
        table: "conscriptes",
        value: "militaryId",
        text: "fullName",
        fetchOnInput: null
      }
    },
    items: [],
    open: [],
    active: [],
    search: {
      militaryId: "",
      fullName: ""
    },
    btnColors: [
      "#00679e",
      "#006fa5",
      "#0076ad",
      "#007db5",
      "#1a84bd",
      "#298cc5",
      "#3593cd"
    ]
  }),
  methods: {
    // key press
    triggerKeyPress(e) {
      // Check first conscripte
      if (e.key == "+") {
        let cons = this.listCheckboxes.data;
        if (cons.length) {
          this.toggleDafaterCons(cons[0]);
        }
        e.preventDefault();
        return false;
      }
      if (e.key == "*") {
        this.editRecord(this.edit.actionType);
        e.preventDefault();
      }
      return true;
    },
    // key down
    triggerKeyDown(e) {
      if (e.key == "+") {
        let cons = this.listCheckboxes.data;
        if (cons.length) {
          this.toggleDafaterCons(cons[0]);
        }
        return false;
      }
      if (e.key == "F12") {
        this.editRecord(this.edit.actionType);
      }

      return true;
    },
    choseDafterFromFBtn(dafter) {
      this.inputs.dafter.value = dafter;
    },
    PickrandomColorforFbtn() {
      return Math.floor(Math.random() * (this.btnColors.length - 1));
    },
    getConsCounter(userId) {
      let include = [
        {
          model: "dafaterImages",
          required: true,
          include: [
            {
              model: "dafater",
              required: true,
              where: { assignedTo: userId }
            }
          ]
        }
      ];
      let where = {};
      this.api("global/count", {
        table: "dafaterRel",
        where,
        include
      }).then(val => (this.counter = val.data ? val.data : 0));
    },
    toggleDafaterCons(cons) {
      let index = this.listCheckboxes.selected.findIndex(
        item => item.militaryId.trim() == cons.militaryId.trim()
      );
      if (index > -1) {
        this.listCheckboxes.selected.splice(index, 1);
      } else {
        this.$set(
          this.listCheckboxes.selected,
          this.listCheckboxes.selected.length,
          cons
        );
        this.$set(this.search, "fullName", "");
        this.$set(this.search, "militaryId", "");
        // auto foucs on fullName field
        //this.$refs.searchByIdField.focus();
        // رجب مش عاوز و هو بيسجل الرقم العسكري يتعمله ريسيت
        // if (this.getCurrUserId != 1079) {
        // }
      }
    },
    async getAllDafater() {
      await this.api("sections/dafater/get-all-dafater").then(res => {
        this.$set(this.inputs.dafter.options, "loading", false);
        if (res.ok && res.data && res.data.length > 0) {
          console.log("r", res);
          const mapDafaters = item => ({
            value: item,
            text: item.code + " - " + item.name
          });
          const filterDafaters = item => {
            return (
              item.name &&
              (this.isAdmin() || item.assignedTo == this.getCurrUserId)
            );
          };
          this.$set(
            this.inputs.dafter.options,
            "data",
            res.data.filter(filterDafaters).map(mapDafaters)
          );

          this.myDafater = res.data.filter(
            d => d.assignedTo == this.getCurrUserId
          );
          // .map(d => "(" + d.code + " - " + d.name + ")")
          // .join(" , ");
        }
      });
    },
    pickImage(index) {
      console.log(this.imagePicker.imgs);
      console.log("img", this.imagePicker.imgs[index]);
      this.api("sections/dafater/set-img", {
        path: this.imagePicker.imgs[index].name.split(this.splitter)[1],
        dafaterId: this.inputs.dafter.value.id
      })
        .then(result => {
          console.log(result);
          if (result.ok && result.data) {
            if (!result.data.isCreated) {
              this.fetchData(result.data.img.id);
              console.log("created");
            } else {
              // sets img data
              console.log("exist");
              this.inputs.img = {
                path: this.splitter + result.data.img.imgPath,
                base64: "",
                id: result.data.img.id
              };
              this.loadImage();
              this.result.conscriptes.items = [];
            }
            this.inputs.imgCurrentIndex = index;
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.$set(this.imagePicker, "model", false);
      this.$set(this.tree, "model", false);
    },
    openImagePicker(item) {
      console.log(item);
      let images = item.images.map(img => {
        img.name =
          this.rootDir +
          `/${this.inputs.dafter.value.filmNumber}/Film/${this.inputs.dafter.value.dafterIndex}/` +
          `/${img.name}`;
        return img;
      });
      this.$set(this.imagePicker, "model", true);
      this.$set(this.imagePicker, "imgs", item.images);
    },
    async editRecord(actionType) {
      if (!actionType) {
        return;
      }
      await this.setRelation(
        this.listCheckboxes.selected.map(i => i.militaryId)
      );
      // add state
    },
    async addOrUpdateCons() {
      if (!this.edit.conscripte.militaryId) {
        this.showError("الرقم العسكري مطلوب");
        return;
      }
      if (!this.edit.conscripte.fullName) {
        this.showError("حقل الاسم مطلوب");
        return;
      }
      let consGetter = await this.api("global/get_one", {
          table: "conscriptes",
          where: {
            militaryId: this.edit.conscripte.militaryId
          },
          returnObject: true
        }),
        consUpdate,
        consCreate;
      console.log(consGetter);

      if (consGetter.ok && consGetter.data) {
        console.log("updater");
        consUpdate = await this.api("global/update_one", {
          table: "conscriptes",
          where: {
            militaryId: this.edit.conscripte.militaryId
          },
          update: {
            daftarNumber: this.inputs.dafter.value.code,
            fullName: this.edit.conscripte.fullName.trim()
          }
        });
      } else {
        console.log("creator");
        consCreate = await this.api("global/create_one", {
          table: "conscriptes",
          where: {
            militaryId: this.edit.conscripte.militaryId,
            fullName: this.edit.conscripte.fullName,
            daftarNumber: this.inputs.dafter.value.code
          },
          returnObject: true
        });
        // for adding
        // this.$refs.addingInputs[0].focus();
        // this.edit.conscripte.fullName = "";
        // this.edit.conscripte.militaryId = "";
      }
      let index = this.listCheckboxes.selected.findIndex(
        i => i.militaryId.trim() == this.edit.conscripte.militaryId.trim()
      );
      if (index == -1) {
        this.listCheckboxes.selected.push({ ...this.edit.conscripte });
        console.log("new", this.listCheckboxes.selected);
      } else {
        this.listCheckboxes.selected.splice(index, 1, {
          ...this.edit.conscripte
        });
        console.log("modified", this.listCheckboxes.selected);
        console.log("new obj", this.edit.conscripte);
      }
      this.emptyForm();
    },
    selectCons(militaryId) {
      this.$set(this.edit.conscripte, "militaryId", militaryId);
    },
    async setRelation(militaryIds) {
      for (const element of militaryIds) {
        const params = {
          imageId: this.inputs.img.id,
          militaryId: element,
          // notes: this.edit.conscripte.notes,
          userId: this.getCurrUserId,
          dateAdded: new Date()
        };
        await this.api("sections/dafater/set-relation", params);
      }
      this.$set(this.edit, "model", false);
      this.$set(this.listCheckboxes, "selected", []);
      this.fetchData(this.inputs.img.id);
      this.getConsCounter(this.getCurrUserId);
    },
    async deleteRecord() {
      this.api("sections/dafater/delete-relation", {
        relationId: this.del.id
      })
        .then(res => {
          console.log(res);
          this.$set(this.del, "model", false);
          this.fetchData(this.inputs.img.id);
        })
        .catch(err => {
          console.log(err);
          this.$set(this.del, "model", false);
        })
        .finally(() => {
          this.getConsCounter(this.getCurrUserId);
        });
    },
    openFormDialog(actionType = this.edit.actionType, item = {}) {
      this.$set(this.edit, "model", true);
      this.$set(this.edit, "actionType", actionType);
      // for insert
      // this.$set(this.edit, "actionType", "insert");
      this.$refs.searchByIdField.focus();
      // for adding
      // if (this.$refs.addingInputs?.length) {
      //   this.$refs.addingInputs[0]?.focus();
      // }
      if (item) {
        console.log("model", item);
        this.$set(this.edit, "conscripte", item);
      }
      this.$nextTick(() => {
        let searchByIdField = this.$refs.searchByIdField;
        if (searchByIdField.$el) {
          setTimeout(() => {
            searchByIdField.focus();
          }, 0);
        }

        // for adding
        // let addingInputs = this.$refs.addingInputs;
        // if (addingInputs?.length && addingInputs[0].$el) {
        //   setTimeout(() => {
        //     addingInputs[0].focus();
        //   }, 0);
        // }
      });
    },
    async getDafater(obj = {}) {
      let items = await this.api("server/get-dafater", {
        path: obj.path ? obj.path : "",
        counter: obj.id ? Number(obj.id) * Math.random() * 0.123456789 : 0,
        rootDir:
          this.rootDir +
          `/${this.inputs.dafter.value.filmNumber}/Film/${this.inputs.dafter.value.dafterIndex}/`
      });
      if (items && items.ok && items.data) {
        if (obj.name) {
          obj.children = items.data.folders;
        } else {
          this.$set(this, "items", items.data.folders);
        }
      } else {
        this.showError(
          `حدث خطأ أثناء احضار البيانات من السيرفر, من فضلك تحقق إن كان السيرفر يعمل.
          وتحقق إن كان الجهاز الذي تستخدمه مسموح له بالدخول الى السيرفر`
        );
      }
    },
    async openDafaterModal() {
      this.$set(this.tree, "model", true);
      await this.getDafater();
      this.$set(this.tree, "loading", false);
    },
    fetchData(imgId) {
      console.log("imgid", imgId);
      this.api("sections/dafater/get-by-imgid", {
        id: imgId
      }).then(res => {
        console.log("s", res);
        if (res.ok && res.data) {
          this.inputs.img = {
            path: this.splitter + res.data.imgPath,
            base64: "",
            id: imgId
          };
          this.inputs.dafter.value = this.inputs.dafter.options.data.find(
            item => item.value.id == res.data.dafaterId
          ).value;
          this.loadImage();

          if (res.data.dafaterRels && res.data.dafaterRels.length > 0) {
            this.result.conscriptes.items = res.data.dafaterRels.map(item => {
              return {
                fullName: item.conscripte.fullName,
                militaryId: item.conscripte.militaryId,
                // notes: item.note,
                relId: item.id
              };
            });
          } else {
            this.result.conscriptes.items = [];
          }
        }
      });
    },
    async loadImage() {
      let loadedItem = await this.api("global/load-image", {
        path: this.inputs.img.path
      });
      this.$set(this.inputs.img, "base64", loadedItem.data);
    },
    emptyData() {
      this.$set(this.result.conscriptes, "items", []);
      this.inputs.img = {};
      this.inputs.dafter.value = {};
      this.edit.conscripte.militaryId = "";
      this.edit.conscripte.fullName = "";
    },
    findCons() {
      let militaryId = this.search.militaryId.trim();
      let fullName = this.fixName(this.search.fullName.trim());
      console.log("ml", militaryId);
      this.$set(this.listCheckboxes, "loading", true);
      this.api("global/get_all", {
        table: "conscriptes",
        where: {
          fullName: {
            $like: `${fullName}%`
          },
          militaryId: {
            $startsWith: militaryId
          }
        },
        attrs: ["militaryId", "fullName"]
      })
        .then(x => {
          console.log(x);
          this.$set(
            this.listCheckboxes,
            "allData",
            x.data.filter(cons => cons.fullName && cons.militaryId)
          );

          this.$set(this.listCheckboxes, "data", this.listCheckboxes.allData);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء البحث بالإسم. من فضلك أعد المحاولة");
        })
        .finally(() => {
          this.$set(this.listCheckboxes, "loading", false);
        });
    },
    removeCon(cons) {
      let index = this.listCheckboxes.selected.findIndex(
        item => item.militaryId.trim() == cons.militaryId.trim()
      );
      if (index > -1) {
        this.listCheckboxes.selected.splice(index, 1);
      }
    },
    async fixAllImgs() {
      let allImgs = await this.api("global/get_all", {
        table: "dafaterImages"
      });
      let rootIP = this.$store.state.root_ip,
        splitter = "//" + rootIP + "/";
      // splitter="/Volumes/";
      if (allImgs.data.length > 0) {
        for (const img of allImgs.data) {
          console.log(img);
          await this.api("global/update_one", {
            table: "dafaterImages",
            where: {
              id: img.id
            },
            update: {
              imgPath:
                img.imgPath.split(splitter).length > 0
                  ? img.imgPath.split(splitter)[1]
                  : img.imgPath
            }
          });
        }
      }
    },
    fillForm(item) {
      this.$set(this.edit.conscripte, "fullName", item.fullName);
      this.$set(this.edit.conscripte, "militaryId", item.militaryId);
    },
    emptyForm() {
      this.$set(this.edit.conscripte, "fullName", "");
      this.$set(this.edit.conscripte, "militaryId", "");
    }
  },
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    },
    rootDir() {
      return this.$store.state.dafaterRootDir;
    },
    splitter() {
      let rootIP = this.$store.state.root_ip,
        splitter = "//" + rootIP + "/";
      return splitter;
    },
    getCurrUserId() {
      return this.$store.getters.getCurrUserId;
    }
  }
};
</script>
