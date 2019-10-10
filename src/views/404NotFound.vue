<template>
<!-- 404 -->
    <div class="page404 bg_base text_center">
        <img src="@/assets/images/404.png" alt="404">
        <p class="text_size_36">页面找不到了！</p>
        <div>   
            <van-button round class="reload" @click="$router.go(-1)">刷新页面</van-button>
            <van-button round class="bg_gold color_white" @click="$router.push('/')">返回首页</van-button>
        </div>
    </div>
</template>

<script>
import { Button } from 'vant'

    export default {
        components: {
            'van-button': Button
        }
    }
</script>

<style scoped lang="less">
.page404{
    min-height: 100vh;
    img{
        width: 338px;
        margin: 160px 0 46px 0;
    }
    p{
        margin-bottom: 80px;
    }
    .van-button{
        width: 260px;
        height: 100px;
        line-height: 100px;
        margin-left: 46px;
        &.reload{
            background: #e2e2e2;
        }
        .van-button__text{
            font-size: 30px;
        }
    }
}

</style>