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
function copyPolicy() {
    $('#workspace').children('.tag-properties').each(function() {
        var tag_id = $(this).attr('id');
        var formId = "pol-" + tag_id;
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "tag");
        input.setAttribute("id", formId);
        input.setAttribute("value", tag_id);
        document.getElementById('policy_specification').appendChild(input);
    })
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
function savePolicy() {
    // only continue if we have some tags
    if ($('#workspace').children('.ui-draggable').length) {
        // submit form to store in database
        $('#policy_time').attr('value', (Date.now() - seconds) / 1000);
        copyPolicy();
        //$('#policy_specification').submit();
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
                // we have successfully submitted, so clear the policy
                clearPolicy();
                // fill in the next policy if there are any

                // otherwise, enable the link to go to the next page
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
            new_div.addClass('ui-draggable ui-draggable-handle ui-draggable-dragging');
            add_to_workspace(new_div);
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
