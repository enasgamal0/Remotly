<template>
  <div class="crud_form_wrapper app_settings_class">
    <div class="table_title_wrapper">
      <div class="title_text_wrapper">
        <h5 style="color: #af18f9" class="font-weight-bold">{{ $t("SIDENAV.settings.general") }}</h5>
      </div>
      <div class="col-12 text-end">
        <v-btn @click="$router.go(-1)" style="color: #af18f9">
          <i class="fas fa-backward"></i>
        </v-btn>
      </div>
    </div>
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- VAT Rate -->
          <base-input
            type="number"
            col="6"
            :placeholder="$t('PLACEHOLDERS.vat_rate')"
            v-model.trim="data.vat_rate"
            step="0.01"
            min="0"
            max="100"
          />

          <!-- App Commission Rate -->
          <base-input
            type="number"
            col="6"
            :placeholder="$t('PLACEHOLDERS.app_commission_rate')"
            v-model.trim="data.app_commission_rate"
            step="0.01"
            min="0"
            max="100"
          />

          <!-- Cancellation Time Limit (Hours) -->
          <base-input
            type="number"
            col="12"
            :placeholder="$t('PLACEHOLDERS.cancellation_time_limit_hours')"
            v-model.trim="data.cancellation_time_limit_hours"
            min="0"
          />

          <!-- Cancellation Penalty Amount (SAR) -->
          <base-input
            type="number"
            col="6"
            :placeholder="$t('PLACEHOLDERS.cancellation_penalty_amount')"
            v-model.trim="data.cancellation_penalty_amount"
            step="0.01"
            min="0"
          />

          <!-- Payment Confirmation Duration -->
          <base-input
            type="number"
            col="6"
            :placeholder="$t('PLACEHOLDERS.payment_confirmation_duration')"
            v-model.trim="data.payment_confirmation_duration"
            min="0"
          />

          <!-- Group Session Discount (SAR) -->
          <base-input
            type="number"
            col="6"
            :placeholder="$t('PLACEHOLDERS.group_session_discount')"
            v-model.trim="data.group_session_discount"
            step="0.01"
            min="0"
          />

          <!-- Online Lecture Duration -->
          <base-input
            type="number"
            col="6"
            :placeholder="$t('PLACEHOLDERS.online_lecture_duration')"
            v-model.trim="data.online_lecture_duration"
            min="0"
          />

          <hr class="my-5" style="width: 97%;"/>
          <h6 class="mb-5 font-weight-bold" style="color: #af18f9;">{{ $t("PLACEHOLDERS.pricing") }}</h6>
          
          <!-- Online Lecture Price -->
          <base-input
            type="number"
            col="6"
            :placeholder="$t('PLACEHOLDERS.online_lecture_price')"
            v-model.trim="data.online_lecture_price"
            step="0.01"
            min="0"
          />

          <!-- Online Lecture Offer Price -->
          <base-input
            type="number"
            col="6"
            :placeholder="$t('PLACEHOLDERS.online_lecture_offer_price')"
            v-model.trim="data.online_lecture_offer_price"
            step="0.01"
            min="0"
          />

          <div class="btn_wrapper">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('BUTTONS.save')"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppSetting",
  data() {
    return {
      isWaitingRequest: false,
      data: {
        vat_rate: null,
        app_commission_rate: null,
        cancellation_time_limit_hours: null,
        cancellation_penalty_amount: null,
        payment_confirmation_duration: null,
        group_session_discount: null,
        online_lecture_duration: null,
        online_lecture_price: null,
        online_lecture_offer_price: null,
      },
    };
  },
  methods: {
    async getDataToEdit() {
      try {
        let res = await this.$axios.get("settings?key=dashboard_settings");
        const settings = res.data.data[0].value;
        
        // Map the response data to component data
        this.data.vat_rate = settings.vat_rate;
        this.data.app_commission_rate = settings.app_commission_rate;
        this.data.cancellation_time_limit_hours = settings.cancellation_time_limit_hours;
        this.data.cancellation_penalty_amount = settings.cancellation_penalty_amount;
        this.data.payment_confirmation_duration = settings.payment_confirmation_duration;
        this.data.group_session_discount = settings.group_session_discount;
        this.data.online_lecture_duration = settings.online_lecture_duration;
        this.data.online_lecture_price = settings.pricing?.online_lecture_price;
        this.data.online_lecture_offer_price = settings.pricing?.online_lecture_offer_price;
      } catch (error) {
        console.error(error.response.data.message);
      }
    },
    async submitForm() {
      this.isWaitingRequest = true;
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("key", "dashboard_settings");
      
      // Append all form data
      REQUEST_DATA.append("value[vat_rate]", this.data.vat_rate);
      REQUEST_DATA.append("value[app_commission_rate]", this.data.app_commission_rate);
      REQUEST_DATA.append("value[cancellation_time_limit_hours]", this.data.cancellation_time_limit_hours);
      REQUEST_DATA.append("value[cancellation_penalty_amount]", this.data.cancellation_penalty_amount);
      REQUEST_DATA.append("value[payment_confirmation_duration]", this.data.payment_confirmation_duration);
      REQUEST_DATA.append("value[group_session_discount]", this.data.group_session_discount);
      REQUEST_DATA.append("value[online_lecture_duration]", this.data.online_lecture_duration);
      
      // Pricing data
      REQUEST_DATA.append("value[pricing][online_lecture_price]", this.data.online_lecture_price);
      REQUEST_DATA.append("value[pricing][online_lecture_offer_price]", this.data.online_lecture_offer_price);

      try {
        await this.$axios.post("settings", REQUEST_DATA);
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.savedSuccessfully"));
        this.getDataToEdit();
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    validateFormInputs() {
      this.submitForm();
    },
  },
  created() {
    this.getDataToEdit();
  },
};
</script>