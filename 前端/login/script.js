document.getElementById('loginBtn').addEventListener('click', async function () {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('请输入用户名和密码！');
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // 添加凭证支持
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    console.log('登录响应:', result);
    
    if (response.ok && result.code === 1) {
      if (result.data) {
        console.log('准备保存的token:', result.data);
        localStorage.setItem('token', result.data);
        console.log('token已保存到localStorage');
        
        // 验证是否保存成功
        const savedToken = localStorage.getItem('token');
        console.log('从localStorage读取的token:', savedToken);
        
        if (savedToken) {
          // 登录成功，跳转到主页
          window.location.href = '../index/index.html';
        } else {
          console.error('Token保存失败');
          alert('登录失败：Token保存失败');
        }
      } else {
        console.error('响应中没有token数据:', result);
        alert('登录失败：未返回有效的认证令牌');
      }
    } else {
      // 登录失败，显示错误信息
      alert(result.message || '登录失败，请检查用户名和密码');
    }
  } catch (error) {
    console.error('登录请求失败:', error);
    alert('网络错误，登录失败');
  }
});

// 页面加载时检查是否已经登录
document.addEventListener('DOMContentLoaded', function() {
  const existingToken = localStorage.getItem('token');
  if (existingToken) {
    console.log('检测到已存在的token');
  }
});