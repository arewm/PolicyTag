
function hasClass(element, cls) {
    return (' ' + element.attr('class') + ' ').indexOf(' ' + cls + ' ') > -1;
}
function add_to_workspace(tag_div_clone) {
    var tag_id = tag_div_clone.attr("id")
    tag_div_clone.attr("id", "drag-" + tag_id);
    tag_div_clone.addClass('moved-me');
    var close = $('<button type="button" class="close" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>');
    close.appendTo(tag_div_clone);
    close.on("click", function() {
        $(this).parent().remove()
    });
    tag_div_clone.appendTo('#workspace');
    var formId = "pol-" + tag_id;
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "tag");
    input.setAttribute("id", formId);
    input.setAttribute("value", tag_id);
    document.getElementById('policy_specification').appendChild(input);
    tag_div_clone.on("remove", function() {
        var removeId = "#" + formId;
        $(removeId).remove();
    });
    tag_div_clone.draggable({
        containment: "#workspace"
    });
}
function makeDraggable() {
    $('.move-me').draggable({
        helper: "clone",
        revert: "invalid",
        appendTo: "body"
    }).click(function () {
        //var b = parseInt($(this).width());
        //$(this).css('width', b + 5);
    });
    $('.moved-me').draggable({

    });
    $('#workspace').droppable({
        accept: function(d) {
            if(d.hasClass("move-me")||(d.hasClass("moved-me"))||d.hasClass("removable-me")) {
                return true;
            }
        },
        drop: function (e, u) {
            src = u.draggable;
            var testId = "#drag-" + src.attr("id");
            if ($(testId).length){

            }
            else if (hasClass(src, 'move-me')) {
                var a = u.helper.clone();//.attr("id", "drag-" + src.attr("id"));
                a.removeClass('move-me');
                add_to_workspace(a);
                a.addClass('moved-me');
                //console.log("INFO: Accepted: ", a.attr("class"));
                /*a.css("z-index", 1000);
                a.appendTo("#workspace");
                var formId = "pol-" + src.attr("id");
                var input = document.createElement("input");
                input.setAttribute("type", "hidden");
                input.setAttribute("name", "tag");
                input.setAttribute("id", formId);
                input.setAttribute("value", src.attr("id"));
                document.getElementById('policy_specification').appendChild(input);
                a.on("remove", function() {
                    var removeId = "#" + formId;
                    $(removeId).remove();
                });
                a.draggable({
                    containment: "#workspace"
                });*/
            } else if (hasClass(src, 'moved-me')) {
                src.removeClass('moved-me');
                src.addClass('removable-me');
            }

        }

    });
    $('#trash').droppable({
        accept: '.removable-me',
        drop: function(event, ui) {
            ui.draggable.remove();
        }

    });
    $(document).click(function () {
        if ($(".dropped").length) {
            // Disabled Resize on all elements when #drop
            $(".ui-resizable").resizable("destroy");
        }
    });
}
$(document).ready(function () {
    makeDraggable();
});
