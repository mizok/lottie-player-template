// 預防IE出錯
if (window.console == undefined) {var em = function() {};window.console = { log: em, debug: em, info: em, warn: em };}
if (typeof(console) == '') {var em = function() {};console = { log: em, debug: em, info: em, warn: em };}
if (console.log == undefined || console.log == 'undefined') {var em = function() {};console.log = em;}
if (console.debug == undefined || console.debug == 'undefined') {var em = function() {};console.debug = em;}
if (console.info == undefined || console.info == 'undefined') {var em = function() {};console.info = em;}
if (console.warn == undefined || console.warn == 'undefined') {var em = function() {};console.warn = em;}
// end : 預防IE出錯

var includeHTML = function(cb) {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      file = elmnt.getAttribute("include-html");
      if (file) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            elmnt.removeAttribute("include-html");
            w3.includeHTML(cb);
          }
        }      
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
      }
    }
    if (cb) cb();
};

//===========   bindingEvent function     ===========//
function bindingEvent(){
var _isResize = false,
    _isWindowScroll = false;
var _initial = [
    $bodyHandler
    ,$bootstrapPopupEvent
    ,$player
];
var _onResize = [],
    _onWindowScroll = [],
    _onBodyClick  = [];

//判斷手機為body新增class
if(isMobile){$('body').addClass('isMobile');}

//初始所有initial function
$.each(_initial,function(i,o){
    o.keyDom = $(o.key);
    o.keyHas = o.keyDom.length >0;
    if(!o.hasOwnProperty('templateCache')){
        o.templateCache = [];
    }
    if(!o.hasOwnProperty('templateData')){
        o.templateData = [];
    }
    if(o.hasOwnProperty('initial')){
        o.initial();
    }
    //判斷此物件是否有要resize的function
    if(o.hasOwnProperty('onResize')){
        _onResize.push(o);
    }
    //判斷此物件是否有有window scroll handling的function
    if(o.hasOwnProperty('onWindowScroll')){
        _onWindowScroll.push(o);
    }
    //判斷此物件是否有有element onScroll的function
    if(o.hasOwnProperty('onSelfScroll')){
        o.keyDom.data('isSelfScroll',false);
        o.keyDom.on('scroll',function(){
            if(!o.keyDom.data('isSelfScroll')){
                o.keyDom.data('isSelfScroll',true);
                setTimeout(function(){
                    o.onSelfScroll();
                    o.keyDom.data('isSelfScroll',false);
                },200);
            }
        })
    }
    //判斷此物件是否有有onMouseWheel的function(需要另外安裝jquery mouseWheel 補丁)
    if(o.hasOwnProperty('onMouseWheel')){
        var lastWheelDate = new Date(); 
        o.keyDom.data('lastWheelDate',lastWheelDate);
        o.keyDom.on('mousewheel',function(e){
            var e_0 = e;
            o.onMouseWheel(e_0);
        })
    }
    //判斷此物件是否有有element onTouchmove的function
    if(o.hasOwnProperty('onTouchmove')){
        o.keyDom.data('touched',false);
        o.keyDom.data('isTouchMove',false);
        o.keyDom.data('lastTouchStartLoc',[0,0]);
        o.keyDom.data('lastTouchEndLoc',[0,0]);
        o.keyDom.data('lastTouchEndDate',0);
        o.keyDom.on('touchstart',function(e){
            o.keyDom.data('isTouchMove',false);
            o.keyDom.data('touched',true);
            var lastTouchStartDate = new Date(); 
            var locX = e.originalEvent.touches[0].pageX; 
            var locY = e.originalEvent.touches[0].pageY; 
            o.keyDom.data('lastTouchStartDate',lastTouchStartDate);
            o.keyDom.data('lastTouchStartLoc',[locX,locY]);
        })
        o.keyDom.on('touchend',function(e){
            var touched = o.keyDom.data('touched');
            if(touched){
                var locX = e.originalEvent.changedTouches[0].pageX; 
                var locY = e.originalEvent.changedTouches[0].pageY; 
                var lastTouchEndDate = new Date();
                o.keyDom.data('lastTouchEndLoc',[locX,locY]);
                var lastTouchStartLoc = o.keyDom.data('lastTouchStartLoc');
                var lastTouchEndLoc = o.keyDom.data('lastTouchEndLoc');


                function _arraysEqual(arr1, arr2) {
                    if(arr1.length !== arr2.length)
                        return false;
                    for(var i = arr1.length; i--;) {
                        if(arr1[i] !== arr2[i])
                            return false;
                    }
                
                    return true;
                }

                if(
                    !_arraysEqual(lastTouchStartLoc,lastTouchEndLoc) 
                    && (lastTouchEndDate - o.keyDom.data('lastTouchEndDate')>=100)
                )
                    {
                        o.keyDom.data('isTouchMove',true);
                        o.keyDom.data('lastTouchEndDate',lastTouchEndDate);
                        var locChangeX = o.keyDom.data('lastTouchEndLoc')[0] - o.keyDom.data('lastTouchStartLoc')[0];
                        var locChangeY =o.keyDom.data('lastTouchEndLoc')[1] - o.keyDom.data('lastTouchStartLoc')[1];
                        var duration = lastTouchEndDate - o.keyDom.data('lastTouchStartDate');
                        o.keyDom.data('touchMoveSpeedX',locChangeX/duration);
                        o.keyDom.data('touchMoveSpeedY',locChangeY/duration);

                        o.onTouchmove();
                    }
                else{
                    o.keyDom.data('isTouchMove',false);
                }
            }
        })
    }
    //判斷此物件是否有要body click的function
    if(o.hasOwnProperty('onBodyClick')){
        _onBodyClick.push(o);
    }
});

//Resize動作
$(window).resize(function(){
    if(!_isResize) {
        _isResize = true;
        setTimeout(function(){
            $windowData.width = $(window).width();
            $windowData.inHeight = window.innerHeight;
            $.each(_onResize,function(i,o){
                o.onResize();
            });
            _isResize = false;
        },200);
    }
});
//scroll動作(預設綁定debounce)
$(window).scroll(function(){
    if(!_isWindowScroll) {
        _isWindowScroll = true;
        $windowData.scrollTop = $(window).scrollTop();
        $.each(_onWindowScroll,function(i,o){
            if(o.templateCache.hasOwnProperty('scrollTimer')){
                clearTimeout(o.templateCache.scrollTimer);
            }
            var defalutDelay = 1000;
            var delay = o.templateData.hasOwnProperty('onWindowScrollHandleDelay')? o.templateData.onWindowScrollHandleDelay:defalutDelay;

            o.templateCache.scrollTimer = setTimeout(function(){
                o.onWindowScroll();
            },delay);
        });

        _isWindowScroll = false;
    }
});
//body click動作
$('body').on('click',function(){
    $.each(_onBodyClick,function(i,o){
        o.onBodyClick();
    });
});


}
//===========   bindingEvent function: end ===========//

var $windowData = {  width:     $(window).outerWidth()
                ,inHeight:    window.innerHeight
                ,scrollTop: $(window).scrollTop()
            };
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

//===========
// 版型類function初始化規則

// var $sampleFunction = {
//     key:'.elementSelect'
//     ,keyDom = $(this.key);            //自動產生
//     ,keyHas = this.keyDom.length > 0; //自動產生
//     ,initial:function(){
//         //初始需要執行的程式
//     }
//     ,onResize:function(){
//         //resize需要執行的程式
//     }
//     ,onWindowScroll:function(){
//         //scroll需要執行的程式
//     }
//     ,onBodyClick:function(){
//         //body click需要執行的程式
//     }
//     ,onTouchmove:function(){
//         //touchmove需要執行的程式
//     }
//     ,onMouseWheel:function(){
//         //mousewheel需要執行的程式
//     }
// }

var $bodyHandler = {
    key:'body'
    ,initial:function(){
        //套件 function
        pluginFunction();
        generateNull();
    }
}

var $player = {
    key:'#player'
    ,initial:function(){
        //套件 function
        var dom = this.keyDom;
        var _this = this;
        var btn_play = dom.find('.btn_play').click(function(e){
            e.preventDefault();
            _this.class_toggler($(this),'pause');
        })
        var btn_menu = dom.find('.hamburger').click(function(e){
            e.preventDefault();
            var btn_dom = $(this);
            _this.class_toggler(btn_dom,'is-active',function(){
                _this.class_toggler(btn_dom.siblings('.menu'),'active');
                _this.class_toggler(dom.find('.fx-wrapper'),'blur');
            });
        })
        // var menu = 
    }
    ,class_toggler:function(dom,class_name,cb){
        var status= {};
        status.class_added= false;
        if(!dom.hasClass(class_name)){
            dom.addClass(class_name);
            status.class_added = true;
        }
        else{
            dom.removeClass(class_name);
            status.class_added = false;
        }
        if(cb){
            cb.apply(status);
        }
        
    }
}

//=============== tool module ====================//
var $inputToggleBlock = {
    key:'[effect-input-toggle-block]'
    ,initial:function(){
        if(this.keyHas){
            this.keyDom.each(function(){
                var thisInputDom = $(this);
                var thisChangeId = thisInputDom.attr('effect-input-toggle-block');
                var thisInputName = thisInputDom.attr('name');
                function innerFunction(){
                    $('[effect-input-toggle-block-id="'+thisChangeId+'"]').each(function(){
                        var thisDomId = $(this);
                        if(thisInputDom.prop('checked')){
                            thisDomId.addClass('active');
                        }
                        else{
                            thisDomId.removeClass('active');
                        }
                    });
                }
                innerFunction();
                $('[name="'+thisInputName+'"]').change(function(){
                    innerFunction();

                });
            });
        }
    }
}
var $bootstrapPopupEvent = {
    key:'.modal'
    ,windowtop:0
    ,windowFixed: function(boolean,top){
        var htmlDom = $('html');
        if(boolean){
            htmlDom.addClass('html-fixed');
            htmlDom.css('top', '-'+top+'px');
            this.windowtop = top;
        }
        else{
            htmlDom.removeClass('html-fixed');
            htmlDom.css('top', '');
            $(window).scrollTop(top);
            this.windowtop = 0;
        }
    }
    ,modalOpen: function(){
        var _this = this;
        this.keyDom.on('show.bs.modal',  function (e) {
            var testText = e.namespace;
            if(testText === 'bs.modal'){
                var scrolltop = _this.windowtop == 0? $windowData.scrollTop:_this.windowtop;
                _this.windowFixed(true,scrolltop);
                if($(this).find('.mega-comp-table-close').length){
                    $(window).trigger('resize');
                }
            }
        });
        this.keyDom.on('shown.bs.modal', function (e) {
            var testText = e.namespace;
            var thisPopup = $(this);
            if(testText === 'bs.modal'){
                if(thisPopup.find('.mega-comp-table-close').length){
                    $(window).trigger('resize');
                }
            }
        });
        this.keyDom.on('hide.bs.modal',  function (e) {
            var testText = e.namespace;
            if(testText === 'bs.modal'){
                _this.windowFixed(false,_this.windowtop);
                _this.windowtop = 0;
            }
        });
    }
    ,modalToMadal:function(){
        var thisModalBtn = this.keyDom.find('[effect-modal-to-madal]');
        if(thisModalBtn.length){
            thisModalBtn.on('click',function(e){
                e.preventDefault();
                var thisdom = $(this),
                    thisid = thisdom.parents('.modal').attr('id'),
                    thisParentDom = $("#"+thisid);
                    thisgoto = thisdom.attr('effect-modal-to-madal');
                thisParentDom.modal('hide');
                thisParentDom.one('hidden.bs.modal', function (e) {
                    $(thisgoto).modal('show');
                });
            });
        }
    }
    ,initial:function(){
        this.modalOpen();
        this.modalToMadal();
    }
}
var $handleInput = {
    key:'[effect-handle-input="true"]'
    ,binding:function(dom,data){
        var thisDom = $(dom);
        var thisData = thisDom.data('effectHandleInput');
        if(thisDom.data('effectHandleInput') != undefined){
            Object.assign(thisData, data);
        }
        else{
            thisDom.data('effectHandleInput',data);
            this._changeEvent(thisDom);
        }
    }
    ,_maxLength:function(changeInput,nowVal,max){
        if(nowVal.length > max){
            var output = {
                 val:nowVal
                ,max:max
            }
            changeInput.trigger('UT.handleInput.maxLength.false',[output]);
        }
    }
    ,_minLength:function(changeInput,nowVal,min){
        if(nowVal.length < min){
            var output = {
                 val:nowVal
                ,min:min
            }
            changeInput.trigger('UT.handleInput.minLength.false',[output]);
        }
    }
    ,_maxNum:function(changeInput,nowVal,max){
        var num = parseFloat(nowVal);
        if(num != NaN && num > max){
            var output = {
                 val:nowVal
                ,max:max
            }
            changeInput.trigger('UT.handleInput.maxNum.false',[output]);
        }
    }
    ,_minNum:function(changeInput,nowVal,min){
        var num = parseFloat(nowVal);
        if(num != NaN && num < min){
            var output = {
                 val:nowVal
                ,min:min
            }
            changeInput.trigger('UT.handleInput.minNum.false',[output]);
        }
    }
    ,_checkNumType:function(changeInput,nowVal,val){
        var num = parseFloat(nowVal);
        if(num != NaN){
            var type = num>0?'pos':(num=0?'zreo':'nega');
            changeInput.trigger('UT.handleInput.minNum.'+type,[num]);
        }
    }
    ,_changeEvent:function(thisInput){
        var _this = this;
        var isChange = false;
        thisInput.change(function(){
            if(!isChange){
                isChange = true;
                var changeInput = $(this);
                var nowVal = changeInput.val();
                var thisData = changeInput.data('effectHandleInput');
                $.each(thisData,function(key,val){
                    if(_this.hasOwnProperty('_'+key)){
                        _this['_'+key].apply(null,[changeInput,nowVal,val]);
                    }
                });
                isChange = false;
            }
        });
    }
    ,_eachEvent:function(){
        var _this = this;
        if(this.keyHas){
            this.keyDom.each(function(i,o){
                var thisInput    = $(o);
                var maxLength    = parseInt(thisInput.attr('effect-handle-input-maxLength')),
                    minLength    = parseInt(thisInput.attr('effect-handle-input-minLength')),
                    maxNum       = parseInt(thisInput.attr('effect-handle-input-maxNum')),
                    minNum       = parseInt(thisInput.attr('effect-handle-input-minNum')),
                    checkNumType = thisInput.attr('effect-handle-input-checkNumType') == 'true';

                var effectHandleInput = {};

                if(maxLength != NaN){
                    effectHandleInput['maxLength'] = maxLength;
                }
                if(minLength != NaN){
                    effectHandleInput['minLength'] = minLength;
                }
                if(maxNum != NaN){
                    effectHandleInput['maxNum'] = maxNum;
                }
                if(minNum != NaN){
                    effectHandleInput['minNum'] = minNum;
                }
                if(checkNumType){
                    effectHandleInput['checkNumType'] = checkNumType;
                }

                thisInput.data('effectHandleInput',effectHandleInput);
                _this._changeEvent(thisInput);
            });
        }
    }
    ,initial:function(){
        this._eachEvent();
    }
}
var $inLinkHref = {
    key: '[in-link-href]'
    ,initial:function(){
        if(this.keyHas){
            this.keyDom.each(function(i,o){
                $(o).on('click',function(e){
                    e.preventDefault();
                    window.location = $(this).attr('in-link-href');
                });
            });
        }
    }
}
//=============== tool: end ===============//
//===========   GardenUtils function     ===========//
function listChinese(){
    var domList = $('[effect-list-chinese]');
    if(domList.length > 0){
        domList.each(function(){
            var thisList = $(this);
            // var thisListAttr = thisList.attr('effect-list-chinese').split(/[^\\](?=\+)/);
            var thisListAttr = thisList.attr('effect-list-chinese').split(/\+/);
            var thisListAttrLength = thisListAttr.length;
            var listType = [];

            var spanStyle  = thisListAttrLength >= 2?'<span class="effect-list-span">'+thisListAttr[0]:'<span class="effect-list-span">';
            var addSpanEnd = thisListAttrLength == 3?addSpanEnd = thisListAttr[2]:'';
            var endSign = thisList.attr('effect-list-chinese-end-sign');
            function _isEmpty(val){
                var status ='';
                var _boolean = (val === undefined || val == null) ? true : false;
                if(val === undefined){
                    status = 'string-undefined';
                }
                else if(val == null){
                    status = 'string-null';
                }
                else if(val.length <= 0){
                    status = 'string-no-length';
                }
                else{
                    status = 'string-not-empty';
                    
                }
                
                return [_boolean,status];
            }

            // 將字串轉為array並逐字判斷全半形並賦予class以調整長度
            function _getLength(ele){
                var eleSpanArray = ele.text().split("");
                var eleSpanLength = 0;
                // console.log(numSpanArray);
                eleSpanArray.forEach(function(character){
                    if(character.match(/[\x00-\xff]/g)){
                        eleSpanLength+=0.5;
                        // console.log(i+':0.5');
                    }
                    else if(character.match(/[^\x00-\xff]/g)){
                        eleSpanLength+=1;
                        // console.log(i+':1');
                    }
                });
                if(Math.ceil(eleSpanLength)-eleSpanLength!=0){
                    
                    eleSpanLength = Math.floor(eleSpanLength)+'-half';
                }
                return eleSpanLength;
            }

            if(_isEmpty(endSign)[0]){
                endSign = '、';
            }
            if(endSign=='noSign'){
                endSign = ''
            }

            var thisType = thisListAttr[Math.floor(thisListAttrLength/2)];
            if(thisType == 'big' || thisType == 'small'){
                
                if(thisType == 'big'){
                    listType = ["零","壹","貳","參","肆","伍","陸","柒","捌","玖","拾","佰","仟"];
                }
                else{
                    listType = ["○","一","二","三","四","五","六","七","八","九","十","百","千"];
                }
                thisList.children('li').each(function(i,o){

                    var thisObj = $(o);
                    var indexNum = i+1;
                    var indexArray = (indexNum+'').split('');
                    var indexArrayLength = indexArray.length;
                    var spanText = '';
                    var textTen = listType[10];
                    var texthundred = listType[11];
                    // console.log(indexArray );
                    if(indexArrayLength < 2){
                        spanText = listType[indexNum];
                    }
                    else{
                        var oneNumNum = parseInt(indexArray.pop());
                        var tenNumNum = parseInt(indexArray.pop());
                        var hundredNumNum = parseInt(indexArray.pop());
                        var oneNem =  oneNumNum === 0? '':listType[oneNumNum];
                        if(indexArrayLength < 3){
                            var tenNum = tenNumNum === 0? '':( tenNumNum === 1?'':listType[tenNumNum] )+textTen;
                            spanText = tenNum + oneNem;
                        }
                        else{
                            var tenNum = tenNumNum === 0? listType[tenNumNum]:listType[tenNumNum]+textTen;
                            if(indexNum%100===0){tenNum =''}
                            spanText = listType[hundredNumNum] +texthundred+ tenNum +oneNem;
                        }
                    }
                    thisObj.prepend(spanStyle+ spanText+addSpanEnd+endSign+"</span>");
                    var numSpan = thisObj.find('span').first();
                    thisObj.addClass("effect-list-chinese-"+_getLength(numSpan));
                    // console.log(numSpan.text().length);
                });
            }
            else if(thisType === 'number'){
                // 全形數字專用
                String.prototype.halfToFull = function () {
                    var temp = "";
                    for (var i = 0; i < this.toString().length; i++) {
                        var charCode = this.toString().charCodeAt(i);
                        if (charCode <= 126 && charCode >= 33) {
                            charCode += 65248;
                        } else if (charCode == 32) { // 半形空白轉全形
                            charCode = 12288;
                        }
                        temp = temp + String.fromCharCode(charCode);
                    }
                    return temp;
                };
                thisList.children('li').each(function(i,o){
                    var thisObj = $(o);
                    var str = (i+1)+'';
                    var indexNum = str.halfToFull();
                    console.log(indexNum);
                    thisObj.prepend(spanStyle+ indexNum+addSpanEnd+endSign+"</span>");
                    var numSpan = thisObj.find('span').first();
                    thisObj.addClass("effect-list-chinese-"+_getLength(numSpan));
                });
            }
        });
    }
}

//===========   GardenUtils function: end===========//

//=========== tool function ===============//
function generateNull(){
    var body = $('body');
    var shadow_existence = $('.shadow-null').length;
    if(!shadow_existence){
        var shadow_null=$('<div class="shadow-null"></div>').css({
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'z-index': '-9999999999999999999999999999999',
            'pointer-events':'none'
        }).clone();
        body.prepend(shadow_null);
    }
    else if(shadow_existence){
        var size = [$('.shadow-null').width(),$('.shadow-null').height()];
        return size;
    }
}
function debounce(func, wait, immediate) {
   var timeout;
   return function() {
      var context = this, args = arguments;
      var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
       var callNow = immediate && !timeout;
       clearTimeout(timeout);
       timeout = setTimeout(later, wait);
       if (callNow) func.apply(context, args);
   };
};
function throttle(func, threshhold) {
   var last, timer;
   if (threshhold) threshhold = 250;
   return function () {
     var context = this
     var args = arguments
     var now = +new Date()
     if (last && now < last + threshhold) {
     clearTimeout(timer)
     timer = setTimeout(function () {
       last = now
       func.apply(context, args)
     }, threshhold)
     } else {
     last = now
     fn.apply(context, args)
     }
   }
}

//=========== tool function:end ===============//

//===========   plugin function ============//
function pluginFunction(){

}
//===========   plugin function: end =======//















