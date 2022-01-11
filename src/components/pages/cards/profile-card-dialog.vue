<template>
  <v-dialog persistent scrollable v-model="model" max-width="1000">
    <v-card :disabled="disabled" :loading="loading">
      <v-card-title>
        إصدار / تعديل بطاقة علاجية
        <v-spacer></v-spacer>

        <div>
          <span>
            <v-btn
              color="primary"
              class="px-6"
              large
              @click="
                refreshStepperValidation();
                isUpdatingAllowed
                  ? updateDB()
                  : showError(
                      'لتتمكن من الإضافة اصلح الاخطاء التالية : </br> * ' +
                        errorsToAdd.join('</br> * ')
                    );
              "
            >
              {{ card.id ? "حفظ التعديلات" : "إصدار البطاقة" }}
            </v-btn>
          </span>

          <v-btn
            color="error"
            class="px-6 mx-5"
            outlined
            large
            @click="model = false"
          >
            اغلاق
          </v-btn>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-1">
        <v-stepper ref="stepper" v-model="step" vertical>
          <v-stepper-step
            :rules="[
              () =>
                card.cardNumber &&
                card.fileNumber &&
                card.typeId &&
                validateMainData()
            ]"
            editable
            :complete="step > 1"
            step="1"
            ref="step1"
          >
            البيانات الأساسية
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-form ref="mainDataForm">
              <v-row class="mt-5 ml-5">
                <template v-for="(input, i) in mainDataInputs">
                  <v-col
                    class="pb-0 pt-0"
                    :cols="input.cols ? input.cols : 12"
                    :sm="input.cols ? input.cols : 12"
                    :lg="input.cols ? input.cols : 6"
                    :xl="input.cols ? input.cols : 4"
                    :key="i"
                  >
                    <v-text-field
                      v-if="input.type && input.type == 'text'"
                      :persistent-hint="input.hint ? true : false"
                      :hide-details="false"
                      :hint="input.hint"
                      v-model="card[input.model]"
                      @change="'onChange' in input ? input.onChange() : 1"
                      :disabled="input.enabled && !card[input.enabled]"
                      filled
                      :label="input.label"
                      :rules="input.rules ? input.rules : []"
                    ></v-text-field>
                    <v-autocomplete
                      v-else-if="input.type && input.type == 'select'"
                      :label="input.label"
                      :hide-details="input.hint ? true : false"
                      :hint="input.hint"
                      :disabled="input.disabled ? true : false"
                      :items="selects[input.model].data"
                      :item-text="selects[input.model].item_text"
                      :item-value="selects[input.model].item_value"
                      v-model="card[input.model]"
                      filled
                      @change="'onChange' in input ? input.onChange() : 1"
                      :loading="selects[input.model].loading"
                      :rules="input.rules ? input.rules : []"
                    ></v-autocomplete>

                    <v-btn-toggle
                      v-else-if="input.type && input.type == 'btn-toggle'"
                      class="d-block"
                      v-model="card.isCanceled"
                      mandatory
                    >
                      <v-btn
                        width="50%"
                        :color="card.isCanceled ? '' : 'success white--text'"
                        :value="false"
                      >
                        سارية
                      </v-btn>
                      <v-btn
                        width="50%"
                        :color="card.isCanceled ? 'error white--text' : ''"
                        :value="true"
                      >
                        ملغية
                      </v-btn>
                    </v-btn-toggle>

                    <v-text-field
                      v-else-if="input.type && input.type == 'date'"
                      type="date"
                      v-model="card[input.model]"
                      :label="input.label"
                      filled
                      clearable
                      @change="'onChange' in input ? input.onChange() : 1"
                      :rules="input.rules ? input.rules : []"
                      :readonly="input.readonly ? input.readonly : false"
                    ></v-text-field>

                    <v-textarea
                      v-if="input.type && input.type == 'textarea'"
                      :label="input.label"
                      filled
                      rows="1"
                      @change="'onChange' in input ? input.onChange() : 1"
                      v-model="card[input.model]"
                    ></v-textarea>
                  </v-col>
                </template>

                <!-- <v-col>
                  <v-btn-toggle
                    class="d-block"
                    v-model="card.isCanceled"
                    mandatory
                  >
                    <v-btn
                      width="50%"
                      :color="card.isCanceled ? '' : 'success white--text'"
                      :value="false"
                    >
                      سارية
                    </v-btn>
                    <v-btn
                      width="50%"
                      :color="card.isCanceled ? 'error white--text' : ''"
                      :value="true"
                    >
                      ملغية
                    </v-btn>
                  </v-btn-toggle>
                </v-col> -->
              </v-row>
            </v-form>
            <v-btn
              class="mt-5"
              large
              color="primary"
              @click="validateMainData() ? (step = 2) : false"
            >
              إستمرار
            </v-btn>
          </v-stepper-content>

          <v-stepper-step
            editable
            :rules="[() => !isCardExpired()]"
            :complete="step > 2"
            step="2"
            ref="step2"
          >
            تاريخ البطاقة
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-expand-transition>
              <v-form
                ref="cardTrackingForm"
                v-show="isAddingCardTracking || cardTracking.trackingId"
              >
                <v-row class="ml-5">
                  <v-col class="pt-6">
                    <v-row>
                      <template v-for="(input, i) in cardTrackingInputs">
                        <v-col
                          class="pb-0 pt-0"
                          :cols="input.cols ? input.cols : 12"
                          :sm="input.cols ? input.cols : 12"
                          :lg="input.cols ? input.cols : 6"
                          :xl="input.cols ? input.cols : 4"
                          :key="i"
                        >
                          <v-text-field
                            v-if="input.type && input.type == 'text'"
                            :persistent-hint="input.hint ? true : false"
                            :hide-details="false"
                            :hint="input.hint"
                            v-model="cardTracking[input.model]"
                            filled
                            :label="input.label"
                            :rules="input.rules ? input.rules : []"
                          ></v-text-field>
                          <v-autocomplete
                            v-else-if="input.type && input.type == 'select'"
                            :label="input.label"
                            :hide-details="input.hint ? true : false"
                            :hint="input.hint"
                            :disabled="input.disabled ? true : false"
                            :items="selects[input.model].data"
                            :item-text="selects[input.model].item_text"
                            :item-value="selects[input.model].item_value"
                            v-model="cardTracking[input.model]"
                            filled
                            @change="'onChange' in input ? input.onChange() : 1"
                            :loading="selects[input.model].loading"
                            :rules="input.rules ? input.rules : []"
                          ></v-autocomplete>

                          <v-text-field
                            v-else-if="input.type && input.type == 'date'"
                            type="date"
                            v-model="cardTracking[input.model]"
                            :label="input.label"
                            filled
                            clearable
                            @change="'onChange' in input ? input.onChange() : 1"
                            :rules="input.rules ? input.rules : []"
                            :readonly="input.readonly ? input.readonly : false"
                          ></v-text-field>

                          <v-textarea
                            v-if="input.type && input.type == 'textarea'"
                            :label="input.label"
                            filled
                            rows="1"
                            v-model="cardTracking[input.model]"
                          ></v-textarea>
                        </v-col>
                      </template>

                      <v-col :cols="12">
                        <v-btn
                          @click="updateCardTracking()"
                          large
                          color="success"
                        >
                          {{ isAddingCardTracking ? "اضافة" : "تعديل" }}
                        </v-btn>
                        <v-btn
                          @click="
                            resetCardTracking();
                            prepareInputs();
                          "
                          :disabled="!cardTrackings.length"
                          large
                          color="error"
                          outlined
                          class="mr-5"
                        >
                          إلغاء
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col class="pic-col" cols="4">
                    <v-card class="pic-card" outlined>
                      <v-card-title class="text-subtitle-1">
                        صورة الختم
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text class="justify-center d-flex">
                        <v-avatar rounded size="100%" color="secondary">
                          <v-img
                            contain
                            max-width="350"
                            :src="cardTracking.img"
                          >
                            <v-file-input
                              class="image-selector"
                              hide-input
                              show-size
                              @change="previewImgFile"
                              v-model="cardTracking.imgFile"
                              accept="image/png, image/jpeg, image/bmp"
                            ></v-file-input>
                          </v-img>
                        </v-avatar>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-form>
            </v-expand-transition>
            <v-row class="pl-15 mt-10">
              <v-spacer></v-spacer>
              <div>
                <v-btn
                  @click="isAddingCardTracking = true"
                  :disabled="isAddingCardTracking || cardTracking.trackingId"
                  large
                  color="primary"
                  >تجديد</v-btn
                >
              </div>
            </v-row>
            <v-simple-table class="my-5">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>
                      تاريخ التجديد
                    </th>
                    <th>
                      تاريخ الإنتهاء
                    </th>
                    <th>
                      المراجع
                    </th>
                    <th>تعديل</th>
                    <th>حذف</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(track, i) in cardTrackings" :key="i">
                    <td>
                      {{ track.dateOfRenewal }}
                    </td>
                    <td>
                      {{ track.dateOfExpiration }}
                    </td>
                    <td>
                      {{ getReferenceName(track.referenceId) }}
                    </td>
                    <td>
                      <v-btn
                        @click="toEditCardtracking(track)"
                        icon
                        tile
                        :disabled="
                          isAddingCardTracking || cardTracking.trackingId
                        "
                        color="primary"
                        ><v-icon>mdi-account-edit</v-icon></v-btn
                      >
                    </td>
                    <td>
                      <v-btn
                        icon
                        tile
                        text
                        color="error"
                        :disabled="
                          isAddingCardTracking || cardTracking.trackingId
                        "
                        @click="
                          toDeleteCardTracking = track;
                          toDeleteCardTrackingModel = true;
                        "
                        ><v-icon>mdi-account-remove</v-icon></v-btn
                      >
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-dialog
              v-if="isCurrentRoute('cards/profile')"
              scrollable
              max-width="450"
              v-model="toDeleteCardTrackingModel"
            >
              <v-card :loading="loading" :disabled="disabled">
                <v-card-title class="error white--text">
                  حذف تجديد
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pt-4">
                  هل أنت متأكد انك تريد الحذف ؟
                </v-card-text>
                <v-card-actions class="px-4">
                  <v-spacer></v-spacer>
                  <v-btn
                    class="px-6"
                    color="error"
                    outlined
                    v-text="'رجوع'"
                    @click="
                      toDeleteCardTracking = {};
                      toDeleteCardTrackingModel = false;
                    "
                  ></v-btn>
                  <v-btn
                    class="px-6"
                    color="error"
                    v-text="'حذف'"
                    @click="deleteCardTracking(toDeleteCardTracking)"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <span
              @click="
                card.typeId == 1
                  ? showInfo('هذه بطاقة شخصية لا يضاف لها أفراد عائلة')
                  : 1
              "
            >
              <v-btn
                :disabled="card.typeId == 1"
                color="primary"
                @click="step = 3"
                large
                class="ml-5"
              >
                إستمرار
              </v-btn>
            </span>
            <v-btn color="secondary" outlined @click="step = 1" large>
              عودة
            </v-btn>
          </v-stepper-content>

          <v-stepper-step
            :editable="!['', null, 1].includes(card.typeId)"
            :rules="[() => !isNoMemberCheckedVar]"
            :complete="step > 3"
            step="3"
            ref="step3"
          >
            أفراد العائلة
          </v-stepper-step>

          <v-stepper-content class="pr-0" step="3">
            <profile-family
              ref="profileFamilyRef"
              v-if="Object.keys(conscripte).length > 0"
              :conscripte="conscripte"
              :isMini="true"
              :card="card"
              :governorates="governorates"
              :refreshComponents="refreshComponents"
              :orderFamilyMembers="orderFamilyMembers"
              @checkIsUpdatingAllowed="checkIsUpdatingAllowed"
            ></profile-family>
            <v-btn
              color="secondary"
              outlined
              @click="step = 2"
              large
              class="mr-5"
            >
              عودة
            </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "cardDialog",
  props: [
    "conscripte",
    "governorates",
    "refreshComponents",
    "orderFamilyMembers",
    "allowedCards",
    "updateCards",
    "familyMembersRel"
  ],
  components: {
    profileFamily: () => import("@/components/pages/cards/profile-family.vue")
  },
  data() {
    let numRule = [v => !isNaN(v) || "يجب إدخال ارقام فقط"],
      reqRule = [v => ![null, ""].includes(v) || "الحقل إجباري"],
      futureDateRule = [v => !(new Date(v) > new Date()) || "التاريخ خطأ"];
    return {
      model: false,
      loading: false,
      disabled: false,
      step: 1,
      isUpdatingAllowed: false,
      isAddingCardTracking: false,
      toDeleteCardTracking: null,
      toDeleteCardTrackingModel: false, // will be the cardTracking object
      errorsToAdd: [],
      cardRef: {},
      cardTrackingRef: {},
      card: {
        cardNumber: null,
        fileNumber: null,
        typeId: null,
        cancelationReason: null,
        isCanceled: false
      },
      cardTracking: {
        dateOfRenewal: new Date().toISOString().substr(0, 10),
        dateOfExpiration: null,
        referenceId: this.$store.state.currentUser.userId,
        hospitalId: null,
        certificantId: null,
        officeId: 28,
        notes: null,
        renewType: null,
        imagePath: null, // from DB
        img: require("@/assets/inapp/user-placeholder.jpg"), // connected to v-img
        imgFile: null
      },
      cardTrackings: [],
      deletedCardTrackings: [], // save them here to delete them at the end
      mainDataInputs: [
        {
          label: "رقم البطاقة العلاجية",
          model: "cardNumber",
          type: "text",
          cols: 6,
          hint: "",
          order: 0,
          rules: [...numRule, ...reqRule]
        },
        {
          label: "رقم الحافظة",
          model: "fileNumber",
          type: "text",
          cols: 6,
          hint: "",
          order: 1,
          rules: reqRule
        },
        {
          label: "نوع البطاقة",
          model: "typeId",
          type: "select",
          cols: 6,
          hint: "",
          order: 2,
          rules: reqRule,
          onChange: this.onChangeTypeId,
          disabled: false
        },
        {
          model: "isCanceled",
          type: "btn-toggle",
          cols: 6
        },
        {
          label: "سبب الالغاء",
          model: "cancelationReason",
          enabled: "isCanceled", // تحنيكة
          type: "text",
          cols: 12,
          hint: ""
        }
      ],
      cardTrackingInputs: [
        {
          label: "تاريخ التجديد",
          model: "dateOfRenewal",
          type: "date",
          cols: 6,
          hint: "",
          order: 3,
          rules: [...reqRule, ...futureDateRule]
        },
        {
          label: "تاريخ الانتهاء",
          model: "dateOfExpiration",
          type: "date",
          cols: 6,
          hint: "",
          order: 4,
          rules: reqRule,
          value: null
        },
        {
          label: "المستشفى المعالج",
          model: "hospitalId",
          type: "select",
          cols: 6,
          hint: "",
          order: 5,
          rules: reqRule,
          value: null
        },
        {
          label: "مكتب",
          model: "officeId",
          type: "select",
          cols: 6,
          hint: ""
        },

        {
          label: "المراجع",
          model: "referenceId",
          type: "select",
          cols: 12,
          hint: "",
          rules: reqRule,
          disabled: this.isAdmin() ? false : true
        },
        {
          label: "المصدق",
          model: "certificantId",
          type: "select",
          cols: 6,
          hint: "",
          order: 3,
          rules: reqRule
        },

        {
          label: "نوع الإصدار",
          model: "renewType",
          type: "select",
          cols: 6,
          hint: "",
          order: 2,
          rules: reqRule,
          disabled: false
        },
        {
          label: "ملاحظات",
          model: "notes",
          type: "textarea",
          cols: 12,
          hint: "",
          order: 7,
          value: ""
        }
      ],
      selects: {
        hospitalId: {
          table: "cardsHospitals",
          data: [],
          item_value: "id",
          item_text: "name",
          fetchOnInput: null,
          loading: true
        },
        officeId: {
          table: "offices",
          data: [],
          item_value: "id",
          item_text: "name",
          fetchOnInput: null,
          loading: true
        },
        renewType: {
          table: null,
          data: [],
          dataRef: [
            { id: 0, name: "أول إصدار" },
            { id: 1, name: "تجديد" },
            { id: 2, name: "بدل فاقد" }
          ],
          item_value: "id",
          item_text: "name",
          fetchOnInput: null,
          loading: false
        },
        typeId: {
          table: "cardTypes",
          data: [],
          dataRef: [],
          item_value: "id",
          item_text: "typeName",
          fetchOnInput: null,
          loading: true
        },
        isCanceled: {
          table: null,
          data: [
            { id: 0, name: "سارية" },
            { id: 1, name: "ملغية" }
          ],
          item_value: "id",
          item_text: "name",
          fetchOnInput: null
        },
        referenceId: {
          table: "users",
          data: [],
          item_value: "userId",
          item_text: "degreeName",
          fetchOnInput: null,
          loading: true
        },
        certificantId: {
          table: "cardsCertificants",
          data: [],
          item_value: "id",
          item_text: "displayedText",
          fetchOnInput: null,
          loading: true
        }
      },
      // store the return of isNoMemberChecked() because vuetify didn't notice the change in return
      isNoMemberCheckedVar: true
    };
  },
  mounted() {
    this.cardRef = { ...this.card };
    this.cardTrackingRef = { ...this.cardTracking };
    this.fetchSelects();
  },
  methods: {
    async fetchSelects() {
      let selects = this.selects,
        that = this,
        keys = Object.keys(selects);

      for (let i = 0; i < keys.length; i++) {
        let model = keys[i],
          { table } = selects[model];
        if (table == null) continue;
        this.api("global/get_all", {
          table
        })
          .then(x => {
            if (x.data && x.data.length > 0) {
              // if it's user table
              if ("username" in x.data[0]) {
                x.data = x.data.map(row => {
                  row["degreeName"] = row["degree"] + "/ " + row["realName"];
                  return row;
                });
              }

              if (model == "typeId") {
                that.$set(that.selects[model], "dataRef", x.data);
              }
              that.$set(that.selects[model], "data", x.data);
            } else {
              that.$set(that.selects[model], "data", []);
            }
          })
          .catch(err => {
            console.log(err);
            that.showError("حدث خطأ اثناء استدعا الداتا من قاعدة البيانات");
          })
          .finally(() => {
            that.$set(that.selects[model], "loading", false);
          });
      }
    },
    /**
     * filtering cards to get only the allowed cards
     */
    filterCardTypes() {
      let allowedCards = this.allowedCards,
        allowedTypes = this.selects.typeId.data.filter(type => {
          return allowedCards[type.id] > 0;
        });
      console.log("allowedCards", allowedCards);
      console.log("allowedTypes", allowedTypes);
      this.selects.typeId.data = allowedTypes;
    },
    showCard(card = null, step = 1) {
      this.step = step;
      if (card == null) {
        card = this.card;
        card.id = undefined;
        this.$set(this, "cardTrackings", []);
        // replace card by cardRef
        this.replaceObjs(card, this.cardRef);
      } else {
        this.replaceObjs(this.card, card);
        if (card.cardsTrackings) {
          // deep copy without object reference
          this.$set(
            this,
            "cardTrackings",
            card.cardsTrackings.map(track => ({ ...track }))
          );
        }
      }
      // replace cardTracking by cardTrackingRef
      this.replaceObjs(this.cardTracking, this.cardTrackingRef);

      // sort cardTrackings
      // this.$emit("sortCardTrackings",this.cardTrackings);

      this.model = true;

      // if no cardsTracking then show the form to add one
      if (!this.cardTrackings.length) {
        this.isAddingCardTracking = true;
      } else {
        this.isAddingCardTracking = false;
      }

      // some changes needs to be done in inputs
      this.prepareInputs();

      this.$nextTick(() => {
        this.onChangeTypeId();
        this.checkIsUpdatingAllowed();
        this.refreshStepperValidation();
        // reset forms
        this.$refs.mainDataForm?.resetValidation();
        this.$refs.cardTrackingForm?.resetValidation();
      });
    },
    replaceObjs(oldObj, newObj) {
      Object.keys(newObj).forEach(prop => {
        this.$set(oldObj, prop, newObj[prop]);
      });
    },
    prepareInputs() {
      let selects = this.selects;
      selects.typeId.data = selects.typeId.dataRef;
      if (this.card.id) {
        // disable typeId and renewType
        this.mainDataInputs.find(input => {
          return input.model == "typeId";
        }).disabled = true;

        this.cardTrackingInputs.find(input => {
          return input.model == "renewType";
        }).disabled = true;
      } else {
        this.cardTrackingRef.renewType = 1;
        this.filterCardTypes();

        // enable typeId and renewType
        this.mainDataInputs.find(input => {
          return input.model == "typeId";
        }).disabled = false;
      }

      this.checkRenewTypes();
    },
    checkRenewTypes() {
      let renewType = this.selects.renewType;

      // if there's none of cardsTrackings
      // or editting the first one but it has to be from DB
      if (
        this.cardTrackings.length == 0 ||
        (this.cardTracking.trackingId &&
          this.cardTracking.trackingId == this.cardTrackings[0].trackingId)
      ) {
        // أول إصدار و بدل فاقد
        renewType.data = [renewType.dataRef[0], renewType.dataRef[2]];
        this.cardTrackingInputs.find(input => {
          return input.model == "renewType";
        }).disabled = false;
      } else {
        // تجديد
        renewType.data = [...renewType.dataRef];
        this.$set(this.cardTracking, "renewType", 1); // تجديد
        this.cardTrackingInputs.find(input => {
          return input.model == "renewType";
        }).disabled = true;
      }
    },
    /**
     * To only activate the allowed relation to this card Type
     */
    onChangeTypeId() {
      let typeName = this.selects.typeId.data.find(type => {
        return type.id == this.card.typeId;
      })?.typeName;
      if (!typeName) {
        return;
      }
      this.$refs.profileFamilyRef.filterFamilyMembers(typeName);
      this.$refs.profileFamilyRef.recomputeCheckObj++; // force recompute
    },
    validateMainData() {
      return this.$refs.mainDataForm?.validate();
    },
    validateCardTracking() {
      return this.$refs.cardTrackingForm?.validate();
    },
    resetCardTracking() {
      this.isAddingCardTracking = false;
      this.cardTracking = { ...this.cardTrackingRef };
      //this.replaceObjs(this.cardTracking, this.cardTrackingRef); // to clear Extra data
      this.$refs.cardTrackingForm.resetValidation();
    },
    refreshStepperValidation() {
      let stepNum = this.step;
      this.$refs["step" + stepNum].$el.click();
    },
    updateCardTracking() {
      // check the form
      if (!this.validateCardTracking()) {
        return;
      }
      let cardTrackings = this.cardTrackings,
        newCardTracking = { ...this.cardTracking },
        oldCardTracking;

      // check it's edit of tracking from DB (depend on trackingId)
      oldCardTracking = cardTrackings.find(cardTrack => {
        if (
          cardTrack.trackingId &&
          cardTrack.trackingId == newCardTracking.trackingId
        ) {
          return cardTrack;
        }
      });

      // check it's edit of tracking from frontEnd
      if (!oldCardTracking) {
        oldCardTracking = cardTrackings.find(cardTrack => {
          if (cardTrack.dateOfRenewal == newCardTracking.dateOfRenewal) {
            return cardTrack;
          }
        });
      }

      // edit
      if (oldCardTracking) {
        this.replaceObjs(oldCardTracking, newCardTracking);
      } else {
        // create
        cardTrackings.push(newCardTracking);
      }

      this.resetCardTracking();
      this.prepareInputs();
      this.$emit("sortCardTrackings", this.cardTrackings);
      this.checkRenewTypes();
    },
    generateTrackImgPath(cardTracking) {
      if (!cardTracking?.imgFile?.path) {
        return null;
      }

      let ext = cardTracking.imgFile.path.split(".").pop(),
        newPath = `${this.$store.getters.getTcUploadPath}\\${
          this.card.consMilitaryId
        }\\cards\\${this.card.cardNumber}_${this.getRandom()}.${ext}`;

      return newPath;
    },
    getReferenceName(userId) {
      let users = this.selects.referenceId.data,
        user = users.find(user => {
          return user.userId == userId;
        });

      return user ? user.degreeName : "-";
    },
    toEditCardtracking(cardTracking) {
      // reset first
      this.replaceObjs(this.cardTracking, this.cardTrackingRef);
      // then replace
      this.replaceObjs(this.cardTracking, cardTracking);

      this.$set(
        this.cardTracking,
        "referenceId",
        this.$store.state.currentUser.userId
      );

      // edit record from DB
      if (cardTracking.trackingId) {
        this.isAddingCardTracking = false;
      } else {
        this.isAddingCardTracking = true;
      }
      this.checkRenewTypes();
    },
    deleteCardTracking(cardTracking) {
      let cardTrackings = this.cardTrackings,
        index = cardTrackings.length - 1;
      while (index >= 0) {
        if (cardTrackings[index] == cardTracking) {
          // it's from DB
          if (cardTracking.trackingId) {
            if (!this.isAdmin()) {
              this.showError("راجع مدير النظام لحذف هذا البيان");
              index--;
              continue;
            }
            this.deletedCardTrackings.push({ ...cardTracking });
          }
          cardTrackings.splice(index, 1);
          this.toDeleteCardTracking = {};
          this.toDeleteCardTrackingModel = false;
          break;
        }
        index--;
      }

      this.checkRenewTypes();
    },
    isNoMemberChecked() {
      let isNoMemberChecked = true,
        checkObj = this.$refs?.profileFamilyRef?.checkObj;
      if (checkObj) {
        let keys = Object.keys(checkObj);
        isNoMemberChecked = keys.length
          ? keys.reduce((prev, curr) => {
              return prev && !checkObj[curr];
            }, isNoMemberChecked)
          : isNoMemberChecked;
      }
      if (![1, null, ""].includes(this.card.typeId) && isNoMemberChecked) {
        return true;
      }
      return false;
    },
    isCardExpired() {
      // the card is expired
      let lastTrack = this.cardTrackings[this.cardTrackings.length - 1];
      if (!lastTrack || new Date(lastTrack.dateOfExpiration) < new Date()) {
        return true;
      }
    },
    checkIsUpdatingAllowed() {
      let { cardNumber, fileNumber, typeId, isCanceled } = this.card;
      let errorsToAdd = [];

      // Main data is not valid
      if (!(cardNumber && fileNumber && typeId && this.validateMainData())) {
        this.isUpdatingAllowed = false;
        errorsToAdd.push("البيانات الاساسية غير مكتملة");
      }

      // the card is canceled
      if (isCanceled && !errorsToAdd.length) {
        this.isUpdatingAllowed = true;
        return;
      }

      // no cardTracking
      if (!this.cardTrackings.length) {
        errorsToAdd.push("لا يوجد بيانات الخاصة بتاريخ البطاقة (التجديدات)");
      }

      if (this.isAddingCardTracking || this.cardTracking.trackingId) {
        errorsToAdd.push(
          "لم يتم حفظ البيانات الخاصة بتاريخ البطاقة (التجديدات)."
        );
      }

      if (this.isCardExpired()) {
        errorsToAdd.push("البطاقة منتهية");
      }

      // no family and it's not personal card
      if ((this.isNoMemberCheckedVar = this.isNoMemberChecked())) {
        errorsToAdd.push("لا يوجد افراد عائلة بالبطاقة");
      }

      if (errorsToAdd.length) {
        this.isUpdatingAllowed = false;
        this.errorsToAdd = errorsToAdd;
        return;
      }
      this.errorsToAdd = [];
      this.isUpdatingAllowed = true;
    },
    // if it exists edit it, if not create it.
    async updateDB() {
      let card = this.card,
        that = this;
      card.dateOfIssurance = this.cardTrackings[0].dateOfRenewal;
      card.consMilitaryId = this.conscripte.militaryId;
      this.loading = this.disabled = true;

      this.api(`global/${card.id ? "update" : "create"}_one`, {
        table: "cards",
        where: card.id ? { id: card.id } : card,
        update: card, // will only be used at update api
        returner: "id"
      })
        .then(async x => {
          let cardId = card.id ? card.id : x.data;

          // create cardTrackings
          await that.updateCardTrackingsDB(cardId);

          // attach Family members to Cards
          await that.attachCheckedMembersToCard(cardId);

          that.updateCards();

          this.showSuccess("تم التعديل");
        })
        .catch(err => {
          console.log(err);
          this.showError(
            "فشل في إضافة بيانات البطاقة الاساسية بقاعدة البيانات"
          );
        })
        .finally(() => {
          this.loading = this.disabled = false;
        });
    },
    async updateCardTrackingsDB(cardId) {
      // update or create
      let cardTrackings = this.cardTrackings;
      for (let i = 0; i < cardTrackings.length; i++) {
        let cardTracking = this.cardTrackings[i],
          trackingId = cardTracking.trackingId;
        cardTracking.cardId = cardId;

        // upload image
        if (cardTracking?.imgFile?.path) {
          let imagePath = this.generateTrackImgPath(cardTracking); // without upload
          await this.upload(cardTracking.imgFile.path, imagePath)
            .then(x => {
              cardTracking.imagePath = imagePath;
            })
            .catch(err => {
              this.showError("لم يتم رفع الصورة على السيرفر");
              cardTracking.imagePath = null;
              console.log(err);
            });
          cardTracking.imgFile = null;
          cardTracking.img = null;
        }

        // update to DB
        await this.api(`global/${trackingId ? "update" : "create"}_one`, {
          table: "cardsTracking",
          where: trackingId ? { trackingId } : cardTracking,
          update: cardTracking
        }).catch(err => {
          console.log(err);
          this.showError("فشل في إنشاء بيان تجديد للبطاقة");
        });
      }

      // delete
      let deletedTrackings = this.deletedCardTrackings;
      for (let i = 0; i < deletedTrackings.length; i++) {
        let cardTracking = deletedTrackings[i],
          trackingId = cardTracking.trackingId;
        await this.api("global/delete_all", {
          table: "cardsTracking",
          where: { trackingId }
        }).catch(err => {
          console.log(err);
          this.showError("فشل في حذف بيات تجديد البطاقة");
        });
      }
    },
    async attachCheckedMembersToCard(cardId) {
      let checkObj = this.$refs.profileFamilyRef.checkObj,
        keys = Object.keys(checkObj),
        that = this;

      // first clear all members attach to this card
      await this.api("global/update_one", {
        table: "cardsFamilyMembers",
        where: {
          cardId: cardId
        },
        update: {
          cardId: null
        }
      })
        .then(x => {
          that.editCardIdForMember(null, cardId);
        })
        .catch(err => {
          console.log(err);
        });

      for (let i = 0; i < keys.length; i++) {
        // continue if it's unchecked
        if (!checkObj[keys[i]]) {
          continue;
        }
        await this.api("global/update_one", {
          table: "cardsFamilyMembers",
          where: {
            id: keys[i]
          },
          update: {
            cardId: cardId
          }
        })
          .then(x => {
            // update cardId of member in frontEnd
            that.editCardIdForMember(keys[i], cardId);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    // this will occur in the front End
    editCardIdForMember(id = null, cardId) {
      // all members with this cardId will be converted to null
      let members = this.conscripte.cardsFamilyMembers;

      if (!cardId) {
        return;
      }

      if (id == null) {
        for (let i = 0; i < members.length; i++) {
          let member = members[i];
          if (member.cardId == cardId) {
            this.$set(this.conscripte.cardsFamilyMembers[i], "cardId", null);
          }
        }
      } else {
        // the member with this id will have this cardId
        let index = members.findIndex(member => {
          return member.id == id;
        });
        if (index !== false) {
          this.$set(
            this.conscripte.cardsFamilyMembers[index],
            "cardId",
            cardId
          );
        }
      }
    },
    previewImgFile() {
      this.cardTracking.img = this.cardTracking.imgFile
        ? URL.createObjectURL(this.cardTracking.imgFile)
        : require("@/assets/inapp/user-placeholder.jpg"); // for editting
    },
    async getImageBase64() {
      let imagePath = this.cardTracking?.imagePath,
        imgFile = this.cardTracking?.imgFile;
      if (imagePath == null || imagePath.includes("user-placeholder")) {
        this.cardTracking.img = this.cardTrackingRef.imagePath;
      } else if (imgFile) {
        this.previewImgFile();
      } else {
        console.log(imagePath);
        await this.getImage(imagePath).then(x => {
          if (x) {
            this.cardTracking.img = x;
          }
        });
      }
    }
  },
  watch: {
    card: {
      deep: true,
      handler(card) {
        this.checkIsUpdatingAllowed();
      }
    },
    cardTrackings: {
      deep: true,
      handler() {
        this.checkIsUpdatingAllowed();
      }
    },
    cardTracking: {
      deep: true,
      handler() {
        this.checkIsUpdatingAllowed();
      }
    },
    "cardTracking.imagePath": {
      handler() {
        this.getImageBase64();
      }
    }
  }
};
</script>
<style>
.theme--light.v-stepper
  .v-stepper__step--complete.error--text
  .v-stepper__label {
  color: inherit;
}
</style>
