<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <CommentItem
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from "@/api/comment";
import CommentItem from "./comment-item.vue";

export default {
  props: {
    source: {
      type: [String, Number, Object],
      required: true,
    },
    type: {
      type: String,
      default: "a",
    },
    lists: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
    };
  },
  methods: {
    async onLoad() {
      const { data } = await getComments({
        type: this.type,
        source: this.source.toString(),
        offset: this.offset,
        limit: this.limit,
      });

      this.$emit("update-total_count", data.data.total_count);

      const { results } = data.data;
      this.list.push(...results);

      this.loading = false;

      if (results.length) {
        this.offset = data.data.last_id;
      } else {
        this.finished = true;
      }
    },
  },
  components: {
    CommentItem,
  },
};
</script>

<style scoped lang="less">
</style>
