package com.whh.studentmanagementsystem.service;

import com.whh.studentmanagementsystem.dto.LoginDTO;
import com.whh.studentmanagementsystem.pojo.Admin;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 管理员信息表（用于登录验证） 服务类
 * </p>
 *
 * @author whh
 * @since 2025-09-09
 */
public interface IAdminService extends IService<Admin> {

    boolean login(LoginDTO loginDTO);

}
