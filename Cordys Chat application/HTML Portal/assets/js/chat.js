var data = {};
data.heading = "1030-1034";

$( document ).ready(function() {
	
	checkUserLoginInf();
	userInformation();
	getUserDetails();
	getChat();
	setInterval(function(){ checkNewMsg() }, 3000);
	
	$("#btn_sendNewMsg").click(function(){
		if($("#comment").val().trim() != "")
		{
			sendNewMsg($("#comment").val().trim());
			$("#comment").val("")
		}
		else
		{
			alert("Please enter some msg and send");
		}
	})	
});

function checkUserLoginInf()
{
	if(document.cookie == "")
	{
		window.location = "clogin.htm?#refScreen#"+location.href.substr(location.href.lastIndexOf("/")+1,location.href.length+"#refScreen#");
	}
}

function userInformation()
{
	userModel = new $.cordys.model({
	objectName: "User", // Name of the Business Object
	read:{
			namespace: "http://schemas.cordys.com/UserManagement/1.0/User",
			dataType: "json",
			async : false,
			method: "GetUserDetails",
		}
	});
	userModel.read().done(function(){
		$("#user")[0].children[0].children[0].innerText = "Welcome"+userModel.User()[0].UserName+"-"+userModel.User()[0].Description;
	});	
}
function onlineStatus()
{
	$.cordys.ajax({
		method: "OnlineStatus",
		namespace: "http://schemas.cordys.com/ChatMetadata",
		dataType:"json",
		parameters:
		{
			currentUser : data.LoggedUserID
		},
		success: function(data) {
			UsersListWithStatus(data)
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("request:"+jqXHR+" \nStatus :"+textStatus+" \n error:"+errorThrown);
		}
	});
}

function UsersListWithStatus(data)
{
	$($("#User_table").children()[0].rows).remove()
	for(var a=0;a<data.tuple.length;a++)
	{
		dataX = '<tr><td><img src=\"assets/img/'+data.tuple[a].old.AKChat.USER_ID+"\.png\" alt=\"user_img\" class=\"img-circle img-responsive\"></td>";
		dataX += '<td class=\"msg_col vmid\">'+data.tuple[a].old.AKChat.NAME+'</td><td class="vmid"><div class="'+data.tuple[a].old.AKChat.STATUS+'"></div></td></tr>';
		$("#User_table").append(dataX);
	}
}

function getUserDetails()
{
	$.cordys.ajax({
		method: "GetRoles",
		namespace: "http://schemas.cordys.com/1.0/ldap",
		dataType: "json",
		async: false,
		parameters: {
			dn: "",
			depth: "0"
		},
		success: function(response){
			var currentUserDN = $.cordys.json.find(response, "user")['@dn'];
			data.LoggedUserID = currentUserDN.split(",")[0].split("=")[1];
			setInterval(function(){ onlineStatus() }, 3000);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("request:"+jqXHR+" \nStatus :"+textStatus+" \n error:"+errorThrown);
		}
	});
}

function getChat()
{
	$.cordys.ajax({
		method: "GetChat",
		namespace: "http://schemas.cordys.com/ChatMetadata",
		dataType: "json",
		async: false,
		parameters: {
			heading: data.heading
		},
		success: function(response){
			messageData(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("request:"+jqXHR+" \nStatus :"+textStatus+" \n error:"+errorThrown);
		}
	});
}

function messageData(data)
{
	if(data.tuple.length!=undefined)
	{
		for(var a=0;a<data.tuple.length;a++)
		{
			var dataX = '<tr class="odd"><td class="user_col"><div>';
				dataX +='<img src="assets\\img\\'+data.tuple[a].old.AKChat.USER_FROM+'.png" alt="user_img" class="img-circle img-responsive">';
				dataX +='<div>'+data.tuple[a].old.AKChat.USER_FROM+'<br><span>'+data.tuple[a].old.AKChat.CREATED_ON.split("T")[1].split(".")[0]+'</span></div></div></td><td class="msg_col">'+data.tuple[a].old.AKChat.MESSAGE+'</td></tr>';
			$("#chat_table").append(dataX);
			$('.scrollable1').scrollTop($('.scrollable1').scrollTop()+100);
		}
		this.data.lastMessageId = data.tuple[a-1].old.AKChat.REF_NO;
		this.data.messageNo = data.tuple[a-1].old.AKChat.INFO_REF_NO;
	}
	else
	{
		var dataX = '<tr class="odd"><td class="user_col"><div>';
			dataX +='<img src="assets\\img\\'+data.tuple.old.AKChat.USER_FROM+'.png" alt="user_img" class="img-circle img-responsive">';
			dataX +='<div>'+data.tuple.old.AKChat.USER_FROM+'<br><span>'+data.tuple.old.AKChat.CREATED_ON.split("T")[1].split(".")[0]+'</span></div></div></td><td class="msg_col">'+data.tuple[0].old.AKChat.MESSAGE+'</td></tr>';
		$("#chat_table").append(dataX);
		this.data.lastMessageId = data.tuple.old.AKChat.REF_NO;
		this.data.messageNo = data.tuple.old.AKChat.INFO_REF_NO;
		$('.scrollable1').scrollTop($('.scrollable1').scrollTop()+100);
	}	
}

function checkNewMsg()
{
	$.cordys.ajax({
		method: "CheckNewMsg",
		namespace: "http://schemas.cordys.com/ChatMetadata",
		dataType: "json",
		async: false,
		parameters: {
			Heading: data.heading,
			lastMsg: data.lastMessageId
		},
		success: function(response){
			addnewmsg(response);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("request:"+jqXHR+" \nStatus :"+textStatus+" \n error:"+errorThrown);
		}
	});
}

function addnewmsg(data)
{
	if(data.tuple != undefined && data.tuple.length)
	{
		for(var a=0;a<data.tuple.length;a++)
		{
			var dataX = '<tr class="odd"><td class="user_col"><div><img src="assets\\img\\'+data.tuple[a].old.AKChat.USER_FROM+'.png" alt="user_img" class="img-circle img-responsive"><div>'+data.tuple[a].old.AKChat.USER_FROM+'<br><span>'+data.tuple[a].old.AKChat.CREATED_ON.split("T")[1].split(".")[0]+'</span></div></div></td><td class="msg_col">'+data.tuple[a].old.AKChat.MESSAGE+'</td></tr';
			$("#chat_table").append(dataX);
			$('.scrollable1').scrollTop($('.scrollable1').scrollTop()+100);
		}
		this.data.lastMessageId = data.tuple[a-1].old.AKChat.REF_NO;
	}
	else if(data.tuple != undefined)
	{
		var dataX = '<tr class="odd"><td class="user_col"><div><img src="assets\\img\\'+data.tuple.old.AKChat.USER_FROM+'.png" alt="user_img" class="img-circle img-responsive"><div>'+data.tuple.old.AKChat.USER_FROM+'<br><span>'+data.tuple.old.AKChat.CREATED_ON.split("T")[1].split(".")[0]+'</span></div></div></td><td class="msg_col">'+data.tuple.old.AKChat.MESSAGE+'</td></tr';
		$("#chat_table").append(dataX);
		this.data.lastMessageId = data.tuple.old.AKChat.REF_NO;
		$('.scrollable1').scrollTop($('.scrollable1').scrollTop()+100);
	}	
}

function sendNewMsg(msg)
{
	$.cordys.ajax({
		method: "AddNewMsg",
		namespace: "http://schemas.cordys.com/ChatMetadata",
		dataType: "json",
		async: false,
		parameters: {
			info_ref: this.data.messageNo,
			to_user : 1034,
			msg		: msg
		},
		success: function(response){
			debugger
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert("request:"+jqXHR+" \nStatus :"+textStatus+" \n error:"+errorThrown);
		}
	});
}

function logout()
{
	$('#SSOLogout').html("<iframe src='wcp/sso/com.eibus.sso.web.authentication.LogMeOut.wcp' style='width: 100%; height: 100%'></iframe>")
	window.setTimeout(waitForLoggedOut, 200);
}
function waitForLoggedOut() {
	if (!$.cordys.authentication.sso.isAuthenticated()) {
		alert("successfully logged out.");
		window.location="clogin.htm";
	} else {
		window.setTimeout(waitForLoggedOut, 3*200);
	}
}