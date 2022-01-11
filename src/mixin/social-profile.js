import Vue from "vue";
Vue.mixin({
  methods: {
    afraadConscripte({ where = {}, attrs = [], include = [] }) {
      return new Promise((success, failure) => {
        // Check soldiers
        let soldiers = [],
          smSoldiers = [],
          nonCom = [];
        this.api(
          "global/get_all",
          {
            table: "soldier",
            where,
            attrs,
            include
          },
          "af"
        )
          .then(x => {
            soldiers = x.data;
          })
          .catch(error => {
            // Not in soldiers
          })
          .finally(() => {
            this.api(
              "global/get_all",
              {
                table: "smSoldier",
                where,
                attrs,
                include
              },
              "af"
            )
              .then(x => {
                smSoldiers = x.data;
              })
              .catch(error => {
                // Not in smSoldiers
              })
              .finally(() => {
                this.api(
                  "global/get_all",
                  {
                    table: "rateb",
                    where,
                    attrs,
                    include
                  },
                  "af"
                )
                  .then(x => {
                    nonCom = x.data;
                  })
                  .catch(error => {
                    // Not in nonCom
                  })
                  .finally(() => {
                    success([...soldiers, ...smSoldiers, ...nonCom]);
                  });
              });
          });
      });
    },
    socialApi({
      id = "",
      key = "militaryId",
      table = "conscriptes",
      returner = "array",
      conditions = {},
      include = [],
      dateKeys = [],
      attrs = []
    }) {
      return new Promise((success, failure) => {
        returner = table == "conscriptes" ? "object" : returner;
        let toGet = returner == "object" ? "one" : "all",
          obj = {
            table,
            where: {
              [key]: id,
              ...conditions
            },
            include
          };
        if (attrs && attrs.length > 0) {
          obj.attrs = attrs;
        }
        return this.api(`global/get_${toGet}`, { ...obj })
          .then(x => {
            if (x.ok && x.data) {
              let dates = Object.keys(
                  returner == "array" ? x.data[0] : x.data
                ).filter(d => d.toLowerCase().includes("date")),
                data =
                  returner == "array"
                    ? this.fixDates(x.data, [...dates, ...dateKeys])
                    : this.fixDates([x.data], [...dates, ...dateKeys])[0];
              success(data);
            } else {
              success(returner == "array" ? [] : {});
            }
          })
          .catch(error => {
            console.log(error);
            success(returner == "array" ? [] : {});
          });
      });
    }
  }
});
