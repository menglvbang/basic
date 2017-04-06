package com.originsys.realtygis.action;
import java.util.HashMap;
import java.util.ResourceBundle;
import com.originsys.eap.action.BaseAction;
import com.originsys.eap.domain.DataAndView;
import com.originsys.eap.iservice.IGet;
import com.originsys.eap.util.FileReaderUtil;
import com.originsys.eap.util.RequestAction;
/**
 auth:zhanglf 2014-6-17
   描述:获取地图服务器地址
 */
@SuppressWarnings("serial")
public class BuildingSceneProperty extends BaseAction implements IGet{

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public DataAndView execute(RequestAction ra) throws Exception {
		String buildingId=ra.getParameter("building_id");
		String panoId="";
	//	System.out.println("*********************buildingId=********************"+buildingId);
		 HashMap<String, String>hm=new HashMap<String, String>();
		 hm.put("-121854","0000-01-20141013034557047");	
		 hm.put("-107521","0000-01-20141010034553673");
		 hm.put("-74119", "0000-01-20141011034557125");
		if(null!=buildingId){
		  panoId=hm.get(buildingId);
		//  System.out.println(panoId);
		  if(null==panoId||"".equals(panoId)){
			  panoId="";
		  }
		}
		  else{
			  panoId="";
		  }
		//读取属性文件 
		ResourceBundle rb=FileReaderUtil.getInstance().getResourceBundle("realtygis");
		String scene_url=rb.getString("scene_url");	
		HashMap map=new HashMap();		
		map.put("scene_url", scene_url);
		map.put("panoId",panoId);
		return new DataAndView(map,"map");
	}

}
