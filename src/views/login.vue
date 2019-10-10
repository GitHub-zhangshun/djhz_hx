<template>
    <div class="login bg_white">
        <div class="logo">
            <img src="@/assets/images/logo.png" alt="">
        </div>  
        <div class="input bg_white">
            <input type="number" pattern="\d*" class="phone text_size_30" v-model="formData.phone" placeholder="请输入您的手机号码">
            <div class="code">
                <input type="number" pattern="\d*" autofocus class="text_size_30 code_input" v-model="formData.validateCode" placeholder="请输入您的验证码">
                <van-button class="bg_gold color_white code_btn" :disabled="code_disabled" @click="get_code">{{word}}</van-button>
            </div>
            <van-button :loading="loading" :disabled="disabled" class="bg_gold color_white submit" round @click="login">登录</van-button>
        </div>           
    </div>
</template>

<script>
import { Button,Toast } from 'vant'
import { checkPhone } from '@/libs/publicFun'
import { setToken } from '@/libs/auth'
    export default {
        components:{
            'van-button':Button
        },
        data(){
            return{
                formData:{
                    phone:'',
                    validateCode:'',
                    sourceSimplify:'store_h5'
                },
                code_disabled:false,
                word:'获取验证码',
                disabled : true,
                loading:false
            }
        },
        watch:{
            formData:{
                deep:true,
                handler(){
                    this.disabled = true
                    if(this.formData.phone!='' && this.formData.validateCode!=''){
                        this.disabled = false
                    }
                }
            }
        },
        methods:{
            get_code(){
                 if(!checkPhone(this.formData.phone)){
                    Toast({message:'请输入正确的手机号码', duration:2000});
                    return
                }
                this.code_disabled = true
                this.$axios(
                    'center_user_verifycodesend',
                    {phone:this.formData.phone, type:1}
                )
                .then(data => {
                    let time = 60,that = this
                    var sendTimer = setInterval(function(){
                        time--;
                        that.word = time+'S';
                        if(time < 0){
                            that.code_disabled = false;
                            clearInterval(sendTimer);
                            that.word = "获取验证码";
                        }
                    },1000)
                })
                .catch( ()=>{
                    this.code_disabled = false
                })
            },
            login(){
                this.loading = true
                this.$axios('center_other_storelogin',this.formData)
                .then( data => {
                    this.loading = false
                    setToken(data.result.token)
                    this.$router.push('/store')
                }) 
                .catch( ()=>{
                    this.loading = false
                })
            }
        }
    }
</script>

<style scoped lang='less'>
.login{
    min-height: 100vh;
    .logo{
        background: url(../assets/images/bg.png) center no-repeat;
        background-size: 100% 100%;
        height: 470px;
        img{
            padding-top: 42px;
            width: 151px;
        }
    }
    .input{
        position:absolute;
        top: 252px;
        left: 50%;
        transform: translateX(-50%);
        width: 632px;
        border-radius: 10px;
        padding: 122px 30px 142px ;
        box-shadow: 0 0 10px #e4e4e4;
        display: flex;
        flex-flow: column;
        align-items: center;
        .phone{
            padding: 0 0 0 20px;
            width: 612px;
            margin-bottom: 48px;
            height: 92px;
            background: #f5f5f5;
            border-radius: 10px;
            // padding-left: 20px;
        }
        .phone::placeholder,
        .code_input::placeholder{
            padding-top: 10px;
            color:#ababab;
        }
        .code{
            width: 632px;
            margin-bottom: 102px;
            display: flex;
            justify-content:space-between;
            .code_input{
                padding: 0 0 0 20px;
                width: 352px;
                background: #f5f5f5;
                border-radius: 10px;
                height: 92px;
            }
            .code_btn{
                width: 242px;
                border-radius: 10px;
                height: 92px;
            }
        }
        .submit{
            width: 562px;
            height: 92px;
        }
    }
}
</style>