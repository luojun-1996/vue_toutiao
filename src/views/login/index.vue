<template>
  <div class="login_container">
    <!-- NavBar导航栏部分start -->
    <van-nav-bar
      class="app-nav-bar"
      title="注册 / 登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- NavBar导航栏部分end -->

    <!-- 表单登录部分 start -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="loginFormRef"
      @submit="onLogin"
      @failed="onFailed"
    >
      <!-- Field 输入框 -->
      <van-field
        v-model="user.mobile"
        icon-prefix="iconfont"
        left-icon="shouji"
        placeholder="请输入手机号"
        center
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="iconfont"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        center
        name="code"
        :rules="formRules.code"
      >
        <!-- 验证码按钮 -->
        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <!-- 发送验证码 -->
          <van-button
            class="send_btn"
            size="small"
            round
            v-else
            :disabled="isSendSmsDisabled"
            @click.prevent="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>

      <!-- 登录按钮 -->
      <div class="login_btn_box">
        <van-button class="login_btn" type="info" block
          >注册 / 登录
        </van-button>
      </div>
    </van-form>
    <!-- 表单登录部分 end -->
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user.js";

export default {
  props: {},
  data() {
    return {
      // 用户输入信息
      user: {
        mobile: "13911111111",
        code: "",
      },
      // 表单验证规则
      formRules: {
        mobile: [
          { required: true, message: "手机号不能为空" },
          {
            pattern:
              /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号格式错误",
          },
        ],
        code: [
          { required: true, message: "验证码不能为空" },
          { pattern: /^\d{6}$/, message: "验证码格式错误" },
        ],
      },
      // 控制倒计时出现
      isCountDownShow: false,
      // 控制是否禁用发送验证码按钮
      isSendSmsDisabled: false,
    };
  },
  methods: {
    // 表单提交触发
    async onLogin() {
      this.$toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        const { data } = await login(this.user);
        this.$toast.success("登录成功");

        // 将后端返回的用户登录状态（token等数据）放到 Vuex 容器中
        this.$store.commit("setUser", data.data);

        // 登录成功，跳转到客户信息页面
        this.$router.back();
      } catch (err) {
        // console.log(err);
        this.$toast.fail("登录失败,手机号或验证码错误");
      }
    },
    // 正则验证失败触发
    onFailed(error) {
      // console.log(error);
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message,
          position: "top",
        });
      }
    },
    // 点击发送验证码触发
    async onSendSms() {
      try {
        // 校验手机号码
        await this.$refs["loginFormRef"].validate("mobile");

        // 验证通过,禁用发送按钮,防止多次点击
        this.isSendSmsDisabled = true;

        // 请求发送验证码
        await sendSms(this.user.mobile);

        // 发送倒计时按钮消失，倒计时出现
        this.isCountDownShow = true;
      } catch (err) {
        let message = "";

        if (err && err.response && err.response.atatus === 429) {
          // 短时间多次点击发送短信验证码
          message = "发送太频繁了，请稍后再试";
        } else if (err.name === "mobile") {
          // 表单验证失败
          message = err.message;
        } else {
          // 未知错误
          message = "发送失败，请稍后重试";
        }

        // 发送失败提示信息
        this.$toast({
          message,
          position: "top",
        });
      }
      // 关闭发送验证码按钮的禁用状态
      this.isSendSmsDisabled = false;
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.login_container {
  .send_btn {
    width: 86px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      font-family: "微软雅黑";
      color: #666666;
    }
  }
  .login_btn_box {
    padding: 26px 16px;
    .login_btn {
      background-color: #6db4fb;
      font-size: 15px;
      border: none;
      border-radius: 5px;
    }
  }
}
</style>
