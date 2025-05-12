<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.view_provider_data") }}</h4>
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
              :alt="$t('PLACEHOLDERS.personalImage')"
            />
          </div>
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.name"
            disabled
          />
          <base-input
            v-if="data.email"
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.phone')"
            v-model.trim="fullPhoneNumber"
            style="direction: ltr"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('TABLES.Clients.age')"
            v-model.trim="data.age"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.gender')"
            v-model.trim="data.gender_text"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.country')"
            v-model.trim="data.country"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.about')"
            v-model.trim="data.about"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.spoken_languages')"
            v-model.trim="data.spoken_languages"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.id_number')"
            v-model.trim="data.id_number"
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
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.current_job')"
            v-model.trim="data.current_job"
            disabled
          />
          <div class="row m-auto" style="font-size: 16px;">
            <div class="col-6 mb-2">
              <a
                v-if="data.educational"
                :href="data.educational"
                download
                target="_blank"
                class="d-block text-center text-decoration-none py-2 download_btn"
                style="border: 1px #af18f9 solid; border-radius: 8px;"
              >
                {{ $t("BUTTONS.educational") }} <i class="fal fa-file-pdf mx-3"></i>
              </a>
            </div>
            <div class="col-6 mb-2">
              <a
                v-if="data.cv"
                :href="data.cv"
                download
                target="_blank"
                class="d-block text-center text-decoration-none py-2 download_btn"
                style="border: 1px #af18f9 solid; border-radius: 8px;"
              >
                {{ $t("BUTTONS.cv") }} <i class="fal fa-file-pdf mx-3"></i>
              </a>
            </div>
          </div>

          <div class="d-flex justify-center gap-3 flex-wrap mt-5">
            <div v-if="data.video">
              <!-- Display video -->
              <div class="preview-container text-center my-3">
                <h6 style="color: #af18f9">{{ $t("PLACEHOLDERS.video") }}</h6>
                <video
                  v-if="
                    [
                      'mp4',
                      'mov',
                      'avi',
                      'wmv',
                      'flv',
                      'mkv',
                      'webm',
                      'm4v',
                    ].some((ext) => data.video.endsWith(ext))
                  "
                  :src="data.video"
                  controls
                  autoplay
                  loop
                ></video>
                <img v-else :src="data.video" alt="Advertisement Image" />
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
export default {
  name: "ShowProvider",
  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      file: null,
      fileType: "",

      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        name: null,
        email: null,
        country_code: null,
        phone: null,
        whatsapp: null,
        whatsapp_country_code: null,
        user_name: null,
        nationality: null,
        country: null,
        birth_date: null,
        hobbies: [],
        address: null,
        gender: null,
      },
      // End:: Data Collection To Send
      areas: [],
      arabicRegex: /^[\u0600-\u06FF\s]+$/,
      EnRegex: /[\u0600-\u06FF]/,

      providerPoints: [],
      coordinates: [],
    };
  },

  methods: {
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

    handleSaveProvider(coordinates) {
      // Handle the saved provider coordinates from the child component

      this.coordinates = coordinates;
    },
    // start show data
    async showData() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `teacher-requests/${this.$route.params?.id}`,
        });
        this.data.image.path = res.data.data.teacher.image;
        this.data.name = res.data.data.teacher.name;
        this.data.email = res.data.data.teacher.email;
        this.data.country_code = res.data.data.teacher.country_code;
        this.data.phone = res.data.data.teacher.mobile;
        this.data.country = res.data.data.teacher.user.details.country?.name;
        this.data.age = res.data.data.teacher.user.details.age;
        this.data.gender_text = res.data.data.teacher.user.details.gender_text;
        this.data.spoken_languages =
          res.data.data.teacher.user.details?.spoken_languages
            ?.map((lang) => lang.name)
            .join(" & ") || "";
        this.data.foundation = res.data.data.teacher.user.details?.foundation;
        this.data.about = res.data.data.teacher.user.details?.about;
        this.data.id_number = res.data.data.teacher.user.details?.id_number;
        this.data.expertise_area =
          res.data.data.teacher.user.details?.expertise_area;
        this.data.number_year_experience =
          res.data.data.teacher.user.details?.number_year_experience;
        this.data.current_job = res.data.data.teacher.user.details?.current_job;
        this.data.video = res.data.data.teacher.user.details?.video;
        this.data.educational = res.data.data.teacher.user.details?.educational;
        this.data.cv = res.data.data.teacher.user.details?.cv;
      } catch (error) {
        this.loading = false;
        console.log(error?.response?.data?.message);
      }
    },
    // end show data
  },

  created() {
    this.showData();
  },
  computed: {
    fullWhatsappNumber() {
      return this.data.whatsapp_country_code + this.data.whatsapp;
    },
    fullPhoneNumber() {
      return this.data.country_code + this.data.phone;
    },
  },
};
</script>
<style scope>
.download_btn {
  color: #af18f9 !important;
  transition: background-color 0.4s, color 0.4s;
}

.download_btn:hover {
  background-color: #af18f9;
  color: #fff !important;
}
</style>