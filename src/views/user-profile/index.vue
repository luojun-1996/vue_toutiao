<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <input
      type="file"
      hidden
      accept="image/*"
      ref="file"
      @change="onFileChange"
    />
    <!-- 单元格 -->
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image width="30" height="30" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="isEditNameShow = true"
    />
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 0 ? '男' : '女'"
      @click="isEditGenderShow = true"
    />
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="isEditBirthdayShow = true"
    />

    <!-- 昵称弹出层 -->
    <van-popup
      v-model="isEditNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- :name="user.name"
        @update-name="user.name = $event" -->

      <update-name
        v-if="isEditNameShow"
        v-model="user.name"
        @close="isEditNameShow = false"
      />
    </van-popup>

    <!-- 性别弹出层 -->
    <van-popup v-model="isEditGenderShow" position="bottom">
      <update-gender
        v-if="isEditGenderShow"
        v-model="user.gender"
        @close="isEditGenderShow = false"
      />
    </van-popup>

    <!-- 生日弹出层 -->
    <van-popup v-model="isEditBirthdayShow" position="bottom">
      <update-birthday
        v-if="isEditBirthdayShow"
        v-model="user.birthday"
        @close="isEditBirthdayShow = false"
      />
    </van-popup>

    <!-- 头像弹出层 -->
    <van-popup
      class="update-photo-popup"
      v-model="isEditPhotoShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-photo
        v-if="isEditPhotoShow"
        :file="previewImage"
        @close="isEditPhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdateName from "./components/update-name.vue";
import UpdateGender from "./components/update-gender.vue";
import UpdateBirthday from "./components/update-birthday.vue";
import UpdatePhoto from "./components/update-photo.vue";

export default {
  props: {},
  data() {
    return {
      user: {}, // 用户数据
      isEditNameShow: false, // 编辑昵称显示状态
      isEditGenderShow: false, // 编辑性别弹出层显示状态
      isEditBirthdayShow: false, // 编辑生日弹出层显示状态
      isEditPhotoShow: false, // 编辑头像弹出层显示状态
      previewImage: null,
    };
  },
  created() {
    this.loadUserProfile();
  },
  methods: {
    async loadUserProfile() {
      const { data } = await getUserProfile();
      this.user = data.data;
    },
    onFileChange() {
      this.isEditPhotoShow = true;

      //   const blob = window.URL.createObjectURL(this.$refs.file.files[0]);
      const file = this.$refs.file.files[0];
      this.previewImage = file;
      // 保证相同文件一样触发事件
      this.$refs.file.value = "";
    },
  },
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
};
</script>

<style scoped lang="less">
.van-popup {
  background-color: #f5f7f9;
}
.update-photo-popup {
  background-color: #000;
}
</style>
