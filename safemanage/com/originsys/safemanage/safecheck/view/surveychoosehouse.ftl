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
<div id="tooldiv" style=" margin-top:5px;margin-bottom:0px;"><button class="button" type="button" id="chooseHouse">选取房屋</button>&nbsp<button  class="button" id="addHouse">新增房屋</button>
<input style="height:24px;width:150px" class="button" name="" id="inputaddress" placeholder="请输入房屋地址"  type="text" />
<select id="search_way" name="ways" class="button" style="height:27px"><option value="0">房屋地址</option><option value="1">平面坐标 </option></select>&nbsp
<button class="button" id="searchHouse">地址/坐标定位</button>&nbsp
<button class="button" id="gps" style="" value="位置跟踪">位置跟踪</button>

</div>
<div id="map" style="position:absolute;left:0px;right:0px;width:99%;height:91%;border-color:white" visibility="visible"></div> 
<script src="${map_url!''}/gis/FMapLib/FMapLib.Include-1.0.4.js" type="text/javascript"></script>
<script type="text/javascript" >
var map,cfeature,geolocate,a="0",addHouse,chooseHouse;
$(function(){
	$('#search_way').change(function(){
	     a=$(this).children('option:selected').val();    
	     // 初始化输入框
	   if(a=="0"){
	      $(inputaddress).show();
	      if($(inputx).length!=0){
	       $(inputx).hide();     
	      }
	      if($(inputy).length!=0){
	       $(inputy).hide();
	      }
	     $("#inputaddress").val("请输入房屋地址");
	     $("#inputaddress").focus(function(){
	     if($("#inputaddress").val()=="请输入房屋地址")
		 $("#inputaddress").val("");
	     });
	    }
	    if(a=="1"){
	     $(inputaddress).hide();
	    if($("#inputy").length==0){
	       $("#inputaddress").after("<input style='height:24px;width:120px' class='button' id='inputy' placeholder='请输入纵轴坐标'  type='text'/>");
	    }
	    if($("#inputx").length==0){
	      $("#inputaddress").after("<input style='height:24px;width:120px' class='button' id='inputx' placeholder='请输入横轴坐标'  type='text'/>&nbsp");                               
	    }   
	      $(inputx).show();
	      $(inputy).show();
	     $("#inputx").val("请输入横轴坐标");
	     $("#inputx").focus(function(){
	     if($("#inputx").val()=="请输入横轴坐标")
		  $("#inputx").val("");
	     });
	     $("#inputy").val("请输入纵轴坐标");
	     $("#inputy").focus(function(){
	     if($("#inputy").val()=="请输入纵轴坐标")
		  $("#inputy").val("");
	     });
	   }
	  });
});
$(function(){	
	 map = new FMapLib.FMap("map","safecheck","${user.region_id!''}");
	 var toolbar=new FMapLib.ToolBar('tooldiv',map);// 工具条
	 geolocate = new FMapLib.Geolocate(map);// gps跟踪定位
	 var ss=new FMapLib.SatelliteMapSwitcher(map);// 影像图切换工具
     $("#chooseHouse").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });
     $("#addHouse").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });
     $("#searchHouse").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });
	 $("#gps").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });	
	 
  // 点击选择房屋按钮
	 $("#chooseHouse").click(function(){	
		map.clearAllFeatures();
		if(cfeature&&cfeature.popup){
    		map._markerLayer.map.removePopup(cfeature.popup);
    		cfeature.popup.destroy();
    		cfeature.popup = null;   		
	     }
		 if(addHouse&&addHouse.feature&&addHouse.feature.popup){
				map._markerLayer.map.removePopup(addHouse.feature.popup);
				addHouse.feature.popup.destroy();
				addHouse.feature.popup = null;  
		 }
		
		 var view=this.textContent;
		  var e=this;
	   if(view=="选取房屋"){
	      e.textContent="停止操作";
	   chooseHouse=new FMapLib.ChooseHouse(map,choosefinished);// 点选房屋ＡＰＩ
		function choosefinished(feature){
			 e.textContent="选取房屋";
			 cfeature=feature;	
			 if(null!=feature)
			 createInfoWindow(feature);		
	    }
	   }else{
		  e.textContent="选取房屋";
		  chooseHouse.stopDraw();	  
	   }
	 // 根据信息录入状态显示不同的信息窗口
	    function createInfoWindow(feature){
      	// 获取西南角坐标（left，bottom）/房屋点坐标smx,smy
			var left=feature.geometry.getBounds()['left']||feature.attributes['SMX'];			
			var bottom=feature.geometry.getBounds()['bottom']||feature.attributes['SMY'];		 
			// 获取地址
			var address=feature.attributes['ADDRESS'];
			// 获取smuserid
			var smuserid=feature.attributes['SMUSERID'];		
			var checkstate;		
				checkstate=feature.attributes['CHECKSTATE'];			
			var lonlat = feature.geometry.getBounds().getCenterLonLat();
			var url="safecheck.survey.";
			var urlx,urly;
			// 未普查的feature调用insert/insert1服务实现信息录入
			if (checkstate==0){		
			var contentHTML = "<div style='font-size:.8em; opacity: 1; line-height:30px; overflow-y:hidden;'>"
					+ "<span style='color:#005ebc;font-size: 18px;font-family:微软雅黑;'>房屋信息</span><br>";
			contentHTML += "<div style='font-size:1.2em;margin-left:15px;padding-bottom:0px'>楼幢编码：" + smuserid	+ "</div>"; 
			contentHTML += "<div style='font-size:1.2em;margin-left:15px'>地址：" + address	+ "</div>";
			if(smuserid<0)// 针对新建房屋操作
			 urlx=url+"insert1?smuserid="+smuserid+"&left="+left+"&bottom="+bottom+"&address="+address;
			else// 针对已有房屋操作
			 urlx=url+"insert?smuserid="+smuserid+"&left="+left+"&bottom="+bottom+"&address="+address;			
			contentHTML +="<p  style='text-align:center;'><input type='submit' name='Submit' id='messinsert' value='普查录入' style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";			
			contentHTML += "</div>";
			// 初始化一个弹出窗口，当某个地图要素被选中时会弹出此窗口，用来显示选中地图要素的属性信息
			var popup = new MapLib.Popup.FramedCloud("popwin",
					new MapLib.LonLat(lonlat.lon, lonlat.lat), null,
					contentHTML, null, true, null, true);
			cfeature.popup = popup;
			map.addPopup(popup);			
			$("#messinsert").bind("click",function() {		
					window.showModalDialog(encodeURI(urlx),"","dialogWidth:1100px;dialogHeight:600px;center:1;");
			});
			}
			// 已经普查的feature调用detail服务实现信息查看
			else{				
			   var  contentHTML2 = "<div style='font-size:.8em; opacity: 1; line-height:30px; overflow-y:hidden;'>"
					+ "<span style='color:#005ebc;font-size: 18px;font-family:微软雅黑;'>房屋信息</span><br>";
			     contentHTML2 += "<div style='font-size:1.2em;margin-left:15px;'>楼幢编码：" + smuserid	+ "</div>"; 
				 contentHTML2 += "<div style='font-size:1.2em;margin-left:15px'>地址：" + address	+ "</div>";			     		   
			    contentHTML2 +="<p  style='text-align:center;'><input type='submit' name='Submit' id='messfind' value='信息查看' style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";			
			    contentHTML2 +="<p  style='text-align:center;'><input type='submit' name='Submit' id='messinsert' value='普查录入' style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";			
			    contentHTML2 += "</div>";
			// 初始化一个弹出窗口，当某个地图要素被选中时会弹出此窗口，用来显示选中地图要素的属性信息
			 var   popup2 = new MapLib.Popup.FramedCloud("popwin",
					new MapLib.LonLat(lonlat.lon, lonlat.lat), null,
					contentHTML2, null, true, null, true);
			   cfeature.popup = popup2;	
			   map.addPopup(popup2);	
		
			   urly=url+"surveyrecorddetail?isgis=1&building_id="+smuserid;
			   urlx=url+"insert?smuserid="+smuserid+"&left="+left+"&bottom="+bottom+"&address="+address;		
			 $("#messfind").bind("click",function() {			
					 window.showModalDialog(encodeURI(urly),"","dialogWidth:1100px;dialogHeight:600px;center:1;");			
			 });
            $("#messinsert").bind("click",function() {		
					window.showModalDialog(encodeURI(urlx),"","dialogWidth:1100px;dialogHeight:600px;center:1;");
			 });
		 }
			$("#chooseHouse").removeClass("buttonhover");// 清除选中状态
		}
	});
	
	$("#addHouse").click(function(){
		   map.clearAllFeatures();
		   if(cfeature&&cfeature.popup){
	    		map._markerLayer.map.removePopup(cfeature.popup);
	    		cfeature.popup.destroy();
	    		cfeature.popup = null;   		
		    }
			 if(addHouse&&addHouse.feature&&addHouse.feature.popup){
					map._markerLayer.map.removePopup(addHouse.feature.popup);
					addHouse.feature.popup.destroy();
					addHouse.feature.popup = null;  
				}
			  
			  var view=this.textContent;
			  var e=this;
      if(view=="新增房屋"){
		      e.textContent="停止操作";
		      addHouse=new FMapLib.AddHouse(map,addHouseFinished);
	      function addHouseFinished(editFeaturesEventArgs){
		   e.textContent="新增房屋";
			var ids = editFeaturesEventArgs.result.IDs,
            resourceInfo = editFeaturesEventArgs.result.resourceInfo;      
            if((ids && ids.length > 0) || (resourceInfo && resourceInfo.succeed)) { 
        	 if(window.confirm('保存成功,是否为该房屋录入普查信息?')){        	 
             var url="safecheck.survey.insert1?smuserid="+addHouse.smuserid+"&address="+addHouse.address;
             window.showModalDialog(encodeURI(url),"","dialogWidth:1100px;dialogHeight:600px;center:1;");             	    
             }
	        }else{
	    	 alert("服务器繁忙,保存失败!");
	        }
		  }
	  }else{
				 e.textContent="新增房屋";	
				 addHouse.stopDraw();				 
	  }	   
	});
	$("#searchHouse").click(function(){
		if(map){
		       map.clearMarkers();
	    	}
			var address = $("#inputaddress").val();
			var x=$("#inputx").val();
			var y=$("#inputy").val();		
			if(a=="0"){
			if(!!!address){
			     alert("请输入地址！");	
			     return;	     
		    }
			var BF = new FMapLib.BuildingFastQuery(map);
		    BF.queryBySafeAddress(address);
		    }
		    if(a=="1"){
		    if(!!!x){
		         alert("请输入横坐标！");
		         return;
		    }if(!!!y){    
		     alert("请输入纵坐标！");
		     return;
		    }
		    try{	     	    
		   if(map){   
			   map.addMarker(x,y,"/safemanage/resource/images/markerbig.png",32,32);// 在画点处标记一个自定义Marker；
			   map.setCenter(x,y);// 重新设置中心点
			   map.zoomTo(8);
			}	  
		    }catch(ex){alert(ex);alert("格式错误！")}
		       
		    }
	});
	
	$("#gps").click(function(){	
	if(this.value=="位置跟踪"){
		geolocate.open();// 开启定位功能
       this.value="关闭跟踪";
       this.textContent="关闭跟踪"
	}else{
		geolocate.close();// 关闭定位功能
	    this.value="位置跟踪";
	    this.textContent="位置跟踪"	
	}	
	});

});
// 右键取消地图操作
function stopDrop(){	
    map.stopDrop();
	
}
</script>