<template>
  <div class="update-photo">
    <img class="image" :src="image" ref="image" />
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import { updteUserPhoto } from "@/api/user";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

export default {
  props: {
    file: {
      //   type: Object,
      required: true,
    },
  },
  data() {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null,
      duration: 0,
    };
  },
  mounted() {
    const image = this.$refs.image;
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true,
    });
  },
  methods: {
    getCroppedCanvas() {
      return new Promise((resolve) => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file);
        });
      });
    },
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidClick: true,
      });

      const file = await this.getCroppedCanvas();
      const fd = new FormData();
      fd.append("photo", file);

      await updteUserPhoto(fd);

      this.$emit("update-photo", window.URL.createObjectURL(file));
      this.$emit("close");
      this.$toast.success("保存成功");
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  margin-top: 100px;
}
.image {
  display: block;
  max-width: 100%;
}
.update-photo {
  padding-top: 40%;
}
</style>
