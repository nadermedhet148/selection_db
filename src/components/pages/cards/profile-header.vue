<template>
  <v-row>
    <v-col
      class="header-col d-flex justify-center align-center flex-align-stretch pa-1"
      cols="12"
      sm="6"
      md="3"
      lg="2"
    >
      <v-container>
        <v-row>
          <v-col>
            <v-card :loading="loading" class="img-card pa-1" elevation="4">
              <v-img :src="imgPath"></v-img>
              <v-file-input
                class="image-selector"
                hide-input
                show-size
                @change="previewImg"
                v-model="fileInput"
                color="white"
                accept="image/png, image/jpeg, image/bmp"
              ></v-file-input>
            </v-card>
            <!--<v-card class="img-card pa-1" color="white" elevation="4">
            <v-avatar rounded size="100%" color="secondary">
              <v-img :src="imgPath"></v-img>
              <v-file-input
                class="image-selector"
                hide-input
                show-size
                @change="previewImg"
                v-model="fileInput"
                accept="image/png, image/jpeg, image/bmp"
              ></v-file-input>
            </v-avatar>
          </v-card>-->
          </v-col>
        </v-row>

        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn
              @click="updateImg"
              :disabled="disabledUpdateBtn"
              color="primary"
              >تعديل الصورة</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col>
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr v-if="conscripte.fullName">
              <td>الإسم:</td>
              <td>{{ conscripte.fullName }}</td>
            </tr>
            <tr v-if="conscripte.militaryId">
              <td>الرقم العسكري:</td>
              <td>{{ conscripte.militaryId }}</td>
            </tr>
            <tr v-if="conscripte.degree && conscripte.degree.degreeType">
              <td>الرتبة:</td>
              <td>
                {{ conscripte.degree.degreeType }}
              </td>
            </tr>
            <tr v-if="conscripte.unit && conscripte.unit.unitText">
              <td>الوحدة:</td>
              <td>
                {{ conscripte.unit.unitText }}
              </td>
            </tr>
            <tr
              v-if="
                conscripte.dutyCurrentState &&
                  conscripte.dutyCurrentState.text == 'منتهى خدمته' &&
                  conscripte.dutyState &&
                  conscripte.dutyState.text
              "
            >
              <td>سبب إنهاء الخدمة:</td>
              <td>
                {{ conscripte.dutyState.text }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "profileHeader",
  props: ["conscripte"],
  data() {
    return {
      loading: false,
      imgPath: require("@/assets/inapp/user-placeholder.jpg"),
      fileInput: null,
      disabledUpdateBtn: true
    };
  },
  computed: {
    DBImgPath() {
      return this.conscripte.imagePath;
    }
  },
  methods: {
    async getImageBase64(imagePath) {
      if (
        imagePath != null &&
        !imagePath.includes("user-placeholder") &&
        imagePath
      ) {
        await this.getImage(imagePath).then(x => {
          if (x) {
            this.imgPath = x;
          }
        });
      }
    },
    previewImg() {
      this.imgPath = this.fileInput
        ? URL.createObjectURL(this.fileInput)
        : require("@/assets/inapp/user-placeholder.jpg");
    },
    async updateImg() {
      this.loading = true;
      let ext = this.fileInput.path.split(".").pop(),
        newPath = `${this.$store.getters.getTcUploadPath}\\${
          this.conscripte.militaryId
        }\\${this.getRandom()}.${ext}`;
      await this.upload(this.fileInput.path, newPath)
        .then(async x => {
          await this.api("global/update_one", {
            table: "conscriptes",
            where: {
              militaryId: this.conscripte.militaryId
            },
            update: {
              imagePath: newPath
            }
          })
            .then(x => {
              this.showSuccess("تم التعديل");
              this.fileInput = null;
            })
            .catch(err => {
              this.showError("فشل التعديل");
              console.log(err);
            });
        })
        .catch(err => {
          if (err.error) {
            this.showError(err.error);
          }
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  watch: {
    DBImgPath: {
      immediate: true,
      handler(v) {
        this.getImageBase64(v);
      }
    },
    fileInput() {
      if (this.fileInput && this.fileInput != null) {
        this.disabledUpdateBtn = false;
      } else {
        this.disabledUpdateBtn = true;
      }
    }
  }
};
</script>

<style>
.img-card {
  max-width: 100%;
  /*width: 50%;*/
}
</style>
