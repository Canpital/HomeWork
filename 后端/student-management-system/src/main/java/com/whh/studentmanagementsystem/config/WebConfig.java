package com.whh.studentmanagementsystem.config;

import com.whh.studentmanagementsystem.intercepter.MyInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    //自定义的拦截器对象
    @Autowired
    private MyInterceptor myInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //注册自定义拦截器对象
        registry.addInterceptor(myInterceptor)
                .addPathPatterns("/**") //设置拦截器拦截的请求路径（ /** 表示拦截所有请求）
                .excludePathPatterns("/admin/login"); //排除登录接口不被拦截
    }
}
