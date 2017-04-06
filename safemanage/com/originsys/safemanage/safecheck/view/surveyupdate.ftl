<script type="text/javascript" src="${_share_file_url!''}/resource/js/jquery.form.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/ajaxfileupload.js"></script>
<script type="text/javascript" language="javascript">
$(function(){
	$("#outdiv").css("display","block");	
});
function dosave(op){
	var str="";
	//var building_address=$("#building_address").val();
	//if(null==$("#building_address").val() || $("#building_address").val()==''){
	//	str+="坐落地址不能为空\n\r";
	//}
	if(null==$("#building_region").val() || $("#building_region").val()==''){
		str+="所属区域不能为空\n\r";
	}
	var building_date=$("#building_date").val();
	if(building_date!=""){
		var ed=new Date().getFullYear();
		if(building_date>ed){
			str+="建成年份不能大于当前日期\n\r";
		}
	}
	var isarea=/^\d+(\.\d+)?$/;
	var build_area=$("#build_area").val();
	if(build_area!="" && !isarea.test(build_area)){
		str+="建筑面积填写不正确\n\r";
	}
	var regu="^(0|[1-9][0-9]*)$";//验证零和非零开头的数字
	var re = new RegExp(regu); 
	if($("#house_count").val()!='' && !(re.test($("#house_count").val()))){ 
		str+="套数填写不正确\n\r";
	} 
	if($("#floorup_count").val()!='' && !(re.test($("#floorup_count").val()))){ 
		str+="地上层数填写不正确\n\r";
	} 
	if($("#floordown_count").val()!='' && !(re.test($("#floordown_count").val()))){ 
		str+="地下层数填写不正确\n\r";
	} 
	var building_manager_phone=$("#building_manager_phone").val();
	var isPhone=/^13[0-9]{9}$|15[0-9]{9}$|18[0-9]{9}$|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/i;
	if(building_manager_phone!="" && !isPhone.test(building_manager_phone)){
		str+="房屋管理人办公电话、手机填写不正确\n\r";
	}
	var survey_date=$("#survey_date").val();
	if(survey_date!=""){
		var ed=new Date();
		re = /-/g;
		var sd=new Date(Date.parse(survey_date.replace(re, "/")));
		if(sd>ed){
			str+="排查日期不能大于当前日期\n\r";
		}
	}
	if(op=="tj"){
		if(null==$("#building_safecondition").val() || $("#building_safecondition").val()==''){
			str+="房屋安全情况不能为空\n\r";
		}
		if(null==$("#manager_name").val() || $("#manager_name").val()==''){
			str+="负责人不能为空\n\r";
		}
		if(null==$("#survey_name").val() || $("#survey_name").val()==''){
			str+="排查人不能为空\n\r";
		}
		if(null==$("#survey_date").val() || $("#survey_date").val()==''){
			str+="排查日期不能为空\n\r";
		}
	}
	if(str!=''){
		alert(str);
	}else{
		var queryString=$("#addForm").formSerialize();
		$.post($("#addForm").attr("action")+"?op="+op,queryString,
			function(data,textStatus){
			var jdata=jQuery.parseJSON(data);
			if(jdata.success==0){
				if(op=="zc")
					alert("暂存失败！");
				else
					alert("提交失败！");
			}else{
				if(op=="zc")
					alert("暂存成功！");
				else
					alert("提交成功！");
			}
		});
	}
}
function imageUpload()
	{
		if($("#fileToUpload").val()==''||$("#fileToUpload").val()==null){
			alert("请先选择要上传的文件！");
			return false;
		}else{
			$.ajaxFileUpload
		(
			{
				url:'${_server_url!''}/eap/safecheck.uploadimage',
				secureuri:false,
				fileElementId:'fileToUpload',
				dataType: 'json',
				data:{savepath:'files/survey/'},
				success: function (data, status)
				{
					if(typeof(data.returnfilename) != 'undefined')
					{
						if(data.returnfilename != '')
						{
							alert("上传成功！");
							$("#annex_pic").val(data.returnfilename);
							$("#annex_pic1").val(data.returnfilename);
							//$("#returnval").attr("href",data.returnfilename);
							//$("#returnval").text("点击查看");
							$("#returnval").attr("style","display:inline-block");
						}else
						{
							alert("未上传成功！");
						}
					}
				},
				error: function (data, status, e)
				{
					alert(e);
				}
			}
		)
		
		return false;
			
		}
		
	}
function fileUpload()
	{
		if($("#fileToUpload1").val()==''||$("#fileToUpload1").val()==null){
			alert("请先选择要上传的文件！");
			return false;
		}else{
			$.ajaxFileUpload
		(
			{
				url:'${_server_url!''}/eap/safecheck.uploadfile',
				secureuri:false,
				fileElementId:'fileToUpload1',
				dataType: 'json',
				data:{savepath:'files/survey/'},
				success: function (data, status)
				{
					if(data.success=='0'){
						alert("上传成功！");
						$("#annex").val("/eap/commonservice.download?file_id="+data.file_id);
						$("#annex1").val("/eap/commonservice.download?file_id="+data.file_id);
						//$("#annex").val(data.save_name);
						//$("#returnval1").attr("href",data.save_name);
						//$("#returnval1").text("点击下载");
						$("#returnval1").attr("style","display:inline-block");
					}else if(data.success=='1'){
						alert("请检查上传文件的类型！");
					}else{
						alert("没有上传权限！");
					}
				},
				error: function (data, status, e)
				{
					alert(e);
				}
			}
		)
		
		return false;
			
		}
		
	}
function fileDownload(){
	window.location.href=$("#annex").val();
}
function imageDownload(){
	window.open($("#annex_pic").val(),'_blank','depended=yes,top='+(window.screen.height-30-500)/2+',left='+(window.screen.width-10-800)/2+',width=800,height=500,menubar=no,toolbar=no,location=no,directories=no,status=no,scrollbars=yes');
}
function changeAddress(flag){
	if(flag=='1'){
		$("#building_newaddress").val($("#building_address").val());
	}else{
		$("#building_newaddress").val("");
	}
}
</script>
<style>
.td12{text-align:right;padding-right:12px;background-color:#E1F1FE;color:#2a51a4;}
.td13{padding-left:12px;background-color:#F1F8FF;color:#4D4D4D;}
.tdpad {padding-left:4px; background-color:#ffffff}
.td_title {text-align:right;padding-right:4px; background-color:#ffffff}
.file-box input{ vertical-align:middle; margin:0; padding:0}
.file-box{ position:relative;width:440px;WHITE-SPACE:nowrap;}
.file-box .txt{ height:22px; border:1px solid #cdcdcd; width:195px;}
.file-box .btn{ background-color:#FFF; border:1px solid #CDCDCD;height:24px; width:60px;}
.file-box .file{ position:absolute; top:3px; right:180px; height:24px; filter:alpha(opacity:0);opacity: 0;width:260px }
</style>
<div class="widget-title-normal">
	<div class="child">
		<span class="widget-title-text">
			楼幢普查修改
		</span>
	</div>
</div>
<div id="outdiv" style="display:none">
<form action="${_servlet_url!''}/safecheck.survey.save" id="addForm" method="post">
<input type="hidden" name="floor_count" value="${block.buildingsurvey.floor_count!''}">
	<div  id="buttons" style="text-align:right">
		<button type="reset">重置</button>
		<button type="button" onclick="dosave('zc');">暂存</button>
		<button type="button" onclick="dosave('tj');">提交</button>
		<!--button type="button" onclick="javascript:window.history.go(-1);" >返回</button-->
	</div>
<div class="ui-widget ui-widget-content ui-corner-all" style="position: relative;padding: .1em;">
	<div class="ui-widget" id="tabs">
			<table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#dee2e3" style="line-height:30px;">
				<tr>
					<td class="td12"><font color="red">&nbsp;</font>坐落地址：</td>
					<td class="td13" colspan="3"><input type="text" id="building_address" name="building_address" size="80" value="${block.buildingsurvey.building_address!''}"></td>
					<td class="td12"><font color="red">*&nbsp;</font>普查编号：</td>
					<td class="td13">${block.buildingsurvey.survey_id!''}
					<input type="hidden" name="survey_id" value="${block.buildingsurvey.survey_id!''}">
					<input type="hidden" name="building_id" value="${block.buildingsurvey.building_id!''}"></td>
				</tr>
				<tr>
					<td class="td12"><font color="red">*&nbsp;</font>普查新坐落：</td>
					<td class="td13" colspan="3"><input type="text" id="building_newaddress" name="building_newaddress" size="80" value="${block.buildingsurvey.building_newaddress!''}"></td>
					<td class="td12"><font color="red">*&nbsp;</font>坐落是否一致：</td>
					<td class="td13">
						<input type="radio" name="issame" id="issame1" value="1" [#if "${block.buildingsurvey.issame!''}"=="1"]checked[/#if] onclick="changeAddress(1)">&nbsp;是
						<input type="radio" name="issame" id="issame2" value="0" [#if "${block.buildingsurvey.issame!''}"=="0"]checked[/#if] onclick="changeAddress(0)">&nbsp;否
					</td>
				</tr>
				<tr>
					<td class="td12"><font color="red">*&nbsp;</font>所属区域：</td>
					<td class="td13">
					[#list EnumService.getEnum('xzqh') as enum][#if "${block.buildingsurvey.building_region!''}"=="${enum.enum_value!''}"][#if "${block.ischange!''}"=="0"] ${enum.enum_name!''} [/#if][/#if][/#list]
					<select id="building_region" name="building_region" [#if "${block.ischange!''}"=="0"] style="display:none;" [/#if]>
						<option value="">------请选择------</option>
						[#list EnumService.getEnum('xzqh') as enum]
						<option value="${enum.enum_value!''}" [#if "${block.buildingsurvey.building_region!''}"=="${enum.enum_value!''}"]selected[/#if]>${enum.enum_name!''}</option>
						[/#list]
						</select>
					</td>
					<td class="td12">用途：</td>
					<td class="td13">
						<select id="use_desgin" name="use_desgin">
						<option value="">------请选择------</option>
						[#list EnumService.getEnum('sjyt') as enum]
						<option value="${enum.enum_value!''}" [#if "${block.buildingsurvey.use_desgin!''}"=="${enum.enum_value!''}"]selected[/#if]>${enum.enum_name!''}</option>
						[/#list]
						</select>
					</td>
					<td class="td12">建筑面积：</td>
					<td class="td13"><input type="text" id="build_area" name="build_area" [#if "${block.buildingsurvey.build_area!''}"!=""]value="#{block.buildingsurvey.build_area!'';m0M2}"[/#if] size="18"></td>
				</tr>
				<tr>
					<td class="td12">地上层数：</td>
					<td class="td13"><input type="text" id="floorup_count" name="floorup_count" value="${block.buildingsurvey.floorup_count!''}" size="18"></td>
					<td class="td12">地下层数：</td>
					<td class="td13"><input type="text" id="floordown_count" name="floordown_count" value="${block.buildingsurvey.floordown_count!''}" size="18"></td>
					<td class="td12">套数：</td>
					<td class="td13"><input type="text" id="house_count" name="house_count" value="${block.buildingsurvey.house_count!''}" size="18"></td>
				</tr>
				<tr>
					<td class="td12">建成年份：</td>
					<td class="td13"><input type="text" id="building_date" name="building_date" value="${block.buildingsurvey.building_date!''}" size="18" onClick="WdatePicker({dateFmt:'yyyy'})"></td>
					<td class="td12">房屋所有人（管理单位）：</td>
					<td class="td13"><input type="text" name="building_holder" size="18" value="${block.buildingsurvey.building_holder!''}"></td>
					<td class="td12">房屋管理人姓名：</td>
					<td class="td13"><input type="text" name="building_manager_name" size="18" value="${block.buildingsurvey.building_manager_name!''}"></td>
				</tr>
				<tr>
					<td class="td12">房屋管理人办公电话、手机：</td>
					<td class="td13"><input type="text" id="building_manager_phone" name="building_manager_phone" size="18"  value="${block.buildingsurvey.building_manager_phone!''}"></td>
					<td class="td12">设计和施工材料：</td>
					<td class="td13">
						<select name="building_material" >
							<option value="">------请选择------</option>
							<option value="1" [#if "${block.buildingsurvey.building_material!''}"=="1" ]selected[/#if]>齐全</option>
							<option value="2" [#if "${block.buildingsurvey.building_material!''}"=="2" ]selected[/#if]>基本齐全</option>
							<option value="3" [#if "${block.buildingsurvey.building_material!''}"=="3" ]selected[/#if]>无</option>
						</select>
					</td>
					<td class="td12">管理模式：</td>
					<td class="td13">
						<select name="manage_type">
							<option value="">------请选择------</option>
							<option value="1" [#if "${block.buildingsurvey.manage_type!''}"=="1" ]selected[/#if]>物业管理</option>
							<option value="2" [#if "${block.buildingsurvey.manage_type!''}"=="2" ]selected[/#if]>单位自管</option>
							<option value="3" [#if "${block.buildingsurvey.manage_type!''}"=="3" ]selected[/#if]>无明确管理单位</option>
							<option value="4" [#if "${block.buildingsurvey.manage_type!''}"=="4" ]selected[/#if]>其他</option>
						</select>
					</td>
				</tr>
				<tr>
					<td class="td12">建设单位：</td>
					<td class="td13">
						<input type="text" id="build_dept" name="build_dept" size="18" value="${block.buildingsurvey.build_dept!''}">
					</td>
					<td class="td12">设计单位：</td>
					<td class="td13">
						<input type="text" id="design_dept" name="design_dept" size="18" value="${block.buildingsurvey.design_dept!''}">
					</td>
					<td class="td12">施工单位：</td>
					<td class="td13">
						<input type="text" id="construct_dept" name="construct_dept" size="18" value="${block.buildingsurvey.construct_dept!''}">
					</td>
				</tr>
				<tr>
					<td class="td12">结构类型：</td>
					<td class="td13">
						<select name="build_struct">
							<option value="">------请选择------</option>
							[#list EnumService.getEnum('fwjg') as enum]
							<option value="${enum.enum_value!''}" [#if "${block.buildingsurvey.build_struct!''}"=="${enum.enum_value!''}" ]selected[/#if]>${enum.enum_name!''}</option>
							[/#list]
						</select>
					</td>
					<td class="td12">楼盖类型：</td>
					<td class="td13">
						<select name="upon_type">
							<option value="">------请选择------</option>
							[#list EnumService.getEnum('upon_type') as enum]
							<option value="${enum.enum_value!''}" [#if "${block.buildingsurvey.upon_type!''}"=="${enum.enum_value!''}" ]selected[/#if]>${enum.enum_name!''}</option>
							[/#list]
						</select>
					</td>
					<td class="td12">屋面类型：</td>
					<td class="td13">
						<select name="wm_type">
							<option value="">------请选择------</option>
							[#list EnumService.getEnum('wm_type') as enum]
							<option value="${enum.enum_value!''}" [#if "${block.buildingsurvey.wm_type!''}"=="${enum.enum_value!''}" ]selected[/#if]>${enum.enum_name!''}</option>
							[/#list]
						</select>
					</td>
				</tr>
				<tr>
					<td class="td12">房屋性质：</td>
					<td class="td13">
						<select name="building_properties">
							<option value="">------请选择------</option>
							<option value="1" [#if "${block.buildingsurvey.building_properties!''}"=="1" ]selected[/#if]>单位自管房</option>
							<option value="2" [#if "${block.buildingsurvey.building_properties!''}"=="2" ]selected[/#if]>直管公房</option>
							<option value="3" [#if "${block.buildingsurvey.building_properties!''}"=="3" ]selected[/#if]>房改住房</option>
							<option value="4" [#if "${block.buildingsurvey.building_properties!''}"=="4" ]selected[/#if]>私房</option>
							<option value="5" [#if "${block.buildingsurvey.building_properties!''}"=="5" ]selected[/#if]>其他</option>
						</select>
					</td>
					<td class="td12"><font color="red">*&nbsp;</font>房屋安全情况：</td>
					<td class="td13" colspan="3">
						<select name="building_safecondition" id="building_safecondition">
							<option value="">------请选择------</option>
							<option value="1" [#if "${block.buildingsurvey.building_safecondition!''}"=="1"]selected[/#if]>无问题房屋</option>
							<option value="4" [#if "${block.buildingsurvey.building_safecondition!''}"=="4"]selected[/#if]>有问题房屋</option>
						</select>
					</td>
					</tr>
				<tr>
					<td class="td12"><font color="red">*&nbsp;</font>负责人：</td>
					<td class="td13"><input type="text" id="manager_name" name="manager_name" size="18"  value="${block.buildingsurvey.manager_name!''}"></td>
					<td class="td12"><font color="red">*&nbsp;</font>排查人：</td>
					<td class="td13"><input type="text" id="survey_name" name="survey_name" size="18" value="${block.buildingsurvey.survey_name!''}"></td>
					<td class="td12"><font color="red">*&nbsp;</font>排查日期：</td>
					<td class="td13"><input type="text" id="survey_date" name="survey_date" size="18" [#if block.buildingsurvey.survey_date?exists]value="${block.buildingsurvey.survey_date?string('yyyy-MM-dd')}"[/#if]  onClick="WdatePicker()"></td>
				</tr>
				<tr>
					<td class="td12">上传附件：</td>
					<td class="td13" colspan="5">
					<div class="file-box">
						<input type="hidden" id="annex" name="annex" class='txt' value="${block.buildingsurvey.annex!''}">
						<input type="text" id="annex1" name="annex1" class='txt' value="${block.buildingsurvey.annex!''}">
						<input type='button' class="btn" value='浏览...' />
						<input type="file" id="fileToUpload1" size="28" name="fileToUpload1" class="file" onchange="document.getElementById('annex1').value=this.value" >
						<input type='button' onclick="return fileUpload();" class="btn" value='点击上传' style="margin-right:5px;"/>
						<input type='button' onclick="fileDownload()" id="returnval1" name="returnval1"  class="btn"  style="[#if "${block.buildingsurvey.annex!''}"!='']display:inline-block[#else]display:none[/#if];" value="下载附件"/>
					</div>
					</td>
				</tr>
				<tr>
					<td class="td12">上传图片：</td>
					<td class="td13" colspan="5">
					<div class="file-box">
						<input type="hidden" id="annex_pic" name="annex_pic" class='txt'  value="${block.buildingsurvey.annex_pic!''}">
						<input type="text" id="annex_pic1" name="annex_pic1" class='txt'  value="${block.buildingsurvey.annex_pic!''}">
						<input type='button' class="btn" value='浏览...' />
						<input id="fileToUpload" type="file" size="28" name="fileToUpload" class="file" onchange="document.getElementById('annex_pic1').value=this.value" >
						<input type='button' onclick="return imageUpload();" class="btn" value='点击上传' style="margin-right:5px;"/>
						<input type='button' onclick="imageDownload()"  class="btn"  id="returnval" name="returnval" style="[#if "${block.buildingsurvey.annex_pic!''}"!='']display:inline-block[#else]display:none[/#if];" value="查看图片"/>
					</div>
					</td>
				</tr>	
				<tr>
					<td class="td12">现场调查</td>
					<td class="td13" colspan="5">
						主要危险情况（包括地基基础、上部承重结构及使用历史情况）<br/>
						<textarea cols="80" rows="5" name="local_survey">${block.buildingsurvey.local_survey!''}</textarea>
					</td>
				</tr>	
		</table>		
	</div>
</div>	
</form>
</div>