<script type="text/javascript" src="${_share_file_url!''}/resource/js/jquery.form.js"></script>
﻿<script type="text/javascript" src="${_share_file_url!''}/resource/js/jquery.validate.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/i18n/jquery.ui.datepicker-zh-CN.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/swfobject.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/nicEdit.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/My97DatePicker/WdatePicker.js"></script>
<script language="javascript" type="text/javascript">
$(function(){
	$("#updateInfo").click(function(){
		var message="";
		if($("#region",$("#updateForm")).val()=="")
			message+="管理范围不能为空"+"\n\r";
		var startTime1=$("#certificate_date",$("#updateForm")).val();
		if(startTime1!=""){
			var ed=new Date();
			re = /-/g;
			var sd=new Date(Date.parse(startTime1.replace(re, "/")));
			if(sd>ed){
				message+="证书取得时间不能大于当前日期\n\r";
			}
		}
		var regu=/^(0|[1-9][0-9]*)$/;//验证零和非零开头的数字
		if($("#work_years",$("#updateForm")).val()!=''&&!regu.test($("#work_years",$("#updateForm")).val())){
			message+="工作年限填写不正确\n\r";
		}
		if(message!=""){
			alert(message);
			return false;
		}
		var queryString=$("#updateForm").formSerialize();
		$.post($("#updateForm").attr("action"),queryString,
			function(data,textStatus){
				var jdata=jQuery.parseJSON(data);
				if(jdata.success==1){
					alert("保存成功！");
					window.close();
				}else{
					alert("操作失败！");
				}
		});
	});
	$("#manage_scope_name").click(function(){
			var str;
		 	var url="${_server_url!''}/portal/safemanage.tBuildingUnitdialog";
			if (window.showModalDialog!=null){
				str=window.showModalDialog(url,"","dialogWidth:700px;dialogHeight:600px;status:no;help:no;scrolling=no;scrollbars=no");
			}else{
				str=window.open(url,"","width=700px,height=600px,menubar=no,toolbar=no,location=no,scrollbars=no,status=no,modal=yes");
		 	}
		 	if(str!=undefined){
		 		$("#manage_scope_name").val(str[1]);
		 		$("#manage_scope").val(str[0]);
		 	}
	});
});
//当文件上传成功后，将返回id:flash对象的ID，name：新文件名,url:文件绝对路径
function returnvalue(id,name,url){
	if(id=="imgupload")
		$("#certificate").val(url);
}
function viewpic(fieldid,newfilepath){
	window.open(document.getElementById(fieldid).value);
}
</script>
<style>
.rightpad{text-align:right;padding-right:12px;background-color:#E1F1FE;color:#2a51a4;}
.leftpad{padding-left:12px;background-color:#F1F8FF;color:#4D4D4D;}
</style>
<div class="ui-widget ui-corner-all" style="position: relative;">
	<div class="ui-widget-header ui-corner-all" style="padding:4px;">
		<img  SRC="${_share_file_url!''}/resource/images/icon.gif" WIDTH="16" HEIGHT="16" BORDER=0 ALT="" align="absmiddle"/>
		&nbsp;更新安全检查员用户类型属性表
	</div>
</div>
[#assign result=block.safecensor]
<form class="cmxform" style="margin:0" action="${_servlet_url!''}/safemanage.safecensor.update1" method="post" id="updateForm">
	<table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#dee2e3" style="line-height:30px;">
		<input type="hidden" name="mem_id" id="mem_id" value="${result.mem_id!''}"/>
		[#if "${user.region_id!''}"!=""]
		<tr>
					<td class="rightpad" width="25%">管理范围:</td>
					<td class="leftpad">
						<select id="region" name="region" disabled>
							<option value="">------请选择------</option>
							[#list EnumService.getEnum('xzqh') as enum]
							<option value="${enum.enum_value!''}" [#if "${user.region_id!''}"=="${enum.enum_value!''}"]selected="true"[/#if]>${enum.enum_name!''}</option>
							[/#list]
						</select>
					</td>
			</tr>
		[#else]
			<tr>
					<td class="rightpad" width="25%">管理范围:</td>
					<td class="leftpad">
						<select id="region" name="region">
							<option value="">------请选择------</option>
							[#list EnumService.getEnum('xzqh') as enum]
							<option value="${enum.enum_value!''}" [#if "${result.region!''}"=="${enum.enum_value!''}"]selected="true"[/#if]>${enum.enum_name!''}</option>
							[/#list]
						</select>
					</td>
			</tr>
		[/#if]	
			[#if "${user.orgcom_id!''}"!=""&&"${user.orgcom_name!''}"!=""]
			<td class="rightpad" width="25%">所属责任单位:</td>
					<td class="leftpad">
						<input type="hidden" name="" id="" value="${user.orgcom_id!''}"/>
						<input type="text" name="" id="" value="${user.orgcom_name!''}" size="40" readonly="true"/>
					</td>
			[#else]
			<tr>
					<td class="rightpad" width="25%">所属责任单位:</td>
					<td class="leftpad">
						<input type="hidden" name="manage_scope" id="manage_scope" value="${result.manage_scope!''}"/>
						<input type="text" name="manage_scope_name" id="manage_scope_name" value="${result.manage_scope_name!''}" size="40" readonly="true"/>
					</td>
			</tr>
			[/#if]
			<tr>
					<td class="rightpad">从业资格证书编号</td>
					<td class="leftpad">
						<input type="text" name="certificate_number" id="certificate_number" value="${result.certificate_number!''}" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">证书取得时间</td>
					<td class="leftpad">
						[#if result.certificate_date?exists]
							<input type="text" name="certificate_date" id="certificate_date" value="${result.certificate_date?date}" onClick="WdatePicker()" size="15"/>
						[#else]
							<input type="text" name="certificate_date" id="certificate_date" value="" onClick="WdatePicker()" size="15"/>
						[/#if]
					</td>
			</tr>
			<tr>
					<td class="rightpad">从业资格证书复印件</td>
					<td class="leftpad">
						<input type="hidden" name="certificate" id="certificate" value="${result.certificate!''}"/>
						<div id="imguploaddiv"></div>
						<script language="javascript" type="text/javascript">
							var so = new SWFObject('${_share_file_url!''}/resource/jsp/imgupload.swf', "imgupload", "125", "60", "9", "#FFffff");//imgupload是控件ID,如有多个ID不可重复
							so.addVariable("oldname",$("#certificate").val());//修改时的原文件地址，可以是绝对或相对地址
							so.addVariable("savepath","images/manager/");//上传文件的路径
							so.addVariable("uploadpath","${_server_url!''}/eap/manager.system.upload?session_id=${session.id!''}");//上传请求地址so.addVariable("uploadpath","/eap/manager.system.upload");//上传请求地址
							so.write("imguploaddiv");
						</script>	
					</td>
			</tr>
			<tr>
					<td class="rightpad">专业技术职称</td>
					<td class="leftpad">
						<input type="text" name="professional_titles" id="professional_titles" value="${result.professional_titles!''}" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">从事专业</td>
					<td class="leftpad">
						<input type="text" name="professional" id="professional" value="${result.professional!''}" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">工作经验年限</td>
					<td class="leftpad">
						<input type="text" name="work_years" id="work_years" value="${result.work_years!''}" size="15"/>
					</td>
			</tr>
		<tr>
			<td style="background-color:#FFFFFF;"></td>
			<td style="background-color:#FFFFFF;">
				<button type="button" id="updateInfo">提交</button>&nbsp;
				<button type="button" onClick="window.history.go(-1);">返回</button>
			</td>
		</tr>
	</table>
</form>