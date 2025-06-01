<template>
  <div class="my-5" :class="col ? `col-lg-${col}` : ''">
    <div class="input_wrapper top_label mb-1">
      <label class="form-label">
        {{ placeholder }}
        <span class="text-danger" v-if="required">*</span>
      </label>
      <!-- :key="defaultCountry" -->
      <vue-tel-input
        style="direction: ltr; color: black"
        @input="updateValue"
        :autoFormat="false"
        @country-changed="countryChanged"
        :defaultCountry="defaultCountry"
        :preferredCountries="['SA']"
        :key="defaultCountry"
        :disabled="disabled"
        v-model="displayValue"
        :dropdownOptions="{
          showDialCodeInSelection: true,
          showDialCodeInList: true,
          showFlags: true,
          showSearchBox: true,
          // searchBoxPlaceholder: 'Search',
        }"
        :style="
          showLengthError
            ? 'border-color: #dc3546; box-shadow: 0 0 0 1px #dc3546'
            : ''
        "
        :inputOptions="{ placeholder: null, maxlength: maxLength }"
      />
      <!-- :inputOptions="{ placeholder: placeholder }" -->
      <!-- :inputOptions="{ maxlength: maxLength }" -->
      <!-- Error message if phone number too short -->
    </div>
    <span class="text-danger" v-if="showLengthError">
      {{ $t("VALIDATION.PHONE_NUMBER_LENGTH") }} {{ maxLength }}
    </span>
  </div>
</template>

<script>
import vueInput from "vue-tel-input/dist/vue-tel-input.common";
import CountryCodes from "../../assets/CountryCodes.json";

export default {
  name: "BasePhoneInput",
  props: {
    placeholder: String,
    value: {
      type: String,
      required: true,
    },
    required: {
      required: false,
      type: Boolean,
      default: false,
    },
    col: {
      required: false,
      type: String,
    },
    defaultCountry: {
      required: false,
      type: String,
      default: "SA",
    },
    key: {
      required: false,
      type: String,
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isInitialized: false,
      touched: false,
      displayValue: this.value,
    };
  },

  computed: {
    maxLength() {
      const isoCode = this.defaultCountry;
      const country = CountryCodes?.find((c) => c?.iso?.alpha2 == isoCode);
      return country ? country?.phoneLength : 15;
    },
    showLengthError() {
      const length = this.displayValue?.length;
      return this.required && length > 0 && length !== this.maxLength;
    },
  },

  watch: {
    value(newVal) {
      // Update display value when prop changes
      this.displayValue = newVal;
    },
  },

  methods: {
    countryChanged(country) {
      this.$emit("dialCode", country.dialCode);
      this.$emit("isoCode", country.iso2);
    },

    updateValue(number) {
      this.displayValue = number;

      const length = number?.length || 0;
      const hasLengthError =
        this.required && length > 0 && length !== this.maxLength;
      if (!hasLengthError) {
        this.$emit("input", number);
      } else {
        this.$emit("input", "");
      }

      this.touched = true;
      setTimeout(() => {
        this.isInitialized = true;
      }, 5000);
    },
  },
};
</script>

<style lang="scss" scoped>
.vue-tel-input {
  width: 100% !important;
}
::v-deep .vti__dropdown-list.below {
  z-index: 99 !important;
  // left: -326px !important;
  min-width: 400px !important;
  margin-top: 13px !important;
}
</style>
