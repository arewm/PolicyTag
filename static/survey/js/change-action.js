function setToggles() {
    state = $('#default-toggle').prop('checked') ? 'on' : 'off';
    $('#toggle1').bootstrapToggle(state);
    $('#toggle2').bootstrapToggle(state);
    $('#toggle3').bootstrapToggle(state);
    $('#toggle4').bootstrapToggle(state);
    $('#toggle5').bootstrapToggle(state);
}
function setAction(action, state) {
    var myId = "#" + action;
    var input = $(myId);
    if (!input.length) {
        input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "action");
        input.setAttribute("id", action);
    } else {
        input = document.getElementById(myId)
    }
    input.setAttribute("value", state);
    document.getElementById('policy_specification').appendChild(input);
}
$(function() {
    $('#default-toggle').change(function() {
        setToggles()
    });
    $('#toggle1').change(function(){
        setAction("action1", $('#toggle1').prop('checked'))
    });
    $('#toggle2').change(function(){
        setAction("action2", $('#toggle2').prop('checked'))
    });
    $('#toggle3').change(function(){
        setAction("action3", $('#toggle3').prop('checked'))
    });
    $('#toggle4').change(function(){
        setAction("action4", $('#toggle4').prop('checked'))
    });
    $('#toggle5').change(function(){
        setAction("action5", $('#toggle5').prop('checked'))
    })
});
