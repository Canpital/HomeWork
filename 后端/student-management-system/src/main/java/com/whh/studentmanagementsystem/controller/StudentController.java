package com.whh.studentmanagementsystem.controller;

import com.whh.studentmanagementsystem.dto.StudentPageQuery;
import com.whh.studentmanagementsystem.pojo.Student;
import com.whh.studentmanagementsystem.service.IStudentService;
import com.whh.studentmanagementsystem.util.PageResult;
import com.whh.studentmanagementsystem.util.Result;
import com.whh.studentmanagementsystem.vo.StudentVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author whh
 * @since 2025-09-08
 */
@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
@Slf4j
public class StudentController {
    private final IStudentService studentService;

    /**
     * 分页查询
     *
     * @param studentPageQuery
     * @return
     */
    @GetMapping
    public Result<PageResult<StudentVO>> Page(StudentPageQuery studentPageQuery) {
        log.info("分页查询参数：{}", studentPageQuery);
        PageResult pageResult = studentService.getStudentPage(studentPageQuery);
        return Result.success(pageResult);
    }

    /**
     * 根据id删除学生信息
     *
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Long id) {
        log.info("根据id删除学生信息:{}", id);
        boolean b = studentService.removeById(id);
        return Result.success(b);
    }

    /**
     * 更新学生信息
     *
     * @param student
     * @return
     */
    @PutMapping
    public Result update(@RequestBody Student student) {
        log.info("更新学生信息:{}", student);
        boolean b = studentService.updateStudent(student);
        return Result.success(b);
    }

    /**
     * 添加学生信息
     *
     * @param student
     * @return
     */
    @PostMapping
    public Result save(@RequestBody Student student) {
        log.info("添加学生信息:{}", student);
        boolean b = studentService.addStudent(student);
        return Result.success(b);
    }

    /**
     * 根据id查询信息（查询回显）
     *
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<Student> getById(@PathVariable Long id){
        log.info("跟据id查询信息：{}",id);
        return Result.success(studentService.getById(id));
    }

}
