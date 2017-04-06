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
var layer,popup;
var url,markerLayer,markerLayer1;
$(function(){
//初始化地图
	 //map = new FMapLib.FMap("map");
	 //var l1 = map.map.getLayersByName("fangchanL");
	url = FMapLib.DemoURL.fangchanL;
	layer = new MapLib.Layer.TiledDynamicRESTLayer("fangchanL", url, {transparent: false, cacheEnabled: true}, {maxResolution:"auto"});
	layer.events.on({"layerInitialized":addLayer});
	
	markerLayer = new MapLib.Layer.Markers("qutianqi");
	markerLayer1 = new MapLib.Layer.Markers("shixiantianqi");
	
	map = new MapLib.Map("map",{controls: [
		//new MapLib.Control.LayerSwitcher(),
		new MapLib.Control.ScaleLine(),
		//new MapLib.Control.PanZoomBar({isShow: true}),
		//new MapLib.Control.MousePosition(),
		new MapLib.Control.Navigation({
			dragPanOptions: {
				enableKinetic: true
			}})]
	});
	map.events.on({"zoomend":zoomendHandle});
	
	//定义按钮样式
  $("#showBtn").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });
  $("#hideBtn").hover(function () {
		            $(this).addClass("buttonhover");
		        }, function () {
		            $(this).removeClass("buttonhover");
		        });		        
});

function addLayer() {
	map.addLayers([layer,markerLayer,markerLayer1]);
	map.setCenter(new MapLib.LonLat(FMapLib.MapCenter.x, FMapLib.MapCenter.y),2);
	
	//showWeatherLayer();
}
/*
*显示天气预报图层
*/
function showWeatherLayer() {
	map.allOverlays = true;    
	//子图层控制参数必设：url、mapName、SetLayerStatusParameters
	var layerStatusParameters = new MapLib.REST.SetLayerStatusParameters();
	var layerStatus = new MapLib.REST.LayerStatus();
	layerStatus.layerName = 'WEATHER_P@ORCL#1';
	layerStatus.isVisible = true;
	layerStatusParameters.layerStatusList.push(layerStatus);
	//设置资源在服务端保存的时间，单位为分钟，默认为10
	layerStatusParameters.holdTime = 10;
	
	var setLayerStatusService = new MapLib.REST.SetLayerStatusService(url);
	setLayerStatusService.events.on({ "processCompleted": createTempLayerCompleted});
	setLayerStatusService.processAsync(layerStatusParameters);
}
/*
*隐藏天气预报图层
*/
function hideWeatherLayer() {
	map.allOverlays = false;    
	//WEATHER_P@ORCL#1
	//子图层控制参数必设：url、mapName、SetLayerStatusParameters
	var layerStatusParameters = new MapLib.REST.SetLayerStatusParameters();
	var layerStatus = new MapLib.REST.LayerStatus();
	layerStatus.layerName = 'WEATHER_P@ORCL#1';
	layerStatus.isVisible = false;
	layerStatusParameters.layerStatusList.push(layerStatus);
	//设置资源在服务端保存的时间，单位为分钟，默认为10
	layerStatusParameters.holdTime = 30;
	
	var setLayerStatusService = new MapLib.REST.SetLayerStatusService(url);
	setLayerStatusService.events.on({ "processCompleted": createTempLayerCompleted});
	setLayerStatusService.processAsync(layerStatusParameters);
}

/*
*与服务器交互成功，创建临时图层
*/
function createTempLayerCompleted(createTempLayerEventArgs) {
	var tempLayerID = createTempLayerEventArgs.result.newResourceID;
	map.removeLayer(layer,true);

	layer = new MapLib.Layer.TiledDynamicRESTLayer("fangchanL", url, {transparent: true, cacheEnabled: false, layersID: tempLayerID}, {maxResolution: "auto", bufferImgCount: 0});
	//layer.bufferImgCount = 0;
	layer.events.on({"layerInitialized": addLayer1});
}
function addLayer1() {
	map.addLayers([layer]);
	map.setCenter(new MapLib.LonLat(FMapLib.MapCenter.x, FMapLib.MapCenter.y),3);
}
var baseurl = "${_share_file_url!''}/safemanage/resource/images/"
function showWeather(){
	hideWeather();
	if(map.getZoom() >= 2){
		markerLayer.setVisibility(true);
	}else{
		markerLayer.setVisibility(false);
	}
	var queryParam = new MapLib.REST.FilterParameter({ 
	    name: "WEATHER_P@ORCL"//, 
	   // attributeFilter: "ANNONOTE like '%"+value+"%'" 
	}); 
	var queryBySQLParams = new MapLib.REST.QueryBySQLParameters({ 
	    queryParams: [queryParam] 
	}); 
	var myQueryBySQLService = new MapLib.REST.QueryBySQLService(url, {eventListeners: { 
	    "processCompleted": queryCompleted, 
	    "processFailed": queryError 
	    } 
	}); 
	myQueryBySQLService.processAsync(queryBySQLParams); 
	function queryCompleted(QueryEventArgs){
		var path = FMapLib.baseurl;
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
						 //章丘市\商河县\济阳县\平阴县\长清区\济南市\
						 //历城区\天桥区\槐荫区\市中区\历下区\
						//var name = feature.attributes["NAME"];
						var code = feature.attributes["CODE"];
						if(code =='370181' || code =='370126' || code =='370125' || code =='370124' || code =='370113' || code =='370100'){
							var pointx = parseFloat(feature.attributes["SMX"]),
	                        pointy = parseFloat(feature.attributes["SMY"]),	                
	                        size = new MapLib.Size(42,30),
	                        offset = new MapLib.Pixel(-(size.w/2), -size.h);
	                        
	                        var w = feature.attributes["T12_WEA"];
	                        var img=getImg(w);
	                        var icon = new MapLib.Icon(baseurl + img, size, offset);
							var marker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy),icon);
							marker.info = feature;
							markerLayer1.addMarker(marker);
							marker.events.on({
								"click" : openInfoWin1,
								"scope" : marker
							});
						}else{
							var pointx = parseFloat(feature.attributes["SMX"]),
	                        pointy = parseFloat(feature.attributes["SMY"]),	                
	                        size = new MapLib.Size(42,30),
	                        offset = new MapLib.Pixel(-(size.w/2), -size.h),
	                        icon = new MapLib.Icon(baseurl + feature.attributes["IMG_PATH_1"], size, offset);
							var marker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy),icon);
							marker.info = feature;
							markerLayer.addMarker(marker);
							marker.events.on({
								"click" : openInfoWin,
								"scope" : marker
							});
						}
						
					}
					f=true;
				}else{
					alert("暂无数据！");
				}
			}
			/*if(f){
				var bound = markerLayer.getDataExtent();
				markerLayer.map.zoomToExtent(bound);
				var lonlat = bound.getCenterLonLat();
				markerLayer.map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
				if(markerLayer.map.getZoom()<2){
					markerLayer.map.zoomTo(4);
				}
			}
			*/
		}
	}
	function queryError(QueryEventArgs){//todo
		var arg = QueryEventArgs;
	}
	function openInfoWin(){
		if (popup) {
			markerLayer.map.removePopup(popup);
		}
	    var marker = this; 
	    var lonlat = marker.getLonLat(); 
	    var contentHTML = "<div style='\font-size:16px;opacity: 1.2;vertical-align:top;\'>"; //font-size:.8em; opacity: 0.8; line-height:5px;
	    contentHTML += "<div style='width:100%;text-align:center;font-size:16px;font-weight:bold;color:#1557F1;padding-top:15px;padding-bottom:10px;'>"+marker.info.attributes["NAME"]+"</div>";
	    //contentHTML += "<table>";
	   // contentHTML += "<tr>";
	    
	    //contentHTML += "<td>";
	    contentHTML += "<div style='width:130px;text-align:center;float:left;'>";// style='float:left;width:120px;'
	    contentHTML += "<div style='line-height:20px;'><font color='#0066cc'>今日</font>天气</div>";
	    if(marker.info.attributes["IMG_PATH_1"] && marker.info.attributes["IMG_PATH_2"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG_PATH_1"]+"' style='border:0;width:42px;height:30px'/><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG_PATH_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG_PATH_1"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG_PATH_1"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG_PATH_2"])
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG_PATH_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    
	    contentHTML += "<div style='line-height:20px;'><font color='#f00'>"+marker.info.attributes["TEMPERATURE"]+"</font></div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WEATHER"]+"</div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WIND_CONT"]+"</div>";
	    contentHTML += "<div style='line-height:20px;text-align: left;padding-left:20px;padding-top:5px;'>当前温度："+marker.info.attributes["RETTEMP"]+"</div>";
	    contentHTML += "<div style='line-height:20px;text-align: left;padding-left:20px;'>风力风向："+marker.info.attributes["RETWIND"]+"</div>";
	    contentHTML += "<div style='line-height:20px;text-align: left;padding-left:20px;'>"+marker.info.attributes["HUMIDITY"]+"</div>";
	    contentHTML += "</div>";
	   // contentHTML += "</td>";
	    
	   // contentHTML += "<td>";
	    contentHTML += "<div style='text-align:center;width:130px;float:left;'>";// style='width:120px; padding:0 130px;'
	    contentHTML += "<div style='line-height:20px;'></div>";
	    contentHTML += "<div style='line-height:20px;'><font color='#0066cc'>明日</font>天气</div>";
	    if(marker.info.attributes["IMG48_1"] && marker.info.attributes["IMG48_2"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG48_1"]+"' style='border:0;width:42px;height:30px'/><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG48_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG48_1"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG48_1"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG48_2"])
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG48_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    
	    contentHTML += "<div style='line-height:20px;'><font color='#f00'>"+marker.info.attributes["TEMPH48"]+"</font>~<font color='#4899be'>"+marker.info.attributes["TEMPL48"]+"</font></div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WEATHER48"]+"</div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WIND_CONT48"]+"</div>";
	    contentHTML += "</div>";
	    //contentHTML += "</td>";
	    
	    //contentHTML += "<td>";
	    contentHTML += "<div style='text-align:center;width:130px;float:left;'>";// style='float:right;width:120px;'
	    contentHTML += "<div style='line-height:20px;'></div>";
	    contentHTML += "<div style='line-height:20px;'><font color='#0066cc'>后天</font>天气</div>";
	    if(marker.info.attributes["IMG72_1"] && marker.info.attributes["IMG72_2"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG72_1"]+"' style='border:0;width:42px;height:30px'/><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG72_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG72_1"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG72_1"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG72_2"])
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl + marker.info.attributes["IMG72_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    
	    contentHTML += "<div style='line-height:20px;'><font color='#f00'>"+marker.info.attributes["TEMPH72"]+"</font>~<font color='#4899be'>"+marker.info.attributes["TEMPL72"]+"</font></div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WEAWTHER72"]+"</div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WIND_CONT72"]+"</div>";
	    contentHTML += "</div>";
	    
	    //contentHTML += "<td>";
	   // contentHTML += "<tr>";
	    //contentHTML += "<table>";
	    contentHTML += "</div>";
	 
	    popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,null,true); 
	    markerLayer.map.addPopup(popup); 
	}
}
//#076EA8 边框   #FFFFFF   #EEFEFE   orange
function openInfoWin1(){
	if (popup) {
			markerLayer1.map.removePopup(popup);
	}
    var marker = this; 
    var lonlat = marker.getLonLat(); 
    var contentHTML = "<div id='content' style='width: 480px;padding-top:10px;padding-bottom:10px;padding-left:15px;opacity: 0.8;overflow: hidden;'>"+
    "<div style='width:100%;text-align:center;font-size:16px;font-weight:bold;color:#1557F1;padding-top:5px;padding-bottom:10px;'>"+marker.info.attributes["NAME"]+"</div>"+
    "<div id='tab_bar' style='width: 100%;float: left;'>"+
    "<ul style='padding: 0px; margin: 0px; text-align: center;font-size:14px;'>"+
	    "<li id='tab1' onclick='tabChange(1)' style='background-color: #EEFEFE;list-style-type: none; float: left; width: 130px;padding-top:5px;padding-bottom:5px;'><font color='blue'>今天</font>天气</li> "+
	    "<li id='tab2' onclick='tabChange(2)' style='list-style-type: none; float: left; width: 130px;background-color: #CED9D9;padding-top:5px;padding-bottom:5px;'><font color='blue'>明后天</font>天气</li>"+
    "</ul></div>"+
    "<div style='width: 100%; height: 100%; background-color: #EEFEFE; display: none; float: left;display: block;text-align: center;vertical-align:middle;' id='tab1_content'>"+
	    "<div style='vertical-align:middle;line-height: 22PX ;text-align: center;font-size:15px;float: left;width:35%;height:100%;padding-top:20px;'>"+
		    "<div style='font-size:12px;'>"+marker.info.attributes["T_REPORTTIME"]+":00 实况</div>"+
		    "<div style='text-align:left;padding-left:20px;padding-top:5px;'>当前气温 "+marker.info.attributes["T_TEMPERATURE"]+"°C</div>"+
		    "<div style='text-align:left;padding-left:20px;padding-top:5px;'>风力风向 "+marker.info.attributes["T_WIND"]+"级</div>"+
		    "<div style='text-align:left;padding-left:20px;padding-top:5px;'>相对湿度 "+marker.info.attributes["T_HUMIDITY"]+"%</div>"+
		    "<div style='text-align:left;padding-left:20px;'>降水 "+marker.info.attributes["T_PRECIPITATION"]+"</div>"+
		    "<div style='text-align:left;padding-left:20px;'>空气质量(AQI) "+marker.info.attributes["T_AQI"]+"</div>"+
	    "</div>"+
	    "<div style='border:1px solid #076EA8;line-height: 22PX ;text-align: center;font-size:14px;float: left;width:32%;height:100%;padding-top:15px;padding:bottom:10px;'>"+
		    "<div>"+marker.info.attributes["T_DATEWEAK"]+"</div>"+
		    "<div>"+marker.info.attributes["T12_DAYNIGHT"]+"</div>"+
		    "<div><img align='absmiddle' src='"+baseurl + getImg(marker.info.attributes["T12_WEA"])+"' style='border:0;width:42px;height:30px'/></div>"+
		    "<div> "+marker.info.attributes["T12_WEA"]+"</div>"+
		    "<div> "+marker.info.attributes["T12_TEMP"]+"</div>"+
		    "<div>"+marker.info.attributes["T12_WIND"]+"</div>"+
		    "<div style='font-size:12px;color:#E85D26;'>"+marker.info.attributes["T12_SUNTIME"]+"</div>"+
	    "</div>"+
	    "<div style='border:1px solid #076EA8;line-height: 22PX ;text-align: center;font-size:14px;float: left;width:32%;height:100%;padding-top:15px;padding:bottom:10px;'>"+
		    "<div>"+marker.info.attributes["T_DATEWEAK"]+"</div>"+
		    "<div>"+marker.info.attributes["T24_DAYNIGHT"]+"</div>"+
		    "<div><img align='absmiddle' src='"+baseurl + getImg(marker.info.attributes["T24_WEA"])+"' style='border:0;width:42px;height:30px'/></div>"+
		    "<div> "+marker.info.attributes["T24_WEA"]+"</div>"+
		    "<div> "+marker.info.attributes["T24_TEMP"]+"</div>"+
		    "<div>"+marker.info.attributes["T24_WIND"]+"</div>"+
		    "<div style='font-size:12px;color:#E85D26;'>"+marker.info.attributes["T24_SUNTIME"]+"</div>"+
	    "</div>"+
    "</div>"+
    "<div style='width: 100%; height: 100%; background-color: #EEFEFE; display: none; float: left;text-align: center;' id='tab2_content'>"+
	    "<div style='border:1px solid #076EA8;line-height: 22PX ;text-align: center;font-size:14px;float: left;width:49%;height:100%;padding-top:15px;padding:bottom:10px;'>"+
	    	"<div>"+marker.info.attributes["M_DATEWEAK"]+"</div>"+
	    	"<div style='float: left;width:50%;height:100%;'>"+
	    		"<div>"+marker.info.attributes["MD_DAYNIGHT"]+"</div>"+
			    "<div><img align='absmiddle' src='"+baseurl + getImg(marker.info.attributes["MD_WEA"])+"' style='border:0;width:42px;height:30px'/></div>"+
			    "<div> "+marker.info.attributes["MD_WEA"]+"</div>"+
			    "<div> "+marker.info.attributes["MD_TEMP"]+"</div>"+
			    "<div>"+marker.info.attributes["MD_WIND"]+"</div>"+
			    "<div style='font-size:12px;color:#E85D26;'>"+marker.info.attributes["MD_SUNTIME"]+"</div>"+
	    	"</div>"+
	    	"<div style='float: left;width:50%;height:100%;'>"+
	    		"<div>"+marker.info.attributes["MN_DAYNIGHT"]+"</div>"+
			    "<div><img align='absmiddle' src='"+baseurl + getImg(marker.info.attributes["MN_WEA"])+"' style='border:0;width:42px;height:30px'/></div>"+
			    "<div> "+marker.info.attributes["MN_WEA"]+"</div>"+
			    "<div> "+marker.info.attributes["MN_TEMP"]+"</div>"+
			    "<div>"+marker.info.attributes["MN_WIND"]+"</div>"+
			    "<div style='font-size:12px;color:#E85D26;'>"+marker.info.attributes["MN_SUNTIME"]+"</div>"+
	    	"</div>"+
	    "</div>"+
	     "<div style='border:1px solid #076EA8;line-height: 22PX ;text-align: center;font-size:14px;float: left;width:49%;height:100%;padding-top:15px;padding:bottom:10px;'>"+
	    	"<div>"+marker.info.attributes["H_DATEWEAK"]+"</div>"+
	    	"<div style='float: left;width:50%;height:100%;'>"+
	    		"<div>"+marker.info.attributes["HD_DAYNIGHT"]+"</div>"+
			    "<div><img align='absmiddle' src='"+baseurl + getImg(marker.info.attributes["HD_WEA"])+"' style='border:0;width:42px;height:30px'/></div>"+
			    "<div> "+marker.info.attributes["HD_WEA"]+"</div>"+
			    "<div> "+marker.info.attributes["HD_TEMP"]+"</div>"+
			    "<div>"+marker.info.attributes["HD_WIND"]+"</div>"+
			    "<div style='font-size:12px;color:#E85D26;'>"+marker.info.attributes["HD_SUNTIME"]+"</div>"+
	    	"</div>"+
	    	"<div style='float: left;width:50%;height:100%;'>"+
	    		"<div>"+marker.info.attributes["HN_DAYNIGHT"]+"</div>"+
			    "<div><img align='absmiddle' src='"+baseurl + getImg(marker.info.attributes["HN_WEA"])+"' style='border:0;width:42px;height:30px'/></div>"+
			    "<div> "+marker.info.attributes["HN_WEA"]+"</div>"+
			    "<div> "+marker.info.attributes["HN_TEMP"]+"</div>"+
			    "<div>"+marker.info.attributes["HN_WIND"]+"</div>"+
			    "<div style='font-size:12px;color:#E85D26;'>"+marker.info.attributes["HN_SUNTIME"]+"</div>"+
	    	"</div>"+
	    "</div>"+
    "</div>"+
    "</div>";

 	popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,null,true); 
 	markerLayer1.map.addPopup(popup); 
}

function tabChange(a){
	//alert(a)
	if(a == 1){
		var li1 = document.getElementById("tab1");
		li1.style.backgroundColor = "#EEFEFE";
		var li2 = document.getElementById("tab2");
		li2.style.backgroundColor = "#CED9D9";
		var div1 = document.getElementById("tab1_content");
		div1.style.display = "block";
		var div2 = document.getElementById("tab2_content");
		div2.style.display = "none";
	}else{
		var li1 = document.getElementById("tab1");
		li1.style.backgroundColor = "#CED9D9";
		var li2 = document.getElementById("tab2");
		li2.style.backgroundColor = "#EEFEFE";
		var div1 = document.getElementById("tab1_content");
		div1.style.display = "none";
		var div2 = document.getElementById("tab2_content");
		div2.style.display = "block";
	}
}
function getImg(w){
	var img;
	if(w.indexOf("阴")>-1){
		img = "yin";
	}
	if(w.indexOf("晴")>-1){
		img = "qing";
	}
	if(w.indexOf("雨")>-1){
		img = "yu";
	}
	if(w.indexOf("雪")>-1){
		img = "xue";
	}
	if(w.indexOf("雨夹雪")>-1){
		img = "yujiaxue";
	}
	if(w.indexOf("多云")>-1){
		img = "duoyun";
	}
	if(w.indexOf("雾")>-1){
		img = "wu";
	}
    return img = "weather/"+img+".gif"
}
function hideWeather(){
	if (popup) {
		markerLayer.map.removePopup(popup);
		markerLayer1.map.removePopup(popup);
	}
	markerLayer.clearMarkers();
	markerLayer1.clearMarkers();
}

function zoomendHandle(){
	//alert(map.getZoom())
	//map.getZoom() >=3时显示各区天气  
	//<3时，显示城区、3县、章丘市、长清区、天气
	if(map.getZoom() >= 2){
		markerLayer.setVisibility(true);
	}else{
		markerLayer.setVisibility(false);
	}
}
</script>
<div>
<input id="showBtn" class="button" type="button" value="显示天气" onclick="showWeather()" />
<input id="hideBtn" class="button" type="button" value="隐藏天气" onclick="hideWeather()" />
</div>
<div id="map" style="position:absolute;left:0px;right:0px;width:99.8%;height:93%;" visibility="visible"></div> 