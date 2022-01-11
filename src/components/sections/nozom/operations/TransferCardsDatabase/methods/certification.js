module.exports = $this => {
  // get data
  $this
    .api(
      "global/get_all",
      {
        table: "treatmentCertification"
      },
      "tc"
    )
    .then(x => {
      let data = x.data,
        dataMap = {
          certificationId: "id",
          certificationText: "displayedText"
        };
      let asyncedLoop = () => {
        return new Promise((success, failure) => {
          (async function loop() {
            let certificants;
            await $this.dataMapping(dataMap, data).then(x => {
              certificants = x;
            });

            await $this
              .api("global/create_bulk", {
                table: "cardsCertificants",
                where: certificants
              })
              .catch(err => {
                console.log(err);
              })
              .finally(() => {
                $this.showSuccess("نجحت العملية");
                success(true);
              });
          })();
        });
      };
      asyncedLoop();
    });
};
