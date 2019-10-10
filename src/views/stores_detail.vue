<template>
    <div class="stores_detail bg_white">
        <div class="name">
            <p class="text_size_36 title">{{ name }}</p>
            <p class="color_gray">营业时间：{{ businessHours }}</p>
            <p class="color_gray">门店地址：{{ address }}</p>
        </div>
        <div class="picture">
            <p class="text_size_32 title row"><img src="@/assets/images/icon_Store.png"><span>门店图片</span></p>
            <swiper :options="swiperOption">
                <swiper-slide v-for="(item,index) in imgList" :key="index">
                    <img :src="item">
                </swiper-slide>
            </swiper>
        </div>
        <van-button round block class="switch" @click="$router.push({path:'/store',query:{redirect:$route.fullPath}})">切换门店</van-button>
        <van-button round block class="logout bg_gold color_white" @click="logout">退出登录</van-button>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Toast,Button } from 'vant'
import { deleteToken } from '@/libs/auth'
    export default {
        components: {
            swiper,
            swiperSlide,
            'van-button':Button
        },
        data(){
            return{
                name:'',
                businessHours:'',
                address:'',
                imgList:[],
                swiperOption: {
                    slidesPerView: 'auto',
                    spaceBetween: 8,
                    freeMode: true,
                },
            }
        },
        created(){
            if(!sessionStorage.getItem('store_id')){
                this.$router.push('/store')
                return
            }
            Toast.loading({
                mask: true,
                message: '加载中...'
            });            
            this.$axios('run_store_storedetail',sessionStorage.getItem('store_id'))
            .then(data => {
                Toast.clear()
                this.name = data.result.name
                this.businessHours = data.result.businessHours
                this.address = data.result.address
                this.imgList = data.result.imgList
            })
            .catch( () => {
                Toast.clear()
            })
        },
        methods:{
            logout(){
                deleteToken()
                sessionStorage.clear()
                this.$router.push('/login')
            }
        }
    }
</script>

<style scoped lang="less">
p{
    text-align: left;
    margin: 0;
    padding: 0;
}
.stores_detail{
    min-height: calc(100vh - 100px);
    border-top: 2px solid #e3e3e3; 
    .name{
        padding: 46px 40px 48px 18px;
        margin-left: 22px;
        border-bottom: 2px solid #e3e3e3;
        .title{
            margin-bottom: 28px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        p:nth-of-type(2){
            margin-bottom: 20px;
        }
        p:nth-of-type(3){
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .picture{
        padding: 46px 0 102px 20px;
        .title{
            margin-bottom: 36px;
            align-items: center;
            img{
                width: 32px;
                height: 26px;
                margin-right: 18px;
            }
        }
        .swiper-slide{
            width: 260px;
            img{
                width: 260px;
                height: 200px;
                border-radius: 20px;
            }
        }

    }
    .switch,
    .logout{
        width: 562px;
        height: 86px;
        margin: 0 auto;
    }
    .switch{
        margin-bottom: 48px;
    }

}
</style>