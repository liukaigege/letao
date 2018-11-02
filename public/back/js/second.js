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
        // console.log(info);
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
  $("#addCategory").click(function () {
    $("#addModal").modal("show");
    //模态框显示后 紧接着动态添加模态框下拉菜单选项
    $.ajax({
      url: "/category/queryTopCategoryPaging",
      type: "get",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("dropdownTmp", info)
        $(".dropdown-menu").html(htmlStr);
      }


    })
  })

  // 给下拉菜单注册点击事件
  $(".dropdown-menu").on("click", "a", function () {
    var txt = $(this).text();
    // console.log(txt);
    $("#dropdownText").text(txt);
    // 还要获取id添加给隐藏域，发送给后台
    var id = $(this).data("id");
    // 赋值给隐藏域
    $('[name="categoryId"]').val(id);

    // 设置校验成功
    $("#form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
  })

  //使用图片上传插件上传图片并在页面上显示
  $("#fileLoad").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      // console.log(data);
      // 获取图片地址
      var picUrl = data.result.picAddr;
      // 通过图片地址把图片显示出来
      $("#picUrl img").attr("src", picUrl);
      // 添加给隐藏域，并提交给后台
      $('[name="brandLogo"]').val(picUrl);

      // 设置校验成功,重置校验状态

      $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");

    }
  });

  // 配置表单校验
  $("#form").bootstrapValidator({
    // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded: [],
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    fields: {
      // 品牌名称
      brandName: {
        // 校验规则
        validators: {
          notEmpty: {
            message: "请输入二级分类名称",
          }
        }


      },

      // 图片的地址
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      },

      // 一级分类id
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      }

    }


  });

  // 校验完成后，阻止表单的默认提交，通过ajax向后台提交数据

  $("#form").on("success.form.bv", function (e) {
    e.preventDefault(); //阻止表单的默认提交

    // 通过ajax向后台提交数据
    $.ajax({
      type: "post",
      data: $("#form").serialize(),
      dataType: "json",
      url: "/category/addSecondCategory",
      success: function (info) {
        // console.log(info);

        // 关闭模态框
        $("#addModal").modal("hide");
        //重置表单内容，和校验状态
        $('#form').data("bootstrapValidator").resetForm(true);

        // 重新渲染页面
        currentPage = 1;
        render();
        // 重置下拉文本
        $("#dropdownText").text("请选择一级分类");

        // 图片位置重置
        $("#picUrl img").attr("src", "./images/none.png")
      }
    })

  })


})