<template>
  <div
    @keydown.f12="saveAllData"
    @keydown.insert="goThere('/ended_duty_main_data')"
    tabindex="0"
    class="no-focus"
  >
    <main-data-card
      :loading="main_loading"
      :main_data="main_data"
      class="mb-6"
      ref="main_data"
      :saveEnabled="enabledMainSave"
      @saveEndedData="$refs.ended_data.saveData()"
    ></main-data-card>
    <ended-data-card
      :loading="ended_loading"
      :ended_duty_data="ended_data"
      :main_data.sync="main_data"
      ref="ended_data"
      @findEnded="findEnded"
      :saveEnabled="enabledEndedSave"
    ></ended-data-card>
  </div>
</template>

<script>
export default {
  name: "endedtives-ended",
  components: {
    MainDataCard: () =>
      import("@/components/sections/enhaa/main_data/ended-duty/main_data.vue"),
    EndedDataCard: () =>
      import("@/components/sections/enhaa/main_data/ended-duty/ended_data.vue")
  },
  data: () => ({
    componentName: "ended_duty_main_data",
    main_loading: false,
    ended_loading: false,
    main_data: {},
    main_data_original: {},
    enabledMainSave: false,
    ended_data: {},
    ended_data_original: {},
    enabledEndedSave: false
  }),
  watch: {
    main_data: {
      handler(v) {
        this.enabledMainSave = false;
        this.$set(this.ended_data, "termDate", v.endingDutyDate);
        Object.keys(v).forEach(key => {
          let value = v[key];
          if (value !== this.main_data_original[key]) {
            this.enabledMainSave = true;
          }
        });
      },
      deep: true
    },
    ended_data: {
      handler(v) {
        this.enabledEndedSave = false;
        Object.keys(v).forEach(key => {
          let value = v[key];
          if (value !== this.ended_data_original[key]) {
            this.enabledEndedSave = true;
          }
        });
      },
      deep: true
    }
  },
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
    this.findEnded();
  },
  methods: {
    saveAllData(e) {
      // console.log(e);
      if (this.enabledMainSave) {
        this.$refs.main_data.saveData();
      } else {
        if (this.enabledEndedSave) {
          this.$refs.ended_data.saveData();
        }
      }
    },
    findEnded() {
      let conscripte_id = this.params.id;
      this.$set(this, "main_loading", true);
      this.$set(this, "main_data", {});
      this.$set(this, "ended_data", []);
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
          "stateId",
          "typeId",
          "stateIdCurrent",
          "conscriptionDate",
          "demobilizationDate",
          "endingDutyDate",
          "address",
          "forceId",
          "martialStateId"
        ],
        include: []
      })
        .then(x => {
          this.$set(
            this,
            "main_data",
            this.fixDates(
              [x.data],
              ["conscriptionDate", "demobilizationDate", "endingDutyDate"]
            )[0]
          );
          this.$set(this, "main_data_original", { ...x.data });
          if (x.data == null) {
            this.showError("الرقم العسكري غير صحيح.");
          } else {
            this.$set(this, "ended_loading", true);
            this.api("global/get_one", {
              table: "dutyTerminations",
              where: {
                militaryId: conscripte_id
              }
            })
              .then(async xx => {
                console.log(xx.data);
                if (!xx.data) {
                  this.showError(
                    "الرقم العسكري صحيح, لكن غير مسجل له أي بيانات منتهي بأسباب."
                  );
                } else {
                  let courts = null,
                    lastCourt = {};
                  if ([153, 154, 155, 156].includes(x.data.stateId)) {
                    // Must have a court
                    courts = await this.api("global/get_all", {
                      table: "courts",
                      where: {
                        militaryId: conscripte_id
                      }
                      // attrs: [
                      //   "courtId",
                      //   "militaryId",
                      //   "s161Date",
                      //   "lastBranchReply",
                      //   "courtDate",
                      //   "contDuty"
                      // ]
                    });
                    lastCourt = this.getTheCourt(courts);
                    // if (
                    //   courts.ok &&
                    //   Array.isArray(courts.data) &&
                    //   courts.data.length > 0
                    // ) {
                    //   lastCourt = courts.data[courts.data.length - 1];
                    // } else {
                    //   this.showError(
                    //     "في حالة إنهاء الخدمة لسوء السلوك, يجب تسجيل محاكمة للفرد. وهذا الفرد ليس له أي محاكمات مسجلة. من فضلك توجه لقسم التسجيل لإضافة المحاكمة."
                    //   );
                    // }
                  }
                  xx.data.lastCourt = lastCourt;
                  xx.data.conscripteStateId = x.data.stateId;
                  xx.data.conscripteTypeId = x.data.typeId;
                  xx.data.termDate = x.data.endingDutyDate;
                  let date_keys = Object.keys(xx.data)
                      .map(k => (k.includes("Date") ? k : "NOT_A_DATE"))
                      .filter(k => k !== "NOT_A_DATE"),
                    other_date_keys = [
                      "gond5Exemption",
                      "gond5Faculty",
                      "message4Monthes",
                      "message6Monthes",
                      "lastCourt.lastBranchReply",
                      "lastCourt.s161Date",
                      "lastCourt.courtDate"
                    ];
                  this.$set(
                    this,
                    "ended_data",
                    this.fixDates(
                      [xx.data],
                      [...date_keys, ...other_date_keys],
                      true
                    )[0]
                  );
                  this.$set(this, "ended_data_original", { ...xx.data });
                }
              })
              .catch(err => {
                console.log(err);
                this.showError(
                  "الرقم العسكري صحيح, لكن غير مسجل له أي بيانات منتهي بأسباب."
                );
              })
              .finally(() => {
                this.$set(this, "ended_loading", false);
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
    },
    /**
     * get the court which have the conditions that
     * must be in the court to end the service of the conscripte
     */
    getTheCourt(courtsDB) {
      if (
        !courtsDB.ok ||
        !Array.isArray(courtsDB.data) ||
        !courtsDB.data.length > 0
      ) {
        this.showError(
          "في حالة إنهاء الخدمة لسوء السلوك, يجب تسجيل محاكمة للفرد. وهذا الفرد ليس له أي محاكمات مسجلة. من فضلك توجه لقسم التسجيل لإضافة المحاكمة."
        );

        return {};
      }
      let courts = courtsDB.data,
        courtsLength = courts.length,
        theCourt = courts[courts.length - 1],
        error = false;

      /**
       * لو مفيش غير محاكمة واحدة
       * استخدمها حتى لو مينطبقش عليها الشروط كاملة
       * وده ميمنعش إن الايرورز تظهر كتنبيه
       * وده بأمر من المقدم
       *
       *
       * لكن لو في حالة اكتر من محاكمة لازم
       * واحدة عالاقل ينطبق عليها الشروط
       */

      // دراسة انهاء خدمة = منتهي
      courts = courts.filter(court => court.contDuty === false);
      if (courts.length == 0) {
        this.showError(
          `لا يوجد محكمة انهت خدمة المذكور. 
          <br>
          * يجب ان توجد محاكمة بها دراسة انهاء الخدمة = منتهي`
        );

        if (courtsLength > 1) {
          // عندي اكتر من محاكمة طلع إيرور
          // لحد ما يحل المشكلة
          theCourt = {};
        }
        error = true;
      } else if (courts.length > 1) {
        this.showError(
          `خطأ يوجد أكثر من محاكمة أنهت خدمة هذا المجند.
          <br>
          * يجب ان توجد محاكمة واحدة بها 
          <br>
          دراسة انهاء الخدمة = منتهي`
        );
        theCourt = {};
        error = true;
      }

      /**
       * the period should be:
       * - for soldier      = 1 year or more
       * - for saff         = 6 months or more
       * - or isDishonorable // مخله بالشرف
       * - isForSecurity &  = 3 months or more
       */
      courts = courts.filter(court => {
        let { year, month, day } = this.getPrisonPeriod(court),
          degreeId = this.main_data.degreeId;

        return (
          (degreeId == 2 && year >= 1) ||
          (degreeId != 2 && month >= 6) ||
          court.isDishonorable ||
          (court.isForSecurity && month >= 3)
        );
      });

      // there's no courts after last filter
      // and there's no error from the first
      if (!courts.length && !error) {
        this.showError(`يجب أن تنطبق احد تلك الشروط على المحكمة : 
        <br>
        * ان تكون المحكمة سنة أو اكثر للجندي.
        <br>
        * ان تكون المحكمة 6 اشهر او اكثر للصف.
        <br>
        * ان تكون جريمة مخلة بالشرف.
        <br>
        * ان تكون الجريمة تمس امن وسلامة القوات المسلحة وسجن 3 اشهر او اكثر.`);

        if (courtsLength > 1) {
          theCourt = {};
        }
        error = true;
      } else if (courts.length) {
        theCourt = courts[courts.length - 1];
      }

      return theCourt;
    },
    getPrisonPeriod(court) {
      let {
          // الحبس الإحتياطي
          prosecutionFrom,
          prosecutionTo,
          // الحبس
          imprisonFrom,
          imprisonTo,
          // الإفراج
          releaseDate,
          // الحبس
          pYear,
          pMonth,
          pDay,
          // التخفيض
          reductionYear,
          reductionMonth,
          reductionDay,
          // العفو
          forgiveYear,
          forgiveMonth,
          forgiveDay
        } = court,
        startDate = prosecutionFrom
          ? prosecutionFrom
          : imprisonFrom
          ? imprisonFrom
          : null,
        endDate = imprisonTo
          ? imprisonTo
          : prosecutionTo
          ? prosecutionTo
          : null,
        reductionPeriod = 0;
      reductionPeriod += Number(reductionDay) > 0 ? Number(reductionDay) : 0;
      reductionPeriod +=
        Number(reductionMonth) > 0 ? Number(reductionMonth) * 30 : 0;
      reductionPeriod +=
        Number(reductionYear) > 0 ? Number(reductionYear) * (30 * 12) : 0;
      reductionPeriod = Number(reductionPeriod) * (24 * 60 * 60 * 1000);
      console.log("ReductionPeriod " + reductionPeriod);
      let diff =
        startDate && endDate ? new Date(endDate) - new Date(startDate) : 0;
      if (diff > 0) {
        diff -= reductionPeriod;
      }
      let diffWithReleaseDate =
          startDate && releaseDate
            ? new Date(releaseDate) - new Date(startDate)
            : 0,
        { year: fyear, month: fmonth, day: fday } = this.periodToDate(
          diffWithReleaseDate == 0 || diffWithReleaseDate > diff
            ? 0
            : diff - diffWithReleaseDate,
          false
        );
      return this.periodToDate(
        diffWithReleaseDate ? diffWithReleaseDate : diff
      );
    }
  }
};
</script>
