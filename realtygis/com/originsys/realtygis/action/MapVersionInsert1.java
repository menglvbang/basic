package com.originsys.realtygis.action;

import java.io.PrintWriter;


import javax.servlet.http.HttpServletResponse;


import com.ibatis.sqlmap.client.SqlMapClient;
import com.originsys.eap.action.BaseAction;

import com.originsys.eap.iservice.IData;
import com.originsys.eap.util.DataSource;

import com.originsys.eap.util.RequestAction;
import com.originsys.realtygis.domain.MapVersion;


/**
 auth:zhanglf 2014-8-5
   描述：地图版本新增
 */
public class MapVersionInsert1 extends BaseAction implements IData{

	public void execute(RequestAction ra, HttpServletResponse response)
			throws Exception {
		MapVersion version = new MapVersion();
		version.setVersion_number((Long.parseLong(ra.getParameter("version_number"))));
		
		if(!"".equals(ra.getParameter("version_name"))||ra.getParameter("version_name")!=null){
			version.setVersion_name(ra.getParameter("version_name"));
		}
		if(!"".equals(ra.getParameter("auditor"))||ra.getParameter("auditor")!=null){
			version.setAuditor(ra.getParameter("auditor"));
		}
		if(!"".equals(ra.getParameter("publisher"))||ra.getParameter("publisher")!=null){
			version.setPublisher(ra.getParameter("publisher"));
		}
		version.setStatus("禁用");
		if(!"".equals(ra.getParameter("message"))||ra.getParameter("message")!=null){
			version.setMessage(ra.getParameter("message"));
		}
		version.setDefault_map(1000);
		
		int success=0;
		/**获取ibatis执行*/
		SqlMapClient sc=DataSource.getSqlMapInstance();
		
		try{
			sc.startTransaction();
			sc.insert("Realtygis.insertMapVersion", version);
			sc.commitTransaction();
			success=1;
		}catch (Exception e) {
			success=0;
			this.log().info("insertMapVersion插入错误："+e);
			sc.getCurrentConnection().rollback();
		}finally{
			sc.endTransaction();
		}
		
		response.setContentType("text/plain");
		PrintWriter out=response.getWriter();
		out.print("{\"success\":"+success+"}");
	}

}
