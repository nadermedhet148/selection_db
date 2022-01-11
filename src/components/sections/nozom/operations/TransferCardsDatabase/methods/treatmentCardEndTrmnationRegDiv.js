module.exports = $this => {
  $this
    .api(
      "global/get_all",
      {
        table: "treatmentCardEndTrmnationRegDiv",
        attrs: { exclude: ["picture"] }
      },
      "tc"
    )
    .then(async x => {
      console.log(x);
      let data = x.data,
        /**
         * for Cards
         */
        dataMap = {
          cardNumber: { key: "cardNumber", type: "number" },
          profileNumber: "fileNumber",
          dateOfIssuance: {
            key: "dateOfIssurance",
            type: "date"
          },
          militaryId: "consMilitaryId"
        },
        idMap = {
          cardTypeId: {
            key: "typeId",
            map: {
              "0": 1, // شخصية
              "1": 2, // عائلية معاش
              "2": 4 // والدين
            }
          }
        };
      let asyncedLoop = () => {
        return new Promise((success, failure) => {
          (async function loop() {
            let cards;
            await $this.dataMapping(dataMap, data, idMap).then(x => {
              cards = x;
            });
            // to get expirational date
            $this.$set($this.progress, "all", cards.length);
            for (let i = 0; i < cards.length; i++) {
              console.log(cards[i]);
              await $this
                .api("global/check_or_create_by_key", {
                  table: "cards",
                  where: {
                    cardNumber: cards[i].cardNumber,
                    typeId: cards[i].typeId,
                    consMilitaryId: cards[i].consMilitaryId
                  },
                  params: cards[i]
                })
                .catch(err => {
                  console.log(err);
                });
              $this.$set($this.progress, "done", i + 1);
            }

            $this.showSuccess("نجحت العملية");
            success(true);
          })();
        });
      };
      asyncedLoop();
    });
};
