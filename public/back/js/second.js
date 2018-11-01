$(function () {
  var currentPage = 1;
  var pageSize = 5;

  // 进页面先渲染一波
  render();

  function render() {
    // 通过ajax向后台请求数据，渲染表格
    $.ajax({
      url: "/category/querySecondCategoryPaging",
      type: "get",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("secondTmp", info);
        $(".table tbody").html(htmlStr)

        // 分页处理
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
        })

      },
    })

  };



  // 点击按钮模态框显示
  $("#addCategory").click(function(){
    $("#addModal").modal("show");
  })


})