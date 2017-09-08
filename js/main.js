;(function(){
	"use strict"
	var url1 = "https://crossorigin.me/"
			+"http://www.webxml.com.cn/WebServices/TrainTimeWebService.asmx/"
			+"getStationAndTimeByStationName?UserID="
	,url2 =  "https://crossorigin.me/"
			+"http://www.webxml.com.cn/WebServices/TrainTimeWebService.asmx/"
			+"getStationAndTimeDataSetByLikeTrainCode?UserID="
	,url3 = "https://crossorigin.me/"
			+"http://www.webxml.com.cn/WebServices/TrainTimeWebService.asmx/"
			+"getDetailInfoByTrainCode?UserID="
	,url
	,startPlace
	,endPlace
	,trainCode
	,data={}
	,list
	,timetables
	,arr=[]
	,list_html
	,isAjax = false
	,train_detail = $("#detail")
	,TrainDetail
	;
	
	function getTrainList(){
		$(".search").on("click",function(){
			startPlace = $("input[name=start]").val();
			endPlace = $('input[name=end]').val();
			trainCode = $("input[name=number]").val();
			if((startPlace&&endPlace)||trainCode){
				$(this).button("option","disabled",true);
				$.mobile.loading("show");
				if(trainCode){
					data.TrainCode = trainCode;
					url = url2;
				}else{
					data.StartStation = startPlace;
					data.ArriveStation = endPlace;
					url = url1;
				}
				isAjax = true;
				$.get(url,data,function(data){
					$.mobile.loading("hide");
					$(".search").button("option","disabled",false);
					isAjax = false;
					
					timetables = $(data).find("TimeTable");
					
					timetables.each(function(index,obj){
						
						var that = $(this);
						
						if(that.find("FirstStation").text()=="数据没有被发现"){
							alert("数据没有被发现");
							return false;
						}
						
						list_html = '<li class='+'"train_list"'+'>'+'<a href="" >'
								+   '<h2>'+that.find("TrainCode").text()+'</h2>'
								+	'<p>'+ that.find("StartStation").text()+"-"+that.find("ArriveStation").text()+'</p>'
								+	'<p>'+ "需时:"+that.find("UseDate").text() +'</p>'
								+	'<p class="ui-li-aside">'+ "出发时间:"+that.find("StartTime").text() +'</p>'	
								+	'</a></li>'
						arr.push(list_html);
					});
					
					if(arr.length>0){
						list = $("#list");
						list.html("");
						arr.forEach(function(item,index){
							list.append(item);
							list.listview("refresh");
						});
						getInfoByTrainCode();
					}
				})
			}else{
				alert("请输入发车站和终点站，或者输入车次");
			}
		});
	}
	function getInfoByTrainCode(){
		if(isAjax) return;
		isAjax = true;
		$(".train_list").on("click",function(){
			
			$.mobile.changePage("#detail");
			trainCode = $(this).find("h2").text();
			
			$.get(url3,{TrainCode:trainCode},function(data){
				
				train_detail.find("h2").text(trainCode);
				
				TrainDetail = $(data).find("TrainDetailInfo");
				
				arr = [];
				TrainDetail.each(function(index,obj){
					
					
					list_html = '<tr>'
						+		'<td>'+ '<b class="ui-table-cell-label">站名</b>' + $(this).find("TrainStation").text() +'</td>'
						+		'<td>'+ '<b class="ui-table-cell-label">到站时间</b>' + $(this).find("ArriveTime").text() +'</td>'
						+		'<td>'+ '<b class="ui-table-cell-label">出发时间</b>' + $(this).find("StartTime").text() +'</td>'
						+	'</tr>'
					arr.push(list_html);
				});
				
				if(TrainDetail.length>0){
					arr.forEach(function(item,index){
						train_detail.find("tbody").append(item);
					});
				}
				isAjax = false;
			});
		});
	}
	
	function init(){
		getTrainList();
		getInfoByTrainCode();
	}
	
	$(document).on("pageinit","#index1",function(){
		init();
	});
})();
