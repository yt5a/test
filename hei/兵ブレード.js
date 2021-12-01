  var canvas;
  var ctx;
  var width;
  var height;
  var mouseX;
  var mouseY;
  var ons;

  //canvas_touch
  var c_time = 1

  // 図形の描画
  var path = [[200,200],[400,200],[400,400],[200,400]];//座標データ
  var line = [-1,10000,[]];
  var tri = {"get":false,"path":[0,0],"set":[0,0]}
  var mouse_st = false
  var mouse_e = 10;
  var scale = 1;
  var put_on = false
  var col = "gray"

  //save
  var short_save = ""
  var save_path = []
  var save_log = []
  console.log(save_path)

  //move
  var moves = {};
  moves.ori = get_path()
  moves.now = []
  moves.act = {
    "1":{"type":1,"set":{"x":100,"y":200,"t":0.3}},
    "2":{"type":1,"set":{"x":150,"y":0,"t":0.5}},
    "3":{"type":1,"set":{"x":-200,"y":100,"t":0.3}}
  }
  moves.task = 0

  //move_line
  mline=[]

  function move_line(){
    var set = [get_path()]
    for (key in moves.act) {
      var get = moves.act[key]
      if (get.type == 1) {
        st=get.set
        oz = set.slice(-1)[0].map(function(a){
          return [(a[0]+st.x*scale),
                  (a[1]+st.y*scale)]});
        set.push(oz)
      }
    }
    mline = set
  }

/*------------------------------------------------------------*/
  // 初期化処理
  function reload() {
    canvas = document.getElementById('canvas');

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
    canvas_event(true)
    key_event()

    //canvas_time
    drawtime = setInterval(drawing, 10);
  };

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
    //console.log(ori)
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
    line_get()//マウスより最寄りの辺を取得
  });
}

/*button_event------------------------------------------------*/
function stop(){
  clearInterval(drawtime);
  drawtime = setInterval(drawing, 10);
  canvas_event(true)
}

function move_act(){
  var set = []
  var p = [0,0]
  for (key in moves.act) {
    var get = moves.act[key]
    if (get.type == 1) {
      st=get.set
      for (var i = 0; i < st.t*100; i++) {
        set.push([(st.x/(st.t*100)*i)*scale+p[0]+tri.set[0],
        (st.y/(st.t*100)*i)*scale+p[1]+tri.set[1]])
      }
      p=[st.x*scale+p[0],st.y*scale+p[1]]
    }
  }
  moves.task = set.length

  return set
}

function backs(){
  if (save_path.length>=1) {
    console.log(save_path.length)
    console.log(path)
    //Object.assign(path,save_path[save_path.length-1]);
    path=save_path[save_path.length-1]
    save_log.push(save_path[save_path.length-1])
    save_path.pop()
  }
}

function mouse_sizes(){
  var mouse_slide = document.getElementById('mouse_slide');
  mouse_e=Number(mouse_slide.value)
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
      for (var i = 1; i < mline.length; i++) {
        moves.act[i].set.x=mline[i][0][0]-mline[i-1][0][0]
        moves.act[i].set.y=mline[i][0][1]-mline[i-1][0][1]
      }
      //move_line()
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


  function inner_get(){//最寄りの線
    var len = path.length;
    var set = [[width,0],[width*-1,0],[0,height],[0,height*-1]];
    var has = []
    for (var ii = 0; ii < set.length; ii++) {
      var get =[]
      for (var i = 0; i < len; i++) {
        var AB = [path[i],path[(i+1)%len]];
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

  function drawing() {
    //背景
    ctx.fillStyle = 'rgb(0,0,0)';
		ctx.fillRect(0, 0,canvas.width, canvas.height);

    //図形
    if (put_on==false) {
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
          var xx=(path[i][0]-mouseX+tri.set[0])**2+(path[i][1]-mouseY+tri.set[1])**2
          if (mouse_e**2>=xx) {
            paps[i]=[path[i][0]- mouseX+tri.set[0],path[i][1]- mouseY+tri.set[1]]
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

/*------------------------------------------------------------*/
  // 初期化イベント
  window.addEventListener('load',reload, false);
/*------------------------------------------------------------*/

//js_gif
function get_path(){
  var get = []
  for (var i = 0; i < path.length; i++) {
    get.push([path[i][0],path[i][1]])
  }
  return get
}
/*
function move_path(){
  moves.ori =　get_path()//原点
  moves.now =　get_path()//現在地
  return moves
}*/
