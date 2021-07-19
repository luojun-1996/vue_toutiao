<template>
  <div class="layout_container">
    <!-- 路由出口 start -->
    <router-view></router-view>
    <!-- 路由出口 end -->

    <!-- 底部导航栏 start -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/wd">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/mine">我的</van-tabbar-item>
    </van-tabbar>
    <!-- 底部导航栏 end -->
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      active: 0,
    };
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="less">
</style>
