$(document).ready(function(){
	var regid = "APA91bEGgIQJg_FKAkvUs_g2FnmDZS94UrA8snkexTGUe25GHVBHhD5rwphkhqUtOj69UBRHDwUEwAauYgyoCAamH_1969OTvYhidy1PLR_JwJjH_CVo9t0tDLvKIxFa-xV-1CwZD3XNoLQb7T1M63akz5aAVALqFxa4CoRkOc6KFMmvcUBDQrc";

	var auth = "key=AIzaSyB0XNmPC5IHXDc9aVX4rSDRZOD2w0UskVM";
	$("#boton").click(function(){
		$.ajax({
            url: 'https://android.googleapis.com/gcm/send',
            type: 'POST',
            Authorization: auth,
            'content-type' : 'application/json',
            data: JSON.stringify({
                "data":{
                	"title":"Test title",
                	"message":"Test Message"
                },
                "registration_ids":[regid]

            })
        });
        alert("json posted!");
	});
});