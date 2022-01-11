<template>
  <v-row>
    <v-col class="header-col flex-align-stretch" cols="12">
      <v-card flat :loading="loading">
        <v-card-title>
          البطاقات العلاجية
          <v-spacer></v-spacer>

          <!-- 
            TODO: Show why button is disabled?
            In other words: ليه لا يمكن إضافة بطاقات أخرى لهذا الفرد؟
           -->
          <div
            class="mr-auto"
            @click="
              !isAddingAllowed
                ? showInfo('هذا الفرد لا يستحق بطاقات علاجية أخرى')
                : 1
            "
          >
            <v-btn
              :disabled="!isAddingAllowed"
              color="primary"
              outlined
              @click="
                //model = true;
                $refs.profileCardDialog.showCard()
              "
            >
              إصدار بطاقة جديدة
            </v-btn>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text :class="cards && cards.length ? 'd-flex flex-wrap' : ''">
          <profile-card
            :conscripte="conscripte"
            :refreshComponents="refreshComponents"
            :allowedCards="allowedCards"
            :updateCards="updateCards"
            :orderFamilyMembers="orderFamilyMembers"
            :familyMembersRel="familyMembersRel"
            v-for="(card, i) in cards"
            @editMember="editMember"
            @deleteMember="deleteMember"
            @addMember="addMember"
            @showCard="showCard"
            @sortCardTrackings="sortCardTrackings"
            :key="i"
            :card="card"
          ></profile-card>

          <div v-if="cards && !cards.length" class="text-center">
            لا يوجد بطاقات مسجلة
          </div>
        </v-card-text>
      </v-card>
      <profile-card-dialog
        :conscripte="conscripte"
        :governorates="governorates"
        :updateCards="updateCards"
        :refreshComponents="refreshComponents"
        :allowedCards="allowedCards"
        :orderFamilyMembers="orderFamilyMembers"
        :familyMembersRel="familyMembersRel"
        @sortCardTrackings="sortCardTrackings"
        ref="profileCardDialog"
      ></profile-card-dialog>
      <v-dialog
        v-if="isCurrentRoute('cards/profile')"
        persistent
        scrollable
        v-model="model"
        max-width="1000"
      >
        <v-card :loading="loading" :disabled="disabled">
          <v-card-title
            >إصدار بطاقة جديدة
            <v-spacer></v-spacer>
            <v-btn icon @click="model = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text class="pt-4">
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col class="pt-6">
                  <v-row>
                    <template v-for="(input, i) in inputs">
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
                          v-model="input.value"
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
              <v-row v-if="allowedRelations.length">
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
                          @click="addMember(item.value)"
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
                        <tr v-for="(member, i) in familyMembers" :key="i">
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
                              :value="member.id"
                              :disabled="
                                !allowedRelations.includes(
                                  member.cardsFamilyTypeRel.relation
                                ) ||
                                  !(
                                    conscripte.isDeserve != undefined &&
                                    conscripte.isDeserve(member)
                                  )
                              "
                              v-model="selectedFamilyMembers"
                            ></v-checkbox>
                          </td>
                          <td>
                            <v-btn
                              @click="editMember(member)"
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
                              @click="deleteMember(member)"
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
              v-text="'إضافة'"
              large
              class="px-6"
              @click="save()"
            >
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "profileCards",
  props: [
    "conscripte",
    "refreshComponents",
    "orderFamilyMembers",
    "governorates"
  ],
  mounted() {
    this.fetchSelects();

    // relations
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
        console.log(x);
        this.familyMembersRel = familyMembersRel;
      })
      .catch(err => {
        console.log(err);
        this.showError("حدث خطأ في تحميل البيانات");
      });
  },
  components: {
    profileCard: () => import("@/components/pages/cards/profile-card.vue"),
    profileCardDialog: () =>
      import("@/components/pages/cards/profile-card-dialog.vue")
  },
  data() {
    let numRule = [v => !isNaN(v) || "يجب إدخال ارقام فقط"],
      reqRule = [v => !!v || "الحقل إجباري"],
      futureDateRule = [v => !(new Date(v) > new Date()) || "التاريخ خطأ"];
    return {
      reqRule: reqRule,
      familyMembersRel: [],
      loading: false,
      disabled: false,
      model: false,
      img: null,
      imgPath: require(`@/assets/inapp/user-placeholder.jpg`),
      selectedFamilyMembers: [],
      allowedRelations: [],
      allowedCards: {},
      inputs: [
        {
          label: "رقم البطاقة العلاجية",
          model: "cardNumber",
          type: "text",
          cols: 6,
          hint: "",
          order: 0,
          rules: [...numRule, ...reqRule],
          value: ""
        },
        {
          label: "رقم الحافظة",
          model: "fileNumber",
          type: "text",
          cols: 6,
          hint: "",
          order: 1,
          rules: [...numRule, ...reqRule],
          value: ""
        },
        {
          label: "المراجع",
          model: "referenceId",
          type: "select",
          cols: 6,
          hint: "",
          order: 2,
          rules: reqRule,
          disabled: true,
          value: ""
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
          label: "نوع البطاقة",
          model: "typeId",
          type: "select",
          onChange: this.onTypeChanged,
          cols: 6,
          hint: "",
          order: 2,
          rules: reqRule,
          value: ""
        },
        {
          label: "نوع الإصدار",
          model: "renewType",
          type: "select",
          cols: 6,
          hint: "",
          order: 2,
          value: 0
        },
        {
          label: "تاريخ أول إصدار",
          model: "dateOfIssurance",
          type: "date",
          cols: 6,
          hint: "",
          order: 3,
          onChange: this.setDateOfExpiration,
          rules: [...reqRule, ...futureDateRule],
          value: new Date().toISOString().substr(0, 10)
        },
        {
          label: "تاريخ الإنهاء لأول اصدار",
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
          hint: "",
          order: 6,
          //rules: reqRule,
          value: 28
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
          data: [
            { id: 0, name: "أول إصدار" },
            //{ id: 1, name: "تجديد" },
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
          item_value: "id",
          item_text: "typeName",
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
      isAddingAllowed: false
    };
  },
  computed: {
    cards() {
      return this.conscripte.cards;
    },
    familyMembers() {
      return this.conscripte.orderedFamilyMembers;
    }
  },
  methods: {
    async fetchSelects() {
      let selects = this.selects,
        that = this,
        keys = Object.keys(selects),
        asyncedLoop = () => {
          return new Promise((success, failure) => {
            (async function loop() {
              for (let i = 0; i < keys.length; i++) {
                let model = keys[i],
                  { table } = selects[model];
                if (table == null) continue;
                await that
                  .api("global/get_all", {
                    table
                  })
                  .then(x => {
                    if (x.data && x.data.length > 0) {
                      // if it's user table
                      if ("username" in x.data[0]) {
                        x.data = x.data.map(row => {
                          row["degreeName"] =
                            row["degree"] + "/ " + row["realName"];
                          return row;
                        });
                        that.inputs.find(input => {
                          return input.model == "referenceId";
                        }).value = that.$store.state.currentUser.userId;
                      }

                      that.$set(that.selects[model], "data", x.data);
                    } else {
                      that.$set(that.selects[model], "data", []);
                    }
                    // filtering cardTypes to get only the allowed
                    if (model == "typeId") {
                      that.filterCardTypes(x.data);
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
    /**
     * filtering cards to get only the allowed cards
     */
    filterCardTypes(types) {
      let allowedCards = this.getAllowedCards(),
        allowedTypes = types.filter(type => {
          return allowedCards[type.id] > 0;
        });

      this.selects.typeId.data = allowedTypes;
    },
    sortCardTrackings(cardTrackings = null) {
      if (cardTrackings == null) {
        return;
      }
      cardTrackings.sort((a, b) => {
        return new Date(a.dateOfRenewal) - new Date(b.dateOfRenewal);
      });
    },
    getAllowedCards() {
      /**
       * Note: the types are
       * [
       *  1=> شخصية بالمعاش,
       *  2=> عائلية بالمعاش,
       *  3=> عائلية بالخدمة,
       *  4=> والدين
       * ]
       */

      /**
       * @var Object has the structure
       * {
       *  ${typeid}: No Of allowed
       * }
       */
      let defaultAllowed = {
          "1": 0, // this is just for initiation
          "2": 0,
          "3": 0,
          "4": 0
        },
        /**
         * @var Object has the strucure
         * {
         *  ${typeid}: No Of current cards
         * }
         */
        currCards = { ...defaultAllowed },
        /**
         * the substruction from default and current
         * in case of positive it will allow more cards in the corresponding type
         * in case of negative will disabled all cards in the corresponding type
         */
        allowedCards = { ...defaultAllowed },
        /**
         * get number of wives
         *  including null for => maybe {divorced || dead}
         */
        numOfWives = this.conscripte.orderedObj
          ? Object.keys(this.conscripte.orderedObj).reduce((total, value) => {
              let isWife = value === "parents" ? false : true;
              return total + isWife;
            }, 0)
          : 0,
        isHavingpParents =
          this.conscripte.orderedObj != undefined &&
          "parents" in this.conscripte.orderedObj;
      console.log("isHaving " + isHavingpParents);

      this.conscripte.cards?.forEach(card => {
        !card.isCanceled ? currCards[card.cardType.id]++ : 1;
      });
      let currCardsTypesIds = this.conscripte.cards?.map(card => {
        return card.cardType.id;
      });

      // check if he is in service
      if (this.conscripte?.dutyCurrentState?.stateId == 1) {
        defaultAllowed["4"] = isHavingpParents;
        defaultAllowed["3"] = numOfWives;
      } else if (this.conscripte?.dutyCurrentState?.stateId == 2) {
        // he is out of service
        //defaultAllowed["2"] = numOfWives;
        console.log(this.conscripte.degree.degreeType);
        switch (this.conscripte.degree?.degreeType) {
          case "جندى":
          case "ملازم مجند": // @TODO ask
            // عدم اللياقة الطبية
            // عدم لياقة مادة 31
            if (
              [150 /*, 151, 152,*/, 176].includes(
                this.conscripte?.dutyState?.stateId
              )
            ) {
              defaultAllowed["1"] = 1;
            }

            // الاستشهاد
            if ([162].includes(this.conscripte?.dutyState?.stateId)) {
              defaultAllowed["2"] = numOfWives ? numOfWives : 1;
              defaultAllowed["4"] = isHavingpParents;
            }

            break;
          case "جندي متطوع":
          case "عـريف":
          case "عريف متطوع":
          case "رقيـب":
          case "رقيب متطوع":
          case "رقيب أول":
          case "مساعد":
          case "مساعد أول":
            if (
              // مادة 109
              // بلوغ السن القانوني
              // الفقرة الأخيرة 107
              // عدم الصلاحية الفنية
              [165, 172, 174, 164].includes(this.conscripte?.dutyState?.stateId)
            ) {
              defaultAllowed["1"] = 1;
            }

            // عدم اللياقة الطبية
            if (
              [150, /*151, 152,*/ 176].includes(
                this.conscripte?.dutyState?.stateId
              )
            ) {
              defaultAllowed["1"] = 1;
              defaultAllowed["2"] = numOfWives ? numOfWives : 1;
            }

            // الاستشهاد
            if ([162].includes(this.conscripte?.dutyState?.stateId)) {
              defaultAllowed["2"] = numOfWives ? numOfWives : 1;
              defaultAllowed["4"] = isHavingpParents;
            }

            // وفاه
            // المفروض فيه وفاه بسبب الخدمة وبسبب غير الخدمة
            if ([163].includes(this.conscripte?.dutyState?.stateId)) {
              defaultAllowed["2"] = numOfWives ? numOfWives : 1;
            }
            break;

          default:
            this.showError(
              "خطأ هذه الدرجة غير مسجلة في منظومة البطاقات العلاجية"
            );
            break;
        }
      }

      Object.keys(defaultAllowed).forEach(typeId => {
        allowedCards[typeId] = defaultAllowed[typeId] - currCards[typeId];
      });

      return (this.allowedCards = allowedCards);
    },
    showCard(card, step = 1) {
      console.log(card);
      this.$refs?.profileCardDialog?.showCard({ ...card }, step);
    },
    previewImg() {
      this.imgPath = this.img ? URL.createObjectURL(this.img) : null;
    },
    onTypeChanged() {
      this.setDateOfExpiration();
      this.filterFamilyMembers();

      // remove chosen family members
      this.selectedFamilyMembers = [];
    },
    setDateOfExpiration() {
      let selectedTypeId = this.inputs.find(input => input.model == "typeId")
          .value,
        selectedType = this.selects.typeId.data.find(
          type => type.id == selectedTypeId
        ),
        expirationDateInYears = selectedType
          ? selectedType.expirationDateInYears
          : 1,
        dateOfIssurance = this.inputs.find(
          input => input.model == "dateOfIssurance"
        ).value;
      if (dateOfIssurance == "") {
        dateOfIssurance = new Date().toISOString().substr(0, 10);
        this.inputs.find(
          input => input.model == "dateOfIssurance"
        ).value = dateOfIssurance;
      }
      dateOfIssurance = new Date(dateOfIssurance);
      let dateOfExpiration = new Date(
        dateOfIssurance.setFullYear(
          dateOfIssurance.getFullYear() + expirationDateInYears
        )
      );

      this.inputs.find(
        input => input.model == "dateOfExpiration"
      ).value = dateOfExpiration.toISOString().substr(0, 10);
    },

    /**
     * filtering according to the type of selected card
     */
    filterFamilyMembers() {
      let selectedTypeId = this.inputs.find(input => input.model == "typeId")
          .value,
        selectedType = this.selects.typeId.data.find(
          type => type.id == selectedTypeId
        );

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
    async save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loading = true;
      this.disabled = true;
      let card = {};
      let cardTracking = {};
      this.inputs.forEach(input => {
        let column = input.model,
          value =
            typeof input.value == "string" ? input.value.trim() : input.value;

        switch (column) {
          case "cardNumber":
            card[column] = value;
            //cardTracking["_" + column] = value;
            break;
          case "fileNumber":
            card[column] = value;
            break;
          case "dateOfIssurance":
            card[column] = value;
            cardTracking["dateOfRenewal"] = value;
            break;
          case "typeId":
            card[column] = value;
            break;
          default:
            cardTracking[column] = value;
            break;
        }
      });

      card["consMilitaryId"] = this.conscripte.militaryId;
      //cardTracking["referenceId"] = this.$store.state.currentUser.userId;
      cardTracking["sectionId"] = this.$store.state.currentUser.section;

      if (this.img != null) {
        let ext = this.img.path.split(".").pop(),
          newPath = `${this.$store.getters.getTcUploadPath}\\${
            card.consMilitaryId
          }\\cards\\${card.cardNumber}_${this.getRandom()}.${ext}`;

        // first upload the
        await this.upload(this.img.path, newPath).catch(err => {
          this.showError("لم يتم رفع الصورة على السيرفر");
          console.log(err);
          return;
        });
        cardTracking["imagePath"] = newPath;
      }
      // Create card
      this.api("global/create_one", {
        table: "cards",
        where: card
      })
        // getting card Id
        .then(async () => {
          let cardId;
          await this.api("global/get_one", {
            table: "cards",
            where: card
          }).then(x => {
            cardId = x.data.id;
          });
          console.log(cardId);
          return cardId;
        })
        .then(async cardId => {
          // Create tracking record for this card
          this.api("global/create_one", {
            table: "cardsTracking",
            where: { ...cardTracking, cardId }
          })
            .then(async () => {
              this.showSuccess("تمت الإضافة");
              await this.addingMembersToCard(cardId);

              this.$refs.form.reset();
              this.model = false;
            })
            .catch(err => {
              this.showError("لم تتم العملية");
              console.log(err);
            })
            .finally(() => {
              this.loading = false;
              this.disabled = false;
              this.updateCards();
            });
        })
        .catch(err => {
          this.showError("لم تتم العملية");
          console.log(err);
        });
    },
    async addingMembersToCard(cardId) {
      for (let i = 0; i < this.selectedFamilyMembers.length; i++) {
        let id = this.selectedFamilyMembers[i];
        await this.api("global/update_one", {
          table: "cardsFamilyMembers",
          where: {
            id: id
          },
          update: {
            cardId: cardId
          }
        }).catch(err => {
          console.log("Member Id: ", nationalId);
          console.log(err);
        });
      }

      await this.api("global/get_all", {
        table: "cardsFamilyMembers",
        where: {
          consMilitaryId: this.conscripte.militaryId
        },
        include: [
          { model: "cardsFamilyTypeRel", required: false },
          { model: "religions", required: false },
          { model: "nationalities", required: false },
          { model: "governorates", required: false },
          { model: "cardsEducations", required: false },
          { model: "cardsDiagnoses", required: false }
        ]
      })
        .then(x => {
          this.conscripte.cardsFamilyMembers = x.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    async updateCards() {
      this.conscripte.cards = [];
      await this.api("global/get_all", {
        table: "cards",
        where: {
          consMilitaryId: this.conscripte.militaryId
        },
        include: [
          { model: "cardsTracking", required: false },
          { model: "cardTypes", required: false },
          { model: "cardsFamilyMembers", required: false }
        ]
      })
        .then(x => {
          this.conscripte.cards = x.data;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.refreshComponents();
        });
    },

    editMember(member) {
      this.$emit("editMember", member);
    },
    deleteMember(member) {
      this.$emit("deleteMember", member);
    },
    addMember(rel) {
      this.$emit("addMember", rel);
    }
  },
  watch: {
    allowedCards: {
      deep: true,
      immediate: true,
      handler(v) {
        let allowedCards = v,
          typeIds = Object.keys(allowedCards);

        this.isAddingAllowed = false;

        typeIds.forEach(typeId => {
          // if at least one return true
          if (allowedCards[typeId] > 0) {
            this.isAddingAllowed = true;
          }
        });
      }
    }
  }
};
</script>

<style>
.image-selector {
  position: absolute;
  left: calc(50% - 16px);
  margin: 0;
  padding: 0;
  bottom: 30px;
}
.treatmentCard {
  flex: 0 0 340px;
  margin: 0 0 10px 10px;
}
.justify-space-evenly {
  justify-content: space-evenly;
}
</style>
