<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.show_teacher") }}</h4>
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
          <h5 style="color: #af18f9; font-weight: 800">
            {{ $t("PLACEHOLDERS.personal_data") }}
          </h5>
          <!-- Start:: Image Upload Input -->
          <div class="d-flex justify-center gap-3 flex-wrap">
            <div v-if="data.image.path">
              <!-- Display image -->
              <div class="preview-container text-center my-3">
                <h6 style="color: #af18f9">
                  {{ $t("PLACEHOLDERS.personalImage") }}
                </h6>
                <img
                  v-if="data.image?.path"
                  col="12"
                  :src="data.image?.path"
                  :alt="$t('PLACEHOLDERS.image')"
                />
              </div>
            </div>
          </div>
          <!-- End:: Image Upload Input -->
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.teacher_name"
            disabled
          />
          <!-- End:: Name Input -->

          <!-- Start:: Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
            disabled
          />
          <!-- End:: Input -->
          <base-phone-input
            col="6"
            disabled
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
            disabled
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
                disabled
              />
              {{ $t("TABLES.Users.male") }}
            </label>
            <label>
              <input
                type="radio"
                class="mx-1"
                v-model="data.gender"
                value="female"
                disabled
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
            disabled
          />

          <base-select-input
            col="6"
            :optionsList="countries"
            :placeholder="$t('PLACEHOLDERS.country')"
            v-model.trim="data.country"
            disabled
          />
          <base-select-input
            col="12"
            :optionsList="spoken_languages"
            :placeholder="$t('PLACEHOLDERS.spoken_languages')"
            v-model.trim="data.spoken_languages"
            :multiple="true"
            disabled
          />
          <hr class="my-5" style="width: 97%" />
          <h5 style="color: #af18f9; font-weight: 800">
            {{ $t("PLACEHOLDERS.professional_data") }}
          </h5>
          <base-input
            col="12"
            type="text"
            :placeholder="$t('PLACEHOLDERS.about')"
            v-model.trim="data.about"
            disabled
          />

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.expertise_area')"
            v-model.trim="data.expertise_area"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.number_year_experience')"
            v-model.trim="data.number_year_experience"
            disabled
          />
          <base-input
            col="12"
            type="text"
            :placeholder="$t('PLACEHOLDERS.current_job')"
            v-model.trim="data.current_job"
            disabled
          />
          <!-- Grouped by Academic Stage & Year -->
          <div v-if="data.subjects && data.subjects[0]?.academic_stage">
            <div
              v-for="(group, index) in groupedSubjectsByAcademic"
              :key="'academic' + index"
              class="row"
            >
              <base-select-input
                col="4"
                :optionsList="[]"
                :placeholder="$t('PLACEHOLDERS.subject_name')"
                v-model.trim="group.subjects"
                disabled
                multiple
              />
              <base-input
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.academic_stage')"
                :value="group.academic_stage"
                disabled
              />
              <base-input
                col="4"
                type="text"
                :placeholder="$t('PLACEHOLDERS.academic_year')"
                :value="group.academic_year"
                disabled
              />
            </div>
          </div>

          <!-- Grouped by Specialization -->
          <div v-if="data.subjects && data.subjects[0]?.specialization">
            <div
              v-for="(group, index) in groupedSubjectsBySpecialization"
              :key="'specialization' + index"
              class="row"
            >
              <base-select-input
                col="4"
                :optionsList="[]"
                :placeholder="$t('PLACEHOLDERS.subject_name')"
                v-model.trim="group.subjects"
                disabled
                multiple
              />
              <base-input
                col="6"
                type="text"
                :placeholder="$t('PLACEHOLDERS.specialization')"
                :value="group.specialization"
                disabled
              />
            </div>
          </div>

          <!-- <base-select-input
            col="6"
            :optionsList="activeStatuses"
            :placeholder="$t('PLACEHOLDERS.status')"
            v-model.trim="data.account_status"
          /> -->

          <!-- Start:: Video Upload Input -->
          <div class="d-flex justify-center gap-3 flex-wrap">
            <div v-if="data.image.path">
              <!-- Display image -->
              <div class="preview-container text-center my-3">
                <h6 style="color: #af18f9">{{ $t("PLACEHOLDERS.video") }}</h6>
                <video :src="data.video?.path" controls autoplay loop></video>
              </div>
            </div>
          </div>
          <!-- End:: Video Upload Input -->
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
    groupedSubjectsByAcademic() {
      if (!this.data.subjects) return [];

      const grouped = {};

      this.data.subjects.forEach((subject) => {
        const academicStage = subject.academic_stage?.data?.name || "";
        const academicYear = subject.academic_year?.data?.name || "";
        const key = `${academicStage}__${academicYear}`;

        if (!grouped[key]) {
          grouped[key] = {
            academic_stage: academicStage,
            academic_year: academicYear,
            subjects: [],
          };
        }
        grouped[key].subjects.push(subject);
      });

      return Object.values(grouped);
    },

    groupedSubjectsBySpecialization() {
      if (!this.data.subjects) return [];

      const grouped = {};

      this.data.subjects.forEach((subject) => {
        const specialization = subject.specialization?.data?.name || "";
        if (!grouped[specialization]) {
          grouped[specialization] = {
            specialization,
            subjects: [],
          };
        }
        grouped[specialization].subjects.push(subject);
      });

      return Object.values(grouped);
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
      data: {
        image: {
          path: null,
          file: null,
        },
        video: {
          path: null,
          file: null,
        },
        subjects: [],
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
        about: null,
        expertise_area: null,
        number_year_experience: null,
        current_job: null,
        active: true,
      },
      countries: [],
      spoken_languages: [],
    };
  },

  methods: {
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

    async getData() {
      try {
        let response = await this.$axios.get(
          `/teachers/${this.$route.params?.id}`
        );
        const teacher = response.data.data.teacher;
        this.data = {
          image: { path: teacher.image, file: null },
          video: { path: teacher.user?.details?.video, file: null },
          educational: {
            path: teacher.user.details.educational,
            file: null,
            name: teacher.user.details.educational?.split("/").pop() || null,
          },
          cv: {
            path: teacher.user.details.cv,
            file: null,
            name: teacher.user.details.cv?.split("/").pop() || null,
          },
          dial_code: teacher.country_code,
          iso_code: teacher.iso_code,
          phone: teacher.mobile,
          email: teacher.email,
          teacher_name: teacher.name,
          country: teacher.user.details.country || null,
          spoken_languages: teacher.user.details.spoken_languages,
          id_number: teacher.user.details.id_number,
          about: teacher.user.details.about,
          expertise_area: teacher.user.details.expertise_area,
          number_year_experience: teacher.user.details.number_year_experience,
          current_job: teacher.user.details.current_job,
          gender: teacher.user.details.gender,
          age: teacher.user.details.age,
          subjects: teacher.user?.subjects,
        };
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    },
  },

  async created() {
    this.getSpokenLanguages();
    this.getCountries();
    this.getData();
    this.$nextTick(() => {
      this.data.phone = "";
    });
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
