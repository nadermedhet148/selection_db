module.exports = async $this => {
  // the main table
  let table = "treatmentExtraFamilyMembers",
    mainKey = "nationalIdConscripte",
    conscripteTable = "conscriptes",
    cardTable = "treatmentCardRegistrationDivision",
    // the key which [[card]] connected to conscriptes with national id in extraFamilyMembers
    key = "nationalId";

  $this
    .api(
      "global/get_all",
      {
        table: table,
        attrs: { exclude: ["picture"] }
      },
      "tc"
    )
    .then(async x => {
      console.log(x);
      let data = x.data,
        dataMap = {
          cardNumber: {
            key: "cardId",
            to: "cardId",
            type: "number"
          },
          nationalId: {
            key: "nationalId",
            type: "number"
          },
          nationalIdConscripte: {
            key: "consMilitaryId",
            to: "militaryId",
            type: "number"
          },
          // nationalIdParent: {
          //   key: "motherId",
          //   type: "number"
          // },
          fullName: "name",
          birthDate: {
            key: "birthDate",
            type: "date"
          },
          deserve: "isDeserve",
          address: "address",
          teleNum: "phoneNumber",
          inMa3Ash: "isRetired",
          ma3AshAmount: "pensionVal",
          watheqaNum: "documentNum",
          marriageDate: { key: "marriageDate", type: "date" },
          divorceDate: { key: "divorceDate", type: "date" },
          picture: {
            key: "imagePath",
            type: "base64", // convert from base64 to path
            hasCorres: true,
            basePath:
              $this.$store.getters.getTcUploadPath +
              "\\${militaryId}\\members\\${nationalId}_"
          },
          jobId: "job",
          isDead: "isDead"
        },
        idMap = {
          typeId: {
            key: "familyTypeRelId",
            map: {
              "0": 4,
              "1": 5,
              "2": 1,
              "3": 2,
              "4": 3
            }
          },
          marriageStateId: {
            key: "marriageState",
            map: { "0": 2, "1": 1, "2": 3, "3": 4 }
          },
          religionId: {
            key: "religionId",
            map: {
              مسلم: 1,
              مسيحى: 2
            }
          },
          nationalityId: {
            key: "nationalityId",
            map: {
              مصرى: 1,
              سودانى: 2
            }
          },
          mohafzaId: {
            key: "governorateId",
            map: $this.loadIdMap("mohafzaId")
          }
        };

      /**
       * First get the card Number for each member
       */

      for (let i = 0; i < data.length; i++) {
        let member = data[i],
          conscripte,
          where = {};
        where[key] = member[mainKey];
        if (member.cardNumber == null) {
          await $this
            .api(
              "global/get_one",
              {
                table: conscripteTable,
                where: {
                  nationalId: member[mainKey]
                }
              },
              "tc"
            )
            .then(x => {
              conscripte = x.data;
            })
            .catch(err => {
              console.log(where);
              console.log(err);
            });
          console.log("the conscripte");
          console.log(conscripte);
          let card,
            where = {};
          where[key] = conscripte[key];

          // search for family or parent cards depending on the type of the family
          where["cardTypeId"] = [2, 3, 4].includes(member.typeId) ? 1 : 2;
          await $this
            .api(
              "global/get_one",
              {
                table: cardTable,
                where
              },
              "tc"
            )
            .then(x => {
              card = x.data;
              //console.log(card);
            })
            .catch(err => {
              console.log(err);
            });
          member.cardNumber = card == null ? card : card?.cardNumber;
        }
      }
      $this.connectDefaultDevice();
      /**
       * create Family members
       */
      let asyncedLoop = () => {
        return new Promise((success, failure) => {
          (async function loop() {
            let familyMembers;
            await $this.dataMapping(dataMap, data, idMap).then(members => {
              familyMembers = members;
            });

            $this.$set($this.progress, "all", familyMembers.length);
            for (let i = 0; i < familyMembers.length; i++) {
              let member = { ...familyMembers[i] };
              delete member.imagePath;
              console.log(familyMembers[i]);
              await $this
                .api("global/check_or_create_by_key", {
                  table: "cardsFamilyMembers",
                  where: {
                    nationalId: member.nationalId
                  },
                  params: member
                })
                .catch(err => {
                  console.log(err);
                });
              let tmpImg64;
              await $this
                .api(
                  "global/get_one",
                  {
                    table: table,
                    where: {
                      nationalId: member.nationalId
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
              if (tmpImg64 && tmpImg64 != null && familyMembers[i].imagePath) {
                await $this.createImage(tmpImg64, familyMembers[i].imagePath);

                await $this
                  .api("global/update_one", {
                    table: "cardsFamilyMembers",
                    where: {
                      nationalId: familyMembers[i].nationalId
                    },
                    update: {
                      imagePath: familyMembers[i].imagePath
                    }
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
              $this.$set($this.progress, "done", i + 1);
            }
            success(true);
          })();
        });
      };
      await asyncedLoop();
      $this.disconnectDefaultDevice();
      /**
       * Update mother Id
       */
      $this.$set($this.progress, "all", data.length);
      for (let i = 0; i < data.length; i++) {
        let motherNationalId = data[i].nationalIdParent;
        if (motherNationalId == null) {
          $this.$set($this.progress, "done", i + 1);
          continue;
        }
        let motherId = null;
        await $this
          .api("global/get_one", {
            table: "cardsFamilyMembers",
            where: {
              nationalId: motherNationalId
            }
          })
          .then(x => {
            motherId = x.data.id;
          })
          .catch(err => {
            console.log("Couldn't find this mother:", motherNationalId);
            console.log(err);
          });
        await $this
          .api("global/update_one", {
            table: "cardsFamilyMembers",
            where: {
              nationalId: data[i].nationalId
            },
            update: {
              motherId: motherId
            }
          })
          .catch(err => {
            console.log(err);
          });

        $this.$set($this.progress, "done", i + 1);
      }
    });
};
