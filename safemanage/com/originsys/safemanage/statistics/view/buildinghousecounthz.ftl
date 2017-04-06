<script type="text/javascript" language="javascript">
	$(function(){
		//$("#current_time").text(new Date().toLocaleDateString());
		$("#printInfo").click(function(){
			window.location="${_servlet_url!''}/../exportexcel/safecheck.building.housecounthz";	
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
<div  id="buttons" style="text-align:right">
	<button type="button" id="printInfo" align="right">导出excel</button>
	<!--<button type="button" onclick="javascript:window.history.go(-1);" >返回</button>-->
</div>
<table width="100%" border="1" bordercolor="#c5e2ff" cellpadding="0" cellspacing="0" style="border-collapse:collapse;line-height:30px;text-align:center;" align="center">
	<tr><td colspan="8" align="center" bgcolor="#519ce8" class="baida">济南市安全检查汇总表（幢数）</td></tr>
	<tr><td style="font-weight:bold;">报表单位：</td><td colspan="7" style="text-align:left;padding-left:10px;">济南市房产测绘研究院</td></tr>
	<tr><td style="font-weight:bold;">项目名称：</td><td colspan="5" style="text-align:left;padding-left:10px;">济南市安全检查</td><td style="font-weight:bold;">填报日期：</td><td>${map.current_time!''}</td></tr>
	<tr><td rowspan="3" bgcolor="#ecf6ff" align="center" class="dahei">序号</td><td rowspan="3" bgcolor="#ecf6ff" align="center" class="dahei">区县名称</td><td colspan="4" bgcolor="#fbfbfb" class="hongzi">检查结果</td><td rowspan="2" bgcolor="#ecf6ff" align="center" class="dahei">合计</td><td rowspan="3" bgcolor="#ecf6ff" align="center" class="dahei">备注</td></tr>
	<tr><td bgcolor="#ecf6ff" class="lanxiao">无危险点房屋</td><td bgcolor="#ecf6ff" class="lanxiao">存在危险点房屋</td><td bgcolor="#ecf6ff" class="lanxiao">局部危险房屋</td><td bgcolor="#ecf6ff" class="lanxiao">整幢危险房屋</td></tr>
	<tr><td bgcolor="#f9f9f9">幢数（幢）</td><td bgcolor="#f9f9f9">幢数（幢）</td><td bgcolor="#f9f9f9">幢数（幢）</td><td bgcolor="#f9f9f9">幢数（幢）</td><td bgcolor="#f9f9f9">幢数（幢）</td></tr>
	[#assign index=1]
	[#list map.relist as relist][#if relist_index!=0]
		<tr><td bgcolor="#f9fdff">${index}[#assign index=index+1]</td>
		<td [#if relist_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>[#list EnumService.getEnum('xzqh') as enum][#if "${relist.DISTRICT!''}"=="${enum.enum_value!''}"]${enum.enum_name!''}[/#if][/#list]</td>
		[#list relist.districtList as district]
			<td [#if relist_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${district.COUNT!''}</td>
		[/#list]
		<td [#if relist_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${relist.DISTRICTCOUNT!''}</td><td [#if relist_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]></td>
		</tr>[/#if]
	[/#list]
	<tr><td bgcolor="#f9fdff">${index}[#assign index=index+1]</td><td bgcolor="#ffeaea" class="dahei">总计</td>
	[#list map.totallist as total]
		<td bgcolor="#ffeaea">${total.COUNT!''}</td>
	[/#list]
		<td bgcolor="#ffeaea">${map.totalcount!''}</td><td bgcolor="#ffeaea"></td>
	</tr>
</table>
