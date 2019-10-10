<template>
    <div class="order_list">
        <van-tabs v-model="active" @click="onClick" :line-width="24" title-active-color="#f6ab0d">
            <van-tab v-for="(item, index) in tab" :key="index" :title="item.title">                
            </van-tab>
        </van-tabs>
        <mescroll-vue ref="mescroll" :up="mescrollUp" @init="mescrollInit">
            <ul class="list" v-if="type=='1'">
                <li v-for="(item, index) in dataList" :key="index" class="bg_white" @click="$router.push({path:'/ticketdetail',query:{type:type,id:item.id}})">
                    <div class="top">
                        <p class="text_size_26 color_gray">{{item.number}}</p>
                        <span :class="item.orderStatus==complete?'text_size_32':'text_size_32 color_gold'">{{item.orderStatus==complete?'已完成':item.orderStatus==lift?'待自提':''}}</span>
                    </div>
                    <div class="content">
                        <div class="img">
                            <img :src="item.goodsList && item.goodsList[0] && item.goodsList[0].goodsImgLink || require('@/assets/images/product_placeholder.jpg')" alt="">
                        </div>
                        <div class="right">
                            <p class="text_size_28">{{item.goodsList && item.goodsList[0] && item.goodsList[0].goodsName}}</p>
                            <div class="text_size_24 color_gray specifications">
                                <div class="">
                                    <p v-for="(orderGoodsSpecList, index) in item.goodsList && item.goodsList[0] && item.goodsList[0].orderGoodsSpecList" :key="index">{{orderGoodsSpecList.attrTxt}}&emsp;</p>
                                </div>
                                <span>X{{item.goodsList && item.goodsList[0] && item.goodsList[0].count}}</span>
                            </div>
                            <p class="text_size_24 color_gray">商品克重：{{item.goodsList && item.goodsList[0] && item.goodsList[0].weight}}g</p>
                        </div>
                    </div>
                    <p class="money text_size_28">合计：&yen;{{(item.goodsList && item.goodsList[0] && item.goodsList[0].totalMoney || 0).toFixed(2)}}元</p>
                    <van-button round type="default" :loading="item.loading" :disabled="item.disabled"  v-if="item.orderStatus==complete?false:true" @click.stop="hx(item,index)">核销</van-button>
                </li>
            </ul>
            <ul class="gold_list" v-if="type=='2'">
                <li v-for="(item, index) in dataList" :key="index" class="bg_white" @click="$router.push({path:'/ticketdetail',query:{type:type,id:item.id}})">
                    <div class="top">
                        <p class="text_size_26 color_gray">{{item.number}}</p>
                        <span :class="item.status==complete?'text_size_32':'text_size_32 color_gold'">{{item.status==complete?'已完成':item.status==lift?'待自提':''}}</span>
                    </div>
                    <p>提金克重合计：{{item.orderWeight}}克</p>
                    <p>实际购买金额合计：{{(item.orderMoney || 0).toFixed(2)}}元</p>
                    <div class="btn">
                        <van-button round type="default" :loading="item.loading" :disabled="item.disabled"  v-if="item.status==complete?false:true" @click.stop="hx(item,index)">核销</van-button>
                    </div>
                </li>
            </ul>
            <div id="noList"></div>
        </mescroll-vue>
        <van-button type="default" :disabled="disabled" class="switch text_size_30 color_white" @click="switch_tab"><img src="@/assets/images/switch.png" alt="">{{type==1?'黄金订单':'商城订单'}}</van-button>
        <van-popup v-model="show" :close-on-click-overlay="false">
            <van-field type="number" pattern="\d*" v-model="value" placeholder="请输入自提码"/>            
            <div class="btn">
                <van-button round type="danger" @click="cancel" class="cancel bg_gray color_white">取消 </van-button>
                <van-button round type="danger" :loading="loading" @click="determine" class="determine bg_gold color_white">确定</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Tab, Tabs , Button , Toast , Popup , Field } from 'vant';
import MescrollVue from 'mescroll.js/mescroll.vue'
    export default {
        components:{
            'van-tabs':Tabs,
            'van-tab':Tab,
            MescrollVue,
            'van-button':Button,
            'van-popup':Popup,
            'van-field':Field
        },
        data(){
            return{
                disabled:false,
                active:0,
                type:sessionStorage.order_type || 1,//1:商城订单列表   2:黄金订单列表
                tab:[],//tab切换栏数据
                status:'',//选中的ID
                complete:'',//已完成ID
                lift:'',//待自提ID
                switch_name:'黄金订单',
                mescroll: null, // mescroll实例对象
                mescrollUp: { // 上拉加载的配置.
                    auto:false,
                    callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                    //以下是一些常用的配置,当然不写也可以的.
                    page: {
                        num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                        size: 20 //每页数据条数,默认10
                    },
                    htmlNodata: '<p class="upwarp-nodata">-- 无更多数据 --</p>',
                    noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
                                // 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
                                // 这就是为什么无更多数据有时候不显示的原因
                    empty: {
                    	//列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
                    	warpId: "noList", //父布局的id (1.3.5版本支持传入dom元素)
                    	icon: require("@/assets/images/noticket.png"), //图标,默认null,支持网络图
                    	tip: "暂无相关数据~" //提示
                    }
                },
                dataList: [], // 列表数据
                show:false,//弹窗
                value:'',//键盘输入值,
                click_index:'',//点击的索引
                click_order_id:'',//点击的数据的ID
                loading:false,//按钮点击请求数据等待效果
            }
        },
        methods: {
            cancel(){
                this.show = false
            },
            determine(){
                if(this.value==''){
                    Toast({message:'请输入自提码',duration:2000})
                }else if(!sessionStorage.getItem('store_id')){
                    this.$router.push('/store')
                }else{
                    this.loading = true
                    this.$axios('order_storeorder_storeorderverifydestruction',{orderType:this.type,orderId:this.click_order_id,code:this.value})
                    .then( data => {
                        this.loading = false
                        Toast({message:'核销成功',duration:1500})            
                        if(this.type==1){
                            this.dataList[this.click_index].orderStatus = this.complete
                            if(this.active != 0){
                                this.dataList.splice(this.click_index,1)
                            } 
                            if(this.dataList.length==0){
                                this.mescroll.resetUpScroll() // 刷新列表数据
                            }
                        }
                        if(this.type==2){
                            this.dataList[this.click_index].status = this.complete 
                            if(this.active!=0){
                                this.dataList.splice(this.click_index,1)
                            }
                            if(this.dataList.length==0){
                                this.mescroll.resetUpScroll() // 刷新列表数据
                            }
                        }
                        this.show = false
                    })
                    .catch( () => {
                        this.loading = false
                    })
                }
                // this.$router.push({path:'/ticketdetail',query:{code:this.value}})
            },
            switch_tab(){
                this.disabled = true
                this.dataList = []// 在这里手动置空列表,可显示加载中的请求进度
               
                this.tab=[]
                if(this.type==1){
                    window.document.title = "黄金订单";  
                    this.type=2
                    this.tabs()      
                }else{
                    window.document.title = "商城订单";                      
                    this.type=1
                    this.tabs()      
                }           
                sessionStorage.setItem('order_type',this.type)                     
            },
            onClick(index, title) {
                this.status = this.tab[index] && this.tab[index].id || ''
                this.dataList = []// 在这里手动置空列表,可显示加载中的请求进度
                this.mescroll.resetUpScroll() // 刷新列表数据
            },
            // mescroll组件初始化的回调,可获取到mescroll对象 (如果this.mescroll并没有使用到,可不用写mescrollInit)
            mescrollInit (mescroll) {
                this.mescroll = mescroll
            },
            // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
            upCallback (page, mescroll) {
                // 联网请求
                if(!sessionStorage.getItem('store_id')){
                    this.$router.push('/store')
                    return
                }
                if(this.type==1){
                    this.$axios('order_storeorder_storeuserorderlistbypage',{storeId:sessionStorage.getItem('store_id'),status:this.status,index:page.num,size:page.size})
                    .then((data) => {
                        this.disabled = false
                        // 请求的列表数据
                        let arr = data.result
                        // 如果是第一页需手动制空列表
                        if (page.num === 1) this.dataList = []
                        // 把请求到的数据添加到列表
                        arr.forEach( item => {
                            item.loading = false
                            item.disabled = false
                        })
                        this.dataList = this.dataList.concat(arr)
                        // 数据渲染成功后,隐藏下拉刷新的状态
                        this.$nextTick(() => {
                            mescroll.endSuccess(arr.length)
                        })
                    }).catch(() => {
                        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                        mescroll.endErr()
                    })
                }
                if( this.type == 2){
                    this.$axios('order_storeorder_storegoldorderlistbypage',{storeId:sessionStorage.getItem('store_id'),status:this.status,index:page.num,size:page.size})
                    .then((data) => {
                        this.disabled = false
                        // 请求的列表数据
                        let arr = data.result
                        // 如果是第一页需手动制空列表
                        if (page.num === 1) this.dataList = []
                        arr.forEach( item => {
                            item.loading = false
                            item.disabled = false
                        })
                        // 把请求到的数据添加到列表
                        this.dataList = this.dataList.concat(arr)
                        // 数据渲染成功后,隐藏下拉刷新的状态
                        this.$nextTick(() => {
                            mescroll.endSuccess(arr.length)
                        })
                    }).catch(() => {
                        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                        mescroll.endErr()
                    })
                }                
            },
            tabs(){
                this.$axios('order_storeorder_storeorderstatus',this.type)
                .then( data => {    
                    this.dataList = []    
                    if(this.type==1){
                        data.result.forEach( item => {
                            this.tab.unshift(item)
                            if(item.simplify=='user_order_finish'){
                                this.complete = item.id
                            }
                            if(item.simplify=='user_order_extract'){
                                this.lift = item.id
                            }
                        })
                        this.tab.unshift({title:'全部'})
                        this.status = this.tab[this.active] && this.tab[this.active].id || ''
                        this.mescroll.resetUpScroll() // 刷新列表数据
                    }
                    if(this.type==2){
                        data.result.forEach( item => {
                            this.tab.unshift(item)
                            if(item.simplify=='gold_delivery_order_finish'){
                                this.complete = item.id
                            }
                            if(item.simplify=='gold_delivery_order_extract'){
                                this.lift = item.id
                            }
                        })
                        this.tab.unshift({title:'全部'}) 
                        this.status = this.tab[this.active] && this.tab[this.active].id || '' 
                        this.mescroll.resetUpScroll() // 刷新列表数据                     
                    }                      
                })
                .catch((err)=>{
                    Toast({message:err.msg,duration:2000})
                })
            },
            hx(item,index){
                this.value = ''
                this.show = true
                this.click_index = index
                this.click_order_id = this.dataList && this.dataList[index] && this.dataList[index].id
            },
            onInput(key) {
                this.value = (this.value + key).slice(0, 6);
            },
            onDelete() {
                this.value = this.value.slice(0, this.value.length - 1);
            }
        },
        created(){
            if(!sessionStorage.getItem('store_id')){
                this.$router.push('/store')
                return
            }
            window.document.title = sessionStorage.order_type==1?'商城订单':sessionStorage.order_type==2?'黄金订单':'商城订单';   
            this.tabs()
        }
    }
</script>

<style scoped lang="less">
p{
    margin: 0;
    padding: 0;
}
.order_list{
    /deep/.van-tabs{
        .van-tabs__wrap{
            height: 88px;
            position: fixed;
            top: 0;
            z-index: 1;
            background: #fff;
            .van-tabs__nav{
                width: 60%;
                .van-tabs__line{
                    bottom: 40px;
                    background: #f6ab0d;
                }
                .van-tab{
                    padding: 0;
                    color:#000;
                }
            }
        }
    }
    .mescroll{
        position: absolute;
        top: 88px;
        bottom: 100px;
        height: auto;
        &>div{
            .list{
                margin: 20px 22px 0;                             
                li{
                    padding: 32px 22px 38px;
                    margin-bottom: 20px;
                    border-radius: 10px;
                    .top{
                        padding-bottom: 36px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .content{
                        display: flex;
                        padding-bottom: 37px;
                        .img{
                            width: 170px;
                            height: 170px;
                            border-radius: 10px;
                            margin-right: 22px;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .right{
                            display: flex;
                            flex-flow: column;
                            justify-content: space-between;
                            flex: 1;
                            p{
                                text-align: left;
                            }
                            &>p:nth-of-type(1){
                                line-height: 1.5;
                                min-height: 80px;
                            }

                            .specifications{
                                display: flex;
                                justify-content: space-between;
                                &>div{
                                    display: flex;
                                }
                            }
                        }
                    }
                    .money{
                        text-align: right;
                        padding-bottom: 32px;
                    }
                    button{
                        width: 182px;
                        height: 66px;
                        border:2px solid #ababab;
                        background: transparent;
                        border-radius: 66px;
                        margin-left: calc(100% - 182px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        span{
                            line-height: normal;
                        }
                    }
                }
            }
            .gold_list{
                margin: 20px 22px 0;     
                li{
                    padding: 32px 0 0;
                    margin-bottom: 20px;
                    border-radius: 10px;
                    .top{
                        padding: 0 22px 36px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    &>p{
                        padding-left: 22px;
                        padding-right: 22px;
                        text-align: left;
                    }
                    &>p:nth-of-type(1){
                        padding-bottom: 24px;
                    }
                    &>p:nth-of-type(2){
                        padding-bottom: 48px;
                        border-bottom: 2px solid #e3e3e3;
                    }
                    /deep/.btn{
                        padding: 22px 0;
                        height: 66px;
                        button{
                            width: 182px;
                            height: 66px;
                            border:2px solid #ababab;
                            background: transparent;
                            border-radius: 66px;
                            margin-left: calc(100% - 204px);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            span{
                                line-height: normal;
                            }
                        }
                    }
                }
            }
            #noList{
                /deep/.mescroll-empty{
                    img{
                        width: 246px;
                        height: 191px;
                    }
                    .empty-tip{
                        margin: 0;
                        padding-top: 30px;
                    }
                }
            }
        }
        /deep/.mescroll-upwarp{
            padding: 0;
            .upwarp-nodata{
                margin: 0;
            }
        }
    }
    .switch{
        border: none;
        position: fixed;
        top: 0;
        background: #f6ab0d;
        z-index: 2;
        right: 0;
        height: 88px;
        display: flex;
        align-items: center;
        padding: 0 22px;
        img{
            width: 30px;
            margin-right: 13px;
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
                    input::placeholder{
                        color: #ababab;
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