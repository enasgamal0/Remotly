<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.addClient") }}</h4>
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
            identifier="client_image"
            :placeholder="$t('PLACEHOLDERS.image')"
            @selectImage="selectImage"
          />
          <!-- End:: Image Upload Input -->

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.student_name')"
            v-model.trim="data.client_name"
            required
          />
          <base-input
            col="6"
            type="date"
            :placeholder="$t('TABLES.Users.joiningDate')"
            v-model.trim="data.date"
          />
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
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
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
          <!-- Start:: Gender Selection -->
          <div class="gender-options my-5">
            <label>{{ $t("PLACEHOLDERS.gender") }}: </label>
            <label class="mx-5">
              <input
                class="mx-1"
                type="radio"
                v-model="data.gender"
                value="male"
                @input="data.hijab = null"
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
                @input="data.hijab = null"
                required
              />
              {{ $t("TABLES.Users.female") }}
            </label>
          </div>
          <!-- End:: Gender Selection -->
          <div class="gender-options mt-5">
            <label style="color: #af18f9" class="mb-5">
              {{ $t("PLACEHOLDERS.foundation") }}
              <span class="text-danger">*</span>:
            </label>
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
            col="6"
            :optionsList="specializations"
            :placeholder="$t('PLACEHOLDERS.specialization')"
            v-model.trim="data.specialization"
            multiple
            required
          />

          <base-input
            v-if="data.foundation == 'universities'"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.university_name')"
            v-model.trim="data.foundation_name"
          />

          <div
            class="row justify-content-center"
            v-if="data.foundation == 'schools'"
          >
            <div class="col-12">
              <div class="row">
                <base-select-input
                  col="4"
                  :optionsList="academic_stages"
                  :placeholder="$t('PLACEHOLDERS.academic_stage')"
                  v-model.trim="data.academic_stage"
                  @input="
                    getAcademicYears(data?.academic_stage?.id),
                      (data.academic_year = null)
                  "
                  required
                />
                <base-select-input
                  col="4"
                  :disabled="!data.academic_stage"
                  :optionsList="academic_years"
                  :placeholder="$t('PLACEHOLDERS.academic_year')"
                  v-model.trim="data.academic_year"
                  required
                />
                <base-input
                  v-if="data.foundation == 'schools'"
                  col="4"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.school_name')"
                  v-model.trim="data.foundation_name"
                />
              </div>
            </div>
          </div>
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

export default {
  name: "CreateClient",
  components: {
    BasePhoneInput,
  },
  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      specializations: [],
      academic_stages: [],
      academic_years: [],

      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        email: null,
        client_name: null,
        password: null,
        passwordConfirmation: null,
        phone: null,
        active: true,
        iban: null,
        dial_code: null,
        academic_year: null,
        academic_stage: null,
        specialization: null,
        gender: null,
        foundation: null,
        foundation_name: null,
        date: null,
        iso_code: null
      },
      // End:: Data Collection To Send
    };
  },

  methods: {
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
    async getAcademicYears(academic_stage) {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `academic-years?page=0&limit=0&status=1&academicStages[]=${academic_stage}`,
        });
        this.academic_years = res.data.data;
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
    isoCode(iosCode) {
      this.data.iso_code = iosCode;
    },
    dialCode(dialCode) {
      console.log(dialCode);
      this.data.dial_code = dialCode;
    },
    // Start:: Select Upload Image
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    // End:: Select Upload Image
    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      this.submitForm();
    },
    // End:: validate Form Inputs
    async getCities() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: "cities?page=0&limit=0&isActive=1",
        });
        console.log("All Data ==>", res.data.data);
        this.allCities = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    async getBanks() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: "banks?page=0&limit=0&isActive=1",
        });
        console.log("All Data ==>", res.data.data);
        this.allBanks = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();

      // Start:: Append Request Data
      if (this.data.image?.file) {
        REQUEST_DATA.append("image", this.data.image.file);
      }

      if (this.data.client_name) {
        REQUEST_DATA.append("name", this.data.client_name);
      }

      if (this.data.date) {
        REQUEST_DATA.append("dob", this.data.date);
      }

      if (this.data.email) {
        REQUEST_DATA.append("email", this.data.email);
      }

      if (this.data.gender) {
        REQUEST_DATA.append("gender", this.data.gender);
      }

      if (this.data.foundation) {
        REQUEST_DATA.append("foundation_type", this.data.foundation);
      }

      if (this.data.foundation_name) {
        REQUEST_DATA.append("foundation_name", this.data.foundation_name);
      }

      if (this.data.foundation == "universities") {
        this.data.specialization?.forEach((spec) => {
          REQUEST_DATA.append("specialization_ids[]", spec?.id);
        });
      }
      if (this.data.foundation === "schools") {
        if (this.data.academic_stage) {
          REQUEST_DATA.append("academic_stage_id", this.data.academic_stage?.id);
        }
        if (this.data.academic_year) {
          REQUEST_DATA.append("academic_year_id", this.data.academic_year?.id);
        }
      }

      if (this.data.dial_code) {
        REQUEST_DATA.append("country_code", "+"+this.data.dial_code);
      }

      if (this.data.phone) {
        REQUEST_DATA.append("mobile", this.data.phone);
      }

      if (this.data.iso_code) {
        REQUEST_DATA.append("iso_code", this.data.iso_code);
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
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `clients/store`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/students/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
  },

  async created() {
    this.getSpecializations();
    this.getAcademicStages();
    this.$nextTick(() => {
      this.data.phone = "";
    });
  },
};
</script>
