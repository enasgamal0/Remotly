<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.add_teacher") }}</h4>
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
          <h5 style="color: #af18f9; font-weight: 800">
            {{ $t("PLACEHOLDERS.personal_data") }}
          </h5>
          <!-- Start:: Image Upload Input -->
          <base-image-upload-input
            col="12"
            identifier="teacher_image"
            :placeholder="$t('PLACEHOLDERS.personalImage')"
            @selectImage="selectImage"
            required
          />
          <!-- End:: Image Upload Input -->
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.teacher_name"
            required
          />
          <!-- End:: Name Input -->

          <!-- Start:: Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
          />
          <!-- End:: Input -->
          <base-phone-input
            col="6"
            required
            v-model="data.phone"
            @dialCode="dialCode"
            @isoCode="isoCode"
            :placeholder="$t('PLACEHOLDERS.phone')"
            :defaultCountry="data.iso_code"
            :key="key"
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('TABLES.Clients.age')"
            v-model.trim="data.age"
            required
          />
          <!-- Start:: Gender Selection -->
          <div class="gender-options my-5">
            <label
              >{{ $t("PLACEHOLDERS.gender")
              }}<span class="text-danger"> *</span>:
            </label>
            <label class="mx-5">
              <input
                class="mx-1"
                type="radio"
                v-model="data.gender"
                value="male"
                required
              />
              {{ $t("TABLES.Users.male") }}
            </label>
            <label>
              <input
                type="radio"
                class="mx-1"
                v-model="data.gender"
                value="female"
                required
              />
              {{ $t("TABLES.Users.female") }}
            </label>
          </div>
          <!-- End:: Gender Selection -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.id_number')"
            v-model.trim="data.id_number"
            required
          />

          <base-select-input
            col="6"
            :optionsList="countries"
            :placeholder="$t('PLACEHOLDERS.country')"
            v-model.trim="data.country"
            required
          />
          <base-select-input
            col="12"
            :optionsList="spoken_languages"
            :placeholder="$t('PLACEHOLDERS.spoken_languages')"
            v-model.trim="data.spoken_languages"
            :multiple="true"
            required
          />
          <!-- Start:: Password Input -->
          <base-input
            col="6"
            type="password"
            :placeholder="$t('PLACEHOLDERS.password')"
            v-model.trim="data.password"
            required
          />
          <!-- End:: Password Input -->

          <!-- Start:: Confirm Password Input -->
          <base-input
            col="6"
            type="password"
            :placeholder="$t('PLACEHOLDERS.confirmPassword')"
            v-model.trim="data.passwordConfirmation"
            required
          />
          <!-- End:: Confirm Password Input -->
          <hr class="my-5" style="width: 97%" />
          <h5 style="color: #af18f9; font-weight: 800">
            {{ $t("PLACEHOLDERS.professional_data") }}
          </h5>
          <base-input
            col="12"
            type="text"
            :placeholder="$t('PLACEHOLDERS.about')"
            v-model.trim="data.about"
          />

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.expertise_area')"
            v-model.trim="data.expertise_area"
            required
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.number_year_experience')"
            v-model.trim="data.number_year_experience"
            required
          />
          <base-input
            col="12"
            type="text"
            :placeholder="$t('PLACEHOLDERS.current_job')"
            v-model.trim="data.current_job"
            required
          />

          <div>
            <h6 style="color: #af18f9" class="mb-5">
              {{ $t("PLACEHOLDERS.foundation") }}
              <span class="text-danger">*</span>
            </h6>
            <label class="mx-5" style="cursor: pointer; font-size: 16px">
              <input
                class="mx-1"
                style="cursor: pointer"
                type="radio"
                name="foundation"
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
                name="foundation"
                v-model="data.foundation"
                value="universities"
              />
              {{ $t("PLACEHOLDERS.universities") }}
            </label>
          </div>
          <div
            v-if="data.foundation == 'universities'"
            class="row justify-content-center"
          >
            <div
              class="col-12"
              v-for="(item, index) in data.university_fields"
              :key="'l' + index"
            >
              <div class="row">
                <base-select-input
                  v-if="data.foundation == 'universities'"
                  col="4"
                  :optionsList="getFilteredSpecializations(specializations)"
                  :placeholder="$t('PLACEHOLDERS.specialization')"
                  v-model.trim="item.specialization"
                  @input="
                    getSubjects(
                      'universities',
                      item.specialization?.id,
                      null,
                      null,
                      index
                    ),
                      (item.subject = [])
                  "
                  required
                />
                <base-select-input
                  v-if="data.foundation == 'universities'"
                  col="4"
                  :optionsList="item.subjects || []"
                  :placeholder="$t('PLACEHOLDERS.subjects_name')"
                  v-model.trim="item.subject"
                  multiple
                  required
                />
                <div class="item d-flex flex-wrap align-items-center col-4">
                  <div
                    class="all_actions"
                    v-if="data.university_fields?.length > 1"
                  >
                    <span
                      class="add_another text-2xl cursor-pointer"
                      @click="removeUniversityRow(index)"
                    >
                      <i class="fas fa-minus-circle"></i>
                    </span>
                  </div>
                  <div class="col-l2">
                    <div
                      class="add_another text-2xl cursor-pointer mx-2"
                      @click="addUniversityRow"
                    >
                      <i class="fas fa-plus-circle"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  col="3"
                  :optionsList="getFilteredStages(index)"
                  :placeholder="$t('PLACEHOLDERS.academic_stage')"
                  v-model.trim="item.academic_stage"
                  @input="
                    getAcademicYears(item?.academic_stage?.id, index),
                      (item.academic_years = []),
                      (item.academic_year = null),
                      (item.subject = [])
                  "
                  required
                />
                <base-select-input
                  col="3"
                  :optionsList="item.academic_years || []"
                  :placeholder="$t('PLACEHOLDERS.academic_year')"
                  v-model.trim="item.academic_year"
                  @input="
                    getSubjects(
                      'schools',
                      null,
                      item?.academic_stage?.id,
                      item?.academic_year?.id,
                      index
                    ),
                    (item.subject = [])
                  "
                  required
                />
                <base-select-input
                  col="3"
                  :optionsList="item.subjects || []"
                  :placeholder="$t('PLACEHOLDERS.subjects_name')"
                  v-model.trim="item.subject"
                  multiple
                  required
                />
                <div class="item d-flex flex-wrap align-items-center col-3">
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

          <BaseNamePreviewFileUploadInput
            col="6"
            identifier="educational-upload"
            :placeholder="$t('PLACEHOLDERS.educational')"
            :useImagePreview="false"
            :required="true"
            @selectFile="handleFileSelection"
          />

          <BaseNamePreviewFileUploadInput
            col="6"
            identifier="cv-upload"
            :placeholder="$t('PLACEHOLDERS.cv')"
            :useImagePreview="false"
            :required="true"
            @selectFile="handleCVSelection"
          />

          <!-- <base-select-input
            col="6"
            :optionsList="activeStatuses"
            :placeholder="$t('PLACEHOLDERS.status')"
            v-model.trim="data.account_status"
          /> -->

          <!-- Start:: Video Upload Input -->
          <base-image-upload-input
            col="12"
            identifier="teacher_video"
            :placeholder="$t('PLACEHOLDERS.video')"
            @selectImage="selectVideo"
            :acceptVideo="true"
            required
          />
          <!-- End:: Video Upload Input -->

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
import { mapGetters, mapActions } from "vuex";
import BasePhoneInput from "@/components/formInputs/BasePhoneInput.vue";
import BaseNamePreviewFileUploadInput from "@/components/formInputs/BaseNamePreviewFileUploadInput.vue";

export default {
  name: "CreateTeacher",
  components: {
    BasePhoneInput,
    BaseNamePreviewFileUploadInput,
  },
  computed: {
    usedAcademicStageIds() {
      return this.data.fields.map((f) => f.academic_stage?.id)?.filter(Boolean);
    },
    usedSpecializationsIds() {
      return this.data.university_fields
        .map((f) => f.specialization?.id)
        ?.filter(Boolean);
    },
    activeStatuses() {
      return [
        {
          id: 5,
          name: this.$t("STATUS.pending"),
          value: "pending",
        },
        {
          id: 1,
          name: this.$t("STATUS.active"),
          value: "active",
        },
        {
          id: 2,
          name: this.$t("STATUS.notActive"),
          value: "inactive",
        },
        {
          id: 3,
          name: this.$t("STATUS.blocked"),
          value: "blocked",
        },
        {
          id: 4,
          name: this.$t("STATUS.no_response"),
          value: "no_response",
        },
      ];
    },
    yesOrNo() {
      return [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.yes"),
          value: 1,
        },
        {
          id: 2,
          name: this.$t("PLACEHOLDERS.no"),
          value: 0,
        },
      ];
    },
  },
  data() {
    return {
      isWaitingRequest: false,
      specializations: [],
      academic_stages: [],
      subjects: [],
      data: {
        image: {
          path: null,
          file: null,
        },
        video: {
          path: null,
          file: null,
        },
        educational: {
          path: null,
          file: null,
          name: null,
        },
        cv: {
          path: null,
          file: null,
          name: null,
        },
        fields: [
          {
            academic_stage: null,
            academic_year: null,
            subject: null,
            academic_years: [],
            subjects: [],
          },
        ],
        university_fields: [
          {
            specialization: null,
            subject: null,
            subjects: [],
          },
        ],
        foundation: null,
        specialization: null,
        school_subject: null,
        university_subject: null,
        email: null,
        teacher_name: null,
        iso_code: null,
        dial_code: null,
        phone: null,
        country: null,
        age: null,
        gender: null,
        id_number: null,
        spoken_languages: [],
        about: null,
        expertise_area: null,
        number_year_experience: null,
        current_job: null,
        password: null,
        passwordConfirmation: null,
        active: true,
      },
      countries: [],
      spoken_languages: [],
    };
  },

  methods: {
    getFilteredStages(currentIndex) {
      const currentId = this.data.fields[currentIndex]?.academic_stage?.id;

      const usedIds = this.data.fields
        .map((f, i) => (i !== currentIndex ? f.academic_stage?.id : null))
        ?.filter(Boolean);

      return this.academic_stages?.filter(
        (stage) => !usedIds.includes(stage.id) || stage.id === currentId
      );
    },
    getFilteredSpecializations(currentIndex) {
      const currentId =
        this.data.university_fields[currentIndex]?.specialization?.id;

      const usedIds = this.data.university_fields
        .map((f, i) => (i !== currentIndex ? f.specialization?.id : null))
        ?.filter(Boolean);

      return this.specializations?.filter(
        (stage) => !usedIds.includes(stage.id) || stage.id === currentId
      );
    },
    addRow() {
      this.data?.fields?.push({
        academic_stage: null,
        academic_year: null,
        subject: null,
        academic_years: [],
        subjects: [],
      });
    },
    removeRow(index) {
      this.data?.fields.splice(index, 1);
    },
    addUniversityRow() {
      this.data?.university_fields?.push({
        specialization: null,
        subject: null,
        subjects: [],
      });
    },
    removeUniversityRow(index) {
      this.data?.university_fields.splice(index, 1);
    },
    async getSubjects(
      foundation,
      specialization_id,
      academic_stage_id,
      academic_year_id,
      index
    ) {
      const data = {
        foundation,
      };

      if (specialization_id) data.specialization_id = specialization_id;
      if (academic_stage_id) data.academic_stage_id = academic_stage_id;
      if (academic_year_id) data.academic_year_id = academic_year_id;

      try {
        let res = await this.$axios({
          method: "POST",
          url: `study-subjects/by-data`,
          data,
        });
        if (foundation == "schools") {
          // this.data.fields[index].subjects = res.data.data;
          this.data.fields[index].subjects = res.data.data;
        } else {
          this.data.university_fields[index].subjects = res.data.data;
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
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
    dialCode(dialCode) {
      this.data.dial_code = dialCode;
    },
    isoCode(iosCode) {
      this.data.iso_code = iosCode;
    },
    // Start:: Select Upload Image
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    // End:: Select Upload Image
    // Start:: Select Upload video
    selectVideo(selectedVideo) {
      this.data.video = selectedVideo;
    },
    // End:: Select Upload video
    async getCountries() {
      // this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `countries?ignore_permission=true&page=0&limit=0`,
        });

        this.countries = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    async getSpokenLanguages() {
      // this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `spoken-languages?ignore_permission=true&page=0&limit=0`,
        });

        this.spoken_languages = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    handleFileSelection(file) {
      console.log("fileee", file);
      this.data.educational = {
        file: file,
        name: file.name,
        path: null,
      };
    },
    handleCVSelection(file) {
      this.data.cv = {
        file: file,
        name: file.name,
        path: null,
      };
    },
    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;
      this.submitForm();
    },
    // End:: validate Form Inputs
    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      if (this.data.image?.file) {
        REQUEST_DATA.append("image", this.data.image.file);
      }
      if (this.data.teacher_name) {
        REQUEST_DATA.append("name", this.data.teacher_name);
      }
      if (this.data.email) {
        REQUEST_DATA.append("email", this.data.email);
      }
      if (this.data.dial_code) {
        REQUEST_DATA.append("country_code", "+"+this.data.dial_code);
      }
      if (this.data.iso_code) {
        REQUEST_DATA.append("iso_code", this.data.iso_code);
      }
      if (this.data.phone) {
        REQUEST_DATA.append("mobile", this.data.phone);
      }
      if (this.data.age) {
        REQUEST_DATA.append("age", this.data.age);
      }
      if (this.data.gender) {
        REQUEST_DATA.append("gender", this.data.gender);
      }
      if (this.data.id_number) {
        REQUEST_DATA.append("id_number", this.data.id_number);
      }
      if (this.data.country?.id) {
        REQUEST_DATA.append("country_id", this.data.country?.id);
      }
      if (Array.isArray(this.data.spoken_languages)) {
        this.data.spoken_languages.forEach((lang) => {
          if (lang) {
            REQUEST_DATA.append(`spoken_languages[]`, lang?.id);
          }
        });
      }
      if (this.data.password) {
        REQUEST_DATA.append("password", this.data.password);
      }
      if (this.data.passwordConfirmation) {
        REQUEST_DATA.append(
          "password_confirmation",
          this.data.passwordConfirmation
        );
      }
      if (this.data.about) {
        REQUEST_DATA.append("about", this.data.about);
      }
      if (this.data.expertise_area) {
        REQUEST_DATA.append("expertise_area", this.data.expertise_area);
      }
      if (this.data.number_year_experience) {
        REQUEST_DATA.append(
          "number_year_experience",
          this.data.number_year_experience
        );
      }
      if (this.data.current_job) {
        REQUEST_DATA.append("current_job", this.data.current_job);
      }
      if (this.data.educational?.file) {
        REQUEST_DATA.append("educational", this.data.educational?.file?.file);
      }
      if (this.data.cv?.file) {
        REQUEST_DATA.append("cv", this.data.cv?.file?.file);
      }
      if (this.data.video?.file) {
        REQUEST_DATA.append("video", this.data.video?.file);
      }
      if (this.data.foundation) {
        REQUEST_DATA.append("foundation_type", this.data.foundation);
      }
      // if (
      //   this.data.foundation === "universities" &&
      //   Array.isArray(this.data.specialization)
      // ) {
      //   this.data.specialization.forEach((item) => {
      //     if (item?.id) {
      //       REQUEST_DATA.append(`specializations[${item.id}][]`, subject.id);
      //     }
      //   });
      // }
      if (this.data.foundation === "universities") {
        this.data.university_fields?.forEach((field) => {
          if (field.specialization?.id) {
            if (field.subject?.length > 0) {
              field.subject?.forEach((sub) => {
                REQUEST_DATA.append(
                  `specializations[${field.specialization?.id}][]`,
                  sub?.id
                );
              });
            }
            // else {
            //   REQUEST_DATA.append(
            //     `specializations[${field.specialization?.id}][]`,
            //     null
            //   );
            // }
          }
        });
      }
      if (this.data.foundation === "schools") {
        this.data.fields?.forEach((field) => {
          if (field.academic_stage?.id) {
            if (field.subject?.length > 0) {
              field.subject.forEach((sub) => {
                REQUEST_DATA.append(
                  `academic_stages[${field.academic_stage?.id}][${field.academic_year?.id}][]`,
                  sub?.id
                );
              });
            }
            // else {
            //   REQUEST_DATA.append(
            //     `academic_stages[${field.academic_stage?.id}][${field.academic_year?.id}]`,
            //     null
            //   );
            // }
          }
        });
      }
      // if (this.data.account_status) {
      //   REQUEST_DATA.append("account_status", this.data.account_status?.value);
      // }

      try {
        await this.$axios({
          method: "POST",
          url: `teachers/store`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/teachers/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(
          error.response?.data?.message || "An error occurred"
        );
      }
    },
    // End:: Submit Form
  },
  created() {
    this.getSpecializations();
    this.getAcademicStages();
    this.getSpokenLanguages();
    this.getCountries();
    // this.$nextTick(() => {
    //   this.data.phone = "";
    // });
  },
};
</script>
<style>
.gender-options {
  color: #af18f9;
  font-size: 16px;
}
.gender-options input {
  cursor: pointer !important;
}
</style>
