<template>
  <v-card flat class="my-4" :loading="loading">
    <v-card-title>
      {{ !isMini ? "أفراد العائلة" : "" }}
      <!-- <v-btn class="mr-auto" color="primary" @click="addFamilyMember"
        >إضافة فرد جديد</v-btn
      > -->
      <v-spacer></v-spacer>
      <v-menu rounded="b-xl" offset-y>
        <template v-slot:activator="{ attrs, on }">
          <v-btn color="primary" v-bind="attrs" v-on="on">
            إضافة فرد جديد
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, i) in familyMembersRel"
            :key="i"
            @click="dialogForAdd(item.value)"
          >
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>
                الإسم
              </th>
              <th>
                صلة القرابة
              </th>
              <th v-if="!isMini">تاريخ الميلاد</th>
              <th v-if="!isMini">
                الحالة الإجتماعية
              </th>
              <th>
                يستحق
              </th>
              <th v-if="isMini">
                تسكين بالبطاقة
              </th>
              <th>تعديل</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, i) in familyMembers" :key="i">
              <td>
                <v-icon>{{
                  (member.familyTypeRelId == 2 ||
                    member.familyTypeRelId == 3) &&
                  member.motherId != null
                    ? "mdi-subdirectory-arrow-left"
                    : ""
                }}</v-icon>
                {{ member.name }}
              </td>

              <td>
                {{
                  familyMembersRel[member.familyTypeRelId - 1]
                    ? familyMembersRel[member.familyTypeRelId - 1].title
                    : null
                }}
              </td>
              <td v-if="!isMini">
                {{ member.birthDate == null ? "___" : member.birthDate }}
              </td>
              <td v-if="!isMini">
                {{
                  member.marriageState
                    ? marriageStates.find(state => {
                        return state.value == member.marriageState;
                      }).title
                    : "___"
                }}
              </td>
              <td>
                <v-icon>{{
                  conscripte.isDeserve != undefined &&
                  conscripte.isDeserve(member)
                    ? "mdi-check"
                    : "mdi-close"
                }}</v-icon>
              </td>
              <td v-if="isMini" width="150px">
                <v-checkbox
                  v-model="checkObj[member.id]"
                  @change="$emit('checkIsUpdatingAllowed')"
                  :disabled="
                    (!allowedRelations.includes(
                      member.cardsFamilyTypeRel.relation
                    ) ||
                      !(
                        conscripte.isDeserve != undefined &&
                        conscripte.isDeserve(member)
                      )) &&
                      /* and clear it's value if it's disabled*/ ((checkObj[
                        member.id
                      ] = false) ||
                        true)
                  "
                ></v-checkbox>
              </td>
              <td>
                <v-btn @click="editMember(member)" icon tile color="primary"
                  ><v-icon>mdi-account-edit</v-icon></v-btn
                >
              </td>
              <td>
                <v-btn
                  icon
                  tile
                  text
                  color="error"
                  @click="
                    deleteModel = true;
                    wantToDelete = member;
                  "
                  ><v-icon>mdi-account-remove</v-icon></v-btn
                >
              </td>
            </tr>
            <tr v-if="familyMembers && familyMembers.length == 0">
              <td colspan="10" class="text-center">
                لا يوجد افراد مسجلة
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-dialog v-model="model" scrollable persistent max-width="1000px">
        <v-card :disabled="disabled" :loading="loading">
          <v-card-title>
            <span v-if="model">
              {{ isEdit ? "تعديل" : " اضافة" }} فرد أسره ({{
                familyMembersRel.length == 5
                  ? familyMembersRel.find(relation => {
                      return relation.value == dialog.familyTypeRelId;
                    }).title
                  : ""
              }})
            </span>

            <v-spacer></v-spacer>
            <div>
              <v-btn
                v-if="isEdit"
                color="primary"
                class="px-6"
                large
                @click="updateMember()"
              >
                تعديل
              </v-btn>
              <v-btn v-else color="primary" class="px-6" large @click="save()">
                حفظ
              </v-btn>

              <v-btn
                color="error"
                class="px-6 mx-5"
                outlined
                large
                @click="closeDialog()"
              >
                اغلاق
              </v-btn>
            </div>
            <!-- <v-btn icon @click="closeDialog()">
              <v-icon>mdi-close</v-icon>
            </v-btn> -->
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-6">
            <v-expansion-panels
              v-model="panel"
              :loading="loading"
              :disabled="disabled"
            >
              <v-expansion-panel>
                <v-expansion-panel-header
                  :class="panel == 0 ? 'primary white--text' : ''"
                >
                  <!-- <span v-if="model">
                    {{ isEdit ? "تعديل" : " اضافة" }} فرد أسره ({{
                      familyMembersRel.length == 5
                        ? familyMembersRel.find(relation => {
                            return relation.value == dialog.familyTypeRelId;
                          }).title
                        : ""
                    }})
                  </span> -->
                  بيانات أساسية
                </v-expansion-panel-header>

                <v-divider></v-divider>
                <v-expansion-panel-content class="pt-4">
                  <v-form ref="form">
                    <v-container>
                      <v-row>
                        <v-col class="py-1">
                          <v-row>
                            <v-col
                              class="py-1"
                              cols="7"
                              v-if="dialog.familyTypeRelId == 1"
                            >
                              <v-text-field
                                filled
                                label="الاسم بالكامل"
                                hint=""
                                :rules="[
                                  v => !!v || ' يجب ادخال الاسم بالكامل'
                                ]"
                                v-model="dialog.name"
                              ></v-text-field>
                            </v-col>

                            <v-col class="py-1" cols="7" v-else>
                              <v-text-field
                                filled
                                label="الاسم"
                                hint=""
                                :rules="[v => !!v || ' ايجب ادخال ! ']"
                                v-model="dialog.name"
                              ></v-text-field>
                            </v-col>

                            <v-col class="py-1" cols="5">
                              <v-text-field
                                filled
                                label="الرقم القومي"
                                type="text"
                                hint="10237475893876"
                                max="14"
                                :rules="IdRequired"
                                v-model="dialog.nationalId"
                              ></v-text-field>
                            </v-col>

                            <v-col class="py-1" cols="4">
                              <v-autocomplete
                                filled
                                :items="governorates"
                                item-text="displayedText"
                                item-value="id"
                                label="المحافظه"
                                :rules="[v => !!v || 'يجب ادخال المحافظه ']"
                                v-model="dialog.governorateId"
                              ></v-autocomplete>
                            </v-col>

                            <v-col class="py-1" cols="8">
                              <v-text-field
                                filled
                                label="العنوان"
                                type="text"
                                v-model="dialog.address"
                                required
                              ></v-text-field>
                            </v-col>

                            <v-col
                              class="py-1"
                              cols="4"
                              v-if="[2, 3].includes(dialog.familyTypeRelId)"
                            >
                              <v-autocomplete
                                filled
                                :items="mothers"
                                item-text="name"
                                item-value="id"
                                label="الام"
                                persistent-hint
                                v-model="dialog.motherId"
                                clearable
                              ></v-autocomplete>
                            </v-col>

                            <v-col class="py-1" cols="4" sm="4" md="4">
                              <v-autocomplete
                                filled
                                :items="religionItems"
                                item-value="value"
                                item-text="title"
                                label="الديانه"
                                persistent-hint
                                v-model="dialog.religionId"
                                required
                              ></v-autocomplete>
                            </v-col>
                            <v-col class="py-1" cols="4" sm="4" md="4">
                              <v-autocomplete
                                filled
                                :items="nationalityItems"
                                item-value="value"
                                item-text="title"
                                label="الجنسيه"
                                v-model="dialog.nationalityId"
                                required
                              ></v-autocomplete>
                            </v-col>

                            <v-col class="py-1" cols="4">
                              <v-text-field
                                filled
                                type="date"
                                label="تاريخ الميلاد"
                                v-model="dialog.birthDate"
                                :readonly="birthDate !== -1"
                                :rules="dateRule"
                              ></v-text-field>
                            </v-col>
                            <v-col class="py-1" cols="4">
                              <v-text-field
                                type="text"
                                label="السن"
                                v-model="age"
                                :disabled="true"
                                filled
                              ></v-text-field>
                            </v-col>
                            <v-col
                              class="py-1"
                              cols="4"
                              v-if="[1, 3].includes(dialog.familyTypeRelId)"
                            >
                              <v-autocomplete
                                filled
                                :items="
                                  dialog.familyTypeRelId == 1
                                    ? wifeMarrStates
                                    : daughterMarrStates
                                "
                                item-value="value"
                                item-text="title"
                                label="الحاله الاجتماعيه"
                                v-model="dialog.marriageState"
                                :rules="[
                                  v => !!v || 'يجب ادخال الحاله الاجتماعيه '
                                ]"
                              ></v-autocomplete>
                            </v-col>
                            <v-col
                              class="py-1"
                              cols="4"
                              v-if="dialog.marriageState == 2"
                            >
                              <v-text-field
                                filled
                                label="رقم القسيمه "
                                type="text"
                                hint="1023"
                                v-model="dialog.documentNum"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col
                              class="py-1"
                              cols="4"
                              v-if="
                                dialog.familyTypeRelId != 2 &&
                                  dialog.marriageState == 2
                              "
                            >
                              <v-text-field
                                filled
                                type="date"
                                label="تاريخ الزواج"
                                v-model="dialog.marriageDate"
                                :rules="dateRule"
                              ></v-text-field>
                            </v-col>

                            <v-col
                              class="py-1"
                              cols="4"
                              v-if="
                                dialog.familyTypeRelId != 2 &&
                                  dialog.marriageState == 3
                              "
                            >
                              <v-text-field
                                filled
                                type="date"
                                label="تاريخ الطلاق"
                                :landscape="true"
                                v-model="dialog.divorceDate"
                                :rules="dateRule"
                              ></v-text-field>
                            </v-col>

                            <v-col
                              class="py-1"
                              cols="4"
                              v-if="[4, 5].includes(dialog.familyTypeRelId)"
                            >
                              <v-text-field
                                filled
                                type="text"
                                label="قيمة الدخل (معاش أو مرتب)"
                                v-model="dialog.pensionVal"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="4">
                              <v-btn-toggle
                                class="d-block"
                                v-model="dialog.isDead"
                              >
                                <v-btn
                                  width="50%"
                                  :value="false"
                                  :class="
                                    [false, null, undefined].includes(
                                      dialog.isDead
                                    )
                                      ? 'primary white--text'
                                      : ''
                                  "
                                  >حي</v-btn
                                >
                                <v-btn
                                  width="50%"
                                  :value="true"
                                  :class="
                                    dialog.isDead == true
                                      ? 'error white--text'
                                      : ''
                                  "
                                  >متوفى</v-btn
                                >
                              </v-btn-toggle>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="py-1">
                              <div
                                v-if="checkLastDiagnosis()"
                                class="success--text"
                              >
                                يستحق طبيا
                              </div>
                              <div
                                v-else-if="disableDeserve"
                                class="error--text"
                              >
                                لا يستحق
                              </div>
                              <v-checkbox
                                v-else
                                :disabled="disableDeserve"
                                v-model="dialog.isDeserve"
                                label="يستحق"
                              ></v-checkbox>
                              <v-spacer></v-spacer>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col class="py-0" cols="3">
                          <v-card class=" pa-0" color="white" elevation="1">
                            <v-card-text class="pa-2">
                              <v-avatar rounded size="100%" color="secondary">
                                <v-img contain min-width="100%" :src="imgPath">
                                  <v-file-input
                                    class="image-selector"
                                    hide-input
                                    show-size
                                    @change="previewImg"
                                    v-model="img"
                                    accept="image/png, image/jpeg, image/bmp"
                                  ></v-file-input>
                                </v-img>
                              </v-avatar>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                  <!-- <v-btn
                    color="primary"
                    class="px-6 ml-5"
                    outlined
                    large
                    @click="closeDialog()"
                  >
                    اغلاق
                  </v-btn> -->

                  <v-spacer></v-spacer>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel
                :disabled="!(isSon(dialog) || isDaughter(dialog))"
              >
                <v-expansion-panel-header
                  :class="panel == 1 ? 'primary white--text' : ''"
                >
                  بيانات تعليم
                </v-expansion-panel-header>

                <v-divider></v-divider>
                <v-expansion-panel-content class="pt-4">
                  <v-form ref="educationForm">
                    <v-row>
                      <v-col>
                        <v-combobox
                          filled
                          :items="['جامعي', 'ثانوي']"
                          label="مستوى التعليم"
                          v-model="educationDialog.level"
                          :rules="reqRule"
                        ></v-combobox>
                      </v-col>
                      <v-col>
                        <v-text-field
                          filled
                          type="text"
                          label="إسم المدرسة/الجامعة"
                          v-model="educationDialog.schoolName"
                          :rules="reqRule"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          filled
                          type="date"
                          label="تاريخ تقديم البيان"
                          :rules="dateRule"
                          v-model="educationDialog.applyDate"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row v-if="educationDialog.id">
                      <v-col class="pt-0">
                        <v-btn
                          color="error"
                          outlined
                          @click="deleteEducationModel = true"
                          >حذف بيان الدراسة</v-btn
                        >
                      </v-col>
                    </v-row>
                    <small
                      >*يسمح للطالب/ة بالإستحقاق في البطاقة العلاجية لمدة سنة من
                      تاريخ تقديم البيان</small
                    >
                  </v-form>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel
                :disabled="!(isSon(dialog) || isDaughter(dialog))"
              >
                <v-expansion-panel-header
                  :class="panel == 2 ? 'primary white--text' : ''"
                >
                  بيانات الفحص الطبي (الكوموسيون)
                </v-expansion-panel-header>

                <v-divider></v-divider>
                <v-expansion-panel-content class="pt-4">
                  <v-form ref="diagnoseForm">
                    <v-row>
                      <v-col>
                        <v-row>
                          <v-col class="py-1">
                            <v-text-field
                              type="text"
                              filled
                              label="رقم اللجنة"
                              v-model="diagnoseDialog.committeNum"
                              :rules="reqRule"
                            ></v-text-field>
                          </v-col>
                          <v-col class="py-1">
                            <v-text-field
                              type="date"
                              filled
                              label="تاريخ اللجنة"
                              v-model="diagnoseDialog.committeDate"
                              :rules="dateRule"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="py-1">
                            <v-textarea
                              rows="3"
                              filled
                              label="التشخيص"
                              v-model="diagnoseDialog.diagnosis"
                            ></v-textarea>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="3">
                        <v-card class=" pa-1" color="white" elevation="4">
                          <v-avatar rounded size="100%" color="secondary">
                            <v-img
                              style="position:relative"
                              :src="diagnoseDialog.image"
                            >
                              <v-file-input
                                v-model="diagnoseDialog.fileInput"
                                class="image-selector"
                                hide-input
                                show-size
                                @change="previewDiagnosisImg"
                              ></v-file-input>
                            </v-img>
                          </v-avatar>
                        </v-card>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col class="py-1">
                        <v-text-field
                          label="قرار اللجنة"
                          filled
                          v-model="diagnoseDialog.decision"
                          :rules="reqRule"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3" class="py-1">
                        <v-row>
                          <v-col>
                            <v-checkbox
                              v-model="diagnoseDialog.isDeserve"
                              label="يستحق"
                            ></v-checkbox>
                          </v-col>
                          <v-col
                            class="d-flex just justify-center align-center"
                          >
                            <v-btn
                              elevation="4"
                              color="primary"
                              @click="
                                updateDiagnose();
                                isEditDiagonse = false;
                              "
                            >
                              {{ isEditDiagonse ? "تعديل" : "إضافة" }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-form>
                  <small class="error--text"
                    >* يجب الضغط على زر (حفظ / تعديل) بالأعلى لحفظ الفحص
                    الطبي</small
                  >
                  <v-row>
                    <v-col>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th>
                                رقم اللجنة
                              </th>
                              <th>
                                تاريخ اللجنة
                              </th>
                              <th>
                                قرار اللجنة
                              </th>
                              <th>
                                يستحق
                              </th>
                              <th>تعديل</th>
                              <th>حذف</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(diagnose, i) in cardsDiagnoses"
                              :key="i"
                            >
                              <td>{{ diagnose.committeNum }}</td>
                              <td>{{ diagnose.committeDate }}</td>
                              <td>{{ diagnose.decision }}</td>
                              <td>
                                <v-icon>{{
                                  diagnose.isDeserve ? "mdi-check" : "mdi-close"
                                }}</v-icon>
                              </td>
                              <td>
                                <v-btn
                                  @click="prepareDiagnosisEdit(diagnose)"
                                  icon
                                  tile
                                  class="primary--text"
                                  ><v-icon>mdi-account-edit</v-icon></v-btn
                                >
                              </td>
                              <td>
                                <v-btn
                                  @click="removeDiagnosis(i)"
                                  icon
                                  tile
                                  class="error--text"
                                  ><v-icon>mdi-account-remove</v-icon>
                                </v-btn>
                              </td>
                            </tr>
                            <tr
                              v-if="
                                cardsDiagnoses && cardsDiagnoses.length == 0
                              "
                            >
                              <td colspan="10" class="text-center">
                                لا يوجد كشوفات سابقة مسجلة
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-if="isCurrentRoute('cards/profile')"
        scrollable
        max-width="450"
        v-model="deleteModel"
      >
        <v-card :loading="loading" :disabled="disabled">
          <v-card-title class="text-subtitle-1">
            حذف فرد عائلة
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4">
            هل تريد حذف هذا الفرد ؟!
          </v-card-text>
          <v-card-actions class="px-4">
            <v-spacer></v-spacer>
            <v-btn
              class="px-6"
              color="error"
              outlined
              v-text="'رجوع'"
              @click="deleteModel = false"
            ></v-btn>
            <v-btn
              class="px-6"
              color="error"
              v-text="'حذف'"
              @click="deleteMember(wantToDelete)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-if="isCurrentRoute('cards/profile')"
        scrollable
        max-width="450"
        v-model="deleteEducationModel"
      >
        <v-card :loading="loading" :disabled="disabled">
          <v-card-title>
            حذف بيان الدراسة
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-4">
            هل تريد حذف بيان الدراسة
          </v-card-text>
          <v-card-actions class="px-4">
            <v-spacer></v-spacer>
            <v-btn
              class="px-6"
              color="error"
              outlined
              v-text="'رجوع'"
              @click="deleteEducationModel = false"
            ></v-btn>
            <v-btn
              class="px-6"
              color="error"
              v-text="'حذف'"
              @click="deleteEducation()"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
// TODO items shuld come from database
//  :rules="[v => /^\d+$/.test(v) || 'يجب ادخال ارقام فقط']"

export default {
  name: "profileFamily",
  props: [
    "conscripte",
    "card",
    "governorates",
    "refreshComponents",
    "orderFamilyMembers",
    "isMini"
  ],
  mounted() {
    this.fetchData();
    this.conscripte.isDeserve = this.isDeserve; // this is a function
  },
  data() {
    let marriageStates = [
      { title: "عزباء", value: 1 },
      { title: "متزوجة", value: 2 },
      { title: "مطلقة", value: 3 },
      { title: "أرملة", value: 4 }
    ];
    return {
      familyMembers: [],
      allowedRelations: [],
      reqRule: [v => !!v || "الحقل إجباري"],
      panel: 0,
      disableDeserve: false,
      imageName: "user-placeholder.jpg",
      valid: true,
      model: false,
      deleteModel: false,
      deleteEducationModel: false,
      loading: false,
      disabled: false,
      isEditDiagonse: false,
      membersData: [],
      familyMembersRel: [],
      religionItems: [],
      nationalityItems: [],
      image64: require("@/assets/inapp/user-placeholder.jpg"), // used in showing
      img: null,
      imgPath: require("@/assets/inapp/user-placeholder.jpg"), // used in edit
      marriageStates: [...marriageStates],
      wifeMarrStates: [
        ...marriageStates.filter(state => {
          return state.value !== 1;
        })
      ],
      daughterMarrStates: [
        ...marriageStates.filter(state => {
          return [1, 2].includes(state.value);
        })
      ],
      manMrageStates: [
        { title: "متزوج", value: 1 },
        { title: "مطلق", value: 2 },
        { title: "ارمله", value: 3 }
      ],

      isEdit: false,
      defaultDialog: {},
      dialog: {
        familyTypeRelId: null,
        cardId: null,

        name: "",
        nationalId: "",
        image: null,

        governorateId: null,
        address: "",
        job: null,
        religionId: null,
        imagePath: null,

        //computed in shildren case
        nationalityId: null,
        documentNum: null,
        isDeserve: false,
        motherId: null,

        //wife  marriage
        marriageDate: null,
        divorceDate: null,
        documentNum: null,
        marriageState: null,

        birthDate: null,
        isDead: false,

        pensionVal: null
      },
      educationDialog: {
        level: null,
        schoolName: null,
        applyDate: new Date().toISOString().substr(0, 10)
      },
      cardsDiagnoses: [],
      diagnoseDialog: {
        committeNum: "",
        committeDate: "",
        diagnosis: "",
        decision: "",
        isDeserve: null,
        fileInput: null, // this for the file input
        image: require("@/assets/inapp/user-placeholder.jpg"),
        imagePath: null // this for DB
      },
      wantToDelete: {},
      IdRequired: [
        //v => !!v || "يجب ادخال الرقم القومي",
        v =>
          v == "" ||
          v == null ||
          v.length <= 14 ||
          "الرقم القومي لا يزيد عن ١٤ رقم!",
        v => /^\d+$/.test(v) || v == "" || v == null || "يجب ادخال ارقام فقط",
        v => this.birthDate !== false || "الرقم القومي خطأ"
      ],

      dateRule: [
        v =>
          (!!v && new Date(v) != "Invalid Date" && new Date(v) <= new Date()) ||
          "يجب إدخال تاريخ صحيح"
      ],

      defaultInputs: [{}],
      recomputeCheckObj: 0 // using this value as a backdoor to recompute
    };
  },
  computed: {
    mothers() {
      return this.conscripte?.cardsFamilyMembers?.filter(
        x => x.familyTypeRelId == 1
      );
    },
    consMilitaryId() {
      return this.conscripte.militaryId;
    },
    birthDate() {
      let id = this.dialog.nationalId;
      let date = null;
      if (id?.length == 14) {
        let century = id.slice(0, 1);
        let year = id.slice(1, 3);
        let month = id.slice(3, 5);
        let day = id.slice(5, 7);
        switch (century) {
          case "2":
            date = "19" + year + "-" + month + "-" + day;
            break;

          case "3":
            date = "20" + year + "-" + month + "-" + day;
            break;
        }

        // wrong national Id
        return date == null || new Date(date) == "Invalid Date" ? false : date;
      }
      return -1;
    },
    /**
     * nationalId: true || false
     */
    checkObj() {
      let cardId = this.card?.id,
        checkObj = {};
      this.recomputeCheckObj;
      this.conscripte.cardsFamilyMembers.forEach(member => {
        checkObj[member.id] = member.cardId == cardId ? true : false;
      });

      return checkObj;
    },
    age: {
      get() {
        return this.dialog.birthDate != null && this.dialog.birthDate != false
          ? this.getAgeInYears(this.dialog.birthDate)
          : "ادخل تاريخ ميلاد صحيح";
      },
      set(newValue) {
        console.log(newValue);
      }
    }
  },

  methods: {
    fetchData() {
      this.defaultDialog = { ...this.dialog };
      this.api("global/get_all", {
        table: "cardsFamilyTypeRel"
      })
        .then(x => {
          let familyMembersRel = x.data.map(el => {
            return {
              title: el.displayedText,
              value: el.id,
              relation: el.relation
            };
          });

          this.familyMembersRel = familyMembersRel;
        })
        .catch(err => {
          console.log(err);
          this.showError("حدث خطأ في تحميل البيانات");
        });

      // religions
      this.api("global/get_all", {
        table: "religions"
      })
        .then(x => {
          let religionItems = x.data.map(religion => {
            return { title: religion.displayedText, value: religion.id };
          });

          this.religionItems = religionItems;
        })
        .catch(err => {
          console.log(err);
          this.showError("حدث خطأ في تحميل البيانات");
        });

      // nationalities
      this.api("global/get_all", {
        table: "nationalities"
      })
        .then(x => {
          let nationalityItems = x.data.map(nationality => {
            return { title: nationality.displayedText, value: nationality.id };
          });
          this.nationalityItems = nationalityItems;
        })
        .catch(err => {
          console.log(err);
          this.showError("حدث خطأ في تحميل البيانات");
        });
    },
    prepareCheckObj() {
      let cardId = this.card?.id;
      if (cardId) {
        this.conscripte.cardsFamilyMembers.forEach(member => {
          this.$set(
            this.checkObj,
            member.id,
            member.cardId == cardId ? true : false
          );
        });
      }
    },
    dialogForAdd(familyMember) {
      this.dialog.familyTypeRelId = Number(familyMember);

      // I'm not sure what's the reason to have to reset the validation
      this.$refs.educationForm?.resetValidation();
      this.model = true;
    },
    /**
     * filtering allowed Realtions according to the type of card
     */
    filterFamilyMembers(typeName = null) {
      if (!typeName) {
        return;
      }
      switch (typeName) {
        case "شخصية بالمعاش":
          this.allowedRelations = [];
          break;
        case "عائلية بالمعاش":
          this.allowedRelations = ["son", "daughter", "wife"];
          break;
        case "عائلية بالخدمة":
          this.allowedRelations = ["son", "daughter", "wife"];
          break;
        case "والدين":
          this.allowedRelations = ["mother", "father"];
          break;
        default:
          this.allowedRelations = [];
          break;
      }
    },
    closeDialog() {
      this.isEdit = false;
      this.$set(this, "educationDialog", {
        level: "",
        schoolName: "",
        applyDate: new Date().toISOString().substr(0, 10)
      });
      this.$refs.educationForm?.resetValidation();
      delete this.educationDialog.id;
      delete this.educationDialog.memberId;
      this.panel = 0;

      this.$refs.diagnoseForm?.reset();
      this.$refs.diagnoseForm?.resetValidation();
      this.cardsDiagnoses = [];

      this.dialog = { ...this.defaultDialog };
      //this.dialog.familyMembersRel = 2;
      this.$refs.form?.reset();
      this.$refs.form?.resetValidation();

      this.image64 = require("@/assets/inapp/user-placeholder.jpg"); // used in showing
      this.img = null;
      this.imgPath = require("@/assets/inapp/user-placeholder.jpg"); // used in edit
      this.model = false;
    },

    save() {
      let fMemberId = this.dialog.familyTypeRelId,
        relationObj = this.familyMembersRel.find(relation => {
          return relation.value == fMemberId;
        });

      if (this.$refs.form.validate()) {
        // if (true) {
        this.dialog.birthDate =
          this.birthDate == -1 ? this.dialog.birthDate : this.birthDate;
        this.dialog.consMilitaryId = this.consMilitaryId;

        this.createMember();
      }
    },

    async createMember() {
      let dialog = this.dialog,
        that = this;
      this.loading = this.disabled = true;

      if (this.img != null) {
        let ext = this.img.path.split(".").pop(),
          newPath = `${this.$store.getters.getTcUploadPath}\\${
            this.dialog.consMilitaryId
          }\\members\\${this.dialog.nationalId}_${this.getRandom()}.${ext}`;

        // first upload the
        await this.upload(this.img.path, newPath).catch(err => {
          this.showError("لم يتم رفع الصورة على السيرفر");
          console.log(err);
          this.loading = this.disabled = false;
          return;
        });
        dialog["imagePath"] = newPath;
      }
      console.log({ ...dialog });
      await this.api("global/check_or_create_by_key", {
        table: "cardsFamilyMembers",
        where: {
          nationalId: dialog.nationalId
        },
        params: dialog
      })
        .then(x => {
          console.log("test");
          // -1 means this data already exists
          if (x.data != -1) {
            this.showSuccess("تمت الإضافة");
          } else if (x.data == -1) {
            this.showError("هذا الفرد موجود بالفعل");
          }
          that.dialog = dialog = x.data; // to get the Id
          console.log(dialog.id);
          console.log(dialog);
        })
        .then(async () => {
          if (this.isStudent(dialog)) {
            await this.api("global/create_one", {
              table: "cardsEducations",
              where: {
                memberId: dialog.id,
                ...that.educationDialog
              }
            }).catch(err => {
              console.log(err);
              this.showError("لم يتم إضافة بيانات التعليم");
            });
          }
          return;
        })
        .then(this.updateDBDiagnoses)
        .then(this.getDBFamilyMembers)
        .then(x => {
          //this.refreshComponents();
          this.closeDialog();
          this.$emit("checkIsUpdatingAllowed");
        })
        .catch(x => {
          console.log(x);
          if (
            x.data?.message ==
            "Conversion failed when converting date and/or time from character string."
          ) {
            this.showError("تأكد من صحة التواريخ");
          } else {
            this.showError("لم يتم الحفظ");
          }
        })
        .finally(() => {
          this.loading = this.disabled = false;
        });
    },
    async updateMember() {
      this.loading = this.disabled = true;
      let that = this;

      if (this.img != null) {
        let ext = this.img.path.split(".").pop(),
          newPath = `${this.$store.getters.getTcUploadPath}\\${
            this.dialog.consMilitaryId
          }\\members\\${this.dialog.nationalId}_${this.getRandom()}.${ext}`;

        // first upload the
        await this.upload(this.img.path, newPath).catch(err => {
          if (err.error) {
            console.log(err.error);
          }
          console.log(err);
          this.loading = this.disabled = false;
          return;
        });
        this.dialog["imagePath"] = newPath;
      }
      await this.api("global/update_one", {
        table: "cardsFamilyMembers",
        where: {
          id: this.dialog.id
        },
        update: this.dialog
      })
        .then(async x => {
          // if it's not a student
          if (!that.isStudent(that.dialog)) {
            return;
          }

          // if it's the first time to add the education details then create it
          if (that.dialog.cardsEducation == null) {
            await this.api("global/create_one", {
              table: "cardsEducations",
              where: {
                memberId: that.dialog.id,
                ...that.educationDialog
              }
            }).catch(err => {
              this.showError("فشل في إنشاء بيان تعليمي");
              console.log(err);
            });
          } else if (typeof that.dialog.cardsEducation == "object") {
            // if then update it
            await this.api("global/update_one", {
              table: "cardsEducations",
              where: {
                memberId: that.dialog.id
              },
              update: that.educationDialog
            }).catch(err => {
              this.showError("فشل في إنشاء البيان التعليمي");
              console.log(err);
            });
          }
        })
        .then(this.updateDBDiagnoses)
        .then(async x => {
          this.showSuccess("تم التعديل بنجاح");
          await this.getDBFamilyMembers();
          //this.refreshComponents();
          this.closeDialog();
          this.$emit("checkIsUpdatingAllowed");
        })
        .catch(err => {
          this.showError("لم يتم التعديل");
          console.log(err);
        })
        .finally(() => {
          this.loading = this.disabled = false;
        });
    },

    async deleteMember(member) {
      let section = this.$store.getters.getCurrSection;
      if (section != 0) {
        this.showError(
          "غير مسموح لك اجراء هذه العملية إرجع لرئيس الفرع لعرض الموقف"
        );
        this.deleteModel = false;
        return;
      }

      this.loading = this.disabled = true;
      // if it's wife delete her children
      if (this.isWife(member)) {
        await this.clearAttachToChild(member);
      }
      this.api("global/delete_all", {
        table: "cardsFamilyMembers",
        where: {
          id: member.id
        }
      })
        .then(x => {
          let index = this.conscripte.cardsFamilyMembers.indexOf(member);
          // an issue apear after deleting the last members
          if (this.conscripte.cardsFamilyMembers.length == 1) {
            this.conscripte.orderedFamilyMembers = [];
          } else {
            this.conscripte.cardsFamilyMembers.splice(index, 1);
          }
          // this.refreshComponents();
          this.deleteModel = false;
        })
        .then(this.getDBFamilyMembers)
        .then(() => {
          this.$emit("checkIsUpdatingAllowed");
        })
        .catch(x => {
          this.showError("فشل الحذف");
          console.log(x);
        })
        .finally(() => {
          this.loading = this.disabled = false;
        });
    },
    async getDBFamilyMembers() {
      let that = this;
      return await this.api("global/get_all", {
        table: "cardsFamilyMembers",
        where: {
          consMilitaryId: this.consMilitaryId
        },
        include: [
          { model: "cardsFamilyTypeRel", required: false },
          { model: "religions", required: false },
          { model: "nationalities", required: false },
          { model: "governorates", required: false },
          { model: "cardsEducations", required: false },
          { model: "cardsDiagnoses", required: false }
        ],
        order: [["cardsDiagnoses", "committeDate", "asc"]]
      })
        .then(x => {
          //this.conscripte.cardsFamilyMembers = x.data;
          that.$set(this.conscripte, "cardsFamilyMembers", x.data);
          that.orderFamilyMembers();
          that.$emit("membersChanged");
        })
        .catch(err => {
          console.log(err);
        });
    },
    isWife(member) {
      return member?.familyTypeRelId == 1;
    },
    isSon(member) {
      return member?.familyTypeRelId == 2;
    },
    isDaughter(member) {
      return member?.familyTypeRelId == 3;
    },
    isFather(member) {
      return member?.familyTypeRelId == 4;
    },
    isMother(member) {
      return member?.familyTypeRelId == 5;
    },
    getMarriageState(member) {
      let state = this.marriageStates.find(state => {
        return state.value == member.marriageState;
      })?.title;
      return state ? state : false;
    },
    async clearAttachToChild(member) {
      return await this.api("global/update_one", {
        table: "cardsFamilyMembers",
        where: {
          motherId: member.id
        },
        update: {
          motherId: null
        }
      })
        .then(x => {
          console.log(x);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // check the isDeserve property which came from DB and then check all default
    // if isDeserve property is false then it's false without checking the rest
    isDeserve(member) {
      // check is dead when the dialog is open
      if (this.checkIsDead()) return false;

      if (this.checkLastDiagnosis(member)) return true;
      // checking the db property
      if (!member.isDeserve) return false;

      if (this.IsDefaultDeserve(member)) return true;
      else return false;
    },
    // Doesn't check isDeserve that came from database
    // this is used during the adding process
    IsDefaultDeserve(member) {
      // @TODO remove repeated actions

      // check is dead when the dialog is open
      if (this.checkIsDead()) return false;

      // check deserving when the dialog is open
      if (this.checkLastDiagnosis()) return true;
      switch (true) {
        case this.isWife(member):
          if (
            !this.getMarriageState(member) ||
            this.getMarriageState(member) == "مطلقة"
          ) {
            return false;
          }
          break;
        case this.isSon(member):
          if (this.isStudent(member)) return true;
          if (!member.birthDate || this.getAgeInYears(member.birthDate) > 18) {
            return false;
          }
          break;
        case this.isDaughter(member):
          if (
            !this.getMarriageState(member) ||
            this.getMarriageState(member) == "متزوجة"
          ) {
            return false;
          }
          if (this.isStudent(member)) return true;
          if (!member.birthDate || this.getAgeInYears(member.birthDate) > 28) {
            return false;
          }
          break;

        case this.isFather(member):
        case this.isMother(member):
          if (member.pensionVal > 150) {
            return false;
          }
          break;
        default:
          console.log("Why");
          return false;
      }
      return true;
    },

    /**
     * there are three cases
     * 1 => while adding
     * 2 => while editting
     * 3 => while showing them in the table
     */
    isStudent(member) {
      // while adding
      // while editting
      if (
        this.model &&
        (this.$refs.educationForm?.validate() ||
          (this.educationDialog.level && this.educationDialog.schoolName)) &&
        // students have to renew educational information every year
        this.getAgeInYears(this.educationDialog.applyDate) == 0
      )
        return true;

      // while showing them in the table
      if (
        member.cardsEducation != null &&
        this.getAgeInYears(member.cardsEducation.applyDate) == 0
      )
        return true;

      return false;
    },
    checkIsDead(member = false) {
      return member ? member.isDead : this.dialog ? this.dialog.isDead : false;
    },
    checkLastDiagnosis(member = false) {
      let cardsDiagnoses = member.cardsDiagnoses
        ? member.cardsDiagnoses
        : this.cardsDiagnoses;

      let length = cardsDiagnoses?.length;
      return length ? cardsDiagnoses[length - 1].isDeserve : false;
    },
    getAgeInYears(birthDate) {
      birthDate = new Date(birthDate);
      let ageDt = new Date(Date.now() - birthDate.getTime()).getUTCFullYear(),
        age = Math.abs(ageDt - 1970);
      return age;
    },
    watchDialog() {
      if (this.IsDefaultDeserve(this.dialog)) {
        this.disableDeserve = false;
      } else {
        this.dialog.isDeserve = false;
        this.disableDeserve = true;
      }
    },
    uploadImage() {},
    updateDiagnose() {
      if (!this.$refs.diagnoseForm.validate()) return;

      let defaultDiagnose = {
        committeNum: "",
        committeDate: "",
        diagnosis: "",
        decision: "",
        isDeserve: null,
        imagePath: null,
        fileInput: null,
        image: null
      };
      let diagnoses = this.cardsDiagnoses,
        // find the index of the object of it exists first by Id(meaning from DB) else by committenum
        indexById = diagnoses.findIndex(diagnose => {
          if ("id" in diagnose) return diagnose?.id == this.diagnoseDialog.id;
        }),
        indexByCommitteNum = diagnoses.findIndex(diagnose => {
          return diagnose.committeNum == this.diagnoseDialog.committeNum;
        }),
        index = indexById != -1 ? indexById : indexByCommitteNum;
      // it has the same committe number so replace it
      if (index != -1) {
        diagnoses[index] = this.diagnoseDialog;
        this.$set(diagnoses, index, this.diagnoseDialog);
        this.$set(this, "diagnoseDialog", defaultDiagnose);
        this.$refs.diagnoseForm.resetValidation();
        return;
      }

      // if it's not push a new one
      this.cardsDiagnoses.push(this.diagnoseDialog);
      this.diagnoseDialog = defaultDiagnose;
      this.$refs.diagnoseForm.resetValidation();
    },
    previewDiagnosisImg() {
      this.diagnoseDialog.image = this.diagnoseDialog.fileInput
        ? URL.createObjectURL(this.diagnoseDialog.fileInput)
        : require("@/assets/inapp/user-placeholder.jpg");
    },
    prepareDiagnosisEdit(diagnose) {
      diagnose.fileInput = "fileInput" in diagnose ? diagnose.fileInput : null;
      // diagnose.image =
      //   diagnose.fileInput != null
      //     ? URL.createObjectURL(diagnose.fileInput)
      //     : require("@/assets/inapp/user-placeholder.jpg");
      diagnose.image = null;
      this.diagnoseDialog = { ...diagnose };
      this.isEditDiagonse = true;
    },
    async updateDBDiagnoses() {
      let cardsDiagnoses = this.cardsDiagnoses,
        that = this;
      console.log("اتبعت");
      console.log("dialog: ", this.dialog);
      let asyncedLoop = () => {
        return new Promise((success, failure) => {
          (async function loop() {
            // there's no cardsDiagnoses
            if (!cardsDiagnoses.length) {
              success(true);
            }
            for (let i = 0; i < cardsDiagnoses.length; i++) {
              let diagnosis = cardsDiagnoses[i];

              // first upload image if new image exists
              if ("fileInput" in diagnosis && diagnosis.fileInput) {
                let ext = diagnosis.fileInput.path.split(".").pop(),
                  nationalId = that.dialog.nationalId.trim()
                    ? that.dialog.nationalId.trim()
                    : "null",
                  newPath = `${that.$store.getters.getTcUploadPath}\\${
                    that.conscripte.militaryId
                  }\\members\\diagnoses\\${nationalId}_${that.getRandom()}.${ext}`;
                await that
                  .upload(diagnosis.fileInput.path, newPath)
                  .then(async x => {
                    diagnosis["imagePath"] = newPath;
                  });
              }
              delete diagnosis.image;
              delete diagnosis.fileInput;

              // this means this is comes from database // so update them
              if ("id" in diagnosis) {
                console.log("update them man");
                await that
                  .api("global/update_one", {
                    table: "cardsDiagnoses",
                    where: {
                      id: diagnosis.id
                    },
                    update: diagnosis
                  })
                  .catch(err => {
                    console.log(err);
                  });
              } else {
                // they are new so create them
                console.log("create them man");
                await that
                  .api("global/create_one", {
                    table: "cardsDiagnoses",
                    where: {
                      memberId: that.dialog.id,
                      ...diagnosis
                    }
                  })
                  .catch(err => {
                    this.showError("لم يتم إنشاء سجلات الكشف الطبي");
                    console.log(err);
                  });
              }
            }
            success(true);
          })();
        });
      };
      await asyncedLoop();
      console.log("رجع");
    },
    async removeDiagnosis(index) {
      let diagnose = this.cardsDiagnoses[index];

      // it's from DB
      if ("id" in diagnose) {
        let section = this.$store.getters.getCurrSection;
        if (section != 0) {
          this.showError(
            "غير مسموح لك اجراء هذه العملية إرجع لرئيس الفرع لعرض الموقف"
          );
          return;
        }
        await this.api("global/delete_all", {
          table: "cardsDiagnoses",
          where: {
            id: diagnose.id
          }
        })
          .then(() => {
            console.log("deleted 0them ya man");
            this.cardsDiagnoses.splice(index, 1);
          })
          .catch(err => {
            this.showError("لم يتم الحذف");
            console.log(err);
          });
      } else {
        this.cardsDiagnoses.splice(index, 1);
      }
    },
    previewImg() {
      this.imgPath = this.img ? URL.createObjectURL(this.img) : null;
    },
    async getImageBase64(imagePath) {
      if (
        imagePath != null &&
        !imagePath.includes("user-placeholder") &&
        imagePath
      ) {
        await this.getImage(imagePath).then(x => {
          if (x) {
            this.imgPath = this.image64 = x;
          }
        });
      }
    },
    async deleteEducation() {
      let id = this.educationDialog.id,
        that = this;
      this.loading = this.disabled = true;
      await this.api("global/delete_all", {
        table: "cardsEducations",
        where: {
          id: id
        }
      })
        .then(x => {
          that.showSuccess("تم الحذف");
          that.$refs.educationForm.reset();
          that.$refs.educationForm.resetValidation();
          delete that.educationDialog.id;
          that.deleteEducationModel = false;
        })
        .catch(err => {
          console.log(err);
          that.showError("فشل الحذف");
        })
        .finally(() => {
          this.loading = this.disabled = false;
        });
    },
    editMember(member) {
      this.dialog = { ...member };
      this.educationDialog =
        member.cardsEducation == null
          ? this.educationDialog
          : { ...member.cardsEducation };
      this.cardsDiagnoses =
        member.cardsDiagnoses == undefined || member.cardsDiagnoses.length == 0
          ? []
          : [...member.cardsDiagnoses];

      this.model = true;
      this.isEdit = true;
      this.getImageBase64(this.dialog.imagePath);
    }
  },

  watch: {
    birthDate() {
      if (this.birthDate == -1) {
        this.dialog.birthDate = null;
      } else {
        this.dialog.birthDate = this.birthDate;
      }
    },
    "conscripte.orderedFamilyMembers": {
      deep: true,
      immediate: true,
      handler() {
        console.log("ordered changed");
        this.familyMembers = this.conscripte?.orderedFamilyMembers
          ? this.conscripte.orderedFamilyMembers
          : [];
      }
    },
    dialog: {
      deep: true,
      handler() {
        this.watchDialog();
      }
    },
    educationDialog: {
      deep: true,
      handler() {
        this.watchDialog();
      }
    },
    cardsDiagnoses: {
      deep: true,
      handler() {
        this.watchDialog();
      }
    },
    "diagnoseDialog.imagePath": {
      deep: true,
      handler(v) {
        if (v && v != null) {
          let that = this;
          this.getImage(v).then(x => {
            if (x) {
              that.diagnoseDialog.image = null;
              that.diagnoseDialog.image = x;
            }
          });
        } else if (
          this.diagnoseDialog.fileInput &&
          this.diagnoseDialog.fileInput != null
        ) {
          this.diagnoseDialog.image = URL.createObjectURL(
            this.diagnoseDialog.fileInput
          );
        } else {
          this.diagnoseDialog.image = require("@/assets/inapp/user-placeholder.jpg");
        }
      }
    }
  }
};
</script>
<style scoped>
.image-selector {
  position: absolute;
  left: calc(50% - 16px);
  margin: 0;
  padding: 0;
  bottom: 30px;
}
</style>
