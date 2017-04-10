var lastTag = null;
var customCount = 0;

$(document).ready(function () {
    var frm = $('#custom_tag');
    console.log('submit #custom_tag');
    console.log(frm);
    frm.submit(function () {
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: frm.serialize(),
            success: function (data) {
                // we have successfully submitted, so make the policy tag
                // TODO finish this!
                // TODO will have to move code up from lower down to create the policy tag
                console.log(data);
                var resp = json.parse(data);
                viewableText.html(resp.text);
                viewableText.removeClass("write-in-me");
                viewableText.addClass("move-me ui-draggable ui-draggable-handle");
                viewableText.attr("id", resp.id);
                var customTag = $('#custom-' + resp.category);
                customTag.parent().append(lastTag);
                customTag.replaceWith(viewableText);
                makeDraggable();
            },
            error: function (data) {
                console.log('error');
                alert("Something went wrong!" + data);
                // and now reset the policy
            }
        });
        return false;
    });
});

function divClicked() {
    lastTag = $(this);
    var editableText = $("<textarea />");
    editableText.val("");
    $(this).replaceWith(editableText);
    editableText.focus();
    // setup the blur event for this new textarea
    editableText.blur(editableTextBlurred);
}

function submitCustomTag(category, text) {
    var tag = document.createElement("input");
    var cat = document.createElement("input");
    var per = document.createElement("input");
    tag.setAttribute("type", "hidden");
    tag.setAttribute("name", "tag");
    tag.setAttribute("value", text);

    cat.setAttribute("type", "hidden");
    cat.setAttribute("name", "category");
    cat.setAttribute("value", category);

    per.setAttribute("type", "hidden");
    per.setAttribute("name", "person");
    per.setAttribute("value", '');
    document.getElementById('custom_tag').appendChild(tag);
    document.getElementById('custom_tag').appendChild(cat);
    document.getElementById('custom_tag').appendChild(per);
    $('custom_tag').submit();
    $('custom_tag')[0].reset();
}

function editableTextBlurred() {
    var html = $(this).val().trim();
    //var viewableText = lastTag.clone();
    // setup the click event for this new div
    lastTag.click(divClicked);
    if (html !== "") {
        // determine what category we are in
        var category = lastTag.attr('id').slice(7);
        submitCustomTag(category, html);

        // append the custom tag element and replace the current custom tag with the new one
        //$(this).parent().append(lastTag);
        //$(this).replaceWith(viewableText);
        //makeDraggable();
    } else {
        $(this).replaceWith(lastTag);
    }
    lastTag = null;
}

$(document).ready(function() {
    $(".write-in-me").click(divClicked);
});