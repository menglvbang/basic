package com.originsys.safemanage.safecheck.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.originsys.eap.action.BaseAction;
import com.originsys.eap.domain.DataAndView;
import com.originsys.eap.iservice.IGet;
import com.originsys.eap.util.DataSource;
import com.originsys.eap.util.RequestAction;
import com.originsys.safemanage.domain.TBuilding;
import com.originsys.safemanage.domain.TBuildingSafe;
import com.originsys.safemanage.domain.TBuildingSurvey;
import com.originsys.safemanage.domain.TInvmBase;
import com.originsys.safemanage.domain.TInvmField;

/**
 auth:zhanglf 2014-5-27
   描述：楼幢普查详细信息
 */
public class SurveyDetail extends BaseAction implements  IGet{

	public DataAndView execute(RequestAction ra) throws Exception {
		String  survey_id = ra.getParameter("survey_id");
		//String  building_id = ra.getParameter("building_id");
		String  isgis=ra.getParameter("isgis");
		SqlMapClient sc=DataSource.getSqlMapInstance();
		/**楼幢基本信息*/
//		TBuilding building=(TBuilding)sc.queryForObject("Safecheck.getTBuilding",building_id);
		/**普查情况信息*/
		TBuildingSurvey buildingsurvey=(TBuildingSurvey)sc.queryForObject("Safecheck.getTBuildingSurvey",survey_id);
		/**组织返回的对象*/
		Map<String,Object> remap=new HashMap<String,Object>();
//		remap.put("building", building);
		remap.put("buildingsurvey", buildingsurvey);
		remap.put("isgis", isgis);
		//获取当前登录用户的mem_id
		String mem_id=ra.getUser().getMem_id();
		String ischange="";//记录是否可以改变所属区域@0-否&1-是，为空的时候也不能修改
//		List roles=(List)sc.queryForList("Safecheck.getRoles", mem_id);
		List roles=ra.getUser().getRoleList();
		for(int i=0;i<roles.size();i++){
			this.log().debug("角色"+(i+1)+":"+roles.get(i));
			if("surveychecker".equals(roles.get(i))){//检查员
				ischange="0";
				break;
			}else if("surveymanager".equals(roles.get(i))){//管理员
				ischange="1";
				break;
			}else if("surveyregionmanager".equals(roles.get(i))){//区县管理员
				ischange="0";
				break;
			}
		}
		remap.put("ischange", ischange);
		return new DataAndView(remap,"block");
	}

}
