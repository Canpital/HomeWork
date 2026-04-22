package com.whh.studentmanagementsystem.util;

import lombok.Data;
import java.util.List;

/**
 * 分页查询结果
 */
@Data
public class PageResult<T> {
    /**
     * 数据列表
     */
    private List<T> list;

    /**
     * 当前页码
     */
    private Integer pageNum;

    /**
     * 每页条数
     */
    private Integer pageSize;

    /**
     * 总记录数
     */
    private Integer total;

    /**
     * 总页数
     */
    private Integer totalPages;

    public PageResult(List<T> list, Integer pageNum, Integer pageSize, Integer total) {
        this.list = list;
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        this.total = total;
        this.totalPages = (total + pageSize - 1) / pageSize;
    }
}
