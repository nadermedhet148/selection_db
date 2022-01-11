<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-card-title class="sidenav white--text">
          قسم إنهاء الخدمة
          <v-spacer></v-spacer>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>
                    البيان
                  </th>
                  <th>
                    العدد
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in results.outService" :key="row.name">
                  <td>{{ row.name }}</td>
                  <td>{{ row.val }}</td>
                </tr>
                <tr>
                  <td>الإجمالي</td>
                  <td>{{ results.totalOutService }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card outlined>
        <v-card-title class="sidenav white--text">
          قسم التسجيل
          <v-spacer></v-spacer>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>
                    البيان
                  </th>
                  <th>
                    العدد
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in results.inService" :key="row.name">
                  <td>{{ row.name }}</td>
                  <td>{{ row.val }}</td>
                </tr>
                <tr>
                  <td>الإجمالي</td>
                  <td>{{ results.totalInService }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "cards",
  data: () => ({
    results: {
      // [{key: $$, value: $$}]
      outService: [],
      inService: [],
      totalInService: 0,
      totalOutService: 0
    }
  }),
  mounted() {
    this.getResults();
  },
  methods: {
    async getResults() {
      await this.pushRow("بطاقات علاجية شخصية", this.getCountPersonalCards);
      await this.pushRow("بطاقات علاجية عائلية", this.getCountFamilyCards);
      await this.pushRow("بطاقات علاجية والدين", this.getCountParentCards);
    },
    async pushRow(name, func) {
      this.results.inService.push({
        name: name,
        val: await func(true)
      });

      this.results.outService.push({
        name: name,
        val: await func(false)
      });
    },
    async getCountPersonalCards(isInService = true) {
      if (isInService) return 0;
      let cards = await this.api("global/get_all", {
        table: "cards",
        where: {
          typeId: 1
        },
        attrs: ["id"]
      }).catch(err => {
        console.log(err);
      });
      let total = this.results.totalOutService + cards.data.length;
      this.$set(this.results, "totalOutService", total);
      return cards.data.length;
    },
    async getCountFamilyCards(isInService = true) {
      let cards = await this.api("global/get_all", {
        table: "cards",
        where: {
          typeId: isInService ? 3 : 2
        },
        attrs: ["id"]
      }).catch(err => {
        console.log(err);
      });
      if (isInService) {
        let total = this.results.totalInService + cards.data.length;
        this.$set(this.results, "totalInService", total);
      } else {
        let total = this.results.totalOutService + cards.data.length;
        this.$set(this.results, "totalOutService", total);
      }
      return cards.data.length;
    },
    async getCountParentCards(isInService = true) {
      let cards = await this.api("global/get_all", {
        table: "cards",
        where: {
          typeId: 4
        },
        include: [
          {
            model: "conscriptes",
            required: true,
            where: {
              stateIdCurrent: isInService ? 1 : 2
            }
          }
        ]
      }).catch(err => {
        console.log(err);
      });

      if (isInService) {
        let total = this.results.totalInService + cards.data.length;
        this.$set(this.results, "totalInService", total);
      } else {
        let total = this.results.totalOutService + cards.data.length;
        this.$set(this.results, "totalOutService", total);
      }
      return cards.data.length;
    }
  }
};
</script>
