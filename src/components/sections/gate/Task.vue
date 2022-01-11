<template>
  <div>
    <v-dialog
      @keydown.f12="saveTask"
      @keydown.insert="createTask()"
      tabindex="0"
      class="no-focus"
      persistent
      v-model="model"
      max-width="1000"
      scrollable
    >
      <v-card :loading="loading" :disabled="loading">
        <v-card-title>
          {{ actionType == "create" ? "إضافة" : "تعديل" }}
          طلب
          <v-spacer></v-spacer>
          <v-btn icon @click="model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              v-if="
                (item.timeEnha2 && item.timeEnter) ||
                  ![0, 12, 6].includes($store.state.currentUser.section)
              "
            >
              <div v-if="item.timeEnha2 && item.timeEnter">
                <v-alert
                  :type="$vuetify.theme.dark ? 'warning' : 'info'"
                  prominent
                  outlined
                >
                  تم تنفيذ الطلب خلال
                  {{
                    new Date(item.timeEnha2)
                      | moment("from", new Date(item.timeEnter))
                      | removeMonzo
                  }}. ولا يمكنك التعديل عليه بعدما تم إنهاءه
                </v-alert>
                <v-alert
                  v-if="
                    item.timeAccept &&
                      item.timeEnha2 &&
                      new Date(item.timeAccept) - new Date(item.timeEnha2) > 0
                  "
                  type="error"
                  prominent
                  outlined
                >
                  ترتيب غير منطقي : وقت القبول بعد وقت الإنهاء
                </v-alert>
              </div>
              <div v-else>
                <v-alert
                  :type="$vuetify.theme.dark ? 'warning' : 'info'"
                  prominent
                  outlined
                >
                  <div>
                    لاحظ من فضلك, لن يمكنك التعديل على أي خانة من خانات الطلب
                    بعدما يتم إنهاءه.
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div>
                    فلا تم بالضغط على زر
                    <v-chip outlined>طلب منتهي</v-chip>
                    إلا بعدما تتأكد من إتمامك للطلب
                  </div>
                </v-alert>
              </div>
            </v-col>
            <template v-for="(h, i) in headers">
              <v-col :cols="h.fullWidth ? '6' : '4'" :key="i">
                <v-text-field
                  v-if="['datetime', 'text'].includes(h.type)"
                  filled
                  :type="h.type == 'datetime' ? 'datetime-local' : 'text'"
                  hide-details
                  :label="h.text"
                  :readonly="
                    h.type == 'datetime' ||
                    item.timeEnha2 ||
                    isAllowed(h) == false
                      ? true
                      : false
                  "
                  v-model="item[h.value]"
                  :clearable="h.type !== 'datetime' && !item.timeEnha2"
                ></v-text-field>
                <v-textarea
                  auto-grow
                  rows="1"
                  :clearable="
                    item.timeEnha2 || isAllowed(h) == false ? false : true
                  "
                  :readonly="
                    item.timeEnha2 || isAllowed(h) == false ? true : false
                  "
                  hide-details
                  :label="h.text"
                  filled
                  v-else-if="h.type == 'textarea'"
                  v-model="item[h.value]"
                ></v-textarea>
                <div v-else-if="h.type == 'checkbox'">
                  <v-card
                    flat
                    class="pa-0 ma-0"
                    :disabled="
                      item.timeEnha2 || isAllowed(h) == false ? true : false
                    "
                  >
                    <v-btn-toggle style="width: 100%" v-model="item[h.value]">
                      <v-btn
                        :value="true"
                        width="50%"
                        :color="
                          item[h.value] === true ? 'success white--text' : ''
                        "
                        height="58"
                        v-text="h.trueText"
                      ></v-btn>
                      <v-btn
                        :value="false"
                        width="50%"
                        height="58"
                        :color="
                          item[h.value] === false ? 'error white--text' : ''
                        "
                        v-text="h.falseText"
                      ></v-btn>
                    </v-btn-toggle>
                  </v-card>
                </div>
                <v-autocomplete
                  v-else-if="h.type == 'select'"
                  filled
                  :items="selects[h.valueId] ? selects[h.valueId].data : []"
                  :item-text="
                    selects[h.valueId] ? selects[h.valueId].itemText : 'text'
                  "
                  :item-value="
                    selects[h.valueId] ? selects[h.valueId].itemValue : 'value'
                  "
                  :clearable="
                    item.timeEnha2 || isAllowed(h) == false ? false : true
                  "
                  :readonly="
                    item.timeEnha2 || isAllowed(h) == false ? true : false
                  "
                  :loading="
                    selects[h.valueId] ? selects[h.valueId].loading : false
                  "
                  hide-details
                  :label="h.text"
                  v-model="item[h.valueId]"
                ></v-autocomplete>
                <v-combobox
                  v-else-if="h.type == 'combobox'"
                  filled
                  :items="selects[h.valueId] ? selects[h.valueId].data : []"
                  :item-text="
                    selects[h.valueId] ? selects[h.valueId].itemText : 'text'
                  "
                  :item-value="
                    selects[h.valueId] ? selects[h.valueId].itemValue : 'value'
                  "
                  :clearable="
                    item.timeEnha2 || isAllowed(h) == false ? false : true
                  "
                  @keydown.tab="
                    ['rakmAskrt', 'kawmy'].includes(h.valueId)
                      ? autoFillData(h.valueId)
                      : () => {}
                  "
                  :readonly="
                    item.timeEnha2 || isAllowed(h) == false ? true : false
                  "
                  :return-object="false"
                  :loading="
                    selects[h.valueId] ? selects[h.valueId].loading : false
                  "
                  hide-details
                  :label="h.text"
                  v-model="item[h.valueId]"
                ></v-combobox>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-btn
            @click="addToBlacklist()"
            color="error"
            large
            v-if="isAdmin() || isGate()"
            text
            class="px-6"
            v-text="'إضافة للقائمة السوداء'"
          ></v-btn>
          <v-btn
            @click="createTask()"
            color="primary"
            outlined
            v-if="isAdmin() || isGate()"
            large
            class="px-6"
            v-text="'طلب جديد'"
          ></v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="model = false"
            color="primary"
            outlined
            large
            class="px-6"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            @click="saveTask()"
            color="primary"
            large
            class="px-6"
            v-text="'حفظ الطلب'"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <pre dir="ltr" class="text-left">
      {{ selects }}
    </pre> -->
  </div>
</template>

<script>
export default {
  name: "GateTask",
  filters: {
    removeMonzo(v) {
      return v.replace("منذ ", "").replace("خلال ", "");
    }
  },
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    selects: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    model: false,
    loading: false,
    item: {},
    actionType: ""
  }),
  methods: {
    autoFillData(key = "") {
      if (!this.item.name && !this.item.mostafedName) {
        this.$set(this, "loading", true);
        this.api(
          "global/get_one",
          {
            table: "tasks",
            where: {
              [key]: this.item[key]
            },
            order: [["id", "DESC"]]
          },
          "so"
        )
          .then(x => {
            let task = x.data;
            if (x && x.ok && task && task.id) {
              this.$set(this.item, "name", task.name);
              this.$set(this.item, "degreeId", task.degreeId);
              this.$set(this.item, "wehdaId", task.wehdaId);
              this.$set(this.item, "kawmy", task.kawmy);
              this.$set(this.item, "rakmAskrt", task.rakmAskrt);
              this.$set(this.item, "phone", task.phone);
              this.$set(this.item, "address", task.address);
            }
          })
          .catch(error => {
            //
          })
          .finally(() => {
            this.$set(this, "loading", false);
          });
      }
    },
    addToBlacklist() {
      let task = this.item;
      if (!task.name) {
        this.showError("من فضلك أدخل اسم مقدم الطلب");
        return;
      }
      if (!task.mostafedName) {
        this.showError("من فضلك أدخل اسم المستفيد");
        return;
      }
      if (!task.typeId) {
        this.showError("من فضلك أدخل نوع مقدم الطلب - هل هو مدني أم عسكري؟ - ");
        return;
      }
      if (task.typeId == 1 && !task.kawmy) {
        this.showError("من فضلك أدخل الرقم القومي لفرد المدني");
        return;
      }
      if (task.typeId == 2 && (!task.rakmAskrt || !task.degreeId)) {
        this.showError(
          "من فضلك تأكد من إدخال الرقم العسكري والدرجة بشكل صحيح."
        );
        return;
      }
      this.$set(this, "loading", true);
      this.api(
        "global/create_one",
        {
          table: "blackLists",
          where: {
            ...task
          }
        },
        "so"
      )
        .then(x => {
          this.showSuccess("تم إضافة الفرد للقائمة السوداء");
        })
        .catch(error => {
          this.showError("تعذر إضافة الفرد للقائمة السوداء");
        })
        .finally(() => {
          this.$set(this, "loading", false);
        });
    },
    kesmToSection(kId) {
      let obj = {
        1: 0,
        2: 6,
        3: 1,
        4: 3,
        5: 2,
        6: 4,
        7: 0
      };
      return obj[kId];
    },
    isAllowed(header) {
      // console.warn("isAllowed RUN!");
      let section = this.$store.state.currentUser.section,
        { typeId: requesterTypeId, kesmId } = this.item,
        { gateOnly, sectionOnly, militaryOnly } = header,
        result = false;
      if (
        (!militaryOnly || (militaryOnly && requesterTypeId == 2)) &&
        (!gateOnly || (gateOnly && [0, 12, 6].includes(section))) &&
        (!sectionOnly ||
          (sectionOnly &&
            kesmId &&
            [0, this.kesmToSection(kesmId)].includes(section)))
      ) {
        result = true;
      }
      return result;
    },
    isSection() {
      let section = this.$store.state.currentUser.section;
      return section == 6 || section == 12 || section == 0;
    },
    editTask(item) {
      this.$set(this, "item", item);
      this.$set(this, "actionType", "edit");
      this.$set(this, "model", true);
    },
    createTask() {
      this.$set(this, "item", {});
      this.$set(this, "actionType", "create");
      this.$set(this, "model", true);
    },
    async saveTask() {
      let task = this.item,
        id = task.id;
      if (!task.name) {
        this.showError("من فضلك أدخل اسم مقدم الطلب");
        return;
      }
      if (!task.mostafedName) {
        task.mostafedName = task.name;
        // this.showError("من فضلك أدخل اسم المستفيد");
        // return;
      }
      if (!task.typeId) {
        this.showError("من فضلك أدخل نوع مقدم الطلب - هل هو مدني أم عسكري؟ -");
        return;
      }
      if (task.typeId == 1 && !task.kawmy) {
        // مدني
        this.showError("من فضلك أدخل الرقم القومي للفرد المدني");
        return;
      }
      if (task.typeId == 2 && (!task.rakmAskrt || !task.degreeId)) {
        // عسكري
        this.showError(
          "من فضلك تأكد من إدخال الرقم العسكري والدرجة بشكل صحيح."
        );
        return;
      }
      if (!task.khedma) {
        this.showError("من فضلك أدخل الخدمة المطلوبة");
        return;
      }
      if (!task.kesmId) {
        this.showError("من فضلك أدخل القسم المطلوب");
        return;
      }
      if (!id) {
        // Create new Task
        task.timeEnter = this.fixDateTime(new Date());
      }
      if (!task.timeAccept && task.accept) {
        task.timeAccept = this.fixDateTime(new Date());
      }
      if (task.montahy) {
        if (!task.termReasonId) {
          this.showError("من فضلك أدخل سبب الإنهاء");
          return;
        }
        if (!task.mo5TasId) {
          this.showError("من فضلك أدخل اسم المختص");
          return;
        }
        if (!task.matam) {
          this.showError("من فضلك أدخل ما تم تنفيذه");
          return;
        }
        if (!task.timeEnha2) {
          task.timeEnha2 = this.fixDateTime(new Date());
        }
      }
      // console.log("Task is:");
      // console.log(task);
      this.$set(this, "loading", true);
      let orArray = [];
      if (task.name) {
        orArray.push({
          name: task.name
        });
      }
      if (task.mostafedName) {
        orArray.push({
          mostafedName: task.mostafedName
        });
      }
      if (task.kawmy) {
        orArray.push({
          kawmy: task.kawmy
        });
      }
      if (task.rakmAskrt) {
        orArray.push({
          rakmAskrt: task.rakmAskrt
        });
      }
      let blackList = await this.api(
        "global/get_all",
        {
          table: "blackLists",
          where: {
            id: {
              $not: null
            },
            $and: {
              $or: orArray
            }
          }
        },
        "so"
      );
      if (
        blackList &&
        blackList.ok &&
        blackList.data &&
        blackList.data &&
        blackList.data.length > 0
      ) {
        this.showError(
          "انتبه من فضلك, هذا الشخص موجود في القائمة السوداء. سوف تتم إضافة طلبه بشكل طبيعي . وفي حال أردت حذف طلبه توجه الى مدير النظام"
        );
      }
      this.api(
        `global/${id ? "update" : "create"}_one`,
        {
          table: "tasks",
          where: id
            ? {
                id
              }
            : task,
          update: task,
          returner: "id"
        },
        "so"
      )
        .then(x => {
          // this.$set(this, "model", false);
          if (!id) {
            // New Task - Set ID for upcoming updates on this task
            this.$set(this.item, "id", x.data);
            // Send notification to specefied section
            if (task.kesmId) {
              let section = this.kesmToSection(task.kesmId);
              this.$socket.client.emit("new-gate-task-notification", {
                task,
                section
              });
            }
          }
          this.showSuccess("تم حفظ الطلب");
          this.$emit("saved", id ? false : true);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "loading", false);
        });
    }
  }
};
</script>
