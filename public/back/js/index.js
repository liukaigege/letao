$(function () {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main-left'));

  // 指定图表的配置项和数据
  var option = {
    title: {
      text: '2017年注册人数'
    },
    tooltip: {},
    legend: {
      data: ['人数']
    },
    xAxis: {
      data: ["1月", "2月", "3月", "4月", "5月", "6月"]
    },
    yAxis: {},
    series: [{
      name: '人数',
      type: 'bar',
      data: [500, 200, 360, 100, 450, 1500]
    }]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
});


$(function () {
  var myChart = echarts.init(document.getElementById('main-right'));

  var option = {
    title : {
        text: '热门品牌销售',
        subtext: '2017年6月',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['耐克','阿迪达斯','李宁','新百伦','匡威']
    },
    series : [
        {
            name: '品牌',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'耐克'},
                {value:310, name:'阿迪达斯'},
                {value:234, name:'李宁'},
                {value:135, name:'新百伦'},
                {value:1548, name:'匡威'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};


  myChart.setOption(option);

})