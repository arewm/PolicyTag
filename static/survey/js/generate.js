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
    $('#workspace').children('.tag-properties').each(function () {
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
    if ($('#workspace').children('.tag-properties').length) {
        // submit form to store in database
        $('#policy_time').attr('value', (Date.now() - seconds) / 1000);
        copyPolicy();
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
                console.log(data);
                // we have successfully submitted, so clear the policy
                clearPolicy();
                // fill in the next policy if there are any
                if (data.more === "True") {
                    var work = $('#workspace');
                    for (var i =0; i<data.tags.length; i++){
                        //<div id="{{ t.tag_id }}" class="{{ t.tag_class }} tag-properties">{{ t.text }}</div>
                        var tag = data.tags[i];
                        var tag_div = $('<div class="tag-properties"/div>');
                        tag_div.attr('id', tag.tag_id);
                        tag_div.addClass(tag.tag_class);
                        tag_div.html = tag.text;
                        work.append(tag_div);
                    }
                } else {
                    // otherwise, enable the link to go to the next page
                    var button = $('#next_button');
                    button.style.display = "";
                    button.disabled = false
                }
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
