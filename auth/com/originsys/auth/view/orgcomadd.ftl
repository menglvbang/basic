<script type="text/javascript" src="${_share_file_url!''}/resource/js/jquery.validate.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/messages_cn.js"></script>
<script type="text/javascript" src="${_share_file_url!''}/resource/js/jquery.form.js"></script>
<link rel="stylesheet" type="text/css" media="screen" href="${_share_file_url!''}/resource/css/cmxform.css" />
<script language="javascript" type="text/javascript">
$(function(){
	$("#orgcomadd").click(function(){
		var organ_code=$("#organ_code1").val()+"-"+$("#organ_code2").val();
		if(organ_code!="-"){
			$.post("${_servlet_url!''}/auth.isused?organ_code="+organ_code,{random:Math.random()},
				function(data,textStatus){
					if(data=="true"){
						$("#addForm").submit();
					}else{
						alert("组织机构代码已存在！");
					}
				});
		}else{
			$("#addForm").submit();
		}
	});
	$("#addForm").validate({
		rules: {
			organ_id : {
				required: true,
				isName:true,
				minlength:6,
				remote:"${_servlet_url!''}/auth.isused"
			},
			organ_pass:{
				required: true,
				minlength:6
			},
			organ_name: {
				required: true
			},
			organ_code1: {
				isName:true,
				maxlength:8,
				minlength:8
			},
			organ_code2: {
				isName:true,
				maxlength:1,
				minlength:1
			},
			token_id:{
				number:true,
				maxlength:13,
				minlength:13
			},
			organ_region_name:{
				required:true
			},
			com_type:{
				required:true
			},
			organ_phone:{
				required:true
			}
		},
		messages: {
			organ_id : {
				required: "请输入单位ID",
				isName:"请正确输入单位ID",
				minlength:"单位ID至少6位",
				remote:"该单位ID已注册"
			},
			organ_pass:{
				required: "请输入登录密码",
				minlength:"登录密码至少6位"
			},
			organ_name: {
				required: "请输入单位法定全称"
			},
			organ_code1: {
				isName:"请输入正确的代码证号",
				maxlength:"请输入正确的代码证号",
				minlength:"请输入正确的代码证号"
			},
			organ_code2: {
				isName:"请输入1位数字或字母",
				maxlength:"请输入1位数字或字母",
				minlength:"请输入1位数字或字母"
			},
			token_id:{
				number:"请输入13位数字",
				maxlength:"请输入13位数字",
				minlength:"请输入13位数字"
			},
			organ_region_name:{
				required:"请选择所属行政区"
			},
			com_type:{
				required:"请选择至少一种企业类型"
			},
			organ_phone:{
				required:"请填写有效的电话联系方式"
			}
		},
	    //提交
        submitHandler:function(form){
       		var queryString=$("#addForm").formSerialize();
			$.post($("#addForm").attr("action"),queryString,
				function(data,textStatus){
					var jdata=jQuery.parseJSON(data);
					if(jdata.success==1){
						var newUserName=$("#organ_id").val();
					var isTrue=alertMsg("注册成功！请牢记用户名<font color='red'>"+newUserName+"</font>,初始密码<font color='red'>666666</font>.</br>建议登录后立即到<font color='red'>用户中心</font>修改密码!" +
							"</br>注意:新用户在24小时内处于待认证状态,仅具有用户中心功能,其他功能待认证通过后开放。",0,toLoginPage);
						//window.close();						
					}else{
						alert("注册失败！");
					}
			});
       } 
	});
	//单位ID验证，只能是字母或是数字
	jQuery.validator.addMethod("isName", function(value, element) { 
	  var b = /^[0-9a-zA-Z]*$/g;
	  return b.test(value);  
	}, "请正确输入单位ID");
});
function toLoginPage(){
	//window.location="${_servlet_url!''}";
	history.back();
}
function addr1(){
	var addr=window.showModalDialog("commonservice.region?pid=086","","dialogWidth=350px;dialogHeight=400px");
	if(addr!=undefined){
		$("#organ_region").val(addr[0]);
		$("#organ_region_name").val(addr[1]);
	}
}
function returnvalue(id,data){
	document.getElementById(id).value=data;
}
function viewpic(filename){
	window.open($("#"+filename).val());
}
function alertMsg(msg, mode,fun) { //mode为空，即只有一个确认按钮，mode为1时有确认和取消两个按钮,fun为回调函数
    msg = msg || '';
    mode = mode || 0;
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    var isIe = (document.all) ? true : false;
    var isIE6 = isIe && !window.XMLHttpRequest;
    var sTop = document.documentElement.scrollTop || document.body.scrollTop;
    var sLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    var winSize = function(){
        var xScroll, yScroll, windowWidth, windowHeight, pageWidth, pageHeight;
        // innerHeight获取的是可视窗口的高度，IE不支持此属性
        if (window.innerHeight && window.scrollMaxY) {
            xScroll = document.body.scrollWidth;
            yScroll = window.innerHeight + window.scrollMaxY;
        } else if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }

        if (self.innerHeight) {    // all except Explorer
            windowWidth = self.innerWidth;
            windowHeight = self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) { // other Explorers
            windowWidth = document.body.clientWidth;
            windowHeight = document.body.clientHeight;
        }

        // for small pages with total height less then height of the viewport
        if (yScroll < windowHeight) {
            pageHeight = windowHeight;
        } else {
            pageHeight = yScroll;
        }

        // for small pages with total width less then width of the viewport
        if (xScroll < windowWidth) {
            pageWidth = windowWidth;
        } else {
            pageWidth = xScroll;
        }

        return{
            'pageWidth':pageWidth,
            'pageHeight':pageHeight,
            'windowWidth':windowWidth,
            'windowHeight':windowHeight
        }
    }();
    //alert(winSize.pageWidth);
    //遮罩层
    var styleStr = 'top:0;left:0;position:absolute;z-index:10000;background:#666;width:' + winSize.pageWidth + 'px;height:' +  (winSize.pageHeight + 30) + 'px;';
    styleStr += (isIe) ? "filter:alpha(opacity=80);" : "opacity:0.8;"; //遮罩层DIV
    var shadowDiv = document.createElement('div'); //添加阴影DIV
    shadowDiv.style.cssText = styleStr; //添加样式
    shadowDiv.id = "shadowDiv";
    //如果是IE6则创建IFRAME遮罩SELECT
    if (isIE6) {
        var maskIframe = document.createElement('iframe');
        maskIframe.style.cssText = 'width:' + winSize.pageWidth + 'px;height:' + (winSize.pageHeight + 30) + 'px;position:absolute;visibility:inherit;z-index:-1;filter:alpha(opacity=0);';
        maskIframe.frameborder = 0;
        maskIframe.src = "about:blank";
        shadowDiv.appendChild(maskIframe);
    }
    document.body.insertBefore(shadowDiv, document.body.firstChild); //遮罩层加入文档
    //弹出框
    var styleStr1 = 'display:block;position:fixed;_position:absolute;left:' + (winSize.windowWidth / 2 - 200) + 'px;top:' + (winSize.windowHeight / 2 - 150) + 'px;_top:' + (winSize.windowHeight / 2 + top - 150)+ 'px;'; //弹出框的位置
    var alertBox = document.createElement('div');
    alertBox.id = 'alertMsg';
    alertBox.style.cssText = styleStr1;
    //创建弹出框里面的内容P标签
    var alertMsg_info = document.createElement('P');
    alertMsg_info.id = 'alertMsg_info';
    alertMsg_info.innerHTML = msg;
    alertBox.appendChild(alertMsg_info);
    //创建按钮
    var btn1 = document.createElement('a');
    btn1.id = 'alertMsg_btn1';
    btn1.href = 'javas' + 'cript:void(0)';
    btn1.innerHTML = '<cite>开始体验</cite>';
    btn1.onclick = function () {
        document.body.removeChild(alertBox);
        document.body.removeChild(shadowDiv);
        fun();//点击确定按钮,执行回调函数
        return true;
    };
    alertBox.appendChild(btn1);
    if (mode === 1) {
        var btn2 = document.createElement('a');
        btn2.id = 'alertMsg_btn2';
        btn2.href = 'javas' + 'cript:void(0)';
        btn2.innerHTML = '<cite>取消</cite>';
        btn2.onclick = function () {
            document.body.removeChild(alertBox);
            document.body.removeChild(shadowDiv);
            return false;
        };
        alertBox.appendChild(btn2);
    }
    document.body.appendChild(alertBox);

}
</script>
<style>
.rightpad{text-align:right;padding-right:7px;background-color:#F2F9FF;}
.leftpad{padding-left:2px;background-color:#FFFFFF;}
</style>
<style type="text/css">
#alertMsg {
    display: none;
    width: 400px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 1px 1px 10px black;
    padding: 10px;
    font-size: 12px;
    position: absolute;
    text-align: center;
    background: #fff;
    z-index: 100000;
}

#alertMsg_info {
    padding: 2px 15px;
    line-height: 1.6em;
    text-align: left;
}

#alertMsg_btn1, #alertMsg_btn2 {
    display: inline-block;
    background: url(images/gray_btn.png) no-repeat left top;
    padding-left: 3px;
    color: #000000;
    font-size: 12px;
    text-decoration: none;
    margin-right: 10px;
    cursor: pointer;
}

#alertMsg_btn1 cite, #alertMsg_btn2 cite {
    line-height: 24px;
    display: inline-block;
    padding: 0 13px 0 10px;
    background: url(images/gray_btn.png) no-repeat right top;
    font-style: normal;
}

</style>
<div class="ui-widget ui-widget-content ui-corner-all" style="position: relative;padding: .2em;">
	<div class="ui-widget-header ui-corner-all" style="padding:4px;margin-bottom:6px">
		<img  SRC="${_share_file_url!''}/resource/images/icon.gif" WIDTH="16" HEIGHT="16" BORDER=0 ALT="" align="absmiddle"/>
		&nbsp;添加单位信息
	</div>
<form class="cmxform" style="margin:0" action="${_servlet_url!''}/auth.doorgcomadd" method="post" id="addForm">
	<input type="hidden" name="organ_pass" id="organ_pass" value="666666"/>
	<table width="100%" border="0" cellpadding="0" cellspacing="1" style="table-layout:fixed;line-height:30px;">
		<col width="200px"/></col />
			<tr>
					<td class="rightpad"><font color="red">*</font>单位ID</td>
					<td class="leftpad">
						<input type="text" name="organ_id" id="organ_id" value="" size="40"/>
						<font color="grey">&nbsp;单位ID为单位用户名，用户名使用字符、数字等有效字符。</font>
					</td>
			</tr>
			<!--tr>
					<td class="rightpad"><font color="red">*</font>登录密码</td>
					<td class="leftpad">
						<input type="password" name="organ_pass" id="organ_pass" value="" size="40"/>
					</td>
			</tr-->
			<tr>
					<td class="rightpad"><font color="red">*</font>单位法定全称</td>
					<td class="leftpad">
						<input type="text" name="organ_name" id="organ_name" value="" size="40"/>
					</td>
			</tr>
			<!-- tr>
				<td class="rightpad">使用动态令牌</td>
				<td class="leftpad">
					<input type="radio" name="use_token" id="use_token" value="1"/>使用
					<input type="radio" name="use_token" id="use_token" value="0" checked/>不使用
					<font color="grey">&nbsp;如果选择使用则登录的时候需要输入动态口令</font>
				</td>
			</tr>
			<tr>
				<td class="rightpad">动态令牌号</td>
				<td class="leftpad">
					<input type="text" name="token_id" id="token_id" value=""/>
				</td>
			</tr -->
			<tr>
					<td class="rightpad">组织机构代码</td>
					<td class="leftpad">
						<input type="text" name="organ_code1" id="organ_code1" value="" size="8" maxlength="8"/>
							- <input type="text" name="organ_code2" id="organ_code2" value="" size="1" maxlength="1"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">组织机构代码证</td>
					<td class="leftpad">
						<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="300" height="35">
							<param name="movie" value="${_share_file_url!''}/resource/jsp/fileupload.swf" />
								<param name="flashvars" value="action=${_server_url!''}/eap/manager.system.upload&fieldname=organ_code_image&oldname=&savepath=images/orgcom/&type=image&size=5242880" />
								<param name="menu" value="false" /><param name="wmode" value="transparent" />
								<embed src="${_share_file_url!''}/resource/jsp/fileupload.swf" wmode="transparent" flashvars="action=${_server_url!''}/eap/manager.system.upload&savepath=images/orgcom/&fieldname=organ_code_image&type=image&oldname=&size=5242880" menu="false" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="300" height="35">
							</embed>
						</object>
						<input type="hidden" name="organ_code_image" id="organ_code_image">
						<font color="grey">上传附件大小不能超过5M</font>
					</td>
			</tr>
			<input type="hidden" name="business_license_image" id="business_license_image">
			<input type="hidden" name="tax_reg_certificate" id="tax_reg_certificate">
			<tr>
					<td class="rightpad">营业执照</td>
					<td class="leftpad">
						<input type="hidden" name="business_license_image" id="business_license_image">
						<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="300" height="35">
							<param name="movie" value="${_share_file_url!''}/resource/jsp/fileupload.swf" />
								<param name="flashvars" value="action=${_server_url!''}/eap/manager.system.upload&fieldname=business_license_image&oldname=&savepath=images/orgcom/&type=image" />
								<param name="menu" value="false" /><param name="wmode" value="transparent" />
								<embed src="${_share_file_url!''}/resource/jsp/fileupload.swf" wmode="transparent" flashvars="action=${_server_url!''}/eap/manager.system.upload&savepath=images/orgcom/&fieldname=business_license_image&type=image&oldname=" menu="false" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="300" height="35">
							</embed>
						</object>
					</td>
			</tr>
			<tr>
					<td class="rightpad">税务登记证</td>
					<td class="leftpad">
						<input type="hidden" name="tax_reg_certificate" id="tax_reg_certificate">
						<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="300" height="35">
							<param name="movie" value="${_share_file_url!''}/resource/jsp/fileupload.swf" />
								<param name="flashvars" value="action=${_server_url!''}/eap/manager.system.upload&fieldname=tax_reg_certificate&oldname=&savepath=images/orgcom/&type=image" />
								<param name="menu" value="false" /><param name="wmode" value="transparent" />
								<embed src="${_share_file_url!''}/resource/jsp/fileupload.swf" wmode="transparent" flashvars="action=${_server_url!''}/eap/manager.system.upload&savepath=images/orgcom/&fieldname=tax_reg_certificate&type=image&oldname=" menu="false" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="300" height="35">
							</embed>
						</object>
					</td>
			</tr>
			
			<tr>
					<td class="rightpad"><font color="red">*</font>所属行政区</td>
					<td class="leftpad">
						<input type="text" name="organ_region_name" id="organ_region_name" value="" onclick="addr1();" readonly="true" size="40"/>
							<input type="hidden" id="organ_region" name="organ_region" size="10">
					</td>
			</tr>
			<tr>
					<td class="rightpad">通信地址</td>
					<td class="leftpad">
						<input type="text" name="organ_address" id="organ_address" value="" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">联系人</td>
					<td class="leftpad">
						<input type="text" name="organ_linkman" id="organ_linkman" value="" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad"><font color="red">*</font>电话</td>
					<td class="leftpad">
						<input type="text" name="organ_phone" id="organ_phone" value="" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">邮政编码</td>
					<td class="leftpad">
						<input type="text" name="organ_postcode" id="organ_postcode" value="" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">域名｜ip</td>
					<td class="leftpad">
						<input type="text" name="organ_domainname" id="organ_domainname" value="" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">行业</td>
					<td class="leftpad">
						<input type="text" name="organ_trade" id="organ_trade" value="" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">组织简介</td>
					<td class="leftpad">
						<input type="text" name="organ_desc" id="organ_desc" value="" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">组织类型</td>
					<td class="leftpad">
						<input type="text" name="organ_type" id="organ_type" value="" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">员工人数</td>
					<td class="leftpad">
						<input type="text" name="organ_staff_number" id="organ_staff_number" value="" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">组织证件类型</td>
					<td class="leftpad">
						<input type="text" name="organ_cred_type" id="organ_cred_type" value="" size="40"/>
					</td>
			</tr>
			<tr>
					<td class="rightpad">组织证件号码</td>
					<td class="leftpad">
						<input type="text" name="organ_cred_code" id="organ_cred_code" value="" size="40"/>
					</td>
			</tr>
			<input type="hidden" name="authentication_state" id="authentication_state" value="1"/>
			<tr>
					<td class="rightpad">第二域名</td>
					<td class="leftpad">
						<input type="text" name="organ_domainname2" id="organ_domainname2" value="" size="40"/>
					</td>
			</tr>
			<tr>
				<td class="rightpad"><font color="red">*</font>企业类型</td>
				<td class="leftpad">
					[#list block as orgcomtype]
					<input type="checkbox" name="com_type" value="${orgcomtype.organ_type_id!''}"/>${orgcomtype.organ_type_cname!''}
					[/#list]
				</td>				
			</tr>
			<tr>
				<td align="center" style="background-color:#FFFFFF;" colspan="2">
					<button type="button" id="orgcomadd">提交</button>&nbsp;
					<button type="button" onClick="window.close();">返回</button>
				</td>
			</tr>
		</table>
</form>
</div>