<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updteUserProfile } from "@/api/user";
import dayjs from "dayjs";

export default {
  name: "updateBirthday",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    };
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidClick: true,
      });

      //   const date = `${this.currentDate.getFullYear()}-${
      //     this.currentDate.getMonth() + 1
      //   }-${this.currentDate.getDate()}`;

      const date = dayjs(this.currentDate).format("YYYY-MM-DD");
      await updteUserProfile({
        birthday: date,
      });

      this.$toast.success("保存成功");
      this.$emit("input", date);
      this.$emit("close");
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
