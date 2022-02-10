<template>
  <div>
    <v-card disabled class="mb-8">
      <v-card-title class="mb-1">
        تصحيح الدرجة للجنود و 
      </v-card-title>
      <v-card-subtitle>
        باستخدام الشبكة العسكرية, يتم احضار آخر درجة ترقي أو عزل انتهى إليها
        الفرد حتى الآن, وتخزينها في قاعدة البيانات الداخلية
      </v-card-subtitle>
      <v-card-text v-if="operation.begin">
        <v-progress-linear
          :value="operation.perc"
          color="primary"
          height="15"
          rounded
          :indeterminate="operation.all == 0"
        ></v-progress-linear>
        <v-card-actions>
          {{ operation.perc }}%
          <v-spacer></v-spacer>
          <span v-if="operation.all > 0">
            {{ operation.all }} / {{ operation.done }}
          </span>
          <v-spacer></v-spacer>
          <span
            v-if="operation.all > 0 && operation.cons[operation.done]"
            v-text="operation.cons[operation.done].militaryId"
          ></span>
        </v-card-actions>
        <v-card-text v-if="operation.finish">
          <v-alert type="info" prominent>
            تمت العملية
          </v-alert>
        </v-card-text>
      </v-card-text>
      <v-card-actions v-else>
        <v-btn color="primary" class="px-6" large outlined @click="beginJob()">
          بدأ العمل
        </v-btn>
        <v-btn outlined @click="extractEdaraPDF()">
          تحليل PDF منظومة إدارة السجلات
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card>
      <v-card-title>
        الملاحظات
        <v-spacer></v-spacer>
        <v-chip>
          {{ errors.items.length }}
        </v-chip>
      </v-card-title>
      <v-data-table
        :items="errors.items"
        :headers="errors.headers"
        fixed-header
      ></v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "FixDegreesOperation",
  data: () => ({
    edaraText: [],
    componentName: "nozom_operations",
    operation: {
      begin: false,
      finish: false,
      perc: 0,
      done: 0,
      all: 0,
      cons: []
    },
    errors: {
      items: [],
      headers: [
        {
          text: "الرقم العسكري",
          value: "militaryId"
        },
        {
          text: "الإسم",
          value: "fullName"
        },
        {
          text: "الملحوظات",
          value: "notes"
        }
      ]
    },
    degrees: {
      2: 1, // جندي
      13: 2, // طالب
      3: 3, // عريف
      8: 4, // رقيب
      17: 5, // رقيب أول
      21: 6, // مساعد
      23: 7, // مساعد أول
      11: 8, // ملازم
      12: 9, // ملازم أول
      6: 10, // نقيب
      5: 11, // رائد
      1: 12 // مقدم
    },
    webDegrees: {
      2: 2,
      13: 14,
      3: 3,
      8: 5,
      17: 17,
      21: 18,
      23: 19,
      11: 13,
      12: 22,
      6: 23,
      5: 24,
      1: 25
    }
  }),
  watch: {
    "operation.done"(v) {
      this.$set(
        this.operation,
        "perc",
        Math.floor((v * 100) / this.operation.all)
      );
    }
  },
  sockets: {
    edaraExtracted(x) {
      this.$set(this, "edaraText", x);
    }
  },
  methods: {
    extractEdaraPDF() {
      // this.$socket.client.emit("edara-pdf");
      this.$socket.client.emit("reconstruct-pdf");
    },
    reset() {
      this.$set(this, "operation", {
        begin: false,
        finish: false,
        perc: 0,
        done: 0,
        all: 0,
        cons: []
      });
    },
    async beginJob() {
      this.reset();
      this.$set(this.operation, "begin", true);
      let that = this,
        conscriptes = await this.api("global/get_all", {
          table: "conscriptes",
          where: {
            // webAt: {
            //   $gte: "2021-01-15"
            // },
            stateIdCurrent: 1,
            typeId: 2,
            degreeId: {
              $is: null
            }
          },
          attrs: ["militaryId"]
        }),
        cons = conscriptes.data;
      this.$set(this.operation, "cons", cons);
      this.$set(this.operation, "all", cons.length);
      let asyncedLoop = () => {
        return new Promise((success, failure) => {
          (async function loop() {
            for (let i = 0; i < cons.length; i++) {
              let c = cons[i],
                conscripteData = await that.api("global/get_one", {
                  table: "conscriptes",
                  where: {
                    militaryId: c.militaryId
                  },
                  attrs: ["militaryId", "fullName"],
                  include: [
                    {
                      model: "webPromotions",
                      include: [
                        {
                          model: "webDegrees"
                        }
                      ]
                    }
                  ]
                }),
                conscripte = conscripteData.data;
              conscripte.webDegreeText = "";
              conscripte.webDegreeId = null;
              conscripte.notes = [];
              if (conscripte.webPromotions.length > 0) {
                let newPromos = [];
                conscripte.webPromotions.forEach(promo => {
                  if (promo.webDegree) {
                    let pid = that.degrees[promo.webDegree.id];
                    if (pid) {
                      promo.webDegree.webId = promo.webDegree.id;
                      promo.webDegree.id = pid;
                      newPromos.push(promo.webDegree);
                    }
                  }
                });
                if (newPromos.length > 0) {
                  newPromos.sort((a, b) => a.id - b.id);
                  let lastPromo = newPromos[newPromos.length - 1];
                  conscripte.webDegreeText = lastPromo.displayedText;
                  conscripte.webDegreeId = lastPromo.webId;
                }
              }
              if (conscripte.webDegreeId) {
                conscripte.degreeId = that.webDegrees[conscripte.webDegreeId];
                if (!conscripte.degreeId) {
                  // ! Error: degree is not correct
                  conscripte.notes.push(
                    "الدرجة المخزنة من الشبكة العسكرية غير صحيحة"
                  );
                  conscripte.notes.push(conscripte.webDegreeText);
                  conscripte.notes.push(conscripte.webDegreeId);
                }
              } else {
                // ! Error: no degree exists in website
                conscripte.notes.push("ليس له درجة في الشبكة العسكرية");
              }
              let updateCon = conscripte.degreeId
                ? await that.api("global/update_one", {
                    table: "conscriptes",
                    where: {
                      militaryId: conscripte.militaryId
                    },
                    update: {
                      degreeId: conscripte.degreeId,
                      updatedDegree: true
                    }
                  })
                : null;
              if (conscripte.notes.length > 0) {
                // console.log(conscripte);
                conscripte.notes = conscripte.notes.join(" , ");
                that.$set(
                  that.errors.items,
                  that.errors.items.length,
                  conscripte
                );
              }
              conscripte = null;
              that.$set(that.operation, "done", i + 1);
              if (i == cons.length - 1) {
                success(true);
              }
            }
          })();
        });
      };
      await asyncedLoop();
      this.$set(this.operation, "finish", true);
    }
  }
};
</script>
