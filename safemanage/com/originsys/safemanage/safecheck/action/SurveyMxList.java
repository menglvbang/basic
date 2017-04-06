package com.originsys.safemanage.safecheck.action;

import java.text.SimpleDateFormat;
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
import com.originsys.safemanage.domain.TBuilding;
import com.originsys.safemanage.domain.TBuildingSurvey;

/**
 auth:zhanglf 2014-7-28
   描述:楼幢普查明细列表
 */
public class SurveyMxList extends BaseAction implements IGet{

	public DataAndView execute(RequestAction ra) throws Exception {
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		String use_desgin=ra.getParameter("use_desgin");
		String floor=ra.getParameter("floor_count");
		String build_struct=ra.getParameter("build_struct");
		String building_properties=ra.getParameter("building_properties");
		String building_safecondition=ra.getParameter("building_safecondition");
		String building_region=ra.getParameter("building_region");
		String survey_type=ra.getParameter("survey_type");
		/**组织查询条件对象*/
		TBuildingSurvey tBuildingSurvey=new TBuildingSurvey();
		if(null!=use_desgin&&!"".equals(use_desgin)){
			tBuildingSurvey.setUse_desgin(use_desgin);
		}
		if("1".equals(floor)){//平房（1层）
			tBuildingSurvey.setFloordown_count(1);
			tBuildingSurvey.setFloorup_count(1);
		}else if("2".equals(floor)){//低层（2-3层）
			tBuildingSurvey.setFloordown_count(2);
			tBuildingSurvey.setFloorup_count(3);
		}else if("3".equals(floor)){//多层（4-7层）
			tBuildingSurvey.setFloordown_count(4);
			tBuildingSurvey.setFloorup_count(7);
		}else if("4".equals(floor)){//小高层（8-12层）
			tBuildingSurvey.setFloordown_count(8);
			tBuildingSurvey.setFloorup_count(12);
		}else if("5".equals(floor)){//高层（12层以上）
			tBuildingSurvey.setFloordown_count(12);
			tBuildingSurvey.setFloorup_count(9999);
		}
		if(null!=build_struct&&!"".equals(build_struct)){
			tBuildingSurvey.setBuild_struct(build_struct);
		}
		if(null!=building_properties&&!"".equals(building_properties)){
			tBuildingSurvey.setBuilding_properties(building_properties);
		}
		if(null!=building_safecondition&&!"".equals(building_safecondition)){
			tBuildingSurvey.setBuilding_safecondition(building_safecondition);
		}
		if(null!=building_region&&!"".equals(building_region)){
			tBuildingSurvey.setBuilding_region(building_region);
		}
		if(null!=survey_type&&!"".equals(survey_type)){
			tBuildingSurvey.setSurvey_type(survey_type);
		}
		tBuildingSurvey.setInfo_state("8");
		/**获取ibatis执行*/
		SqlMapClient sc=DataSource.getSqlMapInstance();
		
		//获取当前登录用户的mem_id
		String mem_id=ra.getUser().getMem_id();
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
		int totalnum=(Integer)sc.queryForObject("Safecheck.getSurveyMxCount", tBuildingSurvey);
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
					sortname="building_id";
		}
		String sortorder= ra.getParameter("sord");
		if(sortorder==null||"".equals(sortorder)){
			sortorder="asc";
		}
		//定义参数
		Map<String,Object> param=new HashMap<String,Object>();
		param.put("_page_start", start);
		param.put("_page_nums", pageNum);//该参数是为MySQL数据库准备的
		param.put("_page_end", end);//该参数是为Oracle数据库准备的
		param.put("_sortname", sortname);
		param.put("_sortorder", sortorder);
		param.put("tBuildingSurvey", tBuildingSurvey);	  
		//查询结果
		List<TBuildingSurvey> resultList=(List<TBuildingSurvey>)sc.queryForList("Safecheck.getSurveyMxList", param);
		Page page=new Page(totalpage,currentNum,totalnum);
		Map resultMap=new HashMap();
		resultMap.put("page", page);
		resultMap.put("resultList", resultList);
		return new DataAndView(resultMap,"block");
	}

}
