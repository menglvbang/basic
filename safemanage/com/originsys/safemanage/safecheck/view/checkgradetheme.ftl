<!--<script src="http://192.168.0.12:8080/gis/FMapLib/FMapLib.Include-1.0.4.js" type="text/javascript"></script>-->
<script src="${map_url!''}/gis/FMapLib/FMapLib.Include-1.0.4.js" type="text/javascript"></script>
<style>
.button{
    background: url('/safemanage/resouce/images/ui-bg_highlight-soft_100_f6f6f6_1x100.png') repeat-x scroll 50% 50% #F6F6F6;
    border: 1px solid #DDDDDD;
    color: #0073EA;
    font-weight: normal;
    font-family: 微软雅黑,宋体;
    font-size: 12px;
    cursor: pointer;
    display: inline-block;
    margin-right: 0.1em;
    overflow: visible;
    padding: 0;
    position: relative;
    text-align: center;
    -moz-border-radius-topleft: 2px;
     text-decoration: none;
     height:30px;
     width:80px;
 
}
.buttonhover{
  cursor: pointer;
border:1px solid #fde893;background:#fef8cf url(/safemanage/resouce/images/ui-bg_highlight-soft_25_fef8cf_1x100.png) 50% 50% repeat-x;font-weight:normal;color:#444
}
</style>
<script type="text/javascript">
var map;
var BC;
$(function(){
//初始化地图
	 map = new FMapLib.FMap("map");//安全检查地图
	 $("#checkgradetheme").click(function(){
  BC= new FMapLib.BuildingCheckGradeUnique(map); //生成安全等级专题图  
     //缩放级别小于3级时自动放大到3级
  var zoom = map.map.getZoom();
   if(zoom<3){
	   map.map.zoomTo(3);    
   }
   if(map){
   getHouseHGT(map);
   }
   else{
    alert("地图初始化异常，请检查地图服务是否正常开启！");
   }
  });
	
  //定义样式
  $("#searchHouse").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });
  $("#checkgradetheme").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });
  $("#cleartheme").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });
  $("#printmap").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });
	//查询定位
    $("#searchHouse").click(function(){
		var address = $("#inputaddress").val();
		var BF = new FMapLib.BuildingFastQuery(map);
	    BF.queryBySafeAddress(address);
	});
	//清除专题图
	$("#cleartheme").click(function(){
     if(BC!=""&&BC!=null){
     BC.removeTheme(map);
     map.removeLegendDiv();
     }
	});
	
	//打印地图
	$("#printmap").click(function(){
	FMapLib.PrintMap("map");//打印地图,IE8浏览器通过测试，IE9采用兼容性视图测试通过。
	});
});
//房屋安全等级分色专题图(自定义图例)
function getHouseHGT(map){
	var color=['#00FF00', '#0000FF', '#FFCC00', '#FF0000'];
//	var mountArray=[{"A级":183,"B级":13,"C级":15,"D级":140}];//待修改为AJAXS请求服务端返回ＪＳＯＮ数组形式。参考sql：select count(*),t.健康完损等级 from st_ridrgn_jkda_p t group by  t.健康完损等级
	var html="<div><table id='' border='0' cellspacing='6' cellpadding='0'>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[0]+"'></td>";
	html+="<td width='90' height='7'align='left'>无危险点房屋</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[1]+"'></td>";
	html+="<td width='90' height='7'align='left'>存在危险点房屋</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[2]+"'></td>";
	html+="<td width='90' height='7'align='left'>局部危险房屋</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[3]+"'></td>";
	html+="<td width='90' height='7'align='left'>整幢危险房屋</td></tr>";
	html+="</table></div>" ; 
	map.initLegendDiv();//初始化地图图例图层
    map.flashLegend(html);//自定义图例内容
}
</script>

<!--<div id="tool"></div>-->
<div style=" margin-top:5px;margin-bottom:5px;">
<input  style="height:24px;" class="text_style" name="" id="inputaddress" placeholder="请输入房屋地址"  type="text" />&nbsp<button class="button" id="searchHouse">定位房屋</button>
<button class="button" id="checkgradetheme">生成专题图</button>&nbsp<button class="button" id="cleartheme">清除专题图</button>&nbsp<button class="button" id="printmap">打印地图</button>
</div>
<div id="map" style="position:absolute;left:0px;right:0px;width:99%;height:91%;" visibility="visible"></div> 