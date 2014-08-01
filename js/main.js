/*
 * --main.js--
 * JS file for the 441 MotorSports Chassis Program.
 */

var main = function(){return{
init : function(){
    //Clear Inputs
    $("#clear_inputs_button").click(function(){
        if(confirm("Clear all inputs?")){$("input").val("");}
    });

    //Recaclulate Values
    $("#recalculate_values").click(function(){main.recaclulate_values();});
    
    //Update Values Event
    $("input").change(function(){
        //var element_id = $(this).attr("id");
        var element_class = $(this).attr("class");
        if(element_class != null){
            element_class = element_class.split(" ");
            //console.log(element_class);

            //Tire Pressure Update
            if($.inArray("tire_pressure_input", element_class) !== -1){main.update_tire_pressure_chg($(this).attr("tire"));}

            //Tire Size Update
            if($.inArray("tire_size_input", element_class) !== -1){main.update_tire_size_chg($(this).attr("tire"));}

            //Tire Temps Update
            if($.inArray("tire_temp_input", element_class) !== -1){main.update_tire_temp_avg($(this).attr("tire"));}

            //Weight Update
            if($.inArray("tire_weight_input", element_class) !== -1){main.update_weight_calc();}
        }
    });

    //Save JSON Data
    $("#save_menu_button").click(function(){
        main.save_to_json();
        $("#load_div").hide();
        $("#save_div").show();
        $("#download_json_div").html("");
        var json_data = $("#save_data_textarea").val();
        var filename = $("#track").val()+"-"+$("#session").val()+"-["+$("#date").val()+"]";
        var download_data = "text/json;charset=utf-8," + encodeURIComponent(json_data);
        $('<a href="data:' + download_data + '" download="'+filename+'.json"><button>Download JSON</button></a>').appendTo("#download_json_div");
    });

    $("#close_save_button").click(function(){$("#save_div").hide();});

    //Load JSON Data
    $("#load_menu_button").click(function(){
        $("#save_div").hide();
        $("#load_div").show();
    });
    $("#load_data_button").click(function(){
        main.load_json_data();
    });
    $("#close_load_button").click(function(){$("#load_div").hide();});
}

//Load JSON Data
,load_json_data : function(){
    var json_data = $("#load_data_textarea").val();
    var data = $.parseJSON(json_data);
    //console.log(data);
    $.each(data, function(key, item){
        $("#"+key).val(item);    
    });
    
    return;
}

//Save Data in JSON format
,save_to_json : function(){
    var data = new Object();
    $("input").each(function(key,item){
        //console.log(item.id+" --- "+$("#"+item.id).val());
        data[item.id] = $("#"+item.id).val();
    });
    json_data = JSON.stringify(data);
    //console.log(json_data);
    $("#save_data_textarea").val(json_data);

    return;
}

//Recaclculate All Values
,recaclulate_values : function(){
    //Weights
    main.update_weight_calc();
    //Pressures
    main.update_tire_pressure_chg("lf");
    main.update_tire_pressure_chg("rf");
    main.update_tire_pressure_chg("lr");
    main.update_tire_pressure_chg("rr");
    //Size
    main.update_tire_size_chg("lf");
    main.update_tire_size_chg("rf");
    main.update_tire_size_chg("lr");
    main.update_tire_size_chg("rr");
    //Temperatures
    main.update_tire_temp_avg("lf");
    main.update_tire_temp_avg("rf");
    main.update_tire_temp_avg("lr");
    main.update_tire_temp_avg("rr");
    //Stagger
    main.update_stagger_calc();
    
    return;
}

//Weight Calculations
,update_weight_calc : function(){
    var data = new Object();
    data.lf = $("#lf_tire_weight").val();
    data.rf = $("#rf_tire_weight").val();
    data.lr = $("#lr_tire_weight").val();
    data.rr = $("#rr_tire_weight").val();

    if(data.lf != "" && data.rf != "" && data.lr != "" && data.rr != ""){
        /*[Total Weight = LF + RF + LR + RR]*/
        data.total_weight = (Number(data.lf) + Number(data.rf) + Number(data.lr) + Number(data.rr));
        /*[Rear Weight = LR + RR]*/
        data.rear_weight = (Number(data.lr) + Number(data.rr));
        /*[Rear Weight % = Rear Weight / Total Weight]*/
        data.rear_weight_percent = ((data.rear_weight / data.total_weight) * 100);
        /*[Left Weight = Left Front Weight + Left Rear Weight]*/
        data.left_weight = (Number(data.lf) + Number(data.lr));
        /*[Left Weight % = Left Weight / Total Weight]*/
        data.left_weight_percent = ((data.left_weight / data.total_weight) * 100);
        /*[Cross Weight = Left Rear Weight + Right Front Weight]*/
        data.cross_weight = (Number(data.lr) + Number(data.rf));
        /*[Cross Weight % = Cross Weight / Total Weight]*/
        data.cross_weight_percent = ((data.cross_weight / data.total_weight) * 100);
        //console.log(data);
        $("#total_weight").val(data.total_weight);
        $("#cross_weight_percent").val(data.cross_weight_percent.toFixed(2));
        $("#cross_weight").val(data.cross_weight);
        $("#left_weight_percent").val(data.left_weight_percent.toFixed(2));
        $("#left_weight").val(data.left_weight);
        $("#rear_weight_percent").val(data.rear_weight_percent.toFixed(2));
        $("#rear_weight").val(data.rear_weight);
    }else{
        //Clear values if incomplete data
        $(".weight_value").val("");
    }

    return;
}

//Tire Stagger Update
,update_stagger_calc : function(){
    var data = new Object();
    data.lf_cold = $("#lf_tire_size_cold").val();
    data.lf_hot = $("#lf_tire_size_hot").val();
    data.rf_cold = $("#rf_tire_size_cold").val();
    data.rf_hot = $("#rf_tire_size_hot").val();
    data.lr_cold = $("#lr_tire_size_cold").val();
    data.lr_hot = $("#lr_tire_size_hot").val();
    data.rr_cold = $("#rr_tire_size_cold").val();
    data.rr_hot = $("#rr_tire_size_hot").val();

    if(data.lf_cold != "" && data.lf_hot != "" && data.rf_cold != "" && data.rf_hot != ""){
        /*Front Stagger Cold = Right Front Size Cold - Left Front Size Cold*/
        data.front_stagger_cold = (Number(data.rf_cold) - Number(data.lf_cold));
        /*Front Stagger Hot = Right Front Size Hot - Left Front Size Hot*/
        data.front_stagger_hot = (Number(data.rf_hot) - Number(data.lf_hot));
        //console.log(data);
        $("#front_stagger_cold").val(data.front_stagger_cold);
        $("#front_stagger_hot").val(data.front_stagger_hot);
    }else{
        //Clear values if incomplete data
        $(".stagger_front_value").val("");
    }

    if(data.lr_cold != "" && data.lr_hot != "" && data.rr_cold != "" && data.rr_hot != ""){
        /*Rear Stagger Cold = Right Rear Size Cold - Left Rear Size Cold*/
        data.rear_stagger_cold = (Number(data.rr_cold) - Number(data.lr_cold));
        /*Rear Stagger Hot = Right Rear Size Hot - Left Rear Size Hot*/
        data.rear_stagger_hot = (Number(data.rr_hot) - Number(data.lr_hot));
        //console.log(data);
        $("#rear_stagger_cold").val(data.rear_stagger_cold);
        $("#rear_stagger_hot").val(data.rear_stagger_hot);
    }else{
        //Clear values if incomplete data
        $(".stagger_rear_value").val("");
    }

    return;
}

//Tire Pressure Change
,update_tire_pressure_chg : function(tire){
    var data = new Object();
    data.cold = $("#"+tire+"_tire_pressure_cold").val();
    data.hot =$("#"+tire+"_tire_pressure_hot").val();    
    
    if(data.cold != "" && data.hot != ""){
        /*[Pressure Change = Hot Tire Pressure - Cold Tire Pressure]*/
        data.chg = (data.hot - data.cold);
        //console.log(data);
        $("#"+tire+"_tire_pressure_chg").val(data.chg);
    }else{
        //Clear values if incomplete data
        $("#"+tire+"_tire_pressure_chg").val("");
    }
    
    return;
}

//Tire Size Change
,update_tire_size_chg : function(tire){
    var data = new Object();
    data.cold = $("#"+tire+"_tire_size_cold").val();
    data.hot = $("#"+tire+"_tire_size_hot").val();

    if(data.cold != "" && data.hot != ""){
        /*[Tire Size Change = Hot Tire Size - Cold Tire Size]*/
        data.chg = (data.hot - data.cold);
        //console.log(data);
        $("#"+tire+"_tire_size_chg").val(data.chg.toFixed(2));
    }else{
        //Clear values if incomplete data
        $("#"+tire+"_tire_size_chg").val("");
    }

    //Recalculate Front/Rear Stagger if values are available
    main.update_stagger_calc();
    
    return;    
}

//Tire Temp Average
,update_tire_temp_avg : function(tire){
    var data = new Object();
    data.out = $("#"+tire+"_tire_temp_out").val();
    data.mid = $("#"+tire+"_tire_temp_mid").val();
    data.in = $("#"+tire+"_tire_temp_in").val();

    if(data.out != "" && data.mid != "" && data.in != ""){
        /*[Tire Temp Average = (OUT + MID + IN) / 3]*/
        data.avg = (Number(data.out) + Number(data.mid) + Number(data.in)) / Number(3);
        //console.log(data);
        $("#"+tire+"_tire_temp_avg").val(data.avg.toFixed(2));
    }else{
        //Clear values if incomplete data
        $("#"+tire+"_tire_temp_avg").val("");
    }
    
    return;
}
}}();

$(document).ready(function(){main.init();});
