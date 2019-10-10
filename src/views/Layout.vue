<template>
    <div class="all">
        <div class="content">
            <router-view/>
        </div>       
        <van-tabbar v-model="active" active-color="orange">
            <van-tabbar-item to="/search">
                <span>核销</span>
                <img
                slot="icon"
                slot-scope="props"
                :src="props.active ? icon.active1 : icon.normal1"
                >
            </van-tabbar-item>
            <van-tabbar-item to="/order_list">
                <span>订单</span>
                <img
                slot="icon"
                slot-scope="props"
                :src="props.active ? icon.active2 : icon.normal2"
                >
            </van-tabbar-item>
            <van-tabbar-item to="/stores_detail">
                <span>门店</span>
                <img
                slot="icon"
                slot-scope="props"
                :src="props.active ? icon.active3 : icon.normal3"
                >
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';
    export default {
        components:{
            'van-tabbar':Tabbar,
            'van-tabbar-item':TabbarItem,
        },
        data(){
            return{
                active: 0,
                icon: {
                    normal1: require('@/assets/images/icon_Write-offs_n.png'),
                    active1: require('@/assets/images/icon_Write-offs_s.png'),
                    normal2: require('@/assets/images/icon_Order_n.png'),
                    active2: require('@/assets/images/icon_Order_s.png'),
                    normal3: require('@/assets/images/icon_Shops_n.png'),
                    active3: require('@/assets/images/icon_Shops_s.png'),
                }
            }
        },
        created(){
           switch(this.$route.path){
                case '/search': this.active = 0; break;
                case '/order_list': this.active = 1; break;
                case '/stores_detail': this.active = 2; break;
            }
        }
    }
</script>

<style scoped lang='less'>
.all{
    .content{
        min-height: calc(100vh - 100px);
    }
    .van-tabbar{
        height: 100px;
        border-top: 1px solid #e3e3e3;  
        .van-tabbar-item{
            font-size: 21px;
        }
        img{
            width: 48px;
            height: 48px;
            margin-bottom: 2px;
        }
    }
}

</style>