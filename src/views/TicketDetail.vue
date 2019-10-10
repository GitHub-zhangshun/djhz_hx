<template>
<!-- 订单详情 -->
    <div class="ticket_detail bg_base">
        <div class="content">
            <div class="top">
                <div class="text_size_32 state">
                    <p>{{ state }}</p>
                </div>
                
               <div class="bg_white userinfo">
                     <p class="row"><span>用户姓名</span><span>{{ ticketInfo.name }}</span></p>      
                     <p class="row"><span>手机号码</span><span>{{ ticketInfo.phone }}</span></p>      
                     <p class="row" v-if="takeTime"><span>预约自提时间</span><span>{{ takeTime }}</span></p>      
                </div>
            </div>

            <!-- 商品 -->
            <div class="product bg_white" v-if="orderType == 1">
                <div class="main"> 
                    <div class="row" v-for="(good,index) in ticketInfo.orderGoodsList" :key="index">
                        <img :src="good.goodsImgLink||require('@/assets/images/product_placeholder.jpg')">
                        <div class="detail">
                            <p class="name text_size_28">{{ good.goodsName }}</p>
                            <div class="color_gray text_size_26 row"><p><span v-for="(item,index) in good.orderGoodsSpecList" :key="index">{{ item.attrTxt }}&nbsp;&nbsp;</span></p><span>x{{ good.count || 0 }}</span></div>
                            <p class="color_gray text_size_26">商品克重：{{ good.weight || 0 }}g</p>
                        </div>
                    </div>
                </div>  
            </div>
            <!-- 商品总额 -->
            <div class="totalPrice bg_white text_size_28" v-if="orderType == 1">
                <p class="row">
                    <span>商品总额</span>
                    <span class="color_gold">&yen;{{ ticketInfo.money && ticketInfo.money.toFixed(2) || '0.00' }}</span>
                </p>
                <p class="row">
                    <span>手续费</span>
                    <span>&yen;{{ ticketInfo.poundage && ticketInfo.poundage.toFixed(2) || '0.00' }}</span>
                </p>
                <p class="row" v-if="ticketInfo.balanceDeduction">
                    <span>使用账户余额抵扣</span>
                    <span class="color_gold">-&yen;{{ ticketInfo.balanceDeduction.toFixed(2) }}</span>
                </p>
            </div>

            <!-- 黄金 -->
            <div class="totalPrice bg_white text_size_28" v-if="orderType == 2">
                <p class="row">
                    <span>提金合计克重</span>
                    <span class="color_gold">{{ ticketInfo.orderWeight || 0  }}克</span>
                </p>
                <p class="row">
                    <span>实际购买金额合计</span>
                    <span>&yen;{{ ticketInfo.orderMoney && ticketInfo.orderMoney.toFixed(2) || '0.00' }}</span>
                </p>
            </div>


            <!-- 订单信息 -->
            <div class="invoice bg_white text_size_28">
                <p v-if="ticketInfo.remark">
                    <span>订单备注</span>
                    <span>{{ ticketInfo.remark }}</span>
                </p>
                <p>
                    <span>订单编号</span>
                    <span>{{ ticketInfo.number }}</span>
                </p>
                <!-- 订单进度 -->
                <p>
                    <span>创建时间</span>
                    <span>{{ ticketInfo.createTimeStamp }}</span>
                </p>
                <p v-if="ticketInfo.payTime">
                    <span>支付时间</span>
                    <span>{{ ticketInfo.payTime }}</span>
                </p>
                <p v-if="ticketInfo.finishTime">
                    <span>完成时间</span>
                    <span>{{ ticketInfo.finishTime }}</span>
                </p>
            </div>

        </div>

        <!-- 页脚 -->
        <div class="footer bg_white text_size_28">
            <div class="row">
                <p>合计：<span class="color_gold text_size_32">&yen;{{ ticketInfo.totalMoney && ticketInfo.totalMoney.toFixed(2) || '0.00' }}</span></p>
                <p>
                    <van-button round class="another" v-if="state == '待自提'" @click="verification">确认核销</van-button>
                </p>
            </div>
        </div>

        <!-- 提货码弹框 -->
        <van-popup v-model="show" :close-on-click-overlay="false">
            <van-field type="number" pattern="\d*" v-model="value" placeholder="请输入自提码"/>            
            <div class="btn">
                <van-button round type="danger" @click="cancel" class="cancel bg_gray color_white">取消 </van-button>
                <van-button round type="danger" @click="determine" class="determine bg_gold color_white">确定</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Toast, Button, Dialog, Popup, Field } from 'vant';
import { findState, formatDate } from '@/libs/publicFun'

    export default {
        components: {
            'van-button':Button,
            'van-popup':Popup,
            'van-field':Field
        },
        data(){
            return {
                state: '',   //订单状态  待自提  已完成
                ticketInfo:{},   //订单详情
                takeTime: '',  //预约自提时间
                orderType: '',  //订单类型  1 商城订单  2 黄金订单
                show: false,
                value:''
            }
        },
        methods: {
            //确认核销
            verification(){
                if(this.$route.query.code){
                    Dialog.confirm({
                        title: '确认核销',
                        message: '您确认要核销该订单吗？'
                    }).then(() => {
                        Toast.loading({
                            message: '加载中...',
                            duration: 0,
                            loadingType: 'spinner'
                        });
                        this.$axios('order_storeorder_storeorderverifydestruction', {orderId: this.ticketInfo.id, orderType: this.orderType, code: this.$route.query.code})
                        .then(data => {
                            Toast.success({message:"核销成功", duration:2000});
                            this.getTicketInfo()
                        })
                    }).catch(() => {});
                }else{
                    this.show = true
                }
            },
                
            //获取订单信息
            getTicketInfo(){
                let storeid
                if(sessionStorage.store_id){
                    storeid = sessionStorage.store_id
                }

                let url
                let obj

                if(this.$route.query.code){
                    url = 'order_storeorder_storeorderinfobycode'
                    obj = {code: this.$route.query.code, storeId: storeid}
                }else if(this.$route.query.id && this.$route.query.type){
                    url = 'order_storeorder_storeorderinfobyorderid'
                    obj = {orderId: this.$route.query.id, orderType: this.$route.query.type}
                }

                this.$axios(url, obj)
                .then(data => {

                    console.log(data.result)
                    
                    this.ticketInfo = data.result
                    this.ticketInfo.createTimeStamp = formatDate(Number(this.ticketInfo.createTimeStamp), 'yyyy-MM-dd hh:mm')   //创建时间
                    this.ticketInfo.payTime = formatDate((this.ticketInfo.payTime), 'yyyy-MM-dd hh:mm')   //支付时间
                    this.ticketInfo.finishTime = formatDate(Number(this.ticketInfo.finishTime), 'yyyy-MM-dd hh:mm')  //完成时间

                    //自提时间
                    this.takeTime = this.ticketInfo.orderExtract &&  this.ticketInfo.orderExtract.extractTimeTxt

                    //订单类型
                    this.orderType = this.ticketInfo.orderType

                    //订单状态
                    this.$axios('order_storeorder_storeorderstatus', this.orderType)
                    .then(data => {
                        Toast.clear()
                        let currentOrder = data.result.filter(item => { return item.id == this.ticketInfo.orderStatus })[0]
                        this.state = currentOrder.title
                    }).catch(() => {
                    })
                    
                }).catch(() => {
                })
            },

            //输入提货码弹框
            cancel(){
                this.show = false
            },
            //确认
            determine(){
                if(this.value==''){
                    Toast({message:'请输入自提码',duration:2000})
                    return
                }
                if(!sessionStorage.getItem('store_id')){
                    this.$router.push('/store')
                    return
                }
                Toast.loading({
                    message: '加载中...',
                    duration: 0,
                    loadingType: 'spinner'
                });
                this.$axios('order_storeorder_storeorderverifydestruction', {orderId: this.ticketInfo.id, orderType: this.orderType, code: this.value})
                .then(data => {
                    Toast.clear()
                    this.show = false
                    Toast.success({message:"核销成功", duration:2000});
                    this.getTicketInfo()
                })
                .catch( ()=>{
                    Toast.clear()
                    this.show = false
                })
            },
        },
        created(){
            Toast.loading({
                mask: true,
                message: '加载中...',
                duration: 0,
                loadingType: 'spinner'
            });

            //根据id获取订单信息
            this.getTicketInfo()
        }
    }
</script>

<style scoped lang="less">
p,div{
    margin: 0;
}

.decoration{
    color: #f5ab0b;
    text-decoration: underline;
}

.ticket_detail{
    text-align: left;
    .content{
        height: calc( 100vh - 100px);
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        .top{
            background: url('../assets/images/state_bg.png') no-repeat;
            background-size: 100% 210px;
            .state{
                padding: 40px 40px 0px 40px;
                box-sizing: border-box;
                min-height: 110px;
                span{
                    line-height: 36px;
                }
            }
            //商品
            .userinfo{
                margin: 18px 20px;
                padding: 30px;
                border-radius: 10px;
                p{
                    justify-content: space-between;
                    line-height: 60px;
                }
            }
        }

        .product{
            padding: 34px 20px 4px 20px;
            border-bottom: 1px solid #e3e3e3;
            .main{
                &>div{  
                    margin-bottom: 30px;
                    padding-bottom: 30px;
                    border-bottom: 1px dashed #e3e3e3;
                    align-items: center;
                    &:last-of-type{
                        margin-bottom: 0;
                        border: none;
                    }
                    img{
                        height: 170px;
                        width: 170px;
                        margin-right: 18px;
                    }
                    .detail{
                        width: 540px;
                        &>p:first-of-type{
                            line-height: 36px;
                            margin-bottom: 30px;
                            overflow:hidden; 
                            text-overflow:ellipsis;
                            display:-webkit-box;
                            /*! autoprefixer: off */
                            -webkit-box-orient:vertical;
                            /*! autoprefixer: on */
                            -webkit-line-clamp:2; 
                        }
                        div{
                            justify-content: space-between;
                            margin-bottom: 10px;
                        }
                    }
                }
            }

        }

        //费用
        .totalPrice{
            padding: 34px 20px;
            margin-bottom: 18px;
                p{
                    align-items: center;
                    justify-content: space-between;
                    padding: 18px 0;
            }
        }

        //发票及支付时间
        .invoice{
            padding: 34px 20px;
            margin-bottom: 18px;
                p{
                    padding: 18px 0;
                    span{
                        &:first-of-type{
                            display: inline-block;
                            width: 140px;
                        }
                    }
            }
        }
    }

    .footer{
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #fff;
        border-top: 1px solid #e3e3e3;
        &>div{
            height: 100px;
            line-height: 100px;
            padding: 0 20px;
            justify-content: space-between;
            p{
                align-items: center;
                .van-button{
                    min-width: 160px;
                    height: 68px;
                    line-height: 68px;
                    .van-button__text{
                        font-size: 28px;
                    }
                    &.another{
                        color: #fff;
                        background: #f5ab0b;
                    }
                }
            }
        }
    }

    /deep/.van-popup{
        width: calc(100% - 156px);
        border-radius:10px; 
        padding: 0 42px;        
        .van-field{
            border-bottom: 3px solid #c7cacc;
            padding: 0;
            padding-top: 107px;
            padding-bottom: 40px;
            margin-bottom: 82px;
            .van-cell__value{
                .van-field__body{
                    input{
                        font-size: 46px;
                    }
                }                    
            }
        }
        .btn{
            display: flex;
            justify-content: space-between;
            margin-bottom: 47px;
            button{
                height: 90px;
                border: none;
            }
            .cancel{
                width: 202px;
            }
            .determine{
                width: 362px;
            }
        }
    }
}

</style>