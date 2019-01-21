/**
 * Created by hoangthao on 18/02/16.
 */
/*
 * Framework modification
 */
//Add support VI word wrap for LabelTTF
cc.LabelTTF._lastEnglish = /[a-zA-Z0-9áàạảãăắằặẳẵâấầậẩẫÁÀẠẢÃĂẮẰẶẲẴÂẤẦẬẨẪóòọỏõôốồộổỗơớờợởỡÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠéèẹẻẽêếềệểễÉÈẸẺẼÊẾỀỆỂỄúùụủũưứừựửữÚÙỤỦŨƯỨỪỰỬỮíìịỉĩÍÌỊỈĨýỳỵỷỹÝỲỴỶỸđĐ.]+$/;
cc.LabelTTF._firsrEnglish = /^[a-zA-Z0-9áàạảãăắằặẳẵâấầậẩẫÁÀẠẢÃĂẮẰẶẲẴÂẤẦẬẨẪóòọỏõôốồộổỗơớờợởỡÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠéèẹẻẽêếềệểễÉÈẸẺẼÊẾỀỆỂỄúùụủũưứừựửữÚÙỤỦŨƯỨỪỰỬỮíìịỉĩÍÌỊỈĨýỳỵỷỹÝỲỴỶỸđĐ.]/;


//Allow scroll from canvas
cc.inputManager.mouseWheelListener = null;
cc.inputManager.DOMMouseScrollListener = null;

cc.inputManager.registerMouseScrollSystemEvent = function (element) {
    var selfPointer = this;
    this.mouseWheelListener = function (event) {
        var pos = selfPointer.getHTMLElementPosition(element);
        var location = selfPointer.getPointByEvent(event, pos);

        var mouseEvent = selfPointer.getMouseEvent(location,pos,cc.EventMouse.SCROLL);
        mouseEvent.setButton(event.button);
        mouseEvent.setScrollData(0, event.wheelDelta);
        cc.eventManager.dispatchEvent(mouseEvent);

        event.stopPropagation();
        event.preventDefault();
    };
    element.addEventListener("mousewheel", this.mouseWheelListener, false);

    this.DOMMouseScrollListener = function(event) {
        var pos = selfPointer.getHTMLElementPosition(element);
        var location = selfPointer.getPointByEvent(event, pos);

        var mouseEvent = selfPointer.getMouseEvent(location,pos,cc.EventMouse.SCROLL);
        mouseEvent.setButton(event.button);
        mouseEvent.setScrollData(0, event.detail * -120);
        cc.eventManager.dispatchEvent(mouseEvent);

        event.stopPropagation();
        event.preventDefault();
    };

    /* firefox fix */
    element.addEventListener("DOMMouseScroll", this.DOMMouseScrollListener, true);
};

cc.inputManager.removeMouseScrollSystemEvent = function (element) {
    element.removeEventListener("mousewheel", this.mouseWheelListener);
    element.removeEventListener("DOMMouseScroll", this.DOMMouseScrollListener);
};


initBkFwUtil = function (element) {
    //TODO: Remove disable scroll event from CocosFW
    element.removeEventListener("mousewheel", arguments.callee);
    element.removeEventListener("DOMMouseScroll", arguments.callee);
    element.addEventListener("click", function(event)
    {
        element.blur(function() {
            element.focus();
        });
    });
};