<template>
  <v-card outlined class="treatmentCard">
    <v-card-title class="text-subtitle-1"
      >بطاقة علاجية
      {{ card.cardType.typeName ? card.cardType.typeName : "غير معرفة" }}

      <v-card-subtitle v-if="isCanceled" class="error--text pa-0 pr-3">
        (ملغية)
      </v-card-subtitle>
      <v-card-subtitle v-else-if="isExpired" class="error--text pa-0 pr-3">
        (منتهية)
      </v-card-subtitle>
      <v-card-subtitle v-else class="success--text pa-0 pr-3">
        (سارية)
      </v-card-subtitle>
    </v-card-title>

    <v-divider></v-divider>
    <v-card-text>
      <v-card class="mx-auto" width="125">
        <v-img width="125" :src="image64"></v-img>
      </v-card>

      <!-- <v-card-actions class="justify-center">
        <div
          v-if="!isCanceled"
          @click="!isExpired ? /*showNotExpired()*/ 1 : 1"
        >
          <v-btn
            @click="
              renewModel = true;
              fillRenew();
              filterFamilyMembers();
            "
            :disabled="false /*!isExpired*/"
            :outlined="!isExpired"
            :color="isExpired ? 'primary' : 'secondary'"
          >
            {{ isExpired ? "تجديد البطاقة" : "تعديل آخر تجديد" }}
          </v-btn>
          <v-btn
            @click="deleteLastRenewModel = true"
            class="mr-2"
            v-if="!isExpired"
            outlined
            color="error"
          >
            حذف آخر تجديد
          </v-btn>
        </div>
      </v-card-actions> -->
      <v-list dense>
        <v-list-item v-if="isCanceled" class="px-0" item>
          <v-list-item-content class="error--text">
            سبب الالغاء:
          </v-list-item-content>
          <v-list-item-content class="error--text align-end leftList">
            {{ cancelationReason }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-for="(prop, i) in cardProps" :key="i" item class="px-0">
          <v-list-item-content
            :class="{
              'error--text':
                (isExpired && prop.text == 'تاريخ الانهاء:') ||
                prop.val == 0 ||
                ['غير محدد', 'غير محددة'].includes(prop.val),
              'flex-grow-1-3': true
            }"
            >{{ prop.text }}</v-list-item-content
          >
          <v-list-item-content
            class="align-end leftList"
            :class="{
              'error--text':
                (isExpired && prop.text == 'تاريخ الانهاء:') ||
                prop.val == 0 ||
                ['غير محدد', 'غير محددة'].includes(prop.val)
            }"
          >
            {{ prop.val }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        @click="
          $emit('showCard', card, 2);
          filterFamilyMembers();
        "
        color="info"
      >
        تعديل / تجديد
      </v-btn>
      <v-btn outlined text color="error" @click="deleteModel = true">
        حذف
      </v-btn>
    </v-card-actions>

    <v-dialog
      v-if="isCurrentRoute('cards/profile')"
      scrollable
      max-width="1000"
      v-model="updateModel"
    >
      <v-card :loading="loading" :disabled="disabled">
        <v-card-title class="text-subtitle-1">
          تعديل بيانات أول اصدار
          <v-spacer></v-spacer>
          <v-btn icon @click="updateModel = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-form ref="updateForm" lazy-validation>
            <v-row>
              <v-col class="pt-6">
                <v-row>
                  <template v-for="(input, i) in updateInputs">
                    <v-col
                      class="pb-0 pt-0"
                      :cols="input.cols ? input.cols : 12"
                      :sm="input.cols ? input.cols : 12"
                      :lg="input.cols ? input.cols : 6"
                      :xl="input.cols ? input.cols : 4"
                      :key="i"
                      v-if="!input.hidden"
                    >
                      <v-text-field
                        v-if="input.type && input.type == 'text'"
                        :persistent-hint="input.hint ? true : false"
                        :hide-details="false"
                        :hint="input.hint"
                        v-model="input.value"
                        filled
                        :label="input.label"
                        :readonly="input.readonly ? true : false"
                        :rules="input.rules ? input.rules : []"
                      ></v-text-field>
                      <v-autocomplete
                        v-else-if="input.type && input.type == 'select'"
                        :label="input.label"
                        :hide-details="input.hint ? true : false"
                        :hint="input.hint"
                        :disabled="input.disabled"
                        :hidden="input.hidden ? true : false"
                        :items="selects[input.model].data"
                        :item-text="selects[input.model].item_text"
                        :item-value="selects[input.model].item_value"
                        v-model="input.value"
                        filled
                        @change="'onChange' in input ? input.onChange() : 1"
                        :loading="selects[input.model].loading"
                        :rules="input.rules ? input.rules : []"
                      ></v-autocomplete>

                      <v-text-field
                        v-else-if="input.type && input.type == 'date'"
                        type="date"
                        v-model="input.value"
                        :hidden="input.hidden ? true : false"
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
                        :hidden="input.hidden ? true : false"
                        filled
                        rows="1"
                        v-model="input.value"
                      ></v-textarea>
                    </v-col>
                  </template>
                </v-row>
              </v-col>

              <v-col class="pic-col" cols="4">
                <v-card class="pic-card" outlined>
                  <v-card-title class="text-subtitle-1">
                    صورة الختم
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-avatar rounded size="100%" color="secondary">
                      <v-img contain max-width="350" :src="imgPath">
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
            <v-row class="mt-2" v-if="allowedRelations.length">
              <v-col>
                <div style="display: flex;">
                  أفراد العائلة
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
                        @click="$emit('addMember', item.value)"
                      >
                        <v-list-item-title
                          v-text="item.title"
                        ></v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
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
                        <th>
                          يستحق
                        </th>
                        <th>
                          تسكين بالبطاقة
                        </th>
                        <th>تعديل</th>
                        <th>حذف</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(member, i) in familyMembers"
                        :key="vForKey + i"
                      >
                        <td>
                          <v-icon>{{
                            (member.cardsFamilyTypeRel.relation == "son" ||
                              member.cardsFamilyTypeRel.relation ==
                                "daughter") &&
                            member.motherId != null
                              ? "mdi-subdirectory-arrow-left"
                              : ""
                          }}</v-icon>
                          {{ member.name }}
                        </td>
                        <td>{{ member.cardsFamilyTypeRel.displayedText }}</td>
                        <td>
                          <v-icon>{{
                            conscripte.isDeserve != undefined &&
                            conscripte.isDeserve(member)
                              ? "mdi-check"
                              : "mdi-close"
                          }}</v-icon>
                        </td>
                        <td width="150px">
                          <v-checkbox
                            v-model="checkObj[member.id]"
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
                          <v-btn
                            @click="$emit('editMember', member)"
                            icon
                            tile
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
                            @click="$emit('deleteMember', member)"
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
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            v-text="'تعديل'"
            large
            class="px-6"
            @click="update()"
          >
          </v-btn>
        </v-card-actions>
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
          حذف بطاقة علاجية
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          هل أنت متأكد من حذف البطاقة ؟
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
            @click="deleteCard()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "profileCard",
  props: [
    "card",
    "conscripte",
    "refreshComponents",
    "orderFamilyMembers",
    "allowedCards",
    "updateCards",
    "familyMembersRel"
  ],
  async mounted() {
    console.log("mounted profile-card");

    await this.fetchSelects();
    this.$emit("sortCardTrackings", this.card.cardsTrackings);
    this.setCardProps();
    this.getImageBase64(); // for showing
    this.setDateOfExpiration();
    this.getImageBase64FirstTrack(); // for first track
  },
  data() {
    let numRule = [v => !isNaN(v) || "يجب إدخال ارقام فقط"],
      reqRule = [v => !!v || "الحقل إجباري"];
    return {
      vForKey: 0,
      reqRule: reqRule,
      loading: false,
      disabled: false,
      image64: require("@/assets/inapp/user-placeholder.jpg"), // used in showing
      img: null,
      imgPath: require("@/assets/inapp/user-placeholder.jpg"), // used in edit
      renewImgPath: require("@/assets/inapp/user-placeholder.jpg"),
      updateModel: false,
      deleteModel: false,
      cancelModel: false,
      deleteLastRenewModel: false,
      renewModel: false,
      cardProps: {},
      trackings: {},
      lastTrack: {},
      allowedRelations: [],
      updateInputs: [
        {
          label: "رقم البطاقة العلاجية",
          model: "cardNumber",
          type: "text",
          cols: 6,
          hint: "",
          order: 1,
          readonly: false,
          value: this.card.cardNumber
        },
        {
          label: "رقم الحافظة",
          model: "fileNumber",
          type: "text",
          cols: 6,
          hint: "",
          order: 2,
          value: this.card.fileNumber
        },

        {
          label: "المراجع",
          model: "referenceId",
          type: "select",
          cols: 6,
          hint: "",
          order: 2,
          disabled: true,
          value: this.card.cardsTrackings[0]?.referenceId
        },
        {
          label: "المصدق",
          model: "certificantId",
          type: "select",
          cols: 6,
          hint: "",
          order: 3,
          rules: reqRule,
          value: this.card.cardsTrackings[0]?.certificantId
        },
        {
          label: "نوع البطاقة",
          model: "typeId",
          type: "text",
          hidden: true,
          cols: 6,
          hint: "",
          order: 3,
          value: this.card.cardType.id
        },
        {
          label: "تاريخ أول إصدار",
          model: "dateOfIssurance",
          type: "date",
          cols: 6,
          hint: "",
          onChange: this.setDateOfExpiration,
          order: 2,
          rules: reqRule,
          value: this.card.dateOfIssurance
        },
        {
          label: "تاريخ إنهاء أول أصدار",
          model: "dateOfExpiration",
          type: "date",
          cols: 6,
          hint: "",
          order: 2,
          rules: reqRule,
          value: this.card.cardsTrackings[0]?.dateOfExpiration
        }
      ],
      inputs: [
        {
          label: "تاريخ التجديد",
          model: "dateOfRenewal",
          type: "date",
          cols: 6,
          hint: "",
          onChange: this.setDateOfExpiration,
          order: 1,
          rules: reqRule,
          value: new Date().toISOString().substr(0, 10)
        },
        {
          label: "تاريخ الإنهاء",
          model: "dateOfExpiration",
          type: "date",
          cols: 6,
          hint: "",
          order: 2,
          rules: reqRule,
          value: null
        },
        {
          label: "المراجع",
          model: "referenceId",
          type: "select",
          cols: 6,
          hint: "",
          order: 2,
          disabled: true,
          value: this.$store.state.currentUser.userId
        },
        {
          label: "المصدق",
          model: "certificantId",
          type: "select",
          cols: 6,
          hint: "",
          order: 3,
          rules: reqRule,
          value: ""
        },
        {
          label: "المستشفى المعالج",
          model: "hospitalId",
          type: "select",
          cols: 6,
          hint: "",
          order: 3,
          rules: reqRule,
          value: null
        },
        {
          label: "مكتب",
          model: "officeId",
          type: "select",
          cols: 6,
          hint: "",
          order: 4,
          value: 28
        },
        {
          label: "ملاحظات",
          model: "notes",
          type: "textarea",
          cols: 12,
          hint: "",
          order: 5,
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
      cancelationDialog: {
        isCanceled: false,
        cancelationReason: ""
      }
    };
  },
  computed: {
    isDBCanceled() {
      return this.cancelationDialog.isCanceled;
    },
    isNotDeserveCard() {
      return this.allowedCards[this.card.cardType.id] < 0 ? true : false;
    },
    isCanceled() {
      return this.isDBCanceled || this.isNotDeserveCard;
    },
    cancelationReason() {
      return this.isDBCanceled
        ? this.cancelationDialog.cancelationReason ||
          this.cancelationDialog.cancelationReason != null
          ? this.cancelationDialog.cancelationReason
          : "لم يوضع سبب الانهاء"
        : "هذا الشخص لا يستحق تلك البطاقة";
    },
    isExpired() {
      return this.lastTrack?.dateOfExpiration &&
        new Date(this.lastTrack.dateOfExpiration) > new Date()
        ? false
        : true;
    },
    familyMembers() {
      return this.conscripte.orderedFamilyMembers;
    },
    /**
     * nationalId: true || false
     */
    checkObj() {
      let cardId = this.card.id,
        checkObj = {};
      this.conscripte.cardsFamilyMembers.forEach(member => {
        checkObj[member.id] = member.cardId == cardId ? true : false;
      });

      return checkObj;
    }
  },
  methods: {
    async fetchSelects() {
      let selects = this.selects,
        that = this,
        keys = Object.keys(selects);
      let asyncedLoop = () => {
        return new Promise((success, failure) => {
          (async function loop() {
            for (let i = 0; i < keys.length; i++) {
              let model = keys[i];
              let { table } = selects[model];
              if (table == null) {
                return;
              }

              await that
                .api("global/get_all", { table })
                .then(x => {
                  // if it's user table
                  if ("username" in x.data[0]) {
                    x.data = x.data.map(row => {
                      row["degreeName"] =
                        row["degree"] + "/ " + row["realName"];
                      return row;
                    });
                  }

                  if (x.data && x.data.length > 0) {
                    that.$set(that.selects[model], "data", x.data);
                  } else {
                    that.$set(that.selects[model], "data", []);
                  }
                })
                .catch(err => {
                  console.log(err);
                  that.showError(
                    "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
                  );
                  that.$set(
                    that.selects[model],
                    "error",
                    "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
                  );
                })
                .finally(() => {
                  that.$set(that.selects[model], "loading", false);
                });
            }

            success(true);
          })();
        });
      };

      await asyncedLoop();
    },
    setCardProps() {
      let trackings = (this.trackings = this.card.cardsTrackings),
        lastTrack = (this.lastTrack = trackings[trackings.length - 1]);
      this.cardProps = [
        { text: "رقم البطاقة العلاجية:", val: this.card.cardNumber },
        { text: "رقم الحافظة:", val: this.card.fileNumber },
        {
          text: "تاريخ أول اصدار:",
          val:
            this.card.dateOfIssurance == null
              ? "غير محدد"
              : this.card.dateOfIssurance
        },
        {
          text: "تاريخ التجديد:",
          val: [undefined, null].includes(lastTrack?.dateOfRenewal)
            ? "غير محدد"
            : lastTrack?.dateOfRenewal
        },
        {
          text: "تاريخ الانهاء:",
          val:
            lastTrack?.dateOfExpiration == null ||
            lastTrack?.dateOfExpiration == undefined
              ? "غير محددة"
              : lastTrack.dateOfExpiration
        },
        {
          text: "عدد المستفيدين",
          val:
            this.card.cardType.typeName == "شخصية بالمعاش"
              ? 1
              : this.card.cardsFamilyMembers.filter(member => {
                  // get member with full data
                  member = this.getFamilyMembersById(member.nationalId);
                  return (
                    this.conscripte.isDeserve != undefined &&
                    this.conscripte.isDeserve(member)
                  );
                }).length
        }
      ];
      this.cancelationDialog = {
        isCanceled: this.card.isCanceled,
        cancelationReason: this.card.cancelationReason
      };
    },
    setDateOfExpiration() {
      let selectedType = this.card.cardType,
        expirationDateInYears = selectedType
          ? selectedType.expirationDateInYears
          : 1,
        dateOfRenewal = new Date(
          this.inputs.find(input => input.model == "dateOfRenewal").value
        );

      dateOfRenewal = new Date(
        dateOfRenewal.setFullYear(
          dateOfRenewal.getFullYear() + expirationDateInYears
        )
      );

      this.inputs.find(
        input => input.model == "dateOfExpiration"
      ).value = dateOfRenewal.toISOString().substr(0, 10);
    },
    showNotExpired() {
      this.showInfo("البطاقة سارية بالفعل");
    },
    /**
     * filtering allowed Realtions according to the type of card
     */
    filterFamilyMembers() {
      let selectedType = this.card?.cardType;
      if (!selectedType) {
        return;
      }
      switch (selectedType.typeName) {
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
    previewImg() {
      this.imgPath = this.img ? URL.createObjectURL(this.img) : null; // for editting
      this.renewImgPath = this.img ? URL.createObjectURL(this.img) : null; // for renewing
    },
    // by national id
    getFamilyMembersById(nationalId) {
      let members = this.familyMembers;
      if (!members?.length) return false;

      let member = members.find(member => {
        return member.nationalId == nationalId;
      });

      return member ? member : false;
    },
    async renew() {
      if (!this.$refs.renewForm.validate()) {
        return;
      }

      this.loading = true;
      this.disabled = true;
      let cardTracking = {};
      this.inputs.forEach(input => {
        cardTracking[input.model] = input.value;
      });
      cardTracking["cardId"] = this.card.id;
      cardTracking["renewType"] = 1;
      //cardTracking["referenceId"] = this.$store.state.currentUser.userId;
      cardTracking["sectionId"] = this.$store.state.currentUser.section;

      await this.attachCheckedMembersToCard(this.card.id);

      if (this.img != null) {
        let ext = this.img.path.split(".").pop(),
          newPath = `${this.$store.getters.getTcUploadPath}\\${
            this.card.consMilitaryId
          }\\cards\\${this.card.cardNumber}_${this.getRandom()}.${ext}`;

        // first upload the
        await this.upload(this.img.path, newPath).catch(err => {
          this.showError("لم يتم رفع الصورة على السيرفر");
          console.log(err);
          return;
        });
        cardTracking["imagePath"] = newPath;
      }

      // it's renewing so create a new record
      if (this.isExpired) {
        console.log(cardTracking);
        this.api("global/create_one", {
          table: "cardsTracking",
          where: cardTracking
        })
          .then(() => {
            this.showSuccess("تم التجديد");
            this.updateCards();
            this.$refs.renewForm.reset();
            this.model = false;
          })
          .catch(err => {
            console.log(err);
            this.showError("لم تتم العملية");
          })
          .finally(() => {
            this.loading = false;
            this.disabled = false;
          });
      } else {
        // it's not expired then it's just editting for the las tracking
        this.api("global/update_one", {
          table: "cardsTracking",
          where: this.lastTrack,
          update: cardTracking
        })
          .then(() => {
            this.showSuccess("تم التعديل");
            this.updateCards();
            this.$refs.renewForm.reset();
            this.model = false;
          })
          .catch(err => {
            console.log(err);
            this.showError("لم تتم العملية");
          })
          .finally(() => {
            this.loading = this.disabled = false;
          });
      }
    },
    async fillRenew() {
      this.inputs.forEach(input => {
        // if it's renew then remove data else prepare it for editing
        input.value = this.isExpired ? "" : this.lastTrack[input.model];
      });

      // this is renewing
      if (this.isExpired) {
        this.inputs.find(input => {
          return input.model == "dateOfRenewal";
        }).value = new Date().toISOString().substr(0, 10);
        this.setDateOfExpiration();

        this.inputs.find(input => {
          return input.model == "referenceId";
        }).value = this.$store.state.currentUser.userId;

        this.renewImgPath = require("@/assets/inapp/user-placeholder.jpg");
      }
    },
    async update() {
      if (!this.$refs.updateForm.validate()) {
        return;
      }

      this.loading = true;
      this.disabled = true;
      let card = {},
        cardId = this.card.id,
        cardNumber = "",
        cardTracking = {},
        trackingId = this.card.cardsTrackings[0]?.trackingId,
        that = this;

      this.updateInputs.forEach(input => {
        switch (input.model) {
          case "cardNumber":
            cardNumber = input.value;
            card["cardNumber"] = cardNumber;
            break;
          case "dateOfIssurance":
            card[input.model] = input.value;
            cardTracking["dateOfRenewal"] = input.value;
            break;
          case "fileNumber":
            card[input.model] = input.value;
            break;
          case "dateOfExpiration":
          case "certificantId":
            cardTracking[input.model] = input.value;
            break;
        }
      });
      cardTracking["referenceId"] = this.$store.state.currentUser.userId;

      if (this.img != null) {
        let ext = this.img.path.split(".").pop(),
          newPath = `${this.$store.getters.getTcUploadPath}\\${
            this.card.consMilitaryId
          }\\cards\\${this.card.cardNumber}_${this.getRandom()}.${ext}`;

        // first upload the
        await this.upload(this.img.path, newPath).catch(err => {
          this.showError("لم يتم رفع الصورة على السيرفر");
          console.log(err);
          return;
        });
        cardTracking["imagePath"] = newPath;
      }

      await this.attachCheckedMembersToCard(cardId);
      await this.api("global/update_one", {
        table: "cards",
        where: {
          id: cardId
        },
        update: {
          ...card
        }
      }).catch(err => {
        console.log(err);
        this.showError("فشل التعديل");
      });
      await this.api("global/update_one", {
        table: "cardsTracking",
        where: {
          cardId: cardId,
          trackingId
        },
        update: {
          ...cardTracking
        }
      })
        .then(() => {
          this.showSuccess("تم التعديل بنجاح");
        })
        .catch(err => {
          console.log(err);
          this.showError("فشل التعديل");
        });

      this.disabled = this.loading = false;
      this.updateCards();
    },
    async attachCheckedMembersToCard(cardId) {
      let checkObj = this.checkObj,
        that = this,
        keys = Object.keys(this.checkObj);

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
          console.log(x);
        })
        .catch(err => {
          console.log(err);
        });
      let asyncedLoop = () => {
        return new Promise((success, failure) => {
          (async function loop() {
            for (let i = 0; i < keys.length; i++) {
              // it' false continue
              if (checkObj[keys[i]]) {
                console.log(keys[i]);
                await that
                  .api("global/update_one", {
                    table: "cardsFamilyMembers",
                    where: {
                      id: keys[i]
                    },
                    update: {
                      cardId: cardId
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            }
            success(true);
          })();
        });
      };
      await asyncedLoop();

      this.api("global/get_all", {
        table: "cardsFamilyMembers",
        where: {
          consMilitaryId: this.card.consMilitaryId
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
        })
        .catch(err => {
          console.log(err);
        });
    },
    async deleteLastRenew() {
      let section = this.$store.getters.getCurrSection;
      if (section != 0) {
        this.showError(
          "غير مسموح لك اجراء هذه العملية إرجع لرئيس الفرع لعرض الموقف"
        );
        this.deleteLastRenewModel = false;
        return;
      }
      if (this.card.cardsTrackings.length < 2) {
        this.showError(
          "انت تحاول حذف معلومات اول اصدار اذا اردت المتابعة احذف الكارت"
        );
        this.deleteLastRenewModel = false;
        return;
      }
      this.loading = this.disabled = true;
      let trackingId = this.lastTrack.trackingId;
      this.api("global/delete_all", {
        table: "cardsTracking",
        where: {
          trackingId
        }
      })
        .then(x => {
          this.showSuccess("تم الحذف بنجاح");
          this.updateCards();
          this.deleteLastRenewModel = false;
        })
        .catch(err => {
          this.showError("فشلت عملية الحذف");
          console.log(err);
        })
        .finally(() => {
          this.loading = this.disabled = true;
        });
    },
    async deleteCard() {
      let section = this.$store.getters.getCurrSection;
      if (section != 0) {
        this.showError(
          "غير مسموح لك اجراء هذه العملية إرجع لرئيس الفرع لعرض الموقف"
        );
        this.deleteModel = false;
        return;
      }

      let cardId = this.card.id;

      this.loading = true;
      this.disabled = true;

      // @TODO should be setNULL
      // first clear all members attach to this card
      await this.api("global/update_one", {
        table: "cardsFamilyMembers",
        where: {
          cardId
        },
        update: {
          cardId: null
        }
      }).catch(err => {
        console.log(err);
      });

      // first delete all tracking
      /*await this.api("global/delete_all", {
        table: "cardsTracking",
        where: {
          cardId
        }
      }).catch(err => {
        console.log(err);
        this.showError("فشل الحذف");
        return;
      });*/

      // second delete the card
      await this.api("global/delete_all", {
        table: "cards",
        where: {
          id: cardId
        }
      })
        .then(() => {
          this.showSuccess("تم الحذف");
        })
        .catch(err => {
          console.log(err);
          this.showError("فشل الحذف");
        })
        .finally(() => {
          this.loading = this.disabled = false;
        });

      this.updateCards();
    },
    async getImageBase64() {
      let imagePath = this.lastTrack?.imagePath;
      if (
        imagePath != null &&
        !imagePath.includes("user-placeholder") &&
        imagePath
      ) {
        await this.getImage(imagePath).then(x => {
          if (x) {
            this.image64 = this.renewImgPath = x;
          }
        });
      }
    },
    async getImageBase64FirstTrack() {
      let imagePath = this.card.cardsTrackings[0]?.imagePath;
      if (imagePath != null && imagePath) {
        await this.getImage(imagePath).then(x => {
          if (x) {
            this.imgPath = x;
          }
        });
      }
    },
    async updateCancelation() {
      this.loading = this.disabled = true;
      await this.api("global/update_one", {
        table: "cards",
        where: {
          id: this.card.id
        },
        update: this.cancelationDialog
      })
        .then(x => {
          this.showSuccess("تم التعديل بنجاح");
          this.card.isCanceled = this.cancelationDialog.isCanceled;
          this.card.cancelationReason = this.cancelationDialog.cancelationReason;
          console.log("refresh");
          this.refreshComponents();
          this.cancelModel = false;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loading = this.disabled = false;
        });
    }
  }
};
</script>

<style>
.leftList {
  flex-basis: 20px;
}
.flex-grow-1-3 {
  flex-grow: 1.3;
}
.image-selector .mdi-myFileIcon::before {
  color: white;
}
</style>
