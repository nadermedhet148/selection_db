module.exports = async $this => {
  let mainTable = "treatmentKomsoin";

  $this
    .api(
      "global/get_all",
      {
        table: mainTable
      },
      "tc"
    )
    .then(async x => {
      console.log(x);
      let data = x.data,
        dataMap = {
          nationalIdExtraMember: {
            key: "memberId",
            type: "number",
            to: "memberId"
          },
          lagnaId: "committeNum",
          lagnaDate: {
            key: "committeDate",
            type: "date"
          },
          tash5Es: "diagnosis",
          lagnaDecision: "decision",
          deserve: "isDeserve",
          picture: {
            key: "imagePath",
            type: "base64", // convert from base64 to path
            hasCorres: true,
            basePath:
              $this.$store.getters.getTcUploadPath +
              "\\${militaryId}\\members\\diagnoses\\${nationalId}_"
          }
        };

      let diagnoses;
      await $this.dataMapping(dataMap, data).then(x => {
        diagnoses = x;
      });

      $this.$set($this.progress, "all", diagnoses.length);
      for (let i = 0; i < diagnoses.length; i++) {
        console.log(diagnoses[i]);
        $this.api("global/check_or_create_by_key", {
          table: "cardsDiagnoses",
          where: diagnoses[i],
          params: diagnoses[i]
        });

        if ("tmpImg64" in diagnoses[i] && diagnoses[i].tmpImg64 != null) {
          await $this.createImage(
            diagnoses[i].tmpImg64.data,
            diagnoses[i].imagePath
          );
          //console.log(diagnoses[i].tmpImg64.data.toString("base64"));
          delete diagnoses[i].tmpImg64;

          await $this.api("global/update_one", {
            table: "cardsDiagnoses",
            where: {
              committeNum: diagnoses[i].committeNum,
              committeDate: diagnoses[i].committeDate
            },
            update: {
              imagePath: diagnoses[i].imagePath
            }
          });
        }
        $this.$set($this.progress, "done", i + 1);
      }
      $this.showSuccess("نجحت العملية");
    });
};
