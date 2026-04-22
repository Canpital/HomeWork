/* 将整个脚本包裹在 DOMContentLoaded 事件监听器中，其目的是确保在 HTML 文档完全加载和解析完成后再执行 JavaScript 代码。 */
document.addEventListener("DOMContentLoaded", function () {
  // 页面加载时检查是否存在token，不存在则跳转到登录页
  const token = localStorage.getItem('token');
  if (!token) {
    alert('请先登录');
    window.location.href = '/login/login.html';
    return;
  }

  // 分页相关变量
  let currentPage = 1;
  const pageSize = 10; // 目前前端只设计了十个为一页
  // 获取表格主体元素（用于动态渲染数据）
  const studentTableBody = document.querySelector(".student-table tbody");
  // 获取搜索和重置按钮
  const searchBtn = document.getElementById("searchBtn");
  const resetBtn = document.getElementById("resetBtn");
  
  // 添加分页控件
  const paginationDiv = document.createElement("div");
  paginationDiv.className = "pagination";
  // 分页控件HTML结构：上一页按钮、页码信息、下一页按钮
  paginationDiv.innerHTML = `
    <button id="prevPageBtn" disabled>上一页</button>
    <span id="currentPage">第 <span id="currentPageNum">1</span> 页，共 <span id="totalPagesCount">1</span> 页</span>
    <button id="nextPageBtn">下一页</button>
  `;
  // 将分页控件添加到学生信息区域
  document.querySelector(".student-info").appendChild(paginationDiv);
  
  // 确保分页控件添加后再获取元素引用
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");
  const currentPageNum = document.getElementById("currentPageNum");
  const totalPagesCount = document.getElementById("totalPagesCount");

  /**
   * 获取学生数据
   * @param {number} pageNum - 页码
   * @param {object} filters - 筛选条件（姓名、学号、班级ID）
   */
  function fetchStudents(pageNum = 1, filters = {}) {
    // 解构筛选条件，默认值为空字符串
    const { name = "", studentId = "", classId = "" } = filters;
    // 基础请求URL，包含分页参数
    let url = `http://localhost:8080/students?pageNum=${pageNum}&pageSize=${pageSize}`;
    
    // 添加过滤参数（仅当有值时添加，减少无效参数）
    if (name) url += `&name=${encodeURIComponent(name)}`;
    if (studentId) url += `&studentId=${encodeURIComponent(studentId)}`;
    if (classId) url += `&classId=${encodeURIComponent(classId)}`;

    // 显示加载状态
    showLoading();
    
    // 发起GET请求获取学生数据
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include' // 添加凭证支持
    })
      .then(response => {
        // 处理HTTP错误状态（如404、500等）
        if (!response.ok) {
          if (response.status === 401) {
            // token无效或过期，清除token并跳转到登录页
            localStorage.removeItem('token');
            alert('登录已过期，请重新登录');
            window.location.href = '/login/login.html';
            return;
          }
          throw new Error(`HTTP错误,状态码: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        // 隐藏加载状态
        hideLoading();
        
        // 假设后端返回格式为{code: 1, data: {...}, message: ""}，1表示成功
        if (result.code === 1) {
          // 渲染表格数据
          renderTable(result.data.list);
          // 更新分页信息
          updatePagination(result.data);
        } else {
          // 后端返回业务错误
          showErrorMsg("获取学生数据失败: " + (result.message || "未知错误"));
          console.error("获取学生数据失败:", result.message);
        }
      })
      .catch(error => {
        // 隐藏加载状态
        hideLoading();
        // 网络错误或解析错误
        showErrorMsg("获取数据失败，请检查网络连接或重试");
        console.error("Error fetching students:", error);
      });
  }

  /**
   * 渲染学生表格数据
   * @param {array} students - 学生数据数组
   */
  function renderTable(students) {
    // 清空表格内容
    studentTableBody.innerHTML = "";
    
    // 如果没有数据，显示空状态
    if (students.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="10" style="text-align: center; padding: 20px;">暂无学生数据</td>`;
      studentTableBody.appendChild(emptyRow);
      return;
    }
    
    // 遍历学生数据，生成表格行
    students.forEach(student => {
      const row = document.createElement("tr");
      // 格式化日期显示（假设后端返回的是ISO格式日期）
      const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString() : "";
      };
      
      row.innerHTML = `
        <td>${student.studentId || ""}</td>
        <td>${student.name || ""}</td>
        <td>${student.gender || ""}</td>
        <td>${student.classId || ""}</td>
        <td>${student.phone || ""}</td>
        <td>${student.email || ""}</td>
        <td>
          <span class="status-tag ${getStatusClass(student.status)}">${student.status || ""}</span>
        </td>
        <td>${formatDate(student.enrollDate)}</td>
        <td>${student.lastUpdateTime ? new Date(student.lastUpdateTime).toLocaleString() : ""}</td>
        <td>
          <button class="edit-btn" data-id="${student.id}">编辑</button>
          <button class="delete-btn" data-id="${student.id}">删除</button>
        </td>
      `;
      studentTableBody.appendChild(row);
    });
    
    // 为所有编辑按钮添加事件监听器
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', function() {
        const studentId = this.getAttribute('data-id');
        editStudent(studentId);
      });
    });
    
    // 为所有删除按钮添加事件监听器
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', function() {
        const studentId = this.getAttribute('data-id');
        // 获取当前行的学生姓名（第二列）
        const studentName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
        confirmDelete(studentId, studentName);
      });
    });
  }

  /**
   * 根据学生状态返回对应的CSS类（用于样式区分）
   * @param {string} status - 学生状态（在读/休学/退学）
   * @returns {string} CSS类名
   */
  function getStatusClass(status) {
    switch(status) {
      case "在读": return "status-active";
      case "休学": return "status-paused";
      case "退学": return "status-inactive";
      default: return "";
    }
  }

  /**
   * 更新分页信息
   * @param {object} data - 分页数据（包含页码、总页数等）
   */
  function updatePagination(data) {
    currentPage = data.pageNum;
    currentPageNum.textContent = currentPage;
    totalPagesCount.textContent = data.totalPages;
    
    // 更新上一页/下一页按钮状态（第一页禁用上一页，最后一页禁用下一页）
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === data.totalPages;
  }

  /**
   * 显示加载提示
   */
  function showLoading() {
    // 检查是否已存在加载元素
    let loadingElement = document.querySelector(".loading-indicator");
    if (!loadingElement) {
      loadingElement = document.createElement("div");
      loadingElement.className = "loading-indicator";
      loadingElement.innerHTML = "加载中...";
      document.querySelector(".student-info").appendChild(loadingElement);
    }
    loadingElement.style.display = "block";
  }

  /**
   * 隐藏加载提示
   */
  function hideLoading() {
    const loadingElement = document.querySelector(".loading-indicator");
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  }

  /**
   * 显示错误提示消息
   * @param {string} message - 错误消息内容
   */
  function showErrorMsg(message) {
    // 检查是否已存在错误元素
    let errorElement = document.querySelector(".error-message");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "error-message";
      document.querySelector(".student-info").prepend(errorElement);
    }
    errorElement.textContent = message;
    errorElement.style.display = "block";
    
    // 3秒后自动隐藏错误消息
    setTimeout(() => {
      errorElement.style.display = "none";
    }, 3000);
  }

  // 搜索按钮点击事件
  searchBtn.addEventListener("click", () => {
    // 获取搜索框的值（去除首尾空格）
    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const classId = document.getElementById("classId").value.trim();
    
    // 重置到第一页，使用新的筛选条件获取数据
    fetchStudents(1, { name, studentId, classId });
  });

  // 重置按钮点击事件
  resetBtn.addEventListener("click", () => {
    // 清空所有搜索框
    document.getElementById("name").value = "";
    document.getElementById("studentId").value = "";
    document.getElementById("classId").value = "";
    // 重置到第一页，不使用筛选条件
    fetchStudents(1);
  });

  // 上一页按钮点击事件
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      // 获取当前的筛选条件
      const name = document.getElementById("name").value.trim();
      const studentId = document.getElementById("studentId").value.trim();
      const classId = document.getElementById("classId").value.trim();
      // 加载上一页数据
      fetchStudents(currentPage - 1, { name, studentId, classId });
    }
  });

  // 下一页按钮点击事件
  nextPageBtn.addEventListener("click", () => {
    // 获取当前的筛选条件
    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const classId = document.getElementById("classId").value.trim();
    // 加载下一页数据
    fetchStudents(currentPage + 1, { name, studentId, classId });
  });

  // 退出按钮点击事件
  document.getElementById('logoutBtn').addEventListener('click', function () {
    // 确认退出
    if (confirm('确定要退出系统吗？')) {
      // 清除本地存储的token
      localStorage.removeItem('token');
      alert('退出成功，即将返回登录页');
      window.location.href = '/login/login.html';
    }
  });

  // 添加学生模态框相关元素
  const modal = document.getElementById("addStudentModal");
  const addStudentBtn = document.getElementById("addStudentBtn");
  const spanClose = document.querySelector("#addStudentModal .close");
  const cancelAddStudentBtn = document.getElementById("cancelAddStudent");
  const addStudentForm = document.getElementById("addStudentForm");

  /**
   * 编辑学生信息
   * @param {string} studentId - 学生ID
   */
  function editStudent(studentId) {
    // 显示加载状态
    showLoading();
    
    // 发送请求获取学生详细信息
    fetch(`http://localhost:8080/students/${studentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include' // 添加凭证支持
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            // token无效或过期，清除token并跳转到登录页
            localStorage.removeItem('token');
            alert('登录已过期，请重新登录');
            window.location.href = '/login/login.html';
            return;
          }
          throw new Error(`获取学生详情失败，状态码: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        // 隐藏加载状态
        hideLoading();
        
        if (result.code === 1) {
          const student = result.data;
          
          // 设置模态框为编辑模式
          document.getElementById("modalTitle").textContent = "编辑学生信息";
          document.getElementById("saveStudentBtn").textContent = "更新";
          document.getElementById("studentIdHidden").value = student.id;
          
          // 填充表单数据（处理可能的空值）
          document.getElementById("modalStudentId").value = student.studentId || '';
          document.getElementById("modalName").value = student.name || '';
          document.getElementById("modalGender").value = student.gender || '';
          // 日期字段格式化（后端可能返回Json格式，需转换为input日期控件支持的格式）
          document.getElementById("modalBirthDate").value = student.birthDate ? new Date(student.birthDate).toISOString().split('T')[0] : '';
          document.getElementById("modalClassId").value = student.classId || '';
          document.getElementById("modalPhone").value = student.phone || '';
          document.getElementById("modalEmail").value = student.email || '';
          document.getElementById("modalAddress").value = student.address || '';
          document.getElementById("modalStatus").value = student.status || '在读'; // 默认值为在读
          document.getElementById("modalEnrollmentDate").value = student.enrollmentDate ? new Date(student.enrollmentDate).toISOString().split('T')[0] : '';
          
          // 显示模态框
          document.getElementById("addStudentModal").style.display = "block";
        } else {
          alert('获取学生信息失败: ' + (result.message || "未知错误"));
        }
      })
      .catch(error => {
        hideLoading();
        console.error('Error fetching student details:', error);
        alert('获取学生信息时发生错误，请重试');
      });
  }

  /**
   * 重置模态框状态（用于切换添加/编辑模式）
   */
  function resetModal() {
    document.getElementById("modalTitle").textContent = "添加学生信息";
    document.getElementById("saveStudentBtn").textContent = "保存";
    document.getElementById("studentIdHidden").value = "";
    // 重置表单
    addStudentForm.reset();
    // 清除表单验证错误提示
    clearFormErrors();
  }

  /**
   * 清除表单验证错误提示
   */
  function clearFormErrors() {
    const errorElements = document.querySelectorAll(".form-error");
    errorElements.forEach(el => el.remove());
  }

  /**
   * 显示表单验证错误
   * @param {string} fieldId - 表单字段ID
   * @param {string} message - 错误消息
   */
  function showFormError(fieldId, message) {
    // 先移除该字段已有的错误提示
    const existingError = document.querySelector(`#${fieldId}-error`);
    if (existingError) existingError.remove();
    
    // 创建新的错误提示元素
    const errorElement = document.createElement("div");
    errorElement.id = `${fieldId}-error`;
    errorElement.className = "form-error";
    errorElement.textContent = message;
    errorElement.style.color = "red";
    errorElement.style.fontSize = "12px";
    errorElement.style.marginTop = "5px";
    
    // 将错误提示添加到对应字段下方
    const fieldElement = document.getElementById(fieldId);
    fieldElement.parentNode.appendChild(errorElement);
  }

  /**
   * 验证表单数据
   * @returns {boolean} 是否验证通过
   */
  function validateForm() {
    // 清除之前的错误提示
    clearFormErrors();
    let isValid = true;
    
    // 验证学号（必填）
    const studentId = document.getElementById("modalStudentId").value.trim();
    if (!studentId) {
      showFormError("modalStudentId", "学号不能为空");
      isValid = false;
    } else if (!/^\d+$/.test(studentId)) { // 简单验证：仅数字
      showFormError("modalStudentId", "学号只能包含数字");
      isValid = false;
    }
    
    // 验证姓名（必填）
    const name = document.getElementById("modalName").value.trim();
    if (!name) {
      showFormError("modalName", "姓名不能为空");
      isValid = false;
    }
    
    // 验证班级ID（必填）
    const classId = document.getElementById("modalClassId").value.trim();
    if (!classId) {
      showFormError("modalClassId", "班级ID不能为空");
      isValid = false;
    }
    
    // 验证性别（必填）
    const gender = document.getElementById("modalGender").value;
    if (!gender) {
      showFormError("modalGender", "请选择性别");
      isValid = false;
    }
    
    // 验证电话（可选，但有值时需符合格式）
    const phone = document.getElementById("modalPhone").value.trim();
    if (phone && !/^1[3-9]\d{9}$/.test(phone)) { // 简单的手机号验证
      showFormError("modalPhone", "请输入有效的手机号码");
      isValid = false;
    }
    
    // 验证邮箱（可选，但有值时需符合格式）
    const email = document.getElementById("modalEmail").value.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormError("modalEmail", "请输入有效的邮箱地址");
      isValid = false;
    }
    
    return isValid;
  }

  // 打开添加学生模态框
  addStudentBtn.addEventListener("click", function() {
    resetModal();
    document.getElementById("addStudentModal").style.display = "block";
  });

  // 关闭模态框（右上角X按钮）
  spanClose.addEventListener("click", function() {
    document.getElementById("addStudentModal").style.display = "none";
    resetModal();
  });

  // 取消按钮点击事件
  cancelAddStudentBtn.addEventListener("click", function() {
    document.getElementById("addStudentModal").style.display = "none";
    resetModal();
  });

  // 点击模态框外部关闭
  window.addEventListener("click", function(event) {
    if (event.target == modal) {
      document.getElementById("addStudentModal").style.display = "none";
      resetModal();
    }
  });

  // 处理表单提交（添加/编辑学生）
  addStudentForm.addEventListener("submit", function(e) {
    e.preventDefault(); // 阻止表单默认提交行为
    
    // 表单验证
    if (!validateForm()) {
      return; // 验证失败则不提交
    }
    
    // 收集表单数据
    const studentData = {
      studentId: document.getElementById("modalStudentId").value.trim(),
      name: document.getElementById("modalName").value.trim(),
      gender: document.getElementById("modalGender").value,
      birthDate: document.getElementById("modalBirthDate").value,
      classId: document.getElementById("modalClassId").value.trim(),
      phone: document.getElementById("modalPhone").value.trim(),
      email: document.getElementById("modalEmail").value.trim(),
      address: document.getElementById("modalAddress").value.trim(),
      status: document.getElementById("modalStatus").value,
      enrollmentDate: document.getElementById("modalEnrollmentDate").value
    };
    
    // 获取隐藏的学生ID（编辑模式时存在）
    const studentId = document.getElementById("studentIdHidden").value;
    
    // 确定请求方法和URL
    let method = 'POST';
    let url = 'http://localhost:8080/students';
    
    if (studentId) {
      // 编辑模式：使用PUT方法，添加ID
      method = 'PUT';
      url = `http://localhost:8080/students`;
      studentData.id = studentId;
    }
    
    // 显示加载状态
    showLoading();
    
    // 发送请求
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include', // 添加凭证支持
      body: JSON.stringify(studentData)
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          // token无效或过期，清除token并跳转到登录页
          localStorage.removeItem('token');
          alert('登录已过期，请重新登录');
          window.location.href = '/login/login.html';
          return;
        }
        throw new Error(`提交失败，状态码: ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      // 隐藏加载状态
      hideLoading();
      
      // 根据是否运用到studentId判断是更新还是新增
      if (result.code === 1) {
        const message = studentId ? '学生信息更新成功' : '学生信息添加成功';
        alert(message);
        // 关闭模态框
        document.getElementById("addStudentModal").style.display = "none";
        // 重新加载当前页数据
        fetchStudents(currentPage);
        // 重置表单和模态框状态
        resetModal();
      } else {
        alert((studentId ? '更新' : '添加') + '失败: ' + (result.message || "未知错误"));
      }
    })
    .catch(error => {
      hideLoading();
      console.error('Error saving student:', error);
      alert((studentId ? '更新' : '添加') + '学生信息时发生错误，请重试');
    });
  });

  // 删除功能相关元素
  const deleteConfirmModal = document.getElementById("deleteConfirmModal");
  const deleteConfirmClose = document.querySelector("#deleteConfirmModal .close");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const deleteStudentName = document.getElementById("deleteStudentName");

  // 当前要删除的学生ID
  let currentDeleteId = null;

  /**
   * 显示删除确认对话框
   * @param {string} studentId - 学生ID
   * @param {string} studentName - 学生姓名
   */
  function confirmDelete(studentId, studentName) {
    currentDeleteId = studentId;
    deleteStudentName.textContent = studentName;
    deleteConfirmModal.style.display = "block";
  }

  /**
   * 关闭删除确认对话框
   */
  function closeDeleteModal() {
    deleteConfirmModal.style.display = "none";
    currentDeleteId = null; // 重置当前删除ID
  }

  // 删除确认对话框关闭按钮（右上角X）
  deleteConfirmClose.addEventListener("click", closeDeleteModal);

  // 取消删除按钮
  cancelDeleteBtn.addEventListener("click", closeDeleteModal);

  // 点击对话框外部关闭
  window.addEventListener("click", function(event) {
    if (event.target == deleteConfirmModal) {
      closeDeleteModal();
    }
  });

  // 确认删除按钮点击事件
  confirmDeleteBtn.addEventListener("click", function() {
    if (currentDeleteId) {
      // 显示加载状态
      showLoading();
      
      // 发送删除请求
      fetch(`http://localhost:8080/students/${currentDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include' // 添加凭证支持
      })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            // token无效或过期，清除token并跳转到登录页
            localStorage.removeItem('token');
            alert('登录已过期，请重新登录');
            window.location.href = '/login/login.html';
            return;
          }
          throw new Error(`删除失败，状态码: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        hideLoading();
        
        if (result.code === 1) {
          alert('学生信息删除成功');
          closeDeleteModal();
          // 重新加载当前页数据
          fetchStudents(currentPage);
        } else {
          alert('删除失败: ' + (result.message || "未知错误"));
        }
      })
      .catch(error => {
        hideLoading();
        console.error('Error deleting student:', error);
        alert('删除学生信息时发生错误，请重试');
      });
    }
  });

  // 为搜索框添加回车键提交功能
  const searchInputs = [
    document.getElementById("name"),
    document.getElementById("studentId"),
    document.getElementById("classId")
  ];
  searchInputs.forEach(input => {
    input.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        searchBtn.click(); // 触发搜索按钮点击事件
      }
    });
  });

  // 页面加载时获取第一页数据
  fetchStudents(currentPage);
});