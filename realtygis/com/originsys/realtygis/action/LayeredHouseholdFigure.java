package com.originsys.realtygis.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.originsys.eap.action.BaseAction;
import com.originsys.eap.domain.DataAndView;
import com.originsys.eap.iservice.IGet;
import com.originsys.eap.util.DataSource;
import com.originsys.eap.util.RequestAction;
import com.originsys.realtygis.domain.House;

/**
 auth:boy 2014-2-12
   描述：分层分户图
 */
@SuppressWarnings("serial")
public class LayeredHouseholdFigure extends BaseAction implements IGet{
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public DataAndView execute(RequestAction ra) throws Exception {
		SqlMapClient sc=DataSource.getSqlMapInstance();
		Map<String,Object> map=new HashMap<String,Object>();
		String building_id=ra.getParameter("building_id");
		Map<String,Object> term=new HashMap<String,Object>();
		if(!"".equals(building_id)||building_id!=null){
			term.put("building_id",building_id);
		}
		//获得单元及单元含有的最大套数的list
		List<Map> all_unitlist=sc.queryForList("Realtygis.getALLUnitNumberList", building_id);
		List<House> laylist=sc.queryForList("Realtygis.laylist", term);
		List<House> houselist=sc.queryForList("Realtygis.houselist", term);
		int geoCount=Integer.parseInt((sc.queryForObject("Realtygis.getGeoCountByBuildingId",term)).toString());
		String layerNumber=sc.queryForObject("Realtygis.getLayerNameByBuildingId",term).toString();
		map.put("laylist", laylist);
		map.put("houselist", houselist);
		map.put("all_unitlist", all_unitlist);
		map.put("term", term);
		map.put("geoCount",geoCount);
		map.put("layerNumber",layerNumber);
		houselist=null;
		laylist=null;
		return new DataAndView(map, "map");
	}

}
