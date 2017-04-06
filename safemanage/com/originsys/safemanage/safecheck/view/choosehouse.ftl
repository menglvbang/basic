
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
<div id="tooldiv" style=" margin-top:5px;margin-bottom:0px;"><button class="button" id="chooseHouse">选取房屋</button>&nbsp<button class="button" id="addHouse">新增房屋</button>
<input style="height:24px;width:150px" class="button" name="" id="inputaddress" placeholder="请输入房屋地址"  type="text" />
<select id="search_way" name="ways" class="button" style="height:27px"><option value="0">房屋地址</option><option value="1">平面坐标 </option></select>&nbsp
<button class="button" id="searchHouse">地址/坐标定位</button>&nbsp
<button class="button" id="gps" style="" value="位置跟踪">位置跟踪</button>&nbsp
<button class="button" id="poiadd" style="">标注危险点</button>
<button class="button" id="poiview" style="">查看危险点</button>
</div>
<!--<div id="tooldiv" style="position:absolute;left:0px;right:0px;width:100%;height:100%;" visibility="visible" />-->
<div id="map" style="position:absolute;left:0px;right:0px;width:99%;height:91%;border-color:white" visibility="visible"></div> 
<script src="${map_url!''}/gis/FMapLib/FMapLib.Include-1.0.4.js" type="text/javascript"></script>
<script type="text/javascript">
var map,cfeature,geolocate,a="0",addHouse,addPoi,chooseHouse;
$(function(){
$('#search_way').change(function(){
     a=$(this).children('option:selected').val();    
     //初始化输入框  
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
  //初始化地图   
  map = new FMapLib.FMap("map","safecheck2","${user.region_id!''}"); 
  var buildingIDs="${user._internal_state!''}";
  if(""!=buildingIDs)
  queryByParam(buildingIDs,'SMUSERID','smuserid',"ST_RIDRGN_safecheck@ORCL")
  var toolbar=new FMapLib.ToolBar("tooldiv",map);
  geolocate = new FMapLib.Geolocate(map);//gps跟踪定位
  var ss=new FMapLib.SatelliteMapSwitcher(map);//影像图切换工具
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
     $("#poiadd").hover(function () {
         $(this).addClass("buttonhover");
     }, function () {
         $(this).removeClass("buttonhover");
     });
     $("#poishow").hover(function () {
         $(this).addClass("buttonhover");
     }, function () {
         $(this).removeClass("buttonhover");
     });
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
		 if(addPoi&&addPoi.feature&&addPoi.feature.popup){
				map._markerLayer.map.removePopup(addPoi.feature.popup);
				addPoi.feature.popup.destroy();
				addPoi.feature.popup = null;  
		  }
		 var view=this.textContent;
		  var e=this;
	   if(view=="选取房屋"){
	      e.textContent="停止操作";
	   chooseHouse=new FMapLib.ChooseHouse(map,choosefinished);//点选房屋ＡＰＩ	
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
	    function createInfoWindow(feature){
	    	// 获取西南角坐标（left，bottom）/房屋点坐标smx,smy	    
			var left=feature.geometry.getBounds()['left']||feature.attributes['SMX'];			
			var bottom=feature.geometry.getBounds()['bottom']||feature.attributes['SMY'];		 
			// 获取地址
			var address=feature.attributes['ADDRESS'];
			// 获取smuserid
			var smuserid=feature.attributes['SMUSERID'];		
			var checkstate;		
				checkstate=feature.attributes['CHECKSTATE2'];//安全检查状态			
			var lonlat = feature.geometry.getBounds().getCenterLonLat();
			var url="safecheck.";
			// 未检查的feature调用insert/insert1服务实现信息录入
			if (checkstate==0){		
			var contentHTML = "<div style='font-size:.8em; opacity: 1; line-height:30px; overflow-y:hidden;'>"
					+ "<span style='color:#005ebc;font-size: 18px;font-family:微软雅黑;'>房屋信息</span><br>";
			contentHTML += "<div style='font-size:1.2em;margin-left:15px;padding-bottom:0px'>楼幢编码：" + smuserid	+ "</div>"; 
			contentHTML += "<div style='font-size:1.2em;margin-left:15px'>地址：" + address	+ "</div>";
			if(buildingIDs==""||-1!=buildingIDs.indexOf(smuserid)){				
			contentHTML +="<p  style='text-align:center;'><input type='submit' name='Submit' id='messinsert' value='日常检查' style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";			
			
			contentHTML +="<p  style='text-align:center;'><input type='submit' name='Submit' id='accidentinsert' value='事故记录' style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";			
			
			contentHTML +="<p  style='text-align:center;'><input type='submit' name='Submit' id='repairinsert' value='维修记录' style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";			
			}
			contentHTML += "</div>";
			// 初始化一个弹出窗口，当某个地图要素被选中时会弹出此窗口，用来显示选中地图要素的属性信息
			var popup = new MapLib.Popup.FramedCloud("popwin",
					new MapLib.LonLat(lonlat.lon, lonlat.lat), null,
					contentHTML, null, true, null, true);
			   cfeature.popup = popup;
			   map.addPopup(popup);
			   var url1=url;
			   if(smuserid<0)//针对新建房屋操作
			   url1+="building.forinsert1?smuserid="+smuserid+"&left="+left+"&bottom="+bottom+"&address="+address;
			       else//针对已有房屋操作
			   url1+="building.forinsert?smuserid="+smuserid+"&left="+left+"&bottom="+bottom+"&address="+address;				
			$("#messinsert").bind("click",function() {				
			  window.showModalDialog(encodeURI(url1),"","dialogWidth:1100px;dialogHeight:600px;center:1;");
			});
			  var url2=url;			    
			  if(smuserid<0)//针对新建房屋操作
			   url2+="accident.foradd?building_id="+smuserid;
			       else//针对已有房屋操作
			   url2+="accident.foradd?building_id="+smuserid;	
			$("#accidentinsert").bind("click",function() {					
			  window.showModalDialog(encodeURI(url2),"","dialogWidth:1100px;dialogHeight:600px;center:1;");					
			});
			  var url3=url;
			  if(smuserid<0)//针对新建房屋操作
			   url3+="repair.foradd?building_id="+smuserid;
			       else//针对已有房屋操作
			   url3+="repair.foradd?building_id="+smuserid;		
			$("#repairinsert").bind("click",function() {			
			  window.showModalDialog(encodeURI(url3),"","dialogWidth:1100px;dialogHeight:600px;center:1;");			
			});
		  }
			// 已经检查的feature调用detail服务实现信息查看
			else{				
			   var  contentHTML2 = "<div style='font-size:.8em; opacity: 1; line-height:30px; overflow-y:hidden;'>"
					+ "<span style='color:#005ebc;font-size: 18px;font-family:微软雅黑;'>房屋信息</span><br>";
			   contentHTML2 += "<div style='font-size:1.2em;margin-left:15px;'>楼幢编码：" + smuserid	+ "</div>"; 
				contentHTML2 += "<div style='font-size:1.2em;margin-left:15px'>地址：" + address	+ "</div>";
				if(buildingIDs==""||-1!=buildingIDs.indexOf(smuserid)){	
			   contentHTML2 +="<p  style='text-align:center;'><input type='submit' name='Submit' id='messfind' value='信息查看' style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";			

			   contentHTML2 +="<p  style='text-align:center;'><input type='submit' name='Submit' id='messinsert' value='日常检查' style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";				   
               
               contentHTML2 +="<p  style='text-align:center;'><input type='submit' name='Submit' id='accidentinsert' value='事故记录' style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";				   
               
               contentHTML2 +="<p  style='text-align:center;'><input type='submit' name='Submit' id='repairinsert' value='维修记录' style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";				   
			   }
			   contentHTML2 += "</div>";
			// 初始化一个弹出窗口，当某个地图要素被选中时会弹出此窗口，用来显示选中地图要素的属性信息
		 var   popup2 = new MapLib.Popup.FramedCloud("popwin",
					new MapLib.LonLat(lonlat.lon, lonlat.lat), null,
					contentHTML2, null, true, null, true);
			  cfeature.popup = popup2;	
			  map.addPopup(popup2);	
			  var a= url+"saferecorddetail?building_id="+smuserid;			
		   $("#messfind").bind("click",function() {			
					 window.showModalDialog(encodeURI(a),"","dialogWidth:1100px;dialogHeight:600px;center:1;");			
		   });
            var url1=url;			   
			   url1+="building.forinsert?smuserid="+smuserid+"&left="+left+"&bottom="+bottom+"&address="+address;				
			$("#messinsert").bind("click",function() {				
			  window.showModalDialog(encodeURI(url1),"","dialogWidth:1100px;dialogHeight:600px;center:1;");
			});
			  var url2=url;		  
			   url2+="accident.foradd?building_id="+smuserid;	
			$("#accidentinsert").bind("click",function() {					
			  window.showModalDialog(encodeURI(url2),"","dialogWidth:1100px;dialogHeight:600px;center:1;");					
			});
			  var url3=url;			  
			   url3+="repair.foradd?building_id="+smuserid;		
			$("#repairinsert").bind("click",function() {			
			  window.showModalDialog(encodeURI(url3),"","dialogWidth:1100px;dialogHeight:600px;center:1;");			
			});
	       }
			$("#chooseHouse").removeClass("buttonhover");//清除选中状态	
		  }	   
	     
	   });
	//点击新增房屋按钮
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
		  if(addPoi&&addPoi.feature&&addPoi.feature.popup){
				map._markerLayer.map.removePopup(addPoi.feature.popup);
				addPoi.feature.popup.destroy();
				addPoi.feature.popup = null;  
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
        	 alert("新建房屋保存成功!");           
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
		   map.addMarker(x,y,"/safemanage/resource/images/markerbig.png",32,32);//在画点处标记一个自定义Marker；
		   map.setCenter(x,y);//重新设置中心点
		   map.zoomTo(8);
		}	  
	    }catch(ex){alert(ex);alert("格式错误！")
	    }	     
	    }
	});
	
	$("#gps").click(function(){	
	if(this.value=="位置跟踪"){
		geolocate.open();//开启定位功能
       this.value="关闭跟踪";
       this.textContent="关闭跟踪"
	}else{
		geolocate.close();//关闭定位功能
	    this.value="位置跟踪";
	    this.textContent="位置跟踪"	
	}	
	});
	$("#poiadd").click(function(){
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
		  if(addPoi&&addPoi.feature&&addPoi.feature.popup){
				map._markerLayer.map.removePopup(addPoi.feature.popup);
				addPoi.feature.popup.destroy();
				addPoi.feature.popup = null;  
			}
		var view=this.textContent;
		var e=this;
		if(view=="标注危险点"){
		  e.textContent="停止操作";
		  addPoi=new FMapLib.AddPoi(map,addfinished);
		  function addfinished(mes){
			 e.textContent="标注危险点";
			 alert(mes);	
		  }
		}
		else{
			e.textContent="标注危险点";
			addPoi.stopDraw();		
		}
	
	});	
	$("#poiview").click(function(){
		var view=this.textContent;
		if(view=="查看危险点"){
		this.textContent="隐藏危险点";
		FMapLib.GetAllFeaturesByCondition(['ST_Dangers_P@ORCL'],null,null,getDangersFinished);
		var count=0;
		function getDangersFinished(QueryEventArgs){
				var result,recordsets,f=false
						if(!QueryEventArgs.result) return;
						result = QueryEventArgs.result;
						if(!result.recordsets) return;
						recordsets=result.recordsets;
						if(recordsets.length){
							for(var i=0;i<recordsets.length;i++){
								if(recordsets[i].features && recordsets[i].features.length){
									var features = recordsets[i].features;
									for(var j=0;j<features.length;j++){
										var feature = features[j];										 
										var pointx = parseFloat(feature.attributes["SMX"]),
				                        pointy = parseFloat(feature.attributes["SMY"]),	                
				                        size = new MapLib.Size(32,30),
				                        offset = new MapLib.Pixel(-(size.w/2), -size.h),
				                        icon = new MapLib.Icon("/safemanage/resource/images/marker11.png", size, offset);
										var marker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy),icon);										
										marker.info = feature;
										//marker.info.attr = attr[i];
										map._markerLayer.addMarker(marker);										
										marker.events.on({
											"click" : openInfoWin,
											"scope" : marker
										});
										marker.events.on({
											"mouseover" : changeIconall,
											"scope" : marker
										});
										marker.events.on({
											"mouseout" : returnIconall,
											"scope" : marker
										});
										count=count+1;
									}
									f=true;
								}
							}
							if(f){
								var bound = map._markerLayer.getDataExtent();
								map._markerLayer.map.zoomToExtent(bound);
								var lonlat = bound.getCenterLonLat();
								map._markerLayer.map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
								if(map._markerLayer.map.getZoom()<2){
									map._markerLayer.map.zoomTo(4);
								}	
								FMapLib.MapAlert(map.map,"推荐结果",count+"个",true);	
							}else{								
								alert("暂无数据！");
							}
							
						}
		  }
		  
		  var isclosed=true;
		  var popup;
			function openInfoWin(){
				if (popup) {
					map._markerLayer.map.removePopup(popup);
				}
			    var marker = this; 
			    var lonlat = marker.getLonLat(); 
			    var contentHTML = "<div style=\'font-size:14px; opacity: 0.8; overflow-y:hidden;\'>"; 			    
			    contentHTML += "<div><input type='submit' name='Submit' id='deleteDanger' value='删除记录'/></div></div>";
			    var size = new MapLib.Size(32,30),
		        offset = new MapLib.Pixel(-(size.w), -size.h),
		        icon = new MapLib.Icon("/safemanage/resource/images/marker11.png", size, offset);
			    popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,icon,true,closeCallback); 
			    map._markerLayer.map.addPopup(popup);	
			    isclosed=false;
				$("#deleteDanger").bind("click",function() {
					var id=marker.info.attributes["SMID"]
					new FMapLib.DestoryFeatureById(id,FMapLib.DemoURL.fangchan1_ST_Dangers_P);
					
				});
			}
			
			//改变marker图片地址
			function changeIconall(){
				if (popup) {
					map._markerLayer.map.removePopup(popup);
				}
			    var marker = this; 
			    var lonlat = marker.getLonLat(); 
			    
			    ///var contentHTML = "<div style=\'overflow-y:hidden;width:100%;FILTER: progid:DXImageTransform.Microsoft.Gradient(gradientType=0,startColorStr=#b8c4cb,endColorStr=red);background: -ms-linear-gradient(top, #fff,  #0000ff);\'>"; 
			    var contentHTML = "<div style=\'font-size:14px; opacity: 0.8; overflow-y:hidden;\'>"; 
			    contentHTML += "<div>"+marker.info.attributes["REMARK"]+"</div></div>";
			    
			    var size = new MapLib.Size(32,30),
		        offset = new MapLib.Pixel(-(size.w), -size.h),
		        icon = new MapLib.Icon("/safemanage/resource/images/marker11.png", size, offset);
			    
			    popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,icon,true);
			    //popup.autoSize=false;
			    map._markerLayer.map.addPopup(popup);
			    this.setUrl("/safemanage/resource/images/markerbig.png");
			    //alert(a1+"  "+new MapLib.LonLat(lonlat.lon,lonlat.lat)+"  "+ll);
			}
			//恢复marker图片地址
			function returnIconall(){
				this.setUrl("/safemanage/resource/images/marker11.png");
				if(isclosed){
					if (popup) {
						map._markerLayer.map.removePopup(popup);
					}
				}
				
			}
			function closeCallback(){
				isclosed=true;
				if (popup) {
					map._markerLayer.map.removePopup(popup);
				}
			}
		}else{
			this.textContent="查看危险点";
			map.clearAllFeatures();
		}
	});
	
});
//右键取消地图操作
function stopDrop(){	
    map.stopDrop();
}
var style = {
	strokeColor: "#304DBE",
	strokeWidth: 1,
	pointerEvents: "visiblePainted",
	pointRadius: 5,
	fillColor: "#304DBE",
	fillOpacity: 0.5
};
function queryByParam(para,attr,type,layer){
	var queryParam = new MapLib.REST.FilterParameter({ 
		    name: layer, 
		    attributeFilter: attr+" in ("+para+")" 
		}); 

	var queryBySQLParams = new MapLib.REST.QueryBySQLParameters({ 
	    queryParams: [queryParam] 
	}); 
	var myQueryBySQLService = new MapLib.REST.QueryBySQLService(FMapLib.DemoURL.fangchan, {eventListeners: { 
	    "processCompleted": queryCompleted, 
	    "processFailed": queryError 
	    } 
	}); 
	myQueryBySQLService.processAsync(queryBySQLParams); 
	
	function queryCompleted(QueryEventArgs){
		var path = FMapLib.baseurl;
		var result,recordsets,f=false,points=[],f1=false
		if(!QueryEventArgs.result) return;
		result = QueryEventArgs.result;
		if(!result.recordsets) return;
		recordsets=result.recordsets;
		if(recordsets.length){
			for(var i=0;i<recordsets.length;i++){
				if(recordsets[i].features && recordsets[i].features.length){
					var features = recordsets[i].features;
					for(var j=0;j<features.length;j++){
						var feature = features[j];					
							feature.style = style;
							map._vectorLayer3.addFeatures(feature);											
	                }
				}
			}
	                 
				var bound = map._vectorLayer3.getDataExtent();
				map._vectorLayer3.map.zoomToExtent(bound);
				var lonlat = bound.getCenterLonLat();
				map._vectorLayer3.map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));			
				
			}
	
	}	

	function queryError(QueryEventArgs){//todo
		var arg = QueryEventArgs;
	}
} 
</script>