<script src="${_share_file_url!''}/resource/js/i18n/grid.locale-cn.js" type="text/javascript"></script>
<script src="${_share_file_url!''}/resource/js/jquery.jqGrid.min.js" type="text/javascript"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" language="javascript">
$(function(){
	jQuery("#clist1").jqGrid({
	   	url:'${_servlet_url!''}/safecheck.survey.surveymxjson',
		datatype: "json",
		width:600,
		height:300,
	   	colNames:[
			"building_id"
			,"survey_id"
			,"普查新坐落"
			,"楼幢坐落"
			,"设计用途"
			,"建成时间"
			,"结构类型"
			,"管理模式"
			,"房屋性质"
			,"有无问题"
			,"普查时间"
			,"最后编辑人"
			,"定位"
	   	],
	   	colModel:[
			{name:'building_id',index:'building_id',sortable:true,hidden:true}
			,{name:'survey_id',index:'survey_id',sortable:true,hidden:true}
			,{name:'building_newaddress',index:'building_newaddress',sortable:true}
			,{name:'building_address',index:'building_address',sortable:true}
			,{name:'use_desgin',index:'use_desgin',sortable:true,width:25,hidden:true}
			,{name:'building_date',index:'building_date',sortable:true,width:20,hidden:true}
			,{name:'build_struct',index:'build_struct',sortable:true,width:25,hidden:true}
			,{name:'manage_type',index:'manage_type',sortable:true,width:20,hidden:true}
			,{name:'building_properties',index:'building_properties',sortable:true,width:30,hidden:true}
			,{name:'building_safecondition',index:'building_safecondition',sortable:true,width:20}
			,{name:'survey_date',index:'survey_date',sortable:true,width:30}
			,{name:'last_editor',index:'last_editor',sortable:true,width:40}
			,{name:'dw',index:'dw',width:30}
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
		var url="${_servlet_url!''}/safecheck.survey.surveymxjson?"
		+"building_region="+$('input[name="building_region"]:checked').val()+"&"
		+"use_desgin="+$('input[name="use_desgin"]:checked').val()+"&"
		+"build_struct="+$('input[name="build_struct"]:checked').val()+"&"
		+"building_properties="+$('input[name="building_properties"]:checked').val()+"&"
		+"floor_count="+$('input[name="floor_count"]:checked').val()+"&"
		+"building_safecondition="+$('input[name="building_safecondition"]:checked').val()+"&"
		+"survey_type="+$('input[name="survey_type"]:checked').val();
		var url2 = encodeURI(url);
		jQuery("#clist1").jqGrid('setGridParam',{url:url2,page:1}).trigger('reloadGrid');
	});
	
	$("#excelInfo").click(function(){
		var url="${_servlet_url!''}/../exportexcel/safecheck.survey.mxexcel?"
		+"building_region="+$('input[name="building_region"]:checked').val()+"&"
		+"use_desgin="+$('input[name="use_desgin"]:checked').val()+"&"
		+"build_struct="+$('input[name="build_struct"]:checked').val()+"&"
		+"building_properties="+$('input[name="building_properties"]:checked').val()+"&"
		+"floor_count="+$('input[name="floor_count"]:checked').val()+"&"
		+"building_safecondition="+$('input[name="building_safecondition"]:checked').val()+"&"
		+"survey_type="+$('input[name="survey_type"]:checked').val();
		var url2 = encodeURI(url);
		window.location=url2;	
	});	
});
//清空查询条件
function emptiedAndSubmit(){
	$("#building_region").val("");
	$("#use_desgin").val("");
	$("#build_struct").val("");
	$("#building_properties").val("");
	$("#building_safecondition").val("");
	$("#floor_count").val("");
	$("#survey_type").val("");
    jQuery("#clist1").jqGrid('setGridParam',{url:encodeURI("${_servlet_url!''}/safecheck.survey.surveymxjson?info_state=8"),page:1}).trigger("reloadGrid");
}

</script>
<style>
.td12{text-align:right;padding-right:12px;background-color:#E1F1FE;color:#2a51a4;}
.td13{padding-left:12px;background-color:#F1F8FF;color:#4D4D4D;}
</style>
<div class="skin_search ui-widget-content" style="padding:.2em;margin-bottom:8px;">
<form name="dic_form" id="dic_form" action="" method="post">
		<!--<table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#dee2e3" style="line-height:30px;">
		<tr>
			<td class="td12">所属区域:</td>
			<td class="td13"><select id="building_region" name="building_region" style="margin-right:20px;">
			<option value="">------请选择------</option>
			[#list EnumService.getEnum('xzqh') as enum]
			<option value="${enum.enum_value!''}">${enum.enum_name!''}</option>
			[/#list]
			</select>
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
		<td class="td12">层数:</td>
		<td class="td13">
			<select name="floor_count" id="floor_count">
				<option value="">------请选择------</option>
				<option value="1">平房（1层）</option>
				<option value="2">低层（2-3层）</option>
				<option value="3">多层（4-7层）</option>
				<option value="4">小高层（8-12层）</option>
				<option value="5">高层（12层以上）</option>
			</select>
		</td>
		</tr>
		<tr>
		<td class="td12">设计用途:</td>
		<td class="td13">
			<select id="use_desgin" name="use_desgin">
			<option value="">------请选择------</option>
			[#list EnumService.getEnum('sjyt') as enum]
			<option value="${enum.enum_value!''}">${enum.enum_name!''}</option>
			[/#list]
			</select>
		</td>
		<td class="td12">有无问题:</td>
		<td class="td13">
			<select name="building_safecondition" id="building_safecondition">
				<option value="">------请选择------</option>
				<option value="1">无</option>
				<option value="4">有</option>
			</select>
		</td>
			<td class="td13" colspan="4"><button type="button" id="gridReload">查询</button><button onclick="emptiedAndSubmit()" style="margin-left:10px;">清空查询条件</button></td>
		</tr>
		</table>-->
		<table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#dee2e3" style="line-height:30px;">
		<tr>
			<td class="td12">普查类型:</td>
				<td class="td13">
				<input type="radio" id="survey_typeall" name="survey_type" value="" checked>全部
				</td><td class="td13">
				[#list EnumService.getEnum('survey_type') as enum]
					<input type="radio" id="survey_type${enum.enum_value!''}" name="survey_type" value="${enum.enum_value!''}">${enum.enum_name!''}
				[/#list]
			</td>
		</tr>
		<tr>
			<td class="td12">所属区域:</td>
				<td class="td13">
				<input type="radio" id="jinan" name="building_region" value="" checked>济南市
				</td><td class="td13">
				[#list EnumService.getEnum('xzqh') as enum]
					<input type="radio" id="${enum.enum_value!''}" name="building_region" value="${enum.enum_value!''}">${enum.enum_name!''}
				[/#list]
			</td>
		</tr>
		<tr>
			<td class="td12">权属状况:</td>
			<td class="td13">
				<input type="radio" id="building_properties1" name="building_properties" value=""  checked>全部
			</td><td class="td13">
				<input type="radio" id="building_properties2" name="building_properties" value="1">单位自管房
				<input type="radio" id="building_properties3" name="building_properties" value="2">直管公房
				<input type="radio" id="building_properties4" name="building_properties" value="3">房改住房
				<input type="radio" id="building_properties5" name="building_properties" value="4">私房
				<input type="radio" id="building_properties6" name="building_properties" value="5">其他
			</td>
		</tr>
		<tr>
			<td class="td12">结构类型:</td>
			<td class="td13">
				<input type="radio" id="build_structall" name="build_struct" value=""  checked>全部
			</td><td class="td13">
				[#if EnumService.getEnum('fwjg')?exists]
				[#list EnumService.getEnum('fwjg') as enum]
				<input type="radio" id="build_struct${enum.enum_value!''}" name="build_struct" value="${enum.enum_value!''}">${enum.enum_name!''}
				[/#list]
				[/#if]
			</td>
		</tr>
		<tr>
			<td class="td12">层数:</td>
			<td class="td13">
				<input type="radio" id="floor_count1" name="floor_count" value="" checked>全部
			</td><td class="td13">
				<input type="radio" id="floor_count2" name="floor_count" value="1">平房（1层）
				<input type="radio" id="floor_count3" name="floor_count" value="2">低层（2-3层）
				<input type="radio" id="floor_count4" name="floor_count" value="3">多层（4-7层）
				<input type="radio" id="floor_count5" name="floor_count" value="4">小高层（8-12层）
				<input type="radio" id="floor_count6" name="floor_count" value="5">高层（12层以上）
			</td>
		</tr>
		<tr>
			<td class="td12">用途:</td>
			<td class="td13">
				<input type="radio" id="use_desginall" name="use_desgin" value="" checked>全部
			</td><td class="td13">
				[#list EnumService.getEnum('sjyt') as enum]
				<input type="radio" id="use_desgin${enum.enum_value!''}" name="use_desgin" value="${enum.enum_value!''}">${enum.enum_name!''}
				[/#list]
			</td>
		</tr>
		<tr>
			<td class="td12">有无问题:</td>
			<td class="td13">
				<input type="radio" id="building_safecondition1" name="building_safecondition" value="" checked>全部
			</td><td class="td13">
				<input type="radio" id="building_safecondition2" name="building_safecondition" value="1">无
				<input type="radio" id="building_safecondition3" name="building_safecondition" value="4">有
			</td>
		</tr>
		<tr>
			<td class="td13" colspan="5" align="right"><button type="button" id="gridReload">查询</button><button onclick="emptiedAndSubmit()" style="margin-left:10px;">清空查询条件</button></td>
		</tr>
		</table>
	</form>
</div>
<div  id="buttons" style="text-align:right;margin-bottom:8px;">
	<button type="button" id="excelInfo" align="right">导出列表明细excel</button>
</div>
<div id="pager1"></div>
<table id="clist1"></table>
