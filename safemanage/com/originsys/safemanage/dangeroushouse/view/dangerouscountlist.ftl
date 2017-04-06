<script type="text/javascript" language="javascript">
function cha(){
	$("#dic_form").attr("action","${_servlet_url!''}/safeauth.dangerouscount.list?ctype=${block.term.ctype!''}");
	$("#dic_form").submit();
}
function toexcel(){
	$("#dic_form").attr("action","${_server_url!''}/exportexcel/safeauth.dangerouscount.list?ctype=${block.term.ctype!''}");
	$("#dic_form").submit();
}
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
<form name="dic_form" id="dic_form" action="${_servlet_url!''}/safeauth.dangerouscount.list?ctype=${block.term.ctype!''}" method="post">
	<table width="800" border="0" cellpadding="0" cellspacing="0" align="center" style="margin-top:10px;margin-bottom:10px;">
	<tr><td align="center">
	[#assign qh=""]
	请选择区县：<select id="region_id" name="region_id">
			<option value="">------请选择------</option>
			[#list EnumService.getEnum('xzqh') as enum][#if enum_index!=0]
			[#if "${block.term.building_region!''}"=="${enum.enum_value!''}"][#assign qh="${enum.enum_name!''}"][/#if]
			<option value="${enum.enum_value!''}" [#if "${block.term.building_region!''}"=="${enum.enum_value!''}"]selected[/#if]>${enum.enum_name!''}</option>
			[/#if][/#list]
			</select>
	&nbsp;&nbsp;<button type="button" onclick="cha();">查询</button>
	&nbsp;&nbsp;<button type="button" id="printInfo" align="right" onclick="toexcel();">导出excel</button>
	</td></tr>
	</table>
</form>
[#assign ctype=""]
[#if "${block.term.ctype!''}"=="jd"]
[#assign ctype="鉴定"]
[/#if]
[#if "${block.term.ctype!''}"=="pc"]
[#assign ctype="检查"]
[/#if]
<table width="800" border="1"  bordercolor="#c5e2ff" cellpadding="0" cellspacing="0" style="border-collapse:collapse;line-height:30px;text-align:center;" align="center">
	<tr><td colspan="10" align="center" bgcolor="#519ce8" class="baida"><b>济南市${qh!''}${ctype!''}危房统计表</b></td></tr>
	<tr>
		<td colspan="2" rowspan="3" bgcolor="#ecf6ff" align="center" class="dahei">类别</td>
		<td colspan="8"align="center" bgcolor="#fbfbfb" class="hongzi">危险房屋</td>
	</tr>
	<tr>
		<td colspan="2" bgcolor="#ecf6ff" class="lanxiao">有危险点</td>
		<td colspan="2" bgcolor="#ecf6ff" class="lanxiao">局危</td>
		<td colspan="2" bgcolor="#ecf6ff" class="lanxiao">全危</td>
		<td colspan="2" bgcolor="#ecf6ff" class="lanxiao">小计</td>
	</tr>
	<tr>
		<td bgcolor="#f9f9f9">幢</td>
		<td bgcolor="#f9f9f9">建筑面积</td>
		<td bgcolor="#f9f9f9">幢</td>
		<td bgcolor="#f9f9f9">建筑面积</td>
		<td bgcolor="#f9f9f9">幢</td>
		<td bgcolor="#f9f9f9">建筑面积</td>
		<td bgcolor="#f9f9f9">幢</td>
		<td bgcolor="#f9f9f9">建筑面积</td>
	</tr>
	[#if block.sjyt?exists]
	[#list block.sjyt as yt]
	<tr [#if (yt_index+1)==block.sjyt?size]class="odd"[/#if]>
		[#if yt_index==0]<td rowspan="${block.sjyt?size}" width="30px" bgcolor="#f9fdff" class="dahei">按<br />用<br />途<br />分</td>[/#if]
		<td [#if (yt_index+1)==block.sjyt?size]bgcolor="#ffeaea" class="dahei" [#elseif yt_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>[#if (yt_index+1)==block.sjyt?size]合计[#else]${yt.ENUM_NAME!''}[/#if]</td>
		<td [#if (yt_index+1)==block.sjyt?size]bgcolor="#ffeaea" [#elseif yt_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${yt.B1}</td>
		<td [#if (yt_index+1)==block.sjyt?size]bgcolor="#ffeaea" [#elseif yt_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{yt.B2;m0M2}</td>
		<td [#if (yt_index+1)==block.sjyt?size]bgcolor="#ffeaea" [#elseif yt_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${yt.C1}</td>
		<td [#if (yt_index+1)==block.sjyt?size]bgcolor="#ffeaea" [#elseif yt_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{yt.C2;m0M2}</td>
		<td [#if (yt_index+1)==block.sjyt?size]bgcolor="#ffeaea" [#elseif yt_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${yt.D1}</td>
		<td [#if (yt_index+1)==block.sjyt?size]bgcolor="#ffeaea" [#elseif yt_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{yt.D2;m0M2}</td>
		<td [#if (yt_index+1)==block.sjyt?size]bgcolor="#ffeaea" [#elseif yt_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${yt.H1}</td>
		<td [#if (yt_index+1)==block.sjyt?size]bgcolor="#ffeaea" [#elseif yt_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{yt.H2;m0M2}</td>
	</tr>
	[/#list]
	[#list block.fwjg as jg]
	<tr [#if (jg_index+1)==block.fwjg?size]class="odd"[/#if]>
		[#if jg_index==0]<td rowspan="${block.fwjg?size}" width="30px" bgcolor="#f9fdff" class="dahei">按<br />结<br />构<br />分</td>[/#if]
		<td [#if (jg_index+1)==block.fwjg?size]bgcolor="#ffeaea" class="dahei" [#elseif jg_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>[#if (jg_index+1)==block.fwjg?size]合计[#else]${jg.ENUM_NAME!''}[/#if]</td>
		<td [#if (jg_index+1)==block.fwjg?size]bgcolor="#ffeaea" [#elseif jg_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${jg.B1}</td>
		<td [#if (jg_index+1)==block.fwjg?size]bgcolor="#ffeaea" [#elseif jg_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{jg.B2;m0M2}</td>
		<td [#if (jg_index+1)==block.fwjg?size]bgcolor="#ffeaea" [#elseif jg_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${jg.C1}</td>
		<td [#if (jg_index+1)==block.fwjg?size]bgcolor="#ffeaea" [#elseif jg_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{jg.C2;m0M2}</td>
		<td [#if (jg_index+1)==block.fwjg?size]bgcolor="#ffeaea" [#elseif jg_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${jg.D1}</td>
		<td [#if (jg_index+1)==block.fwjg?size]bgcolor="#ffeaea" [#elseif jg_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{jg.D2;m0M2}</td>
		<td [#if (jg_index+1)==block.fwjg?size]bgcolor="#ffeaea" [#elseif jg_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${jg.H1}</td>
		<td [#if (jg_index+1)==block.fwjg?size]bgcolor="#ffeaea" [#elseif jg_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{jg.H2;m0M2}</td>
	</tr>
	[/#list]
	[#list block.fwcb as cb]
	<tr [#if (cb_index+1)==block.fwcb?size]class="odd"[/#if]>
		[#if cb_index==0]<td rowspan="${block.fwcb?size}" width="30px" bgcolor="#f9fdff" class="dahei">按<br />产<br />别<br />分</td>[/#if]
		<td [#if (cb_index+1)==block.fwcb?size]bgcolor="#ffeaea" class="dahei" [#elseif cb_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>[#if (cb_index+1)==block.fwcb?size]合计[#else]${cb.ENUM_NAME!''}[/#if]</td>
		<td [#if (cb_index+1)==block.fwcb?size]bgcolor="#ffeaea" [#elseif cb_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${cb.B1}</td>
		<td [#if (cb_index+1)==block.fwcb?size]bgcolor="#ffeaea" [#elseif cb_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{cb.B2;m0M2}</td>
		<td [#if (cb_index+1)==block.fwcb?size]bgcolor="#ffeaea" [#elseif cb_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${cb.C1}</td>
		<td [#if (cb_index+1)==block.fwcb?size]bgcolor="#ffeaea" [#elseif cb_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{cb.C2;m0M2}</td>
		<td [#if (cb_index+1)==block.fwcb?size]bgcolor="#ffeaea" [#elseif cb_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${cb.D1}</td>
		<td [#if (cb_index+1)==block.fwcb?size]bgcolor="#ffeaea" [#elseif cb_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{cb.D2;m0M2}</td>
		<td [#if (cb_index+1)==block.fwcb?size]bgcolor="#ffeaea" [#elseif cb_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>${cb.H1}</td>
		<td [#if (cb_index+1)==block.fwcb?size]bgcolor="#ffeaea" [#elseif cb_index%2==0] bgcolor="#FFFFFF" [#else] bgcolor="#f9f9f9" [/#if]>#{cb.H2;m0M2}</td>
	</tr>
	[/#list]
	[/#if]
</table>