<template>
  <div>
    <div id="content">
      <div id="main"></div>
      <div id="maychar"></div>
    </div>
    <button @click="exportPDF">导出PDF</button>
    <!-- <button @click="convertCanvasToImage">导出PDF2</button> -->
  </div>
</template>
 
<script>
import JsPDF from "jspdf";
import html2Canvas from "html2canvas";
// import _get from "lodash/get"
import _get from "lodash/get";
import _uniq from 'lodash/uniq'
import _pick from 'lodash/pick'
export default {
  data() {
    return {};
  },
  methods: {
    showlodash(){
      const  object = { 'a': [{ 'b': { 'c': 3 } }] };
      const  pickObj = { 'a': 1, 'b': '2', 'c': 3 };
      // 去重
      const a = _uniq([1,2,1,5,1,9])
      const obj = _pick(pickObj,['a', 'c'])
      const nowlodsh = _get(object,['a', '0', 'b', 'c'])
      console.log('去重[1,2,1,5,1,9]',a);
      console.log("得到选中的 key 中'a', 'c'的对象{ 'a': 1, 'b': '2', 'c': 3 }",obj);
      console.log('用于解决a.b.c.d出现undefined导致代码报错不继续向下执行',nowlodsh);
    },
    // 基本柱形图
    change() {
      const chartBox = this.$echarts.init(document.getElementById("main"));
      const option = {
        xAxis: {
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: [23, 24, 18, 25, 27, 28, 25],
          },
        ],
      };
      chartBox.setOption(option);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        chartBox.resize();
      });
    },
    // 折线图
    changetype() {
      // 获取组件实例
      const machart = this.$echarts.init(document.getElementById("maychar"));
      // 设置配置项
      const option = {
        xAxis: {
          data: ["A", "B", "C", "D", "E"],
        },
        yAxis: {},
        series: [
          {
            data: [10, 22, 28, 43, 49],
            type: "line",
            stack: "x",
          },
          {
            data: [5, 4, 3, 5, 10],
            type: "line",
            stack: "x",
          },
        ],
      };
      // 复制
      machart.setOption(option);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        machart.resize();
      });
    },
    // 导出pdf按钮
    exportPDF() {
      // const doc = new jsPDF('p', 'in', 'letter');
      // console.log(doc,'11');
      // const elementHandler = {
      //   '#ignorePDF': function(element, renderer) {
      //     return true;
      //   }
      // };
      // doc.fromHTML方法失效
      // const source = window.document.getElementById('content').innerHTML;
      // doc.fromHTML(source, 15, 15, {
      //   'width': 170,
      //   'elementHandlers': elementHandler
      // });
      // doc.save('export.pdf');

      const DomName = document.getElementById("content");
      console.log("正在帮您导出......");
      window.pageYoffset = 0; // 滚动置顶
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      //title，随意设置，也可以提出来做参数，传入进来，自己发挥
      var title = "测试啊"; // 导出名字
      var that = this;
      var shareContent = DomName; //需要截图的包裹的（原生的）DOM 对象
      //打印看有没有获取到dom
      console.log(shareContent);
      var width = shareContent.offsetWidth; //获取dom 宽度
      var height = shareContent.offsetHeight; //获取dom 高度
      var canvas = document.createElement("canvas"); //创建一个canvas节点
      var scale = 2; //定义任意放大倍数 支持小数
      canvas.width = width * scale; //定义canvas 宽度 * 缩放，在此我是把canvas放大了2倍
      canvas.height = height * scale; //定义canvas高度 *缩放
      canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
      html2Canvas(DomName, {
        //允许跨域图片的加载
        useCORS: true,
        dpi: window.devicePixelRatio, //将分辨率提高到特定的DPI 提高四倍
        // scale: 2, //按比例增加分辨率
      }).then(function (canvas) {
        var context = canvas.getContext("2d");
        // 【重要】关闭抗锯齿
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;
        var imgData = canvas.toDataURL("image/", 1.0); //转化成base64格式,可上网了解此格式
        var img = new Image();
        img.src = imgData;
        img.onload = function () {
          img.width = img.width / 2; //因为在上面放大了2倍，生成image之后要/2
          img.height = img.height / 2;
          img.style.transform = "scale(0.5)";
          if (this.width > this.height) {
            //此可以根据打印的大小进行自动调节
            var doc = new JsPDF("l", "mm", [
              this.width * 0.555,
              this.height * 0.555,
            ]);
          } else {
            var doc = new JsPDF("p", "mm", [
              this.width * 0.555,
              this.height * 0.555,
            ]);
          }
          doc.addImage(
            imgData,
            "jpeg",
            10,
            0,
            this.width * 0.505,
            this.height * 0.545
          );
          doc.save(title + "-文件.pdf");
          console.log("倒数3秒导出啦");
        };
      });
    },
    // convertCanvasToImage() {
    //   console.log("1");
    //   html2Canvas(document.getElementById("main"), {
    //     onrendered: function (canvas) {
    //       document.body.appendChild(canvas);
    //       this.createPDFObject(canvas.toDataURL("image/jpeg"));
    //     },
    //   });
    // },
    // createPDFObject(imgData) {
    //   var doc = new JsPDF("p", "pt");
    //   doc.addImage(imgData, 5, 5, 600, 300, "img");
    //   doc.save("test.pdf");
    // },
  },
  mounted() {
    this.showlodash()
    this.change();
    this.changetype();

  },
};
</script>
 
<style lang="scss" scoped>
#main {
  min-width: 31.25rem;
  min-height: 31.25rem;
  // max-height: 500px;
}
#maychar {
  max-height: 500px;
  // max-height: 400px;
  height: 500px;
}
</style>