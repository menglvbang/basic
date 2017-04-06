<!--<script src="${map_url!''}/gis/FMapLib/FMapLib.Include-1.0.4.js" type="text/javascript"></script>-->
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
<!--<div id="tool"></div>-->
<div style=" margin-top:5px;margin-bottom:5px;"><button class="button" type="button" id="chooseHouse">周边分析</button>&nbsp<button  class="button" id="insert1">新增事件点</button>
<input style="height:24px;"class="text_style" name="" id="inputaddress" placeholder="请输入房屋地址"  type="text" />&nbsp<button class="button" id="searchHouse">定位房屋</button>&nbsp
<button class="button" id="printmap">打印地图</button>
</div>
<div id="map" style="position:absolute;left:0px;right:0px;width:100%;height:100%;" visibility="visible"></div> 
<script src="${map_url!''}/gis/FMapLib/FMapLib.Include-1.0.4.js" type="text/javascript"></script>
<script type="text/javascript" >
var map,qs;
$(function(){
	 map = new FMapLib.FMap("map","emergency");	//突发事件专题地图 
		    	 
     $("#chooseHouse").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });
     $("#insert1").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });
     $("#searchHouse").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });	
     $("#printmap").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });
	 $("#chooseHouse").click(function(){
	 	if(map)
	 		map.clearAllFeatures();
	 /* 鼠标右键取消插件 */ 
		(function($) { 
		$.fn.extend({ 
		// 定义鼠标右键方法，接收一个函数参数
		"rightClick":function(fn){ 
		// 调用这个方法后将禁止系统的右键菜单
		$(document).bind('contextmenu',function(e){ 
		return false; 
		}); 
		// 为这个对象绑定鼠标按下事件
		$(this).mousedown(function(e){ 
		// 如果按下的是右键，则执行函数
		if(3 == e.which){ 
		fn(); 
		} 
		}); 
		} 
		}); 

		})(jQuery); 
		$(document).ready(function(e){ 
			$("#map").rightClick(function(){stopDrop();}); 
			}); 
//		var CH= new FMapLib.CheckHouse(map);
//		var url1="safecheck.survey.insert";
//		var url2="safecheck.survey.detail";
//		var url3="safecheck.survey.insert1";		
//		CH.choosehouse(map,[url1,url2,url3]);
		qs=new FMapLib.QuerySurrounding(map);
		qs.open();
	});
//新增突发事件按钮点击事件	 
$("#insert1").click(function(){
		 /* 鼠标右键取消插件 */ 
		(function($) { 
		$.fn.extend({ 
		// 定义鼠标右键方法，接收一个函数参数
		"rightClick":function(fn){ 
		// 调用这个方法后将禁止系统的右键菜单
		$(document).bind('contextmenu',function(e){ 
		return false; 
		}); 
		// 为这个对象绑定鼠标按下事件
		$(this).mousedown(function(e){ 
		// 如果按下的是右键，则执行函数
		if(3 == e.which){ 
		fn(); 
		} 
		}); 
		} 
		}); 
		})(jQuery); 
		$(document).ready(function(e){ 
			$("#map").rightClick(function(){stopDrop();}); 
		});
     var url="safecheck.disasterwarn.forinsert";// 同步基础信息到安全管理库t_building表中	
	 var a=new FMapLib.PointForEditOnline.emergency(map,[url]);// 实例化在线突发事件点编辑控件
	 var drawPoint=a.getPointDrawer();// 执行添加操作，返回一个draw point Control实例
	// featureadded事件监听
	 drawPoint.events.on({
		"featureadded" : addFeatureCompleted || {}
	 });	
	// 画点完成后执行的操作
    function addFeatureCompleted(drawGeometryArgs) {
    	drawPoint.deactivate();	// 关闭画点控件
    	// 画点完成后执行的操作，添加marker
	   var point = drawGeometryArgs.feature.geometry;  
	   var c="<style>"
           + ".td12{text-align:right;padding-right:12px;background-color:#F6FCFF;color:#000;font-size:1.2em;}"
           + ".td13{padding-left:12px;background-color:#FFF;color:#4D4D4D;font-size:1.2em;}" 
           + "</style>"
  	        +"<div style='width:312px; height:180px;font-size:.8em; opacity: 1; line-height:30px; overflow-y:hidden;'>"
  		    + "<span style=' color:#005ebc;font-size: 18px;font-family:微软雅黑;'>信息</span><br>";
  c += "<table width='295px' border='0'cellpadding='0' cellspacing='1' bgcolor='#dee2e3' style=' border-color:#F3F3F3;line-height:30px;margin-left:15px'>"
  + "<tr>"
  + "<td class='td12'>X坐标</td>"
  + "<td class='td13'>"+point.x+"</td>"
  + "</tr>"
  + "<tr>"
  + "<td class='td12'>Y坐标</td>"
  + "<td class='td13'>"+point.y+"</td>"
  + "</tr>"
  + "</table>";
  c +="<p  style='text-align:center;'><input type='submit' name='Submit' id='saveforsend' value='确认此处新增突发事件' style='background:url(/safemanage/resource/images/button_bj.jpg) repeat-x; width:222px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";
  c += "</div>";	
		map.pointposition=point;		
		map.addMarker(point.x,point.y,"/safemanage/resource/images/flashpoint.gif",32,32);//在画点处标记一个自定义Marker；
        a.popDialogCanvas(point,c);// 在新添加的点上弹出信息对话框,信息框内容自定义
        //定义信息框文档对象点击事件
     $("#saveforsend").bind("click",function() {	 
       a.addFeatureProxy(point,null,null);// 添加地物点几何特征及相关属性特征到空间数据库。
      });
    }	
   });
	
	$("#searchHouse").click(function(){
		var address = $("#inputaddress").val();
		var BF = new FMapLib.BuildingFastQuery(map);// 建筑物快速定位查询
	    BF.queryBySafeAddress(address);	
	});	
	
// 打印地图
	$("#printmap").click(function(){
	FMapLib.PrintMap("map");// 打印地图,IE8浏览器通过测试，IE9采用兼容性视图测试通过。
	});
});
// 右键取消地图操作
function stopDrop(){	
    map.stopDrop();
    if(qs&&qs._drawPoint){
    	
    	qs._drawPoint.deactivate();
    }
    
}
</script>