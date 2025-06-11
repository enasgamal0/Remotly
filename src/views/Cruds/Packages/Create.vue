<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.addPackage") }}</h4>
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

          <!-- Start:: Type Input -->
          <base-select-input
            col="6"
            :optionsList="packageTypes"
            :placeholder="$t('PLACEHOLDERS.type')"
            v-model="data.type"
            required
          />
          <!-- End:: Type Input -->

          <!-- Start:: Number of Sessions -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.lecture_numbers')"
            v-model.number="data.number_of_sessions"
            min="1"
            required
          />
          <!-- End:: Number of Sessions -->

          <!-- Start:: Price Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.package_price')"
            v-model.number="data.price"
            min="1"
            required
          />
          <!-- End:: Price Input -->

          <!-- Start:: Status Dropdown -->
          <base-select-input
            col="6"
            :optionsList="statusOptions"
            :placeholder="$t('PLACEHOLDERS.status')"
            v-model="data.is_active"
            required
          />
          <!-- End:: Status Dropdown -->

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
export default {
  name: "CreatePackage",
  data() {
    return {
      isWaitingRequest: false,
      data: {
        name_ar: "",
        name_en: "",
        number_of_sessions: null,
        price: null,
        type: null,
        is_active: null,
      },
      statusOptions: [
        { id: 1, name: this.$t("STATUS.active"), value: 1 },
        { id: 0, name: this.$t("STATUS.notActive"), value: 0 },
      ],
      packageTypes: [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.shadow_teacher_package"),
          value: "shadow_teacher_package",
        },
        {
          id: 2,
          name: this.$t("PLACEHOLDERS.lecture_package"),
          value: "lecture_package",
        },
      ],
    };
  },
  methods: {
    validateFormInputs() {
      this.isWaitingRequest = true;
      this.submitForm();
    },
    async submitForm() {
      const REQUEST_DATA = new FormData();
      if (this.data.name_ar) {
        REQUEST_DATA.append("name[ar]", this.data.name_ar);
      }
      if (this.data.name_en) {
        REQUEST_DATA.append("name[en]", this.data.name_en);
      }
      if (this.data.type) {
        REQUEST_DATA.append("type", this.data.type?.value);
      }
      if (this.data.number_of_sessions) {
        REQUEST_DATA.append("lecture_number", this.data.number_of_sessions);
      }
      if (this.data.price) {
        REQUEST_DATA.append("price", this.data.price);
      }
      if (this.data.is_active) {
        REQUEST_DATA.append("status", this.data.is_active?.value);
      }

      try {
        await this.$axios({
          method: "POST",
          url: "packages",
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/packages/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
  },
};
</script>
