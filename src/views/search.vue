<template>
    <div class="search bg_white">
        <input class="input" type="text" placeholder="请输入自提码" v-model="code" @blur="scroll">
        <van-button round type="danger" class="bg_gold" @click="submit">确定</van-button>
    </div>
</template>

<script>
import { Button,Toast } from 'vant';
    export default {
        components:{
            'van-button':Button
        },
        data(){
            return{
                code:'',
            }
        },
        methods:{
            submit(){
                if(this.code==''){
                    Toast({message:'请输入自提码',duration:2000})
                    return
                }
                if(!sessionStorage.getItem('store_id')){
                    this.$router.push('/store')
                    return
                }
                this.$router.push({path:'/ticketdetail',query:{code:this.code}})
            },
            scroll(){
                window.scrollTo(0,0)
            }
        }
    }
</script>

<style scoped lang="less">
.search{
    width: 672px;
    position: relative;
    top: 282px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-flow: column;
    align-items: center;
    border-radius: 15px;
    .input{
        font-size: 44px;
        width: 592px;
        border-bottom: 2px solid #c7cacc;
        padding-bottom: 40px;
        padding-top: 106px;
        margin-bottom: 82px;
    }
    input::placeholder{
        color: #ababab;
        padding-top: 10px;
    }
    .van-button{
        width: 562px;
        height: 90px;
        border: none;
        margin-bottom: 47px;
    }
}
</style>