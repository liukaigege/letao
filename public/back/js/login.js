$(function () {
  $("#form").bootstrapValidator({

    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //动感光波  --------------------------------
    fields: {
      // 用户名
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          // 长度校验

          stringLength: {
            min: 1,
            max: 6,
            message: "用户名长度1到6位"
          }
        }
      },

      //动感光波  --------------------------------

      // 密码
      password: {
        validators: {
          notEmpty: {
            message: '密码不能为空'
          },
          // 长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度6到12位"
          }
        }
      },

      //动感光波  ---------------------------------
    }
  });

  // 注册表单验证成功事件
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault(); //既阻止了默认事件，还阻止了用户连续提交
    console.log("阻止了表单默认行为");

    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $("#form").serialize(),
      dataType: "json",
      success: function(info){
        console.log(info);
        // 判断
        if(info.success){
          location.href="index.html";
        };
        if(info.error === 1000){
          alert(info.message);
        };
        if(info.error === 1001){
          alert(info.message);
        };
      },
    })
  });


  // 重置表单样式
  $("[type = 'reset']").click(function(){
    $("#form").data("bootstrapValidator").resetForm(true);
  })
});