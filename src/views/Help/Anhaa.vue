<template>
  <div>
    <v-card>
      <v-card-title>
        أسئلة التسجيل
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-row justify="center">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="filterVal"
                filled
                label="ابحث عن الأسئلة"
                clearable
                append-icon="mdi-magnify"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-row class="mt-8">
      <template v-for="(service, i) in services">
        <v-col :key="i" sm="4">
          <service-card :data="service"></service-card>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
// export default {
//   name: "gate-services",
//   components: {
//     ServiceCard: () => import("@/components/sections/help/ServiceCard.vue")
//   },
//   watch: {
//     filterVal(v) {
//       if (v) {
//         this.services = this.allServices.filter(item => item.title.includes(v));
//       } else {
//         this.services = [...this.allServices];
//       }
//     }
//   },
//   mounted() {
//     this.setDummy();
//   },
//   data: () => ({
//     services: [],
//     allServices: [],
//     filterVal: ""
//   }),
//   methods: {
//     setDummy() {
//       this.allServices = [
//         {
//           id: 0,
//           title: "الفرق بين البطاقة الموقوفة و السارية و الملغية",
//           desc: "بطاقة علاجية",
//           serviceType: { id: 0, name: "مكتب التسجيل" },
//           media:[
//               {type:'video',path:require("@/assets/videos/btaaAlagia/diff.mp4"),title:'الفرق بين البطاقة الموقوفة و السارية و الملغية'},

//           ]
//         },
//         {
//           id: 1,
//           title: "تغير صوره الختم",
//           desc: "بطاقة علاجية",
//           serviceType: { id: 1, name: "مكتب الإنهاء" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "صوره الختم",
//               desc: "",
//               isRequired: true
//             },
//           ],
//           media:[
//               {type:'video',path:require("@/assets/videos/btaaAlagia/edit.mp4"),title:'تغير صوره الختم'},
//           ]
//         },
//         {
//           id: 2,
//           title: " كيفية استخراج بدل فاقد ",
//           desc: "بطاقة علاجية",
//           serviceType: { id: 1, name: "مكتب الإنهاء" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "صورة بطاقة شخصية سارية",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "محضر فقد",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 2,
//               title: "صورة شهاده ",
//               desc: "",
//               isRequired: true
//             },

//             {
//               id: 3,
//               title: "صورتين شخصيتين 4X6",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 4,
//               title: "اقرار حاله الزواج",
//               desc: "",
//               isRequired: true
//             },

//             {
//               id: 5,
//               title: "صورة الكرنيه ",
//               desc: "",
//               isRequired: true
//             },
//           ],
//            media:[
//             {type:'video',path:require("@/assets/videos/btaaAlagia/lost.mp4"),title:' كيفية استخراج بدل فاقد'}
//           ]
//         },
//       ];
//       this.services = [...this.allServices];
//     }
//   }
// };
</script>

<style></style>
