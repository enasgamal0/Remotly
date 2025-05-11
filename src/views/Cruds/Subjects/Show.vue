<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.showSubject") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #af18f9">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form>
        <div class="row">
          <div class="preview-container text-center my-3">
            <img
              v-if="data.image?.path"
              col="12"
              :src="data.image?.path"
              :alt="$t('PLACEHOLDERS.image')"
            />
          </div>
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameAr')"
            v-model.trim="data.name_ar"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameEn')"
            v-model.trim="data.name_en"
            disabled
          />
          <!-- End:: Name Input -->

          <div>
            <h6 style="color: #af18f9" class="mb-5">
              {{ $t("PLACEHOLDERS.foundation") }}
            </h6>
            <label class="mx-5" style="font-size: 16px">
              <input
                style="cursor: pointer"
                class="mx-1"
                type="radio"
                v-model="data.foundation"
                value="schools"
                disabled
              />
              {{ $t("PLACEHOLDERS.schools") }}
            </label>
            <label class="mx-5" style="font-size: 16px">
              <input
                class="mx-1"
                style="cursor: pointer"
                type="radio"
                v-model="data.foundation"
                value="universities"
                disabled
              />
              {{ $t("PLACEHOLDERS.universities") }}
            </label>
          </div>

          <base-select-input
            v-if="data.foundation == 'universities'"
            col="12"
            :optionsList="[]"
            :placeholder="$t('PLACEHOLDERS.specialization')"
            v-model.trim="data.specialization"
            multiple
            disabled
          />

          <div
            class="row justify-content-center"
            v-if="data.foundation == 'schools'"
          >
            <div
              class="col-12"
              v-for="(item, index) in data.fields"
              :key="'l' + index"
            >
              <div class="row">
                <base-select-input
                  col="6"
                  :optionsList="[]"
                  :placeholder="$t('PLACEHOLDERS.academic_stage')"
                  v-model.trim="item.academic_stage"
                  disabled
                />
                <base-select-input
                  col="6"
                  :disabled="!item.academic_stage"
                  :optionsList="item.academic_years || []"
                  :placeholder="$t('PLACEHOLDERS.academic_year')"
                  v-model.trim="item.academic_year"
                  multiple
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Start:: Deactivate Switch Input -->
          <div class="input_wrapper switch_wrapper my-5 col-6">
            <v-switch
              color="green"
              :label="
                data.active
                  ? $t('PLACEHOLDERS.active')
                  : $t('PLACEHOLDERS.notActive')
              "
              v-model="data.active"
              hide-details
              disabled
            ></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "ShowSubject",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      specializations: [],
      academic_stages: [],
      file: null,
      fileType: "",

      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        fields: [
          {
            academic_stage: null,
            academic_year: null,
            academic_years: [],
          },
        ],
        name_ar: null,
        name_en: null,
        foundation: null,
        specialization: null,
        active: true,
      },

      // End:: Data Collection To Send
    };
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
  },

  methods: {
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },

    // start show data
    async showData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `study-subject/${this.$route.params?.id}`,
        });
        const studySubject = res.data.data?.study_subject;
        const academicStages = studySubject?.academic_stages?.data;
        this.data.image.path = res.data.data.study_subject.image;
        this.data.name_ar = res.data.data.study_subject.name_ar;
        this.data.name_en = res.data.data.study_subject.name_en;
        this.data.foundation = res.data.data.study_subject?.foundation;
        this.data.fields = academicStages?.map((stage) => ({
          academic_stage: stage,
          academic_years: [],
          academic_year: stage.academic_years || [],
        }));
        this.data.specialization = res.data.data.study_subject?.specializations?.data;
        this.data.active = res.data.data.study_subject.is_active;
      } catch (error) {
        this.loading = false;
        console.log(error?.response?.data?.message);
      }
    },
    // end show data
  },

  created() {
    this.showData();
  },
};
</script>
