<template>
  <div>
    <v-card class="mb-8">
      <v-card-title class="mb-1">
        تصحيح حالة محو الأمية للجنود العادة
      </v-card-title>
      <v-card-subtitle>
        يتم احضار جميع الجنود العادة الذين حالتهم بالخدمة. ثم يتم تمريرهم واحد
        تلو الآخر على Function حساب تاريخ التسريح. والتي بدورها تقوم بمعرفة
        موقفهم من محو الأمية ثم تعيد حساب تاريخ التسريح الخاص بهم بناءاً على ذلك
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
  name: "FixIgnorants",
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
  methods: {
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
            stateIdCurrent: 1,
            stateId: 101,
            $and: {
              $or: [
                {
                  typeId: {
                    $is: null
                  }
                },
                {
                  typeId: {
                    $not: 2
                  }
                }
              ]
            },
            qualificationId: 0
          },
          attrs: ["militaryId"]
        }),
        cons = conscriptes.data;
      // cons = cons.slice(0, 10);
      this.$set(this.operation, "cons", cons);
      this.$set(this.operation, "all", cons.length);
      // console.log(cons.length);
      // return;
      let asyncedLoop = () => {
        return new Promise((success, failure) => {
          (async function loop() {
            for (let i = 0; i < cons.length; i++) {
              let c = cons[i],
                conscripte = {};
              await that
                .fixDemobilizationDate(c.militaryId)
                .then(x => {})
                .catch(() => {
                  conscripte.notes = "تعذر تمرير الـ Functions عليه";
                  that.$set(
                    that.errors.items,
                    that.errors.items.length,
                    conscripte
                  );
                  conscripte = null;
                })
                .finally(() => {
                  that.$set(that.operation, "done", i + 1);
                  if (i == cons.length - 1) {
                    success(true);
                  }
                });
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
