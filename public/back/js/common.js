// 给全局ajax注册开启事件
$(document).ajaxStart(function(){
  NProgress.start();
})

$(document).ajaxStop(function(){
  NProgress.done();
})