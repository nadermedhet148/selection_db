<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" lg="4">
            <v-card :loading="loading" :disabled="loading">
              <v-card-title>
                تجربة حساب تاريخ التسريح
              </v-card-title>
              <v-card-text>
                <v-text-field
                  label="الرقم العسكري"
                  hint="الرقم العسكري لحساب تاريخ التسريح"
                  persistent-hint
                  filled
                  @keypress.enter="militaryId ? runMethods() : null"
                  v-model="militaryId"
                ></v-text-field>
              </v-card-text>
              <v-card-actions class="px-4">
                <v-spacer></v-spacer>
                <v-btn
                  large
                  color="primary"
                  class="px-6"
                  v-text="'بدأ الإستخدام'"
                  @click="runMethods()"
                  :disabled="!militaryId"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <!-- <v-col cols="6" v-if="result">
        <v-card>
          <v-card-title>
            طريقة 1
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-5">
            <div v-if="result.procs">
              <template v-for="(r, i) in result.procs">
                <div :key="i">
                  <div class="primary--text">
                    {{ r.key }}
                  </div>
                  <div>
                    {{ r.value }}
                  </div>
                </div>
              </template>
            </div>
          </v-card-text>
        </v-card>
      </v-col> -->
      <v-col cols="6" v-if="result">
        <v-card>
          <v-card-title>
            النتيجة
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pt-5">
            <!-- <pre class="text-left" dir="ltr">{{ result }}</pre> -->
            <div v-if="result.points">
              <v-row>
                <v-col>
                  <v-text-field
                    label="الرقم العسكري"
                    hide-details
                    @keypress.enter="runMethods()"
                    v-model="militaryId"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="الإسم"
                    readonly
                    hide-details
                    :value="result.points.fullName"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="تاريخ التجنيد"
                    :value="result.points.conscriptionDate"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="المؤهل"
                    readonly
                    hide-details
                    :value="result.points.qualification"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="موقف السنة الزيادة"
                    :value="result.points.additionalYearState"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="تاريخ التسريح المبدئي"
                    :value="result.points.demobilizationDateStarter"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pb-0" cols="12">
                  العقوبات
                </v-col>
                <v-col
                  class="mt-0 pt-0"
                  v-if="
                    !result.points.penalties ||
                      result.points.penalties.length == 0
                  "
                  cols="12"
                >
                  <v-text-field
                    value="لا يوجد"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <template v-for="(p, i) in result.points.penalties">
                <v-row :key="'p_' + i">
                  <v-col>
                    <v-text-field
                      label="النوع"
                      :value="p.type"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="بداية الجريمة"
                      :value="p.crimeFrom"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="نهاية الجريمة"
                      :value="p.crimeTo"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="بداية العقوبة"
                      :value="p.from"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="نهاية العقوبة"
                      :value="p.to"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
              <v-row>
                <v-col cols="12" class="pb-0">
                  الهروب
                </v-col>
                <v-col
                  class="mt-0 pt-0"
                  v-if="
                    !result.points.fugitives ||
                      result.points.fugitives.length == 0
                  "
                  cols="12"
                >
                  <v-text-field
                    value="لا يوجد"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <template v-for="(p, i) in result.points.fugitives">
                <v-row :key="'f_' + i">
                  <v-col>
                    <v-text-field
                      label="تاريخ الغياب"
                      :value="p.from"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="تاريخ العودة"
                      :value="p.to"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
              <v-row>
                <v-col cols="12" class="pb-0">
                  المحاكم
                </v-col>
                <v-col
                  class="mt-0 pt-0"
                  v-if="
                    !result.points.courts || result.points.courts.length == 0
                  "
                  cols="12"
                >
                  <v-text-field
                    value="لا يوجد"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <template v-for="(p, i) in result.points.courts">
                <v-row :key="'c_' + i">
                  <v-col>
                    <v-text-field
                      label="بداية الحبس الإحتياطي"
                      :value="p.prosFrom"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="نهاية الحبس الإحتياطي"
                      :value="p.prosTo"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="بداية الحكم"
                      :value="p.from"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="نهاية الحكم"
                      :value="p.to"
                      readonly
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
              <v-row>
                <v-col>
                  <v-text-field
                    value="إجمالي المدة الفاقدة"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="result.points.fa2da">
                <v-col>
                  <v-text-field
                    label="يوم"
                    :value="result.points.fa2da.day"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="شهر"
                    :value="result.points.fa2da.month"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    label="سنة"
                    :value="result.points.fa2da.year"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="التاريخ بعد حساب المدة الفاقدة"
                    :value="result.points.demobilizationDateAfterFa2da"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="قرار التخفيض"
                    :value="result.points.reductionState"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="التاريخ بعد قرار التخفيض"
                    :value="result.points.demobilizationDateAfterReductionState"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    label="تاريخ التسريح النهائي"
                    :value="result.points.demobilizationDate"
                    readonly
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "describe-demob-date",
  data: () => ({
    // 2018315204778 Court
    // 2018706601278 Ignorant
    militaryId: "",
    loading: false,
    result: null
  }),
  methods: {
    async runMethods() {
      this.$set(this, "loading", true);
      let militaryId = this.militaryId;
      this.fixDemobilizationDate(militaryId)
        .then(x => {
          this.$set(this, "result", x);
        })
        .catch(error => {
          this.$set(this, "result", error);
        })
        .finally(() => {
          this.$set(this, "loading", false);
        });
    }
  }
};
</script>
