<template>
  <div class="mine_container">
    <!-- 登录走这个 -->
    <van-cell-group v-if="user" class="my_info">
      <!-- 首行用户信息 -->
      <van-cell class="base_info" center :border="false">
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <div class="name" slot="title">{{ currentUser.name }}</div>
        <van-button class="update_btn" size="small" round to="/user/profile"
          >编辑资料</van-button
        >
      </van-cell>

      <!-- 第二行 用户数据 Grid宫格 -->
      <van-grid class="data_info" :border="false">
        <van-grid-item class="data_info_item">
          <div class="text_wrap" slot="text">
            <div class="count">{{ currentUser.art_count }}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data_info_item">
          <div class="text_wrap" slot="text">
            <div class="count">{{ currentUser.follow_count }}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data_info_item">
          <div class="text_wrap" slot="text">
            <div class="count">{{ currentUser.fans_count }}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data_info_item">
          <div class="text_wrap" slot="text">
            <div class="count">{{ currentUser.like_count }}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- 未登录走这个 -->
    <div v-else class="not_login">
      <div @click="$router.push('/login')">
        <img class="mobile" src="./shouji.png" alt="" />
      </div>
      <div class="text">登录 / 注册</div>
    </div>

    <!-- 第三行 收藏和历史 -->
    <van-grid class="nav_grid" :column-num="2">
      <van-grid-item
        class="nav_grid_item"
        icon-prefix="iconfont"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav_grid_item"
        icon-prefix="iconfont"
        icon="lishi"
        text="历史"
      />
    </van-grid>

    <!-- 消息通知和小智同学 -->
    <van-cell title="消息通知" is-link to="" />
    <van-cell title="小智同学" is-link to="" />

    <!-- 退出登录 -->
    <van-cell
      v-if="user"
      class="logout_cell"
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getCurrentUser } from "@/api/user";

export default {
  props: {},
  data() {
    return {
      // 当前用户登录信息
      currentUser: {},
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.loadCurrentUser();
  },
  methods: {
    // 获取登录用户信息
    async loadCurrentUser() {
      const { data } = await getCurrentUser();
      this.currentUser = data.data;
    },
    // 退出登录
    onLogout() {
      // 提示用户退出确认信息;
      this.$dialog
        .confirm({
          title: "退出提示",
          message: "确认退出吗?",
        })
        .then(() => {
          // 确认执行，清楚用户登录状态
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
        });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.mine_container {
  .my_info {
    background: url("./banner.png") no-repeat;
    background-size: cover;
    .base_info {
      height: 115px;
      box-sizing: border-box;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        box-sizing: border-box;
        margin-right: 11px;
      }
      .name {
        color: #fff;
        font-size: 15px;
      }
      .update_btn {
        height: 16px;
        font-size: 10px;
        color: #666666;
      }
    }
    .data_info {
      .data_info_item {
        height: 65px;
        color: #fff;
        .text_wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
  }
  .not_login {
    height: 180px;
    background: url("./banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      font-size: 14px;
      color: #fff;
    }
  }
  /deep/ .van-grid-item__content {
    background-color: unset;
  }
  /deep/ .nav_grid {
    background-color: #fff;
    margin-bottom: 5px;
    .nav_grid_item {
      height: 70px;
      .iconfont {
        font-size: 22px;
      }
      .iconfont-shoucang {
        color: #eb5253;
      }
      .iconfont-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333333;
      }
    }
  }
  .logout_cell {
    text-align: center;
    color: #d86262;
    margin-top: 5px;
  }
}
</style>
