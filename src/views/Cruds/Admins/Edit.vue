<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.editAdmin") }}</h4>
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
            identifier="admin_image"
            :preSelectedImage="data.image.path"
            :placeholder="$t('PLACEHOLDERS.personalImage')"
            @selectImage="selectImage"
          />
          <!-- End:: Image Upload Input -->

          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.name"
            required
          />
          <!-- End:: Name Input -->

          <!-- Start:: Email Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
            required
          />
          <!-- End:: Email Input -->

          <!-- Start:: Phone Input -->
          <base-input
            col="6"
            type="tel"
            :placeholder="$t('PLACEHOLDERS.phone')"
            v-model.trim="data.phone"
            required
          />
          <!-- End:: Phone Input -->

          <!-- Start:: Roles Input -->
          <base-select-input
            v-if="roles"
            col="6"
            :optionsList="roles"
            :placeholder="$t('PLACEHOLDERS.role')"
            v-model.trim="data.role"
            required
          />

          <!-- {{ data.role }} -->
          <!-- End:: Roles Input -->

          <!-- Start:: Deactivate Switch Input -->
          <!-- <div class="input_wrapper switch_wrapper my-5">
            <v-switch color="green" :label="data.active ? $t('PLACEHOLDERS.active') : $t('PLACEHOLDERS.notActive')"
              v-model="data.active" hide-details></v-switch>
          </div> -->
          <!-- End:: Deactivate Switch Input -->

          <!-- Start:: Activate Edit Password Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch
              color="green"
              :label="$t('PLACEHOLDERS.editPassword')"
              v-model="data.enableEditPassword"
              hide-details
            ></v-switch>
          </div>
          <!-- End:: Activate Edit Password Switch Input -->

          <Transition name="fadeInUp" mode="out-in">
            <div class="col-12" v-if="data.enableEditPassword">
              <div class="row">
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
              </div>
            </div>
          </Transition>

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

export default {
  name: "EditAdmin",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        name: null,
        email: null,
        phone: null,
        role: null,
        whatsApp: null,
        areas: null,
        type: null,
        enableEditPassword: false,
        password: null,
        passwordConfirmation: null,
        active: true,
      },
      allAreas: [],
      roles: [],
      // End:: Data Collection To Send
    };
  },

  computed: {
    // Start:: Vuex Getters
    ...mapGetters({
      allRoles: "ApiGetsModule/allRoles",
    }),
    // End:: Vuex Getters
  },

  methods: {
    async getAllareas() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: "areas?page=0&limit=0&is_active=1",
        });
        // console.log("All Data ==>", res.data.data);
        this.allAreas = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    async getRoles() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: "roles?page=0&limit=0&status=1",
        });
        this.roles = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // Start:: Get Data To Show
    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `users/${this.id}`,
        });
        console.log()
        this.data.image.path = res.data.data.user.image;
        this.data.name = res.data.data.user.name;
        this.data.email = res.data.data.user.email;
        this.data.phone = res.data.data.user.mobile;
        this.data.role = res.data.data.user.roles;
        this.data.active = res.data.data.user.is_active;
        this.data.numberOfVisits = res.data.data.user.login_count;
        this.data.lastVisit = res.data.data.user.last_login;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Show

    // Start:: Select Upload Image
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    // End:: Select Upload Image

    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;

      // if (!this.data.image.path) {
      //   this.isWaitingRequest = false;
      //   this.$message.error(this.$t("VALIDATION.image"));
      //   return;
      // }
      if (!this.data.name) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.name"));
        return;
      } else if (!this.data.email) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.email"));
        return;
      } else if (!this.data.phone) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.mobileNumber"));
        return;
      } else if (!this.data.role) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.role"));
        return;
      } else if (this.data.enableEditPassword) {
        if (!this.data.password) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.password"));
          return;
        } else if (this.data.password.length < 6) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.passwordLength"));
          return;
        } else if (!this.data.passwordConfirmation) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.password"));
          return;
        } else if (this.data.passwordConfirmation.length < 6) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.passwordLength"));
          return;
        } else if (this.data.password != this.data.passwordConfirmation) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.notEqualPasswords"));
          return;
        } else {
          this.submitForm();
        }
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      if (this.data.image.file != null) {
        REQUEST_DATA.append("image", this.data.image.file);
      }
      REQUEST_DATA.append("name", this.data.name);
      REQUEST_DATA.append("email", this.data.email);
      REQUEST_DATA.append("mobile", this.data.phone);
      if (this.data.role) {
        REQUEST_DATA.append("role_id", this.data.role?.id);
      }
      if (this.data.password) {
        REQUEST_DATA.append("password", this.data.password);
      }

      if (this.data.passwordConfirmation) {
        REQUEST_DATA.append(
          "password confirmation",
          this.data.passwordConfirmation
        );
      }
      REQUEST_DATA.append("is_active", this.data.active ? 1 : 0);
      if (this.data.role?.slug == "cleaner") {
        REQUEST_DATA.append("whattsapp", this.data.whatsApp);
        this.data.areas?.map((ele, index) => {
          REQUEST_DATA.append(`area[${index}]`, ele.id);
        });
      }
      REQUEST_DATA.append("_method", "PUT");
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `users/${this.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/admins/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
  },

  async created() {
    // Start:: Fire Methods
    this.getRoles();
    this.getAllareas();
    this.getDataToEdit();
    // End:: Fire Methods
  },
};
</script>
