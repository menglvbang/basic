(function() {
	/**
	 * 初始化模块全局变量，是目前API开发中使用的公共变量，经(function(){})()封装后在外部无法访问
	 */
	var layer, marker, vectorLayer,markerLayer,hardMarkerLayer, drawLayer,clusterLayer, imagelayer, bGoogle = false;
	var vectorLayer2;// 查询定位房屋面渲染图层
	var vectorLayer3;//多房屋渲染图层
	var htmlUrl = document.location.toString(), stringIndex = htmlUrl
			.indexOf("//"), subString = htmlUrl.substring(0, stringIndex - 1), org;
	var fan = "";// 楼盘表定位监听
	var ide = "";// 监听参数
	var ide0;// 专题图监听参数
	/**
	 * 初始化_mapNamesArr,_mapUrlsArr的函数，当前执行。
	 */
	var _mapNamesArr = new Array();// 地图名称数组
	var _mapUrlsArr = new Array();// 地图地址数组
	// 其他变量声明
	// var map;//声明地图初始化的公共变量
	var drawPolygon;// 画多变形控件
	var drawLine;// 画线控件
	var drawPoint;// 画点控件
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

	
// 获取当前路径 baseurl
	var r = new RegExp("(^|(.*?\\/))(FMapLib.Include-1.0.4\.js)(\\?|$)"), s = document
			.getElementsByTagName('script'), src, m, baseurl = "";
	for ( var i = 0, len = s.length; i < len; i++) {
		src = s[i].getAttribute('src');
		if (src) {
			var m = src.match(r);
			if (m) {
				baseurl = m[1];
			 if(baseurl=="172.22.14.36"){
		        baseurl="123.232.109.163";//映射到外网
		     }
				break;
			}
		}
	}
	
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
	 * 声明dom类
	 */
	 FMapLib.dom = FMapLib.dom || {};
	/**
	 * 创建div的函数
	 */
	FMapLib.dom.create = function(tagName, opt_attributes) {
		var el = document.createElement(tagName), 
		attributes = opt_attributes || {};
		return baidu.dom.setAttrs(el, attributes);
	};
	/**
	 * 根据id获得dom元素，或直接返回数投入的dom元素 参数：id:dom元素或dom元素的id
	 */
	FMapLib.dom.g = function(id) {
		if ('string' == typeof id || id instanceof String) {
			return document.getElementById(id);
		} else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
			return id;
		}
		return null;
	};
	FMapLib.g = FMapLib.G = FMapLib.dom.g;
	/**
	 * FMapLib的浏览器
	 */
	FMapLib.browser = FMapLib.browser || {};
	FMapLib.browser.ie = FMapLib.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
	FMapLib.dom._NAME_ATTRS = (function () {
             var result = {
                 'cellpadding': 'cellPadding',
                'cellspacing': 'cellSpacing',
                 'colspan': 'colSpan',
                 'rowspan': 'rowSpan',
                 'valign': 'vAlign',
                 'usemap': 'useMap',
                 'frameborder': 'frameBorder'
             };
             if (FMapLib.browser.ie < 8) {
                 result['for'] = 'htmlFor';
                 result['class'] = 'className';
             } else {
                 result['htmlFor'] = 'for';
                 result['className'] = 'class';
             }
             return result;
         })();
	FMapLib.dom.setAttr = function(element, key, value) {
		element = baidu.dom.g(element);
		if ('style' == key) {
			element.style.cssText = value;
		} else {
			key = FMapLib.dom._NAME_ATTRS[key] || key;
			element.setAttribute(key, value);
		}
		return element;
	};
	FMapLib.setAttr = FMapLib.dom.setAttr;
	FMapLib.dom.setAttrs = function(element, attributes) {
		element = FMapLib.dom.g(element);
		for ( var key in attributes) {
			FMapLib.dom.setAttr(element, key, attributes[key]);
		}
		return element;
	};
	FMapLib.setAttrs = FMapLib.dom.setAttrs;	
		var FMap =
			/**
			 * FMap类的构造函数
			 * 
			 * @class 地图类， 实例化该类后，即可返回一个房产地图实例
			 * @constructor
			 * @param id  必填项，html页面地图实例所在div的唯一标识
			 * @param module 专题模块参数，目前已有"safecheck","safecheck2","safecheck3","emergency"四个有意义的值，分别代表安全普查，安全检查，安全鉴定，突发事件管理四大专题
			 * @param regioncode 用户所属区县编号
			 * @param zoomvalue  指定地图缩放等级(当区县权限判断失效时起作用)           
			 */
			FMapLib.FMap = function(id,module,regioncode,zoomvalue) {
				// 加载map控件
				this.mapdiv=id;// 地图窗口id
				// 定义地图对象
				this.map = new MapLib.Map({
					controls : [new MapLib.Control.Navigation({
						dragPanOptions : {
							enableKinetic : true
						}
					})],
					div: id				
					//restrictedExtent:new MapLib.Bounds(49802,54540,64772,41177)
				});				
				this._prepareLayers(this.map,module,regioncode);// 加载图层
				// return this._map;//返回地图对象
				// 将markerLayer设为私有属性
				this._markerLayer = markerLayer;
				this._hardMarkerLayer=hardMarkerLayer;
				this._vectorLayer=vectorLayer;
				this._vectorLayer2=vectorLayer2;
				this._vectorLayer3=vectorLayer3;
				this.id=id;	// 地图div id
				this.legendId;// 地图图例div id
				this._DemoURL= FMapLib.DemoURL;// 地图服务资源地址
				this._module=module;// 模块专属				
				if(zoomvalue && typeof zoomvalue=="number"){
					FMap.prototype.INITZOOM=zoomvalue;
				}else{
				    FMap.prototype.INITZOOM=3;	
				}
			};
		    FMapLib.extend(FMap.prototype,{
		    	_prepareLayers : function(map,module,regioncode) {
		    		var me=this;	
		    		me.map.allOverlays = true;
		    		// 初始化底图图层
		    		layer = new MapLib.Layer.TiledDynamicRESTLayer("fangchanL",
		    				FMapLib.DemoURL.fangchanL, {
		    					transparent : false,
		    					cacheEnabled : true		    					    					 
		    				}, {
		    					scales : FMapLib.scales,
		    					maxResolution : "auto",
		    					numZoomLevels : FMapLib.scalesnum
		    				});	
		    		//初始化影像图图层
		    		imagelayer = new MapLib.Layer.TiledDynamicRESTLayer("影像图",
		    				FMapLib.DemoURL.image, {
		    					transparent : false,
		    					cacheEnabled : true
		    				}, {
		    					scales : FMapLib.scales,
		    					maxResolution : "auto",
		    					numZoomLevels : FMapLib.scalesnum
		    				});
		    		// 初始化Marker图层
		    		markerLayer = new MapLib.Layer.Markers("Markers Layer");
		    		hardMarkerLayer= new MapLib.Layer.Markers("Markers Layer");
		    		vectorLayer = new MapLib.Layer.Vector("Vector Layer");
		    		vectorLayer2 = new MapLib.Layer.Vector("Vector Layer");
		    		vectorLayer3=new MapLib.Layer.Vector("Vector Layer");
		    		// 房屋安全主题图层
		    		layerSafeHouse=null;	    	
		    		layer.events.on({
		    			"layerInitialized" : function() {
		    				// 安全检查地图
//		    				if(module&&module=="safecheck2"){
//		    					layerSafeHouse=new MapLib.Layer.TiledDynamicRESTLayer("安全检查",
//					    				FMapLib.DemoURL.safecheck2, {
//					    					transparent : true,
//					    					cacheEnabled : false
//					    				}, {useCanvas: false});				
//		    				}
//		    				// 安全鉴定地图
//		    				else if(module&&module=="safecheck3"){
//		    					layerSafeHouse=new MapLib.Layer.TiledDynamicRESTLayer("安全鉴定",
//					    				FMapLib.DemoURL.safecheck3, {
//					    					transparent : true,
//					    					cacheEnabled : false
//					    				}, {useCanvas: false});		
//		    				}
		    				//突发事件地图
	//	    				else
		    					if(module&&module=="emergency"){
		    					layerSafeHouse=new MapLib.Layer.TiledDynamicRESTLayer("突发事件",
					    				FMapLib.DemoURL.emergency, {
					    					transparent : true,
					    					cacheEnabled : false
					    				}, {useCanvas: false});				
		    				}
		    				//安全普查地图
//		    				else if(module&&module=="safecheck"){
//		    					layerSafeHouse=new MapLib.Layer.TiledDynamicRESTLayer("安全普查",
//					    				FMapLib.DemoURL.safecheck, {
//					    					transparent : true,
//					    					cacheEnabled : false
//					    				}, {useCanvas: false});	
//		    				}
		    				// 其他安全类地图
		    				else{
		    				     layerSafeHouse=new MapLib.Layer.TiledDynamicRESTLayer("新增安全房屋",
						    				FMapLib.DemoURL.newSafehouse, {
				    					transparent : true,
				    					cacheEnabled : false
				    				}, {useCanvas: true});	
		    				     
		    				}		    			
				    		layerSafeHouse.events.on({"layerInitialized": addLayer2});		    			
		    				// map.allOverlays = true;
		    			}
		    		});		    		
		    		// map初始化众图层，中心点
		    		function addLayer2(){
		    			//me.map.restrictedExtent=new MapLib.Bounds(32300,50010,63044,29485);
		    			me.map.addLayers([ layer,layerSafeHouse,vectorLayer,vectorLayer2,vectorLayer3,hardMarkerLayer,markerLayer]);
		    			// 当前地图容器加载的所有图层
		    			currentlayer = [ layer,layerSafeHouse,vectorLayer,vectorLayer2,vectorLayer3,hardMarkerLayer,markerLayer];// 数组存放当前图层
		    			if(regioncode && typeof regioncode=="string"){
		    				var code=regioncode;
		    				switch(code){
		    				//历下区
		    				case "086370102":
		    					 me.map.setCenter(new MapLib.LonLat(506274,4057597),0);		    					
		    					 //me.map.restrictedExtent=new MapLib.Bounds(49802,54540,64772,41177);
				    			 me.map.zoomToExtent(new MapLib.Bounds(500608,4064278,515577,4050915));				    		
				    			 break;
				    		//市中区	 
		    				case "086370103":
		    				     me.map.setCenter(new MapLib.LonLat(495288,4049485),0);		    				   
			    			     me.map.zoomToExtent(new MapLib.Bounds(483106,4059748,513851,4039223));	
			    			     break;
			    			//槐荫区     
		    				case "086370104":  
		    				     me.map.setCenter(new MapLib.LonLat(488991,4061071),0);				    			
			    			     me.map.zoomToExtent(new MapLib.Bounds(481738,4068153,498502,4053989));	
			    			     break;
			    			//天桥区     
		    				case "086370105":
		    					me.map.setCenter(new MapLib.LonLat(496687,4070359),0);				    			
				    			me.map.zoomToExtent(new MapLib.Bounds(487336,4081535,507021,4059184));	
				    			break;
				    		//历城区	
		    				case "086370112":
		    					me.map.setCenter(new MapLib.LonLat(522045,4053659),0);				    			
				    			me.map.zoomToExtent(new MapLib.Bounds(493272,4085140,533652,4022178));	
				    			break;
				    		//长清区	
		    				case "086370113":
		    					me.map.setCenter(new MapLib.LonLat(480354,4037746),0);				    			
				    			me.map.zoomToExtent(new MapLib.Bounds(456425,4062940,506739,4012551));
				    			break;
				    		//高新区	
		    				case "086370114":
		    					me.map.setCenter(new MapLib.LonLat(497950.057789132, 4061622.65003076),0);
		    					break;
		    				//平阴县	
		    				case "086370124":
		    					me.map.setCenter(new MapLib.LonLat(442595,4008618),0);				    			
				    			me.map.zoomToExtent(new MapLib.Bounds(429837,4028388,465376,3988848),true);
				    			break;
				    		//济阳县	
		    				case "086370125":
		    					me.map.setCenter(new MapLib.LonLat(506067,4098043),0);				    			
				    			me.map.zoomToExtent(new MapLib.Bounds(488347,4123928,540494,4072159));	
				    			break;
				    		//商河县	
		    				case "086370126":	
		    					me.map.setCenter(new MapLib.LonLat(517111,4132465),0);				    			
				    			me.map.zoomToExtent(new MapLib.Bounds(498249,4155580,538412,4109350));	
				    			break;
				    		//章丘市	
		    				case "086370181":
		    					me.map.setCenter(new MapLib.LonLat(545757,4069435),0);				    			
				    			me.map.zoomToExtent(new MapLib.Bounds(515545,4104931,566393,4033939));		
				    			break;
		    				}
		    			}else{
	    				me.map.setCenter(new MapLib.LonLat(FMapLib.MapCenter.x, FMapLib.MapCenter.y),0);
	    				//me.map.restrictedExtent=new MapLib.Bounds(49802,54540,64772,41177);
		    			me.map.zoomTo(FMap.prototype.INITZOOM);
		    			//定义框选放大
		    			magnifyZoomBox = new MapLib.Control.ZoomBox({out:false});
		    			me.map.addControl(magnifyZoomBox);
		    			//定义框选缩小
		    			shrinkZoomBox = new MapLib.Control.ZoomBox({out:true});
		    			me.map.addControl(shrinkZoomBox);
		    			}	    				
		    		}
		    	}
		    	
		    });		    
		  // 地图清除功能
		     FMap.prototype.clearAllFeatures = function() {
		    	 // 地图清除功能，清除地图上的所有覆盖物，并停止画点线面的功能\
		    	 if (popup&&markerLayer&&markerLayer.map) {					
		    		 markerLayer.map.removePopup(popup);	
		    		 popup.destroy();
		    		 popup = null;
		    	 }
		    	if(markerLayer){
		    		markerLayer.clearMarkers();				
		    	}
				if (drawPoint) {
					drawPoint.deactivate();
				}
				if(drawLine){
					drawLine.deactivate();
				}
				if (drawPolygon) {
					drawPolygon.deactivate();
				}
				if(clusterLayer){
					clusterLayer.removeAllFeatures();
				}
				if(vectorLayer)
				vectorLayer.removeAllFeatures();
				if(vectorLayer2)
				vectorLayer2.removeAllFeatures();
				if ($('#mapAlert').size()) {
					$('div').remove('#mapAlert');
				}
				if(mapPopup){
					this.map.removePopup(mapPopup);
				}
			};
			FMap.prototype.clearFeatures = function() {			
		    	 // 地图清除功能，清除地图上的所有覆盖物，并停止画点线面的功能\
		    	if(markerLayer) 
				markerLayer.clearMarkers();				
				if (popup&&markerLayer&&markerLayer.map) {					
					markerLayer.map.removePopup(popup);	
					popup.destroy();
					popup = null;
				}
				
				if(clusterLayer){
					clusterLayer.removeAllFeatures();
				}
				if(vectorLayer)
				vectorLayer.removeAllFeatures();
				if(vectorLayer2)
				vectorLayer2.removeAllFeatures();
				if ($('#mapAlert').size()) {
					$('div').remove('#mapAlert');
				}
				if(mapPopup){
					this.map.removePopup(mapPopup);
				}
			};
			/**
			 * 停止框选，恢复鼠标状态
			 */
			 FMap.prototype.stopDrop = function(){
				if (drawPoint) {
					drawPoint.deactivate();
				}
				if (drawLine) {
					drawLine.deactivate();
				}
				if (drawPolygon) {
					drawPolygon.deactivate();
				}
//				if (drawHouse) {
//					drawHouse.deactivate();
//				}
				
			}
			// 提供能够满足前进后退功能的属性
		    FMap.prototype.addbackandforward=function(){
		    	 // 满足前进后台功能
			       var center = new MapLib.LonLat(FMapLib.MapCenter.x, FMapLib.MapCenter.y);
					centers_back.push(center);
					scales_back.push(this.map.getZoom());		
					this.map.events.on({"moveend": function() {handle_Action(this._map)}});
		    };
			/**
			 * 刷新并重新定义图例div的html内容
			 */
		    FMap.prototype.flashLegend= function(html){
				if(this.legendId){
					var ldiv=$("#"+this.legendId);
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
		    FMap.prototype.initLegendDiv=function(){
				var themehtml="<div id='"+this.id+"themelegenddiv' class='themeLegendDIV' style ='border:solid 1px black;position: absolute; float: left; left: 60px;top: 300px; opacity: 1; z-index: 1002; width: auto; height: auto;'></div>" ;
		        $("#"+this.id).append(themehtml);
		        this.legendId=this.id+"themelegenddiv";
			}
			/**
			 * 清除图例div
			 */
		    FMap.prototype.removeLegendDiv=function(){
			$('div').remove('.themeLegendDIV');
			}
		    /**
			 * 在地图上添加新的Marker
			 * 
			 * @author wangmeng 20140702
			 * @param a
			 *            Point.x 横坐标
			 * @param b
			 *            Point.y 纵坐标
			 * @param c
			 *            图片地址 ""
			 * @param d
			 *            图片宽度 单位：px
			 * @param e
			 *            图片高度 单位:px
			 */
		   FMap.prototype.addMarker=function(a,b,c,d,e){
			   var size = new MapLib.Size(d,e), offset = new MapLib.Pixel(
						-(size.w / 2), -size.h), icon = new MapLib.Icon(c, size, offset);
				var lonlat=new MapLib.LonLat(a,b);	
			   var marker = new MapLib.Marker(lonlat,icon);
				markerLayer.addMarker(marker);	
				return marker;
		   } 
		   //添加不提供清除方法的Marker 
		   FMap.prototype.addHardMarker=function(a,b,c,d,e){
			   var size = new MapLib.Size(d,e), offset = new MapLib.Pixel(
						-(size.w / 2), -size.h), icon = new MapLib.Icon(c, size, offset);
				var lonlat=new MapLib.LonLat(a,b);	
			   var marker = new MapLib.Marker(lonlat,icon);
				hardMarkerLayer.addMarker(marker);	
				return marker;
		   } 
		  /**
			 * 清空MarkerLayer图层所有Marker
			 * 
			 * @author wangmeng 20140702
			 */ 
		  FMap.prototype.clearMarkers=function(){
			  markerLayer.clearMarkers();
		  } 
		  
		   /**
			 * 在地图上添加新的Popup
			 * 
			 * @author wangmeng 20140702
			 */
		   FMap.prototype.addPopup=function(a){	
			   if(a)
			   this.map.addPopup(a);			   
		   } 
		   FMap.prototype.removePopup=function(a){
			   if(mapPopup){
				   this.map.removePopup(mapPopup);
			   }
			   if(a){
				   this.map.removePopup(a);
			   }
		   }
		  /**
			 * 清空MarkerLayer图层所有Popup
			 * 
			 * @author wangmeng 20140702
			 */ 
		  FMap.prototype.clearPopup=function(){
			if(map&&map._markerLayer&&map._markerLayer.map)
			 map._markerLayer.map.removePopup();
		  } 
		  /**
			 * 指定点在地图上居中显示/重新设置地图中心点
			 * 
			 * @author wangmeng 20140730
			 */
		  FMap.prototype.setCenter=function(x,y){
			 this.map.setCenter(new MapLib.LonLat(Number(x), Number(y)));
		  };
		  FMap.prototype.zoomTo=function(num){
			  this.map.zoomTo(num);
		  }
		  FMap.prototype.zoomOut=function(){
			  this.map.zoomOut();
		  }
		  FMap.prototype.zoomIn=function(){
			  this.map.zoomIn();
		  }
		    // 添加工具条的功能
		    var ToolBar =
		    	FMapLib.ToolBar = function(id,map,a){
		    	var div=id;
		    	var num=a;
		    	var me=this;		    	
		    	//this._div=id;
		    	this._map=map;
		    	var _htmlstring1="<div style='padding-top: 0px;width:25;height:auto;float:right;border-color:#CCCCFF;background-color:;filter: alpha(opacity=70);'>"+
				"<table width=100% height=100% style='table-layout:fixed;border:0px  border='0' cellspacing='1' cellpadding='1'  rules='none'><tbody><tr>"+
				"<td width='25' height='35' title='直接放大'><a id='magnify'  href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/zoom_in.png' style='border:0;width:25px;height:25px;'/></a></td></tr><tr>"+
		        "<td width='25' height='35' title='直接缩小'><a id='shrink'  href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/zoom_out.png' style='border:0;width:25px;height:25px;'/></a></td></tr><tr>"+
			    "<td width='25' height='35' title='框选放大'><a id='boxmagnify'  href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/d_zoom_in.png' style='border:0;width:25px;height:25px;'/></a></td></tr><tr>"+
		        "<td width='25' height='35' title='框选缩小'><a id='boxshrink'  href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/d_zoom_out.png' style='border:0;width:25px;height:25px;'/></a></td></tr><tr>"+
		        "<td width='25' height='35' title='漫游'><a id='roam'  href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/noact.png' style='border:0;width:25px;height:25px;'/></a></td></tr><tr>"+
				"<td width='25' height='35' title='清除'><a id='clear' href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/w_delete.png' style='border:0;width:25px;height:25px;'/></a></td></tr><tr>"+
				"<td width='25' height='35' title='测距'><a id='cj' href='#' ><img src='"+FMapLib.AccessURL+"/gis/resource/images/edit_polylinetool.png' style='border:0;width:25px;height:25px;'/></a></td></tr><tr>"+
				"<td width='25' height='35' title='测面'><a id='cm' href='#' ><img src='"+FMapLib.AccessURL+"/gis/resource/images/edit_autocompletepolygontool.png' style='border:0;width:25px;height:25px;'/></a></td></tr><tr>" +	
				"<td width='25' height='35' title='打印'><a id='print' href='#' ><img src='"+FMapLib.AccessURL+"/gis/resource/images/dy.gif' style='border:0;width:25px;height:25px;'/></a></td></tr>" +	
				"</tbody></table></div>"	
				var _htmlstring2="<div style='padding-top: 0px;width:305px;height:auto;float:right;border-color:#CCCCFF;background-color:;filter: alpha(opacity=70);'>"+
				"<table width=305px height=100% style='table-layout:fixed;border:0px  border='0' cellspacing='1' cellpadding='1'  rules='none'><tbody><tr>"+
				"<td width='20' height='35' title='直接放大'><a id='magnify'  href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/zoom_in.png' style='border:0;width:20px;height:20px;'/></a></td>"+
		        "<td width='20' height='35' title='直接缩小'><a id='shrink'  href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/zoom_out.png' style='border:0;width:20px;height:20px;'/></a></td>"+
			    "<td width='20' height='35' title='框选放大'><a id='boxmagnify'  href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/d_zoom_in.png' style='border:0;width:20px;height:20px;'/></a></td>"+
		        "<td width='20' height='35' title='框选缩小'><a id='boxshrink'  href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/d_zoom_out.png' style='border:0;width:20px;height:20px;'/></a></td>"+
		        "<td width='20' height='35' title='漫游'><a id='roam'  href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/noact.png' style='border:0;width:20px;height:20px;'/></a></td>"+
				"<td width='20' height='35' title='清除'><a id='clear' href='#'><img src='"+FMapLib.AccessURL+"/gis/resource/images/w_delete.png' style='border:0;width:20px;height:20px;'/></a></td>"+
				"<td width='20' height='35' title='测距'><a id='cj' href='#' ><img src='"+FMapLib.AccessURL+"/gis/resource/images/edit_polylinetool.png' style='border:0;width:20px;height:20px;'/></a></td>"+
				"<td width='20' height='35' title='测面'><a id='cm' href='#' ><img src='"+FMapLib.AccessURL+"/gis/resource/images/edit_autocompletepolygontool.png' style='border:0;width:20px;height:20px;'/></a></td>" +	
				"<td width='20' height='35' title='打印'><a id='print' href='#' ><img src='"+FMapLib.AccessURL+"/gis/resource/images/dy.gif' style='border:0;width:20px;height:20px;'/></a></td></tr>" +	
				"</tbody></table></div>"
				if(div!=""){
		    	$("#"+div).append(_htmlstring2);
				}
				else{
				var g = document.createElement("div");
				g.id = "mapToolBarDiv";				
				g.style.position = "absolute";
				if(num==1){
				//g.style.width = "10%";
				//g.style.height = "30%";
				g.style.top = "15%";
				g.style.right = "5%";				
				g.style.zIndex = 1006;
				this._map.map.viewPortDiv.appendChild(g);// map.viewPortDiv是所有自定义地图图层的父级容器
				$("#mapToolBarDiv").append(_htmlstring1);
				}else{
					g.style.width = "30%";
					g.style.height = "10%";
					g.style.top = "0%";
					g.style.right = "10%";
					// g.style.backgroundColor = "red";
					g.style.zIndex = 1006;
					this._map.map.viewPortDiv.appendChild(g);// map.viewPortDiv是所有自定义地图图层的父级容器
					$("#mapToolBarDiv").append(_htmlstring2);	
				 }
			   }
		    	$("#magnify").click(function() {
					me._magnify();// 清除功能
				});
		    	$("#shrink").click(function() {
					me._shrink();// 清除功能
				});
		    	$("#boxmagnify").click(function() {
					me._boxmagnify();// 清除功能
				});
		    	$("#boxshrink").click(function() {
					me._boxshrink();// 清除功能
				});
		    	$("#roam").click(function() {
					me._roam();// 清除功能
				});
		    	// 执行
		    	$("#clear").click(function() {
					me._clearfeatures();// 清除功能
				});
		    	$("#forward").click(function() {
					me._Forward();// 前进功能
				});
		    	$("#back").click(function() {
					me._Back();// 后退功能
				});
		    	$("#cj").click(function() {
					me._distancemeasure();// 测距功能
				});
		    	$("#cm").click(function() {
					me._areameasure();// 测面功能
				});
		    	$("#print").click(function() {
					me._print();// 打印功能
				});
		      
		    	// var center = new MapLib.LonLat(48892.64, 51001.71);
		    	var center = new MapLib.LonLat(FMapLib.MapCenter.x, FMapLib.MapCenter.y);
					centers_back.push(center);
					scales_back.push(this._map.map.getZoom());		
					this._map.map.events.on({"moveend": function() {me._handle_Action(this._map)}});
					
					//定义框选放大
				this.magnifyZoomBox = new MapLib.Control.ZoomBox({out:false});
				   this._map.map.addControl(this.magnifyZoomBox);
					//定义框选缩小
				this.shrinkZoomBox = new MapLib.Control.ZoomBox({out:true});
				   this._map.map.addControl(this.shrinkZoomBox);		
		    };
		    FMapLib.extend(ToolBar.prototype,{
		    	_clearfeatures : function (){
		    		this._map.clearAllFeatures()
		    	},
		    	// 前进功能
		    	 /**
					 * @author 李洪云 2014 1 24 前进后退功能
					 */
		 		_handle_Action : function(map) {
		 			if(isNewView) {
		 				centers_back.push(this._map.map.getCenter());
		 				scales_back.push(this._map.map.getZoom());
		 				centers_forward = [];
		 				scales_forward = [];
		 			}
		 			isNewView = true;
		 		},
                _magnify:function(){
                	this._map.map.zoomIn();
                },
                _shrink:function(){
                	this._map.map.zoomOut();
                },
                _boxmagnify:function(){                	
                	this.shrinkZoomBox.deactivate();
            		document.getElementById(this._map.id+"").style.cursor="pointer"; 		
            		this.magnifyZoomBox.activate();
                },
                _boxshrink:function(){
                	this.magnifyZoomBox.deactivate();
                	document.getElementById(this._map.id+"").style.cursor="pointer";  
            		this.shrinkZoomBox.activate();
                },
                _roam:function(){
                	this.magnifyZoomBox.deactivate();
            		this.shrinkZoomBox.deactivate();
            		document.getElementById(this._map.id+"").style.cursor="default";  
                },
		 		_Back:function () {
		 			var temp_center = centers_back.pop();
		 			var temp_scale = scales_back.pop();
		 			centers_forward.push(temp_center);
		 			scales_forward.push(temp_scale);
		 			isNewView = false;
		 			this._viewPreView(this._map);
		 			document.getElementById("forward").disabled = false;
		 			if(this._isFirstView()) {
		 				document.getElementById("back").disabled = true;
		 			}
		 		},

		 		_Forward : function () {
		 			isNewView = false;
		 			this._viewNextView(this._map);
		 			var temp_center = centers_forward.pop();
		 			var temp_scale = scales_forward.pop();
		 			centers_back.push(temp_center);
		 			scales_back.push(temp_scale);
		 			document.getElementById("back").disabled = false;
		 			if(this._isLastView()) {
		 				document.getElementById("forward").disabled = true;
		 			}
		 		},

		 		_viewPreView : function(map) {
		 			this._map.map.setCenter(centers_back[centers_back.length-1], scales_back[scales_back.length-1]);
		 		},

		 		_viewNextView : function(map) {
		 			this._map.map.setCenter(centers_forward[centers_forward.length-1], scales_forward[scales_forward.length-1]);
		 		},

		 		_isFirstView : function() {
		 			if(centers_back.length == 1) {
		 				return true;
		 			}
		 			else {
		 				return false;
		 			}
		 		},

		 		_isLastView : function() {
		 			if(centers_forward.length == 0) {
		 				return true;
		 			}
		 			else {
		 				return false;
		 			}
		 		},
		 		// 测距功能
		 		_distancemeasure : function(){
		 			var distancemeasure=new DistanceMeasureTool(this._map);
		 			distancemeasure.open();
		 		},
		 		// 测面
		 		_areameasure : function(){
		 			var areameasure=new AreaMeasureTool(this._map);
		 			areameasure.open();
		 		},
		 		// 打印功能
		 		_print : function(){
		 			new FMapLib.PrintMap(this._map.id);
		 		}
		    });
   /**
	 * @author 李洪云 2014 1 24 前进后退功能
	 */
	function handle_Action(map) {
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
		viewPreView(FMap.map);
		document.getElementById("forward").disabled = false;
		if(isFirstView()) {
			document.getElementById("back").disabled = true;
		}
	}

	var Forward=FMapLib.Forward=function () {
		isNewView = false;
		viewNextView(FMap.map);
		var temp_center = centers_forward.pop();
		var temp_scale = scales_forward.pop();
		centers_back.push(temp_center);
		scales_back.push(temp_scale);
		document.getElementById("back").disabled = false;
		if(isLastView()) {
			document.getElementById("forward").disabled = true;
		}
	}

	function viewPreView(map) {
		map.map.setCenter(centers_back[centers_back.length-1], scales_back[scales_back.length-1]);
	}

	function viewNextView(map) {
		map.map.setCenter(centers_forward[centers_forward.length-1], scales_forward[scales_forward.length-1]);
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
	var MouseWheelListener = FMapLib.MouseWheelListener = function(id,map) {
		this._map = map;
		this._div=id;
	};
	MouseWheelListener.prototype.open=function(){
		var me=this;
		$('#' + this._div).mousewheel(function(event, delta) {
			if (delta > 0) {
				me._map.map.zoomIn();
			} else if (delta < 0) {
				me._map.map.zoomOut();
			}
		});      
	}
	// 获得当前缩放级别
	MouseWheelListener.prototype.getZoom=function(){
		var me=this;
		var zoom=me._map.map.getZoom();
		return zoom;
	}
	// ///////////////////////////////////////////////////////////////////////////////////////
	var mapPopup;
	var MapAlert
	/**
	 * 查询结果在地图串口上方弹出事件
	 * 参数：id:地图窗口的id，tip：信息框提示语句，message：弹出的内容，sucess：是否弹出，默认填true
	 */
	=FMapLib.MapAlert=function (map, tip, message, success) {	
		if (mapPopup) {
			map.removePopup(mapPopup);
		}
		if (tip) {
			tip += ':';
		}	
		var layer = vectorLayer;
		var lonlat;
		
		if(tip.indexOf('错误信息')>-1){
			var buffercenter=map.getCenter();
			lonlat = new MapLib.LonLat(buffercenter.lon,buffercenter.lat);
		}else{
			if(layer.features[0]&&layer.features[0].geometry){
			var geometry =layer.features[0].geometry;
			var bounds = geometry.bounds;
			lonlat = new MapLib.LonLat(bounds.right,bounds.top);
			}else{
				lonlat = map.getCenter();
			}
		}		
		var contentHTML = "<div id='mapPopup' style=\'font-size:.9em; opacity: 0.7; overflow-y:hidden;\'>"; 
		contentHTML += "<div>"+tip+'<br/>'+message+"</div></div>";  
		
		mapPopup = new MapLib.Popup.FramedCloud("popwin",lonlat,null,contentHTML,null,true); 
		map.addPopup(mapPopup); 
		
	};
// ///////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 面积测量工具API
	 */
	var AreaMeasureTool = FMapLib.AreaMeasureTool = function(map,boolean) {
		this._map=map;// 测量的地图名称
		this._area;// 面积测量结果
		this.unit;// 结果单位
		this.domapalert=boolean && true;// 是否在地图窗口上方显示测量结果,true,为显示；false为不现实。默认为显示
		// 当前地图清空图层
		//this._map.clearAllFeatures();
		map.clearAllFeatures();
		//
		this._style = {
			strokeColor : "#304DBE",
			strokeWidth : 2,
			pointerEvents : "visiblePainted",
			fillColor : "#304DBE",
			fillOpacity : 0.8
		};
		// 对线图层应用样式style（前面有定义）
		vectorLayer.style = this._style;
	}
	// open方法
	AreaMeasureTool.prototype.open = function() {
		var me=this;
		// this._map=map;
		if (drawPoint) {
			drawPoint.deactivate();
		}
		if (drawLine) {
			drawLine.deactivate();
		}
		drawPolygon = new MapLib.Control.DrawFeature(vectorLayer,
				MapLib.Handler.Polygon);
		this._map.map.addControl(drawPolygon);
		drawPolygon.events.on({
			"featureadded" : drawCompletedA
		});
		drawPolygon.activate();
		// 画面完成双击鼠标触发事件
		function drawCompletedA(drawGeometryArgs) {
			// 停止画线画面控制
			drawPolygon.deactivate();
			// 获得图层几何对象
			var geometry = drawGeometryArgs.feature.geometry, measureParam = new MapLib.REST.MeasureParameters(
					geometry), /*
								 * MeasureParameters：量算参数类。
								 * 客户端要量算的地物间的距离或某个区域的面积
								 */
			myMeasuerService = new MapLib.REST.MeasureService(FMapLib.DemoURL.fangchan); // 量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
			myMeasuerService.events.on({
				"processCompleted" : measureCompletedAA
			});
			// 对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
			myMeasuerService.measureMode = MapLib.REST.MeasureMode.AREA;
			myMeasuerService.processAsync(measureParam); // processAsync负责将客户端的量算参数传递到服务端。
		}
		function measureCompletedAA(measureEventArgs) {
			// var me=this;
			var area = measureEventArgs.result.area, unit = measureEventArgs.result.unit,chineseunit;
			if(unit=="METER"){
				me.unit="平方米";
			}
			var areafloat = parseFloat(area);
			var areachar = AreaMeasureTool.prototype._changeTwoDecimal(areafloat);
			me._area=areachar;
			if(me.domapalert!=false){
			if (me.area != -1) {
				MapAlert(me._map, "量算结果", me._area + me.unit, true);
			}
			}
		}
	}
	// close方法
	AreaMeasureTool.prototype.close = function() {
		drawPolygon.deactivate();
	}
	// 绘完触发事件
	FMapLib.extend(AreaMeasureTool.prototype,{
		
		/**
		 * 四舍五入
		 */
		_changeTwoDecimal:function(x) {
			var f_x = parseFloat(x);
			if (isNaN(f_x)) {
				alert('function:changeTwoDecimal->parameter error');
				return false;
			}
			var f_x = Math.round(x * 100) / 100;
			return f_x;
		}
	});
	// 显示面积测量结果
	AreaMeasureTool.prototype.getArea=function(){
		return this._area;
	}
	// 设置是否显示查询结果弹出框
	AreaMeasureTool.prototype.setMapAlert=function(boolean){
		this.domapalert=boolean;
	}
	// 显示测量结果弹出框
	AreaMeasureTool.prototype.doMapAlert=function(){
		if (this.area != -1) {
			MapAlert(this._map, "量算结果", this._area + this.unit, true);
		}
	}
// //////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 根据建设日期查询楼幢面
	 */
	var BuildingQueryByDate = FMapLib.BuildingQueryByDate = function(map,bignum,smallnum,rownum) {
		this._map=map;
		this.condition;// 查询的sql语句
		this.resultnum;// 查询的结果数量
		this._bignum;// 最大建成年代
		this._smallnum;// 最小建成年代
		this._rownum;// 查询记录数
		// 赋值
		if(this._bignum==null)
			{
			this._bignum=bignum || 0;
			}
		
		if(this._smallnum==null){
			this._smallnum=smallnum || 0;
		}
		if(this._rownum==null){
			this._rownum=rownum || 0;
		}
		
		vectorLayer.removeAllFeatures();
	};
	// open方法
	BuildingQueryByDate.prototype.open = function() {
		var me=this;
		var filter;
		if(this._bignum==0){
			if(this._rownum==0){
				if(this._smallnum==0){
					this.condition=null;
				}
				else{
					this.condition="and to_number(to_char(builddate,'yyyy')) >"+this._smallnum;
				}
				
			}
			else{
				this.condition="and to_number(to_char(builddate,'yyyy')) >"+this._smallnum +"and rownum<"+this._rownum;
			}
			}
		else{
			if(this._rownum==0){
				if(this._small==0){
					this.condition="and to_number(to_char(builddate,'yyyy'))<"+this._bignum;
				}
				else{
					this.condition="and to_number(to_char(builddate,'yyyy')) >="+this._smallnum+"and to_number(to_char(builddate,'yyyy'))<"+this._bignum;
				}
			}
			else{
				this.condition="and to_number(to_char(builddate,'yyyy')) >="+this._smallnum+"and to_number(to_char(builddate,'yyyy'))<"+this._bignum+" and rownum<"+this._rownum;
			}
			}
		if(this.condition!=null){
			filter="builddate is not null " + this.condition;
		var completed=this._dQueryProcessCompleted;
		this._HouseQueserv(filter);
		}
		else{
			alert("查询条件为空");
			}
	};
	FMapLib.extend(BuildingQueryByDate.prototype,{
		_HouseQueserv:
			// 房屋图层查询服务 公用方法
			function (attribufilter){
			   var me=this;
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
								"processCompleted" : dQueryProcessCompleted,
								"processFailed" :this. _processFailed
							}
						});
				queryBySQLService.processAsync(queryBySQLParams);
				function dQueryProcessCompleted(queryEventArgs) {
					// 对查询结果进行渲染
					me.resultnum=queryEventArgs.result.totalCount;
					me._render(queryEventArgs);
				}
		},
				_addSelect:function(){
					// 定义选择控件
					var me=this;
					var selectFeature = new MapLib.Control.SelectFeature(vectorLayer, {
						onSelect : onFeatureSelect,
						onUnselect : onFeatureUnselect
					});
					selectFeature.repeat = true;
					this._map.addControl(selectFeature);
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
						var popup = new MapLib.Popup.FramedCloud("popwin",
								new MapLib.LonLat(x, y), null, contentHTML, null, true,
								null, true);
						feature.popup = popup;
						me._map.map.addPopup(popup);
					}
					// 图形丢失选中状态后
					function onFeatureUnselect(feature) {
						me._map.map.removePopup(feature.popup);
						feature.popup.destroy();
						feature.popup = null;
					}
							},
					_render:
							function (queryEventArgs){
								var i, j, feature, result = queryEventArgs.result;
								var style = {
									strokeColor : "#304DBE",
									strokeWidth : 1,
									fillColor : "#304DBE",
									fillOpacity : "0.8"
								};
								// if (result.recordsets[0].features.length >
								// 30) {
								// alert("查询结果数目较大，请耐心等待...");
								// }
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
									// alert("您感兴趣的地物有（" + j + "）个");
									this._panto(2);
								} else {

									if (j > 10 && j <= 30) {
										// alert("您感兴趣的地物有（" + j + "）个");
										this._panto(2);
									} else {
										if (result.recordsets[0].features.length > 30) {
											// alert("您感兴趣的地物有（" + j + "）个");
											this._panto(2);
										}

										else {
											// alert("抱歉，未查到任何结果，请重新输入查询条件！");
										}
									}
								}
								this._addSelect();
							},
			/**
			 * 查询失败 公用方法
			 */
			_processFailed:function(e) {
				MapAlert(this._map.map, "", e.error.errorMsg, true);
			},
			// 日期查询结束
			_panto:function(zoomValue) {
				// map.zoomTo(7);
				this._map.map.zoomTo(zoomValue);
				var bound = vectorLayer.getDataExtent();
				var lonlat = bound.getCenterLonLat();
				this._map.map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
			}
	});
	BuildingQueryByDate.prototype.getSQLWorld=function(){
		return this.condition;
	}	
	BuildingQueryByDate.prototype.getResultNUM=function(){
		return this.resultnum;
	}
	BuildingQueryByDate.prototype.setBigNUM=function(bignum){
		this._bignum=bignum;
	}
	BuildingQueryByDate.prototype.setSmallNUM=function(smallnum){
		this._smallnum=smallnum;
	}
	BuildingQueryByDate.prototype.setRowNUM=function(rownum){
		this._rownum=rownum;
	}
// /////////////////////////////////////////////////////////////////////////////////////////////////////
	var Render=FMapLib.Render=
	/**
	 * 对房屋查询结果进行面渲染 公用方法
	 * 
	 * @param 房屋查询结果集
	 */
	function (result){
		var i, j, feature;
		this._result =result;
		var style = {
			strokeColor : "#304DBE",
			strokeWidth : 1,
			fillColor : "#304DBE",
			fillOpacity : "0.8"
		};
		// if (result.recordsets[0].features.length > 30) {
		// alert("查询结果数目较大，请耐心等待...");
		// }
		if (result ) {
			for (i = 0; i < result.length; i++) {
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
			// alert("您感兴趣的地物有（" + j + "）个");
			this._panto(2);
		} else {

			if (j > 10 && j <= 30) {
				// alert("您感兴趣的地物有（" + j + "）个");
				this._panto(2);
			} else {
				if (result.length > 30) {
					// alert("您感兴趣的地物有（" + j + "）个");
					this._panto(2);
				}

				else {
					
				}
			}
		}
	}
	FMapLib.extend(Render.prototype,{
		_panto:function(zoomValue) {
			// map.zoomTo(7);
			this._map.map.zoomTo(zoomValue);
			var bound = vectorLayer.getDataExtent();
			var lonlat = bound.getCenterLonLat();
			this._map.map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
		}
	});
	// ////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 项目测绘建筑查询(包含楼盘表)
	 */
	var BuildingsFromSurvey = FMapLib.BuildingsFromSurvey = function(map,conditions) {
		this._conditions=conditions;// 查询条件
		this._map=map;// 地图
		this._resultnum;// 结果数量
		this.result;// 结果
		vectorLayer.removeAllFeatures();
	};

	BuildingsFromSurvey.prototype.open = function() {
		var me=this;
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
			attributeFilter : "ST_RIDRGN.SMUSERID >"+me._conditions,
			joinItems : [ joinItem ]

		}), queryBySQLParams = new MapLib.REST.QueryBySQLParameters({
			queryParams : [ queryParam ]
		// queryOption:"GEOMETRY"
		}), queryBySQLService = new MapLib.REST.QueryBySQLService(
				FMapLib.DemoURL.fangchan, {
					eventListeners : {
						"processCompleted" :surveyProcessCompleted,
						"processFailed" : this._processFailed
					}
				});
		queryBySQLService.processAsync(queryBySQLParams);
		// 查询完成调用事件
		function surveyProcessCompleted(queryEventArgs){
			me.result=queryEventArgs.result;
			me._resultnum=me.result.totalCount;
			me._getSMIDandRender();
		}
	}
	FMapLib.extend(BuildingsFromSurvey.prototype,{
		/**
		 * 空间查询结束（需要获取smuserid）
		 */
		_getSMIDandRender:function() {
			var i, j, feature;
			var smuserid = "";
			var style = {
				strokeColor : "#304DBE",
				strokeWidth : 1,
				fillColor : "#304DBE",
				fillOpacity : "0.8"
			};
			// if (result.recordsets[0].features.length > 30) {
			// alert("查询结果数目较大，请耐心等待...");
			// }
			if (this.result && this.result.recordsets) {
				for (i = 0; i < this.result.recordsets.length; i++) {
					if (this.result.recordsets[i].features) {
						for (j = 0; j < this.result.recordsets[i].features.length; j++) {
							feature = this.result.recordsets[i].features[j];

							smuserid = smuserid+
									this.result.recordsets[i].features[j].attributes["ST_RIDRGN.SMUSERID"]
									+ ',';

							feature.style = style;
							vectorLayer.addFeatures(feature);

						}
					}
				}
			}

			if (j > 0 && j <= 10) {
				// alert("您感兴趣的地物有（" + j + "）个");
				this._panto(2);
			} else {

				if (j > 10 && j <= 30) {
					// alert("您感兴趣的地物有（" + j + "）个");
					this._panto(2);
				} else {
					if (this.result.recordsets[0].features.length > 30) {
						// alert("您感兴趣的地物有（" + j + "）个");
						this._panto(2);
					}

					else {
						// alert("抱歉，未查到任何结果，请重新输入查询条件！");
					}
				}
			}
			// alert(smuserid.length);
			this._getaccessdata(smuserid);
		},
	_getaccessdata:function(id){
		var me=this;
		// 弹出查询结果列表
		$.ajax({   
			async:false,   
			url: FMapLib.AccessURL+"/eap/access.buildingquelist",   
			type:"GET",   
			dataType: 'jsonp',   
			jsonp:'jsoncallback', 
			timeout:50000,    
			data:{smid:id},
			success: function(data, textStatus){
				me.result=data;
				// alert(data);
			
				
			// }
// window.open('realtygis.buildingquelist?fea=' + id + '0',
// '_blank',
// 'depended=yes,width=475,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
		var selectFeature = new MapLib.Control.SelectFeature([ vectorLayer,vectorLayer2 ],{
			onSelect : onSurveyFeatureSelect,
			onUnselect : onSurveyFeatureUnselect
		});
		selectFeature.repeat = true;
		me._map.map.addControl(selectFeature);
		selectFeature.activate();
			}
		});
		function onSurveyFeatureSelect(feature) {
			BuildingQuery(feature,me._map);
		}
		/**
		 * 图形丢失选中状态后 公用方法
		 */
		function onSurveyFeatureUnselect(feature) {
			me._map.removePopup(feature.popup);
			feature.popup.destroy();
			feature.popup = null;
		}
		},
		
	_processFailed:function(e){
		MapAlert(map, "", e.error.errorMsg, true);
	},
	_panto:function(zoomValue) {
		// map.zoomTo(7);
		this._map.map.zoomTo(zoomValue);
		var bound = vectorLayer.getDataExtent();
		var lonlat = bound.getCenterLonLat();
		this._map.map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
	}
	});
	// 获得查询结果数量
	BuildingsFromSurvey.prototype.getResultNUM=function(){
		return this._resultnum;
	}
// /////////////////////////////////////////////////////////////////////////////////////
	var BuildingQuery=FMapLib.BuildingQuery=
	/**
	 * 查询选定楼幢的楼幢信息 公用方法
	 * 
	 * @param feature
	 *            楼幢面要素object类型
	 * @return String
	 */
	function(feature,map){
		this.contentHTML = "";
		this._map=map;
		var me=this;
		$.ajax({
			url: FMapLib.AccessURL+"/eap/access.buildingqueryfromsurvey",   
			type:"POST",   
			dataType: 'jsonp',   
			jsonp:'jsoncallback', 
			timeout:50000,    
					data:{
						id : (feature.attributes['ST_RIDRGN.SMUSERID']==undefined?feature.attributes['SMUSERID']:feature.attributes['ST_RIDRGN.SMUSERID'])

					},
					success : function(data, textStatus, jqXHR) {
						if (textStatus == 'success') {
                          var item=data[0];
							me.contentHTML = "<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden; background:#FFFF33';width:150px;height:50px>"
								+ "<span style='font-weight: bold; font-size: 18px;'>详细信息</span><br>";
						me.contentHTML += "<div>"
								+ "<table width='395' border='1' cellspacing='0'>"
								+ "<tr>"
								+ "<td width=25% height='20' align='left'>幢内内码"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.building_id == "" ? "暂无数据</td>"
										: item.building_id
												+ "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>项目测绘流程内码"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.surverproject_id == "" ? "暂无数据</td>"
										+ "</tr>"
										: item.surverproject_id
												+ "</td>" + "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>施测单位"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.unit == "" ? "暂无数据</td>"
										: item.unit + "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>测绘比例"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.surver == "" ? "暂无数据</td>"
										+ "</tr>" : item.surver
										+ "</td>" + "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>设计用途"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.use_desgin == "" ? "暂无数据</td>"
										: item.use_desgin + "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>房屋产别"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.real_type == "" ? "暂无数据</td>"
										+ "</tr>"
										: item.real_type + "</td>"
												+ "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>总套内建筑面积"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.tn_area == "" ? "暂无数据</td>"
										: item.tn_area + "平方米"
												+ "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>总分摊共用面积"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.ft_area == "" ? "暂无数据</td>"
										+ "</tr>" : item.ft_area
										+ "平方米" + "</td>" + "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>总建筑面积"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.build_area == "" ? "暂无数据</td>"
										: item.build_area + "平方米"
												+ "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>总不分摊面积"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.noft_area == "" ? "暂无数据</td>"
										+ "</tr>"
										: item.noft_area + "平方米"
												+ "</td>" + "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>总不计面积"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.no_area == "" ? "暂无数据</td>"
										: item.no_area + "平方米"
												+ "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>面积校核差值"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.discrepant_area == "" ? "暂无数据</td>"
										+ "</tr>"
										: item.discrepant_area
												+ "</td>" + "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>建成时间"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.building_date == "" ? "暂无数据</td>"
										: item.building_date
												+ "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>测绘日期"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.sruver_date == "" ? "暂无数据</td>"
										+ "</tr>"
										: item.sruver_date
												+ "</td>" + "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>幢号"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.building_number == "" ? "暂无数据</td>"
										: item.building_number
												+ "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>幢坐落"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.building_address == "" ? "暂无数据</td>"
										+ "</tr>"
										: item.building_address
												+ "</td>" + "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>层数"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.floor_count == "" ? "暂无数据</td>"
										: item.floor_count
												+ "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>结构"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.struct == undefined ? "暂无数据</td>"
										+ "</tr>"
										: item.struct + "</td>"
												+ "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>套数"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.house_count == "" ? "暂无数据</td>"
										: item.house_count
												+ "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>幢编号"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.graphics_code == "" ? "暂无数据</td>"
										+ "</tr>"
										: item.graphics_code
												+ "</td>" + "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>丘地号（丘号）"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.graphics_number == "" ? "暂无数据</td>"
										: item.graphics_number
												+ "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>所在楼盘内码"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.building_mapid == undefined ? "暂无数据</td>"
										+ "</tr>"
										: item.building_mapid
												+ "</td>" + "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>入库时间"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.input_date == "" ? "暂无数据</td>"
										: item.input_date + "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>地上层数"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.floorup_count == "" ? "暂无数据</td>"
										+ "</tr>"
										: item.floorup_count
												+ "</td>" + "</tr>");
						me.contentHTML += "<tr>"
								+ "<td width=25% height='20' align='left'>地下层数"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.floordown_count == "" ? "暂无数据</td>"
										: item.floordown_count
												+ "</td>");
						me.contentHTML += "<td width=25% height='20' align='left'>结束日期"
								+ "</td>"
								+ "<td width=25% height='20' align='left'>"
								+ (item.surver_enddate == "" ? "暂无数据</td>"
										+ "</tr>"
										+ "</table>"
										+ "</div>"
										: item.surver_enddate
												+ "</td>" + "</tr>"
												+ "</table>"
												+ "</div>");
						me.contentHTML += "<div>"
								+ "<a onclick=window.open('realtygis.housejson?building_id="
								+ item.building_id
								+ "&method=houseQue','_blank','depended=yes,width=900,height=500,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes')>点击查看楼盘表</a>"
								+ "<div>" + "</div>";
						}
					var x = feature.geometry.getBounds().getCenterLonLat().lon;
					var y = feature.geometry.getBounds().getCenterLonLat().lat;
					// 初始化一个弹出窗口，当某个地图要素被选中时会弹出此窗口，用来显示选中地图要素的属性信息
					var popup = new MapLib.Popup.FramedCloud("popwin",
							new MapLib.LonLat(x, y), new MapLib.Size(400, 370),
							me.contentHTML, null, true, null, true);
					popup.autoSize = false;
					feature.popup = popup;
					me._map.map.addPopup(popup);
					}
				});
	}
	
// /////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 图形丢失选中状态后 公用方法
	 */
	onSurveyFeatureUnselect = function(feature) {
		map.removePopup(feature.popup);
		feature.popup.destroy();
		feature.popup = null;
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
				new MapLib.LonLat(x, y), new MapLib.Size(400, 370),
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
	// //////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * @author Administrator
	 * @param map,
	 *            为操作的地图实例化对象，如 var map=new FMapLib.FMap(); new
	 *            FMapLib.DistanceMeasureTool(map); 距离测算API
	 */
	var DistanceMeasureTool = FMapLib.DistanceMeasureTool = function(map,boolean) {
		this._map=map;
		this._distance;// 长度测量结果
		this.unit;// 结果单位
		this.domapalert=boolean && true;// 是否在地图窗口上方显示测量结果,true,为显示；false为不现实。默认为显示
		map.clearAllFeatures();
		/*if ($('#mapAlert').size()) {
			$('div').remove('#mapAlert');
		}
		this._map.map.removeControl(drawPoint);*/
		this._style = {
			strokeColor : "#304DBE",
			strokeWidth : 2,
			pointerEvents : "visiblePainted",
			fillColor : "#304DBE",
			fillOpacity : 0.8
		};
		// 对线图层应用样式style（前面有定义）
		vectorLayer.style = this._style;
	};
	// 应用打开
	DistanceMeasureTool.prototype.open = function() {
		var me=this;
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
		this._map.map.addControl(drawLine);
		drawLine.events.on({
			"featureadded" : drawLineCompleted
		});
		drawLine.activate();
		// 绘完触发事件
		function drawLineCompleted(drawGeometryArgs) {
			// 停止画线控制
			drawLine.deactivate();
			// 获得图层几何对象
			var geometry = drawGeometryArgs.feature.geometry, measureParam = new MapLib.REST.MeasureParameters(
					geometry), /*
								 * MeasureParameters：量算参数类。
								 * 客户端要量算的地物间的距离或某个区域的面积
								 */
			myMeasuerService = new MapLib.REST.MeasureService(FMapLib.DemoURL.fangchan); // 量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
			myMeasuerService.events.on({
				"processCompleted" : distanceMeasureCompleted
			});
			// 对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
			myMeasuerService.measureMode = MapLib.REST.MeasureMode.DISTANCE;
			myMeasuerService.processAsync(measureParam); // processAsync负责将客户端的量算参数传递到服务端。
		}
		// 测量结束调用事件
		function distanceMeasureCompleted(measureEventArgs) {
			var distance = measureEventArgs.result.distance, unit = measureEventArgs.result.unit,chineseunit;
			if(unit=="METER"){
				me.unit="米";
			}
			var float = parseFloat(distance);
			me._distance = me._changeTwoDecimal(float);
			if(me.domapalert!=false){
			if (distance != -1) {
				MapAlert(me._map, "量算结果", me._distance + me.unit, true);
			}
		}
		}
	};
	// 应用关闭
	DistanceMeasureTool.prototype.close = function() {
		drawLine.deactivate();
	};
	FMapLib.extend(DistanceMeasureTool.prototype,{
		
		_changeTwoDecimal: function(x){
			var f_x = parseFloat(x);
			if (isNaN(f_x)) {
				alert('function:changeTwoDecimal->parameter error');
				return false;
			}
			var f_x = Math.round(x * 100) / 100;
			return f_x;
		}
	});
	// 显示距离测量结果
	DistanceMeasureTool.prototype.getDistance=function(){
		return this._distance;
	}
	// 设置是否显示查询结果弹出框
	DistanceMeasureTool.prototype.setMapAlert=function(boolean){
		this.domapalert=boolean;
	}
	// 显示测量结果弹出框
	DistanceMeasureTool.prototype.doMapAlert=function(){
		if (this._distance != -1) {
			MapAlert(this._map, "量算结果", this._distance + this.unit, true);
		}
	}
// ////////////////////////////////////////////////////////////////////////////////////////////////
	// 根据房屋地址查询类
	var HouseQueryByName = FMapLib.HouseQueryByName = function(string,map) {
		this.condition = "";
		this._resultnum;// 结果数量
		this._result;// 结果
		this.bite;
		this._map=map;// 地图名称
		vectorLayer.removeAllFeatures();
		this.condition += " and ADDRESS like '%" + string + "%'";
	};
	HouseQueryByName.prototype.open = function() {
		var filter="1=1 " + this.condition;
		this._housequeserv(filter);
	};
	FMapLib.extend(HouseQueryByName.prototype,{
		_housequeserv:function (attribufilter){
			   var me=this;
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
								"processCompleted" : dQueryProcessCompleted,
								"processFailed" :this. _processFailed
							}
						});
				queryBySQLService.processAsync(queryBySQLParams);
				
				function dQueryProcessCompleted(queryEventArgs) {
					// 对查询结果进行渲染
					me._resultnum=queryEventArgs.result.totalCount;
					me._render(queryEventArgs);
				}
		},
		_render:function (result){
			var i, j, feature;
			this._result =result.result;
			var style = {
				strokeColor : "#304DBE",
				strokeWidth : 1,
				fillColor : "#304DBE",
				fillOpacity : "0.8"
			};
			// if (result.recordsets[0].features.length > 30) {
			// alert("查询结果数目较大，请耐心等待...");
			// }
			if  (this._result && this._result.recordsets) {
				for (i = 0; i < this._result.recordsets.length; i++) {
					if (this._result.recordsets[i].features) {
						for (j = 0; j < this._result.recordsets[i].features.length; j++) {
							feature = this._result.recordsets[i].features[j];
							feature.style = style;
							vectorLayer.addFeatures(feature);
						}
					}
				}
			}
			if (j > 0 && j <= 10) {
				// alert("您感兴趣的地物有（" + j + "）个");
				panto(2);
			} else {

				if (j > 10 && j <= 30) {
					// alert("您感兴趣的地物有（" + j + "）个");
					this._panto(2);
				} else {
					if (this._result.recordsets[0].features.length > 30) {
						// alert("您感兴趣的地物有（" + j + "）个");
						this._panto(2);
					}

					else {
						
					}
				}
			}
		},
		 _panto: function(zoomValue) {
			this._map.map.zoomTo(zoomValue);
			var bound = vectorLayer.getDataExtent();
			var lonlat = bound.getCenterLonLat();
			this._map.map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
		}	
	});
	// 返回查询结果数量
	HouseQueryByName.prototype.getResultNum=function(){
		return this._resultnum;
	}
// //////////////////////////////////////////////////////////////////////////////////////////////////////
//	// 地图打印功能
//	var PrintMap = FMapLib.PrintMap = function(map) {
//		var me=this;
//		this._map=map;
//		this._id=this._map.mapdiv;
//		this._broz = MapLib.Browser.name;// 浏览器
//		this._printWindow = window.open("");// 打开新的窗口
//		var strInnerHTML = document.getElementById(this._id).innerHTML;
//		var strHeader = "<!DOCTYPE html><html><head><META HTTP-EQUIV='pragma' CONTENT='no-cache'><META HTTP-EQUIV='Cache-Control' CONTENT='no-cache, must-revalidate'><META HTTP-EQUIV='expires' CONTENT='Wed, 26 Feb 1997 08:21:57 GMT'><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' /><meta name='apple-mobile-web-app-capable' content='yes' /><title>地图打印</title>";
//		var strCSS = "<link href="+FMapLib.AccessURL+"/gis/FMapLib/theme/css/sm.css rel='stylesheet' /><link href="+FMapLib.AccessURL+"/gis/FMapLib/theme/css/style.css  rel='stylesheet' /><link href="+FMapLib.AccessURL+"/gis/FMapLib/theme/css/sm-responsive.css rel='stylesheet'><link href="+FMapLib.AccessURL+"/gis/FMapLib/theme/css/sm-doc.css rel='stylesheet' />";
//		var strScript = "<script src="+FMapLib.AccessURL+"/gis/FMapLib/theme/js/jquery-latest.js></script><script type = 'text/javascript'>"
//				+ "\n"
//				+ "function printDiv(){$('.newuiPrint').css({'display':'none'});window.print();$('.newuiPrint').css({'display':'block'});}</script>";
//		var strBody = "</head><body><div class='print-header'><div class='superD'><h3>地图</h3></div><div id='"
//				+ this._id
//				+ "' style='width:100'>"
//				+ strInnerHTML
//				+ "</div><div id='superft'><div class='printClose'>"
//				+ "<span class='newuiPrint' onclick = 'printDiv()'></span></div></div></div><style></style></body></html>";
//		var strHTML = strHeader + strCSS + strScript + strBody;
//		this._printWindow.document.write(strHTML);
//		this._printWindow.document.close();
//		function onloadHTML(){
//            var strDOM =me._printWindow.document.getElementById(me._id).getElementsByTagName("div");
//            for(var i = 0, length = strDOM.length; i < length ; i++){
//                var idStr = strDOM[i].id;
//                var width= parseInt(strDOM[i].style.width);
//                if(width>"256"){
//                	strDOM[i].style.width ="100%";
//            }
//                if(idStr != "" && idStr.indexOf("MapLib.Control.ScaleLine") == -1 && idStr.indexOf("MapLib.Control") != -1){
//                	strDOM[i].style.display="none";
//                }
//                if(idStr == "satellite"){
//                	strDOM[i].style.display="none";
//                }
//                var leftdistance=strDOM[i].offsetLeft;
//               if(strDOM[i].offsetLeft >250){
//            	   strDOM[i].style.left=strDOM[i].offsetLeft-250;
//               }
//            }
//            
//            var canvasPrint = me._printWindow.document.getElementsByTagName("canvas");
//            var canvasMap = document.getElementsByTagName("canvas");
//            for(var i = 0,length = canvasPrint.length;i< length;i++){
//            pasteCanvas(canvasMap[i],canvasPrint[i]);
//            }
//        }
//        if (this._broz == 'firefox') {
//            this._printWindow.onload = onloadHTML;
//        } else if (this._broz == 'safari'||this._broz == 'chrome'||this._broz == 'msie') {
//            window.setTimeout(onloadHTML,50);
//        }
//    function pasteCanvas(canvasMap,canvasPrint){
//        var contextMap = canvasMap.getContext('2d');
//        var imagedataMap=contextMap.getImageData(0,0,canvasMap.width,canvasMap.height);
//        var contextPrint = canvasPrint.getContext('2d');
//        contextPrint.putImageData(imagedataMap, 0, 0);        
//    }
//}
// ///////////////////////////////////////////////////////////////////////////////////////////////////////
	var QuerySurrounding=
		/**
		 * 周边查询ＡＰＩ及函数封装
		 */
		// 功能初始化函数，参数：map，地图名称
		FMapLib.QuerySurrounding =function(map){	
			this._area;// 查询面积
			this._centerpoint;// 查询范围中心点
			this._distance=0;// 查询距离
			this._map=map || {};// 查询的地图名称
		};
		// 功能打开函数，开启标注功能
		QuerySurrounding.prototype.open=function(){
			var me=this;
			if (drawPolygon) {
				drawPolygon.deactivate();
			}
			if (drawLine) {
				drawLine.deactivate();
			}
			this._drawPoint = new MapLib.Control.DrawFeature(vectorLayer,
					MapLib.Handler.Point);
			this._map.map.addControl(this._drawPoint);
			this._drawPoint.activate();
			this._drawPoint.events.on({
				"featureadded" : drawPointCompleted|| {}
			});
			function drawPointCompleted(drawGeometryArgs) {
				 me._drawPoint.deactivate();//关闭画点控件
				 var feature = drawGeometryArgs.feature;
				 var point=feature.geometry;
//				var size = new MapLib.Size(32, 32), offset = new MapLib.Pixel(
//						-(size.w / 2), -size.h), icon = new MapLib.Icon(
//								FMapLib.AccessURL+"/gis/FMapLib/theme/images/markerbig.png", size, offset);
//				var marker = new MapLib.Marker(new MapLib.LonLat(point.x,point.y),
//						icon);
//				markerLayer.addMarker(marker);
				me._setCenterPoint(point);
				
				if(me._distance==0){
					me._doMarkerAlert(point);
				}
				else{
					me._doBuffer();
				}
			}
		}
		// 标注功能关闭函数，并清除地图上产生的各种覆盖物
		QuerySurrounding.prototype.close=function(){
			markerLayer.clearMarkers();
			vectorLayer.removeAllFeatures();
			if (popup) {
				markerLayer.map.removePopup(popup);
			}
			if (this._drawPoint) {
				this._drawPoint.deactivate();
			}
			if ($('#mapAlert').size()) {
				$('div').remove('#mapAlert');
			}
		}
		FMapLib.extend(QuerySurrounding.prototype,{
			_doMarkerAlert:function(point){
				var me=this;
				if (popup) {
					me._map.map.removePopup(point.popup);
				}
				var contentHTML = "<div style='font-size:.8em; opacity: 0.8; width:150px; height:80px;'>"
					+ "<span style='font-weight: bold; font-size: 18px;'>缓冲区信息</span><br>"
					+ "<div>缓冲半径(米):<input id='distancevalue' style:'width:250px; height:400px' type='text'/></br></br>"					
					+ "<button  id='butr' >开始分析" + "</div>";
				var popup = new MapLib.Popup.FramedCloud("chicken", new MapLib.LonLat(
						point.x, point.y), null, contentHTML, null, true);
				popup.panMapIfOutOfView = true;
				this._map.map.addPopup(popup);
				preFeature = point;
				preFeature.popup=popup;
				$("#butr").click(function() {
					me._doBuffer();// 可以执行了
				});
			},
			// 缓冲区分析功能
			_doBuffer:function () {
				var me=this;
				var styleRegion = {
					strokeColor : "#304DBE",
					strokeWidth : 2,
					pointerEvents : "visiblePainted",
					fillColor : "#304DBE",
					fillOpacity : 0.4
				};
				if(me._distance==0){
					var dtvalue = $('#distancevalue').val();
					this._distance=parseInt(dtvalue);
				}
				//绘制缓冲圈
				var polygon = MapLib.Geometry.Polygon.createRegularPolygon(
						me._centerpoint, me._distance, 100, 360);
				var feature=new MapLib.Feature();
				feature.geometry = polygon;
				feature.style = styleRegion;
				vectorLayer.addFeatures(feature);
				this._queryByGeometry(polygon);
				this._map.map.removePopup(preFeature.popup);
				this._drawPoint.deactivate();
			},
			// 几何查询功能
			_queryByGeometry: function(queryGeometry) {
				var me=this;
				var queryParam = new MapLib.REST.FilterParameter({
					name : "ST_RIDRGN_SAFE_P@ORCL"
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
					"processFailed" : this._processFailed
				});
				queryService.processAsync(queryByGeometryParameters);
				function queryByGeoCompleted(queryEventArgs) {
					var radius = $('#distancevalue').value;
					var i, j, result = queryEventArgs.result;
					if (result && result.recordsets) {
						for (i = 0, recordsets = result.recordsets, len = recordsets.length; i < len; i++) {
							if (recordsets[i].features) {
								for (j = 0; j < recordsets[i].features.length; j++) {
									var geometry = recordsets[i].features[j].geometry, 
									// point = geometry.getCentroid(),
									point=geometry,
									size = new MapLib.Size(22, 20), 
									offset = new MapLib.Pixel(-(size.w / 2), -size.h), 
									icon = new MapLib.Icon(baseurl + "theme/images/house.png", size,offset);
									var marker = new MapLib.Marker(new MapLib.LonLat(
											point.x, point.y), icon);
									marker.information = recordsets[i].features[j];
									markerLayer.addMarker(marker);
									marker.events.on({
										//"mouseover":querymarkeralert,
										"click":querymarkeralert,
										"scope" : marker
									});
								}								
								MapAlert(me._map, "查询结果", "在该查询范围内的房屋" + j + "座", true);
							}
						}
					}
				}
				//Marker信息窗
					function  querymarkeralert() {
						me._querymarker=this;
						me._map.map.removePopup(preFeature.popup);
						var querymarkerlonlat = me._querymarker;
						var querymarkerX = querymarkerlonlat.getLonLat().lon;// X坐标;
						var querymarkerY = querymarkerlonlat.getLonLat().lat;// Y坐标
						var attributes=querymarkerlonlat.information.attributes;						
						var address = attributes.ADDRESS;
						var builddate=attributes.BUILDDATE;						
						var floors=attributes.FWCS;//房屋层数
						var struct=attributes.JZJG;//建筑结构
						var ownershipstate=attributes.OWNERSHIP_STATE;//产权状态
						var unit=attributes.SJLY;//基础数据来源
						var checkstate=attributes.CHECKSTATE=="1" ? "已普查":"未普查";
						var checkstate2=attributes.CHECKSTATE2=="1" ? "已检查":"未检查";
						var checkstate3=attributes.CHECKSTATE3=="1" ? "已鉴定":"未鉴定";//鉴定状态
						var safegrade=attributes.SAFEGRADE=="-1"?"未定":attributes.SAFEGRADE+"级";
					    var checkgrade=attributes.CHECKGRADE=="-1"?"未定":attributes.SAFEGRADE+"级";
						var testgrade=attributes.TESTGRADE=="-1"?"未定":attributes.SAFEGRADE+"级";							
					    var markercontentHTML = "<div style='font-size:.8em; opacity: 0.8; width:150px; height:80px;'>"
									+ "<span style='font-weight: bold; font-size: 18px;'>房屋信息</span><br>"									
									+ "<table width='350px' border='0'cellpadding='0' cellspacing='1' bgcolor='#dee2e3' style=' border-color:#F3F3F3;line-height:30px;margin-left:15px'>"
									  + "<tr>"
									  + "<td class='td12'>房屋地址</td>"
									  + "<td class='td13'>"+address+"</td>"									 
									  + "<td class='td12'>建设日期</td>"
									  + "<td class='td13'>"+builddate+"</td>"
									  + "</tr>"
									  + "<tr>"
									  + "<td class='td12'>房屋层数</td>"
									  + "<td class='td13'>"+floors+"</td>"									
									  + "<td class='td12'>建筑结构</td>"
									  + "<td class='td13'>"+struct+"</td>"
									  + "</tr>"									
									  + "<tr>"
									  + "<td class='td12'>普查状态</td>"
									  + "<td class='td13'>"+checkstate+"</td>"									
									  + "<td class='td12'>普查等级</td>"
									  + "<td class='td13'>"+safegrade+"</td>"
									  + "</tr>"
									  + "<tr>"
									  + "<td class='td12'>检查状态</td>"
									  + "<td class='td13'>"+checkstate2+"</td>"									 
									  + "<td class='td12'>检查等级</td>"
									  + "<td class='td13'>"+checkgrade+"</td>"
									  + "</tr>"
									  + "<tr>"
									  + "<td class='td12'>鉴定状态</td>"
									  + "<td class='td13'>"+checkstate3+"</td>"									
									  + "<td class='td12'>鉴定等级</td>"
									  + "<td class='td13'>"+testgrade+"</td>"
									  + "</tr>"									  								 
									  + "</table>";
					
						popup = new MapLib.Popup.FramedCloud("chicken", new MapLib.LonLat(
								querymarkerX, querymarkerY), null, markercontentHTML, null,
								true);
						querymarkerlonlat.popup = popup;
						popup.panMapIfOutOfView = true;
						markerLayer.map.addPopup(popup);
						preFeature = querymarkerlonlat;
					}
				
			},
			// 若是没有查询结果，执行的函数
			   _processFailed: function() {
				alert("参数不正确");
			},
			_setCenterPoint:function(a){
				this._centerpoint=a;
			}
		});
	FMapLib.QuerySurrounding.prototype.getCenterPoint = function() {
		// var me=this;
		var point;
		point = this._centerpoint;
		return point;
	}
	FMapLib.QuerySurrounding.prototype.setDistance=function(dis){
		this._distance=dis;
	}
	FMapLib.QuerySurrounding.prototype.getArea = function() {
		var area = 3.14 * this._distance;
		return area;
	}
	// ////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 根据名称查询小区API
	 */
	var VillageQueryByName =
		/**
		 * @param string
		 * @returns {FMapLib.VillageQueryByName} example 不带参数 var
		 *          villageFindInst=new FMapLib.VillageQueryByName();
		 *          villageFindInst.open(); 带参数 var villageFindInst=new
		 *          FMapLib.VillageQueryByName("群盛华城"); villageFindInst.open();
		 */
		FMapLib.VillageQueryByName = function(string,map) {
		    this._map=map;// 地图
		    this._param;// 查询条件
			// 判断是否输入参数
			if (string == undefined) {
				this._param = "SMID > 0";
			} else {
				this._param = "REFNAME  like '%" + string + "%'";
			}
			markerLayer.clearMarkers();
		};
		// open函数
		VillageQueryByName.prototype.open = function() {
			var me=this;
			var params = this._param;
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
							"processFailed" : me._processFailed
						}
					});
			getFeatureBySQLServiceVillage.processAsync(getFeatureBySQLParamsVillage);
		
		// 小区查询成功
		function processCompletedVillage(getFeaturesEventArgs) {
			var i, len, features, feature, result = getFeaturesEventArgs.result;
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
						"mouseover" : me._villageInfo,
						"scope" : marker
					});
					marker.events.on({
						"mouseout" : me._destroy,
						"scope" : marker
					});
					marker.events.on({
						"click" : function(){map.zoomTo(10);me._findHouseBySQL();},
						"scope" : marker
					});
				} 
			}
		}
		};
    FMapLib.extend(VillageQueryByName.prototype,{
			// 销毁
	    _destroy : function() {
				markerLayer.map.removePopup(popup);
			},
			// 小区信息窗口显示
	    _villageInfo : function(){
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
			},
	/**
	 * 查询某小区辖区内所有房屋
	 */
	 _findHouseBySQL : function() {
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
						"processCompleted" :me._processCompletedFangwu,
						"processFailed" : processFailed
					}
				});
		getFeatureBySQLServiceFangwu.processAsync(getFeatureBySQLParamsFangwu);
	},
	// 房屋查询成功
	 _processCompletedFangwu : function(getFeaturesEventArgs2) {
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
		function onFeatureSelect(feature) {
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
	},

	// 房屋查询失败
	 _processFailed:function(e) {
	 MapAlert(map, "", e.error.errorMsg, true);
	 }
		});
// ////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
	 * 添加地图影像切换器
	 */
	var SatelliteMapSwitcher = FMapLib.SatelliteMapSwitcher = function(map) {
		this._map=map;
		var me=this;
		var insertHtml = "<div  id='satellite'"
		+ "style='border-style: solid; cursor: pointer; border-color: gray; border-width: 2px; position: absolute; float: right;height:50px; '>"
		+ "<a><img id='changemap' border='0' title='显示卫星地图' "
		+ "src="+FMapLib.AccessURL+"/gis/FMapLib/theme/images/satellite.png  width=50px height=50px /></a>"
		+ "</div>"
		+ "<div id='satellite2'"
		+ "style='text-align: center; cursor: pointer; position: absolute; float: right;padding-bottom:0px; width: 52px; height: 18px;'>"
		+ "<a id='changemap2' title='显示卫星地图'"
		+ "style='height: auto; color: white;'" + ">卫星</a>" + "</div>";
		// 在地图图层中自定义地图转换器图层mapswitcherDiv，做为地图转换器实现的基础容器。20131218 wm
		var g = document.createElement("div");
		g.id = "mapswitcherDiv";
		g.style.position = "absolute";
		g.style.width = "5%";
		g.style.height = "25%";
		g.style.top = "0%";
		g.style.right = "1%";
		// g.style.backgroundColor = "red";
		g.style.zIndex = 1005;
		this._map.map.viewPortDiv.appendChild(g);// map.viewPortDiv是所有自定义地图图层的父级容器
		$("#mapswitcherDiv").append(insertHtml);
		$("#changemap").bind("click", function() {
			me._switchmap();
		});
		$("#changemap").bind("mouseover", function() {
			me._changecolor();
		});
		$("#changemap").bind("mouseout", function() {
			me._removecolor();
		});
		$("#changemap2").bind("click", function() {
			me._switchmap();
		});
		$("#changemap2").bind("mouseover", function() {
			me._changecolor();
		});
		$("#changemap2").bind("mouseout", function() {
			me._removecolor();
		});
	};
   FMapLib.extend(SatelliteMapSwitcher.prototype,{
		_switchmap : function() {
			var me=this;
			if (bGoogle == false) {
				this._map.map.removeLayer(this._map.map.baseLayer);
				this._map.map.addLayer(imagelayer);
				this._map.map.setBaseLayer(imagelayer);
				$("#changemap").attr("src",  FMapLib.AccessURL+"/gis/FMapLib/theme/images/changemap.png");
				$("#changemap").attr("title", "显示普通地图");
				$("#satellite2").attr("title", "显示普通地图");
				$("#changemap2").text("地图");
				$("#changemap2").css("color",'black');
				bGoogle = true;
				this._map.clearAllFeatures();
			//	MapAlert(this._map.mapdiv,"当前地图为：", "影像图");
			} else {
				this._map.map.removeLayer(this._map.map.baseLayer);
				this._map.map.addLayer(currentlayer[0]);
				this._map.map.setBaseLayer(currentlayer[0]);
				$("#changemap").attr("src", FMapLib.AccessURL+"/gis/FMapLib/theme/images/satellite.png");
				$("#changemap").attr("title", "显示卫星地图");
				$("#changemap2").attr("title", "显示卫星地图");
				$("#changemap2").text("卫星");
				$("#changemap2").css("color",'white');
				bGoogle = false;
				this._map.clearAllFeatures();				
			}
		},

		_changecolor : function() {
			$("#satellite2").css({
				"background" : "#9999FF"
			});
			$("#satellite").css({
				"border-color" : "#9999FF"
			});
		},
		_removecolor : function() {
			$("#satellite2").css({
				"background" : ""
			});
			$("#satellite").css({
				"border-color" : "gray"
			});
		}
   });

// //////////////////////////////////////////////////////////////////////////////////////////////////////
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
		FMapLib.VersonManager = function(id1, map, id2) {
		var htmlStr = "<div id='blk3' class='blk' style='display: none;'>"
				+ "<div class='head'>"
				+ "<div class='head-right'></div>"
				+ "</div>"
				+ "<div class='main'>"
				+ "<h2>查看地图历史版本</h2>"
				+ "<a href='javascript:void(0)' id='close3' class='closeBtn'>关闭</a>"
				+ "<ul class='lishi'>" 
// + ">平面图-2013-1</a></li>" + "<li class='l4'><a href='#' id='1'"
// + ">平面图-2013-2</a></li>" + "<li class='l4'><a href='#' id='2'"
// + ">平面图-2013-3</a></li>" + "<li class='l4'><a href='#' id='3'"
                + "</ul>" 
				+ "</div>"
				+ "<div class='foot'>" + "<div class='foot-right'></div>"
				+ "</div>" + "</div>";
		$("#" + id1).append(htmlStr);
		var versionHTML="";
		$.post('realtygis.versionmanagerpopup', function(data, textStatus) {
			var jdata = jQuery.parseJSON(data);
			var len = jdata.root.length;
			for (i = 0; i < len; i++) {
				if (jdata.root[i].id&&jdata.root[i].status=="启用") {
				
					versionHTML+=	" <li class='l4'>"
					                 +   "<a href='#' id='"+(jdata.root[i].rownum-1)+"'  class='vmap'>"+jdata.root[i].version_num+"</a>"
					                 +" </li>"
				         
				}
			}
			$(".lishi").append(versionHTML);
			$('.vmap').bind("click", function(event) {
				changemap(event.target, map);
			});
		});
	// alert(versionHTML);
		// $(".main").load("realtygis.versionmanagerpopup");
		
		
		new PopupLayer({
			trigger : "#" + id2,
			popupBlk : "#blk3",
			closeBtn : "#close3",
			useFx : true,
			offsets : {
				x : -570,
				y : 50
			}
		});
		
	};
	function changemap(obj, map) {
		var objText = obj.innerText;
		if (objText === undefined) {
			objText = obj.text;
		}

		var objId = obj.id;
		map.removeLayer(map.baseLayer);
		map.addLayer(layersArr[objId]);
	// alert("当前地图为：" + objText);// 不添加alert在火狐中会提示this.map.layer为空
		currentlayer[0] = layersArr[objId];
		tipAlert("地图版本号为：" + objText + "&nbsp", "审核人：王霞" + "&nbsp" + "发布人：王霞");
		cutText = objText;
	}
	// })();
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
					// alert(data.toString());
					var jdata = jQuery.parseJSON(data);
					var conn = "";
					var len = jdata.root.length;
					for (i = 0; i < len; i++) {
						if (jdata.root[i].building_mapid) {
							conn += jdata.root[i].building_mapid + ',';
						}
					}
					// 解决多余逗号问题
					conn += "0";
					// alert(conn);
					housequery(conn);
					
				});
			
		}
		// 根据mapid查询地图房屋图层
		function housequery(conn) {
			var con = "";
			con = "and SMUSERID in(" + conn + ")";
			// alert(_buildingmapid[0]);
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
		
		
	　　　　　　var MapIdenty=
			/**
			 * 根据ＳＭＵＳＥＲＩＤ到目标表获取对应地物并在地图上标记出来
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
							// alert(xmlstringstart);
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
													+ "<image id='hiddenbutton' src='/gis/resource/images/right.png'/>"
													+ "</div>" + "</div>");
							// 生成饼状图

							// document.getElementById("chart").innerhtml='';
							var chart = new FusionCharts(
									"/gis/FMapLib/theme/images/Pie2D.swf",
									"ChartColumnId", "500", "300", "0", "1");
							chart.setDataXML(xmlstringstart);
							chart.render("chart");
							$("#close").live("click", function() {
								// alert("ok");
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
																	"/gis/resource/images/left.gif");
												} else {
													document
															.getElementById("chart").style.display = "block";
													document
															.getElementById("close").style.display = "block";
													$("#hiddenbutton")
															.attr("src",
																	"/gis/resource/images/right.png");
												}
											});
						});

	}
	/**
	 * @author 李洪云 2013 12 27 制定范围内查询（可见视野范围内查询和拉框查询） 五个参数：boundsname，查询的范围
	 *         boundsname，查询方位的名称，可以是地图（superMap。map）类型，也可以是空间数据gemotry类型的
	 *         filedname，属性字段值名称，要求必须和数据空中属性表里的名称一致； firstnum，数值型，查询范围的最小值，最小为0；
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
	        MapAlert(map, "查询结果", "在该查询范围内的房屋" + j + "座", true);
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
		    // 定义专题图类型
		    var src;// 定义专题图模版的路径
		    if(themetype=="饼状图"){
		    	src=FMapLib.AccessURL+"/gis/FMapLib/theme/images/Pie2D.swf";
		    }
		    else{
		    	src=FMapLib.AccessURL+"/gis/FMapLib/theme/images/Column2D.swf"
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
			var themehtml="<div id='themelegend' style ='border:solid 1px black;position: absolute; float: left; left: 60px;" +
					" top: 300px; opacity: 1; z-index: 1002; width: auto; height: auto;'>" +
					"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<a>图例</a>" +
					"<table id='timetable' border='0' cellspacing='6' cellpadding='0'>";
			// 向后台发送请求
			$.ajax({   
				async:false,   
				url: FMapLib.AccessURL+"/eap/access.allhousetheme",   
				type:"GET",   
				dataType: 'jsonp',   
				jsonp:'jsoncallback', 
				timeout:50000,    
				data:{programes:params},
				success: function(data, textStatus) {
								// var jdata = data[0].range_name;
								var firstsuffix="";
								var secondsuffix="";
								var lastsuffix="";
								if(params=="buildarea"){
									firstsuffix="平方米以上";
									secondsuffix="平方米";
									lastsuffix="平方米以下";
								}
									if(params=="builddata"){
										firstsuffix="年以前";
										secondsuffix="年";
										lastsuffix="年以后";
									}

								var xmlstring = "<set name='"
										+ data[0].range_name
										+ firstsuffix+"' value='"
										+ data[0].range_value + "' color='"
										+ color[0] + "'/>";
								var htmlstring = "&nbsp&nbsp<tr><td width='15' height='7' bgcolor='"+color[0]+"'></td>"+
								"<td width='100' height='7'><a>"+data[0].range_name+firstsuffix+"</a></td></tr>";
								xmlstringstart += xmlstring;
								themehtml+=htmlstring;
								for (i = 1; i < data.length - 1; i++) {
									var xmlstring = "<set name='"
											+ data[i].range_name
											+ secondsuffix+"' value='"
											+ data[i].range_value
											+ "' color='" + color[i] + "'/>";
										var htmlstring="<tr><td width='15' height='7' bgcolor='"+color[i]+"'></td>"+
									"<td width='140' height='7'><a>"+data[i].range_name+secondsuffix+"</a></td></tr>" ;
									xmlstringstart += xmlstring;
									themehtml +=  htmlstring;
									
								}
								var j = data.length - 1;
								var xmlstring = "<set name='"
										+ data[j].range_name
										+lastsuffix+ "' value='"
										+ data[j].range_value + "' color='"
										+ color[j] + "'/>";
								var htmlstring="<tr><td width='15'  height='7' bgcolor='"+color[j]+"'></td>"+
								"<td width='100' height='7'><a>"+data[j].range_name+lastsuffix+"</a></td><tr>"
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
								var map=FMap.map;
								map.viewPortDiv.appendChild(g);
								$("#parentchart")
										.append(
												"<div id='retheme' class='blk' style='position: absolute; float: right; right: 60px; top: 100px; opacity: 1; z-index: 999; width: 450px; height: 100px;'>"
														+ "<a id='close' class='closeBtn'>关闭</a>"
														+ "<div id='chart' align='center'></div>"
														+ "<div id='hidden' style='position: absolute; right: -50px; top: 125px; opacity: 1; z-index: 999; width: 8px; height: 50px;'>"
														+ "<image id='hiddenbutton' src='"+FMapLib.AccessURL+"/gis/resource/images/right.png'/>"
														+ "</div>" + "</div>");
								// 生成饼状图
								piechart = new FusionCharts(src,"ChartPieId", "500", "300", "0", "1");
								piechart.setDataXML(xmlstringstart);
								piechart.render("chart");
								// 现实图例
								$("#map").append(themehtml);
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
																		FMapLib.AccessURL+"/gis/resource/images/left.gif");
													} else {
														document
																.getElementById("chart").style.display = "block";
														document
																.getElementById("close").style.display = "block";
														$("#hiddenbutton")
																.attr("src",
																		FMapLib.AccessURL+"/gis/resource/images/right.png");
													}
												});
							}
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
				  		var map=FMap.map;
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
								 	var piechart = new FusionCharts(FMapLib.AccessURL+"/gis/FMapLib/theme/images/Column2D.swf","regionChartPieId", "50", "100", "0", "1");
									piechart.setDataXML(xmlstringstart);
									piechart.setTransparent(true);
									piechart.render(regionname);
				  			}
					                var themehtml="<div id='themelegend' style ='border:solid 1px black;position: absolute; float: left; left: 60px;" +
									" top: 300px; opacity: 1; z-index: 1002; width: auto; height: auto;'>" +
									"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<a>图例</a>" +
									"<table id='timetable' border='0' cellspacing='6' cellpadding='0'>"+
									"<tr><td width='15'  height='7' bgcolor='"+color[0]+"'></td>"+
									"<td width='100' height='7'><a>建筑面积</a></td><tr>"+
									"<tr><td width='15'  height='7' bgcolor='"+color[1]+"'></td>"+
									"<td width='100' height='7'><a>建筑数量</a></td><tr>"+
									"</tr></table></div>";
					                $("#map").append(themehtml);
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
		$.ajax({   
			async:false,   
			url: FMapLib.AccessURL+"/eap/access.regionthemebystructure",   
			type:"GET",   
			dataType: 'jsonp',   
			jsonp:'jsoncallback', 
			timeout:50000,    
			data:"",
			success: function(data, textStatus) {
			  // var jdata = jQuery.parseJSON(data);
               // 获得每个行政区的中心点，并与数据对应
		  		getregionParam = new MapLib.REST.FilterParameter({
		  			name : "asdR@ORCL"
		  		});
		  		getregionBySQLParams = new MapLib.REST.QueryBySQLParameters({
		  			queryParams : [getregionParam]
		  				});
		  		 getregionBySQLService = new MapLib.REST.QueryBySQLService(FMapLib.DemoURL.fangchan,{
		  					eventListeners : {
		  						"processCompleted" : processCompletedextent,
		  						"processFailed" : processFailed
		  					}
		  				});
		  		getregionBySQLService.processAsync(getregionBySQLParams);
		        RegionThemePie.prototype.info=data;
			}
		  });
	}
		  	// 获得所有行政区中心点病句数据对应
		  	function processCompletedextent(queryEventArgs) {
		  		var i, len, features, feature, result = queryEventArgs.result;
		  		
		  		var color = new Array('AFD8F8', 'F6BD0F', '8BBA00', 'FF8E46', '008E8E',
				'D64646');
		  		if (result && result.recordsets) {
		  			var map=FMap.map;
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
			                    var themehtml="<div id='themelegend' style ='border:solid 1px black;position: absolute; float: left; left: 60px;" +
								" top: 300px; opacity: 1; z-index: 1002; width: auto; height: auto;'>" +
								"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<a>图例</a>" +
								"<table id='timetable' border='0' cellspacing='6' cellpadding='0'>";
			                    if(regionname =="历下区"){
		  				        	var extentnum=RegionThemePie.prototype.info[0];
		  				             point = new MapLib.Geometry.Point(60160.13, 44719.15);
		  				        }
		  				        if(regionname =="历城区"){
		  				        	var extentnum=RegionThemePie.prototype.info[4];
		  				        	 point = new MapLib.Geometry.Point(74004.32, 43217.69);
		  				        }
		  				        if(regionname =="市中区"){
	  				        	    var extentnum=RegionThemePie.prototype.info[1];
	  				        	     point = new MapLib.Geometry.Point(41655.73, 35571.01);
	  				            }
		  				        if(regionname =="槐荫区"){
	  				        	   var extentnum=RegionThemePie.prototype.info[2];
	  				        	    point = new MapLib.Geometry.Point(32283.01, 55639.77);
	  				            }
		  				       if(regionname =="天桥区"){
  				        	        var extentnum=RegionThemePie.prototype.info[3];
  				        	        point = new MapLib.Geometry.Point(43705.11, 63787.93);
  				                }
		  				       if(regionname =="高新区"){
  				        	        var extentnum=RegionThemePie.prototype.info[5];
  				                 }
		  				       if(regionname =="长清区"){
  				        	        var extentnum=RegionThemePie.prototype.info[6];
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
						 	var piechart = new FusionCharts(FMapLib.AccessURL+"/gis/FMapLib/theme/images/Pie2D.swf","regionChartPieId", "200", "200", "0", "1");
							piechart.setDataXML(xmlstringstart);
							piechart.setTransparent(true);
							piechart.render(regionname);
							$("#map").append(themehtml);
		  			}
		  		}
		  		
		  	}
	 /**
		 * @author 李洪云 2014 1 10 可见视野范围专题图
		 */
	 var ThemeByExtent=FMapLib.ThemeByExtent=
		 function(parmas,themetype){
		 var map=FMap.map;
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
	        var infonum=null;
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
	        infonum=info.toString();// 将数组处理为字符串，方便传递参数
	        var src,themetype=ThemeByExtent.prototype.themetype,params= ThemeByExtent.prototype.parmas;// 定义专题图模版的路径
		    if(themetype=="饼状图"){
		    	src=FMapLib.AccessURL+"/gis/FMapLib/theme/images/Pie2D.swf";
		    }
		    else{
		    	src=FMapLib.AccessURL+"/gis/FMapLib/theme/images/Column2D.swf"
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
			var themehtml="<div id='themelegend' style ='border:solid 1px black;position: absolute; float: left; left: 60px;" +
			" top: 300px; opacity: 1; z-index: 1002; width: auto; height: auto;'>" +
			"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<a>图例</a>" +
			"<table id='timetable' border='0' cellspacing='6' cellpadding='0'>";
			$.ajax({   
				async:false,   
				url: FMapLib.AccessURL+"/eap/access.housethemebyextent",   
				type:"POST",   
				dataType: 'jsonp',   
				jsonp:'jsoncallback', 
				timeout:50000,    
				data:{programes:params,info:infonum},
				success: function(data, textStatus) {
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
								+ data[0].range_name
								+ firstsuffix+"' value='"
								+ data[0].range_value + "' color='"
								+ color[0] + "'/>";
						var htmlstring = "&nbsp&nbsp<tr><td width='15' height='7' bgcolor='"+color[0]+"'></td>"+
						"<td width='100' height='7'><a>"+data[0].range_name+firstsuffix+"</a></td></tr>";
						xmlstringstart += xmlstring;
						themehtml+=htmlstring;
						for (i = 1; i < data.length - 1; i++) {
							var xmlstring = "<set name='"
									+ data[i].range_name
									+ secondsuffix+"' value='"
									+ data[i].range_value
									+ "' color='" + color[i] + "'/>";
							var htmlstring="<tr><td width='15' height='7' bgcolor='"+color[i]+"'></td>"+
							"<td width='140' height='7'><a>"+data[i].range_name+secondsuffix+"</a></td></tr>" ;
							xmlstringstart += xmlstring;
							themehtml +=  htmlstring;
						}
						var j = data.length - 1;
						var xmlstring = "<set name='"
								+ data[j].range_name
								+lastsuffix+ "' value='"
								+ data[j].range_value + "' color='"
								+ color[j] + "'/>";
						var htmlstring="<tr><td width='15'  height='7' bgcolor='"+color[j]+"'></td>"+
						"<td width='100' height='7'><a>"+data[j].range_name+lastsuffix+"</a></td><tr>"
						xmlstringstart += xmlstring;
						themehtml+=htmlstring;
						xmlstringstart += "</graph>";
						themehtml+="</tr></table></div>";

						// 弹出 div
						var map=FMap.map;
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
												+ "<image id='hiddenbutton' src='"+FMapLib.AccessURL+"/gis/resource/images/right.png'/>"
												+ "</div>" + "</div>");
						// 生成饼状图
						piechart = new FusionCharts(src,"regionChartPieId", "500", "300", "0", "1");
						piechart.setDataXML(xmlstringstart);
						
						piechart.render("chart");
						$("#map").append(themehtml);
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
																FMapLib.AccessURL+"/gis/resource/images/left.gif");
											} else {
												document
														.getElementById("chart").style.display = "block";
												document
														.getElementById("close").style.display = "block";
												$("#hiddenbutton")
														.attr("src",
																FMapLib.AccessURL+"/gis/resource/images/right.png");
											}
										});
				}
					});
	}
	 /**
		 * 拉框专题图
		 */
	 var ThemeByDrop=FMapLib.ThemeByDrop=
		 function(parmas,themetype){
		 drawPolygon = new MapLib.Control.DrawFeature(vectorLayer,
					MapLib.Handler.Polygon);
		 var map=FMap.map;
			map.addControl(drawPolygon);
			drawPolygon.events.on({
				"featureadded" : drawCompleteddrop
			});
			drawPolygon.activate();
			 ThemeByExtent.prototype.parmas=parmas;
		     ThemeByExtent.prototype.themetype=themetype;
	 }
	function drawCompleteddrop(drawGeometryArgs){
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
		 queryService.events.on({"processCompleted":ThemeByDropCompleted,
			                     "processFailed":queryFailed
			                    });
		 queryService.processAsync(queryByGeometryParameters);
		
		 }
	 function ThemeByDropCompleted(queryEventArgs) {  
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
	        var infonum=info.toString();
	        var src,themetype=ThemeByExtent.prototype.themetype,params= ThemeByExtent.prototype.parmas;// 定义专题图模版的路径
		    if(themetype=="饼状图"){
		    	src=FMapLib.AccessURL+"/gis/FMapLib/theme/images/Pie2D.swf";
		    }
		    else{
		    	src=FMapLib.AccessURL+"/gis/FMapLib/theme/images/Column2D.swf"
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
			var themehtml="<div id='themelegend' style ='border:solid 1px black;position: absolute; float: left; left: 60px;" +
			" top: 300px; opacity: 1; z-index: 1002; width: auto; height: auto;'>" +
			"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<a>图例</a>" +
			"<table id='timetable' border='0' cellspacing='6' cellpadding='0'>";
			$.ajax({   
				async:false,   
				url: FMapLib.AccessURL+"/eap/access.housethemebyextent",   
				type:"POST",   
				dataType: 'jsonp',   
				jsonp:'jsoncallback', 
				timeout:50000,    
				data:{programes:params,info:infonum},
				success:function(data, textStatus) {
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
								+ data[0].range_name
								+ firstsuffix+"' value='"
								+ data[0].range_value + "' color='"
								+ color[0] + "'/>";
						var htmlstring = "&nbsp&nbsp<tr><td width='15' height='7' bgcolor='"+color[0]+"'></td>"+
						"<td width='100' height='7'><a>"+data[0].range_name+firstsuffix+"</a></td></tr>";
						xmlstringstart += xmlstring;
						themehtml+=htmlstring;
						for (i = 1; i < data.length - 1; i++) {
							var xmlstring = "<set name='"
									+ data[i].range_name
									+ secondsuffix+"' value='"
									+ data[i].range_value
									+ "' color='" + color[i] + "'/>";
							var htmlstring="<tr><td width='15' height='7' bgcolor='"+color[i]+"'></td>"+
							"<td width='140' height='7'><a>"+data[i].range_name+secondsuffix+"</a></td></tr>" ;
							xmlstringstart += xmlstring;
							themehtml +=  htmlstring;
						}
						var j = data.length - 1;
						var xmlstring = "<set name='"
								+ data[j].range_name
								+lastsuffix+ "' value='"
								+ data[j].range_value + "' color='"
								+ color[j] + "'/>";
						var htmlstring="<tr><td width='15'  height='7' bgcolor='"+color[j]+"'></td>"+
						"<td width='100' height='7'><a>"+data[j].range_name+lastsuffix+"</a></td><tr>"
						xmlstringstart += xmlstring;
						themehtml+=htmlstring;
						xmlstringstart += "</graph>";
						themehtml+="</tr></table></div>";

						// 弹出 div
						var map=FMap.map;
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
												+ "<image id='hiddenbutton' src='"+FMapLib.AccessURL+"/gis/resource/images/right.png'/>"
												+ "</div>" + "</div>");
						// 生成饼状图
						piechart = new FusionCharts(src,"regionChartPieId", "500", "300", "0", "1");
						piechart.setDataXML(xmlstringstart);
						
						piechart.render("chart");
						$("#map").append(themehtml);
						$("#close").live("click", function() {
							// alert("ok");
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
																FMapLib.AccessURL+"/gis/resource/images/left.gif");
											} else {
												document
														.getElementById("chart").style.display = "block";
												document
														.getElementById("close").style.display = "block";
												$("#hiddenbutton")
														.attr("src",
																FMapLib.AccessURL+"/gis/resource/images/right.png");
											}
										});
				                  }
					      });
	      }
	 
 /**
 * @class 楼幢非空间属性编辑(录入,修改,查看)类
 * @author zhanglf 
 * @params map FMap实例  callback 客户端传入的回调函数
 */
	var	ChooseHouse=		
		FMapLib.ChooseHouse=function(map,callback){				
		var housefeature=null;
		   //  var drawPoint=this._drawPoint;		  	    	 
	    if ($('#mapAlert').size()) {
				$('div').remove('#mapAlert');
		}
	   var stylePoint = this._pointStyle = {
			        strokeColor: "black",
			        strokeOpacity: 1,
			        strokeDashstyle: "solid",
			        fillColor: "black",
			        pointRadius: 0
			    };
	   var styleHouse = this._houseStyle = {
					strokeColor: "#000000",
			        strokeWidth: 2,
			        pointerEvents: "visiblePainted",
			        fillColor: "#6699CC",
			        fillOpacity: 0.8
			};	

	   var d=new FMapLib.PointDrawer(map,stylePoint,drawPointFinished);
	//内部方法1  画点结束	
		function drawPointFinished(drawGeometryArgs){				
				d.destory();				
				housefeature=drawGeometryArgs.feature;
				queryNewHouseP(housefeature.geometry);				
		}
	 // 内部方法2 新建房屋点数据集分析
        function queryNewHouseP(geometry){
		var queryParam,queryByDistanceParameters,queryService;
		queryParam = new MapLib.REST.FilterParameter({name: "NEW_HOUSE_P@ORCL"});// ST_RIDRGN_SAFECHE@ORCL
		queryByDistanceParameters = new MapLib.REST.QueryByDistanceParameters({
			queryParams: [queryParam], 			
			geometry:geometry,
			 distance:5,// 查询的最大距离半径,可根据需要修改
			// isNearest:true,
			expectCount:1// 希望返回的地物的数量，此处指定返回一个对象
			// returnContent:true
	    });
		queryService= new MapLib.REST.QueryByDistanceService(FMapLib.DemoURL.fangchan, {
		eventListeners: {
			"processCompleted": processNewHousePCompleted,
			"processFailed": processHouseFailed
		}
	    });
	    queryService.processAsync(queryByDistanceParameters);
    	//内部方法2-1 新建房屋点数据集分析
         function processNewHousePCompleted(queryEventArgs) {  		
  		   var i, j, result = queryEventArgs.result;
  		  if (result && result.recordsets) {
  			for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
  				if (recordsets[i].features==null || recordsets[i].features=='' ){    					
  					queryStRidrgnSafeche(geometry);//
  					break;
  				}else {    					
  					for (j=0; j<recordsets[i].features.length; j++) {
  						var feature = recordsets[i].features[j];
  						feature.style = styleHouse;
  						vectorLayer2.addFeatures(feature);
  						housefeature = feature;    	
  						callback(feature);     						
  					}
  				}
  			}
  		 }
  	    }
       //内部方法2-2 
         function processHouseFailed(e){
        	 alert(e);
         }
         
      }
	// 内部方法3  房屋数面据集分析
      function queryStRidrgnSafeche(geometry){
		var queryParam, queryByGeometryParameters, queryService;
		queryParam = new MapLib.REST.FilterParameter({name: FMapLib.resource_path.tab_safehouse});// ST_RIDRGN_SAFECHE@ORCL
		queryByGeometryParameters = new MapLib.REST.QueryByGeometryParameters({
				queryParams: [queryParam], 
				geometry:geometry,				
				spatialQueryMode: MapLib.REST.SpatialQueryMode.INTERSECT
		});
		queryService = new MapLib.REST.QueryByGeometryService(FMapLib.DemoURL.fangchan, {
			eventListeners: {
				"processCompleted": processHouseCompleted,
				"processFailed": processHouseFailed
							}
		});
		queryService.processAsync(queryByGeometryParameters);
      //内部方法3-1 房屋面数据集分析完毕
      function processHouseCompleted(queryEventArgs) {  		
  		var i, j, result = queryEventArgs.result;
  		if (result && result.recordsets) {
  			for (i=0, recordsets=result.recordsets, len=recordsets.length; i<len; i++) {
  				if (recordsets[i].features==null || recordsets[i].features=='' ){
					alert("未选中房屋，请重新选择！");				
					callback(null);
					break;
  				}else {    					
  					for (j=0; j<recordsets[i].features.length; j++) {
  						var feature = recordsets[i].features[j];
  						feature.style = styleHouse;
  						vectorLayer2.addFeatures(feature);
  						housefeature = feature;    						
  					    callback(feature);
  					}
  				}
  			}
  		}
  	 }
    //内部方法3-2 
      function processHouseFailed(e){
     	 alert(e);
      }      	
    } 
    this.stopDraw=function(){
     	 d.destroy();
    }
   }
 
	ChooseHouse.prototype.getHouseAddress = function() {
		// 获取地址
		return getHouseAddress();
	}
	ChooseHouse.prototype.getHouseSmuserid = function() {
		// 获取地址
		return getHouseSmuserid();
	}
	ChooseHouse.prototype.getHouseLoncal = function() {
		// 获取地址
		return getHouseLoncal();
	}
	
	function getHouseAddress(){
		// 获取地址
		return housefeature.attributes['ADDRESS'];
	}
	function getHouseSmuserid(){
		// 获取smuserid
		return housefeature.attributes['SMUSERID'];
	}
	function getHouseLoncal(){
		// 获取西南角坐标（left，bottom）
		var left=housefeature.geometry.getBounds()['left'];
		var bottom=housefeature.geometry.getBounds()['bottom'];
		return "("+left+","+bottom+")";
	}
	/**
	 * @Class 画点类
	 * @author wangmeng
	 * 2014.11.25 17:10
	 */	 
	  var PointDrawer=
		  FMapLib.PointDrawer = function(map,style,callback){		   
		   this._map=map.map;
		   if(drawPoint)
			   drawPoint.deactive();
		   var draw=new MapLib.Control.DrawFeature(map._vectorLayer2,
					MapLib.Handler.Point, {
						multi : true
		   });
			// 添加画点控件
			this._map.addControl(draw);
			draw.events.on({
				"featureadded" :drawPointFinished  || {}
			});
			draw.activate();		
			//内部方法1
			 function drawPointFinished(drawGeometryArgs){
			    callback(drawGeometryArgs);
			}		 
			 draw.destory=function(){
				 draw.deactivate();			
		  }
		  return draw;
	  }  
    var AddPoi
    	/**
    	 * 添加一般地物点
    	 */
    =FMapLib.AddPoi=function(map,callback){
    	var d=new FMapLib.PointDrawer(map,style,drawPointFinished);
		var style={
		        strokeColor: "black",
		        strokeOpacity: 1,
		        strokeDashstyle: "solid",
		        fillColor: "black",
		        pointRadius: 0
		    };
         var a=this;        
	 //内部方法1	
		function drawPointFinished(drawGeometryArgs){
			 d.destroy();
		 	// 画点完成后执行的操作，添加marker
			   var point = drawGeometryArgs.feature.geometry.components[0];
			   a.feature=drawGeometryArgs.feature;
			   var c="<style>"
		           + ".td12{text-align:right;padding-right:12px;background-color:#F6FCFF;color:#000;font-size:1.2em;}"
		           + ".td13{padding-left:12px;background-color:#FFF;color:#4D4D4D;font-size:1.2em;}" 
		           + "</style>"
		  	        +"<div style='font-size:.8em; opacity: 1; line-height:30px; overflow-y:hidden;'>"
		  		    + "<span style=' color:#005ebc;font-size: 18px;font-family:微软雅黑;'>新建标注</span><br>";
		  c += "<table width='295px' border='0'cellpadding='0' cellspacing='1' bgcolor='#dee2e3' style=' border-color:#F3F3F3;line-height:30px;margin-left:15px'>"
		  + "<tr>"
		  + "<td class='td12'>X坐标</td>"
		  + "<td class='td13'>"+point.x+"</td>"
		  + "</tr>"
		  + "<tr>"
		  + "<td class='td12'>Y坐标</td>"
		  + "<td class='td13'>"+point.y+"</td>"
		  + "</tr>"
		  + "<tr>"	
		  + "<td class='td12'>请选择兴趣点类型</td>"
		  + "<td class='td13'><select id='dangersType'><option value=1>深坑</option><option value=2>山体</option><option value=3>水渠</option><option value=4>工厂</option><option value=5>施工点</option></select>"
		  + "</tr>"
		  + "<tr>"	
		  + "<td class='td12'>请填写备注</td>"
		  + "<td class='td13'><input  id='dangersRemark' type='text'/>"
		  + "</tr>"
		  + "</table>";
		  c +="<p  style='text-align:center;'><input type='submit' name='Submit' id='saveforsend' value='保存' style='background:url(/safemanage/resource/images/button_bj.jpg) repeat-x; width:222px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";
		  c += "</div>";				
				map.addMarker(point.x,point.y,baseurl + "theme/images/markerbig.png",32,32);//在画点处标记一个自定义Marker；		     
			var popup = new MapLib.Popup.FramedCloud("popwin", new MapLib.LonLat(
						point.x, point.y),null, c, null, true,null, true);				
				popup.panMapIfOutOfView = true;// 允许地图自适应
				a.feature.popup=popup;
				map.addPopup(popup);// 添加弹出窗体			 
			 $("#dangersRemark").val("深坑"); 
			 $('#dangersType').change(function(){
			  var a=$(this).find('option:selected').text();  //弹出select的值	
			      $("#dangersRemark").val(a);    
			 })	    
		        //定义信息框文档对象点击事件
		     $("#saveforsend").bind("click",function() {			
			    var dangersRemark = $("#dangersRemark").val();
			    var dangersType=$("#dangersType").children('option:selected').val();
			    if((dangersRemark=="")||(dangersRemark==undefined)){
				     alert("请输入备注！");
			 }else{	
				// alert(dangersRemark+""+dangersType);
				 AddPointToDataSet(point,["REMARK","OBJ_TYPE"],[dangersRemark,dangersType],FMapLib.DemoURL.fangchan1_ST_Dangers_P,addPointFinished);
				 map.removePopup(popup);//移除弹出窗口
				 map.zoomOut();//地图缩小一级
		      }});
		     //内部方法1-1
		     function addPointFinished(editFeaturesEventArgs){		    	
		    	 var ids = editFeaturesEventArgs.result.IDs,
	               resourceInfo = editFeaturesEventArgs.result.resourceInfo;      
	           if((ids && ids.length > 0) || (resourceInfo && resourceInfo.succeed)) {	          
	           	 callback("成功添加兴趣点！");     	 
		     }else{
		    	 callback("添加兴趣点失败！");
		     }
		   }
		
		}
		 this.stopDraw=function(){
        	 d.destroy();
         }
    }
   // AddPoi.prototype.feature=null;
	var AddHouse
	/**
     * @class 添加新建房屋点
     */
	=FMapLib.AddHouse= function(map,callback){
		var d=new FMapLib.PointDrawer(map,style,drawPointFinished);
		var style={
		        strokeColor: "black",
		        strokeOpacity: 1,
		        strokeDashstyle: "solid",
		        fillColor: "black",
		        pointRadius: 0
		    };
		var a=this;
	 //内部方法1	
		function drawPointFinished(drawGeometryArgs){
			   d.destroy();
	    	// 画点完成后执行的操作，添加marker
			   var point = drawGeometryArgs.feature.geometry.components[0];
			   a.feature=drawGeometryArgs.feature;
			   var c="<style>"
		           + ".td12{text-align:right;padding-right:12px;background-color:#F6FCFF;color:#000;font-size:1.2em;}"
		           + ".td13{padding-left:12px;background-color:#FFF;color:#4D4D4D;font-size:1.2em;}" 
		           + "</style>"
		  	        +"<div style='width:312px; height:180px;font-size:.8em; opacity: 1; line-height:30px; overflow-y:hidden;'>"
		  		    + "<span style=' color:#005ebc;font-size: 18px;font-family:微软雅黑;'>新建房屋</span><br>";
		  c += "<table width='295px' border='0'cellpadding='0' cellspacing='1' bgcolor='#dee2e3' style=' border-color:#F3F3F3;line-height:30px;margin-left:15px'>"
		  + "<tr>"
		  + "<td class='td12'>X坐标</td>"
		  + "<td class='td13'>"+point.x+"</td>"
		  + "</tr>"
		  + "<tr>"
		  + "<td class='td12'>Y坐标</td>"
		  + "<td class='td13'>"+point.y+"</td>"
		  + "</tr>"
		  + "<tr>"	
		  + "<td class='td12'>请输入地址</td>"
		  + "<td class='td13'><input id='addressinfo' type='text'/>"
		  + "</tr>"
		  + "</table>";
		  c +="<p  style='text-align:center;'><input type='submit' name='Submit' id='saveforsend' value='保存' style='background:url(/safemanage/resource/images/button_bj.jpg) repeat-x; width:222px; height:35px; border:1px #cbe5ff solid; line-height:0px; font-family:微软雅黑; font-size:14px; color:#005ebc;padding-left:15px;'/></p>";
		  c += "</div>";				
				map.addMarker(point.x,point.y,baseurl + "theme/images/markerbig.png",32,32);//在画点处标记一个自定义Marker；		     
			var popup = new MapLib.Popup.FramedCloud("popwin", new MapLib.LonLat(
						point.x, point.y),null, c, null, true,null, true);				
				popup.panMapIfOutOfView = true;// 允许地图自适应
				a.feature.popup=popup;
				map.addPopup(popup);// 添加弹出窗体
		        //定义信息框文档对象点击事件
		     $("#saveforsend").bind("click",function() {			
			    var address = $("#addressinfo").val();
			    if((address=="")||(address==undefined)){
				     alert("请输入地址！");
			 }else{		 
				 AddPointToDataSet(point,["ADDRESS"],[address],FMapLib.DemoURL.fangchan1_New_House_P,addPointFinished);
				 map.removePopup(popup);//移除弹出窗口
				 map.zoomOut();//地图缩小一级
		      }});
		     //内部方法1-1
		     function addPointFinished(editFeaturesEventArgs){		    	
		    	 var ids = editFeaturesEventArgs.result.IDs,
	               resourceInfo = editFeaturesEventArgs.result.resourceInfo;      
	           if((ids && ids.length > 0) || (resourceInfo && resourceInfo.succeed)) {	          
	           	  datasetName="New_House_P@ORCL";	           
	           	 checkAndDealNewPoint(point,datasetName);	           	 
		     }
		   }
		}
		//内部方法2
		 var  checkAndDealNewPoint=function(pointposition,datasetName){
			var queryParam, queryBySQLParams, queryBySQLService;
			queryParam = new MapLib.REST.FilterParameter({
				name :datasetName,			
				attributeFilter : "SMX= "+pointposition.x+"and SMY="+pointposition.y
			});
			queryBySQLParams = new MapLib.REST.QueryBySQLParameters({
				queryParams : [ queryParam ]
			});
			queryBySQLService = new MapLib.REST.QueryBySQLService(
					FMapLib.DemoURL.fangchan, {
						eventListeners : {
							"processCompleted" : pointQueryCompleted,
							"processFailed" : processFailed
						}
					});
			queryBySQLService.processAsync(queryBySQLParams);
		//内部方法2-2
			function pointQueryCompleted(getFeaturesEventArgs){
				  var i, j, feature,features,result = getFeaturesEventArgs.result;						  
				  if (result && result.recordsets) {
						for (i = 0; i < result.recordsets.length; i++) {
							if (result.recordsets[i].features) {
								for (j = 0; j < result.recordsets[i].features.length; j++) {
									feature = result.recordsets[i].features[j];									
			                          var  smuserid = feature.attributes["SMUSERID"],
			                               smx=feature.attributes["SMX"],
									       smy=feature.attributes["SMY"],
			                               address = feature.attributes["ADDRESS"];
			                               a.smuserid=smuserid;
			                               a.address=address;
			                          var  point=new MapLib.Geometry.Point(Number(smx),Number(smy));
			                          // 调用fangchan1_ST_RIDRGN_SAFE_P数据服务执行添加点数据操作
			                         AddPointToDataSet(point,["SMUSERID","ADDRESS"],[smuserid,address],FMapLib.DemoURL.fangchan1_ST_RIDRGN_SAFE_P,callback);
									}										                    
								}
							}
						}
					}
			   }
		 this.stopDraw=function(){
        	 d.destroy();
         }
	}
	
	//添加点到指定数据集
 var AddPointToDataSet=function(geo,keys,vas,addr,callback){
		var geometry = geo;
        var feature = new MapLib.Feature.Vector();
        feature.geometry = geometry,
        vectorLayer.addFeatures(feature);
        geometry.id = "100000";    
        var editFeatureParameter, 
        editFeatureService,
        features = {
            fieldNames:keys,
            fieldValues:vas,
            geometry:geometry
        };
     editFeatureParameter = new MapLib.REST.EditFeaturesParameters({
        features: [features],
                         editType: MapLib.REST.EditType.ADD,
                         returnContent:false
     });
    editFeatureService = new MapLib.REST.EditFeaturesService(addr, {
        eventListeners: {
                       "processCompleted": callback||{},
                       "processFailed": processFailed
                        }
    });    
       editFeatureService.processAsync(editFeatureParameter); 
    function processFailed(e){
    	   alert(e);
    }
       
  }
	
       /**
		 * 在线添加地物点接口
		 * 
		 * @author luojiaming 2014-5-30
		 * @params map 一个FMap实例
		 * @params arr 接口地址字符串集合,如["safecheck.survey.insert1"]
		 * @params theme 所属专题字符串表示，如"HOUSE","EMER"
		 * @params ispad 是否pad客户端表示符
		 */
    var PointForEditOnline =	    
	 FMapLib.PointForEditOnline = function(map,arr,theme,ispad) {
    	PointForEditOnline.prototype.houseMap = map; // 房屋地图实例
    	PointForEditOnline.prototype.urlArr=arr;// 与业务系统接口地址数组
    	
    	PointForEditOnline.prototype.arr1=[];
    	PointForEditOnline.prototype.arr2=[];
        PointForEditOnline.prototype.params={};// 接口请求附加参数
        PointForEditOnline.prototype.fromPad=false;// 是否是pad客户端,默认为false
        PointForEditOnline.prototype.HOUSE=false;// 是否添加新房屋点
        PointForEditOnline.prototype.EMER=false;// 是否添加突发事件点
        // 事务标识,默认为0,即事务结束,1代表事务未结束
        PointForEditOnline.prototype.tranctionIndex=0;     	
    	if(theme&&theme=="HOUSE")
    	PointForEditOnline.prototype.HOUSE=true;
    	if(theme&&theme=="EMER")
    	PointForEditOnline.prototype.EMER=true;	
    	if(!!ispad)
       	PointForEditOnline.prototype.fromPad=true;// 客户端是pad
    	PointForEditOnline.prototype.getSmPoint=function(){
    		return new MapLib.Geometry.Point(Number(this._smx),Number(this._smy));
    	}
    	PointForEditOnline.prototype.setSmPoint=function(x,y){
    		this._smx=x;
    		this._smy=y;
    	}
    	if(preFeature)
    	PointForEditOnline.prototype.preFeature=preFeature;
// if(drawPoint)
// PointForEditOnline.prototype.drawPoint=drawPoint;
     }    
    /**
	 * 获取vector图层画点控件
	 */
    PointForEditOnline.prototype.getPointDrawer = function(){  	  	
    	this.houseMap.clearAllFeatures();
//    	if(housefeature){
//    		ChooseHouse.prototype.clearFeature(this.houseMap,housefeature); 
 //   	}    	
    	if(this.houseMap.map&&this.preFeature&&this.preFeature.popup)
    	this.houseMap.map.removePopup(this.preFeature.popup)
		drawPoint = new MapLib.Control.DrawFeature(vectorLayer,
				MapLib.Handler.Point);    	
		this.houseMap.map.addControl(drawPoint);
		drawPoint.activate();// 激活画点控件
	    return drawPoint;
    }
    
	// 弹出信息框，输入点标记信息
    PointForEditOnline.prototype.popDialogCanvas = function(prefeature,html){
    	if(drawPoint){
    	drawPoint.deactivate();// 确保画点控件已关闭
    	}    	
    	if(this.preFeature!=undefined&&this.preFeature.popup!=null&&this.preFeature.popup!=undefined){
    		PointForEditOnline.prototype.houseMap.map.removePopup(this.preFeature.popup);// 移除先前存在的弹出框
	   	}
    	// 弹出小窗口
		var contentHTML = html;
		// 初始化一个弹出窗口，输入房屋地址信息，并跳转到楼栋普查录入页面
		popup = new MapLib.Popup.FramedCloud("popwin", new MapLib.LonLat(
				prefeature.x, prefeature.y),null, contentHTML, null, true,null, true);
		prefeature.popup = popup;
		popup.panMapIfOutOfView = true;// 允许地图自适应
		PointForEditOnline.prototype.houseMap.map.addPopup(popup);// 添加弹出窗体
		PointForEditOnline.prototype.preFeature=prefeature;	// ?
		
	}
    /**
	 * 添加地物点代理函数
	 * 
	 * @param a
	 *            geometry实例
	 * @param arr1,arr2
	 *            需要修改的字段及其赋值，如：arr1=["ADDRESS","SMUSERID"],arr2=["济南市普利街56号","33089"]
	 * @param type
	 *            "house"||"emergency" 代表操作数据集的类型
	 */
    PointForEditOnline.prototype.addFeatureProxy=function(a,arr1,arr2){    		
    	if(!!this.HOUSE){
    		if(this.tranctionIndex==0){
    			this.addFeatureToDataSets(a,arr1,arr2,FMapLib.DemoURL.fangchan1_New_House_P)
    		}else{
    			this.addFeatureToDataSets(a,arr1,arr2,FMapLib.DemoURL.fangchan1_ST_RIDRGN_SAFE_P)
    		}
    	}
    	if(!!this.EMER){
    		if(this.tranctionIndex==0){
    		this.addFeatureToDataSets(a,arr1,arr2,FMapLib.DemoURL.fangchan1_ST_Emer_P);
    		}else{
    			 if(PointForEditOnline.prototype.houseMap.map.zoom==8){
               	  PointForEditOnline.prototype.houseMap.map.zoomTo(7);    			  
    			 }
               	 else
               	  PointForEditOnline.prototype.houseMap.map.zoomTo(8);	 
               	  PointForEditOnline.prototype.houseMap.map.setCenter(new MapLib.LonLat(a.x, a.y));
               	  var fid=arr2[0];// 获取楼幢编码
               	  var smx=this.arr2[1];
               	  var smy=this.arr2[2];               	
       				if(!!fid){					
       				var smuserid=fid;       			    
       				var c=window.confirm('保存突发事件点成功,是否继续录入?');// confirm,考虑到浏览器兼容性问题，try
																// catch
       				if(!!c){
       						  var url=PointForEditOnline.prototype.urlArr[0];
       						  url+="?smuserid="+smuserid+"&smx="+smx+"&smy="+smy;		                     
       						if(!!PointForEditOnline.prototype.fromPad){
       						// try{
       						// window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-600)/2+',left='+(window.screen.width-10-1100)/2+',width=1100,height=600,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
       						// }catch(e){
       						// alert(e);
       							    alert("非常抱歉,该浏览器版本尚不支持继续录入功能,请通过'选取房屋'功能完成继续录入!");
       						// }
       						}else{
       							window.showModalDialog(encodeURI(url),"","dialogWidth:1100px;dialogHeight:600px;center:1;");
       						}
       				}       							
       			   }else{alert("房屋点保存失败,请重新录入.")}
    		}
    	}
    }
	/**
	 * 添加地物几何特征及指定属性信息到指定空间数据集
	 * 
	 * @param a
	 *            建筑物点 geometry 对象
	 * @param b1
	 *            --String[] 目标字段名称集合 ;b2 --Object[] 目标字段值集合
	 * @param c
	 *            String 数据服务Url
	 */
    PointForEditOnline.prototype.addFeatureToDataSets=function(a,b1,b2,c){				
    	// vectorLayer.clearAllFeatures();
    	var geometry = a,
            feature = new MapLib.Feature.Vector();
        feature.geometry = geometry,
        vectorLayer.addFeatures(feature);
        geometry.id = "100000";
        
        var editFeatureParameter, 
            editFeatureService,
            features = {
                fieldNames:b1,
                fieldValues:b2,
                geometry:geometry
            };
        editFeatureParameter = new MapLib.REST.EditFeaturesParameters({
            features: [features],
                             editType: MapLib.REST.EditType.ADD,
                             returnContent:false
        });
        editFeatureService = new MapLib.REST.EditFeaturesService(c, {
            eventListeners: {
                           "processCompleted": addFeaturesProcessCompleted,
                           "processFailed": processFailed
                            }
        });
        
       editFeatureService.processAsync(editFeatureParameter);       
       // 添加地物成功
       function addFeaturesProcessCompleted(editFeaturesEventArgs) {  	
       	vectorLayer.removeAllFeatures(); // 清除Point,保留marker以帮助使用者看清新加房屋位置
       	if(PointForEditOnline.prototype.preFeature&&PointForEditOnline.prototype.preFeature.popup){
       	PointForEditOnline.prototype.houseMap.map.removePopup(PointForEditOnline.prototype.preFeature.popup)
       	}
       	try{
           var ids = editFeaturesEventArgs.result.IDs,
               resourceInfo = editFeaturesEventArgs.result.resourceInfo;      
           if((ids && ids.length > 0) || (resourceInfo && resourceInfo.succeed)) { 
          // if(!!PointForEditOnline.prototype.HOUSE){
             if(PointForEditOnline.prototype.tranctionIndex==0){
           	  PointForEditOnline.prototype.tranctionIndex+=1; 
           	  var datasetName="";
           	  if(!!PointForEditOnline.prototype.HOUSE)
           	     datasetName="New_House_P@ORCL";
           	  if(!!PointForEditOnline.prototype.EMER)
           	     datasetName="ST_Emer_P@ORCL";	  
           	  PointForEditOnline.prototype.checkAndDealNewPoint(a,datasetName);           	           	  
             }else{      	 
           	  PointForEditOnline.prototype.tranctionIndex=0;          
           	  // alert("新增地物成功");
           	 if(PointForEditOnline.prototype.houseMap.map.zoom==8){
           		 PointForEditOnline.prototype.houseMap.map.zoomTo(7);			 
           	 }
           	 else
           	  PointForEditOnline.prototype.houseMap.map.zoomTo(8);	 
           	  PointForEditOnline.prototype.houseMap.map.setCenter(new MapLib.LonLat(PointForEditOnline.prototype.preFeature.x, PointForEditOnline.prototype.preFeature.y));
           	  var fid=PointForEditOnline.prototype.arr2[0];// 获取楼幢编码
           	  var address=PointForEditOnline.prototype.arr2[1];
   				if(!!fid){					
   				var smuserid=fid;			
   				var c=window.confirm('保存房屋点成功,是否继续录入?');// confirm,考虑到浏览器兼容性问题，try
														// catch
   				if(!!c){
   						  var url=PointForEditOnline.prototype.urlArr[0];
   						  url+="?smuserid="+smuserid+"&address="+address;		                     
   						if(!!PointForEditOnline.prototype.fromPad){
   						// try{
   						// window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-600)/2+',left='+(window.screen.width-10-1100)/2+',width=1100,height=600,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
   						// }catch(e){
   						// alert(e);
   							    alert("非常抱歉,该浏览器版本尚不支持继续录入功能,请通过'选取房屋'功能完成继续录入!");
   						// }
   						}else{
   							window.showModalDialog(encodeURI(url),"","dialogWidth:1100px;dialogHeight:600px;center:1;");
   						}
   				}   						
   			   }else{alert("房屋点保存失败,请重新录入.")}	
             }   
        	  	
           }          
          
           else {
               alert("新增地物失败,可能因网络或者数据库访问异常导致该问题,请重新操作！");          
           }
          }catch(err){
       	   alert(err);
       	   try{
       	   var url=PointForEditOnline.prototype.urlArr[0];
   			  url+="?smuserid="+smuserid+"&address="+address;		                     
   			if(!!PointForEditOnline.prototype.fromPad){
   				window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-600)/2+',left='+(window.screen.width-10-1100)/2+',width=1100,height=600,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
   			}else{
   				window.showModalDialog(encodeURI(url),"","dialogWidth:1100px;dialogHeight:600px;center:1;");
   			}
       	   }catch(err){alert(err)};
          }
       }
     }    
    // 获取New_House_P中新添加点的信息,同时添加到st_ridrgn_safe_p相同的一条信息
    PointForEditOnline.prototype.checkAndDealNewPoint=function(pointposition,datasetName){
		var queryParam, queryBySQLParams, queryBySQLService;
		queryParam = new MapLib.REST.FilterParameter({
			name :datasetName,			
			attributeFilter : "SMX= "+pointposition.x+"and SMY="+pointposition.y
		});
		queryBySQLParams = new MapLib.REST.QueryBySQLParameters({
			queryParams : [ queryParam ]
		});

		queryBySQLService = new MapLib.REST.QueryBySQLService(
				FMapLib.DemoURL.fangchan, {
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
								var me=PointForEditOnline.prototype;
								if(!!me.HOUSE){
		                          var  smuserid = feature.attributes["SMUSERID"],
		                               smx=feature.attributes["SMX"],
								       smy=feature.attributes["SMY"],
		                               address = feature.attributes["ADDRESS"];
		                               me.arr2=[smuserid,address];
		                           var  point=new MapLib.Geometry.Point(Number(smx),Number(smy));
		                          // 调用fangchan1_ST_RIDRGN_SAFE_P数据服务执行添加点数据操作
		                          PointForEditOnline.prototype.addFeatureProxy(point,["SMUSERID","ADDRESS"],[smuserid,address]);
								}
								if(!!me.EMER){
								 var smuserid = feature.attributes["SMUSERID"],
								     smx=feature.attributes["SMX"],
								     smy=feature.attributes["SMY"];
								      me.arr2=[smuserid,smx,smy];
								      var  point=new MapLib.Geometry.Point(Number(smx),Number(smy));  
		                          // 调用fangchan1_ST_RIDRGN_SAFE_P数据服务执行添加点数据操作
		                         PointForEditOnline.prototype.addFeatureProxy(point,["SMUSERID"],[smuserid]);
								}
		                    
							}
						}
					}
				}
		}
		
	}
    /**
	 * 查询失败 公用方法
	 */
	function processFailed(e) {
		MapAlert(map, "", e.error.errorMsg, true);
		return false;
	}
	/**
	 * 突发事件点地图编辑接口
	 */
	FMapLib.PointForEditOnline.emergency=function(map,arr){	
		return new FMapLib.PointForEditOnline(map,arr,"EMER");
	}
	/**
	 * 房屋点地图编辑接口
	 */
	FMapLib.PointForEditOnline.house=function(map,arr,ispad){	
		return new FMapLib.PointForEditOnline(map,arr,"HOUSE",ispad);
	}
	/**
	 * 房屋快速定位接口 author luojiaming 2014-5-30 params string 房屋地址 map 初始化地图
	 * 
	 */
	var  BuildingFastQuery =
		FMapLib.BuildingFastQuery = function(map){
		this._map=map.map;		
	}
	/**
	 * 房屋快速查询查询方法
	 */
	BuildingFastQuery.prototype._query = function(datasetName,value,attr,queryCompleted){
		var panelObject=this._map;
		var datasetName = datasetName,attr=attr;		
		if(value){
			while( value.indexOf( " " ) != -1 ) {
				value=value.replace(" ","%"); 
			}			
				value = value.replace(/ /g,'');			
		}else{
			alert("请输入查询内容！");
			return;
		}
	    FMapLib.CommonQueryByClassify(datasetName,value,attr,queryCompleted);
		function queryCompleted(e){
			if(e==0){
				//FMapLib.MapAlert(panelObject,"提示！空格的使用会显著影响查询结果","对比'中海25'与'中海  25'的不同查询结果",true);
				FMapLib.MapAlert(panelObject,"推荐结果",e+"个",true);
			}else
				FMapLib.MapAlert(panelObject,"推荐结果",e+"个",true);
		}
		
	}
	
	/**
	 * 房屋快速查询--根据普通的楼幢面编码查询
	 */
	BuildingFastQuery.prototype.queryByCommonSmuserid = function(text){
		this._query(['ST_RIDRGN_P@ORCL'],text,['smuserid']);
	}
	/**
	 * 房屋快速查询--根据普通的楼幢面地址查询
	 */
	BuildingFastQuery.prototype.queryByCommonAddress = function(text){
		var text=" "+text+" ";
		this._query(['ST_RIDRGN_P@ORCL'],text,['ADDRESS']);
	}
	/**
	 * 房屋快速查询--根据安全的楼幢面编码查询
	 */
	BuildingFastQuery.prototype.queryBySafeSmuserid = function(text){
		this._query(['ST_RIDRGN_SAFE_P@ORCL'],text,['smuserid']);
	}
	/**
	 * 房屋快速查询--根据安全的楼幢面地址查询
	 */
	BuildingFastQuery.prototype.queryBySafeAddress = function(text){
		var text=" "+text+" ";
		this._query(['ST_RIDRGN_SAFE_P@ORCL'],text,['ADDRESS']);
	}	
	/**
	 * 房屋健康等级范围专题
	 * @author Administrator
	 */
	FMapLib.BuildingHealthGradeRange=function(){	
	    if(map)
			map.allOverlays = true;		   
	    var  style1 = new MapLib.REST.ServerStyle({
			fillForeColor : new MapLib.REST.ServerColor(0, 255, 0),
			lineColor : new MapLib.REST.ServerColor(0, 255, 0),//绿色
			lineWidth : 1
		}), style2 = new MapLib.REST.ServerStyle({
			fillForeColor : new MapLib.REST.ServerColor(0, 0, 255),
			lineColor : new MapLib.REST.ServerColor(0, 0, 255),//蓝色
			lineWidth : 1
		}), style3 = new MapLib.REST.ServerStyle({
			fillForeColor : new MapLib.REST.ServerColor(255, 255, 0),
			lineColor : new MapLib.REST.ServerColor(255, 255, 0),//黄色
			lineWidth : 1
		}), style4 = new MapLib.REST.ServerStyle({
			fillForeColor : new MapLib.REST.ServerColor(250, 0, 0),
			lineColor : new MapLib.REST.ServerColor(250, 0, 0),//红色
			lineWidth : 1
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
		 * 房屋普查状态范围值专题图
		 * 
		 * @author luojiaming 2014-6-7
		 * 
		 */
	 var BuildingSurveyStatusUnique=
		 
		FMapLib.BuildingSurveyStatusUnique=function(){
			removeTheme();// 清空专题图图层
			map.map.allOverlays = true;
			 var  style1 = new MapLib.REST.ServerStyle({
				fillForeColor : new MapLib.REST.ServerColor(137, 203, 187),
				lineColor : new MapLib.REST.ServerColor(0, 255, 0),
				lineWidth : 1
			}), style2 = new MapLib.REST.ServerStyle({
				fillForeColor : new MapLib.REST.ServerColor(233, 235, 171),
				lineColor : new MapLib.REST.ServerColor(255, 255, 0),
				lineWidth : 1
			}), style3 = new MapLib.REST.ServerStyle({
				fillForeColor : new MapLib.REST.ServerColor(135, 157, 157),
				lineColor : new MapLib.REST.ServerColor(255, 255, 255),
				lineWidth : 1
			}), style4 = new MapLib.REST.ServerStyle({
				fillForeColor : new MapLib.REST.ServerColor(92, 73, 234),
				lineColor : new MapLib.REST.ServerColor(0, 0, 255),
				lineWidth : 1
			}),themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
				 		start : 0,// 此范围段的开始值
				 		end : 0.9,// 此范围段的结束值
				 		style : style1,// 此范围段的样式
				 		visible:false
		    }), themeRangeIteme2 = new MapLib.REST.ThemeRangeItem({
		    	
		 		start : 0.9,// 此范围段的开始值
		 		end : 1.1,// 此范围段的结束值
		 		style : style4// 此范围段的样式
		 	
            }), themeRangeItemArray=[themeRangeIteme1,themeRangeIteme2]; 
			 TemeRangeService("CHECKSTATE","ST_RIDRGN_SAFECHECK","ORCL",themeRangeItemArray);
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
						"processCompleted" : type==0?rangeServiceCompleted:(type==1?uniqueServiceCompleted:labelServiceCompleted),
						"processFailed" : themeFailed
					}
				});		
				themeService.processAsync(themeParameters);
			}	
	  function uniqueServiceCompleted(themeEventArgs) {
	        if(themeEventArgs.result.resourceInfo.id) {
	            themeLayer = new MapLib.Layer.TiledDynamicRESTLayer("单值专题图", FMapLib.DemoURL.fangchan, {cacheEnabled:false,transparent: true,layersID: themeEventArgs.result.resourceInfo.id}, {"maxResolution": "auto"});
	            themeLayer.events.on({"layerInitialized": function() {
					map.map.addLayer(themeLayer);					
					map.map.allOverlays = false;
			}
	            });
	        }
	    }
		function rangeServiceCompleted(themeEventArgs) {
		    if (rangeLayer) {
					map.map.removeLayer(rangeLayer, true);
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
						map.map.addLayer(rangeLayer);					
							map.map.allOverlays = false;
					}
				});
			}
		}
		function labelServiceCompleted(themeEventArgs) {
		    if (labelLayer) {
					map.map.removeLayer(labelLayer, true);
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
						map.map.addLayer(labelLayer);					
							map.map.allOverlays = false;
					}
				});
			}
		}
		function themeFailed(serviceFailedEventArgs) {
			MapAlert("", serviceFailedEventArgs.error.errorMsg, true);
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
		 *            MapLib.REST.ServerColor(0, 255, 0), lineWidth : 1,
		 *            }),style2 = new MapLib.REST.ServerStyle({ fillForeColor :
		 *            new MapLib.REST.ServerColor(233, 235, 171), lineColor :
		 *            new MapLib.REST.ServerColor(255, 255, 0), lineWidth :
		 *            0.1 }),themeRangeIteme1 = new
		 *            MapLib.REST.ThemeRangeItem({ start : 0,//此范围段的开始值 end :
		 *            100,//此范围段的结束值 style : style1//此范围段的样式 }),
		 *            themeRangeIteme2 = new MapLib.REST.ThemeRangeItem({
		 *            start : 100,//此范围段的开始值 end : 1000,//此范围段的结束值 style :
		 *            style2//此范围段的样式 }),themeRangeItemArray=[themeRangeIteme1,
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
		 * 
		 * 
		 */
		FMapLib.TemeUniqueService=function(fieldname,datasetName,datasourceName,themeUniqueItemArray,enumvalue){		
			// 添加内存数据memoryData 使用SMID划分区域
			var themeUnique = new MapLib.REST.ThemeUnique({
				uniqueExpression : fieldname,			
				items :themeUniqueItemArray

			});
			var themeParameters = new MapLib.REST.ThemeParameters({
				datasetNames : [ datasetName ],// 比如 st_ridrgn
				dataSourceNames : [ datasourceName ],
				displayFilters:(undefined==enumvalue?null:["survey_type="+enumvalue]),
				themes : [ themeUnique ]				
			});		
			TemeService(themeParameters,1);
		}
		/**
		 * @author 李洪云 3013 11 28 删除专题图图层的函数
		 */
		function removeTheme() {
			//if(map.map.layers){
				//if (map.map.layers.length > 3) {
					if (dotLayer) {
						map.map.removeLayer(dotLayer, true);
						dotLayer = null;
					}
					if (themeLayer) {
						map.map.removeLayer(themeLayer, true);
						themeLayer = null;
					}
					if (labelLayer) {
						map.map.removeLayer(labelLayer, true);
						labelLayer = null;
					}
					if (rangeLayer) {
						map.map.removeLayer(rangeLayer, true);
						rangeLayer = null;
					}
					if (barLayer) {
						map.removeLayer(barLayer, true);
						barLayer = null;
					}
					if (housethemeLayer) {
						map.map.removeLayer(housethemeLayer);
						housethemeLayer = null;
					}			
		}
		var BuildingHealthGradeRange=
		/**
		 * 房屋健康等级范围专题
		 * @author Administrator
		 */
		FMapLib.BuildingHealthGradeRange=function(){	
		    if(map)
				map.allOverlays = true;		   
		    var  style1 = new MapLib.REST.ServerStyle({
				fillForeColor : new MapLib.REST.ServerColor(0, 255, 0),
				lineColor : new MapLib.REST.ServerColor(0, 255, 0),//绿色
				lineWidth : 1
			}), style2 = new MapLib.REST.ServerStyle({
				fillForeColor : new MapLib.REST.ServerColor(0, 0, 255),
				lineColor : new MapLib.REST.ServerColor(0, 0, 255),//蓝色
				lineWidth : 1
			}), style3 = new MapLib.REST.ServerStyle({
				fillForeColor : new MapLib.REST.ServerColor(255, 255, 0),
				lineColor : new MapLib.REST.ServerColor(255, 255, 0),//黄色
				lineWidth : 1
			}), style4 = new MapLib.REST.ServerStyle({
				fillForeColor : new MapLib.REST.ServerColor(250, 0, 0),
				lineColor : new MapLib.REST.ServerColor(250, 0, 0),//红色
				lineWidth : 1
			}), themeRangeIteme1 = new MapLib.REST.ThemeRangeItem({
				caption:"A",
				unique:"2",
				style : style1
			}), themeRangeIteme2 = new MapLib.REST.ThemeRangeItem({
				caption:"B",
				unique:"4",
				style : style2
			}), themeRangeIteme3 = new MapLib.REST.ThemeRangeItem({
				caption:"C",
				unique:"6",
				style : style3
			}), themeRangeIteme4 = new MapLib.REST.ThemeRangeItem({
				caption:"D",
				unique:"8",
				style : style4
			});		   
			 FMapLib.TemeUniqueService("RANGEITEM","ST_RIDRGN_JKDA","ORCL",[themeRangeIteme1, themeRangeIteme2, themeRangeIteme3,
			                   			     					themeRangeIteme4]);
		}
		
		/**
			 * 房屋安全等级单值专题图
			 * 
			 * @author luojiaming 2014-6-12
			 * 
			 */
		var BuildingSafeGradeRange=
			
		FMapLib.BuildingSafeGradeRange=function(m,t){
			// this._removeTheme=removeTheme();
			removeTheme();// 清空专题图图层
			map=m;			
			map.map.allOverlays = true;
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
			 TemeUniqueService("SAFEGRADE","ST_RIDRGN_SAFECHECK_THEME","ORCL",themeUniqueItemArray,t);
		}
		BuildingSafeGradeRange.prototype.removeTheme=function removeTheme(map) {
			if (map&&map.map.layers.length > 3) {
				if (dotLayer) {
					map.map.removeLayer(dotLayer, true);
					dotLayer = null;
				}
				if (themeLayer) {
					map.map.removeLayer(themeLayer, true);
					themeLayer = null;
				}
				if (labelLayer) {
					map.map.removeLayer(labelLayer, true);
					labelLayer = null;
				}
				if (rangeLayer) {
					map.map.removeLayer(rangeLayer, true);
					rangeLayer = null;
				}
				if (barLayer) {
					map.removeLayer(barLayer, true);
					barLayer = null;
				}
				if (housethemeLayer) {
					map.map.removeLayer(housethemeLayer);
					housethemeLayer = null;
				}
			}
		}
		/**
		 * 区局规划单值专题图
		 */
		var BuildingSafeQuJuTheme=
			
		FMapLib.BuildingSafeQuJuTheme=function(map){	
			removeTheme();// 清空专题图图层
			map=m;
			map.map.allOverlays = true;
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
			if (map&&map.map.layers.length > 3) {
				if (dotLayer) {
					map.map.removeLayer(dotLayer, true);
					dotLayer = null;
				}
				if (themeLayer) {
					map.map.removeLayer(themeLayer, true);
					themeLayer = null;
				}
				if (labelLayer) {
					map.map.removeLayer(labelLayer, true);
					labelLayer = null;
				}
				if (rangeLayer) {
					map.map.removeLayer(rangeLayer, true);
					rangeLayer = null;
				}
				if (barLayer) {
					map.removeLayer(barLayer, true);
					barLayer = null;
				}
				if (housethemeLayer) {
					map.map.removeLayer(housethemeLayer);
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
			
			FMapLib.BuildingCheckGradeUnique=function(m){
				// this._removeTheme=removeTheme();
				removeTheme();// 清空专题图图层
				map=m;
				map.map.allOverlays = true;
				var  style1 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(0, 255, 0),
					lineColor : new MapLib.REST.ServerColor(0, 255, 0),// 绿色
					lineWidth : 1
				}), style2 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(0, 0, 255),
					lineColor : new MapLib.REST.ServerColor(0, 0, 255),// 蓝色
					lineWidth : 1
				}), style3 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(255, 204, 0),
					lineColor : new MapLib.REST.ServerColor(255, 204, 0),// 黄色
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
				if (map&&map.map.layers.length > 3) {
					if (dotLayer) {
						map.map.removeLayer(dotLayer, true);
						dotLayer = null;
					}
					if (themeLayer) {
						map.map.removeLayer(themeLayer, true);
						themeLayer = null;
					}
					if (labelLayer) {
						map.map.removeLayer(labelLayer, true);
						labelLayer = null;
					}
					if (rangeLayer) {
						map.map.removeLayer(rangeLayer, true);
						rangeLayer = null;
					}
					if (barLayer) {
						map.removeLayer(barLayer, true);
						barLayer = null;
					}
					if (housethemeLayer) {
						map.map.removeLayer(housethemeLayer);
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
			
			FMapLib.BuildingTestGradeUnique=function(m){
				// this._removeTheme=removeTheme();
				map = m;
				removeTheme();// 清空专题图图层
				map.map.allOverlays = true;
				var  style1 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(0, 255, 0),
					lineColor : new MapLib.REST.ServerColor(0, 255, 0),// 绿色
					lineWidth : 1
				}), style2 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(0, 0, 255),
					lineColor : new MapLib.REST.ServerColor(0, 0, 255),// 蓝色
					lineWidth : 1
				}), style3 = new MapLib.REST.ServerStyle({
					fillForeColor : new MapLib.REST.ServerColor(255, 204, 0),
					lineColor : new MapLib.REST.ServerColor(255, 204, 0),// 黄色
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
				if (map&&map.map.layers.length > 3) {
					if (dotLayer) {
						map.map.removeLayer(dotLayer, true);
						dotLayer = null;
					}
					if (themeLayer) {
						map.map.removeLayer(themeLayer, true);
						themeLayer = null;
					}
					if (labelLayer) {
						map.map.removeLayer(labelLayer, true);
						labelLayer = null;
					}
					if (rangeLayer) {
						map.map.removeLayer(rangeLayer, true);
						rangeLayer = null;
					}
					if (barLayer) {
						map.removeLayer(barLayer, true);
						barLayer = null;
					}
					if (housethemeLayer) {
						map.map.removeLayer(housethemeLayer);
						housethemeLayer = null;
					}
				}
			}
	// //////////////////////////////////////////////////
		var printWindow;
		/**
		 * 地图打印API 修改打印方式和引用的文件 李洪云2013。11。27
		 */
		var PrintMap = FMapLib.PrintMap = function(id){
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
			// } else if (broz == 'safari' || broz == 'chrome' || broz ==
			// 'msie') {
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
		
		
		var Geolocate=
		
		/**
		 * 济南房产院地图GPS定位功能API
		 * 
		 * @author wangmeng 2014-7-31
		 * @param map 当前地图实例
		 * 
		 */		
		FMapLib.Geolocate= function(m){
			map = m;
			var geolocate=new MapLib.Control.Geolocate({
	            bind: false,
	            geolocationOptions: {
	                enableHighAccuracy: false,
	                timeout:7000,
	                maximumAge: 0
	            },
	            eventListeners: {
	                "locationupdated": getGeolocationCompleted,
	                "locationfailed": getGeolocationFailed
	            }
	        });
		 var timer=null;//定时器
		 var me=this;
		this.openTimer=function(){
		   timer=setInterval(me.startGeoLocate,2000);//每隔2s进行一次定位,时间间隔可以修改		
		}
	    this.startGeoLocate=function(){
			 if(!geolocate.active){
		            geolocate.activate();
		    }
		        geolocate.getCurrentLocation();
			}
		
		this.closeTimer=function(){
			if(timer){
				window.clearInterval(timer);
			}
		}
		 map.map.addControl(geolocate);		
    	 //更新定位
	     function getGeolocationCompleted(event) {
		     map.clearMarkers();		    
		     var p= FMapLib.WGS84ToJn93(event.point.x, event.point.y);		    					   
		     map.addMarker(p.lon,p.lat,FMapLib.resource_path.img_flashpoint,20,20);//在画点处标记一个自定义Marker；					
		     map.setCenter(p.lon,p.lat);				     
		 }			     
	     function getGeolocationFailed(event){
			alert("您当前使用的浏览器不支持地图定位服务");
			if(timer){
				window.clearInterval(timer);
			}
	     }			    	
		}
		//开启定位功能
		Geolocate.prototype.open=function(){
			this.openTimer();
		}
	    //关闭定位功能
		Geolocate.prototype.close=function(){
			this.closeTimer();
		}
	
		/**
		 * WGS84坐标点转换为JN93坐标点
		 * @returns MapLib.LonLat对象 
		 */
		FMapLib.WGS84ToJn93=function(x,y){
		//济南独立坐标系 
   	    Proj4js.defs["JN93-2"]="+proj=tmerc +ellps=JN93 +datum=JN93 +lat_0=36.66944444 +lon_0=117.006125 +lat_1=0 +lat_2=0 +x_0=49410.000 +y_0=50300.000 +k=1 +units=m +no_defs";		  
         var p = new MapLib.LonLat(x, y);				    
   	    return  p.transform("WGS84", "JN93-2");	
		}
	
		/**
		 * JN93坐标点转换为WGS84坐标点
		 * @returns MapLib.LonLat对象 
		 */
		FMapLib.Jn93To84=function(x,y){
		//济南独立坐标系 
   	    Proj4js.defs["JN93-2"]="+proj=tmerc +ellps=JN93 +datum=JN93 +lat_0=36.66944444 +lon_0=117.006125 +lat_1=0 +lat_2=0 +x_0=49410.000 +y_0=50300.000 +k=1 +units=m +no_defs";		  
         var p = new MapLib.LonLat(x, y);				    
   	    return  p.transform("JN93-2","WGS84");	
		}
		
		/**
		 * WGS84坐标点转换为CGCS2000投影坐标点
		 */
		FMapLib.WGS84ToCGCS2000=function(x,y){
			//国家大地2000坐标系
	   	    Proj4js.defs["CGCS2000"]="+proj=tmerc +ellps=WGS84 +datum=WGS84 +lat_0=0.00000000 +lon_0=117.00000000 +lat_1=0 +lat_2=0 +x_0=500000 +y_0=0 +k=1 +units=m +no_defs";		  
	         var p = new MapLib.LonLat(x, y);				    
	   	    return  p.transform("WGS84", "CGCS2000");	
		}
		/**
		 * CGCS2000投影转换为WGS84地理坐标
		 */
		FMapLib.CGCS2000To84=function(x,y){
		    Proj4js.defs["CGCS2000"]="+proj=tmerc +ellps=WGS84 +datum=WGS84 +lat_0=0.00000000 +lon_0=117.00000000 +lat_1=0 +lat_2=0 +x_0=500000 +y_0=0 +k=1 +units=m +no_defs";		  
	         var p = new MapLib.LonLat(x, y);				    
	   	    return  p.transform("CGCS2000","WGS84");	
		}
/**
 * 根据smuserid获取楼幢面geometry对象
 * @author Administrator
 * @param m  地图实例
 * @param i  smuserid值
 * @param c 颜色值字符串 如"#FFFFFF"
 * @return MapLib.Geometry对象
 */		
  FMapLib.DrawHouseCanvasById=function(m,i,c){
	  var queryParam, queryBySQLParams, queryBySQLService,attributeFilter,tablename,serviceurl,map;
	  attributeFilter="smuserid in("+i+"10000000000)";		
	  tablename=FMapLib.resource_path.tab_safehouse;
	  map=m;
	  queryParam = new MapLib.REST.FilterParameter({
			name : tablename,			
			attributeFilter : attributeFilter 
		});
		queryBySQLParams = new MapLib.REST.QueryBySQLParameters({
			queryParams : [ queryParam ]
		});

		queryBySQLService = new MapLib.REST.QueryBySQLService(
				FMapLib.DemoURL.fangchan, {
					eventListeners : {
						"processCompleted" : buildingquerycompleted,
						"processFailed" : processFailed
					}
				});
		queryBySQLService.processAsync(queryBySQLParams);
		function buildingquerycompleted(queryEventArgs){
			var i, j, feature,result = queryEventArgs.result;	       
	        if (result && result.recordsets) {
	        for (i=0; i<result.recordsets.length; i++) {
	                for (j=0; j<result.recordsets[i].features.length; j++) {
	                    feature = result.recordsets[i].features[j];	                    
	                    var geo = feature.geometry;
			            drawFeatureByGeo(map,c,geo,null);		
		            } 
	        }
	    } 
	        
    }	  
  }
/**
 *根据对象的几何属性进行客户端图形绘制，制作专题图
 * color	专题图颜色
 * geo	对象几何属性
 * attr	对象属性
 */
function drawFeatureByGeo(map,color,geo,attr){
	var style,linewidth=0.5,opacity=0.5;
	style= 	{
            strokeColor: color,
            strokeWidth: linewidth,
            pointerEvents: "visiblePainted",
            fillColor: color,
            fillOpacity: opacity,
            pointRadius: 6,
            label: "",
            fontSize: 14,
            fontWeight: "normal",
            cursor: "pointer"
        };	
	//客户端绘制图形
	var feature = new MapLib.Feature.Vector();
    feature.geometry = geo;
    feature.data = attr;  
	feature.style = style;
    vectorLayer.addFeatures(feature);
}

/**
 * 加载等待
 */
function loading(){
	var g = document.createElement("div");
	g.id = "loading";
	g.style.position = "absolute";
	//g.style.width = "1%";
	//g.style.height = "10%";
	g.style.top = "45%";
	g.style.right = "55%";
	g.style.zIndex = 1006;
	g.style.background= '#ffffff'; 
	g.style.opacity=1;
	map.viewPortDiv.appendChild(g);
	$("#loading").append(
	    "<div id='over' style='display: none;position: absolute; top: 0; left: 0; width: 100%; height: 100%;  background-color: #f5f5f5; opacity:1; z-index: 1007;'></div>"+
	    "<div id='layout' style=' display: none; position: absolute; top: 40%; left: 40%;  width: 20%; height: 20%; z-index: 1008; text-align:center;'>" +
	    "<img src='/gis/resource/images/load_ring.gif' alt='' /></div>"//bird.gif load_earth.gif
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
	if(markerLayer)
		markerLayer.clearMarkers();
	//if(markerLayer2)
	//	markerLayer2.clearMarkers();
	//if(markerLayerall)
	//	markerLayerall.clearMarkers();
	if (popup) {
		markerLayer.map.removePopup(popup);
		//markerLayer2.map.removePopup(popup);
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
	removeTheme();//清除专题图专用图层
	if(vectorLayer)
		vectorLayer.removeAllFeatures();
	if(vectorLayer2)
		vectorLayer2.removeAllFeatures();
	if ($('#mapAlert').size()) {
		$('div').remove('#mapAlert');
	}
	if(mapPopup){
		map.removePopup(mapPopup);
	}
    //清除空间统计弹出框
    if(popupArray&&popupArray.length>0){
    for (i=0;i<popupArray.length;i++) {
		map.removePopup(popupArray[i]);
	}
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
	map.addControl(drawPolygon);
	drawPolygon.events.on({
		"featureadded" : drawGreenAreaRateCompleted
	});
	drawPolygon.activate();
	ThemeByExtent.prototype.parmas='GreenAreaRate';
	//ThemeByExtent.prototype.themetype=themetype;
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
		//传递参数
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
			//如果是小区数据，则取出小区名称和小区面积
			if(datasetName == "New_Region@ORCL"){
				if(features && features.length){
					for(var j=0;j<features.length;j++){
						xiaoquArea = parseFloat(features[j].data.SMAREA);
						xiaoquName = features[j].data.AREANAME;
					}
				}
				
			}else if(datasetName == "huapu@ORCL"){//如果是绿化数据，则取出各绿化块面积和
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
	contentHTML += "<div>"+
	"小区名称："+xiaoquName+"<br/>"+
	"小区面积："+xiaoquArea.toFixed(2)+"<br/>"	+
	"绿地面积："+area.toFixed(2)+"<br/>"	+
	"绿化覆盖率："+((area/xiaoquArea)*100).toFixed(2)+"%"+
	"</div></div>";  
	mapPopup = new MapLib.Popup.FramedCloud("popwin",center,null,contentHTML,null,true); 
	map.addPopup(mapPopup); 
	
}
//框选放大
var BoxMagnify=FMapLib.BoxMagnify=function(){
	shrinkZoomBox.deactivate();
	document.getElementById("map").style.cursor="pointer"; 		
	magnifyZoomBox.activate();
	
}
//框选缩小
var BoxShrink=FMapLib.BoxShrink=function(){
	magnifyZoomBox.deactivate();
	document.getElementById("map").style.cursor="pointer";  
	shrinkZoomBox.activate();
}
//漫游
var Roam=FMapLib.Roam=function(){
	magnifyZoomBox.deactivate();
	shrinkZoomBox.deactivate();
	document.getElementById("map").style.cursor="default";  
}
/**
 * 
 * @class 分类查询通用类
 * @param 数据集，字段值，字段，回调函数
 * @author ghm
 */
var CommonQueryByClassify = FMapLib.CommonQueryByClassify = function(dataset,value,attr,callback){
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
		if(value){
		queryParam = new MapLib.REST.FilterParameter({ 
			name: datasetName, 
			attributeFilter: attr[i]+" like '"+value+"'",
			orderBy: " length("+attr[i]+") "
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
	var count=0;
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
                        size = new MapLib.Size(32,30),
                        offset = new MapLib.Pixel(-(size.w/2), -size.h),
                        icon = new MapLib.Icon(baseurl + "theme/images/marker11.png", size, offset);
						var marker = new MapLib.Marker(new MapLib.LonLat(pointx, pointy),icon);
						
						marker.info = feature;
						marker.info.attr = attr[i];
						markerLayer.addMarker(marker);
						
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
				var bound = markerLayer.getDataExtent();
				markerLayer.map.zoomToExtent(bound);
				var lonlat = bound.getCenterLonLat();
				markerLayer.map.setCenter(new MapLib.LonLat(lonlat.lon, lonlat.lat));
				if(markerLayer.map.getZoom()<2){
					markerLayer.map.zoomTo(4);
				}
				if(callback)
				callback(count);
			}else{
				if(callback)
				callback(count);
				//alert("暂无数据！");
			}
			
		}
	}
	function queryError(QueryEventArgs){//todo
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
	    contentHTML += "<div>"+marker.info.attributes["ADDRESS"]+"</div></div>";
	    var size = new MapLib.Size(32,30),
        offset = new MapLib.Pixel(-(size.w), -size.h),
        icon = new MapLib.Icon(baseurl + "theme/images/marker11.png", size, offset);
	    popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,icon,true,closeCallback); 
	    markerLayer.map.addPopup(popup);	
	    isclosed=false;
	}
	//改变marker图片地址
	function changeIconall(){
		if (popup) {
			markerLayer.map.removePopup(popup);
		}
	    var marker = this; 
	    var lonlat = marker.getLonLat(); 
	    
	    ///var contentHTML = "<div style=\'overflow-y:hidden;width:100%;FILTER: progid:DXImageTransform.Microsoft.Gradient(gradientType=0,startColorStr=#b8c4cb,endColorStr=red);background: -ms-linear-gradient(top, #fff,  #0000ff);\'>"; 
	    var contentHTML = "<div style=\'font-size:14px; opacity: 0.8; overflow-y:hidden;\'>"; 
	    contentHTML += "<div>"+marker.info.attributes["ADDRESS"]+"</div></div>";
	    
	    var size = new MapLib.Size(32,30),
        offset = new MapLib.Pixel(-(size.w), -size.h),
        icon = new MapLib.Icon(baseurl + "theme/images/marker11.png", size, offset);
	    
	    popup = new MapLib.Popup.FramedCloud("popwin",new MapLib.LonLat(lonlat.lon,lonlat.lat),null,contentHTML,icon,true);
	    //popup.autoSize=false;
	    markerLayer.map.addPopup(popup);
	    this.setUrl(baseurl + "theme/images/markerbig.png");
	    //alert(a1+"  "+new MapLib.LonLat(lonlat.lon,lonlat.lat)+"  "+ll);
	}
	//恢复marker图片地址
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

var GetAllFeaturesByCondition
/**
 * 条件查询获取目标Features对象
 */
=FMapLib.GetAllFeaturesByCondition= function(dataset,value,attr,callback){
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
		if(value){
		queryParam = new MapLib.REST.FilterParameter({ 
			name: datasetName, 
			attributeFilter: attr[i]+" like '"+value+"'",
			orderBy: " length("+attr[i]+") "
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
	    "processCompleted": callback, 
	    "processFailed": queryError 
	    } 
	}); 
	myQueryBySQLService.processAsync(queryBySQLParams); 
	function queryError(QueryEventArgs){//todo
		var arg = QueryEventArgs;
		alert(arg);
	}
}
var DestoryFeatureById
/**
 * 到指定数据集根据Feature唯一标识删除该Feature
 */
=FMapLib.DestoryFeatureById=function(smid,srurl){
	var editFeatureParameter, 
    editFeatureService,
    ids=smid;
editFeatureParameter = new MapLib.REST.EditFeaturesParameters({
    IDs:[smid] ,
    editType: MapLib.REST.EditType.DELETE,
    returnContent:false
});
editFeatureService = new MapLib.REST.EditFeaturesService(srurl, {
    eventListeners: {
                   "processCompleted": deleteFeaturesProcessCompleted,
                   "processFailed": processFailed
                    }
});
editFeatureService.processAsync(editFeatureParameter);   
function deleteFeaturesProcessCompleted(args){
	alert("删除成功,请重新查看危险点!");
}
function processFailed(args){
	alert("删除失败！");
}
}
})();