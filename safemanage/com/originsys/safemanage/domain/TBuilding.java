package com.originsys.safemanage.domain;
import java.io.Serializable;
import java.util.Date;

import com.originsys.eap.domain.EapDomain;
/**楼幢基本信息*/
public class TBuilding extends EapDomain{
	/**楼幢编号图斑编号sm_id*/
	private String building_id;
	/**楼幢坐落*/
	private String building_address;
	/**楼幢号*/
	private Integer building_number;
	/**所属区域*/
	private String builiding_region;
	/**层数*/
	private Integer floor_count;
	/**户数*/
	private Integer house_count;
	/**地上层数*/
	private Integer floorup_count;
	/**地下层数*/
	private Integer floordown_count;
	/**建筑面积*/
	private Float build_area;
	/**房屋产别*/
	private String real_type;
	/**设计用途*/
	private String use_desgin;
	/**建成时间*/
	private Integer building_date;
	/**房屋与结构*/
	private String build_struct;
	/**所在楼盘内码初始化进来*/
	private Integer building_mapid;
	/**健康等级-普查@1-a级&2-b级&3-c级&4-d级*/
	private String health_grade_pc;
	/***/
	private String dangerous_type_pc;
	/**健康等级-鉴定@1-a级&2-b级&3-c级&4-d级*/
	private String health_grade_jd;
	/***/
	private String dangerous_type_jd;
	/***/
	private String is_die;
	/***/
	private String fw_type;
	/**使用功能@1-住宅&2-综合楼&3-办公&4-商业&5-学校用房&6-医院用房&7-工业用房&8-其它*/
	private String usefunction;
	/**基础类型@1-毛石&2-砖&3-混凝土&4-钢筋混凝土&5-其它*/
	private String base_type;
	/**楼盖类型@1-现浇板&2-预制板&3-现浇、预制板混用&4-木楼板&5-其它*/
	private String upon_type;
	/**屋面类型@1-预制板平屋面&2-现浇板平屋面&3-现浇板坡屋面&4-有檩系坡屋面&5-其它*/
	private String wm_type;
	/**外廊类型@1-未设置&2-梁式&3-板式&4-落地*/
	private String wairang_type;
	/**楼梯数目@1-一个&2-二个&3-三个&4-多个*/
	private String lt_number;
	/**楼梯类型@1-木&2-混凝土&3-钢&4-其它*/
	private String lt_type;
	/**电梯数目@1-一个&2-二个&3-三个&4-多个*/
	private String dt_number;
	/**外墙饰面@1-玻璃&2-石材&3-面砖&4-马赛克&5-砂浆&6-涂料&7-清水墙&8-其它*/
	private String wq_type;
	
	/**信息填写人（检查录入的用户编号）*/
	private String check_userid;
	/**普查的状态字段（暂存 0  审核通过8）*/
	private String info_state;
	/**隐患房屋上报信息编号每次检查一条记录*/
	private String info_id;
	/**第一次普查管理模式*/
	private String manage_type;
	/**第一次普房屋性质*/
	private String building_properties;
	/**第一次普查房屋安全情况*/
	private String building_safecondition;
	/**新增时间*/
	private Date add_date;
	/**检查时间*/
	private Date check_time;
	/**危房通知发送状态  0-未发送  1-已发送*/
	private String notice_state;
	/**产权年限@1-50年&2-70年&3-其它*/
	private String build_right;
	/**产权性质@1-直管公房&2-自管房&3-私房&4-其它*/
	private String right_type;
	/**产权单位*/
	private String owner;
	/**高度m*/
	private Float heigth;
	/**檐高m*/
	private Float depth;
	/**平面@1-规则&2-不规则*/
	private String plane_shape;
	/**朝向@1-东西&2-南北&3-其它*/
	private String exposure;
	/**立面@1-规则&2-不规则*/
	private String lm_shape;
	/**经营管理单位*/
	private String management_unit;
	/**层高*/
	private Float floor_height;
	/**是否冻结片区@1-是&2-否*/
	private String frozen_area;
	/**所属街道*/
	private String belong_street;
	/**所属小区*/
	private String belong_community;
	/**阳台类型@1-未设置&2-梁式&3-板式&4-落地*/
	private String yt_type;
	/**房屋使用超限情况@1-临近超限&2-轻度超限&3-严重超限*/
	private String warn_grade;
	/**鉴定id*/
	private String jdinfo_id;
	/**检查楼幢座楼*/
	private String check_address;
	/**座楼是否一致*/
	private String is_same;
	/**危房整治状态（已整治、未整治）*/
	private String wfzz_status;
	//----------------------------------------------------------------
	
	
	/**设置楼幢编号图斑编号sm_id的get方法*/
	public String getBuilding_id() {
		return building_id;
	}
	public String getCheck_address() {
		return check_address;
	}
	public void setCheck_address(String check_address) {
		this.check_address = check_address;
	}
	public String getIs_same() {
		return is_same;
	}
	public void setIs_same(String is_same) {
		this.is_same = is_same;
	}
	public Integer getBuilding_number() {
		return building_number;
	}
	public void setBuilding_number(Integer building_number) {
		this.building_number = building_number;
	}
	/**设置楼幢编号图斑编号sm_id的set方法*/
	public void setBuilding_id(String building_id) {
		this.building_id = building_id;
	}
	/**设置楼幢坐落的get方法*/
	public String getBuilding_address() {
		return building_address;
	}
	/**设置楼幢坐落的set方法*/
	public void setBuilding_address(String building_address) {
		this.building_address = building_address;
	}
	/**设置所属区域的get方法*/
	public String getBuiliding_region() {
		return builiding_region;
	}
	/**设置所属区域的set方法*/
	public void setBuiliding_region(String builiding_region) {
		this.builiding_region = builiding_region;
	}
	/**设置层数的get方法*/
	public Integer getFloor_count() {
		return floor_count;
	}
	/**设置层数的set方法*/
	public void setFloor_count(Integer floor_count) {
		this.floor_count = floor_count;
	}
	/**设置户数的get方法*/
	public Integer getHouse_count() {
		return house_count;
	}
	/**设置户数的set方法*/
	public void setHouse_count(Integer house_count) {
		this.house_count = house_count;
	}
	/**设置地上层数的get方法*/
	public Integer getFloorup_count() {
		return floorup_count;
	}
	/**设置地上层数的set方法*/
	public void setFloorup_count(Integer floorup_count) {
		this.floorup_count = floorup_count;
	}
	/**设置地下层数的get方法*/
	public Integer getFloordown_count() {
		return floordown_count;
	}
	/**设置地下层数的set方法*/
	public void setFloordown_count(Integer floordown_count) {
		this.floordown_count = floordown_count;
	}
	/**设置建筑面积的get方法*/
	public Float getBuild_area() {
		return build_area;
	}
	/**设置建筑面积的set方法*/
	public void setBuild_area(Float build_area) {
		this.build_area = build_area;
	}
	/**设置房屋产别的get方法*/
	public String getReal_type() {
		return real_type;
	}
	/**设置房屋产别的set方法*/
	public void setReal_type(String real_type) {
		this.real_type = real_type;
	}
	/**设置设计用途的get方法*/
	public String getUse_desgin() {
		return use_desgin;
	}
	/**设置设计用途的set方法*/
	public void setUse_desgin(String use_desgin) {
		this.use_desgin = use_desgin;
	}
	/**设置建成时间的get方法*/
	public Integer getBuilding_date() {
		return building_date;
	}
	/**设置建成时间的set方法*/
	public void setBuilding_date(Integer building_date) {
		this.building_date = building_date;
	}
	/**设置房屋与结构的get方法*/
	public String getBuild_struct() {
		return build_struct;
	}
	/**设置房屋与结构的set方法*/
	public void setBuild_struct(String build_struct) {
		this.build_struct = build_struct;
	}
	/**设置所在楼盘内码初始化进来的get方法*/
	public Integer getBuilding_mapid() {
		return building_mapid;
	}
	/**设置所在楼盘内码初始化进来的set方法*/
	public void setBuilding_mapid(Integer building_mapid) {
		this.building_mapid = building_mapid;
	}
	/**设置健康等级-普查@1-a级&2-b级&3-c级&4-d级的get方法*/
	public String getHealth_grade_pc() {
		return health_grade_pc;
	}
	/**设置健康等级-普查@1-a级&2-b级&3-c级&4-d级的set方法*/
	public void setHealth_grade_pc(String health_grade_pc) {
		this.health_grade_pc = health_grade_pc;
	}
	/**设置的get方法*/
	public String getDangerous_type_pc() {
		return dangerous_type_pc;
	}
	/**设置的set方法*/
	public void setDangerous_type_pc(String dangerous_type_pc) {
		this.dangerous_type_pc = dangerous_type_pc;
	}
	/**设置健康等级-鉴定@1-a级&2-b级&3-c级&4-d级的get方法*/
	public String getHealth_grade_jd() {
		return health_grade_jd;
	}
	/**设置健康等级-鉴定@1-a级&2-b级&3-c级&4-d级的set方法*/
	public void setHealth_grade_jd(String health_grade_jd) {
		this.health_grade_jd = health_grade_jd;
	}
	/**设置的get方法*/
	public String getDangerous_type_jd() {
		return dangerous_type_jd;
	}
	/**设置的set方法*/
	public void setDangerous_type_jd(String dangerous_type_jd) {
		this.dangerous_type_jd = dangerous_type_jd;
	}
	/**设置的get方法*/
	public String getIs_die() {
		return is_die;
	}
	/**设置的set方法*/
	public void setIs_die(String is_die) {
		this.is_die = is_die;
	}
	/**设置的get方法*/
	public String getFw_type() {
		return fw_type;
	}
	/**设置的set方法*/
	public void setFw_type(String fw_type) {
		this.fw_type = fw_type;
	}
	/**设置使用功能@1-住宅&2-综合楼&3-办公&4-商业&5-学校用房&6-医院用房&7-工业用房&8-其它的get方法*/
	public String getUsefunction() {
		return usefunction;
	}
	/**设置使用功能@1-住宅&2-综合楼&3-办公&4-商业&5-学校用房&6-医院用房&7-工业用房&8-其它的set方法*/
	public void setUsefunction(String usefunction) {
		this.usefunction = usefunction;
	}
	/**设置基础类型@1-毛石&2-砖&3-混凝土&4-钢筋混凝土&5-其它的get方法*/
	public String getBase_type() {
		return base_type;
	}
	/**设置基础类型@1-毛石&2-砖&3-混凝土&4-钢筋混凝土&5-其它的set方法*/
	public void setBase_type(String base_type) {
		this.base_type = base_type;
	}
	/**设置楼盖类型@1-现浇板&2-预制板&3-现浇、预制板混用&4-木楼板&5-其它的get方法*/
	public String getUpon_type() {
		return upon_type;
	}
	/**设置楼盖类型@1-现浇板&2-预制板&3-现浇、预制板混用&4-木楼板&5-其它的set方法*/
	public void setUpon_type(String upon_type) {
		this.upon_type = upon_type;
	}
	/**设置屋面类型@1-预制板平屋面&2-现浇板平屋面&3-现浇板坡屋面&4-有檩系坡屋面&5-其它的get方法*/
	public String getWm_type() {
		return wm_type;
	}
	/**设置屋面类型@1-预制板平屋面&2-现浇板平屋面&3-现浇板坡屋面&4-有檩系坡屋面&5-其它的set方法*/
	public void setWm_type(String wm_type) {
		this.wm_type = wm_type;
	}
	/**设置外廊类型@1-未设置&2-梁式&3-板式&4-落地的get方法*/
	public String getWairang_type() {
		return wairang_type;
	}
	/**设置外廊类型@1-未设置&2-梁式&3-板式&4-落地的set方法*/
	public void setWairang_type(String wairang_type) {
		this.wairang_type = wairang_type;
	}
	/**设置楼梯数目@1-一个&2-二个&3-三个&4-多个的get方法*/
	public String getLt_number() {
		return lt_number;
	}
	/**设置楼梯数目@1-一个&2-二个&3-三个&4-多个的set方法*/
	public void setLt_number(String lt_number) {
		this.lt_number = lt_number;
	}
	/**设置楼梯类型@1-木&2-混凝土&3-钢&4-其它的get方法*/
	public String getLt_type() {
		return lt_type;
	}
	/**设置楼梯类型@1-木&2-混凝土&3-钢&4-其它的set方法*/
	public void setLt_type(String lt_type) {
		this.lt_type = lt_type;
	}
	/**设置电梯数目@1-一个&2-二个&3-三个&4-多个的get方法*/
	public String getDt_number() {
		return dt_number;
	}
	/**设置电梯数目@1-一个&2-二个&3-三个&4-多个的set方法*/
	public void setDt_number(String dt_number) {
		this.dt_number = dt_number;
	}
	/**设置外墙饰面@1-玻璃&2-石材&3-面砖&4-马赛克&5-砂浆&6-涂料&7-清水墙&8-其它的get方法*/
	public String getWq_type() {
		return wq_type;
	}
	/**设置外墙饰面@1-玻璃&2-石材&3-面砖&4-马赛克&5-砂浆&6-涂料&7-清水墙&8-其它的set方法*/
	public void setWq_type(String wq_type) {
		this.wq_type = wq_type;
	}
	/**设置信息填写人的get方法*/
	public String getCheck_userid() {
		return check_userid;
	}
	/**设置信息填写人的set方法*/
	public void setCheck_userid(String check_userid) {
		this.check_userid = check_userid;
	}
	/**设置的get方法*/
	public String getInfo_state() {
		return info_state;
	}
	/**设置的set方法*/
	public void setInfo_state(String info_state) {
		this.info_state = info_state;
	}
	/**设置信息编号每次检查一条记录的get方法*/
	public String getInfo_id() {
		return info_id;
	}
	/**设置信息编号每次检查一条记录的set方法*/
	public void setInfo_id(String info_id) {
		this.info_id = info_id;
	}
	public String getManage_type() {
		return manage_type;
	}
	public void setManage_type(String manage_type) {
		this.manage_type = manage_type;
	}
	public String getBuilding_properties() {
		return building_properties;
	}
	public void setBuilding_properties(String building_properties) {
		this.building_properties = building_properties;
	}
	public String getBuilding_safecondition() {
		return building_safecondition;
	}
	public void setBuilding_safecondition(String building_safecondition) {
		this.building_safecondition = building_safecondition;
	}
	public Date getAdd_date() {
		return add_date;
	}
	public void setAdd_date(Date add_date) {
		this.add_date = add_date;
	}
	public Date getCheck_time() {
		return check_time;
	}
	public void setCheck_time(Date check_time) {
		this.check_time = check_time;
	}
	public String getNotice_state() {
		return notice_state;
	}
	public void setNotice_state(String notice_state) {
		this.notice_state = notice_state;
	}
	public String getBuild_right() {
		return build_right;
	}
	public void setBuild_right(String build_right) {
		this.build_right = build_right;
	}
	public String getRight_type() {
		return right_type;
	}
	public void setRight_type(String right_type) {
		this.right_type = right_type;
	}
	public String getOwner() {
		return owner;
	}
	public void setOwner(String owner) {
		this.owner = owner;
	}
	public Float getHeigth() {
		return heigth;
	}
	public void setHeigth(Float heigth) {
		this.heigth = heigth;
	}
	public Float getDepth() {
		return depth;
	}
	public void setDepth(Float depth) {
		this.depth = depth;
	}
	public String getPlane_shape() {
		return plane_shape;
	}
	public void setPlane_shape(String plane_shape) {
		this.plane_shape = plane_shape;
	}
	public String getExposure() {
		return exposure;
	}
	public void setExposure(String exposure) {
		this.exposure = exposure;
	}
	public String getLm_shape() {
		return lm_shape;
	}
	public void setLm_shape(String lm_shape) {
		this.lm_shape = lm_shape;
	}
	public String getManagement_unit() {
		return management_unit;
	}
	public void setManagement_unit(String management_unit) {
		this.management_unit = management_unit;
	}
	public Float getFloor_height() {
		return floor_height;
	}
	public void setFloor_height(Float floor_height) {
		this.floor_height = floor_height;
	}
	public String getFrozen_area() {
		return frozen_area;
	}
	public void setFrozen_area(String frozen_area) {
		this.frozen_area = frozen_area;
	}
	public String getBelong_street() {
		return belong_street;
	}
	public void setBelong_street(String belong_street) {
		this.belong_street = belong_street;
	}
	public String getBelong_community() {
		return belong_community;
	}
	public void setBelong_community(String belong_community) {
		this.belong_community = belong_community;
	}
	public String getYt_type() {
		return yt_type;
	}
	public void setYt_type(String yt_type) {
		this.yt_type = yt_type;
	}
	public String getWarn_grade() {
		return warn_grade;
	}
	public void setWarn_grade(String warn_grade) {
		this.warn_grade = warn_grade;
	}
	public String getJdinfo_id() {
		return jdinfo_id;
	}
	public void setJdinfo_id(String jdinfo_id) {
		this.jdinfo_id = jdinfo_id;
	}
	public String getWfzz_status() {
		return wfzz_status;
	}
	public void setWfzz_status(String wfzz_status) {
		this.wfzz_status = wfzz_status;
	}
	
}