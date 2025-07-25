<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.addDistrict") }}</h4>
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

          <base-select-input
            col="6"
            :optionsList="countries"
            :placeholder="$t('PLACEHOLDERS.country')"
            v-model="data.country"
            @input="getAreas(data.country?.id), data.area = null, data.city = null"
            required
          />
          <base-select-input
            col="6"
            :optionsList="areas"
            :placeholder="$t('PLACEHOLDERS.area')"
            v-model="data.area"
            @input="getCities(data.area?.id), data.city = null"
            required
          />
          <base-select-input
            col="6"
            :optionsList="cities"
            :placeholder="$t('PLACEHOLDERS.city')"
            v-model="data.city"
            required
          />

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
  name: "CreateDistrict",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      file: null,
      fileType: "",

      // Start:: Data Collection To Send
      data: {
        name_ar: null,
        name_en: null,
        country: null,
        area: null,
        city: null,
        active: true,
      },
      // End:: Data Collection To Send
      countries: [],
      areas: [],
      cities: [],
      arabicRegex: /^[\u0600-\u06FF\s]+$/,
      EnRegex: /[\u0600-\u06FF]/,
    };
  },

  methods: {
    async getCountries() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `countries?page=0&limit=0&is_active=1`,
        });
        this.countries = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async getAreas(country_id) {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `areas?page=0&limit=0&is_active=1&country_id=${country_id}`,
        });
        this.areas = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async getCities(area_id) {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `cities?page=0&limit=0&is_active=1&area_id=${area_id}`,
        });
        this.cities = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
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
      if (!this.data.name_ar || !this.data.name_en || !this.data.country || !this.data.area || !this.data.city) {
        if (!this.data.name_ar) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.name_ar"));
          return;
        }
        if (!this.data.name_en) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.name_en"));
          return;
        }
        if (!this.data.country) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.country"));
          return;
        }
        if (!this.data.area) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.area"));
          return;
        }
        if (!this.data.city) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.city"));
          return;
        }
      } else {
        this.submitForm();
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      if (this.data.name_ar) {
        REQUEST_DATA.append("name[ar]", this.data.name_ar);
      }
      if (this.data.name_en) {
        REQUEST_DATA.append("name[en]", this.data.name_en);
      }
      if (this.data.country) {
        REQUEST_DATA.append("country_id", this.data.country?.id);
      }
      if (this.data.area) {
        REQUEST_DATA.append("area_id", this.data.area?.id);
      }
      if (this.data.city) {
        REQUEST_DATA.append("city_id", this.data.city?.id);
      }
      REQUEST_DATA.append("is_active", this.data.active ? 1 : 0);

      // Start:: Append Request Data
      try {
        await this.$axios({
          method: "POST",
          url: `districts`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/districts/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
  },

  created() {
    // Start:: Fire Methods
    this.getCountries();
    // End:: Fire Methods
  },
};
</script>
