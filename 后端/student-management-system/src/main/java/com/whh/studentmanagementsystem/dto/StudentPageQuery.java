package com.whh.studentmanagementsystem.dto;

import lombok.Data;

/**
 * 学生查询请求参数
 */
@Data
public class StudentPageQuery {
    /**
     * 页码，默认1
     */
    private Integer pageNum = 1;

    /**
     * 每页条数，默认10
     */
    private Integer pageSize = 10;

    /**
     * 学生姓名（模糊查询）
     */
    private String name;

    /**
     * 学号（模糊查询）
     */
    private String studentId;

    /**
     * 班级ID
     */
    private Long classId;
}
