// 用户相关请求模块
import requset from "@/utils/request";
// import store from '@/store' 

export const login = (data) =>{
    return requset({
        method: 'post',
        url: '/v1_0/authorizations',
        data: data
    })
}
//  发送验证码 每分钟一次
export const sendSms = mobile =>{
    return requset({
        method: 'get',
        url: `/v1_0/sms/codes/${mobile}`
    })
}

// 获取用户自己信息
export const getUserInfo = () =>{
    return requset({
        method: 'get',
        url: '/v1_0/user'
        // 发送请求头数据
        // headers: {
        //     // 该接口需要授权token
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}