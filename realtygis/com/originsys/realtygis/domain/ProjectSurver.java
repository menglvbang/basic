package com.originsys.realtygis.domain;

/**
 auth:boy 2014-3-20
   描述：项目测绘对象
 */
public class ProjectSurver {

	private String surverproject_id;//项目测绘编号
	private String surverproinst_id;//项目测绘流程内码
	private String surverproject_name;//项目测绘名称
	private String surverproject_createdate;//创建时间
	private String surverproject_enddate;//结束时间
	private String entrust_unit;//委托单位
	private String linkman;//联系人
	private String linkman_tel;//联系方式
	private String surver_type;//测绘类型
	private String surverproject_desc;//备注
	private String graphics_code;//楼幢编号
	private String surver_purpose;//测绘目的
	private String projectfile_filename;//项目测绘报告文件名称
	private byte[] projectfile_fileblob;//项目测绘报告文件
	private String projectsddfile_id;//项目测绘sdd图形文件id
	
	public String getSurverproject_id() {
		return surverproject_id;
	}
	public void setSurverproject_id(String surverproject_id) {
		this.surverproject_id = surverproject_id;
	}
	public String getSurverproinst_id() {
		return surverproinst_id;
	}
	public void setSurverproinst_id(String surverproinst_id) {
		this.surverproinst_id = surverproinst_id;
	}
	public String getSurverproject_name() {
		return surverproject_name;
	}
	public void setSurverproject_name(String surverproject_name) {
		this.surverproject_name = surverproject_name;
	}
	public String getSurverproject_createdate() {
		return surverproject_createdate;
	}
	public void setSurverproject_createdate(String surverproject_createdate) {
		this.surverproject_createdate = surverproject_createdate;
	}
	public String getSurverproject_enddate() {
		return surverproject_enddate;
	}
	public void setSurverproject_enddate(String surverproject_enddate) {
		this.surverproject_enddate = surverproject_enddate;
	}
	public String getEntrust_unit() {
		return entrust_unit;
	}
	public void setEntrust_unit(String entrust_unit) {
		this.entrust_unit = entrust_unit;
	}
	public String getLinkman() {
		return linkman;
	}
	public void setLinkman(String linkman) {
		this.linkman = linkman;
	}
	public String getLinkman_tel() {
		return linkman_tel;
	}
	public void setLinkman_tel(String linkman_tel) {
		this.linkman_tel = linkman_tel;
	}
	public String getSurver_type() {
		return surver_type;
	}
	public void setSurver_type(String surver_type) {
		this.surver_type = surver_type;
	}
	public String getSurverproject_desc() {
		return surverproject_desc;
	}
	public void setSurverproject_desc(String surverproject_desc) {
		this.surverproject_desc = surverproject_desc;
	}
	public String getGraphics_code() {
		return graphics_code;
	}
	public void setGraphics_code(String graphics_code) {
		this.graphics_code = graphics_code;
	}
	public String getSurver_purpose() {
		return surver_purpose;
	}
	public void setSurver_purpose(String surver_purpose) {
		this.surver_purpose = surver_purpose;
	}
	public String getProjectfile_filename() {
		return projectfile_filename;
	}
	public void setProjectfile_filename(String projectfile_filename) {
		this.projectfile_filename = projectfile_filename;
	}
	public byte[] getProjectfile_fileblob() {
		return projectfile_fileblob;
	}
	public void setProjectfile_fileblob(byte[] projectfile_fileblob) {
		this.projectfile_fileblob = projectfile_fileblob;
	}
	public String getProjectsddfile_id() {
		return projectsddfile_id;
	}
	public void setProjectsddfile_id(String projectsddfile_id) {
		this.projectsddfile_id = projectsddfile_id;
	}

}
