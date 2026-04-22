package com.whh.studentmanagementsystem.controller;


import com.whh.studentmanagementsystem.dto.LoginDTO;
import com.whh.studentmanagementsystem.service.IAdminService;
import com.whh.studentmanagementsystem.util.JwtUtils;
import com.whh.studentmanagementsystem.util.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 管理员信息表（用于登录验证） 前端控制器
 * </p>
 *
 * @author whh
 * @since 2025-09-09
 */
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final IAdminService adminService;

    @PostMapping("/login")
    public Result<String> login(@RequestBody LoginDTO loginDTO) {
        boolean loginSuccess = adminService.login(loginDTO);
        if (loginSuccess) {
            // 登录成功，生成JWT令牌
            Map<String, Object> claims = new HashMap<>();
            claims.put("username", loginDTO.getUsername());
            // 可以添加更多用户信息到claims中
            String token = JwtUtils.generateJwt(claims);
            System.out.println("生成的JWT令牌：" + token);
            return Result.success(token);
        } else {
            return Result.error("用户名或密码错误");
        }
    }


}
