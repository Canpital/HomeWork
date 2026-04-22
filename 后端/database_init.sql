-- 创建数据库
CREATE DATABASE IF NOT EXISTS student_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE student_management;

-- 创建管理员表
CREATE TABLE IF NOT EXISTS admin (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- 创建学生表
CREATE TABLE IF NOT EXISTS student (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    birth_date DATE,
    class_id BIGINT,
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    enrollment_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入初始管理员数据
INSERT INTO admin (username, password) VALUES ('admin', '123456');

-- 插入示例学生数据
INSERT INTO student (student_id, name, gender, birth_date, class_id, phone, email, address, status, enrollment_date) VALUES
('2023001', '张三', '男', '2005-01-01', 1, '13800138001', 'zhangsan@example.com', '北京市海淀区', '在读', '2023-09-01'),
('2023002', '李四', '女', '2005-02-02', 1, '13800138002', 'lisi@example.com', '北京市朝阳区', '在读', '2023-09-01'),
('2023003', '王五', '男', '2005-03-03', 2, '13800138003', 'wangwu@example.com', '上海市浦东新区', '在读', '2023-09-01');
