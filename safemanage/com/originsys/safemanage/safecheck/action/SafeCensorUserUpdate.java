package com.originsys.safemanage.safecheck.action;

import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.originsys.eap.action.BaseAction;
import com.originsys.eap.domain.User;
import com.originsys.eap.iservice.IData;
import com.originsys.eap.service.DepartmentService;
import com.originsys.eap.util.DataSource;
import com.originsys.eap.util.GetMD5;
import com.originsys.eap.util.RequestAction;
import com.originsys.safemanage.domain.TSafeCensor;

/**
 auth:boy 2014-5-12
   描述：安全检查员信息修改
   1：修改用户基本信息
   2：修改用户和机构的对应关系
   3：修改检查员基本信息
 */
public class SafeCensorUserUpdate extends BaseAction implements IData{

	public void execute(RequestAction ra, HttpServletResponse response)
			throws Exception {
		SqlMapClient sc = DataSource.getSqlMapInstance();
		String mem_id=ra.getParameter("mem_id");
		User mem = new User();
		String birthday=ra.getParameter("birthday");
		mem.setMem_id(mem_id);
		mem.setFamily_name(ra.getParameter("familyname"));
        mem.setMem_sex(ra.getParameter("mem_sex"));
		Date theDate=null;
		SimpleDateFormat   sdf   =   new   SimpleDateFormat( "yyyy-MM-dd");
		try{
			if(null!=birthday&&!"".equals(birthday)){
				theDate=sdf.parse(birthday);
			}
		}catch (Exception e) {
			this.log().info("SafeCensorUserUpdate类日期转换错误:"+e);
		}
		mem.setMem_born(theDate);
		mem.setMem_mail(ra.getParameter("mem_mail"));
		mem.setIsenable("1");
		mem.setFirstname(ra.getParameter("firstname"));
		mem.setFullname(ra.getParameter("familyname")+ra.getParameter("firstname"));
		mem.setMem_name(ra.getParameter("username"));
		mem.setMem_mphone(ra.getParameter("mem_mphone"));
		/**安全检查员信息*/
		TSafeCensor tSafeCensor=new TSafeCensor();
		tSafeCensor.setMem_id(mem_id);//String:用户id
		tSafeCensor.setManage_scope(ra.getParameter("manage_scope"));//String:
		tSafeCensor.setManage_scope_name(ra.getParameter("manage_scope_name"));//String:
		tSafeCensor.setCertificate_number(ra.getParameter("certificate_number"));//String:从业资格证书编号
		if(ra.getParameter("certificate_date")!=null && !"".equals(ra.getParameter("certificate_date"))){
			tSafeCensor.setCertificate_date(sdf.parse(ra.getParameter("certificate_date")));//Date:证书取得时间
		}
		tSafeCensor.setCertificate(ra.getParameter("certificate"));//String:从业资格证书复印件
		tSafeCensor.setProfessional_titles(ra.getParameter("professional_titles"));//String:专业技术职称
		if(ra.getParameter("work_years")!=null && !"".equals(ra.getParameter("work_years"))){
			tSafeCensor.setWork_years(Integer.parseInt(ra.getParameter("work_years")));//Integer:工作经验年限
		}
		tSafeCensor.setProfessional(ra.getParameter("professional"));//String:从事专业
		//获取当前登录用户管理的区域
		List<String> regionList=(List<String>)sc.queryForList("Safecheck.getBuildingSafeManageRegion", ra.getUser().getMem_id());
		if(regionList.size()>0){
			tSafeCensor.setRegion(regionList.get(0));//所属地区
		}
//		tSafeCensor.setRegion(ra.getParameter("region"));//所属地区
		String success="0";
		try{
			sc.startTransaction();
			sc.update("User.admin_updateuser", mem);
			//增加用户和部门的对应
			String department_id=ra.getParameter("department_id");
			if(department_id!=null&&!"".equals(department_id)){
				DepartmentService.getInstance().updateDepartmentMember(mem_id, department_id);
			}
			sc.update("Safecheck.updateTSafeCensor",tSafeCensor);
			sc.commitTransaction();
			success="1";
		}catch (Exception e) {
			success="0";
			sc.getCurrentConnection().rollback();
			throw e;
		}finally{
			sc.endTransaction();
		}
		response.setContentType("text/plain");
		PrintWriter out=response.getWriter();
		out.print("{\"success\":\""+success+"\",\"key\":\""+mem_id+"\"}");
	}

}
