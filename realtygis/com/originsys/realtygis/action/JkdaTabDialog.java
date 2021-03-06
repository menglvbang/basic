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
import com.originsys.realtygis.domain.Invmprj;

public class JkdaTabDialog extends BaseAction implements IGet{
	/**
	 * 类说明：带tab页的弹出窗口健康档案查询楼栋类
	 * @创建时间：2014-4-26
	 * @作者：洛佳明
	 */
	private static final long serialVersionUID = 1L;
	public DataAndView<Map<String, List>> execute(RequestAction ra)
			throws Exception {	
		SqlMapClient sc=DataSource.getSqlMapInstance();
		Map<String, List> map=new HashMap<String, List>();
		Invmprj eo=new Invmprj();
		Integer invm_prj_id=Integer.parseInt(ra.getParameter("invm_prj_id"));
	    eo.setInvm_prj_id(invm_prj_id);
		@SuppressWarnings("unchecked")
		List  list=(List)sc.queryForList("Realtygis.jkdatabbuildingquery", eo);
		map.put("list", list);
		
		return new DataAndView<Map<String, List>>(map, "map");
		
	}

}