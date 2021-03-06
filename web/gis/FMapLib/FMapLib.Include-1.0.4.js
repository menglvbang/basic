/** 
 * @namespace FMap的所有library类均放在FMapLib命名空间下
 */
var FMapLib = window.FMapLib = FMapLib || {};
(function() {	
//以下为引入API正式文件的处理过程，参考MapLib-6.1.3-10027.js
    var isWinRT = (typeof Windows === "undefined") ? false : true;
    var r = new RegExp("(^|(.*?\\/))(FMapLib.Include-1.0.4\.js)(\\?|$)"),
    s = document.getElementsByTagName('script'),
    src, m, baseurl = "";
    for(var i=0, len=s.length; i<len; i++) {
        src = s[i].getAttribute('src');
        if(src) {
            var m = src.match(r);
            if(m) {
                baseurl = m[1];
             if(baseurl=="10.15.6.35"){
           		baseurl=" 223.98.189.5";//映射到外网
             }
                break;
            }
        }
    }
    function inputScript(inc){
        if (!isWinRT) {
            var script = '<' + 'script type="text/javascript" src="' + inc + '"' + '><' + '/script>';
            document.writeln(script);
        } else {
            var script = document.createElement("script");
            script.src = inc;
            document.getElementsByTagName("HEAD")[0].appendChild(script);
        }
    }
    function inputCSS(style){
        if (!isWinRT) {
            var css = '<' + 'link rel="stylesheet" href="' + baseurl + '../theme/css/' + style + '"' + '><' + '/>';
            document.writeln(css);
        } else { 
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href =  "/theme/css/" + style;
            document.getElementsByTagName("HEAD")[0].appendChild(link);
        }
    }
    //加载类库资源文件，可扩展
    function loadFMLibs() {    	
    	//MapLib基础类 	
    	inputScript(baseurl+"sm/libs/MapLib.Include.js");
    	//应用接口配置类
    	inputScript(baseurl+"FMap-ports.js");
    	//房测地图扩展类
    	inputScript(baseurl+'theme/js/jquery-1.4.2.min.js');
    	inputScript(baseurl+'theme/js/jquery.mousewheel.js');
    	inputScript(baseurl+'FMap-1.0.4-1.js');
        inputScript(baseurl+'FMap-1.0.4-2.js');    
        inputScript(baseurl+'theme/js/jquery.ui.core.js');
        inputScript(baseurl+'theme/js/jquery.ui.widget.js'); 
        inputScript(baseurl+'proj4js-combined.js');        
    }
    loadFMLibs();
})();