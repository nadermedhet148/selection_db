<template>
  <div class="mb-10">
    <v-row>
      <v-col cols="12" lg="6">
        <v-card>
          <v-card-title>
            اختيار وتشغيل العملية
            <!-- <v-spacer></v-spacer>
            <v-btn @click="getUnitsFromWeb()">
              Test
            </v-btn> -->
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-autocomplete
              filled
              label="نوع العملية"
              v-model="operation.type"
              :items="operation_types"
              item-text="name"
              item-value="method"
              dense
              :loading="operation_types_loading"
            ></v-autocomplete>
            <v-row v-if="operation.type == 'update1sFromWeb'">
              <v-col cols="4">
                <v-text-field
                  v-mask="'####'"
                  v-model="operation.conscriptionYear"
                  hide-details
                  label="سنة التجنيد"
                  filled
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  multiple
                  v-model="operation.conscriptionForces"
                  :items="['52', '18', '66', '04', '77', '88']"
                  hide-details
                  label="أكواد الأسلحة"
                  filled
                ></v-autocomplete>
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  v-model="segelatWeb.operation.conscripteType"
                  :items="segelatWeb.conscripteTypes"
                  hide-details
                  label="نوع الخدمة"
                  filled
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text class="text-center">
            <v-progress-circular
              v-if="operation.type == 'update1sFromWebSegelat'"
              size="350"
              color="primary"
              :indeterminate="
                segelatWeb.operation.begin && !segelatWeb.operation.perc
              "
              v-model="segelatWeb.operation.perc"
            >
              <div v-if="!segelatWeb.operation.begin">
                <div>
                  <v-btn
                    @click="runOperation(operation.type)"
                    icon
                    x-large
                    :disabled="!operation.type"
                    color="primary"
                  >
                    <v-icon>mdi-power</v-icon>
                  </v-btn>
                </div>
              </div>
              <div v-else>
                <div>
                  <v-card-title class="pb-1 text-h1 d-block" dir="ltr"
                    >{{ segelatWeb.operation.perc }} %</v-card-title
                  >
                </div>
                <div>
                  <v-card-title class="pb-1 d-block error--text">
                    <span class="font-weight-bold">أخطاء</span>
                    :
                    <!-- {{ operation.errors }} -->
                    {{ errors.items.length }}
                  </v-card-title>
                  <v-card-title class="pb-1 d-block error--text">
                    {{ segelatWeb.operation.done }}
                    /
                    {{ segelatWeb.cons.items.length }}
                  </v-card-title>
                </div>
                <div class="mt-4">
                  <v-btn
                    @click="stopOperationModel = true"
                    icon
                    x-large
                    color="error"
                  >
                    <v-icon>mdi-stop-circle-outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-progress-circular>
            <v-progress-circular
              v-else
              size="350"
              color="primary"
              :indeterminate="operation.begin && !operation.perc"
              v-model="operation.perc"
            >
              <div v-if="!operation.begin">
                <div>
                  <v-btn
                    @click="runOperation(operation.type)"
                    icon
                    x-large
                    :disabled="!operation.type"
                    color="primary"
                  >
                    <v-icon>mdi-power</v-icon>
                  </v-btn>
                </div>
              </div>
              <div v-else>
                <div>
                  <v-card-title class="text-h1 d-block" dir="ltr"
                    >{{ operation.perc }} %</v-card-title
                  >
                </div>
                <div>
                  <v-card-title class="d-block error--text">
                    <span class="font-weight-bold">أخطاء</span>
                    :
                    <!-- {{ operation.errors }} -->
                    {{ errors.items.length }}
                  </v-card-title>
                </div>
                <div class="mt-4">
                  <v-btn
                    @click="stopOperationModel = true"
                    icon
                    x-large
                    color="error"
                  >
                    <v-icon>mdi-stop-circle-outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col cols="12" lg="6">
        <v-card dark height="525">
          <v-card-title>
            الـ Console
          </v-card-title>
          <v-divider></v-divider>
        </v-card>
      </v-col> -->
      <v-col>
        <v-card>
          <v-card-title>
            الأخطاء
          </v-card-title>
          <v-divider></v-divider>
          <v-text-field
            v-model.lazy="errors.search"
            filled
            dense
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
          <v-data-table
            height="335"
            :search.sync="errors.search"
            :headers="errors.headers"
            :items="errors.items"
            v-model="errors.selected"
            fixed-header
          >
            <template #item.operation_errors="{ item }">
              <div>
                <template v-for="(err, i) in item.operation_errors">
                  <v-chip small :key="i" class="font-weight-bold my-1">
                    {{ err }}
                  </v-chip>
                </template>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-card
      class="my-4"
      outlined
      v-if="result.items.length && operation.type == 'update1sFromWeb'"
    >
      <v-card-title>التحكم في العملية</v-card-title>
      <v-card-text>
        <v-simple-table class="ma-3">
          <template v-slot:default>
            <tbody>
              <tr>
                <td width="20%">
                  العملية الحالية :
                </td>
                <td>
                  {{ controlOp.currentOp }}
                </td>
              </tr>
              <tr>
                <td>الحالة :</td>
                <td>
                  <v-chip v-if="controlOp.pause" color="error" class="ma-2"
                    >متوقف</v-chip
                  >
                  <v-chip
                    v-if="controlOp.tryingToPause"
                    color="warning"
                    class="ma-2"
                  >
                    جاري الإيقاف بشكل آمن
                  </v-chip>
                  <v-chip
                    v-if="!controlOp.pause && !controlOp.tryingToPause"
                    color="success"
                    class="ma-2"
                    >يعمل</v-chip
                  >
                </td>
              </tr>
              <tr>
                <td>الوحدة الحالية :</td>
                <td>
                  <v-row class="mt-2">
                    <v-col cols="4">
                      <v-autocomplete
                        filled
                        :disabled="!controlOp.pause || !result.items.length"
                        @change="
                          currentCons = [];
                          controlOp.disableOperateBtn = true;
                        "
                        :items="result.items"
                        item-text="id"
                        item-value="unitId"
                        v-model="currentUnitId"
                        label="رقم الوحدة الحالية"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        filled
                        :disabled="!controlOp.pause || !result.items.length"
                        @change="
                          currentCons = [];
                          controlOp.disableOperateBtn = true;
                        "
                        :items="result.items"
                        item-text="unitText"
                        item-value="unitId"
                        v-model="currentUnitId"
                        label="الوحدة الحالية"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </td>
              </tr>
              <tr>
                <td>
                  المجند الحالي :
                </td>
                <td>
                  <v-row class="mt-2">
                    <v-col cols="4">
                      <v-autocomplete
                        :disabled="
                          !controlOp.pause ||
                            !result.items.length ||
                            !currentCons.length
                        "
                        @change="controlOp.disableOperateBtn = true"
                        :items="currentCons"
                        item-text="index"
                        item-value="index"
                        v-model="currentUnitListProgress"
                        :persistent-hint="true"
                        filled
                        label="رقم المجند الحالي"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        :disabled="
                          !controlOp.pause ||
                            !result.items.length ||
                            !currentCons.length
                        "
                        @change="controlOp.disableOperateBtn = true"
                        filled
                        :items="currentCons"
                        item-text="militaryId"
                        item-value="index"
                        v-model="currentUnitListProgress"
                        label="الرقم العسكري الحالي"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-btn
          x-large
          :disabled="!controlOp.pause || !currentUnitId"
          color="secondary"
          @click="
            resendUnit();
            controlOp.disableOperateBtn = false;
          "
        >
          اعادة الاتصال بالوحدة
        </v-btn>
        <v-btn
          x-large
          :disabled="!controlOp.pause || !currentUnitId || !currentCons.length"
          color="indigo white--text"
          @click="
            resendCon();
            controlOp.disableOperateBtn = false;
          "
        >
          إعادة ارسال طلب الجندي
        </v-btn>
        <v-btn
          @click="$set(controlOp, 'tryingToPause', true)"
          v-if="!controlOp.pause && !controlOp.tryingToPause"
          x-large
          color="error"
          outlined
        >
          إيقاف مؤقت
        </v-btn>

        <v-btn
          @click="
            $set(controlOp, 'tryingToPause', false);
            $set(controlOp, 'pause', true);
          "
          v-if="controlOp.tryingToPause"
          x-large
          color="error"
        >
          إيقاف فوري
        </v-btn>

        <v-btn
          @click="resumeCurrentOp()"
          v-if="controlOp.pause"
          :disabled="controlOp.disableOperateBtn"
          x-large
          color="primary"
        >
          تشغيل
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card
      class="my-4"
      outlined
      v-if="
        result.items.length &&
          fixedIds.length &&
          operation.type == 'update1sFromWeb'
      "
    >
      <v-card-title>الجنود الذين ما زالوا بالخدمة</v-card-title>
      <v-card-text>
        <v-simple-table outlined class="ma-3">
          <template v-slot:default>
            <thead>
              <tr>
                <td>
                  الرقم العسكري
                </td>
                <td>
                  الإسم
                </td>
                <td>
                  الوحدة
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!checkInService.inServiceCons.length">
                <td colspan="3">لا يوحد نتائج حتى الآن</td>
              </tr>
              <tr v-for="(con, i) in checkInService.inServiceCons" :key="i">
                <td>{{ con.militaryId }}</td>
                <td>{{ con.fullName }}</td>
                <td>{{ con.unitText }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-card class="mb-4" v-if="result.items.length">
      <v-card-title>
        المصدر
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              :disabled="result.items.length > 0"
              @click="
                $refs.upload_file.$el.children[1].children[0].children[0].children[1].click()
              "
              icon
              v-on="on"
            >
              <v-icon>mdi-paperclip</v-icon>
            </v-btn>
          </template>
          <span>اختيار ملف</span>
        </v-tooltip>
        <v-file-input
          v-model="file"
          ref="upload_file"
          filled
          class="d-none"
          counter
          @change="fileUploaded"
        ></v-file-input>
      </v-card-title>
      <v-divider></v-divider>
      <!-- <v-text-field
        v-model.lazy="result.search"
        filled
        dense
        prepend-inner-icon="mdi-magnify"
      ></v-text-field> -->
      <v-data-table
        :search.sync="result.search"
        :headers="result.headers"
        :items="result.items"
        v-model="result.selected"
        fixed-header
        hide-default-header
        multi-sort
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="result.items"
            :table="table"
            :filters.sync="tableFilters"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters"
            :table="table"
          ></table-footer-filters>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            v-if="item.status"
            small
            class="font-weight-bold"
            :color="item.status ? status_colors[item.status] : ''"
          >
            {{ item.status ? status_texts[item.status] : "" }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-card class="mb-4" v-if="segelatWeb.cons.items.length > 0">
      <v-card-title>
        المجندين
      </v-card-title>
      <v-divider></v-divider>
      <v-text-field
        v-model.lazy="segelatWeb.cons.search"
        filled
        dense
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>
      <v-data-table
        :search.sync="segelatWeb.cons.search"
        :headers="segelatWeb.cons.headers"
        :items="segelatWeb.cons.items"
        v-model="segelatWeb.cons.selected"
        fixed-header
      >
        <template v-slot:item.webOperationStatus="{ item }">
          <v-chip
            v-if="item.webOperationStatus"
            small
            class="font-weight-bold"
            :color="
              item.webOperationStatus
                ? status_colors[item.webOperationStatus]
                : ''
            "
          >
            {{
              item.webOperationStatus
                ? status_texts[item.webOperationStatus]
                : ""
            }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <!-- <v-row>
      <v-col>
        <v-card class="text-left" dir="ltr">
          <v-card-title class="text-left d-block mb-0 pb-0" dir="ltr">
            <v-text-field
              v-model="list_test_search"
              prepend-inner-icon="mdi-magnify"
              filled
              dense
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-actions class="text-left" dir="ltr">
            <v-btn class="text-capitalize" @click="getUnitsFromWeb()">
              Get Things
            </v-btn>
          </v-card-actions>
          <v-card-text class="text-left" dir="ltr">
            <pre style="font-weight: 400 !important">
              {{ list_test.length }}
            </pre>
            <pre style="font-weight: 400 !important">
              {{ list_test }}
            </pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
    <!-- <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            ما تم حتى الآن
          </v-card-title>
          <v-divider></v-divider>
          <v-text-field
            v-model.lazy="conscripte_results.search"
            filled
            dense
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
          <v-data-table
            :search.sync="conscripte_results.search"
            :headers="conscripte_results.headers"
            :items="conscripte_results.items"
            v-model="conscripte_results.selected"
            fixed-header
            disable-sort
          >
            <template v-slot:item.operation_errors="{ item }">
              <div>
                <template v-for="(err, i) in item.operation_errors">
                  <v-chip small :key="i" class="font-weight-bold my-1">
                    {{ err }}
                  </v-chip>
                </template>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row> -->
    <div v-if="allowChilds">
      <child1
        ref="child1"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @pushError="pushError"
        @removeError="removeError"
        :current-unit-id="currentUnitId"
        :currentCons="currentCons"
        :controlOp="controlOp"
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child1>
      <child2
        ref="child2"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @pushError="pushError"
        @removeError="removeError"
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child2>
      <child3
        ref="child3"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @pushError="pushError"
        @removeError="removeError"
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child3>
      <child4
        ref="child4"
        @numbers_passed_conscriptes="
          currentUnitListProgress = currentUnitListProgress + 1
        "
        @pushError="pushError"
        @removeError="removeError"
        @newListIsEmpty="numbers_passed_units = numbers_passed_units + 1"
      ></child4>
    </div>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      scrollable
      v-model="stopOperationModel"
      max-width="450"
    >
      <v-card>
        <v-card-title class="error white--text">
          إيقاف العملية
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div v-if="operation.done > 0 || segelatWeb.operation.done > 0">
            في حالة إيقاف العملية سوف يكون بإمكانك استكمالها في أي وقت, ولكن
            سيتم إعادة الوحدة الحالية بالكامل من بدايتها.
          </div>
          <div v-else>
            لا يمكنك إيقاف العملية في المرحلة الأولى
          </div>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            large
            outlined
            class="px-6"
            v-text="'رجوع'"
            @click="stopOperationModel = false"
          ></v-btn>
          <v-btn
            color="error"
            large
            :disabled="
              operation.done == 0 &&
                segelatWeb.operation.done !== null &&
                segelatWeb.operation.done == 0
            "
            class="px-6"
            v-text="'إيقاف'"
            @click="stopOperation()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="oneUnit.model"
      persistent
      scrollable
      max-width="450"
    >
      <v-card :loading="oneUnit.loading" :disabled="oneUnit.loading">
        <v-card-title>
          اختر الوحدة المراد تشغيلها
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <v-autocomplete
            :loading="oneUnit.loading"
            v-model="operation.startIn"
            :items="result.items"
            filled
            label="الوحدة"
            item-text="unitText"
            item-value="id"
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="oneUnit.model = false"
          >
            عودة
          </v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="update1sFromWebUnit(false)"
          >
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="backup_options.model"
      persistent
      scrollable
      max-width="450"
    >
      <v-card>
        <v-card-title>
          نسخ قاعدة البيانات
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="backup_options.model = false"
            :disabled="backup_options.begin"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div v-if="backup_options.begin">
            <div class="mb-3">
              <v-progress-linear
                indeterminate
                color="primary"
                rounded
              ></v-progress-linear>
            </div>
            <div>
              من فضلك لا تقم بإغلاق الصفحة أو الخروج منها, أو إغلاق المنظومة
              أثناء نسخ قاعدة البيانات
            </div>
          </div>
          <div
            class="text-center"
            v-else-if="!backup_options.begin && backup_options.done"
          >
            <div class="mb-4">
              <v-icon size="75" color="success"
                >mdi-check-circle-outline</v-icon
              >
            </div>
            <div>
              تم حفظ قاعدة البيانات
            </div>
          </div>
          <div v-else>
            <v-text-field
              class="mb-3"
              prepend-icon=""
              label="المسار"
              hint="من فضلك حدد المسار للملف المراد حفظه"
              persistent-hint
              filled
              v-model="backup_options.path"
            ></v-text-field>
            <v-autocomplete
              :items="backup_options.dbs"
              item-text="name"
              item-value="id"
              v-model="backup_options.dbname"
              filled
              persistent-hint
              hint="من فضلك حدد قاعدة البيانات المراد نسخها"
              label="قاعدة البيانات"
            ></v-autocomplete>
            <div class="mt-4">
              <span class="error--text">
                ملحوظة :
              </span>
              لا تقم أبداً بإغلاق المنظومة أو الخروج من الصفحة أثناء أخذ نسخة من
              قاعدة البيانات, وإلا لن يتم حفظ البيانات بالكامل في الملف.
            </div>
          </div>
        </v-card-text>
        <v-card-actions
          v-if="!backup_options.begin || backup_options.done"
          class="px-4"
        >
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="px-6"
            v-text="'عودة'"
            outlined
            @click="backup_options.model = false"
            large
          ></v-btn>
          <v-btn
            color="primary"
            class="px-6"
            :disabled="backup_options.begin || backup_options.done"
            v-text="'حفظ نسخة'"
            @click="backupDB(true)"
            large
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="restore_options.model"
      persistent
      scrollable
      max-width="450"
    >
      <v-card>
        <v-card-title>
          استعادة قاعدة البيانات
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="restore_options.model = false"
            :disabled="restore_options.begin"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-6">
          <div v-if="restore_options.begin">
            <div class="mb-3">
              <v-progress-linear
                indeterminate
                color="primary"
                rounded
              ></v-progress-linear>
            </div>
            <div>
              من فضلك لا تقم بإغلاق الصفحة أو الخروج منها, أو إغلاق المنظومة
              أثناء استعادة قاعدة البيانات
            </div>
          </div>
          <div
            class="text-center"
            v-else-if="!restore_options.begin && restore_options.done"
          >
            <div class="mb-4">
              <v-icon size="75" color="success"
                >mdi-check-circle-outline</v-icon
              >
            </div>
            <div>
              تم استعادة قاعدة البيانات
            </div>
          </div>
          <div v-else>
            <v-text-field
              class="mb-3"
              prepend-icon=""
              label="الملف"
              hint="من فضلك قم بتحديد ملف قاعدة البيانات"
              persistent-hint
              filled
              v-model="restore_options.path"
            ></v-text-field>
            <v-autocomplete
              :items="backup_options.dbs"
              item-text="name"
              item-value="id"
              v-model="restore_options.dbname"
              filled
              persistent-hint
              hint="من فضلك حدد قاعدة البيانات المراد استعادتها"
              label="قاعدة البيانات"
            ></v-autocomplete>
            <div class="mt-4">
              <span class="error--text">
                ملحوظة :
              </span>
              لا تقم أبداً بإغلاق المنظومة أو الخروج من الصفحة أثناء استعادة
              قاعدة البيانات. لإن عملية استعادة قاعدة البيانات تقوم في البداية
              <span class="error-text">بحذف</span> قاعدة البيانات الموجودة
              بالكامل - إن كانت موجودة - ثم تقوم بإضافة قاعدة البيانات الجديدة.
            </div>
          </div>
        </v-card-text>
        <v-card-actions
          v-if="!restore_options.begin || restore_options.done"
          class="px-4"
        >
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="px-6"
            v-text="'عودة'"
            outlined
            @click="restore_options.model = false"
            large
          ></v-btn>
          <v-btn
            color="primary"
            class="px-6"
            :disabled="restore_options.begin || restore_options.done"
            v-text="'استعادة'"
            @click="restoreDB(true)"
            large
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="segelatWeb.model"
      scrollable
      max-width="500"
      persistent
    >
      <v-card :loading="segelatWeb.loading" :disabled="segelatWeb.loading">
        <v-card-title>
          اختر تاريخ البداية والنهاية
          <v-spacer></v-spacer>
          <v-btn icon @click="segelatWeb.model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                v-model="segelatWeb.from"
                filled
                :disabled="segelatWeb.excelFile ? true : false"
                type="date"
                label="البداية"
                hint="تاريخ التجنيد / التطوع"
                persistent-hint
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="segelatWeb.to"
                filled
                :disabled="segelatWeb.excelFile ? true : false"
                type="date"
                label="النهاية"
                hint="تاريخ التجنيد / التطوع"
                persistent-hint
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-autocomplete
                :loading="segelatWeb.units.loading"
                :items="segelatWeb.units.items"
                item-text="unitText"
                item-value="unitId"
                v-model="segelatWeb.unitId"
                :disabled="segelatWeb.excelFile ? true : false"
                filled
                label="الوحدة"
                persistent-hint
                hint="إذا أردت تحديث وحدة محددة"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-title>
          أو قم بتحديد ملف Excel
        </v-card-title>
        <v-card-text>
          <v-file-input
            clearable
            filled
            label="الملف"
            persistent-hint
            hint="يجب أن يحتوي الملف على صف واحد من الأرقام العسكرية"
            v-model="segelatWeb.excelFile"
          ></v-file-input>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            color="primary"
            outlined
            @click="segelatWeb.model = false"
            large
          >
            عودة
          </v-btn>
          <v-btn
            class="px-6"
            color="primary"
            @click="update1sFromWebSegelat(false)"
            large
          >
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="segelatWeb.profileModel"
      scrollable
      max-width="500"
      persistent
    >
      <v-card :loading="segelatWeb.loading" :disabled="segelatWeb.loading">
        <v-card-title>
          قم بتحديد ملف Excel
        </v-card-title>
        <v-card-text>
          <v-file-input
            clearable
            filled
            label="الملف"
            persistent-hint
            hint="يجب أن يحتوي الملف على صف واحد من الأرقام العسكرية"
            v-model="segelatWeb.excelFile"
          ></v-file-input>
        </v-card-text>
        <v-card-text>
          <v-col>
            <v-autocomplete
              :loading="segelatWeb.units.loading"
              :items="segelatWeb.militaryOperations"
              item-text="name"
              item-value="militaryOperationId"
              v-model="segelatWeb.militaryOperationId"
              filled
              label="العملية الحربية "
              persistent-hint
            ></v-autocomplete>
          </v-col>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            color="primary"
            outlined
            @click="segelatWeb.profileModel = false"
            large
          >
            عودة
          </v-btn>
          <v-btn
            class="px-6"
            color="primary"
            @click="updateProfilesWhichJoinMilitaryOperations(false)"
            large
          >
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-if="isCurrentRoute(componentName)"
      v-model="checkInService.model"
      scrollable
      max-width="500"
      persistent
    >
      <v-card
        :loading="checkInService.loading"
        :disabled="checkInService.loading"
      >
        <v-card-title>
          قم بتحديد ملف أو Excel
        </v-card-title>
        <v-card-text>
          <v-file-input
            clearable
            filled
            label="الملف"
            persistent-hint
            hint="يجب ان يحتوي الملف على صف واحد من الأرقام العسكرية بعنوان 'militaryId'"
            v-model="checkInService.excelFile"
          ></v-file-input>

          <v-checkbox
            v-model="checkInService.downloadS1"
            label="تحميل ملف ال1س بالكامل"
          >
          </v-checkbox>

          <v-checkbox
            v-model="checkInService.notInculdedInTheForceList"
            label="غير مدرجين في القوة الاساسية"
          >
          </v-checkbox>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            class="px-6"
            color="primary"
            outlined
            @click="checkInService.model = false"
            large
          >
            عودة
          </v-btn>
          <v-btn
            class="px-6"
            color="primary"
            @click="checkInServiceFromWeb(false)"
          >
            تشغيل
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
("use strict");
const xlsxParser = require("xlsx-parse-json");
export default {
  name: "CompleteFugitiveData",
  components: {
    Child1: () =>
      import("@/components/sections/admin/operations/webChilds/c1.vue"),
    Child2: () =>
      import("@/components/sections/admin/operations/webChilds/c2.vue"),
    Child3: () =>
      import("@/components/sections/admin/operations/webChilds/c3.vue"),
    Child4: () =>
      import("@/components/sections/admin/operations/webChilds/c4.vue")
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
    }
  },
  data: () => ({
    componentName: "admin_operations",
    controlOp: {
      currentOp: "",
      currentFunc: () => {},
      currentParams: [],
      pause: false,
      tryingToPause: false,
      disableOperateBtn: false,
      functions: {}
    },
    fixedIds: [],
    currentUnitId: null,
    tableFilters: {},
    checkInService: {
      model: false,
      excelFile: null,
      downloadS1: false,
      notInculdedInTheForceList: false,
      inServiceCons: []
    },
    segelatWeb: {
      militaryOperationId: 0,
      militaryOperations: [],
      units: {
        items: [],
        loading: false
      },
      excelFile: null,
      profileModel: false,
      startIn: null,
      unitId: null,
      model: false,
      from: null,
      to: new Date().toISOString().substring(0, 10),
      operation: {
        begin: false,
        done: 0,
        finish: false,
        perc: 0,
        conscriptionForces: [],
        conscriptionYear: "",
        conscripteType: "0"
      },
      conscripteTypes: [
        {
          text: "الكل",
          value: "0"
        },
        {
          text: "راتب عالي",
          value: "1"
        },
        {
          text: "مجندين",
          value: "2"
        }
      ],
      cons: {
        items: [],
        headers: [
          {
            text: "الرقم العسكري",
            value: "militaryId",
            sortable: false
          },
          {
            text: "الإسم",
            value: "fullName",
            sortable: false
          },
          {
            text: "تاريخ التجنيد",
            value: "hisConscriptionDate",
            sortable: false
          },
          {
            text: "الحالة",
            value: "webOperationStatus",
            sortable: false
          }
        ],
        search: "",
        selected: []
      }
    },
    oneUnit: {
      model: "",
      loading: false
    },
    restore_options: {
      model: false,
      done: false,
      begin: false,
      path: null,
      dbname: ""
    },
    backup_options: {
      model: false,
      done: false,
      begin: false,
      path: null,
      dbname: "",
      dbs: [
        {
          name: "المجندين والراتب العالي والمتابعة",
          id: "MilitaryRecordsDB"
        },
        {
          name: "دورة العمل",
          id: "SegelatOperationDB"
        },
        {
          name: "الإلتماسات",
          id: "RequestsSegDB"
        },
        {
          name: "البطاقات العلاجية",
          id: "TreatmentCards"
        }
      ]
    },
    file: null,
    allowChilds: true,
    stopOperationModel: false,
    stopOperationOk: false,
    operation: {
      stopIn: "",
      startIn: "",
      type: "",
      begin: false,
      perc: 0,
      done: 0,
      finish: false,
      errors: 0
    },
    additionalHeaders: [
      {
        text: "force",
        value: "force",
        sortable: false
      },
      {
        text: "done",
        value: "done",
        sortable: false
      },
      {
        text: "error",
        value: "error",
        sortable: false
      }
    ],
    numbers_done_units: 0,
    numbers_passed_units: 0,
    currentUnitListLength: 0,
    currentUnitListProgress: 0,
    // numbers_passed_conscriptes: 0,
    currentOH: null,
    operation_types_loading: false,
    noSavedOperations: ["backupDB", "update1sFromWebUnit"],
    operation_types: [
      // {
      //   text: "استكمال الدرجة وتاريخ التجنيد",
      //   value: "completeDegreeAndConscriptionDate"
      // },
      // {
      //   text: "مطابقة قوة جميع الوحدات بقاعدة البيانات",
      //   value: "compareUnitForceWithDatabase"
      // },
      // {
      //   text: "تحديث 1 س من خلال الشبكة العسكرية",
      //   value: "update1sFromWeb"
      // }
      // {
      //   text: "رفع باسوردات الكتائب من ملف",
      //   value: "pushUnitPasswordToDB"
      // }
      // {
      //   text: "متابعة 2 س من الشبكة",
      //   value: "get2sFromWeb"
      // }
    ],
    result: {
      search: "",
      items: [],
      headers: [],
      selected: []
    },
    errors: {
      search: "",
      items: [],
      headers: [
        {
          text: "المعرف",
          sortable: false,
          value: "identifier"
        },
        {
          text: "الواصف",
          sortable: false,
          value: "describer"
        },
        {
          text: "الأخطاء",
          sortable: false,
          value: "operation_errors"
        }
      ],
      selected: []
    },
    // * Military Web
    status_colors: {
      overlaped: "default",
      pending: "default",
      running: "orange grey--text text--lighten-5",
      error: "error",
      done: "success"
    },
    status_texts: {
      overlaped: "تم تجاوزه",
      pending: "منتظر",
      running: "يعمل",
      error: "خطأ",
      done: "اكتمل"
    },
    login_success: false,
    list_test: [],
    list_test_search: "",
    conscripte_results: {
      items: [],
      headers: [
        {
          text: "الرقم العسكري",
          value: "militaryId"
        },
        {
          text: "العنوان",
          value: "address"
        },
        {
          text: "units",
          value: "units"
        },
        {
          text: "promotions",
          value: "promotions"
        },
        {
          text: "penalties",
          value: "penalties"
        },
        {
          text: "ta3be2as",
          value: "ta3be2as"
        }
        // {
        //   text: "الإسم",
        //   value: "fullName"
        // },
        // {
        //   text: "الحالة",
        //   value: "status"
        // },
        // {
        //   text: "الرقم الثلاثي",
        //   value: "tripNumber"
        // },
        // {
        //   text: "الرقم القومي",
        //   value: "nationalId"
        // },
        // {
        //   text: "المؤهل",
        //   value: "qualification"
        // },
        // {
        //   text: "منطقة التجنيد",
        //   value: "area"
        // },
        // {
        //   text: "القوات",
        //   value: "force"
        // },
        // {
        //   text: "التمركز",
        //   value: "tamarkoz"
        // },
        // {
        //   text: "نوع التجنيد",
        //   value: "conscriptionType"
        // },
        // {
        //   text: "تاريخ التجنيد",
        //   value: "conscriptionDate"
        // },
        // {
        //   text: "تاريخ الميلاد",
        //   value: "birthDate"
        // },
        // {
        //   text: "التخصص",
        //   value: "specialism"
        // }
      ],
      search: "",
      selected: []
    },
    currentCons: []
  }),
  mounted() {
    this.init();
    if (this.params.id) {
      this.continueOperation(this.params.id);
    }
  },
  watch: {
    "params.id"(v) {
      //
    },
    "operation.done"(done) {
      if (done && done > 0) {
        let all = this.result.items.length;
        this.$set(this.operation, "perc", Math.floor((done * 100) / all));
      }
    },
    "segelatWeb.operation.done"(done) {
      if (done && done > 0) {
        let all = this.segelatWeb.cons.items.length;
        this.$set(
          this.segelatWeb.operation,
          "perc",
          Math.floor((done * 100) / all)
        );
      }
    },
    currentUnitListProgress(v) {
      if (!this.stopOperationOk) {
        if (v && v > 0) {
          if (this.operation.type == "update1sFromWebSegelat") {
            if (v - 1 == this.segelatWeb.cons.items.length) {
              this.showSuccess("تم تحديث جميع الـ 1 س");
              this.stopOperation(false, false, false);
            } else {
              this.$set(
                this.segelatWeb.operation,
                "done",
                Number(this.segelatWeb.operation.done) + 1
              );
              if (
                this.segelatWeb.cons.items[
                  this.segelatWeb.operation.done - 1
                ] &&
                this.segelatWeb.cons.items[this.segelatWeb.operation.done - 1]
                  .webOperationStatus == "pending"
              ) {
                this.$set(
                  this.segelatWeb.cons.items[
                    this.segelatWeb.operation.done - 1
                  ],
                  "webOperationStatus",
                  "done"
                );
              }
            }
          } else {
            this.$set(
              this.result.items[this.numbers_passed_units],
              "done",
              Number(this.result.items[this.numbers_passed_units].done) + 1
            );
            if (this.numbers_passed_units == 0) {
              //
            } else {
              // if (v !== this.currentUnitListLength) {
              //   this.$set(
              //     this.result.items[this.numbers_passed_units],
              //     "done",
              //     Number(this.result.items[this.numbers_passed_units].done) + 1
              //   );
              // }
            }
            // console.log(v);
            console.log(v);
            if (v == this.currentUnitListLength) {
              this.$set(
                this,
                "numbers_passed_units",
                this.numbers_passed_units + 1
              );
            }
          }
        }
      } else {
        this.$refs.child1.stopOperationOk = true;
      }
    },
    numbers_passed_units(v) {
      if (v && !this.stopOperationOk) {
        let { done } = this.operation;
        // let status = this.result.items[v - 1].status;
        this.$set(this.operation, "done", v);
        // if (!status || status == "running") {
        //   this.$set(this.result.items[v - 1], "status", "done");
        // }
        if (this.result.items == Number(done) + 1) {
          console.log("Now true");
          this.$set(this.operation, "finish", true);
          this.$set(this.operation, "begin", false);
          this.$set(this, "login_success", false);
          this.stopOperation(true, true);
        } else {
          this.logout(v);
          let status = this.result.items[v].status;
          let prev_status = this.result.items[v - 1].status;
          if (!status || status == "pending") {
            this.$set(this.result.items[v], "status", "running");
          }
          if (!prev_status || prev_status == "running") {
            this.$set(this.result.items[v - 1], "status", "done");
          }
          this.stopOperation(true);
        }
      }
    }
    // numbers_passed_conscriptes(v) {
    //   if (v) {
    //     let { force, done } = this.result.items[this.numbers_passed_units];
    //     this.$set(this.result.items[this.numbers_passed_units], "done", v);
    //     if (force == done + 1) {
    //       console.log("Now true");
    //       this.$set(
    //         this,
    //         "numbers_passed_units",
    //         this.numbers_passed_units + 1
    //       );
    //     } else {
    //       this.loadConscripte(
    //         this.result.items[this.numbers_passed_units].conscriptes[v]
    //       );
    //     }
    //   }
    // }
  },
  sockets: {
    gotUnitsFromWeb(x) {
      if (x.error) {
        this.$set(this, "list_test", x.error);
      }
      this.$set(this, "list_test", x.data);
      this.fixAndAddConscripte(x.data);
    },
    gotUnitsForceList(x) {
      // console.log(x , 'gotUnitsForceList');
      if (this.isStopped()) {
        return;
      }
      let { cons, error } = x;
      if (error) {
        console.log(`Error: `, error);

        // don't pass the unit
        //this.passUnit(this.numbers_passed_units);

        this.repeatCurrentOpAfter(3000);

        this.pushError({
          id: this.result.items[this.numbers_passed_units].unitText,
          type: "وحدة",
          errors: ["تعذر تحليل قوة الوحدة من النود", error]
        });
      } else {
        this.removeError({
          id: this.result.items[this.numbers_passed_units].unitText,
          type: "وحدة",
          errors: ["تعذر تحليل قوة الوحدة من النود"]
        });
        /***
         * في الاول كنا بنستخدم
         * list of miliaryIds
         * ونعمل فلترة ليهم
         *
         * دلوقتي بنستخدم
         * list of conscriptes obejcts
         * علشان ساعات مبنقدرش نوصل
         * لل1س فبقينا ناخد المعلومات الأساسية من هنا ونفلتر عليها
         * ونضيفها قبل ما نجرب ال1س
         */
        // Check for constraints
        if (this.operation.type == "update1sFromWeb") {
          if (this.operation.conscriptionYear) {
            // list = list.filter(
            //   f => f.substring(0, 4) == this.operation.conscriptionYear
            // );
            cons = cons.filter(
              con =>
                con.militaryId.substring(0, 4) ==
                this.operation.conscriptionYear
            );
          }
          if (
            this.operation.conscriptionForces &&
            Array.isArray(this.operation.conscriptionForces) &&
            this.operation.conscriptionForces.length > 0
          ) {
            // list = list.filter(f =>
            //   this.operation.conscriptionForces.includes(f.substring(6, 8))
            // );

            cons = cons.filter(con =>
              this.operation.conscriptionForces.includes(con.substring(6, 8))
            );
          }
        }

        cons = cons.map((con, index) => ({
          index,
          militaryId: con.militaryId,
          fullName: con.fullName,
          unitText: this.result.items[this.numbers_passed_units].unitText
        }));

        if (this.fixedIds && this.fixedIds.length) {
          // If there are fixed Ids that means
          // this operation is for checking which Conscriptes are in Service.
          // ! الكود دا حطيته عشان عم علاء كان عايز يجيب أرقام عسكرية معينة
          // ! الأرقام العسكرية دي هتلاقيني حاططها فوق في الداتا اسمها fixedIds

          if (this.checkInService.notInculdedInTheForceList) {
            cons = this.fixedIds.map(ele => ({ militaryId: ele }));
            this.$set(this.checkInService, "inServiceCons", [...cons]);
          } else {
            cons = cons.filter(con => {
              return this.fixedIds.includes(con.militaryId);
            });
            this.$set(this.checkInService, "inServiceCons", [
              ...this.checkInService.inServiceCons,
              ...cons
            ]);
          }

          if (!this.checkInService.downloadS1) {
            // pass the unit
            this.$set(
              this,
              "numbers_passed_units",
              Number(this.numbers_passed_units) + 1
            );
            return;
          }
        } else {
          // get only Hrs hodod
          cons = cons.filter(con => {
            let identifier =
                con.militaryId.length == 13 ? con.militaryId.slice(6, 8) : null,
              // سلاح حرس حدود
              // 66 سائق
              // كاتب
              // مشاه اجهزه قياده
              // ٨٨ ظابط احتياط
              // ١٨ سواق راتب عالي
              whiteList = ["52", "18", "66", "04", "77", "88"],
              isHodod = identifier && whiteList.includes(identifier);
            return isHodod;
          });
        }

        // fix index
        cons = cons.map((con, index) => ({
          ...con,
          index: index + 1
        }));
        // save it for later if one of conscriptes
        this.currentCons = cons;
        console.log(this.currentCons);
        // now generate list militaryIds
        let list = cons.map(con => con.militaryId);

        this.$set(
          this.result.items[this.numbers_passed_units],
          "force",
          list.length
        );
        // Node Here
        // let childCount = 2,
        //   halfs = Math.floor(list.length / childCount);

        this.$refs.child1.setNewForceList(list);
        // this.$refs.child1.setNewForceList(list.slice(0, halfs));
        // console.log(list.slice(0, halfs));
        // this.$refs.child2.setNewForceList(list.slice(halfs, halfs * 2));
        // console.log(list.slice(halfs, halfs * 2));
        // this.$refs.child3.setNewForceList(list.slice(halfs * 2, halfs * 3));
        // console.log(list.slice(halfs * 2, halfs * 3));
        // this.$refs.child4.setNewForceList(list.slice(halfs, list.length));
        // console.log(list.slice(halfs * 3, list.length));
        this.$set(this, "currentUnitListLength", list.length);
        this.$set(this, "currentUnitListProgress", 0);
        // this.$set(
        //   this.result.items[this.numbers_passed_units],
        //   "forceList",
        //   list
        // );
        this.$set(this.result.items[this.numbers_passed_units], "done", 0);
        this.$set(this.result.items[this.numbers_passed_units], "error", 0);
        // this.loadDoc(0);
        // this.loadDoc(1);
        this.$nextTick(() => {
          let intVal = setInterval(() => {
            this.$nextTick(() => {
              x.list = null;
            });
            clearInterval(intVal);
          }, 2000);
        });
      }
    },
    async gotMyIdData(x) {
      let { data, id, error } = x;
      if (error) {
        this.$set(this, "list_test", error);
      } else {
        data.militaryId = id;
        // let date = await this.api("server/get-time");
        // console.log(date.data);
        this.$refs.child1.fixAndAddConscripte(data);
        // this.$set(this, "list_test", data);
      }
    }
  },
  methods: {
    async restoreDB(saveDB = false) {
      if (saveDB) {
        let { path, dbname } = this.restore_options;
        if (!path || !dbname) {
          this.showError("من فضلك قم بتحديد الملف وقاعدة البيانات المطلوبة.");
        } else {
          this.$set(this.restore_options, "done", false);
          this.$set(this.restore_options, "begin", true);
          let backup = await this.api("server/db-backup", {
            path: path,
            dbname
          });
          this.$set(this.restore_options, "begin", false);
          this.$set(this.restore_options, "done", true);
        }
      } else {
        this.$set(this.restore_options, "done", false);
        this.$set(this.restore_options, "begin", false);
        this.$set(this.restore_options, "model", true);
      }
    },
    async backupDB(saveDB = false) {
      if (saveDB) {
        let { path, dbname } = this.backup_options;
        if (!path || !dbname) {
          this.showError("من فضلك قم بتحديد المسار وقاعدة البيانات المطلوبة.");
        } else {
          this.$set(this.backup_options, "done", false);
          this.$set(this.backup_options, "begin", true);
          let backup = await this.api("server/db-backup", {
            path: path,
            dbname
          });
          this.$set(this.backup_options, "begin", false);
          this.$set(this.backup_options, "done", true);
        }
      } else {
        this.$set(this.backup_options, "done", false);
        this.$set(this.backup_options, "begin", false);
        this.$set(this.backup_options, "model", true);
      }
    },
    async continueOperation(id) {
      let operation = await this.api("global/get_one", {
        table: "webOperationHistories",
        where: {
          id,
          endAt: {
            $is: null
          }
        },
        include: [
          {
            model: "webOperations"
          },
          {
            model: "webOperationErrors"
          }
        ],
        returnObject: true
      });
      if (operation && operation.ok && operation.data && operation.data.id) {
        let startIn = Number(operation.data.stopIn);
        if (operation.data.webOperation.method == "update1sFromWebSegelat") {
          this.$set(this.segelatWeb, "from", operation.data.rangeStart);
          this.$set(this.segelatWeb, "to", operation.data.rangeEnd);
          this.$set(this.segelatWeb, "startIn", startIn);
          this.$set(this.segelatWeb, "unitId", operation.data.unitId);
        }
        this.$set(this.operation, "type", operation.data.webOperation.method);
        this.$set(this.operation, "startIn", startIn);

        this.setOperationErrors(operation.data.webOperationErrors);

        this.runOperation(
          operation.data.webOperation.method,
          true,
          id,
          startIn
        );
      } else {
        this.showError("عذراً, لا توجد عملية غير منتهية بهذا الإسم.");
      }
    },
    setOperationErrors(operationErrors) {
      for (let i = 0; i < operationErrors.length; i++) {
        operationErrors[i].operation_errors = operationErrors[i].errors.split(
          " --||-- "
        );
      }
      this.$set(this.errors, "items", operationErrors);
    },
    async init() {
      this.addFunctionsToControl();
      // Get Operation Types
      this.$set(this, "operation_types_loading", true);
      let types = await this.api("global/get_all", {
        table: "webOperations"
      });
      if (types && types.data && types.ok) {
        this.$set(this, "operation_types", types.data);
      }
      this.$set(this, "operation_types_loading", false);
    },
    addFunctionsToControl() {
      this.$set(this.controlOp.functions, "setCurrentOp", this.setCurrentOp);
      this.$set(this.controlOp.functions, "isStopped", this.isStopped);
      this.$set(
        this.controlOp.functions,
        "repeatCurrentOpAfter",
        this.repeatCurrentOpAfter
      );
    },
    async pushUnitPasswordToDB() {
      let units = this.result.items;
      // await this.api("global/create_one", {
      //   table: "webUnitsPasswords",
      //   where: {
      //     id: 3,
      //     unitText: units[0].unitText,
      //     username: units[0].username,
      //     password: units[0].password
      //   }
      // });
      units.forEach(async (unit, i) => {
        await this.api("global/create_one", {
          table: "webUnitsPasswords",
          where: {
            id: i + 1,
            unitText: unit.unitText,
            username: unit.username,
            password: unit.password
          }
        });
        console.log(i + 1);
      });
    },
    async pushError(obj = {}) {
      // ignore errors when search in all units with spefic ids
      if (obj.type === "فرد") return null;

      let identifier = obj.id,
        describer = obj.type,
        operation_errors = obj.errors,
        segelatWeb = obj.segelatWeb ? true : false;
      if (segelatWeb) {
        // let index = this.segelatWeb.cons.items.findIndex(
        //   i => i.militaryId == identifier
        // );
        // this.$set(
        //   this.segelatWeb.cons.items[index],
        //   "webOperationStatus",
        //   "error"
        // );
        // this.$set(
        //   this.segelatWeb.operation,
        //   "done",
        //   Number(this.segelatWeb.operation.done) + 1
        // );
        this.$set(
          this.segelatWeb.cons.items[this.currentUnitListProgress],
          "webOperationStatus",
          "error"
        );
      } else {
        this.$set(
          this.result.items[this.numbers_passed_units],
          "error",
          this.result.items[this.numbers_passed_units].error + 1
        );
      }
      if (this.currentOH) {
        let error = {
            identifier,
            describer,
            errors: operation_errors.join(" --||-- "),
            recordedAt: new Date(),
            webOperationId: this.operation_types.filter(
              c => c.method == this.operation.type
            )[0].id,
            webOperationHistoryId: this.currentOH.id
          },
          addErrors = await this.api("global/create_one", {
            table: "webOperationErrors",
            where: error
          });
      }
      // this.$set(this.operation, "errors", this.operation.errors + 1);
      // console.log(this.operation.errors);
      this.$set(this.errors.items, this.errors.items.length, {
        identifier,
        describer,
        operation_errors
      });
      // console.log(this.errors.items);
    },
    async removeError(obj = { id: null, type: null, errors: [] }) {
      let errors = this.errors.items,
        oHId = this.currentOH.id,
        isExists = false,
        // for backward iterate
        index = errors.length - 1;

      // front end uses operation_errors but in DB uses errors !!
      let errorToRemove = {
        identifier: obj.id,
        describer: obj.type,
        errors: obj.errors,
        operation_errors: obj.errors
      };

      // delete in front end
      while (index >= 0) {
        if (
          (errors[index].identifier == errorToRemove.identifier ||
            !errorToRemove.identifier) &&
          errors[index].describer == errorToRemove.describer &&
          (!errorToRemove.operation_errors?.length ||
            errorToRemove.operation_errors.includes(
              errors[index].operation_errors[0]
            ))
        ) {
          console.log(`تم حذف ال ${errorToRemove.identifier} من front end`);
          errors.splice(index, 1);
          isExists = true;
        }
        index -= 1;
      }

      // delete in DB
      if (isExists) {
        // delete without operationErrors
        let whereErrors = {};
        if (errorToRemove.errors?.length == 1) {
          whereErrors = { errors: { $like: `${errorToRemove.errors[0]}%` } };
        } else if (errorToRemove.errors?.length > 1) {
          whereErrors = { errors: { $or: [] } };
          errorToRemove.errors.forEach(error => {
            whereErrors.errors.$or.push({ $like: `%${error}%` });
          });
        }
        await this.api("global/delete_all", {
          table: "webOperationErrors",
          where: {
            webOperationHistoryId: oHId,
            ...(errorToRemove.identifier
              ? { identifier: errorToRemove.identifier }
              : {}),
            describer: errorToRemove.describer,
            ...whereErrors
          }
        })
          .then(x => {
            console.log(`تم حذف ال ${errorToRemove.identifier} من back end`);
          })
          .catch(err => {
            console.log(err);
            this.showError("لم يتم حذف الأخطاء من قاعدة البيانات");
          });
      }
    },
    // getValues(table, where = {}) {
    //   return this.api("global/get_all", {
    //     table,
    //     where
    //   })
    //     .then(x => {
    //       return x.data;
    //     })
    //     .catch(err => {
    //       console.log("getValues Error:");
    //       console.log(err);
    //       // this.showError(err);
    //       return null;
    //     });
    // },
    // getOneValue(table, where = {}) {
    //   return this.api("global/get_one", {
    //     table,
    //     where
    //   })
    //     .then(x => {
    //       return x.data;
    //     })
    //     .catch(err => {
    //       if (err.data) {
    //         console.log("getOneValue Error:");
    //         console.log(err);
    //         // this.showError(err);
    //       }
    //       return null;
    //     });
    // },
    // setOneValue(table, where = {}, returner = "id") {
    //   return this.api("global/create_one", {
    //     table,
    //     where,
    //     returner
    //   })
    //     .then(x => {
    //       return x.data;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       // this.showError(err);
    //       return null;
    //     });
    // },
    // setValues(table, wheres = [], nodes = [], dates = [], returner = "id") {
    //   wheres.forEach(async (where, i) => {
    //     dates.forEach(date => {
    //       where[date] = this.dateIfExists(where[date]);
    //     });
    //     where = await this.fixBeforeSet(where, nodes);
    //     await this.setOneValue(table, where, returner);
    //     // let intVal = setInterval(async () => {
    //     //   clearInterval(intVal);
    //     // }, 2000);
    //   });
    //   return true;
    // },
    // fixBeforeSet(where, nodes) {
    //   return new Promise((success, failure) => {
    //     if (nodes.length > 0) {
    //       let counter = 0;
    //       nodes.forEach(async node => {
    //         where[node.dbKey] = await this.getMyValue(
    //           where[node.key],
    //           node.table
    //         );
    //         counter++;
    //         if (counter == nodes.length) {
    //           success(where);
    //         }
    //       });
    //     } else {
    //       success(where);
    //     }
    //   });
    // },
    // getMyValue(
    //   val,
    //   table,
    //   id = "id",
    //   dbKey = "displayedText",
    //   link = {
    //     val: "",
    //     table: "",
    //     id: "id",
    //     key: "typeId",
    //     dbKey: "displayedText"
    //   }
    // ) {
    //   return new Promise((success, failure) => {
    //     return !val
    //       ? success(null)
    //       : this.getOneValue(table, {
    //           [dbKey]: val
    //         })
    //           .then(x => {
    //             if (x && x[id]) {
    //               return success(x[id]);
    //             } else {
    //               if (
    //                 link.table &&
    //                 link.id &&
    //                 link.val &&
    //                 link.val.length > 0
    //               ) {
    //                 let setter = {
    //                   [dbKey]: val
    //                 };
    //                 this.getOneValue(link.table, {
    //                   [link.dbKey]: link.val
    //                 }).then(async linkx => {
    //                   if (linkx && linkx[link.id]) {
    //                     setter[link.key] = linkx[link.id];
    //                     return this.setOneValue(table, setter)
    //                       .then(xx => {
    //                         success(xx);
    //                       })
    //                       .catch(error => {
    //                         failure(error);
    //                       });
    //                   } else {
    //                     setter[link.key] = await this.setOneValue(link.table, {
    //                       [link.dbKey]: link.val
    //                     });
    //                     return this.setOneValue(table, setter)
    //                       .then(xx => {
    //                         success(xx);
    //                       })
    //                       .catch(error => {
    //                         failure(error);
    //                       });
    //                   }
    //                 });
    //               } else {
    //                 return this.setOneValue(table, {
    //                   [dbKey]: val
    //                 })
    //                   .then(xx => {
    //                     success(xx);
    //                   })
    //                   .catch(error => {
    //                     failure(error);
    //                   });
    //               }
    //             }
    //           })
    //           .catch(err => {
    //             failure(err);
    //           });
    //   });
    // },
    // async getMyObjectValue(obj = {}, table = "", uniqueKey = "id") {
    //   return new Promise((success, failure) => {
    //     return this.getOneValue(table, obj)
    //       .then(x => {
    //         if (x && x[uniqueKey]) {
    //           success(x[uniqueKey]);
    //         } else {
    //           if (
    //             Object.values(obj).filter(v => v && v.length > 0).length == 0
    //           ) {
    //             return success(null);
    //           } else {
    //             obj.createdAt = new Date();
    //             return this.setOneValue(table, obj)
    //               .then(xx => {
    //                 success(xx);
    //               })
    //               .catch(error => {
    //                 failure(error);
    //               });
    //           }
    //         }
    //       })
    //       .catch(err => {
    //         failure(err);
    //       });
    //   });
    // },
    // deleteMyValues(table, where) {
    //   return new Promise((success, failure) => {
    //     return this.api("global/delete_all", {
    //       table,
    //       where
    //     })
    //       .then(x => {
    //         success(x.data);
    //       })
    //       .catch(err => {
    //         failure(err.data);
    //       });
    //   });
    // },
    // dateIfExists(str) {
    //   if (str && str.length > 0) {
    //     return new Date(str);
    //   }
    //   return null;
    // },
    // checkOrAddConscripte(militaryId) {
    //   return new Promise((success, failure) => {
    //     return this.api("global/get_one", {
    //       table: "conscriptes",
    //       where: {
    //         militaryId
    //       },
    //       attrs: ["militaryId"]
    //     })
    //       .then(x => {
    //         //
    //         if (x.data && x.data.militaryId) {
    //           success({
    //             created: false,
    //             found: true
    //           });
    //         } else {
    //           this.api("global/create_one", {
    //             table: "conscriptes",
    //             where: {
    //               militaryId
    //             }
    //           })
    //             .then(x => {
    //               // Ok
    //               success({
    //                 created: true,
    //                 found: true
    //               });
    //             })
    //             .catch(err => {
    //               failure(err);
    //             });
    //         }
    //       })
    //       .catch(err => {
    //         this.api("global/create_one", {
    //           table: "conscriptes",
    //           where: {
    //             militaryId
    //           }
    //         })
    //           .then(x => {
    //             // Ok
    //             success({
    //               created: true,
    //               found: false
    //             });
    //           })
    //           .catch(err => {
    //             failure(err);
    //           });
    //       });
    //   });
    // },
    // async fixAndAddConscripte(conscripte) {
    //   let fixedConscripte = {};
    //   this.checkOrAddConscripte(conscripte.militaryId)
    //     .then(x => {
    //       fixedConscripte.isNew = x.created;
    //       Object.keys(conscripte).forEach(async key => {
    //         if (
    //           conscripte[key] &&
    //           (((typeof conscripte[key] == "string" ||
    //             Array.isArray(conscripte[key])) &&
    //             conscripte[key].length > 0) ||
    //             typeof conscripte[key] == "object")
    //         )
    //           switch (key) {
    //             case "militaryId":
    //               fixedConscripte.militaryId = conscripte[key];
    //               break;
    //             case "tripartiteNumber":
    //               fixedConscripte.tripartiteNumber = conscripte[key];
    //               break;
    //             case "area":
    //               fixedConscripte.webAreaId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webMobilizationAreas"
    //               );
    //               break;
    //             case "powers":
    //               fixedConscripte.webPowerId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webPowers"
    //               );
    //               break;
    //             case "additionalYear":
    //               fixedConscripte.webAdditionalYearId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webAdditionalYears"
    //               );
    //               break;
    //             case "zone":
    //               fixedConscripte.webZoneId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webZones"
    //               );
    //               break;
    //             case "dutyState":
    //               fixedConscripte.webDutyStateId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webDutyStates"
    //               );
    //               break;
    //             case "fullName":
    //               fixedConscripte.fullName = conscripte[key];
    //               break;
    //             case "qualification":
    //               fixedConscripte.webQualificationId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webQualifications"
    //               );
    //               break;
    //             case "jobInArmy":
    //               fixedConscripte.webJobInArmy = await this.getMyValue(
    //                 conscripte[key],
    //                 "webJobInArmies"
    //               );
    //               break;
    //             case "force":
    //               fixedConscripte.webForceId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webForces"
    //               );
    //               break;
    //             case "webConscriptionDate":
    //               fixedConscripte.webConscriptionDate = this.dateIfExists(
    //                 conscripte[key]
    //               );
    //               break;
    //             case "licences":
    //               await this.deleteMyValues("webLicences", {
    //                 militaryId: conscripte.militaryId
    //               });
    //               await this.setValues(
    //                 "webLicences",
    //                 conscripte[key],
    //                 [
    //                   {
    //                     key: "type",
    //                     dbKey: "typeId",
    //                     table: "webLicenceTypes"
    //                   }
    //                 ],
    //                 ["date"]
    //               );
    //               break;
    //             case "reductionState":
    //               fixedConscripte.webReductionStateId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webReductionStates"
    //               );
    //               break;
    //             case "webLastComsionDate":
    //               fixedConscripte.webLastComsionDate = this.dateIfExists(
    //                 conscripte[key]
    //               );
    //               break;
    //             case "medicalLevel":
    //               fixedConscripte.webMedicalLevelId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webMedicalLevels"
    //               );
    //               break;
    //             case "caltureLevel":
    //               fixedConscripte.webCaltureLevelId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webCaltureLevels"
    //               );
    //               break;
    //             case "ta3be2as":
    //               await this.deleteMyValues("webTa3Be2A", {
    //                 militaryId: conscripte.militaryId
    //               });
    //               await this.setValues(
    //                 "webTa3Be2A",
    //                 conscripte[key],
    //                 [
    //                   {
    //                     key: "type",
    //                     dbKey: "typeId",
    //                     table: "webTa3Be2AType"
    //                   }
    //                 ],
    //                 ["date"]
    //               );
    //               break;
    //             case "civilQualification":
    //               fixedConscripte.webCivilQualificationId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webCivilQualifications",
    //                 "id",
    //                 "displayedText",
    //                 {
    //                   val: conscripte.civilQualificationGroup,
    //                   table: "webCivilQualificationGroups",
    //                   id: "id",
    //                   key: "groupId",
    //                   dbKey: "displayedText"
    //                 }
    //               );
    //               break;
    //             case "religion":
    //               fixedConscripte.webReligionId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webReligions"
    //               );
    //               break;
    //             case "bloodType":
    //               fixedConscripte.webBloodTypeId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webBloodTypes"
    //               );
    //               break;
    //             case "maritalStatus":
    //               fixedConscripte.webMaritalStatusId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webMaritalStatus"
    //               );
    //               break;
    //             case "birthDate":
    //               fixedConscripte.birthDate = this.dateIfExists(
    //                 conscripte[key]
    //               );
    //               break;
    //             case "jobBeforeConscription":
    //               fixedConscripte.webJobBeforeConscriptionId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webJobBeforeConscriptions"
    //               );
    //               break;
    //             case "phone":
    //               fixedConscripte.phone = conscripte[key];
    //               break;
    //             case "governorateBirthSide":
    //               fixedConscripte.webGovernorateBirthSideId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webGovernorates"
    //               );
    //               break;
    //             case "qesm":
    //               fixedConscripte.webQesmId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webQesms",
    //                 "id",
    //                 "displayedText",
    //                 {
    //                   val:
    //                     conscripte.governorateBirthSide ||
    //                     conscripte.governorateNationalCardSide,
    //                   table: "webGovernorates",
    //                   id: "id",
    //                   key: "webGovernorateId",
    //                   dbKey: "displayedText"
    //                 }
    //               );
    //               break;
    //             case "region":
    //               fixedConscripte.webRegionId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webRegions"
    //               );
    //               break;
    //             case "governorateNationalCardSide":
    //               fixedConscripte.webGovernorateNationalCardSideId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webGovernorates"
    //               );
    //               break;
    //             case "segelMadany":
    //               fixedConscripte.webSegelMadanyId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webSegelMadanies",
    //                 "id",
    //                 "displayedText",
    //                 {
    //                   val:
    //                     conscripte.governorateBirthSide ||
    //                     conscripte.governorateNationalCardSide,
    //                   table: "webGovernorates",
    //                   id: "id",
    //                   key: "webGovernorateId",
    //                   dbKey: "displayedText"
    //                 }
    //               );
    //               break;
    //             case "nationalId":
    //               fixedConscripte.nationalId = conscripte[key];
    //               break;
    //             case "address":
    //               fixedConscripte.address = conscripte[key];
    //               break;
    //             case "mostRelivant":
    //               fixedConscripte.webMostRelivantId = await this.getMyObjectValue(
    //                 conscripte[key],
    //                 "webMostRelivants"
    //               );
    //               break;
    //             case "promotions":
    //               await this.deleteMyValues("webPromotions", {
    //                 militaryId: conscripte.militaryId
    //               });
    //               await this.setValues(
    //                 "webPromotions",
    //                 conscripte[key],
    //                 [
    //                   {
    //                     key: "type",
    //                     dbKey: "typeId",
    //                     table: "webPromotionTypes"
    //                   },
    //                   {
    //                     key: "degree",
    //                     dbKey: "degreeId",
    //                     table: "webDegrees"
    //                   }
    //                 ],
    //                 ["date"]
    //               );
    //               break;
    //             case "currentUnitLeader":
    //               // Check if has a degree
    //               let degreeId = await this.getMyValue(
    //                   conscripte[key].degree,
    //                   "webDegrees"
    //                 ),
    //                 leaderId = await this.getMyObjectValue(
    //                   {
    //                     name: conscripte[key].name,
    //                     degreeId
    //                   },
    //                   "webUnitLeaders"
    //                 ),
    //                 units = [];
    //               conscripte.units.forEach(async (unit, i) => {
    //                 let unitObject = {};
    //                 unitObject.id = await this.getMyObjectValue(
    //                   {
    //                     displayedText: unit,
    //                     ta3Be2A: 0
    //                   },
    //                   "webUnits"
    //                 );
    //                 if (i == conscripte.units.length - 1) {
    //                   unitObject.webZoneId = fixedConscripte.webZoneId;
    //                   unitObject.leaderId = leaderId;
    //                   fixedConscripte.webUnitId = unitObject.id;
    //                 }
    //                 let updateUnit = await this.api("global/update_one", {
    //                   table: "webUnits",
    //                   where: {
    //                     id: unitObject.id
    //                   },
    //                   update: unitObject
    //                 });
    //                 let conscripteUnitId = await this.getMyObjectValue(
    //                   {
    //                     militaryId: conscripte.militaryId,
    //                     webUnitId: unitObject.id
    //                   },
    //                   "webConscripteUnits"
    //                 );
    //               });
    //               break;
    //             case "webDemobilizationDate":
    //               fixedConscripte.webDemobilizationDate = this.dateIfExists(
    //                 conscripte[key]
    //               );
    //               break;
    //             case "webServicePeriod":
    //               fixedConscripte.webServicePeriod = conscripte[key];
    //               break;
    //             case "webLostPeriod":
    //               fixedConscripte.webLostPeriod = conscripte[key];
    //               break;
    //             case "webClearServicePeriod":
    //               fixedConscripte.webClearServicePeriod = conscripte[key];
    //               break;
    //             case "webMoralsDegree":
    //               fixedConscripte.webMoralsDegreeId = await this.getMyValue(
    //                 conscripte[key],
    //                 "webMoralsDegrees"
    //               );
    //               break;
    //             case "penalities":
    //               await this.deleteMyValues("webPenalities", {
    //                 militaryId: conscripte.militaryId
    //               });
    //               await this.setValues(
    //                 "webPenalities",
    //                 conscripte[key],
    //                 [
    //                   {
    //                     key: "orderer",
    //                     dbKey: "ordererId",
    //                     table: "webPenalityOrderers"
    //                   },
    //                   {
    //                     key: "kind",
    //                     dbKey: "kindId",
    //                     table: "webPenalityKinds"
    //                   },
    //                   {
    //                     key: "type",
    //                     dbKey: "typeId",
    //                     table: "webPenalityTypes"
    //                   },
    //                   {
    //                     key: "courtPlace",
    //                     dbKey: "courtPlaceId",
    //                     table: "webCourtPlaces"
    //                   }
    //                 ],
    //                 [
    //                   "date",
    //                   "crimeFromDate",
    //                   "crimeToDate",
    //                   "orderDate",
    //                   "fromDate",
    //                   "toDate",
    //                   "courtDate"
    //                 ]
    //               );
    //               break;
    //             case "webNotes":
    //               let notes = this.api("global/get_one", {
    //                 table: "conscriptes",
    //                 where: {
    //                   militaryId: conscripte.militaryId
    //                 },
    //                 attrs: ["notes"]
    //               })
    //                 .then(x => {
    //                   fixedConscripte.notes =
    //                     x.data && x.data.notes ? x.data.notes : "";
    //                   conscripte[key].forEach(note => {
    //                     let hasWebNotes =
    //                       x.data && x.data.notes && x.data.notes.includes(note);
    //                     if (!hasWebNotes) {
    //                       fixedConscripte.notes += " - " + note;
    //                     }
    //                   });
    //                 })
    //                 .catch(err => {
    //                   fixedConscripte.notes = conscripte[key].join(" - ");
    //                   console.log(err);
    //                 });
    //               break;
    //           }
    //       });
    //       let intVal = setInterval(async () => {
    //         fixedConscripte.isWeb = true;
    //         let conExists = await this.api("global/get_one", {
    //           table: "conscriptes",
    //           where: {
    //             militaryId: fixedConscripte.militaryId
    //           },
    //           attrs: ["militaryId"]
    //         });
    //         if (conExists && conExists.data && conExists.data.militaryId) {
    //           // Exists - Just update it
    //           this.api("global/update_one", {
    //             table: "conscriptes",
    //             where: {
    //               militaryId: fixedConscripte.militaryId
    //             },
    //             update: fixedConscripte
    //           })
    //             .then(x => {
    //               // Ok
    //             })
    //             .catch(err => {
    //               this.pushError(
    //                 fixedConscripte.militaryId,
    //                 "فرد " + conscripte.isSoldier ? "جندي" : "ضابط صف",
    //                 ["لم يتم تحديثه بقاعدة البيانات", err.data]
    //               );
    //             });
    //         } else {
    //           // Create it
    //           this.api("global/create_one", {
    //             table: "conscriptes",
    //             where: fixedConscripte
    //           })
    //             .then(x => {
    //               // Ok
    //             })
    //             .catch(err => {
    //               this.pushError(
    //                 fixedConscripte.militaryId,
    //                 "فرد " + conscripte.isSoldier ? "جندي" : "ضابط صف",
    //                 ["لم تتم إضافته بقاعدة البيانات", err.data]
    //               );
    //             });
    //           // console.log(create);
    //         }
    //         clearInterval(intVal);
    //       }, 2000);
    //     })
    //     .catch(error => {
    //       this.pushError(
    //         fixedConscripte.militaryId,
    //         "فرد " + conscripte.isSoldier ? "جندي" : "ضابط صف",
    //         ["لم تتم إضافته بقاعدة البيانات", err.data]
    //       );
    //     });
    // },
    async getUnitsFromWeb() {
      // let arr = [
      //   {
      //     s: 10
      //   },
      //   {
      //     s: 12
      //   },
      //   {
      //     s: 15
      //   }
      // ];
      // this.$set(
      //   this,
      //   "list_test",
      //   arr.findIndex(f => f.s == 12)
      // );
      // 129
      this.$socket.client.emit("getUnitsFromWeb");
      // let con = await this.api("global/get_one", {
      //   table: "webTa3be2as"
      // });
      // let cons = {};
      // con.data.forEach(c => {
      //   cons[c.militaryId] = cons[c.militaryId] ? cons[c.militaryId] : 0;
      //   cons[c.militaryId] += 1;
      // });
      // this.$set(this, "list_test", con.data);
      // let str = "الصناعات المعمارية)البياض(",
      //   hasGroup = str.includes("(") && str.includes(")"),
      //   group = hasGroup ? str.substring(0, str.lastIndexOf(")")).trim() : str,
      //   qualification = hasGroup
      //     ? str.substring(str.lastIndexOf(")") + 1, str.length - 1).trim()
      //     : "",
      //   obj = {
      //     qualification,
      //     group
      //   };
      // this.$set(this, "list_test", obj);
    },
    // async getMyIdData(blob, id) {
    //   blob
    //     .arrayBuffer()
    //     .then(buffer => {
    //       this.$socket.client.emit("getMyIdData", {
    //         buffer,
    //         id
    //       });
    //       this.$nextTick(() => {
    //         let intVal = setInterval(() => {
    //           this.$nextTick(() => {
    //             buffer = null;
    //             blob = null;
    //           });
    //           clearInterval(intVal);
    //         }, 2000);
    //       });
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       this.pushError(id, "", ["تعذر تحليل ملفه من الفيو", err]);
    //     });
    // },
    // passConscripte(id) {
    //   this.$set(
    //     this.result.items[this.numbers_passed_units],
    //     "error",
    //     Number(this.result.items[this.numbers_passed_units].error) + 1
    //   );
    //   this.$set(this.operation, "errors", Number(this.operation.errors) + 1);
    //   this.$set(
    //     this.result.items[this.numbers_passed_units],
    //     "done",
    //     Number(this.result.items[this.numbers_passed_units].done) + 1
    //   );
    //   //  ||
    //   //   this.result.items[this.numbers_passed_units].done >
    //   //     this.result.items[this.numbers_passed_units].force ||
    //   //   this.result.items[this.numbers_passed_units].done + 1 ==
    //   //     this.result.items[this.numbers_passed_units].force
    //   // if (
    //   //   this.result.items[this.numbers_passed_units].done ==
    //   //   this.result.items[this.numbers_passed_units].force
    //   // ) {
    //   // Go further with units
    //   // if (
    //   //   this.result.items[this.numbers_passed_units].done ==
    //   //   this.result.items[this.numbers_passed_units].force
    //   // ) {
    //   // console.log("=");
    //   // this.$set(this, "numbers_passed_units", this.numbers_passed_units + 1);
    //   // }
    //   // } else {
    //   // Go further with conscripte in the same unit
    //   this.loadDoc(
    //     Number(this.result.items[this.numbers_passed_units].done) + 1
    //   );
    //   // }
    //   console.log("There was error parsing id: " + id);
    // },
    // loadDoc(index) {
    //   let xhttp = new XMLHttpRequest(),
    //     that = this,
    //     length = this.result.items[this.numbers_passed_units].forceList
    //       ? this.result.items[this.numbers_passed_units].forceList.length
    //       : null,
    //     id =
    //       this.result.items[this.numbers_passed_units] &&
    //       this.result.items[this.numbers_passed_units].forceList
    //         ? this.result.items[this.numbers_passed_units].forceList[index]
    //         : null;
    //   if (length == null || length == 0) {
    //     // Do Nothing
    //     console.log("Length === null");
    //     console.log(this.result.items[this.numbers_passed_units].unitText);
    //   } else {
    //     console.log(index >= length);
    //     console.log(!id ? true : false);
    //     console.log(
    //       Number(this.result.items[this.numbers_passed_units].done) >
    //         Number(this.result.items[this.numbers_passed_units].force) - 1
    //     );
    //     // محمد عبدالكريم عبدالرحمن
    //     if (
    //       index > length &&
    //       !id &&
    //       Number(this.result.items[this.numbers_passed_units].done) >
    //         Number(this.result.items[this.numbers_passed_units].force) - 1
    //     ) {
    //       console.log("Passing Unit");
    //       this.$set(
    //         this,
    //         "numbers_passed_units",
    //         Number(this.numbers_passed_units) + 1
    //       );
    //     } else {
    //       xhttp.responseType = "blob";
    //       xhttp.onreadystatechange = function() {
    //         if (this.readyState == 4 && this.status == 200) {
    //           that.getMyIdData(this.response, id);
    //           that.$nextTick(() => {
    //             let intVal = setInterval(() => {
    //               that.$nextTick(() => {
    //                 xhttp = null;
    //               });
    //               clearInterval(intVal);
    //             }, 2000);
    //           });
    //         }
    //       };
    //       xhttp.onerror = function(error) {
    //         console.log("Error");
    //         console.log(error);
    //         that.showError("تعذر الإتصال بالشبكة العسكرية");
    //         that.passConscripte(id);
    //         that.pushError(id, "", ["الشبكة العسكرية هنجت هنا", error]);
    //       };
    //       xhttp.ontimeout = function(error) {
    //         console.log("Timeout");
    //         console.log(error);
    //         that.showError(
    //           "تعذر الإتصال بالشبكة العسكرية, الرجاء التأكد من وجود ربط بالشبكة العسكرية."
    //         );
    //         that.passConscripte(id);
    //         that.pushError(id, "", ["غالباً الشبكة العسكرية فصلت", error]);
    //       };
    //       xhttp.open(
    //         "post",
    //         "http://1.33.1.150/segelat/OneSeenDocument/OneSeenData",
    //         true
    //       );
    //       xhttp.setRequestHeader(
    //         "Content-type",
    //         "application/x-www-form-urlencoded"
    //       );
    //       xhttp.send("milNo=" + id);
    //     }
    //   }
    // },
    async getUnitsForceList(blob, unit, index) {
      console.log("Getting Force List...");
      /*this.setCurrentOp(
        "تحضير قائمة بالجنود بالوحدة",
        this.getUnitsForceList,
        arguments
      );*/
      if (this.isStopped()) {
        console.log("توقفت العملية");
        return;
      }
      blob
        .arrayBuffer()
        .then(buffer => {
          this.$socket.client.emit("getUnitsForceList", {
            buffer
          });
          console.log("Sending Buffer...");
        })
        .catch(err => {
          console.log(err);
          this.passUnit(index);
          this.pushError({
            id: "unit",
            type: "وحدة",
            errors: ["تعذر تحليل قوة الوحدة من الفيو", err]
          });
        });
    },
    getUnitsForces(startIn = null) {
      console.log("getUnitsForces");
      let { items } = this.result;
      if (items.length > 0) {
        if (startIn && startIn > 0) {
          for (let i = 0; i < startIn; i++) {
            this.$set(this.result.items[i], "status", "overlaped");
          }
        } else {
          // if (!startIn) {
          this.getToken(0);
          // }
        }
      }
    },
    segelatWebLoad() {
      let startIn = this.segelatWeb.startIn,
        list = this.segelatWeb.cons.items.map(i => i.militaryId),
        newList = [...new Set(list)];
      if (startIn && startIn > 0) {
        console.log("Has StartIn : " + startIn);
        newList = newList.slice(startIn, list.length);
      }
      this.$refs.child1.setNewForceList(newList, true);
      this.$set(this.segelatWeb.operation, "done", startIn ? startIn : 0);
      this.$set(this, "currentUnitListLength", list.length);
      this.$set(this, "currentUnitListProgress", startIn ? startIn : 0);
      this.$nextTick(() => {
        let intVal = setInterval(() => {
          this.$nextTick(() => {
            list = null;
            newList = null;
          });
          clearInterval(intVal);
        }, 2000);
      });
    },
    loadUnit(index) {
      console.log("Loading Unit...");
      this.setCurrentOp("تحميل قوة الوحدة", this.loadUnit, arguments);
      if (this.isStopped()) {
        return;
      }
      let unit = this.result.items[index];
      // console.log("loading Unit: " + unit.uniText);
      let xhttp = new XMLHttpRequest(),
        that = this,
        typeId = this.segelatWeb.operation.conscripteType;
      xhttp.responseType = "blob";
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          that.removeError({
            id: unit,
            type: "وحدة",
            errors: ["تعذر تحميل قوة الوحدة", "الشبكة العسكرية فصلت"]
          });

          console.log("Unit Loaded");
          that.setCurrentOp(
            "تحضير قائمة بالأرقام العسكرية",
            that.loadUnit,
            arguments
          );
          that.getUnitsForceList(this.response, unit, index);
        }
      };
      xhttp.onerror = function(error) {
        console.log("Error");
        console.log(error);
        //that.passUnit(index);
        that.repeatCurrentOpAfter(3000);
        // that.showError(
        //   "تعذر تحميل قوة الوحدة: " + that.result.items[index].unitText
        // );
        that.pushError({
          id: unit,
          type: "وحدة",
          errors: ["تعذر تحميل قوة الوحدة", error]
        });
      };
      xhttp.ontimeout = function(error) {
        console.log("Timeout");
        console.log(error);
        that.resendUnit();
        //that.passUnit(index);
        // that.showError(
        //   "تعذر الإتصال بالشبكة العسكرية, الرجاء التأكد من وجود ربط بالشبكة العسكرية ."
        // );
        that.pushError({
          id: unit,
          type: "وحدة",
          errors: ["الشبكة العسكرية فصلت", error]
        });
      };
      xhttp.open(
        "post",
        "http://1.33.1.150//segelat/printPage/unitmembers",
        true
      );
      xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp.send(`serviceType=${typeId}&flag={ value =  }`);
    },
    loadConscripte() {
      //
    },
    async stopOperation(isVirtual = false, finish = false, showMsg = true) {
      let oh = this.currentOH,
        method = this.operation.type;
      if (oh.id) {
        oh.stopAt = new Date();
        oh.stopPercent =
          method == "update1sFromWebSegelat"
            ? this.segelatWeb.operation.perc
            : this.operation.perc;
        oh.stopIn =
          method == "update1sFromWebSegelat"
            ? this.segelatWeb.operation.done
            : this.operation.done;
        if (isVirtual && finish) {
          oh.endAt = new Date();
        }
        if (method == "update1sFromWebSegelat") {
          oh.rangeStart = this.segelatWeb.from;
          oh.rangeEnd = this.segelatWeb.to;
          oh.unitId = this.segelatWeb.unitId;
        }
        let editOH = await this.api("global/update_one", {
          table: "webOperationHistories",
          where: {
            id: oh.id
          },
          update: oh
        });
        if (!isVirtual) {
          this.$set(this, "stopOperationOk", true);
          this.$set(this, "numbers_passed_units", 0);
          // this.$set(this, "currentUnitListLength", 0);
          // this.$set(this, "currentUnitListProgress", 0);
          this.$set(this.operation, "type", "");
          this.$set(this.operation, "begin", false);
          this.$set(this.operation, "perc", 0);
          this.$set(this.operation, "done", 0);
          this.$set(this.operation, "finish", false);
          this.$set(this.operation, "errors", 0);
          this.$set(this, "file", null);
          this.$set(this, "currentOH", null);
          this.$set(this.result, "search", "");
          this.$set(this.result, "items", []);
          this.$set(this.result, "headers", []);
          this.$set(this.result, "selected", []);
          this.$set(this.errors, "items", []);
          this.$set(this.errors, "search", "");
          this.$set(this.errors, "selected", []);
          this.$set(this, "login_success", false);
          this.$set(this, "stopOperationModel", false);

          this.$set(this.segelatWeb, "startIn", null);
          this.$set(this.segelatWeb, "unitId", null);
          this.$set(this.segelatWeb, "model", false);
          this.$set(this.segelatWeb, "from", null);
          this.$set(
            this.segelatWeb,
            "to",
            new Date().toISOString().substring(0, 10)
          );
          this.$set(this.segelatWeb.operation, "begin", false);
          this.$set(this.segelatWeb.operation, "done", 0);
          this.$set(this.segelatWeb.operation, "finish", false);
          this.$set(this.segelatWeb.operation, "perc", 0);
          this.$set(this.segelatWeb.cons, "items", []);

          if (showMsg) {
            this.showSuccess(
              "تم إيقاف العملية وبإمكانك استكمالها في أي وقت من خلال صفحة سجل العمليات."
            );
          }
        }
      } else {
        if (!isVirtual) {
          this.showError("عفواً, لا توجد عمليات قيد التشغيل.");
        }
      }
    },
    async runOperation(
      method,
      isContinue = false,
      operationId = "",
      startIn = ""
    ) {
      // Preventing any other scraping
      this.$set(this.$store.state, "scraping", true);
      let noSavedOperation = this.noSavedOperations.includes(method);
      let operation = this.operation_types.filter(o => o.method == method)[0],
        where = isContinue
          ? {
              id: operationId
            }
          : {
              webOperationId: operation.id,
              startAt: new Date()
            },
        newOH = noSavedOperation
          ? null
          : await this.api(`global/${isContinue ? "get" : "create"}_one`, {
              table: "webOperationHistories",
              where,
              returnObject: true
            });
      if ((newOH && newOH.ok && newOH.data) || noSavedOperation) {
        console.log(newOH);
        if (!isContinue) {
          this.$set(this.operation, "startIn", null);
        }
        if (!noSavedOperation) {
          this.$set(this, "stopOperationOk", false);
          this.$set(this, "currentOH", newOH.data);
        }
        if (method == "update1sFromWebSegelat") {
          // Hereeeee
          this[method](true);
        } else {
          return this[method]();
        }
      } else {
        this.showError("عذراً, لم يتم تسجيل تاريخ العملية.");
        return;
      }
    },
    compareUnitForceWithDatabase() {
      this.getUnitsForces();
    },
    startSegelatWeb() {
      this.getTokenSegelatWeb();
    },
    async update1sFromWebSegelat(openDialog = true) {
      if (openDialog) {
        this.$set(this.segelatWeb.units, "loading", true);
        let units = await this.api("global/get_all", {
          table: "units"
        });
        this.$set(this.segelatWeb.units, "items", units.data);
        this.$set(this.segelatWeb.units, "loading", false);
        this.$set(this.segelatWeb, "model", true);
      } else {
        this.$set(this.segelatWeb, "loading", true);
        let { from, to, unitId, startIn, excelFile } = this.segelatWeb;
        if (excelFile) {
          let splitter = excelFile.name.split("."),
            isAcceptedExcel = excelFile
              ? ["xlsx", "xls"].includes(splitter[splitter.length - 1])
              : false;
          if (!isAcceptedExcel) {
            this.showError("من فضلك قم بتحديد ملف Excel مطابق للشرط المطلوب");
            return;
          } else {
            xlsxParser.onFileSelection(excelFile).then(data => {
              console.log(data);
              data.Sheet1.forEach((con, i) => {
                con.webOperationStatus =
                  startIn && startIn > 0
                    ? startIn >= i
                      ? "overlaped"
                      : "pending"
                    : "pending";
                con.hisConscriptionDate = con.conscriptionDate
                  ? con.conscriptionDate
                  : con.webConscriptionDate;
                con.webUnit = "";
                con.unit = "";
              });
              let headers = this.segelatWeb.cons.headers,
                otherHeaders = [
                  {
                    text: "الوحدة ويب",
                    value: "webUnit"
                  },
                  {
                    text: "الوحدة",
                    value: "unit"
                  }
                ];
              this.$set(this.segelatWeb.cons, "headers", [
                ...headers,
                ...otherHeaders
              ]);
              this.$set(this.segelatWeb.cons, "items", data.Sheet1);
              this.$set(this.segelatWeb, "loading", false);
              this.$set(this.segelatWeb, "model", false);
              this.startSegelatWeb();
            });
          }
        } else {
          let where = {
            typeId: 1,
            $or: [
              {
                conscriptionDate: {
                  $between: [new Date(from), new Date(to)]
                }
              },
              {
                webConscriptionDate: {
                  $between: [new Date(from), new Date(to)]
                }
              }
            ]
          };
          if (unitId || unitId === 0) {
            where.unitId = unitId;
          }
          let conscriptes = !excelFile
            ? await this.api("global/get_all", {
                table: "conscriptes",
                where,
                attrs: [
                  "militaryId",
                  "fullName",
                  "conscriptionDate",
                  "webConscriptionDate"
                ]
              })
            : { data: [], ok: false };
          let data = conscriptes.data;
          data.forEach((con, i) => {
            con.webOperationStatus =
              startIn && startIn > 0
                ? startIn >= i
                  ? "overlaped"
                  : "pending"
                : "pending";
            con.hisConscriptionDate = con.conscriptionDate
              ? con.conscriptionDate
              : con.webConscriptionDate;
          });
          this.$set(
            this.segelatWeb.cons,
            "items",
            this.fixDates(data, [
              "hisConscriptionDate",
              "conscriptionDate",
              "webConscriptionDate",
              "demobilizationDate"
            ])
          );
          this.$set(this.segelatWeb, "loading", false);
          this.$set(this.segelatWeb, "model", false);
          this.startSegelatWeb();
        }
      }
    },
    async updateProfilesWhichJoinMilitaryOperations(openDialog = true) {
      if (openDialog) {
        this.$set(this.segelatWeb.units, "loading", false);
        let militaryOperations = await this.api("global/get_all", {
          table: "militaryOperations"
        });
        console.log(militaryOperations);
        this.$set(
          this.segelatWeb,
          "militaryOperations",
          militaryOperations.data
        );

        this.$set(this.segelatWeb, "profileModel", true);
      } else {
        this.$set(this.segelatWeb, "loading", true);
        let { excelFile } = this.segelatWeb;

        let splitter = excelFile.name.split("."),
          isAcceptedExcel = excelFile
            ? ["xlsx", "xls"].includes(splitter[splitter.length - 1])
            : false;
        if (!isAcceptedExcel) {
          this.showError("من فضلك قم بتحديد ملف Excel مطابق للشرط المطلوب");
          return;
        } else {
          xlsxParser.onFileSelection(excelFile).then(data => {
            data.Sheet1.forEach((con, i) => {
              con.webOperationStatus = "done";

              con.hisConscriptionDate = con.conscriptionDate
                ? con.conscriptionDate
                : con.webConscriptionDate;
              con.webUnit = "";
              con.unit = "";
            });
            let headers = this.segelatWeb.cons.headers,
              otherHeaders = [
                {
                  text: "الوحدة ويب",
                  value: "webUnit"
                },
                {
                  text: "الوحدة",
                  value: "unit"
                }
              ];
            this.$set(this.segelatWeb.cons, "headers", [
              ...headers,
              ...otherHeaders
            ]);
            this.$set(this.segelatWeb.cons, "items", data.Sheet1);
            this.$set(this.segelatWeb, "loading", false);
            this.$set(this.segelatWeb, "profileModel", false);
            this.api("global/update_one", {
              table: "conscriptes",
              where: {
                militaryId: this.segelatWeb.cons.items.map(
                  ele => ele.militaryId
                )
              },
              update: {
                isPartInMilitaryOperation: true
              }
            })
              .then(res => {
                console.log("updated success : ", res);
              })
              .catch(err => {
                console.log("updated faild : ", err);
              });

            Promise.all(
              this.segelatWeb.cons.items.map(async ele => {
                const res = await this.api("global/check_or_create_by_key", {
                  table: "militaryOperationParticipants",
                  where: {
                    militaryOperationId: this.segelatWeb.militaryOperationId,
                    militaryId: ele.militaryId
                  },
                  params: {
                    militaryOperationId: this.segelatWeb.militaryOperationId,
                    militaryId: ele.militaryId
                  }
                });
              })
            );
          });
        }
      }
    },
    update1sFromWebUnit(openDialog = true) {
      if (openDialog) {
        this.$set(this.oneUnit, "loading", true);
        this.$set(this.oneUnit, "model", true);
        this.api("global/get_all", {
          table: "webUnitsPasswords",
          where: {
            IsOurUsername: false
          }
        })
          .then(x => {
            this.putItemsToSource(x.data);
          })
          .catch(err => {
            console.log(err);
            this.showError(
              "حدث خطأ أثناء احضار باسوردات الكتائب من قاعدة البيانات"
            );
          })
          .finally(() => {
            this.$set(this.oneUnit, "loading", false);
          });
      } else {
        let id = this.operation.startIn,
          startIn = this.result.items.findIndex(f => f.id == id);
        this.$set(this.operation, "done", startIn);
        this.$set(this, "numbers_passed_units", startIn);
        for (let i = 0; i < startIn; i++) {
          this.$set(this.result.items[i], "status", "overlaped");
        }
        this.$set(this.operation, "stopIn", Number(startIn) + 1);
        this.$set(this.oneUnit, "model", false);
      }
    },
    checkInServiceFromWeb(openDialog = true) {
      if (openDialog) {
        this.$set(this.checkInService, "model", true);
      } else {
        let { excelFile } = this.checkInService,
          that = this;
        if (excelFile) {
          let splitter = excelFile.name.split("."),
            isAcceptedExcel = excelFile
              ? ["xlsx", "xls"].includes(splitter[splitter.length - 1])
              : false;
          if (!isAcceptedExcel) {
            this.showError("من فضلك قم بتحديد ملف Excel مطابق للشرط المطلوب");
            return;
          }
          xlsxParser.onFileSelection(excelFile).then(data => {
            if (!data.Sheet1) {
              that.showError("لم يستطع العثور على Sheet1");
              return;
            }

            let fixedIds = data.Sheet1.map((con, i) => {
              if (con.militaryId) {
                return con.militaryId;
              }
            });

            if (!fixedIds.length || !fixedIds[0]) {
              that.showError(
                "برجاء إتباع التعليمات بوضع صف واحد من الأرقام العسكرية تحت عنوان 'militaryId'"
              );
              return;
            }

            that.fixedIds = fixedIds;

            that.operation.type = "update1sFromWeb";
            that.update1sFromWeb();
            that.$set(that.checkInService, "model", false);
          });
        }
      }
    },
    update1sFromWeb() {
      let startIn = this.operation.startIn;
      this.setCurrentOp("تحميل الوحدات", this.update1sFromWeb);
      if (this.isStopped()) {
        return;
      }
      this.api("global/get_all", {
        table: "webUnitsPasswords",
        where: {
          IsOurUsername: false
        }
      })
        .then(x => {
          this.putItemsToSource(x.data);
          let intVal = setInterval(() => {
            if (startIn) {
              this.$set(this.operation, "done", startIn);
              this.$set(this, "numbers_passed_units", startIn);
              for (let i = 0; i < startIn; i++) {
                this.$set(this.result.items[i], "status", "overlaped");
              }
            } else {
              this.getUnitsForces(startIn);
            }
            clearInterval(intVal);
          }, 1000);
        })
        .catch(err => {
          console.log(err);
          this.showError(
            "حدذ خطأ أثناء احضار باسوردات الكتائب من قاعدة البيانات"
          );
        })
        .finally(() => {
          //
        });
    },
    passUnit(index) {
      console.log("Failed in unit: " + this.result.items[index].unitText);
      this.$set(this.result.items[index], "status", "error");
      this.$set(
        this,
        "numbers_passed_units",
        Number(this.numbers_passed_units) + 1
      );
      // that.getToken(index + 1);
    },
    // get2sFromWeb() {
    //   this.getToken(0, true);
    // },
    load2s() {
      // Get Soldiers
      let conscripteTypes = [
          {
            name: "مجند",
            id: "2"
          },
          {
            name: "راتب عالي",
            id: "1"
          }
        ],
        that = this;
      conscripteTypes.forEach(ctype => {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let html = document.createElement("html"),
              dates = [
                "startDate",
                "endDate",
                "absenceDate",
                "fugitiveNoticeDate",
                "returnDate",
                "returnNoticeDate",
                "firstLicenceDate",
                "secondLicenceDate",
                "lastComsionDate",
                "fromDate",
                "toDate",
                "cardDate"
              ],
              myDivs = {
                okobat: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "cardNumber",
                    "cardDate",
                    "unit"
                  ],
                  vals: []
                },
                tarakyAzl: {
                  db: [
                    "militaryId",
                    "fullName",
                    "force",
                    "unit",
                    "degree",
                    "promotionType"
                  ],
                  vals: []
                },
                travelReturn: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "fromDate",
                    "toDate",
                    "country",
                    "confirmer",
                    "reason"
                  ],
                  vals: []
                },
                tahel: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "fromDate",
                    "toDate",
                    "qualificationDegree"
                  ],
                  vals: []
                },
                moaml: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "orderNumber", // TODO:: Add it
                    "orderDate",
                    "newType"
                  ],
                  vals: []
                },
                reduction: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "reductionPeriod",
                    "orderDate",
                    "specialism"
                  ],
                  vals: []
                },
                horob: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "absenceDate",
                    "fugitiveNoticeDate",
                    "notes"
                  ],
                  vals: []
                },
                awda: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "returnDate",
                    "returnNoticeDate",
                    "notes"
                  ],
                  vals: []
                },
                lic: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "firstLicenceNumber",
                    "firstLicenceDate",
                    "secondLicenceNumber",
                    "secondLicenceDate",
                    "lastComsionDate"
                  ],
                  vals: []
                },
                omia: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "qualification",
                    "seatNumber",
                    "qualificationDegree",
                    "governorate",
                    "markaz"
                  ],
                  vals: []
                },
                omiaTacer: {
                  db: [
                    "militaryId",
                    "fullName",
                    "degree",
                    "fromDate",
                    "toDate",
                    "notes",
                    "ignorantDegree"
                  ],
                  vals: []
                }
              };
            html.innerHTML = this.responseText;
            html.hidden = true;
            let divs = html.getElementsByTagName("div");
            divs.forEach(div => {
              if (Object.keys(myDivs).includes(div.id)) {
                let table =
                  div.getElementsByTagName("table") &&
                  div.getElementsByTagName("table").length > 0
                    ? div.getElementsByTagName("table")[0]
                    : null;
                if (table) {
                  let _trs = table.getElementsByTagName("tr"),
                    trs = [..._trs];
                  if (trs.length > 1) {
                    trs.shift();
                    trs.forEach((tr, i) => {
                      let obj = {};
                      let tds = tr.getElementsByTagName("td");
                      myDivs[div.id].db.forEach((key, ii) => {
                        if (dates.includes(key)) {
                          obj[key] =
                            tds[ii].innerHTML.trim() &&
                            tds[ii].innerHTML.trim().length > 0
                              ? new Date(tds[ii].innerHTML.trim())
                              : null;
                        } else {
                          obj[key] = tds[ii].innerHTML.trim();
                        }
                      });
                      obj.chipType = div.id;
                      obj.conscripteType = ctype.name;
                      myDivs[div.id].vals.push(obj);
                    });
                  }
                }
              }
            });
            let allChips = Object.values(myDivs).map(m => m.vals),
              chipsIds = [],
              allChipsCounter = 0;
            allChips.forEach(cp => {
              allChipsCounter += cp.length;
            });
            allChips.forEach(cp => {
              cp.forEach(async (cpi, i) => {
                console.log(cpi);
                let exists = await that.api("global/get_one", {
                  table: "webChipsFollowups",
                  where: cpi
                });
                if (exists && exists.ok && exists.data && exists.data.id) {
                  console.log("Already In.");
                  chipsIds.push(exists.data.id);
                } else {
                  console.log("Creating New...");
                  let conscripteExists = await that.api("global/get_one", {
                    table: "conscriptes",
                    where: {
                      militaryId: cpi.militaryId
                    }
                  });
                  if (
                    conscripteExists &&
                    conscripteExists.ok &&
                    conscripteExists.data &&
                    conscripteExists.data.militaryId
                  ) {
                    let newChip = await that.api("global/create_one", {
                      table: "webChipsFollowups",
                      where: { ...cpi, startDate: new Date() },
                      returner: "id"
                    });
                    if (newChip && newChip.ok && newChip.data) {
                      chipsIds.push(newChip.data);
                    }
                  } else {
                    await that.api("global/create_one", {
                      table: "conscriptes",
                      where: {
                        militaryId: cpi.militaryId,
                        fullName: cpi.fullName,
                        typeId: ctype.id == "2" ? 1 : 2
                      }
                    });
                    let newChip = await that.api("global/create_one", {
                      table: "webChipsFollowups",
                      where: {
                        ...cpi,
                        startDate: new Date(),
                        isCreatedByBot: true
                      },
                      returner: "id"
                    });
                    if (newChip && newChip.ok && newChip.data) {
                      chipsIds.push(newChip.data);
                    }
                  }
                }
                // console.log(
                //   "c: " + chipsIds.length + " .. a:" + allChipsCounter
                // );
                if (chipsIds.length == allChipsCounter) {
                  console.log("chipsIds now true");
                  console.log(chipsIds);
                  let updateChips = await that.api("global/update_one", {
                    table: "webChipsFollowups",
                    where: {
                      id: {
                        $notIn: chipsIds
                      },
                      endDate: {
                        $is: null
                      },
                      conscripteType: ctype.name
                      // chipType: cpi.chipType
                    },
                    update: {
                      endDate: new Date()
                    }
                  });
                  console.log("updateChips..");
                  console.log(updateChips);
                }
              });
            });
          }
        };
        xhttp.onerror = function(error) {
          console.log("Error");
          console.log(error);
        };
        xhttp.ontimeout = function(error) {
          console.log("Timeout");
          console.log(error);
        };
        xhttp.open(
          "get",
          `http://1.33.1.150/segelat/printPage/Details?type=${ctype.id}`,
          true
        );
        xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp.send();
      });
    },
    getTokenSegelatWeb() {
      let xhttp = new XMLHttpRequest(),
        that = this,
        token = "";
      console.log("Getting Token.");
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log("Got Token");
          let html = document.createElement("html");
          html.innerHTML = this.responseText;
          html.hidden = true;
          let token_inputs = html.getElementsByTagName("input");
          if (
            token_inputs["__RequestVerificationToken"] &&
            token_inputs["__RequestVerificationToken"].value
          ) {
            token = token_inputs["__RequestVerificationToken"].value;
            that.loginSegelatWeb(token);
          } else {
            that.pushError({
              id: "الشبكة العسكرية",
              type: "ويب",
              errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية"],
              segelatWeb: true
            });
          }
        }
      };
      xhttp.onerror = function(error) {
        console.log("Error");
        console.log(error);
        that.pushError({
          id: "الشبكة العسكرية",
          type: "ويب",
          errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية"],
          segelatWeb: true
        });
      };
      xhttp.ontimeout = function(error) {
        console.log("Timeout");
        console.log(error);
        that.pushError({
          id: "الشبكة العسكرية",
          type: "ويب",
          errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية عشان الشبكة فصلت"],
          segelatWeb: true
        });
      };
      xhttp.open("get", "http://1.33.1.150/segelat/Home/login/", true);
      xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp.send();
    },
    getToken(index, asSegelat = false) {
      let xhttp = new XMLHttpRequest(),
        that = this,
        token = "";
      console.log("Getting Token..." + index);
      this.setCurrentOp("سحب ال token", this.getToken, arguments);
      if (this.isStopped()) {
        return;
      }
      if (!asSegelat) {
        this.$set(this.result.items[index], "status", "running");
        this.$set(this.operation, "begin", true);
        this.$set(this.operation, "finish", false);
      }
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          that.removeError({
            id: that.result.items[index].unitText,
            type: "وحدة",
            errors: [
              "تعذر تحميل معرف ارتباط الوحدة",
              "تعذر تحميل معرف ارتباط الوحدة عشان الشبكة العسكرية فصلت"
            ]
          });
          console.log("Got Token");
          that.setCurrentOp("تم سحب ال token", that.getToken, [
            index,
            asSegelat
          ]);
          if (that.isStopped()) {
            return;
          }
          let html = document.createElement("html");
          html.innerHTML = this.responseText;
          html.hidden = true;
          let token_inputs = html.getElementsByTagName("input");
          if (
            token_inputs["__RequestVerificationToken"] &&
            token_inputs["__RequestVerificationToken"].value
          ) {
            token = token_inputs["__RequestVerificationToken"].value;
            that.login(token, index, asSegelat);
          } else {
            if (asSegelat) {
              that.pushError({
                id: "الشبكة العسكرية",
                type: "ويب",
                errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية"]
              });
            } else {
              that.pushError({
                id: that.result.items[index].unitText,
                type: "وحدة",
                errors: ["تعذر تحميل معرف ارتباط الوحدة"]
              });
            }
          }
        }
      };
      xhttp.timeout = 6000;
      xhttp.onerror = function(error) {
        console.log("Error");
        console.log(error);
        that.repeatCurrentOpAfter(3000);
        if (!asSegelat) {
          //that.passUnit(index);
          that.pushError({
            id: that.result.items[index].unitText,
            type: "وحدة",
            errors: ["تعذر تحميل معرف ارتباط الوحدة", error]
          });
        } else {
          that.pushError({
            id: "الشبكة العسكرية",
            type: "ويب",
            errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية"]
          });
        }
      };
      xhttp.ontimeout = function(error) {
        console.log("Timeout");
        console.log(error);
        that.repeatCurrentOpAfter(3000);
        if (asSegelat) {
          that.pushError({
            id: "الشبكة العسكرية",
            type: "ويب",
            errors: ["تعذر تحميل معرف ارتباط السجلات العسكرية عشان الشبكة فصلت"]
          });
        } else {
          //that.passUnit(index);
          that.pushError({
            id: that.result.items[index].unitText,
            type: "وحدة",
            errors: [
              "تعذر تحميل معرف ارتباط الوحدة عشان الشبكة العسكرية فصلت",
              error
            ]
          });
        }
      };
      xhttp.open("get", "http://1.33.1.150/segelat/Home/login/", true);
      xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp.send();
    },
    loginSegelatWeb(token) {
      let xhttp = new XMLHttpRequest(),
        that = this;
      this.$set(this.segelatWeb.operation, "begin", true);
      let { unitText, username, password } = {
        unitText: "السجلات العسكرية",
        username: "10000053",
        password: "army53"
      };
      if (username && username.length > 0 && password && password.length > 0) {
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            if (this.responseText.includes("المستخدم الحالي")) {
              console.log("Logged-in");
              that.setCurrentOp("تم تسجيل الدخول");
              that.segelatWebLoad();
            } else {
              that.pushError({
                id: "الشبكة العسكرية",
                type: "ويب",
                errors: ["باسورد السجلات العسكرية غلط"],
                segelatWeb: true
              });
            }
          }
        };
        xhttp.onerror = function(error) {
          console.log("Error");
          console.log(error);
          that.showError(error);
          that.loginSegelatWeb(token);
        };
        xhttp.timeout = 5000;
        xhttp.ontimeout = function(error) {
          console.log("Timeout");
          console.log(error);
          that.showError(error);
          that.loginSegelatWeb(token);
        };
        xhttp.open("post", "http://1.33.1.150/segelat/Home/Login", true);
        xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp.send(
          `UserName=${username}&Password=${password}&__RequestVerificationToken=${token}`
        );
      }
    },
    login(token = "", index, asSegelat = false) {
      let xhttp = new XMLHttpRequest(),
        that = this,
        params = [...arguments];
      console.log("Logging-in...");

      this.setCurrentOp("تسجيل الدخول", this.login, arguments);
      if (this.isStopped()) {
        return;
      }
      // if (!asSegelat) {
      //   this.$set(this.operation, "begin", true);
      // } else {
      //   this.$set(this.operation, "begin", true);
      // }
      // commented by Mohsen as they both are the same instruction
      this.$set(this.operation, "begin", true);
      let { unitText, username, password, unitId } = asSegelat
        ? {
            unitText: "السجلات العسكرية",
            username: "10000053",
            password: "army53",
            unitId: null
          }
        : this.result.items[index];
      if (username && username.length > 0 && password && password.length > 0) {
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            if (this.responseText.includes("المستخدم الحالي")) {
              that.removeError({
                id: that.result.items[index].unitText,
                type: "وحدة",
                errors: ["عملية تسجيل الدخول استغرقت أكثر من 5 ثواني"]
              });
              that.removeError({
                id: that.result.items[index].unitText,
                type: "وحدة",
                errors: ["الباسورد غلط"]
              });
              console.log("Logged-in");
              that.setCurrentOp("تم تسجيل الدخول", that.login, params);
              if (that.isStopped()) {
                return;
              }
              that.$set(that, "currentUnitId", unitId);
              if (asSegelat) {
                that.load2s();
              } else {
                that.loadUnit(index);
              }
            } else {
              if (asSegelat) {
                that.pushError({
                  id: "الشبكة العسكرية",
                  type: "ويب",
                  errors: ["باسورد السجلات العسكرية غلط"]
                });
              } else {
                that.passUnit(index);
                that.pushError({
                  id: unitText,
                  type: "وحدة",
                  errors: ["الباسورد غلط"]
                });
              }
            }
          }
        };
        xhttp.onerror = function(error) {
          console.log("Error");
          console.log(error);
          that.showError(error);
          if (!asSegelat) {
            that.passUnit(index);
          }
        };
        xhttp.timeout = 5000;
        xhttp.ontimeout = function(error) {
          console.log("Timeout");
          console.log(error);
          that.pushError({
            id: that.result.items[index].unitText,
            type: "وحدة",
            errors: ["عملية تسجيل الدخول استغرقت أكثر من 5 ثواني"]
          });
          that.repeatCurrentOpAfter(2000);
          if (!asSegelat) {
            //that.passUnit(index);
          }
        };
        xhttp.open("post", "http://1.33.1.150/segelat/Home/Login", true);
        xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp.send(
          `UserName=${username}&Password=${password}&__RequestVerificationToken=${token}`
        );
      } else {
        // this.$set(this.result.items[index], "status", "error");
        if (!asSegelat) {
          that.passUnit(index);
          that.pushError(unitText, "وحدة", ["اليوزنيم أو الباسود غير موجود"]);
        }
        // Should go further
      }
    },
    logout(unitIndex) {
      console.log("logging-out...");
      this.setCurrentOp("تأكيد تسجيل الخروج", this.logout, arguments);
      if (this.isStopped()) {
        return;
      }
      // Logout
      let xhttp = new XMLHttpRequest(),
        that = this;
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          that.removeError({
            type: "وحدة",
            errors: [
              "تعذر تسجيل الخروج من الوحدة",
              "تعذر تسجيل الخروج من الوحدة عشان الشبكة العسكرية فصلت"
            ]
          });
          // that.$set(that, "login_success", true);
          console.log("logged-out");
          that.$set(that, "allowChilds", false);
          let intVal = setInterval(() => {
            that.$set(that, "allowChilds", true);
            that.getToken(unitIndex);
            clearInterval(intVal);
          }, 5000);
        }
      };
      xhttp.onerror = function(error) {
        console.log("Error");
        console.log(error);
        that.showError(error);
        that.pushError({
          id: that.result.items[unitIndex - 1].unitText,
          type: "وحدة",
          errors: ["تعذر تسجيل الخروج من الوحدة", error]
        });
      };
      xhttp.ontimeout = function(error) {
        console.log("Timeout");
        console.log(error);
        that.showError(error);
        that.pushError({
          id: that.result.items[unitIndex - 1].unitText,
          type: "وحدة",
          errors: [
            "تعذر تسجيل الخروج من الوحدة عشان الشبكة العسكرية فصلت",
            error
          ]
        });
      };
      xhttp.open("get", "http://1.33.1.150/segelat/Home/Logout", true);
      xhttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );
      xhttp.send();
    },
    completeDegreeAndConscriptionDate() {
      this.$set(this.operation, "done", 0);
      this.$set(this.operation, "begin", true);
      let items = this.result.items,
        degrees = {
          جندى: "2",
          عـريف: "3",
          رقيـب: "5",
          "رقيب أول": "5",
          "ملازم مجند": "13"
        },
        that = this;
      items.forEach(item => {
        let update = {};
        item.identifier = item["الرقم العسكري"];
        item.operation_errors = [];
        if (item["الدرجة"]) {
          update.degreeId = degrees[item["الدرجة"].trim()];
        } else {
          item.operation_errors.push("لا يوجد درجة");
        }
        item.conscriptionDate = item["تاريخ الإلحاق"];
        if (item.conscriptionDate && item.conscriptionDate !== "1/1/00") {
          update.conscriptionDate = new Date(
            this.fixDate(item.conscriptionDate)
          );
        } else {
          item.operation_errors.push("لا يوجد تاريخ إلحاق");
        }
        if ((update.degreeId || update.conscriptionDate) && item.identifier) {
          this.api("global/update_one", {
            table: "conscriptes",
            where: {
              militaryId: item.identifier
            },
            update
          })
            .then(x => {
              //
            })
            .catch(error => {
              //
              item.operation_errors.push("لم يتم تعديله");
              that.errors.items.push(item);
            })
            .finally(() => {
              // Increase counter
              that.$set(
                that.operation,
                "done",
                Number(that.operation.done) + 1
              );
            });
        } else {
          // Add To Not Updated Table
          that.$set(that.operation, "done", Number(that.operation.done) + 1);
        }
        if (item.operation_errors && item.operation_errors.length > 0) {
          that.errors.items.push(item);
        }
      });
    },
    fileUploaded(file) {
      xlsxParser.onFileSelection(file).then(data => {
        console.log(data);
        let items = data.Sheet1;
        if (items.length > 0) {
          let headers = [];
          Object.keys(items[0]).forEach(key => {
            let obj = {
              text: key,
              value: key,
              sortable: false
            };
            headers.push(obj);
          });
          this.$set(this.result, "headers", headers);
        }
        this.$set(this.result, "items", items);
      });
    },
    putItemsToSource(items) {
      if (items.length > 0) {
        let headers = [];
        Object.keys(items[0]).forEach(key => {
          let obj = {
            text: key,
            value: key,
            sortable: false
          };
          headers.push(obj);
        });
        headers = [
          {
            text: "الحالة",
            value: "status",
            sortable: false
          },
          ...headers,
          ...this.additionalHeaders
        ];
        this.$set(this.result, "headers", headers);
      }
      this.$set(this.result, "items", items);
    },
    setCurrentOp(currentOp, currentFunc = () => {}, params = []) {
      this.$set(this.controlOp, "currentOp", currentOp + " ...");
      this.$set(this.controlOp, "currentFunc", currentFunc);
      // save parameters as array
      this.$set(this.controlOp, "currentParams", params);
    },
    isStopped() {
      if (this.controlOp.tryingToPause) {
        this.controlOp.tryingToPause = false;
        this.controlOp.pause = true;
      }
      return this.controlOp.pause;
    },

    /**
     * IF THE START
     */
    repeatCurrentOpAfter(timeout) {
      let currentFunc = this.controlOp.currentFunc,
        currentParams = this.controlOp.currentParams,
        currentOp = this.controlOp.currentOp;

      console.log(`سيتم إعادة نفس العملية بعد: ${timeout / 1000} ثانية`);
      this.setCurrentOp(`سيتم إعادة نفس العملية بعد: ${timeout / 1000} ثانية`);
      setTimeout(() => {
        console.log(currentOp);
        this.setCurrentOp(currentOp, currentFunc, currentParams);
        this.resumeCurrentOp();
      }, timeout);
    },
    setPause() {
      this.controlOp.puase = true;
    },
    resumeCurrentOp() {
      if (this.controlOp.tryingToPause && this.controlOp.pause == false) {
        // إيقاف فوري
        this.controlOp.pause = true;
        this.controlOp.tryingToPause = false;
        return;
      } else {
        this.controlOp.pause = false;
        this.controlOp.tryingToPause = false;
      }
      let currentFunc = this.controlOp.currentFunc,
        currentParams = this.controlOp.currentParams;

      currentFunc(...currentParams);
    },
    resendUnit() {
      let unitIndex = this.result.items.findIndex(unit => {
        return this.currentUnitId == unit.unitId;
      });
      this.$set(this.controlOp, "pause", false);

      // no change
      if (this.numbers_passed_units == unitIndex) {
        this.setCurrentOp("إعادة إتصال بالوحدة", this.logout, [unitIndex]);
        this.resumeCurrentOp();
        this.stopOperation(true);
      } else {
        this.numbers_passed_units = unitIndex;
      }
    },
    resendCon() {
      this.$set(this.controlOp, "pause", false);
      if (
        this.currentUnitListProgress ==
        this.$refs.child1.numbers_passed_conscriptes
      ) {
        this.$refs.child1.loadDoc(this.currentUnitListProgress);
      } else {
        // the right order
        // loadDoc(i) ==> numbers_passed_conscriptes = i + 1; ==> currentUnitListProgress = i + 1; ==> loadDoc(i+1)
        // right now currentUnitListProgress is having the new value so
        let i = this.currentUnitListProgress;

        // if the user asked for the index 0
        if (i - 1 < 0) {
          this.$set(this, "currentUnitListProgress", 0);
          this.$set(this.$refs.child1, "numbers_passed_conscriptes", 0);
          this.$refs.child1.loadDoc(0);
        } else {
          this.$set(this, "currentUnitListProgress", i - 1);
          this.$set(this.$refs.child1, "numbers_passed_conscriptes", i);
        }
      }
    }
  }
};
</script>
