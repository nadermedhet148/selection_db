module.exports = $this => {
  $this
    .api(
      "global/get_all",
      {
        table: "treatmentRenewalTrackingRegDiv",
        attrs: { exclude: ["picture"] }
      },
      "tc"
    )
    .then(x => {
      console.log(x.data);
      let data = x.data,
        dataMap = {
          //cardNumber: { key: "_cardNumber", type: "number" },
          cardNumber: { key: "cardId", to: "cardId", type: "number" },
          mohafzaId: "officeId",
          notes: "notes",
          dateOfRenewal: { key: "dateOfRenewal", type: "date" },
          dateOfRenewalEnd: { key: "dateOfExpiration", type: "date" },
          hospitalId: "hospitalId",
          certificationId: "certificantId",
          renewType: "renewType",
          picture: {
            key: "imagePath",
            type: "base64", // convert from base64 to path
            hasCorres: true,
            basePath:
              $this.$store.getters.getTcUploadPath +
              "\\${militaryId}\\cards\\${cardNumber}_"
          },
          isEndTerm: { value: false }
        },
        idMap = {
          referencesId: {
            key: "referenceId",
            map: $this.loadIdMap("references")
          }
        };
      $this.connectDefaultDevice();
      let asyncedLoop = () => {
        return new Promise((success, failure) => {
          (async function loop() {
            let cardsTrackings;

            await $this.dataMapping(dataMap, data, idMap).then(x => {
              cardsTrackings = x;
            });
            console.log(cardsTrackings);
            $this.$set($this.progress, "all", cardsTrackings.length);

            // define here before for loop to optimize using ram
            let tmpImg64, cardsTracking;
            for (let i = 0; i < cardsTrackings.length; i++) {
              cardsTracking = { ...cardsTrackings[i] };
              delete cardsTracking.imagePath;
              await $this
                .api("global/check_or_create_by_key", {
                  table: "cardsTracking",
                  where: {
                    cardId: cardsTrackings[i].cardId,
                    dateOfRenewal: cardsTrackings[i].dateOfRenewal,
                    dateOfExpiration: cardsTrackings[i].dateOfExpiration
                  },
                  params: cardsTracking
                })
                .catch(err => {
                  console.log(cardsTrackings[i]);
                  console.log(err);
                });

              delete data[i].militaryId;

              await $this
                .api(
                  "global/get_one",
                  {
                    table: "treatmentRenewalTrackingRegDiv",
                    where: data[i],
                    attrs: ["picture"]
                  },
                  "tc"
                )
                .then(x => {
                  tmpImg64 = x.data != null ? x.data.picture : null;
                })
                .catch(err => {
                  console.log(err);
                });
              if (tmpImg64 && tmpImg64 != null && cardsTrackings[i].imagePath) {
                await $this.createImage(tmpImg64, cardsTrackings[i].imagePath);

                await $this.api("global/update_one", {
                  table: "cardsTracking",
                  where: {
                    cardId: cardsTrackings[i].cardId,
                    dateOfRenewal: cardsTrackings[i].dateOfRenewal,
                    dateOfExpiration: cardsTrackings[i].dateOfExpiration
                  },
                  update: {
                    imagePath: cardsTrackings[i].imagePath
                  }
                });
                tmpImg64 = null;
              }
              $this.$set($this.progress, "done", i + 1);
            }

            $this.showSuccess("???????? ??????????????");
            success(true);
          })();
        });
      };
      asyncedLoop();
    });
};
