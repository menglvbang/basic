package com.originsys.safemanage.safecheck.action;

import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.ResourceBundle;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.originsys.eap.action.BaseAction;
import com.originsys.eap.iservice.IData;
import com.originsys.eap.util.DataSource;
import com.originsys.eap.util.FileReaderUtil;
import com.originsys.eap.util.RequestAction;
import com.originsys.safemanage.domain.TBuilding;
import com.originsys.safemanage.domain.TBuildingSafe;
import com.originsys.safemanage.domain.TInvmBase;
import com.originsys.safemanage.domain.TInvmField;

/**
 auth:zhanglf 2014-5-27
   描述：楼幢普查结果删除
 */
public class SurveyDelete extends BaseAction implements IData{

	public void execute(RequestAction ra, HttpServletResponse response)
			throws Exception {
		/**楼幢编号*/
		String building_id="";
		if(ra.getParameter("building_id")!=null && !"".equals(ra.getParameter("building_id"))){
			building_id=ra.getParameter("building_id");
		}
		/**普查主键*/
		String survey_id="";
		if(ra.getParameter("survey_id")!=null && !"".equals(ra.getParameter("survey_id"))){
			survey_id=ra.getParameter("survey_id");
		}
		int success=0;
		/**获取ibatis执行*/
		SqlMapClient sc=DataSource.getSqlMapInstance();
		try{
			sc.startTransaction();
			//sc.delete("Safecheck.deleteTBuilding",building_id);
			sc.delete("Safecheck.deleteTBuildingSurvey",survey_id);
			//sc.delete("Safecheck.deleteTInvmBase",building_id);
			//sc.delete("Safecheck.deleteTInvmField",building_id);
			//修改日志
			ra.operate.setOperateModule("删除普查信息：普查编号"+survey_id);
			ra.operate.setOperateContent("");
			ra.operate.setOperateType("删除");
			
			//读取属性文件 
			ResourceBundle rb=FileReaderUtil.getInstance().getResourceBundle("safecheck");
			String hbase_url=rb.getString("hbase_url");
			/**调用12的接口写入到空间库中*/
			PostMethod post1 = new PostMethod(hbase_url+"/portal/realtygis.updatesafedate");
			/**设置编码格式*/
			post1.getParams().setContentCharset("utf-8");
			/**调用api获取数据*/
			HttpClient client = new HttpClient();
			/**组织传入的参数*/
			NameValuePair  bid= new NameValuePair("building_id", ra.getParameter("building_id"));
			NameValuePair  safegrade= new NameValuePair("safegrade", "-1");//安全普查的等级
			NameValuePair  checkstate= new NameValuePair("checkstate", "0");//检查的状态，是否检查
			NameValuePair [] pair1 = new NameValuePair[]{bid,safegrade,checkstate};
			post1.setRequestBody(pair1);
			int status1 = client.executeMethod(post1);
			post1.releaseConnection();
			sc.commitTransaction();			
			success=1;
		}catch (Exception e) {
			success=0;
			throw e;
		}finally{
			sc.endTransaction();
		}
		response.setContentType("text/plain");
		PrintWriter out=response.getWriter();
		out.print("{\"success\":"+success+"}");
	}

}
