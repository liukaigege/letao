$(function () {
  var currentPage = 1; //当前页
  var pageSize = 2; //每页数据数

  // 进入页面先渲染一波
  render();
  // 通过ajax向后台请求数据，动态渲染列表
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("productTmp", info);
        $("#productTable tbody").html(htmlStr)

        // 分页处理
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: currentPage, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          size: "small", //设置控件的大小，mini, small, normal,large
          onPageClicked: function (a, b, c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            $()
            // 重新渲染页面
            currentPage = page;
            render();
          }
        })
      }

    });
  };


  // 点击按钮显示模态框
  $("#addProduct").click(function(){
    $("#addModal").modal("show");

    // 动态渲染商品分类的下拉菜单
    $.ajax({
      url:"/category/querySecondCategoryPaging",
      data:{
        page:1,
        pageSize:100
      },
      type:"GET",
      dataType:"json",
      success:function(info){
        console.log(info);
        var htmlStr = template("dropdownTpl",info);
        $(".dropdown-menu").html(htmlStr);
      }
    });
   
  });



  // 给下拉菜单的a注册点击事件，使用事件委托
  $(".dropdown .dropdown-menu").on("click","a",function(){
    var txt = $(this).text();
    // console.log(txt)
    $("#dropdownText").text(txt);
    // 获取id， 给隐藏域赋值
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);
  });
  

  // 使用插件初始化多文件上传
  $("#fileLoad").fileupload({
    dataType:"json",
    done:function(e,data){
      console.log(data.result);
      
    }
  });





})