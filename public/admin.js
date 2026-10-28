// 登录页逻辑：登录成功后跳转到管理页
document.getElementById('login-btn').addEventListener('click', function () {
  const password = document.getElementById('password').value;
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: password }),
  })
    .then(function (r) {
      return r.json().then(function (d) {
        if (!r.ok) throw new Error(d.error || '密码错误');
        return d;
      });
    })
    .then(function (data) {
      localStorage.setItem('adminToken', data.token);
      window.location.href = '/manage.html';
    })
    .catch(function (err) {
      document.getElementById('login-msg').textContent = err.message;
    });
});
