$(function () {
  var currentPage = 1; //当前页
  var pageSize = 2; //每页数据数
  var picArr = []; //创建个空数组用来存储每次的上传图片对象
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
  $("#addProduct").click(function () {
    $("#addModal").modal("show");

    // 动态渲染商品分类的下拉菜单
    $.ajax({
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      type: "GET",
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("dropdownTpl", info);
        $(".dropdown-menu").html(htmlStr);
      }
    });

  });



  // 给下拉菜单的a注册点击事件，使用事件委托
  $(".dropdown .dropdown-menu").on("click", "a", function () {
    var txt = $(this).text();
    // console.log(txt)
    $("#dropdownText").text(txt);
    // 获取id， 给隐藏域赋值
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);

    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID")

  });


  // 使用插件初始化多文件上传
  $("#fileLoad").fileupload({
    dataType: "json",
    done: function (e, data) {
      //  获取图片地址的对象
      var picObj = data.result;
      // 获取图片的地址
      var picUrl = picObj.picAddr;
      console.log(picUrl);
      // 每次添加都会添加到上次添加的图片的前面
      picArr.unshift(picObj);
      // 将图片展示到页面上,采用拼接字符串的形式
      $("#imgBox").prepend(' <img src="' + picUrl + '" alt="">');
      // 当图片数量大于3时，就删除最先上传的那张图片
      if (picArr.length > 3) {
        picArr.pop(); //x先删除数组的最后一项
        // 再删除页面上图片的最后一项
        // 通过last-of-type 找到最后一个img标签，让它自己删除自己
        $("#imgBox img:last-of-type").remove();
      };

      // 如果处理后, 图片数组的长度为 3, 说明已经选择了三张图片, 可以进行提交
      // 需要将表单 picStatus 的校验状态, 置成 VALID
      if (picArr.length === 3) {
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID")
      }

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

    // 配置校验字段
    fields: {
      // 二级分类id，归属品牌
      brandId: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      //商品名称
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },

      // 商品描述
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },

      // 商品库存
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          // 正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },

      // 商品尺码
      size: {
        validators: {

          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 32-40'
          }
        }
      },

      // 请输入商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },

      // 商品现价
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      // 标记图片是否上传满三张
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }

    }
  });


  // 注册表单校验完成

  $("#form").on("success.form.bv", function (e) {
    e.preventDefault(); //阻止表单的默认提交
    // 表单提交得到的参数字符串
    var params = $('#form').serialize();
    console.log(picArr);
    params += "&picAddr1=" + picArr[0].picAddr + "&picName1=" + picArr[0].picName;
    params += "&picAddr2=" + picArr[1].picAddr + "&picName2=" + picArr[1].picName;
    params += "&picAddr3=" + picArr[2].picAddr + "&picName3=" + picArr[2].picName;

    console.log(params);

    $.ajax({
      url: "/product/addProduct",
      data: params,
      dataType: "json",
      type: "POST",
      success: function (info) {
        //关闭模态框
        $("#addModal").modal("hide");
        // 重置校验状态和文本内容
        $('#form').data("bootstrapValidator").resetForm(true);
        // 重新渲染第一页
        currentPage = 1;
        render();
        // 手动重置, 下拉菜单
        $('#dropdownText').text("请选择二级分类")

        // 删除结构中的所有图片
        $('#imgBox img').remove();
        // 重置数组 picArr
        picArr = [];

      }
    })

  })





})