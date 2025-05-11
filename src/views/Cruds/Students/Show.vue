<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.showClient") }}</h4>
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
          <!-- Start:: Image Input -->
          <div class="preview-container text-center my-3">
            <img
              v-if="data.image?.path"
              col="12"
              :src="data.image?.path"
              :alt="$t('PLACEHOLDERS.image')"
            />
          </div>
          <!-- End:: Image Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.student_name')"
            v-model.trim="data.name"
            disabled
          />
          <base-input
            col="6"
            type="date"
            :placeholder="$t('TABLES.Users.joiningDate')"
            v-model.trim="data.date"
            disabled
          />
          <base-phone-input
            col="6"
            disabled
            dir="ltr"
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
            disabled
          />
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
                @input="data.hijab = null"
                disabled
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
                disabled
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
                disabled
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
            disabled
          />

          <base-input
            v-if="data.foundation == 'universities'"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.university_name')"
            v-model.trim="data.foundation_name"
            disabled
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
                  disabled
                />
                <base-select-input
                  col="4"
                  :disabled="!data.academic_stage"
                  :optionsList="academic_years"
                  :placeholder="$t('PLACEHOLDERS.academic_year')"
                  v-model.trim="data.academic_year"
                  disabled
                />
                <base-input
                  v-if="data.foundation == 'schools'"
                  col="4"
                  type="text"
                  :placeholder="$t('PLACEHOLDERS.school_name')"
                  v-model.trim="data.foundation_name"
                  disabled
                />
              </div>
            </div>
          </div>
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
        name: null,
        email: null,
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
        iso_code: null,
      },
      // End:: Data Collection To Send
    };
  },

  methods: {
    isoCode(iosCode) {
      this.data.iso_code = iosCode;
    },
    dialCode(dialCode) {
      console.log("dialCode", dialCode);
      this.data.dial_code = dialCode;
    },
    // Start:: Select Upload Image
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    // End:: Select Upload Image

    async getData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `clients/${this.$route.params?.id}`,
        });
        // Start:: Set Data
        this.data.name = res.data.data?.client_details?.name;
        this.data.date = res.data.data?.client_details?.user?.details?.dob;
        this.data.iso_code = res.data.data?.client_details?.iso_code;
        this.data.dial_code = res.data.data?.client_details?.country_code;
        this.data.phone = res.data.data?.client_details?.mobile;
        this.data.email = res.data.data?.client_details?.email;
        this.data.image.path = res.data.data?.client_details?.image;
        this.data.gender = res.data.data?.client_details?.user?.details?.gender;
        this.data.foundation = res.data.data?.client_details?.user?.details?.foundation_type;
        this.data.foundation_name = res.data.data?.client_details?.user?.details?.foundation_name;
        this.data.specialization = res.data.data?.client_details?.user?.details?.specializations;
        this.data.academic_stage = res.data.data?.client_details?.user?.details?.academic_stage;
        this.data.academic_year = res.data.data?.client_details?.user?.details?.academic_year;
        // End:: Set Data
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
  },

  async created() {
    this.getData();
    this.$nextTick(() => {
      this.data.phone = "";
    });
  },
};
</script>
