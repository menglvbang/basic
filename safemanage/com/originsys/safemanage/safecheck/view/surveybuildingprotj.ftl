<script type="text/javascript" src="${_share_file_url!''}/safemanage/resource/js/FusionCharts.js"></script>
<script type="text/javascript" src="${block.map_url!''}/gis/FMapLib/FMapLib.Include-1.0.4.js"></script>
<div id="mapdiv" style="position:absolute;right:30%;left:0px;width:70%;height:93%;border-color:white" visibility="visible"></div>
<div id="chart1div" align="center" style="position:absolute;right:0px;left:70%;width:30%;height:93%;"></div>
<script type="text/javascript">
//改表iframe的背景色
	$("#chart1div").parent().parent().attr("style","background-color:#FAFAFA");
   var chart = new FusionCharts("${_share_file_url!''}/safemanage/resource/images/DragColumn2D.swf", "DragColumnId", "100%", "100%", "0", "0");
   //chart.setDataURL("data/DragCol1.xml");		
   //拼接chart
   var strXML="<chart palette='1' paletteColors='FFFF00,FF0000,CC6600,800080,0000CD,006400,008B8B' caption='2014年济南市老楼危楼安全排查' subcaption='房屋权属状况统计' showvalues='0' xAxisName='区县' yAxisName='楼幢数' restoreBtnBorderColor='A2A3A0' formBtnBorderColor='A2A3A0' showFormBtn='0' showRestoreBtn='0' chartRightMargin='20' baseFontSize='10' showAboutmenuItem='0'>";
   //拼接x轴（categories）
   var strCategory="<categories>";
   	[#list block.regionlist as region][#if region_index!=0]
   		strCategory+="<category name='${region.enum_name!''}' />";[/#if]
	[/#list]
	strCategory+="</categories>";
	//拼接数据集
   var strDataset="";
	[#list block.qslist as qs]
		strDataset+="<dataset id='${qs.enum_value!''}' seriesName='${qs.enum_name!''}'>";
		[#list block.relist as data1]
			[#if "${data1.qsid}"=="${qs.enum_value!''}"]
			[#assign data=data1.qsdata]
				[#list data as data2][#if data2_index!=0]
				strDataset+="<set id='${qs.enum_value!''}${data2.regionid}' value='${data2.count!''}' allowDrag='0'/>";
				[/#if][/#list]
			[/#if]
		[/#list]
		strDataset+="</dataset>";
	[/#list]
	//拼接样式设置
   var strStyle="<styles><definition><style name='myCaptionFont' type='font' font='Arial' size='14' bold='1' /><style name='mySubCaptionFont' type='font' font='Arial' size='12' bold='0' /></definition><application><apply toObject='Caption' styles='myCaptionFont' /><apply toObject='SubCaption' styles='mySubCaptionFont' /></application></styles>";
   strXML+=strCategory+strDataset+strStyle+"</chart> ";
   
   chart.setDataXML(strXML);   
   chart.render("chart1div");
   
 //绘制房屋权属专题图     
   var  map=new FMapLib.FMap("mapdiv");
var ids1="",ids2="",ids3="",ids4="",ids5="";
[#list block.reIDslist as datta]
[#if "${datta.PROPERTIES!''}"=="1"]ids1+="${datta.SMUSERID!''}"+",";[/#if]
[#if "${datta.PROPERTIES!''}"=="2"]ids2+="${datta.SMUSERID!''}"+",";[/#if]
[#if "${datta.PROPERTIES!''}"=="3"]ids3+="${datta.SMUSERID!''}"+",";[/#if]
[#if "${datta.PROPERTIES!''}"=="4"]ids4+="${datta.SMUSERID!''}"+",";[/#if]
[#if "${datta.PROPERTIES!''}"=="5"]ids5+="${datta.SMUSERID!''}"+",";[/#if]
[/#list]
 drawColoredHouse(ids1,"#FFFF00");
 drawColoredHouse(ids2,"#FF0000");
 drawColoredHouse(ids3,"#CC6600");
 drawColoredHouse(ids4,"#800080");
 drawColoredHouse(ids5,"#0000CD");
function drawColoredHouse(ids,c){
	new FMapLib.DrawHouseCanvasById(map,ids,c);	
} 
</script>