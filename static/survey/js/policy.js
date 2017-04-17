var policyNumber = 0;
var seconds = Date.now();

function setAction(action, state) {
    var myId = "#submit-" + action;
    var input;
    if (state === true) {
        if ($(myId).length) {
            input = document.getElementById(myId.slice(1));
        } else {
            input = document.createElement("input");
            input.setAttribute("type", "hidden");
            input.setAttribute("name", "action");
            input.setAttribute("id", myId.slice(1));
        }
        input.setAttribute("value", action);
        document.getElementById('policy_specification').appendChild(input);
    } else {
        if ($(myId).length) {
            $(myId).remove();
        }
    }

}
function clearPolicy() {
    // remove all tags from the workspace
    $('#workspace').children('.ui-draggable').each(function () {
        this.remove(); // "this" is the current element in the loop
    });
    // remove all tags from the policy specification
    $('#policy_specification').children("input[name='tag']").each(function () {
        this.remove();
    });
    // reset all toggles to default
    setToggles();
}
function copyPolicy() {
    var tagArray = $('<ul id="policy-' + policyNumber++ + '" class="list-group list-inline"/>');
    tagArray = $('<div id="policy-' + policyNumber + '" class="panel panel-default"/>').append($('<div class="panel-body" style="padding:5px;"/>'));
    $('#workspace').children('.ui-draggable').each(function () {
        var tempTag = $(this).clone();
        tempTag.removeClass('ui-draggable').removeClass('ui-draggable-dragging').removeClass('ui-draggable-handle');
        tempTag.removeClass('moved-me').removeClass('removable');
        tempTag.attr('style', '');
        tempTag.attr('id', 'policy-' + $(this).attr('id').slice(5));
        tempTag.children('button').remove()
        tagArray.children()[0].append(tempTag[0]);
    });
    $('#policies').append(tagArray);
}
function savePolicy() {
    // only continue if we have some tags
    if ($('#workspace').children('.ui-draggable').length) {
        // submit form to store in database
        $('#policy_time').attr('value', (Date.now() - seconds) / 1000);
        $('#policy_specification').submit();
        seconds = Date.now();
    }
}
$(document).ready(function () {
    var frm = $('#policy_specification');
    frm.submit(function () {
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: frm.serialize(),
            success: function (data) {
                // we have successfully submitted, so put policy into bottom div
                copyPolicy();
                // and now reset the policy
                clearPolicy();
            },
            error: function (data) {
                alert("Something went wrong!" + data);
                // and now reset the policy
                clearPolicy();
            }
        });
        return false;
    });
    setToggles();
    $('.load-policy').click(function() {
        clearPolicy();
        $(this).children().first().children().each( function() {
            var new_div = $(this).clone();
            var tag_id = $(this).attr("id");
            new_div.addClass('ui-draggable ui-draggable-handle ui-draggable-dragging');
            add_to_workspace(new_div, tag_id);
        });
        //makeDraggable();
    });
});
// function to hide linked tags
function toggleLinked(linked) {
    if ($('#' + linked + "-check").is(":checked")) {
        // we want to show if we are checked
        $('#' + linked + "-group").show()
    } else {
        $('#' + linked + "-group").hide()
    }
}
