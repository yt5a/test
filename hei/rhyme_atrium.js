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
    document.getElementById('colors').addEventListener('input', function(){
      if (col_set==0) {
        back_color=this.value;
      }else if (col_set>=1) {
        //document.getElementsByName('layer_col').item(col_set-1).style.color=this.value
        document.getElementsByName('layer_col').item(col_set-1).style.backgroundColor=this.value
        col[col_set-1]=this.value;
      }
      //col = this.value;
    });
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
    date_set=setting()[n]
    console.log(date_set)
    //path = date_set[0].path;//座標データ
    //back_path = date_set[1].path;
    //sel_path=[date_set[0].path,date_set[1].path]
    sel_path=date_set.map(function(v) {return v.path})
    col=date_set.map(function(v) {return v.col})
    //col.push(date_set[0].col)
    //col.push(date_set[1].col)
    //back_col = date_set[0].col;
    //col = date_set[1].col;
    back_color = date_set[0].bcol
    line_light=1

    //dog=sel_path.length-1
    dog=0
    col_set=dog+1
    //console.log(setting(2)['path'])

    if(!canvas && !canvas.getContext) {
      return false;
    }

    canvas.width = 550 ;
    canvas.height = 550 ;

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
        //mline=[]
      });
    }
    //layers=document.getElementById('layers')
    layer_set(col)
    //document.getElementById('colors').value=rgbTo16(col.item(dog).style.color)
    //color_set
    document.getElementById('colors').value=col[dog]

    //canvas上のイベント
    canvas_event(true)//クリック制限
    key_event()

    //canvas_time
    drawtime = setInterval(drawing,20);
  };
/*------------------------------------------------------------*/
/*------------------------------------------------------------*/
  function drawing() {
    var len = sel_path[dog].length
    //背景
    ctx.fillStyle = back_color;
		ctx.fillRect(0, 0,canvas.width, canvas.height);

    //ctx.fillStyle = col[0];
    /*
    ctx.beginPath();
    for (var i = 0; i < back_path.length; i++) {
      if (i==0) {ctx.moveTo(back_path[i][0]+tri.set[0],back_path[i][1]+tri.set[1]);}
      else{ctx.lineTo(back_path[i][0]+tri.set[0], back_path[i][1]+tri.set[1]);
      }
    }
    ctx.fill();
    */

    //図形
    /*
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
    /*
    ctx.beginPath();
    for (var i = 0; i < path.length; i++) {
      if (i==0) {ctx.moveTo(path[i][0]+tri.set[0], path[i][1]+tri.set[1]);}
      else{ctx.lineTo(path[i][0]+tri.set[0], path[i][1]+tri.set[1]);
      }
    }
    ctx.fill();
    */
    //図形
    for (var f = 0; f < sel_path.length; f++) {
      ctx.beginPath();
      ctx.fillStyle = col[f];
      if(sel_path[f][0].length==2){
        for (var q = 0; q < sel_path[f].length; q++) {
          if (q==0) {ctx.moveTo(sel_path[f][q][0]+tri.set[0], sel_path[f][q][1]+tri.set[1])}
          else{ctx.lineTo(sel_path[f][q][0]+tri.set[0], sel_path[f][q][1]+tri.set[1])}
        }
      }else if(sel_path[f][0].length==3){
        ctx.arc(sel_path[f][0][0],sel_path[f][0][1],sel_path[f][0][2],0,360*Math.PI/180,false);
      }
      ctx.fill();
    }
    //線
    if (line_light>=1) {
      for (var i = 0; i < len; i++) {
        ctx.beginPath () ;
        ctx.moveTo(sel_path[dog][i][0]+tri.set[0],sel_path[dog][i][1]+tri.set[1]);
        ctx.lineTo(sel_path[dog][(i+1)%len][0]+tri.set[0],sel_path[dog][(i+1)%len][1]+tri.set[1])
        ctx.strokeStyle = "black";
        //context.lineWidth = 10 ;
        ctx.stroke() ;
      }
    }

    //design
    design()

    //mouse_pointer
    if (mouse_st == true) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouseX,mouseY,mouse_e,0 * Math.PI/180,
         360*Math.PI/180,false);
      ctx.fillStyle = "white";
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.restore();
      ctx.save();
    }
  };

  function design() {
    if (ons==true) {
      for (key in pap) {
        sel_path[dog][key][0]=mouseX+pap[key][0]
        sel_path[dog][key][1]=mouseY+pap[key][1]
      }
    }else{

      if (line[0]>=0) {
        var paps={}
        for (var i = 0; i < sel_path[dog].length; i++) {
          var xx=(sel_path[dog][i][0]+tri.set[0]-mouseX)**2+(sel_path[dog][i][1]+tri.set[1]-mouseY)**2
          if (mouse_e**2>=xx) {
            paps[i]=[sel_path[dog][i][0]+tri.set[0]-mouseX,sel_path[dog][i][1]+tri.set[1]-mouseY]
          }
        }
        if (!Object.keys(paps).length&&line[1]<=mouse_e+2) {//垂線交点が存在する。垂線がマウスの範囲にある
          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = "blue";
          ctx.arc(line[2][0]+tri.set[0],line[2][1]+tri.set[1],5,0,
             360*Math.PI/180,false);
          ctx.fill();
          ctx.strokeStyle = "red";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
          ctx.save();
        }else{
          for (key in paps) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(mouseX+paps[key][0],mouseY+paps[key][1],5,0,
               360*Math.PI/180,false);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 1;
            ctx.stroke();
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
    for (var i = 0; i < sel_path[dog].length; i++) {
      var a = Math.round(sel_path[dog][i][0]/(scale*10)*10)
      var b = Math.round(sel_path[dog][i][1]/(scale*10)*10)
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
    sel_path[dog]=path_scale(ori,scale,c)

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
    save_log.push(sel_path)
    sel_path=save_path[save_path.length-1]
    save_path.pop()
  }
}

function nexts(){
  if (save_log.length>=1) {
    save_path.push(sel_path)
    sel_path=save_log[save_log.length-1]
    save_log.pop()
  }
}

function mouse_sizes(){
  mouse_e=Number(document.getElementById('mouse_slide').value)
}

function on_layer(){
  var lay = document.getElementsByName('layer');
  var lay_c = document.getElementsByName('layer_col');
  for (let i = 0; i < lay.length; i++){
    if (lay.item(i).checked){
      if (dog == lay.item(i).value) {
        line_light*=-1
      }else{
        line_light=1
      }
      dog = lay.item(i).value;
      col_set = Number(lay.item(i).value)+1;
      document.getElementById('colors').value=rgbTo16(lay_c.item(i).style.backgroundColor)
    }
  }
  //[...Array(lay.length-1).keys()].map(function(v) {lay.item(v).blur()});
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
      for (var i = 0; i < sel_path[dog].length; i++) {
        var xx=(sel_path[dog][i][0]-mouseX+tri.set[0])**2+(sel_path[dog][i][1]-mouseY+tri.set[1])**2
        if (mouse_e**2>=xx) {
          ons = true

          short_save = gets_path()
          save_log = []

          pap[i]=[sel_path[dog][i][0]- mouseX,sel_path[dog][i][1]- mouseY]
        }
      }

      if(!Object.keys(pap).length && line[1] <= mouse_e+2){
        ons = true

        short_save = gets_path()
        save_log = []

        var id = line[0]+1
        sel_path[dog].splice(id,0,line[2]);
        pap[id]=[sel_path[dog][id][0]- mouseX,sel_path[dog][id][1]- mouseY]
      }

      if (ons==false) {//判定が無い
        tri.get=true
        tri.path=[mouseX-tri.set[0],mouseY-tri.set[1]]
      }

      //----------color
      var result = sel_path.map(function( value ) {
          return inner_get(value);
      });
      if (result.some(function(val){return val == true})==true) {
        /*
        var v = result.lastIndexOf(true)
        col_set=v+1
        document.getElementById('colors').value=col[v]
        */
      }else{
        col_set=0
        document.getElementById('colors').value=back_color
      };
      //----------
      /*
      if (inner_get(sel_path[dog])==true){
        col_set=2
        document.getElementById('colors').value=col[1]
      }else if (inner_get(back_path)==true){
        col_set=1
        document.getElementById('colors').value=col[0]
      }else{
        col_set=0
        document.getElementById('colors').value=back_color
      }
      */
    }else if(ons==true){
      ons=false
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      save_path.push(short_save)
      sel_path[dog]=path_set(sel_path[dog])
    }
  }

  //パスの削除
  function down_eraser(){
    console.log(sel_path)
    save_path.push(gets_path())
    for (var i = 0; i < sel_path[dog].length; i++) {
      var xx=(sel_path[dog][i][0]-mouseX+tri.set[0])**2+(sel_path[dog][i][1]-mouseY+tri.set[1])**2
      xx = Math.round(xx)
      if (mouse_e**2>=xx){
        save_log = []
        sel_path[dog][i]=undefined
      }
    }
    console.log(tri.set)
    console.log(sel_path[dog])
    sel_path[dog]=sel_path[dog].filter(Boolean);
    tri.get=true;
    console.log(tri.path)
    tri.path=[mouseX-tri.set[0],mouseY-tri.set[1]];
  }

  function down_move(){
    pap = {};
    if (ons==false){
      /*
      for (var i = 0; i < mline.length; i++) {
        var xx=(mline[i][0][0]-mouseX+tri.set[0])**2+(mline[i][0][1]-mouseY+tri.set[1])**2
        if (mouse_e**2>=xx) {
          ons = true

          pap[i]=[]
          for (var ii = 0; ii < mline[i].length; ii++) {
            pap[i].push([mline[i][ii][0]- mouseX,mline[i][ii][1]- mouseY])
          }
        }
      }*/
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
    var len = sel_path[dog].length;
    var path = sel_path[dog]

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
/*更新時
  window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    event.returnValue = '';
  });
  */
  // 初期化イベント
  //window.setTimeout(function(){reload()},10)
  //window.addEventListener('load',reload, false);
/*------------------------------------------------------------*/

//js_gif
/*function get_path(){
  var get = []
  for (var i = 0; i < sel_path[dog].length; i++) {
    get.push([sel_path[dog][i][0],sel_path[dog][i][1]])
  }
  return get
}*/
function gets_path(){
  var gets = []
  var get = []
  for (var i = 0; i < sel_path.length; i++) {
    get = []
    for (var ii = 0; ii < sel_path[i].length; ii++) {
      get.push([sel_path[i][ii][0],sel_path[i][ii][1]])
    }
    gets.push(get)
  }
  return gets
}

function layer_shuffle(a,b){
  var layer = document.getElementById("layers")

  var el_a = layer.children[a].innerHTML
  var el_b = layer.children[b].innerHTML

  layer.children[a].innerHTML=el_b
  layer.children[b].innerHTML=el_a

  var val= layer.children[a].children
  for (var i = 0; i < layer.children.length; i++) {
    layer.children[i].children[0].value=i
  }

  var el = sel_path[a]
  sel_path[a] = sel_path[b]
  sel_path[b] = el
  var co = col[a]
  col[a] = col[b]
  col[b] = co

  dog = b
}
