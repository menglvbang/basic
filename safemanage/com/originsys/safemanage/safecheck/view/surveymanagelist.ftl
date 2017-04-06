<script src="${_share_file_url!''}/resource/js/i18n/grid.locale-cn.js" type="text/javascript"></script>
<script src="${_share_file_url!''}/resource/js/jquery.jqGrid.min.js" type="text/javascript"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" language="javascript">
$(function(){
	jQuery("#clist1").jqGrid({
	   	url:'${_servlet_url!''}/safecheck.survey.managelistjson',
		datatype: "json",
		width:600,
		height:300,
	   	colNames:[
			"building_id"
			,"survey_id"
			,"普查新坐落"
			,"楼幢原坐落"
			,"设计用途"
			,"建成时间"
			,"结构类型"
			,"管理模式"
			,"房屋性质"
			,"房屋安全情况"
			,"普查类型"
			,"普查时间"			
			,"普查状态"
			,"最后编辑人"
			,"定位"
	   	],
	   	colModel:[
			{name:'building_id',index:'building_id',sortable:true,hidden:true}
			,{name:'survey_id',index:'survey_id',sortable:true,hidden:true}
			,{name:'building_newaddress',index:'building_newaddress',sortable:true,width:100}
			,{name:'building_address',index:'building_address',sortable:true,width:100}
			,{name:'use_desgin',index:'use_desgin',sortable:true,width:25,hidden:true}
			,{name:'building_date',index:'building_date',sortable:true,width:20,hidden:true}
			,{name:'build_struct',index:'build_struct',sortable:true,width:25,hidden:true}
			,{name:'manage_type',index:'manage_type',sortable:true,width:20,hidden:true}
			,{name:'building_properties',index:'building_properties',sortable:true,hidden:true}
			,{name:'building_safecondition',index:'building_safecondition',sortable:true,width:35}
			,{name:'survey_type',index:'survey_type',sortable:true,width:35}
			,{name:'survey_date',index:'survey_date',sortable:true,hidden:true}
			,{name:'info_state',index:'info_state',sortable:true,width:25}
			,{name:'last_editor',index:'last_editor',sortable:true,width:30}
			,{name:'dw',index:'dw',width:20}
	   	],
	   	rowNum:10,
	   	autowidth: true,
	   	rowList:[10,20,30],
	   	pager: '#pager1',
	   	sortname: 'survey_id',
	    viewrecords: true,
	    sortorder: "desc",
	    rownumbers:true,
	    caption:"楼幢普查列表"
	});
	jQuery("#clist1").jqGrid('navGrid','#pager1',{edit:false,add:false,del:false,search:false,refreshtext:'刷新'});
	//模糊查询					
	jQuery("#gridReload").click(function() {
		var url="${_servlet_url!''}/safecheck.survey.managelistjson?"
		+"building_address="+$("#building_address").val()+"&"
		+"manage_type="+$("#manage_type").val()+"&"
		+"use_desgin="+$("#use_desgin").val()+"&"
		+"building_date="+$("#building_date").val()+"&"
		+"build_struct="+$("#build_struct").val()+"&"
		+"building_properties="+$("#building_properties").val()+"&"
		+"info_state="+$("#info_state").val()+"&"
		+"last_editor="+$("#last_editor").val()+"&"
		+"survey_date="+$("#survey_date").val()+"&"
		+"building_safecondition="+$("#building_safecondition").val()+"&"
		+"survey_type="+$("#survey_type").val();
		var url2 = encodeURI(url);
		jQuery("#clist1").jqGrid('setGridParam',{url:url2,page:1}).trigger('reloadGrid');
	});
	//修改按钮
	$("#updateInfo").click(function(){
		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
		if (id) { 
			var ret = jQuery("#clist1").jqGrid('getRowData',id);
			var info_state=ret.info_state;
			if(info_state == '审核通过'){
				alert("审核通过无法修改！");
				return;
			}
			window.location="${_servlet_url!''}/safecheck.survey.forupdate?building_id="+ret.building_id+"&&survey_id="+ret.survey_id;
		}else{
			alert("请选择一条记录！");
		}
	});
	//审核按钮
	$("#checkInfo").click(function(){
		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
		
		if (id) {
			var ret = jQuery("#clist1").jqGrid('getRowData',id);
			var info_state=ret.info_state;
			if(info_state == '未审核'){
				var url="${_servlet_url!''}/safecheck.survey.forcheck?building_id="+ret.building_id+"&&survey_id="+ret.survey_id;
				window.showModalDialog(url,"","dialogWidth:1000px;dialogHeight:600px;center:1;");
				jQuery("#clist1").trigger('reloadGrid');
			}else{
				alert("只能审核状态为未审核的！");
			}
		}else{
			alert("请选择一条记录！");
		}
	});	
	//查看信息按钮
	$("#selectInfo").click(function(){
		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
		if (id) { 
			var ret = jQuery("#clist1").jqGrid('getRowData',id);
			window.location="${_servlet_url!''}/safecheck.survey.detail?building_id="+ret.building_id+"&&survey_id="+ret.survey_id;	
		}else{
			alert("请选择一条记录！");
		}
	});	
	$("#printInfo").click(function(){
		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
		if (id) { 
			var ret = jQuery("#clist1").jqGrid('getRowData',id);
			window.location="${_servlet_url!''}/../exportdoc/safecheck.survey.detail?building_id="+ret.building_id+"&&survey_id="+ret.survey_id;	
		}else{
			alert("请选择一条记录！");
		}
	});	
	$("#excelInfo").click(function(){
		var url="${_servlet_url!''}/../exportexcel/safecheck.survey.detaillist?"
		//var url="${_servlet_url!''}/safecheck.survey.detaillist?"
		+"building_address="+$("#building_address").val()+"&"
		+"manage_type="+$("#manage_type").val()+"&"
		+"use_desgin="+$("#use_desgin").val()+"&"
		+"building_date="+$("#building_date").val()+"&"
		+"build_struct="+$("#build_struct").val()+"&"
		+"building_properties="+$("#building_properties").val()+"&"
		+"info_state="+$("#info_state").val()+"&"
		+"last_editor="+$("#last_editor").val()+"&"
		+"survey_date="+$("#survey_date").val()+"&"
		+"building_safecondition="+$("#building_safecondition").val()+"&"
		+"survey_type="+$("#survey_type").val();
		var url2 = encodeURI(url);
		window.location=url2;	
	});	
	//生成鉴定任务单按钮
	$("#taskInfo").click(function(){
		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
		if (id) {
			var ret = jQuery("#clist1").jqGrid('getRowData',id);
			var info_state=ret.info_state;
			if(info_state == '审核通过'){
				var url="${_servlet_url!''}/safeauth.jdtask.insertsurvey?building_id="+ret.building_id;	
				$.post(url,"",function(data,textStatus){
					var jdata=jQuery.parseJSON(data);
					if(jdata.success=="1"){
						alert("生成成功!!");
					}else if(jdata.success=="2"){
						alert("该记录已经生成鉴定任务单!!");
					}else{
						alert("生成失败!!");
					}
				});
			}else{
				alert("只能生成审核通过的记录！");
			}
		}else{
			alert("请选择一条记录！");
		}
	});
	
	doResize();
});
//自适应窗口边框
var t=document.documentElement.clientWidth; 
window.onresize = function(){ 
	if(t != document.documentElement.clientWidth){
		t = document.documentElement.clientWidth;
		doResize();
	}
}
function doResize() {
	var ss = getPageSize();
	$("#clist1").jqGrid('setGridWidth', ss.WinW-20);
	$("#clist1").jqGrid('setGridHeight', ss.WinH-180);
}
function getPageSize() {
	var winW, winH;
	if(window.innerHeight) {// all except IE
		winW = window.innerWidth;
		winH = window.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) {// IE 6 Strict Mode
		winW = document.documentElement.clientWidth;
		winH = document.documentElement.clientHeight;
	} else if (document.body) { // other
		winW = document.body.clientWidth;
		winH = document.body.clientHeight;
	}  // for small pages with total size less then the viewport 
		return {WinW:winW, WinH:winH};
}
//清空查询条件
function emptiedAndSubmit(){
	$("#building_address").val("");
	$("#manage_type").val("");
	$("#use_desgin").val("");
	$("#building_date").val("");
	$("#build_struct").val("");
	$("#building_properties").val("");
	$("#building_safecondition").val("");
	$("#info_state").val("");
	$("#last_editor").val("");
	$("#survey_date").val("");
	$("#survey_type").val("");
    jQuery("#clist1").jqGrid('setGridParam',{url:encodeURI("${_servlet_url!''}/safecheck.survey.managelistjson"),page:1}).trigger("reloadGrid");
}

</script>
<style>
.td12{text-align:right;padding-right:12px;background-color:#E1F1FE;color:#2a51a4;}
.td13{padding-left:12px;background-color:#F1F8FF;color:#4D4D4D;}
</style>
<div class="skin_search ui-widget-content" style="padding:.2em;margin-bottom:8px;">
<form name="dic_form" id="dic_form" action="" method="post">
		<table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#dee2e3" style="line-height:30px;">
		<tr>
		<td class="td12">楼幢坐落:</td>
		<td class="td13" colspan="3">
		<input type="text" size="40" name="building_address" id="building_address"/>
		</td>
		<td class="td12">设计用途:</td>
		<td class="td13">
			<select id="use_desgin" name="use_desgin">
			<option value="">------请选择------</option>
			[#list EnumService.getEnum('sjyt') as enum]
			<option value="${enum.enum_value!''}">${enum.enum_name!''}</option>
			[/#list]
			</select>
		</td>
		<td class="td12">管理模式:</td>
		<td class="td13">
			<select name="manage_type" id="manage_type">
				<option value="">------请选择------</option>
				<option value="1">物业管理</option>
				<option value="2">单位自管</option>
				<option value="3">无明确管理单位</option>
				<option value="4">其他</option>
			</select>
		</td>
		</tr>
		<tr>
		<!--<td class="td12">建成时间:</td>
		<td class="td13">
		<input type="text" size="10" name="building_date" id="building_date" onClick="WdatePicker({dateFmt:'yyyy'})"/>
		</td>-->
		<td class="td12">普查类型:</td>
		<td class="td13">
			<select name="survey_type" id="survey_type">
				<option value="">------请选择------</option>
			[#if EnumService.getEnum('survey_type')?exists]
			[#list EnumService.getEnum('survey_type') as enum]
			<option value="${enum.enum_value!''}">${enum.enum_name!''}</option>
			[/#list]
			[/#if]
			</select>
		</td>
		<td class="td12">普查时间:</td>
		<td class="td13">
			<input type="text" size="10" name="survey_date" id="survey_date" onClick="WdatePicker()"/>
		</td>
		<td class="td12">房屋安全情况:</td>
		<td class="td13">
			<select name="building_safecondition" id="building_safecondition">
				<option value="">------请选择------</option>
				<option value="1">无问题房屋</option>
				<option value="4">有问题房屋</option>
			</select>
		</td>
		<td class="td12">普查状态:</td>
		<td class="td13">
			<select name="info_state" id="info_state">
				<option value="">------请选择------</option>
				<option value="0">暂存</option>
				<option value="1">未审核</option>
				<option value="2">审核驳回</option>
				<option value="8">审核通过</option>
			</select>
		</td>
		</tr>
		<tr>
		<td class="td12">最后编辑人:</td>
		<td class="td13">
			<input type="text" size="10" name="last_editor" id="last_editor"/>
		</td>
		<td class="td12">房屋性质:</td>
		<td class="td13">
			<select name="building_properties" id="building_properties">
				<option value="">------请选择------</option>
				<option value="1">单位自管房</option>
				<option value="2">直管公房</option>
				<option value="3">房改住房</option>
				<option value="4">私房</option>
				<option value="5">其他</option>
			</select>
		</td>
		<td class="td12">结构类型:</td>
		<td class="td13">
			<select id="build_struct" name="build_struct">
			<option value="">------请选择------</option>
			[#if EnumService.getEnum('fwjg')?exists]
			[#list EnumService.getEnum('fwjg') as enum]
			<option value="${enum.enum_value!''}">${enum.enum_name!''}</option>
			[/#list]
			[/#if]
			</select>
		</td>
		<td class="td13" colspan="2"><button type="button" id="gridReload">查询</button><button onclick="emptiedAndSubmit()" style="margin-left:10px;">清空查询条件</button></td>
		</tr>
		</table>
	</form>
</div>
<div  id="buttons" style="text-align:right;margin-bottom:8px;">
	<button type="button" id="checkInfo" align="right">审核</button>
	<button type="button" id="excelInfo" align="right">导出列表明细excel</button>
	[#if access.canDo(user,'safeauth.jdtask.insertsurvey')]
	<button type="button" id="taskInfo" align="right">生成鉴定任务单</button>
	[/#if]
	<!--button type="button" id="selectInfo" align="right">查看</button -->
	<!--button type="button" id="printInfo" align="right">输出word</button -->
</div>
<div id="pager1"></div>
<table id="clist1"></table>
