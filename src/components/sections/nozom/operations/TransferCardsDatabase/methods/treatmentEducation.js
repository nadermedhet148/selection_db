module.exports = async $this => {
  let mainTable = "treatmentEducation";

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
            to: "memberId",
            type: "number"
          },
          level: "level",
          schoolName: "schoolName",
          applyDate: {
            key: "applyDate",
            type: "date"
          }
        };

      let educations;
      await $this.dataMapping(dataMap, data).then(x => {
        educations = x;
      });

      $this.$set($this.progress, "all", educations.length);
      for (let i = 0; i < educations.length; i++) {
        console.log(educations[i]);
        $this.api("global/check_or_create_by_key", {
          table: "cardsEducations",
          where: educations[i],
          params: educations[i]
        });
        $this.$set($this.progress, "done", i + 1);
      }
      $this.showSuccess("نجحت العملية");
    });
};
