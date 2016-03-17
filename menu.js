/*
 *	Graphene Context Menu
 *	Written by Trevor J Hoglund and Savoron
 *	Mar 17, 2016
 */

Element.prototype.remove = function () {
	this.parentElement.removeChild(this);
}
Element.prototype.parentAnchor = function () {
	var t = this;
	if (t == null)
		return false;
	while (t.tagName.toLowerCase() !== 'html') {
		if (typeof t.href == 'string')
			return t;
		t = t.parentElement;
	}
	return false;
}
Element.prototype.isOff = function (x, y) {
	var r = this.getBoundingClientRect(),
		a;
	y -= (a = document.documentElement.scrollTop) ? a : scrollY;
	x -= (a = document.documentElement.scrollLeft) ? a : scrollX;
	return (x < r.left || x > r.right || y < r.top || y > r.bottom);
}
objectSize = function(o) {
	var s = 0, key;
	for (key in o)
		if(o.hasOwnProperty(key))s++;
	return s;
};
function __stp__(y) {
	var a,
		c = (a = document.documentElement.scrollTop) ? a : scrollY,
		d = y - c,
		i = d / 50;
	window.scrollBy(0, d % 50);
	for (var j = 0; j < 50; j++)
		window.setTimeout(function(){window.scrollBy(0, i)}, j * 10);
}

if(typeof Graphene !== 'object') {
	var Graphene = new(function () {
		this.cm = true;
		this.v = 'm0.4.3.0039';
		this.url = 'http://gra.phene.co';
	})(),
		_g = Graphene;
}

var __cms__ = document.createElement("style");
__cms__.innerHTML	 = '#context {background:#fff;box-shadow:rgba(50, 50, 50, 0.3) 0 0 3px;width:200px;padding:2px;}';
__cms__.innerHTML	+= '.context-option {cursor:pointer;padding:3px 15px;color:#111 !important;}';
__cms__.innerHTML	+= '.context-option:hover	{background:#f8f8f8;}';
__cms__.innerHTML	+= '.context-disabled {cursor:pointer;padding:3px 15px;color:#aaa;}';
document.documentElement.appendChild(__cms__);

__cms__ = document.createElement("script");
__cms__.src = "https://cdn.rawgit.com/zenorocha/clipboard.js/v1.5.8/dist/clipboard.min.js";
document.documentElement.appendChild(__cms__);

_g.m = (_g.menu = {
	isOpen : false,
	open : function (e, o) {
		//	Do important stuff
		if (_g.m.isOpen)
			_g.m.close();
		var o = o || {};
		e.stopPropagation();
		e.preventDefault();
		var a,
			sy = (a = document.documentElement.scrollTop) ? a : scrollY,
			sx = (a = document.documentElement.scrollLeft) ? a : scrollX,
			ih = window.innerHeight,
			iw = window.innerWidth,
			my = e.pageY - sy,
			mx = e.pageX - sx;
			d = !0;
		window._g_ctx_te = e.target;
		
		//	Create the Element
		var c = document.createElement('div');
		c.id				= 'context';
		c.style.position	= 'fixed';
		c.style.zIndex		= '9999999';

		//	Link Options
		var el = e.target,
		pa, hr = false;
		if (pa = el.parentAnchor()) {
			hr = pa.href;
			c.innerHTML += '<a href="' + hr + '" target="_blank" onclick="_g.m.close();"><div class="context-option">Open Link in New Tab</div></a>';
			c.innerHTML += '<div class="context-option context-copy" onclick="_g.m.close();" data-clipboard-text="' + (hr!=''?hr:location.href) + '">Copy Link Address</div>';
			if(!/Firefox/i.test(navigator.userAgent)) c.innerHTML += '<a href="' + hr + '" onclick="_g.m.close();" download target="_blank"><div class="context-option">Save Link As...</div></a>';
			c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>';
			d = !1;
		}
		
		//	Selected Text Options
		var text = typeof window.getSelection !== "undefined" ? window.getSelection().toString() : (typeof document.selection != "undefined" && document.selection.type == "Text") ? document.selection.createRange().text : "";
		if(text !== '') {
			c.innerHTML += '<div class="context-option context-copy" onclick="_g.m.close();" data-clipboard-text="' + text + '">Copy</div>';
			c.innerHTML += '<a href="https://www.google.com/search?q=' + encodeURIComponent(text) + '" target="_blank" onclick="_g.m.close();"><div class="context-option">Search Google for "' + (text.length > 16 ? text.substring(0,15) + '...' : text) + '"</div></a>';
			c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>';
			d = !1;
		}
		
		//	Script Set Options
		for(var op in o)
			c.innerHTML += o[op] !== '' ? '<div class="context-option" onclick="' + o[op] + ';_g.m.close();">' + op + '</div>' : '<div class="context-disabled">' + op + '</div>';
		if(objectSize(o) > 0){
			c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>';
			d = !1;
		}

		//	Video Options
		if(e.target.tagName === 'VIDEO'){
			c.innerHTML += '<div class="context-option" onclick="window._g_ctx_te.p' + (e.target.paused ? 'lay' : 'ause') + '();_g.m.close();">' + (e.target.paused ? 'Play' : 'Pause') + '</div>';
			c.innerHTML += '<div class="context-option" onclick="window._g_ctx_te.muted = !window._g_ctx_te.muted;_g.m.close();">' + (e.target.muted ? 'Unmute' : 'Mute') + '</div>';
			c.innerHTML += '<div class="context-option context-copy" onclick="_g.m.close();" data-clipboard-text="' + e.target.src + '">Copy Video Source</div>';
			if(!/Firefox/i.test(navigator.userAgent)) c.innerHTML += '<a href="' + e.target.src + '" onclick="_g.m.close();" download target="_blank"><div class="context-option">Save Video As...</div></a>';
			c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>';
			d = !1;
		}
		
		//	Default Options
		if(d){
			var dops = {
				Back			: 'history.back()',
				Reload			: 'location.reload()',
				Forward			: 'history.forward()',
				"Scroll to Top"	: (sy > window.innerHeight / 2) ? '__stp__(0)' : ''
			};
			for (var op in dops)
				c.innerHTML += dops[op] !== '' ? '<div class="context-option" onclick="' + dops[op] + ';_g.m.close();">' + op + '</div>' : '<div class="context-disabled">' + op + '</div>';
			c.innerHTML += '<a href="view-source:' + window.location + '" target="_blank" onclick="_g.m.close();"><div class="context-option">View Source</div></a>';
			c.innerHTML += '<div style="margin:2px 4px;height:1px;background:#ddd;"></div>'
		}
		
		//	Dev Options
		c.innerHTML += '<a href="' + (_g.cm ? 'https://github.com/Trewbot/_g.menu/blob/master/changes.md' : _g.url + '/changes') + '" onclick="_g.m.close();"><div class="context-disabled"><i>' + (_g.cm ? 'Context Menu' : 'Graphene') + ' ' + _g.v + '</i></div></a>';

		//	Append Element
		c.style.opacity = 0;
		_g.m.isOpen = true;
		document.body.appendChild(c);
		
		//	Copy Button
		new Clipboard('.context-copy');
		
		//	Position/Show the Element
		var r	= c.getBoundingClientRect(),
			ch	= r.height,
			cw	= r.width;
		c.style.top		= ((ih > ch && my + ch > ih) ? ih - ch : (ih <= ch) ? 0 : my) + 'px';
		c.style.left	= ((iw > cw && mx + cw > iw) ? iw - cw : (iw <= cw) ? 0 : mx) + 'px';
		c.style.opacity	= 1;

		return false;
	},
	close : function(){
		if(this.isOpen){
			this.isOpen = false;
			document.getElementById('context').remove();
		}
	},
	copy : function(elementID,text){
		swfobject.embedSWF('include/copy.swf', elementID, "200", "21", "0.0.1", false, {cBoard:text}, {wMode:'transparent'}, {}, function(e){
			e.ref.style.opacity = 0;
			e.ref.style.position = 'absolute';
			e.ref.style.marginTop = '-2px';
			e.ref.style.left = '2px';
		});
	}
});

document.documentElement.oncontextmenu = _g.m.open;
window.addEventListener('blur', function(e){_g.m.close()});
window.addEventListener('scroll', function(e){_g.m.close()});
document.addEventListener('click', function (e) {
	if (_g.m.isOpen && document.getElementById('context').isOff(e.pageX, e.pageY))
		_g.m.close();
});
