$("document").ready(function(){
    $("#buttReg").click(function(){
        var user = $("#correo").val();
        console.log(user);
        data = {
            "data":{
                "Clave": "Valor"
            }
        };
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/register/"+user,
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(r) {
            }
        });


    });

    $("#getReg").click(function(){
        console.log("He pulsado el boton.");

        $.get("http://localhost:8080/registered",function(data){
            for(i= 0; i<data.length<i++){
                console.log(data[i]);
            }
        });
    });
});