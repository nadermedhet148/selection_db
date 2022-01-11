<template>
  <div>
    <v-card>
      <v-card-title>
        أسئلة الحاسب
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
//           title: "  استخراج 26س و 25س",
//           desc: "",
//           serviceType: { id: 0, name: "مكتب الحاسب" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "صورة بطاقة شخصية سارية",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "الاصدار السابق من 25س او 26س",
//               desc: "",
//               isRequired: false
//             },
//             {
//               id: 2,
//               title: "كارت الذاكره",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 3,
//               title: " 53 تعبة سارى (اذا انها خدمته بعد 2009)(راجع على الختم و الرقم المطبوع)",
//               desc: "",
//               isRequired: true
//             }
//           ],
//           media:[
//             {type:'video',path:require("@/assets/videos/25and26/paper25s.mp4"),title:'ورق 25س '},
//             {type:'video',path:require("@/assets/videos/25and26/system25s.mp4"),title:' عمل 26س و 25س على المنظومة'},

//           ]
//         },
//         {
//           id: 1,
//           title: "  استخراج 51س بيان اصابه",
//           desc: "",
//           serviceType: { id: 1, name: "مكتب الحاسب" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "صورة بطاقة شخصية سارية",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "الكتاب (حاله الاصابه - تاريخ الاصابه - تاريخ اللجنه - نسيه العجز - التشخيص)",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "يفضل ان يوجد 26س",
//               desc: "",
//               isRequired: false
//             },
//           ],
//            media:[
//             {type:'video',path:require("@/assets/videos/51s/51s.mp4"),title:' عمل 51س على المنظومة'},
//           ]
//         },
//         {
//           id: 2,
//           title: "استخراج اثبات التجنيد",
//           desc: "",
//           serviceType: { id: 1, name: "مكتب الحاسب" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "اثبات التجنيد من الوحده 8س ويكون ممضى بختم الوحده",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "وش النموذج 1س",
//               desc: "",
//               isRequired: true
//             },
//              {
//               id: 2,
//               title: "صورة الكارنيه سارية",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 3,
//               title: "صورة بطاقة شخصية سارية",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 4,
//               title: "تصريح الاجازه اذا كان المجند هو من يقوم باستخراج الطلب او جواب من الكتيبة اذا كان المندوب هو القادم",
//               desc: "",
//               isRequired: true
//             },
//           ],
//            media:[
//              {type:'video',path:require("@/assets/videos/sbat/sbatPaper.mp4"),title:'ورق اثبات التجنيد'},
//             {type:'video',path:require("@/assets/videos/sbat/sbat.mp4"),title:' اثبات التجنيد على المنظومة'},

//           ]
//         },
//         {
//           id: 3,
//           title: " بطاقات المعاش",
//           desc: "",
//           serviceType: { id: 0, name: "مكتب الحاسب" },
//           serviceRequirements: [
//             {
//               id: 2,
//               title: "صورة بطاقة شخصية سارية (الدرجة الفعليه للشخص + بالمعاش)",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 0,
//               title: "كارت الذكره ويحتوى على عدد الاشخاص",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "صورة الكارنيه (الدرجة الفعليه للشخص )",
//               desc: "",
//               isRequired: true
//             } ,

//             {
//               id: 3,
//               title: "شهاده الخدمة العسكرية او الدفتر",
//               desc: "",
//               isRequired: false
//             },
//             {
//               id: 4,
//               title: "عقد زواج (اذا كان اول اصدار يجب ان يكون اصل )",
//               desc: "",
//               isRequired: false
//             },

//             {
//               id: 6,
//               title: "شهدات ميلاد المستحقين (اذا كان اول اصدار يجب ان يكون اصل)",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 7,
//               title: "اذا كان المستفيد  من 16 سنه (صورة بطاقة) لو 18 ( مطلوب اثبات مدرسى مختوم و يذكر فيه العام الدراسى)",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 9,
//               title: "الابنه اذا كانت تخطط 18 سنه يجب احضار قيد فردى يثبت انها لم تتزوج",
//               desc: "",
//               isRequired: true
//             },
//              {
//               id: 8,
//               title: "فى حاله صاحب البطاقه متوفى يجد احضار صوره من شهاده الوفاه وقيد فردى من الزوجه انها مذالت ارمله و لم يمضى عليه 3 اشهر",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 5,
//               title: "سرك المعاش لم يمضى عليه  3 اشهر",
//               desc: "",
//               isRequired: true
//             },

//           ],
//           media:[
//               {type:'video',path:require("@/assets/videos/btaatBlmash/paper.mp4"),title:'اوراق البطاقات بالمعاش'},
//               {type:'video',path:require("@/assets/videos/btaatBlmash/btaa.mp4"),title:'بطاقة علاجية عائلية معاش'},
//               {type:'video',path:require("@/assets/videos/btaatBlmash/personal.mp4"),title:'بطاقة علاجية شخصية معاش'},
//             {type:'video',path:require("@/assets/videos/btaatBlmash/note.mp4"),title:'التصوير و الملاحظات للبطاقات المعاش'},

//           ]
//         },
//         {
//           id: 4,
//           title: "بطاقة علاجية عائلية بالخدمة",
//           desc: "",
//           serviceType: { id: 0, name: "مكتب الحاسب" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "كارت الذكره",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "صورة الكارنيه سارى",
//               desc: "",
//               isRequired: false
//             } ,
//             {
//               id: 2,
//               title: "صورة بطاقة للزوجين سارى",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 3,
//               title: "عقد زواج",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 4,
//               title: "اقرار حاله اجتماعية",
//               desc: "",
//               isRequired: true
//             },
//              {
//               id: 5,
//               title: "بيانات عن ضابط الصف (175 س)",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 6,
//               title: "فى حاله اول اصدار يتم تصديق رئيس الفرع",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 7,
//               title: "يجب ذكر تاريخ صدور البطاقة",
//               desc: "",
//               isRequired: true
//             },

//           ],
//           media:[
//               {type:'video',path:require("@/assets/videos/family/paper.mp4"),title:'اوراق البطاقات بالخدمة'},
//               {type:'video',path:require("@/assets/videos/family/btaa.mp4"),title:'بطاقة علاجية عائلية بالخدمة'},
//             {type:'video',path:require("@/assets/videos/family/btaa2.mp4"),title:'تصوير البطاقة العاجية عائلية بالخدمة'},
//           ]
//         },
//         {
//           id: 4,
//           title: "بيان ضم مدة خدمة",
//           desc: "",
//           serviceType: { id: 0, name: "مكتب الحاسب" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "صورة بطاقة شخصية سارية",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "فترة تجنيد بين 67/6/5 و 85/12/31",
//               desc: "",
//               isRequired: false
//             } ,
//             {
//               id: 2,
//               title: "صورة الشهاده العسكرية",
//               desc: "",
//               isRequired: true
//             },

//             {
//               id: 4,
//               title: "اعلان الوراثه",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 3,
//               title: "صوره بطاقه مقدم الطلب",
//               desc: "",
//               isRequired: true
//             },

//           ],
//           media:[
//               {type:'video',path:require("@/assets/videos/dm/dm.mp4"),title:'بيان ضم و خدمة'},

//           ]
//         },
//          {
//           id: 0,
//           title: "استخراج رخصة قيادة معاش",
//           desc: "",
//           serviceType: { id: 0, name: "مكتب الحاسب" },
//           serviceRequirements: [
//             {
//               id: 0,
//               title: "صورة بطاقة شخصية سارية",
//               desc: "",
//               isRequired: true
//             },
//             {
//               id: 1,
//               title: "الاصدار السابق من 25س ",
//               desc: "",
//               isRequired: false
//             },
//             {
//               id: 2,
//               title: "بياتات الرخصة الاولة و الرخصة الثانية",
//               desc: "",
//               isRequired: true
//             },
//           ],
//           media:[
//             {type:'video',path:require("@/assets/videos/tsdia/tsdia.mp4"),title:'تصديق رخصة قيادة معاش'},

//           ]
//         },
//       ];
//       this.services = [...this.allServices];
//     }
//   }
// };
</script>

<style></style>
