var lastTag = null;
var customCount = 0;

$(document).ready(function () {
    var frm = $('#custom_tag');
    frm.submit(function () {
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: frm.serialize(),
            success: function (data) {
                // we have successfully submitted, so make the policy tag
                var resp = data;
                var customTag = $('#custom-' + resp.category);
                if (resp.new === 'true') {
                    var viewableText = lastTag.clone();
                    viewableText.html(resp.text);
                    viewableText.removeClass("write-in-me");
                    viewableText.addClass("move-me ui-draggable ui-draggable-handle");
                    viewableText.attr("id", resp.id);
                    // append the custom tag element and replace the current custom tag with the new one
                    customTag.parent().append(lastTag);
                    customTag.replaceWith(viewableText);
                    makeDraggable();
                } else {
                    alert("This tag already exists!");
                    customTag.replaceWith(lastTag);
                }
                lastTag = null;
            },
            error: function (data) {
                alert("Something went wrong!" + data);
                var customTag = $('#custom-' + resp.category);
                customTag.replaceWith(lastTag);
                lastTag = null;
            }
        });
        return false;
    });
});

function divClicked() {
    lastTag = $(this);
    var editableText = $("<textarea />");
    editableText.attr("id", lastTag.attr("id"));
    editableText.val("");
    $(this).replaceWith(editableText);
    editableText.focus();
    // setup the blur event for this new textarea
    editableText.blur(editableTextBlurred);
}

function submitCustomTag(category, text) {
    var tag = document.createElement("input");
    var cat = document.createElement("input");
    //var per = document.createElement("input");
    tag.setAttribute("type", "hidden");
    tag.setAttribute("name", "tag");
    tag.setAttribute("value", text);

    cat.setAttribute("type", "hidden");
    cat.setAttribute("name", "category");
    cat.setAttribute("value", category);

    //per.setAttribute("type", "hidden");
    //per.setAttribute("name", "person");
    //per.setAttribute("value", );
    document.getElementById('custom_tag').appendChild(tag);
    document.getElementById('custom_tag').appendChild(cat);
    //document.getElementById('custom_tag').appendChild(per);
    frm = $('#custom_tag').submit();
    frm.children().each( function() {
        if ($(this).attr('name') !== 'csrfmiddlewaretoken') {
            $(this).remove();
        }
    })
    //frm[0].reset();
}

function editableTextBlurred() {
    var html = $(this).val().trim();
    //var viewableText = lastTag.clone();
    // setup the click event for this new div
    lastTag.click(divClicked);
    if (html !== "") {
        // determine what category we are in
        var category = lastTag.attr('id').slice(7);
        // submit the custom tag
        submitCustomTag(category, html);
    } else {
        $(this).replaceWith(lastTag);
    }
}

$(document).ready(function() {
    $(".write-in-me").click(divClicked);
});