<template>
  <div class="my-5" :class="col ? `col-lg-${col}` : ''">
    <div class="wrapper">
      <img
        v-if="useImagePreview && selectedFile.path"
        :src="preSelectedFile ? preSelectedFile : selectedFile.path"
        width="120"
        height="120"
        class="selected_image_preview"
      />

      <div class="d-flex" style="font-size: 16px; color: #af18f9">
        <span class="form-label mx-2">
          {{ placeholder }} <span class="text-danger">*</span>
        </span>
        <a
          v-if="preSelectedFile || selectedFile?.path"
          :href="preSelectedFile || selectedFile?.path"
          class="file_name"
          target="_blank"
          style="color: #af18f9"
        >
          <!-- {{ preSelectedFile?.split("/").pop() || selectedFile?.name }} -->
          : <i class="fal fa-file-pdf mx-3"></i>
        </a>
      </div>
      <div class="input_wrapper upload_file_text_preview top_label">
        <label
          class="input_file_label text-center"
          style="color: #af18f9; cursor: pointer"
          :for="identifier"
        >
          <i class="fa fa-upload"></i>
        </label>

        <input
          type="file"
          accept="image/*, .pdf"
          class="form-control"
          :id="identifier"
          @change="selectFileToUpload"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseNamePreviewFileUploadInput",

  emits: ["selectFile"],

  props: {
    // ====== Start:: General Inputs Props ====== //
    col: {
      required: false,
      type: String,
    },
    identifier: {
      required: true,
      type: String,
    },
    preSelectedFile: {
      required: false,
      type: String,
    },
    placeholder: {
      required: false,
      type: String,
    },
    useImagePreview: {
      required: false,
      type: Boolean,
      default: false,
    },
    required: {
      required: false,
      type: Boolean,
      default: false,
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
    // ====== End:: General Inputs Props ====== //
  },

  data() {
    return {
      selectedFile: {
        file: null,
        path: null,
        name: null,
      },
    };
  },

  methods: {
    // Start:: Select File
    selectFileToUpload(e) {
      this.selectedFile.file = e.target.files[0];
      this.selectedFile.path = URL.createObjectURL(e.target.files[0]);
      this.selectedFile.name = e.target.files[0].name;
      this.$emit("selectFile", {
        identifier: this.identifier,
        ...this.selectedFile,
      });
    },
    // End:: Select File
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  @include flexCenterAlignment;
  flex-direction: column;
  row-gap: 15px;
  .selected_image_preview {
    border-radius: 10px;
    object-fit: cover;
  }
  .upload_file_text_preview {
    width: 100%;
  }
}
</style>
