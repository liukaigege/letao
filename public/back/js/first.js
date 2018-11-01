$(function () {


  // $.ajax({
  //   url:"/category/addTopCategory",
  //   type:"POST",
  //   data:{
  //     categoryName:
  //   },
  //   dataType:"json",
  //   success:function(info){

  //   }
  // })
  var currentPage = 1;
  var pageSize = 5;
  // 已进入页面先渲染一次
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("firstTmp", info);
        $(".table tbody").html(htmlStr);

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

      }
    })
  }

  // 点击添加分类按钮，添加分类模态框显示
  $("#addCategory").click(function () {
    $("#addModal").modal("show");
  });

  // 验证表单
  $("#form").bootstrapValidator({
    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "请输入一级菜单名"
          }
        }
      }
    }
  });

  // 阻止表单的默认提交行为，通过ajax向后台提交
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    console.log("阻止了表单默认行为");
    // 通过ajax向后台提交数据
    $.ajax({
      url:"/category/addTopCategory",
      data:$("#form").serialize(),
      type:"post",
      dataType:"json",
      success:function(info){
        console.log(info);
        if(info.success){
          // 关闭模态框
          $("#addModal").modal("hide");
          // 重新渲染页面，渲染第一页
          currentPage = 1;
          render();
        }
      }



    })    
  })


})