package com.whh.studentmanagementsystem.service;

import com.whh.studentmanagementsystem.dto.StudentPageQuery;
import com.whh.studentmanagementsystem.pojo.Student;
import com.baomidou.mybatisplus.extension.service.IService;
import com.whh.studentmanagementsystem.util.PageResult;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author whh
 * @since 2025-09-08
 */
public interface IStudentService extends IService<Student> {

    PageResult getStudentPage(StudentPageQuery studentPageQuery);

    boolean updateStudent(Student student);

    boolean addStudent(Student student);
}
