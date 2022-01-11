<template>
  <div>
    <v-card>
      <v-card-title>
        أسئلة البوابة
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
//           title: "بطاقة علاجية شخصية معاش",
//           desc: "بطاقة علاجية شخصية للافراد بالمعاش او المنتهي خدمتهم باصابة",
//           serviceType: { id: 0, name: "مكتب الانهاء" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "صورة بطاقة شخصية سارية لصاحب البطاقة",
//               desc: "",
//               isRequired: true
//             },
//           ],
//         },
//         {
//           id: 1,
//           title: "بطاقة علاجية عائلية بالخدمة",
//           desc: "بطاقة علاجية عائلية للافراد بالخدمة",
//           serviceType: { id: 1, name: "مكتب التسجيل" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "اصل نموذج 175س",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "صورة بطاقة شخصية سارية لصاحب البطاقة",
//               desc: "",
//               isRequired: false
//             }
//           ]
//         },
//         {
//           id: 1,
//           title: "بطاقة علاجية بالخدمة الوالدين",
//           desc: "بطاقة علاجية عائلية للافراد بالخدمة",
//           serviceType: { id: 1, name: "مكتب التسجيل" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "اصل نموذج 175س",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "صورة بطاقة شخصية سارية لصاحب البطاقة",
//               desc: "",
//               isRequired: false
//             }
//           ]
//         },
//         {
//           id: 1,
//           title: "بطاقة علاجية عائلية معاش",
//           desc: "بطاقة علاجية عائلية للافراد بالخدمة",
//           serviceType: { id: 1, name: "مكتب التسجيل" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "اصل نموذج 175س",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "صورة بطاقة شخصية سارية لصاحب البطاقة",
//               desc: "",
//               isRequired: false
//             }
//           ]
//         },
//         {
//           id: 1,
//           title: "اثبات تجنيد",
//           desc: "بطاقة علاجية عائلية للافراد بالخدمة",
//           serviceType: { id: 1, name: "مكتب التسجيل" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "اصل نموذج 175س",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "صورة بطاقة شخصية سارية لصاحب البطاقة",
//               desc: "",
//               isRequired: false
//             }
//           ]
//         }
//       ];
//       this.services = [...this.allServices];
//     }
//   }
// };
</script>

<style></style>
