package com.whh.studentmanagementsystem.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.whh.studentmanagementsystem.dto.StudentPageQuery;
import com.whh.studentmanagementsystem.pojo.Student;
import com.whh.studentmanagementsystem.mapper.StudentMapper;
import com.whh.studentmanagementsystem.service.IStudentService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.whh.studentmanagementsystem.util.PageResult;
import com.whh.studentmanagementsystem.vo.StudentVO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author whh
 * @since 2025-09-08
 */
@Service
public class StudentServiceImpl extends ServiceImpl<StudentMapper, Student> implements IStudentService {

    @Override
    public PageResult<StudentVO> getStudentPage(StudentPageQuery studentPageQuery) {
        // 构造page对象
        Page<Student> page = new Page<>(
                studentPageQuery.getPageNum(),  // 当前页码
                studentPageQuery.getPageSize()  // 每页条数
        );

        IPage<Student> studentPage = lambdaQuery()
                .like(studentPageQuery.getStudentId() != null,
                        Student::getStudentId, studentPageQuery.getStudentId())
                .like(studentPageQuery.getName() != null,
                        Student::getName, studentPageQuery.getName())
                .eq(studentPageQuery.getClassId() != null,
                        Student::getClassId, studentPageQuery.getClassId())
                .orderByDesc(Student::getUpdatedAt) // 按照更新时间降序排序
                .page(page); // page()方法需要传入page对象

        // 转化为vo对象
        List<Student> list = studentPage.getRecords().stream().collect(Collectors.toList());
        List<StudentVO> voList = new ArrayList<>();

        for (Student student : list) {
            StudentVO studentVO = new StudentVO();
            BeanUtils.copyProperties(student, studentVO);
            studentVO.setEnrollDate(student.getEnrollmentDate());
            studentVO.setLastUpdateTime(student.getUpdatedAt());

            voList.add(studentVO);
        }

        // 修复：使用正确的构造函数参数（移除多余的totalPages参数）
        return new PageResult<>(
                voList,        // list: 数据列表
                studentPageQuery.getPageNum(),   // pageNum: 当前页码
                studentPageQuery.getPageSize(),  // pageSize: 每页大小
                (int) studentPage.getTotal()     // total: 总记录数
        );

    }

    @Override
    public boolean updateStudent(Student student) {
        student.setUpdatedAt(LocalDateTime.now());
        return updateById(student);
    }

    @Override
    public boolean addStudent(Student student) {
        LocalDateTime now = LocalDateTime.now();
        student.setUpdatedAt(now);
        student.setCreatedAt(now);
        return save(student);
    }
}
