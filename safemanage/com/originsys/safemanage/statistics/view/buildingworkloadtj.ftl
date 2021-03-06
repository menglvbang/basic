<!--[#list map.relist as relist]
	区县：${relist.DISTRICT!''}----幢数：${relist.COUNT!''}<br/>
[/#list]-->
<script type="text/javascript" src="${_share_file_url!''}/resource/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" language="javascript">
$(function(){
	//模糊查询					
	jQuery("#gridReload").click(function() {
		var url="${_servlet_url!''}/safecheck.building.workloadtj?"
		+"start_time="+$("#start_time").val()+"&end_time="+$("#end_time").val();
		window.location.href=url;
	});
	//输出excel
	$("#printInfo").click(function(){
		var url="${_servlet_url!''}/../exportexcel/safecheck.building.workloadtj?"
		+"start_time="+$("#start_time").val()+"&end_time="+$("#end_time").val();
		window.location.href=url;
	});	
});
</script>
<style>
body,td,th {
	font-family: "微软雅黑";
	font-size: 12px;
	color: #424242;
	text-align:center;
}
.zi {font-size: 14px;
	 font-weight:bold;}

.baida {
	font-family: "微软雅黑";
	font-size: 16px;
	color: #fff;
	font-weight:bold;
	text-decoration: none;
}
.dahei{
	font-size:15px;
	font-weight:bold;}
.lanxiao {
	font-family: "微软雅黑";
	font-size: 14px;
	color: #0053d7;
	font-weight:bold;
	text-decoration: none;
}
.hongzi{
	font-size: 14px;
	color: #c40532;
	font-weight:bold;
</style>
<div class="skin_search ui-widget-content" style="padding:.2em;margin-bottom:8px;">
<form name="dic_form" id="dic_form" action="" method="post">
	<table width="800px" border="0" cellpadding="0" cellspacing="1" bgcolor="#dee2e3" style="line-height:30px;text-align:center;" align="center">
		<tr>
		<td class="td12">统计日期:</td>
		<td class="td13">
			开始日期：<input type="text" size="15" name="start_time" id="start_time" value="${map.start_time!''}" onClick="WdatePicker()"/>
			结束日期:<input type="text" size="15" name="end_time" id="end_time" value="${map.end_time!''}" onClick="WdatePicker()"/>
			<button type="button" id="gridReload" style="margin-left:10px;">查询</button>
		</td>
		<td class="td13">
			<button type="button" id="printInfo" align="right">导出excel</button>
		</td>
		</tr>
	</table>
</form>
<table width="800px" border="1px" bordercolor="#c5e2ff" cellpadding="0px" cellspacing="0px" style="line-height:30px;text-align:center;margin-top:20px;border-collapse:collapse;" align="center">
	<tr><td colspan="8" align="center" bgcolor="#519ce8" class="baida">济南市房屋安全检查工作量统计（幢数）</td></tr>
	<tr><td width="150px;" style="font-weight:bold;">统计日期：</td><td colspan="7" style="text-align:left;padding-left:10px;">
	[#if map.start_time?exists && map.start_time!='' && map.end_time?exists && map.end_time!='']
		${map.start_time!''} 至 ${map.end_time!''}
	[#elseif  map.start_time?exists && map.start_time!='' &&(!map.end_time?exists || map.end_time=='')]
		${map.start_time!''} 至今
	[#elseif map.end_time?exists && map.end_time!=''&&(!map.start_time?exists || map.start_time=='')]
		截至 ${map.end_time!''}
	[#else]
		全部
	[/#if]
	</td></tr>
	<tr><td rowspan="2" bgcolor="#ecf6ff" align="center" class="dahei">序号</td><td rowspan="2" width="200px;" bgcolor="#ecf6ff" align="center" class="dahei">区县名称</td><td width="200px;" bgcolor="#ecf6ff" class="hongzi">工作量</td><td rowspan="2" bgcolor="#ecf6ff" align="center" class="dahei">备注</td></tr>
	<tr><td bgcolor="#ecf6ff" class="lanxiao">幢数（幢）</td></tr>
	[#assign index=1]
	[#assign total=0]
	[#list map.relist as relist][#if relist_index!=0]
		<tr><td bgcolor="#f9fdff">${index}[#assign index=index+1]</td>
		<td [#if relist_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>[#list EnumService.getEnum('xzqh') as enum][#if "${relist.DISTRICT!''}"=="${enum.enum_value!''}"]${enum.enum_name!''}[/#if][/#list]</td>
		<td [#if relist_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${relist.COUNT!''}[#assign total=total+relist.COUNT]</td>
		<td [#if relist_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]></td>
		</tr>[/#if]
	[/#list]
	<tr><td bgcolor="#f9fdff">${index}[#assign index=index+1]</td><td bgcolor="#ffeaea">总计</td>
		<td bgcolor="#ffeaea">${total!''}</td>
		<td bgcolor="#ffeaea"></td>
	</tr>
</table>
</div>