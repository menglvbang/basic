package com.originsys.realtygis.dataSyn;


import java.sql.PreparedStatement;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.log4j.Logger;

public class ChinaWeatherThread extends Thread {
	private static String name;
	private static String POST_URL;
	private static PreparedStatement pst;
	
	private WeatherDataInfo realTimeInfo;
	private WeatherDataInfo today12Info;
	private WeatherDataInfo today24Info;
	private WeatherDataInfo mDayInfo;
	private WeatherDataInfo mNightInfo;
	private WeatherDataInfo hDayInfo;
	private WeatherDataInfo hNightInfo;
	
	private Logger log = Logger.getLogger(this.getClass().getName());
	public ChinaWeatherThread(String name,String url,PreparedStatement pst){
		super();
		this.name = name;
		this.POST_URL = url;
		this.pst = pst;
	}
	public void run() {
		//System.out.println("获取 "+name+" start...");
		log.info("获取 "+name+" start...");
		getWeatherInfo();
		log.info("获取 "+name+" end...");
		//System.out.println("获取 "+name+" end...");
	}
    private void getWeatherInfo(){
        try {
        	log.info("DefaultHttpClient 操作开始");
            DefaultHttpClient httpclient = new DefaultHttpClient();
            log.info("DefaultHttpClient实例化成功");
            HttpGet httget = new HttpGet(POST_URL);
            ResponseHandler<String> responseHandler = new BasicResponseHandler();
            String responseBody = httpclient.execute(httget, responseHandler);
            log.info("数据获取成功");
            
            String today = responseBody.substring(responseBody.indexOf("<!-- 今天明天预报 begin-->")+20,responseBody.indexOf("<!-- 今天明天预报 end-->"));
            //System.out.println(today);
            String todayT = today.substring(today.indexOf("<h1>"),today.indexOf("<div"));
            String todayN = today.substring(today.indexOf("todayN'>")+8,today.lastIndexOf("</p>")+4);
            //System.out.println(todayT);
            //System.out.println(todayN);
            
            //封装未来12小时天气对象
            today12Info = getTodayDayNightInfo(todayT);
            log.info("封装未来12小时天气对象成功");
            //封装未来12-24小时天气对象
            today24Info = getTodayDayNightInfo(todayN);
            log.info("封装未来12-24小时天气对象成功");
            
            String mhtian = responseBody.substring(responseBody.indexOf("<!-- 明天后天预报 begin-->")+20,responseBody.indexOf("<!-- 明天后天预报 end-->"));
            //System.out.println(mhtian);
            
            //明天天气
            String mtian = mhtian.substring(mhtian.indexOf("<h2>"),mhtian.lastIndexOf("</p>",mhtian.lastIndexOf("<h2>"))+4);
            String dateWeak = mtian.substring(mtian.indexOf("<h2>")+4,mtian.indexOf("</h2>"));
            String mtianT = mtian.substring(mtian.indexOf("<h1>"),mtian.lastIndexOf("</p>",mtian.lastIndexOf("<h1>"))+4);
            String mtianN = mtian.substring(mtian.lastIndexOf("<h1>"),mtian.length());
            //封装明天白天天气对象
            mDayInfo = getMHDayNightInfo(dateWeak,mtianT);
            log.info("封装明天白天天气对象成功");
            //封装明天夜间天气对象
            mNightInfo = getMHDayNightInfo(dateWeak,mtianN);
            log.info("封装明天夜间天气对象成功");
            
            //后天天气
            String htian = mhtian.substring(mhtian.lastIndexOf("<h2>"),mhtian.lastIndexOf("</p>")+4);
            String hdateWeak = htian.substring(htian.indexOf("<h2>")+4,htian.indexOf("</h2>"));
            String htianT = htian.substring(htian.indexOf("<h1>"),htian.lastIndexOf("</p>",htian.lastIndexOf("<h1>"))+4);
            String htianN = htian.substring(htian.lastIndexOf("<h1>"),htian.length());
            //封装后天白天天气对象
            hDayInfo = getMHDayNightInfo(hdateWeak,htianT);
            log.info("封装后天白天天气对象成功");
            //封装后天夜间天气对象
            hNightInfo = getMHDayNightInfo(hdateWeak,htianN);
            log.info("封装后天白天天气对象成功");
            
            //var observe24h_data = {"od":{"od0":"20141114220000","od1":"济南","od2":[{"od21":"22","od22":"5","od23":"115","od24":"东南风","od25":"2","od26":"0","od27":"46"},{"od21":"21","od22":"6","od23":"137","od24":"东南风","od25":"2","od26":"0","od27":"44"},{"od21":"20","od22":"6","od23":"111","od24":"东风","od25":"2","od26":"0","od27":"44"},{"od21":"19","od22":"7","od23":"112","od24":"东风","od25":"2","od26":"0","od27":"42"},{"od21":"18","od22":"8","od23":"119","od24":"东南风","od25":"1","od26":"0","od27":"35"},{"od21":"17","od22":"10","od23":"22","od24":"北风","od25":"2","od26":"0","od27":"30"},{"od21":"16","od22":"12","od23":"308","od24":"西北风","od25":"2","od26":"0","od27":"25"},{"od21":"15","od22":"13","od23":"308","od24":"西北风","od25":"1","od26":"0","od27":"23"},{"od21":"14","od22":"13","od23":"32","od24":"东北风","od25":"2","od26":"0","od27":"24"},{"od21":"13","od22":"13","od23":"49","od24":"东北风","od25":"1","od26":"0","od27":"27"},{"od21":"12","od22":"13","od23":"24","od24":"东北风","od25":"2","od26":"0","od27":"27"},{"od21":"11","od22":"12","od23":"338","od24":"北风","od25":"2","od26":"0","od27":"31"},{"od21":"10","od22":"10","od23":"311","od24":"西北风","od25":"1","od26":"0","od27":"34"},{"od21":"09","od22":"8","od23":"153","od24":"东南风","od25":"1","od26":"0","od27":"38"},{"od21":"08","od22":"4","od23":"148","od24":"东南风","od25":"1","od26":"0","od27":"47"},{"od21":"07","od22":"3","od23":"134","od24":"东南风","od25":"2","od26":"0","od27":"55"},{"od21":"06","od22":"3","od23":"144","od24":"东南风","od25":"2","od26":"0","od27":"51"},{"od21":"05","od22":"3","od23":"121","od24":"东南风","od25":"2","od26":"0","od27":"50"},{"od21":"04","od22":"3","od23":"119","od24":"东南风","od25":"2","od26":"0","od27":"47"},{"od21":"03","od22":"3","od23":"117","od24":"东南风","od25":"2","od26":"0","od27":"45"},{"od21":"02","od22":"4","od23":"122","od24":"东南风","od25":"2","od26":"0","od27":"42"},{"od21":"01","od22":"5","od23":"113","od24":"东南风","od25":"2","od26":"0","od27":"37"},{"od21":"00","od22":"5","od23":"144","od24":"东南风","od25":"1","od26":"0","od27":"34"},{"od21":"23","od22":"6","od23":"130","od24":"东南风","od25":"1","od26":"0","od27":"31"},{"od21":"22","od22":"6","od23":"133","od24":"东南风","od25":"1","od26":"0","od27":"29"}]}}
            //od21:时间	od22:温度	od23:空气质量(AQI)	 od24:风向	 od25:风力	od26:降水量	od27:相对湿度
            String lineData = responseBody.substring(responseBody.indexOf("var observe24h_data"),responseBody.length());
            lineData = lineData.substring(0,lineData.indexOf(";"));
            lineData = lineData.substring(lineData.indexOf("{"),lineData.length());
            //System.out.println(lineData);
            
            realTimeInfo = lineDataToJSON(lineData);
            log.info("封装实时天气信息成功");
            //实时天气属性
            try {
            	pst.setString(1,realTimeInfo.getR_reporttime());
                pst.setString(2,realTimeInfo.getR_temperature());
                pst.setString(3,realTimeInfo.getR_humidity());
                pst.setString(4,realTimeInfo.getR_wind());
                pst.setString(5,realTimeInfo.getR_aqi());
                pst.setString(6,realTimeInfo.getR_precipitation());
                
                //System.out.println("实时天气属性 OCER");
			} catch (Exception e) {
				log.info("实时天气属性 "+e);
				System.out.println("实时天气属性 "+e);
			}
            //今天天气属性
            try {
            	pst.setString(7,today12Info.getDateWeak());
                pst.setString(8,today12Info.getDaynight());
                pst.setString(9,today12Info.getWeather());
                pst.setString(10,today12Info.getTemperature());
                pst.setString(11,today12Info.getWindDir()+" "+today12Info.getWind());
                pst.setString(12,today12Info.getSunTime());
                pst.setString(13,today24Info.getDaynight());
                pst.setString(14,today24Info.getWeather());
                pst.setString(15,today24Info.getTemperature());
                pst.setString(16,today24Info.getWindDir()+" "+today12Info.getWind());
                pst.setString(17,today24Info.getSunTime());
                //System.out.println("今天天气属性 OCER");
			} catch (Exception e) {
				log.info("今天天气属性: "+e);
				System.out.println("今天天气属性: "+e);
			}
            
          //明天天气属性
            try {
            	pst.setString(18,mDayInfo.getDateWeak());
                pst.setString(19,mDayInfo.getDaynight());
                pst.setString(20,mDayInfo.getWeather());
                pst.setString(21,mDayInfo.getTemperature());
                pst.setString(22,mDayInfo.getWindDir()+" "+mDayInfo.getWind());
                pst.setString(23,mDayInfo.getSunTime());
                pst.setString(24,mNightInfo.getDaynight());
                pst.setString(25,mNightInfo.getWeather());
                pst.setString(26,mNightInfo.getTemperature());
                pst.setString(27,mNightInfo.getWindDir()+" "+mNightInfo.getWind());
                pst.setString(28,mNightInfo.getSunTime());
                //System.out.println("明天天气属性 OCER");
			} catch (Exception e) {
				log.info("明天天气属性: "+e);
				System.out.println("明天天气属性: "+e);
			}
            
          //后天天气属性
            try {
            	pst.setString(29,hDayInfo.getDateWeak());
                pst.setString(30,hDayInfo.getDaynight());
                pst.setString(31,hDayInfo.getWeather());
                pst.setString(32,hDayInfo.getTemperature());
                pst.setString(33,hDayInfo.getWindDir()+" "+hDayInfo.getWind());
                pst.setString(34,hDayInfo.getSunTime());
                pst.setString(35,hNightInfo.getDaynight());
                pst.setString(36,hNightInfo.getWeather());
                pst.setString(37,hNightInfo.getTemperature());
                pst.setString(38,hNightInfo.getWindDir()+" "+hNightInfo.getWind());
                pst.setString(39,hNightInfo.getSunTime());
                //System.out.println("后天天气属性 OCER");
			} catch (Exception e) {
				log.info("后天天气属性: "+e);
				System.out.println("后天天气属性: "+e);
			}
          //区县编码
			String contyCode = getCountyCode(name);
            pst.setString(40,contyCode);
            
            pst.executeUpdate();
        } catch (Exception e) {
        	log.info("out execupe "+e);
        	System.out.println(e);
        }
        
    }
    /*
     * String类型拼装的json形式数据，转换成json对象，并解析
     * od21:时间	od22:温度	od23:空气质量(AQI)	 od24:风向	 od25:风力	od26:降水量	od27:相对湿度
     */
    private WeatherDataInfo lineDataToJSON(String str) {
    	JSONObject jsonobject = JSONObject.fromObject(str);
		
		String od = jsonobject.getString("od");
		//System.out.println(od);
		JSONObject odObj = JSONObject.fromObject(od);
		String od0 = odObj.getString("od0");
		//System.out.println("od0 "+od0);
		String od1 = odObj.getString("od1");
		//System.out.println("od0 "+od1);
		
		JSONArray array = odObj.getJSONArray("od2");
		JSONObject obj = (JSONObject) array.get(array.size()-1);
		//System.out.println("obj  "+obj);
		//od21:时间	od22:温度	od23:空气质量(AQI)	 od24:风向	 od25:风力	od26:降水量	od27:相对湿度
		String hour = obj.getString("od21");
		String temp = obj.getString("od22");
		String aqi = obj.getString("od23");
		//System.out.println("aqi  "+aqi);
		String windDir = obj.getString("od24");
		String wind = obj.getString("od25");
		String precipitation = obj.getString("od26");
		String humidity = obj.getString("od27");
		
		WeatherDataInfo data = new WeatherDataInfo(hour,temp,humidity,windDir+wind,aqi,precipitation);
		
		//获取一个json数组
	   //将json数组 转换成 List<PassPortForLendsEntity>泛型
	   /*List<String> list = new ArrayList<String>();
	   for (int i = 0; i < array.size(); i++) {   
            JSONObject object = (JSONObject)array.get(i);  
            System.out.println(i+"  "+object);
        }*/
		
	   return data;
		
	}
	/*
     * 处理今天数据
     */
    public WeatherDataInfo getTodayDayNightInfo(String str){
    	String dateWeak = str.substring(str.indexOf("<h1>")+4,str.indexOf("</h1>"));
    	//System.out.println(dateWeak);
        String daynight = str.substring(str.indexOf("<h2>")+4,str.indexOf("</h2>"));
        //System.out.println(daynight);
        String wea = str.substring(str.lastIndexOf(">",str.indexOf("</p>"))+1,str.indexOf("</p>"));
        //System.out.println(wea);
        String temp = str.substring(str.indexOf("<span>")+6,str.indexOf("</span>"))+"°C";
        //System.out.println(temp);
        String wind = str.substring(str.lastIndexOf(">",str.lastIndexOf("</span>"))+1,str.lastIndexOf("</span>"));
        String windDir = str.substring(str.lastIndexOf("title=")+7,str.length());
        windDir = windDir.substring(0,windDir.indexOf(">")-1);
        //System.out.println(windDir+" "+wind);
        String suntime = str.substring(str.lastIndexOf(">",str.lastIndexOf("</p>"))+1,str.lastIndexOf("</p>"));
        suntime = suntime.trim();
        //System.out.println(suntime);
        
        WeatherDataInfo data = new WeatherDataInfo(dateWeak, daynight, wea, temp, wind, windDir, suntime);
        return data;
    }
    /*
     * 处理明后天数据
     */
    public WeatherDataInfo getMHDayNightInfo(String dateWeak,String str){
    	//System.out.println(dateWeak);
        String daynight = str.substring(str.indexOf("<h1>")+4,str.indexOf("</h1>"));
        //System.out.println(daynight);
        String wea = str.substring(str.lastIndexOf(">",str.indexOf("</p>"))+1,str.indexOf("</p>"));
        //System.out.println(wea);
        String temp = str.substring(str.indexOf("<span>")+6,str.indexOf("</span>"))+"°C";
        //System.out.println(temp);
        String wind = str.substring(str.lastIndexOf(">",str.lastIndexOf("</span>"))+1,str.lastIndexOf("</span>"));
        String windDir = str.substring(str.lastIndexOf("title=")+7,str.length());
        windDir = windDir.substring(0,windDir.indexOf(">")-1);
        //System.out.println(windDir+" "+wind);
        String suntime = str.substring(str.lastIndexOf(">",str.lastIndexOf("</p>"))+1,str.lastIndexOf("</p>"));
        suntime = suntime.trim();
        //System.out.println(suntime);
        
        WeatherDataInfo data = new WeatherDataInfo(dateWeak, daynight, wea, temp, wind, windDir, suntime);
        return data;
    }
    
    private String getCountyCode(String name) {
		String countycode="370100";
		if(name.equals("jinan")){
			countycode="370100";
		}else if(name.equals("lixiaqu")){
			countycode="370102";
		}else if(name.equals("lichengqu")){
			countycode="370112";
		}else if(name.equals("shizhongqu")){
			countycode="370103";
		}else if(name.equals("tianqiaoqu")){
			countycode="370105";
		}else if(name.equals("huaiyinqu")){
			countycode="370104";
		}else if(name.equals("changqing")){
			countycode="370113";
		}else if(name.equals("jiyang")){
			countycode="370125";
		}else if(name.equals("shanghe")){
			countycode="370126";
		}else if(name.equals("pingyin")){
			countycode="370124";
		}else if(name.equals("zhangqiu")){
			countycode="370181";
		}
		return countycode;
	}
    
}
class WeatherDataInfo{
	private String dateWeak;//日期 周几
	private String daynight;//白天 或者 夜间
	private String weather;//天气情况
	private String temperature;//温度
	private String wind;//风力
	private String windDir;//风向
	private String sunTime;//日出、日落时间
	
	private String r_reporttime;
	private String r_temperature;
	private String r_humidity;
	private String r_wind;
	private String r_aqi;
	private String r_precipitation;
	public WeatherDataInfo(String r_reporttime,String r_temperature,
			String r_humidity,String r_wind,String r_aqi,String r_precipitation) {
		super();
		this.r_reporttime = r_reporttime;
		this.r_temperature = r_temperature;
		this.r_humidity = r_humidity;
		this.r_wind = r_wind;
		this.r_aqi = r_aqi;
		this.r_precipitation = r_precipitation;
	}
	public WeatherDataInfo(String dateWeak, String daynight, String weather,
			String temperature, String wind, String windDir, String sunTime) {
		super();
		this.dateWeak = dateWeak;
		this.daynight = daynight;
		this.weather = weather;
		this.temperature = temperature;
		this.wind = wind;
		this.windDir = windDir;
		this.sunTime = sunTime;
	}
	public String getDateWeak() {
		return dateWeak;
	}
	public void setDateWeak(String dateWeak) {
		this.dateWeak = dateWeak;
	}
	public String getDaynight() {
		return daynight;
	}
	public void setDaynight(String daynight) {
		this.daynight = daynight;
	}
	public String getWeather() {
		return weather;
	}
	public void setWeather(String weather) {
		this.weather = weather;
	}
	public String getTemperature() {
		return temperature;
	}
	public void setTemperature(String temperature) {
		this.temperature = temperature;
	}
	public String getWind() {
		return wind;
	}
	public void setWind(String wind) {
		this.wind = wind;
	}
	public String getWindDir() {
		return windDir;
	}
	public void setWindDir(String windDir) {
		this.windDir = windDir;
	}
	public String getSunTime() {
		return sunTime;
	}
	public void setSunTime(String sunTime) {
		this.sunTime = sunTime;
	}
	public String getR_reporttime() {
		return r_reporttime;
	}
	public void setR_reporttime(String r_reporttime) {
		this.r_reporttime = r_reporttime;
	}
	public String getR_temperature() {
		return r_temperature;
	}
	public void setR_temperature(String r_temperature) {
		this.r_temperature = r_temperature;
	}
	public String getR_humidity() {
		return r_humidity;
	}
	public void setR_humidity(String r_humidity) {
		this.r_humidity = r_humidity;
	}
	public String getR_wind() {
		return r_wind;
	}
	public void setR_wind(String r_wind) {
		this.r_wind = r_wind;
	}
	public String getR_aqi() {
		return r_aqi;
	}
	public void setR_aqi(String r_aqi) {
		this.r_aqi = r_aqi;
	}
	public String getR_precipitation() {
		if(r_precipitation == null || r_precipitation.equals("")){
			r_precipitation="0";
		}
		return r_precipitation;
	}
	public void setR_precipitation(String r_precipitation) {
		this.r_precipitation = r_precipitation;
	}
	
	
}
