<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.editPackage") }}</h4>
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
            identifier="image"
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
  name: "EditPackage",
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
        image: {
          path: null,
          file: null,
        },
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
    selectImage(selectedImage) {
      this.data.image = selectedImage;
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
      REQUEST_DATA.append("_method", "put");
      if (this.data.name_ar){
        REQUEST_DATA.append("name[ar]", this.data.name_ar);
      }
      if (this.data.name_en){
        REQUEST_DATA.append("name[en]", this.data.name_en);
      }
      if (this.data.type){
        REQUEST_DATA.append("type", this.data.type?.value);
      }
      if (this.data.number_of_sessions){
        REQUEST_DATA.append(
          "lecture_number",
          this.data.number_of_sessions
        );
      }
      if (this.data.price){
        REQUEST_DATA.append("price", this.data.price);
      }
      REQUEST_DATA.append("is_active", this.data.active ? 1 : 0);

      try {
        await this.$axios({
          method: "POST",
          url: `packages/${this.$route.params.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/packages/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
    // start show data
    async showPackage() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `packages/${this.$route.params?.id}`,
        });
        this.data.name_ar = res.data.data.name_ar;
        this.data.name_en = res.data.data.name_en;
        this.data.number_of_sessions = res.data.data.number_of_sessions;
        this.data.price = res.data.data.price;
        this.data.type = res.data.data.type;
        this.data.is_active = res.data.data.is_active;
        this.data.image.path = res.data.data?.image;
      } catch (error) {
        this.loading = false;
        console.log(error?.response?.data?.message);
      }
    },
    // end show data
  },
  created() {
    this.showPackage();
  },
};
</script>