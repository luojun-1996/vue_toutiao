<template>
  <div class="comment-reply">
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>

    <!-- 当前评论项 -->
    <CommentItem :comment="comment"></CommentItem>

    <!-- 所有评论回复 -->
    <CommentList :source="comment.com_id" type="c" :lists="commentList" />

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
    </div>
    <!-- 底部区域 end -->

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <PostComment
        :target="comment.com_id"
        :article-id="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from "./comment-item.vue";
import CommentList from "./comment-list.vue";
import PostComment from "./post-comment.vue";

export default {
  name: "commentReply",
  props: {
    comment: {
      type: Object,
      required: true,
    },
    articleId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {
      isPostShow: false,
      commentList: [],
    };
  },
  methods: {
    onPostSuccess(comment) {
      this.commentList.unshift(comment);
      this.comment.reply_count++;
      this.isPostShow = false;
    },
  },
  components: {
    CommentItem,
    CommentList,
    PostComment,
  },
};
</script>

<style scoped lang="less">
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
    width: 200px;
    height: 30px;
    border: 1px solid #eeeeee;
    font-size: 14px;
    line-height: 23px;
    color: #a7a7a7;
  }
}
</style>
