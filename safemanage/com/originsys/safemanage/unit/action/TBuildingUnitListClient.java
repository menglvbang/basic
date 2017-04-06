package com.originsys.safemanage.unit.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.originsys.auth.domain.Orgcom;
import com.originsys.authclient.util.ApiUtil;
import com.originsys.eap.action.BaseAction;
import com.originsys.eap.domain.DataAndView;
import com.originsys.eap.domain.Page;
import com.originsys.eap.iservice.IGet;

import com.originsys.eap.util.RequestAction;


/**
 * @author boy Email:
 * @version 1.0 创建时间： 类说明：安全责任单位编辑列表页
 */
public class TBuildingUnitListClient extends BaseAction implements IGet {
	
	private static final long serialVersionUID = 1L;

	public DataAndView<Map> execute(RequestAction ra) throws Exception {		
		/** 组织查询条件对象 */
		Orgcom orgcom=new Orgcom();
		orgcom.setOrgan_name(ra.getParameter("unit_name_select"));// String:安全责任单位名称
		//orgcom.setCom_type(ra.getParameter("unit_type_select"));// String:安全责任单位类型
		orgcom.setOrgan_region(ra.getParameter("city_district_select"));// String:所属区域
		orgcom.setAuthentication_state("1");// String:审核状态		
//		if(ra.getParameter("reg_date")!=null&&!"".equals(ra.getParameter("reg_date"))){
//			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
//			orgcom.setReg_date(sdf.parse(ra.getParameter("reg_date")));
//		}	
		// 获得起始条数
		int start = 0;
		// 获得每页显示的条数
		int pageNum = 10;
		if (ra.getParameter("rows") != null) {
			pageNum = Integer.parseInt(ra.getParameter("rows"));
		} else {
			pageNum = 10;
		}
		pageNum = (pageNum == 0) ? 10 : pageNum;
		// 获取总条数
		int totalnum =ApiUtil.getService().getOrgcomCount(orgcom);	//webservice方法			
		// 获得总页数
		int totalpage = totalnum % pageNum == 0 ? totalnum / pageNum
				: (totalnum / pageNum + 1);
		// 获得当前页
		String currentPage = ra.getParameter("page");
		int currentNum = 1;
		if (currentPage != null && !"".equals(currentPage)) {
			currentNum = Integer.parseInt(currentPage);
		}
		// 重新设置起始条数
		start = (currentNum - 1) * pageNum;
		int end = currentNum * pageNum;
		// 排序字段+排序方式
		String sortname = ra.getParameter("sidx");
		if (sortname == null || "".equals(sortname)) {
			sortname = "organ_id";
		}
		String sortorder = ra.getParameter("sord");
		if (sortorder == null || "".equals(sortorder)) {
			sortorder = "asc";
		}		
		//定义参数
		Map<String,Object> param = new HashMap<String,Object>();
		param.put("_page_start", start);
		param.put("_page_nums", pageNum);//该参数是为MySQL数据库准备的
		param.put("_page_end", end);//该参数是为Oracle数据库准备的
		param.put("_sortname", sortname);
		param.put("_sortorder", sortorder);
		param.put("orgcom", orgcom);	  
		// 查询结果
		List<Orgcom> resultList = ApiUtil.getService().getOrgcomList(param);//webservice方法	
		if(resultList!=null){
			for(int i=0;i<resultList.size();i++){
				Orgcom temp=resultList.get(i);
				if(temp.getOrgan_desc()!=null){
					temp.setOrgan_desc(temp.getOrgan_desc().trim().replaceAll("\r","").replaceAll("\n", ""));
					resultList.set(i, temp);
				}
			}
		}
		Page page = new Page(totalpage, currentNum, totalnum);
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("page", page);
		resultMap.put("resultList", resultList);
		return new DataAndView(resultMap, "block");
	}
}