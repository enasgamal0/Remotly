<template>
  <div class="show_all_content_wrapper">
    <!-- Start:: Main Section -->
    <main>
      <!--  =========== Start:: Filter Form =========== -->
      <div
        class="filter_content_wrapper"
        :class="{ active: filterFormIsActive }"
      >
        <button
          class="filter_toggler"
          @click="filterFormIsActive = !filterFormIsActive"
        >
          <i class="fal fa-times"></i>
        </button>
        <div class="filter_title_wrapper">
          <h5>{{ $t("TITLES.searchBy") }}</h5>
        </div>

        <div class="filter_form_wrapper">
          <form @submit.prevent="submitFilterForm">
            <div class="row justify-content-center align-items-center w-100">
              <!-- Start::company name Input -->
              <base-input
                col="3"
                type="text"
                :placeholder="$t('PLACEHOLDERS.teacher_name')"
                v-model.trim="filterOptions.name"
              />

              <!-- End::company Name Input -->
              <base-input
                col="3"
                type="text"
                :placeholder="$t('PLACEHOLDERS.phone')"
                v-model="filterOptions.mobile"
              />

              <base-input
                col="3"
                type="text"
                :placeholder="$t('PLACEHOLDERS.email')"
                v-model="filterOptions.email"
              />

              <!-- Start:: foundation Input -->
              <base-select-input
                :optionsList="foundations"
                col="4"
                :placeholder="$t('PLACEHOLDERS.foundation')"
                v-model="filterOptions.foundation"
              />
              <!-- End:: foundation Input -->

              <!-- Start:: status Input -->
              <base-select-input
                :optionsList="activeStatuses"
                col="4"
                :placeholder="$t('PLACEHOLDERS.status')"
                v-model="filterOptions.status"
              />
              <!-- End:: status Input -->

              <div
                v-if="showAllFilters && !filterFormIsActive"
                class="text-center"
                style="height: 80px"
              >
                <img
                  alt="Arrow Down"
                  src="../../../assets/media/icons/ui_icons/arrow_up.svg"
                  style="width: 30px; height: 30px; cursor: pointer"
                  @click="showAllFilters = false"
                />
              </div>
            </div>

            <div class="btns_wrapper">
              <button class="submit_btn" :disabled="isWaitingRequest">
                <i class="fal fa-search"></i>
              </button>
              <button
                class="reset_btn"
                type="button"
                :disabled="isWaitingRequest"
                @click="resetFilter"
              >
                <i class="fal fa-redo"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
      <!--  =========== End:: Filter Form =========== -->

      <!--  =========== Start:: Table Title =========== -->
      <div class="table_title_wrapper">
        <div class="title_text_wrapper">
          <h5>{{ $t("PLACEHOLDERS.teachers_management") }}</h5>
          <button
            v-if="!filterFormIsActive"
            class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive"
          >
            <i class="fal fa-search"></i>
          </button>
        </div>
        <div
          class="title_route_wrapper"
          v-if="$can('teachers create', 'teachers')"
        >
          <router-link to="/teachers/create">
            {{ $t("BUTTONS.addTeacher") }}
          </router-link>
        </div>
      </div>
      <!--  =========== End:: Table Title =========== -->

      <!--  =========== Start:: Data Table =========== -->
      <v-data-table
        class="thumb"
        :loading="loading"
        :loading-text="$t('TABLES.loadingData')"
        :search="searchValue"
        :headers="tableHeaders"
        :items="tableRows"
        item-class="ltr"
        :items-per-page="paginations.items_per_page"
        hide-default-footer
      >
        <!-- Start:: No Data State -->
        <template v-slot:no-data>
          {{ $t("TABLES.noData") }}
        </template>
        <!-- Start:: No Data State -->

        <!-- Start:: Item Image -->
        <template v-slot:[`item.id`]="{ item, index }">
          <div class="table_image_wrapper">
            <!-- <h6 class="text-danger" v-if="!item.id">
              {{ $t("TABLES.noData") }}
            </h6> -->
            <p>
              {{
                (paginations.current_page - 1) * paginations.items_per_page +
                index +
                1
              }}
            </p>
          </div>
        </template>
        <!-- End:: Item Image -->
        <!-- Start:: Activation Status -->
        <template v-slot:[`item.is_active`]="{ item }">
          <span class="text-success text-h5" v-if="item.is_active">
            <i class="far fa-check"></i>
          </span>
          <span class="text-danger text-h5" v-else>
            <i class="far fa-times"></i>
          </span>
        </template>
        <!-- End:: Activation Status -->

        <!-- End:: Activation -->

        <!-- Start:: Item is_verified -->
        <template v-slot:[`item.is_verified`]="{ item, index }">
          <div class="table_image_wrapper">
            <h6 class="text-danger" v-if="item.is_verified">
              {{ $t("PLACEHOLDERS.active") }}
            </h6>

            <p v-else>{{ $t("PLACEHOLDERS.notActive") }}</p>
          </div>
        </template>
        <!-- End:: Item is_verified -->

        <template v-slot:[`item.educational`]="{ item }">
          <div class="table_image_wrapper">
            <a
              v-if="item.educational"
              :href="item.educational"
              download
              target="_blank"
              style="color: #af19faff; font-size: 14px"
            >
              <span>{{ $t("BUTTONS.click_to_view") }}</span>
            </a>
            <p v-else>-</p>
          </div>
        </template>

        <template v-slot:[`item.request_date`]="{ item }">
          <div class="table_image_wrapper">
            <span v-if="item.request_date">{{ item.request_date }}</span>
            <p v-else>-</p>
          </div>
        </template>

        <!-- Start:: Title -->
        <template v-slot:[`item.title`]="{ item }">
          <p class="text-danger" v-if="!item.title">
            {{ $t("TABLES.noData") }}
          </p>
          <p v-else>{{ item.title }}</p>
        </template>

        <template v-slot:[`item.user.companyName`]="{ item }">
          <p class="text-danger" v-if="!item.user.companyName">
            {{ $t("TABLES.noData") }}
          </p>
          <p v-else>{{ item.user.companyName }}</p>
        </template>
        <!-- End:: Title -->

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip
              placement="bottom"
              v-if="$can('teachers delete', 'teachers')"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.delete") }}</span>
              </template>
              <button class="btn_delete" @click="selectDeleteItem(item)">
                <i class="fal fa-trash-alt"></i>
              </button>
            </a-tooltip>
            <a-tooltip
              placement="bottom"
              v-if="$can('teachers edit', 'teachers')"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.edit") }}</span>
              </template>

              <button class="btn_edit" @click="editItem(item)">
                <i class="fal fa-edit"></i>
              </button>
            </a-tooltip>
            <a-tooltip
              placement="bottom"
              v-if="$can('teachers show', 'teachers')"
            >
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>

            <template
              v-if="$can('teachers activate', 'teachers') && item.id !== 1"
            >
              <a-tooltip placement="bottom" v-if="!item.is_active">
                <template slot="title">
                  <span>{{ $t("BUTTONS.activate") }}</span>
                </template>
                <button
                  class="btn_activate"
                  @click="HandlingItemActivationStatus(item)"
                >
                  <i class="fad fa-check-circle"></i>
                </button>
              </a-tooltip>
              <a-tooltip placement="bottom" v-if="item.is_active">
                <template slot="title">
                  <span>{{ $t("BUTTONS.deactivate") }}</span>
                </template>
                <button
                  class="btn_deactivate"
                  @click="selectDeactivateItem(item)"
                >
                  <i class="fad fa-times-circle"></i>
                </button>
              </a-tooltip>
            </template>

            <template v-else>
              <i
                class="fal fa-lock-alt fs-5 blue-grey--text text--darken-1"
              ></i>
            </template>
          </div>
        </template>
        <!-- End:: Actions -->

        <!-- ======================== Start:: Dialogs ======================== -->
        <template v-slot:top>
          <!-- Start:: Image Modal -->
          <image-modal
            v-if="dialogImage"
            :modalIsOpen="dialogImage"
            :modalImage="selectedItemImage"
            @toggleModal="dialogImage = !dialogImage"
          />
          <!-- End:: Image Modal -->

          <!-- Start:: Deactivate Modal -->
          <v-dialog v-model="dialogDeactivate">
            <v-card>
              <v-card-title
                class="text-h5 justify-center"
                v-if="itemToChangeActivationStatus"
              >
                {{
                  $t("TITLES.DeactivateConfirmingMessage", {
                    name: itemToChangeActivationStatus.name,
                  })
                }}
              </v-card-title>

              <form class="w-100">
                <base-input
                  col="12"
                  rows="3"
                  type="textarea"
                  :placeholder="$t('PLACEHOLDERS.deactivateReason')"
                  v-model.trim="deactivateReason"
                  required
                />
              </form>

              <v-card-actions>
                <v-btn
                  class="modal_confirm_btn"
                  @click="
                    HandlingItemActivationStatus(itemToChangeActivationStatus)
                  "
                  :disabled="
                    !!!deactivateReason || deactivateReason?.length < 3
                  "
                >
                  {{ $t("BUTTONS.ok") }}
                </v-btn>

                <v-btn
                  class="modal_cancel_btn"
                  @click="(dialogDeactivate = false), (deactivateReason = null)"
                  >{{ $t("BUTTONS.cancel") }}</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Deactivate Modal -->

          <!-- Start:: Description Modal -->
          <description-modal
            v-if="dialogDescription"
            :modalIsOpen="dialogDescription"
            :modalDesc="selectedDescriptionTextToShow"
            @toggleModal="dialogDescription = !dialogDescription"
          />
          <!-- End:: Description Modal -->

          <!-- Start:: Delete Modal -->
          <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h5 justify-center" v-if="itemToDelete">
                {{
                  $t("TITLES.DeleteConfirmingMessage", {
                    name: itemToDelete.name,
                  })
                }}
              </v-card-title>
              <v-card-actions>
                <v-btn class="modal_confirm_btn" @click="confirmDeleteItem">{{
                  $t("BUTTONS.ok")
                }}</v-btn>

                <v-btn class="modal_cancel_btn" @click="dialogDelete = false">{{
                  $t("BUTTONS.cancel")
                }}</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <!-- End:: Delete Modal -->
        </template>
        <!-- ======================== End:: Dialogs ======================== -->
      </v-data-table>
      <!--  =========== End:: Data Table =========== -->
    </main>
    <!-- End:: Main Section -->

    <!-- Start:: Pagination -->
    <template>
      <div class="pagination_container text-center mt-3 mb-0">
        <v-pagination
          class="py-0"
          square
          v-model="paginations.current_page"
          :length="paginations.last_page"
          :total-visible="6"
          @input="updateRouterQueryParam($event)"
          :prev-icon="
            getAppLocale == 'ar' ? 'fal fa-angle-right' : 'fal fa-angle-left'
          "
          :next-icon="
            getAppLocale == 'ar' ? 'fal fa-angle-left' : 'fal fa-angle-right'
          "
        />
      </div>
    </template>
    <!-- End:: Pagination -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AllRegions",

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
    activeStatuses() {
      return [
        {
          id: 1,
          name: this.$t("STATUS.active"),
          value: 1,
        },
        {
          id: 2,
          name: this.$t("STATUS.notActive"),
          value: 0,
        },
      ];
    },
    foundations() {
      return [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.schools"),
          value: "schools",
        },
        {
          id: 2,
          name: this.$t("PLACEHOLDERS.universities"),
          value: "universities",
        },
      ];
    },
  },

  data() {
    return {
      // Start:: Loading Data
      loading: false,
      isWaitingRequest: false,
      // End:: Loading Data

      // Start:: Filter Data
      filterFormIsActive: false,
      filterOptions: {
        name: null,
        mobile: null,
        email: null,
        foundation: null,
        status: null,
      },
      // End:: Filter Data
      nationalities: [],
      countries: [],
      areas: [],
      cities: [],
      districts: [],
      hobbies: [],
      showAllFilters: false,
      dialogDeactivate: false,
      itemToChangeActivationStatus: null,
      deactivateReason: null,
      // Start:: Table Data
      searchValue: "",
      tableHeaders: [
        {
          text: this.$t("TABLES.Admins.serialNumber"),
          value: "id",
          align: "center",
          sortable: false,
        },
        {
          text: this.$t("PLACEHOLDERS.teacher_name"),
          value: "name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.phone"),
          value: "mobile",
          sortable: false,
          align: "center",
        },
        // {
        //   text: this.$t("PLACEHOLDERS.educational"),
        //   value: "educational",
        //   sortable: false,
        //   align: "center",
        // },
        {
          text: this.$t("PLACEHOLDERS.foundation"),
          value: "foundation_type_text",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.email"),
          value: "email",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.accepted_at"),
          value: "request_date",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.status"),
          value: "is_active",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("TABLES.Roles.actions"),
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      tableRows: [],
      // End:: Table Data

      // Start:: Dialogs Control Data

      dialogStatusAccept: false,
      dialogStatusReject: false,

      dialogImage: false,
      selectedItemImage: null,
      dialogDescription: false,
      selectedDescriptionTextToShow: "",
      dialogDelete: false,
      itemToDelete: null,
      // End:: Dialogs Control Data

      // Start:: Pagination Data
      paginations: {
        current_page: 1,
        last_page: 1,
        items_per_page: 6,
      },
      // End:: Pagination Data

      currentRequest: {
        money: null,
        reason: "",
      },
      modalRequest: {},
    };
  },

  watch: {
    // Start:: Page Query Param Watcher To Get Page Data Based On It's Change
    ["$route.query.page"]() {
      this.paginations.current_page = +this.$route.query.page;
      this.setTableRows();
    },
    // End:: Page Query Param Watcher To Get Page Data Based On It's Change
  },

  methods: {
    // Start:: Handel Filter
    async submitFilterForm() {
      if (this.$route.query.page !== "1") {
        await this.$router.push({
          path: "/teachers/all",
          query: { page: 1 },
        });
      }
      this.setTableRows();
    },
    // ===== Start:: Delete
    selectDeleteItem(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },
    async confirmDeleteItem() {
      try {
        await this.$axios({
          method: "DELETE",
          url: `teachers/${this.itemToDelete.id}`,
        });
        this.dialogDelete = false;
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.deletedSuccessfully"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // end accepted teacher request
    async resetFilter() {
      this.filterOptions.name = null;
      this.filterOptions.mobile = null;
      this.filterOptions.email = null;
      this.filterOptions.foundation = null;
      this.filterOptions.status = null;

      if (this.$route.query.page !== "1") {
        await this.$router.push({
          path: "/teachers/all",
          query: { page: 1 },
        });
      }
      this.setTableRows();
    },
    // End:: Handel Filter

    // Start:: Set Table Rows
    updateRouterQueryParam(pagenationValue) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: pagenationValue,
        },
      });

      // Scroll To Screen's Top After Get Products
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    async setTableRows() {
      this.loading = true;
      try {
        let params = {
          page: this.paginations.current_page,
          name: this.filterOptions.name,
          mobile: this.filterOptions.mobile,
          email: this.filterOptions.email,
          foundation: this.filterOptions.foundation?.value,
          status: this.filterOptions.status?.value,
        };
        let res = await this.$axios({
          method: "GET",
          url: "teachers?accountStatus=accepted",
          params: params,
        });
        this.loading = false;
        this.tableRows = res.data.data;
        this.paginations.last_page = res.data.meta.last_page;
        this.paginations.items_per_page = res.data.meta.per_page;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    // End:: Set Table Rows

    // ===== Start:: Handling Activation & Deactivation
    selectDeactivateItem(item) {
      this.dialogDeactivate = true;
      this.itemToChangeActivationStatus = item;
    },
    async HandlingItemActivationStatus(selectedItem) {
      this.dialogDeactivate = false;
      let targetItem = selectedItem;
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data
      if (this.deactivateReason) {
        REQUEST_DATA.append("deactivation_reason", this.deactivateReason);
      }
      try {
        await this.$axios({
          method: "POST",
          url: `teachers/${selectedItem.id}/toggle`,
          data: REQUEST_DATA,
        });
        this.$message.success(this.$t("MESSAGES.changeActivation"));
        this.setTableRows();

        this.itemToChangeActivationStatus = null;
        this.deactivateReason = null;
      } catch (error) {
        this.$message.error(error.response.data.message);
        this.setTableRows();
      }
    },
    // ===== End:: Handling Activation & Deactivation

    cancelRequest() {
      this.dialogStatusAccept = false;
      this.dialogStatusReject = false;
    },
    // End:: Change Activation Status
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
    async getAreas() {
      // this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `areas?is_active=1&page=0&limit=0`,
        });

        this.areas = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    async getCities() {
      // this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `cities?is_active=1&page=0&limit=0`,
        });

        this.cities = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    async getDistricts() {
      // this.loading = true;
      try {
        let res = await this.$axios({
          method: "GET",
          url: `districts?is_active=1&page=0&limit=0`,
        });

        this.districts = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    async getHobbies() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `hobbies?is_active=1&page=0&limit=0`,
        });

        this.hobbies = res.data.data;
      } catch (error) {
        this.loading = false;
        console.log(error.response.data.message);
      }
    },
    async getNationalities() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `nationalities?page=0&limit=0&is_active=1`,
        });
        this.nationalities = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    // ==================== Start:: Crud ====================
    // ===== Start:: End
    editItem(item) {
      this.$router.push({
        path: `/teachers/edit/${item.id}`,
        query: { f: item?.foundation_type == "schools" ? "s" : "u" },
      });
    },

    showItem(item) {
      this.$router.push({ path: `/teachers/show/${item.id}` });
    },
    // ===== End:: End

    // ===== End:: Delete
    // ==================== End:: Crud ====================
  },

  created() {
    // Start:: Fire Methods
    window.addEventListener("click", () => {
      this.filterFormIsActive = false;
    });
    if (this.$route.query.page) {
      this.paginations.current_page = +this.$route.query.page;
    }
    // this.getNationalities();
    // this.getCountries();
    // this.getAreas();
    // this.getCities();
    // this.getDistricts();
    // this.getHobbies();
    this.setTableRows();
    // End:: Fire Methods
  },
};
</script>
