$(function () {
  // 预设当前页是第一页
  var currentPage = 1;
  //每页条数是5
  var pageSize = 5;
  // 存储点击时当前按钮的id
  var currentId;
  // 存储点击时当前id的用户状态
  var isDelete;
  // 一进入页面先渲染一次
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      dataType: "json",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        var htmlStr = template("tmp", info);
        $(".lt_table tbody").html(htmlStr);


        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          // currentPage: 1, //当前页
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          // totalPages:2, //总页数
          onPageClicked: function (a, b, c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });

      },

    })

  }


  // 点击按钮，显示模态框，在确定之后改变用户状态
  // 给禁用按钮注册点击事件)(使用事件委托)
  $("tbody").on("click", ".btn", function () {
    $("#userChange").modal("show");
    currentId = $(this).parent().data("id");
    // 判断isDalete是否有禁用或者是启用的类
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  });

  $("#sureBtn").click(function () {
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function (info) {
        console.log(info);

        // 隐藏模态框
        $("#userChange").modal("hide");
        // 重新渲染页面
        render();
      }
    })

  })


})