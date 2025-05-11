<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.editSubject") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #af18f9">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <base-image-upload-input
            col="12"
            :identifier="
              [
                'mp4',
                'mov',
                'avi',
                'wmv',
                'flv',
                'mkv',
                'webm',
                'm4v',
              ].includes(data.image.path?.split('.').pop().toLowerCase())
                ? 'video'
                : 'image'
            "
            :preSelectedImage="data.image.path"
            :placeholder="$t('PLACEHOLDERS.image')"
            @selectImage="selectImage"
            required
          />
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameAr')"
            v-model.trim="data.name_ar"
            required
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameEn')"
            v-model.trim="data.name_en"
            required
          />
          <!-- End:: Name Input -->

          <div>
            <h6 style="color: #af18f9" class="mb-5">
              {{ $t("PLACEHOLDERS.foundation") }}
              <span class="text-danger">*</span>
            </h6>
            <label class="mx-5" style="cursor: pointer; font-size: 16px">
              <input
                style="cursor: pointer"
                class="mx-1"
                type="radio"
                v-model="data.foundation"
                value="schools"
                required
              />
              {{ $t("PLACEHOLDERS.schools") }}
            </label>
            <label class="mx-5" style="cursor: pointer; font-size: 16px">
              <input
                class="mx-1"
                style="cursor: pointer"
                type="radio"
                v-model="data.foundation"
                value="universities"
                required
              />
              {{ $t("PLACEHOLDERS.universities") }}
            </label>
          </div>

          <base-select-input
            v-if="data.foundation == 'universities'"
            col="12"
            :optionsList="specializations"
            :placeholder="$t('PLACEHOLDERS.specialization')"
            v-model.trim="data.specialization"
            multiple
            required
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
                  col="4"
                  :optionsList="getFilteredStages(index)"
                  :placeholder="$t('PLACEHOLDERS.academic_stage')"
                  v-model.trim="item.academic_stage"
                  @input="getAcademicYears(item?.academic_stage?.id, index)"
                  required
                />
                <base-select-input
                  col="4"
                  :disabled="!item.academic_stage"
                  :optionsList="item.academic_years || []"
                  :placeholder="$t('PLACEHOLDERS.academic_year')"
                  v-model.trim="item.academic_year"
                  multiple
                  required
                />
                <div class="item d-flex flex-wrap align-items-center col-4">
                  <div class="all_actions" v-if="data.fields?.length > 1">
                    <span
                      class="add_another text-2xl cursor-pointer"
                      @click="removeRow(index)"
                    >
                      <i class="fas fa-minus-circle"></i>
                    </span>
                  </div>
                  <div class="col-l2">
                    <div
                      class="add_another text-2xl cursor-pointer mx-2"
                      @click="addRow"
                    >
                      <i class="fas fa-plus-circle"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Start:: Deactivate Switch Input -->
          <!-- <div class="input_wrapper switch_wrapper my-5 col-6">
            <v-switch
              color="green"
              :label="
                data.active
                  ? $t('PLACEHOLDERS.active')
                  : $t('PLACEHOLDERS.notActive')
              "
              v-model="data.active"
              hide-details
            ></v-switch>
          </div> -->
          <!-- End:: Deactivate Switch Input -->

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('BUTTONS.save')"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
          </div>
          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "EditSubject",

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
    getFilteredStages(currentIndex) {
      const currentId = this.data.fields[currentIndex]?.academic_stage?.id;

      const usedIds = this.data.fields
        .map((f, i) => (i !== currentIndex ? f.academic_stage?.id : null))
        .filter(Boolean);

      return this.academic_stages.filter(
        (stage) => !usedIds.includes(stage.id) || stage.id === currentId
      );
    },
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },

    addRow() {
      this.data?.fields.push({
        academic_stage: null,
        academic_year: null,
        academic_years: [],
      });
    },
    removeRow(index) {
      this.data?.fields.splice(index, 1);
    },

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;
      if (!this.data.name_ar) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.name_ar"));
        return;
      } else if (!this.data.name_en) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.name_en"));
        return;
      } else {
        this.submitForm();
      }
    },

    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data

      if (this.data.image.file) {
        REQUEST_DATA.append("image", this.data.image.file);
      }
      if (this.data.name_ar) {
        REQUEST_DATA.append("name[ar]", this.data.name_ar);
      }
      if (this.data.name_en) {
        REQUEST_DATA.append("name[en]", this.data.name_en);
      }
      if (this.data.foundation) {
        REQUEST_DATA.append("foundation", this.data.foundation);
      }
      if (this.data.foundation == "universities") {
        this.data.specialization?.forEach((spec) => {
          REQUEST_DATA.append("specializations[]", spec?.id);
        });
      }
      if (this.data.foundation === "schools") {
  this.data.fields?.forEach((field) => {
    const stageId = field.academic_stage?.id;
    if (stageId != null) {
      const years = field.academic_year;
      if (Array.isArray(years) && years.length > 0) {
        years.forEach((year) => {
          REQUEST_DATA.append(`academic_stages[${stageId}][]`, year.id);
        });
      } else {
        REQUEST_DATA.append(`academic_stages[${stageId}][]`, '');
      }
    }
  });
}

      REQUEST_DATA.append("is_active", this.data.active ? 1 : 0);
      REQUEST_DATA.append("_method", "PUT");
      try {
        await this.$axios({
          method: "POST",
          url: `study-subject/${this.$route.params?.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/subjects/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
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
        if (academicStages) {
          this.data.fields = academicStages?.map((stage) => ({
            academic_stage: stage,
            academic_years: [],
            academic_year: stage.academic_years || null,
          }));
        } else {
          this.data.fields = [
            {
              academic_stage: null,
              academic_year: null,
              academic_years: [],
            },
          ];
        }
        this.data.fields.forEach((item, index) => {
          this.getAcademicYears(item.academic_stage?.id, index);
        });
        this.data.specialization =
          res.data.data.study_subject?.specializations?.data;
        this.data.active = res.data.data.study_subject.is_active;
      } catch (error) {
        this.loading = false;
        console.log(error?.response?.data?.message);
      }
    },
    // end show data

    async getSpecializations() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: "specialization?page=0&limit=0&status=1",
        });
        this.specializations = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async getAcademicStages() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: "academic-stages?page=0&limit=0&status=1",
        });
        this.academic_stages = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async getAcademicYears(academic_stage, index) {
      // this.data.fields[index].academic_year = null;
      this.data.fields[index].academic_years = [];
      try {
        let res = await this.$axios({
          method: "GET",
          url: `academic-years?page=0&limit=0&status=1&academicStages[]=${academic_stage}`,
        });
        this.data.fields[index].academic_years = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  },

  computed: {
    usedAcademicStageIds() {
      return this.data.fields?.map((f) => f.academic_stage?.id).filter(Boolean); // Remove undefined/null
    },
  },

  created() {
    this.showData();
    this.getSpecializations();
    this.getAcademicStages();
  },
};
</script>
