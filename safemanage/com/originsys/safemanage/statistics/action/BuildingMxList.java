package com.originsys.safemanage.statistics.action;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import com.originsys.safemanage.domain.TBuilding;

/**
 auth:zhanglf 2014-6-16
   描述:安全检查明细列表
 */
public class BuildingMxList extends BaseAction implements IGet{

	public DataAndView execute(RequestAction ra) throws Exception {
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		String building_region=ra.getParameter("building_region");
		String health_grade_pc=ra.getParameter("health_grade_pc");
		String use_desgin=ra.getParameter("use_desgin");
		String build_struct=ra.getParameter("build_struct");
		String usefunction=ra.getParameter("usefunction");
		String right_type=ra.getParameter("right_type");
		/**组织查询条件对象*/
		TBuilding tBuilding=new TBuilding();
		if(null!=building_region&&!"".equals(building_region)){
			tBuilding.setBuiliding_region(building_region);
		}
		if(null!=health_grade_pc&&!"".equals(health_grade_pc)){
			tBuilding.setHealth_grade_pc(health_grade_pc);
		}
		if(null!=use_desgin&&!"".equals(use_desgin)){
			tBuilding.setUse_desgin(use_desgin);
		}
		if(null!=build_struct&&!"".equals(build_struct)){
			tBuilding.setBuild_struct(build_struct);
		}
		if(null!=usefunction&&!"".equals(usefunction)){
			tBuilding.setUsefunction(usefunction);
		}
		if(null!=right_type&&!"".equals(right_type)){
			tBuilding.setRight_type(right_type);
		}
		
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
		int totalnum=(Integer)sc.queryForObject("Safecheck.getBuildingMxCount", tBuilding);		
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
		param.put("tBuilding", tBuilding);	  
		//查询结果
		List<TBuilding> resultList=resultList=(List<TBuilding>)sc.queryForList("Safecheck.getBuildingMxList", param);
		
		Page page=new Page(totalpage,currentNum,totalnum);
		Map resultMap=new HashMap();
		String current_time=new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		resultMap.put("current_time", current_time);
		resultMap.put("page", page);
		resultMap.put("resultList", resultList);
		return new DataAndView(resultMap,"block");
	}

}
