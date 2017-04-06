package com.originsys.safemanage.authenticate.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.originsys.eap.action.BaseAction;
import com.originsys.eap.domain.DataAndView;
import com.originsys.eap.domain.Page;
import com.originsys.eap.iservice.IGet;
import com.originsys.eap.util.DataSource;
import com.originsys.eap.util.RequestAction;
import com.originsys.safemanage.domain.TAppraisalReport;

/**
 auth:boy 2014-6-4
   描述：鉴定报告列表
   可以查看用户当前所属机构的鉴定报告的列表
 */
@SuppressWarnings("serial")
public class ReportList extends BaseAction implements  IGet{

	@SuppressWarnings("rawtypes")
	public DataAndView execute(RequestAction ra) throws Exception {
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		/**组织查询条件对象*/
		TAppraisalReport tAppraisalReport=new TAppraisalReport();
		String organ_id=ra.getUser().getOrgan();
		tAppraisalReport.setJd_department_id(organ_id);//String:鉴定单位
		tAppraisalReport.setBuilding_address(ra.getParameter("building_address"));//String:楼幢地址
		tAppraisalReport.setBuilding_region(ra.getParameter("building_region"));//String:所属区域
		tAppraisalReport.setEntrust_user(ra.getParameter("entrust_user"));//String:委托人或单位
		tAppraisalReport.setLinkman(ra.getParameter("linkman"));//String:联系人
		tAppraisalReport.setDangerous_level(ra.getParameter("dangerous_level"));//String:危险等级@1-a级&2-b级&3-c级&4-d级
		tAppraisalReport.setStruct_aging(ra.getParameter("struct_aging"));//String:房屋结构老化程度@1-强&2-弱&3-差
		tAppraisalReport.setIs_transform(ra.getParameter("is_transform"));//String:是否有改造@1-是&2-否
		tAppraisalReport.setFacility_aging(ra.getParameter("facility_aging"));//String:设施老化程度@1-强&2-弱&3-差
		tAppraisalReport.setIs_kzperfect(ra.getParameter("is_kzperfect"));//String:抗震结构是否完善@1-强&2-弱&3-差
		tAppraisalReport.setIs_transform_seriousness(ra.getParameter("is_transform_seriousness"));//String:拆改结构是否严重@1-强&2-弱&3-差
		if(ra.getParameter("jd_date1")!=null && !"".equals(ra.getParameter("jd_date1"))){
			tAppraisalReport.setJd_date1(sdf.parse(ra.getParameter("jd_date1")));////Date:鉴定时间
		}
		if(ra.getParameter("jd_date2")!=null && !"".equals(ra.getParameter("jd_date2"))){
			tAppraisalReport.setJd_date2(sdf.parse(ra.getParameter("jd_date2")));////Date:鉴定时间
		}
		tAppraisalReport.setJdmember(ra.getParameter("jdmember"));//String:鉴定人
		tAppraisalReport.setInfo_state(ra.getParameter("info_state"));//String:鉴定信息状态0暂存1待审核2审核驳回8审核通过
		
		/**获取ibatis执行*/
		SqlMapClient sc=DataSource.getSqlMapInstance();
		
		//获得起始条数
		int start=0;
		//获得每页显示的条数
		int pageNum=10;
		if(ra.getParameter("rows")!=null){
			pageNum=Integer.parseInt(ra.getParameter("rows"));
		}
		else{
			pageNum=10;
		}
		pageNum=(pageNum==0)?10:pageNum;
		//获取总条数
		int totalnum=(Integer)sc.queryForObject("safeauth.getTAppraisalReportCount", tAppraisalReport);
		//获得总页数
		int totalpage=totalnum%pageNum==0?totalnum/pageNum:(totalnum/pageNum+1);		
		//获得当前页
		String currentPage=ra.getParameter("page");
		int currentNum=1;
		if(currentPage!=null && !"".equals(currentPage)){
			currentNum=Integer.parseInt(currentPage);
		}
		//重新设置起始条数
		start=(currentNum-1)*pageNum;
		int end = currentNum*pageNum;
		//排序字段+排序方式
		String sortname=ra.getParameter("sidx");
		if(sortname==null||"".equals(sortname)){
			sortname="entry_date";
		}
		String sortorder= ra.getParameter("sord");
		if(sortorder==null||"".equals(sortorder)){
			sortorder="desc";
		}
		//定义参数
		Map<String,Object> param=new HashMap<String,Object>();
		if(ra.getServletPath().equals("/exportexcel")){
			
		}else{
			param.put("_page_start", start);
			param.put("_page_nums", pageNum);//该参数是为MySQL数据库准备的
			param.put("_page_end", end);//该参数是为Oracle数据库准备的
		}
		param.put("_sortname", sortname);
		param.put("_sortorder", sortorder);
		param.put("tAppraisalReport", tAppraisalReport);	  
		//查询结果
		List<TAppraisalReport> resultList=(List<TAppraisalReport>)sc.queryForList("safeauth.getTAppraisalReportList", param);
		Page page=new Page(totalpage,currentNum,totalnum);
		Map resultMap=new HashMap();
		resultMap.put("page", page);
		String current_time=new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		resultMap.put("current_time", current_time);
		resultMap.put("resultList", resultList);
		return new DataAndView(resultMap,"block");
	}

}
