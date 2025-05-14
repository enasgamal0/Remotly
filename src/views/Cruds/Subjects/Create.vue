<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.addSubject") }}</h4>
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
          <!-- Start:: Image Upload Input -->
          <base-image-upload-input
            col="12"
            identifier="admin_image"
            :placeholder="$t('PLACEHOLDERS.image')"
            @selectImage="selectImage"
            required
          />
          <!-- End:: Image Upload Input -->
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
                />
                <base-select-input
                  col="4"
                  :disabled="!item.academic_stage"
                  :optionsList="item.academic_years || []"
                  :placeholder="$t('PLACEHOLDERS.academic_year')"
                  v-model.trim="item.academic_year"
                  multiple
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
            ></v-switch>
          </div>
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
import moment from "moment";

export default {
  name: "CreateSubject",

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
      arabicRegex: /^[\u0600-\u06FF\s]+$/,
      EnRegex: /[\u0600-\u06FF]/,
    };
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

    // Start:: Select Upload Image
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    // End:: Select Upload Image
    addRow() {
      this.data?.fields?.push({
        academic_stage: null,
        academic_year: null,
        academic_years: [],
      });
    },
    removeRow(index) {
      this.data?.fields.splice(index, 1);
    },
    disabledDate(current) {
      return current && current < moment().startOf("day");
    },

    onCopy(event) {
      event.preventDefault();
    },
    onPaste(event) {
      event.preventDefault();
    },

    validateInput() {
      // Remove non-Arabic characters from the input
      this.data.nameAr = this.data.nameAr.replace(/[^\u0600-\u06FF\s]/g, "");
    },
    removeArabicCharacters() {
      this.data.nameEn = this.data.nameEn.replace(this.EnRegex, "");
    },

    handleFileSelected({ file, fileType }) {
      this.file = file; // Store the selected file in your data
      this.fileType = fileType; // Store the selected file in your data
    },
    handleFileRemoved() {
      this.file = null; // Reset the file when it's removed
      this.fileType = "";
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
    // End:: validate Form Inputs

    // Start:: Submit Form
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
          if (field.academic_stage?.id) {
            if (field.academic_year?.length > 0) {
              field.academic_year.forEach((year) => {
                REQUEST_DATA.append(
                  `academic_stages[${field.academic_stage?.id}][]`,
                  year.id
                );
              });
            } else {
              REQUEST_DATA.append(
                `academic_stages[${field.academic_stage?.id}][]`,
                null
              );
            }
          }
        });
      }

      REQUEST_DATA.append("is_active", this.data.active ? 1 : 0);

      // Start:: Append Request Data
      try {
        await this.$axios({
          method: "POST",
          url: `study-subject`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/subjects/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form

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
      return this.data.fields.map((f) => f.academic_stage?.id).filter(Boolean); // Remove undefined/null
    },
  },

  created() {
    this.getSpecializations();
    this.getAcademicStages();
  },
};
</script>
