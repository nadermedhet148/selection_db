module.exports = async $this => {
  let mainTable = "treatmentKomsoinEndTerm";

  $this
    .api(
      "global/get_all",
      {
        table: mainTable
        // where: {
        //   NationalIDExtraMember: "27806041401636"
        // }
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

      $this.connectDefaultDevice();
      $this.$set($this.progress, "all", diagnoses.length);
      for (let i = 0; i < diagnoses.length; i++) {
        let tmpImg64 = data[i].picture,
          tmpImgPath = diagnoses[i].imagePath;
        delete diagnoses[i].tmpImg64;
        delete diagnoses[i].imagePath;
        $this.api("global/check_or_create_by_key", {
          table: "cardsDiagnoses",
          where: diagnoses[i],
          params: diagnoses[i]
        });

        if (tmpImg64 && tmpImg64 != null && tmpImgPath) {
          await $this.createImage(tmpImg64.data, tmpImgPath);
          console.log(diagnoses[i]);
          await $this.api("global/update_one", {
            table: "cardsDiagnoses",
            where: {
              committeNum: diagnoses[i].committeNum,
              committeDate: diagnoses[i].committeDate
            },
            update: {
              imagePath: tmpImgPath
            }
          });
        }
        $this.$set($this.progress, "done", i + 1);
      }
      $this.disconnectDefaultDevice();
      $this.showSuccess("نجحت العملية");
    });
};
