$(function(){

  // 获取数据
  var database = [];
  $.getJSON('./database.json')
      .done(function(data){
        database = data;
        
    
      

  //     {
  //   "filename": "./musics/下雨天.mp3",
  //   "duration": "04:13",
  //   "title": "下雨天",
  //   "album": "优の良曲 南搞小孩 新歌 精选",
  //   "artist": "南拳妈妈"
  // }
   
    // 模拟数据
    // var database = [
    // 	{name:'趁你还年轻',author:'华晨宇',duration:'2',src:'./musics/1.mp3'},
    // 	{name:'父亲',author:'古巨基',duration:'2',src:'./musics/2.mp3'},
    // 	{name:'去大理',author:'黄渤',duration:'2',src:'./musics/3.mp3'}
    // ]

    // 全局变量
    var  audio = $('audio').get(0);
    // 播放按钮
    var play =$('.play_bt');
    // 音量按钮
    var volume = $('#spanmute');
    var index;


    // 正在播放歌曲样式 信息加载
    var music_name = $('#music_name');
    var singer_name = $('#singer_name');
    var ptime = $('#ptime');
    var musicop = $('#musicop');
    var qiehuan = function(){
       $('#cc li').removeClass('play_current');
       $('#cc li[index="'+index+'"]').addClass('play_current');
       var now = database[index];
       music_name.text(now.title);
       singer_name.text(now.artist);
       ptime.text(now.duration);
       musicop.css('display','block');
    }
    
    // 单曲播放暂停
    play.on('click',function(){
    	if(audio.paused){
        var num = index?index:0;
    		audio.src=database[num].filename;
    	    audio.play();
          index = num;
    	}else{
    		audio.pause();
    	}
      qiehuan();
    	
    })

    // 播放暂停样式
    audio.onplay = function(){	
    	play.addClass('pause_bt').removeClass('play_bt');

    }
     audio.onpause = function(){
     	play.addClass('play_bt').removeClass('pause_bt');

    }

    // 音量控制
    // 记录当前音量
    var nowvolume;
    volume.on('click',function(){

    	if(audio.volume==0){
    		audio.volume=nowvolume;
    	}else{
    		audio.volume=0;
    	}
    })

    // 音量条控制
    var volume_bar = $('.volume_bar');
    var volume_regulate = $('.volume_regulate');
    var volume_op = $('.volume_op');
    volume_regulate.on('click',function(e){
    	audio.volume=e.offsetX/$(this).width();
    	nowvolume = audio.volume;
    })


    // 音量按钮样式
    audio.onvolumechange = function(){
    	volume_bar.width(audio.volume*100+'%');
    	volume_op.css('left',audio.volume*100+'%');
    	if(audio.volume==0){
    		volume.addClass('volume_mute').removeClass('volume_icon');
    	}else{
    		volume.addClass('volume_icon').removeClass('volume_mute');
    	
    	}
    }
    // 进度条控制
    var play_current_bar = $('.play_current_bar');
    var progress_op =$('.progress_op');
    var player_bar = $('.player_bar');
    player_bar.on('click',function(e){
       	audio.currentTime=e.offsetX/$(this).width()*audio.duration;
         if(audio.paused){
         	audio.play();
         }
    })
    audio.ontimeupdate = function(){
         play_current_bar.width(audio.currentTime/audio.duration*100+'%');
         progress_op.css('left',audio.currentTime/audio.duration*100+'%');
       }

    // 循环模式
    var divselect = $('#divselect');
    var btnPlayway = $('#btnPlayway');
    btnPlayway.on('click',function(){
    	divselect.css('display','block');
    })

    divselect.on('click',function(e){
    	var element = e.target;
    	btnPlayway.attr('class',$(element).attr('class'));
    	divselect.css('display','none');
    })

    // 循环模式
    audio.onended = function(){
      // 列表
    if(btnPlayway.attr('class')=='cycle_bt'){
      if(index==database.length-1){
        index = -1;
      }
      var src = database[index+1].filename
      audio.src = src;
      audio.play();
      index = index+1;
      qiehuan();
    }
    
    
    // 单曲
    if(btnPlayway.attr('class')=='cycle_single_bt'){
      var src = database[index].filename
      audio.src = src;
      audio.play();
      qiehuan();
    }
    // 随机
    if(btnPlayway.attr('class')=='unordered_bt'){
      index = Math.floor(Math.random()*database.length);
      var src = database[index].filename
      audio.src = src;
      audio.play();
      qiehuan();
    }
    
    // 顺序
    
     if(btnPlayway.attr('class')=='ordered_bt'){
      if(index==database.length-1){
        index = -1;
      }
      var src = database[index+1].filename
      audio.src = src;
      audio.play();
      index = index+1;
      qiehuan();
    }
   }



    // 歌曲列表渲染

    var rander = function(){
      console.log(database);
      $('#cc').empty();
      // 加载列表
    	$.each(database,function(k,v){
    		var li = $('<li index="'+k+'" class="li"><strong class="music_name" title="'+v.title+'">'+v.title+'</strong>  <strong class="singer_name" title="'+v.artist+'">'+v.artist+'</strong> <strong class="play_time">'+v.duration+'</strong><div class="list_cp">  <strong class="btn_like" title="喜欢" name="" mid="004fQTu016b9W4">   <span>我喜欢</span>   </strong>   <strong class="btn_share" title="分享"> <span>分享</span> </strong>  <strong class="btn_fav" title="收藏到歌单"> <span>收藏</span> </strong>  <strong class="btn_del" title="从列表中删除"> <span>删除</span> </strong>   </div> </li>')
    	    $('#cc').append(li);
    	})
      // 列表数
      var span = $('#spansongnum1 span');
      span.text(database.length);
      // 列表删除按钮
     var btn_del = $('.btn_del');
     btn_del.on('click',function(e){
      // 删除界面
      e.stopPropagation();
      if($(this).parents('li').has('play_hover')){

      }
      $(this).parents('li').remove();
      // 删除数据表
      index = $(this).parents('li').attr('index');
      database = $.grep(database,function(v,k){
        return k!= index;    
      })
      rander();
    })
    }
    rander();

    
    // 点击列表操作
    $('#cc').on('mouseenter','li',function(){
        $('#cc li').removeClass('play_hover');
        $(this).addClass('play_hover');
    })
    $('#cc').on('mouseleave','li',function(){
        $('#cc li').removeClass('play_hover');
    })
    $('#cc').on('click','li',function(){
    	$('#cc li').removeClass('play_current');
    	$(this).addClass('play_current');
    	 index = parseInt($(this).attr('index'));
       var src = database[index].filename;
    	audio.src = src;
    	audio.play();
      qiehuan();
    })

    // 清空列表
    var clear_list = $('#clear_list');
    clear_list.on('click',function(){
      $('#cc').empty();
      database = [];
    })
  

   // 上一首
   var prevbt = $('#prevbt');
   var nextbt = $('#nextbt');

   prevbt.on('click',function(){
    console.log(index);
   	index =index-1;
   	if(index<0){
   		index= database.length-1;
   	}  	
    var src = database[index].filename;
     audio.src = src;
     audio.play();
     qiehuan();
   })

  // 下一首
   nextbt.on('click',function(){

   	index =index+1;
   	if(index>database.length-1){
   		index=0;
   	}
     var src = database[index].filename;
     audio.src = src;
     audio.play();
     qiehuan();
   })

   // 列表 收 起
   var spansongnum1 = $('#spansongnum1');
   var divplayframe = $('#divplayframe');
   spansongnum1.on('click',function(){
   	if(divplayframe.css('display')=='none'){

   	   divplayframe.css('display','block');
   	}else{
   		divplayframe.css('display','none');
   	}
   })

   var btnclose = $('#btnclose');
   btnclose.on('click',function(){
    divplayframe.css('display','none');
   })

   // 播放界面收起
   var folded_bt = $('.folded_bt');
   var divplayer = $('#divplayer');
   folded_bt.on('click',function(){
      divplayframe.css('display','none');
      divplayer.css('left','-541px');
   })

 
  })

})