import { request } from '@/libs/request'
import { isObject } from 'util'
import store from '@/store/store' //vuex

// 公共方法

//格式化日期
export function formatDate(tap, fmt) {
    var tap = Number(tap)
    if (!tap) {
        return;
    }
    var date = new Date(tap);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};
//转化时间（年月）
export function timestampToTimes(timestamp,a) {
    var timestamp = Number(timestamp)
    if(!timestamp){
        return null
    }
    var date = new Date(timestamp);
    var Y = date.getFullYear() + a;
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
    return Y+M;
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
};

//检查手机号
export function checkPhone(phone) {
    return (/^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\d{8}$/).test(phone)
}

//格式化金额
export function number_format(number, decimals, dec_point, thousands_sep) {
    /*
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * dec_point：小数点符号
    * thousands_sep：千分位符号
    * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

// 密码验证
export function checkPwd(pwd) {
    return (/^[^\u4e00-\u9fa5]{0,}$/).test(pwd)
}

// 获取接口
export function listByAll(b) {
    return store.state.interface && store.state.interface.filter(item => { return item.apiKey == b})[0].link
}

// 获取字典
export function findState(a) {
    return sessionStorage.dictionary && JSON.parse(sessionStorage.dictionary).filter(item => { return item.id == a })[0].simplify
}

export function axios(api, data){   // 传入apiKey和参数
    let url = listByAll(api)
    
    if(!data&&data!="\"\""){
        return request(url)
    }else{
        if(!isObject(data)&&data!="\"\""){
            data = JSON.stringify(data);
        }
        return request({
            url: url,
            data: data
        })
    }
}

