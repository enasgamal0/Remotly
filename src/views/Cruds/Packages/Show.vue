<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.showPackage") }}</h4>
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
          <div class="preview-container text-center my-3">
            <img
              v-if="data.image?.path"
              col="12"
              :src="data.image?.path"
              :alt="$t('PLACEHOLDERS.image')"
            />
          </div>
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameAr')"
            v-model.trim="data.name_ar"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameEn')"
            v-model.trim="data.name_en"
            disabled
          />
          <!-- End:: Name Input -->

          <!-- Start:: Type Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.type')"
            v-model="data.type"
            disabled
          />
          <!-- End:: Type Input -->

          <!-- Start:: Number of Sessions -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.lecture_numbers')"
            v-model.number="data.number_of_sessions"
            min="1"
            disabled
          />
          <!-- End:: Number of Sessions -->

          <!-- Start:: Price Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.package_price')"
            v-model.number="data.price"
            min="1"
            disabled
          />
          <!-- End:: Price Input -->

          <!-- Start:: Deactivate Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch
              color="green"
              :label="
                data.active
                  ? $t('PLACEHOLDERS.active')
                  : $t('PLACEHOLDERS.notActive')
              "
              v-model="data.active"
              hide-details
              disabled
            ></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
export default {
  name: "ShowPackage",
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
    };
  },
  methods: {
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
<style>
.package_color{
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>