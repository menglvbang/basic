<table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#a6cef2">
	<caption class="td1">查看用户注册表</caption>
			<tr>
				<td>用户id</td>
					<td>${result.mem_id!''}</td>
			</tr>
			<tr>
				<td>姓</td>
					<td>${result.family_name!''}</td>
			</tr>
			<tr>
				<td>名</td>
					<td>${result.first_name!''}</td>
			</tr>
			<tr>
				<td>性别</td>
					<td>${result.mem_sex!''}</td>
			</tr>
			<tr>
				<td>生日</td>
				[#if result.mem_born?exists]
					<td>${result.mem_born?string('yyyy-MM-dd')}</td>
				[#else]
					<td>无数据</td>
				[/#if]
			</tr>
			<tr>
				<td>邮址</td>
					<td>${result.mem_mail!''}</td>
			</tr>
			<tr>
				<td>注册时间</td>
				[#if result.register_time?exists]
					<td>${result.register_time?string('yyyy-MM-dd')}</td>
				[#else]
					<td>无数据</td>
				[/#if]
			</tr>
			<tr>
				<td>最后登录时间</td>
				[#if result.last_time?exists]
					<td>${result.last_time?string('yyyy-MM-dd')}</td>
				[#else]
					<td>无数据</td>
				[/#if]
			</tr>
			<tr>
				<td>用户状态</td>
					<td>${result.mem_state!''}</td>
			</tr>
			<tr>
				<td>登录名</td>
					<td>${result.mem_name!''}</td>
			</tr>
			<tr>
				<td>用户信息完整性</td>
					<td>${result.mem_integrality!''}</td>
			</tr>
			<tr>
				<td>手机</td>
					<td>${result.mem_mphone!''}</td>
			</tr>
			<tr>
				<td>居住区域</td>
					<td>${result.mem_region!''}</td>
			</tr>
			<tr>
				<td>地址</td>
					<td>${result.mem_addr!''}</td>
			</tr>
			<tr>
				<td>安全认证图片</td>
					<td>${result.secure_image!''}</td>
			</tr>
			<tr>
				<td>注册来源网站</td>
					<td>${result.reg_source!''}</td>
			</tr>
			<tr>
				<td>头像</td>
					<td>${result.mem_image!''}</td>
			</tr>
			<tr>
				<td>备注信息</td>
					<td>${result.note_info!''}</td>
			</tr>
</table>