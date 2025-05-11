<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.editCity") }}</h4>
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
          <!-- Start:: country Input -->
          <base-select-input
            col="6"
            :optionsList="countries"
            :placeholder="$t('PLACEHOLDERS.country')"
            v-model="data.country"
            @input="handleCountryChange(data.country?.id)"
            required
          />
          <!-- End:: country Input -->

          <!-- Start:: area Input -->
          <base-select-input
            col="6"
            :optionsList="areas"
            :placeholder="$t('PLACEHOLDERS.area')"
            v-model="data.area"
            required
          />
          <!-- End:: area Input -->

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
  name: "EditCity",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        name_ar: null,
        name_en: null,
        country: null,
        area: null,
        active: null,
      },
      countries: [],
      areas: [],

      // End:: Data Collection To Send
    };
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
  },

  methods: {
    async getCities() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `cities`,
        });
        this.cities = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;
      if (!this.data.name_ar || !this.data.name_en || !this.data.country || !this.data.area) {
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
      } else {
        this.submitForm();
      }
    },

    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data

      if (this.data.name_ar) {
        REQUEST_DATA.append("name[ar]", this.data.name_ar);
      }
      if (this.data.name_en) {
        REQUEST_DATA.append("name[en]", this.data.name_en);
      }
      // if (this.data.country) {
      //   REQUEST_DATA.append("country_id", this.data.country?.id);
      // }
      if (this.data.area) {
        REQUEST_DATA.append("area_id", this.data.area?.id);
      }
      REQUEST_DATA.append("is_active", this.data.active ? 1 : 0);
      REQUEST_DATA.append("_method", "PUT");
      try {
        await this.$axios({
          method: "POST",
          url: `cities/${this.$route.params?.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/cities/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },

    
    // end show data
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
          url: `areas?page=0&limit=0&country_id=${country_id}&is_active=1`,
        });
        this.areas = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // start show data
    async showCity() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `cities/${this.$route.params?.id}`,
        });
        this.data.name_ar = res.data.data.City.name_ar;
        this.data.name_en = res.data.data.City.name_en;
        this.data.area = res.data.data.City.area;
        this.data.country = res.data.data.City.area?.country;
        this.data.active = res.data.data.City.is_active;
        this.getAreas(this.data.country?.id);
      } catch (error) {
        this.loading = false;
        console.log(error?.response?.data?.message);
      }
    },
    handleCountryChange(country_id){
      this.data.area = null;
      this.getAreas(country_id);
    }
  },

  created() {
    this.showCity();
    this.getCountries();
  },
};
</script>
