<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar 
      class="page-nav-bar" 
      title="登入">
       <van-icon  slot="left" 
       name="cross" 
       size="18" 
       @click="$router.back()"
       />
    </van-nav-bar>
    <!-- 导航栏 -->
    <!-- 登入表单 -->
    <!-- 
      表单验证：
        1、给 van-field 组件配置 rules 验证规则
          参考文档：https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2、当表单提交的时候会自动触发表单验证
           如果验证通过，会触发 submit 事件
           如果验证失败，不会触发 submit
     -->
    <van-form @submit="onSubmit" ref="loginForm">
      <!-- type 定义数据类型 maxlength 最大可输入 placeholder 提示的 rules规则-->
      <van-field v-model="user.mobile" 
      name="mobile"
       placeholder="请输入手机号"
      :rules="userFormRules.mobile" 
      type="number"
      maxlength="11">
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field v-model="user.code" 
      name="code" 
      placeholder="请输入验证码"
      :rules="userFormRules.code"
       type="number" 
       maxlength="6"
       >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- 
            time 倒计时时间
           -->
          <van-count-down 
          v-if="isCountDownShow"
          :time="1000*60" 
          format="ss s"
          @finish='isCountDownShow = false' 
          />
          <!-- native-type="button 验证码按钮不会触发提交表单事件 -->
          <van-button 
          v-else
          class="send-sms-btn" 
          native-type="button"
          round 
          size="small" 
          type="default"
          @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" 
        block type="info"
         native-type="submit"
          >登入</van-button
        >
      </div>
    </van-form>
    <!-- 登入表单 -->
  </div>
</template>

<script>
import { login,sendSms } from '@/api/user'
export default {
  name: "loginIndex",
  components: {},
  props: {},
  data() {
    return { 
      isCountDownShow: false, //是否展示倒计时
      user: {
        mobile: '',
        code: ''
      },
      userFormRules:{
        mobile: [{
        required: true, 
        message: '手机号码不能为空'
        },
        {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{ 
         required: true,
         message: '验证码不能为空' 
         },
         {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
         }]
      }
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证
      
      // 在组件中必须通过this.$toast 来调用 Toast 组件
      this.$toast.loading({
        message: '登入中...',
        forbidClick: true, //禁用背景点击
        duration: 0 //持续时间，默认两秒 如果为0则持续展示
      });
      // 3.提交表单，请求登入
       try {
        const { data } = await login(user)
        this.$store.commit('setUser',data.data)
        
        // 新toast被调用，之前的会被关闭
        this.$toast.success('登入成功') 

        // 登入成功，跳转回原来页面
        // back方式不严谨，后面讲功能优化在说 
        this.$router.back()
        } catch (err) {
          if (err.response.status === 400) {
     	    console.log('手机号或者验证码错误',)
          this.$toast.fail('手机号或验证码错误')
        } else {
          console.log('登入失败,请稍后重试', err);
        }
          }
      // 4.根据请求响应结果处理后续操作
    },
    async onSendSms () {
      // 1.校验手机号码
      try {
       await this.$refs.loginForm.validate('mobile')
       console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }
      
      // 2.验证通过，显示倒计时
      this.isCountDownShow = true
      // 3.请求发生验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了,请稍后重试')
        } else {
          this.$toast('发送失败,请稍后重试')
        }
      }
    }
  }
}
</script>

  <style scoped lang='less'>
.login-container {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    width: 162px;
    height: 60px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
