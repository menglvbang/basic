(function() {
	/**
	 * 初始化模块全局变量，是目前API开发中使用的公共变量，经(function(){})()封装后在外部无法访问
	 */
	var layer,layerlc, marker, vectorLayer,markerLayer,markerLayer1,markerLayer2,markerLayerall,drawLayer,clusterLayer, imagelayer, bGoogle = false;
	var vectorLayer2;// 查询定位房屋面渲染图层
	var selectFeature;
	var htmlUrl = document.location.toString(), stringIndex = htmlUrl
			.indexOf("//"), subString = htmlUrl.substring(0, stringIndex - 1), org;
	var fan = "";// 楼盘表定位监听
	var ide = "";// 监听参数
	var ide0;// 专题图监听参数
	var bufferpoint;// 缓冲分析依据的点
	var bufferline;// 缓冲分析依据的线
	var bufferroad;// 缓冲分析选取道路的点
	var bufferhouse;// 缓冲分析选取房屋的点
	var stylePoint;// 点风格
	var styleLine;// 线风格
	var styleRegion;// 面风格
	var datasetname;// 关联查询的数据集名
	var tempLayerID = null;// 图层控制的图层ID
	//地图服务地址
   // org = 'http://' + (document.location.host.split(":")[0])+":"+FMapLib.MAPSERVICE_PORT;	
	   org='http://192.168.0.9:8092'//本机临时调用
	var default_map="";// 默认地图名
	/**
	 * 初始化_mapNamesArr,_mapUrlsArr的函数，当前执行。
	 */
	var _mapNamesArr = new Array();// 地图名称数组
	var _mapUrlsArr = new Array();// 地图地址数组
	var DemoURL;
	(function() {
		queryMapName();	
		getMapUrl();
		// getBaseUrl();
		
	})();
	function queryMapName(){
		$.ajax({ 
	          type : "post", 
	          url : "realtygis.versionmanagerpopup", 
	          data : "" , 
	          async : false, 
	          success : function(data){ 
	      		var jdata = jQuery.parseJSON(data);
	      		if(jdata){
					var len = jdata.root.length;
					for (i = 0; i < len; i++) {
						if (jdata.root[i].version_number!=null&&jdata.root[i].default_map=="1001") {
							default_map=jdata.root[i].version_number;
						}
					}
	      		}
			// return default_map;
	  		DemoURL = {
						image : org + '/iserver/services/map-FMAP1/rest/maps/1101',
						fangchan1 : org + '/iserver/services/data-FMAP1/rest/data',
						fangchan1_New_House_P : org + '/iserver/services/data-FMAP1/rest/data/datasources/name/ORCL/datasets/name/New_House_P',						
						fangchan : org + '/iserver/services/map-FMAP1/rest/maps/'+default_map,
						fangchanlc : org + '/iserver/services/map-FMAP1/rest/maps/1405131040',
						fangchan_spatialanalyst:org+'/iserver/services/spatialAnalysis-FMAP1/restjsr/spatialanalyst',
						fencenghu : org + '/iserver/services/map-FCFHMAP/rest/maps/fcfh',						
						datamap : org + '/iserver/services/map-FMAP1/rest/maps/DATASERVICE',	
						baseUrl : org+'/iserver/services/map-FMAP1/rest/maps/'
				};
	          } 
	          }); 

		return DemoURL;
	}
	FMapLib.Org=org;
	FMapLib.DemoURL=DemoURL;// 传递给全局变量
	// 比例尺自定义
	var scales =[1/1000, 1 / 3000,1 / 10000,1 / 15000,1 / 30000,1/65000, 1 / 100000, 1 / 250000, 
	              1 / 1400000];
	FMapLib.scales=scales;	
	FMapLib.scalesnum=9;
	FMapLib.MapCenter={x:497950.057789132, y:4061622.65003076};
		function getMapUrl() {
		$.post('realtygis.versionmanagerpopup', function(data, textStatus) {
			var jdata = jQuery.parseJSON(data);
			if(jdata){
				var len = jdata.root.length;
				for (i = 0; i < len; i++) {
					if (jdata.root[i].version_number) {
						_mapNamesArr[i]=jdata.root[i].version_number;            
					}
				}
			}
			
			for ( var j = 0; j < _mapNamesArr.length; j++) {

				_mapUrlsArr[j] = FMapLib.DemoURL.baseUrl
						+ _mapNamesArr[j];
			}
		});		
	}
	// 其他变量声明
	var drawPolygon;// 画多变形控件
	var drawLine;// 画线控件
	var drawPoint;// 画点控件
	var drawRoad;// 选取道路控件
	var drawHouse;// 选取房屋控件
	var radiusParam;// 缓冲分析的缓冲半径
	var preFeature;// 清除popup的对象
	var layersArr = new Array();// 重要数组！存放地图图层
	var currentlayer = new Array();// 当前地图图层名
	var cutText;// 当前地图名称文本
	var querymarkerX, querymarkerY;// querymarker;
	var popup;
	var popupArray=new Array();
	var dotLayer;// 存放点密度专题图
	var themeLayer;// 存放等级符号专题图图层
	var labelLayer;// 存放标签专题图
	var rangeLayer;// 存放范围值专题图
	var barLayer;// 存放统计专题图
	var housethemeLayer;// 存放楼房统计专题图
	var piechart;// 存放饼状专题图对象
	var infowin;// 聚合功能弹出的信息提示框
	// //////////////前进后退功能所需变量/////////////////////////
    var centers_back = new Array();
	var scales_back = new Array();
	var centers_forward = new Array();
	var scales_forward = new Array();
	var center = null;
	var scale = null;
	var isNewView = true;
	var magnifyZoomBox;// 放大
	var shrinkZoomBox;// 缩小
	// /////////////////////////////////////////
// function getBaseUrl(){
	// 获取当前路径 baseurl
	var r = new RegExp("(^|(.*?\\/))(FMapLib.Include\.js)(\\?|$)"), s = document
			.getElementsByTagName('script'), src, m, baseurl = "";
	for ( var i = 0, len = s.length; i < len; i++) {
		src = s[i].getAttribute('src');
		if (src) {
			var m = src.match(r);
			if (m) {
				baseurl = m[1];
				break;
			}
		}
	}
	
// }
	  // 公共函数
	/**
	 * 类对象属性扩展函数，
	 */
	 FMapLib.extend= function(target, source) {
		for ( var p in source) {
			if (source.hasOwnProperty(p)) {
				target[p] = source[p];
			}
		}
		return target;
	};		 
	/**
	 * @exports FMap as FMapLib.FMap
	 */
	var FMap =
	/**
	 * FMap类的构造函数
	 * 
	 * @class 地图类， 实例化该类后，即可返回一个房产地图实例
	 * @constructor
	 * @param id
	 *            必填项，html页面地图实例所在div的唯一标识
	 */
	FMapLib.FMap = function(id) {		
		var me=this;// 定义全局变量me,代表一个实例化的地图对象。
		me.id=id;	// 地图div id
		me.legendId;// 地图图例div id
		var map = new MapLib.Map(id, {
			controls : [ // new MapLib.Control.LayerSwitcher(),
			new MapLib.Control.ScaleLine(),
			// new MapLib.Control.Zoom(),
			new MapLib.Control.MousePosition(),
					new MapLib.Control.OverviewMap(),
					new MapLib.Control.KeyboardDefaults(),
					new MapLib.Control.PanZoomBar({
						forceFixedZoomLevel : true
					}), new MapLib.Control.Navigation({
						dragPanOptions : {
							enableKinetic : true
						}
					}) ],
			units : "m"
		});
		map.events.on({"zoomend":zoomendHandle});
		prepareLayers(map);		
		/**
		 * 刷新并重新定义图例div的html内容
		 */
		map.flashLegend= function(html){			
			if(me.legendId){
				var ldiv=$("#"+me.legendId);
				ldiv.css('background-color','white');
				ldiv.empty();
				ldiv.append("<div align='center'><a>图例</a></div>")
	            ldiv.append(html);
			}
			
		}
		/**
		 * 初始化图例div
		 * 
		 * @param a
		 *            图例div的唯一id,为字符串格式，比如‘legend01’
		 */
		map.initLegendDiv=function(){
			var themehtml="<div id='"+me.id+"themelegenddiv' class='themeLegendDIV' style ='border:solid 1px black;position: absolute; float: left; left: 50px;bottom:50px; opacity: 1; z-index: 1002; width: auto; height: auto;'></div>" ;
	        $("#"+me.id).append(themehtml);
	        me.legendId=me.id+"themelegenddiv";
		}
		/**
		 * 清除图例div
		 */
		map.removeLegendDiv=function(){
		$('div').remove('.themeLegendDIV');
		}		
		/**
		 * 地图清除功能，清除地图上的所有覆盖物，并停止画点线面的功能
		 */ 
		map.clearAllFeatures = function() {			
			markerLayer.clearMarkers();
			markerLayer1.clearMarkers();
			markerLayer2.clearMarkers();
			markerLayerall.clearMarkers();
			if (popup) {
				markerLayer.map.removePopup(popup);	
				markerLayer1.map.removePopup(popup);	
				markerLayer2.map.removePopup(popup);							
			}
			if(popupArray&&popupArray.length>0){
				for(var j=0;j<popupArray.length;j++){
					markerLayer.map.removePopup(popupArray[j]);	
				}
				popupArray=[];
			}
			if (drawPoint) {
				drawPoint.deactivate();
			}
			if (drawLine) {
				drawLine.deactivate();
			}
			if (drawPolygon) {
				drawPolygon.deactivate();
			}
			if(clusterLayer){
				clusterLayer.removeAllFeatures();
				}
			removeTheme();// 清除专题图专用图层
			vectorLayer.removeAllFeatures();
			vectorLayer2.removeAllFeatures();
			if ($('#mapAlert').size()) {
				$('div').remove('#mapAlert');
			}
			if(mapPopup){
				map.removePopup(mapPopup);
			}
		    this.removeLegendDiv();
		    // 清除空间统计弹出框
		    if(popupArray&&popupArray.length>0){
		    for (i=0;i<popupArray.length;i++) {
				map.removePopup(popupArray[i]);
			}
		   }
		   
		}
		/**
		 * 停止框选，恢复鼠标状态
		 */
		map.stopDrop = function(){
			if (drawPoint) {
				drawPoint.deactivate();

			}
			if (drawLine) {
				drawLine.deactivate();
			}
			if (drawPolygon) {
				drawPolygon.deactivate();
			}
			
		}
		return map;
	};

// 初始化图层对象
	function prepareLayers(map) {
		// 初始化底图图层
		layer = new MapLib.Layer.TiledDynamicRESTLayer(default_map,
				FMapLib.DemoURL.fangchan, {
					transparent : false,
					cacheEnabled : true
				}, {
					scales : scales,
					maxResolution : "auto",
					numZoomLevels : 9
				});
		// 初始化Marker图层
		markerLayer = new MapLib.Layer.Markers("Markers Layer");
		markerLayer1 = new MapLib.Layer.Markers("weather Layer");
		markerLayer2 = new MapLib.Layer.Markers("Markers Layer");
		markerLayerall = new MapLib.Layer.Markers("Markers Layer");
		vectorLayer = new MapLib.Layer.Vector("Vector Layer");
		vectorLayer2 = new MapLib.Layer.Vector("Vector Layer");
		// 初始化聚合图层
		 clusterLayer = new MapLib.Layer.ClusterLayer("Cluster",{
			 // maxDiffuseAmount:10,
			 maxLevel:7,
			 tolerance:1000
		 });
		// 当前地图容器加载的所有图层
			currentlayer = [ layer, vectorLayer, vectorLayer2,clusterLayer,markerLayerall,markerLayer,markerLayer1,markerLayer2 ];// 数组存放当前图层
		layer.events.on({
			"layerInitialized" : function() {
				map.addLayers(currentlayer);
				map.setCenter(new MapLib.LonLat(497950.057789132, 4061622.65003076),0);
				map.zoomTo(3);// 初始化缩放比例
				// map.allOverlays = true;
			}
		});
		imagelayer = new MapLib.Layer.TiledDynamicRESTLayer("影像图",
				FMapLib.DemoURL.image, {
					transparent : false,
					cacheEnabled : true
				}, {
					scales : scales,
					maxResolution : "auto",
					numZoomLevels : 9
				});
		for ( var i = 0; i < _mapNamesArr.length; i++) {
			eval("var historylayer_" + i
					+ "=new MapLib.Layer.TiledDynamicRESTLayer("
					+ "_mapNamesArr[" + i + "]," + "_mapUrlsArr[" + i + "],{"
					+ "transparent : false," + "cacheEnabled : true" + "},{"
					+ " scales:scales," + " maxResolution : 'auto',"
					+ "numZoomLevels:9" + "});" + "layersArr[" + i
					+ "]=historylayer_" + i + ";");
		}
		// 添加对clusterLayer聚合图层的监听事件
		var select = new MapLib.Control.SelectCluster(clusterLayer);
		 map.addControl(select);
		 clusterLayer.events.on({"clickFeature": function(f){
	         closeInfoWin();
	         openInfoWin(f);
	     }});
	     clusterLayer.events.on({"clickout": function(f){
	         closeInfoWin();
	     }});
	     clusterLayer.events.on({"moveend": function(e){
	         if(e&& e.zoomChanged)closeInfoWin();
	     }});
	     clusterLayer.events.on({"clickCluster": function(f){
	         closeInfoWin();
	     }});

	     select.activate();
        // 满足前进后退功能
        var center = new MapLib.LonLat(48892.64, 51001.71);
		centers_back.push(map.getCenter());
		scales_back.push(map.getZoom());		
		map.events.on({"moveend": handle_Action});
		// 定义框选放大
		magnifyZoomBox = new MapLib.Control.ZoomBox({out:false});
		map.addControl(magnifyZoomBox);
		// 定义框选缩小
		shrinkZoomBox = new MapLib.Control.ZoomBox({out:true});
		map.addControl(shrinkZoomBox);
		// 定义select控件
		selectFeature = new MapLib.Control.SelectFeature(vectorLayer, {
			                onSelect: openWindow,
			                onUnselect: unfeatueSelect,
			                hover:true
			            });            
        map.addControl(selectFeature);
        selectFeature.activate();
			
	}
   /**
	 * @author 李洪云 2014 1 24 前进后退功能
	 */
	function handle_Action() {
		if(isNewView) {
			centers_back.push(map.getCenter());
			scales_back.push(map.getZoom());
			
			centers_forward = [];
			scales_forward = [];
		}

		isNewView = true;
		
	}

	var Back=FMapLib.Back=function () {
		var temp_center = centers_back.pop();
		var temp_scale = scales_back.pop();
		centers_forward.push(temp_center);
		scales_forward.push(temp_scale);
		isNewView = false;
		viewPreView();
		document.getElementById("forward").disabled = false;
		if(isFirstView()) {
			document.getElementById("back").disabled = true;
		}
	}
	
	var Magnify=FMapLib.Magnify=function(){
		map.zoomIn();
	}
	
	var Shrink=FMapLib.Shrink=function(){
		map.zoomOut();
	}
	
	var BoxMagnify=FMapLib.BoxMagnify=function(){
		shrinkZoomBox.deactivate();
		document.getElementById("map").style.cursor="pointer"; 		
		magnifyZoomBox.activate();
		
	}
	
	var BoxShrink=FMapLib.BoxShrink=function(){
		magnifyZoomBox.deactivate();
		document.getElementById("map").style.cursor="pointer";  
		shrinkZoomBox.activate();
	}
	
	var Roam=FMapLib.Roam=function(){
		magnifyZoomBox.deactivate();
		shrinkZoomBox.deactivate();
		document.getElementById("map").style.cursor="default";  
	}

	var Forward=FMapLib.Forward=function () {
		isNewView = false;
		viewNextView();
		var temp_center = centers_forward.pop();
		var temp_scale = scales_forward.pop();
		centers_back.push(temp_center);
		scales_back.push(temp_scale);
		document.getElementById("back").disabled = false;
		if(isLastView()) {
			document.getElementById("forward").disabled = true;
		}
	}

	function viewPreView() {
		map.setCenter(centers_back[centers_back.length-1], scales_back[scales_back.length-1]);
	}

	function viewNextView() {
		map.setCenter(centers_forward[centers_forward.length-1], scales_forward[scales_forward.length-1]);
	}

	function isFirstView() {
		if(centers_back.length == 1) {
			return true;
		}
		else {
			return false;
		}
	}

	function isLastView() {
		if(centers_forward.length == 0) {
			return true;
		}
		else {
			return false;
		}
	}
	/**
	 * 鼠标滑轮监听器
	 */
	var MouseWheelListener = FMapLib.MouseWheelListener = function(id) {
		// this._flag = true;
		$('#' + id).mousewheel(function(event, delta) {
			// 规定地图全屏状态下鼠标滑轮起作用，以避免与window的边框滑动条体验重叠;
			// screenSta为全局变量，1代表此时地图为全屏状态。
			// if (this._flag) {
			if (delta > 0) {				
				map.zoomIn();
			} else if (delta < 0) {				
				map.zoomOut();
			}			
		});
	}
	/**
	 * 面积测量工具API
	 */
	var AreaMeasureTool = FMapLib.AreaMeasureTool = function(map) {
		// 当前地图清空图层
		map.clearAllFeatures();
		//
		style = {
			strokeColor : "#304DBE",
			strokeWidth : 2,
			pointerEvents : "visiblePainted",
			fillColor : "#304DBE",
			fillOpacity : 0.5
		};
		// 对线图层应用样式style（前面有定义）
		vectorLayer.style = style;
		// 定义鼠标样式为图片，为了适应各种浏览器，图片采用32*32的cur格式的文件
		document.getElementById("map").style.cursor="url('/gis/resource/images/ruler.cur'),default";
	}
	// open方法
	AreaMeasureTool.prototype.open = function() {
		if (drawPoint) {
			drawPoint.deactivate();
		}
		if (drawLine) {
			drawLine.deactivate();
		}
		drawPolygon = new MapLib.Control.DrawFeature(vectorLayer,
				MapLib.Handler.Polygon);
		map.addControl(drawPolygon);
		drawPolygon.events.on({
			"featureadded" : drawCompletedA
		});
		drawPolygon.activate();
	}
	// close方法
	AreaMeasureTool.prototype.close = function() {
		drawPolygon.deactivate();
	}
	// 绘完触发事件
	function drawCompletedA(drawGeometryArgs) {
		// 停止画线画面控制
		drawPolygon.deactivate();
		// 获得图层几何对象
		var geometry = drawGeometryArgs.feature.geometry, measureParam = new MapLib.REST.MeasureParameters(
				geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积 */
		myMeasuerService = new MapLib.REST.MeasureService(FMapLib.DemoURL.fangchan); // 量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
		myMeasuerService.events.on({
			"processCompleted" : measureCompletedAA
		});

		// 对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
		myMeasuerService.measureMode = MapLib.REST.MeasureMode.AREA;
		myMeasuerService.processAsync(measureParam); // processAsync负责将客户端的量算参数传递到服务端。
	}
	// 测量结束调用事件
	function measureCompletedAA(measureEventArgs) {
		var area = measureEventArgs.result.area, unit = measureEventArgs.result.unit;
		var areafloat = parseFloat(area);
		var areachar = changeTwoDecimal(areafloat);
		if (area != -1) {
			doMapAlert("map", "量算结果", areachar + "平方米", true);
		}
		document.getElementById("map").style.cursor="default";
	}

	/**
	 * 四舍五入
	 */
	function changeTwoDecimal(x) {
		var f_x = parseFloat(x);
		if (isNaN(f_x)) {
			alert('function:changeTwoDecimal->parameter error');
			return false;
		}
		var f_x = Math.round(x * 100) / 100;

		return f_x;
	}
	/**
	 * 根据建设日期查询楼幢面
	 */
	var BuildingQueryByDate = FMapLib.BuildingQueryByDate = function(string) {
		this.condition = string;
		vectorLayer.removeAllFeatures();
	};
	// open
	BuildingQueryByDate.prototype.open = function() {
		var filter="builddate is not null " + this.condition;
		var completed=dQueryProcessCompleted;
		housequeserv(filter,completed);
	};
	/**
	 * 对房屋查询结果进行面渲染 公用方法
	 * 
	 * @param 房屋查询结果集
	 */
	function render(queryEventArgs){
		var i, j, feature, result = queryEventArgs.result;
		var style = {
			strokeColor : "#304DBE",
			strokeWidth : 1,
			fillColor : "#304DBE",
			fillOpacity : "0.8"
		};	
		if (result && result.recordsets) {
			for (i = 0; i < result.recordsets.length; i++) {
				if (result.recordsets[i].features) {
					for (j = 0; j < result.recordsets[i].features.length; j++) {
						feature = result.recordsets[i].features[j];
						feature.style = style;
						vectorLayer.addFeatures(feature);
					}
				}
			}
		}
		if (j > 0 && j <= 10) {			
			panto(2);
		} else {

			if (j > 10 && j <= 30) {				
				panto(2);
			} else {
				if (result.recordsets[0].features.length > 30) {
					panto(2);
				}
				else {
					 alert("抱歉，未查到任何结果，请检查查询条件！");
				}
			}
		}
	}
	// 日期查询结束
	function dQueryProcessCompleted(queryEventArgs) {
		// 对查询结果进行渲染
		render(queryEventArgs);
		// 定义选择控件
		var selectFeature = new MapLib.Control.SelectFeature(vectorLayer, {
			onSelect : onFeatureSelect,
			onUnselect : onFeatureUnselect
		});
		selectFeature.repeat = true;
		map.addControl(selectFeature);
		selectFeature.activate();
		/**
		 * 在指定几何图形上方弹出信息查阅窗口
		 */
		function onFeatureSelect(feature) {
			var retValue = feature.attributes;
			var x = feature.geometry.getBounds().getCenterLonLat().lon;
			var y = feature.geometry.getBounds().getCenterLonLat().lat;
			var contentHTML = "<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden; background:#FFFF33';width:150px;height:50px>"
					+ "<span style='font-weight: bold; font-size: 18px;'>详细信息</span><br>";

			contentHTML += "<div>数据来源：" + retValue['SJLY'] + "<div>";
			contentHTML += "<div>图形编码：" + retValue['GRAPHICS_CODE'] + "<div>";
			contentHTML += "<div>建设时间：" + retValue['BUILDDATE'] + "<div>";
			contentHTML += "<div>测图时间：" + retValue['CTSJ'] + "<div>";
			contentHTML += "<div>幢坐落：" + retValue['ADDRESS'] + "<div>";
			contentHTML += "<div>占地面积：" + retValue['SMAREA'] + "平方米<div>";
			contentHTML += "<div>楼高：" + retValue['LG'] + "<div>";
			contentHTML += "<div>长度：" + retValue['SMPERIMETER'] + "米<div><div>";
			// 初始化一个弹出窗口，当某个地图要素被选中时会弹出此窗口，用来显示选中地图要素的属性信息
			popup = new MapLib.Popup.FramedCloud("popwin",
					new MapLib.LonLat(x, y), null, contentHTML, null, true,
					null, true);
			feature.popup = popup;
			map.addPopup(popup);
		}
		// 图形丢失选中状态后
		function onFeatureUnselect(feature) {
			map.removePopup(feature.popup);
			feature.popup.destroy();
			feature.popup = null;
		}
	}

	/**
	 * 项目测绘建筑查询(包含楼盘表)
	 */
	var BuildingsFromSurvey = FMapLib.BuildingsFromSurvey = function() {
		vectorLayer.removeAllFeatures();
	};

	BuildingsFromSurvey.prototype.open = function() {
		// 设置与外部表的连接信息
		var joinItem = new MapLib.REST.JoinItem({
			foreignTableName : "T_BUILDING",
			joinFilter : "T_BUILDING.BUILDING_MAPID = ST_RIDRGN.SMUSERID",
			joinType : "INNERJOIN"

		});
		var queryParam, queryBySQLParams, queryBySQLService;
		// 设置查询参数，在查询参数中添加joinItem关联条件信息
		queryParam = new MapLib.REST.FilterParameter({
			name : "ST_RIDRGN@ORCL",
			attributeFilter : "ST_RIDRGN.SMUSERID >680000",
			joinItems : [ joinItem ]

		}), queryBySQLParams = new MapLib.REST.QueryBySQLParameters({
			queryParams : [ queryParam ]
		// queryOption:"GEOMETRY"
		}), queryBySQLService = new MapLib.REST.QueryBySQLService(
				FMapLib.DemoURL.fangchan, {
					eventListeners : {
						"processCompleted" : surveyProcessCompleted,
						"processFailed" : processFailed
					}
				});
		queryBySQLService.processAsync(queryBySQLParams);
	};

	/**
	 * 查询选定楼幢的楼幢信息 公用方法
	 * 
	 * @param feature
	 *            楼幢面要素object类型
	 * @return String
	 */
	 t_buildingQuery=function(feature){
		var contentHTML = "";
		
		$
				.ajax({
					url : 'realtygis.buildingjson',
					cache : false,
					async : false,// 同步
					dataType : 'json',
					data : {
						id : (feature.attributes['ST_RIDRGN.SMUSERID']==undefined?feature.attributes['SMUSERID']:feature.attributes['ST_RIDRGN.SMUSERID'])

					},
					success : function(item, textStatus, jqXHR) {
						if (textStatus == 'success') {
					contentHTML +="<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden; background:#FFFFFF';width:100%;height:100%>"
								+ "<span style='font-weight: bold; font-size: 18px;'>"+item.building_address+"</span><br><br>";
		         	contentHTML +="<form>"
		         		        +"<p align='center'><input type='button' value='详细信息' onclick=window.open('realtygis.tabdialog?building_id="
						        + item.building_id+"','_blank','depended=yes,width=900,height=500,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes')></p><br>"
								+"<!--<p align='center'><input type='button' value='修改属性' onclick=window.open('realtygis.updatebuildingproperty?building_id="
								+ item.building_id+"&method=null','_blank','depended=yes,width=900,height=500,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes')></p>--><br>"
								+"</form>"
								+ "</div>";
						}
					}
				});
		return contentHTML;
	}
	/**
	 * 查询失败 公用方法
	 */
	function processFailed(e) {
		doMapAlert("map", "", e.error.errorMsg, true);
	}
	/**
	 * 空间查询结束（需要获取smuserid）
	 */
	function surveyProcessCompleted(queryEventArgs) {
		var i, j, feature, result = queryEventArgs.result;
		var smuserid = "";
		var style = {
			strokeColor : "#304DBE",
			strokeWidth : 1,
			fillColor : "#304DBE",
			fillOpacity : "0.8"
		};	
		if (result && result.recordsets) {
			for (i = 0; i < result.recordsets.length; i++) {
				if (result.recordsets[i].features) {
					for (j = 0; j < result.recordsets[i].features.length; j++) {
						feature = result.recordsets[i].features[j];

						smuserid = smuserid
								+ result.recordsets[i].features[j].attributes["ST_RIDRGN.SMUSERID"]
								+ ',';

						feature.style = style;
						vectorLayer.addFeatures(feature);

					}
				}
			}
		}

		if (j > 0 && j <= 10) {
			panto(2);
		} else {

			if (j > 10 && j <= 30) {
				panto(2);
			} else {
				if (result.recordsets[0].features.length > 30) {
					panto(2);
				}

				else {
					 alert("抱歉，未查到任何结果，请检查查询条件！");
				}
			}
		}
		// 弹出查询结果列表
		window
				.open(
						'realtygis.buildingquelist?fea=' + smuserid + '0',
						'_blank',
						'depended=yes,width=475,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
		var selectFeature = new MapLib.Control.SelectFeature([ vectorLayer,
				vectorLayer2 ], {
			onSelect : onSurveyFeatureSelect,
			onUnselect : onSurveyFeatureUnselect
		});

		selectFeature.repeat = true;
		map.addControl(selectFeature);
		selectFeature.activate();

	}

	/**
	 * 图形丢失选中状态后 公用方法
	 */
	onSurveyFeatureUnselect = function(feature) {
		if(feature.popup){
			map.removePopup(feature.popup);
		}
		// feature.popup.destroy();
		// feature.popup = null;
	}
	/**
	 * 在指定几何图形上方弹出信息查阅窗口 公用方法
	 * 
	 */
	onSurveyFeatureSelect = function(feature) {
		var contentHTML = t_buildingQuery(feature);
		var x = feature.geometry.getBounds().getCenterLonLat().lon;
		var y = feature.geometry.getBounds().getCenterLonLat().lat;
		// 初始化一个弹出窗口，当某个地图要素被选中时会弹出此窗口，用来显示选中地图要素的属性信息
		popup = new MapLib.Popup.FramedCloud("popwin",
				new MapLib.LonLat(x, y), new MapLib.Size(200, 300),
				contentHTML, null, true, null, true);
		popup.autoSize = false;
		feature.popup = popup;
		map.addPopup(popup);
	}

	/**
	 * 公用方法
	 * 
	 * @param zoomValue
	 *            希望的zoom值，可取1||2||3||4||5||6||7||8||9
	 *            地图缩放到指定比例，同时将vetorLayer当期图形最大外界矩形中心点设置为当前地图中心点
	 * 
	 */
	function panto(zoomValue) {
		// map.zoomTo(7);
		map.zoomTo(zoomValue);
		var bound = vectorLayer.getDataExtent();
		var lonlat = bound.getCenterLonLat();
		map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
	}
	/**
	 * @author Administrator
	 * @param map,
	 *            为操作的地图实例化对象，如 var map=new FMapLib.FMap(); new
	 *            FMapLib.DistanceMeasureTool(map); 距离测算API
	 */
	var DistanceMeasureTool = FMapLib.DistanceMeasureTool = function(map) {
		// lineLayer=new MapLib.Layer.Vector("LineLayer");
		clearFeatures();
		// lineLayer.removeAllFeatures();
		/*
		 * if ($('#mapAlert').size()) { $('div').remove('#mapAlert'); }
		 */
		map.removeControl(drawPoint);
		style = {
			strokeColor : "#304DBE",
			strokeWidth : 2,
			pointerEvents : "visiblePainted",
			fillColor : "#304DBE",
			fillOpacity : 0.8
		};
		// 对线图层应用样式style（前面有定义）
		vectorLayer.style = style;		
		// document.getElementById("map").style.cursor="url('http://localhost:8080/gis/resource/images/cursor.cur'),default";
		// 定义鼠标样式为图片，为了适应各种浏览器，图片采用32*32的cur格式的文件
		document.getElementById("map").style.cursor="url('/gis/resource/images/ruler.cur'),default";
	};
	// 应用打开
	DistanceMeasureTool.prototype.open = function() {
		if (drawPoint) {
			drawPoint.deactivate();

		}
		if (drawPolygon) {
			drawPolygon.deactivate();
		}
		drawLine = new MapLib.Control.DrawFeature(vectorLayer,
				MapLib.Handler.Path, {
					multi : true
				});
		map.addControl(drawLine);
		drawLine.events.on({
			"featureadded" : drawLineCompleted
		});
		drawLine.activate();
	};
	// 应用关闭
	DistanceMeasureTool.prototype.close = function() {
		drawLine.deactivate();
	};
	// 绘完触发事件
	function drawLineCompleted(drawGeometryArgs) {
		// 停止画线控制
		drawLine.deactivate();
		// 获得图层几何对象
		var geometry = drawGeometryArgs.feature.geometry, measureParam = new MapLib.REST.MeasureParameters(
				geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积 */
		myMeasuerService = new MapLib.REST.MeasureService(FMapLib.DemoURL.fangchan); // 量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
		myMeasuerService.events.on({
			"processCompleted" : distanceMeasureCompleted
		});
		// 对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
		myMeasuerService.measureMode = MapLib.REST.MeasureMode.DISTANCE;
		myMeasuerService.processAsync(measureParam); // processAsync负责将客户端的量算参数传递到服务端。
	}

	function changeTwoDecimal(x) {
		var f_x = parseFloat(x);
		if (isNaN(f_x)) {
			alert('function:changeTwoDecimal->parameter error');
			return false;
		}
		var f_x = Math.round(x * 100) / 100;

		return f_x;
	}

	// 详细出处参考：http://www.jb51.net/article/36033.htm
	// 测量结束调用事件
	function distanceMeasureCompleted(measureEventArgs) {
		var distance = measureEventArgs.result.distance, unit = measureEventArgs.result.unit;
		var float = parseFloat(distance);
		var all = changeTwoDecimal(float);
		if (distance != -1) {
			doMapAlert("map", "量算结果", all + "米", true);
		}
		document.getElementById("map").style.cursor="default";
	}
	
	// 房屋图层查询服务 公用方法
	function housequeserv ( attribufilter, completed ){
		var queryParam, queryBySQLParams, queryBySQLService;
		queryParam = new MapLib.REST.FilterParameter({
			name : "ST_RIDRGN@ORCL",			
			attributeFilter : attribufilter

		});
		queryBySQLParams = new MapLib.REST.QueryBySQLParameters({
			queryParams : [ queryParam ]
		});

		queryBySQLService = new MapLib.REST.QueryBySQLService(
				FMapLib.DemoURL.fangchan, {
					eventListeners : {
						"processCompleted" : completed,
						"processFailed" : processFailed
					}
				});
		queryBySQLService.processAsync(queryBySQLParams);
	}
	// 房屋点图层查询服务 公用方法
	function housequeservpoint ( attribufilter, completed ){
		var queryParam, queryBySQLParams, queryBySQLService;
		queryParam = new MapLib.REST.FilterParameter({
			name : "ST_RIDRGN_P@ORCL",			
			attributeFilter : attribufilter

		});
		queryBySQLParams = new MapLib.REST.QueryBySQLParameters({
			queryParams : [ queryParam ]
		});

		queryBySQLService = new MapLib.REST.QueryBySQLService(
				FMapLib.DemoURL.fangchan, {
					eventListeners : {
						"processCompleted" : completed,
						"processFailed" : processFailed
					}
				});
		queryBySQLService.processAsync(queryBySQLParams);
	}
	// 根据房屋地址查询类
	var HouseQueryByName = FMapLib.HouseQueryByName = function(string) {
		// var inputStr="";
		this.condition = "";
		vectorLayer.removeAllFeatures();
		// this.inputStr= document.getElementById("inputcontent").value;
		this.bite = string.split('');
		for ( var m = 0; m < this.bite.length; m++) {
			this.condition += " and ADDRESS like '%" + this.bite[m] + "%'";
		}

	};
	HouseQueryByName.prototype.open = function() {
		var filter="1=1 " + this.condition;
		var completed=houseQProcessCompleted;
		housequeserv(filter,completed);
	};
	function houseQProcessCompleted(queryEventArgs) {
		// 对查询结果进行渲染
		render(queryEventArgs);
	}
var mapPopup;
	/**
	 * @author Administrator
	 * @param id:当前地图所在div的唯一标示;tip:
	 *            消息提示框,内部公用方法
	 */
	function doMapAlert(id, tip, message, success) {
		/*
		 * if ($('#mapAlert').size()) { $('div').remove('#mapAlert'); }
		 */
		if (mapPopup) {
			map.removePopup(mapPopup);
		}
		if (tip) {
			tip += ':';
		}
		/*
		 * if (!success) { var htmlString = '<div id="mapAlert" class="alert
		 * alert-success fade in"
		 * style="background-color:yellow;position:absolute; top: 35px; left:
		 * 30%; width:30%; z-index: 2000; text-align: center; ">' + '<strong>' +
		 * tip + '</strong>' + message + '</div>'; } else { var htmlString = '<div
		 * id="mapAlert" class="alert alert-error fade in"
		 * style="position:absolute; top: 35px; left: 25%; width:50%; z-index:
		 * 2000;text-align: center;">' + '<strong>' + tip + '</strong>' +
		 * message + '</div>';
		 *  } $('#' + id).append($(htmlString));
		 */
		
		var layer = vectorLayer;
		var lonlat;
		
		if(tip.indexOf('错误信息')>-1){
			buffercenter=map.getCenter();
			lonlat = new MapLib.LonLat(buffercenter.lon,buffercenter.lat);
		}else{
			var geometry =layer.features[0].geometry;
			var bounds = geometry.bounds;
			lonlat = new MapLib.LonLat(bounds.right,bounds.top);
			
		}
		
		var contentHTML = "<div id='mapPopup' style=\'font-size:.9em; opacity: 0.7; overflow-y:hidden;\'>"; 
		contentHTML += "<div style='padding-left:10px;padding-top:10px;padding-bottom:5px;'>"+tip+'<br/>'+message+"</div></div>";  
		mapPopup = new MapLib.Popup.FramedCloud("popwin",lonlat,null,contentHTML,null,true); 
		map.addPopup(mapPopup); 
	}
	;
	var printWindow;
	/**
	 * 地图打印API 修改打印方式和引用的文件 李洪云2013。11。27
	 */
	var PrintMap = FMapLib.PrintMap = function(id) {
		var broz = MapLib.Browser.name;
		printWindow = window.open("");
		var strInnerHTML = document.getElementById(id).innerHTML;
		var strHeader = "<!DOCTYPE html><html><head><META HTTP-EQUIV='pragma' CONTENT='no-cache'><META HTTP-EQUIV='Cache-Control' CONTENT='no-cache, must-revalidate'><META HTTP-EQUIV='expires' CONTENT='Wed, 26 Feb 1997 08:21:57 GMT'><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' /><meta name='apple-mobile-web-app-capable' content='yes' /><title>地图打印</title>";
		var strCSS = "<link href=/gis/FMapLib/theme/css/sm.css rel='stylesheet' /><link href=/gis/FMapLib/theme/css/style.css  rel='stylesheet' /><link href=/gis/FMapLib/theme/css/sm-responsive.css rel='stylesheet'><link href=/gis/FMapLib/theme/css/sm-doc.css rel='stylesheet' />";
		var strScript = "<script src=/gis/FMapLib/theme/js/jquery-latest.js></script><script type = 'text/javascript'>"
				+ "\n"
				+ "function printDiv(){$('.newuiPrint').css({'display':'none'});window.print();$('.newuiPrint').css({'display':'block'});}</script>";
		var strBody = "</head><body><div class='print-header'><div class='superD'><h3>地图</h3></div><div id='"
				+ id
				+ "' >"
				+ strInnerHTML
				+ "</div><div id='superft'><div class='printClose'>"
				+ "<span class='newuiPrint' onclick = 'printDiv()'></span></div></div></div><style></style></body></html>";
		var strHTML = strHeader + strCSS + strScript + strBody;
		printWindow.document.write(strHTML);
		printWindow.document.close();

		// if (broz == 'firefox') {
		// 因为提示参数window。setTimeout无效所以都有同一个
		printWindow.onload = onloadHTML;
		// } else if (broz == 'safari' || broz == 'chrome' || broz == 'msie') {
		// window.setTimeout(onloadHTML(id), 50);
		// printWindow.onload = onloadHTML;
		// }
	}
	// 加载ＨＴＭＬ文档之初
	onloadHTML = function(id) {
		var strDOM = printWindow.document.getElementById(id).children[0].children;
		for ( var i = 0, length = strDOM.length; i < length; i++) {
			var idStr = strDOM[i].id;
			if (idStr.indexOf("MapLib.Control.ScaleLine") == -1
					&& idStr.indexOf("MapLib.Map") == -1) {
				strCss = strDOM[i].style.cssText;
				strCss = strCss + "display: none;";
				strDOM[i].style.cssText = strCss;
			}
		}
		var canvasPrint = printWindow.document.getElementsByTagName("canvas");
		var canvasMap = document.getElementsByTagName("canvas");
		for ( var i = 0, length = canvasPrint.length; i < length; i++) {
			pasteCanvas(canvasMap[i], canvasPrint[i]);
		}
	}
	// 粘贴
	pasteCanvas = function(canvasMap, canvasPrint) {
		var contextMap = canvasMap.getContext('2d');
		var imagedataMap = contextMap.getImageData(0, 0, canvasMap.width,
				canvasMap.height);
		var contextPrint = canvasPrint.getContext('2d');
		contextPrint.putImageData(imagedataMap, 0, 0);
	}
	/**
	 * 周边查询ＡＰＩ
	 */
	var QuerySurrounding = FMapLib.QuerySurrounding = function(map) {
		if (drawPolygon) {
			drawPolygon.deactivate();
		}
		if (drawLine) {
			drawLine.deactivate();
		}
		drawPoint = new MapLib.Control.DrawFeature(vectorLayer,
				MapLib.Handler.Point);
		map.addControl(drawPoint);
		drawPoint.activate();
		drawPoint.events.on({
			"featureadded" : drawPointCompleted || {}
		});
	};
	// 画点完成后执行的操作，添加marker
	function drawPointCompleted(drawGeometryArgs) {
		feature = drawGeometryArgs.feature;
		var point = feature.geometry;
		var size = new MapLib.Size(32, 32), offset = new MapLib.Pixel(
				-(size.w / 2), -size.h), icon = new MapLib.Icon(baseurl
				+ "theme/images/markerbig.png", size, offset);
		var marker = new MapLib.Marker(new MapLib.LonLat(point.x, point.y),
				icon);
		markerLayer.addMarker(marker);
		doMarkerAlert(point);
	}
	// 弹出信息框，输入缓冲区分析的半径
	doMarkerAlert = function(prefeature) {
		if (preFeature) {
			map.removePopup(preFeature.popup);
		}
		var contentHTML = "<div style='font-size:.8em; opacity: 0.8; width:150px; height:80px;'>"
				+ "<span style='font-weight: bold; font-size: 18px;'>距离查询</span><br>"
				+ "<div>半径"
				+ "<input id='distancevalue' style:'width:400px; height:400px' type='text'/>"
				+ "<button  id='butr' >确定" + "</div>";
		popup = new MapLib.Popup.FramedCloud("chicken", new MapLib.LonLat(
				prefeature.x, prefeature.y), null, contentHTML, null, true);
		prefeature.popup = popup;
		popup.panMapIfOutOfView = true;
		map.addPopup(popup);
		preFeature = prefeature;
		var dtvalue = $('#distancevalue').val();
		$("#butr").click(function() {
			doBuffer();// 可以执行了
		});
	}
	// 缓冲区分析功能
	function doBuffer() {
		drawPoint.deactivate();
		styleRegion = {
			strokeColor : "#304DBE",
			strokeWidth : 2,
			pointerEvents : "visiblePainted",
			fillColor : "#304DBE",
			fillOpacity : 0.4
		};
		var dtvalue = $('#distancevalue').val();
		var polygon = MapLib.Geometry.Polygon.createRegularPolygon(
				preFeature, dtvalue, 100, 360);
		feature.geometry = polygon;
		feature.style = styleRegion;
		vectorLayer.addFeatures(feature);
		queryByGeometry(polygon);
		map.removePopup(preFeature.popup);
	}
	// 几何查询功能
	queryByGeometry = function(queryGeometry) {
		var queryParam = new MapLib.REST.FilterParameter({
			name : "ST_RIDRGN@ORCL"
		}), rand = Math.random() + "";
		queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters(
				{
					queryParams : [ queryParam ],
					geometry : queryGeometry,
					spatialQueryMode : MapLib.REST.SpatialQueryMode.INTERSECT,
					customParams : rand
				});
		queryService = new MapLib.REST.QueryByGeometryService(
				FMapLib.DemoURL.fangchan);
		queryService.events.on({
			"processCompleted" : queryByGeoCompleted,
			"processFailed" : processFailed
		});
		queryService.processAsync(queryByGeometryParameters);
	}
	// 几何查询完成后，依次弹出marker的功能
	queryByGeoCompleted = function(queryEventArgs) {
		var radius = $('#distancevalue').value;
		var i, j, result = queryEventArgs.result;
		if (result && result.recordsets) {
			for (i = 0, recordsets = result.recordsets, len = recordsets.length; i < len; i++) {
				if (recordsets[i].features) {
					for (j = 0; j < recordsets[i].features.length; j++) {
						var geometry = recordsets[i].features[j].geometry, point = geometry
								.getCentroid(), size = new MapLib.Size(22, 20), offset = new MapLib.Pixel(
								-(size.w / 2), -size.h), icon = new MapLib.Icon(
								baseurl + "theme/images/house.png", size,
								offset);
						querymarker = new MapLib.Marker(new MapLib.LonLat(
								point.x, point.y), icon);
						querymarker.information = recordsets[i].features[j];
						markerLayer.addMarker(querymarker);
						querymarker.events.on({
							"mouseover" : querymarkeralert,
							"scope" : querymarker
						});
					}
					// doMapAlert("查询结果","在该查询范围内的房屋"+j+ "座");//弹出查询结果
					doMapAlert("map", "查询结果", "在该查询范围内的房屋" + j + "座", true);
				}
			}
		}
	}
	// 鼠标移动到marker上弹出信息框的函数
	querymarkeralert = function() {
		map.removePopup(preFeature.popup);
		var querymarkerlonlat = this;
		var querymarkerX = querymarkerlonlat.getLonLat().lon;// X坐标;
		var querymarkerY = querymarkerlonlat.getLonLat().lat;// Y坐标
		var attribute = querymarkerlonlat.information.attributes.ADDRESS;
		if (!attribute) {
			var markercontentHTML = "<div style='font-size:.8em; opacity: 0.8; width:150px; height:80px;'>"
					+ "<span style='font-weight: bold; font-size: 18px;'>房屋信息</span><br>"
					+ "<div>暂无" + "</div>";
		} else {
			var markercontentHTML = "<div style='font-size:.8em; opacity: 0.8; width:150px; height:80px;'>"
					+ "<span style='font-weight: bold; font-size: 18px;'>房屋信息</span><br>"
					+ "<div>" + attribute + "</div>";
		}
		popup = new MapLib.Popup.FramedCloud("chicken", new MapLib.LonLat(
				querymarkerX, querymarkerY), null, markercontentHTML, null,
				true);
		querymarkerlonlat.popup = popup;
		popup.panMapIfOutOfView = true;
		map.addPopup(popup);
		preFeature = querymarkerlonlat;
	}
	/**
	 * 根据名称查询小区API
	 */
	var VillageQueryByName =
	/**
	 * 
	 * @param string
	 * @returns {FMapLib.VillageQueryByName}
	 * 
	 * example 不带参数 var villageFindInst=new FMapLib.VillageQueryByName();
	 * villageFindInst.open(); 带参数 var villageFindInst=new
	 * FMapLib.VillageQueryByName("群盛华城"); villageFindInst.open();
	 */
	FMapLib.VillageQueryByName = function(string) {
		// 判断是否输入参数
		if (string == undefined) {
			this._param = "SMID > 0";
		} else {
			this._param = "REFNAME  like '%" + string + "%'";
		}
	};
	// open
	VillageQueryByName.prototype.open = function() {
		// vectorLayer.removeAllFeatures();
		var params = this._param;
		markerLayer.clearMarkers();
		var getFeatureParamVillage, getFeatureBySQLServiceVillage, getFeatureBySQLParamsVillage;

		getFeatureParamVillage = new MapLib.REST.FilterParameter({
			name : "小区@ORCL",
			attributeFilter : params
		});

		getFeatureBySQLParamsVillage = new MapLib.REST.GetFeaturesBySQLParameters(
				{
					queryParameter : getFeatureParamVillage,
					datasetNames : [ "ORCL:小区" ]
				});
		getFeatureBySQLServiceVillage = new MapLib.REST.GetFeaturesBySQLService(
				FMapLib.DemoURL.fangchan1, {
					eventListeners : {
						"processCompleted" : processCompletedVillage,
						"processFailed" : processFailed
					}
				});

		getFeatureBySQLServiceVillage
				.processAsync(getFeatureBySQLParamsVillage);

	};
	// 小区查询成功
	function processCompletedVillage(getFeaturesEventArgs1) {
		var i, len, features, feature, result = getFeaturesEventArgs1.result;
		if (result && result.features) {
			features = result.features;
			for (i = 0, len = features.length; i < len; i++) {
				feature = features[i];
				features.push(feature);
				var size = new MapLib.Size(30, 25), offset = new MapLib.Pixel(
						-(size.w / 2), -size.h), icon = new MapLib.Icon(
						baseurl + "theme/images/marker11.png", size, offset);
				map.zoomTo(6);
				map.setCenter(new MapLib.LonLat(feature.attributes["SMX"],
						feature.attributes["SMY"]));
				var marker = new MapLib.Marker(new MapLib.LonLat(
						features[i].attributes["SMX"],
						features[i].attributes["SMY"]), icon);
				marker.information = features[i];
				markerLayer.addMarker(marker);

				marker.events.on({
					"mouseover" : villageInfo,
					"scope" : marker
				});
				marker.events.on({
					"mouseout" : destroy,
					"scope" : marker
				});
				marker.events.on({
					"click" : findHouse,
					"scope" : marker
				});

			}
		}
		// 销毁
		destroy = function() {
			markerLayer.map.removePopup(popup);
		}
		// 小区信息窗口显示
		villageInfo = function() {
			marker = this;
			var lonlat = marker.getLonLat();
			cityname = marker.information.attributes["REFNAME"];
			var contentHTML = "<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden;'>"
					+ "<span style='font-weight: bold; font-size: 18px;'>详细信息</span><br>";
			contentHTML += "名称：" + marker.information.attributes["REFNAME"]
					+ "<br>";
			contentHTML += "SMID：" + marker.information.attributes["SMID"]
					+ "</div>";
			contentHTML += "<br>" + "<div>" + "<img border='0' src='" + baseurl
					+ "theme/images/123.jpg' width='160' height='100'/>"
					+ "</div>";
			popup = new MapLib.Popup.FramedCloud("popwin",
					new MapLib.LonLat(lonlat.lon, lonlat.lat), null,
					contentHTML, null, true, null, true);
			popup.keepInMap = true;
			popup.closeOnMove = true;
			feature.popup = popup;
			markerLayer.map.addPopup(popup);
		}
		// 查找并定位到所选小区范围内的房屋
		findHouse = function() {
			map.zoomTo(10);
			findHouseBySQL();
		}
	}
	/**
	 * 查询某小区辖区内所有房屋
	 */
	function findHouseBySQL() {
		markerLayer.clearMarkers();
		var getFeatureParamFangwu, getFeatureBySQLServiceFangwu, getFeatureBySQLParamsFangwu;

		getFeatureParamFangwu = new MapLib.REST.FilterParameter({
			name : "房屋@ORCL",
			attributeFilter : "小区名称  like '%" + cityname + "%'"
		});
		getFeatureBySQLParamsFangwu = new MapLib.REST.GetFeaturesBySQLParameters(
				{
					queryParameter : getFeatureParamFangwu,
					datasetNames : [ "ORCL:房屋" ]
				});
		getFeatureBySQLServiceFangwu = new MapLib.REST.GetFeaturesBySQLService(
				FMapLib.DemoURL.fangchan1, {
					eventListeners : {
						"processCompleted" : processCompletedFangwu,
						"processFailed" : processFailed
					}
				});
		getFeatureBySQLServiceFangwu.processAsync(getFeatureBySQLParamsFangwu);
	}
	// 房屋查询成功
	function processCompletedFangwu(getFeaturesEventArgs2) {
		var i, len, features, feature, result = getFeaturesEventArgs2.result;
		if (result && result.features) {
			features = result.features;
			for (i = 0, len = features.length; i < len; i++) {
				feature = features[i];
				features.push(feature);
				var size = new MapLib.Size(25, 25), offset = new MapLib.Pixel(
						-(size.w / 2), -size.h), icon = new MapLib.Icon(
						baseurl + "theme/images/cluster3.png", size, offset);
				var marker = new MapLib.Marker(new MapLib.LonLat(
						features[i].attributes["SMX"],
						features[i].attributes["SMY"]), icon);
				marker.information = features[i];
				markerLayer.addMarker(marker);
				marker.events.on({
					"click" : onFeatureSelect,
					"scope" : marker
				});
			}
		}
		// 要素被选中时调用此函数
		onFeatureSelect = function(feature) {
			marker = this;
			var lonlat = marker.getLonLat();
			var contentHTML = "<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden; background:#FFFF33'>"
					+ "<span style='font-weight: bold; font-size: 18px;'>详细信息</span><br>";
			contentHTML += "名称：" + marker.information.attributes["ADDRESS"]
					+ "<br>";
			contentHTML += "所属小区：" + marker.information.attributes["小区名称"]
					+ "<br>";
			contentHTML += "X坐标：" + marker.information.attributes["SMX"]
					+ "<br>";
			contentHTML += "Y坐标：" + marker.information.attributes["SMY"]
					+ "<br>";
			contentHTML += "健康完损等级：" + marker.information.attributes["健康完损等级"]
					+ "<br>";
			contentHTML += "地上层数：" + marker.information.attributes["地上层数"]
					+ "<br>";
			contentHTML += "SMID：" + marker.information.attributes["SMID"]
					+ "<br>";
			contentHTML += "<a href='./house_list/house_list.html' target='_blank'>点击查看楼盘表</a>"
					+ "</div>";
			// 初始化一个弹出窗口，当某个地图要素被选中时会弹出此窗口，用来显示选中地图要素的属性信息
			popup = new MapLib.Popup.FramedCloud("popwin",
					new MapLib.LonLat(lonlat.lon, lonlat.lat), null,
					contentHTML, null, true, null, true);
			feature.popup = popup;
			markerLayer.map.addPopup(popup);
		}
	}

	// 房屋查询失败
	// function processFailedFangwu(e) {
	// doMapAlert("map", "", e.error.errorMsg, true);
	// }

	/**
	 * 卫星地图工具类
	 */
	var SatelliteMapSwitcher = FMapLib.SatelliteMapSwitcher = function(map) {
		var insertHtml = "<div class='changemap' id='satellite'"
				+ "style='border-style: solid; cursor: pointer; border-color: gray; border-width: 2px; position: absolute; float: right;height:50px; '>"
				+ "<a><img id='changemap' border='0' title='显示卫星地图' "
				+ "src=/gis/FMapLib/theme/images/satellite.png  width=50px height=50px /></a>"
				+ "</div>"
				+ "<div class='changemap1' id='satellite1'"
				+ "style='text-align: center; cursor: pointer; position: absolute; float: right;padding-bottom:0px; width: 52px; height: 18px;'>"
				+ "<a class='changemap2' id='changemap' title='显示卫星地图'"
				+ "style='height: auto; color: white;'" + ">卫星</a>" + "</div>";
		// 在地图图层中自定义地图转换器图层mapswitcherDiv，做为地图转换器实现的基础容器。20131218 wm
		var g = document.createElement("div");
		g.id = "mapswitcherDiv";
		g.style.position = "absolute";
		g.style.width = "5%";
		g.style.height = "25%";
		g.style.top = "40px";
		g.style.right = "5px";
		// g.style.backgroundColor = "red";
		g.style.zIndex = 1005;
		map.viewPortDiv.appendChild(g);// map.viewPortDiv是所有自定义地图图层的父级容器
		$("#mapswitcherDiv").append(insertHtml);

		$("#changemap").bind("click", function() {
			switchmap();
		});
		$("#changemap").bind("mouseover", function() {
			changecolor();
		});
		$("#changemap").bind("mouseout", function() {
			removecolor();
		});
		$("#changemap1").bind("click", function() {
			switchmap();
		});
		$("#changemap1").bind("mouseover", function() {
			changecolor();
		});
		$("#changemap1").bind("mouseout", function() {
			removecolor();
		});
	};

	function switchmap() {
		if (bGoogle == false) {
			map.removeLayer(map.baseLayer);
			map.addLayer(imagelayer);
			map.setBaseLayer(imagelayer);
			$("#changemap").attr("src", baseurl + "theme/images/changemap.png");
			$("#changemap").attr("title", "显示普通地图");
			$(".changemap2").attr("title", "显示普通地图");
			$(".changemap2").text("地图");
			bGoogle = true;
			clearFeatures();
			// tipAlert("当前地图为：", "影像图");
		} else {
			map.removeLayer(map.baseLayer);
			map.addLayer(currentlayer[0]);
			map.setBaseLayer(currentlayer[0]);

			$("#changemap").attr("src", baseurl + "theme/images/satellite.png");
			$("#changemap").attr("title", "显示卫星地图");
			$(".changemap2").attr("title", "显示卫星地图");
			$(".changemap2").text("卫星");
			bGoogle = false;
			clearFeatures();
// if (currentlayer[0] == layer) {
// tipAlert("地图版本号为：" + "平面图-2013-4" + "&nbsp", "审核人：王霞" + "&nbsp"
// + "发布人：王霞");
// } else {
// tipAlert("地图版本号为：" + cutText + "&nbsp", "审核人：王霞" + "&nbsp"
// + "发布人：王霞");
// }
		}
	}

	function changecolor() {
		$("#satellite1").css({
			"background" : "#9999FF"
		});
		$("#satellite").css({
			"border-color" : "#9999FF"
		});
	}
	function removecolor() {
		$("#satellite1").css({
			"background" : ""
		});
		$("#satellite").css({
			"border-color" : "gray"
		});
	}
	// 顶部信息提示框
	function tipAlert(tip, mess, success) {
		if ($('#mapAlert').size()) {
			$('div').remove('#mapAlert');
		}
		// if(tip){
		// tip += '：';
		// }
		if (!success) {
			var htmlString = '<div id="mapAlert" class="alert alert-success fade in" style="background-color:yellow;position:absolute; top: 35px; left: 30%; width:30%; z-index: 2000; text-align: center; ">'
					+ tip + mess + '</div>';
		} else {
			var htmlString = '<div id="mapAlert" class="alert alert-error fade in" style="position:absolute; top: 35px; left: 25%; width:50%; z-index: 2000;text-align: center;">'
					+ tip + mess + '</div>';

		}
		$('#map').append($(htmlString));
	}

	var VersonManager =
	/**
	 * author 洛佳明 地图历史版本管理类
	 * 
	 * @param id
	 *            example var versonInst=new
	 *            FMapLib.VersonManager("innerContainer"); new
	 *            PopupLayer({trigger:"#ele3",popupBlk:"#blk3",closeBtn:"#close3",useFx:true,offsets:{
	 *            x:-570, y:50 }});
	 */
		FMapLib.VersonManager = function(map) {
// var htmlStr = "<div id='blk3' class='blk' style='display: none;'>"
// + "<div class='head'>"
// + "<div class='head-right'></div>"
// + "</div>"
// + "<div class='main'>"
// + "<h2>查看地图历史版本</h2>"
// + "<a href='javascript:void(0)' id='close3' class='closeBtn'>关闭</a>"
// + "<select id='lishi'>"
// + "</select>"
// + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type='button'id='vmap'
// style='width:55px;height:23px;background:url(/gis/resource/images/anniu.png)
// no-repeat; border:none; color:white;' value='版本切换' />"
// + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<input type='button'id='compare'
// style='width:55px;height:23px;background:url(/gis/resource/images/anniu.png)
// no-repeat; border:none; color:white;' value='地图对比' />"
// + "</div>"
// + "<div class='foot'>" + "<div class='foot-right'></div>"
// + "</div>" + "</div>";
// $("#" + id1).append(htmlStr);
		var versionHTML="";
		$.post('realtygis.versionmanagerpopup', function(data, textStatus) {
			var default_mapnumber="";
			var jdata = jQuery.parseJSON(data);
			if(jdata){
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
			}
			$("#lishi").append(versionHTML);
		
			$('#compare').bind("click", function() {
				var val = $("#lishi").val();
				  // window.open('realtygis.splitscreencontrast?mapname='+val+"&default_mapnumber="+default_mapnumber,'_blank','depended=yes,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
				window.open('realtygis.splitscreencontrast?mapname='+val+"&default_mapnumber="+default_mapnumber,'_blank','depended=yes,top='+(window.screen.height-30-600)/2+',left='+(window.screen.width-10-1000)/2+',width=1000,height=600,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
			});
			$('#vmap').bind("click", function() {				  
				if(MAP_VISION){	 	
					 sizePane('south',3,"in"); 	
					 openPane('south',"in");
				  }	
				 $("#datatb").empty();
				var val = $("#lishi").val();				
				var rid = $("#lishi").find("option:selected").attr("id");
		  // window.open('realtygis.splitscreencontrast?mapname='+objText,'_blank','depended=yes,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
				changemap(rid, map,val);
			});
			// 健康等级地图叠加显示
			$('#jkdjmap').bind("click", function() {
				var val = $("#lishi").val();
				window.open('realtygis.jkdjforview?mapname='+val+"&default_mapnumber="+default_mapnumber,'_blank','depended=yes,top='+(window.screen.height-30-600)/2+',left='+(window.screen.width-10-1000)/2+',width=1000,height=600,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
			});
		});
	
	};
	function changemap(rid, map,val) {		
        var objText = val;
		var objId = rid;
		map.removeLayer(map.baseLayer);
		if(objText!="1405131040"){
		    if(document.getElementById("popupWin")) {
		        $("#popupWin").remove();
		        $("#hiddendiv").remove();
			} 	
			map.addLayer(layersArr[objId]);
			currentlayer[0] = layersArr[objId];
		}else{
			layerControl();
		}
		cutText = objText;
	}
	/**
	 * @author 李洪云 3013 11 28 点密度专题图生成函数,主要执行后台查询service的生成
	 * @param fieldname,统计字段名,要求必须和数据库中的字段名一致
	 */
	var DotDensity = FMapLib.DotDensity = function(fieldname) {
		removeTheme();
		var themeService = new MapLib.REST.ThemeService(FMapLib.DemoURL.fangchan, {
			eventListeners : {
				"processCompleted" : DotDensityCompleted,
				"processFailed" : themeFailed
			}
		}), dotStyle = new MapLib.REST.ServerStyle({
			markerSize : 3,
			markerSymbolID : 12,
			lineColor : new MapLib.REST.ServerColor(255, 0, 0),
			fillBackColor : new MapLib.REST.ServerColor(255, 0, 0)
		}), themeDotDensity = new MapLib.REST.ThemeDotDensity({
			dotExpression : fieldname,
			value : 5000,
			style : dotStyle
		}), themeParameters = new MapLib.REST.ThemeParameters({
			themes : [ themeDotDensity ],
			datasetNames : [ "asdR" ],
			dataSourceNames : [ "ORCL" ]
		});
		themeService.processAsync(themeParameters);
	}
	/**
	 * @author 李洪云 3013 11 28
	 * @param themeEventArgs,函数默认，为后台传回的数据
	 *            接受点密度专题图数据，将其作为图层精进行展示
	 */
	function DotDensityCompleted(themeEventArgs) {
		if (themeEventArgs.result.resourceInfo.id) {
			dotLayer = new MapLib.Layer.TiledDynamicRESTLayer("点密度专题图",
					FMapLib.DemoURL.fangchan, {
						cacheEnabled : false,
						transparent : true,
						layersID : themeEventArgs.result.resourceInfo.id
					}, {
						"maxResolution" : "auto"
					});
			dotLayer.events.on({
				"layerInitialized" : function() {
					map.addLayer(dotLayer);
				}
			});
		}
	}
	/**
	 * @author 李洪云 3013 11 28 等级符号专题图生成函数,主要执行后台查询service的生成
	 * @param fieldname,统计字段名,要求必须和数据库中的字段名一致
	 */
	var GraduatedSymbol = FMapLib.GraduatedSymbol = function(filedname) {
		removeTheme();
		var themeService = new MapLib.REST.ThemeService(FMapLib.DemoURL.fangchan, {
			eventListeners : {
				"processCompleted" : symbolthemeCompleted,
				"processFailed" : themeFailed
			}
		}), graStyle = new MapLib.REST.ThemeGraduatedSymbolStyle({
			positiveStyle : new MapLib.REST.ServerStyle({
				markerSize : 1.5,
				markerSymbolID : 0,
				lineColor : new MapLib.REST.ServerColor(255, 165, 0),
				fillBackColor : new MapLib.REST.ServerColor(255, 0, 0)
			})
		}), themeGraduatedSymbol = new MapLib.REST.ThemeGraduatedSymbol({
			expression : filedname,
			baseValue : 35000000,
			graduatedMode : MapLib.REST.GraduatedMode.CONSTANT,
			flow : new MapLib.REST.ThemeFlow({
				flowEnabled : true
			}),
			style : graStyle
		}), themeParameters = new MapLib.REST.ThemeParameters({
			themes : [ themeGraduatedSymbol ],
			datasetNames : [ "asdR" ],
			dataSourceNames : [ "ORCL" ]
		});

		themeService.processAsync(themeParameters);
	}
	/**
	 * @author 李洪云 3013 11 28
	 * @param themeEventArgs,函数默认，为后台传回的数据
	 *            接受由等级符号专题图数据，将其作为图层精进行展示
	 */
	function symbolthemeCompleted(themeEventArgs) {
		if (themeEventArgs.result.resourceInfo.id) {
			themeLayer = new MapLib.Layer.TiledDynamicRESTLayer("等级符号专题图",
					FMapLib.DemoURL.fangchan, {
						cacheEnabled : false,
						transparent : true,
						layersID : themeEventArgs.result.resourceInfo.id
					}, {
						"maxResolution" : "auto"
					});
			themeLayer.events.on({
				"layerInitialized" : function() {
					map.addLayer(themeLayer);
				}
			});
		}
	}
	/**
	 * 房屋健康等级标签图
	 * 
	 * @author Administrator
	 * 
	 */
	FMapLib.BuildingHealthGradeLabel=function(){		
	// removeTheme();
		if(map)
		map.allOverlays = true;
	var style1,style2,style3,style4;
	 style1 = new MapLib.REST.ServerTextStyle({
			fontHeight : 4,
			foreColor : new MapLib.REST.ServerColor(0, 255, 0),
			sizeFixed : true,
			bold : true
		}); style2 = new MapLib.REST.ServerTextStyle({
			fontHeight : 4,
			foreColor : new MapLib.REST.ServerColor(255, 255, 255),
			sizeFixed : true,
			bold : true
		});style3 = new MapLib.REST.ServerTextStyle({
			fontHeight : 4,
			foreColor : new MapLib.REST.ServerColor(255, 255, 0),
			sizeFixed : true,
			bold : true
		});style4 = new MapLib.REST.ServerTextStyle({
			fontHeight : 4,
			foreColor : new MapLib.REST.ServerColor(250, 0, 0),
			sizeFixed : true,
			bold : true
		});
		
	   var 	themeLabelIteme1 = new MapLib.REST.ThemeLabelItem({
			start :1,
			end : 3,
			style : style1
		}), themeLabelIteme2 = new MapLib.REST.ThemeLabelItem({
			start : 3,
			end : 5,
			style : style2,
			visible : true
		}), themeLabelIteme3 = new MapLib.REST.ThemeLabelItem({
			start : 5,
			end : 7,
			style : style3
		}),themeLabelIteme4 = new MapLib.REST.ThemeLabelItem({
			start : 7,
			end : 9,
			style : style4
		})
	   ThemeLabelService("HEALTHGRADE","RANGEITEM","ST_RIDRGN_JKDA_P","ORCL",[ themeLabelIteme1, themeLabelIteme2, themeLabelIteme3,themeLabelIteme4])
		
}
var ThemeLabelService =
/**
 * @author 李洪云 3013 11 28 标签专题图生成函数,主要执行后台查询service的生成
 * @param fieldname,统计字段名,要求必须和数据库中的字段名一致;rangefiledname
 *            ，联合统计字段名，要求必须和数据库中的字段名一致
 */
 FMapLib.ThemeLabelService = function(filedname, rangefiledname,datasetName,datasourceName,items) {
	// 向专题图内存数据类里赋值
	var themeLabelTwo = new MapLib.REST.ThemeLabel({
		// 标注字段表达式
		labelExpression : filedname,
		rangeExpression : rangefiledname,
		numericPrecision : 3,
		overlapAvoided : false,
		items : items
	}),
	// 创建矩阵标签元素
     LabelThemeCellTwo = new MapLib.REST.LabelThemeCell({
		themeLabel : themeLabelTwo
	}),

	backStyle = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(255, 255, 0),
		fillOpaqueRate : 60,
		lineWidth : 0.1
	}),

	// 创建矩阵标签专题图
	themeLabel = new MapLib.REST.ThemeLabel({
		overlapAvoided : false,
		matrixCells : [ [ LabelThemeCellTwo ] ],
		background : new MapLib.REST.ThemeLabelBackground({
			backStyle : backStyle,
			labelBackShape : "RECT"
		})
	}), themeParameters = new MapLib.REST.ThemeParameters({
		datasetNames : [ datasetName ],
		dataSourceNames : [ datasourceName ],
		themes : [ themeLabelTwo ]
	});

	TemeService(themeParameters,1);
}
/**
 * @author 李洪云 3013 11 28
 * @param themeEventArgs,函数默认，为后台传回的数据
 *            接受由标签专题图数据，将其作为图层精进行展示
 */
function LabelthemeCompleted(themeEventArgs) {
	if (themeEventArgs.result.resourceInfo.id) {
		labelLayer = new MapLib.Layer.TiledDynamicRESTLayer("标签专题图",
				FMapLib.DemoURL.fangchan, {
					cacheEnabled : false,
					transparent : true,
					layersID : themeEventArgs.result.resourceInfo.id
				}, {
					"maxResolution" : "auto"
				});
		labelLayer.events.on({
			"layerInitialized" : function() {
				map.addLayer(labelLayer);
			}
		});
	}
}

	/**
	 * @author 李洪云 3013 11 29 范围值专题图生成函数,主要执行后台查询service的生成
	 * @param fieldname,统计字段名,要求必须和数据库中的字段名一致
	 */
	var ThemeRange = FMapLib.ThemeRange = function(filedname) {
		removeTheme();
		var themeService = new MapLib.REST.ThemeService(FMapLib.DemoURL.fangchan, {
			eventListeners : {
				"processCompleted" : themeRangeCompleted,
				"processFailed" : themeFailed
			}
		}), style1 = new MapLib.REST.ServerStyle({
			fillForeColor : new MapLib.REST.ServerColor(137, 203, 187),
			lineColor : new MapLib.REST.ServerColor(0, 0, 0),
			lineWidth : 0.1
		}), style2 = new MapLib.REST.ServerStyle({
			fillForeColor : new MapLib.REST.ServerColor(233, 235, 171),
			lineColor : new MapLib.REST.ServerColor(0, 0, 0),
			lineWidth : 0.1
		}), style3 = new MapLib.REST.ServerStyle({
			fillForeColor : new MapLib.REST.ServerColor(135, 157, 157),
			lineColor : new MapLib.REST.ServerColor(0, 0, 0),
			lineWidth : 0.1
		}), themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
			start : 0,
			end : 10000,
			style : style1
		}), themeRangeIteme2 = new MapLib.REST.ThemeRangeItem({
			start : 10000,
			end : 100000,
			style : style2
		}), themeRangeIteme3 = new MapLib.REST.ThemeRangeItem({
			start : 100000,
			end : 120000,
			style : style3
		}),
		// 添加内存数据memoryData 使用SMID划分区域
		themeRange = new MapLib.REST.ThemeRange({
			rangeExpression : filedname,
			rangeMode : MapLib.REST.RangeMode.EQUALINTERVAL,
			items : [ themeRangeIteme1, themeRangeIteme2, themeRangeIteme3 ]
		}), themeParameters = new MapLib.REST.ThemeParameters({
			datasetNames : [ "asdR" ],
			dataSourceNames : [ "ORCL" ],
			themes : [ themeRange ]
		});

		themeService.processAsync(themeParameters);
	}
	/**
	 * @author 李洪云 3013 11 29
	 * @param themeEventArgs,函数默认，为后台传回的数据
	 *            接收由范围值专题图数据，将其作为图层精进行展示
	 */
	function themeRangeCompleted(themeEventArgs) {
		if (themeEventArgs.result.resourceInfo.id) {
			rangeLayer = new MapLib.Layer.TiledDynamicRESTLayer("修改后的样式",
					FMapLib.DemoURL.fangchan, {
						cacheEnabled : false,
						transparent : true,
						layersID : themeEventArgs.result.resourceInfo.id
					}, {
						"maxResolution" : "auto"
					});
			rangeLayer.events.on({
				"layerInitialized" : function() {
					map.addLayer(rangeLayer);
				}
			});
		}
	}
	/**
	 * 饼状统计专题图生成函数,主要执行后台查询service的生成
	 * 
	 * @param caption,统计字段的caption数组
	 *            filedname 统计子都昂数组，需要和数据库中相关表字段一致
	 */
	var ThemeGraph = FMapLib.ThemeGraph = function(caption, filedname) {
		removeTheme();
		map.allOverlays = true;
		loading();
		/*
		 * 创建统计专题图对象，ThemeGraph 必设 items。 专题图参数 ThemeParameters 必设
		 * theme（即以设置好的分段专题图对象）、dataSourceName 和 datasetName
		 */
		var style1 = new MapLib.REST.ServerStyle({
			fillForeColor : new MapLib.REST.ServerColor(246,189,15),
			lineColor : new MapLib.REST.ServerColor(246,189,15),
			fillOpaqueRate: 70,
			lineWidth: 0.1
		}),
		style2 = new MapLib.REST.ServerStyle({
			fillForeColor : new MapLib.REST.ServerColor(139,186,0),
			lineColor : new MapLib.REST.ServerColor(139,186,0),
			fillOpaqueRate: 70,
			lineWidth: 0.1
		}),
		// 定义统计专题图子项item1
		item1 = new MapLib.REST.ThemeGraphItem({
			caption : caption[0],
			graphExpression : filedname[0],
			// 制作专题图时的值数组
			// memoryDoubleValues : [ 10, 64, 50.2, 99.9, 69.7 ],
			uniformStyle : style1
		}),
		// 定义统计专题图子项item2
		item2 = new MapLib.REST.ThemeGraphItem({
			caption : caption[1],
			graphExpression : filedname[1],
			// 制作专题图时的值数组
			// memoryDoubleValues : [ 3, 64, 5, 92.1, 69.7 ],
			uniformStyle : style2
		}),
		// 定义专题图对象
		themeGraph = new MapLib.REST.ThemeGraph({
			items : new Array(item1,item2),
			 barWidth: 0.005,
			// 制作专题图时的键数组
			// memoryKeys : [ 1, 2, 3, 4, 5 ],
			graduatedMode: MapLib.REST.GraduatedMode.SQUAREROOT,
			graphAxes : new MapLib.REST.ThemeGraphAxes({
				axesDisplayed : false,
				axesGridDisplayed : false
			}),
			graphSize : new MapLib.REST.ThemeGraphSize({
				maxGraphSize : 20000,
				minGraphSize : 10000
			}),
			// graphSizeFixed:true,
			
			graphText : new MapLib.REST.ThemeGraphText({
				graphTextDisplayed : true,
				graphTextFormat : MapLib.REST.ThemeGraphTextFormat.VALUE,
				graphTextStyle : new MapLib.REST.ServerTextStyle({
					sizeFixed : true,
					align : MapLib.REST.TextAlignment.MIDDLELEFT,
					fontHeight : 7,
					fontWidth : 5,
					bold : true,
					// fontName : 800,
					outline: true,
					// shadow : true,
					// foreColor: new MapLib.REST.ServerColor(127,25,127),
					fontName : '微软雅黑'
				})
			}),
			graphType : MapLib.REST.ThemeGraphType.BAR3D// BAR3D PIE3D
		}),

		// 专题图参数对象
		themeParameters = new MapLib.REST.ThemeParameters({
			themes : [ themeGraph ],
			datasetNames : [ "asdR" ],
			dataSourceNames : [ "ORCL" ]

		}),

		// 与服务端交互
		themeService = new MapLib.REST.ThemeService(FMapLib.DemoURL.fangchan, {
			eventListeners : {
				"processCompleted" : graphThemeCompleted,
				"processFailed" : themeFailed
			}
		});
		themeService.processAsync(themeParameters);
		
		// 生成图例
		// 专题图图例
		var doc=document.getElementById("themelegend");
		if(doc!=null){
		$("#themelegend").remove();
		}
		var color = new Array('#F6BD0F', '#8BBA00');
		var themehtml=
			"<div><table id='timetable' border='0' cellspacing='6' cellpadding='0'>"+
			"<tr><td width='15'  height='7' bgcolor='"+color[0]+"'></td>"+
			"<td width='130' height='7'><a>建筑数量(幢)</a></td><tr>"+
			"<tr><td width='15px'  height='7px' bgcolor='"+color[1]+"'></td>"+
			"<td width='130px' height='7px'><a>建筑面积(百平方米)</a></td><tr>"+
			"</tr></table></div>";
		map.initLegendDiv();// 初始化地图图例图层
		map.flashLegend(themehtml);// 自定义图例内容
	}
	/**
	 * @param themeEventArgs,函数默认，为后台传回的数据
	 *            接受由统计专题图数据，将其作为图层精进行展示
	 */
	function graphThemeCompleted(themeEventArgs) {
		if (themeEventArgs.result.resourceInfo.id) {
			themeLayer = new MapLib.Layer.TiledDynamicRESTLayer("饼状统计专题图",
					FMapLib.DemoURL.fangchan, {
						cacheEnabled : false,
						transparent : true,
						layersID : themeEventArgs.result.resourceInfo.id
					}, {
						maxResolution : "auto"
					});
			themeLayer.events.on({
				"layerInitialized" : function() {
					map.addLayer(themeLayer);
				}
			});
		}
		removeLoading();
	}
	var TemeService=
		/**
		 * 专题图服务类 TemeService
		 * 
		 * @author wangmeng 20130426
		 * @param 专题参数，参见FMapLib.TemeRangeService传参
		 */
		FMapLib.TemeService=function(themeParameters,type){
			var themeService = new MapLib.REST.ThemeService(FMapLib.DemoURL.fangchan, {
				eventListeners : {
					"processCompleted" : type==0?rangeServiceCompleted:labelServiceCompleted,
					"processFailed" : themeFailed
				}
			});		
			themeService.processAsync(themeParameters);
		}	
		function rangeServiceCompleted(themeEventArgs) {
		    if (rangeLayer) {
					map.removeLayer(rangeLayer, true);
					rangeLayer = null;
				}
			if (themeEventArgs.result.resourceInfo.id) {			
				rangeLayer = new MapLib.Layer.TiledDynamicRESTLayer("范围值专题图",
						FMapLib.DemoURL.fangchan, {
							cacheEnabled : false,
							transparent : true,
							layersID : themeEventArgs.result.resourceInfo.id
						}, {
							"maxResolution" : "auto"
						});
				rangeLayer.events.on({
					"layerInitialized" : function() {
						map.addLayer(rangeLayer);					
						map.allOverlays = false;
					}
				});
			}
			removeLoading();
		}
		function labelServiceCompleted(themeEventArgs) {
		    if (labelLayer) {
					map.removeLayer(labelLayer, true);
					labelLayer = null;
		    }
			if (themeEventArgs.result.resourceInfo.id) {			
				labelLayer = new MapLib.Layer.TiledDynamicRESTLayer("标签专题图",
						FMapLib.DemoURL.fangchan, {
							cacheEnabled : false,
							transparent : true,
							layersID : themeEventArgs.result.resourceInfo.id
						}, {
							"maxResolution" : "auto"
						});
				labelLayer.events.on({
					"layerInitialized" : function() {
						map.addLayer(labelLayer);					
							map.allOverlays = false;
					}
				});
			}
		}
		function themeFailed(serviceFailedEventArgs) {
			doMapAlert("", serviceFailedEventArgs.error.errorMsg, true);
			removeLoading();
		}
		var TemeRangeService=
		/**
		 * 范围值专题图服务类
		 * 
		 * @author wangmeng 20130426
		 * @param filedname,统计字段名,要求必须和数据库中的字段名一致|
		 * @param datasetName,数据集名称|
		 * @param themeRangeItemArray
		 *            分组特征定义数组,定义了一组样式特征及取值特征的对应关系 (譬如： var style1 = new
		 *            MapLib.REST.ServerStyle({ fillForeColor : new
		 *            MapLib.REST.ServerColor(137, 203, 187), lineColor : new
		 *            MapLib.REST.ServerColor(0, 255, 0), lineWidth : 0.1,
		 *            }),style2 = new MapLib.REST.ServerStyle({ fillForeColor :
		 *            new MapLib.REST.ServerColor(233, 235, 171), lineColor :
		 *            new MapLib.REST.ServerColor(255, 255, 0), lineWidth : 0.1
		 *            }),themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
		 *            start : 0,//此范围段的开始值 end : 100,//此范围段的结束值 style :
		 *            style1//此范围段的样式 }), themeRangeIteme2 = new
		 *            MapLib.REST.ThemeRangeItem({ start : 100,//此范围段的开始值 end :
		 *            1000,//此范围段的结束值 style : style2//此范围段的样式
		 *            }),themeRangeItemArray=[themeRangeIteme1,
		 *            themeRangeIteme2; )
		 * 
		 * 
		 */
		  FMapLib.TemeRangeService=function(fieldname,datasetName,dataSourceName,themeRangeItemArray){		
			// 添加内存数据memoryData 使用SMID划分区域
			var themeRange = new MapLib.REST.ThemeRange({
				rangeExpression : fieldname,
				rangeMode : MapLib.REST.RangeMode.EQUALINTERVAL,
				items :themeRangeItemArray
					
			});
			var themeParameters = new MapLib.REST.ThemeParameters({
				datasetNames : [ datasetName ],// 比如 st_ridrgn
				dataSourceNames : [ dataSourceName ],
				// displayFilters:["1=1 and "+fieldname+" is not null and
				// "+fieldname+" > 0"],
				themes : [ themeRange ]
			});
			TemeService(themeParameters,0);
		}
		var TemeUniqueService=
		/**
		 * 单值专题图服务类
		 * 
		 * @author wangmeng 20130426
		 * @param filedname,统计字段名,要求必须和数据库中的字段名一致|
		 * @param datasetName,数据集名称|
		 * @param themeRangeItemArray
		 *            分组特征定义数组,定义了一组样式特征及取值特征的对应关系 (譬如： var style1 = new
		 *            MapLib.REST.ServerStyle({ fillForeColor : new
		 *            MapLib.REST.ServerColor(137, 203, 187), lineColor : new
		 *            MapLib.REST.ServerColor(0, 255, 0), lineWidth : 0.1,
		 *            }),style2 = new MapLib.REST.ServerStyle({ fillForeColor :
		 *            new MapLib.REST.ServerColor(233, 235, 171), lineColor :
		 *            new MapLib.REST.ServerColor(255, 255, 0), lineWidth : 0.1
		 *            }),themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
		 *            start : 0,//此范围段的开始值 end : 100,//此范围段的结束值 style :
		 *            style1//此范围段的样式 }), themeRangeIteme2 = new
		 *            MapLib.REST.ThemeRangeItem({ start : 100,//此范围段的开始值 end :
		 *            1000,//此范围段的结束值 style : style2//此范围段的样式
		 *            }),themeRangeItemArray=[themeRangeIteme1,
		 *            themeRangeIteme2; )
		 * 
		 * 
		 */
		FMapLib.TemeUniqueService=function(fieldname,datasetName,datasourceName,themeUniqueItemArray){		
			// 添加内存数据memoryData 使用SMID划分区域
			var themeUnique = new MapLib.REST.ThemeUnique({
				uniqueExpression : fieldname,			
				items :themeUniqueItemArray		
					
			});
			var themeParameters = new MapLib.REST.ThemeParameters({
				datasetNames : [ datasetName ],
				dataSourceNames : [ datasourceName ],
				themes : [ themeUnique ]
			});
			TemeService(themeParameters);
		}
		
		
		
			/**
			 * 房屋健康等级范围专题
			 * 
			 * @author Administrator
			 */
			FMapLib.BuildingHealthGradeRange=function(){
				removeTheme();// 清空专题图图层
			    if(map)
					map.allOverlays = true;		   
			    var  style1 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(0, 255, 0),
					lineColor : new MapLib.REST.ServerColor(0, 255, 0),// 绿色
					lineWidth : 0.5
				}), style2 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(0, 0, 255),
					lineColor : new MapLib.REST.ServerColor(0, 0, 255),// 蓝色
					lineWidth : 0.5
				}), style3 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(255, 255, 0),
					lineColor : new MapLib.REST.ServerColor(255, 255, 0),// 黄色
					lineWidth : 0.5
				}), style4 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(250, 0, 0),
					lineColor : new MapLib.REST.ServerColor(250, 0, 0),// 红色
					lineWidth : 0.5
				}), themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
					start : 1,
					end : 3,
					style : style1
				}), themeRangeIteme2 = new MapLib.REST.ThemeRangeItem({
					start : 3,
					end : 5,
					style : style2
				}), themeRangeIteme3 = new MapLib.REST.ThemeRangeItem({
					start : 5,
					end : 7,
					style : style3
				}), themeRangeIteme4 = new MapLib.REST.ThemeRangeItem({
					start : 7,
					end : 9,
					style : style4
				});
				 FMapLib.TemeRangeService("RANGEITEM","ST_RIDRGN_JKDA","ORCL",[themeRangeIteme1, themeRangeIteme2, themeRangeIteme3,
				                   			     					themeRangeIteme4]);
			}
		
		/**
		 * 房屋建筑面积范围值专题图函数
		 * 
		 * @author 李洪云 2013 11 29
		 */
		 FMapLib.BuildingAreaTheme = function(prames) {	
			 removeTheme();// 清空专题图图层
			 if(map)
				map.allOverlays = true;
			 var linewidth = 0.3;
			 var  style1 = new MapLib.REST.ServerStyle({
				// fillColor : new MapLib.REST.ServerColor(175, 216, 248),
				fillForeColor : new MapLib.REST.ServerColor(175, 216, 248),// [-]
																			// fillColor
																			// {...}
																			// Object
				lineColor : new MapLib.REST.ServerColor(175, 216, 248),
				lineWidth : linewidth
			}), style2 = new MapLib.REST.ServerStyle({
				// fillColor : new MapLib.REST.ServerColor(246,189,15),
				fillForeColor : new MapLib.REST.ServerColor(246,189,15),
				lineColor : new MapLib.REST.ServerColor(246,189,15),
				lineWidth : linewidth
			}), style3 = new MapLib.REST.ServerStyle({
				// fillColor : new MapLib.REST.ServerColor(139,186,0),
				fillForeColor : new MapLib.REST.ServerColor(139,186,0),
				lineColor : new MapLib.REST.ServerColor(139,186,0),
				lineWidth :linewidth
			}), style4 = new MapLib.REST.ServerStyle({
				// fillColor : new MapLib.REST.ServerColor(255,142,70),
				fillForeColor : new MapLib.REST.ServerColor(255,142,70),
				lineColor : new MapLib.REST.ServerColor(255,142,70),
				lineWidth : linewidth
			}), style5 = new MapLib.REST.ServerStyle({
				// fillColor : new MapLib.REST.ServerColor(0,142,142),
				fillForeColor : new MapLib.REST.ServerColor(0,142,142),
				lineColor : new MapLib.REST.ServerColor(0,142,142),
				lineWidth : linewidth
			}), style6 = new MapLib.REST.ServerStyle({
				// fillColor : new MapLib.REST.ServerColor(214,70,70),
				fillForeColor : new MapLib.REST.ServerColor(214,70,70),
				lineColor : new MapLib.REST.ServerColor(214,70,70),
				lineWidth : linewidth
			}),themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
				start : 0,
				end : 100,
				style : style1
			}), themeRangeIteme2 = new MapLib.REST.ThemeRangeItem({
				start : 100,
				end : 1000,
				style : style2
			}), themeRangeIteme3 = new MapLib.REST.ThemeRangeItem({
				start : 1000,
				end : 10000,
				style : style3
			}), themeRangeIteme4 = new MapLib.REST.ThemeRangeItem({
				start : 10000,
				end : 100000,
				style : style4
			}), themeRangeIteme5 = new MapLib.REST.ThemeRangeItem({
				start : 100000,
				end : 200000,
				style : style5
			}),themeRangeIteme6 = new MapLib.REST.ThemeRangeItem({
				start : 200000,
				end : 20000000,
				style : style6
			}),themeRangeItemArray=[themeRangeIteme1, themeRangeIteme2, themeRangeIteme3,
			     					themeRangeIteme4, themeRangeIteme5,themeRangeIteme6];
			 if("buildarea"==prames){
				 FMapLib.TemeRangeService("TOTAL_AREA","ST_RIDRGN","ORCL",themeRangeItemArray);// SMAREA
																								// TOTAL_AREA
			 }
		}
		 /**
			 * 房屋健康完损等级单值专题图 （无效）
			 * 
			 * @author wangmeng 20140426
			 * 
			 */
			FMapLib.BuildingHealthGradeUnique=function(){
				removeTheme();// 清空专题图图层
				 var  style1 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(137, 203, 187),
					lineColor : new MapLib.REST.ServerColor(0, 255, 0),
					lineWidth : 0.5
				}), style2 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(233, 235, 171),
					lineColor : new MapLib.REST.ServerColor(255, 255, 0),
					lineWidth : 0.5
				}), style3 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(135, 157, 157),
					lineColor : new MapLib.REST.ServerColor(255, 255, 255),
					lineWidth : 0.5
				}), style4 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(92, 73, 234),
					lineColor : new MapLib.REST.ServerColor(0, 0, 255),
					lineWidth : 0.5
				}),themeUniqueIteme1 = new MapLib.REST.ThemeUniqueItem({
					caption:"完好房屋",
					unique:"完好房屋",
					style : style1
				}), themeUniqueIteme2 = new MapLib.REST.ThemeUniqueItem({
					caption:"基本完好",
					unique:"基本完好",
					style : style2
				}), themeUniqueIteme3 = new MapLib.REST.ThemeUniqueItem({
					caption:"一般破损",
					unique:"一般破损",
					style : style3
				}), themeUniqueIteme4 = new MapLib.REST.ThemeUniqueItem({
					caption:"严重破损",
					unique:"严重破损",
					style : style4
				}),themeUniqueItemArray=[themeUniqueIteme1, themeUniqueIteme2, themeUniqueIteme3,
				     					themeUniqueIteme4];
				 TemeUniqueService("健康完损等级","ST_RIDRGN_JKDA","ORCL",themeUniqueItemArray);
			}
	/**
	 * @author 李洪云 3013 11 28 删除专题图图层的函数
	 */
	var removeTheme = FMapLib.removeTheme = function() {
		if (map.layers.length > 3) {
			if (dotLayer) {
				map.removeLayer(dotLayer, true);
				dotLayer = null;
			}
			if (themeLayer) {
				map.removeLayer(themeLayer, true);
				themeLayer = null;
			}
			if (labelLayer) {
				map.removeLayer(labelLayer, true);
				labelLayer = null;
			}
			if (rangeLayer) {
				map.removeLayer(rangeLayer, true);
				rangeLayer = null;
			}
			if (barLayer) {
				map.removeLayer(barLayer, true);
				barLayer = null;
			}
			if (housethemeLayer) {
				map.removeLayer(housethemeLayer);
				housethemeLayer = null;
			}
			if(markerLayer){
				markerLayer.clearMarkers();
			}
		}
		// 删除空间统计功能右侧图标控件
		var parentchart = document.getElementById("parentchart");
    	if (parentchart != null){
    		parentchart.parentNode.removeChild(parentchart);
    	}
    	
    	removeLoading();// 停止loading
	   
	}
	/**
	 * @author 李洪云 3013 11 29 房屋建筑面积饼状专题图函数
	 */
	var HouseTAthemePie = FMapLib.HouseTAthemePie = function() {
		// 隐藏地图控件
		// document.getElementById("map").style.display="none";
		// 显示统计图表控件
		// document.getElementById("chart").style.display="block";

		// 定义颜色数组
		var color = new Array('AFD8F8', 'F6BD0F', '8BBA00', 'FF8E46', '008E8E',
				'D64646');
		// 定义xml语句
		var xmlstringstart = "<graph caption='饼状图（单位：幢）' xAxisName='' yAxisName='平方米' showNames='1' decimalPrecision='0' formatNumberScale='0'>";
		// 向后台发送请求
		$
				.post(
						"realtygis.housetheme",
						"",
						function(data, textStatus) {
							var jdata = jQuery.parseJSON(data);
							var xmlstring = "<set name='"
									+ jdata.root[0].range_name
									+ "平方米以上' value='"
									+ jdata.root[0].range_value + "' color='"
									+ color[0] + "'/>";
							xmlstringstart += xmlstring;
							for (i = 1; i < jdata.root.length - 1; i++) {
								var xmlstring = "<set name='"
										+ jdata.root[i].range_name
										+ "平方米' value='"
										+ jdata.root[i].range_value
										+ "' color='" + color[i] + "'/>";
								xmlstringstart += xmlstring;
							}
							var j = jdata.root.length - 1;
							var xmlstring = "<set name='"
									+ jdata.root[j].range_name
									+ "平方米以下' value='"
									+ jdata.root[j].range_value + "' color='"
									+ color[j] + "'/>";
							xmlstringstart += xmlstring;
							xmlstringstart += "</graph>";

							// 弹出 div
							var g = document.createElement("div");
							g.id = "parentchart";
							g.style.position = "absolute";
							g.style.width = "5%";
							g.style.height = "25%";
							g.style.top = "40px";
							g.style.right = "5px";
							g.style.zIndex = 1006;
							map.viewPortDiv.appendChild(g);
							$("#parentchart")
									.append(
											"<div id='theme' class='blk' style='position: absolute; float: right; right: 60px; top: 100px; opacity: 1; z-index: 999; width: 450px; height: 100px;'>"
													+ "<a id='close' class='closeBtn'>关闭</a>"
													+ "<div id='chart' align='center'></div>"
													+ "<div id='hidden' style='position: absolute; right: -50px; top: 125px; opacity: 1; z-index: 999; width: 8px; height: 50px;'>"
													+ "<image id='hiddenbutton' src='/gis/resource/images/menu_view.png'/>"
													+ "</div>" + "</div>");
							// 生成饼状图
							piechart = new FusionCharts(
									"/gis/FMapLib/theme/images/Pie2D.swf",
									"ChartPieId", "500", "300", "0", "1");
							piechart.setDataXML(xmlstringstart);
							piechart.render("chart");
							$("#close").live("click", function() {
								$(this).parent("div").remove();
							});
							$("#hiddenbutton")
									.live(
											"click",
											function() {
												if (document
														.getElementById("chart").style.display != "none") {
													document
															.getElementById("chart").style.display = "none";
													document
															.getElementById("close").style.display = "none";
													$("#hiddenbutton")
															.attr("src",
																	"/gis/resource/images/menu_view.png");
												} else {
													document
															.getElementById("chart").style.display = "block";
													document
															.getElementById("close").style.display = "block";
													$("#hiddenbutton")
															.attr("src",
																	"/gis/resource/images/menu_view.png");
												}
											});
						});
	}
	/**
	 * @author 李洪云 3013 11 29 房屋建筑面积柱状专题图函数
	 */
	var HouseTAthemeColumn = FMapLib.HouseTAthemeColumn = function() {
		// 隐藏地图控件
		// document.getElementById("map").style.display="none";
		// 显示统计图表控件
		// document.getElementById("chart").style.display="block";

		// 定义颜色数组
		var color = new Array('AFD8F8', 'F6BD0F', '8BBA00', 'FF8E46', '008E8E',
				'D64646');
		// 定义xml语句
		var xmlstringstart = "<graph caption='柱状图（单位：幢）' xAxisName='' yAxisName='平方米' showNames='1' decimalPrecision='0' formatNumberScale='0'>";
		// 向后台发送请求
		$
				.post(
						"realtygis.housetheme",
						"",
						function(data, textStatus) {
							var jdata = jQuery.parseJSON(data);
							var xmlstring = "<set name='"
									+ jdata.root[0].range_name
									+ "平方米以上' value='"
									+ jdata.root[0].range_value + "' color='"
									+ color[0] + "'/>";
							xmlstringstart += xmlstring;
							for (i = 1; i < jdata.root.length - 1; i++) {
								var xmlstring = "<set name='"
										+ jdata.root[i].range_name
										+ "平方米' value='"
										+ jdata.root[i].range_value
										+ "' color='" + color[i] + "'/>";
								xmlstringstart += xmlstring;
							}
							var j = jdata.root.length - 1;
							var xmlstring = "<set name='"
									+ jdata.root[j].range_name
									+ "平方米以下' value='"
									+ jdata.root[j].range_value + "' color='"
									+ color[j] + "'/>";
							xmlstringstart += xmlstring;
							xmlstringstart += "</graph>";
							// 弹出 div
							var g = document.createElement("div");
							g.id = "parentchart";
							g.style.position = "absolute";
							g.style.width = "5%";
							g.style.height = "25%";
							g.style.top = "40px";
							g.style.right = "5px";
							g.style.zIndex = 1006;
							map.viewPortDiv.appendChild(g);
							$("#parentchart")
									.append(
											"<div id='theme' class='blk'style='position: absolute; float: right; right: 52px; top: 100px; opacity: 1; z-index: 999; width: 450px; height: 100px;'>"
													+ "<div class='main'>"
													+ "<a  id='close' class='closeBtn'>关闭</a>"
													+ "<div id='chart' align='center'></div>"
													+ "<div id='hidden' style='position: absolute; right: -50px; top: 125px; opacity: 1; z-index: 999; width: 8px; height: 50px;'>"
													+ "<image id='hiddenbutton' src='/gis/resource/images/menu_view.png'/>"
													+ "</div>" + "</div>");
							// 生成饼状图
							document.getElementById("chart").innerhtml = '';
							var chart = new FusionCharts(
									"/gis/FMapLib/theme/images/Column2D.swf",
									"ChartColumnId", "500", "300", "0", "1");
							chart.setDataXML(xmlstringstart);
							chart.render("chart");
							$("#close").live("click", function() {
								$(this).parent("div").remove();
							});
							$("#hiddenbutton")
									.live(
											"click",
											function() {
												if (document
														.getElementById("chart").style.display != "none") {
													document
															.getElementById("chart").style.display = "none";
													document
															.getElementById("close").style.display = "none";
													$("#hiddenbutton")
															.attr("src",
																	"/gis/resource/images/menu_view.png");
												} else {
													document
															.getElementById("chart").style.display = "block";
													document
															.getElementById("close").style.display = "block";
													$("#hiddenbutton")
															.attr("src",
																	"/gis/resource/images/menu_view.png");
												}
											});
						});
	}
	/**
	 * 根据建筑面积范围查询楼幢面信息
	 * 
	 * @param params参数属性：最小建筑面积params.areamin
	 *            最大建筑面积params.areamax 最早建成时间params.bdate 最晚建成时间params.bdate2
	 *            最小楼层数params.floormin 最大楼层数params.floormax
	 * @param div
	 *            加载查询列表的div的id
	 * 
	 */
	var BuildingsAreaSurvey = FMapLib.BuildingsAreaSurvey = function(params,div) {

		vectorLayer.removeAllFeatures();
		vectorLayer2.removeAllFeatures();
			$("#"+div).load("realtygis.buildinglistgrid?" + (params.areamin==""||params.areamin==undefined?"":"min=" + params.areamin) + (params.areamax==""||params.areamax==undefined?"":"&max="+ params.areamax) + (params.bdate==""||params.bdate==undefined?"":"&buildingdate=" + params.bdate) +( params.bdate2==""|| params.bdate2==undefined?"":"&buildingdate2=" + params.bdate2)+ (params.floormin==""||params.floormin==undefined?"":"&floormin=" + params.floormin) + ( params.floormax==""|| params.floormax==undefined?"":"&floormax=" + params.floormax));
		
	}	
	// 楼栋查询地图上marker展示
	var MarkerShow=
		FMapLib.MarkerShow=function(building_mapid){
		if(building_mapid==""){
			alert("暂无数据！");
		}
		else{
			markerLayer.clearMarkers();
			markerLayer2.clearMarkers();
		// 解决多余逗号问题
		var smuserid=building_mapid+"100000000";
		var sql= "and SMUSERID in(" + smuserid + ")";
		var filter="1=1 " + sql;
		var completed=MarkerProcessCompleted;
		housequeservpoint(filter,completed);
		}
		
		
	}
	// 楼栋查询地图上marker展示
	var MarkerAllShow=
		FMapLib.MarkerAllShow=function(building_mapid){
		if(typeof(building_mapid) == "string"){
			if(building_mapid==""){
				alert("暂无数据！");
			}
			else{
			map.clearAllFeatures();
			// 解决多余逗号问题
			var smuserid=building_mapid+"10000000";
			var sql= "and SMUSERID in(" + smuserid + ")";
			var filter="1=1 " + sql;
			var completed=AllMarkerProcessCompleted;
			// housequeserv(filter,completed);
			housequeservpoint(filter,completed);
			}
		}else if(typeof(building_mapid) == "object"){
			var sql= "and SMUSERID in(" + building_mapid + ")";
			var filter="1=1 " + sql;
			var completed=AllMarkerProcessCompleted;
			housequeservpoint(filter,completed);
		}
	}
	
	// 楼栋查询结束执行渲染marker
// function MarkerProcessCompleted(queryEventArgs){
// var i, j, result = queryEventArgs.result;
// if (result && result.recordsets) {
// for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
// if (recordsets[i].features) {
// for (j=0; j<recordsets[i].features.length; j++) {
// var point = recordsets[i].features[j].geometry.getCentroid(),
// size = new MapLib.Size(32,30),
// offset = new MapLib.Pixel(-(size.w/2), -size.h),
// icon = new MapLib.Icon(baseurl + "theme/images/marker11.png", size, offset);
// var buffermarker = new MapLib.Marker(new MapLib.LonLat(point.x, point.y),
// icon);
// buffermarker.information = recordsets[i].features[j];
// markerLayer.addMarker(buffermarker);
// buffermarker.events.on({
// "click" : bufferMarkerAlert,
// "scope" : buffermarker
// });
//                      
// }
//                   
// }
// }
// }
//
// var bound = markerLayer.getDataExtent();
// map.zoomToExtent(bound,true);
// var lonlat = bound.getCenterLonLat();
// map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
// if(map.getZoom()<2){
// map.zoomTo(2);
// }
//	
// }
// 楼栋查询结束执行渲染marker
	function MarkerProcessCompleted(queryEventArgs){
	     var i, j, result = queryEventArgs.result;
	        if (result && result.recordsets) {
	            for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
	            	if (recordsets[i].features) {	                	
	                    for (j=0; j<recordsets[i].features.length; j++) {
	                    	 // var point =
								// recordsets[i].features[j].geometry.getCentroid(),
	                        var pointx = parseFloat(recordsets[i].features[j].attributes["SMX"]),
	                            pointy = parseFloat(recordsets[i].features[j].attributes["SMY"]),	                
	                            size = new MapLib.Size(32,30),
	                                 offset = new MapLib.Pixel(-(size.w/2), -size.h),
	                                 icon = new MapLib.Icon(baseurl + "theme/images/marker11.png", size, offset);
	                        var buffermarker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy), icon);
	                        buffermarker.information = recordsets[i].features[j];
	                        markerLayer.addMarker(buffermarker);
	                        buffermarker.events.on({
								"click" : bufferMarkerAlert,
								"scope" : buffermarker
							});
	                        buffermarker.events.on({
								"mouseover" : changeIconall,
								"scope" : buffermarker
							});
	                        buffermarker.events.on({
								"mouseout" : returnIconall,
								"scope" : buffermarker
							});
	                    }
	                    
	                }
	            }
	        }
	
			var bound = markerLayer.getDataExtent();
			map.zoomToExtent(bound,true);
			var lonlat = bound.getCenterLonLat();
			map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
	        if(map.getZoom()<2){
	        	 map.zoomTo(2);
	        }
		
	}
	// 改变marker图片地址
	function changeIconall(){

		this.setUrl(baseurl + "theme/images/markerbig.png");
	}
	// 恢复marker图片地址
	function returnIconall(){
		// markerlayerover.clearMarkers();
		this.setUrl(baseurl + "theme/images/marker11.png");
	}
	// 楼栋查询结束执行渲染marker
	function AllMarkerProcessCompleted(queryEventArgs){
	     var i, j, result = queryEventArgs.result;
	        if (result && result.recordsets) {
	            for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
	            	if (recordsets[i].features) {	                	
	                    for (j=0; j<recordsets[i].features.length; j++) {
	                      // var point =
							// recordsets[i].features[j].geometry.getCentroid(),
	                        var pointx = parseFloat(recordsets[i].features[j].attributes["SMX"]),
	                            pointy = parseFloat(recordsets[i].features[j].attributes["SMY"]),	                
	                            size = new MapLib.Size(15,20),
	                                 offset = new MapLib.Pixel(-(size.w/2), -size.h),
	                                 icon = new MapLib.Icon(baseurl + "theme/images/marker_select.png", size, offset);
	                        var buffermarker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy), icon);
	                        buffermarker.information = recordsets[i].features[j];
	                        markerLayerall.addMarker(buffermarker);
	                        buffermarker.events.on({
								"click" : bufferMarkerAlert,
								"scope" : buffermarker
							});
	                        buffermarker.events.on({
								"mouseover" : changeIcon,
								"scope" : buffermarker
							});
	                        buffermarker.events.on({
								"mouseout" : returnIcon,
								"scope" : buffermarker
							});
	                    }
	                    
	                }
	            }
	        }
	
			var bound = markerLayerall.getDataExtent();
			map.zoomToExtent(bound,true);
			var lonlat = bound.getCenterLonLat();
			map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
	        if(map.getZoom()<2){
	        	 map.zoomTo(2);
	        }
		
	}
	// 改变marker图片地址
	function changeIcon(){

		this.setUrl(baseurl + "theme/images/marker.png");
	}
	// 恢复marker图片地址
	function returnIcon(){
		// markerlayerover.clearMarkers();
		this.setUrl(baseurl + "theme/images/marker_select.png");
	}
		// 地图展示
	var MapShow=
		/**
		 * jqgrid表格内地图查询专题功能类
		 * 
		 * @param pmin
		 *            房屋面积最小值 pmax 房屋面积最大值 fmin 楼层最小值 fmax 楼层最大值 bdate 建成时间
		 */
		
		FMapLib.MapShow=function(pmin, pmax,fmin,fmax,bdate,bdate2) {
			
				var areamin = pmin;
				var areamax = pmax;
				var floormin=fmin;
				var floormax=fmax;
				var buildingdate=bdate;
				// 地图查询条件请求
				$.post('realtygis.buildingareamap?min=' + areamin + '&max='
						+ areamax+'&floormin='+floormin+'&floormax='+floormax+'&buildingdate='+bdate+'&buildinggdate2='+bdate2, function(data, textStatus) {
					var jdata = jQuery.parseJSON(data);
					var conn = "";
					var len = jdata.root.length;
					var housenum=0;
					for (i = 0; i < len; i++) {
						if (jdata.root[i].building_mapid) {
							conn += jdata.root[i].building_mapid + ',';
							housenum++;
						}
					}
					// 解决多余逗号问题
					conn += "0";
					housequery(conn);
					doMapAlert("map", "房屋查询结果总数为:", housenum, true);
				});
			
		}
		// 根据mapid查询地图房屋图层
		function housequery(conn) {
			var con = "";
			con = "and SMUSERID in(" + conn + ")";
			var filter="1=1 " + con;
			var completed=surveyProcessCompleted2;
			housequeserv(filter,completed);
		}

		/**
		 * 空间查询结束（不需要获取smuserid）
		 */
		function surveyProcessCompleted2(queryEventArgs) {
			// 对查询结果进行渲染
			render(queryEventArgs);
			// 定义要素选择控件
			var selectFeature = new MapLib.Control.SelectFeature([
					vectorLayer, vectorLayer2 ], {
				onSelect : onSurveyFeatureSelect,
				onUnselect : onSurveyFeatureUnselect
			});

			selectFeature.repeat = true;
			map.addControl(selectFeature);
			selectFeature.activate();
		}
		

		/**
		 * 根据地理关联码地图标示(Marker)地图位置
		 */
		
		var MarkerIdenty=
			FMapLib.MarkerIdenty=function(b_ids){
			if(b_ids){
				if (popup) {
					markerLayer.map.removePopup(popup);
					markerLayer2.map.removePopup(popup)
				}
				var filter="SMUSERID =" + b_ids;
				var completed=markerSurveyCompleted;
				housequeservpoint(filter,completed)		
			}		
		function markerSurveyCompleted(queryEventArgs){
			markerLayer2.clearMarkers();
			 var i, j, result = queryEventArgs.result,point;
		        if (result && result.recordsets) {
		            for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
		            	if (recordsets[i].features) {		                	
		                    for (j=0; j<recordsets[i].features.length; j++) {		                 
		                         point = recordsets[i].features[j].geometry.getCentroid(),
		                            size = new MapLib.Size(40,35),
		                                 offset = new MapLib.Pixel(-(size.w/2), -size.h),
		                                 icon = new MapLib.Icon(baseurl + "theme/images/markerbig.png", size, offset);
		                        var buffermarker = new MapLib.Marker(new MapLib.LonLat(point.x, point.y), icon);
		                        buffermarker.information = recordsets[i].features[j];
		                        markerLayer2.addMarker(buffermarker);
		                        buffermarker.events.on({
									"click" : bufferMarkerAlert,
									"scope" : buffermarker
								});
		                       
		                    }
		                    
		                }
		            }
		        }
		     // 定位所选择的房屋
// var x = feature.geometry.getBounds().getCenterLonLat().lon;
// var y = feature.geometry.getBounds().getCenterLonLat().lat;
				var lonLat = new MapLib.LonLat(point.x, point.y);
				map.setCenter(lonLat, 6);
				bufferMarkerAlertAuto(buffermarker);
		   }
		}
		// 查询定位 公用方法
		var MapIdenty=
			/**
			 * 
			 */
			FMapLib.MapIdenty=function(b_ids) {
			if (b_ids == undefined || b_ids == "") {

			} else {
				var filter="SMUSERID =" + b_ids;
				var completed=surveyCompleted;
				housequeserv(filter,completed);
			}
		}
		/**
		 * 定位空间查询结束 公用方法
		 */
		function surveyCompleted(queryEventArgs) {
			var i, j, feature, result = queryEventArgs.result, result1 = queryEventArgs.result;
			var style = {
				strokeColor : "#FFFF00",
				strokeWidth : 1,
				fillColor : "#FFFF00",
				fillOpacity : "1"
			};
			vectorLayer2.removeAllFeatures();
			if (result && result.recordsets) {
				for (i = 0; i < result.recordsets.length; i++) {
					if (result.recordsets[i].features) {
						for (j = 0; j < result.recordsets[i].features.length; j++) {
							feature = result.recordsets[i].features[j];
							feature.style = style;
							vectorLayer2.addFeatures(feature);

						}
					}
				}
			}
			var selectFeature2 = new MapLib.Control.SelectFeature([
					vectorLayer, vectorLayer2 ], {
				onSelect : onSurveyFeatureSelect,
				onUnselect : onSurveyFeatureUnselect
			});
			selectFeature2.repeat = true;
			map.addControl(selectFeature2);
			selectFeature2.activate();
			// 定位所选择的房屋
			var x = feature.geometry.getBounds().getCenterLonLat().lon;
			var y = feature.geometry.getBounds().getCenterLonLat().lat;
			var lonLat = new MapLib.LonLat(x, y);
			map.setCenter(lonLat, 7);

		}

	

	/**
	 * @author 李洪云 2013 11 12 房屋到户专题图
	 */
	var HouseHoldsTheme = FMapLib.HouseHoldsTheme = function(smallnum, bignum) {
		// document.getElementById("chart").style.display="block";
		// var bignum=120,smallnum=1000;
		// 定义颜色数组
		var color = new Array('AFD8F8', 'F6BD0F', '8BBA00', 'FF8E46', '008E8E',
				'D64646');
		// 定义xml语句
		var xmlstringstart = "<graph caption='饼状图（单位：套）' xAxisName='行政区名称' yAxisName='平方米' showNames='1' decimalPrecision='0' formatNumberScale='0'>";

		// 向后台发送请求
		$
				.post(
						"realtygis.households",
						{
							firstnum : smallnum,
							nextnum : bignum
						},
						function(data, textStatus) {
							var jdata = jQuery.parseJSON(data);
							var remain = jdata.root[1].range_value
									- jdata.root[0].range_value;
							var xmlstring = "<set name='查询范围内的房屋' value='"
									+ jdata.root[0].range_value + "' color='"
									+ color[0] + "'/>"
									+ "<set name='查询范围外的房屋' value='" + remain
									+ "' color='" + color[1] + "'/>";
							xmlstringstart += xmlstring;
							xmlstringstart += "</graph>";
							// 弹出 div
							var g = document.createElement("div");
							g.id = "parentchart";
							g.style.position = "absolute";
							g.style.width = "5%";
							g.style.height = "25%";
							g.style.top = "40px";
							g.style.right = "5px";
							g.style.zIndex = 1006;
							map.viewPortDiv.appendChild(g);
							$("#parentchart")
									.append(
											"<div id='theme' class='blk'style='position: absolute; float: right; right: 52px; top: 100px; opacity: 1; z-index: 999; width: 450px; height: 100px;'>"
													+ "<div class='main'>"
													+ "<a  id='close' class='closeBtn'>关闭</a>"
													+ "<div id='chart' align='center'></div>"
													+ "<div id='hidden' style='position: absolute; right: -50px; top: 125px; opacity: 1; z-index: 999; width: 8px; height: 50px;'>"
													+ "<image id='hiddenbutton' src='/gis/resource/images/menu_view.png'/>"
													+ "</div>" + "</div>");
							// 生成饼状图

							// document.getElementById("chart").innerhtml='';
							var chart = new FusionCharts(
									"/gis/FMapLib/theme/images/Pie2D.swf",
									"ChartColumnId", "500", "300", "0", "1");
							chart.setDataXML(xmlstringstart);
							chart.render("chart");
							$("#close").live("click", function() {
								$(this).parent("div").remove();
							});
							$("#hiddenbutton")
									.live(
											"click",
											function() {
												if (document
														.getElementById("chart").style.display != "none") {
													document
															.getElementById("chart").style.display = "none";
													document
															.getElementById("close").style.display = "none";
													$("#hiddenbutton")
															.attr("src",
																	"/gis/resource/images/menu_view.png");
												} else {
													document
															.getElementById("chart").style.display = "block";
													document
															.getElementById("close").style.display = "block";
													$("#hiddenbutton")
															.attr("src",
																	"/gis/resource/images/menu_view.png");
												}
											});
						});

	}
	/**
	 * @author 李洪云 2013 12 27 制定范围内查询（可见视野范围内查询和拉框查询） 五个参数：boundsname，查询的范围
	 *         boundsname，查询方位的名称，可以是地图类型，也可以是空间数据gemotry类型的
	 *         filedname，属性字段值名称，要求必须和数据空中属性表里的名称一致； firstnum，数值型，查询范围的最小值，最小为0；
	 *         lastnum，数值型，查询范围的最大值 ，最小为0
	 *         type，数值型，只有两个值1和0，1代表查询范围是当前可见视野内，2，代表是拉狂选择
	 *         eg：QueryByExtent(map,TOTAL_AREA,0,1000,1)
	 *         {}查询属性表中属性字段TOTAL_AREA值小于1000的元素；
	 *         QueryByExtent(map,TOTAL_AREA,1000,01)
	 *         {}查询属性表中属性字段TOTAL_AREA值大于1000的元素；
	 *         QueryByExtent(map,TOTAL_AREA,1000,2000,1)
	 *         {}查询属性表中属性字段TOTAL_AREA值在1000到2000之间的元素；
	 */   
	var QueryByExtent=FMapLib.QueryByExtent=	
		function (boundsname,params,type){
			if(map.getScale()>1/30000){
			}
			else{
				map.zoomTo(5);
			}
			 var sqlworld="";
			if(params.areamin!=""){
				sqlworld=sqlworld+"TOTAL_AREA >"+params.areamin;
			}
			if(params.areamax!=""){
				if(sqlworld!=""){
					sqlworld=sqlworld+"and";
				}
				sqlworld=sqlworld+" TOTAL_AREA <="+params.areamax;
			}
			if(params.floormin!=""){
				if(sqlworld!=""){
					sqlworld=sqlworld+"and";
				}
				sqlworld=sqlworld+" LAYERS >"+params.floormin;
			} 
			if(params.floormax!=""){
				if(sqlworld!=""){
					sqlworld=sqlworld+"and";
				}
				sqlworld=sqlworld+" LAYERS <="+params.floormax;
			}
			if(params.buildingdata!=""){
				if(sqlworld!=""){
					sqlworld=sqlworld+"and";
				}
				if(params.buildingdata==1){
					sqlworld=sqlworld+"  to_number(to_char(builddate,'yyyy')) <1949";
				}
				if(params.buildingdata==2){
					sqlworld=sqlworld+" to_number(to_char(builddate,'yyyy')) >=1949 and to_number(to_char(builddate,'yyyy'))<1998";
				}
				if(params.buildingdata==3){
					sqlworld=sqlworld+"  to_number(to_char(builddate,'yyyy')) >=1998 and to_number(to_char(builddate,'yyyy'))<2009";
				}
				if(params.buildingdata==4){
					sqlworld=sqlworld+"  to_number(to_char(builddate,'yyyy')) >=2009";
				}
			}
			if(params.buildingtype!=""){
				if(sqlworld!=""){
					sqlworld=sqlworld+"and";
				}
				if(params.buildingtype==1){
					sqlworld=sqlworld+"  BUILD_STRUCT ='钢'";
				}
				if(params.buildingtype==2){
					sqlworld=sqlworld+"  BUILD_STRUCT =''";
				}
				if(params.buildingtype==3){
					sqlworld=sqlworld+"  BUILD_STRUCT ='砼'";
				}
				if(params.buildingtype==4){
					sqlworld=sqlworld+"  BUILD_STRUCT ='混'";
				}
				if(params.buildingtype==5){
					sqlworld=sqlworld+" and BUILD_STRUCT ='砖'";
				}
				if(params.buildingtype==6){
					sqlworld=sqlworld+"  BUILD_STRUCT =''";
				}
				if(params.buildingtype==7){
					sqlworld=sqlworld+" BUILD_STRUCT =''";
				}
			}
			
			if(clusterLayer){
			   clusterLayer.removeAllFeatures();
			}
			// map.allOverlays=true;
			markerLayer.clearMarkers();
			var bounds;
		if(type==0){
			bounds=boundsname.getExtent();
	        pntLeftUp=new MapLib.Geometry.Point(bounds.left,bounds.top),
	        pntRightUp=new MapLib.Geometry.Point(bounds.right,bounds.top),
	        pntRightDown=new MapLib.Geometry.Point(bounds.right,bounds.bottom),
	        pntLeftDown=new MapLib.Geometry.Point(bounds.left,bounds.bottom),
	        pntArry= new Array(pntLeftUp,pntRightUp,pntRightDown,pntLeftDown),
	        linearRing = new MapLib.Geometry.LinearRing(pntArry),
	        plygon = new MapLib.Geometry.Polygon(linearRing);
		}
		 // 定义查询对象
	        if(type==1){
	    		plygon=boundsname;
	    	}
		 var queryParam, queryByGeometryParameters, queryService;
		 queryParam = new MapLib.REST.FilterParameter({
			 name:"ST_RIDRGN@ORCL",
		     attributeFilter :sqlworld
			 }); 
		 queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
		 queryParams:[queryParam],
		 geometry:plygon,
		 spitalQueryMode:MapLib.REST.SpatialQueryMode.INTERSECT
		});
		 queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan);
		 queryService.events.on({"processCompleted":queryCompleted,
			                     "processFailed":queryFailed
			                    });
		 queryService.processAsync(queryByGeometryParameters);
		}
	 var styleLine = {
		        strokeColor: "black",
		        strokeWidth: 1,
		        fill: false
		    };
		    function openInfoWin(feature){
		        var geo = feature.geometry;
		        var bounds = geo.getBounds();
		        var center = bounds.getCenterLonLat();
		        var contentHTML = "<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden;'>";
		        contentHTML += "<div>"+feature.info.name+"</div></div>";

		        var popup = new MapLib.Popup.FramedCloud("popwin",
		            new MapLib.LonLat(center.lon,center.lat),
		            null,
		            contentHTML,
		            null,
		            true);

		        feature.popup = popup;
		        infowin = popup;
		        map.addPopup(popup);
		    }
		    function closeInfoWin(){
		        if(infowin){
		            try{
		                infowin.hide();
		                infowin.destroy();
		            }
		            catch(e){}
		        }
		    }
	  // 查询完后结果展示
	   function queryCompleted(queryEventArgs) {  
		   // vectorLayer.removeAllFeatures();
	        var i, j, feature, 
	        result = queryEventArgs.result;
	        // features = [];
	        if (result && result.recordsets) {
	        for (i=0; i<result.recordsets.length; i++) {
	                for (j=0; j<result.recordsets[i].features.length; j++) {
	                    feature = result.recordsets[i].features[j];                    
	                    var geometry =feature.geometry,
	                    point=geometry.getCentroid();
	                    if(map.getScale()>1/250000){var f = new MapLib.Feature.Vector();
	                       f.geometry = new MapLib.Geometry.Point(point.x, point.y);
	                       f.style = {
	                           pointRadius: 4,
	                           graphic:true,
	                           externalGraphic:baseurl+"theme/images/markerbig.png",
	                           graphicWidth:12,
	                           graphicHeight:12
	                       };
	                       f.info={
	                    		   name:feature.attributes.SMID
	                       };
	                       clusterLayer.addFeatures(f);
	                       
	                }
	            }
	        }
	        doMapAlert("map", "查询结果", "在该查询范围内的房屋" + j + "座", true);
	    }
	}
	 function queryFailed(){
			alert("参数不正确");
			}
	 /**
		 * @author 李洪云 2013 12 27 拉框选择功能
		 */
	 var DropExtentQuery=FMapLib.DropExtentQuery=
	 function (params){
		 if(clusterLayer){
				clusterLayer.removeAllFeatures();
				}
		 drawPolygon = new MapLib.Control.DrawFeature(vectorLayer,
					MapLib.Handler.Polygon);
			map.addControl(drawPolygon);
			drawPolygon.events.on({
				"featureadded" : drawCompletedQ
			});
			drawPolygon.activate();
			DropExtentQuery.prototype.par=params;
	 }
	 function drawCompletedQ(drawGeometryArgs){
		 drawPolygon.deactivate();
		 var geometry = drawGeometryArgs.feature.geometry;
		 var querypar=DropExtentQuery.prototype.par;
		 QueryByExtent(geometry,querypar,1);
		// QueryByExtent(geometry,"TOTAL_AREA",1000,10000,1);
	 }
	 // ////////////////////房屋专题图部分//////////////////////////////////////////////////////////////////////////////////
	 /**
		 * @author 李洪云 2014 1 7 全市房屋建筑面积专题图（饼状图和柱状图）
		 */
	 var AllHouseTAtheme = FMapLib.AllHouseTAtheme = function(params,themetype) {
		 // 根据面积字段smarea渲染房屋专题图
		 // if(params=="buildarea"){
		 // BuildingAreaThemeRange("smarea");
		 // }
		 	removeTheme();
		    // 定义专题图类型
		    var src;// 定义专题图模版的路径
		    if(themetype=="饼状图"){
		    	src="/gis/FMapLib/theme/images/Pie2D.swf";
		    }
		    else{
		    	src="/gis/FMapLib/theme/images/Column2D.swf"
		    }
			// 定义颜色数组
			var color = new Array('AFD8F8', 'F6BD0F', '8BBA00', 'FF8E46', '008E8E',
					'D64646');
			// 定义xml语句
			var xmlstringstart = "<graph showLegend='1' caption='"+themetype+"（单位：幢）' xAxisName='' yAxisName='平方米' showNames='1' decimalPrecision='0' formatNumberScale='0' " +
					">";
			// 定义专题图的html语句
			var doc=document.getElementById("themelegend");
			if(doc!=null){
				$("#themelegend").remove();
			}
			var themehtml=
					"<div><table id='timetable' border='0' cellspacing='6' cellpadding='0'>";
			// 向后台发送请求
			$.post("realtygis.allhousetheme",{programes:params},
							function(data, textStatus) {
								var jdata = jQuery.parseJSON(data);
								var firstsuffix="";
								var secondsuffix="";
								var lastsuffix="";
								if(params=="buildarea"){
									firstsuffix="平方米以下";
									secondsuffix="平方米";
									lastsuffix="平方米以上";
								}
									if(params=="builddata"){
										firstsuffix="年以前";
										secondsuffix="年";
										lastsuffix="年以后";
									}

								var xmlstring = "<set name='"
										+ jdata.root[0].range_name
										+ firstsuffix+"' value='"
										+ jdata.root[0].range_value + "' color='"
										+ color[0] + "'/>";
								var htmlstring = "&nbsp&nbsp<tr><td width='15' height='7' bgcolor='"+color[0]+"'></td>"+
								"<td width='100' height='7'><a>"+jdata.root[0].range_name+firstsuffix+"</a></td></tr>";
								xmlstringstart += xmlstring;
								themehtml+=htmlstring;
								for (i = 1; i < jdata.root.length - 1; i++) {
									var xmlstring = "<set name='"
											+ jdata.root[i].range_name
											+ secondsuffix+"' value='"
											+ jdata.root[i].range_value
											+ "' color='" + color[i] + "'/>";
										var htmlstring="<tr><td width='15' height='7' bgcolor='"+color[i]+"'></td>"+
									"<td width='140' height='7'><a>"+jdata.root[i].range_name+secondsuffix+"</a></td></tr>" ;
									xmlstringstart += xmlstring;
									themehtml +=  htmlstring;
									
								}
								var j = jdata.root.length - 1;
								var xmlstring = "<set name='"
										+ jdata.root[j].range_name
										+lastsuffix+ "' value='"
										+ jdata.root[j].range_value + "' color='"
										+ color[j] + "'/>";
								var htmlstring="<tr><td width='15'  height='7' bgcolor='"+color[j]+"'></td>"+
								"<td width='100' height='7'><a>"+jdata.root[j].range_name+lastsuffix+"</a></td><tr>"
								xmlstringstart += xmlstring;
								themehtml+=htmlstring;
								xmlstringstart += "</graph>";
								themehtml+="</tr></table></div>";
								// 弹出 div
								var g = document.createElement("div");
								g.id = "parentchart";
								g.style.position = "absolute";
								g.style.width = "5%";
								g.style.height = "25%";
								g.style.top = "40px";
								g.style.right = "5px";
								g.style.zIndex = 1006;
								map.viewPortDiv.appendChild(g);
								$("#parentchart")
										.append(
												"<div id='retheme' class='blk' style='position: absolute; float: right; right: 60px; top: 100px; opacity: 1; z-index: 999; width: 450px; height: 100px;'>"
														+ "<a id='close' class='closeBtn'>关闭</a>"
														+ "<div id='chart' align='center'></div>"
														+ "<div id='hidden' style='position: absolute; right: -50px; top: 125px; opacity: 1; z-index: 999; width: 8px; height: 50px;'>"
														+ "<image id='hiddenbutton' src='/gis/resource/images/menu_view.png'/>"
														+ "</div>" 
														+ "<a id='themeBtn' class='closeBtn' style='position: absolute; left: 10px; top: 10px; width: 100px; height: 20px;'>生成专题图</a>"
														+ "</div>");
								// 生成饼状图
								var piechart = null ;
								function startMonitor() {
									if(piechart == null){
										piechart = new FusionCharts(src,(new Date()).getTime(), "500", "300", "0", "1");
									}
									
									piechart.setXMLData(xmlstringstart);
									piechart.render("chart");
								}
								setTimeout(startMonitor, '500');
								
								// 现实图例
								// $("#map").append(themehtml);
								map.initLegendDiv();// 初始化地图图例图层
							    map.flashLegend(themehtml);// 自定义图例内容
								$("#close").live("click", function() {
									$(this).parent("div").remove();
								});
								// $("#themeBtn").live("click", function()
								// {//这样创建的单击事件在下次parentchart实例化是还会有效，导致单击事件被多次触发
								$("#themeBtn").click(function() {
									FMapLib.BuildingRangeTheme(params,true);
								});
								$("#hiddenbutton")
										.live(
												"click",
												function() {
													if (document
															.getElementById("chart").style.display != "none") {
														document
																.getElementById("chart").style.display = "none";
														document
																.getElementById("close").style.display = "none";
														document
														.getElementById("themeBtn").style.display = "none";
														$("#hiddenbutton")
																.attr("src",
																		"/gis/resource/images/menu_view.png");
													} else {
														document
																.getElementById("chart").style.display = "block";
														document
																.getElementById("close").style.display = "block";
														document
														.getElementById("themeBtn").style.display = "block";
														$("#hiddenbutton")
																.attr("src",
																		"/gis/resource/images/menu_view.png");
													}
												});
							});
		}
	 /**
		 * @author 李洪云 2014 1 9 分区统计专题图(柱状图)
		 *         统计分一个行政区的建筑任意两个属性，并制作分区的柱状专题图，每个柱状图都表示两个属性
		 */
	 var RegionThemeGraph = FMapLib.RegionThemeGraph = function() {
		 for (i=0;i<popupArray.length;i++) {
				map.removePopup(popupArray[i]);
			}
				  		getregionParam = new MapLib.REST.FilterParameter({
				  			name : "asdR@ORCL"
				  		});
				  		getregionBySQLParams = new MapLib.REST.QueryBySQLParameters({
				  			queryParams : [getregionParam]
				  				});
				  		 getregionBySQLService = new MapLib.REST.QueryBySQLService(FMapLib.DemoURL.fangchan,{
				  					eventListeners : {
				  						"processCompleted" : processCompletedgraph,
				  						"processFailed" : processFailed
				  					}
				  				});
				  		getregionBySQLService.processAsync(getregionBySQLParams);
				  
			}
				  	// 获得所有行政区中心点病句数据对应
				  	function processCompletedgraph(queryEventArgs) {
				  		if(map.getScale()<1){map.zoomTo(1)};
				  		var i, len, features, feature, result = queryEventArgs.result;
				  		var color = new Array('AFD8F8', 'F6BD0F', '8BBA00', 'FF8E46', '008E8E','D64646');
				  		if (result && result.recordsets) {
					                for (j=0; j<result.recordsets[0].features.length; j++) {
					                    feature = result.recordsets[0].features[j];
					                    var point;
					                    var regionname=feature.attributes.NAME;
					                    var regionbuildarea=feature.attributes.BUILDAREA;
					                    var regionbuildingnum=feature.attributes.BUILDAREA;
					                    // var
										// regionbuildingnum=feature.geometry.components[0].components.length;
					                    if(regionname =="历下区"){
				  				             point = new MapLib.Geometry.Point(60160.13, 44719.15);
				  				        }
				  				        if(regionname =="历城区"){
				  				        	 point = new MapLib.Geometry.Point(74004.32, 43217.69);
				  				        }
				  				        if(regionname =="市中区"){
			  				        	     point = new MapLib.Geometry.Point(43655.73, 38571.01);
			  				            }
				  				        if(regionname =="槐荫区"){
			  				        	    point = new MapLib.Geometry.Point(35283.01, 50639.77);
			  				            }
				  				       if(regionname =="天桥区"){
		  				        	        point = new MapLib.Geometry.Point(43705.11, 63787.93);
		  				                }
				  				       if(regionname =="高新区"){
		  				        	        var extentnum=RegionThemePie.prototype.info.gxhousenum;
		  				                 }
				  				       if(regionname =="长清区"){
		  				        	        point=new MapLib.Geometry.Point(29860.91,20855.56);
		  				                 }
				  				       if(regionname == "济阳县"){
				  				    	   point= new MapLib.Geometry.Point(57160.13,86635.06);
				  				       }
				  				       if(regionname == "章丘市"){
				  				    	   point = new MapLib.Geometry.Point(95930.82,55415.21);
				  				       }
				  				       if(regionname == "商河县"){
				  				    	   point=feature.geometry.getCentroid();
				  				       }
					                   // 专题图图例
				  				     var doc=document.getElementById("themelegend");
				  					if(doc!=null){
				  						$("#themelegend").remove();
				  					}
				  				     // 专题图生成xml语句
					                    var xmlstringstart = "<graph caption='"+regionname+"' showNames='0' decimalPrecision='0' " +
					                    		"formatNumberScale='0' showCanvasBg='0' showCanvasBase='0' showValues='0' showLimits='0' " +
					                    		"chartLeftMargin='0' chartRightmargin='0' showDivLineValue='0' numdivlines='0'" +
					                    		"canvasBorderThickness='0' canvasBorderAlpha='0' canvasBorderColor='FFFFFF' formatNumber='0' decimalPrecision='0'" +
					                    		"  bgColor='FFFFFF'  baseFontSize='8' showBorder='0' borderColor='#FF0000'" +
					                    		" showVLineLabelBorder='0'  canvasBgAlpha='0' bgAlpha='0' outCnvBaseFont='宋体'  outCnvBaseFontSize='12'>";
				  				        var xmlstring = "<set name='建筑面积' value='"
				  								+ regionbuildarea+ "' color='"
				  								+ color[0]+ "' toolText='"+regionbuildarea + "'/>"+
				  								"<set name='建筑数量' value='"
				  								+ regionbuildingnum+ "' color='"
				  								+ color[1] + "' toolText='"+regionbuildingnum+"'/>";
				  						      xmlstringstart += xmlstring;
				  						    var size = new MapLib.Size(30, 25); 
				  						    var offset = new MapLib.Pixel(-(size.w / 2), -size.h);
				  						    var anchor = new MapLib.Icon(null, size, offset);
				  				        var contentHTML="<div id='"+regionname+"' style='opacity: 1; width: 50px; height: 80px;' wmode='transparent'><div>"
					                     popup = new MapLib.Popup.Anchored("theme",
					    			            new MapLib.LonLat(point.x,point.y),
					    			            new MapLib.Size(50,100),
					    			            contentHTML,
					    			            anchor,
					    			            false);
				  				    map.addPopup(popup);
				  				    popupArray[j]=popup;
				  				    xmlstringstart += "</graph>";
								 	var piechart = new FusionCharts("/gis/FMapLib/theme/images/Column2D.swf","regionChartPieId", "50", "100", "0", "1");
									piechart.setDataXML(xmlstringstart);
									piechart.setTransparent(true);
									piechart.render(regionname);
				  			}
					                var themehtml=
									"<table id='timetable' border='0' cellspacing='6' cellpadding='0'>"+
									"<tr><td width='15'  height='7' bgcolor='"+color[0]+"'></td>"+
									"<td width='100' height='7'><a>建筑面积</a></td><tr>"+
									"<tr><td width='15'  height='7' bgcolor='"+color[1]+"'></td>"+
									"<td width='100' height='7'><a>建筑数量</a></td><tr>"+
									"</tr></table></div>";
					              // $("#map").append(themehtml);
					            	map.initLegendDiv();// 初始化地图图例图层
					                map.flashLegend(themehtml);// 自定义图例内容
				  		}
				  		
				  	}
	 /**
		 * @author 李洪云 2014 1 9 分区统计专题图（饼状图） 分区统计每个行政区下同一个属性不同属性值的房屋数量，并制作饼状图显示
		 */
	var RegionThemePie=FMapLib.RegionThemePie=
		function(){
		for (i=0;i<popupArray.length;i++) {
			map.removePopup(popupArray[i]);
		}
		removeTheme();
		loading();
		  $.post("realtygis.regionthemebystructure","",
				function(data, textStatus) {
			  	var jdata = jQuery.parseJSON(data);
				// 整理sql统计出的数据
				var cq = jdata.cqhousenum;
				var gx = jdata.gxhousenum;
				var hy = jdata.hyhousenum;
				var lc = jdata.lchousenum;
				var lx = jdata.lxhousenum;
				var sz = jdata.szhousenum;
				var tq = jdata.tqhousenum;
				var objArr = [lx,sz,hy,tq,lc,cq];
				var caption=[],value0=[],value1=[],value2=[],value3=[],value4=[],value5=[],value6=[];
				for(var i=0;i<lx.length;i++){
					caption[i]=lx[i].range_name;
				}
				value0=[lx[0].range_value,sz[0].range_value,hy[0].range_value,tq[0].range_value,lc[0].range_value,cq[0].range_value];
				value1=[lx[1].range_value,sz[1].range_value,hy[1].range_value,tq[1].range_value,lc[1].range_value,cq[1].range_value];
				value2=[lx[2].range_value,sz[2].range_value,hy[2].range_value,tq[2].range_value,lc[2].range_value,cq[2].range_value];
				value3=[lx[3].range_value,sz[3].range_value,hy[3].range_value,tq[3].range_value,lc[3].range_value,cq[3].range_value];
				value4=[lx[4].range_value,sz[4].range_value,hy[4].range_value,tq[4].range_value,lc[4].range_value,cq[4].range_value];
				value5=[lx[5].range_value,sz[5].range_value,hy[5].range_value,tq[5].range_value,lc[5].range_value,cq[5].range_value];
				value6=[lx[6].range_value,sz[6].range_value,hy[6].range_value,tq[6].range_value,lc[6].range_value,cq[6].range_value];
				
				
				
		        removeTheme();
				map.allOverlays = true;
				/*
				 * 创建统计专题图对象，ThemeGraph 必设 items。 专题图参数 ThemeParameters 必设
				 * theme（即以设置好的分段专题图对象）、dataSourceName 和 datasetName
				 */
				var style1, style2, style3, style4, style5, style6, style7,linewidth=0.1;
				 style1 = new MapLib.REST.ServerStyle({
						fillForeColor : new MapLib.REST.ServerColor(175,216,248),
						lineColor : new MapLib.REST.ServerColor(175,216,248),
						fillOpaqueRate: 70,
						lineWidth : linewidth
				});

				style2 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(246,189,15),
					lineColor : new MapLib.REST.ServerColor(246,189,15),
					fillOpaqueRate: 70,
					lineWidth : linewidth
				});

				style3 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(139,186,0),
					lineColor : new MapLib.REST.ServerColor(139,186,0),
					fillOpaqueRate: 70,
					lineWidth : linewidth
				});

				style4 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(255,142,70),
					lineColor : new MapLib.REST.ServerColor(255,142,70),
					fillOpaqueRate: 70,
					lineWidth : linewidth
				});

				style5 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(0,142,142),
					lineColor : new MapLib.REST.ServerColor(0,142,142),
					fillOpaqueRate: 70,
					lineWidth : linewidth
				});

				style6 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(214,70,70),
					lineColor : new MapLib.REST.ServerColor(214,70,70),
					fillOpaqueRate: 70,
					lineWidth : linewidth
				});

				style7 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(0,239,14),
					lineColor : new MapLib.REST.ServerColor(0,239,14),
					fillOpaqueRate: 70,
					lineWidth : linewidth
				});
				
				// 定义统计专题图子项item1
				var item0 = new MapLib.REST.ThemeGraphItem({
					caption : caption[0],
					// graphExpression : "BUILDCOUNT",
					// 制作专题图时的值数组
					memoryDoubleValues : value0,
					uniformStyle : style1
				}),
				// 定义统计专题图子项item2
				item1 = new MapLib.REST.ThemeGraphItem({
					caption : caption[1],
					// graphExpression : "BUILDAREA",
					// 制作专题图时的值数组
					memoryDoubleValues : value1,
					uniformStyle : style2
				}),item2 = new MapLib.REST.ThemeGraphItem({
					caption : caption[2],
					// graphExpression : "BUILDCOUNT",
					// 制作专题图时的值数组
					memoryDoubleValues : value2,
					uniformStyle : style3
				}), item3 = new MapLib.REST.ThemeGraphItem({
					caption : caption[3],
					// graphExpression : "BUILDCOUNT",
					// 制作专题图时的值数组
					memoryDoubleValues : value3,
					uniformStyle : style4
				}), item4 = new MapLib.REST.ThemeGraphItem({
					caption : caption[4],
					// graphExpression : "BUILDCOUNT",
					// 制作专题图时的值数组
					memoryDoubleValues : value4,
					uniformStyle : style5
				}), item5 = new MapLib.REST.ThemeGraphItem({
					caption : caption[5],
					// graphExpression : "BUILDCOUNT",
					// 制作专题图时的值数组
					memoryDoubleValues : value5,
					uniformStyle : style6
				}), item6 = new MapLib.REST.ThemeGraphItem({
					caption : caption[6],
					// graphExpression : "BUILDCOUNT",
					// 制作专题图时的值数组
					memoryDoubleValues : value6,
					uniformStyle : style7
				});
				// 定义专题图对象
				var themeGraph = new MapLib.REST.ThemeGraph({
					items : new Array(item0,item1,item2,item3,item4,item5,item6),
					 barWidth: 0.005,
					// 制作专题图时的键数组
					memoryKeys : [ 1, 2, 10, 3, 4, 5 ],
					graduatedMode: MapLib.REST.GraduatedMode.SQUAREROOT,
					graphAxes : new MapLib.REST.ThemeGraphAxes({
						axesDisplayed : false,
						axesGridDisplayed : false
					}),
					graphSize : new MapLib.REST.ThemeGraphSize({
						maxGraphSize : 25000,
						minGraphSize : 15000
						
						// 如果graphSizeFixed : true 则设定下面大小
						// maxGraphSize : 100,
						// minGraphSize : 50
					}),
					// graphSizeFixed:true,
					
					graphText : new MapLib.REST.ThemeGraphText({
						graphTextDisplayed : true,
						graphTextFormat : MapLib.REST.ThemeGraphTextFormat.PERCENT,
						graphTextStyle : new MapLib.REST.ServerTextStyle({
							sizeFixed : true,
							align : MapLib.REST.TextAlignment.MIDDLELEFT,
							fontHeight : 6,
							fontWidth : 3,
							// bold : true,
							// fontName : 800,
							outline: true,
							// shadow : true,
							// foreColor: new
							// MapLib.REST.ServerColor(127,25,127),
							fontName : '微软雅黑'
						})
					}),
					flow : new MapLib.REST.ThemeFlow({
						flowEnabled : true,
						leaderLineDisplayed : true
					}),
					// offset : new MapLib.REST.ThemeOffset({
					// offsetX : '3000',
					// offsetY : '3000'
					// }),
					overlapAvoided : true,
					// graphSizeFixed : true,
					graduatedMode : MapLib.REST.GraduatedMode.SQUAREROOT,
					graphType : MapLib.REST.ThemeGraphType.PIE// BAR3D PIE3D
																// ROSE3D
																// STACK_BAR3D
																// RING
				});

				// 专题图参数对象
				var themeParameters = new MapLib.REST.ThemeParameters({
					themes : [ themeGraph ],
					datasetNames : [ "asdR" ],
					dataSourceNames : [ "ORCL" ]

				})

				// 与服务端交互
				var themeService = new MapLib.REST.ThemeService(FMapLib.DemoURL.fangchan, {
					eventListeners : {
						"processCompleted" : graphThemeCompleted,
						"processFailed" : themeFailed
					}
				});
				themeService.processAsync(themeParameters);
				
				// 生成图例
				// 专题图图例
				var doc=document.getElementById("themelegend");
				if(doc!=null){
				$("#themelegend").remove();
				}
				var color = new Array('AFD8F8', 'F6BD0F', '8BBA00', 'FF8E46', '008E8E',	'D64646');
				var themehtml=
					"<div><table id='timetable' border='0' cellspacing='6' cellpadding='0'>"+
					"<tr><td width='15'  height='7' bgcolor='"+color[0]+"'></td>"+
					"<td width='130' height='7'><a>"+caption[0]+"</a></td><tr>"+
					"<tr><td width='15px'  height='7px' bgcolor='"+color[1]+"'></td>"+
					"<td width='130px' height='7px'><a>"+caption[1]+"</a></td><tr>"+
					"<tr><td width='15'  height='7' bgcolor='"+color[2]+"'></td>"+
					"<td width='130' height='7'><a>"+caption[2]+"</a></td><tr>"+
					"<tr><td width='15px'  height='7px' bgcolor='"+color[3]+"'></td>"+
					"<td width='130px' height='7px'><a>"+caption[3]+"</a></td><tr>"+
					"<tr><td width='15'  height='7' bgcolor='"+color[4]+"'></td>"+
					"<td width='130' height='7'><a>"+caption[4]+"</a></td><tr>"+
					"<tr><td width='15px'  height='7px' bgcolor='"+color[5]+"'></td>"+
					"<td width='130px' height='7px'><a>"+caption[5]+"</a></td><tr>"+
					"<tr><td width='15'  height='7' bgcolor='"+color[6]+"'></td>"+
					"<td width='130' height='7'><a>"+caption[6]+"</a></td><tr>"+
					"</tr></table></div>";
				map.initLegendDiv();// 初始化地图图例图层
				map.flashLegend(themehtml);// 自定义图例内容
				
				 // 获得每个行政区的中心点，并与数据对应 采用在地图上添加FusionCharts的方式展示饼图
		  		/*
				 * getregionParam = new MapLib.REST.FilterParameter({ name :
				 * "asdR@ORCL" }); getregionBySQLParams = new
				 * MapLib.REST.QueryBySQLParameters({ queryParams :
				 * [getregionParam] }); getregionBySQLService = new
				 * MapLib.REST.QueryBySQLService(FMapLib.DemoURL.fangchan,{
				 * eventListeners : { "processCompleted" :
				 * processCompletedextent, "processFailed" : processFailed } });
				 * getregionBySQLService.processAsync(getregionBySQLParams);
				 * RegionThemePie.prototype.info=jdata;
				 */
		  });
	}
		  	// 获得所有行政区中心点病句数据对应
		  	function processCompletedextent(queryEventArgs) {
		  		var i, len, features, feature, result = queryEventArgs.result;
		  		
		  		var color = new Array('AFD8F8', 'F6BD0F', '8BBA00', 'FF8E46', '008E8E',
				'D64646');
		  		if (result && result.recordsets) {
		  			        map.zoomTo(1);
			                for (j=0; j<result.recordsets[0].features.length; j++) {
			                    feature = result.recordsets[0].features[j];
			                    var point;
			                    var regionname=feature.attributes.NAME;
			                    var xmlstringstart = "<graph caption='"+regionname+"' showNames='0' decimalPrecision='0'" +
			                    		" canvasBorderColor='#000000' bgColor='#000000' canvasBgAlpha='0' bgAlpha='0' showBorder='0'" +
			                    		"  pieYScale='0' pieSliceDepth='0' smartLineThickness ='1' smartLabelClearance='1' baseFontSize='12'>";
			                   // 专题图图例
			                    var doc=document.getElementById("themelegend");
			        			if(doc!=null){
			        				$("#themelegend").remove();
			        			}
			                    var themehtml=
								"<div><table id='timetable' border='0' cellspacing='6' cellpadding='0'>";
			                    if(regionname =="历下区"){
		  				        	var extentnum=RegionThemePie.prototype.info.lxhousenum;
		  				             point = new MapLib.Geometry.Point(60160.13, 44719.15);
		  				        }
		  				        if(regionname =="历城区"){
		  				        	var extentnum=RegionThemePie.prototype.info.lchousenum;
		  				        	 point = new MapLib.Geometry.Point(74004.32, 43217.69);
		  				        }
		  				        if(regionname =="市中区"){
	  				        	    var extentnum=RegionThemePie.prototype.info.szhousenum;
	  				        	     point = new MapLib.Geometry.Point(41655.73, 35571.01);
	  				            }
		  				        if(regionname =="槐荫区"){
	  				        	   var extentnum=RegionThemePie.prototype.info.hyhousenum;
	  				        	    point = new MapLib.Geometry.Point(32283.01, 55639.77);
	  				            }
		  				       if(regionname =="天桥区"){
  				        	        var extentnum=RegionThemePie.prototype.info.tqhousenum;
  				        	        point = new MapLib.Geometry.Point(43705.11, 63787.93);
  				                }
		  				       if(regionname =="高新区"){
  				        	        var extentnum=RegionThemePie.prototype.info.gxhousenum;
  				                 }
		  				       if(regionname =="长清区"){
  				        	        var extentnum=RegionThemePie.prototype.info.cqhousenum;
  				        	        point=new MapLib.Geometry.Point(29860.91,20855.56);
  				                 }
		  				       if(regionname == "济阳县"){
		  				    	   point= new MapLib.Geometry.Point(57160.13,86635.06);
		  				       }
		  				       if(regionname == "章丘市"){
		  				    	   point = new MapLib.Geometry.Point(95930.82,55415.21);
		  				       }
		  				       if(regionname == "商河县"){
		  				    	   point=feature.geometry.getCentroid();
		  				       }
		  				        	for (i = 0; i < extentnum.length; i++){
		  				        		xmlstring = "<set name='"
		  								+ extentnum[i].range_name
		  								+"' value='"
		  								+ extentnum[i].range_value + "' color='"
		  								+ color[i] + "'/>";
		  				        		var htmlstring="<tr><td width='15' height='7' bgcolor='"+color[i]+"'></td>"+
										"<td width='140' height='7'><a>"+extentnum[i].range_name+"</a></td></tr>" ;
										xmlstringstart += xmlstring;
										themehtml +=  htmlstring;
		  				        	}
		  				        
		  				    var contentHTML="<div id='"+regionname+"' style='opacity: 1; width: 200px; height: 200px;'><div>"
			                     popup = new MapLib.Popup.Anchored (regionname,
			    			            new MapLib.LonLat(point.x,point.y),
			    			            new MapLib.Size(200,200),
			    			            contentHTML,
			    			            null);
		  				    map.addPopup(popup); 
		  				    popupArray[j]=popup;
		  				    xmlstringstart += "</graph>";
		  				    themehtml+="</tr></table></div>";
						 	var piechart = new FusionCharts("/gis/FMapLib/theme/images/Pie2D.swf","regionChartPieId", "200", "200", "0", "1");
							piechart.setDataXML(xmlstringstart);
							piechart.setTransparent(true);
							piechart.render(regionname);
							// $("#map").append(themehtml);
							map.initLegendDiv();// 初始化地图图例图层
			                map.flashLegend(themehtml);// 自定义图例内容
		  			}
		  		}
		  		
		  	}
	 /**
		 * @author 李洪云 2014 1 10 可见视野范围专题图
		 */
	 var ThemeByExtent=FMapLib.ThemeByExtent=
		 function(parmas,themetype){
		 if(map.getScale()<=1/30000){map.zoomTo(5);}
			var bounds=map.getExtent();
	        pntLeftUp=new MapLib.Geometry.Point(bounds.left,bounds.top),
	        pntRightUp=new MapLib.Geometry.Point(bounds.right,bounds.top),
	        pntRightDown=new MapLib.Geometry.Point(bounds.right,bounds.bottom),
	        pntLeftDown=new MapLib.Geometry.Point(bounds.left,bounds.bottom),
	        pntArry= new Array(pntLeftUp,pntRightUp,pntRightDown,pntLeftDown),
	        linearRing = new MapLib.Geometry.LinearRing(pntArry),
	        plygon = new MapLib.Geometry.Polygon(linearRing);
	        // 传递参数
		 var queryParam, queryByGeometryParameters, queryService;
		 queryParam = new MapLib.REST.FilterParameter({
			 name:"ST_RIDRGN@ORCL"
			 }); 
		 queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
		 queryParams:[queryParam],
		 geometry:plygon,
		 spitalQueryMode:MapLib.REST.SpatialQueryMode.INTERSECT
		});
		 queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan);
		 queryService.events.on({"processCompleted":ThemeByExtentCompleted,
			                     "processFailed":queryFailed
			                    });
		 queryService.processAsync(queryByGeometryParameters);
		 ThemeByExtent.prototype.parmas=parmas;
	     ThemeByExtent.prototype.themetype=themetype;
		 }
	 function ThemeByExtentCompleted(queryEventArgs) {  
	        var i, j, feature,result = queryEventArgs.result;
	        var info=new Array();
	        if (result && result.recordsets) {
	        for (i=0; i<result.recordsets.length; i++) {
	                for (j=0; j<result.recordsets[i].features.length; j++) {
	                    feature = result.recordsets[i].features[j];
	                    var k=j+j*i;
	                    info[k]=feature.attributes.SMID;
	                }
	                if(j+j*i>10000){
	                	alert("查询数量过大，建议使用全市楼房专题图功能");
	                }
	            }
	        }
	        var src,themetype=ThemeByExtent.prototype.themetype,params= ThemeByExtent.prototype.parmas;// 定义专题图模版的路径
		    if(themetype=="饼状图"){
		    	src="/gis/FMapLib/theme/images/Pie2D.swf";
		    }
		    else{
		    	src="/gis/FMapLib/theme/images/Column2D.swf"
		    }
			// 定义颜色数组
			var color = new Array('AFD8F8', 'F6BD0F', '8BBA00', 'FF8E46', '008E8E',
					'D64646');
			// 定义xml语句
			var xmlstringstart = "<graph caption='"+themetype+"（单位：幢）' xAxisName='' yAxisName='平方米' showNames='1' decimalPrecision='0' formatNumberScale='0'>";
	      // 专题图图例
			var doc=document.getElementById("themelegend");
			if(doc!=null){
				$("#themelegend").remove();
			}
			var themehtml=
			"<table id='timetable' border='0' cellspacing='6' cellpadding='0'>";
			$.post("realtygis.housethemebyextent",{programes:params,info:info},
					function(data, textStatus) {
						var jdata = jQuery.parseJSON(data);
						var firstsuffix="";
						var secondsuffix="";
						var lastsuffix="";
						if(params=="buildarea"){
							firstsuffix="平方米以下";
							secondsuffix="平方米";
							lastsuffix="平方米以上";
						}
							if(params=="builddata"){
								firstsuffix="年以前";
								secondsuffix="年";
								lastsuffix="年以后";
							}

						var xmlstring = "<set name='"
								+ jdata.root[0].range_name
								+ firstsuffix+"' value='"
								+ jdata.root[0].range_value + "' color='"
								+ color[0] + "'/>";
						var htmlstring = "&nbsp&nbsp<tr><td width='15' height='7' bgcolor='"+color[0]+"'></td>"+
						"<td width='100' height='7'><a>"+jdata.root[0].range_name+firstsuffix+"</a></td></tr>";
						xmlstringstart += xmlstring;
						themehtml+=htmlstring;
						for (i = 1; i < jdata.root.length - 1; i++) {
							var xmlstring = "<set name='"
									+ jdata.root[i].range_name
									+ secondsuffix+"' value='"
									+ jdata.root[i].range_value
									+ "' color='" + color[i] + "'/>";
							var htmlstring="<tr><td width='15' height='7' bgcolor='"+color[i]+"'></td>"+
							"<td width='140' height='7'><a>"+jdata.root[i].range_name+secondsuffix+"</a></td></tr>" ;
							xmlstringstart += xmlstring;
							themehtml +=  htmlstring;
						}
						var j = jdata.root.length - 1;
						var xmlstring = "<set name='"
								+ jdata.root[j].range_name
								+lastsuffix+ "' value='"
								+ jdata.root[j].range_value + "' color='"
								+ color[j] + "'/>";
						var htmlstring="<tr><td width='15'  height='7' bgcolor='"+color[j]+"'></td>"+
						"<td width='100' height='7'><a>"+jdata.root[j].range_name+lastsuffix+"</a></td><tr>"
						xmlstringstart += xmlstring;
						themehtml+=htmlstring;
						xmlstringstart += "</graph>";
						themehtml+="</tr></table></div>";

						// 弹出 div
						var g = document.createElement("div");
						g.id = "parentchart";
						g.style.position = "absolute";
						g.style.width = "5%";
						g.style.height = "25%";
						g.style.top = "40px";
						g.style.right = "5px";
						g.style.zIndex = 1006;
						map.viewPortDiv.appendChild(g);
						$("#parentchart")
								.append(
										"<div id='theme' class='blk' style='position: absolute; float: right; right: 60px; top: 100px; opacity: 1; z-index: 999; width: 450px; height: 100px;'>"
												+ "<a id='close' class='closeBtn'>关闭</a>"
												+ "<div id='chart' align='center'></div>"
												+ "<div id='hidden' style='position: absolute; right: -50px; top: 125px; opacity: 1; z-index: 999; width: 8px; height: 50px;'>"
												+ "<image id='hiddenbutton' src='/gis/resource/images/menu_view.png'/>"
												+ "</div>" + "</div>");
						// 生成饼状图
						piechart = new FusionCharts(src,"regionChartPieId", "500", "300", "0", "1");
						piechart.setDataXML(xmlstringstart);
						
						piechart.render("chart");
						// $("#map").append(themehtml);
						map.initLegendDiv();// 初始化地图图例图层
		                map.flashLegend(themehtml);// 自定义图例内容
						$("#close").live("click", function() {
							$(this).parent("div").remove();
						});
						$("#hiddenbutton")
								.live(
										"click",
										function() {
											if (document
													.getElementById("chart").style.display != "none") {
												document
														.getElementById("chart").style.display = "none";
												document
														.getElementById("close").style.display = "none";
												$("#hiddenbutton")
														.attr("src",
																"/gis/resource/images/menu_view.png");
											} else {
												document
														.getElementById("chart").style.display = "block";
												document
														.getElementById("close").style.display = "block";
												$("#hiddenbutton")
														.attr("src",
																"/gis/resource/images/menu_view.png");
											}
										});
					});
	}
	 /**
		 * 拉框专题图
		 */
	 var ThemeByDrop=FMapLib.ThemeByDrop=
		 function(parmas,themetype){
		 removeTheme();
		 drawPolygon = new MapLib.Control.DrawFeature(vectorLayer,
					MapLib.Handler.Polygon);
			map.addControl(drawPolygon);
			drawPolygon.events.on({
				"featureadded" : drawCompleteddrop
			});
			drawPolygon.activate();
			 ThemeByExtent.prototype.parmas=parmas;
		     ThemeByExtent.prototype.themetype=themetype;
	 }
	function drawCompleteddrop(drawGeometryArgs){
		loading();
	    drawPolygon.deactivate();
	    var geometry = drawGeometryArgs.feature.geometry;
		var plygon=geometry;
	        // 传递参数
		 var queryParam, queryByGeometryParameters, queryService;
		 queryParam = new MapLib.REST.FilterParameter({
			 name:"ST_RIDRGN@ORCL"
			 }); 
		 queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
		 queryParams:[queryParam],
		 geometry:plygon,
		 spitalQueryMode:MapLib.REST.SpatialQueryMode.INTERSECT
		});
		 queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan);
		 queryService.events.on({"processCompleted":ThemeByDrawExtentCompleted,
			                     "processFailed":queryFailed
			                    });
		 queryService.processAsync(queryByGeometryParameters);
		
		 }
	 function ThemeByDrawExtentCompleted(queryEventArgs) {  
	        var i, j, feature,result = queryEventArgs.result;
	        var info=new Array();
	        if (result && result.recordsets) {
	        for (i=0; i<result.recordsets.length; i++) {
	                for (j=0; j<result.recordsets[i].features.length; j++) {
	                    feature = result.recordsets[i].features[j];
	                    var k=j+j*i;
	                    // info[k]=feature.attributes.SMID;
	                    var total_area = feature.attributes.TOTAL_AREA;
	                    var builddate = feature.attributes.BUILDDATE;
	                    var building_struct = feature.attributes.BUILDING_STRUCT;
	                    var attr = feature.attributes;
	                    var geo = feature.geometry;
	                    
	                    if(ThemeByExtent.prototype.parmas == 'buildarea'){
	                    	if(total_area.length>0 && total_area>0){
	                    		drawFeatureByType(ThemeByExtent.prototype.parmas,total_area,geo,attr);
	                    		info[j]=feature.attributes.SMUSERID;
	                    	}
	                    		
	        	        }
	        	        if(ThemeByExtent.prototype.parmas == 'builddata'){
	        	        	if(builddate.length>0){
	        	        		drawFeatureByType(ThemeByExtent.prototype.parmas,builddate,geo,attr);
	        	        		info[j]=feature.attributes.SMUSERID;
	        	        	}
	        	        		
	        	        }
	        	        if(ThemeByExtent.prototype.parmas == 'buildstructure'){
	        	        	if(building_struct.length>0){
	        	        		drawFeatureByType(ThemeByExtent.prototype.parmas,building_struct,geo,attr);
	        	        		info[j]=feature.attributes.SMUSERID;
	        	        	}
	        	        		
	        	        }
	                }
	                if(j+j*i>10000){
	                	alert("查询数量过大，建议使用全市楼房专题图功能");
	                }
	            }
	        }
	        
	        var src,themetype=ThemeByExtent.prototype.themetype,params= ThemeByExtent.prototype.parmas;// 定义专题图模版的路径
		    if(themetype=="饼状图"){
		    	src="/gis/FMapLib/theme/images/Pie2D.swf";
		    }
		    else{
		    	src="/gis/FMapLib/theme/images/Column2D.swf"
		    }
			// 定义颜色数组
			var color = new Array('AFD8F8', 'F6BD0F', '8BBA00', 'FF8E46', '008E8E',
					'D64646');
			// 定义xml语句
			var xmlstringstart = "<graph caption='"+themetype+"（单位：幢）' xAxisName='' yAxisName='平方米' showNames='1' decimalPrecision='0' formatNumberScale='0'>";
	        // 专题图图例
			var doc=document.getElementById("themelegend");
			if(doc!=null){
				$("#themelegend").remove();
			}
			var themehtml=
			"<div><table id='timetable' border='0' cellspacing='6' cellpadding='0'>";
			$.post("realtygis.housethemebyextent",{programes:params,info:info},
					function(data, textStatus) {
						var jdata = jQuery.parseJSON(data);
						var firstsuffix="";
						var secondsuffix="";
						var lastsuffix="";
						if(params=="buildarea"){
							firstsuffix="平方米以下";
							secondsuffix="平方米";
							lastsuffix="平方米以上";
						}
							if(params=="builddata"){
								firstsuffix="年以前";
								secondsuffix="年";
								lastsuffix="年以后";
							}

						var xmlstring = "<set name='"
								+ jdata.root[0].range_name
								+ firstsuffix+"' value='"
								+ jdata.root[0].range_value + "' color='"
								+ color[0] + "'/>";
						var htmlstring = "&nbsp&nbsp<tr><td width='15' height='7' bgcolor='"+color[0]+"'></td>"+
						"<td width='100' height='7'><a>"+jdata.root[0].range_name+firstsuffix+"</a></td></tr>";
						xmlstringstart += xmlstring;
						themehtml+=htmlstring;
						for (i = 1; i < jdata.root.length - 1; i++) {
							var xmlstring = "<set name='"
									+ jdata.root[i].range_name
									+ secondsuffix+"' value='"
									+ jdata.root[i].range_value
									+ "' color='" + color[i] + "'/>";
							var htmlstring="<tr><td width='15' height='7' bgcolor='"+color[i]+"'></td>"+
							"<td width='140' height='7'><a>"+jdata.root[i].range_name+secondsuffix+"</a></td></tr>" ;
							xmlstringstart += xmlstring;
							themehtml +=  htmlstring;
						}
						var j = jdata.root.length - 1;
						var xmlstring = "<set name='"
								+ jdata.root[j].range_name
								+lastsuffix+ "' value='"
								+ jdata.root[j].range_value + "' color='"
								+ color[j] + "'/>";
						var htmlstring="<tr><td width='15'  height='7' bgcolor='"+color[j]+"'></td>"+
						"<td width='100' height='7'><a>"+jdata.root[j].range_name+lastsuffix+"</a></td><tr>"
						xmlstringstart += xmlstring;
						themehtml+=htmlstring;
						xmlstringstart += "</graph>";
						themehtml+="</tr></table></div>";

						// 弹出 div
						var g = document.createElement("div");
						g.id = "parentchart";
						g.style.position = "absolute";
						g.style.width = "5%";
						g.style.height = "25%";
						g.style.top = "40px";
						g.style.right = "5px";
						g.style.zIndex = 1006;
						map.viewPortDiv.appendChild(g);
						$("#parentchart")
								.append(
										"<div id='theme' class='blk' style='position: absolute; float: right; right: 60px; top: 100px; opacity: 1; z-index: 999; width: 450px; height: 100px;'>"
												+ "<a id='close' class='closeBtn'>关闭</a>"
												+ "<div id='chart' align='center'></div>"
												+ "<div id='hidden' style='position: absolute; right: -50px; top: 125px; opacity: 1; z-index: 999; width: 8px; height: 50px;'>"
												+ "<image id='hiddenbutton' src='/gis/resource/images/menu_view.png'/>"
												+ "</div>" + "</div>");
						// 生成饼状图
						piechart = new FusionCharts(src,"regionChartPieId", "500", "300", "0", "1");
						piechart.setDataXML(xmlstringstart);
						
						piechart.render("chart");
						// $("#map").append(themehtml);
						map.initLegendDiv();// 初始化地图图例图层
		                map.flashLegend(themehtml);// 自定义图例内容
						$("#close").live("click", function() {
							$(this).parent("div").remove();
						});
						$("#hiddenbutton")
								.live(
										"click",
										function() {
											if (document
													.getElementById("chart").style.display != "none") {
												document
														.getElementById("chart").style.display = "none";
												document
														.getElementById("close").style.display = "none";
												$("#hiddenbutton")
														.attr("src",
																"/gis/resource/images/menu_view.png");
											} else {
												document
														.getElementById("chart").style.display = "block";
												document
														.getElementById("close").style.display = "block";
												$("#hiddenbutton")
														.attr("src",
																"/gis/resource/images/menu_view.png");
											}
										});
					});
			removeLoading();
	}
	 // //////////////////////////////////////////////////////////////////////////////////////////////////
	 /**
		 * @author 洛佳明 2014 3 21 拉框选择功能
		 */
	 var DropExtentHouseQuery=FMapLib.DropExtentHouseQuery=
	 function (){
		 removeTheme();
		 if(map)
			 map.clearAllFeatures();
// if(parent.MAP_VISION){
// parent.sizePane('south',100,"in");
// parent.openPane('south',"in");
// }
		 drawPolygon = new MapLib.Control.DrawFeature(vectorLayer,
					MapLib.Handler.Polygon);
			map.addControl(drawPolygon);
			drawPolygon.events.on({
				"featureadded" : drawCompletedHouQ
			});
			drawPolygon.activate();
			
	 }
	 function drawCompletedHouQ(drawGeometryArgs){
		 drawPolygon.deactivate();
		   cancelTip();
		 var geometry = drawGeometryArgs.feature.geometry;
		 QueryBuildingByExtent(geometry);
		// QueryByExtent(geometry,"TOTAL_AREA",1000,10000,1);
	 }
/**
 * 范围查询
 */
var QueryBuildingByExtent=FMapLib.QueryBuildingByExtent=	
	function (boundsname){
		if(map.getScale()>1/30000){
		}
		else{
			map.zoomTo(5);
		}		
		
		// if(vectorLayer){
		// vectorLayer.removeAllFeatures();
		// }
		var bounds;

	 // 定义查询对象
    var plygon=boundsname;
    	
	 var queryParam, queryByGeometryParameters, queryService;
	 queryParam = new MapLib.REST.FilterParameter({
		 name:"ST_RIDRGN@ORCL",
	     attributeFilter :""
		 }); 
	 queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
	 queryParams:[queryParam],
	 geometry:plygon,
	 spitalQueryMode:MapLib.REST.SpatialQueryMode.INTERSECT
	});
	 queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan);
	 queryService.events.on({"processCompleted":queryBuildingCompleted,
		                     "processFailed":queryBuildingFailed
		                    });
	 queryService.processAsync(queryByGeometryParameters);
	 loading();
}

var styleLine = {
	        strokeColor: "black",
    strokeWidth: 1,
    fill: false
};

// 查询完后结果展示
function queryBuildingCompleted(queryEventArgs) {  
	   // vectorLayer.removeAllFeatures();
    var i, j, feature, 
    result = queryEventArgs.result;
    var smuserid="";
    // features = [];
    if (result && result.recordsets) {
    for (i=0; i<result.recordsets.length; i++) {
            for (j=0; j<result.recordsets[i].features.length; j++) {
                feature = result.recordsets[i].features[j];   
                smuserid = smuserid
				+ result.recordsets[i].features[j].attributes["SMUSERID"]
				+ ',';

        }
            smuserid = smuserid.substring(0,smuserid.lastIndexOf(","))
            // 弹出查询结果列表
            window
			.open(
					'realtygis.dropextenthouquery?fea=' + smuserid,
					'_blank',
					'depended=yes,top='+(window.screen.height-30-560)/2+',left='+(window.screen.width-10-1260)/2+',width=1260,height=560,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes');
        }
   
		removeLoading();
        doMapAlert("map", "查询结果", "在该查询范围内的房屋" + j + "座", true);
    }
}
function queryBuildingFailed(){
	alert("参数不正确");
}
function cancelTip(){
	 $("#map").unbind("mouseover");
  $("#map").unbind("mousemove");
  $("#map").unbind("mouseout");
  $("#tooltip").remove();
}
	// ////////////////////////////////////////////////////////////////////////////////
   // 房屋面积分段专题图
			/**
			 * @author 洛佳明 2014 3 24 房屋面积范围值专题图生成函数,主要执行后台查询service的生成
			 * @param fieldname,统计字段名,要求必须和数据库中的字段名一致
			 */
			var BuildingAreaThemeRange = FMapLib.BuildingAreaThemeRange = function(fieldname,arr) {
				removeTheme();// 清空专题图图层
				 if(map)
					map.allOverlays = true;
				var linewidth=1;
				var themeService = new MapLib.REST.ThemeService(FMapLib.DemoURL.fangchan, {
					eventListeners : {
						"processCompleted" : buildingAreaThemeRangeCompleted,
						"processFailed" : themeFailed
					}
				}), style1 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(175, 216, 248),
					fillForeColor : new MapLib.REST.ServerColor(175, 216, 248),// [-]
																				// fillColor
																				// {...}
																				// Object
					lineColor : new MapLib.REST.ServerColor(175, 216, 248),
					lineWidth : linewidth
				}), style2 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(246,189,15),
					fillForeColor : new MapLib.REST.ServerColor(246,189,15),
					lineColor : new MapLib.REST.ServerColor(246,189,15),
					lineWidth : linewidth
				}), style3 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(139,186,0),
					fillForeColor : new MapLib.REST.ServerColor(139,186,0),
					lineColor : new MapLib.REST.ServerColor(139,186,0),
					lineWidth :linewidth
				}), style4 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(255,142,70),
					fillForeColor : new MapLib.REST.ServerColor(255,142,70),
					lineColor : new MapLib.REST.ServerColor(255,142,70),
					lineWidth : linewidth
				}), style5 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(0,142,142),
					fillForeColor : new MapLib.REST.ServerColor(0,142,142),
					lineColor : new MapLib.REST.ServerColor(0,142,142),
					lineWidth : linewidth
				}), style6 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(214,70,70),
					fillForeColor : new MapLib.REST.ServerColor(214,70,70),
					lineColor : new MapLib.REST.ServerColor(214,70,70),
					lineWidth : linewidth
				}),themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
					start : 0,
					end : 100,
					style : style1
				}), themeRangeIteme2 = new MapLib.REST.ThemeRangeItem({
					start : 100,
					end : 1000,
					style : style2
				}), themeRangeIteme3 = new MapLib.REST.ThemeRangeItem({
					start : 1000,
					end : 10000,
					style : style3
				}), themeRangeIteme4 = new MapLib.REST.ThemeRangeItem({
					start : 10000,
					end : 100000,
					style : style4
				}), themeRangeIteme5 = new MapLib.REST.ThemeRangeItem({
					start : 100000,
					end : 200000,
					style : style5
				}),themeRangeIteme6 = new MapLib.REST.ThemeRangeItem({
					start : 200000,
					end : 20000000,
					style : style6
				}),themeRangeItemArray=[themeRangeIteme1, themeRangeIteme2, themeRangeIteme3,
				     					themeRangeIteme4, themeRangeIteme5,themeRangeIteme6],
				// 添加内存数据memoryData 使用SMID划分区域
				themeRange = new MapLib.REST.ThemeRange({
					rangeExpression : fieldname,
					rangeMode : MapLib.REST.RangeMode.EQUALINTERVAL,
					items : themeRangeItemArray
				}), themeParameters = new MapLib.REST.ThemeParameters({
					datasetNames : [ "ST_RIDRGN" ],
					dataSourceNames : [ "ORCL" ],
					displayFilters:["1=1 and SMID in (" + arr + ") and "+fieldname+" is not null"],
					themes : [ themeRange ]
				});
				themeService.processAsync(themeParameters);
				   
			}
			var BuildingdDateThemeRange = FMapLib.BuildingdDateThemeRange = function(fieldname,arr) {
				removeTheme();// 清空专题图图层
				 if(map)
					map.allOverlays = true;
				var linewidth=1;
				var themeService = new MapLib.REST.ThemeService(FMapLib.DemoURL.fangchan, {
					eventListeners : {
						"processCompleted" : buildingAreaThemeRangeCompleted,
						"processFailed" : themeFailed
					}
				}), style1 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(175, 216, 248),
					fillForeColor : new MapLib.REST.ServerColor(175, 216, 248),// [-]
																				// fillColor
																				// {...}
																				// Object
					lineColor : new MapLib.REST.ServerColor(175, 216, 248),
					lineWidth : linewidth
				}), style2 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(246,189,15),
					fillForeColor : new MapLib.REST.ServerColor(246,189,15),
					lineColor : new MapLib.REST.ServerColor(246,189,15),
					lineWidth : linewidth
				}), style3 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(139,186,0),
					fillForeColor : new MapLib.REST.ServerColor(139,186,0),
					lineColor : new MapLib.REST.ServerColor(139,186,0),
					lineWidth :linewidth
				}), style4 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(255,142,70),
					fillForeColor : new MapLib.REST.ServerColor(255,142,70),
					lineColor : new MapLib.REST.ServerColor(255,142,70),
					lineWidth : linewidth
				}), style5 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(0,142,142),
					fillForeColor : new MapLib.REST.ServerColor(0,142,142),
					lineColor : new MapLib.REST.ServerColor(0,142,142),
					lineWidth : linewidth
				}), style6 = new MapLib.REST.ServerStyle({
					// fillColor : new MapLib.REST.ServerColor(214,70,70),
					fillForeColor : new MapLib.REST.ServerColor(214,70,70),
					lineColor : new MapLib.REST.ServerColor(214,70,70),
					lineWidth : linewidth
				}),themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
					start : 0,
					end : 19481231,
					style : style1
				}), themeRangeIteme2 = new MapLib.REST.ThemeRangeItem({
					start : 19490101,
					end : 19881231,
					style : style2
				}), themeRangeIteme3 = new MapLib.REST.ThemeRangeItem({
					start : 19890101,
					end : 20081231,
					style : style3
				}), themeRangeIteme4 = new MapLib.REST.ThemeRangeItem({
					start : 20090101,
					end : 20181231,
					style : style4
				}),themeRangeItemArray=[themeRangeIteme1, themeRangeIteme2, themeRangeIteme3,
				     					themeRangeIteme4],
				// 添加内存数据memoryData 使用SMID划分区域
				themeRange = new MapLib.REST.ThemeRange({
					rangeExpression : fieldname,
					rangeMode : MapLib.REST.RangeMode.EQUALINTERVAL,
					items : themeRangeItemArray
				}), joinItem = new MapLib.REST.JoinItem({ 
					foreignTableName: "ST_RIDRGN_MAPPING", 
					joinFilter: "ST_RIDRGN_MAPPING.SMUSERID = ST_RIDRGN.SMUSERID", 
					joinType: "LEFTJOIN" 
				}), themeParameters = new MapLib.REST.ThemeParameters({
					datasetNames : [ "ST_RIDRGN" ],
					dataSourceNames : [ "ORCL" ],
					displayFilters:["1=1 and SMID in (" + arr + ") and "+fieldname+" is not null"],
					joinItems: [joinItem],
					themes : [ themeRange ]
				});
				themeService.processAsync(themeParameters);
			}
			/**
			 * @author 李洪云 3013 11 29
			 * @param themeEventArgs,函数默认，为后台传回的数据
			 *            接收由范围值专题图数据，将其作为图层精进行展示
			 */
			function buildingAreaThemeRangeCompleted(themeEventArgs) {			
				if (themeEventArgs.result.resourceInfo.id) {
					housethemeLayer = new MapLib.Layer.TiledDynamicRESTLayer("专题图",
							FMapLib.DemoURL.fangchan, {
								cacheEnabled : false,
								transparent : true,
								layersID : themeEventArgs.result.resourceInfo.id
							}, {
								"maxResolution" : "auto"
							});
					housethemeLayer.events.on({
						"layerInitialized" : function() {
							map.addLayer(housethemeLayer);
							map.allOverlays = false;
						}
					});
				}
			}

			 /*
				 * @author 洛佳明 2014-4-1 点、线缓冲分析
				 * 
				 */	
				var	BufferAnalysis=FMapLib.BufferAnalysis=function(map){
					map.clearAllFeatures();
					/*
					 * if ($('#mapAlert').size()) {
					 * $('div').remove('#mapAlert'); }
					 */
					map.removeControl(drawPoint);
					stylePoint = {
					        strokeColor: "black",
					        strokeOpacity: 1,
					        strokeDashstyle: "solid",
					        fillColor: "black",
					        pointRadius: 2
					    },
					    styleLine = {
					        strokeColor: "#2468a2",
					        strokeWidth: 2,
					        pointRadius: 3,
					        pointerEvents: "visiblePainted",
					        fill: false
					    },
					    styleRegion = {
					        strokeColor: "#304DBE",
					        strokeWidth: 2,
					        pointerEvents: "visiblePainted",
					        fillColor: "#304DBE",
					        fillOpacity: 0.4
					    };
					style = {
						strokeColor : "#304DBE",
						strokeWidth : 2,
						pointerEvents : "visiblePainted",
						fillColor : "#304DBE",
						fillOpacity : 0.8
					};
					// 对线图层应用样式style（前面有定义）
					vectorLayer.style = styleLine;	
					vectorLayer2.style = stylePoint;
				}	
					// 画线应用打开
					BufferAnalysis.prototype.openline = function(param) {
						radiusParam=param;
						map.clearAllFeatures();
						if (drawPoint) {
							drawPoint.deactivate();
						}
						if (drawRoad) {
							drawRoad.deactivate();
						}
						if (drawHouse) {
							drawHouse.deactivate();
						}
						if (drawPolygon) {
							drawPolygon.deactivate();
						}
						drawLine = new MapLib.Control.DrawFeature(vectorLayer,
								MapLib.Handler.Path, {
									multi : true
								});
						map.addControl(drawLine);
						drawLine.events.on({
							"featureadded" : drawBufferLineCompleted || {}
						});
						drawLine.activate();
					};
					// 画点应用开启
					BufferAnalysis.prototype.openpoint = function(param) {
						radiusParam=param;
						map.clearAllFeatures();
						if (drawPolygon) {
							drawPolygon.deactivate();
						}
						if (drawRoad) {
							drawRoad.deactivate();
						}
						if (drawLine) {
							drawLine.deactivate();
						}
						if (drawHouse) {
							drawHouse.deactivate();
						}
						drawPoint = new MapLib.Control.DrawFeature(vectorLayer2,
								MapLib.Handler.Point);
						map.addControl(drawPoint);
						drawPoint.activate();
						drawPoint.events.on({
							"featureadded" : drawBufferPointCompleted || {}
						});
						
					};
					// 选取房屋应用打开
					BufferAnalysis.prototype.openhouse = function(param) {
						radiusParam=param;
						map.clearAllFeatures();
						if (drawPoint) {
							drawPoint.deactivate();
						}
						if (drawLine) {
							drawLine.deactivate();
						}
						if (drawRoad) {
							drawRoad.deactivate();
						}
						if (drawPolygon) {
							drawPolygon.deactivate();
						}
						if (drawHouse) {
							drawHouse.deactivate();
						}
						drawHouse = new MapLib.Control.DrawFeature(vectorLayer2,
								MapLib.Handler.Point, {
									multi : true
								});
						map.addControl(drawHouse);
						drawHouse.events.on({
							"featureadded" : drawBufferHouseCompleted || {}
						});
						drawHouse.activate();
					};
					
					// 选取道路应用打开
					BufferAnalysis.prototype.openroad = function(param) {
						radiusParam=param;
						map.clearAllFeatures();
						if (drawPoint) {
							drawPoint.deactivate();
						}
						if (drawLine) {
							drawLine.deactivate();
						}
						if (drawPolygon) {
							drawPolygon.deactivate();
						}
						if (drawHouse) {
							drawHouse.deactivate();
						}
						if (drawRoad) {
							drawRoad.deactivate();
						}
						drawRoad = new MapLib.Control.DrawFeature(vectorLayer2,
								MapLib.Handler.Path, {
									multi : true
								});
						map.addControl(drawRoad);
						drawRoad.events.on({
							"featureadded" : drawBufferRoadCompleted || {}
						});
						drawRoad.activate();
					};
					// 画点应用关闭
					BufferAnalysis.prototype.closepoint = function() {
						drawPoint.deactivate();
					};	
					// 画线应用关闭
					BufferAnalysis.prototype.closeline = function() {
						drawLine.deactivate();
					};	
					// 选取房屋应用关闭
					BufferAnalysis.prototype.closehouse = function() {
						drawHouse.deactivate();
					};
					// 选取道路应用关闭
					BufferAnalysis.prototype.closeroad = function() {
						drawRoad.deactivate();
					};
					// 画线结束
					function drawBufferLineCompleted(drawGeometryArgs) {
						drawGeometryArgs.feature.style=styleLine;
						// 停止画线控制
						drawLine.deactivate();
						// 获得图层几何对象
						bufferline = drawGeometryArgs.feature.geometry;
						BufferAnalysisProcess();
					}
					// 画点结束
					function drawBufferPointCompleted(drawGeometryArgs) {
						drawGeometryArgs.feature.style=stylePoint;
						// 停止画点控制
						drawPoint.deactivate();
						// 获得图层几何对象
						bufferpoint = drawGeometryArgs.feature.geometry;
						BufferAnalysisProcess();
					}
					// 选取房屋结束
					function drawBufferHouseCompleted(drawGeometryArgs) {
						// 停止画线控制
						drawHouse.deactivate();
						// 获得图层几何对象
						var feature = new MapLib.Feature.Vector();
						feature.geometry = drawGeometryArgs.feature.geometry,
						feature.style = stylePoint;
						vectorLayer2.addFeatures(feature);

						var queryParam, queryByGeometryParameters, queryService;
						queryParam = new MapLib.REST.FilterParameter({name: "ST_RIDRGN@ORCL"});
						queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
								queryParams: [queryParam], 
								geometry: drawGeometryArgs.feature.geometry,
								spatialQueryMode: MapLib.REST.SpatialQueryMode.INTERSECT
						});
						queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan, {
							eventListeners: {
								"processCompleted": processHouseCompleted,
								"processFailed": processHouseFailed
											}
						});
						queryService.processAsync(queryByGeometryParameters);
						
					}
					function processHouseCompleted(queryEventArgs) {
						var i, j, result = queryEventArgs.result;
						if (result && result.recordsets) {
							for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
								if (recordsets[i].features==null || recordsets[i].features=='' ){
									alert("未选中房屋，请重新选择！");
									BufferAnalysis.prototype.openhouse(radiusParam);
									break;
								}else {
									for (j=0; j<recordsets[i].features.length; j++) {
										var feature = recordsets[i].features[j];
										feature.style = styleLine;
										vectorLayer2.addFeatures(feature);
										bufferline = feature.geometry;
										BufferAnalysisProcess();
									}
								}
							}
						}
					}
					function processHouseFailed(e) {
						doMapAlert("map", "错误信息",e.error.errorMsg,true);
					}
					// 选取道路结束
					function drawBufferRoadCompleted(drawGeometryArgs) {
						// 停止画线控制
						drawRoad.deactivate();
						// 获得图层几何对象
						var feature = new MapLib.Feature.Vector();
						feature.geometry = drawGeometryArgs.feature.geometry,
						feature.style = styleLine;
						vectorLayer2.addFeatures(feature);

						var queryParam, queryByGeometryParameters, queryService;
						// queryParam = new MapLib.REST.FilterParameter({name:
						// "ST_RIDRGN@ORCL"});//ROADCENTER_L@bei道路中心线_L@beiCITYROAD_A@ORCL
						queryParam = new MapLib.REST.FilterParameter({name: "道路中心线@ORCL"});
						queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
								queryParams: [queryParam], 
								geometry: drawGeometryArgs.feature.geometry,
								spatialQueryMode: MapLib.REST.SpatialQueryMode.INTERSECT
// spatialQueryMode: MapLib.REST.SpatialQueryMode.CROSS
						});
						queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan, {
							eventListeners: {
								"processCompleted": processRoadCompleted,
								"processFailed": processRoadFailed
											}
						});
						queryService.processAsync(queryByGeometryParameters);
						
					}
					
					function processRoadCompleted(queryEventArgs) {
						var i, j, result = queryEventArgs.result;
						if (result && result.recordsets) {
							for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
								if (recordsets[i].features==null || recordsets[i].features=='' ){
									alert("未选中道路，请重新选择！");
									BufferAnalysis.prototype.openroad(radiusParam);
									break;
								}else if(recordsets[i].features.length>1){
									alert("只能选择一条道路，请重新选择！");
									BufferAnalysis.prototype.openroad(radiusParam);
									break;
								}else {
									for (j=0; j<recordsets[i].features.length; j++) {
										var feature = recordsets[i].features[j];
										feature.style = styleLine;
										vectorLayer2.addFeatures(feature);
										bufferline = feature.geometry;
										BufferAnalysisProcess();
									}
								}
							}
						}
					}
					function processRoadFailed(e) {
						doMapAlert("map", "错误信息",e.error.errorMsg,true);
					}
				
					// 缓冲分析查询
// BufferAnalysis.prototype.analysis=function(param){
					function BufferAnalysisProcess(){
						if((radiusParam==null)||(radiusParam=="")){
							alert("请输入查询半径！");
						}
						// 无要素
						if((radiusParam!="")&&(bufferpoint==null)&&(bufferline==null)){
							alert("请先绘制图形要素！");   
						}
						// 点分析
						if((radiusParam!="")&&(bufferpoint!=null)&&(bufferline==null)){
							var bufferServiceByGeometry = new MapLib.REST.BufferAnalystService(FMapLib.DemoURL.fangchan_spatialanalyst),
				            bufferDistance = new MapLib.REST.BufferDistance({
				                value: radiusParam
				            }),
				            bufferSetting = new MapLib.REST.BufferSetting({
				                endType: MapLib.REST.BufferEndType.ROUND,
				            leftDistance: bufferDistance,
				           // rightDistance: bufferDistance,
				            semicircleLineSegment: 20
				            }),
				            geoBufferAnalystParam = new MapLib.REST.GeometryBufferAnalystParameters({
				                sourceGeometry: bufferpoint,
				            bufferSetting: bufferSetting
				            });        

				        bufferServiceByGeometry.events.on(
						{
							"processCompleted": bufferAnalystCompleted
						});
				        bufferServiceByGeometry.processAsync(geoBufferAnalystParam);
				        bufferpoint=null;
						}
						// 线分析
						if((radiusParam!="")&&(bufferpoint==null)&&(bufferline!=null)){
							var bufferServiceByGeometry = new MapLib.REST.BufferAnalystService(FMapLib.DemoURL.fangchan_spatialanalyst),
				            bufferDistance = new MapLib.REST.BufferDistance({
				                value: radiusParam
				            }),
				            bufferSetting = new MapLib.REST.BufferSetting({
				                endType: MapLib.REST.BufferEndType.ROUND,
				            leftDistance: bufferDistance,
				            rightDistance: bufferDistance,
				            semicircleLineSegment: 10
				            }),
				            geoBufferAnalystParam = new MapLib.REST.GeometryBufferAnalystParameters({
				                sourceGeometry: bufferline,
				            bufferSetting: bufferSetting
				            });        

				        bufferServiceByGeometry.events.on(
						{
							"processCompleted": bufferAnalystCompleted
						});
				        bufferServiceByGeometry.processAsync(geoBufferAnalystParam);
				        bufferline=null;
						}
					}	
						
// };
					// 缓冲分析结束执行的函数
					 function bufferAnalystCompleted(BufferAnalystEventArgs) {
					        var feature = new MapLib.Feature.Vector();
					       var bufferResultGeometry = BufferAnalystEventArgs.result.resultGeometry;
					        feature.geometry = bufferResultGeometry;
					        feature.style = styleRegion;
					        vectorLayer.addFeatures(feature);
					        queryBuildingByGeometry(bufferResultGeometry);
					     }
					    // 查询出缓冲区内的实测房屋
					    function queryBuildingByGeometry(bufferResultGeometry){
					    	// 设置与外部表的连接信息
					    	var joinItem = new MapLib.REST.JoinItem({
								foreignTableName : "T_BUILDING",
								joinFilter : "T_BUILDING.BUILDING_MAPID = ST_RIDRGN.SMUSERID and T_BUILDING.BUILDING_MAPID>0",
								joinType : "INNERJOIN"

							});
					        var queryParam, queryByGeometryParameters, queryService;
					        queryParam = new MapLib.REST.FilterParameter({name: "ST_RIDRGN@ORCL",joinItems:[joinItem]});
					        queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
					            queryParams: [queryParam], 
							    geometry: bufferResultGeometry,
							    spatialQueryMode: MapLib.REST.SpatialQueryMode.INTERSECT
					        });
					        queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.datamap);
					        queryService.events.on(
							{
								"processCompleted": queryBufferCompleted,
								"processFailed" : processFailed
							});
					        queryService.processAsync(queryByGeometryParameters);
					    }
					        // 鼠标点击marker弹出信息框的函数
					        bufferMarkerAlert = function(){
					    	   if(preFeature!=undefined&&preFeature.popup!=null&&preFeature.popup!=undefined){
								map.removePopup(preFeature.popup);
						   	   }					       
								var querymarkerlonlat = this;
								var markercontentHTML = t_buildingMarkerQuery(querymarkerlonlat);
								var querymarkerX = querymarkerlonlat.getLonLat().lon;// X坐标;
								var querymarkerY = querymarkerlonlat.getLonLat().lat;// Y坐标
								var attribute = querymarkerlonlat.information.attributes["ST_RIDRGN.ADDRESS"];


								popup = new MapLib.Popup.FramedCloud("chicken", new MapLib.LonLat(
										querymarkerX, querymarkerY), new MapLib.Size(200, 300), markercontentHTML, null,
										true,null,true);
								querymarkerlonlat.popup = popup;
								popup.panMapIfOutOfView = true;
								popup.autoSize = false;
								map.addPopup(popup);
								preFeature = querymarkerlonlat;
							}
						 // marker自动弹出信息框的函数
						    bufferMarkerAlertAuto = function(buffermarker){
// if(preFeature.popup!=null&&preFeature.popup!=undefined){
// map.removePopup(preFeature.popup);
// }
							var querymarkerlonlat = buffermarker;
							var markercontentHTML = t_buildingMarkerQuery(querymarkerlonlat);
							var querymarkerX = querymarkerlonlat.getLonLat().lon;// X坐标;
							var querymarkerY = querymarkerlonlat.getLonLat().lat;// Y坐标
							var attribute = querymarkerlonlat.information.attributes["ST_RIDRGN.ADDRESS"];


							popup = new MapLib.Popup.FramedCloud("chicken", new MapLib.LonLat(
									querymarkerX, querymarkerY), new MapLib.Size(200, 300), markercontentHTML, null,
									true,null,true);
							querymarkerlonlat.popup = popup;
							popup.panMapIfOutOfView = true;
							popup.autoSize = false;
							map.addPopup(popup);
							preFeature = querymarkerlonlat;
						}
					    function queryBufferCompleted(queryEventArgs) {
					        var i, j, result = queryEventArgs.result;
					        var smuserid="";
					        var countArr=[],count=0;
					        
					        if (result && result.recordsets) {
					            for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
					            // datasetname=recordsets[i].fieldCaptions[0];
					            	if (recordsets[i].features) {
					                	
					                    for (j=0; j<recordsets[i].features.length; j++) {
					                    	smuserid = smuserid
											+ result.recordsets[i].features[j].attributes["ST_RIDRGN.SMUSERID"]
											+ ',';
					                        var point = recordsets[i].features[j].geometry.getCentroid(),
					                            size = new MapLib.Size(32,30),
					                                 offset = new MapLib.Pixel(-(size.w/2), -size.h),
					                                 icon = new MapLib.Icon(baseurl + "theme/images/marker11.png", size, offset);
					                        var buffermarker = new MapLib.Marker(new MapLib.LonLat(point.x, point.y), icon);
					                        buffermarker.information = recordsets[i].features[j];
					                        markerLayer.addMarker(buffermarker);
					                        buffermarker.events.on({
												"click" : bufferMarkerAlert,
												"scope" : buffermarker
											});
					                       // 过滤重复数据，统计查询结果数量
					                        if(countArr && countArr.length){
					                        	var flag=true;
					                        	for(var g=0;g<countArr.length;g++){
					                        		if(countArr[g] == result.recordsets[i].features[j].attributes["ST_RIDRGN.SMUSERID"]){
					                        			flag=false;
					                        		}
					                        	}
					                        	if(flag){
					                        		countArr[count]=result.recordsets[i].features[j].attributes["ST_RIDRGN.SMUSERID"];
					                        		count++;
					                        	}
					                        }else{
					                        	countArr[0]=result.recordsets[i].features[j].attributes["ST_RIDRGN.SMUSERID"];
					                        	count++;
					                        }
					                    }
					                    
					                }
					            }
					        }
					        buildingFromMap(smuserid);
					       
					        doMapAlert("map", "查询结果", "在该查询范围内的房屋" + count + "座", true);
					    }
					    	
						/**
						 * 查询选定楼幢的楼幢信息 公用方法
						 * 
						 * @param marker
						 *            楼幢marker
						 * @return String 弹出框html
						 */
						 t_buildingMarkerQuery=function(marker){							
							var contentHTML = "<div style='font-size:.8em; opacity: 1; line-height:30px; overflow-y:hidden;'>"
								+ "<span style='color:#005ebc;font-size: 18px;font-family:微软雅黑;'>房屋信息</span><br>";
							$.ajax({
								          url : 'realtygis.buildingjson',
										cache : false,
										async : false,// 同步
										dataType : 'json',
										 data : {
											id : (marker.information.attributes['ST_RIDRGN.SMUSERID']==undefined?marker.information.attributes['SMUSERID']:marker.information.attributes['ST_RIDRGN.SMUSERID'])

										},
										success : function(jdata, textStatus) {
											if (textStatus == 'success') {									      		
													var len = jdata.root.length;
													var items=jdata.root;
													for (i = 0; i < len; i++) {													
								         		contentHTML += "<div style='font-size:1.2em;margin-left:15px'>地址：" + items[i].building_address	+ "</div>"; 
								         		contentHTML +="<p  style='text-align:center;'><input type='button' value='详细信息' onclick=window.open('realtygis.tabdialog?building_id="
												        + items[i].building_id+"','_blank','depended=yes,top='+(window.screen.height-30-500)/2+',left='+(window.screen.width-10-900)/2+',width=900,height=500,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes') style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>"	
								         		
											        }
											contentHTML +="</div>";
											   
											} 		
									   }
									});
							return contentHTML;
						}
							/**
							 * 安全 查询选定楼幢的楼幢信息 公用方法
							 * 
							 * @param marker
							 *            楼幢marker
							 * @return String 弹出框html
							 */
							 jkdaMarkerQuery=function(marker){
								var contentHTML = "";
								
								$
										.ajax({
											url : 'realtygis.safetybuildingjson',
											cache : false,
											async : false,// 同步
											dataType : 'json',
											data : {
												id : (marker.information.attributes['ST_RIDRGN_JKDA_P.SMUSERID']==undefined?marker.information.attributes['SMUSERID']:marker.information.attributes['ST_RIDRGN_JKDA_P.SMUSERID'])

											},
											success : function(item, textStatus, jqXHR) {
												if (textStatus == 'success') {
											/*
											 * contentHTML +="<div
											 * style='font-size:.8em; opacity:
											 * 0.8; overflow-y:hidden;
											 * background:#FFFFFF';width:100%;height:100%>" + "<span
											 * style='font-weight: bold;
											 * font-size:
											 * 18px;'>"+item.address_o+"</span><br><br>";
											 * 
											 * contentHTML +="<form>" +"<p align='center'><input
											 * type='button' value='详细信息'
											 * onclick=window.open('realtygis.jkdatabdialog?invm_prj_id=" +
											 * item.invm_prj_id+"','_blank','depended=yes,width=900,height=500,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes')></p>" // +"<p align='center'><input
											 * type='button' value='修改属性'
											 * onclick=window.open('realtygis.updatebuildingproperty?building_id=" // +
											 * item.building_id+"&method=null','_blank','depended=yes,width=900,height=500,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes')></p><br>" +"</form>" + "</div>";
											 */
								         	contentHTML = "<div style='font-size:.8em; opacity: 1; line-height:30px; overflow-y:hidden;'>"
												+ "<span style='color:#005ebc;font-size: 18px;font-family:微软雅黑;'>房屋信息</span><br>";
								         		contentHTML += "<div style='font-size:1.2em;margin-left:15px'>地址：" + item.address_o	+ "</div>"; 
								         		contentHTML +="<p  style='text-align:center;'><input type='button' value='详细信息' onclick=window.open('realtygis.jkdatabdialog?invm_prj_id="
											        + item.invm_prj_id+"','_blank','depended=yes,top='+(window.screen.height-30-500)/2+',left='+(window.screen.width-10-900)/2+',width=900,height=500,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes') style='background:url(/gis/FMapLib/theme/images/button_bj.jpg) repeat-x; width:100px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>"+	
											    "</div>";
								         		
												}
											}
										});
								return contentHTML;
							}
						 /**
							 * 房屋安全地址查询API
							 */
							var SafetyQueryByAddress =
							/**
							 * 
							 * @param string
							 * @returns {FMapLib.VillageQueryByName}
							 * 
							 * example 不带参数 var villageFindInst=new
							 * FMapLib.VillageQueryByName();
							 * villageFindInst.open(); 带参数 var
							 * villageFindInst=new
							 * FMapLib.VillageQueryByName("群盛华城");
							 * villageFindInst.open();
							 */
							FMapLib.SafetyQueryByAddress = function(string) {
								// 判断是否输入参数
								if (string == undefined) {
									this._param = " 健康完损等级 is not null";
								} else {									
									this._param = " 健康完损等级 is not null and ADDRESS  like '%" + string + "%'";
								}
							};
							// open
							SafetyQueryByAddress.prototype.open = function() {
								// vectorLayer.removeAllFeatures();
								var params = this._param;
								// markerLayer.clearMarkers();
								map.clearAllFeatures();
								var getFeatureParamSafety, getFeatureBySQLServiceSafety, getFeatureBySQLParamsSafety;

								getFeatureParamSafety = new MapLib.REST.FilterParameter({
									name : "ST_RIDRGN_JKDA_P@ORCL",
									attributeFilter : params
								});

								getFeatureBySQLParamsSafety = new MapLib.REST.GetFeaturesBySQLParameters(
										{
											queryParameter : getFeatureParamSafety,
											datasetNames : [ "ORCL:ST_RIDRGN_JKDA_P" ],
											fromIndex:0,
											toIndex:1000
										});
								getFeatureBySQLServiceSafety = new MapLib.REST.GetFeaturesBySQLService(
										FMapLib.DemoURL.fangchan1, {
											eventListeners : {
												"processCompleted" : processCompletedSafety,
												"processFailed" : processFailed
											}
										});

								getFeatureBySQLServiceSafety
										.processAsync(getFeatureBySQLParamsSafety);

							};
							// 安全房屋查询成功
							function processCompletedSafety(getFeaturesEventArgs) {
								
								  var i, j, feature,features,result = getFeaturesEventArgs.result;
								  if (result && result.features) {
										features = result.features;
										// alert("共查出"+features.length+"座房屋!");
										for (i = 0, len = features.length; i < len; i++) {
											feature = features[i];
											features.push(feature);
							                    	 // var point =
														// recordsets[i].features[j].geometry.getCentroid(),
							                        var pointx = parseFloat(features[i].attributes["SMX"]),
							                            pointy = parseFloat(features[i].attributes["SMY"]),	                
							                            size = new MapLib.Size(32,30),
							                                 offset = new MapLib.Pixel(-(size.w/2), -size.h),
							                                 icon = new MapLib.Icon(baseurl + "theme/images/marker11.png", size, offset);
							                        var safetymarker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy), icon);
							                        safetymarker.information = features[i];
							                        markerLayer.addMarker(safetymarker);
							                        safetymarker.events.on({
														"click" : safetyMarkerAlert,
														"scope" : safetymarker
													});
							                        safetymarker.events.on({
														"mouseover" : changeIconall,
														"scope" : safetymarker
													});
							                        safetymarker.events.on({
														"mouseout" : returnIconall,
														"scope" : safetymarker
													});					                    
							                    
							                }
							            }
	
							        if(map.getZoom()<2){
							        	 map.zoomTo(2);
							        }
									
							}
							 // 鼠标点击marker弹出信息框的函数
							safetyMarkerAlert = function(){
						    	if(preFeature!=undefined&&preFeature.popup!=null&&preFeature.popup!=undefined){
									map.removePopup(preFeature.popup);
							    	}						    
									var querymarkerlonlat = this;
									var markercontentHTML = jkdaMarkerQuery(querymarkerlonlat);
									var querymarkerX = querymarkerlonlat.getLonLat().lon;// X坐标;
									var querymarkerY = querymarkerlonlat.getLonLat().lat;// Y坐标
									// var attribute =
									// querymarkerlonlat.information.attributes["ST_RIDRGN.ADDRESS"];


									popup = new MapLib.Popup.FramedCloud("chicken", new MapLib.LonLat(
											querymarkerX, querymarkerY), new MapLib.Size(200, 300), markercontentHTML, null,
											true,null,true);
									querymarkerlonlat.popup = popup;
									popup.panMapIfOutOfView = true;
									popup.autoSize = false;
									map.addPopup(popup);
									preFeature = querymarkerlonlat;
								}
		
							 /**
								 * 房屋安全等级查询API
								 */
							var SafetyQueryByGrade =
							/**
							 * 
							 * @param string
							 * 
							 * 
							 */
							FMapLib.SafetyQueryByGrade = function(string) {
								// 判断是否输入参数
								if (string == undefined) {
									this._param = " 健康完损等级 is not null";
								} else {									
									this._param = " 健康完损等级 is not null and 健康完损等级  like '%" + string + "%'";
								}
							};
							// open
							SafetyQueryByGrade.prototype.open = function() {
								// vectorLayer.removeAllFeatures();
								var params = this._param;
								// markerLayer.clearMarkers();
								map.clearAllFeatures();
								var getFeatureParamSafety, getFeatureBySQLServiceSafety, getFeatureBySQLParamsSafety;

								getFeatureParamSafety = new MapLib.REST.FilterParameter({
									name : "ST_RIDRGN_JKDA_P@ORCL",
									attributeFilter : params
								});

								getFeatureBySQLParamsSafety = new MapLib.REST.GetFeaturesBySQLParameters(
										{
											queryParameter : getFeatureParamSafety,
											datasetNames : [ "ORCL:ST_RIDRGN_JKDA_P" ],
											fromIndex:0,
											toIndex:1000
										});
								getFeatureBySQLServiceSafety = new MapLib.REST.GetFeaturesBySQLService(
										FMapLib.DemoURL.fangchan1, {
											eventListeners : {
												"processCompleted" : processCompletedSafety,
												"processFailed" : processFailed
											}
										});

								getFeatureBySQLServiceSafety
										.processAsync(getFeatureBySQLParamsSafety);

							}; 

		 /**
			 * 子图层控制
			 */
				
	function layerControl() {
		    
				// 获取地图状态参数必设：url
		        var getLayersInfoService = new MapLib.REST.GetLayersInfoService(FMapLib.DemoURL.fangchanlc);
		        getLayersInfoService.events.on({ "processCompleted": getLayersInfoCompleted});
		        getLayersInfoService.processAsync();
	
						
		}
	function layerControlopen(){
			 $("#popupWin").css("display", "block");
			}
		    // 与服务器交互成功，得到子图层信息
		    var subLayers = new Array();
		    function getLayersInfoCompleted(getLayersInfoEventArgs) {
		        if (getLayersInfoEventArgs.result) {
		            {
		                if (getLayersInfoEventArgs.result.subLayers) {
		                    for (var j = 0; j < getLayersInfoEventArgs.result.subLayers.layers.length; j++) {
		                        subLayers.push(getLayersInfoEventArgs.result.subLayers.layers[j]);
		                    }
		                }
		            }
		        }
		        installPanel(subLayers);		   
		        subLayers.length=0;		    
		    }
		    // 组装操作面板，显示子图层列表，并初始化地图显示
		    function installPanel(subLayers) {
		        var layersList = "";
		        for (var i = 0; i < subLayers.length; i++) {
		            if (eval(subLayers[i].visible) == true) {
		                layersList += '<label class="checkbox" style="line-height: 28px; display: block"><input type="checkbox"  class = "checkbox" id="layersList' + i + '" name="layersList" value="' + subLayers[i].name + '" checked=true title="是否可见" />' + subLayers[i].name + '</label>';
		            }
		            else {
		                layersList += '<label class="checkbox" style="line-height: 28px; display: block"><input type="checkbox" class = "checkbox" id="layersList' + i + '" name="layersList" value="' + subLayers[i].name + '" title="是否可见"  />' + subLayers[i].name + '</label>';
		            }
		        }
		        showWindow(layersList);
		        $(".checkbox").click(setLayerStatus);

		        // 样式为BootStrap框架设置
		        $(".checkbox").hover(function () {
		            $(this).addClass("label-success");
		        }, function () {
		            $(this).removeClass("label-success");
		        });
		        createTempLayer();
		    }
		    // 创建临时图层来初始化当前地图显示
		    function createTempLayer() {
		        // 子图层控制参数必设：url、mapName、SetLayerStatusParameters
		        var layerStatusParameters = new MapLib.REST.SetLayerStatusParameters();
		        layerStatusParameters = getLayerStatusList(layerStatusParameters);

		        var setLayerStatusService = new MapLib.REST.SetLayerStatusService(FMapLib.DemoURL.fangchanlc);
		        setLayerStatusService.events.on({ "processCompleted": createTempLayerCompleted});
		        setLayerStatusService.processAsync(layerStatusParameters);
		    }
		    // 获取当前地图子图层状态信息
		    function getLayerStatusList(parameters) {
		        var layersList = document.getElementsByName("layersList");
		        for (var i = 0; i < layersList.length; i++) {
		            var layerStatus = new MapLib.REST.LayerStatus();
		            layerStatus.layerName = layersList[i].value;
		            layerStatus.isVisible = eval(layersList[i].checked);
		            parameters.layerStatusList.push(layerStatus);
		        }
		        // 设置资源在服务端保存的时间，单位为分钟，默认为10
		        parameters.holdTime = 100;
		        return parameters;
		    }
		    // 与服务器交互成功，创建临时图层
		    function createTempLayerCompleted(createTempLayerEventArgs) {
		        tempLayerID = createTempLayerEventArgs.result.newResourceID;

		        // 创建 TiledDynamicRESTLayer
		        layerlc = new MapLib.Layer.TiledDynamicRESTLayer("1405131040",
						FMapLib.DemoURL.fangchanlc, {
							transparent : true,
							cacheEnabled : false,
							redirect: true,
							layersID: tempLayerID
						}, {
							scales : scales,
							maxResolution : "auto",
							numZoomLevels : 9,
							bufferImgCount: 0
						});
		      
		      // layerlc.bufferImgCount = 0;
		        layerlc.events.on({"layerInitialized": addLayer});
		    }

		    function addLayer() {
		        map.addLayers([layerlc]);		 
		        layerControlopen();
		       // map.setCenter(new MapLib.LonLat(48892.64, 51001.71),0);
		    }
		  // 子图层可见性控制
		    function setLayerStatus() {
		        // 方法一：使用发送子图层控制参数请求来控制子图层，不推荐使用
		        // 子图层控制参数必设：url、mapName、SetLayerStatusParameters
// var layerStatusParameters = new MapLib.REST.SetLayerStatusParameters();
// layerStatusParameters = getLayerStatusList(layerStatusParameters);
// layerStatusParameters.resourceID = tempLayerID;
// var setLayerStatusService = new MapLib.REST.SetLayerStatusService(url);
// setLayerStatusService.events.on({ "processCompleted":
// setLayerStatusCompleted});
// setLayerStatusService.processAsync(layerStatusParameters);


		        // 方法二：通过TiledDynamicRESTLayer的属性layersID来控制子图层的可见性，推荐使用此方法
		        var layersList = document.getElementsByName("layersList");
		        var str = "[0:";
		        for (var i = 0; i < layersList.length; i++){
		            if(eval(layersList[i].checked) == true)
		            {
		                if(i<layersList.length)
		                {
		                    str += i.toString();
		                }
		                if(i<layersList.length-1)
		                {
		                    str += ",";
		                }
		            }
		        }
		        str += "]";
		        // 当所有图层都不可见时
		        if(str.length<5)
		        {
		            str = "[]";
		        }
		        layerlc.params.layersID = str;
		        layerlc.redraw();

		    }

		    
		    function showWindow(winMessage) {
// if(document.getElementById("popupWin")) {
// $("#popupWin").remove();
// }
		        $("#result").empty();
		        $("<div id='popupWin'></div>").addClass("popupWindow").appendTo($("#result"));
		        
		        if(document.getElementById("hiddendiv")) {
		            $("#hiddendiv").remove();
		        } 
		        $("#popupWin").css("display", "none");
		        var str = "";
		        var strh= "";
		        str += '<div class="winTitle" onMouseDown="startMove(this,event)" onMouseUp="stopMove(this,event)"><span class="title_left">非切片地图图层控制</span><span class="title_right"><a href="javascript:closeWindow()" title="关闭控制窗口">关闭</a></span><br style="clear:right"/></div>';  // 标题栏

		        str += '<div id="winContent" class="winContent">';
		        str += winMessage;
		        str += '</div>';
		        strh ="<div id='hiddendiv' style='position: absolute; right: 12px; top: 100px; opacity: 1; z-index: 999; width: 8px; height: 50px;'>"
				+ "<image title = '隐藏控制窗口' id='hiddenwindow' src='/gis/resource/images/menu_view.png'/>"
				+ "</div>";
		        $("#popupWin").html(str);
		        $("#result").append(strh);
		        $("#winContent").css("height", "300px");
		    	$("#hiddenwindow")
				.bind(
						"click",
						function() {
							if (document
									.getElementById("popupWin").style.display != "none") {
								$("#popupWin").css("display", "none");
								$("#hiddenwindow")
										.attr("src",
												"/gis/resource/images/menu_view.png");
								$("#hiddenwindow")
								.attr("title",
										"显示控制窗口");
							} else {
								$("#popupWin").css("display", "block");						
								$("#hiddenwindow")
										.attr("src",
												"/gis/resource/images/menu_view.png");
								$("#hiddenwindow")
								.attr("title",
										"隐藏控制窗口");
							}
						});
		        document.getElementById("popupWin").style.width = "250px";
		        document.getElementById("popupWin").style.height = "350px";		    
		    }
		    window.closeWindow = function(){
		        $("#popupWin").remove();
		        $("#hiddendiv").remove();
		        
		    }
		    window.startMove = function(o,e){
		        var wb;
		        if(MapLib.Browser.name === "msie" && e.button === 1) wb = true;
		        else if(e.button === 0) wb = true;
		        if(wb){
		            var x_pos = parseInt(e.clientX-o.parentNode.offsetLeft);
		            var y_pos = parseInt(e.clientY-o.parentNode.offsetTop);
		            if(y_pos<= o.offsetHeight){
		                document.documentElement.onmousemove = function(mEvent){
		                    var eEvent = (MapLib.Browser.name === "msie")?event:mEvent;
		                    o.parentNode.style.left = eEvent.clientX-x_pos+"px";
		                    o.parentNode.style.top = eEvent.clientY-y_pos+"px";
		                }
		            }
		        }
		    }
		    window.stopMove = function(o,e){
		        document.documentElement.onmousemove = null;
		    }
			/*
			 * 小区查询API @author luojiaming 20140516 @param string 小区名称
			 */
			    var AreaQueryByName =
			    
			FMapLib.AreaQueryByName = function(string) {
			    	// 判断是否输入参数
					if (string == undefined||string == "请输入小区名称") {
						// this._param = "SMID > 0";
						alert("请输入小区名称！");
						
					} else {
						this._param = "AREANAME  like '%" + string + "%'";
					}				    	
			    }
			    AreaQueryByName.prototype.areaNum=0;
			    AreaQueryByName.prototype.buildingCount=0;
			    AreaQueryByName.prototype.open = function() {
			    	var params = this._param;
					// markerLayer.clearMarkers();
					var getFeatureParamVillage, getFeatureBySQLServiceVillage, getFeatureBySQLParamsVillage;

					getFeatureParamVillage = new MapLib.REST.FilterParameter({
						name : "NEW_REGION@ORCL",
						attributeFilter : params
					});

					getFeatureBySQLParamsVillage = new MapLib.REST.GetFeaturesBySQLParameters(
							{
								queryParameter : getFeatureParamVillage,
								datasetNames : [ "ORCL:NEW_REGION" ]
							});
					getFeatureBySQLServiceVillage = new MapLib.REST.GetFeaturesBySQLService(
							FMapLib.DemoURL.fangchan1, {
								eventListeners : {
									"processCompleted" : processCompletedArea,
									"processFailed" : processFailed
								}
							});

					getFeatureBySQLServiceVillage
							.processAsync(getFeatureBySQLParamsVillage);
			    	
			    	
			    }
			   
			 // 小区查询成功
				function processCompletedArea(getFeaturesEventArgs) {
					var areafeature;
					var i, len, features, result = getFeaturesEventArgs.result;
					if (result && result.features) {
						features = result.features;
						for (i = 0, len = features.length; i < len; i++) {
							areafeature = features[i];
							features.push(areafeature);
							var point = feature.geometry.getCentroid();
							map.zoomTo(4);
							map.setCenter(new MapLib.LonLat(point.x,point.y));
							AreaQueryByName.prototype.areafeature=areafeature;
					      // 计算小区面积
						   AreaMeasure(AreaQueryByName.prototype.areafeature);							
						  // 计算楼栋数量
						  // QueryBuildingNum(areafeature);
					
						  // 计算绿化率
                          // var greenrate=getgreenrate(areafeature);
						
						}
					}
				}
				FMapLib.extend(AreaQueryByName.prototype,{
					
					_makeMarker:function(areafeature){	
						var me=this;
					// 渲染marker
					var point = areafeature.geometry.getCentroid();	                                      
                  var size = new MapLib.Size(32,30),
                       offset = new MapLib.Pixel(-(size.w/2), -size.h),
                       icon = new MapLib.Icon(baseurl + "theme/images/marker11.png", size, offset);
                  var areamarker = new MapLib.Marker(new MapLib.LonLat(point.x, point.y), icon);
                      areamarker.information = areafeature;
                      areamarker.buildingnum =AreaQueryByName.prototype.buildingCount;
                      areamarker.greenrate = AreaQueryByName.prototype.greenrate;
                      areamarker.greenarea = AreaQueryByName.prototype.greenarea;
                      areamarker.areamath = AreaQueryByName.prototype.areaNum;
                      markerLayer.addMarker(areamarker);
                      areamarker.events.on({
				        	"click" : me._popupinfo,
				    	    "scope" : areamarker
			        	});
				},
				// 弹出信息窗口
				_popupinfo:function(){
					if(preFeature!=undefined&&preFeature.popup!=null&&preFeature.popup!=undefined){
						map.removePopup(preFeature.popup);
				    	}
					var areamarker = this;
					// var point = feature.geometry.getCentroid();
			        var   point = areamarker.getLonLat();
					var contentHTML = "<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden;'>"
							+ "<span style='font-weight: bold; font-size: 18px;'>详细信息</span><br>";
					contentHTML += "小区名称：" + areamarker.information.attributes["AREANAME"]
							+ "<br>";
					contentHTML += "小区面积：" + areamarker.areamath+"平方米"
							+ "<br>";
					contentHTML += "小区绿化面积：" + areamarker.greenarea+"平方米"
					        + "<br>";
					contentHTML += "小区楼栋数量：" + areamarker.buildingnum+"座"
				        	+ "<br>";
					contentHTML += "小区绿化率：" + areamarker.greenrate+"%"
							+ "</div>";
					contentHTML += "<br>" + "<div>" + "<img border='0' src='" + baseurl
							+ "theme/images/123.jpg' width='160' height='100'/>"
							+ "</div>";
					popup = new MapLib.Popup.FramedCloud("popwin",
							new MapLib.LonLat(point.lon, point.lat), null,
							contentHTML, null, true, null, true);
					popup.keepInMap = true;
					popup.closeOnMove = false;
					feature.popup = popup;
					map.addPopup(popup);
					preFeature = feature;
				}
				});
				// 销毁
					destroy = function() {
						markerLayer.map.removePopup(popup);
					}
				    // 计算小区面积
					 AreaMeasure=FMapLib.AreaMeasrue=function(areafeature){	
						var me=this;
						var _areamath;
						var geometry = areafeature.geometry;
						var measureParam = new MapLib.REST.MeasureParameters(
								geometry), /*
											 * MeasureParameters：量算参数类。
											 * 客户端要量算的地物间的距离或某个区域的面积
											 */
						myMeasuerService = new MapLib.REST.MeasureService(FMapLib.DemoURL.fangchan); // 量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
						myMeasuerService.events.on({
							"processCompleted" :_areaMeasureCompleted
							
						});

						// 对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
						myMeasuerService.measureMode = MapLib.REST.MeasureMode.AREA;
						myMeasuerService.processAsync(measureParam); // processAsync负责将客户端的量算参数传递到服务端。
						// 量算结束调用事件
						function _areaMeasureCompleted(measureEventArgs) {							 
							var area = measureEventArgs.result.area, unit = measureEventArgs.result.unit;
							var areafloat = parseFloat(area);
							_areamath = changeTwoDecimal(areafloat);
							AreaQueryByName.prototype.areaNum=_areamath;
							 QueryBuildingNum(areafeature);				
								
							}
							
						}
						

			
				// 叠加分析小区内房屋数量
				var QueryBuildingNum=FMapLib.QueryBuilidngNum=function(feature){
					// alert("num!");
					var me=this;
					var _buildingnum;
					var queryParam, queryByGeometryParameters, queryService;
			        queryParam = new MapLib.REST.FilterParameter({name: "ST_RIDRGN@ORCL"});
			        queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
			                queryParams: [queryParam], 
			                geometry: feature.geometry,
			                spatialQueryMode: MapLib.REST.SpatialQueryMode.INTERSECT
			        });
			        queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan, {
			            eventListeners: {
			                "processCompleted": _queryProcessCompleted,
			                "processFailed": processFailed
			                            }
			        });
			        queryService.processAsync(queryByGeometryParameters);

			        function _queryProcessCompleted(queryEventArgs){
						   _buildingnum = queryEventArgs.result.recordsets[0].features.length;	
						   AreaQueryByName.prototype.buildingCount=_buildingnum;
						   GetGreenRate(feature);
					}
					
				}
				// 计算小区绿化率
				var GetGreenRate = FMapLib.GetGreenRatefunction = function(feature){
					var queryParam, queryByGeometryParameters, queryService;
			        queryParam = new MapLib.REST.FilterParameter({name: "huapu@ORCL"});
			        queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
			                queryParams: [queryParam], 
			                geometry: feature.geometry,
			                spatialQueryMode: MapLib.REST.SpatialQueryMode.INTERSECT
			        });
			        queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan, {
			            eventListeners: {
			                "processCompleted": _greenRateProcessCompleted,
			                "processFailed": processFailed
			                            }
			        });
			        queryService.processAsync(queryByGeometryParameters);

					function _greenRateProcessCompleted(getFeaturesEventArgs){
						var i, len, features, result = getFeaturesEventArgs.result;
						
						var greenrate;
						var greenarea=0.0;
						if (result && result.recordsets) {
							for (i = 0; i < result.recordsets.length; i++) {
								if (result.recordsets[i].features) {
									for (j = 0; j < result.recordsets[i].features.length; j++) {								
										greenarea += parseFloat(result.recordsets[i].features[j].attributes["SMAREA"]);
									}
								
									AreaQueryByName.prototype.greenarea=toDecimal(greenarea);
									AreaQueryByName.prototype.greenrate=toDecimal(greenarea/AreaQueryByName.prototype.areaNum)*100;									
									// 渲染marker
									AreaQueryByName.prototype._makeMarker(feature);		                       
								}
							}
						}

						
					}
					
				}
		
				// 保留两位小数
			    function toDecimal(x) {             
			    	var f = parseFloat(x);            
			    	if (isNaN(f)) {                 
			    		return;             
			    		}              
			    	f = Math.round(x*100)/100;           
			    	return f;        
			    	} 
			    /*
				 * 在线编辑点标注API @author luojiaming 20140523 @param
				 */
				    var PointForEditOnline =
				    
				FMapLib.PointForEditOnline = function() {
				    	  // 先清除上次的显示结果
				    	map.clearAllFeatures(); 	    	
						
				    	
		       }
				    
				 
					// 弹出信息框，输入点标记信息
				    pointMarkerAlert = function(prefeature){

				    	if(preFeature!=undefined&&preFeature.popup!=null&&preFeature.popup!=undefined){
							map.removePopup(preFeature.popup);
					    	}
						var contentHTML = "<style>"
                                + ".td12{text-align:right;padding-right:12px;background-color:#E1F1FE;color:#2a51a4;}"
                                + ".td13{padding-left:12px;background-color:#F1F8FF;color:#4D4D4D;}" 
                                + "</style>"
							    + "<div style='font-size:.8em; opacity: 0.8; width:220px; height:150px;'>"
								+ "<span style='font-weight: bold; font-size: 18px;'>添加标记</span><br>"
								+ "<div>" 
								+ "<table width='100%' border='0' cellpadding='0' cellspacing='1' bgcolor='#dee2e3' style='line-height:30px;'>"
								+ "<tr>"
								+ "<td class='td12'>X坐标</td>"
								+ "<td class='td13'>"+(this.feature == undefined?(this.point == undefined?prefeature.x:this.point.x):this.feature.attributes['SMX'])+"</td>"
								+ "</tr>"
								+ "<tr>"
								+ "<td class='td12'>Y坐标</td>"
								+ "<td class='td13'>"+(this.feature == undefined?(this.point == undefined?prefeature.y:this.point.y):this.feature.attributes['SMY'])+"</td>"
								+ "</tr>"
								+ "<tr>"	
								+ "<td class='td12'>地址</td>"
								+ "<td class='td13'><input id='addressinfo' value = '"+(this.feature == undefined?'':this.feature.attributes['ADDRESS'])+"' style:'width:400px; height:400px' type='text'/>"
								+ "</tr>"
								+ "</table>"
								+ "<p align='right'>"
								+ "<input type='button'  id='forsave' value='保存'>&nbsp&nbsp" 
								+ "<input type='button'  id='fordelete' value='删除'>" 	
								+ "</p>"
								+"</div>";
						if(this.flag!="1"){
							if (drawPoint) {
								drawPoint.deactivate();
							}
							if(this.point == undefined){
								
						popup = new MapLib.Popup.FramedCloud("chicken", new MapLib.LonLat(
								prefeature.x, prefeature.y), null, contentHTML, null, true);
						prefeature.popup = popup;
						popup.panMapIfOutOfView = true;
						map.addPopup(popup);
						preFeature = prefeature;	
							}
							else{
								var point =this.point;
								popup = new MapLib.Popup.FramedCloud("chicken", new MapLib.LonLat(
										point.x, point.y), null, contentHTML, null, true);
								point.popup = popup;
								popup.panMapIfOutOfView = true;
								map.addPopup(popup);
								preFeature = point;	
							}
						$("#forsave").bind("click",function() {						
							var address = $("#addressinfo").val();
							addFeatureToMap(preFeature,address);// 可以执行了
						});
						$("#fordelete").bind("click",function(){
							map.clearAllFeatures();
							
						});
						}
						else{
							if (drawPoint) {
								drawPoint.deactivate();
							}	
								var querymarkerlonlat = this;								
								var querymarkerX = querymarkerlonlat.getLonLat().lon;// X坐标
								var querymarkerY = querymarkerlonlat.getLonLat().lat;// Y坐标
                                
								popup = new MapLib.Popup.FramedCloud("chicken", new MapLib.LonLat(
										querymarkerX, querymarkerY), null, contentHTML, null, true);
								querymarkerlonlat.popup = popup;
								popup.panMapIfOutOfView = true;							
								map.addPopup(popup);
								preFeature=querymarkerlonlat;
								var existFeature = querymarkerlonlat.feature;
								$("#forsave").bind("click",function() {									
									var address = $("#addressinfo").val();
									editFeature(existFeature,address);// 可以执行了
								});
								$("#fordelete").bind("click",function(){
									deleteSelectedFeature(existFeature);
									
								});
								
						}
					}
				    // 画点完成后执行的操作
				    function addFeatureCompleted(drawGeometryArgs) {
				    	drawPoint.deactivate();	
				    	// 画点完成后执行的操作，添加marker
						var point = drawGeometryArgs.feature.geometry;
						var size = new MapLib.Size(22, 22), offset = new MapLib.Pixel(
								-(size.w / 2), -size.h/3*2), icon = new MapLib.Icon(baseurl
								+ "theme/images/poi_xjfw.png", size, offset);
						var pmarker = new MapLib.Marker(new MapLib.LonLat(point.x, point.y),
								icon);
						markerLayer.addMarker(pmarker);
						 pmarker.point = point;
						// 弹出信息窗口
						pointMarkerAlert(point);
						 pmarker.events.on({
								"click" : pointMarkerAlert,
								"scope" : pmarker
							});
				    }
					// 执行添加地物
				    function addFeatureToMap(point,address){					
				        var geometry = point,
				            feature = new MapLib.Feature.Vector();
				        feature.geometry = geometry,
				            feature.style = style;
				        vectorLayer.addFeatures(feature);

				        geometry.id = "100000";
				        var editFeatureParameter, 
				            editFeatureService,
				            features = {
				                fieldNames:["ADDRESS"],
				                fieldValues:[address],
				                geometry:geometry
				            };
				        editFeatureParameter = new MapLib.REST.EditFeaturesParameters({
				            features: [features],
				                             editType: MapLib.REST.EditType.ADD,
				                             returnContent:false
				        });
				        editFeatureService = new MapLib.REST.EditFeaturesService(FMapLib.DemoURL.fangchan1_New_House_P, {
				            eventListeners: {
				                                "processCompleted": addFeaturesProcessCompleted,
				                           "processFailed": processFailed
				                            }
				        });
				        editFeatureService.processAsync(editFeatureParameter);
				    }
				    // 添加地物成功
				    function addFeaturesProcessCompleted(editFeaturesEventArgs) {
				        var ids = editFeaturesEventArgs.result.IDs,
				            resourceInfo = editFeaturesEventArgs.result.resourceInfo;
				        if(ids === null && resourceInfo === null) return;

				        if((ids && ids.length > 0) || (resourceInfo && resourceInfo.succeed)) {
				            doMapAlert("","新增地物成功");
				            vectorLayer.removeAllFeatures();
				            // 重新加载图层
				            map.removeLayer(layer,true);
				            layer = new MapLib.Layer.TiledDynamicRESTLayer("1405131040",FMapLib.DemoURL.fangchanlc, {transparent: true, cacheEnabled: false}, {maxResolution:"auto"}); 
				            layer.events.on({"layerInitialized":reloadLayer});
				            map.clearAllFeatures();	
				            PointForEditOnline.prototype._showBuildingMarker();
				        }else {
				            doMapAlert("","新增地物失败",true);
				        }
				    }
				    function reloadLayer(layer) {
				        map.addLayer(layer);
				      // map.setCenter(new MapLib.LonLat(48892.64, 51001.71));
				    }
				    
			 FMapLib.extend(PointForEditOnline.prototype,{    
	        // 查询房屋标注
				 _showBuildingMarker:function(){
					var queryParam, queryBySQLParams, queryBySQLService;
					queryParam = new MapLib.REST.FilterParameter({
						name : "New_House_P@ORCL",
						// attributeFilter: "ADDRESS like '%名%士%豪%庭%1%号%'"
						attributeFilter : "SMID > 0"

					});
					queryBySQLParams = new MapLib.REST.QueryBySQLParameters({
						queryParams : [ queryParam ]
					});

					queryBySQLService = new MapLib.REST.QueryBySQLService(
							FMapLib.DemoURL.fangchanlc, {
								eventListeners : {
									"processCompleted" : pointQueryCompleted,
									"processFailed" : processFailed
								}
							});
					queryBySQLService.processAsync(queryBySQLParams);
				
					function pointQueryCompleted(getFeaturesEventArgs){	
						  var i, j, feature,features,result = getFeaturesEventArgs.result;						  
						  if (result && result.recordsets) {
								for (i = 0; i < result.recordsets.length; i++) {
									if (result.recordsets[i].features) {
										for (j = 0; j < result.recordsets[i].features.length; j++) {
											feature = result.recordsets[i].features[j];

											  var pointx = parseFloat(feature.attributes["SMX"]),
					                            pointy = parseFloat(feature.attributes["SMY"]),	                
					                            size = new MapLib.Size(22,22),
					                                 offset = new MapLib.Pixel(-(size.w/2), -size.h/3*2),
					                                 icon = new MapLib.Icon(baseurl + "theme/images/poi_xjfw.png", size, offset);
					                        var pointmarker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy), icon);
					                        pointmarker.information = feature;
					                        pointmarker.feature = feature;
					                        pointmarker.flag = "1";
					                        markerLayer.addMarker(pointmarker);
					                        pointmarker.events.on({
												"click" : pointMarkerAlert,
												"scope" : pointmarker
											});
					                        pointmarker.events.on({
											"mouseover" : changeIconpoint,
											"scope" : pointmarker
										});
				                        pointmarker.events.on({
											"mouseout" : returnIconpoint,
											"scope" : pointmarker
										});
				                    
										}
									}
								}
							}

					}
					
				},
				// 激活添加地物
				_activateAddFeature : function() {
			    	if (drawPolygon) {
						drawPolygon.deactivate();
					}
					if (drawLine) {
						drawLine.deactivate();
					}
			    	drawPoint = new MapLib.Control.DrawFeature(vectorLayer,
							MapLib.Handler.Point);
					map.addControl(drawPoint);
					drawPoint.activate();
					drawPoint.events.on({
						"featureadded" : addFeatureCompleted || {}
					});
			    }
				    });
			 // 鼠标移到marker上时变成小手
			 function changeIconpoint(){
			// 定义鼠标样式为图片，为了适应各种浏览器，图片采用32*32的cur格式的文件
				document.getElementById("map").style.cursor="pointer";
			 }
			 // 鼠标移开marker时变回原样
			 function returnIconpoint(){
				 document.getElementById("map").style.cursor="default";
			 }
				 // 执行地物编辑修改
			    function editFeature(feature,address) {
			       // modifyFeature.deactivate();
			        var editFeatureParameter, 
			            editFeatureService,
			            features,
			            attributes;
	
			        attributes = feature.attributes;
			        var attrNames = [];
			        var attrValues = [];
			        for(var attr in attributes) {			        	
			            attrNames.push(attr);
			            attrValues.push(attributes[attr]);
			        }
			        attrValues[4]=address;			        
			        features = {
			            fieldNames:attrNames,
			            fieldValues:attrValues,
			            geometry:feature.geometry
			        };
			        features.geometry.id = feature.fid;
			        editFeatureParameter = new MapLib.REST.EditFeaturesParameters({
			            features: [features],
			                             editType: MapLib.REST.EditType.UPDATE
			        });
			        editFeatureService = new MapLib.REST.EditFeaturesService(FMapLib.DemoURL.fangchan1_New_House_P, {
			            eventListeners: {
			                           "processCompleted": updateFeaturesProcessCompleted,
			                           "processFailed": processFailed
			                            }
			        });
			        editFeatureService.processAsync(editFeatureParameter);
			    }
			    // 更新地物完成
			    function updateFeaturesProcessCompleted(editFeaturesEventArgs) {
			        if(editFeaturesEventArgs.result.resourceInfo.succeed) {
			            alert("更新地物成功");
			            // 重新加载图层
			            map.clearAllFeatures();	
			            map.removeLayer(layer,true);
			            layer = new MapLib.Layer.TiledDynamicRESTLayer("1405131040",FMapLib.DemoURL.fangchanlc, {transparent: true, cacheEnabled: false}, {maxResolution:"auto"}); 
			            layer.events.on({"layerInitialized":reloadLayer});
			            PointForEditOnline.prototype._showBuildingMarker();
			        }
			        else {
			            alert("更新地物失败");
			        }
			    }
			    // 删除选中地物
			    function deleteSelectedFeature(feature) {
			    	 map.clearAllFeatures();			    	 
			    	  var ids = new Array();			    	
			    	  ids[0] = feature.attributes["SMID"];
			        var editFeatureParameter, 
			            editFeatureService;
			        editFeatureParameter = new MapLib.REST.EditFeaturesParameters({
			            IDs: ids,
			                             editType: MapLib.REST.EditType.DELETE
			        });
			        editFeatureService = new MapLib.REST.EditFeaturesService(FMapLib.DemoURL.fangchan1_New_House_P, {
			            eventListeners: {
			                                "processCompleted": deleteFeaturesProcessCompleted,
			                           "processFailed": processFailed
			                            }
			        });
			        editFeatureService.processAsync(editFeatureParameter);
			    }
			  // 删除地物完成
			    function deleteFeaturesProcessCompleted(editFeaturesEventArgs) {
			        if(editFeaturesEventArgs.result.resourceInfo.succeed) {
			            alert("删除地物成功");
			            // 重新加载图层
			            vectorLayer.removeAllFeatures();
			            map.removeLayer(layer,true);
			            layer = new MapLib.Layer.TiledDynamicRESTLayer("1405131040",FMapLib.DemoURL.fangchanlc, {transparent: true, cacheEnabled: false}, {maxResolution:"auto"}); 
			            layer.events.on({"layerInitialized":reloadLayer}); 
			            PointForEditOnline.prototype._showBuildingMarker();
			        }
			        else {
			            alert("删除地物失败");
			        }
			    }  

/**
 * 根据对象的几何属性进行客户端图形绘制，制作专题图 buildtype 专题图类型 value 对象专题等级 geo 对象几何属性 attr 对象属性
 */
function drawFeatureByType(buildtype,value,geo,attr){
	var style1, style2, style3, style4, style5, style6, style7,linewidth=0.5,opacity=0.9;
	style1 = 	{
            strokeColor: "#AFD8F8",
            strokeWidth: linewidth,
            pointerEvents: "visiblePainted",
            fillColor: "#AFD8F8",
            fillOpacity: opacity,
            pointRadius: 6,
            label: "",
            fontSize: 14,
            fontWeight: "normal",
            cursor: "pointer"
        };
	style2 = 	{
            strokeColor: "#F6BD0F",
            strokeWidth: linewidth,
            pointerEvents: "visiblePainted",
            fillColor: "#F6BD0F",
            fillOpacity: opacity,
            pointRadius: 6,
            label: "",
            fontSize: 14,
            fontWeight: "normal",
            cursor: "pointer"
        };
	style3 = 	{
            strokeColor: "#8BBA00",
            strokeWidth: linewidth,
            pointerEvents: "visiblePainted",
            fillColor: "#8BBA00",
            fillOpacity: opacity,
            pointRadius: 6,
            label: "",
            fontSize: 14,
            fontWeight: "normal",
            cursor: "pointer"
        };
	style4 = 	{
            strokeColor: "#FF8E46",
            strokeWidth: linewidth,
            pointerEvents: "visiblePainted",
            fillColor: "#FF8E46",
            fillOpacity: opacity,
            pointRadius: 6,
            label: "",
            fontSize: 14,
            fontWeight: "normal",
            cursor: "pointer"
        };
	style5 = 	{
            strokeColor: "#008E8E",
            strokeWidth: linewidth,
            pointerEvents: "visiblePainted",
            fillColor: "#008E8E",
            fillOpacity: opacity,
            pointRadius: 6,
            label: "",
            fontSize: 14,
            fontWeight: "normal",
            cursor: "pointer"
        };
	style6 = 	{
            strokeColor: "#D64646",
            strokeWidth: linewidth,
            pointerEvents: "visiblePainted",
            fillColor: "#D64646",
            fillOpacity: opacity,
            pointRadius: 6,
            label: "",
            fontSize: 14,
            fontWeight: "normal",
            cursor: "pointer"
        };
	style7 = 	{
            strokeColor: "#00EF0E",
            strokeWidth: linewidth,
            pointerEvents: "visiblePainted",
            fillColor: "#00EF0E",
            fillOpacity: opacity,
            pointRadius: 6,
            label: "",
            fontSize: 14,
            fontWeight: "normal",
            cursor: "pointer"
        };

	// 根据total_area\built_date\building_struct 和相对应的分段范围确定style
	var style = getStyle(buildtype,value);
	// 客户端绘制图形
	var feature = new MapLib.Feature.Vector();
    feature.geometry = geo;
    feature.data = attr;
    feature.data.v='v';// 赋值。证明该feature是有效feature，可以出发选中事件
	feature.style = eval('style'+style);
    vectorLayer.addFeatures(feature);
}
/**
 * 返回样式
 */
function getStyle(buildtype,value){
	var val=1;
	if(buildtype == 'buildarea'){
    	if(value>0 && value < 100){
    		val=1;
    	}else if(value>=100 && value<1000){
    		val=2;
    	}else if(value>=1000 && value<10000){
    		val=3;
    	}else if(value>=10000 && value<100000){
    		val=4;
    	}else if(value>=100000 && value<200000){
    		val=5;
    	}else if(value>=200000){
    		val=6;
    	}
    }
    if(buildtype == 'builddata'){
    	value=value.substr(0,4);
    	if(value<=1949){
    		val=1;
    	}else if(value>1949 && value<=1989){
    		val=2;
    	}else if(value>1989 && value<=2009){
    		val=3;
    	}else if(value>2009){
    		val=4;
    	}
    }
    if(buildtype == 'buildstructure'){
    	if(value=='钢'){
    		val=1;
    	}else if(value=="钢混"){
    		val=2;
    	}else if(value=="砼"){
    		val=3;
    	}else if(value=="混"){
    		val=4;
    	}else if(value=="砖"){
    		val=5;
    	}else if(value=="砖木"){
    		val=6;
    	}else if(value=="其"){
    		val=7;
    	}
    }
    return val;
}
/**
 * 弹出框信息
 */
function openWindow(feature) {
	if(feature.data.v != 'v')// 判断参数是否为绘制的房屋面。因为框选功能绘制的线也会触发次事件
		return;
            
	if(ThemeByExtent.prototype.parmas == 'buildarea'){
		popup = new MapLib.Popup.FramedCloud("chicken",
	                    feature.geometry.getBounds().getCenterLonLat(),
	                    null,
	                    "坐&emsp;&emsp;落："+feature.data.ADDRESS
						+"<br/>"+"建筑面积："+feature.data.TOTAL_AREA,
	                    null, true);
	}
	if(ThemeByExtent.prototype.parmas == 'builddata'){
		popup = new MapLib.Popup.FramedCloud("chicken",
	                    feature.geometry.getBounds().getCenterLonLat(),
	                    null,
	                    "坐&emsp;&emsp;落："+feature.data.ADDRESS
						+"<br/>"+"建成时间："+feature.data.BUILDDATE.substr(0,10),
	                    null, true);
	}
	if(ThemeByExtent.prototype.parmas == 'buildstructure'){
		popup = new MapLib.Popup.FramedCloud("chicken",
	                    feature.geometry.getBounds().getCenterLonLat(),
	                    null,
	                    "坐&emsp;&emsp;落："+feature.data.ADDRESS
						+"<br/>"+"房屋结构："+feature.data.BUILDING_STRUCT,
				        null, true);
	}
            
    feature.popup = popup;
    popup.panMapIfOutOfView = true;
    map.addPopup(popup);
}
/**
 * 取消选中时操作。移除弹出信息框
 */
function unfeatueSelect(feature) {
	if(feature.popup){
		map.removePopup(feature.popup);
		
	}
   // feature.popup.destroy();
   // feature.popup = null;           
}
/**
 * 范围专题图 传入专题图类型，按照类型组装ThemeRangeItem 调用TemeRangeService方法
 */
var BuildingRangeTheme = 
FMapLib.BuildingRangeTheme = function(prames,isClear) {	
	if(isClear){
	}else{
		removeTheme();// 清空专题图图层
	}
	
	loading();
	 if(map)
		map.allOverlays = true;// 所有图层叠加可见
	 var style1, style2, style3, style4, style5, style6, style7,linewidth=0.5;
	 style1 = new MapLib.REST.ServerStyle({
			fillForeColor : new MapLib.REST.ServerColor(175,216,248),
			lineColor : new MapLib.REST.ServerColor(175,216,248),
			// fillOpaqueRate : 5,
			lineWidth : linewidth
	});

	style2 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(246,189,15),
		lineColor : new MapLib.REST.ServerColor(246,189,15),
		// fillOpaqueRate : 30,
		lineWidth : linewidth
	});

	style3 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(139,186,0),
		lineColor : new MapLib.REST.ServerColor(139,186,0),
		// fillOpaqueRate : 30,
		lineWidth : linewidth
	});

	style4 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(255,142,70),
		lineColor : new MapLib.REST.ServerColor(255,142,70),
		// fillOpaqueRate : 30,
		lineWidth : linewidth
	});

	style5 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(0,142,142),
		lineColor : new MapLib.REST.ServerColor(0,142,142),
		// fillOpaqueRate : 30,
		lineWidth : linewidth
	});

	style6 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(214,70,70),
		lineColor : new MapLib.REST.ServerColor(214,70,70),
		lineWidth : linewidth
	});

	style7 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(0,239,14),
		lineColor : new MapLib.REST.ServerColor(0,239,14),
		lineWidth : linewidth
	});

	var styleArr = [style1, style2, style3, style4, style5, style6, style7];
	
	 if("builddata"==prames){
		 FMapLib.TemeRangeService("BUILDDATE_THEME","ST_RIDRGN_THEME","ORCL",themeRangeItem(prames,styleArr));
	 }
	 if("buildtype"==prames){
		 FMapLib.TemeRangeService("FLOORNUM","ST_RIDRGN_THEME","ORCL",themeRangeItem(prames,styleArr));
	 }
	 if("buildarea"==prames){
		 FMapLib.TemeRangeService("TOTAL_AREA","ST_RIDRGN_THEME","ORCL",themeRangeItem(prames,styleArr));// SMAREA
																											// TOTAL_AREA
	 }
}
/**
 * 根据类型返回themeRangeItem
 */
function themeRangeItem(prames,styleArr){
	var themeRangeItemArray;
	if("buildarea"==prames){
		var themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
			start : 0,
			end : 100,
			style : styleArr[0]
		}), themeRangeIteme2 = new MapLib.REST.ThemeRangeItem({
			start : 100,
			end : 1000,
			style : styleArr[1]
		}), themeRangeIteme3 = new MapLib.REST.ThemeRangeItem({
			start : 1000,
			end : 10000,
			style : styleArr[2]
		}), themeRangeIteme4 = new MapLib.REST.ThemeRangeItem({
			start : 10000,
			end : 100000,
			style : styleArr[3]
		}), themeRangeIteme5 = new MapLib.REST.ThemeRangeItem({
			start : 100000,
			end : 200000,
			style : styleArr[4]
		}),themeRangeIteme6 = new MapLib.REST.ThemeRangeItem({
			start : 200000,
			end : 20000000,
			style : styleArr[5]
		});
		themeRangeItemArray=[themeRangeIteme1, themeRangeIteme2, themeRangeIteme3,
		     					themeRangeIteme4, themeRangeIteme5,themeRangeIteme6];
	 }
	 if("builddata"==prames){
		 var themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
				start : 0,
				end : 1950,
				style : styleArr[0]
			}), themeRangeIteme2 = new MapLib.REST.ThemeRangeItem({
				start : 1950,
				end : 1990,
				style : styleArr[1]
			}), themeRangeIteme3 = new MapLib.REST.ThemeRangeItem({
				start : 1990,
				end : 2010,
				style : styleArr[2]
			}), themeRangeIteme4 = new MapLib.REST.ThemeRangeItem({
				start : 2010,
				end : 2029,
				style : styleArr[3]
			});
		 themeRangeItemArray=[themeRangeIteme1, themeRangeIteme2, themeRangeIteme3,
			     					themeRangeIteme4];
	 }
	 if("buildtype"==prames){
		 var themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
				start : 0,
				end : 2,
				style : styleArr[0]
			}), themeRangeIteme2 = new MapLib.REST.ThemeRangeItem({
				start : 2,
				end : 8,
				style : styleArr[1]
			}), themeRangeIteme3 = new MapLib.REST.ThemeRangeItem({
				start : 8,
				end : 13,
				style : styleArr[2]
			}), themeRangeIteme4 = new MapLib.REST.ThemeRangeItem({
				start : 13,
				end : 2000,
				style : styleArr[3]
			});
		 themeRangeItemArray=[themeRangeIteme1, themeRangeIteme2, themeRangeIteme3,
			     					themeRangeIteme4];
	 }
	return themeRangeItemArray;
}
/**
 * 根据asdr数据集，分区统计数量和面积
 */
var CountyAreaAndCount = FMapLib.CountyAreaAndCount = function() {
	removeTheme();
	$.ajax({ 
        type : "post", 
        url : "realtygis.getCountyLZCountAndArea", 
        data : "" , 
        async : false, 
        success : function(data){ 
    		var jdata = jQuery.parseJSON(data);
    		// 生成图例
    		// 专题图图例
			var doc=document.getElementById("themelegend");
			if(doc!=null){
			$("#themelegend").remove();
			}
    		var color = new Array('#AFD8F8', '#F6BD0F', '#8BBA00', '#FF8E46', '#008E8E','#D64646');
    		var themehtml=
    			"<div><table id='timetable' border='0' cellspacing='6' cellpadding='0'>"+
    			// "<tr><td width='15' height='7' bgcolor='"+color[0]+"'></td>"+
    			// "<td width='100' height='7'><a>建筑面积</a></td><tr>"+
    			"<tr><td width='15px'  height='7px' bgcolor='"+color[1]+"'></td>"+
    			"<td width='100px' height='7px'><a>建筑数量</a></td><tr>"+
    			"</tr></table></div>";
    		map.initLegendDiv();// 初始化地图图例图层
    		map.flashLegend(themehtml);// 自定义图例内容
    		if(jdata){
				var len = jdata.root.length;
				for (i = 0; i < 1; i++) {
					var code = jdata.root[i].code;
					var name = jdata.root[i].name;
					var count = jdata.root[i].count;
					var area = jdata.root[i].area;
					var point;
					if(code =="370102"){// 历下区
						 point = new MapLib.Geometry.Point(60160.13, 44719.15);
					}
					if(code =="370112"){// 历城区
						 point = new MapLib.Geometry.Point(74004.32, 43217.69);
					}
					if(code =="370103"){// 市中区
						 point = new MapLib.Geometry.Point(43655.73, 38571.01);
					}
					if(code =="370104"){// 槐荫区
						point = new MapLib.Geometry.Point(35283.01, 50639.77);
					}
				   if(code =="370105"){// 天桥区
						point = new MapLib.Geometry.Point(43705.11, 63787.93);
					}
				   if(code =="370124"){// 平阴县
						point=new MapLib.Geometry.Point(-7797.47,0);
					 }
				   if(code =="370113"){// 长清区
						point=new MapLib.Geometry.Point(29860.91,20855.56);
					 }
				   if(code == "370125"){// 济阳县
					   point= new MapLib.Geometry.Point(57160.13,86635.06);
				   }
				   if(code == "370181"){// 章丘市
					   point = new MapLib.Geometry.Point(95930.82,55415.21);
				   }
				   if(code == "370126"){// 商河县
					  point = new MapLib.Geometry.Point(66443,124437);
				   }
				  
					// 专题图生成xml语句
					var xmlstringstart = "<graph caption='"+name+"' showNames='0' decimalPrecision='0' " +
					"formatNumberScale='0' showCanvasBg='0' showCanvasBase='0' showValues='0' showLimits='0' " +
					"chartLeftMargin='0' chartRightmargin='0' showDivLineValue='0' numdivlines='0'" +
					"canvasBorderThickness='0' canvasBorderAlpha='0' canvasBorderColor='FFFFFF' formatNumber='0' decimalPrecision='0'" +
					"  bgColor='FFFFFF'  baseFontSize='10' showBorder='0' borderColor='#FF0000'" +
					" showVLineLabelBorder='0'  canvasBgAlpha='0' bgAlpha='0' outCnvBaseFont='宋体'  outCnvBaseFontSize='12'>";
					
					var xmlstring = 
							"<set name='建筑数量' value='"
							+ count+ "' color='"
							+ color[1] + "' toolText='"+count+"'/>";
						  xmlstringstart += xmlstring;
						var size = new MapLib.Size(30, 25); 
						var offset = new MapLib.Pixel(-(size.w / 2), -size.h);
						var anchor = new MapLib.Icon(null, size, offset);
					var contentHTML="<div id='"+name+"' style='opacity: 0.8; width: 50px; height: 130px; border-style:solid; bgColor:#FFFFFF; borderAlpha:0; font-size:12px;'><div>"
					popup = new MapLib.Popup.Anchored("theme",
							new MapLib.LonLat(point.x,point.y),
							new MapLib.Size(50,150),
							contentHTML,
							null,
							false,null);
					map.addPopup(popup);
					popupArray[i]=popup;
					xmlstringstart += "</graph>";
					var piechart = new FusionCharts("/gis/FMapLib/theme/images/Column2D.swf","regionChartPieId", "50", "150", "0", "1");
					piechart.setDataXML(xmlstringstart);
					piechart.setTransparent(true);
					piechart.render(name);
					
				}
				
    		}
		
        } 
    });
		  
}

/**
 * 业务分布专题图 按照年月日制作专题图。年月日格式xxxx|mm|dd组成的数字形式，必须是8为数字
 */
var BusinessDistributeQueryBySQLService = 
	FMapLib.BusinessDistributeQueryBySQLService = function(param1,param2){
	var startdate = parseInt(param1);
	var enddate = parseInt(param2);
	removeTheme();// 清空专题图图层
	loading();
	vectorLayer.removeAllFeatures();// 清除上次的渲染
	var queryParam = new MapLib.REST.FilterParameter({ 
		name: "ST_RIDRGN_THEME@ORCL", 
		attributeFilter: "DULEDATE > "+startdate+" AND DULEDATE <= "+enddate 
	}); 

	var queryBySQLParams = new MapLib.REST.QueryBySQLParameters({ 
		queryParams: [queryParam] 
	}); 
	var myQueryBySQLService = new MapLib.REST.QueryBySQLService(FMapLib.DemoURL.fangchan, {eventListeners: { 
		"processCompleted": queryBusinessDistributeCompleted, 
		"processFailed": processFailed 
		} 
	}); 
	myQueryBySQLService.processAsync(queryBySQLParams); 
	
	// 生成图例
	// 专题图图例
	var doc=document.getElementById("themelegend");
	if(doc!=null){
	$("#themelegend").remove();
	}
	var color = new Array('#AFD8F8', '#F6BD0F', '#8BBA00', '#FF8E46', '#008E8E','#D64646');
	var themehtml=
		"<div><table id='timetable' border='0' cellspacing='6' cellpadding='0'>"+
		"<tr><td width='15px'  height='7px' bgcolor='"+color[5]+"'></td>"+
		"<td width='100px' height='7px'><a>已测绘房屋</a></td><tr>"+
		"</tr></table></div>";
	map.initLegendDiv();// 初始化地图图例图层
	map.flashLegend(themehtml);// 自定义图例内容

}
function queryBusinessDistributeCompleted(QueryEventArgs){
	if(!QueryEventArgs.originResult.hasOwnProperty("recordsets")){
	return;
	}
	var recordsets = QueryEventArgs.originResult.recordsets;
	for(var i=0;i<recordsets.length;i++){
		var features = recordsets[i].features;
		for(var k=0;k<features.length;k++){
			var geo = features[k].geometry;
			// 调用渲染方法
			drawFeatureByGeo(geo);
		}
	}
	removeLoading();
}
/**
 * 根据geometry进行前端渲染
 */
function drawFeatureByGeo(geo){
	var style1, style2, style3, style4, style5, style6, style7,linewidth=1,opacity=1;
	style3 =	{
		            strokeColor: "#D64646",
		            strokeWidth: linewidth,
		            pointerEvents: "visiblePainted",
		            fillColor: "#D64646",
		            fillOpacity: opacity,
		            pointRadius: 6,
		            label: "",
		            fontSize: 14,
		            fontWeight: "normal",
		            cursor: "pointer"
		        };
	// 由于当前获取的geometry对象没有getBounds()方法，多以使用构造Polygon的方法进行渲染。
	var points  = geo.points;
	var pointArr = [];
	for(var i=0;i<points.length;i++){
		pointArr[i]=new MapLib.Geometry.Point(points[i].x,points[i].y);
	}
	
	var linearRings = new MapLib.Geometry.LinearRing(pointArr);
	var region = new MapLib.Geometry.Polygon([linearRings]);
	
	// 客户端绘制图形
	var feature = new MapLib.Feature.Vector();
    feature.geometry = region;
	feature.style = style3;
    vectorLayer.addFeatures(feature);
}

/**
 * 房屋数据来源单值专题图
 * 
 * @Params a "1"代表超图类型数据,"2"代表其他类型数据,否则代表全部数据类型
 */
var BuildingDataComingUniqueTheme =
	FMapLib.BuildingDataComingUniqueTheme = function(a){
	if(map)
		map.allOverlays = true;
	removeTheme();// 清空专题图图层
	loading();// 加载动画
    var style1, style2,style3,datasetNames;
    style1 = new MapLib.REST.ServerStyle({
        fillForeColor: new MapLib.REST.ServerColor(225,208,27),// 248, 203, 249
        lineColor: new MapLib.REST.ServerColor(225,208,27),
        lineWidth: 0.5
    });
    style2 = new MapLib.REST.ServerStyle({
        fillForeColor: new MapLib.REST.ServerColor(24,222,213),// 196, 255, 189
        lineColor: new MapLib.REST.ServerColor(24,222,213),
        lineWidth: 0.5
    });
    style3=new MapLib.REST.ServerStyle({
        fillForeColor: null,// 196, 255, 189
        lineColor: null,
        lineWidth: 0       
    });
    var themeUniqueIteme1 = new MapLib.REST.ThemeUniqueItem({
        unique: "0",
        style: style1
    }),
    themeUniqueIteme2 = new MapLib.REST.ThemeUniqueItem({
        unique: "1",
        style: style2
    });

    var themeService = new MapLib.REST.ThemeService(FMapLib.DemoURL.fangchan, 
    		{eventListeners:{
    			"processCompleted": themeBuildingDataComingUniqueCompleted, 
    			"processFailed": themeBuildingDataComingUniqueFailed
    			}
    });
    
    var themeUniqueItemes=[];
    if(a){
    if(a=="1"){
    	themeUniqueItemes=[themeUniqueIteme1];
    	datasetNames=["ST_RIDRGN_SMTHEME"];
    }
    else if(a=="2"){
    	themeUniqueItemes=[themeUniqueIteme2];
    	datasetNames=["ST_RIDRGN_CZTHEME"];
    }else{
    	themeUniqueItemes=[themeUniqueIteme1, themeUniqueIteme2];
    	datasetNames=["ST_RIDRNG_ALLTHEME"];
    }
    }else{
    	themeUniqueItemes=[themeUniqueIteme1, themeUniqueIteme2];
    	datasetNames=["ST_RIDRNG_ALLTHEME"];
    }
    var themeUnique = new MapLib.REST.ThemeUnique({
        uniqueExpression: "datacoming",
        items: themeUniqueItemes,
        defaultStyle: style3
    });
    var themeParameters = new MapLib.REST.ThemeParameters({
        datasetNames: datasetNames,
        dataSourceNames: ["ORCL"],
	// displayFilters : [ " datacoming in('0','1') "],
        themes: [themeUnique]
    });

    themeService.processAsync(themeParameters);
    
    var color = new Array('E0D01B', '18DED5','000000');
	var themehtml=
		"<div><table id='timetable' border='0' cellspacing='6' cellpadding='0'>"+
		"<tr><td width='15'  height='7' bgcolor='"+color[0]+"'></td>"+
		"<td width='100' height='7'><a>超图楼幢</a></td><tr>"+
		"<tr><td width='15'  height='7' bgcolor='"+color[1]+"'></td>"+
		"<td width='100' height='7'><a>超智楼幢</a></td><tr>"+		
		"</tr></table></div>";
	map.initLegendDiv();// 初始化地图图例图层
	map.flashLegend(themehtml);// 自定义图例内容
}
function themeBuildingDataComingUniqueCompleted(themeEventArgs) {
    if(themeEventArgs.result.resourceInfo.id) {
        themeLayer = new MapLib.Layer.TiledDynamicRESTLayer("数据来源专题图", 
        		FMapLib.DemoURL.fangchan, 
        		{
		        	cacheEnabled:false,
		        	transparent: true,
		        	layersID: themeEventArgs.result.resourceInfo.id
	        	}, 
	        	{"maxResolution": "auto"}
        	);
        themeLayer.events.on({"layerInitialized": addThemeLayer});
    }
    removeLoading();
}
function addThemeLayer() {
    map.addLayer(themeLayer);
}
function themeBuildingDataComingUniqueFailed(serviceFailedEventArgs) {
    alert(serviceFailedEventArgs.error.errorMsg);
    removeLoading();
}
/**
 * 房屋安全等级单值专题图
 * 
 * @author luojiaming 2014-6-12
 * 
 */
var BuildingSafeGradeRange=

FMapLib.BuildingSafeGradeRange=function(map){
// this._removeTheme=removeTheme();
if(map)
	map.clearAllFeatures();
removeTheme();// 清空专题图图层
map.allOverlays = true;
var  style1 = new MapLib.REST.ServerStyle({
	fillForeColor : new MapLib.REST.ServerColor(0, 255, 0),
	lineColor : new MapLib.REST.ServerColor(0, 255, 0),// 绿色
	lineWidth : 1
}), style2 = new MapLib.REST.ServerStyle({
	fillForeColor : new MapLib.REST.ServerColor(0, 0, 255),
	lineColor : new MapLib.REST.ServerColor(0, 0, 255),// 蓝色
	lineWidth : 1
}), style3 = new MapLib.REST.ServerStyle({
	fillForeColor : new MapLib.REST.ServerColor(255, 255, 0),
	lineColor : new MapLib.REST.ServerColor(255, 255, 0),// 黄色
	lineWidth : 1
}), style4 = new MapLib.REST.ServerStyle({
	fillForeColor : new MapLib.REST.ServerColor(250, 0, 0),
	lineColor : new MapLib.REST.ServerColor(250, 0, 0),// 红色
	lineWidth : 1
}),themeUniqueIteme1 = new MapLib.REST.ThemeUniqueItem({
	caption:"A",
	unique:"1",
	style : style1
}),themeUniqueIteme2 = new MapLib.REST.ThemeUniqueItem({
	caption:"B",
	unique:"2",
	style : style2
}),themeUniqueIteme3 = new MapLib.REST.ThemeUniqueItem({
	caption:"C",
	unique:"3",
	style : style3
}),themeUniqueIteme4 = new MapLib.REST.ThemeUniqueItem({
	caption:"D",
	unique:"4",
	style : style4
}),themeUniqueIteme5 = new MapLib.REST.ThemeUniqueItem({
	caption:"空值",
	unique:"-1",
	style :style4,
	visible:false
}),themeUniqueItemArray=[themeUniqueIteme1, themeUniqueIteme2, themeUniqueIteme3,
	     					themeUniqueIteme4,themeUniqueIteme5];
 TemeUniqueService("SAFEGRADE","ST_RIDRGN_SAFECHECK_SIMPLE","ORCL",themeUniqueItemArray);
}
BuildingSafeGradeRange.prototype.removeTheme=function removeTheme(map) {
if (map&&map.layers.length > 3) {
	if (dotLayer) {
		map.removeLayer(dotLayer, true);
		dotLayer = null;
	}
	if (themeLayer) {
		map.removeLayer(themeLayer, true);
		themeLayer = null;
	}
	if (labelLayer) {
		map.removeLayer(labelLayer, true);
		labelLayer = null;
	}
	if (rangeLayer) {
		map.removeLayer(rangeLayer, true);
		rangeLayer = null;
	}
	if (barLayer) {
		map.removeLayer(barLayer, true);
		barLayer = null;
	}
	if (housethemeLayer) {
		map.removeLayer(housethemeLayer);
		housethemeLayer = null;
	}
}
}
/**
 * 区局规划单值专题图
 */
var BuildingSafeQuJuTheme=
	
FMapLib.BuildingSafeQuJuTheme=function(map){	
	if(map)
		map.clearAllFeatures();
	removeTheme();// 清空专题图图层
	map.allOverlays = true;
	var  style0 = new MapLib.REST.ServerStyle({	
		fillForeColor : new MapLib.REST.ServerColor(0, 255, 0),
		lineColor : new MapLib.REST.ServerColor(129,148,170),// 灰色
		lineWidth : 0.1,
		fillOpaqueRate : 0
	}),style1 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(0, 255, 0),
		lineColor : new MapLib.REST.ServerColor(0, 255, 0),// 绿色
		lineWidth : 1
	}),	style2 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(0, 0, 255),
		lineColor : new MapLib.REST.ServerColor(0, 0, 255),// 蓝色
		lineWidth : 1
	}), style3 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(255, 255, 0),
		lineColor : new MapLib.REST.ServerColor(137,213,73),// 草绿色
		lineWidth : 1
	}), style4 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(250, 0, 0),
		lineColor : new MapLib.REST.ServerColor(38,167,223),// 天蓝色
		lineWidth : 1
	}), style5 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(255, 255, 0),
		lineColor : new MapLib.REST.ServerColor(221,82,47),// 橙色
		lineWidth : 1
	}), style6 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(250, 0, 0),
		lineColor : new MapLib.REST.ServerColor(250, 0, 0),// 红色
		lineWidth : 1		
	}),	themeUniqueIteme1 = new MapLib.REST.ThemeUniqueItem({
		caption:"历城",
		unique:"1",
		style : style1
	}),themeUniqueIteme2 = new MapLib.REST.ThemeUniqueItem({
		caption:"历下",
		unique:"2",
		style : style2
	}),themeUniqueIteme3 = new MapLib.REST.ThemeUniqueItem({
		caption:"市中",
		unique:"3",
		style : style3
	}),themeUniqueIteme4 = new MapLib.REST.ThemeUniqueItem({
		caption:"槐荫",
		unique:"4",
		style : style4
	}),themeUniqueIteme5 = new MapLib.REST.ThemeUniqueItem({
		caption:"天桥",
		unique:"5",
		style : style5
	}),themeUniqueIteme6 = new MapLib.REST.ThemeUniqueItem({
		caption:"其他",
		unique:"6",
		style : style6
	}),	themeUniqueIteme7 = new MapLib.REST.ThemeUniqueItem({
		caption:"空值",
		unique:"0",	
		style: style0		
	}),	themeUniqueItemArray=[themeUniqueIteme1, themeUniqueIteme2, themeUniqueIteme3,
		     					themeUniqueIteme4,themeUniqueIteme5,themeUniqueIteme6,themeUniqueIteme7];
	 TemeUniqueService("QUJUGUIHUA_OTHER2","ST_RIDRGN_QJGH","ORCL",themeUniqueItemArray);
  }	
BuildingSafeQuJuTheme.prototype.removeTheme=function removeTheme(map) {
	if (map&&map.layers.length > 3) {
		if (dotLayer) {
			map.removeLayer(dotLayer, true);
			dotLayer = null;
		}
		if (themeLayer) {
			map.removeLayer(themeLayer, true);
			themeLayer = null;
		}
		if (labelLayer) {
			map.removeLayer(labelLayer, true);
			labelLayer = null;
		}
		if (rangeLayer) {
			map.removeLayer(rangeLayer, true);
			rangeLayer = null;
		}
		if (barLayer) {
			map.removeLayer(barLayer, true);
			barLayer = null;
		}
		if (housethemeLayer) {
			map.removeLayer(housethemeLayer);
			housethemeLayer = null;
		}
	}
 }

/**
 * 房屋检查等级单值专题图
 * 
 * @author luojiaming 2014-6-17
 * 
 */
var BuildingCheckGradeUnique=

FMapLib.BuildingCheckGradeUnique=function(map){
	// this._removeTheme=removeTheme();
	if(map)
		map.clearAllFeatures();
	removeTheme();// 清空专题图图层
	map.allOverlays = true;
	var  style1 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(0, 255, 0),
		lineColor : new MapLib.REST.ServerColor(0, 255, 0),// 绿色
		lineWidth : 1
	}), style2 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(0, 0, 255),
		lineColor : new MapLib.REST.ServerColor(0, 0, 255),// 蓝色
		lineWidth : 1
	}), style3 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(255, 255, 0),
		lineColor : new MapLib.REST.ServerColor(255, 255, 0),// 黄色
		lineWidth : 1
	}), style4 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(250, 0, 0),
		lineColor : new MapLib.REST.ServerColor(250, 0, 0),// 红色
		lineWidth : 1
	}),themeUniqueIteme1 = new MapLib.REST.ThemeUniqueItem({
		caption:"无危险点房屋",
		unique:"1",
		style : style1
	}),themeUniqueIteme2 = new MapLib.REST.ThemeUniqueItem({
		caption:"存在危险点房屋",
		unique:"2",
		style : style2
	}),themeUniqueIteme3 = new MapLib.REST.ThemeUniqueItem({
		caption:"局部危险房屋",
		unique:"3",
		style : style3
	}),themeUniqueIteme4 = new MapLib.REST.ThemeUniqueItem({
		caption:"整幢危险房屋",
		unique:"4",
		style : style4
	}),themeUniqueIteme5 = new MapLib.REST.ThemeUniqueItem({
		caption:"空值",
		unique:"-1",
		style :style4,
		visible:false
	}),themeUniqueItemArray=[themeUniqueIteme1, themeUniqueIteme2, themeUniqueIteme3,
		     					themeUniqueIteme4,themeUniqueIteme5];
	 TemeUniqueService("CHECKGRADE","ST_RIDRGN_SAFECHECK2_SIMPLE","ORCL",themeUniqueItemArray);
}
BuildingCheckGradeUnique.prototype.removeTheme=function removeTheme(map) {
	if (map&&map.layers.length > 3) {
		if (dotLayer) {
			map.removeLayer(dotLayer, true);
			dotLayer = null;
		}
		if (themeLayer) {
			map.removeLayer(themeLayer, true);
			themeLayer = null;
		}
		if (labelLayer) {
			map.removeLayer(labelLayer, true);
			labelLayer = null;
		}
		if (rangeLayer) {
			map.removeLayer(rangeLayer, true);
			rangeLayer = null;
		}
		if (barLayer) {
			map.removeLayer(barLayer, true);
			barLayer = null;
		}
		if (housethemeLayer) {
			map.removeLayer(housethemeLayer);
			housethemeLayer = null;
		}
	}
}
/**
 * 房屋鉴定等级单值专题图
 * 
 * @author luojiaming 2014-6-17
 * 
 */
var BuildingTestGradeUnique=

FMapLib.BuildingTestGradeUnique=function(map){
	// this._removeTheme=removeTheme();
	if(map)
		map.clearAllFeatures();
	removeTheme();// 清空专题图图层
	map.allOverlays = true;
	var  style1 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(0, 255, 0),
		lineColor : new MapLib.REST.ServerColor(0, 255, 0),// 绿色
		lineWidth : 1
	}), style2 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(0, 0, 255),
		lineColor : new MapLib.REST.ServerColor(0, 0, 255),// 蓝色
		lineWidth : 1
	}), style3 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(255, 255, 0),
		lineColor : new MapLib.REST.ServerColor(255, 255, 0),// 黄色
		lineWidth : 1
	}), style4 = new MapLib.REST.ServerStyle({
		fillForeColor : new MapLib.REST.ServerColor(250, 0, 0),
		lineColor : new MapLib.REST.ServerColor(250, 0, 0),// 红色
		lineWidth : 1
	}),themeUniqueIteme1 = new MapLib.REST.ThemeUniqueItem({
		caption:"A",
		unique:"1",
		style : style1
	}),themeUniqueIteme2 = new MapLib.REST.ThemeUniqueItem({
		caption:"B",
		unique:"2",
		style : style2
	}),themeUniqueIteme3 = new MapLib.REST.ThemeUniqueItem({
		caption:"C",
		unique:"3",
		style : style3
	}),themeUniqueIteme4 = new MapLib.REST.ThemeUniqueItem({
		caption:"D",
		unique:"4",
		style : style4
	}),themeUniqueIteme5 = new MapLib.REST.ThemeUniqueItem({
		caption:"空值",
		unique:"-1",
		style :style4,
		visible:false
	}),themeUniqueItemArray=[themeUniqueIteme1, themeUniqueIteme2, themeUniqueIteme3,
		     					themeUniqueIteme4,themeUniqueIteme5];
	 TemeUniqueService("TESTGRADE","ST_RIDRGN_SAFECHECK3_SIMPLE","ORCL",themeUniqueItemArray);
}
BuildingTestGradeUnique.prototype.removeTheme=function removeTheme(map) {
	if (map&&map.layers.length > 3) {
		if (dotLayer) {
			map.removeLayer(dotLayer, true);
			dotLayer = null;
		}
		if (themeLayer) {
			map.removeLayer(themeLayer, true);
			themeLayer = null;
		}
		if (labelLayer) {
			map.removeLayer(labelLayer, true);
			labelLayer = null;
		}
		if (rangeLayer) {
			map.removeLayer(rangeLayer, true);
			rangeLayer = null;
		}
		if (barLayer) {
			map.removeLayer(barLayer, true);
			barLayer = null;
		}
		if (housethemeLayer) {
			map.removeLayer(housethemeLayer);
			housethemeLayer = null;
		}
	}
}

/**
 * 加载等待
 */
function loading(){
	var g = document.createElement("div");
	g.id = "loading";
	g.style.position = "absolute";
	// g.style.width = "1%";
	// g.style.height = "10%";
	g.style.top = "45%";
	g.style.right = "55%";
	g.style.zIndex = 1006;
	g.style.background= '#ffffff'; 
	g.style.opacity=1;
	map.viewPortDiv.appendChild(g);
	$("#loading").append(
	    "<div id='over' style='display: none;position: absolute; top: 0; left: 0; width: 100%; height: 100%;  background-color: #f5f5f5; opacity:1; z-index: 1007;'></div>"+
	    "<div id='layout' style=' display: none; position: absolute; top: 40%; left: 40%;  width: 20%; height: 20%; z-index: 1008; text-align:center;'>" +
	    "<img src='/gis/resource/images/load_ring.gif' alt='' /></div>"// bird.gif
																		// load_earth.gif
    );
	document.getElementById("over").style.display = "block";
    document.getElementById("layout").style.display = "block";
}
/**
 * stop loading
 */
function removeLoading(){
	var loading = document.getElementById('loading');
	if(loading != null){
		document.getElementById("over").style.display = "none";
		document.getElementById("layout").style.display = "none";
		loading.parentNode.removeChild(loading);
	}
}
var ClearAllFeatures = FMapLib.ClearAllFeatures = function() {
	markerLayer.clearMarkers();
	markerLayer2.clearMarkers();
	markerLayerall.clearMarkers();
	if (popup) {
		markerLayer.map.removePopup(popup);
		markerLayer2.map.removePopup(popup);
	}
	if (drawPoint) {
		drawPoint.deactivate();

	}
	if (drawLine) {
		drawLine.deactivate();
	}
	if (drawPolygon) {
		drawPolygon.deactivate();
	}
	if(clusterLayer){
		clusterLayer.removeAllFeatures();
		}
	removeTheme();// 清除专题图专用图层
	vectorLayer.removeAllFeatures();
	vectorLayer2.removeAllFeatures();
	if ($('#mapAlert').size()) {
		$('div').remove('#mapAlert');
	}
	if(mapPopup){
		map.removePopup(mapPopup);
	}
    // 清除空间统计弹出框
    if(popupArray&&popupArray.length>0){
    for (i=0;i<popupArray.length;i++) {
		map.removePopup(popupArray[i]);
	}
   }   
}

/**
 * 缓冲分析 radius 查询半径 shape 查询方式 'POINT' 或者 'POLYGON'
 */
var bufferAnalyst = FMapLib.bufferAnalyst=function(radius,shape){
	removeTheme();
	if(shape == 'POINT'){
		drawPoint = new MapLib.Control.DrawFeature(vectorLayer2, MapLib.Handler.Point);
		map.addControl(drawPoint);
		vectorLayer2.style=stylePoint
		drawPoint.events.on({
			"featureadded" : drawPointCompleted,
			"processFailed": function faildError(e){
        		var a = e;
        	}
		});
		drawPoint.activate();
	}else if(shape='POLYGON'){
		drawPolygon = new MapLib.Control.DrawFeature(vectorLayer,MapLib.Handler.Polygon)
		map.addControl(drawPolygon)
		vectorLayer.style={
            strokeColor: "#304DBE",
            strokeWidth: 1,
            // pointerEvents: "visiblePainted",
            fillColor: "#304DBE",
            fillOpacity: 0.2
        };
		drawPolygon.events.on({
			"featureadded" : drawPolygonCompleted,
			"processFailed" : function faildError(e){
        		var a = e;
        	}
		});
		drawPolygon.activate();
	}
	function drawPointCompleted(drawGeometryArgs){
		drawPoint.deactivate();
		// loading();
		// point = drawGeometryArgs.feature.geometry
		bufferAnalystByGeo(drawGeometryArgs.feature.geometry)
	}
	function drawPolygonCompleted(drawGeometryArgs){
		drawPolygon.deactivate();
		bufferAnalystByGeo(drawGeometryArgs.feature.geometry)
	}
	
	function bufferAnalystByGeo(geo){
		if((radius!="")&&(geo!=null)){
			var bufferServiceByGeometry = new MapLib.REST.BufferAnalystService(FMapLib.DemoURL.fangchan_spatialanalyst),
            bufferDistance = new MapLib.REST.BufferDistance({
                value: radius
            }),
            bufferSetting = new MapLib.REST.BufferSetting({
                endType: MapLib.REST.BufferEndType.ROUND,
                leftDistance: bufferDistance,
                rightDistance: bufferDistance,
                semicircleLineSegment: 20
            }),
            geoBufferAnalystParam = new MapLib.REST.GeometryBufferAnalystParameters({
                sourceGeometry: geo,
                bufferSetting: bufferSetting
            });        

	        bufferServiceByGeometry.events.on(
			{
				"processCompleted": bufferAnalystCompleted,
				"processFailed": function faildError(e){
            		var a = e;
            	}
			});
	        bufferServiceByGeometry.processAsync(geoBufferAnalystParam);
            
		}
	}
	function bufferAnalystCompleted(BufferAnalystEventArgs) {
        var feature = new MapLib.Feature.Vector();
        var bufferResultGeometry = BufferAnalystEventArgs.result.resultGeometry;
        feature.geometry = bufferResultGeometry;
        feature.style = {
                strokeColor: "#304DBE",
                strokeWidth: 2,
                pointerEvents: "visiblePainted",
                fillColor: "#304DBE",
                fillOpacity: 0.4
            };
        vectorLayer.addFeatures(feature);
        queryByGeometry(bufferResultGeometry)
     }
    
  // 查询出影响范围内的
    function queryByGeometry(geo){
        var queryParam, queryByGeometryParameters, queryService;
        queryParam = new MapLib.REST.FilterParameter({
			name: "ST_Dangers_P@ORCL",
			attributeFilter: " OBJ_TYPE > 0"
			});
        queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
            queryParams: [queryParam],
            geometry: geo,
            spatialQueryMode: MapLib.REST.SpatialQueryMode.INTERSECT
        });
        queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan);
        queryService.events.on(
                {
                    "processCompleted": queryCompleted,
                    "processFailed": function faildError(e){
                		var a = e;
                	}
                });
        queryService.processAsync(queryByGeometryParameters);
    }
    function queryCompleted(queryEventArgs) {
    	var result,recordsets,f=false,count=0,typeArr=[],typeRemark=[],typeCount=[],imgArr=[]
    	if(!queryEventArgs.result) return;
    	result = queryEventArgs.result;
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
                        size = new MapLib.Size(26,24),
                        offset = new MapLib.Pixel(-(size.w/2), -size.h/2);
    					var img='';
    					if(feature.attributes["OBJ_TYPE"] == '1'){
    						img = baseurl + "theme/images/dangerous/sk.png"
    					}else if(feature.attributes["OBJ_TYPE"] == '2'){
    						img = baseurl + "theme/images/dangerous/st.png"
    					}else if(feature.attributes["OBJ_TYPE"] == '3'){
    						img = baseurl + "theme/images/dangerous/sq.png"
    					}else if(feature.attributes["OBJ_TYPE"] == '4'){
    						img = baseurl + "theme/images/dangerous/gc.png"
    					}else if(feature.attributes["OBJ_TYPE"] == '5'){
    						img = baseurl + "theme/images/dangerous/sg.png"
    					}
    					
    					var icon = new MapLib.Icon(img, size, offset);
    					var marker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy),icon);
    					marker.info = feature;
    					marker.icon = icon
    					markerLayer.addMarker(marker);
    					marker.events.on({
    						"click" : openInfoWin,
    						"scope" : marker
    					});
    					
    					count++
    					if(typeArr){
    						var no = true
    						for(var g=0;g<typeArr.length;g++){
    							if(typeArr[g]==feature.attributes["OBJ_TYPE"]){
    								typeCount[g] = typeCount[g]+1
    								no=false;
    								break;
    							}
    						}
    						if(no){
    							typeArr[typeArr.length]=feature.attributes["OBJ_TYPE"]
    							typeRemark[typeRemark.length]=feature.attributes['REMARK']
    							typeCount[typeCount.length]=1
    							imgArr[imgArr.length]=icon.url
    						}
    					}else{
    						typeArr[0]=feature.attributes["OBJ_TYPE"]
    						typeRemark[0]=feature.attributes['REMARK']
    						typeCount[0]=1
    						imgArr[0]=icon.url
    					}
    					
    				}
    			}
    		}
    		var html = '';
    		if(typeArr.length){
    			html = "<div style='padding-left:10px;padding-top:5px;padding-bottom:5px;'>在该范围内共查询到"+count+"个危险点。</div>";
    			html+="<div style='padding-left:5px;padding-bottom:5px;'>其中:</div>";
    			for(var i=0;i<typeArr.length;i++){
    				html+="<div style='padding-left:15px;padding-top:5px;'><table><tr><td><img style='width:18px;height:18px;' src='"+imgArr[i]+"'></td><td> "+typeRemark[i]+" "+typeCount[i]+" 个</td></tr></table></div>"
    			}
    		}else
    			html = "<div style='padding-left:10px;padding-top:5px;padding-bottom:5px;'>在该范围内没有查询到危险点。</div>";
    		doMapAlert("map", "查询结果", html, true);
    	}
    }

    function openInfoWin(){
    	if(popup){
    		map.removePopup(popup);
    	}
        var marker = this; 
        var lonlat = marker.getLonLat(); 
        var contentHTML = "<div style=\'font-size:14px; opacity: 0.8; overflow-y:hidden;\'>"; 
        contentHTML += "<div style='padding-top:5px;padding-left:10px;'>"+marker.info.attributes['REMARK']+"</div></div>";
        
        popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,null,true); 
        map.addPopup(popup);	
    }
}


/**
 * 计算小区绿化率
 */
var GreenAreaRateByDrawPolygon=FMapLib.GreenAreaRateByDrawPolygon=
 function(){
 removeTheme();
 drawPolygon = new MapLib.Control.DrawFeature(vectorLayer,
			MapLib.Handler.Polygon);
 vectorLayer.style = {
			strokeColor : "#304DBE",
			strokeWidth : 2,
			pointerEvents : "visiblePainted",
			fillColor : "#304DBE",
			fillOpacity : 0.5
		};
	map.addControl(drawPolygon);
	drawPolygon.events.on({
		"featureadded" : drawGreenAreaRateCompleted
	});
	drawPolygon.activate();
	ThemeByExtent.prototype.parmas='GreenAreaRate';
	// ThemeByExtent.prototype.themetype=themetype;
}
function drawGreenAreaRateCompleted(drawGeometryArgs){
	loading();
	drawPolygon.deactivate();
	var geometry = drawGeometryArgs.feature.geometry;
	var bounds = geometry.bounds;
	var lonLat = new MapLib.LonLat(bounds.left+(bounds.right-bounds.left)/2,bounds.bottom+(bounds.top-bounds.bottom)/2);
	var area = geometry.getArea();
	ThemeByExtent.prototype.areaDraw=area;
	ThemeByExtent.prototype.center=lonLat;
	var plygon=geometry;
		// 传递参数
	 var queryParam, queryByGeometryParameters, queryService;
	 queryParam = new MapLib.REST.FilterParameter({
		 name:"huapu@ORCL"
	 }); 
	 var queryParam1 = new MapLib.REST.FilterParameter({
		 name:"New_Region@ORCL"
	 }); 
	 queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
	 queryParams:[queryParam,queryParam1],
	 geometry:plygon,
	 spitalQueryMode:MapLib.REST.SpatialQueryMode.INTERSECT
	});
	 queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan);
	 queryService.events.on({"processCompleted":queryGreenAreaRateCompleted,
							 "processFailed":queryFailed
							});
	 queryService.processAsync(queryByGeometryParameters);
}
function queryGreenAreaRateCompleted(queryEventArgs) {  
	var i, j, feature,result = queryEventArgs.result;
	var recordsets = queryEventArgs.result.recordsets;
	var area=0;
	var xiaoquArea = 0;
	var xiaoquName = '';
	if(recordsets && recordsets.length){
		for(var i=0;i<recordsets.length;i++){
			var datasetName = recordsets[i].datasetName;
			var features = recordsets[i].features;
			// 如果是小区数据，则取出小区名称和小区面积
			if(datasetName == "New_Region@ORCL"){
				if(features && features.length){
					for(var j=0;j<features.length;j++){
						xiaoquArea = parseFloat(features[j].data.SMAREA);
						xiaoquName = features[j].data.AREANAME;
					}
				}
				
			}else if(datasetName == "huapu@ORCL"){// 如果是绿化数据，则取出各绿化块面积和
				if(features && features.length){
					for(var j=0;j<features.length;j++){
						var a = features[j].data.SMAREA
						if(a != 'undefined'){
							area += parseFloat(a);
						}
					}
				}
				
			}
			
		}
	}
	removeLoading();
	var areaDraw = ThemeByExtent.prototype.areaDraw;
	var center = ThemeByExtent.prototype.center;
	var contentHTML = "<div id='mapPopup' style=\'font-size:.9em; opacity: 0.7; overflow-y:hidden;\'>"; 
	contentHTML += "<div style='padding-top:15px;padding-left:10px;'>"+
	"小区名称："+xiaoquName+"<br/>"+
	"小区面积："+xiaoquArea.toFixed(2)+" ㎡<br/>"	+
	"绿地面积："+area.toFixed(2)+" ㎡<br/>"	+
	"绿化覆盖率："+((area/areaDraw)*100).toFixed(2)+"%"+
	"</div>";
	contentHTML +="<div style='padding-top:15px;padding-left:15px;'>" + "<img border='0' src='" + baseurl
							+ "theme/images/123.jpg' width='160' height='100'/>"
							+ "</div></div>"; 
	mapPopup = new MapLib.Popup.FramedCloud("popwin",center,null,contentHTML,null,true); 
	map.addPopup(mapPopup); 
}
/**
 * SQL查询服务 dataset 要查询的数据集 数组形式 ['dataset1','dataset2',...] value 查询关键字 attr
 * 查询关键字对应属性字段 数组形式 ['col1','col2',...] type 查询数据类型（如果有） orderby 排序语句 callback
 * 回调函数
 */
var CommonQueryByClassify = FMapLib.CommonQueryByClassify = function(dataset,value,attr,type,orderby,callback){
	markerLayer.clearMarkers();
	if(popupArray&&popupArray.length>0){
		for(var j=0;j<popupArray.length;j++){
			markerLayer.map.removePopup(popupArray[j]);	
		}
		popupArray=[];
	}
	var queryParam,queryParams=[];
	for(var i=0;i<dataset.length;i++){
		var datasetName = dataset[i];
		var filter='',order='';
		if(value && type){
			filter=attr[i]+" like '"+value+"'" + " and type="+type;
			order = orderby[i]
		}else if(value){
			filter=attr[i]+" like '"+value+"'";
			order = orderby[i]
		}else if(type){
			filter="type="+type;
			order = orderby[i]
		}
		if(filter){
			queryParam = new MapLib.REST.FilterParameter({ 
				name: datasetName, 
				attributeFilter: filter,// attr[i]+" like '"+value+"'",
				// orderBy: " USERID "
				orderBy: order
			}); 
		}else{
			queryParam = new MapLib.REST.FilterParameter({ 
				name: datasetName,
				// orderBy: " USERID "
				orderBy: order
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
	function queryCompleted(QueryEventArgs){
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
                        size = new MapLib.Size(16,15),
                        offset = new MapLib.Pixel(-(size.w), -size.h*2.5),
                        icon = new MapLib.Icon(baseurl + "theme/images/marker11.png", size, offset);
						var marker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy),icon);
						
						marker.info = feature;
						marker.info.attr = attr[i];
						marker.info.baseurl = baseurl;
						marker.icon = icon
						markerLayer.addMarker(marker);
						
						marker.events.on({
							"click" : openInfoWin,
							// "mouseover" : changeIconall,
							// "mouseout" : returnIconall,
							"scope" : marker
						});
						count=count+1;
						if(featureArr && featureArr.length){
							featureArr[featureArr.length]= marker;
						}else{
							featureArr[0]= marker;
						}
					}
					f=true;
				}
			}
			if(f){
				map.setCenter(new MapLib.LonLat(FMapLib.MapCenter.x, FMapLib.MapCenter.y),2);
				callback(count,featureArr);
			}else{
				callback(count);
			}
			
		}
	}
	function queryError(QueryEventArgs){// todo
		var arg = QueryEventArgs;
	}
	var isclosed=true;
	function openInfoWin(){
		if (popup) {
			markerLayer.map.removePopup(popup);
		}
	    var marker = this; 
	    var lonlat = marker.getLonLat(); 
	    var contentHTML = "<div style=\'font-size:14px; opacity: 0.8; overflow-y:hidden;\'>"; 
	    contentHTML += "<div>"+marker.info.attributes[marker.info.attr]+"</div></div>";
	    
	    popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,marker.icon,true,closeCallback); 
	    markerLayer.map.addPopup(popup);	
	    isclosed=false;
	}
	// 改变marker图片地址
	function changeIconall(){
		if (popup) {
			markerLayer.map.removePopup(popup);
		}
	    var marker = this; 
	    var lonlat = marker.getLonLat(); 
	    
	    // /var contentHTML = "<div style=\'overflow-y:hidden;width:100%;FILTER:
		// progid:DXImageTransform.Microsoft.Gradient(gradientType=0,startColorStr=#b8c4cb,endColorStr=red);background:
		// -ms-linear-gradient(top, #fff, #0000ff);\'>";
	    var contentHTML = "<div style=\'font-size:14px; opacity: 0.8; overflow-y:hidden;\'>"; 
	    contentHTML += "<div>"+marker.info.attributes[marker.info.attr]+"</div></div>";
	    
	    var size = new MapLib.Size(32,30),
        offset = new MapLib.Pixel(-(size.w), -size.h),
        icon = new MapLib.Icon(baseurl + "theme/images/marker11.png", size, offset);
	    
	    popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,icon,false);
	    // popup.autoSize=false;
	    markerLayer.map.addPopup(popup);
	    this.setUrl(baseurl + "theme/images/markerbig.png");
	}
	// 恢复marker图片地址
	function returnIconall(){
		this.setUrl(baseurl + "theme/images/marker11.png");
		if(isclosed){
			if (popup) {
				markerLayer.map.removePopup(popup);
			}
		}
		
	}
	function closeCallback(){
		isclosed=true;
		if (popup) {
			markerLayer.map.removePopup(popup);
		}
	}
}
/**
 * 周边查询 radius 查询半径 dataset 数据集。数组类型['dataset1','dataset2',...] value 输入的字符
 * valueCol 输入字符对应的列 ['col1','col2',...] type
 * 要查询的类型。数组形式：[['1','3',...],['1','3',...],...] typeCol,
 * 要查询的类型对应的列['col1','col2',...] callback 回调函数 orderby 查询结果排列方式。['o1','o2',...]
 */
var surroundingAnalustQuery = FMapLib.surroundingAnalustQuery = 
	function(radius,dataset,value,valueCol,type,typeCol,callback,orderby){
	removeTheme();
	drawPoint = new MapLib.Control.DrawFeature(vectorLayer2, MapLib.Handler.Point);
	map.addControl(drawPoint);
	vectorLayer.style=stylePoint
	drawPoint.events.on({
		"featureadded" : drawPointCompleted,
		"processFailed": function faildError(e){
    		var a = e;
    	}
	});
	drawPoint.activate();
	var point
	function drawPointCompleted(drawGeometryArgs){
		drawPoint.deactivate();
		// loading();
		point = drawGeometryArgs.feature.geometry
		bufferAnalystByGeo(radius)
	}
	
	function bufferAnalystByGeo(rad){
		if((radius!="")&&(point!=null)){
			var bufferServiceByGeometry = new MapLib.REST.BufferAnalystService(FMapLib.DemoURL.fangchan_spatialanalyst),
            bufferDistance = new MapLib.REST.BufferDistance({
                value: rad
            }),
            bufferSetting = new MapLib.REST.BufferSetting({
                endType: MapLib.REST.BufferEndType.ROUND,
                leftDistance: bufferDistance,
                rightDistance: bufferDistance,
                semicircleLineSegment: 20
            }),
            geoBufferAnalystParam = new MapLib.REST.GeometryBufferAnalystParameters({
                sourceGeometry: point,
                bufferSetting: bufferSetting
            });        

	        bufferServiceByGeometry.events.on(
			{
				"processCompleted": bufferAnalystCompleted,
				"processFailed": function queryError(QueryEventArgs){
					var arg = QueryEventArgs;
				}
			});
	        bufferServiceByGeometry.processAsync(geoBufferAnalystParam);
            
		}
	}
	function bufferAnalystCompleted(BufferAnalystEventArgs) {
        var feature = new MapLib.Feature.Vector();
        var bufferResultGeometry = BufferAnalystEventArgs.result.resultGeometry;
        feature.geometry = bufferResultGeometry;
        feature.style = {
                strokeColor: "#487B7B",// "#304DBE",
                strokeWidth: 1,
                pointerEvents: "visiblePainted",
                fillColor: "#DAF3F3",// "#304DBE",
                fillOpacity: 0.4
            };
        vectorLayer.addFeatures(feature);
        queryByGeometry(bufferResultGeometry)
     }
    
  // 查询出影响范围内的
    function queryByGeometry(geo){
        var queryParam,queryParams=[],queryByGeometryParameters, queryService;
    	for(var i=0;i<dataset.length;i++){
    	  /*
			 * attributeFilter {String} 属性过滤条件。 name {String} 查询数据集名称或者图层名称。
			 * joinItems {Array(SuperMap.REST.JoinItem)} 与外部表的连接信息 JoinItem 数组。
			 * linkItems {Array(SuperMap.REST.LinkItem)} 与外部表的关联信息 LinkItem 数组。
			 * ids {Array(String)} 查询 id 数组，即属性表中的 SmID 值。 orderBy {String}
			 * 查询排序的字段, orderBy 的字段须为数值型的。 groupBy {String} 查询分组条件的字段。 fields
			 * {Array(String)} 查询字段数组。
			 */
    		if(value && valueCol[i] && type[i] && typeCol[i]){
    			queryParam = new MapLib.REST.FilterParameter({
    				name: dataset[i], 
    				attributeFilter: valueCol[i] + " like "+value+" and "+typeCol[i]+" in ("+type[i]+")"// ,
    				// orderBy: orderby[i]
    			});
    		}else if(value && valueCol[i]){
    			queryParam = new MapLib.REST.FilterParameter({
    				name: dataset[i], 
    				attributeFilter: valueCol[i] + " like "+value// ,
    				// orderBy: orderby[i]
    			});
    		}else if(type[i] && typeCol[i]){
    			queryParam = new MapLib.REST.FilterParameter({
    				name: dataset[i], 
    				attributeFilter: typeCol[i]+" in ("+type[i]+")"// ,
    				// orderBy: orderby[i]
    			});
    		}else{
    			queryParam = new MapLib.REST.FilterParameter({
    				name: dataset[i]// ,
    				// orderBy: orderby[i]
    			});
    		}
    		if(orderby[i]){
    			queryParam.orderBy = orderby[i]
    		}
    		queryParams[i]=queryParam;
    	}
        queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
            queryParams: queryParams,
            geometry: geo,
            spatialQueryMode: MapLib.REST.SpatialQueryMode.INTERSECT
        });
        queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan);
        queryService.events.on(
                {
                    "processCompleted": queryCompleted,
                    "processFailed": function faildError(e){
                		var a = e;
                	}
                });
        queryService.processAsync(queryByGeometryParameters);
    }
    function queryCompleted(queryEventArgs) {
    	var result,recordsets,f=false,count=0,markers=[],typeArr=[],typeRemark=[],typeCount=[],imgArr=[];
		if(!queryEventArgs.result) return;
		result = queryEventArgs.result;
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
	                    size = new MapLib.Size(18,18),
	                    offset = new MapLib.Pixel(-(size.w/2), -size.h/2);
	                    // icon = new MapLib.Icon(baseurl +
						// "theme/images/marker11.png", size, offset);
						var icon
						var img = getImg(baseurl,feature.attributes["TYPE"])
						icon = new MapLib.Icon(img, size, offset);
						var marker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy),icon);
						marker.info = feature;
						marker.icon = icon
						markerLayer.addMarker(marker);
						marker.events.on({
							"click" : openInfoWinS,
							"mouseover" : mouseOver,
							"mouseout" : mouseOut,
							"scope" : marker
						});
						count++
						markers[markers.length] = marker
						
						if(typeArr){
							var no = true
							for(var g=0;g<typeArr.length;g++){
								if(typeArr[g]==feature.attributes["TYPE"]){
									typeCount[g] = typeCount[g]+1
									no=false;
									break;
								}
							}
							if(no){
								typeArr[typeArr.length]=feature.attributes["TYPE"]
								typeRemark[typeRemark.length]=feature.attributes['ANNOTYPE']
								typeCount[typeCount.length]=1
								imgArr[imgArr.length]=icon.url
							}
						}else{
							typeArr[0]=feature.attributes["TYPE"]
							typeRemark[0]=feature.attributes['ANNOTYPE']
							typeCount[0]=1
							imgArr[0]=icon.url
						}
					}
				}
			}
			var html = "<div style='padding-left:10px;padding-top:5px;padding-bottom:5px;'>在该范围内共查询到"+count+"条相关记录。</div>";
			if(typeArr.length){
				html+="<div style='padding-left:5px;padding-bottom:5px;'>其中:</div>";
				if(typeArr.length>5){
					html+="<div style='width:270;height:120px;overflow:auto;'>";
				}
			}
			for(var i=0;i<typeArr.length;i++){
				html+="<div style='padding-left:15px;padding-top:0px;'><table><tr><td><img style='width:16px;height:16px;' src='"+imgArr[i]+"'></td><td> "+typeRemark[i]+" "+typeCount[i]+" 个</td></tr></table></div>"
			}
			if(typeArr.length>5){
				html+="</div>";
			}
			doMapAlert("map", "分析结果", html, true);
			callback(markers,count);
		}
	}
    var isO=false
    function mouseOver(){
		var marker = this;
		var icon = marker.icon;
		var url = icon.url
		if(url.indexOf('hover')>-1){
			isO=true;
			return
		}
		isO=false;
		url = url.replace('.png','_hover.png')
		icon.setUrl(url);
	}
    function mouseOut(){
    	var marker = this;
    	if(isO) return;
    	var icon = marker.icon;
    	var url = icon.url
		url = url.replace('_hover.png','.png')
		icon.setUrl(url);
	}
    function openInfoWinS(){
		if(popup){
			map.removePopup(popup);
		}
	    var marker = this; 
	    var lonlat = marker.getLonLat(); 
	    var contentHTML = "<div style=\'font-size:14px; opacity: 0.8; overflow-y:hidden;\'>"; 
	    contentHTML += "<div style='padding-top:5px;padding-left:10px;'>"+marker.info.attributes['ANNONOTE']+"</div></div>";
	    
	    popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,null,true); 
	    map.addPopup(popup);	
	}
	
}
function getImg(path,type){
	var img = '';
	if(type=='1'){
		img = path+"theme/images/clazzedPIC/fangguan.png"
	}else if(type=='2'){
		img = path+"theme/images/clazzedPIC/zhengfu.png"
	}else if(type=='3'){
		img = path+"theme/images/clazzedPIC/jieban.png"
	}else if(type=='4'){
		img = path+"theme/images/clazzedPIC/jiaoyu.png"
	}else if(type=='5'){
		img = path+"theme/images/clazzedPIC/weisheng.png"
	}else if(type=='6'){
		img = path+"theme/images/clazzedPIC/wenhua.png"
	}else if(type=='7'){
		img = path+"theme/images/clazzedPIC/tiyu.png"
	}else if(type=='8'){
		img = path+"theme/images/clazzedPIC/jiaotong.png"
	}else if(type=='9'){
		img = path+"theme/images/clazzedPIC/lvyou.png"
	}else if(type=='10'){
		img = path+"theme/images/clazzedPIC/gongshang.png"
	}else if(type=='11'){
		img = path+"theme/images/clazzedPIC/shangwu.png"
	}else if(type=='12'){
		img = path+"theme/images/clazzedPIC/minzheng.png"
	}else if(type=='13'){
		img = path+"theme/images/clazzedPIC/jianding.png"
	}else if(type=='14'){
		img = path+"theme/images/clazzedPIC/wuye.png"
	}else if(type=='15'){
		img = path+"theme/images/clazzedPIC/zhongjie.png"
	}else if(type=='16'){
		img = path+"theme/images/clazzedPIC/shangchang.png"
	}else if(type=='17'){
		img = path+"theme/images/clazzedPIC/yinhang.png"
	}else if(type=='18'){
		img = path+"theme/images/clazzedPIC/jiudian.png"
	}
	
	return img;
}
// var dangerousLayer;
// function zoomendHandle(){
// if(map.getZoom() >= 2 && !dangerousLayer){
// dangerousLayer = new MapLib.Layer.Markers("dangerous Layer");
// map.addLayer(dangerousLayer);
// queryDangerousBySQL();
// }else if(map.getZoom() >= 2 && dangerousLayer){
// var a = dangerousLayer;
// dangerousLayer.setVisibility(true);
// }else if(map.getZoom() < 2 && dangerousLayer){
// dangerousLayer.setVisibility(false);
// }
// }
var queryDangerousBySQL = FMapLib.queryDangerousBySQL=function(){
	var queryParam = new MapLib.REST.FilterParameter({
		name: "ST_Dangers_P@ORCL",
		attributeFilter: " OBJ_TYPE > 0"
		});
	var queryBySQLParams = new MapLib.REST.QueryBySQLParameters({
		expectCount: 1000,
	    queryParams: [queryParam] 
	}); 
	var myQueryBySQLService = new MapLib.REST.QueryBySQLService(FMapLib.DemoURL.fangchan, {eventListeners: { 
	    "processCompleted": queryDangerousCompleted, 
	    "processFailed": function faildError(e){
			    			var a = e;
			    		} 
	    } 
	}); 
	myQueryBySQLService.processAsync(queryBySQLParams); 
}
function queryDangerousCompleted(queryEventArgs) {
	var result,recordsets
	if(!queryEventArgs.result) return;
	result = queryEventArgs.result;
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
                    size = new MapLib.Size(26,24),
                    offset = new MapLib.Pixel(-(size.w/2), -size.h/2);
					var img='';
					if(feature.attributes["OBJ_TYPE"] == '1'){
						img = baseurl + "theme/images/dangerous/sk.png"
					}else if(feature.attributes["OBJ_TYPE"] == '2'){
						img = baseurl + "theme/images/dangerous/st.png"
					}else if(feature.attributes["OBJ_TYPE"] == '3'){
						img = baseurl + "theme/images/dangerous/sq.png"
					}else if(feature.attributes["OBJ_TYPE"] == '4'){
						img = baseurl + "theme/images/dangerous/gc.png"
					}else if(feature.attributes["OBJ_TYPE"] == '5'){
						img = baseurl + "theme/images/dangerous/sg.png"
					}
					
					var icon = new MapLib.Icon(img, size, offset);
					var marker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy),icon);
					marker.info = feature;
					marker.icon = icon
					markerLayer.addMarker(marker);
					marker.events.on({
						"click" : openDangerousInfoWin,
						"scope" : marker
					});
				}
			}
		}
	}
}

function openDangerousInfoWin(){
	if(popup){
		map.removePopup(popup);
	}
    var marker = this; 
    var lonlat = marker.getLonLat(); 
    var contentHTML = "<div style=\'font-size:14px; opacity: 0.8; overflow-y:hidden;\'>"; 
    contentHTML += "<div style='padding-top:5px;padding-left:10px;'>"+marker.info.attributes['REMARK']+"</div></div>";
    
    popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,null,true); 
    map.addPopup(popup);	
}


var weatherForcast = FMapLib.weatherForcast = function(){
	hideWeather();
	weatherLayerControl()
	var queryParam = new MapLib.REST.FilterParameter({ 
	    name: "WEATHER_P@ORCL"
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
						 // 章丘市\商河县\济阳县\平阴县\长清区\济南市\
						 // 历城区\天桥区\槐荫区\市中区\历下区\
						// var name = feature.attributes["NAME"];
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
							markerLayer.addMarker(marker);
							marker.events.on({
								"click" : openInfoWin1,
								"scope" : marker
							});
						}else{
							var pointx = parseFloat(feature.attributes["SMX"]),
	                        pointy = parseFloat(feature.attributes["SMY"]),	                
	                        size = new MapLib.Size(42,30),
	                        offset = new MapLib.Pixel(-(size.w/2), -size.h),
	                        icon = new MapLib.Icon(baseurl+"theme/images/" + feature.attributes["IMG_PATH_1"], size, offset);
							var marker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy),icon);
							marker.info = feature;
							markerLayer1.addMarker(marker);
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
			if(f){
				var bound = markerLayer.getDataExtent();
				markerLayer.map.zoomToExtent(bound);
				var lonlat = bound.getCenterLonLat();
				markerLayer.map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
// if(markerLayer.map.getZoom()<2){
// markerLayer.map.zoomTo(4);
// }
			}
			
		}
	}
	function queryError(QueryEventArgs){// todo
		var arg = QueryEventArgs;
	}
	function openInfoWin(){
		if (popup) {
			map.removePopup(popup);
		}
	    var marker = this; 
	    var lonlat = marker.getLonLat(); 
	    var contentHTML = "<div style='\font-size:16px;opacity: 1.2;vertical-align:top;\'>"; // font-size:.8em;
																								// opacity:
																								// 0.8;
																								// line-height:5px;
	    contentHTML += "<div style='width:100%;text-align:center;font-size:16px;font-weight:bold;color:#1557F1;padding-top:15px;padding-bottom:10px;'>"+marker.info.attributes["NAME"]+"</div>";
	    // contentHTML += "<table>";
	   // contentHTML += "<tr>";
	    
	    // contentHTML += "<td>";
	    contentHTML += "<div style='width:130px;text-align:center;float:left;'>";// style='float:left;width:120px;'
	    contentHTML += "<div style='line-height:20px;'><font color='#0066cc'>今日</font>天气</div>";
	    if(marker.info.attributes["IMG_PATH_1"] && marker.info.attributes["IMG_PATH_2"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG_PATH_1"]+"' style='border:0;width:42px;height:30px'/><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG_PATH_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG_PATH_1"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG_PATH_1"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG_PATH_2"])
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG_PATH_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    
	    contentHTML += "<div style='line-height:20px;'><font color='#f00'>"+marker.info.attributes["TEMPERATURE"]+"</font></div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WEATHER"]+"</div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WIND_CONT"]+"</div>";
	    contentHTML += "<div style='line-height:20px;text-align: left;padding-left:20px;padding-top:5px;'>当前温度："+marker.info.attributes["RETTEMP"]+"</div>";
	    contentHTML += "<div style='line-height:20px;text-align: left;padding-left:20px;'>风力风向："+marker.info.attributes["RETWIND"]+"</div>";
	    contentHTML += "<div style='line-height:20px;text-align: left;padding-left:20px;'>"+marker.info.attributes["HUMIDITY"]+"</div>";
	    contentHTML += "</div>";
	   // contentHTML += "</td>";
	    
	   // contentHTML += "<td>";
	    contentHTML += "<div style='text-align:center;width:130px;float:left;'>";// style='width:120px;
																					// padding:0
																					// 130px;'
	    contentHTML += "<div style='line-height:20px;'></div>";
	    contentHTML += "<div style='line-height:20px;'><font color='#0066cc'>明日</font>天气</div>";
	    if(marker.info.attributes["IMG48_1"] && marker.info.attributes["IMG48_2"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG48_1"]+"' style='border:0;width:42px;height:30px'/><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG48_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG48_1"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG48_1"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG48_2"])
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG48_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    
	    contentHTML += "<div style='line-height:20px;'><font color='#f00'>"+marker.info.attributes["TEMPH48"]+"</font>~<font color='#4899be'>"+marker.info.attributes["TEMPL48"]+"</font></div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WEATHER48"]+"</div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WIND_CONT48"]+"</div>";
	    contentHTML += "</div>";
	    // contentHTML += "</td>";
	    
	    // contentHTML += "<td>";
	    contentHTML += "<div style='text-align:center;width:130px;float:left;'>";// style='float:right;width:120px;'
	    contentHTML += "<div style='line-height:20px;'></div>";
	    contentHTML += "<div style='line-height:20px;'><font color='#0066cc'>后天</font>天气</div>";
	    if(marker.info.attributes["IMG72_1"] && marker.info.attributes["IMG72_2"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG72_1"]+"' style='border:0;width:42px;height:30px'/><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG72_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG72_1"]){
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG72_1"]+"' style='border:0;width:42px;height:30px'/></div>";
	    }else if(marker.info.attributes["IMG72_2"])
	    	contentHTML += "<div><img align='absmiddle' src='"+baseurl+"theme/images/" + marker.info.attributes["IMG72_2"]+"' style='border:0;width:42px;height:30px'/></div>";
	    
	    contentHTML += "<div style='line-height:20px;'><font color='#f00'>"+marker.info.attributes["TEMPH72"]+"</font>~<font color='#4899be'>"+marker.info.attributes["TEMPL72"]+"</font></div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WEAWTHER72"]+"</div>";
	    contentHTML += "<div style='line-height:20px;'>"+marker.info.attributes["WIND_CONT72"]+"</div>";
	    contentHTML += "</div>";
	    
	    // contentHTML += "<td>";
	   // contentHTML += "<tr>";
	    // contentHTML += "<table>";
	    contentHTML += "</div>";
	 
	    popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,null,true); 
	    map.addPopup(popup); 
	}

function openInfoWin1(){
	if (popup) {
		map.removePopup(popup);
	}
    var marker = this; 
    var lonlat = marker.getLonLat(); 
    var contentHTML = "<div id='content' style='width: 480px;padding-top:10px;padding-bottom:10px;padding-left:15px;opacity: 0.8;overflow: hidden;'>"+
    "<div style='width:100%;text-align:center;font-size:16px;font-weight:bold;color:#1557F1;padding-top:5px;padding-bottom:10px;'>"+marker.info.attributes["NAME"]+"</div>"+
    "<div id='tab_bar' style='width: 100%;float: left;'>"+
    "<ul style='padding: 0px; margin: 0px; text-align: center;font-size:14px;'>"+
	    "<li id='wtab1' style='background-color: #EEFEFE;list-style-type: none; float: left; width: 130px;padding-top:5px;padding-bottom:5px;'><font color='blue'>今天</font>天气</li> "+
	    "<li id='wtab2' style='list-style-type: none; float: left; width: 130px;background-color: #CED9D9;padding-top:5px;padding-bottom:5px;'><font color='blue'>明后天</font>天气</li>"+
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
 	map.addPopup(popup); 
 	
 	$("#wtab1").click(function(){
 		var li1 = document.getElementById("wtab1");
 		li1.style.backgroundColor = "#EEFEFE";
 		var li2 = document.getElementById("wtab2");
 		li2.style.backgroundColor = "#CED9D9";
 		var div1 = document.getElementById("tab1_content");
 		div1.style.display = "block";
 		var div2 = document.getElementById("tab2_content");
 		div2.style.display = "none";
 	});
 	$("#wtab2").click(function(){
 		var li1 = document.getElementById("wtab1");
 		li1.style.backgroundColor = "#CED9D9";
 		var li2 = document.getElementById("wtab2");
 		li2.style.backgroundColor = "#EEFEFE";
 		var div1 = document.getElementById("tab1_content");
 		div1.style.display = "none";
 		var div2 = document.getElementById("tab2_content");
 		div2.style.display = "block";
 	});
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
    return img = "theme/images/weather/"+img+".gif"
}

}
function zoomendHandle(){
	// <3时，显示城区、3县、章丘市、长清区、天气
	weatherLayerControl()
}
function weatherLayerControl(){
	if(map.getZoom() >= 1){
		markerLayer1.setVisibility(true);
	}else{
		markerLayer1.setVisibility(false);
	}
}
function hideWeather(){
	if (popup) {
		map.removePopup(popup);
	}
	markerLayer.clearMarkers();
	markerLayer1.clearMarkers();
}
})();





