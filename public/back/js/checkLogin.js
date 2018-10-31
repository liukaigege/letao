// 一进入登录页面，判断用户是否是已登录的，如果是登陆的才能继续访问，否则返回登录页

$.ajax({
  url: "/employee/checkRootLogin",
  type: "get",
  dataType: "json",
  success: function (info) {
    console.log(info);
    if(info.error ===400){
      location.href="login.html"
    }
  }
})