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

  var img

  //canvas_touch

  // 図形の描画

/*------------------------------------------------------------*/
  // 初期化処理
  function reload(n) {
    document.getElementById('colors').addEventListener('input', function(){
      if (col_set>=1) {
        document.getElementsByName('layer_col').item(col_set-1).style.backgroundColor=this.value
        sel_path[col_set-1].col=this.value;
      }
    });
    canvas = document.getElementById('canvas');
    //reset-----
    c_time = 1
    tri = {"get":false,"path":[0,0],"set":[0,0]}
    line = [-1,10000,[]];
    mouse_st = false
    mouse_e = 10;//マウスの大きさ
    scale = 1;
    put_on = false
    //save
    short_save = ""
    save_path = []
    save_log = []

    point = []
    //----------
    date_set = ""
    //setTimeout(function(){date_set=setting()},100)
    date_set=setting()//パスデータの取得
    date_set=date_set[n]

    sel_path=date_set.map(function(v) {return {path:v.path,col:v.col} })
    //col=date_set.map(function(v) {return v.col})
    back_set = [date_set[0].bcol]
    line_light=1

    dog=0//レイヤー番号
    col_set=dog+1

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
    layer_set(sel_path)//外部ファイル：レイヤーのセット

    document.getElementById('colors').value=sel_path[dog].col

    //canvas上のイベント
    canvas_event(true)//クリック制限
    key_event()//key_,eventの設定
    var fileReader = new FileReader() ;

		fileReader.onload = function() {
			var dataUri = this.result ;
		}
    img = "インターフィールド.png"

    imgs = new Image();
    imgs.src = img;// 画像のURLを指定
    img = imgs
    back_set.push(img)
    /*back_set.onload = () => {
    //ctx.drawImage(chara, 0, 0);
  　};*/

    //canvas_time
    //drawtime = setInterval(drawing,20);
    drawing()
  };
/*------------------------------------------------------------*/
/*------------------------------------------------------------*/
  function drawing() {
    if (sel_path[dog]) {
      var len = sel_path[dog].length
    }
    //reset
    ctx.fillStyle = "white";
		ctx.fillRect(0, 0,canvas.width, canvas.height);
    //背景
    if (back_set[0] instanceof HTMLElement){
      ctx.drawImage(back_set[0],0,0);
    }else{
    ctx.fillStyle = back_set[0];
		ctx.fillRect(0, 0,canvas.width, canvas.height);
    }
    //画像

    //図形
    ctx.save();
    for (var f = 0; f < sel_path.length; f++) {
      ctx.beginPath();
      ctx.fillStyle = sel_path[f].col;
      ctx.globalAlpha = 0.5;
      if(sel_path[f].path[0].length==2){
        for (var q = 0; q < sel_path[f].path.length; q++) {
          /*if (q==0) {ctx.moveTo(sel_path[f].path[q][0]+tri.set[0], sel_path[f].path[q][1]+tri.set[1])}
          else{ctx.lineTo(sel_path[f].path[q][0]+tri.set[0], sel_path[f].path[q][1]+tri.set[1])}*/
          if (f==dog) {
            if (q==0) {ctx.moveTo(sel_path[f].path[q][0]+tri.set[0], sel_path[f].path[q][1]+tri.set[1])}
            else{ctx.lineTo(sel_path[f].path[q][0]+tri.set[0], sel_path[f].path[q][1]+tri.set[1])}
          }else{
            if (q==0) {ctx.moveTo(sel_path[f].path[q][0], sel_path[f].path[q][1])}
            else{ctx.lineTo(sel_path[f].path[q][0], sel_path[f].path[q][1])}
          }
        }
      }else if(sel_path[f].path[0].length==3){
        ctx.arc(sel_path[f].path[0][0],sel_path[f][0][1],sel_path[f].path[0][2],0,360*Math.PI/180,false);
      }
      ctx.fill();
    }
    ctx.restore();
    ctx.save();
    //線
    if (line_light>=1) {
      for (var i = 0; i < len; i++) {
        ctx.beginPath () ;
        ctx.moveTo(sel_path[dog].path[i][0]+tri.set[0],sel_path[dog].path[i][1]+tri.set[1]);
        ctx.lineTo(sel_path[dog].path[(i+1)%len][0]+tri.set[0],sel_path[dog].path[(i+1)%len][1]+tri.set[1])
        ctx.strokeStyle = "black";
        ctx.stroke() ;
      }
    }

    //マウスアクション
    //var mouse_p = design()
    for (var i = 0; i < point.length; i++) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(point[i].x,point[i].y,point[i].size,0 * Math.PI/180,
         360*Math.PI/180,false);
      ctx.fillStyle = point[i].col;
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.strokeStyle = point[i].line;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
      ctx.save();
    }

    //mouse_pointer
    if (mouse_st == true) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouseX,mouseY,mouse_e,0 * Math.PI/180,
         360*Math.PI/180,false);
      ctx.fillStyle = "white";
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.strokeStyle = '#000000'
      ctx.stroke();
      ctx.restore();
      ctx.save();
    }

    setTimeout(drawing,30);
  };



  function design() {
    point = []

    if (ons==true) {
      for (key in pap) {
        sel_path[dog].path[key][0]=mouseX+pap[key][0]
        sel_path[dog].path[key][1]=mouseY+pap[key][1]
      }
    }else{
      if (line[0]>=0) {
        paps={}
        for (var i = 0; i < sel_path[dog].path.length; i++) {
          var xx=(sel_path[dog].path[i][0]+tri.set[0]-mouseX)**2+(sel_path[dog].path[i][1]+tri.set[1]-mouseY)**2
          if (mouse_e**2>=xx) {
            paps[i]=[sel_path[dog].path[i][0]+tri.set[0]-mouseX,sel_path[dog].path[i][1]+tri.set[1]-mouseY]
          }
        }

        if (!Object.keys(paps).length&&line[1]<=mouse_e+2) {//垂線交点が存在する。垂線がマウスの範囲にある
          point.push({x:line[2][0]+tri.set[0],y:line[2][1]+tri.set[1],size:5,col:'blue',line:'red'})
        }else{
          for (key in paps) {
            point.push({x:mouseX+paps[key][0],y:mouseY+paps[key][1],size:5,col:'red',line:'blue'})
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
    for (var i = 0; i < sel_path[dog].path.length; i++) {
      var a = Math.round(sel_path[dog].path[i][0]/(scale*10)*10)
      var b = Math.round(sel_path[dog].path[i][1]/(scale*10)*10)
      l.push([a,b])
    }
    ori = l

    scale=Math.floor(scale*10)/10
    sel_path[dog].path=path_scale(ori,scale,c)

    if (tri.get==true && ons==false) {//縮尺座標調整
      tri.set=[mouseX -tri.path[0],mouseY -tri.path[1]]
    }
    if (event.key=="ArrowLeft") {
      backs()
    }else if (event.key=="ArrowRight") {
      nexts()
    }
    if (sel_path[0]) {
      line_get()//マウスより最寄りの辺を取得
    }
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
    save_log.push({path:sel_path,layer:document.getElementById("layers").innerHTML,dog:dog})

    sel_path=save_path[save_path.length-1].path
    document.getElementById("layers").innerHTML = save_path[save_path.length-1].layer
    dog = save_path[save_path.length-1].dog
    for (var i = 0; i < document.getElementById("layers").children.length; i++) {
      layer_event(document.getElementById("layers").children[i])
    }

    save_path.pop()
  }
}
//save_log.layer.push(document.getElementById("layers").innerHTML)
function nexts(){
  if (save_log.length>=1) {
    save_path.push({path:sel_path,layer:document.getElementById("layers").innerHTML,dog:dog})

    sel_path=save_log[save_log.length-1].path
    document.getElementById("layers").innerHTML = save_log[save_log.length-1].layer
    dog = save_log[save_log.length-1].dog
    for (var i = 0; i < document.getElementById("layers").children.length; i++) {
      layer_event(document.getElementById("layers").children[i])
    }

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
    //console.log("x",e.clientX,rect.left)
    //console.log("y",e.clientY,rect.top)
    mouseX = Math.floor(e.clientX - rect.left);
    mouseY = Math.floor(e.clientY - rect.top);
    if (tri.get==true && ons==false) {//縮尺座標調整
      tri.set=[mouseX - tri.path[0],mouseY - tri.path[1]]
    }
    if (sel_path[0]) {
      line_get()//マウスより最寄りの辺を取得
    }
    design()
    //slider_change()
    /*put_on=inner_get()*/
  };
  function mouse_out(e) {
    mouse_st = false
    tri.get=false
    if (tri.set.every(v => Math.abs(v)>=1)) {
      save_path.push(short_save)
      save_log = []
      for (var q = 0; q < sel_path[dog].path.length; q++) {
        var dso = sel_path[dog].path[q]
        sel_path[dog].path[q] = [dso[0]+tri.set[0],dso[1]+tri.set[1]]
      }
      tri.set = [0,0]
    }
    tri.path=[mouseX,mouseY]
  };

  function click_event(e) {
    if (tri.get==true) {
      tri.get=false
      //tri.path=[mouseX,mouseY]
      if (tri.set.every(v => Math.abs(v)>=1)) {
        save_path.push(short_save)
        save_log = []
      }
      for (var q = 0; q < sel_path[dog].path.length; q++) {
        var dso = sel_path[dog].path[q]
        sel_path[dog].path[q] = [dso[0]+tri.set[0],dso[1]+tri.set[1]]
      }
      tri.set=[0,0]
    }
  }


  function down_event(){
    //var get = document.getElementById('option1').children
    var get = document.getElementsByName('mode')
    if (get[0].checked){
      down_edit()
    }else if(get[1].checked){
      down_eraser()
    }else if(get[2].checked){
      down_move()
    }
  }

  function down_edit(){
    pap = {};
    if (ons==false && sel_path[0]){
      for (var i = 0; i < sel_path[dog].path.length; i++) {
        var xx=(sel_path[dog].path[i][0]-mouseX+tri.set[0])**2+(sel_path[dog].path[i][1]-mouseY+tri.set[1])**2
        if (mouse_e**2>=xx) {
          ons = true

          short_save = gets_path()
          save_log = []

          pap[i]=[sel_path[dog].path[i][0]- mouseX,sel_path[dog].path[i][1]- mouseY]
        }
      }

      if(!Object.keys(pap).length && line[1] <= mouse_e+2){
        ons = true

        short_save = gets_path()
        save_log = []

        var id = line[0]+1
        sel_path[dog].path.splice(id,0,line[2]);
        pap[id]=[sel_path[dog].path[id][0]- mouseX,sel_path[dog].path[id][1]- mouseY]
      }

      if (ons==false) {//判定が無い//図形移動
        tri.get=true
        tri.path=[mouseX-tri.set[0],mouseY-tri.set[1]]
        short_save = gets_path()
      }

      //----------color
      /*
      var result = sel_path.map(function( value ) {
          return inner_get(value);
      });

      if (result.some(function(val){return val == true})==true) {
        /*
        var v = result.lastIndexOf(true)
        col_set=v+1
        document.getElementById('colors').value=col[v]

      }else{
        col_set=0
        document.getElementById('colors').value=back_color
      }*/
    }else if(ons==true){
      ons=false
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      save_path.push(short_save)
      sel_path[dog].path=path_set(sel_path[dog].path)
    }
  }

  //パスの削除
  function down_eraser(){
    short_save = gets_path()
    for (var i = 0; i < sel_path[dog].path.length; i++) {
      var xx=(sel_path[dog].path[i][0]-mouseX+tri.set[0])**2+(sel_path[dog].path[i][1]-mouseY+tri.set[1])**2
      xx = Math.round(xx)
      if (mouse_e**2>=xx){
        save_path.push(short_save)
        save_log = []
        sel_path[dog].path[i]=undefined
      }
    }
    if (sel_path[dog].path.includes(undefined)) {
      sel_path[dog].path=sel_path[dog].path.filter(Boolean);
    }else{
      tri.get=true
      tri.path=[mouseX-tri.set[0],mouseY-tri.set[1]]
      short_save = gets_path()
    }
    /*
    if (ons==false) {//判定が無い//図形移動
    }*/
  }

  function down_move(){
    pap = {};
    if (ons==false){
      tri.get=true
      tri.path=[mouseX-tri.set[0],mouseY-tri.set[1]]
    }else{
      ons=false
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var set = {}
    }
  }


/*------------------------------------------------------------*/
  function line_get(){//最寄りの線
    line = [-1,10000,[]];
    var len = sel_path[dog].path.length;
    var path = sel_path[dog].path

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
function gets_path(){
  var gets = []
  var get = []
  for (var i = 0; i < sel_path.length; i++) {
    get = []
    for (var ii = 0; ii < sel_path[i].path.length; ii++) {
      get.push([sel_path[i].path[ii][0],sel_path[i].path[ii][1]])
    }
    gets.push({path:get,col:sel_path[i].col})
  }
  //console.log({path:gets,layer:document.getElementById("layers").innerHTML,dog:dog})
  return {path:gets,layer:document.getElementById("layers").innerHTML,dog:dog}
}

function layer_shuffle(a,b){//レイヤー:前：後
  var layer = document.getElementById("layers")

  var el_a = layer.children[a].innerHTML
  var el_b = layer.children[b].innerHTML

  save_path.push(gets_path())
  save_log = []

  layer.children[a].innerHTML=el_b
  layer.children[b].innerHTML=el_a

  var val= layer.children[a].children
  for (var i = 0; i < layer.children.length; i++) {
    layer.children[i].children[0].value=i
  }

  var el = sel_path[a]
  sel_path[a] = sel_path[b]
  sel_path[b] = el

  dog = b
}

function layer_pop(n){

  var layer = document.getElementById("layers")
  for (var i = 0; i < layer.children.length; i++) {
    layer.children[i].children[0].value=i
  }
  sel_path.splice(n,1)
  if (sel_path.length==0) {
    sel_path=[]
  }
  dog=0
}

function layer_push(){

  var layer = document.getElementById("layers")
  for (var i = 0; i < layer.children.length; i++) {
    layer.children[i].children[0].value=i
  }
  sel_path.push({path:[[200,200],[400,200],[400,400],[200,400]],col:document.getElementById('colors').value})
  //{path:[[200,200],[400,200],[400,400],[200,400]],col:'#ff0000',bcol:"#808080"}
  dog=sel_path.length-1
  col_set=sel_path.length
}
