<template>
  <div class="show_all_content_wrapper user_requests">
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
                v-model.trim="filterOptions.teacher_name"
              />

              <!-- End::company Name Input -->
              <!-- Start:: Status Input -->
              <base-input
                col="3"
                type="text"
                :placeholder="$t('PLACEHOLDERS.phone')"
                v-model="filterOptions.phone"
              />
              <!-- End:: Status Input -->
              <!-- Start:: Foundation Input -->
              <base-select-input
                col="3"
                :optionsList="foundations"
                :placeholder="$t('PLACEHOLDERS.foundation')"
                v-model="filterOptions.foundation"
              />
              <!-- End:: Foundation Input -->
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
          <h5>{{ $t("PLACEHOLDERS.teachers_join_requests") }}</h5>
          <button
            v-if="!filterFormIsActive"
            class="filter_toggler"
            @click.stop="filterFormIsActive = !filterFormIsActive"
          >
            <i class="fal fa-search"></i>
          </button>
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

        <!-- Start:: Mobile -->
        <template v-slot:[`item.mobile`]="{ item }">
          <h6 v-if="item.mobile" dir="ltr">
            {{ item.country_code }}{{ item.mobile }}
          </h6>
          <h6 v-else>-</h6>
        </template>
        <!-- End:: Mobile -->

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

        <!-- Start:: Item is_verified -->
        <template v-slot:[`item.is_verified`]="{ item, index }">
          <div class="table_image_wrapper">
            <h6 class="text-danger" v-if="item.is_verified">
              {{ $t("PLACEHOLDERS.active") }}
            </h6>

            <p v-else>{{ $t("PLACEHOLDERS.notActive") }}</p>
          </div>
        </template>
        <!-- End:: Item Image -->
        <template v-slot:[`item.title`]="{ item }">
          <p class="text-danger" v-if="!item.title">
            {{ $t("TABLES.noData") }}
          </p>
          <p v-else>{{ item.title }}</p>
        </template>

        <template v-slot:[`item.foundation_type_text`]="{ item }">
          <p v-if="!item.foundation_type_text">
            -
          </p>
          <p v-else>{{ item.foundation_type_text }}</p>
        </template>

        <template v-slot:[`item.gender_text`]="{ item }">
          <p v-if="!item.gender_text">
            -
          </p>
          <p v-else>{{ item.gender_text }}</p>
        </template>

        <template v-slot:[`item.country.name`]="{ item }">
          <p v-if="!item.country?.name">
            -
          </p>
          <p v-else>{{ item.country?.name }}</p>
        </template>

        <!-- Start:: Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="actions">
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t("BUTTONS.show") }}</span>
              </template>
              <button class="btn_show" @click="showItem(item)">
                <i class="fal fa-eye"></i>
              </button>
            </a-tooltip>

            <div class="actions">
              <a-tooltip placement="bottom" v-if="$can('teacher requests accept', 'teacher-requests')">
                <template slot="title">
                  <span>{{ $t("BUTTONS.accept") }}</span>
                </template>
                <button
                  class="btn_show"
                  @click="openRequestStatusModal(item, 'accepted')"
                >
                  <i class="fad fa-check-circle"></i>
                </button>
              </a-tooltip>
              <a-tooltip
                placement="bottom"
                v-if="$can('teacher requests reject', 'teacher-requests')"
              >
                <template slot="title">
                  <span>{{ $t("BUTTONS.reject") }}</span>
                </template>
                <button
                  class="btn_deactivate"
                  @click="openRequestStatusModal(item, 'rejected')"
                >
                  <i class="fad fa-times-circle"></i>
                </button>
              </a-tooltip>
            </div>
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

          <!-- Start:: Description Modal -->
          <description-modal
            v-if="dialogDescription"
            :modalIsOpen="dialogDescription"
            :modalDesc="selectedDescriptionTextToShow"
            @toggleModal="dialogDescription = !dialogDescription"
          />
          <!-- End:: Description Modal -->

          <v-dialog v-model="dialogStatusAccept">
            <v-card>
              <v-card-title class="text-h5 justify-center">
                {{ $t("PLACEHOLDERS.accept_settlement_request") }}
              </v-card-title>
              <div class="w-100">
                <div class="mt-3">
                  <h6 class="d-inline-block font-weight-bold mb-4">
                    {{ $t("SIDENAV.Clients.user_balance") }}:
                  </h6>
                  <h6 class="d-inline-block mx-1">
                    {{ modalRequest?.amount }}
                    {{ $t("PLACEHOLDERS.riyal") }}
                  </h6>
                  <div>
                    <label class="font-weight-bold mx-1"
                      >{{ $t("PLACEHOLDERS.settlement_request_money") }}:
                    </label>
                    <input
                      type="number"
                      v-model.trim="modalRequest.money"
                      class="bg-white rounded mx-3 p-2 w-25"
                    />
                    <span>{{ $t("PLACEHOLDERS.riyal") }}</span>
                    <div class="text-center mt-5">
                      <v-btn
                        class="modal_confirm_btn mx-1 bg-success text-white"
                        @click="openRequestStatusModal(modalRequest, 'accepted')"
                        >{{ $t("BUTTONS.save") }}</v-btn
                      >
                      <v-btn
                        class="modal_confirm_btn mx-1 bg-danger text-white"
                        @click="cancelRequest()"
                        >{{ $t("BUTTONS.cancel") }}</v-btn
                      >
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogStatusReject">
            <v-card>
              <v-card-title
                class="text-h5 justify-center"
                v-if="itemToChangeActivationStatus"
              >
                {{
                  $t("TITLES.rejectConfirmingMessage", {
                    name: itemToChangeActivationStatus.name,
                  })
                }}
              </v-card-title>

              <form class="w-100">
                <base-input
                  col="12"
                  rows="3"
                  type="textarea"
                  :placeholder="$t('PLACEHOLDERS.reason_reject')"
                  v-model.trim="deactivateReason"
                  required
                />
              </form>

              <v-card-actions>
                <v-btn
                  class="modal_confirm_btn"
                  @click="rejectTeachers(itemToChangeActivationStatus)"
                  :disabled="!!!deactivateReason || deactivateReason?.length < 3"
                >
                  {{ $t("BUTTONS.ok") }}
                </v-btn>

                <v-btn
                  class="modal_cancel_btn"
                  @click="dialogStatusReject = false, deactivateReason = null"
                  >{{ $t("BUTTONS.cancel") }}</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
          id: null,
          name: this.$t("STATUS.all"),
          value: null,
        },
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
        teacher_name: null,
        phone: null,
        foundation: null,
      },
      // End:: Filter Data
      countries: [],
      nationalities: [],
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
        {
          text: this.$t("PLACEHOLDERS.foundation"),
          value: "foundation_type_text",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.gender"),
          value: "gender_text",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("PLACEHOLDERS.country"),
          value: "country.name",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("SIDENAV.orders.created_at"),
          value: "created_at",
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
      teacher_status: null,
      // End:: Table Data

      // Start:: Dialogs Control Data

      dialogStatusAccept: false,
      dialogStatusReject: false,
      itemToChangeActivationStatus: null,
      deactivateReason: null,

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
          path: "/teachers-requests/all",
          query: { page: 1 },
        });
      }
      this.setTableRows();
    },

    // ===== End:: Delete
    // start accepted  teacher request
    async approvedTeachers(item) {
      try {
        let res = await this.$axios({
          method: "POST",
          url: `teacher-requests/${item.id}/accept`,
        });
        this.setTableRows();
        this.dialogStatusReject = false;
        this.itemToChangeActivationStatus = null;
        this.$message.success(res?.data?.message);
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },

    async rejectTeachers(item) {
      const REQUEST_DATA = new FormData();
        REQUEST_DATA.append("rejection_reason", this.deactivateReason);
      try {
        let res = await this.$axios({
          method: "POST",
          url: `teacher-requests/${item.id}/reject`,
          data: REQUEST_DATA,
        });
        this.setTableRows();
        this.dialogStatusReject = false;
        this.itemToChangeActivationStatus = null;
        this.$message.success(res?.data?.message);
      } catch (error) {
        this.$message.error(error.response.data.message);
      }
    },

    async confirmDeleteItem() {
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("is_joined", 0);
      if (this.refusedReason) {
        REQUEST_DATA.append("deactive_reason", this.refusedReason);
      }
      try {
        await this.$axios.post(
          `companies/accepted-refused-join-request/${this.itemToDelete.user.id}`,
          REQUEST_DATA
        );
        this.dialogDelete = false;
        this.setTableRows();
        this.$message.success(this.$t("MESSAGES.reject_join_request"));
      } catch (error) {
        this.dialogDelete = false;
        this.$message.error(error.response.data.message);
      }
    },
    // end accepted provider request
    async resetFilter() {
      this.filterOptions.teacher_name = null;
      this.filterOptions.phone = null;
      this.filterOptions.foundation = null;

      if (this.$route.query.page !== "1") {
        await this.$router.push({
          path: "/teachers-requests/all",
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
        let res = await this.$axios({
          method: "GET",
          url: "teacher-requests?accountStatus=pending",

          params: {
            page: this.paginations.current_page,
            name: this.filterOptions.teacher_name,
            mobile: this.filterOptions.phone,
            foundation: this.filterOptions.foundation?.value,
          },
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

    // Start:: Change Activation Status
    openRequestStatusModal(item, status) {
      this.itemToChangeActivationStatus = item;
      if (status == "accepted") {
        this.approvedTeachers(item);
      } else if (status == "rejected") {
        this.dialogStatusReject = true;
        this.modalRequest = { ...item };
        this.currentRequest = item;
      }
    },
    cancelRequest() {
      this.dialogStatusAccept = false;
      this.dialogStatusReject = false;
    },
    // End:: Change Activation Status
    // ==================== Start:: Crud ====================
    // ===== Start:: End
    editItem(item) {
      this.$router.push({ path: `/teachers-requests/edit/${item.id}` });
    },

    showItem(item) {
      this.$router.push({ path: `/teachers-requests/show/${item.id}` });
    },
    // ===== End:: End

    // ===== Start:: Delete
    selectDeleteItem(item) {
      this.dialogDelete = true;
      this.itemToDelete = item;
    },

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
    this.setTableRows();

    // End:: Fire Methods
  },
};
</script>