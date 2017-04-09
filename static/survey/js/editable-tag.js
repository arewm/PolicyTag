var lastTag = null;
var customCount = 0;

function divClicked() {
    lastTag = $(this);
    var editableText = $("<textarea />");
    editableText.val("");
    $(this).replaceWith(editableText);
    editableText.focus();
    // setup the blur event for this new textarea
    editableText.blur(editableTextBlurred);
}

function editableTextBlurred() {
    var html = $(this).val().trim();
    var viewableText = lastTag.clone();
    // setup the click event for this new div
    lastTag.click(divClicked);
    if (html !== "") {
        // change the properties of the node we are adding
        var newId = viewableText.attr("id") + "-" + customCount++;
        viewableText.html(html);
        viewableText.removeClass("write-in-me");
        viewableText.addClass("move-me ui-draggable ui-draggable-handle");
        viewableText.attr("id", newId);

        // append the custom tag element and replace the current custom tag with the new one
        $(this).parent().append(lastTag);
        $(this).replaceWith(viewableText);
        makeDraggable();
    } else {
        $(this).replaceWith(lastTag);
    }
    lastTag = null;
}

$(document).ready(function() {
    $(".write-in-me").click(divClicked);
});