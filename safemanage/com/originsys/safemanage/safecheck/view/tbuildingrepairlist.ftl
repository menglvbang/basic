<script src="${_share_file_url!''}/resource/js/i18n/grid.locale-cn.js" type="text/javascript"></script>
<script src="${_share_file_url!''}/resource/js/jquery.jqGrid.min.js" type="text/javascript"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" language="javascript">
$(function(){
	jQuery("#clist1").jqGrid({
	   	url:'${_servlet_url!''}/safecheck.repair.listjson',
		datatype: "json",
		width:600,
		height:300,
	   	colNames:[
			"building_id"
			,"repair_id"
			,"维修内容"
			,"维修费用"
			,"维修单位"
			,"维修负责人"
			,"维修负责电话"
			,"完成时间"
	   	],
	   	colModel:[
			{name:'building_id',index:'building_id',sortable:true,hidden:true}
			,{name:'repair_id',index:'repair_id',sortable:true,hidden:true}
			,{name:'repair_content',index:'repair_content',sortable:true}
			,{name:'repair_cost',index:'repair_cost',sortable:true,width:20}
			,{name:'repair_organ',index:'repair_organ',sortable:true,width:50}
			,{name:'repair_manager',index:'repair_manager',sortable:true,width:30}
			,{name:'manager_tel',index:'manager_tel',sortable:true,width:30}
			,{name:'complete_date',index:'complete_date',sortable:true,width:30}
	   	],
	   	rowNum:10,
	   	autowidth: true,
	   	rowList:[10,20,30],
	   	pager: '#pager1',
	   	sortname: 'complete_date',
	    viewrecords: true,
	    sortorder: "desc",
	    rownumbers:true,
	    caption:"楼幢维修记录列表"
	});
	jQuery("#clist1").jqGrid('navGrid','#pager1',{edit:false,add:false,del:false,search:false,refreshtext:'刷新'});
	//模糊查询					
	jQuery("#gridReload").click(function() {
		var url="${_servlet_url!''}/safecheck.repair.listjson?"
		+"repair_content="+$("#repair_content").val()+"&"
		+"complete_date="+$("#complete_date").val()+"&"
		+"repair_manager="+$("#repair_manager").val();
		var url2 = encodeURI(url);
		jQuery("#clist1").jqGrid('setGridParam',{url:url2,page:1}).trigger('reloadGrid');
	});
	doResize();
	//查看按钮
	$("#selectInfo").click(function(){
		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
		if (id) { 
			var ret = jQuery("#clist1").jqGrid('getRowData',id);
			var url="${_servlet_url!''}/safecheck.repair.detail?repair_id="+ret.repair_id;
			window.showModalDialog(url,'','dialogWidth:600px;dialogHeight:400px;center:1;');
			jQuery("#clist1").trigger('reloadGrid');
		}else{
			alert("请选择一条记录！");
		}
	});
	//修改按钮
	$("#updateInfo").click(function(){
		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
		if (id) { 
			var ret = jQuery("#clist1").jqGrid('getRowData',id);
			var url="${_servlet_url!''}/safecheck.repair.forupdate?repair_id="+ret.repair_id;
			window.showModalDialog(url,'','dialogWidth:600px;dialogHeight:400px;center:1;');
			jQuery("#clist1").trigger('reloadGrid');
		}else{
			alert("请选择一条记录！");
		}
	});
	//删除按钮
	$("#deleteInfo").click(function(){
		var id = jQuery("#clist1").jqGrid('getGridParam','selrow');
		if (id) {
			var ret = jQuery("#clist1").jqGrid('getRowData',id);
			var flag=window.confirm("删除不可恢复，确认删除吗？")
			if(flag){
				$.post("${_servlet_url!''}/safecheck.repair.delete?repair_id="+ret.repair_id,"",function(data,textStatus){
					var jdata=jQuery.parseJSON(data);
					if(jdata.success=="1"){
						jQuery("#clist1").trigger('reloadGrid');
						alert("删除成功!!");
					}else{
						jQuery("#clist1").trigger('reloadGrid');
						alert("删除失败!!");
					}
				});
			}
		}else{
			alert("请选择一条记录！");
		}
	});	
	//日期选择:
	$("#complete_date").attr("readonly", "true").datepicker({dateFormat:"yy-mm-dd"});
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
	$("#repair_content").val("");
	$("#complete_date").val("");
	$("#repair_manager").val("");
    jQuery("#clist1").jqGrid('setGridParam',{url:encodeURI("${_servlet_url!''}/safecheck.repair.listjson"),page:1}).trigger("reloadGrid");
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
		<td class="td12">维修内容:</td>
		<td class="td13">
		<input type="text" size="20" name="repair_content" id="repair_content"/>
		</td>
		<td class="td12">维修负责人:</td>
		<td class="td13">
		<input type="text" size="20" name="repair_manager" id="repair_manager"/>
		</td>
		<td class="td12">完成时间:</td>
		<td class="td13">
		<input type="text" size="20" name="complete_date" id="complete_date"/>
		</td>
		<td class="td13" colspan="2"><button type="button" id="gridReload">查询</button><button onclick="emptiedAndSubmit()" style="margin-left:10px;">清空查询条件</button></td>
		</tr>
		</table>
	</form>
</div>
<div  id="buttons" style="text-align:right;margin-bottom:8px;">
	<button type="button" id="updateInfo" align="right">修改</button>
	<button type="button" id="deleteInfo" align="right">删除</button>
	<button type="button" id="selectInfo" align="right">查看</button>
</div>
<div id="pager1"></div>
<table id="clist1"></table>
