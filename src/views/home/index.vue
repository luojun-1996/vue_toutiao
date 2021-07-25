<template>
  <div class="home_container">
    <!-- NavBar导航栏部分start -->
    <van-nav-bar>
      <van-button
        slot="title"
        class="search_btn"
        icon="search"
        type="info"
        round
        size="small"
        to="/search"
        >搜索
      </van-button>
    </van-nav-bar>
    <!-- NavBar导航栏部分end -->

    <!-- 文章频道列表 start -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <ArticleList :channel="channel"></ArticleList>
      </van-tab>

      <!-- 占位符 -->
      <div slot="nav-right" class="placeholder"></div>

      <!-- 汉堡按钮 -->
      <div
        slot="nav-right"
        @click="isChannelEditShow = true"
        class="wap-nav-wrap"
      >
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- 文章频道列表 end -->

    <!-- 弹出层部分 start -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      get-container="body"
    >
      <ChannelEdit
        :user-channels="channels"
        :active="active"
        @close="isChannelEditShow = false"
        @update-active="onUpdateActive"
      ></ChannelEdit>
    </van-popup>
    <!-- 弹出层部分 end -->
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user";
import ArticleList from "./component/article_list.vue";
import ChannelEdit from "./component/channel_edit.vue";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";

export default {
  props: {},
  data() {
    return {
      active: 0,
      // 用户频道列表
      channels: [],
      // 控制弹出层是否弹出
      isChannelEditShow: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    this.loadChannels();
  },
  methods: {
    // 获取用户频道列表
    async loadChannels() {
      let channels = [];
      if (this.user) {
        const { data } = await getUserChannels();
        channels = data.data.channels;
      } else {
        const localChannels = getItem("user-channels");
        if (localChannels) {
          channels = localChannels;
        } else {
          const { data } = await getUserChannels();
          channels = data.data.channels;
        }
      }

      this.channels = channels;
    },
    onUpdateActive(index) {
      this.active = index;
    },
  },
  components: {
    ArticleList,
    ChannelEdit,
  },
};
</script>

<style scoped lang="less">
.home_container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search_btn {
    width: 278px;
    height: 32px;
    background-color: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
  .channel-tabs {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      width: 15px;
      height: 3px;
      background-color: #3296fa;
      bottom: 20px;
    }
  }
  .placeholder {
    flex-shrink: 0;
    width: 33px;
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    opacity: 0.9;
    .van-icon {
      font-size: 24px;
    }
    &:before {
      content: "";
      width: 1px;
      height: 43px;
      background: url("./line.png") no-repeat;
      background-size: contain;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
.channel-edit-popup {
  height: 100%;
}
</style>
