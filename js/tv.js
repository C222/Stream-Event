left_bar = document.getElementById("leftbar");
loader = document.getElementById("loader");
to_load = 0;
channels = [];
filter = "";

function set_view(c)
{
	x = document.getElementById("content")
	
	try{document.getElementById("live_embed_player_flash").remove();}catch(err){}
	try{document.getElementById("chat_embed").remove();}catch(err){}
	
	// console.log(c);
	o = document.createElement("object");
	o.setAttribute("type", "application/x-shockwave-flash");
	o.setAttribute("id", "live_embed_player_flash");
	o.setAttribute("height", String(window.innerHeight-105)+"px");
	o.setAttribute("width", String(window.innerWidth-650)+"px");
	o.setAttribute("data", "http://www.twitch.tv/widgets/live_embed_player.swf?channel="+c);
	o.setAttribute("bgcolor", "#000");
	
	p1 = document.createElement("param");
	p1.setAttribute("name", "allowFullScreen");
	p1.setAttribute("value", "true");
	o.appendChild(p1);
	
	p2 = document.createElement("param");
	p2.setAttribute("name", "allowScriptAccess");
	p2.setAttribute("value", "always");
	o.appendChild(p2);
	
	p3 = document.createElement("param");
	p3.setAttribute("name", "allowNetworking");
	p3.setAttribute("value", "all");
	o.appendChild(p3);
	
	p4 = document.createElement("param");
	p4.setAttribute("name", "movie");
	p4.setAttribute("value", "http://www.twitch.tv/widgets/live_embed_player.swf");
	o.appendChild(p4);
	
	/*p5 = document.createElement("param");
	p5.setAttribute("name", "movie");
	p5.setAttribute("value", "http://www.twitch.tv/widgets/live_embed_player.swf");
	o.appendChild(p5);*/
	
	p6 = document.createElement("param");
	p6.setAttribute("name", "flashvars");
	p6.setAttribute("value", "hostname=www.twitch.tv&channel="+c+"&auto_play=true");
	o.appendChild(p6);
	
	i = document.createElement("iframe");
	i.setAttribute("frameborder", "0");
	i.setAttribute("scrolling", "no");
	i.setAttribute("id", "chat_embed");
	i.setAttribute("src", "http://twitch.tv/chat/embed?channel="+c+"&amp;popout_chat=true");
	i.setAttribute("height", String(window.innerHeight-105)+"px");
	i.setAttribute("width", "330px");
	
	x.appendChild(o);
	x.appendChild(i);
	document.title = c;
}

window.addEventListener("resize", function(){
	o=document.getElementById("live_embed_player_flash");
	i=document.getElementById("chat_embed");
	i.setAttribute("height", String(window.innerHeight-105)+"px");
	o.setAttribute("height", String(window.innerHeight-105)+"px");
	o.setAttribute("width", String(window.innerWidth-650)+"px");});

function append_label(parent, label)
{
	y = document.createElement("div");
	cn = document.createElement("p");
	
	y.setAttribute( "class", "channel" );
	cn.innerHTML = label;
	
	parent.appendChild(y);
	y.appendChild(cn);
}

function append_channel(parent, name, color, logo, desc)
{
	a = document.createElement("a");
	y = document.createElement("div");
	i = document.createElement("img");
	rs = document.createElement("div");
	cn = document.createElement("p");
	g = document.createElement("p");
	cb = document.createElement("input");
	
	a.setAttribute( "onClick", "set_view('"+name+"');" );
	
	rs.setAttribute( "class", "rightside" );
	
	y.setAttribute( "class", "channel" );
	cn.innerHTML = name;
	cn.className = "title";
	
	i.setAttribute("src", logo);
	g.innerHTML = desc;
	
	cb.setAttribute("type", "checkbox");
	cb.setAttribute("value", name);
	cb.className = "multi";
	
	parent.appendChild(a);
	a.appendChild(y);
	y.appendChild(i);
	y.appendChild(rs);
	rs.appendChild(cn);
	rs.appendChild(g);
	parent.appendChild(cb);
}
function one_channel(data)
{
	// console.log(data);
	if(data == null || data.channel == null)
	{
		// alert("Error loading");
		return;
	}
	na = data.channel.display_name;
	
	d = data.channel.status;
	c = "#0A0";
	l = data.preview.small;
	
	 append_channel(left_bar, na, c, l, d);
	 // console.log(to_load);
	 to_load -= 1;
}

function fill_bar(channels)
{
	to_load = channels.length;
	append_label(left_bar, '<form action="javascript:refresh_list()"><input type="submit" value="Refresh"/></form><form action="javascript:make_multi()"><input type="submit" value="Multitwitch"/></form>');
	for(c in channels)
	{
		one_channel(channels[c]);
	}
	append_label(left_bar,"<br/>");
	append_label(left_bar,"<br/>");
}

function refresh_list()
{
	x = document.getElementsByClassName("channel");
	to_load = channels.length;
	// console.log(x)
	while(x.length>0)
	{
		x[0].remove();
		x = document.getElementsByClassName("channel");
	}
	x = document.getElementsByClassName("multi");
	// console.log(x)
	while(x.length>0)
	{
		x[0].remove();
		x = document.getElementsByClassName("multi");
	}
	//append_label(left_bar, '<form action="javascript:refresh_list()"><input type="submit" value="Refrdfgshdfesh"/></form>');
	channels = [];
	$.getJSON("https://api.twitch.tv/kraken/streams?game=DayZ&callback=?", get_next_page);
}

function get_next_page(data)
{
	loader.style.visibility="visible";
	if (data.streams.length > 0)
	{
		$.each(data.streams, function(i, s){
			if('status' in s.channel && s.channel.status.indexOf(filter) != -1)
			{
				channels.push(s);
			}
		});
		// console.log(data);
		$.getJSON(data._links.next+"&callback=?", get_next_page);
	}
	else
	{
		// console.log("Done!");
		loader.style.visibility="collapse";
		fill_bar(channels);
	}
}

function get_game_filtered(game, fil)
{
	filter = fil;
	$.getJSON("https://api.twitch.tv/kraken/streams?game="+game+"&callback=?", get_next_page);
}

function make_multi()
{
	checked_s = [];
	$.each($(".multi"), function(i,x){
		if(x.checked)
		{
			checked_s.push(x.value);
		}
	});
	console.log("http://multitwitch.tv/"+checked_s.join("/"));
	window.open("http://multitwitch.tv/"+checked_s.join("/"), '_blank');
}
