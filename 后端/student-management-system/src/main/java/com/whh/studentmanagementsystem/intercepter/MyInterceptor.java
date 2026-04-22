package com.whh.studentmanagementsystem.intercepter;

import com.whh.studentmanagementsystem.util.JwtUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

//自定义拦截器
@Component
public class MyInterceptor implements HandlerInterceptor {
    //目标资源方法执行前执行。 返回true：放行    返回false：不放行
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("preHandle .... ");

        //获取请求路径
        String uri = request.getRequestURI();
        System.out.println("请求URI: " + uri);

        //如果是登录请求或静态资源请求，直接放行
        if(uri.contains("/login") || uri.contains("/static/") || uri.endsWith(".html") || uri.endsWith(".css") || uri.endsWith(".js")){
            System.out.println("登录请求或静态资源请求，放行");
            return true;
        }

        //获取请求头中的令牌
        /**
         * 这里令牌并非出现了跨域，或者说是已经被CorsFilter类定义解决了，根据查看前端的请求格式，发现在Authorization中已经有了令牌
         * 具体格式为  ：Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         * 所以再次查看获取请求头的方法，发现是解析方法有问题，所以这里需要重新定义一个方法来解析令牌。。。。
         */
        // 1. 首先从 "token" 请求头获取
        String token = request.getHeader("token");  // 需要在前端自定义储存token格式

        // 2. 如果没有，再从 "Authorization" 请求头获取
        if (token == null || token.isEmpty()) {
            token = request.getHeader("Authorization");  // localStorage.setItem('token', result.data);  应该是默认储存的吧???
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7); // 去掉 "Bearer " 前缀
            }
        }

        // 3. 如果还没有，尝试从请求参数获取
        if (token == null || token.isEmpty()) {
            token = request.getParameter("token"); // 不知道可能会
        }

        //令牌为空，返回错误信息
        if(token == null || token.isEmpty()){
            System.out.println("令牌为空");
            response.setStatus(401);
            response.getWriter().write("{\"code\": 401, \"message\": \"未提供认证令牌\"}");
            return false;
        }

        //解析令牌，如果解析失败，返回错误信息
        try {
            Claims claims = JwtUtils.parseJWT(token);
            System.out.println("令牌解析成功: " + claims);
            //令牌有效，放行
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("令牌已过期: " + e.getMessage());
            response.setStatus(401);
            response.getWriter().write("{\"code\": 401, \"message\": \"登录已过期，请重新登录\"}");
            return false;
        } catch (SignatureException e) {
            System.out.println("令牌签名无效: " + e.getMessage());
            response.setStatus(401);
            response.getWriter().write("{\"code\": 401, \"message\": \"令牌签名无效\"}");
            return false;
        } catch (MalformedJwtException e) {
            System.out.println("令牌格式错误: " + e.getMessage());
            response.setStatus(401);
            response.getWriter().write("{\"code\": 401, \"message\": \"令牌格式错误\"}");
            return false;
        } catch (Exception e) {
            System.out.println("令牌解析异常: " + e.getMessage());
            response.setStatus(401);
            response.getWriter().write("{\"code\": 401, \"message\": \"令牌验证失败\"}");
            return false;
        }
    }
}
