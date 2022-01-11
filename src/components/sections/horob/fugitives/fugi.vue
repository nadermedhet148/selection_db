<template>
  <div>
    <main-data-card
      :loading="main_loading"
      :main_data="main_data"
      class="mb-6"
    ></main-data-card>
    <fugi-data-card
      :add_new_loading.sync="add_new_loading"
      :loading="fugi_loading"
      :fugi_data="fugi_data"
      @add-new-fugi="addNewFugi"
      @fugi-deleted="fugiDeleted"
    ></fugi-data-card>
  </div>
</template>

<script>
export default {
  name: "fugitives-fugi",
  components: {
    MainDataCard: () =>
      import("@/components/sections/horob/fugitives/fugi/main_data.vue"),
    FugiDataCard: () =>
      import("@/components/sections/horob/fugitives/fugi/fugi_data.vue")
  },
  props: {
    add_new_loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    componentName: "fugitives",
    main_loading: false,
    fugi_loading: false,
    main_data: {},
    fugi_data: [],
    isNonCommissioned: false
  }),
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
  mounted() {
    this.findFugi();
  },
  watch: {
    "params.id"(v) {
      if (v && v.length > 0) {
        this.findFugi();
      }
    }
  },
  methods: {
    addNewFugi() {
      this.$emit("add-new-fugi");
    },
    fugiDeleted() {
      this.addModification(this.params.id, 3, 28);
      this.findFugi();
    },
    findFugi() {
      let conscripte_id = this.params.id;
      this.$set(this, "main_loading", true);
      this.$set(this, "main_data", {});
      this.$set(this, "fugi_data", []);
      this.api("global/get_one", {
        table: "conscriptes",
        where: {
          militaryId: conscripte_id
        },
        attrs: [
          "militaryId",
          "fullName",
          "unitId",
          "degreeId",
          "nationalId",
          "zoneId",
          "stateId",
          "stateIdCurrent",
          "conscriptionDate",
          "phone",
          "demobilizationDate",
          "birthDate",
          "address",
          "microfilmId",
          "microfilmSortIndex"
        ],
        include: []
      })
        .then(x => {
          console.log(x.data);
          if (x.data.degreeId > 13) {
            this.$set(this, "isNonCommissioned", true);
          }
          this.$set(
            this,
            "main_data",
            this.fixDates(
              [x.data],
              ["conscriptionDate", "demobilizationDate", "birthDate"]
            )[0]
          );
          if (x.data == null) {
            this.showError("الرقم العسكري غير صحيح.");
          } else {
            this.$set(this, "fugi_loading", true);
            this.api("global/get_all", {
              table: "fugitives",
              where: {
                militaryId: conscripte_id
              }
            })
              .then(xx => {
                console.log(xx.data);
                if (xx.data.length == 0) {
                  this.showError(
                    "الرقم العسكري صحيح, لكن ليس له أي هروب مسجل."
                  );
                } else {
                  xx.data.forEach(el => {
                    el.conscripte_birthdate = x.data.birthDate;
                  });
                  this.$set(
                    this,
                    "fugi_data",
                    this.selectToArray(
                      this.fixDates(xx.data, [
                        "absenceDate",
                        "branchNoticeDate",
                        "managementReceptionDate",
                        "personAttendanceDate",
                        "returnDate",
                        "s1ExecutionCommiteeDate",
                        "s1ReceptionDate",
                        "s1SendToUnitDate",
                        "s116ReceptionDate",
                        "strikeoffDate",
                        "unitNoticeDate"
                      ]),
                      [
                        "s1AttachmentsAfter21Days",
                        "s1AttachmentsBefore1Year",
                        "s1Attachments",
                        "overAgeAttachments"
                      ]
                    )
                  );
                }
              })
              .catch(err => {
                console.log(err);
                this.showError("الرقم العسكري صحيح, لكن ليس له أي هروب مسجل.");
              })
              .finally(() => {
                this.$set(this, "fugi_loading", false);
              });
          }
        })
        .catch(error => {
          console.log(error);
          if (error.data == null) {
            this.showError("الرقم العسكري غير صحيح.");
          } else {
            this.showError("حدث خطأ أثناء البحث عن الرقم العسكري.");
          }
        })
        .finally(() => {
          this.$set(this, "main_loading", false);
        });
    }
  }
};
</script>
