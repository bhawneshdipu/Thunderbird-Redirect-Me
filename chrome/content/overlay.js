
// Ensure the activity modules are loaded for this window.
Components.utils.import("resource:///modules/activity/activityModules.js");
Components.utils.import("resource:///modules/attachmentChecker.js");
Components.utils.import("resource:///modules/cloudFileAccounts.js");
Components.utils.import("resource:///modules/mimeParser.jsm");
Components.utils.import("resource:///modules/errUtils.js");
Components.utils.import("resource:///modules/folderUtils.jsm");
Components.utils.import("resource:///modules/iteratorUtils.jsm");
Components.utils.import("resource:///modules/mailServices.js");
Components.utils.import("resource:///modules/MailUtils.js");
Components.utils.import("resource://gre/modules/InlineSpellChecker.jsm");
Components.utils.import("resource://gre/modules/PluralForm.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/AppConstants.jsm");




window.addEventListener("load", function(e) {   
  init();
    startup();
}, true);  
var LastSent=" : ";
var Msg="";
window.setInterval(  
    function() {  
        startup(Msg);
    }, 60000); //update date every minute  

function init() {  
    var notificationService =  
    Components.classes["@mozilla.org/messenger/msgnotificationservice;1"]  
    .getService(Components.interfaces.nsIMsgFolderNotificationService);  
    notificationService.addListener(newMailListener, notificationService.msgAdded);   
}   
function startup(msg) {  
	if(msg==='undefined' || msg==null){
		msg="";
	}
    var myPanel = document.getElementById("my-panel");  
    var date = new Date();  
    var day = date.getDay();  
    var dateString = date.getFullYear() + "." + (date.getMonth()+1) + "." + date.getDate();  
    myPanel.label = "RedirectMe:[ "+msg+" : Date: "+ dateString+" ]";  
    

}
var newMailListener = {  
    msgAdded: function(aMsgHdr) {  
        if( !aMsgHdr.isRead )  
            //alert("Got mail. Look at aMsgHdr's properties for more details.");
            //alert(aMsgHdr);
            console.log(aMsgHdr);
            var body=getMessageBody(aMsgHdr);
            body = body.replace(/\s\s+/g, ' ');
            //alert(body);
            var subject=aMsgHdr.subject;
            console.log(body);
            console.log(body);
            body=JSON.parse(body);
            console.log("To:"+body.to);
            console.log("Cc:"+body.cc);
            console.log("Bcc:"+body.cc);
            console.log("Subject:"+body.subject);
            console.log("Body:"+body.body);
            if(subject.trim().toLowerCase()=='json redirect'){
            	sendmail(body);
   	        }else{
   	        	Msg="Current mail Subject Not Matched! ";
   	        	startup(Msg+LastSent);
   	        }
       }
}

function getMessageBody(aMessageHeader)  
{

  let messenger = Components.classes["@mozilla.org/messenger;1"]  
                            .createInstance(Components.interfaces.nsIMessenger);  
  let listener = Components.classes["@mozilla.org/network/sync-stream-listener;1"]  
                           .createInstance(Components.interfaces.nsISyncStreamListener);  
  let uri = aMessageHeader.folder.getUriForMsg(aMessageHeader);  
  messenger.messageServiceFromURI(uri)  
           .streamMessage(uri, listener, null, null, false, "");  
  let folder = aMessageHeader.folder;  
  return folder.getMsgTextFromStream(listener.inputStream,  
                                     aMessageHeader.Charset,  
                                     65536,  
                                     32768,  
                                     false,  
                                     true,  
                                     { });  
}  

function sendmail(json){
	console.log("send Mail:");
	console.log(json);
	    var sURL="mailto:"+to+"?subject="+subject+"&cc=dipu@linux&"+"&body="+body;  
  
  // Set the data of the message
let compFields = Components.classes["@mozilla.org/messengercompose/composefields;1"].createInstance(Components.interfaces.nsIMsgCompFields);
//compFields.from = "dipu@linux";
console.log("Fields:");
var to=false,cc=false,bcc=false,subject=false,body=false;

if(json.hasOwnProperty('to')){
	compFields.to = json.to;
	to=true;
}
if(json.hasOwnProperty('cc')){
	compFields.cc = json.cc;
	cc=true;
}
if(json.hasOwnProperty('bcc')){
	compFields.bcc = json.bcc;
	body=true;
}
if(json.hasOwnProperty('subject')){
	compFields.subject = json.subject;
	subject=true;
}
if(json.hasOwnProperty('body')){

console.log("json body:"+json.body);

	json.body=decodeURIComponent(json.body);
	compFields.body = json.body+"\r\n";
	body=true;
}

console.log(to+cc+subject+body);

if(to && subject && body){
//compFields.forcePlainText = false;
//compFields.useMultipartAlternative = false;
//compFields.characterSet = 'UTF-8';
let msgComposeParams = Components.classes["@mozilla.org/messengercompose/composeparams;1"].createInstance(Components.interfaces.nsIMsgComposeParams);
msgComposeParams.composeFields = compFields;
console.log("compFields:");
console.log(compFields);
console.log(json.to+json.cc+json.subject+json.body);

let gMsgCompose = Components.classes["@mozilla.org/messengercompose/compose;1"].createInstance(Components.interfaces.nsIMsgCompose);
let msgSend = Components.classes["@mozilla.org/messengercompose/send;1"].createInstance(Components.interfaces.nsIMsgSend);
Components.utils.import("resource:///modules/mailServices.js");
let am = MailServices.accounts;
gMsgCompose.initialize(msgComposeParams);
gMsgCompose.SendMsg(msgSend.nsMsgDeliverNow,
                    am.defaultAccount.defaultIdentity, // identity
                    am.defaultAccount, // account
                    null, // message window
                    null); // nsIMsgProgress
	console.log("msg send yooo");
	Msg=" to:"+json.to+" subject:"+json.subject;
	LastSent="Last mail sent to:"+json.to+" with subject: "+json.subject+" ";
	
	startup(Msg);
	console.log("Yoo Working fine: Dipu");

	}else{
		Msg=" redirect mail subject not matched: "
		startup(Msg);
	}
}
