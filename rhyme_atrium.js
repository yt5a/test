  var canvas;
  var ctx;
  var width;
  var height;
  var mouseX;
  var mouseY;
  var drawtime;
  var ons;
  var tri
  var c_time
  var line
  var mouse_st
  var mouse_e
  var scale
  var put_on
  var col
  var back_coler
  var back_col

  var short_save
  var save_path
  var save_log

  var path

  //canvas_touch

  // 図形の描画

/*------------------------------------------------------------*/
  // 初期化処理
  function reload(n) {
    document.getElementById('canvasBack').innerHTML="<canvas id='canvas'></canvas>";
    var ccol = document.createElement("input");
    ccol.setAttribute("type","color");
    ccol.setAttribute("id","colors");
    ccol.setAttribute("value","#000000");
    let coler = ccol;
    ccol.addEventListener('input', function(){
      if (col_set==0) {
        console.log(back_color)
        back_color=this.value;
        console.log(back_color)
      }else if (col_set==1) {
        back_col=this.value;
      }else if (col_set==2) {
        console.log(col)
        col=this.value;
        console.log(col)
      }
      //col = this.value;
    });
    document.getElementById('option1').appendChild(ccol);
    canvas = document.getElementById('canvas');
    //reset-----
    c_time = 1
    tri = {"get":false,"path":[0,0],"set":[0,0]}
    line = [-1,10000,[]];
    mouse_st = false
    mouse_e = 10;
    scale = 1;
    put_on = false
    //save
    short_save = ""
    save_path = []
    save_log = []
    //----------
    date_set=setting(n)
    console.log(date_set)
    path = date_set.path;//座標データ
    back_path = date_set.bpath;
    back_col = date_set.bcol;
    col = date_set.col;
    back_color = 'gray'
    col_set=0
    //console.log(setting(2)['path'])

    if(!canvas && !canvas.getContext) {
      return false;
    }

    canvas.width = 600 ;
    canvas.height = 600 ;

    ctx = canvas.getContext('2d');
    width = ctx.canvas.width ;
    height = ctx.canvas.height;

    //初期位置
    mouseX = width/2;
    mouseY = height/2;

    //クリックの入力状態
    ons=false

    mode=0
    op1=document.getElementById('option1').childNodes
    for (const elem of op1) {
      elem.addEventListener("change", e => {
        mode=e.target.value
        mline=[]
      });
    }

    //canvas上のイベント
    canvas_event(true)//クリック制限
    key_event()

    //canvas_time
    drawtime = setInterval(drawing, 10);
  };
/*------------------------------------------------------------*/
/*------------------------------------------------------------*/
  function drawing() {
    //背景
    ctx.fillStyle = back_color;
		ctx.fillRect(0, 0,canvas.width, canvas.height);

    ctx.fillStyle = back_col;
    ctx.beginPath();
    for (var i = 0; i < back_path.length; i++) {
      if (i==0) {ctx.moveTo(back_path[i][0]+tri.set[0],back_path[i][1]+tri.set[1]);}
      else{ctx.lineTo(back_path[i][0]+tri.set[0], back_path[i][1]+tri.set[1]);
      }
    }
    ctx.fill();

    //図形
    if (put_on==false) {
      //var c = canvas.getContext('2d');
      // 線形グラデーション
      //var g = c.createRadialGradient(mouseX,mouseY,5,mouseX,mouseY, 65);
      // 色を定義
      //g.addColorStop(0, 'white');
      //g.addColorStop(0.6, 'gray');
      //g.addColorStop(1, 'red');
      ctx.fillStyle = col;
    }else{
      ctx.fillStyle = 'blue';
    }
    //ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (var i = 0; i < path.length; i++) {
      if (i==0) {ctx.moveTo(path[i][0]+tri.set[0], path[i][1]+tri.set[1]);}
      else{ctx.lineTo(path[i][0]+tri.set[0], path[i][1]+tri.set[1]);
      }
    }
    ctx.fill();

    //design
    design()

    //mouse
    if (mouse_st == true) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouseX,mouseY,mouse_e,0 * Math.PI/180,
         360*Math.PI/180,false);
      ctx.fillStyle = "white";
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.restore();
      ctx.save();
    }
  };

  function design() {
    if (ons==true) {
      for (key in pap) {
        path[key][0]=mouseX+pap[key][0]
        path[key][1]=mouseY+pap[key][1]
      }
    }else{

      if (line[0]>=0) {
        var paps={}
        for (var i = 0; i < path.length; i++) {
          var xx=(path[i][0]+tri.set[0]-mouseX)**2+(path[i][1]+tri.set[1]-mouseY)**2
          if (mouse_e**2>=xx) {
            paps[i]=[path[i][0]+tri.set[0]-mouseX,path[i][1]+tri.set[1]-mouseY]
          }
        }
        if (!Object.keys(paps).length&&line[1]<=mouse_e+2) {//垂線交点が存在する。垂線がマウスの範囲にある
          ctx.save();
          ctx.beginPath();
          ctx.arc(line[2][0]+tri.set[0],line[2][1]+tri.set[1],3,0 * Math.PI/180,
             360*Math.PI/180,false);
          ctx.fillStyle = "white";
          ctx.fill();
          ctx.restore();
          ctx.save();
        }else{
          for (key in paps) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(mouseX+paps[key][0],mouseY+paps[key][1],3,0 * Math.PI/180,
               360*Math.PI/180,false);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.restore();
            ctx.save();
          }
        }
      }
    }
  }

/*key_event---------------------------------------------------*/
function key_event(){
  document.body.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    var c = 0
    var l =[]
    for (var i = 0; i < path.length; i++) {
      var a = Math.round(path[i][0]/(scale*10)*10)
      var b = Math.round(path[i][1]/(scale*10)*10)
      l.push([a,b])
    }
    ori = l

    if (event.key=="ArrowUp") {
      scale=(scale*10+1)/10
      c = 1
    }else if (event.key=="ArrowDown") {
      if (scale*10>=2) {
        scale=(scale*10-1)/10
        c = -1
      }
    }
    scale=Math.floor(scale*10)/10
    path=path_scale(ori,scale,c)

    if (tri.get==true && ons==false) {//縮尺座標調整
      tri.set=[mouseX -tri.path[0],mouseY -tri.path[1]]
    }
    if (event.key=="ArrowLeft") {
      backs()
    }else if (event.key=="ArrowRight") {
      nexts()
    }
    line_get()//マウスより最寄りの辺を取得
  });
}

/*button_event------------------------------------------------*/
function stop(){
  clearInterval(drawtime);
  drawtime = setInterval(drawing, 10);
  canvas_event(true)
}

function backs(){
  if (save_path.length>=1) {
    save_log.push(path)
    path=save_path[save_path.length-1]
    save_path.pop()
  }
}

function nexts(){
  if (save_log.length>=1) {
    save_path.push(path)
    path=save_log[save_log.length-1]
    save_log.pop()
  }
}

function mouse_sizes(){
  mouse_e=Number(document.getElementById('mouse_slide').value)
}
/*------------------------------------------------------------*/

  // マウス座標の更新
  function mouse_move(e) {
    mouse_st = true

    var rect = e.target.getBoundingClientRect();
    mouseX = Math.floor(e.clientX - rect.left);
    mouseY = Math.floor(e.clientY - rect.top);
    if (tri.get==true && ons==false) {//縮尺座標調整
      tri.set=[mouseX -tri.path[0],mouseY -tri.path[1]]
    }
    line_get()//マウスより最寄りの辺を取得
    //slider_change()
    /*put_on=inner_get()*/
  };
  function mouse_out(e) {
    mouse_st = false
    tri.get=false
    tri.path=[mouseX,mouseY]
  };

  function click_event(e) {
    if (tri.get==true) {
      tri.get=false
      tri.path=[mouseX,mouseY]
    }
  }


  function down_event(){
    var get = document.getElementById('option1').children
    if (get[0].firstChild.checked){
      down_edit()
    }else if(get[1].firstChild.checked){
      down_eraser()
    }else if(get[2].firstChild.checked){
      down_move()
    }
  }

  function down_edit(){
    pap = {};
    if (ons==false){
      for (var i = 0; i < path.length; i++) {
        var xx=(path[i][0]-mouseX+tri.set[0])**2+(path[i][1]-mouseY+tri.set[1])**2
        if (mouse_e**2>=xx) {
          ons = true

          short_save = get_path()
          save_log = []

          pap[i]=[path[i][0]- mouseX,path[i][1]- mouseY]
        }
      }

      if(!Object.keys(pap).length && line[1] <= mouse_e+2){
        ons = true

        short_save = get_path()
        save_log = []

        var id = line[0]+1
        path.splice(id,0,line[2]);
        pap[id]=[path[id][0]- mouseX,path[id][1]- mouseY]
      }
      if (ons==false) {
        tri.get=true
        tri.path=[mouseX-tri.set[0],mouseY-tri.set[1]]
      }
      if (inner_get(path)==true){
        col_set=2
        document.getElementById('colors').value=col
      }else if (inner_get(back_path)==true){
        col_set=1
        document.getElementById('colors').value=back_col
      }else{
        col_set=0
        document.getElementById('colors').value=back_color
      }
      console.log(col_set)
    }else{
      ons=false
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      save_path.push(short_save)
      path=path_set(path)
    }
  }

  //パスの削除
  function down_eraser(){
    save_path.push(get_path())
    for (var i = 0; i < path.length; i++) {
      var xx=(path[i][0]-mouseX+tri.set[0])**2+(path[i][1]-mouseY+tri.set[1])**2
      if (mouse_e**2>=xx){
        save_log = []
        path[i]=undefined
      }
    }
    path=path.filter(Boolean);

    tri.get=true;
    tri.path=[mouseX-tri.set[0],mouseY-tri.set[1]];
  }

  function down_move(){
    pap = {};
    if (ons==false){
      for (var i = 0; i < mline.length; i++) {
        var xx=(mline[i][0][0]-mouseX+tri.set[0])**2+(mline[i][0][1]-mouseY+tri.set[1])**2
        if (mouse_e**2>=xx) {
          ons = true

          pap[i]=[]
          for (var ii = 0; ii < mline[i].length; ii++) {
            pap[i].push([mline[i][ii][0]- mouseX,mline[i][ii][1]- mouseY])
          }
        }
      }
      if (ons==false) {
        tri.get=true
        tri.path=[mouseX-tri.set[0],mouseY-tri.set[1]]
      }
    }else{
      ons=false
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var set = {}
    }
  }


/*------------------------------------------------------------*/
  function line_get(){//最寄りの線
    line = [-1,10000,[]];
    var len = path.length;

    for (var i = 0; i < len; i++) {
      //点A,Bの間の角度
      var AB = Math.atan2(path[(i+1)%len][1] - path[i][1],path[(i+1)%len][0] - path[i][0])* 180 / Math.PI;
      //点Aからマウスポインターの間の角度
      var AM = Math.atan2((mouseY-tri.set[1]) - path[i][1],(mouseX-tri.set[0]) - path[i][0])* 180 / Math.PI;
      //点Bからマウスポインターの間の角度
      var BM = Math.atan2((mouseY-tri.set[1]) - path[(i+1)%len][1],(mouseX-tri.set[0]) - path[(i+1)%len][0])* 180 / Math.PI;

      var AMR = Math.abs(AM - AB)
      var BMR = Math.abs(BM - AB)

      if (AMR <= 90 && BMR >= 90 || AMR >= 90 && BMR <= 90) {
        //Math.sqrt((Ax-Bx)**2+(Ay-By)**2)
        var ABL = Math.sqrt((path[(i+1)%len][0]-path[i][0])**2+(path[(i+1)%len][1]-path[i][1])**2)
        var AML = Math.sqrt(((mouseX-tri.set[0])-path[i][0])**2+((mouseY-tri.set[1])-path[i][1])**2)
        var BML = Math.sqrt(((mouseX-tri.set[0])-path[(i+1)%len][0])**2+((mouseY-tri.set[1])-path[(i+1)%len][1])**2)
        var x =(AML**2-BML**2+ABL**2)/2/ABL
        var pp=Math.floor(Math.sqrt(AML**2 - x**2))

        var xpa = Math.round(Math.abs(x/(ABL))*100)/100;
        var mp = [path[i][0]+(Math.round(path[(i+1)%len][0] - path[i][0]))*xpa,
        path[i][1]+(Math.round(path[(i+1)%len][1] - path[i][1]))*xpa]
        if (pp<=line[1]) {
          line[0]=i
          line[1]=pp
          line[2]=mp
        }
      }
    }
  }


  function inner_get(list){//最寄りの線
    var len = list.length;
    var set = [[width,0],[width*-1,0],[0,height],[0,height*-1]];
    var has = []
    for (var ii = 0; ii < set.length; ii++) {
      var get =[]
      for (var i = 0; i < len; i++) {
        var AB = [list[i],list[(i+1)%len]];
        var MT =[[mouseX-tri.set[0],mouseY-tri.set[1]],
        [mouseX+set[ii][0]-tri.set[0],mouseY+set[ii][1]-tri.set[1]]]

        get.push(missing_line(AB[0],AB[1],MT[0],MT[1]))
      }
      has.push((get.filter(i => i == true).length)%2 != 0)
    }
    return has.every(function(k){return k == true})
  }


  function path_set(li){//近似値の支点の結合
    var ll = li
    var join=[]
    var len = li.length
    for (var i = 0; i < len; i++) {
        var x1 = Math.abs((li[(i+1)%len][0]+1) - li[i][0])
        var y1 = Math.abs((li[(i+1)%len][1]+1) - li[i][1])
        var x2 = Math.abs((li[(i+2)%len][0]+1) - li[i][0])
        var y2 = Math.abs((li[(i+2)%len][1]+1) - li[i][1])
        if (((x1>=4 || y1 >= 4) && (x2 >=4 || y2 >= 4))) {
          join.push(ll[i])
        }
    }
    return join
  }

  function path_scale(li,s,c){
    var get=[]
    var o = (s*10+c)/(s*10)
    for (var i = 0; i < li.length; i++) {
      var a = li[i][0]*s
      var b = li[i][1]*s
      get.push([a,b])
    }
    return get
  }

  function canvas_event(c){
    c_time *= -1
    if (c_time==-1) {
      canvas.addEventListener('mousemove', mouse_move, false);
      canvas.addEventListener('mouseleave', mouse_out, false);
      canvas.addEventListener('click',click_event, false);
      canvas.addEventListener('mousedown', down_event, false);
    }else if(c_time==1){
      canvas.removeEventListener('mousemove', mouse_move, false);
      canvas.removeEventListener('mouseleave', mouse_out, false);
      canvas.removeEventListener('click',click_event, false);
      canvas.removeEventListener('mousedown', down_event, false);
    }
  }


/*------------------------------------------------------------*/
  window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    event.returnValue = '';
  });
  // 初期化イベント
  //window.setTimeout(function(){reload()},10)
  //window.addEventListener('load',reload, false);
/*------------------------------------------------------------*/

//js_gif
function get_path(){
  var get = []
  for (var i = 0; i < path.length; i++) {
    get.push([path[i][0],path[i][1]])
  }
  return get
}
