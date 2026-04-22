package com.whh.studentmanagementsystem.util;

import lombok.Data;

/**
 * API响应通用格式
 */
@Data
public class Result<T> {
    /**
     * 状态码：1-成功，其他-失败
     */
    private int code;

    /**
     * 提示信息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    private Result(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 成功响应
     */
    public static <T> Result<T> success(T data) {
        return new Result<T>(1, "success", data);
    }

    /**
     * 失败响应
     */
    public static <T> Result<T> error(String message) {
        return new Result<T>(0, message, null);
    }

    /**
     * 失败响应（带状态码）
     */
    public static <T> Result<T> error(int code, String message) {
        return new Result<T>(code, message, null);
    }
}
