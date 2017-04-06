package com.originsys.realtygis.action;


import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.ResourceBundle;

import javax.sql.XAConnection;
import javax.transaction.xa.XAResource;
import javax.transaction.xa.Xid;
import oracle.jdbc.xa.client.OracleXADataSource;
import oracle.sql.BLOB;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import com.originsys.eap.action.BaseAction;
import com.originsys.eap.util.FileReaderUtil;
import com.originsys.eap.util.OrgContextHolder;
import com.originsys.realtygis.domain.MyXid;
import com.yc.eap.util.UtilString;

/**
 auth:boy 2014-2-17
   描述：数据同步的定时任务，异步事务处理
 */
public class DataSynch extends BaseAction implements Job{

	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		/** 设置线程的局部变量 读取属性配置文件*/
		OrgContextHolder.setVendorType("eap2");
		/**记录操作日志，最终写到文件中，这样出问题的时候也好查找是哪里的问题，每次同步记录一个日志文件*/
		StringBuffer logbuf=new StringBuffer();
		Date logdate=new Date();
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    	String logdatestr=sdf.format(logdate);
		logbuf.append(logdatestr+"数据同步开始\r\n");
		/**源数据库连接对象*/
		Connection oraCn = null; 
		OracleXADataSource oraDs = null; 
		XAConnection xaoraCn = null; 
		XAResource xaoraRes = null; 
		Xid oraXid = null; 
		Statement orapst = null;
		/**目标数据库连接对象*/
		Connection oraCnT = null; 
		OracleXADataSource oraDsT = null; 
		XAConnection xaoraCnT = null; 
		XAResource xaoraResT = null; 
		Xid oraXidT = null; 
		Statement orapstT = null;
		logbuf.append("准备建立数据库连接\r\n");
		ResourceBundle rb=FileReaderUtil.getInstance().getResourceBundle("realtygis");
		try{
			//获得源数据库的数据源及连接
			oraDs = new OracleXADataSource(); 
	        oraDs.setURL(rb.getString("s_url")); 
	        xaoraCn = oraDs.getXAConnection(rb.getString("s_name"), rb.getString("s_pass")); 
	        oraCn = xaoraCn.getConnection(); 
	        orapst = oraCn.createStatement(); 
	        //获得目标数据库的数据源及连接
			oraDsT = new OracleXADataSource(); 
	        oraDsT.setURL(rb.getString("t_url")); 
	        xaoraCnT = oraDsT.getXAConnection(rb.getString("t_name"), rb.getString("t_pass")); 
	        oraCnT = xaoraCnT.getConnection(); 
	        orapstT = oraCnT.createStatement(); 
	        logbuf.append("数据库连接建立成功\r\n");
	        /**同步T_BUILDING表*/
	        String buildlog=doSynchBuilding(xaoraResT,xaoraCnT,oraXidT,orapstT,xaoraRes,xaoraCn,oraXid,orapst);
	        logbuf.append(buildlog);
	        /**同步T_FLOOR表*/
//	        String floorlog=doSynchFloor(xaoraResT,xaoraCnT,oraXidT,orapstT,xaoraRes,xaoraCn,oraXid,orapst);
//	        logbuf.append(floorlog);
	        /**同步T_HOUSE表*/
	        String houselog=doSynchHouse(xaoraResT,xaoraCnT,oraXidT,orapstT,xaoraRes,xaoraCn,oraXid,orapst);
	        logbuf.append(houselog);
	        /**同步T_PROJECTSDDFILE表*/
//	        String projectlog=doSynchProjectsddfile(rb.getString("s_url"),rb.getString("s_name"),
//	        		rb.getString("s_pass"),rb.getString("t_url"),rb.getString("t_name"),rb.getString("t_pass"));
//	        logbuf.append(projectlog);
	        /**同步T_surverbasic表*/
//	        String surverbasiclog=doSynchSurverBasic(rb.getString("s_url"),rb.getString("s_name"),
//	        		rb.getString("s_pass"),rb.getString("t_url"),rb.getString("t_name"),rb.getString("t_pass"));
//	        logbuf.append(surverbasiclog);
	        /**同步T_SURVERPROJECT表*/
	        String surverprojectlog=doSynchSurverProject(rb.getString("s_url"),rb.getString("s_name"),
	        		rb.getString("s_pass"),rb.getString("t_url"),rb.getString("t_name"),rb.getString("t_pass"));
	        logbuf.append(surverprojectlog);
		}catch(Exception e){
			 e.printStackTrace();
			 logbuf.append("建立链接异常："+e.getMessage()+"\r\n");
		}finally{
			try { 
			   //关闭  
			   orapst.close(); 
			   oraCn.close(); 
			   xaoraCn.close(); 
			   orapstT.close(); 
			   oraCnT.close(); 
			   xaoraCnT.close();
			 } catch (SQLException ex) { 
			     ex.printStackTrace();
			     logbuf.append("关闭链接异常："+ex.getMessage()+"\r\n");
			 } 			
		}	
		try{
			SimpleDateFormat simpledateformat =
					new SimpleDateFormat("yyyy-MM-dd");			
			/**输出日志文件*/
			File f = new File(rb.getString("logfilepath")+"SynchDataLog_"+simpledateformat.format(new Date())+".txt");
			if(f.exists()){  
			}else{
				f.createNewFile();
			} 
			BufferedWriter output = new BufferedWriter(new FileWriter(f)); 
			output.write(logbuf.toString()); 
			output.flush();
			output.close();
		}catch(Exception e){
			e.printStackTrace();
		}
	}

	/**同步T_BUILDING*/
	private String doSynchBuilding(XAResource xaoraResT,XAConnection xaoraCnT,Xid oraXidT,Statement orapstT,
			XAResource xaoraRes,XAConnection xaoraCn,Xid oraXid,Statement orapst){
		StringBuffer sb=new StringBuffer();
		sb.append("T_Building表数据同步开始========================\r\n");
		try{
        	/**查询源数据库的结果集*/
        	String sql="select t.building_id,t.surverproject_id,t.unit,t.surver,t.use_desgin," +
        			"t.real_type,t.tn_area,t.ft_area,t.build_area,t.noft_area,t.no_area," +
        			"t.discrepant_area,t.building_date,t.sruver_date,t.surver_enddate," +
        			"t.building_number,t.building_address,t.floor_count,t.build_struct," +
        			"t.house_count,t.graphics_code,t.graphics_number,t.building_mapid," +
        			"(to_char(t.input_date,'yyyy-mm-dd hh:mi:ss')) input_date," +
        			"t.floorup_count,t.floordown_count,t.city_district," +
        			"t.synch_time,t.synch_type,t.id from T_BUILDING t order by synch_time asc";
        	sb.append("T_BUILDIING查询语句："+sql+"\r\n");
        	ResultSet rs=orapst.executeQuery(sql);
        	Date deldate=new Date();
        	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        	String deldatestr=sdf.format(deldate);
        	/**组织数据增加到目标数据库中*/
        	//定义XAResource 
	        xaoraResT = xaoraCnT.getXAResource(); 
	        //定义Xid 
	        oraXidT = new MyXid(0, new byte[]{0x01}, new byte[]{0x02}); 
	        sb.append("T_BUILDIING开始循环结果集\r\n");
	        int exe_num=0;
	        int all_num=0;
	        int num_seq=0;
	        //执行Oracle
	        xaoraResT.start(oraXidT, XAResource.TMNOFLAGS); 		        
	        while (rs.next()) {
	        	if(rs.getInt(30)>num_seq)
	        		num_seq=rs.getInt(30);
	        	all_num++;
	        	//同步类型：（新增：‘00’；修改：‘01’；删除：‘02’）
	        	String synch_type=rs.getString(29);
	        	if("00".equals(synch_type)){
	        		exe_num++;
	        		String add_sql="insert into T_BUILDING " +
		        			"(building_id,surverproject_id,unit,surver,use_desgin,real_type,tn_area," +
		        			"ft_area,build_area,noft_area,no_area,discrepant_area,building_date," +
		        			"sruver_date,surver_enddate,building_number,building_address,floor_count," +
		        			"build_struct,house_count,graphics_code,graphics_number,building_mapid," +
		        			"input_date,floorup_count,floordown_count,city_district) " +
		        			"values ("+rs.getInt(1)+","+rs.getInt(2)+",'";
			        		if(rs.getObject(3)!=null)
		        				add_sql+=rs.getObject(3);
		        			add_sql+="'," +rs.getInt(4)+","+rs.getInt(5)+","+rs.getInt(6)+","+rs.getInt(7)+
		        					","+rs.getInt(8)+","+rs.getInt(9)+","+rs.getInt(10)+","+rs.getInt(11)+
		        					","+rs.getInt(12)+","
		        					+rs.getObject(13)+",";
		        					if(rs.getObject(14)!=null)
		        						add_sql+="to_date('"+rs.getObject(14)+"','YYYY-MM-DD'),";
		        					else
		        						add_sql+="null,";
		        					if(rs.getObject(15)!=null)
		        						add_sql+="to_date('"+rs.getObject(15)+"','YYYY-MM-DD'),'";
		        					else
		        						add_sql+="null,'";
		        					if(rs.getObject(16)!=null)
		        						add_sql+=rs.getObject(16);
		        					add_sql+="','";
		        					if(rs.getObject(17)!=null)
					        			add_sql+=rs.getObject(17);
				        			add_sql+="',"+rs.getInt(18)+","+rs.getInt(19)+","+rs.getInt(20)+",'";
				        			if(rs.getObject(21)!=null)
					        			add_sql+=rs.getObject(21);
					        		add_sql+="','";
					        		if(rs.getObject(22)!=null)
							        	add_sql+=rs.getObject(22);
					        		add_sql+="',"+rs.getInt(23);
		        					if(rs.getObject(24)!=null)
		        						add_sql+=",to_date('"+rs.getObject(24)+"','yyyy-mm-dd hh:mi:ss'),";
		        					else
		        						add_sql+=",null,";
		        					add_sql+=rs.getInt(25)+","+rs.getInt(26)+","+rs.getInt(27)+")";
		        	sb.append(add_sql+"\r\n");
	        		orapstT.execute(add_sql);
	        	}
	        	if("01".equals(synch_type)){
	        		exe_num++;
	        		//修改数据
	        		String update_sql="update T_BUILDING set " +
	        				"surverproject_id="+rs.getObject(2)+",unit='";
			        		if(rs.getObject(3)!=null)
			        			update_sql+=rs.getObject(3);
	        				update_sql+="',surver="+rs.getObject(4)+",use_desgin="+rs.getObject(5)+"," +
	        				"real_type="+rs.getObject(6)+",tn_area="+rs.getObject(7)
	        				+",ft_area="+rs.getObject(8)+",build_area="+rs.getObject(9)+"," +
	        				"noft_area="+rs.getObject(10)+",no_area="+rs.getObject(11)
	        				+",discrepant_area="+rs.getObject(12)+"," +
	        				"building_date="+rs.getObject(13);
	        				if(rs.getObject(14)!=null)
	        					update_sql+=",sruver_date="+"to_date('"+rs.getObject(14)+"','YYYY-MM-DD')";
	        				else
	        					update_sql+=",sruver_date=null";
	        				if(rs.getObject(15)!=null)
	        					update_sql+=",surver_enddate="+"to_date('"+rs.getObject(15)+"','YYYY-MM-DD')"+",";
	        				else
	        					update_sql+=",surver_enddate=null,";
	        				update_sql+="building_number='";
	        				if(rs.getObject(16)!=null)
			        			update_sql+=rs.getObject(16);
	        				update_sql+="',building_address='";
	        				if(rs.getObject(17)!=null)
	    			        	update_sql+=rs.getObject(17);
	        				update_sql+="'," +"floor_count="+rs.getInt(18)+",build_struct="+rs.getInt(19)+",house_count="+rs.getInt(20)+"," +
	        				"graphics_code='";
	        				if(rs.getObject(21)!=null)
	    			        	update_sql+=rs.getObject(21);
	        				update_sql+="',graphics_number='";
	        				if(rs.getObject(22)!=null)
	    			        	update_sql+=rs.getObject(22);
	        				update_sql+="'," +"building_mapid="+rs.getInt(23);
	        				if(rs.getObject(24)!=null)
	        					update_sql+=",input_date="+"to_date('"+rs.getObject(24)+"','yyyy-mm-dd hh:mi:ss')"+",";
	        				else
	        					update_sql+=",input_date=null,";
	        				update_sql+="floorup_count="+rs.getInt(25)+",floordown_count="+rs.getInt(26)+"," +
	        				"city_district="+rs.getInt(27)+
	        				" where building_id="+rs.getInt(1);
	        		sb.append(update_sql+"\r\n");
	        		orapstT.executeUpdate(update_sql);		        		
	        	}
	        	if("02".equals(synch_type)){
	        		exe_num++;
	        		//删除数据
	        		String del_sql="delete from T_BUILDING where building_id="+rs.getInt(1);
	        		sb.append(del_sql+"\r\n");
	        		orapstT.execute(del_sql);
	        	}	        	
	        }
	        xaoraResT.end(oraXidT, XAResource.TMSUCCESS);
	       
	        /**删除源数据库中的表数据*/
        	//定义XAResource 
	        xaoraRes = xaoraCn.getXAResource(); 
	        //定义Xid 
	        oraXid = new MyXid(0, new byte[]{0x01}, new byte[]{0x03}); 
	        //执行Oracle
	        xaoraRes.start(oraXid, XAResource.TMNOFLAGS); 		        
	        String delsqls="delete from T_BUILDING where id <= " +num_seq;
	        		//"SYNCH_TIME < to_date('"+deldatestr+"','yyyy-mm-dd hh:mi:ss')";
	        orapst.executeUpdate(delsqls); 
	        sb.append(delsqls+"\r\n");
	        xaoraRes.end(oraXid, XAResource.TMSUCCESS);
	        		        
	        int oraReaT = xaoraResT.prepare(oraXidT); 
	        int oraRea = xaoraRes.prepare(oraXid);
	        if(oraReaT == xaoraResT.XA_OK&&oraRea==xaoraRes.XA_OK){ 
	        	xaoraResT.commit(oraXidT, false); 
	        	xaoraRes.commit(oraXid, false); 
	        	sb.append("Oracle 事务提交成功！T_BUILDIING表同步成功完成！================\r\n"); 
	        }else{
	        	xaoraResT.rollback(oraXidT); 
	        	xaoraRes.rollback(oraXid); 
	        	if(exe_num==0)
		        	sb.append("Oracle 事务回滚成功！T_BUILDIING表没有同步！临时表中的总数据量是："+all_num+"条；符合同步类型的有："+exe_num+"条=========\r\n"); 
	        	else
	        		sb.append("Oracle 事务回滚成功！T_BUILDIING表同步失败！");
	        }
        }catch(Exception e){
        	e.printStackTrace();
        	sb.append("T_BUILDIING表同步异常："+e.getMessage()+"\r\n");
        	try{ 
        		if(xaoraRes!=null)
	            xaoraRes.rollback(oraXid); 
        		if(xaoraResT!=null)
	            xaoraResT.rollback(oraXidT);
	        }catch(Exception e1){ 
	        	sb.append("T_BUILDIING表回滚也出错咯！~"+e1.getMessage()+"\r\n"); 
	            e1.printStackTrace(); 
	        }
        }
		return sb.toString();
	}
	
	/**同步T_HOUSE*/
	private String doSynchHouse(XAResource xaoraResT,XAConnection xaoraCnT,Xid oraXidT,Statement orapstT,
			XAResource xaoraRes,XAConnection xaoraCn,Xid oraXid,Statement orapst){
		StringBuffer sb=new StringBuffer();
		sb.append("T_HOUSE表数据同步开始========================\r\n");
		try{
        	/**查询源数据库的结果集*/
        	String sql="select t.house_id,t.building_id,t.projectsddfile_id,t.floor_id," +
        			"t.fw_address,t.lay_num,t.floor_start,t.floor_end,t.unit_number," +
        			"t.unit_alias,t.room_number,t.room_alias,t.zh,t.fw_layers," +
        			"t.struct,t.tnjz_area,t.ft_area,t.jz_area,t.yt_area,t.sy_area," +
        			"t.design_yt,t.fact_yt,t.fw_cb,t.birth_date,t.fw_dh,t.right_num," +
        			"t.door_type,t.ys_address,t.jc_doornum,t.floor_num,t.floordown_num," +
        			"t.ft_coeff,t.yc_area,t.house_code,t.building_mapid,t.map_id," +
        			"(to_char(t.input_date,'yyyy-mm-dd hh:mi:ss')) input_date," +
        			"t.beforhand_mapping,t.house_stat," +
        			"(to_char(t.die_time,'yyyy-mm-dd hh:mi:ss')) die_time," +
        			"t.room_number_order,t.synch_type,t.id from T_HOUSE t order by synch_time asc";
        	sb.append("T_HOUSE查询语句："+sql+"\r\n");
        	ResultSet rs=orapst.executeQuery(sql);
        	Date deldate=new Date();
        	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        	String deldatestr=sdf.format(deldate);
        	/**组织数据增加到目标数据库中*/
        	//定义XAResource 
	        xaoraResT = xaoraCnT.getXAResource(); 
	        //定义Xid 
	        oraXidT = new MyXid(0, new byte[]{0x01}, new byte[]{0x02}); 
	        sb.append("T_HOUSE开始循环结果集\r\n");
	        int exe_num=0;
	        int all_num=0;
	        int num_seq=0;
	        //执行Oracle
	        xaoraResT.start(oraXidT, XAResource.TMNOFLAGS); 		        
	        while (rs.next()) {
	        	if(rs.getInt(43)>num_seq)
	        		num_seq=rs.getInt(43);
	        	all_num++;
	        	//同步类型：（新增：‘00’；修改：‘01’；删除：‘02’）
	        	String synch_type=rs.getString(42);
	        	if("00".equals(synch_type)){
	        		exe_num++;
	        		String add_sql="insert into T_HOUSE " +
		        			"(house_id,building_id,projectsddfile_id,floor_id," +
		        			"fw_address,lay_num,floor_start,floor_end,unit_number," +
		        			"unit_alias,room_number,room_alias,zh,fw_layers," +
		        			"struct,tnjz_area,ft_area,jz_area,yt_area,sy_area," +
		        			"design_yt,fact_yt,fw_cb,birth_date,fw_dh,right_num," +
		        			"door_type,ys_address,jc_doornum,floor_num,floordown_num," +
		        			"ft_coeff,yc_area,house_code,building_mapid,map_id,input_date," +
		        			"beforhand_mapping,house_stat,die_time,room_number_order) " +
		        			"values ("+rs.getObject(1)+","+rs.getObject(2)+","+rs.getObject(3)+","
		        			+rs.getObject(4)+",'";
		        			if(rs.getObject(5)!=null)
		        				add_sql+=rs.getObject(5);
		        			add_sql+="',"+rs.getObject(6)+","+rs.getObject(7)+","+rs.getObject(8)+",'";
		        			if(rs.getObject(9)!=null)
				        		add_sql+=rs.getObject(9);
		        			add_sql+="','";
		        			if(rs.getObject(10)!=null)
				        		add_sql+=rs.getObject(10);
		        			add_sql+="','";
		        			if(rs.getObject(11)!=null)
				        		add_sql+=rs.getObject(11);
		        			add_sql+="','";
		        			if(rs.getObject(12)!=null)
				        		add_sql+=rs.getObject(12);
		        			add_sql+="','";
		        			if(rs.getObject(13)!=null)
						        add_sql+=rs.getObject(13);
		        			add_sql+="','";
		        			if(rs.getObject(14)!=null)
						        add_sql+=rs.getObject(14);
						    add_sql+="',"+rs.getObject(15)+","+rs.getObject(16)+","+rs.getObject(17)+","
		        			+rs.getObject(18)+","+rs.getObject(19)+","+rs.getObject(20)+","
		        			+rs.getObject(21)+","+rs.getObject(22)+","+rs.getObject(23)+","
		        			+rs.getObject(24)+",'";
		        			if(rs.getObject(25)!=null)
						        add_sql+=rs.getObject(25);
		        			add_sql+="',"+rs.getObject(26)+","
		        			+rs.getObject(27)+",'";
		        			if(rs.getObject(28)!=null)
						        add_sql+=rs.getObject(28);
		        			add_sql+="','";
		        			if(rs.getObject(29)!=null)
						        add_sql+=rs.getObject(29);
		        			add_sql+="',"
		        			+rs.getObject(30)+","+rs.getObject(31)+","+rs.getObject(32)+","
		        			+rs.getObject(33)+",'";
		        			if(rs.getObject(34)!=null)
						        add_sql+=rs.getObject(34);
		        			add_sql+="',"+rs.getObject(35)+","+rs.getObject(36)+",";
		        			if(rs.getObject(37)!=null)
		        				add_sql+="to_date('"+rs.getObject(37)+"','yyyy-mm-dd hh:mi:ss')";
		        			else
		        				add_sql+="null";
		        			add_sql+=","+rs.getObject(38)+","+rs.getObject(39)+",";
		        			if(rs.getObject(40)!=null)
		        				add_sql+="to_date('"+rs.getObject(40)+"','yyyy-mm-dd hh:mi:ss')";
		        			else
		        				add_sql+="null";
		        			add_sql+=","+rs.getObject(41)+")";
		        	sb.append(add_sql+"\r\n");
	        		orapstT.execute(add_sql);
	        	}
	        	if("01".equals(synch_type)){
	        		exe_num++;
	        		//修改数据
	        		String update_sql="update T_HOUSE set " +
	        				"building_id="+rs.getObject(2)+",projectsddfile_id="+rs.getObject(3)+"," +
	        				"floor_id="+rs.getObject(4)+",fw_address='";
	        				if(rs.getObject(5)!=null)
	        					update_sql+=rs.getObject(5);
	        				update_sql+="',lay_num=";
	        				if(rs.getObject(6)!=null)
	        					update_sql+=rs.getObject(6);
	        				update_sql+=",floor_start="+rs.getObject(7)+",floor_end="+rs.getObject(8)+",unit_number='";
	        				if(rs.getObject(9)!=null)
	        					update_sql+=rs.getObject(9);
	        				update_sql+="',unit_alias='";
	        				if(rs.getObject(10)!=null)
	        					update_sql+=rs.getObject(10);
	        				update_sql+="',room_number='";
	        				if(rs.getObject(11)!=null)
	        					update_sql+=rs.getObject(11);
	        				update_sql+="',room_alias='";
	        				if(rs.getObject(12)!=null)
	        					update_sql+=rs.getObject(12);
	        				update_sql+="',zh='";
	        				if(rs.getObject(13)!=null)
	        					update_sql+=rs.getObject(13);
	        				update_sql+="',fw_layers='";
	        				if(rs.getObject(14)!=null)
	        					update_sql+=rs.getObject(14);
	        				update_sql+="',struct="+rs.getObject(15)+
	        				",tnjz_area="+rs.getObject(16)+",ft_area="+rs.getObject(17)+
	        				",jz_area="+rs.getObject(18)+",yt_area="+rs.getObject(18)+
	        				",sy_area="+rs.getObject(20)+",design_yt="+rs.getObject(21)+
	        				",fact_yt="+rs.getObject(22)+",fw_cb="+rs.getObject(23)+
	        				",birth_date="+rs.getObject(24)+",fw_dh='";
	        				if(rs.getObject(25)!=null)
	        					update_sql+=rs.getObject(25);
	        				update_sql+="',right_num="+rs.getObject(26)+",door_type="+rs.getObject(27);
	        				update_sql+=",ys_address='";
	        				if(rs.getObject(28)!=null)
	        					update_sql+=rs.getObject(28);
	        				update_sql+="',jc_doornum='";
	        				if(rs.getObject(29)!=null)
	        					update_sql+=rs.getObject(29);
	        				update_sql+="',floor_num="+rs.getObject(30)+",floordown_num="+rs.getObject(31)+
	        				",ft_coeff="+rs.getObject(32)+",yc_area="+rs.getObject(33)+
	        				",house_code='";
	        				if(rs.getObject(34)!=null)
	        					update_sql+=rs.getObject(34);
	        				update_sql+="',building_mapid="+rs.getObject(35)+
	        				",map_id="+rs.getObject(36)+",input_date=";
	        				if(rs.getObject(37)!=null)
	        					update_sql+="to_date('"+rs.getObject(37)+"','yyyy-mm-dd hh:mi:ss')";
		        			else
		        				update_sql+="null";
	        				update_sql+=",beforhand_mapping="+rs.getObject(38)+",house_stat="+
	        				rs.getObject(39)+",die_time=";
	        				if(rs.getObject(40)!=null)
	        					update_sql+="to_date('"+rs.getObject(40)+"','yyyy-mm-dd hh:mi:ss')";
		        			else
		        				update_sql+="null";
	        				update_sql+=",room_number_order="+rs.getObject(41) +
	        				" where house_id="+rs.getInt(1);
	        		sb.append(update_sql+"\r\n");
	        		orapstT.executeUpdate(update_sql);		        		
	        	}
	        	if("02".equals(synch_type)){
	        		exe_num++;
	        		//删除数据
	        		String del_sql="delete from T_HOUSE where house_id="+rs.getInt(1);
	        		sb.append(del_sql+"\r\n");
	        		orapstT.execute(del_sql);
	        	}	        	
	        }
	        xaoraResT.end(oraXidT, XAResource.TMSUCCESS);
	       
	        /**删除源数据库中的表数据*/
        	//定义XAResource 
	        xaoraRes = xaoraCn.getXAResource(); 
	        //定义Xid 
	        oraXid = new MyXid(0, new byte[]{0x01}, new byte[]{0x03}); 
	        //执行Oracle
	        xaoraRes.start(oraXid, XAResource.TMNOFLAGS); 		        
	        String delsqls="delete from T_HOUSE where id <= " +num_seq;
//	        		"SYNCH_TIME < to_date('"+deldatestr+"','yyyy-mm-dd hh:mi:ss')";
	        orapst.executeUpdate(delsqls); 
	        sb.append(delsqls+"\r\n");
	        xaoraRes.end(oraXid, XAResource.TMSUCCESS);
	        		        
	        int oraReaT = xaoraResT.prepare(oraXidT); 
	        int oraRea = xaoraRes.prepare(oraXid);
	        if(oraReaT == xaoraResT.XA_OK&&oraRea==xaoraRes.XA_OK){ 
	        	xaoraResT.commit(oraXidT, false); 
	        	xaoraRes.commit(oraXid, false); 
	        	sb.append("Oracle 事务提交成功！T_HOUSE表同步成功完成！================\r\n"); 
	        }else{
	        	xaoraResT.rollback(oraXidT); 
	        	xaoraRes.rollback(oraXid); 
	        	if(exe_num==0)
		        	sb.append("Oracle 事务回滚成功！T_HOUSE表没有同步！临时表中的总数据量是："+all_num+"条；符合同步类型的有："+exe_num+"条=========\r\n"); 
	        	else
	        		sb.append("Oracle 事务回滚成功！T_HOUSE表同步失败！");
	        }
        }catch(Exception e){
        	e.printStackTrace();
        	sb.append("T_HOUSE表同步异常："+e.getMessage()+"\r\n");
        	try{ 
        		if(xaoraRes!=null)
	            xaoraRes.rollback(oraXid); 
        		if(xaoraResT!=null)
	            xaoraResT.rollback(oraXidT);
	        }catch(Exception e1){ 
	        	sb.append("T_HOUSE表回滚也出错咯！~"+e1.getMessage()+"\r\n"); 
	            e1.printStackTrace(); 
	        }
        }
		return sb.toString();
	}
	

	/**同步T_FLOOR表*/
	private String doSynchFloor(XAResource xaoraResT,XAConnection xaoraCnT,Xid oraXidT,Statement orapstT,
			XAResource xaoraRes,XAConnection xaoraCn,Xid oraXid,Statement orapst){
		StringBuffer sb=new StringBuffer();
		sb.append("T_FLOOR表数据同步开始========================\r\n");
		try{
			/**查询源数据库的结果集*/
        	String sql="select t.floor_id,t.projectsddfile_id,t.building_id,t.floor_number," +
        			"t.basic_layer,t.layer_name_cn,t.synch_type,t.id from T_FLOOR t order by synch_time asc";
        	sb.append("T_FLOOR查询语句："+sql+"\r\n");
        	ResultSet rs=orapst.executeQuery(sql);
        	Date deldate=new Date();
        	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        	String deldatestr=sdf.format(deldate);
        	/**组织数据增加到目标数据库中*/
        	//定义XAResource 
	        xaoraResT = xaoraCnT.getXAResource(); 
	        //定义Xid 
	        oraXidT = new MyXid(0, new byte[]{0x01}, new byte[]{0x02}); 
	        sb.append("T_FLOOR开始循环结果集\r\n");
	        int exe_num=0;
	        int all_num=0;
	        int num_seq=0;
	        //执行Oracle
	        xaoraResT.start(oraXidT, XAResource.TMNOFLAGS); 		        
	        while (rs.next()) {
	        	if(rs.getInt(8)>num_seq)
	        		num_seq=rs.getInt(8);
	        	all_num++;
	        	//同步类型：（新增：‘00’；修改：‘01’；删除：‘02’）
	        	String synch_type=rs.getString(7);
	        	if("00".equals(synch_type)){
	        		exe_num++;
	        		String add_sql="insert into T_FLOOR " +
	        				"(floor_id,projectsddfile_id,building_id," +
	        				"floor_number,basic_layer,layer_name_cn)" +
		        			"values ("+rs.getInt(1)+","+rs.getInt(2)+",'"+rs.getString(3)+"'," +
		        					rs.getInt(4)+","+rs.getInt(5)+",'";
			        		if(rs.getObject(6)!=null)
			        			add_sql+=rs.getObject(6);
		        			add_sql+="')";
		        	sb.append(add_sql+"\r\n");
	        		orapstT.execute(add_sql);
	        	}
	        	if("01".equals(synch_type)){
	        		exe_num++;
	        		//修改数据
	        		String update_sql="update T_FLOOR set " +
	        				"projectsddfile_id="+rs.getObject(2)+",building_id="+rs.getObject(3)
	        				+",floor_number="+rs.getObject(4)+",basic_layer="+rs.getObject(5)+"," +
	        				"layer_name_cn='";
			        		if(rs.getObject(6)!=null)
			        			update_sql+=rs.getObject(6);
			        		update_sql+="' where floor_id="+rs.getInt(1);
	        		sb.append(update_sql+"\r\n");
	        		orapstT.executeUpdate(update_sql);		        		
	        	}
	        	if("02".equals(synch_type)){
	        		exe_num++;
	        		//删除数据
	        		String del_sql="delete from T_FLOOR where floor_id="+rs.getInt(1);
	        		sb.append(del_sql+"\r\n");
	        		orapstT.execute(del_sql);
	        	}	        	
	        }
	        xaoraResT.end(oraXidT, XAResource.TMSUCCESS);
	       
	        /**删除源数据库中的表数据*/
        	//定义XAResource 
	        xaoraRes = xaoraCn.getXAResource(); 
	        //定义Xid 
	        oraXid = new MyXid(0, new byte[]{0x01}, new byte[]{0x03}); 
	        //执行Oracle
	        xaoraRes.start(oraXid, XAResource.TMNOFLAGS); 		        
	        String delsqls="delete from T_FLOOR where id <= " +num_seq;
//	        		"SYNCH_TIME < to_date('"+deldatestr+"','yyyy-mm-dd hh:mi:ss')";
	        orapst.executeUpdate(delsqls); 
	        sb.append(delsqls+"\r\n");
	        xaoraRes.end(oraXid, XAResource.TMSUCCESS);
	        		        
	        int oraReaT = xaoraResT.prepare(oraXidT); 
	        int oraRea = xaoraRes.prepare(oraXid);
	        if(oraReaT == xaoraResT.XA_OK&&oraRea==xaoraRes.XA_OK){ 
	        	xaoraResT.commit(oraXidT, false); 
	        	xaoraRes.commit(oraXid, false); 
	        	sb.append("Oracle 事务提交成功！T_FLOOR表同步成功完成！================\r\n"); 
	        }else{
	        	xaoraResT.rollback(oraXidT); 
	        	xaoraRes.rollback(oraXid); 
	        	if(exe_num==0)
		        	sb.append("Oracle 事务回滚成功！T_FLOOR表没有同步！临时表中的总数据量是："+all_num+"条；符合同步类型的有："+exe_num+"条=========\r\n"); 
	        	else
	        		sb.append("Oracle 事务回滚成功！T_FLOOR表同步失败！");
	        }
        }catch(Exception e){
        	e.printStackTrace();
        	sb.append("T_FLOOR表同步异常："+e.getMessage()+"\r\n");
        	try{ 
        		if(xaoraRes!=null)
	            xaoraRes.rollback(oraXid); 
        		if(xaoraResT!=null)
	            xaoraResT.rollback(oraXidT);
	        }catch(Exception e1){ 
	        	sb.append("T_FLOOR表回滚也出错咯！~"+e1.getMessage()+"\r\n"); 
	            e1.printStackTrace(); 
	        }
        }
		return sb.toString();
	}
	
	/**同步T_PROJECTSDDFILE表*/
	private String doSynchProjectsddfile(String s_url,String s_name,String s_pass,String t_url,String t_name,String t_pass){
		StringBuffer sb=new StringBuffer();
		sb.append("T_PROJECTSDDFILE表数据同步开始========================\r\n");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");	
		Connection  oraCn=null;
		Connection  oraCn1=null;
		try{
			oraCn = getOracleConn(s_url,s_name,s_pass);
			Statement orapst = oraCn.createStatement();
			/**查询源数据库的结果集*/
        	String sql="select t.projectsddfile_id,t.surverproject_id,t.projectsddfile_file," +
        			"(to_char(t.projectsddfile_createdate,'yyyy-mm-dd hh:mi:ss')) projectsddfile_createdate," +
        			"(to_char(t.projectsddfile_uploaddate,'yyyy-mm-dd hh:mi:ss')) projectsddfile_uploaddate," +
        			"t.projectsddfile_desc,t.synch_type,t.id from T_PROJECTSDDFILE t order by synch_time asc";
        	sb.append("T_PROJECTSDDFILE查询语句："+sql+"\r\n");
        	ResultSet rs=orapst.executeQuery(sql); 
        	int exe_num=0;
 	        int all_num=0;
			while (rs.next()) {
				all_num++;
				int id=rs.getInt(8);
				Connection oraCnT = getOracleConnT(t_url,t_name,t_pass); 
				Statement orapstT = oraCnT.createStatement();
				String synch_type=rs.getString(7);
				try{
		        	if("00".equals(synch_type)){
		        		/**先判断是否存在，如果存在，continue*/
		        		String selsql="select projectsddfile_id from T_PROJECTSDDFILE where projectsddfile_id="+rs.getInt(1);
		        		sb.append("增加之前先判断数据库中是否存在该记录了："+selsql+"\r\n");
		        		ResultSet rs2=orapstT.executeQuery(selsql);
		        		if(rs2.next()){
		        			oraCnT.close();
		        			sb.append("数据库中已经存在该记录了，跳过执行下一条\r\n");
		        			continue;
		        		}
		        		exe_num++;
		        		oraCnT.setAutoCommit(false);
						String addsql = "insert into T_PROJECTSDDFILE " +
			    				"(projectsddfile_id,surverproject_id,projectsddfile_file," +
			    				"projectsddfile_createdate,projectsddfile_uploaddate," +
			    				"projectsddfile_desc) values ("+rs.getInt(1)+","+rs.getInt(2)
			    				+",empty_blob(),";
			    		if(rs.getObject(4)!=null)
			    			addsql+="to_date('"+rs.getObject(4)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							addsql+="null,";
			    		if(rs.getObject(5)!=null)
			    			addsql+="to_date('"+rs.getObject(5)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							addsql+="null,";
			    		addsql+="'"+rs.getString(6)+"')"; 
			        	orapstT.execute(addsql);
			        	sb.append(addsql+"\r\n");
			    		java.sql.Blob blob = rs.getBlob(3);
			            InputStream inStream = blob.getBinaryStream();
			          //data是读出并需要返回的数据，类型是byte[]
			            byte[] data = new byte[(int)blob.length() ];
			            inStream.read(data);
			            inStream.close();
			            String sqlString="select projectsddfile_file " +
			    				"from T_PROJECTSDDFILE where projectsddfile_id="+rs.getInt(1)+" for update";
			            Statement statement=oraCnT.createStatement();
			            ResultSet rs1=statement.executeQuery(sqlString);
			            if (rs1.next()){
			            	oracle.sql.BLOB blob1 = (oracle.sql.BLOB) rs1.getBlob(1);
				       		OutputStream outStream = blob1.getBinaryOutputStream();
				       		//data是传入的byte数组，定义：byte[] data
				       		outStream.write(data, 0, data.length);
				       		outStream.flush();
				       		outStream.close();	
			            }
		        	}
		        	if("01".equals(synch_type)){
		        		exe_num++;
		        		Statement orapstT1 = oraCnT.createStatement();
		        		String update_sql="update T_PROJECTSDDFILE set " +
		        				"surverproject_id="+rs.getObject(2);
		        		if(rs.getObject(4)!=null)
		        			update_sql+=",projectsddfile_createdate=to_date('"+rs.getObject(4)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							update_sql+=",projectsddfile_createdate=null,";
		        		if(rs.getObject(5)!=null)
		        			update_sql+="projectsddfile_uploaddate=to_date('"+rs.getObject(5)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							update_sql+="projectsddfile_uploaddate=null,";
		        		update_sql+="projectsddfile_desc='"+rs.getObject(6)+"' where projectsddfile_id="+rs.getInt(1);
		        		sb.append(update_sql+"\r\n");
		            	orapstT1.execute(update_sql);
		        		java.sql.Blob blob = rs.getBlob(3);
		                InputStream inStream = blob.getBinaryStream();
		              //data是读出并需要返回的数据，类型是byte[]
		                byte[] data = new byte[(int)blob.length() ];
		                inStream.read(data);
		                inStream.close();
		                String sqlString="select projectsddfile_file " +
		        				"from T_PROJECTSDDFILE where projectsddfile_id="+rs.getInt(1)+" for update";
		                Statement statement=oraCnT.createStatement();
		                ResultSet rs1=statement.executeQuery(sqlString);
		                if (rs1.next()){
		                	oracle.sql.BLOB blob1 = (oracle.sql.BLOB) rs1.getBlob(1);
				       		OutputStream outStream = blob1.getBinaryOutputStream();
				       		//data是传入的byte数组，定义：byte[] data
				       		outStream.write(data, 0, data.length);
				       		outStream.flush();
				       		outStream.close();	
		                } 
		        	}
		        	if("02".equals(synch_type)){
		        		exe_num++;
		        		String del_sql="delete from T_PROJECTSDDFILE where projectsddfile_id="+rs.getInt(1);
		        		Statement orapstT1 = oraCnT.createStatement();
		        		orapstT1.execute(del_sql);
		        		sb.append(del_sql+"\r\n");
		        	}
		        	oraCnT.commit();
	                oraCnT.close();	
				}catch(Exception e1){
					oraCnT.close();	
					sb.append("T_PROJECTSDDFILE表同步异常"+e1.getMessage()+"=======发生异常的projectsddfile_id="+id+"\r\n");
					continue;
				}
                oraCn1=getOracleConn(s_url,s_name,s_pass);
    			Statement orapst2 = oraCn.createStatement();
    			//删除临时表的数据
    			String delsql="delete from T_PROJECTSDDFILE where id="+id;
//    			String delsql="update T_PROJECTSDDFILE set SYNCH_TYPE='4' where id="+id;
    			orapst2.execute(delsql);
    			sb.append("删除临时表中的数据："+delsql+"\r\n");
			}
			sb.append("！T_PROJECTSDDFILE表同步成功,临时表中的总数据量是："+all_num+"条；符合同步类型的有："+exe_num+"条=========\r\n");
		}catch(Exception e){
			sb.append("T_PROJECTSDDFILE表同步异常"+e.getMessage()+"\r\n");
			e.printStackTrace();
		}finally{
			try {
				oraCn.close();
				if(oraCn1!=null)
					oraCn1.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		return sb.toString();
	}
	
	/**同步T_SURVERBASIC表*/
	private String doSynchSurverBasic(String s_url,String s_name,String s_pass,String t_url,String t_name,String t_pass){
		StringBuffer sb=new StringBuffer();
		sb.append("T_SURVERBASIC表数据同步开始========================\r\n");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");	
		Connection  oraCn=null;
		Connection  oraCn1=null;
		try{
			oraCn = getOracleConn(s_url,s_name,s_pass);
			Statement orapst = oraCn.createStatement();
			/**查询源数据库的结果集*/      	
        	String sql="select t.surverbasic_id,t.surverproinst_id,t.surverbasic_name,t.surver_type," +
					"(to_char(t.surverbasic_createdate,'yyyy-mm-dd hh:mi:ss')) as surverbasic_createdate," +
					"(to_char(t.surverbasic_enddate,'yyyy-mm-dd hh:mi:ss')) as surverbasic_enddate," +
					"t.entrust_unit,t.linkman,t.linkman_tel,t.surverbasic_address,t.surverbasic_desc," +
					"t.city_district,t.surverarea_value,t.basicproduct_filename,t.basicproduct_file" +
					",t.synch_type,t.id from T_SURVERBASIC t order by synch_time asc";
        	sb.append("T_SURVERBASIC查询语句："+sql+"\r\n");
        	ResultSet rs=orapst.executeQuery(sql); 
        	int exe_num=0;
 	        int all_num=0;
			while (rs.next()) {
				all_num++;
				int id=rs.getInt(17);
				Connection oraCnT = getOracleConnT(t_url,t_name,t_pass); 
				Statement orapstT = oraCnT.createStatement();
				String synch_type=rs.getString(7);
				try{
		        	if("00".equals(synch_type)){
		        		/**先判断是否存在，如果存在，continue*/
		        		String selsql="select surverbasic_id from T_SURVERBASIC where T_SURVERBASIC="+rs.getInt(1);
		        		sb.append("增加之前先判断数据库中是否存在该记录了："+selsql+"\r\n");
		        		ResultSet rs2=orapstT.executeQuery(selsql);
		        		if(rs2.next()){
		        			oraCnT.close();
		        			sb.append("数据库中已经存在该记录了，跳过执行下一条\r\n");
		        			continue;
		        		}
		        		exe_num++;
		        		oraCnT.setAutoCommit(false);
						String addsql = "insert into T_SURVERBASIC " +
								"(surverbasic_id,surverproinst_id,surverbasic_name,surver_type,surverbasic_createdate," +
								"surverbasic_enddate,entrust_unit,linkman,linkman_tel,surverbasic_address," +
								"surverbasic_desc,city_district,surverarea_value,basicproduct_filename,basicproduct_file)" +
								" values ("+rs.getInt(1)+","+rs.getInt(2)+",'"+rs.getString(3)+"',"+rs.getInt(4)+",";
							if(rs.getObject(5)!=null)
			    			addsql+="to_date('"+rs.getObject(5)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							addsql+="null,";
			    		if(rs.getObject(6)!=null)
			    			addsql+="to_date('"+rs.getObject(6)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							addsql+="null,";
			    		addsql+="'"+rs.getString(7)+"','"+rs.getString(8)+"','"+rs.getString(9)
			    				+"','"+rs.getString(10)+"','"+rs.getString(11)+"','"+rs.getString(12)+"',"
			    				+rs.getObject(13)+",'"+rs.getString(14)+"',empty_blob())"; 
			        	orapstT.execute(addsql);
			        	sb.append(addsql+"\r\n");
			    		java.sql.Blob blob = rs.getBlob(15);
			            InputStream inStream = blob.getBinaryStream();
			          //data是读出并需要返回的数据，类型是byte[]
			            byte[] data = new byte[(int)blob.length() ];
			            inStream.read(data);
			            inStream.close();
			            String sqlString="select basicproduct_file " +
			    				"from T_SURVERBASIC where surverbasic_id="+rs.getInt(1)+" for update";
			            Statement statement=oraCnT.createStatement();
			            ResultSet rs1=statement.executeQuery(sqlString);
			            if (rs1.next()){
			            	oracle.sql.BLOB blob1 = (oracle.sql.BLOB) rs1.getBlob(1);
				       		OutputStream outStream = blob1.getBinaryOutputStream();
				       		//data是传入的byte数组，定义：byte[] data
				       		outStream.write(data, 0, data.length);
				       		outStream.flush();
				       		outStream.close();	
			            }
		        	}
		        	if("01".equals(synch_type)){
		        		exe_num++;
		        		Statement orapstT1 = oraCnT.createStatement();
		        		String update_sql="update T_SURVERBASIC set " +
		        				"surverproinst_id="+rs.getObject(2)+",surverbasic_name='"+rs.getString(3)+"',surver_type="+rs.getInt(4);
		        		if(rs.getObject(5)!=null)
		        			update_sql+=",surverbasic_createdate=to_date('"+rs.getObject(4)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							update_sql+=",surverbasic_createdate=null,";
		        		if(rs.getObject(6)!=null)
		        			update_sql+="surverbasic_enddate=to_date('"+rs.getObject(5)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							update_sql+="surverbasic_enddate=null,";
		        		update_sql+="entrust_unit='"+rs.getObject(7)+"',linkman='"+rs.getObject(8)+"'" +
		        				",linkman_tel='"+rs.getObject(9)+"'"+
		        				",surverbasic_address='"+rs.getObject(10)+"'"+
		        				",surverbasic_desc='"+rs.getObject(11)+"'"+
		        				",city_district='"+rs.getObject(12)+"'"+
		        				",surverarea_value="+rs.getObject(13)+
		        				",basicproduct_filename='"+rs.getObject(14)+"'"+
		        				" where surverbasic_id="+rs.getInt(1);
		        		sb.append(update_sql+"\r\n");
		            	orapstT1.execute(update_sql);
		        		java.sql.Blob blob = rs.getBlob(15);
		                InputStream inStream = blob.getBinaryStream();
		              //data是读出并需要返回的数据，类型是byte[]
		                byte[] data = new byte[(int)blob.length() ];
		                inStream.read(data);
		                inStream.close();
		                String sqlString="select basicproduct_file " +
		        				"from T_SURVERBASIC where surverbasic_id="+rs.getInt(1)+" for update";
		                Statement statement=oraCnT.createStatement();
		                ResultSet rs1=statement.executeQuery(sqlString);
		                if (rs1.next()){
		                	oracle.sql.BLOB blob1 = (oracle.sql.BLOB) rs1.getBlob(1);
				       		OutputStream outStream = blob1.getBinaryOutputStream();
				       		//data是传入的byte数组，定义：byte[] data
				       		outStream.write(data, 0, data.length);
				       		outStream.flush();
				       		outStream.close();	
		                } 
		        	}
		        	if("02".equals(synch_type)){
		        		exe_num++;
		        		String del_sql="delete from T_SURVERBASIC where surverbasic_id="+rs.getInt(1);
		        		Statement orapstT1 = oraCnT.createStatement();
		        		orapstT1.execute(del_sql);
		        		sb.append(del_sql+"\r\n");
		        	}
		        	oraCnT.commit();
	                oraCnT.close();	
				}catch(Exception e1){
					oraCnT.close();	
					sb.append("T_SURVERBASIC表同步异常"+e1.getMessage()+"=======发生异常的surverbasic_id="+id+"\r\n");
					continue;
				}
                oraCn1=getOracleConn(s_url,s_name,s_pass);
    			Statement orapst2 = oraCn.createStatement();
    			//删除临时表的数据
    			String delsql="delete from T_SURVERBASIC where id="+id;
//    			String delsql="update T_PROJECTSDDFILE set SYNCH_TYPE='4' where id="+id;
    			orapst2.execute(delsql);
    			sb.append("删除临时表中的数据："+delsql+"\r\n");
			}
			sb.append("！T_SURVERBASIC表同步成功,临时表中的总数据量是："+all_num+"条；符合同步类型的有："+exe_num+"条=========\r\n");
		}catch(Exception e){
			sb.append("T_SURVERBASIC表同步异常"+e.getMessage()+"\r\n");
			e.printStackTrace();
		}finally{
			try {
				oraCn.close();
				if(oraCn1!=null)
					oraCn1.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		return sb.toString();
	}
	
	/**同步T_SURVERPROJECT表*/
	private String doSynchSurverProject(String s_url,String s_name,String s_pass,String t_url,String t_name,String t_pass){
		StringBuffer sb=new StringBuffer();
		sb.append("T_SURVERPROJECT表数据同步开始========================\r\n");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");	
		Connection  oraCn=null;
		Connection  oraCn1=null;
		try{
			oraCn = getOracleConn(s_url,s_name,s_pass);
			Statement orapst = oraCn.createStatement();
			/**查询源数据库的结果集*/      	
        	String sql="select  t.surverproject_id,t.surverproinst_id,t.surverproject_name,"+
					"(to_char(t.surverproject_createdate,'yyyy-mm-dd hh:mi:ss')) as surverproject_createdate,"+
					"(to_char(t.surverproject_enddate,'yyyy-mm-dd hh:mi:ss')) as surverproject_enddate,"+
					"t.entrust_unit,t.linkman,t.linkman_tel,t.surver_type,t.surverproject_desc,"+
					"t.graphics_code,t.survey_purpose,t.projectfile_filename,t.projectfile_fileblob," +
					"t.projectsddfile_id,t.synch_type,t.id from T_SURVERPROJECT t order by synch_time asc";
        	sb.append("T_SURVERPROJECT查询语句："+sql+"\r\n");
        	ResultSet rs=orapst.executeQuery(sql); 
        	int exe_num=0;
 	        int all_num=0;
			while (rs.next()) {
				all_num++;
				int id=rs.getInt(17);
				Connection oraCnT = getOracleConnT(t_url,t_name,t_pass); 
				Statement orapstT = oraCnT.createStatement();
				String synch_type=rs.getString(7);
				try{
		        	if("00".equals(synch_type)){
		        		/**先判断是否存在，如果存在，continue*/
		        		String selsql="select surverproject_id from T_SURVERPROJECT where surverproject_id="+rs.getInt(1);
		        		sb.append("增加之前先判断数据库中是否存在该记录了："+selsql+"\r\n");
		        		ResultSet rs2=orapstT.executeQuery(selsql);
		        		if(rs2.next()){
		        			oraCnT.close();
		        			sb.append("数据库中已经存在该记录了，跳过执行下一条\r\n");
		        			continue;
		        		}
		        		exe_num++;
		        		oraCnT.setAutoCommit(false);
						String addsql = "insert into T_SURVERPROJECT " +
								"(surverproject_id,surverproinst_id,surverproject_name,surverproject_createdate," +
								"surverproject_enddate,entrust_unit,linkman,linkman_tel,surver_type,surverproject_desc," +
								"graphics_code,survey_purpose,projectfile_filename,projectfile_fileblob,projectsddfile_id )" +
								" values ("+rs.getInt(1)+","+rs.getInt(2)+",'"+rs.getString(3)+"',";
						if(rs.getObject(4)!=null)
			    			addsql+="to_date('"+rs.getObject(5)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							addsql+="null,";
			    		if(rs.getObject(5)!=null)
			    			addsql+="to_date('"+rs.getObject(5)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							addsql+="null,";
			    		addsql+="'"+rs.getString(6)+"','"+rs.getString(7)+"','"+rs.getString(8)+"',"+rs.getInt(9)
			    				+",'"+rs.getString(10)+"','"+rs.getString(11)+"','"+rs.getString(12)+"','"
			    				+rs.getString(13)+"',empty_blob(),"+rs.getInt(15)+")"; 
			        	orapstT.execute(addsql);
			        	sb.append(addsql+"\r\n");
			    		java.sql.Blob blob = rs.getBlob(14);
			            InputStream inStream = blob.getBinaryStream();
			          //data是读出并需要返回的数据，类型是byte[]
			            byte[] data = new byte[(int)blob.length() ];
			            inStream.read(data);
			            inStream.close();
			            String sqlString="select projectfile_fileblob " +
			    				"from T_SURVERPROJECT where surverproject_id="+rs.getInt(1)+" for update";
			            Statement statement=oraCnT.createStatement();
			            ResultSet rs1=statement.executeQuery(sqlString);
			            if (rs1.next()){
			            	oracle.sql.BLOB blob1 = (oracle.sql.BLOB) rs1.getBlob(1);
				       		OutputStream outStream = blob1.getBinaryOutputStream();
				       		//data是传入的byte数组，定义：byte[] data
				       		outStream.write(data, 0, data.length);
				       		outStream.flush();
				       		outStream.close();	
			            }
		        	}
		        	if("01".equals(synch_type)){
		        		exe_num++;
		        		Statement orapstT1 = oraCnT.createStatement();
		        		String update_sql="update T_SURVERPROJECT set " +
		        				"surverproinst_id="+rs.getObject(2)+",surverproject_name='"+rs.getString(3)+"'";
		        		if(rs.getObject(4)!=null)
		        			update_sql+=",surverproject_createdate=to_date('"+rs.getObject(4)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							update_sql+=",surverproject_createdate=null,";
		        		if(rs.getObject(5)!=null)
		        			update_sql+="surverproject_enddate=to_date('"+rs.getObject(5)+"','yyyy-mm-dd hh:mi:ss'),";
						else
							update_sql+="surverproject_enddate=null,";
		        		update_sql+="entrust_unit='"+rs.getObject(6)+"',linkman='"+rs.getObject(7)+"'" +
		        				",linkman_tel='"+rs.getObject(8)+"'"+
		        				",surver_type="+rs.getInt(9)+
		        				",surverproject_desc='"+rs.getObject(10)+"'"+
		        				",graphics_code='"+rs.getObject(11)+"'"+
		        				",survey_purpose='"+rs.getObject(12)+"'"+
		        				",projectfile_filename='"+rs.getObject(13)+"'"+
		        				",projectsddfile_id="+rs.getObject(15)+
		        				" where surverproject_id="+rs.getInt(1);
		        		sb.append(update_sql+"\r\n");
		            	orapstT1.execute(update_sql);
		        		java.sql.Blob blob = rs.getBlob(14);
		                InputStream inStream = blob.getBinaryStream();
		              //data是读出并需要返回的数据，类型是byte[]
		                byte[] data = new byte[(int)blob.length() ];
		                inStream.read(data);
		                inStream.close();
		                String sqlString="select projectfile_fileblob " +
		        				"from T_SURVERPROJECT where surverproject_id="+rs.getInt(1)+" for update";
		                Statement statement=oraCnT.createStatement();
		                ResultSet rs1=statement.executeQuery(sqlString);
		                if (rs1.next()){
		                	oracle.sql.BLOB blob1 = (oracle.sql.BLOB) rs1.getBlob(1);
				       		OutputStream outStream = blob1.getBinaryOutputStream();
				       		//data是传入的byte数组，定义：byte[] data
				       		outStream.write(data, 0, data.length);
				       		outStream.flush();
				       		outStream.close();	
		                } 
		        	}
		        	if("02".equals(synch_type)){
		        		exe_num++;
		        		String del_sql="delete from T_SURVERPROJECT where surverproject_id="+rs.getInt(1);
		        		Statement orapstT1 = oraCnT.createStatement();
		        		orapstT1.execute(del_sql);
		        		sb.append(del_sql+"\r\n");
		        	}
		        	oraCnT.commit();
	                oraCnT.close();	
				}catch(Exception e1){
					oraCnT.close();	
					sb.append("T_SURVERPROJECT表同步异常"+e1.getMessage()+"=======发生异常的surverproject_id="+id+"\r\n");
					continue;
				}
                oraCn1=getOracleConn(s_url,s_name,s_pass);
    			Statement orapst2 = oraCn.createStatement();
    			//删除临时表的数据
    			String delsql="delete from T_SURVERPROJECT where id="+id;
//    			String delsql="update T_PROJECTSDDFILE set SYNCH_TYPE='4' where id="+id;
    			orapst2.execute(delsql);
    			sb.append("删除临时表中的数据："+delsql+"\r\n");
			}
			sb.append("！T_SURVERPROJECT表同步成功,临时表中的总数据量是："+all_num+"条；符合同步类型的有："+exe_num+"条=========\r\n");
		}catch(Exception e){
			sb.append("T_SURVERPROJECT表同步异常"+e.getMessage()+"\r\n");
			e.printStackTrace();
		}finally{
			try {
				oraCn.close();
				if(oraCn1!=null)
					oraCn1.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		return sb.toString();
	}
	
	private static Connection getOracleConn(String url,String username,String password) {
        String driver = "oracle.jdbc.driver.OracleDriver";
//        String url = "jdbc:oracle:thin:@192.168.0.11:1521:ORCL";// 设置连接字符串
//        String username = "jnsurver_synch";//用户名
//        String password = "jnsurver_synch";//密码
        Connection conn = null; //创建数据库连接对象
        try {
            Class.forName(driver);
            conn = DriverManager.getConnection(url, username, password);
        }
        catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        return conn;
    }
	
	private static Connection getOracleConnT(String url,String username,String password) {
        String driver = "oracle.jdbc.driver.OracleDriver";
//        String url = "jdbc:oracle:thin:@192.168.0.12:1521:ORCL";// 设置连接字符串
//        String username = "fcchsys";//用户名
//        String password = "fcchsys";//密码
        Connection conn = null; //创建数据库连接对象
        try {
            Class.forName(driver);
            conn = DriverManager.getConnection(url, username, password);
        }
        catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        return conn;
    }
}
