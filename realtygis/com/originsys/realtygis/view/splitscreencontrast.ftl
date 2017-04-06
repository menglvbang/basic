<script src="${_share_file_url!''}/gis/FMapLib/FMapLib.Include.js" type="text/javascript"></script>
<style>
.td12{text-align:right;padding-right:12px;background-color:#E1F1FE;color:#2a51a4;}
.td13{padding-left:12px;background-color:#E1F1FE;color:#2a51a4;width:400px;}
</style>
<script type="text/javascript">

var mapnew;//定义最新地图map对象
var mapold;//定义历史版本地图map对象
var layernew;//定义mapnew的图层
var layerold;//定义mapold的图层
var layersArr = new Array();// 重要数组！存放地图图层
var currentlayer = new Array();// 当前地图图层名
var default_mapname;//默认地图版本名称
var versionname;//历史版本名称
var popUpLeft;
var popUpRight;
var leftdata,rightdata,leftFlag=false,rightFlag=false;
var copyStyle={
            strokeColor: "#19EDDF",
            strokeWidth: 1,
            pointerEvents: "visiblePainted",
            fillColor: "#19EDDF",
            fillOpacity: 0.7,
            pointRadius: 6,
            label: "",
            fontSize: 14,
            fontWeight: "normal",
            cursor: "pointer"
        };	
	// 初始化_mapNamesArr,_mapUrlsArr的函数，当前执行。
	 
	var _mapNamesArr = new Array();// 地图名称数组
	var _mapUrlsArr = new Array();// 地图地址数组
	(function() {

		getMapUrl();
		
	})();
	
	
//定义最新地图地址
var  urlnew = FMapLib.DemoURL.baseUrl+"${map.default_mapnumber!''}";
//定义历史版本地图地址
var  urlold = FMapLib.DemoURL.baseUrl+"${map.mapname!''}";
var featuresLayer1;
var featuresLayer2;
function init(){   

	$.ajax({ 
          type : "post", 
          url : "realtygis.versionmanagerpopup", 
          data : "" , 
          async : false, 
          success : function(data){ 
      		var jdata = jQuery.parseJSON(data);
			var len = jdata.root.length;
			for (i = 0; i < len; i++) {
				if (jdata.root[i].version_number!=null&&jdata.root[i].default_map=="1001") {
				  default_mapname=jdata.root[i].version_name;  
				}
				if(jdata.root[i].version_number==${map.mapname!''}){
				versionname= jdata.root[i].version_name;
				}
			}
		
          } 
    }); 
	mapnew = new MapLib.Map("newmapdiv", {
		controls : [
			new MapLib.Control.ScaleLine(),
			new MapLib.Control.MousePosition(),
			new MapLib.Control.KeyboardDefaults()
		 ],
		units : "m"
	}); 
	mapold = new MapLib.Map("oldmapdiv", {
		controls : [
			new MapLib.Control.ScaleLine(),
			new MapLib.Control.MousePosition(),
			new MapLib.Control.KeyboardDefaults()
		],
		units : "m"
	}); 
	
	featuresLayer1 = new MapLib.Layer.Vector("featuresLayer1");
	featuresLayer2 = new MapLib.Layer.Vector("featuresLayer2");
	
	//重写MapLib.Control.Navigation类，重写了defaultClick,defaultDblRightClick和wheelChange方法，使鼠标双击和滚动的时候能同时改变mapnew和mapold两个地图
	MapLib.Control.Navigation = MapLib.Class(MapLib.Control, {
			dragPan: null,
			dragPanOptions: null,
			pinchZoom: null,
			pinchZoomOptions: null,
			documentDrag: false,
			zoomBox: null,
			zoomBoxEnabled: true,
			zoomWheelEnabled: true,
			mouseWheelOptions: null,
			handleRightClicks: false,
			zoomBoxKeyMask: MapLib.Handler.MOD_SHIFT,
			autoActivate: true,
			initialize: function(a) {
				this.handlers = {};
				MapLib.Control.prototype.initialize.apply(this, arguments)
			},
			destroy: function() {
				this.deactivate();
				if (this.dragPan) {
					this.dragPan.destroy()
				}
				this.dragPan = null;
				if (this.zoomBox) {
					this.zoomBox.destroy()
				}
				this.zoomBox = null;
				if (this.pinchZoom) {
					this.pinchZoom.destroy()
				}
				this.pinchZoom = null;
				MapLib.Control.prototype.destroy.apply(this, arguments)
			},
			activate: function() {
				this.dragPan.activate();
				if (this.zoomWheelEnabled) {
					this.handlers.wheel.activate()
				}
				this.handlers.click.activate();
				if (this.zoomBoxEnabled) {
					this.zoomBox.activate()
				}
				if (this.pinchZoom) {
					this.pinchZoom.activate()
				}
				return MapLib.Control.prototype.activate.apply(this, arguments)
			},
			deactivate: function() {
				if (this.pinchZoom) {
					this.pinchZoom.deactivate()
				}
				this.zoomBox.deactivate();
				this.dragPan.deactivate();
				this.handlers.click.deactivate();
				this.handlers.wheel.deactivate();
				return MapLib.Control.prototype.deactivate.apply(this, arguments)
			},
			draw: function() {
				if (this.handleRightClicks) {
					this.map.viewPortDiv.oncontextmenu = MapLib.Function.False
				}
				var a = {
					click: this.defaultClick,
					dblclick: this.defaultDblClick,
					dblrightclick: this.defaultDblRightClick
				};
				var c = {
					"double": true,
					stopDouble: true
				};
				this.handlers.click = new MapLib.Handler.Click(this, a, c);
				this.dragPan = new MapLib.Control.DragPan(MapLib.Util.extend({
					map: this.map,
					documentDrag: this.documentDrag
				},
				this.dragPanOptions));
				this.zoomBox = new MapLib.Control.ZoomBox({
					map: this.map,
					keyMask: this.zoomBoxKeyMask
				});
				this.dragPan.draw();
				this.zoomBox.draw();
				this.handlers.wheel = new MapLib.Handler.MouseWheel(this, {
					up: this.wheelUp,
					down: this.wheelDown
				},
				this.mouseWheelOptions);
				if (MapLib.Control.PinchZoom) {
					this.pinchZoom = new MapLib.Control.PinchZoom(MapLib.Util.extend({
						map: this.map
					},
					this.pinchZoomOptions))
				}
			},
			defaultClick: function(a) {
				if (a.lastTouches && a.lastTouches.length == 2) {
					this.map.zoomOut()
				}
			},
			defaultDblClick: function(c) {
				var a = this.map.getLonLatFromViewPortPx(c.xy);
				mapnew.setCenter(a, mapnew.zoom + 1)
				mapold.setCenter(a, mapold.zoom + 1)
			},
			defaultDblRightClick: function(c) {
				var a = this.map.getLonLatFromViewPortPx(c.xy);
				mapnew.setCenter(a, mapnew.zoom - 1)
				mapold.setCenter(a, mapold.zoom - 1)
			},
			wheelChange: function(j, d) {
				var i = mapnew.getZoom();
				var g = mapnew.getZoom() + Math.round(d);
				g = Math.max(g, 0);
				g = Math.min(g, mapnew.getNumZoomLevels());
				if (g === i) {
					return
				}
				var k = mapnew.getSize();
				var f = k.w / 2 - j.xy.x;
				var e = j.xy.y - k.h / 2;
				var h = mapnew.baseLayer.getResolutionForZoom(g);
				var a = mapnew.getLonLatFromPixel(j.xy);
				var c = new MapLib.LonLat(a.lon + f * h, a.lat + e * h);
				mapnew.setCenter(c, g)
				mapold.setCenter(c, g)
				//清除对比渲染图层
				//clearFeatures();
			},
			wheelUp: function(a, c) {
				this.wheelChange(a, c || 1)
			},
			wheelDown: function(a, c) {
				this.wheelChange(a, c || -1)
			},
			disableZoomBox: function() {
				this.zoomBoxEnabled = false;
				this.zoomBox.deactivate()
			},
			enableZoomBox: function() {
				this.zoomBoxEnabled = true;
				if (this.active) {
					this.zoomBox.activate()
				}
			},
			disableZoomWheel: function() {
				this.zoomWheelEnabled = false;
				this.handlers.wheel.deactivate()
			},
			enableZoomWheel: function() {
				this.zoomWheelEnabled = true;
				if (this.active) {
					this.handlers.wheel.activate()
				}
			},
			CLASS_NAME: "MapLib.Control.Navigation"
	});
	mapnew.addControl(new MapLib.Control.Navigation());
	mapold.addControl(new MapLib.Control.Navigation());
                   
	layernew = new MapLib.Layer.TiledDynamicRESTLayer("${map.default_mapnumber!''}",
				urlnew, {
					transparent : false,
					cacheEnabled : true
				}, {
					scales : FMapLib.scales,
					maxResolution : "auto",
					numZoomLevels : 9
				});
	layerold = new MapLib.Layer.TiledDynamicRESTLayer("${map.mapname!''}",
				urlold, {
					transparent : false,
					cacheEnabled : true
				}, {
					scales : FMapLib.scales,
					maxResolution : "auto",
					numZoomLevels : 9
				});	
	
	layernew.events.on({
	"layerInitialized" : function() {
			mapnew.addLayer(layernew);
			mapnew.addLayer(featuresLayer1);
			mapnew.setBaseLayer(layernew);
			//mapnew.setCenter(new MapLib.LonLat(48892.64, 64000.71),0);
			mapnew.setCenter(new MapLib.LonLat(FMapLib.MapCenter.x, FMapLib.MapCenter.y),0);
		}
	});
	layerold.events.on({
	"layerInitialized" : function() {
			mapold.addLayer(layerold);
			mapold.addLayer(featuresLayer2);
			mapold.setBaseLayer(layerold);
			mapold.setCenter(new MapLib.LonLat(FMapLib.MapCenter.x, FMapLib.MapCenter.y),0);
			for ( var i = 0; i < _mapNamesArr.length; i++) {
			eval("var historylayer_" + i
					+ "=new MapLib.Layer.TiledDynamicRESTLayer("
					+ "_mapNamesArr[" + i + "]," + "_mapUrlsArr[" + i + "],{"
					+ "transparent : false," + "cacheEnabled : true" + "},{"
					+ " scales : FMapLib.scales," + " maxResolution : 'auto',"
					+ "numZoomLevels : 9" + "});" + "layersArr[" + i
					+ "]=historylayer_" + i + ";");
			}
		}
	});
	
	tipAlert("地图版本号:${map.default_mapnumber!''} 地图名称:"+default_mapname+"(注：默认地图)","newmapdiv","newmapalert");
	tipAlert("地图版本号:${map.mapname!''} 地图名称："+versionname,"oldmapdiv","oldmapAlert");
	versonManager(mapold,mapnew);
  	//监听
	var newmapdiv=window.document.getElementById("newmapdiv");
	var oldmapdiv=window.document.getElementById("oldmapdiv");
	var newzoom=mapnew.getZoom();
	var oldzoom=mapold.getZoom();
	//var wheelFun = MapLib.Function.bindAsEventListener(wheelHandler, window);
	//var wheelFun1 = MapLib.Function.bindAsEventListener(wheelHandlernew, newmapdiv);
	//var wheelFun2 = MapLib.Function.bindAsEventListener(wheelHandlerold, oldmapdiv);
	var dragFunnew = MapLib.Function.bindAsEventListener(dragnewHandler, newmapdiv);
   	var dragFunold = MapLib.Function.bindAsEventListener(dragoldHandler, oldmapdiv);
	//MapLib.Event.observe(newmapdiv, "mousewheel",wheelFun1);
    //MapLib.Event.observe(oldmapdiv, "mousewheel",wheelFun2);
    //MapLib.Event.observe(window, "DOMMouseScroll",wheelFun);
   	//MapLib.Event.observe(window, "ondblclick",wheelFun);
    //MapLib.Event.observe(window, "dblclick",wheelFun);
  	MapLib.Event.observe(newmapdiv, "mouseup",dragFunnew);
  	MapLib.Event.observe(oldmapdiv, "mouseup",dragFunold); 	
	
	function wheelHandler(event){
		var newlevel = mapnew.getZoom();
		var oldlevel = mapold.getZoom();
		var centernew = mapnew.getCenter();
		var centerold = mapold.getCenter();
		if(newlevel!=newzoom&&oldlevel==oldzoom){
			mapold.panTo(centernew);
			mapold.zoomTo(newlevel);
			newzoom=newlevel;
			oldzoom=newlevel;
		}else if(newlevel==newzoom&&oldlevel!=oldzoom){
			mapnew.panTo(centerold);
			mapnew.zoomTo(oldlevel);
			oldzoom=oldlevel;
			newzoom=oldlevel;
		}
	}
	function dragnewHandler(event){
		var center = mapnew.getCenter();
		mapold.panTo(center);
	}

	function dragoldHandler(event){
		var center = mapold.getCenter();
		mapnew.panTo(center);
	}
	function wheelHandlernew(event){
		var newlevel = mapnew.getZoom();
		mapold.zoomTo(newlevel);
	}

	function wheelHandlerold(event){
		var oldlevel = mapold.getZoom();
		mapnew.zoomTo(oldlevel);
	}
	
	// 顶部信息提示框
	function tipAlert(tip,id, mapAlert,success) {
		if ($('#'+mapAlert).size()) {
			$('div').remove('#'+mapAlert);
		}
		if (!success) {
			var htmlString = '<div id='+mapAlert+' class="alert alert-success fade in" style="position:absolute; top: 10px; left: 10px; z-index: 2000; text-align: left; ">'
					+ tip + '</div>';
		} else {
			var htmlString = '<div id='+mapAlert+' class="alert alert-error fade in" style="position:absolute; top: 35px; left: 25%; width:50%; z-index: 2000;text-align: center;">'
					+ tip  + '</div>';
		}
		$('#'+id).append($(htmlString));
	}
	
	// 地图历史版本管理
	function versonManager(mapold,mapnew){
		var versionHTML="";
		$.post('realtygis.versionmanagerpopup', function(data, textStatus) {
			var default_mapnumber="";
			var jdata = jQuery.parseJSON(data);
			var len = jdata.root.length;
			for (i = 0; i < len; i++) {
				if (jdata.root[i].version_number&&jdata.root[i].status=="启用") {
				
					versionHTML+=	" <option value="+jdata.root[i].version_number+"  id='"+(jdata.root[i].rownum-1)+"'>"
					                 +   jdata.root[i].version_name
					                 +" </option>"
					if(jdata.root[i].default_map=="1001"){
			       		default_mapnumber=jdata.root[i].version_number;
					}
				}
			}
			$("#lishi").append(versionHTML);
			$("#lishi option[value='${map.mapname!''}']").attr("selected",true);
			$('#vmap').bind("click", function() {
				var val = $("#lishi").val();
				var rid = $("#lishi").find("option:selected").attr("id");
				changemapold(rid,mapold,val);
			});
			
			//分析功能 绑定点击触发事件
			$('#analysys').bind("click",function(){
			
				var mapvertion = versionname;
				if(mapvertion.indexOf("影像")>-1){
					alert("请选择基础地图分析！");
					return;
				}
				var lev = mapnew.getZoom();
				if(lev<6){
					alert('请放大地图级别...');
					return;
				}
				clearFeatures();
				var rightMapURL = mapold.baseLayer.url;
				var leftMapURL = urlnew;
				//获取地图bounds
				var bounds = mapnew.getExtent();
				var boundsR = mapold.getExtent();
				queryByBounds2(boundsR,rightMapURL)
				queryByBounds1(bounds,leftMapURL)
				loading(mapnew,'new');
				loading(mapold,'old');
			});
			
			$('#clearBtn').bind("click",function(){
				clearFeatures();
			});
			
		});

	}
	function queryByBounds1(bounds,urlargs){
		//初始化查询参数
		var queryParam, queryByBoundsParameters, queryService;
        queryParam = new MapLib.REST.FilterParameter({
			name: "ST_RIDRGN@ORCL"
			//attributeFilter: "NAME LIKE '%大学%'"
			});
		//调用QueryByBoundsParameters查询
        queryByBoundsParameters = new MapLib.REST.QueryByBoundsParameters({
            queryParams: [queryParam],
            bounds: bounds,
            spatialQueryMode: MapLib.REST.SpatialQueryMode.INTERSECT
        });
        queryService = new MapLib.REST.QueryByBoundsService(urlargs);
        //注册查询回调函数
        queryService.events.on(
                {
                    "processCompleted": queryByBoundsCompleted1,
                    "processFailed": queryByBoundsError
                });
        queryService.processAsync(queryByBoundsParameters);
	}
	function queryByBounds2(bounds,urlargs){
		//初始化查询参数
		var queryParam, queryByBoundsParameters, queryService;
        queryParam = new MapLib.REST.FilterParameter({
			name: "ST_RIDRGN@ORCL"
			//attributeFilter: "NAME LIKE '%大学%'"
			});
		//调用QueryByBoundsParameters查询
        queryByBoundsParameters = new MapLib.REST.QueryByBoundsParameters({
            queryParams: [queryParam],
            bounds: bounds,
            spatialQueryMode: MapLib.REST.SpatialQueryMode.INTERSECT
        });
        queryService = new MapLib.REST.QueryByBoundsService(urlargs);
        //注册查询回调函数
        queryService.events.on(
                {
                    "processCompleted": queryByBoundsCompleted2,
                    "processFailed": queryByBoundsError
                });
        queryService.processAsync(queryByBoundsParameters);
	}
	var leftResult;
	function queryByBoundsCompleted1(queryEventArgs) {
		var dataArr= queryEventArgs.originResult.recordsets[0].features;
		leftResult = dataArr;
		dealWithQueryResult(leftResult,'left');
	}
	
	function queryByBoundsCompleted2(queryEventArgs) {
		var args = queryEventArgs;
		var dataArr = queryEventArgs.originResult.recordsets[0].features;
		dealWithQueryResult(dataArr,'right');
	}
	
	function queryByBoundsError(queryEventArgs) {
		var args = queryEventArgs;
	}
	
	function dealWithQueryResult(arr,type){
		if(type=='left'){
			leftdata=arr;
			leftFlag=true;
		}
		if(type=='right'){
			rightdata=arr;
			rightFlag=true;
		}
		
		if(rightFlag && leftFlag){
			leftHandler();
			rightHandler();
		}
	}
	function leftHandler(){
		var count=0;//计数不一样的楼幢面
		
		for(var i=0;i<leftdata.length;i++){
			var smuseridR,smuseridL = leftdata[i].fieldValues[1],b=true;
			for(var k=0;k<rightdata.length;k++){
				smuseridR = rightdata[k].fieldValues[1];
				//如果和左侧的一样的，则不渲染
				if(smuseridL==smuseridR){
					b=false;
					break;
				}
			}
			if(b){
				b=true;
				count = count+1;
				var points = leftdata[i].geometry.points;
				var pointsArr=[]
				for(var j=0;j<points.length;j++){
					pointsArr[j]=new MapLib.Geometry.Point(points[j].x,points[j].y);
				}
				var linearRings = new MapLib.Geometry.LinearRing(pointsArr);
				var region = new MapLib.Geometry.Polygon([linearRings]);
				var feature = new MapLib.Feature.Vector();
				feature.geometry = region;
				feature.style = copyStyle;
				featuresLayer1.addFeatures(feature);
			}
		}
		var lonlat = mapnew.getCenter(); 
		var contentHTML = "<div id='popUpLeft' style=\'font-size:1em; opacity: 0.7; overflow-y:hidden;\'>"; 
		var sum = "房屋数量："+leftdata.length;
		if(count>0){
			sum = sum+"<br/>"+"与右侧不一样的房屋数量:"+count;
		}
		contentHTML += "<div>"+sum+"</div></div>";  
		popUpLeft = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,null,true); 
		mapnew.addPopup(popUpLeft);
		removeLoading('new');
	}
	function rightHandler(){
		var count=0;//计数不一样的楼幢面
		
		for(var i=0;i<rightdata.length;i++){
			var smuseridL,smuseridR = rightdata[i].fieldValues[1],b=true;
			for(var k=0;k<leftdata.length;k++){
				smuseridL = leftdata[k].fieldValues[1];
				//如果和左侧的一样的，则不渲染
				if(smuseridL==smuseridR){
					b=false;
					break;
				}
			}
			if(b){
				b=true;
				count = count+1;
				var points = rightdata[i].geometry.points;
				var pointsArr=[]
				for(var j=0;j<points.length;j++){
					pointsArr[j]=new MapLib.Geometry.Point(points[j].x,points[j].y);
				}
				var linearRings = new MapLib.Geometry.LinearRing(pointsArr);
				var region = new MapLib.Geometry.Polygon([linearRings]);
				var feature = new MapLib.Feature.Vector();
				feature.geometry = region;
				feature.style = copyStyle;
				featuresLayer2.addFeatures(feature);
			}
		}
		
		var lonlat = mapold.getCenter(); 
		var contentHTML = "<div id='popUpRight' style=\'font-size:1em; opacity: 0.7; overflow-y:hidden;\'>"; 
		var sum = "房屋数量："+rightdata.length;
		if(count>0){
			sum = sum+"<br/>"+"与左侧不一样的房屋数量:"+count;
		}
		contentHTML += "<div>"+sum+"</div></div>";  
		popUpRight = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,null,true); 
		mapold.addPopup(popUpRight);
		removeLoading('old');
	}
	function changemapold(rid, map,val) {
        var objText = val;
		var objId = rid;
		map.removeLayer(map.baseLayer);
		map.addLayer(layersArr[objId]);
	    map.setBaseLayer(layersArr[objId]);
	    	$.ajax({ 
	          type : "post", 
	          url : "realtygis.versionmanagerpopup", 
	          data : "" , 
	          async : false, 
	          success : function(data){ 
	      		var jdata = jQuery.parseJSON(data);
				var len = jdata.root.length;
				for (i = 0; i < len; i++) {
					if (jdata.root[i].version_number==objText) {
					  versionname=jdata.root[i].version_name;           
					}
				}
			
	          } 
	          }); 
		tipAlert("地图版本号:"+objText+" 地图名称："+versionname,"oldmapdiv","oldmapAlert");
	}
}
function getMapUrl() {
	$.ajax({ 
	          type : "post", 
	          url : "realtygis.versionmanagerpopup", 
	          data : "" , 
	          async : false, 
	          success : function(data){ 
	      		var jdata = jQuery.parseJSON(data);
				var len = jdata.root.length;
				for (i = 0; i < len; i++) {
					if (jdata.root[i].version_number) {
						_mapNamesArr[i]=jdata.root[i].version_number;            
					}
				}
				for ( var j = 0; j < _mapNamesArr.length; j++) {
	
					_mapUrlsArr[j] = FMapLib.DemoURL.baseUrl
							+ _mapNamesArr[j];
				}
	      } 
  }); 
}

function clearFeatures(){
	if(featuresLayer1){
		featuresLayer1.removeAllFeatures();
	}
	if(featuresLayer2){
		featuresLayer2.removeAllFeatures();
	}
	if(popUpLeft){
		mapnew.removePopup(popUpLeft);
	}
	if(popUpRight){
		mapold.removePopup(popUpRight);
	}
	leftFlag=false;
	rightFlag=false;
}
/**
 * 加载等待
 */
function loading(map,divID){
	var g = document.createElement("div");
	g.id = divID;
	g.style.position = "absolute";
	g.style.top = "45%";
	g.style.right = "55%";
	g.style.zIndex = 1006;
	g.style.background= '#ffffff'; 
	g.style.opacity=1;
	map.viewPortDiv.appendChild(g);
	var id = "#"+divID;
	$(id).append(
	    "<div id='over' style='display: block;position: absolute; top: 0; left: 0; width: 100%; height: 100%;  background-color: #f5f5f5; opacity:1; z-index: 1007;'></div>"+
	    "<div id='layout' style=' display: block; position: absolute; top: 40%; left: 40%;  width: 20%; height: 20%; z-index: 1008; text-align:center;'>" +
	    "<img src='/gis/resource/images/load_ring.gif' alt='' /></div>"//bird.gif load_earth.gif
    );
}
/**
 * stop loading
 */
function removeLoading(divID){
	var loading = document.getElementById(divID);
	if(loading != null){
		loading.parentNode.removeChild(loading);
	}
}
//搜索框
function findsomewhere(){  
   var value = $("#inputcontent").val();	
	if(value=="请输入地址" || value==""){
		alert("请输入地址！");
		return;
	}
	value=" "+value+" "//前后加空格
	while( value.indexOf( " " ) != -1 ) {
		value=value.replace(" ","%"); 
	}
	var dataset=['ST_RIDRGN_P@ORCL'];
	var attr=['ADDRESS'];	
	if(value){
	var queryParam,queryParams=[];
	for(var i=0;i<dataset.length;i++){
		var datasetName = dataset[i];
		var filter='',order='';		
			filter=attr[i]+" like '"+value+"'";		
		if(filter){
			queryParam = new MapLib.REST.FilterParameter({ 
				name: datasetName, 
				attributeFilter: filter			
			}); 
		}else{
			queryParam = new MapLib.REST.FilterParameter({ 
				name: datasetName				
			}); 
		}
		queryParams[i]=queryParam;
	}
	
	var queryBySQLParams = new MapLib.REST.QueryBySQLParameters({
		expectCount: 1000,
	    queryParams: queryParams 
	}); 
	var myQueryBySQLService = new MapLib.REST.QueryBySQLService(FMapLib.DemoURL.fangchan, {eventListeners: { 
	    "processCompleted": queryCompleted, 
	    "processFailed": queryError 
	    } 
	}); 
	var count=0,featureArr=[];
	myQueryBySQLService.processAsync(queryBySQLParams); 
	}		
}
function queryCompleted(QueryEventArgs){
var result,recordsets,pointx,pointy,bounds;
		if(!QueryEventArgs.result) return;
		result = QueryEventArgs.result;
		if(!result.recordsets) return;
		recordsets=result.recordsets;
		if(recordsets.length){
		   bounds=new MapLib.Bounds();
			for(var i=0;i<recordsets.length;i++){
				if(recordsets[i].features && recordsets[i].features.length){
					var features = recordsets[i].features;
					for(var j=0;j<features.length;j++){
						var feature = features[j];						 
					 pointx = parseFloat(feature.attributes["SMX"])
                     pointy = parseFloat(feature.attributes["SMY"])	
                     if(null!=pointx&&null!=pointy)							
					 bounds.extend(new MapLib.LonLat(pointx,pointy))	
					}				
				}
			
			var lonlatcenter = bounds.getCenterLonLat();
			mapnew.setCenter(new MapLib.LonLat(lonlatcenter.lon, lonlatcenter.lat));
			mapold.setCenter(new MapLib.LonLat(lonlatcenter.lon, lonlatcenter.lat));
			mapnew.zoomToExtent(bounds);	
			mapold.zoomToExtent(bounds);	
			}		
			
		}
	}
function queryError(QueryEventArgs){//todo
		var arg = QueryEventArgs;
		alert("查询出现错误！");
}

</script>
<body onload="init()">        
	<!--地图显示的div-->   
	<div id="newmapdiv"  style="position: relative; float:left;  height:560px;width:49.5%" ></div> 
	<div id="oldmapdiv"  style="position: relative; float:right;  height:560px;width:49.5%" ></div> 
	<div style="clear:both;">
		<table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#dee2e3" style="line-height:30px;">
			<tr>
			    <td class="td12">
			        <input class="text_style" name="" id="inputcontent" value="请输入地址" placeholder="请输入地址"  type="text" /><img src="${_share_file_url!''}/gis/resource/images/searchicon.png" style="cursor:pointer;margin-left:5px;" onclick="javascirpt:findsomewhere()">
			    	<input type='button' id='analysys'  value='房屋自动对比分析' class="button_style"/>
			    	<input type='button' id='clearBtn'  value='清除分析结果'  class="button_style"/>
			    </td>
				<td class="td12">请选择版本：</td>
				<td class="td13">
					<select id='lishi' class="select_style"></select>
			    	<input type='button' id='vmap'  value='版本切换'  class="button_style"/>
			    </td>
			</tr>
		</table>
	</div>
</body>
 