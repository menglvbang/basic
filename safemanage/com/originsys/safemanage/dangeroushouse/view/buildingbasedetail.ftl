<script type="text/javascript" language="javascript">
$(function(){
	$("#outdiv").css("display","block");
	$("#tabs").tabs({cache:false});		
});
</script>
<div class="widget-title-normal">
	<div class="child">
		<span class="widget-title-text">楼幢详细</span>
	</div>
</div>
<div id="outdiv" style="display:none">
	<div class="ui-widget ui-widget-content ui-corner-all" style="position: relative;padding: .1em;">
		<div class="ui-widget" id="tabs">
			<ul>
				<li><a href="#tabs-1">楼幢信息</a></li>
				<li><a href="#tabs-2">检查信息</a></li>
				<li><a href="#tabs-3">鉴定信息</a></li>
			</ul>				
			<div id="tabs-1">
			[#import "buildingdetail.ftl" as basemessage /]
			[@basemessage.building_info building=block.building /]
			</div>
			<div id="tabs-2">	
				<div class="ui-widget"  style="position: relative;padding: .2em;">
				<table  class="ui-widget-content ui-widget-table ui-corner-all" cellspacing="1">
					[#list block.safelist as safe]
					[#if safe_index%2=0]
					 <tr>
					[#else]
					<tr class="odd">
					[/#if]
					<td>[#assign health_grade_pc=""]
				    [#if "${safe.health_savegrade!''}"=="1"][#assign health_grade_pc="无危险点房屋"][/#if]
				    [#if "${safe.health_savegrade!''}"=="2"][#assign health_grade_pc="存在危险点房屋"][/#if]
				    [#if "${safe.health_savegrade!''}"=="3"][#assign health_grade_pc="局部危险房屋"][/#if]
				    [#if "${safe.health_savegrade!''}"=="4"][#assign health_grade_pc="整幢危险房屋"][/#if]
					${safe_index+1}:&nbsp;&nbsp;
					检查时间:[#if safe.check_time?exists]${safe.check_time?string('yyyy-MM-dd')}[/#if]&nbsp;&nbsp;
					检查人:${safe.check_user!''}&nbsp;&nbsp;
					检查结果:${health_grade_pc!''}
					</td>
					</tr>
					[/#list>
				</table>
				</div>
			</div>
			<div id="tabs-3">	
				<div class="ui-widget"  style="position: relative;padding: .2em;">
				<table class="ui-widget-content ui-widget-table ui-corner-all" cellspacing="1">
					<tr class="odd"><td>鉴定地址</td><td>鉴定单位</td><td>鉴定时间</td><td>鉴定报告</td><td>相关图片</td></tr>
					[#list block.reportlist as report]
					[#if report_index%2=0]
					<tr>
					[#else]
					<tr class="odd">
					[/#if]
					<td>${report.building_address!''}</td>
					<td>${report.jd_department!''}</td>
					<td>[#if report.jd_date?exists]${report.jd_date?string('yyyy-MM-dd')}[/#if]</td>
					<td>[#if "${report.jd_report!''}"!=""]<a href="${_server_url!''}${report.jd_report!''}" target="download">报告下载</a>[/#if]</td>
					<td>[#if "${report.jd_image!''}"!=""]<a href="${report.jd_image!''}" target="_blank">查看图片</a>[/#if]</td>
					</tr>
					[/#list>
				</table>
				</div>
			</div>	
	</div>
</div>
<iframe id="download" name="download" height="0px" width="0px"></iframe>