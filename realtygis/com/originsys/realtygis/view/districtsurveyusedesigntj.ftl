
<script type="text/javascript" src="${_share_file_url!''}/gis/FMapLib/theme/js/FusionCharts.js"></script>
[#list map.resultlist as relist]
<div id="${relist.USEDESIGN!''}div" align="center" style="margin-bottom:10px;"></div>
<script type="text/javascript">
   var chart = new FusionCharts("${_share_file_url!''}/gis/FMapLib/theme/images/DragColumn2D.swf", "DragColumnId", "825", "350", "0", "0");
   //chart.setDataURL("data/DragCol1.xml");		
   //拼接chart
   var strXML="<chart palette='2' caption='各区县测绘' subcaption='${relist.USEDESIGN!''}套数统计' showvalues='0' xAxisName='区县' yAxisName='套数' restoreBtnBorderColor='A2A3A0' formBtnBorderColor='A2A3A0' showFormBtn='0' showRestoreBtn='0' chartRightMargin='30' baseFontSize='12' showAboutmenuItem='0'>";
   //拼接x轴（categories）
   var strCategory="<categories>";
	[#list map.district as district]
   		[#if EnumService.getEnum('xzqh')?exists]
		    [#list EnumService.getEnum('xzqh') as enum]
					[#if "${district!''}" == "${enum.enum_value!''}"]
						strCategory+="<category name='${enum.enum_name!''}' />";
					[/#if]
			[/#list]
		[/#if]
	[/#list]
	strCategory+="</categories>";
	//拼接数据集
   var strDataset="";
	[#list relist.yearlist as yearlist]
	strDataset+="<dataset id='${yearlist.YEAR!''}' seriesName='${yearlist.YEAR!''}年'>";
		[#list yearlist.districtlist as districtlist]
			strDataset+="<set id='${yearlist.YEAR!''}${districtlist.COUNT!''}' value='${districtlist.COUNT!''}' allowDrag='0'/>";
		[/#list]
		strDataset+="</dataset>";
	[/#list]
	//拼接样式设置
   var strStyle="<styles><definition><style name='myCaptionFont' type='font' font='Arial' size='14' bold='1' /><style name='mySubCaptionFont' type='font' font='Arial' size='12' bold='0' /></definition><application><apply toObject='Caption' styles='myCaptionFont' /><apply toObject='SubCaption' styles='mySubCaptionFont' /></application></styles>";
   strXML+=strCategory+strDataset+strStyle+"</chart> ";
   
   chart.setDataXML(strXML);   
   chart.render("${relist.USEDESIGN!''}div");
</script>
[/#list]



<!--类型：${map.type!''}<br/>
[#list map.resultlist as relist]
	类别：${relist.USEDESIGN!''}
	[#list relist.yearlist as yearlist]
		年：${yearlist.YEAR!''}
		[#list yearlist.districtlist as districtlist]
			区县：${districtlist.DISTRICT!''}套数：${districtlist.COUNT!''}<br/>
		[/#list]
	[/#list]
[/#list]-->