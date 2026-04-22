package com.whh.studentmanagementsystem.mapper;

import com.whh.studentmanagementsystem.pojo.Admin;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 * 管理员信息表（用于登录验证） Mapper 接口
 * </p>
 *
 * @author whh
 * @since 2025-09-09
 */
@Mapper
public interface AdminMapper extends BaseMapper<Admin> {

}
