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
                // we have successfully submitted, so clear the policy
                clearPolicy();
                var category_label = $('#category-list');
                category_label.children('.tag-properties').each(function() {$(this).remove()});
                // fill in the next policy if there are any
                if (data.more) {
                    var work = $('#workspace');
                    for (var i =0; i<data.tags.length; i++){
                        var tag = data.tags[i];
                        var tag_div = $('<div class="tag-properties"/div>');
                        tag_div.attr('id', tag.tag_id);
                        tag_div.addClass(tag.category);
                        tag_div.html(tag.text);
                        work.append(tag_div);
                    }
                    for (var i=0; i<data.categories.length; i++) {
                        // add each of the categories in the policy
                        var c = data.categories[i];
                        var cat = $('<div>');
                        cat.addClass(c.name).addClass('tag-properties');
                        cat.attr('data-toggle', 'tooltip').attr('title', c.help_text).attr('data-placement', 'top');
                        cat.html(c.name).tooltip();

                        category_label.append(cat);
                    }
                    $('.progress-bar').attr('aria-valuenow', data.percent).attr('style', 'width:' + data.percent +'%').html('Policy Generation: ' + data.percent + '% Complete');
                } else {
                    // otherwise, enable the link to go to the next page
                    var button = $('#next_button');
                    button.show();
                    button.prop("disabled", false);
                    $('.progress-bar').hide();
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
