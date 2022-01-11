<template>
  <div>
    <v-row>
      <v-col md="12">
        <v-row>
          <v-col class="pr-4">
            <!-- الدفاتر الخاصه بك هي
            {{ myDafater }} -->
            <!-- رجب -->
            <template v-for="(dafter, i) in myDafater">
              <v-fab-transition :key="i">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-show="!dafaterFBtnHidden"
                      @click="choseDafterFromFBtn(i)"
                      class="ma-3"
                      fab
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-progress-circular
                        :rotate="360"
                        :size="50"
                        :width="4"
                        :indeterminate="dafter.loading"
                        :value="dafter.percentage"
                        :color="
                          dafter.percentage >= 90
                            ? 'success'
                            : dafter.percentage < 90 && dafter.percentage > 0
                            ? 'warning'
                            : 'primary'
                        "
                      >
                        <span style="color: black">
                          {{ dafter.code }}
                        </span>
                      </v-progress-circular>
                    </v-btn>
                  </template>
                  <span>{{ dafter.percentage + " %" }}</span>
                </v-tooltip>
              </v-fab-transition>
            </template>
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
                @click="openDafterReportDialog()"
                v-if="!inputs.img.path"
                :disabled="!inputs.dafter.value.id"
                color="success"
              >
                تقرير الدفتر
              </v-btn>
            </template>
          </v-tooltip>
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
          <v-btn
            @click="deleteImageDialog = true"
            color="red"
            v-if="inputs.img.path && isAdmin()"
          >
            مسح الصورة الحالية
          </v-btn>
          <span v-if="counter && inputs.img.path"
            >اجمالي عدد الافراد التي تم تسجيلها : {{ counter }}
          </span>

          <v-btn
            @click="addImageDialog = true"
            color="primary"
            v-if="inputs.img.path && isAdmin()"
          >
            اضافه صوره جديده بعد
          </v-btn>
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
          <v-col class="text-left">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="pickImage(inputs.imgCurrentIndex - 10)"
                  :disabled="inputs.imgCurrentIndex <= 10"
                  v-on="on"
                  icon
                >
                  <v-icon>mdi-skip-forward</v-icon>
                </v-btn>
              </template>
              <span>للخلف 10 صور</span>
            </v-tooltip>
          </v-col>
          <v-col class="text-right">
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
          <v-col class="text-center" style="flex-grow: 2">
            صورة رقم
            {{ inputs.imgCurrentIndex }}
            من اصل
            {{ imagePicker.imgs.length - 1 }}
            صورة
          </v-col>
          <v-col class="text-left">
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
          <v-col class="text-right">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="pickImage(inputs.imgCurrentIndex + 10)"
                  :disabled="
                    inputs.imgCurrentIndex >= imagePicker.imgs.length - 10
                  "
                  v-on="on"
                  icon
                >
                  <v-icon>mdi-skip-backward</v-icon>
                </v-btn>
              </template>
              <span>للامام 10 صور</span>
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
            <!-- <v-btn
              icon
              v-if="this.isAdmin()"
              @click="deleteAllRecords()"
              :disabled="!inputs.img.path"
            >
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn> -->
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
            <template v-slot:[`item.units_length`]="{ item }">
              <div>
                <v-chip color="transparent">
                  {{ item.units.length }}
                </v-chip>
              </div>
            </template>
            <template v-slot:[`item.delete_me`]="{ item }">
              <div v-if="!params.imgId">
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

    <v-dialog persistent max-width="500" v-model="deleteImageDialog">
      <v-card>
        <v-card-title class="white--text red">
          مسح الصورة الحالية
          <v-spacer></v-spacer>
          <v-btn dark icon @click="deleteImageDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="fontSize: 20px; padding: 20px">
          هل تريد مسح هذه الصورة ؟
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" v-text="'نعم'" @click="deleteImage()"> </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            v-text="'لا'"
            @click="deleteImageDialog = false"
          >
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      persistent
      max-width="750"
      v-model="addImageDialog"
    >
      <v-card :loading="edit.loading" :disabled="edit.loading">
        <v-card-title class="white--text primary">
          اضافه صوره جديده بعد
          <v-spacer></v-spacer>
          <v-btn dark icon @click="addImageDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <v-row>
            <!-- <v-col cols="6">
              <v-text-field
                label="اسم الصوره"
                v-model="newImageName"
              ></v-text-field>
            </v-col> -->
            <v-col cols="6">
              <v-file-input
                show-size
                counter
                label="اختر صوره"
                prepend-icon="mdi-camera"
                v-model="newImage"
              >
              </v-file-input>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="px-4">
          <v-btn-toggle v-model="edit.actionType" mandatory>
            <v-btn
              color="primary"
              class="white--text"
              @click="addImage()"
              v-text="'اضافه الصوره'"
            ></v-btn>
          </v-btn-toggle>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            @click="addImageDialog = false"
            v-text="'عودة'"
            large
            class="px-6"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            <span class="error--text"> لاحظ من فضلك : </span>
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
                  filled
                  v-model="edit[edit.type][item.model]"
                  :counter="item.model == 'militaryId' ? 13 : false"
                  class="my-3"
                  :hint="item.hint"
                  :ref="item.model"
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
            <v-col
              :cols="12"
              v-if="
                this.listCheckboxes.selected &&
                  this.listCheckboxes.selected.length
              "
              class="py-0"
            >
              اخر ما تم تسجيله :
              {{ lastSelected.fullName }}
              -
              {{ lastSelected.militaryId }}
              -
              <v-btn icon color="default" @click="fillForm(lastSelected)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <v-switch
                v-if="edit.actionType == 'insert'"
                v-model="randomId"
                class="pt-0"
                flat
                label="انشاء رقم عسكري اوتوماتيكيا"
                hint="هذا الخيار لتسهيل عملية اضافة الاشخاص المقتطع من الدفتر ارقامهم العسكرية"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-alert type="success" width="100%">
          الافراد الذين تم اختيارهم
        </v-alert>
        <v-data-table
          :headers="selectedCons.headers"
          :items="selectedCons.items"
          fixed-header
          v-sortable-data-table
          hide-default-header
          @sorted="saveOrder"
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

          <template v-slot:[`item.fullName`]="{ item }">
            <v-chip color="transparent" @click="fillForm(item)">
              {{ item.fullName }}
            </v-chip>
          </template>
          <template v-slot:[`item.militaryId`]="{ item }">
            <v-chip color="transparent" @click="fillForm(item)">
              {{ item.militaryId }}
            </v-chip>
          </template>
          <template v-slot:[`item.remove_me`]="{ item }">
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
            :disabled="isTriggered"
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
        <v-card-title> من فضلك اختر صورة </v-card-title>
        <v-divider> </v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(img, i) in imagePicker.imgs">
              <v-col :key="i">
                <v-btn
                  @click="pickImage(i)"
                  v-if="i != 0"
                  :class="{ success: img.isAssigned }"
                >
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
    <!--
      TODO : MAKE THIS DIALOG COMPONENT ,
      DIALOG FORE Reports.
    -->
    <v-dialog
      v-model="reportDialog.state"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar flat dark color="success">
          <v-btn icon dark @click="closeDafterReportDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>
            تقرير دفتر
            {{ reportDialog.name }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="closeDafterReportDialog"> رجوع </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="dataTable">
          <v-data-table
            dense
            :headers="reportDialog.headers"
            :items="reportDialog.items"
            item-key="imageName"
            class="elevation-4"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped>
.dataTable {
  position: relative;
  z-index: 1;
  margin-top: -15px;
}
</style>
<script>
import { includes } from "../../server-sequelize/seeders/Nationalities";
import Sortable from "sortablejs";

export default {
  name: "DafaterCons",
  directives: {
    sortableDataTable: {
      bind(el, binding, vnode) {
        const options = {
          animation: 150,
          onUpdate: function(event) {
            vnode.child.$emit("sorted", event);
          }
        };
        Sortable.create(el.getElementsByTagName("tbody")[0], options);
      }
    }
  },
  mounted() {
    window.addEventListener("keydown", this.eventListener);
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
      console.log("v : ", v);
      this.$set(this.selectedCons, "items", v);
      if (v[v.length - 1]) this.selectedCons.savedItems.push(v[v.length - 1]);

      this.lastSelected = v && v.length ? v[v.length - 1] : {};
    },
    randomId(v) {
      if (v) {
        this.$set(this.edit.conscripte, "militaryId", this.generateRandomId());
      } else {
        this.$set(this.edit.conscripte, "militaryId", "");
      }
    }
  },
  data: () => ({
    componentName: "dafater_cons",
    addImageDialog: false,
    deleteImageDialog: false,
    newImageName: null,
    newImage: null,
    lastSelected: {},
    onEditMode: false,
    isTriggered: false,
    randomId: false,
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
      actionType: "select",
      conscripte: {}
    },
    selectedCons: {
      items: [],
      savedItems: [],
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
    ],
    reportDialog: {
      // btnEnabled: false,
      name: "",
      color: "success",
      state: false,
      headers: [
        {
          text: "اسم الصوره",
          sortable: true,
          value: "imageName"
        },
        {
          text: "عدد المسجلين",
          sortable: true,
          value: "consCount"
        },
        {
          text: " اول فرد بالصوره",
          sortable: true,
          value: "militaryId"
        }
      ],
      items: []
    }
  }),
  methods: {
    async addImage() {
      let imageObject = {
        //finalImageName: this.newImageName,
        dir:
          this.rootDir +
          `/${this.inputs.dafter.value.filmNumber}/Film/${this.inputs.dafter.value.dafterIndex}/`,
        newImagePath: this.newImage.path,
        currentImagepath: this.inputs.img.path
      };
      console.log(imageObject);
      try {
        const result = await this.api(
          "sections/dafater/AddMissingImage",
          imageObject
        );
        console.log("sections/dafater/AddMissingImage : ", result);
        this.addImageDialog = false;
        this.newImage = null;
        this.$set(this.result.conscriptes, "items", []);
        this.inputs.img = {};
        this.openDafaterModal();
      } catch (error) {
        console.log(error);
        this.addImageDialog = false;
      }
    },
    async deleteImage() {
      let imageObject = {
        currentImagePath: this.inputs.img.path
      };
      try {
        const result = await this.api(
          "sections/dafater/deleteCurrentImage",
          imageObject
        );
        console.log("sections/dafater/deleteCurrentImage : ", result);
        this.deleteImageDialog = false;
        this.inputs.img = {};
        this.openDafaterModal();
      } catch (error) {
        console.log(error);
        this.deleteImageDialog = false;
      }
    },
    saveOrder({ oldIndex, newIndex }) {
      const movedItem = this.selectedCons.savedItems.splice(oldIndex, 1)[0];
      this.selectedCons.savedItems.splice(newIndex, 0, movedItem);
    },
    generateRandomId() {
      return `${Math.floor(Math.random() * 10000)}-عشوائي-${Math.floor(
        Math.random() * 10000
      )}`;
    },
    eventListener(e) {
      console.log(!this.inputs?.img?.path);
      if (!this.isCurrentRoute(this.componentName) || !this.inputs?.img?.path) {
        // or there's no image
        // don't do anything
        return true;
      } else {
        if (this.edit.model == false) {
          // model is closed
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
        } else {
          // model is opened
          if (e.key == "ArrowRight") {
            this.edit.actionType = "insert";
            this.focusEl("fullName");
          }
          if (e.key == "ArrowLeft") {
            this.edit.actionType = "select";
            this.focusEl("searchByIdField");
          }
          if (e.key == "ArrowUp") {
            this.search.militaryId = this.generateSequencedId(
              this.lastSelected,
              false
            );
            if (this.search.militaryId) this.findCons();
          }
          if (e.key == "ArrowDown") {
            this.search.militaryId = this.generateSequencedId(
              this.lastSelected,
              true
            )
              ? this.generateSequencedId(this.lastSelected, true)
              : this.search.militaryId;
            if (this.search.militaryId) this.findCons();
          }
          if (e.key == "*") this.editRecord(this.edit.actionType);
        }
        return false;
      }
    },
    generateSequencedId(lastSelected, isNext) {
      if (this.isEmptyObj(lastSelected)) {
        return;
      }
      let generatedId = this.generateId(lastSelected.militaryId);
      generatedId = Number(generatedId);
      if (generatedId) {
        if (isNext) {
          return (generatedId + 1).toString();
        } else {
          return (generatedId - 1).toString();
        }
      }
      return;
    },
    generateId(militaryId) {
      console.log(militaryId, militaryId.length);
      if (militaryId.length != 7 && militaryId.length != 13) return;
      if (militaryId.length == 13) {
        militaryId = militaryId.slice(0, militaryId.length - 1);
      }
      const dublicateRegex = /^\d+(?=-)/;
      if (/\D/g.test(militaryId)) {
        militaryId = militaryId.match(dublicateRegex)[0];
      }
      return militaryId;
    },
    spilitImgName(name) {
      return parseInt(
        name
          .toLowerCase()
          .split("//")[1]
          .split(".jpg")[0]
      );
    },
    moveToAddState() {
      if (this.search.militaryId) {
        this.edit.conscripte.militaryId = this.search.militaryId;
        this.search.militaryId = "";
        this.edit.conscripte.fullName = "";
        this.onEditMode = false;
        this.edit.actionType = "insert";
        this.focusEl("fullName");
      }
    },
    async getDafterReport() {
      let id = this.inputs.dafter.value.id;
      await this.api("sections/dafater/report/get-dafater", { id }).then(
        report => {
          let dafaterImages = report.data.dafaterImages.sort((a, b) => {
            return (
              Number(
                a.imgPath
                  .toLowerCase()
                  .split("//")[1] //getting the file name.extention
                  .split(".jpg")[0] //isolating the name from the extention
              ) -
              Number(
                b.imgPath
                  .toLowerCase()
                  .split("//")[1]
                  .split(".jpg")[0]
              )
            );
          });
          this.reportDialog.name = report.data.code + " - " + report.data.name;
          console.log("dafaterImages , ", dafaterImages);
          for (let i in dafaterImages) {
            let obj = {
              imageName: i,
              consCount: dafaterImages[i].dafaterRels.length,
              militaryId: dafaterImages[i].dafaterRels[0]
                ? dafaterImages[i].dafaterRels[0].MilitaryId
                : "لا يوجد"
            };
            this.reportDialog.items.push(obj);
          }
          this.$set(this.reportDialog, "state", true);
        }
      );
    },
    openDafterReportDialog() {
      if (this.inputs.dafter.value) {
        this.getDafterReport();
      }
    },
    closeDafterReportDialog() {
      this.$set(this.reportDialog, "state", false);
      this.$set(this.reportDialog, "items", []);
    },
    // key press
    triggerKeyPress(e) {
      // Check first conscripte
      /* else if (e.key == "ArrowUp") {
          this.moveToAddState();
        } */
      if (this.edit.model == true) {
        if (e.key == "+") {
          let cons = this.listCheckboxes.data;
          if (cons.length) {
            this.toggleDafaterCons(cons[0]);
          }
          e.preventDefault();
          return false;
        }
        if (e.key == "*") {
          e.preventDefault();
          return false;
        }
        if (e.key == ".") {
          e.preventDefault();

          if (this.search.militaryId) this.moveToAddState();
          else this.fillForm(this.lastSelected);
          return false;
        }
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
    async choseDafterFromFBtn(index) {
      this.emptyData();
      this.inputs.dafter.value = this.myDafater[index];
      const include = [
        {
          model: "dafaterImages",
          include: [{ model: "dafaterRel" }]
        }
      ];
      this.$set(this.myDafater[index], "loading", true);
      // this.myDafater[index].loading = true;
      let allDafater = await this.api("global/get_all", {
        table: "dafater",
        where: { id: this.myDafater[index].id },
        include
      });

      if (allDafater.ok && allDafater.data && allDafater.data.length > 0) {
        let selectedDafter = allDafater.data[0];
        let allImgsCount = selectedDafter.count,
          assignedImgsCount = 0;
        selectedDafter.percentage = 0;
        if (
          selectedDafter.dafaterImages &&
          selectedDafter.dafaterImages.length
        ) {
          assignedImgsCount = selectedDafter.dafaterImages.filter(
            i => i.dafaterRels.length
          ).length;
          selectedDafter.percentage = Math.floor(
            (Number(assignedImgsCount) / Number(allImgsCount)) * 100
          );
          this.$set(
            this.myDafater[index],
            "percentage",
            selectedDafter.percentage
          );
        }
      }
      this.$set(this.myDafater[index], "loading", false);
      this.$set(this.myDafater[index], "", this.myDafater[index]);
      // this.$refs.tmpBtn.click();
      // this.$set(this.reportDialog, "btnEnabled", true);
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
        this.$refs.searchByIdField.focus();
        // رجب مش عاوز و هو بيسجل الرقم العسكري يتعمله ريسيت
        // if (this.getCurrUserId != 1079) {
        // }
      }
    },
    async getAllDafater() {
      let allDafater = await this.api("global/get_all", {
        table: "dafater"
        // include
      });
      this.$set(this.inputs.dafter.options, "loading", false);
      if (allDafater.ok && allDafater.data && allDafater.data.length > 0) {
        console.log("r", allDafater);
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
          allDafater.data.filter(filterDafaters).map(mapDafaters)
        );

        this.myDafater = allDafater.data
          .filter(d => d.assignedTo == this.getCurrUserId)
          .map(i => {
            i.loading = false;
            i.percentage = 0;
            return i;
          });
        // .map(addPercentage);
        // .map(d => "(" + d.code + " - " + d.name + ")")
        // .join(" , ");
      }
    },
    pickImage(index) {
      console.log(this.imagePicker.imgs);
      console.log("img", this.imagePicker.imgs[index]);
      this.api("sections/dafater/set-img", {
        path: this.imagePicker.imgs[index].path.split(this.splitter)[1],
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
    async openImagePicker(item) {
      let assginedImgsRes = await this.api("global/get_all", {
        table: "dafaterImages",
        where: {
          dafaterId: this.inputs.dafter.value.id
        },
        include: [
          {
            model: "dafaterRel"
            // required: true,
          }
        ]
      });
      let images = item.images.map(img => {
        let obj = { ...img };
        obj.path =
          this.rootDir +
          `/${this.inputs.dafter.value.filmNumber}/Film/${this.inputs.dafter.value.dafterIndex}/` +
          `/${img.name}`;
        obj.isAssigned = false;
        if (assginedImgsRes.data && assginedImgsRes.data.length > 0) {
          let assignedImg = assginedImgsRes.data.find(asImg =>
            asImg.imgPath.includes("/" + img.name)
          );
          if (assignedImg) {
            obj.isAssigned = assignedImg.dafaterRels.length > 0;
          }
        }
        return obj;
      });
      this.$set(this.imagePicker, "model", true);
      this.$set(this.imagePicker, "imgs", images);
    },
    async editRecord(actionType) {
      if (!actionType) {
        return;
      }
      this.isTriggered = true;
      await this.setRelation(
        this.selectedCons.savedItems.map(i => i.militaryId)
      );
      this.selectedCons.savedItems = [];
      this.isTriggered = false;
      // add state
    },
    async addOrUpdateCons() {
      if (!this.edit.conscripte.militaryId) {
        this.$refs["militaryId"][0].focus();
        return;
      }
      if (!this.edit.conscripte.fullName) {
        this.$refs["fullName"][0].focus();
        return;
      }
      const conscripte = {
        militaryId: this.edit.conscripte.militaryId,
        fullName: this.edit.conscripte.fullName
      };
      const dafterCode = this.inputs.dafter.value.code;
      await this.setConsRelation(conscripte, dafterCode);
      let index = this.listCheckboxes.selected.findIndex(
        i => i.militaryId.trim() == conscripte.militaryId.trim()
      );
      if (index == -1) {
        this.listCheckboxes.selected.push({ ...conscripte });
        console.log("new", this.listCheckboxes.selected);
      } else {
        this.listCheckboxes.selected.splice(index, 1, {
          ...conscripte
        });
        console.log("modified", this.listCheckboxes.selected);
        console.log("new obj", conscripte);
      }
      this.emptyForm();
      this.onEditMode = false;
      this.$refs["fullName"][0].focus();
      if (this.randomId)
        this.$set(this.edit.conscripte, "militaryId", this.generateRandomId());
    },
    async setConsRelation(conscripte, dafterCode) {
      let consGetter = await this.api("global/get_one", {
          table: "conscriptes",
          where: {
            militaryId: conscripte.militaryId
          },
          returnObject: true
        }),
        consUpdate,
        consCreate;
      console.log(consGetter);
      console.log(this.$refs);

      if (consGetter.ok && consGetter.data) {
        console.log("updater");
        if (this.onEditMode) {
          consUpdate = await this.api("global/update_one", {
            table: "conscriptes",
            where: {
              militaryId: conscripte.militaryId
            },
            update: {
              daftarNumber: dafterCode,
              fullName: conscripte.fullName.trim()
            }
          });
        } else {
          conscripte.militaryId = `${conscripte.militaryId}-مكرر-${Math.floor(
            Math.random() * 1000
          )}`;
          consCreate = await this.api("global/create_one", {
            table: "conscriptes",
            where: {
              militaryId: conscripte.militaryId,
              fullName: conscripte.fullName,
              daftarNumber: dafterCode
            }
          });
        }
      } else {
        console.log("creator");
        consCreate = await this.api("global/create_one", {
          table: "conscriptes",
          where: {
            militaryId: conscripte.militaryId,
            fullName: conscripte.fullName,
            daftarNumber: dafterCode
          }
        });
        // conscripte.fullName = "";
        // conscripte.militaryId = "";
      }
    },
    selectCons(militaryId) {
      this.$set(this.edit.conscripte, "militaryId", militaryId);
    },
    async setRelation(militaryIds) {
      let imageId = this.inputs.img.id;
      this.$set(this.edit, "model", false);
      for (const element of militaryIds) {
        const params = {
          imageId,
          militaryId: element,
          // notes: this.edit.conscripte.notes,
          userId: this.getCurrUserId,
          dateAdded: new Date()
        };
        await this.api("sections/dafater/set-relation", params);
      }
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
    async deleteAllRecords() {
      for (const iterator of this.result.conscriptes.items.filter(
        i => !i.militaryId.includes("عش")
      )) {
        await this.api("sections/dafater/delete-relation", {
          relationId: iterator.relId
        });
      }
      await this.fetchData(this.inputs.img.id);
    },
    openFormDialog(actionType = this.edit.actionType, item = {}) {
      this.$set(this.edit, "model", true);
      this.$set(this.edit, "actionType", actionType);
      //this.$refs.searchByIdField.focus();
      if (item) {
        console.log("model", item);
        this.$set(this.edit, "conscripte", item);
      }
      this.focusEl("searchByIdField");
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
        console.log("obj in getDafter()", obj);
        console.log("items in getDafter() ", items);
        console.log(items.data.folders[0].images.length);
        if (items.data.folders && items.data.folders.length > 0) {
          if (obj.name) {
            obj.children = items.data.folders;
          } else {
            this.$set(this, "items", items.data.folders);
          }
          // set dafter count every time you select it
          this.api("global/update_one", {
            table: "dafater",
            where: { id: this.inputs.dafter.value.id },
            update: { count: items?.data?.folders[0]?.images?.length }
          });
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
            console.log("s", res.data.dafaterRels);
            this.result.conscriptes.items = res.data.dafaterRels
              .map(item => {
                return {
                  fullName: item.conscripte ? item.conscripte.fullName : "",
                  militaryId: item.militaryId,
                  // notes: item.note,
                  relId: item.id,
                  dateAdded: item.dateAdded
                };
              })
              .sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
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

        this.selectedCons.savedItems.splice(
          this.selectedCons.savedItems.findIndex(
            item => item.militaryId.trim() == cons.militaryId.trim()
          ),
          1
        );
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
      if (this.isEmptyObj(item)) {
        return;
      }
      this.edit.actionType = "insert";
      this.$set(this.edit.conscripte, "fullName", item.fullName);
      this.$set(this.edit.conscripte, "militaryId", item.militaryId);
      this.onEditMode = true;
      this.focusEl("fullName");
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
  },
  destroyed() {
    console.log("destroyed");
    window.removeEventListener("keydown", this.eventListener);
  }
};
</script>
