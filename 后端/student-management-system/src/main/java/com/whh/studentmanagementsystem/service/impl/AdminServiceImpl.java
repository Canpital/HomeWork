package com.whh.studentmanagementsystem.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.whh.studentmanagementsystem.dto.LoginDTO;
import com.whh.studentmanagementsystem.pojo.Admin;
import com.whh.studentmanagementsystem.mapper.AdminMapper;
import com.whh.studentmanagementsystem.service.IAdminService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.whh.studentmanagementsystem.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 管理员信息表（用于登录验证） 服务实现类
 * </p>
 *
 * @author whh
 * @since 2025-09-09
 */
@Service
@RequiredArgsConstructor
public class AdminServiceImpl extends ServiceImpl<AdminMapper, Admin> implements IAdminService {

    private final AdminMapper adminMapper;

    @Override
    public boolean login(LoginDTO loginDTO) {
        // 构建查询条件
        QueryWrapper<Admin> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", loginDTO.getUsername()).eq("password", loginDTO.getPassword());

        // 查询用户
        Admin admin = adminMapper.selectOne(queryWrapper);

        // 如果查询到用户，返回true，否则返回false
        return admin != null;
    }

}

