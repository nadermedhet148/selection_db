module.exports = $this => {
  // Get data
  $this
    .api(
      "global/get_all",
      {
        table: "conscriptes",
        attrs: { exclude: ["picture"] }
      },
      "tc"
    )
    .then(async x => {
      console.log(x);
      let data = x.data,
        dataMap = {
          /*
          dataMap
          Every key in this object will refer to the same key in the other database
          This object contains straight fields
          It doesn't include militaryId because we use it as a comparing key
          It can be string:string or string:object
          case string:string => assumes type as string, integer or boolean
          case string:object => can have a custom type
          */
          militaryId: { key: "militaryId", type: "number" },
          nationalId: { key: "nationalId", type: "number" },
          name: "fullName",
          nots: "treatmentCardNotes",
          phoneNumber: { key: "phoneNumber", type: "number" },
          address: "address",
          dateOfEndTrmenation: {
            // column oldDB
            key: "endingDutyDate", // column newDB
            hasCorres: true, // has corresponding value in the old DB
            type: "date"
          },
          picture: {
            key: "imagePath",
            type: "base64", // convert from base64 to path
            hasCorres: false,
            basePath: $this.$store.getters.getTcUploadPath + "\\${militaryId}\\"
          },
          stateId: {
            // disable this in Out of service Cons
            key: "stateId",
            hasCorres: false, // this value exists in the newDB but not in the oldDB
            type: "string",
            value: "101" // always has this value بالخدمة
          },
          stateIdCurrent: {
            key: "stateIdCurrent",
            hasCorres: false,
            type: "string",
            value: "1" // بالخدمة
          }
        },
        idMap = {
          /**
           * idMap
           * This object contains fields that doens't have the same value
           * in the other database
           * In other words, it contains foreign keys
           * oldDB => newDB
           */
          degreeId: {
            key: "degreeId",
            map: $this.loadIdMap("degrees")
          },
          unitId: {
            key: "unitId",
            map: $this.loadIdMap("units")
          }
          // trmenationId: "stateId", enable this in outOfServices cons

          // trmenationId: "dutyStates",
          // degreeId: "degrees"
        };
      $this.connectDefaultDevice();
      let created = [];
      let asyncedLoop = () => {
        return new Promise((success, failure) => {
          (async function loop() {
            let conscriptes;
            await $this.dataMapping(dataMap, data, idMap).then(x => {
              conscriptes = x;
            });
            $this.$set($this.progress, "all", conscriptes.length);

            for (let i = 0; i < conscriptes.length; i++) {
              // move all data without filtering
              /*conscriptes[i].militaryId = conscriptes[i].militaryId.replace(
                /\D+/g,
                ""
              );*/
              //console.log(conscriptes[i]);
              if (
                !conscriptes[i].militaryId ||
                conscriptes[i].militaryId == null
              ) {
                $this.$set($this.progress, "done", i + 1);
                continue;
              }
              conscriptes[i].nationalId =
                conscriptes[i].nationalId && conscriptes[i].nationalId != null
                  ? conscriptes[i].nationalId.trim()
                  : null;

              // create it if it's not exist
              await $this
                .api("global/check_or_create_by_key", {
                  table: "conscriptes",
                  where: {
                    militaryId: conscriptes[i].militaryId
                  },
                  params: conscriptes[i]
                })
                .then(x => {
                  if (x.data == -1) {
                    console.log("exists");
                  } else {
                    created.push(x.data.militaryId);
                  }
                })
                .catch(err => {
                  console.log(err);
                  console.log(conscriptes[i]);
                });

              let tmpImg64;
              await $this
                .api(
                  "global/get_one",
                  {
                    table: "conscriptes",
                    where: {
                      militaryId: conscriptes[i].militaryId
                    },
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
              // create the image
              // then update the conscripte ImagePath
              if (tmpImg64 && tmpImg64 != null && conscriptes[i].imagePath) {
                await $this.createImage(tmpImg64, conscriptes[i].imagePath);
                await $this
                  .api("global/update_one", {
                    table: "conscriptes",
                    where: {
                      militaryId: conscriptes[i].militaryId
                    },
                    update: {
                      imagePath: conscriptes[i].imagePath
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
              $this.$set($this.progress, "done", i + 1);
            }
            $this.showSuccess("نجحت العملية");
            success(true);
          })();
        });
      };
      await asyncedLoop();
      console.log("created: ", created);

      $this.disconnectDefaultDevice();
      // console.log(data);
    })
    .catch(error => {
      console.log(error);
      $this.showError(
        "An error occured while trying to get data from conscriptes table"
      );
    })
    .finally(() => {
      $this.resetProgress();
    });
};
