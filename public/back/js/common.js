
// 给全局ajax注册开启事件
$(document).ajaxStart(function(){
  NProgress.start();
});

$(document).ajaxStop(function(){
  setTimeout(function() {
    NProgress.done();
  }, 1500);
});




$(function(){
  // 1.二级菜单的切换
  $("#secList").click(function(){
    $(".nav .child").slideToggle();
  })
  //2.左侧边栏的显示与隐藏
  $("#icon_menu").click(function(){
    $(".lt_aside").toggleClass("hidemenu");
    $(".lt_main").toggleClass("hidemenu");
    $(".lt_main .lt_topbar").toggleClass("hidemenu");
  })
  //3.退出功能的实现
  $("#icon_logout").click(function(){
    $("#logOut").modal('show');
  });
  // 点击退出按钮，用户端用户自己清除了缓存，将sessionID清楚了
  //前端通过发送ajax请求，让后台销毁当前用户的登录状态
  $("#logoutBtn").click(function(){
    $.ajax({
      url:"/employee/employeeLogout",
      type:"get",
      dataType:"json",
      success:function(info){
        console.log(info);
        if(info.success){
          location.href="login.html";
        }
      }
    })
  })
})