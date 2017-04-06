
<style type="text/css">
/**菜单样式开始**/
ul.menu, ul.menu ul {
  list-style-type:none;
  margin: 0;
  padding: 0;
  width: 16em;
}

ul.menu a {
  display: block;
  text-decoration: none;
  margin-top: 1px;
}

ul.menu li a {
  background: #2c69a2;
  color: #fff;	
  padding: 0.5em;
}

ul.menu li a:hover {
  background: #195389;
}

ul.menu li ul li a {
  background: rgb(204, 204, 255);
  color: #000;
  padding-left: 20px;
}

ul.menu li ul li a:hover,ul.menu li ul .current a {
  background: rgb(254, 248, 207);
  padding-left: 15px;
}
ul.menu li  div{
  background: #ffffff;
  padding-left: 25px;  
  display:block;  
  padding-top:2px
}
ul.menu li ul li div div{
  background: #ffffff;
  padding-left: 25px;  
  display:block; 
  cursor:pointer;
  padding-top:8px;
  padding-bottom:8px;
}
ul.menu li ul li div div:hover{
  background:#f4f4f4;
  padding-left: 15px; 
}
.code { border: 1px solid #ccc; list-style-type: decimal-leading-zero; padding: 5px; margin: 0; }
.code code { display: block; padding: 3px; margin-bottom: 0; }
.code li { background: #ddd; border: 1px solid #ccc; margin: 0 0 2px 2.2em; }
.indent1 { padding-left: 1em; }
.indent2 { padding-left: 2em; }
.search_style{  background-color: #f4f4f4;color: #000;padding: 10px; margin:0px; line-height:35px; }
.text_style{width:130px; font-family:"微软雅黑"; font-size:14px;color:#333333;}
.select_style{width:110px; font-family:"微软雅黑"; font-size:14px;color:#333333;} 
.date_style{width:56px; font-family:"微软雅黑"; font-size:14px;color:#333333;display:inline-block;}
.date1_style{width:80px; font-family:"微软雅黑"; font-size:14px;color:#333333;display:inline-block;}
.button_style{font-family:"微软雅黑"; font-size:14px; color:#333333; background:url(${_share_file_url!''}/gis/resource/images/button_bj.jpg) repeat-x; border:1px #9ac8dc solid; height:28px;}

/**菜单样式结束**/

#common_box{width:285px;height:485px;position:fixed;_position:absolute;right:0;top:175px;border:1px solid #D7FFFF;background:#FFF;z-index:88;opacity: 0.85;filter:alpha(opacity=85);}
#cli_on{width:15px;height:485px;float:left;cursor:pointer;background:#D7FFFF;text-align:center;line-height:485px;}

</style>

<div id="container" style="position: absolute; left: 0px; right: 0px; width: 100%; height: 100%;display:none">	
   <div class="content ui-layout-north">
   <div id="portal" style="position: relative; padding: 0; margin: 0; height: auto; width: auto">
		<table width="100%" cellspacing="0" cellpadding="0" border="0" background="${_share_file_url!''}/gis/resource/images/top-bj.jpg">
  <tbody><tr>
    <td width="454"><img width="454" height="71" src="${_share_file_url!''}/gis/resource/images/top.jpg"></td>
    <td>&nbsp;</td>
    <td width="683" valign="top"><table width="100%" cellspacing="0" cellpadding="0" border="0" style="	background-image: url(${_share_file_url!''}/gis/resource/images/top-right.jpg);
	background-repeat: no-repeat; background-position:right;">
      <tbody><tr>
        <td valign="top" height="71"><table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tbody><tr>
            <td height="36">&nbsp;</td>
            <td width="174" class="baizi"><table width="100%" cellspacing="0" cellpadding="0" border="0">
              <tbody><tr>
                <td class="baizi">欢迎您：${user.fullname!''}</td>
                <td width="45" align="center">
                <a href="${_servlet_url!''}/commonservice.login.logout">
                <img border="0" width="29" height="29" src="${_share_file_url!''}/gis/resource/images/exit.png">
                </a>
                </td>
              </tr>
            </tbody></table></td>
          </tr>
        </tbody></table>
          <table width="100%" cellspacing="0" cellpadding="0" border="0">
            <tbody><tr>
              <td height="9"></td>
            </tr>
          </tbody></table>  
          
          <table width="100%" cellspacing="0" cellpadding="0" border="0">
            <tbody><tr>
              <td>
    <div class="nav" id="nav"  style="width:700px;">
    <ul>
        [#assign caidan="info"]
		[#if access.canDo(user,'realtygis.blockaccess')]
    	<li><a  _for="homePage" id="homePage" target="main" onClick="changeLeftMenu(this);">地图查询</a></li>
    	[/#if]
    	[#if access.canDo(user,'realtygis.surveraccess')]
        <li><a  _for="realestate" id="realestate" target="main" onClick="changeLeftMenu(this);">房产测绘</a></li>
        [/#if]
    	[#if access.canDo(user,'realtygis.safetyaccess')]
        <li><a  _for="safety" id="safety" target="main" onClick="changeLeftMenu(this);">安全管理</a></li>
        [/#if] 
    	[#if access.canDo(user,'realtygis.operationaccess')]
        <li><a  _for="support" id="support" target="main" onClick="changeLeftMenu(this);">地图管理</a></li>
        [/#if]
  	
</ul>
</div>
 </td>
            </tr>
          </tbody></table>
          
          </td>
      </tr>
    </tbody></table></td>
  </tr>
</tbody></table>
   </div> 
   </div>
	<div class="content ui-layout-center"
			style="position: absolute; left: 0px; right: 0px; width: 100%; height: 100%;">
			<div id="innerContainer"
				style="position: absolute; left: 0px; right: 0px; width: 100%; height: 100%;">
				<div class="right_top" id="maptopDiv" style="display:none"> 					
						<div class="map_tool" style="padding-top: 0px" >
							<table width="100%" border="0" cellspacing="0" cellpadding="0">
								<tr>
								<td width="20" height="37" title="直接放大"><a id="magnify" onclick="javascript:magnify()" href="#"><img src="${_share_file_url!''}/gis/resource/images/zoom_in.png" style="border:0;width:20px;height:20px;"/></a></td>
						        <td width="20" height="37" title="直接缩小"><a id="shrink" onclick="javascript:shrink()" href="#"><img src="${_share_file_url!''}/gis/resource/images/zoom_out.png" style="border:0;width:20px;height:20px;"/></a></td>
								<td width="20" height="37" title="框选放大"><a id="boxmagnify" onclick="javascript:boxmagnify()" href="#"><img src="${_share_file_url!''}/gis/resource/images/d_zoom_in.png" style="border:0;width:20px;height:20px;"/></a></td>
						        <td width="20" height="37" title="框选缩小"><a id="boxshrink" onclick="javascript:boxshrink()" href="#"><img src="${_share_file_url!''}/gis/resource/images/d_zoom_out.png" style="border:0;width:20px;height:20px;"/></a></td>				
						        <td width="20" height="37" title="漫游"><a id="roam" onclick="javascript:roam()" href="#"><img src="${_share_file_url!''}/gis/resource/images/noact.png" style="border:0;width:20px;height:20px;"/></a></td>
						     
								<td width="20" height="37" title="清空地图"><a onclick="javascript:clearFeatures()" href="#"><img src="${_share_file_url!''}/gis/resource/images/w_delete.png" style="border:0;width:20px;height:20px;"/></a></td>
								<!--td width="20" height="37" title="前视图"><a id="forward" onclick="javascript:forward()" href="#"><img src="${_share_file_url!''}/gis/resource/images/forward.png" style="border:0;width:20px;height:20px;"/></a></td-->
						        <!--td width="60" class="tool_title"><a id="forward" onclick="javascript:forward()" href="#">前视图</a></td-->
						        <!--td width="20" height="37" title="后视图"><a id="back" onclick="javascript:back()" href="#"><img src="${_share_file_url!''}/gis/resource/images/back.png" style="border:0;width:20px;height:20px;"/></a></td-->
						        <!--td width="60" class="tool_title"><a id="back" onclick="javascript:back()" href="#">后视图</a></td-->										
								<td width="20" height="37" title="测距"><a href="#"  onclick="javascript:distanceMeasure()"><img src="${_share_file_url!''}/gis/resource/images/edit_polylinetool.png" style="border:0;width:20px;height:20px;"/></a></td>
								<td width="20" height="37" title="测面"><a href="#"  onclick="javascript:areaMeasure()"><img src="${_share_file_url!''}/gis/resource/images/edit_autocompletepolygontool.png" style="border:0;width:20px;height:20px;"/></a></td>	
								<td width="20" height="37" title="全屏"><a id="a6" onclick="javascript:fullScreen()" href="#"><img src="${_share_file_url!''}/gis/resource/images/Window_Max.png" style="border:0;width:20px;height:20px;"/></a></td>									
								</tr>
							</table>
						</div>
				</div>							
				<div class="content ui-layout-center" id="map"
					style="position: absolute; left: 0px; right: 0px; width: 99%; height: 88%;">
				</div>
				<div id="result" class="container">
				</div>
				<div class="content ui-layout-south" id="datatb" >		
                </div>
                <div id="common_box" style="display:none;">
					<div id="cli_on" style='font-size:12px;'>》</div>
					<div id="list" style="height:95%;overflow: auto;margin: 10px 0px 10px;font-size:13px;"></div>
				</div>				
		   </div>
		   
	</div>	
<div id="westmenu" class="content ui-layout-west" style="overflow-y:auto;overflow-x:hidden;"><!--overflow-y:auto;overflow-x:hidden;-->
<!--首页-->
[#if access.canDo(user,'realtygis.blockaccess')]
<div id="menu_homePage" style="background-color:#F1FAFA;">
	<ul  class="menu">
		<li class="homePage">
		    <div class="content" id="content1" style="background-color:#F1FAFA;">				  
				<input class="text_style" name="" id="inputcontent" value="请输入查询内容" placeholder="请输入查询内容"  type="text" /><img src="${_share_file_url!''}/gis/resource/images/searchicon.png" style="cursor:pointer;margin-left:5px;" onclick="javascirpt:commonQuery()">
				<label id="toResult" style='display:none;float:right;text-align:center;padding-left:5px;padding-right:2px;padding-top:2px;padding-bottom:5px;background-color:#A7F7F3;'value='》'  title='结果列表' onclick='showResult();'>》</label>
		    </div>
		</li>
	</ul>
	<ul id="fenlei" style="list-style-type: none;width:100%;padding:0 0px;">
		<li style="list-style-type: none;padding-left:25px;padding-right:15px;padding-top:0px;padding-bottom:5px; background-color:#F1FAFA;">
			<input class="button" name="Xuexiao" title="教育" id="jiaoyu" value="教育" type="button" onclick="facebookQuery(this);"/>
			<input class="button" name="Yiyuan" title="卫生" id="weisheng" value="卫生" type="button" onclick="facebookQuery(this);"/>
			<input class="button" name="" title="文化" id="wenhua" value="文化" type="button" onclick="facebookQuery(this);"/>
			<input class="button" name="" title="体育" id="tiyu" value="体育" type="button" onclick="facebookQuery(this);"/>
			<input class="button" name="" title="交通" id="jiaotong" value="交通" type="button" onclick="facebookQuery(this);"/>
			<input class="button" name="gongyua" title="旅游" id="lvyou" value="旅游" type="button" onclick="facebookQuery(this);"/>
			<input class="button" name="" title="工商" id="gongshang" value="工商" type="button" onclick="facebookQuery(this);"/>
			<input class="button" name="" title="商务" id="shangwu" value="商务" type="button" onclick="facebookQuery(this);"/>
			<input class="button" name="" title="民政" id="mingzheng" value="民政" type="button" onclick="facebookQuery(this);"/> 
			<img id="showMore" src="/gis/resource/qd/images/down.png" title="展开更多分类" onclick="showMoreFunc();"></img>
		</li>
		<li id="moreItems" style="list-style-type: none;display:none;padding-left:25px;padding-right:15px;padding-top:0px;padding-bottom:10px; background-color:#F1FAFA;">	
			<input class="button" name="" title="购物" id="gouwu" value="购物" type="button" onclick="facebookQuery(this);"/>
			<input class="button" name="" title="酒店" id="jiudian" value="酒店" type="button" onclick="facebookQuery(this);"/>
			<input class="button" name="" title="银行" id="yinhang" value="银行" type="button" onclick="facebookQuery(this);"/>
		</li>
		<li style="list-style-type: none;height:1px;border:solid 1px #375DF3;background-color:#A7F7F3;"/>
		<li style="list-style-type: none;padding-left:25px;padding-right:25px;padding-top:2px;padding-bottom:2px;border:solid 1px #EBCAF9;background-color:#A7F7F3;">
			<input class="button" name="房管" title="房管单位" id="fangguan" value="房管" type="button" onclick="facebookQuery(this);"></input>
			<input class="button" name="政府机构" title="政府单位" id="zhengfujigou" value="政府" type="button" onclick="facebookQuery(this);"></input>
			<input class="button" name="街道办" title="街道办" id="jiedaoban" value="街办" type="button" onclick="facebookQuery(this);"></input>
		</li>
		<li style="list-style-type: none;height:1px;border:solid 1px #375DF3;background-color:#A7F7F3;"/>
		<li style="list-style-type: none;padding-left:25px;padding-right:25px;padding-top:2px;padding-bottom:2px;border:solid 1px #EBCAF9;background-color:#A7F7F3;">
			<input class="button" name="鉴定" title="鉴定" id="jianding" value="鉴定" type="button" onclick="facebookQuery(this);"></input>
			<input class="button" name="物业" title="物业" id="wuye" value="物业" type="button" onclick="facebookQuery(this);"></input>
			<input class="button" name="中介" title="中介" id="zhongjie" value="中介" type="button" onclick="facebookQuery(this);"></input>
		</li>
		<li style="list-style-type: none;height:1px;border:solid 1px #375DF3;background-color:#A7F7F3;"/>
		<li id="queryEnd1" style="display:none;list-style-type: none;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;background-color:#F0EEA5;">
			<label></label>
		</li>
	</ul>
</div>
<div id="queryResult" style="display:block;overflow: auto;">
	<li id="fanhui" style="display:none;float:right;list-style-type: none;adding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;background-color:#A7F7F3;">
		<label style='value='《'  title='返回' onclick='fanhui();'>《</label>
	</li>
	<li id="result1" style="display:none;list-style-type: none;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;background-color:#F0EEA5;">
		<label id="queryEnd" style='display:none;'></label>
	</li>
	<div id="resultContent" style="padding-top:5px;overflow: auto;">
	</div>
	<div id="pageBtn" style="display:none;text-align:center;">
		<input style="width:46px;height:20px;padding-left:1px;padding-right:1px;padding-top:1px;padding-bottom:1px;font-size:13px;" class="button" name="上一页" title="上一页" id="prepage" value="上一页" type="button" disable="false" onclick="prePage()"></input>
		<label id="curr" style="font-size:12px;" value="0"></label>/<label id="tot" style="font-size:12px;" value="0"></label>
		<input style="width:46px;height:20px;padding-left:1px;padding-right:1px;padding-top:1px;padding-bottom:1px;font-size:13px;" class="button" name="下一页" title="下一页" id="nextpage" value="下一页" type="button" disable="false" onclick="nextPage()"></input>
	</div>
</div>
[/#if]
 <!--测绘-->
[#if access.canDo(user,'realtygis.surveraccess')]
<div id="menu_realestate" style="display:none"> 
<ul  class="menu">
	<li>
		<a href="#">综合查询</a>
		<ul class="menu_1">
			<li>
			<a href="#">房屋查询</a>
			<ul class="menu_1_1" name="showout">
            <div class="search_style" >
            	[#if access.canDo(user,'realtygis.simplebuildingquery')]
            	<li>类型：
				  <select name="select" id="simpleCons" class="select_style">				  
				    <option value=0>委托单位</option>
				    <option value=1 selected='true'>幢坐落</option>
	                <option value=2>楼幢编号</option>
				    <option value=3>设计用途</option>
				    <option value=4>房屋产别</option>
				    <option value=5>建成时间</option>
				    <option value=6>房屋结构</option> 
			      </select> 
				</li>
                <li>取值：
				  <input name="textfield" type="text" id="hUnit" value="请输入委托单位" placeholder="请输入委托单位" size="15" class="select_style" style="display:none">	
				  <input name="textfield" type="text" id="hAddress" value="请输入幢坐落" placeholder="请输入幢坐落" size="15" class="select_style">
			      <input name="textfield" type="text" id="hCode" value="请输入楼幢编号" placeholder="请输入楼幢编号" size="15" class="select_style" style="display:none" >			      
				  <select name="select" id="sjyt" class="select_style" style="display:none">
				    <option>选择设计用途</option>				  
                         [#if EnumService.getEnum('sjyt')?exists]
                            [#list EnumService.getEnum('sjyt') as enum]
                               <option value="${enum.enum_value!''}" >${enum.enum_name!''}</option>
                            [/#list]
                         [/#if]	       		    
			      </select> 
			       <select name="select" id="cqxz" class="select_style" style="display:none">
				    <option>选择房屋产别</option>				  
                         [#if EnumService.getEnum('fwcb')?exists]
                            [#list EnumService.getEnum('fwcb') as enum]
                               <option value="${enum.enum_value!''}" >${enum.enum_name!''}</option>
                            [/#list]
                         [/#if]		    
			      </select>
			      <div style="display:none">  
			      <input name="textfield" type="text" id="hDate1" placeholder="起始日期" size="15" class="select_style" onClick="WdatePicker({dateFmt:'yyyy'})"><label>年</label>	
			      <input name="textfield" type="text" id="hDate2" placeholder="截止日期" size="15" class="select_style" onClick="WdatePicker({dateFmt:'yyyy'})"><label>年</label>	
			      </div>			     
				   <select name="select" id="fwjg" class="select_style" style="display:none">
				    <option>选择房屋结构</option>				  
                         [#if EnumService.getEnum('fwjg')?exists]
                            [#list EnumService.getEnum('fwjg') as enum]
                               <option value="${enum.enum_value!''}" >${enum.enum_name!''}</option>
                            [/#list]
                         [/#if]		    
			      </select> 				 		  
                </li>
                [/#if]
                <li style="text-align:center; padding:12px 0 12px 0;">
                   	[#if access.canDo(user,'realtygis.simplebuildingquery')]
                   		<input name="简单查询" type="button" value="查询" class="button_style" id="simpleSear">
                  	[/#if]
                  	[#if access.canDo(user,'realtygis.buildingmultiquery')]
                  		<input name="高级查询" type="button" value="高级" class="button_style" id="superSear" style="margin-left:10px;">
                  	[/#if]
                </li>          
  			 
                </div>
			</ul>
		</li>
		<li>
		  <a href="#">小区查询</a>
		  <ul class="menu_1_1">
             <div style="search_style">
             <li>
                <input name="textfield" type="text" id="areaname" value="请输入小区名称" placeholder="请输入小区名称" size="15" class="select_style" >
                <input name="小区查询" type="button" value="查询" class="button_style" id="areasearch" onclick="javascirpt:areasearch()">
             </li> </br></br> 
             </div>
          </ul>   
        </li>
        
		</ul>
		</li>
		
		<li>
		  <a href="#">叠加区域分析</a>
		  <ul class="menu_1">
		  <li>
		  [#if access.canDo(user,'realtygis.dropextenthouquery')]
			<a id="" href="#">户室类型分析</a>
			<ul class="menu_1_1">
			<div>			
		 
                <li style="text-align:center; padding:12px 0 12px 0;">      
                
                  <input name="几何查询" type="button" value="选中房屋并分析" class="button_style" id="dropExtent">
             
                </li></br></br></br></br></br>		 		 
		   </div>
  		   </ul>
  		  </li> 
  		 [/#if]
  		[#if access.canDo(user,'realtygis.housethemebyextent')]		
		<li>
		<a href="#">楼幢基本属性分析</a>
		<ul class="menu_1_1">			
		<div>
		<li>
			<select id="themeFiled4" name="select"  class="select_style">
			    <option value="0">建筑面积</option>
			    <option value="1">建成年代</option>
			    <option value="2">房屋结构</option>
		    </select></br></br>
	    <input id="themeType41" type="radio" name="select4"  value="0" class="button_style"  checked="checked">饼状图</input>     
        <input id="themeType42" type="radio" name="select4"  value="1" class="button_style">柱状图</input>
        </input></br></br>	      
        <input type="button" class="button_style" value="选中房屋并分析" onclick="javascript:droptheme()"/>	
        </li>
    	</div>
    	</ul>
		</li>
		[/#if]	
  		   </ul>
		</li>
		<li>
           <a href="#">缓冲区域分析</a>
           <ul class="menu_1">
           <li>
           <div>
	           <input id="analysisparam" type="text" placeholder="请输入缓冲半径" class="select_style">米</br></br>
	           <input id="pointAnalysis" type="button" value="画点" class="button_style" onclick="javascript:drawBufferPoint()"> 
	           <input id="roadAnalysis" type="button" value="选中道路" class="button_style" onclick="javascript:drawBufferRoad()"></br></br>
	           <input id="lineAnalysis" type="button" value="画线" class="button_style" onclick="javascript:drawBufferLine()">
	           <input id="houseAnalysis" type="button" value="选中房屋" class="button_style" onclick="javascript:drawBufferHouse()">
	           <!--input id="bufferAnalysis" type="button" value="分析" class="button_style" onclick="javascript:bufferAnalysis()"-->
           </div>
           </li> </br></br></br></br></br>           
           </ul>
        </li>
		<li>
			<a href="#">图表统计</a>
			<ul class="menu_1">
				<li>
					<div class="search_style" >条件：
					  <select name="select" id="tongjidate" class="select_style">				  
					    <option value=0>按年统计</option>
					    <option value=1>按季度统计</option>
				      </select> 
			      </div>
				</li>
			    <li>
				    <div >
					    <input name="surverstartdate" type="text" id="surverstartdate" placeholder="起始日期" size="7" onClick="WdatePicker({dateFmt:'yyyy'})"  class="date_style" ><label>年</label>
					    <select name="select" id="jd1" class="date1_style" style="display:none;">				  
						    <option value=1>第一季度</option><option value=2>第二季度</option><option value=3>第三季度</option><option value=4>第四季度</option>
					    </select> - 
					    <input name="surverenddate" type="text" id="surverenddate" placeholder="截止日期" size="7" onClick="WdatePicker({dateFmt:'yyyy'})"  class="date_style" ><label>年</label>
					    <select name="select" id="jd2" class="date1_style" style="display:none;">				  
						    <option value=1>第一季度</option><option value=2>第二季度</option><option value=3>第三季度</option><option value=4>第四季度</option>
					    </select><br/><br/>
				    </div>
			    </li>
				<li>
				<a id="" href="#">全市测绘统计</a>
				<ul class="menu_1_1">
				<div>
				<li>
				[#if access.canDo(user,'realtygis.cityprojectsurveytj')]		
				<div id="tongji01" class="tjclass">项目测绘房屋套数统计</div>
				[/#if]
				[#if access.canDo(user,'realtygis.citybuildingareatj')]
				<div id="tongji07" class="tjclass">房屋建筑面积统计</div>
				[/#if]
				[#if access.canDo(user,'realtygis.citysurveyareatj')]		
				<div id="tongji02" class="tjclass">基础测绘面积统计</div>
				[/#if]
				[#if access.canDo(user,'realtygis.citysurveyusedesigntj')]		
				<div id="tongji03" class="tjclass">不同设计用途房屋统计</div>
				[/#if]
				</li>
				 </div>
				</ul>
				</li>
				<li>
				<a id="" href="#">区县测绘统计</a>
				<ul class="menu_1_1">
				<div>
				<li>
				[#if access.canDo(user,'realtygis.districtprojectsurveytj')]		
				<div id="tongji04" class="tjclass">项目测绘房屋套数统计</div>
				[/#if]
				[#if access.canDo(user,'realtygis.districthouseareatj')]
				<div id="tongji09" class="tjclass">房屋建筑面积统计</div>
				[/#if]
				[#if access.canDo(user,'realtygis.districtsurveyareatj')]		
				<div id="tongji05" class="tjclass">基础测绘面积统计</div>
				[/#if]
				[#if access.canDo(user,'realtygis.districtsurveyusedesigntj')]	
				<div id="tongji06" class="tjclass">不同设计用途房屋统计</div>
				[/#if]
				[#if access.canDo(user,'realtygis.districtbuildingareatj')]	
				<div id="tongji08" class="tjclass">房屋建筑面积及占比统计</div>
				[/#if]
				</li>
				</div>				
				</ul>
				</li>			
			</ul>
		</li>
		
		<li>
			<a href="#">空间统计</a>
			<ul class="menu_1">
			[#if access.canDo(user,'realtygis.allhousetheme')]
				<li>
				<a href="#" id="cityTheme">全市楼幢统计</a>
				<ul class="menu_1_1">
				<div>
			<li>
			<select id="themeFiled1" name="select"  class="select_style">
		    <option value="0">建筑面积</option>
		    <option value="1">建成年代</option>
		    <option value="2">楼层类型</option>	
		    </select></br>
		    <input id="themeType11" type="radio" name="select1"  value="0" class="button_style" checked="checked">饼状图</input>     
	        <input id="themeType12" type="radio" name="select1"  value="1" class="button_style">柱状图</input>
	        </input></br></br>	      
	        <input type="button" class="button_style" value="统计" onclick="javascript:themeAll()"/>
	        </li>
	        </div>
	        </ul>   
			</li>
			[/#if]			
				<li>
				<a href="#">区县楼幢统计</a>
				<ul class="menu_1_1">
				    <div>
				    <li>
			         <div class="tjclass" onclick="javascript:regionTheme()" >楼幢数量及建筑面积</div>			 
			         <div class="tjclass" onclick="javascript:buildingStructThemePie()">楼幢结构</div>
			        </li> 
	               </div>
	            </ul>
				</li>								
			</ul>
			<li>
			<a href="#">专题</a>
			<ul class="menu_1">
			[#if access.canDo(user,'realtygis.housethemebyextent')]		
			<li>
			<a href="#">年度成果专题</a>
			<ul class="menu_1_1">
			<div>
			  <li>
		      <input name="bussinessstartdate" lign="center" type="text" id="bussinessstartdate" placeholder="请选择" size="7" onClick="WdatePicker({dateFmt:'yyyy'})"  class="date_style" ><label>年</label>				      
			  </br></br>
	          <input type="button" class="button_style" value="统计" onclick="javascript:bussinessDistribute()"/>		
              </li>    	
	         </div>
	        </ul>
			</li>
			[/#if]			
			[#if access.canDo(user,'realtygis.housethemebyextent')]		
			<li>
			<a href="#">数据来源专题</a>
			<ul class="menu_1_1">
			<div>
			 <li>
			 <select id="dataSourceType" name="select"  class="select_style">
			    <option value="0">全部</option>
			    <option value="1">超图</option>
			    <option value="2">超智</option>
		     </select></br></br>
	          <input type="button" class="button_style" value="统计" onclick="javascript:buildingDataComing()"/>		
             </li> 
        	</div>
        	</ul>
			</li>
		    [/#if]		
			</ul>
		</li>     
       </ul>      
       </li>
	</ul>
	</div>
[/#if]
<!--安全-->
[#if access.canDo(user,'realtygis.safetyaccess')]
<div id="menu_safety" style="display:none"> 
<ul  class="menu">
<li>
			<a href="#">12年简易楼普查查询</a>
			<ul  class='menu_1' name="showout">
            <div style="display:block" class="search_style">
            	<li>类型：
				  <select name="select" id="simpleSafety" class="select_style">				  
				    <option value=0>坐落</option>
				    <option value=1>安全等级</option>
	                <!--option value=2>楼幢编号</option>
				    <option value=3>设计用途</option>
				    <option value=4>房屋产别</option>
				    <option value=5>建成时间</option>
				    <option value=6>房屋结构</option--> 
			      </select> 
				</li>
                <li >取值：
				  <input name="textfield" type="text" id="safetyaddress_o" value="请输入坐落" placeholder="请输入坐落" size="15" class="select_style">	
				 	      
				  <select name="select" id="jkdj" class="select_style" style="display:none">
				    <option>选择健康等级</option>				  
                    <option>全部</option>
			        <option>完好房屋</option>
			        <option>基本完好</option>
			        <option>一般破损</option>
			        <option>严重破损</option>
				                                                                               		    
			      </select> 
                </li>
                   <li style="text-align:center; padding:12px 0 12px 0;">
                  <input name="简单查询" type="button" value="查询" class="button_style" id="simpleSearSafety"></br>
                <!--   <input name="叠加显示地图" type="button" value="显示健康等级地图" class="button_style" id="jkdjmap">-->
                  </li>              
                </div>
			</ul>
		</li>
<li>
<a href="#" id="">12年简易楼普查专题</a>
<ul class='menu_1'>
<li>
<div>
 <input type="button" class="button_style" id="healthgradeTheme" style="margin-top:10px;" value="房屋健康完损等级专题图"/>
<!-- <input type="button" class="button_style" id="healthgradeTheme" style="margin-top:10px;"  value="专题标签" onclick="javascript:getHouseHGL()"/>-->
</div>
</li></br></br></br></br></br>
</ul>  
</li>
<li><a href="#" id="">14年老楼危楼排查</a>
<ul class='menu_1'>
<li>
<div>
 <input type="button" class="button_style" id="safegradeTheme" style="margin-top:10px;" value="排查结果专题图"/>
<!-- <input type="button" class="button_style" id="healthgradeTheme" style="margin-top:10px;"  value="专题标签" onclick="javascript:getHouseHGL()"/>-->
<input type="button" class="button_style" id="qujuhouseTheme" style="margin-top:10px" value="区局规划专题图"/>
</div>
</li></br></br></br></br></br>
</ul>
</li>

<li><a href="#" id="">安全检查</a>
<ul class='menu_1'>
<li>
<div>
 <input type="button" class="button_style" id="checkgradeTheme" style="margin-top:10px;" value="检查等级专题图"/>
<!-- <input type="button" class="button_style" id="healthgradeTheme" style="margin-top:10px;"  value="专题标签" onclick="javascript:getHouseHGL()"/>-->
</div>
</li></br></br></br></br></br>
</ul>
</li>
<li><a href="#" id="">安全鉴定</a>
<ul class='menu_1'>
<li>
<div>
 <input type="button" class="button_style" id="testgradeTheme" style="margin-top:10px;" value="鉴定等级专题图"/>
<!-- <input type="button" class="button_style" id="healthgradeTheme" style="margin-top:10px;"  value="专题标签" onclick="javascript:getHouseHGL()"/>-->
</div>
</li></br></br></br></br></br>
</ul>
</li>

<li><a href="#" id="">叠加分析</a>
<ul class='menu_1'>
<li>
<div>
 <input type="button" class="button_style" id="greenAreaRate" style="margin-top:10px;" value="小区绿化分析"/>
</div>
</li></br></br>
</ul>
</li>

	<li><a href="#" id="">缓冲区分析</a>
		<ul class='menu_1'>
			<li>
			<a id="" href="#">危险点分析</a>
				<ul class="menu_1_1">
					<div style="padding-top:10px;padding-bottom:10px;">
						分析半径：<input id="dangerouAnaRadius" type="text" style="width:58px;" class="select_style">米<br/>
						<table style="padding-top:5px;">
						<tr><td>
						<input type="radio" name="radioDangeroue" value="POLYGON" title="以多边形边线为起点，向外扩散分析" checked="checked">多边形分析</input>     
        				</td>
        				<td>
        				<input type="radio" name="radioDangeroue" value="POINT" title="以点为起点，向外扩散分析">点分析</input>
						</td>
						</table>
					 	<input type="button" class="button_style" id="dangerousAnalyst" style="margin-top:10px;" value="危险点分析"/>
					</div>
				</ul>
			</li>
			
			<li>
			<a id="" href="#">周边配套分析</a>
				<ul class="menu_1_1">
					<div>
						<form name='form1'>
						<input type='checkbox' name='VoteOption1' value=4>教育</input>
						<input type='checkbox' name='VoteOption1' value=5>卫生</input>
						<input type='checkbox' name='VoteOption1' value=6>文化</input><br/>
						<input type='checkbox' name='VoteOption1' value=7>体育</input>
						<input type='checkbox' name='VoteOption1' value=8>交通</input>
						<input type='checkbox' name='VoteOption1' value=9>旅游</input><br/>
						<!--<input type='checkbox' name='VoteOption1' value=1>房管</input>-->
						<input type='checkbox' name='VoteOption1' value=18>酒店</input>
						<input type='checkbox' name='VoteOption1' value=16>购物</input>
						<input type='checkbox' name='VoteOption1' value=17>银行</input><br/>
						<input type='checkbox' name='VoteOption1' value=2>政府</input>
						<input type='checkbox' name='VoteOption1' value=12>民政</input>
						<input type='checkbox' name='VoteOption1' value=3>街办</input><br/>
						<input type='checkbox' name='VoteOption1' value=14>物业</input>
						<input type='checkbox' name='VoteOption1' value=13>鉴定</input>
						<input type='checkbox' name='VoteOption1' value=15>中介</input>
						</form><br/>
						分析半径：<input id="surroundingAnaRadius" type="text" style="width:58px;" class="select_style">米<br/>
					 	<input type="button" class="button_style" id="surroundingAnalyst" style="margin-top:10px;" value="周边配套分析"/>
					</div>
				</ul>
			</li>
		</ul>
	</li>
	
	<li><a href="#" id="">危险点分布</a>
		<ul class='menu_1'>
			<li>
			<div style="padding-top:10px;padding-bottom:10px;">
			 <input type="button" class="button_style" id="dangerousDist" style="margin-top:10px;" value="危险点分布"/>
			</div>
			</li>
		</ul>
	</li>
	
	<li><a href="#" id="">实时天气</a>
		<ul class='menu_1'>
			<li>
			<div style="padding-top:10px;padding-bottom:10px;">
			 <input type="button" class="button_style" id="weatherForcast" style="margin-top:10px;" value="市区县天气实时查询"/>
			</div>
			</li>
		</ul>
	</li>

</ul>
</div>
[/#if]
<!--运维-->	
[#if access.canDo(user,'realtygis.operationaccess')]
<div id="menu_support" style="display:none"> 
<ul  class="menu">
      <li>
       <a href="#">地图版本管理</a>
       <ul class='menu_1' name="showout">
       [#if access.canDo(user,'realtygis.mapversiongrid')]
       <li>
       <a href="#" onclick="mapVersionList1()">版本基本信息</a>
       </li>
        [/#if]
       <li>
       <a href="#" id="">地图时空对比</a>
       <ul class='menu_1_1'>
       <div>
       <li>
	   <select id='lishi' class="select_style"> 
       </select></br></br>
      [#if access.canDo(user,'realtygis.splitscreencontrast')]
      <input type='button' id='compare'  value='打开对比窗口' class="button_style"/></br></br>
      [/#if]
      <input type='button' id='vmap'  value='切换当前地图'  class="button_style"/></br></br>
       </li>
	   </div>
	   </ul>
       </li>      
       <li>
       <a href="#" id="gisserver">切片管理系统</a>
       </li>   
</ul>
</div>
[/#if]
</div>		
</div>			
<script src="${_share_file_url!''}/gis/FMapLib/FMapLib.Include.js" type="text/javascript"></script>
<link type="text/css" rel="stylesheet"	href="${_share_file_url!''}/gis/resource/jquery/css/layout-default-latest.css" />
<!--<script type="text/javascript" src="${_share_file_url!''}/gis/resource/jquery/js/jquery-ui-1.8.18.custom.min.js"></script>-->
<script type="text/javascript" src="${_share_file_url!''}/gis/resource/jquery/js/jquery.layout-latest.js"></script>
<link rel="stylesheet" type="text/css" href="${_share_file_url!''}/gis/resource/css/gis.css">
<script type="text/javascript" src="${_share_file_url!''}/gis/resource/js/turnPhoto.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/gis/resource/jquery/js/jquery.mousewheel.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/gis/FMapLib/theme/js/FusionCharts.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/gis/resource/js/all.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/gis/resource/js/LevelMenu.js"></script>
<!--<script type="text/javascript" src="${_share_file_url!''}/resource/js/jquery.opendialog.js"></script>-->
<script src="${_share_file_url!''}/resource/js/jquery.jqGrid.min.js" type="text/javascript"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript">
  // JS 监听键盘enter键，触发首页查询功能
    document.onkeydown=function(event){ 
        e = event ? event :(window.event ? window.event : null); 
        if(e.keyCode==13 && $("#homePage").css("display")=="block"){ 
        	//执行的方法  
        	//projectAddress();
        	commonQuery();
        	
        } 
    } 
function initMenu() {
	[#assign caidan="info"]
	   [#if access.canDo(user,'realtygis.blockaccess')]
      	[#assign caidan="homePage"]
      	[#elseif access.canDo(user,'realtygis.surveraccess')]
        [#assign caidan="realestate"]
        [#elseif access.canDo(user,'realtygis.safetyaccess')]
        [#assign caidan="safety"]
        [#elseif access.canDo(user,'realtygis.operationaccess')]
        [#assign caidan="support"]    
        [/#if]
  $("#${caidan!''}").attr("class","thisclass");
  $("#${caidan!''}").click();
	
  $('.menu ul').hide(); 
  $('.menu ul').children('.current').parent().show();
  $('.menu ul:first').show();
  $("ul[name='showout']").show();
  $('.menu li a').click(
    function() {
        var checkElement = $(this).next();     
      	if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
	        checkElement.slideUp('normal');
	        return false;
	      }
	    if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
	    	if(checkElement.is('ul[class="menu_1"]')){
		    	  $("ul[class='menu_1']:visible").slideUp('normal');	
		   	}else{
		        $("ul[class='menu_1_1']:visible").slideUp('normal');	
		   	}
	        checkElement.slideDown('normal');
	        return false;
	      }
      
      });
    //安全查询
      $('#simpleSafety').change(function(){
    var a=$(this).children('option:selected').val();  //弹出select的值
     $(this).parent().next().children().hide();   
     $(this).parent().next().children().eq(a).show();  
     //初始化输入框  
     if(a=="0"){
     $("#safetyaddress_o").val("请输入坐落");
       $("#safetyaddress_o").focus(function(){
	  $("#safetyaddress_o").val("");
	  });
     }
     if(a=="1"){
      $("#jkdj").val("选择健康等级");
     }
   });  
   //简单查询 
  $('#simpleCons').change(function(){
    var a=$(this).children('option:selected').val();  //弹出select的值
     $(this).parent().next().children().hide();   
     $(this).parent().next().children().eq(a).show();  
     //初始化输入框  
     if(a=="0"){
     $("#hUnit").val("请输入委托单位");
       $("#hUnit").focus(function(){
	  $("#hUnit").val("");
	  });
     }
     if(a=="1"){
      $("#hAddress").val("请输入幢坐落");
       $("#hAddress").focus(function(){
	  $("#hAddress").val("");
	  });
     }
     if(a=="2"){
     $("#hCode").val("请输入楼幢编号");
     $("#hCode").focus(function(){
	  $("#hCode").val("");
	  });
     }
     if(a=="3"){
     $("#sjyt").val("选择设计用途");
     }
     if(a=="4"){
     $("#cqxz").val("选择房屋产别");
     }
     if(a=="5"){
     $("#hDate1").val("起始日期");
     $("#hDate2").val("截止日期");
     }
      if(a=="6"){
    $("#fwjg").val("选择房屋结构");
    }
    });    
   	//项目统计
  	$('#tongjidate').change(function(){
	     var a=$(this).children('option:selected').val();  //弹出select的值
	     //$(this).parent().parent().next().children().hide();  
	     if(a=="0"){
	    	$("#surverstartdate").val("");
	    	$("#surverenddate").val("");
	    	$("#jd1").css("display","none");
	    	$("#jd2").css("display","none");
	    	$("#tongji02").css("display","block");
	    	$("#tongji03").css("display","block");
	    	$("#tongji05").css("display","block");
	    	$("#tongji06").css("display","block");
	    	$("#tongji08").css("display","block");
	     }
	     if(a=="1"){
	    	$("#surverstartdate").val("");
	    	$("#surverenddate").val("");
	    	$("#jd1").val("1");
	    	$("#jd2").val("1");
	    	$("#jd1").css("display","inline-block");
	    	$("#jd2").css("display","inline-block");
	    	$("#tongji02").css("display","none");
	    	$("#tongji03").css("display","none");
	    	$("#tongji05").css("display","none");
	    	$("#tongji06").css("display","none");
	    	$("#tongji08").css("display","none");
	     }
     });     
  }
 
$(document).ready(function() {
	initMenu();  //初始化菜单
	
	$("#container").show();
    showPane('west');
	openPane('west');
	innerLayout.hide('south');   
	//首页查询，定义输入光标事件
	 $("#inputcontent").focus(function(){
	 if(($("#inputcontent").val()=="请输入查询内容") || ($("#inputcontent").val()=="")){
		$("#inputcontent").val("");
		}
	  
	  });
	//初始页面显示的是委托单位查询，定义输入框光标事件
	  $("#hAddress").focus(function(){
	  $("#hAddress").val("");
	  });
	  //安全初始页面显示的是坐落查询，定义输入框光标事件
	  $("#safetyaddress_o").focus(function(){
	  $("#safetyaddress_o").val("");
	  });
   //小区查询
   $("#areaname").focus(function(){   
      $("#areaname").val("");
   })	  
////////////////////////////////
   //安全查询   
   $("#simpleSearSafety").click(function(){
   //坐落查询
	  if($("#simpleSafety").val()=='0'){
	 safetyProjectAddress();	 
	  }
	//健康等级查询
	 if($("#simpleSafety").val()=='1'){
	 safetyProjectGrade();
	 
	  }
   });
  ///////////////////////////////////// 
	//单一查询
	$("#simpleSear").click(function(){
   //$("#datatb").empty();
	//委托单位查询
	  if($("#simpleCons").val()=='0'){
	
	  if(($("#hUnit").val()=="请输入委托单位") || ($("#hUnit").val()=="")){
	  alert("请输入委托单位！");
	  }
	  else{
	  $("#datatb").empty();
	    var  entrust_unit= $("#hUnit").val();
	    
	if (parent.MAP_VISION) {
		parent.sizePane('south', 100, "in");
		parent.openPane('south', "in");
		}
	
		$("#datatb").load(encodeURI("realtygis.simplebuildingquery?entrust_unit="+entrust_unit));
	}
	  }
	  //幢坐落查询
	  if($("#simpleCons").val()=='1'){
	 
	  if(($("#hAddress").val()=="请输入幢坐落") || ($("#hAddress").val()=="")){
	  alert("请输入幢坐落！");
	  }
	  else{
	    var  building_address= $("#hAddress").val()
	    while(building_address.indexOf(" ")!=-1){
			building_address=building_address.replace(" ", "%")
		}	   
	    $("#datatb").empty();
	if (parent.MAP_VISION) {
		parent.sizePane('south', 100, "in");
		parent.openPane('south', "in");
	}	   
	   
		$("#datatb").load(encodeURI("realtygis.simplebuildingquery?building_address="+building_address));		
	}
	  }
	  //楼幢编号查询
	   if($("#simpleCons").val()=='2'){
	   if(($("#hCode").val()=="请输入楼幢编号") || ($("#hCode").val()=="")){
	  alert("请输入楼幢编号！");
	  }
	  else{
	    var  graphics_code= $("#hCode").val();
	    $("#datatb").empty();
	if (parent.MAP_VISION) {
		parent.sizePane('south', 100, "in");
		parent.openPane('south', "in");
	}
	$("#datatb").load("realtygis.simplebuildingquery?graphics_code="+graphics_code);
	}
	  }
	  //设计用途查询
	   if($("#simpleCons").val()=='3'){
	    if($("#sjyt").val()=="选择设计用途"){
	  alert("请选择设计用途！");
	  }
	  else{
	    var  use_desgin= $("#sjyt").val();
	    $("#datatb").empty();
	if (parent.MAP_VISION) {
		parent.sizePane('south', 100, "in");
		parent.openPane('south', "in");
	}
	$("#datatb").load("realtygis.simplebuildingquery?use_desgin="+use_desgin);
	}
	  }
	  //房屋产别查询
	   if($("#simpleCons").val()=='4'){
	    if($("#cqxz").val()=="选择房屋产别" ){
	  alert("请选择房屋产别！");
	  }
	  else{
	    var  real_type= $("#cqxz").val();
	    $("#datatb").empty();
	if (parent.MAP_VISION) {
		parent.sizePane('south', 100, "in");
		parent.openPane('south', "in");
	}
	$("#datatb").load("realtygis.simplebuildingquery?real_type="+real_type);
	}
	  }
	  //建成时间查询
	   if($("#simpleCons").val()=='5'){
	   if(($("#hDate1").val()=="起始日期")||($("#hDate1").val()=="")){
	   alert("请输入起始日期！");
	   }
	   else{
	     if(($("#hDate2").val()=="截止日期")||($("#hDate2").val()=="")){
	      alert("请输入截止日期！");
	     }
	   else{
	    var  building_datestart= $("#hDate1").val();
	    var  building_dateend= $("#hDate2").val();
	    $("#datatb").empty();
	if (parent.MAP_VISION) {
		parent.sizePane('south', 100, "in");
		parent.openPane('south', "in");
	}
	$("#datatb").load("realtygis.simplebuildingquery?building_datestart="+building_datestart+"&building_dateend"+building_dateend);
	}
	}
	  }
	  //房屋结构查询
	     if($("#simpleCons").val()=='6'){
	        if($("#fwjg").val()=="选择房屋结构" ){
	  alert("请选择房屋结构！");
	  }
	  else{
	    var  build_struct= $("#fwjg").val();
	    $("#datatb").empty();
	if (parent.MAP_VISION) {
		parent.sizePane('south', 100, "in");
		parent.openPane('south', "in");
	}
	$("#datatb").load("realtygis.simplebuildingquery?build_struct="+build_struct);
	}
	  }
	});
	
	//统计
	$("#tongji01").click(function(){	
		var selectDateType=$("#tongjidate").val();
		var surverStartDate=$("#surverstartdate").val();
		var surverEndDate=$("#surverenddate").val();
		
		if(surverStartDate==null||surverStartDate==""){
			alert("请选择起始日期！");
		}else if(surverEndDate==null||surverEndDate==""){
			alert("请选择截止日期！");
		}else if(surverEndDate < surverStartDate){
			alert("起始日期不能大于截止日期！");
		}else if(selectDateType=="0"){//按年统计
			var url="realtygis.cityprojectsurveytj?type=seriesline&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate+"&both=true";
			window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-400)/2+',left='+(window.screen.width-10-875)/2+',width=875,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
		}else{//按季度统计
			var jd1=$("#jd1").val();
			var jd2=$("#jd2").val();
			if(surverEndDate==surverStartDate && jd1>jd2){
				alert("起始日期不能大于截止日期！");
			}else{
				var url="realtygis.cityprojectsurveyjdtj?type=seriesline&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate+"&both=true&jd1="+jd1+"&jd2="+jd2;
				window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-400)/2+',left='+(window.screen.width-10-875)/2+',width=875,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
			}
		}	
		
	});
	$("#tongji02").click(function(){	
		var surverStartDate=$("#surverstartdate").val();
		var surverEndDate=$("#surverenddate").val();
		if(surverStartDate==null||surverStartDate==""){
			alert("请选择起始日期！");
		}else if(surverEndDate==null||surverEndDate==""){
			alert("请选择截止日期！");
		}else if(surverEndDate<surverStartDate){
			alert("起始日期不能大于截止日期！");
		}else{
			var url="realtygis.citysurveyareatj?type=seriesline&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate;
			window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-400)/2+',left='+(window.screen.width-10-875)/2+',width=875,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
		}
	});
	$("#tongji03").click(function(){	
		var surverStartDate=$("#surverstartdate").val();
		var surverEndDate=$("#surverenddate").val();
		if(surverStartDate==null||surverStartDate==""){
			alert("请选择起始日期！");
		}else if(surverEndDate==null||surverEndDate==""){
			alert("请选择截止日期！");
		}else if(surverEndDate<surverStartDate){
			alert("起始日期不能大于截止日期！");
		}else{
			var url="realtygis.citysurveyusedesigntj?type=seriesline&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate;
			window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-400)/2+',left='+(window.screen.width-10-875)/2+',width=875,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
		}
	});
	
	$("#tongji04").click(function(){	
		var selectDateType=$("#tongjidate").val();
		var surverStartDate=$("#surverstartdate").val();
		var surverEndDate=$("#surverenddate").val();
		
		if(surverStartDate==null||surverStartDate==""){
			alert("请选择起始日期！");
		}else if(surverEndDate==null||surverEndDate==""){
			alert("请选择截止日期！");
		}else if(surverEndDate<surverStartDate){
			alert("起始日期不能大于截止日期！");
		}else if(selectDateType=="0"){//按年统计
			var url="realtygis.districtprojectsurveytj?type=cloumn&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate+"&both=true&jd1="+jd1+"&jd2="+jd2;
				window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-400)/2+',left='+(window.screen.width-10-900)/2+',width=900,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
		}else{
			var jd1=$("#jd1").val();
			var jd2=$("#jd2").val();
			if(surverEndDate==surverStartDate && jd1>jd2){
				alert("起始日期不能大于截止日期！");
			}else{
				var url="realtygis.districtprojectsurveyjdtj?type=cloumn&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate+"&both=true&jd1="+jd1+"&jd2="+jd2;
				window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-400)/2+',left='+(window.screen.width-10-900)/2+',width=900,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
			}
		}
	});
	$("#tongji05").click(function(){	
		var surverStartDate=$("#surverstartdate").val();
		var surverEndDate=$("#surverenddate").val();
		if(surverStartDate==null||surverStartDate==""){
			alert("请选择起始日期！");
		}else if(surverEndDate==null||surverEndDate==""){
			alert("请选择截止日期！");
		}else if(surverEndDate<surverStartDate){
			alert("起始日期不能大于截止日期！");
		}else{
			var url="realtygis.districtsurveyareatj?type=cloumn&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate;
			window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-400)/2+',left='+(window.screen.width-10-875)/2+',width=875,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
		}
	});
	$("#tongji06").click(function(){	
		var surverStartDate=$("#surverstartdate").val();
		var surverEndDate=$("#surverenddate").val();
		if(surverStartDate==null||surverStartDate==""){
			alert("请选择起始日期！");
		}else if(surverEndDate==null||surverEndDate==""){
			alert("请选择截止日期！");
		}else if(surverEndDate<surverStartDate){
			alert("起始日期不能大于截止日期！");
		}else{
			var url="realtygis.districtsurveyusedesigntj?type=cloumn&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate;
			window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-600)/2+',left='+(window.screen.width-10-875)/2+',width=875,height=600,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
		}
	});
	$("#tongji07").click(function(){	
		var selectDateType=$("#tongjidate").val();
		var surverStartDate=$("#surverstartdate").val();
		var surverEndDate=$("#surverenddate").val();

		if(surverStartDate==null||surverStartDate==""){
			alert("请选择起始日期！");
		}else if(surverEndDate==null||surverEndDate==""){
			alert("请选择截止日期！");
		}else if(surverEndDate<surverStartDate){
			alert("起始日期不能大于截止日期！");
		}else if(selectDateType=="0"){
			var url="realtygis.citybuildingareatj?type=seriesline&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate;
			window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-400)/2+',left='+(window.screen.width-10-875)/2+',width=875,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
		}else{
			var jd1=$("#jd1").val();
			var jd2=$("#jd2").val();
			if(surverEndDate==surverStartDate && jd1>jd2){
				alert("起始日期不能大于截止日期！");
			}else{
				var url="realtygis.citybuildingareajdtj?type=seriesline&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate+"&jd1="+jd1+"&jd2="+jd2;
				window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-400)/2+',left='+(window.screen.width-10-875)/2+',width=875,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
			}
		}
	});
	$("#tongji08").click(function(){	
		var surverStartDate=$("#surverstartdate").val();
		var surverEndDate=$("#surverenddate").val();
		if(surverStartDate==null||surverStartDate==""){
			alert("请选择起始日期！");
		}else if(surverEndDate==null||surverEndDate==""){
			alert("请选择截止日期！");
		}else if(surverEndDate<surverStartDate){
			alert("起始日期不能大于截止日期！");
		}else{
			var url="realtygis.districtbuildingareatj?type=pie3D&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate;
			window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-600)/2+',left='+(window.screen.width-10-875)/2+',width=875,height=600,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
		}
	});
	$("#tongji09").click(function(){	
		var selectDateType=$("#tongjidate").val();
		var surverStartDate=$("#surverstartdate").val();
		var surverEndDate=$("#surverenddate").val();
		
		if(surverStartDate==null||surverStartDate==""){
			alert("请选择起始日期！");
		}else if(surverEndDate==null||surverEndDate==""){
			alert("请选择截止日期！");
		}else if(surverEndDate<surverStartDate){
			alert("起始日期不能大于截止日期！");
		}else if(selectDateType=="0"){
			var url="realtygis.districthouseareatj?type=cloumn&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate+"&jd1="+jd1+"&jd2="+jd2;
			window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-400)/2+',left='+(window.screen.width-10-875)/2+',width=875,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
		}else{
			var jd1=$("#jd1").val();
			var jd2=$("#jd2").val();
			if(surverEndDate==surverStartDate && jd1>jd2){
				alert("起始日期不能大于截止日期！");
			}else{
				var url="realtygis.districthouseareajdtj?type=cloumn&surverStartDate="+surverStartDate+"&surverEndDate="+surverEndDate+"&jd1="+jd1+"&jd2="+jd2;
				window.open(url,'_blank','depended=yes,top='+(window.screen.height-30-400)/2+',left='+(window.screen.width-10-875)/2+',width=875,height=400,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
			}
		}
	});
	
$("#fense01").click(function(){
        var surverStartDate=$("#surverstartdate").val();
		var surverEndDate=$("#surverenddate").val();
		if(surverStartDate==null||surverStartDate==""){
			alert("请选择起始日期！");
		}else if(surverEndDate==null||surverEndDate==""){
			alert("请选择截止日期！");
		}else if(surverEndDate<surverStartDate){
			alert("起始日期不能大于截止日期！");
		}else{		
			new FMapLib.BuildingQueryByDate(surverStartDate,surverEndDate).open();			
		}
		});
});
function mapVersionList1(){
	window.open("realtygis.mapversiongrid",'_blank','depended=yes,top='+(window.screen.height-30-600)/2+',left='+(window.screen.width-10-1100)/2+',width=1100,height=600,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');	
}
$("#gisserver").click(function(){    
    //window.open(FMapLib.Org+"/iserver/manager/tileservice/jobs/",'_blank');
    window.open(FMapLib.Org+"/iserver/services/security/error/",'_blank');
});
$("#healthgradeTheme").click(function(){
 getHouseHGT();

})
//2014安全排查专题图
$("#safegradeTheme").click(function(){
	handlerByModelChange();
  new FMapLib.BuildingSafeGradeRange(map); //生成安全等级专题图
     //缩放级别小于3级时自动放大到3级
  var zoom = map.getZoom();
   if(zoom<3){
	   map.zoomTo(3);    
   }
  var color=['#00FF00', '#0000FF', '#FFFF00', '#FF0000'];
  var mountArray=[{"无问题":201,"有问题":254}];
	var html="<div><table id='' border='0' cellspacing='6' cellpadding='0'>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[0]+"'></td>";
	html+="<td width='90' height='7'align='left'>无问题房屋</td><td width='20' height='7'><a>"+mountArray[0].无问题+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[3]+"'></td>";
	html+="<td width='90' height='7'align='left'>有问题房屋</td><td width='20' height='7'><a>"+mountArray[0].有问题+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="</table></div>" ; 
	map.initLegendDiv();//初始化地图图例图层
    map.flashLegend(html);//自定义图例内容

})
//区局规划专题图
$("#qujuhouseTheme").click(function(){
  handlerByModelChange();
  new FMapLib.BuildingSafeQuJuTheme(map); //生成安全等级专题图
     //缩放级别小于3级时自动放大到3级
  var zoom = map.getZoom();
   if(zoom<3){
	   map.zoomTo(3);    
   }
  var color=['#00FF00', '#0000FF', '#46A626', '#0E90C9','#DF532F', '#FF0000'];//绿色，蓝色，草绿色，天蓝色，橙色，红色
  var mountArray=[{"历城":769,"历下":161,"市中":663,"槐荫":2927,"天桥":29,"其他":92}];
	var html="<div><table id='' border='0' cellspacing='6' cellpadding='0'>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[0]+"'></td>";
	html+="<td width='100' height='7'align='left'>历城区</td><td width='20' height='7'><a>"+mountArray[0].历城+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[1]+"'></td>";
	html+="<td width='100' height='7'align='left'>历下区</td><td width='20' height='7'><a>"+mountArray[0].历下+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[2]+"'></td>";
	html+="<td width='100' height='7'align='left'>市中区</td><td width='20' height='7'><a>"+mountArray[0].市中+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[3]+"'></td>";
	html+="<td width='100' height='7'align='left'>槐荫区</td><td width='20' height='7'><a>"+mountArray[0].槐荫+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[4]+"'></td>";
	html+="<td width='100' height='7'align='left'>天桥区</td><td width='20' height='7'><a>"+mountArray[0].天桥+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[5]+"'></td>";
	html+="<td width='100' height='7'align='left'>管修处</td><td width='20' height='7'><a>"+mountArray[0].其他+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="</table></div>" ; 
	map.initLegendDiv();//初始化地图图例图层
    map.flashLegend(html);//自定义图例内容
})
$("#checkgradeTheme").click(function(){
	handlerByModelChange();
  new FMapLib.BuildingCheckGradeUnique(map); //生成安全等级专题图  
     //缩放级别小于3级时自动放大到3级
  var zoom = map.getZoom();
   if(zoom<3){
	   map.zoomTo(3);    
   }
var color=['#00FF00', '#0000FF', '#FFFF00', '#FF0000'];
var mountArray=[{"无危险":141,"存在危险":65,"局部危险":3,"整幢危险":1}];
	var html="<div><table id='' border='0' cellspacing='6' cellpadding='0'>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[0]+"'></td>";
	html+="<td width='100' height='7'align='left'>无危险点房屋</td><td width='20' height='7'><a>"+mountArray[0].无危险+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[1]+"'></td>";
	html+="<td width='100' height='7'align='left'>存在危险点房屋</td><td width='20' height='7'><a>"+mountArray[0].存在危险+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[2]+"'></td>";
	html+="<td width='100' height='7'align='left'>局部危险房屋</td><td width='20' height='7'><a>"+mountArray[0].局部危险+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[3]+"'></td>";
	html+="<td width='100' height='7'align='left'>整幢危险房屋</td><td width='20' height='7'><a>"+mountArray[0].整幢危险+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="</table></div>" ; 
	map.initLegendDiv();//初始化地图图例图层
    map.flashLegend(html);//自定义图例内容
})
$("#testgradeTheme").click(function(){
	handlerByModelChange();
  new FMapLib.BuildingTestGradeUnique(map); //生成安全等级专题图  
     //缩放级别小于3级时自动放大到3级
  var zoom = map.getZoom();
   if(zoom<3){
	   map.zoomTo(3);    
   }
  var color=['#00FF00', '#0000FF', '#FFFF00', '#FF0000'];
  var mountArray=[{"A":0,"B":13,"C":16,"D":3}];
	var html="<div><table id='' border='0' cellspacing='6' cellpadding='0'>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[0]+"'></td>";
	html+="<td width='40' height='7'align='center'>A级 </td><td width='20' height='7'><a>"+mountArray[0].A+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[1]+"'></td>";
	html+="<td width='40' height='7'align='center'>B级</td><td width='20' height='7'><a>"+mountArray[0].B+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[2]+"'></td>";
	html+="<td width='40' height='7'align='center'>C级</td><td width='20' height='7'><a>"+mountArray[0].C+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="<tr><td width='15'  height='7' bgcolor='"+color[3]+"'></td>";
	html+="<td width='40' height='7'align='center'>D级</td><td width='20' height='7'><a>"+mountArray[0].D+"</a></td><td width='20' height='7'>幢</td></tr>";
	html+="</table></div>" ; 
	map.initLegendDiv();//初始化地图图例图层
    map.flashLegend(html);//自定义图例内容
})
$("#greenAreaRate").click(function(){
	if(map)
		map.clearAllFeatures();
	mouseRightHandler();
	handlerByModelChange();
  FMapLib.GreenAreaRateByDrawPolygon();
  
})

//改变左边栏目显示的div
	function changeLeftMenu(obj){	    
		current_menu=obj.id;	
		
		if(current_menu == 'homePage'){
			document.getElementById('queryResult').style.display='block';
		}else{
			document.getElementById('queryResult').style.display='none';
		}
			
	    var _for = "#menu_"+obj.id;	   
		$("div[id^='menu_']").each(function(){
			$(this).css("display","none");
		});		
	    $(_for).show();
	    $("#nav a").attr("class","");
		$("#"+current_menu).attr("class","thisclass");
		
	}
/**显示更多分类选项*/
function showMoreFunc(){
	var lab = document.getElementById('showMore');
	var items = document.getElementById('moreItems');
	if(lab.src.indexOf('down') > -1){
		lab.src="/gis/resource/qd/images/upward.png";
		lab.title="收起选项"
		items.style.display='block';
	}else if(lab.src.indexOf('upward') > -1){
		lab.src="/gis/resource/qd/images/down.png";
		lab.title="展开更多选项"
		items.style.display='none';
	}
	
}
</script>

