<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell center :border="false">
      <div slot="title" class="chanel-title">我的频道</div>
      <van-button
        class="edit"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdited = !isEdited"
        >{{ isEdited ? "完成" : "编辑" }}</van-button
      >
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        :class="{ active: index === active }"
        :icon="isEdited && index !== 0 ? 'clear' : ''"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell center :border="false">
      <div slot="title" class="chanel-title">频道推荐</div>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from "@/api/channel";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";

export default {
  props: {
    userChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      allChannels: [],
      isEdited: false,
    };
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels();
      this.allChannels = data.data.channels;
    },
    async onAdd(channel) {
      try {
        this.userChannels.push(channel);
        // 数据持久化
        if (this.user) {
          await addUserChannel({
            channels: [
              {
                id: channel.id,
                seq: this.userChannels.length,
              },
            ],
          });
        } else {
          setItem("user-channels", this.userChannels);
        }
      } catch (err) {
        console.log(err);
        this.$toast("添加频道失败");
      }
    },
    onUserChannelClick(channel, index) {
      if (this.isEdited && index !== 0) {
        this.deleteChannel(channel, index);
      } else {
        this.switchChannel(index);
      }
    },
    async deleteChannel(channel, index) {
      if (index <= this.active) {
        this.$emit("update-active", this.active - 1);
      }
      this.userChannels.splice(index, 1);

      if (this.user) {
        await deleteUserChannel(channel.id);
      } else {
        setItem("user-channels", this.userChannels);
      }
    },
    switchChannel(index) {
      this.$emit("update-active", index);
      this.$emit("close");
    },
  },
  components: {},
  computed: {
    ...mapState(["user"]),
    recommendChannels() {
      return this.allChannels.filter((channel) => {
        return !this.userChannels.find((userChannel) => {
          return userChannel.id === channel.id;
        });
      });
    },
  },
};
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 54px;
  .chanel-title {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }
  .grid-item {
    /deep/ .van-grid-item__content {
      width: 80px;
      height: 43px;
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
      .van-grid-item__icon {
        position: absolute;
        right: -5px;
        top: -5px;
        font-size: 20px;
        color: #ccc;
      }
    }
  }
  .active {
    /deep/ .van-grid-item__text {
      color: #ff0000 !important;
    }
  }
  .edit {
    padding: 0px 15px;
    /deep/ .van-button__text {
      font-size: 12px;
    }
  }
}
</style>
