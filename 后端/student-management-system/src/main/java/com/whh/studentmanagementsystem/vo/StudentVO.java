package com.whh.studentmanagementsystem.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class StudentVO {
    private Long id;               // 主键ID

    private String studentId;      // 学号

    private String name;           // 姓名

    private String gender;         // 性别

    private Long classId;          // 班级ID

    private String phone;          // 电话

    private String email;          // 邮箱

    private String status;         // 状态

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    private Date enrollDate;     // 入学日期

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime lastUpdateTime; // 最近更新时间
}
