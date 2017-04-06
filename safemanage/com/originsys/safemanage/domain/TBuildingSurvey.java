package com.originsys.safemanage.domain;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.originsys.eap.domain.EapDomain;
/**第一次安全普查信息*/
public class TBuildingSurvey extends EapDomain{
	/**楼幢编号图斑编号sm_id*/
	private String building_id;
	/**房屋所有人（管理单位）*/
	private String building_holder;
	/**房屋管理人姓名*/
	private String building_manager_name;
	/**房屋管理人办公室电话、手机*/
	private String building_manager_phone;
	/**设计施工材料是否齐全*/
	private String building_material;
	/**管理模式*/
	private String manage_type;
	/**建设单位*/
	private String build_dept;
	/**设计单位*/
	private String design_dept;
	/**施工单位*/
	private String construct_dept;
	/**房屋性质*/
	private String building_properties;
	/**现场调查情况*/
	private String local_survey;
	/**房屋安全情况*/
	private String building_safecondition;
	/**负责人*/
	private String manager_name;
	/**排查人*/
	private String survey_name;
	/**排查时间*/
	private Date survey_date;
	/**信息填写人id*/
	private String report_userid;
	/**信息状态*/
	private String info_state;
	/**楼幢坐落*/
	private String building_address;
	/**所属区域*/
	private String building_region;
	/**建筑面积*/
	private Float build_area;
	/**地上层数*/
	private Integer floorup_count;
	/**地下层数*/
	private Integer floordown_count;
	/**户数*/
	private Integer house_count;
	/**设计用途*/
	private String use_desgin;
	/**建成时间*/
	private Integer building_date;
	/**结构类型*/
	private String build_struct;
	/**楼盖类型@1-现浇板&2-预制板&3-现浇、预制板混用&4-木楼板&5-其它*/
	private String upon_type;
	/**屋面类型@1-预制板平屋面&2-现浇板平屋面&3-现浇板坡屋面&4-有檩系坡屋面&5-其它*/
	private String wm_type;
	/**审核人id*/
	private String check_userid;
	/**审核意见*/
	private String check_message;
	/**审核时间*/
	private Date check_date;
	/**上传附件*/
	private String annex;
	/**上传图片*/
	private String annex_pic;
	/**普查新坐落*/
	private String building_newaddress;
	/**是否一致*/
	private String issame;
	/**最后编辑人*/
	private String last_editor;
	/**是否鉴定*/
	private String isauth;
	/**普查主键id*/
	private String survey_id;
	/**普查类型**/
	private String survey_type;
	
	/**开始时间*/
	private Date s_date;
	/**结束时间*/
	private Date e_date;
	
	public String getBuilding_id() {
		return building_id;
	}
	public void setBuilding_id(String building_id) {
		this.building_id = building_id;
	}
	public String getBuilding_holder() {
		return building_holder;
	}
	public void setBuilding_holder(String building_holder) {
		this.building_holder = building_holder;
	}
	public String getBuilding_manager_name() {
		return building_manager_name;
	}
	public void setBuilding_manager_name(String building_manager_name) {
		this.building_manager_name = building_manager_name;
	}
	public String getBuilding_manager_phone() {
		return building_manager_phone;
	}
	public void setBuilding_manager_phone(String building_manager_phone) {
		this.building_manager_phone = building_manager_phone;
	}
	public String getBuilding_material() {
		return building_material;
	}
	public void setBuilding_material(String building_material) {
		this.building_material = building_material;
	}
	public String getManage_type() {
		return manage_type;
	}
	public void setManage_type(String manage_type) {
		this.manage_type = manage_type;
	}
	public String getBuild_dept() {
		return build_dept;
	}
	public void setBuild_dept(String build_dept) {
		this.build_dept = build_dept;
	}
	public String getDesign_dept() {
		return design_dept;
	}
	public void setDesign_dept(String design_dept) {
		this.design_dept = design_dept;
	}
	public String getConstruct_dept() {
		return construct_dept;
	}
	public void setConstruct_dept(String construct_dept) {
		this.construct_dept = construct_dept;
	}
	public String getBuilding_properties() {
		return building_properties;
	}
	public void setBuilding_properties(String building_properties) {
		this.building_properties = building_properties;
	}
	public String getLocal_survey() {
		return local_survey;
	}
	public void setLocal_survey(String local_survey) {
		this.local_survey = local_survey;
	}
	public String getBuilding_safecondition() {
		return building_safecondition;
	}
	public void setBuilding_safecondition(String building_safecondition) {
		this.building_safecondition = building_safecondition;
	}
	public String getManager_name() {
		return manager_name;
	}
	public void setManager_name(String manager_name) {
		this.manager_name = manager_name;
	}
	public String getSurvey_name() {
		return survey_name;
	}
	public void setSurvey_name(String survey_name) {
		this.survey_name = survey_name;
	}
	public Date getSurvey_date() {
		return survey_date;
	}
	public void setSurvey_date(Date survey_date) {
		this.survey_date = survey_date;
	}
	public String getCheck_userid() {
		return check_userid;
	}
	public void setCheck_userid(String check_userid) {
		this.check_userid = check_userid;
	}
	public String getInfo_state() {
		return info_state;
	}
	public void setInfo_state(String info_state) {
		this.info_state = info_state;
	}
	public String getReport_userid() {
		return report_userid;
	}
	public void setReport_userid(String report_userid) {
		this.report_userid = report_userid;
	}
	public String getBuilding_address() {
		return building_address;
	}
	public void setBuilding_address(String building_address) {
		this.building_address = building_address;
	}
	public Float getBuild_area() {
		return build_area;
	}
	public void setBuild_area(Float build_area) {
		this.build_area = build_area;
	}
	public Integer getFloorup_count() {
		return floorup_count;
	}
	public void setFloorup_count(Integer floorup_count) {
		this.floorup_count = floorup_count;
	}
	public Integer getFloordown_count() {
		return floordown_count;
	}
	public void setFloordown_count(Integer floordown_count) {
		this.floordown_count = floordown_count;
	}
	public Integer getHouse_count() {
		return house_count;
	}
	public void setHouse_count(Integer house_count) {
		this.house_count = house_count;
	}
	public String getUse_desgin() {
		return use_desgin;
	}
	public void setUse_desgin(String use_desgin) {
		this.use_desgin = use_desgin;
	}
	public Integer getBuilding_date() {
		return building_date;
	}
	public void setBuilding_date(Integer building_date) {
		this.building_date = building_date;
	}
	public String getUpon_type() {
		return upon_type;
	}
	public void setUpon_type(String upon_type) {
		this.upon_type = upon_type;
	}
	public String getWm_type() {
		return wm_type;
	}
	public void setWm_type(String wm_type) {
		this.wm_type = wm_type;
	}
	public String getCheck_message() {
		return check_message;
	}
	public void setCheck_message(String check_message) {
		this.check_message = check_message;
	}
	public Date getCheck_date() {
		return check_date;
	}
	public void setCheck_date(Date check_date) {
		this.check_date = check_date;
	}
	public String getAnnex() {
		return annex;
	}
	public void setAnnex(String annex) {
		this.annex = annex;
	}
	public String getAnnex_pic() {
		return annex_pic;
	}
	public void setAnnex_pic(String annex_pic) {
		this.annex_pic = annex_pic;
	}
	public String getBuild_struct() {
		return build_struct;
	}
	public void setBuild_struct(String build_struct) {
		this.build_struct = build_struct;
	}
	public String getBuilding_region() {
		return building_region;
	}
	public void setBuilding_region(String building_region) {
		this.building_region = building_region;
	}
	public String getBuilding_newaddress() {
		return building_newaddress;
	}
	public void setBuilding_newaddress(String building_newaddress) {
		this.building_newaddress = building_newaddress;
	}
	public String getIssame() {
		return issame;
	}
	public void setIssame(String issame) {
		this.issame = issame;
	}
	public String getLast_editor() {
		return last_editor;
	}
	public void setLast_editor(String last_editor) {
		this.last_editor = last_editor;
	}
	public String getIsauth() {
		return isauth;
	}
	public void setIsauth(String isauth) {
		this.isauth = isauth;
	}
	public String getSurvey_id() {
		return survey_id;
	}
	public void setSurvey_id(String survey_id) {
		this.survey_id = survey_id;
	}
	public String getSurvey_type() {
		return survey_type;
	}
	public void setSurvey_type(String survey_type) {
		this.survey_type = survey_type;
	}
	public Date getS_date() {
		return s_date;
	}
	public void setS_date(Date s_date) {
		this.s_date = s_date;
	}
	public Date getE_date() {
		return e_date;
	}
	public void setE_date(Date e_date) {
		this.e_date = e_date;
	}
	
}