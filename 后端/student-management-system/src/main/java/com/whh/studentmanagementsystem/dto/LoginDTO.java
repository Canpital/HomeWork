package com.whh.studentmanagementsystem.dto;

import lombok.Data;

@Data
public class LoginDTO {
    private String username; // 登录用户名

    private String password; // 登录密码
}