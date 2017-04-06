<script src="${_share_file_url!''}/resource/js/i18n/grid.locale-cn.js" type="text/javascript"></script>
<script src="${_share_file_url!''}/resource/js/jquery.jqGrid.min.js" type="text/javascript"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/jquery.form.js"></script>
﻿<script type="text/javascript" src="${_share_file_url!''}/resource/js/jquery.validate.js"></script>
<script type="text/javascript" language="javascript">
$(function(){
	//删除弹出框
	$("#delete-dialog").dialog({
		autoOpen: false,
      	height: 200,
      	width: 470,
      	modal: true,
        buttons: {
        	'确定': function() {
        		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
				var ret = jQuery("#clist1").jqGrid('getRowData',id);
				$.post("${_servlet_url!''}/safemanage.tBuildingProjectdelete?project_id="+ret.project_id,"",function(data,textStatus){
					var jdata=jQuery.parseJSON(data);
					if(jdata.success==1){
						jQuery("#clist1").trigger('reloadGrid');
						$("#delete-dialog").dialog("close");
					}else{
						jQuery("#clist1").trigger('reloadGrid');
						$("#delete-dialog").dialog("close");
						alert("删除失败!!");
					}
				});
			},
			'取消': function() {
				$(this).dialog("close");
			}
		}
	});
	//表格
	jQuery("#clist1").jqGrid({
	   	url:'${_servlet_url!''}/safemanage.tBuildingProjectlistdata',
		datatype: "json",
		width:600,
		height:300,
	   	colNames:[
				"project_id"
			,"管理项目名称"
			,"管理项目地址"
			,"所属区域"
			,"安全管理单位"
			,"project_buildingids"
			,"操作"
			,"信息状态"
			,"信息状态"
			,"备注"
	   	],
	   	colModel:[
			{name:'project_id',index:'project_id',sortable:true,hidden:true}
			,{name:'project_name',index:'project_name',sortable:true,width:20}
			,{name:'project_address',index:'project_address',sortable:true,width:20}
			,{name:'city_district',index:'city_district',sortable:true,width:10}
			,{name:'unit_id',index:'unit_id',sortable:true,width:20}
			,{name:'project_buildingids',index:'project_buildingids',hidden:true}
			,{name:'op',index:'op',sortable:true,width:15}
			,{name:'review_state',index:'review_state',hidden:true}
			,{name:'review_state1',index:'review_state1',sortable:true,width:10}
			,{name:'project_desc',index:'project_desc',sortable:true,width:10}
	   	],
	   	rowNum:10,
	   	autowidth: true,
	   	rowList:[10,20,30],
	   	pager: '#pager1',
	   	sortname: 'project_id',
	    viewrecords: true,
	    sortorder: "asc",
	    rownumbers:true,
	    caption:"管理项目列表"
	});
	jQuery("#clist1").jqGrid('navGrid','#pager1',{edit:false,add:false,del:false,search:false,refreshtext:'刷新'});
	//查看详细
	$("#selectInfo").click(function(){
		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
		if (id) { 
			var ret = jQuery("#clist1").jqGrid('getRowData',id);
			if(ret.review_state=="2"){
				alert("审核通过的信息不能再审核！");
				return false;
			}
			var url="${_server_url!''}/portal/safemanage.tBuildingProjectforcheck?project_id="+ret.project_id;
			//IE判断
			if (window.showModalDialog!=null)
				window.showModalDialog(url,"","dialogWidth:600px;dialogHeight:330px;status:no;help:no;scrolling=no;scrollbars=no");
			else
				window.open(url,"","width=600px,height=330px,menubar=no,toolbar=no,location=no,scrollbars=no,status=no,modal=yes");
			jQuery("#clist1").trigger("reloadGrid");
		}else{
			alert("请选择一条记录！");
		}
	});
	//更新
	$("#updateInfo").click(function(){
		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
		if (id) { 
			var ret = jQuery("#clist1").jqGrid('getRowData',id);
			if(ret.review_state=="2"){
				alert("审核通过的信息不能再修改！");
				return false;
			}
			var url="${_server_url!''}/portal/safemanage.tBuildingProjectmodify?project_id="+ret.project_id;
			//IE判断
			if (window.showModalDialog!=null)
				window.showModalDialog(url,"","dialogWidth:600px;dialogHeight:330px;status:no;help:no;scrolling=no;scrollbars=no");
			else
				window.open(url,"","width=600px,height=330px,menubar=no,toolbar=no,location=no,scrollbars=no,status=no,modal=yes");
			jQuery("#clist1").trigger("reloadGrid");
		}else{
			alert("请选择一条记录！");
		}
	});
	//删除
	$("#deleteInfo").click(function(){
		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
		if (id) {
			var ret = jQuery("#clist1").jqGrid('getRowData',id);
			if(ret.review_state=="2"){
				alert("审核通过的信息不能再删除！");
				return false;
			}
			//打开对话框
			$("#delete-dialog").dialog( "open" );
		}else{
			alert("请选择一条记录！");
		}
	});
	//模糊查询
	jQuery("#gridReload").click(function() {
		var url="${_servlet_url!''}/safemanage.tBuildingProjectlistdata"						
		var queryString=$("#dic_form").formSerialize();
		var url2 = url+"?"+queryString;
		jQuery("#clist1").jqGrid('setGridParam',{url:url2}).trigger("reloadGrid");
	});

	$("#addInfo").click(function(){
		var url="${_server_url!''}/portal/safemanage.tBuildingProjectinsert";
		//IE判断
		if (window.showModalDialog!=null)
			window.showModalDialog(url,"","dialogWidth:600px;dialogHeight:330px;status:no;help:no;scrolling=no;scrollbars=no");
		else
			window.open(url,"","width=600px,height=330px,menubar=no,toolbar=no,location=no,scrollbars=no,status=no,modal=yes");
		jQuery("#clist1").trigger("reloadGrid");
	});
	
	
});
function doChooseBuilding(project_id){
	var url="${_server_url!''}/portal/safemanage.tBuildingProjectmodify2?project_id="+project_id;
	//IE判断
	if (window.showModalDialog!=null)
		window.showModalDialog(url,"","dialogWidth:1250px;dialogHeight:800px;status:no;help:no;scrolling=no;scrollbars=no");
	else
		window.open(url,"","width=1250px,height=800px,menubar=no,toolbar=no,location=no,scrollbars=no,status=no,modal=yes");
}
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
	$("#clist1").jqGrid('setGridWidth', ss.WinW-15);
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
</script>
<style>
.td12{text-align:right;padding-right:12px;background-color:#E1F1FE;color:#2a51a4;}
.td13{padding-left:12px;background-color:#F1F8FF;color:#4D4D4D;}
</style>
<div class="skin_search ui-widget-content" style="padding:.2em;margin-bottom:8px;">
	<form name="dic_form" id="dic_form" action="" method="post">
		<table width="100%" border="0" cellpadding="0" cellspacing="1" style="table-layout:fixed;line-height:30px;">
			<tr>
			<td class="td12">管理项目名称:</td>
			<td class="td13"><input type="text" size="10" name="project_name_select" id="project_name_select"/></td>
			<td class="td12">所属区域:</td>
			<td class="td13">
					<select name="city_district_select" id="city_district_select">
						<option value="">--请选择--</option>
						[#if EnumService.getEnum('xzqh')?exists]
						[#list EnumService.getEnum('xzqh') as enum]
						<option value="${enum.enum_value!''}">${enum.enum_name!''}</option>
						[/#list]
						[/#if]
					</select>
			</td>
			<td class="td12">安全管理单位:</td>
			<td class="td13"><input type="text" size="10" name="unit_id_select" id="unit_id_select"/></td>
			<td class="td12">审核状态:</td>
			<td class="td13">
					<select name="review_state_select" id="review_state_select">
						<option value="">--请选择--</option>
						<option value="0">待审核</option>
						<option value="1">审核驳回</option>
						<option value="2">审核通过</option>
					</select>
			</td>
			<td class="td13"><button type="button" id="gridReload">查询</button></td>
			</tr>
		</table>
	</form>
</div>
<div  id="buttons" style="text-align:right;margin-bottom:8px;">
		<button type="button" id="addInfo" align="right">增加</button>
		<button type="button" id="updateInfo" align="right">修改</button>
		<button type="button" id="deleteInfo" align="right">删除</button>
[#if access.canDo(user,"safemanage.tBuildingProjectforcheck")]		
		<button type="button" id="selectInfo" align="right">审核</button>
[/#if]		
</div>
<div id="pager1"></div>
<table id="clist1"></table>

<div id="delete-dialog" title="删除记录" style="display:none;height:200px;widht=470px;">
	<div class="ui-widget">
		<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;">
			<p>
			<span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span>
			<strong>确定删除该信息?</strong>
			</p>
		</div>
	</div>
</div>