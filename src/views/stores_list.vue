<template>
    <ul class="stores">
        <li v-if="flag==false" v-for="(item, index) in list" :key="index" class="bg_white stores_list" @click="choose_store(item.id)">
            <p class="text_size_32">{{item.name}}</p>
            <p class="text_size_26 color_gray">门店地址：{{item.address}}</p>
        </li>
        <li class="no_store" v-if="flag==true">
            <div class="img">
                <img src="@/assets/images/no_store.png" alt="">
            </div>
            <p class="text_size_32">门店为空</p>
        </li>
    </ul>
</template>

<script>
import { Toast } from 'vant';
    export default {
        data(){
            return{
                list:[],
                flag:true
            }
        },
        created(){
            Toast.loading({
                mask: true,
                message: '加载中...'
            })
            this.$axios('center_other_storelistbycurrent')
            .then(data => {
                Toast.clear()
                if(data.result.length==0){
                    this.flag = true
                }else{
                    this.flag = false
                    data.result.forEach(item => {
                        this.list.push(item)
                    })
                }
                
            })
            .catch(()=>{
                Toast.clear()
            })
        },
        methods:{
            choose_store(id){
                sessionStorage.setItem('store_id',id)
                if(this.$route.query.redirect){
                    this.$router.push(this.$route.query.redirect)
                }else{
                    this.$router.push('/')
                }
                
            }
        }
    }
</script>

<style scoped lang="less">
p{
    padding: 0;
    margin: 0;
    text-align: left;
}
.stores{
    padding: 20px;
    .stores_list{
        border-radius: 10px;
        padding: 38px 31px 37px;
        margin-bottom: 20px;
        p:nth-of-type(1){
            padding-bottom: 19px;
        }
    }
    .stores_list:last-child{
        margin-bottom: 0;
    }
    .no_store{
        height: calc(100vh - 40px);
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        .img{
            width: 146px;
            height: 127px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        p{
            padding-top: 20px;
        }
    }
}
</style>