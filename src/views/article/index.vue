<template>
  <div class="article-container">
    <!-- NavBar导航栏部分start -->
    <van-nav-bar
      class="home_container app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- NavBar导航栏部分end -->

    <div class="article-wrap">
      <h1 class="title">{{ article.title }}</h1>

      <van-cell center class="user-info">
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="article.aut_photo"
        />
        <div slot="label" class="pubdate">
          {{ article.pubdate | relativeTime }}
        </div>
        <van-button
          class="follow-btn"
          :type="article.is_followed ? 'default' : 'info'"
          :icon="article.is_followed ? '' : 'plus'"
          round
          size="small"
          :loading="isFollowLoading"
          @click="onFollow"
          >{{ article.is_followed ? "已关注" : "关注" }}
        </van-button>
      </van-cell>
      <!-- 正文 start -->
      <div
        class="markdown-body"
        v-html="article.content"
        ref="article-content"
      ></div>
      <!-- 正文 end -->

      <!-- 文章评论列表 start -->
      <CommentList
        :source="articleId"
        :lists="commentList"
        @update-total_count="totalCommentCount = $event"
        @reply-click="onReplyClick"
      ></CommentList>
      <!-- 文章评论列表 end -->
    </div>

    <!-- 底部区域 start -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
        >写评论</van-button
      >
      <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
      <van-icon
        :color="article.is_collected ? 'orange' : '#777'"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      />
      <van-icon
        :color="article.attitude === 1 ? 'hotpink' : '#777'"
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
      />
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- 底部区域 end -->

    <!-- 发布评论 start -->
    <van-popup v-model="isPostShow" position="bottom">
      <PostComment :target="articleId" @post-success="onPostSuccess" />
    </van-popup>
    <!-- 发布评论 end -->

    <!-- 评论回复 start -->
    <van-popup v-model="isReplyShow" position="bottom">
      <CommentReply
        v-if="isReplyShow"
        :comment="replyComment"
        :article-id="articleId"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- 评论回复 end -->
  </div>
</template>

<script>
import "./github-markdown.css";
import {
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike,
} from "@/api/article";
import { ImagePreview } from "vant";
import { addFollow, deleteFollow } from "@/api/user";
import CommentList from "./component/comment-list.vue";
import PostComment from "./component/post-comment.vue";
import CommentReply from "./component/comment-reply.vue";

export default {
  name: "articleIndex",
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {}, // 文章数据对象
      isFollowLoading: false,
      isCollectLoading: false,
      isPostShow: false, // 控制发布评论的弹出
      commentList: [], // 文章评论列表
      totalCommentCount: 0, // 评论总数量
      isReplyShow: false, // 控制回复的弹出
      replyComment: {}, // 当前回复评论对象
    };
  },
  created() {
    this.loadAtricle();
  },
  methods: {
    async loadAtricle() {
      const { data } = await getArticleById(this.articleId);
      this.article = data.data;
      //   console.log(this.article);

      this.$nextTick(() => {
        this.handlePerviewImage();
      });
    },
    handlePerviewImage() {
      // 获取文章内容DOM容器
      const articleContent = this.$refs["article-content"];
      // 得到所有的img标签
      const imgs = articleContent.querySelectorAll("img");
      // 循环img列表，给img注册点击事件
      const imgPaths = [];
      imgs.forEach((img, index) => {
        imgPaths.push(img.src);
        img.onclick = function () {
          ImagePreview({
            images: imgPaths,
            startPosition: index,
          });
        };
      });
    },
    async onFollow() {
      this.isFollowLoading = true;
      const articleId = this.article.aut_id;
      if (this.article.is_followed) {
        // 已关注，取消关注
        await deleteFollow(articleId);
      } else {
        // 未关注，添加关注
        await addFollow(articleId);
      }
      // 更新视图
      this.article.is_followed = !this.article.is_followed;

      this.isFollowLoading = false;
    },
    async onCollect() {
      this.$toast.loading({
        message: "操作中...",
        forbidClick: true,
      });

      if (this.article.is_collected) {
        // 已收藏，取消收藏
        await deleteCollect(this.articleId);
      } else {
        // 未收藏，添加收藏
        await addCollect(this.articleId);
      }
      // 更新视图
      this.article.is_collected = !this.article.is_collected;

      this.$toast.success(`${this.article.is_collected ? "" : "取消"}收藏成功`);
    },
    async onLike() {
      this.$toast.loading({
        message: "操作中...",
        forbidClick: true,
      });

      if (this.article.attitude === 1) {
        // 已点赞，取消点赞
        await deleteLike(this.articleId);
        this.article.attitude = -1;
      } else {
        // 未点赞，添加点赞
        await addLike(this.articleId);
        this.article.attitude = 1;
      }

      this.$toast.success(
        `${this.article.attitude === 1 ? "" : "取消"}点赞成功`
      );
    },
    onPostSuccess(comment) {
      // console.log(comment);
      this.commentList.unshift(comment);
      this.totalCommentCount++;
      this.isPostShow = false;
    },
    onReplyClick(comment) {
      this.replyComment = comment;
      this.isReplyShow = true;
    },
  },
  components: {
    CommentList,
    PostComment,
    CommentReply,
  },
};
</script>

<style scoped lang="less">
.article-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}

.user-info {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 12px;
    color: #333333;
  }
  .pubdate {
    font-size: 12px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 85px;
    height: 29px;
    border: none;
  }
}

.markdown-body {
  padding: 14px;
  background-color: #fff;
}

.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 14px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
    .van-info {
      font-size: 11px;
      background-color: #e22829;
    }
  }
}
</style>
