(window.onload = function() {
num = 0


//title_logo
//var title_text="RHYME ATRIUM(in blank_shape)"
var title_text="Blank Shape"
console.log(document.getElementById('title_word'))
for (const i in title_text){
  console.log(title_text.length)
  var tx = document.createElement("span");
  tx.innerHTML=title_text.charAt(i)
  document.getElementById('title_word').appendChild(tx);
}

document.getElementById("title_logo").setAttribute("onclick","select_set()");

});
function select_set(){
  document.getElementById('main').innerHTML = ""
  //<input type="button" class="select" value="1Click" onclick="draw_set(0)"><br>
  var canvas = Object.assign(document.createElement("canvas"),{id:"logo_ori"})
  document.getElementById('main').appendChild(canvas);
  canvas = document.getElementById('logo_ori');
  canvas.style.display ="none";
  canvas.width = 550 ;
  canvas.height = 550 ;
  var ctx = canvas.getContext('2d');
  var width = ctx.canvas.width ;
  var height = ctx.canvas.height;
  //
  var set_pass = setting()
  var form = Object.assign(document.createElement("form"),{className:"sampleForm"})
  var inp = ""
  for (var i = 0; i < set_pass.length; i++) {
    var path=set_pass[i].map(function(v) {return [v.path,v.col]})
    console.log(set_pass[i][0].bcol)
    ctx.fillStyle = set_pass[i][0].bcol;
    ctx.fillRect(0, 0,canvas.width, canvas.height);
    //path=path.map(function(v) {return [v.path,v.col]})
    console.log(path)
    for (var f = 0; f < path.length; f++) {
      ctx.beginPath();
      ctx.fillStyle = path[f][1];

      if(path[f][0][0].length==2){
        for (var q = 0; q < path[f][0].length; q++) {
          if (q==0) {ctx.moveTo(path[f][0][q][0],path[f][0][q][1])}
          else{ctx.lineTo(path[f][0][q][0],path[f][0][q][1])}
        }
      }else if(path[f][0][0].length==3){
        ctx.arc(path[f][0][0][0],path[f][0][0][1],path[f][0][0][2],0,360*Math.PI/180,false);
      }
      ctx.fill();
    }

    var inp = document.createElement("img")
    inp.setAttribute("src",canvas.toDataURL())
    inp.setAttribute("width","200")
    inp.setAttribute("height","200")
    inp.setAttribute("onclick","draw_set("+i+")");
    /*
    var inp = document.createElement("input")
    inp.setAttribute("type","button")
    inp.setAttribute("value",(i+1)+"Click")
    inp.setAttribute("onclick","draw_set("+i+")");
    */
    form.appendChild(inp)
  }
  document.getElementById('main').appendChild(form);
}

function draw_set(n){
  var main = document.getElementById('main')
  main.innerHTML=""
  document.getElementById('option1').innerHTML = ""
  //<div id='layers'>
  var left_opt = document.createElement("div");
  var lay_set = document.createElement("div");
  var indent = document.createElement("div");
  var canva = document.createElement("div");
  indent.setAttribute("style","position:fixed;bottom:0;");
  lay_set.setAttribute("id","layers");
  canva.setAttribute("id","canvasBack");
  left_opt.setAttribute("id","left_option");
  indent.setAttribute("id","indent");
  left_opt.appendChild(lay_set);
  left_opt.appendChild(indent);
  main.appendChild(left_opt);
  main.appendChild(canva);

  //camvas
  var canvas_option = document.createElement("div");
  var cav = document.createElement("canvas");
  canvas_option.setAttribute("id","canvas_option");
  cav.setAttribute("id","canvas");
  document.getElementById('canvasBack').appendChild(cav)
  /*document.getElementById('canvasBack').appendChild(canvas_option)
  document.getElementById('canvasBack').onscroll = function(){
    var pix = this.scrollHeight - this.offsetHeight
    if (pix/3 <=this.scrollTop) {
      this.scrollBy(0,pix);
    }else if(pix/3*2 >=this.scrollTop){
      this.scrollTo(0,0);
    }
  }*/

  var mode = document.createElement("input");
  mode.setAttribute("type","radio");
  mode.setAttribute("name","mode");
  mode.setAttribute("id","mode_0");
  mode.setAttribute("value","0");
  mode.setAttribute("checked","");
  var lab = document.createElement("label");
  lab.setAttribute("for","mode_0");
  lab.setAttribute("class","mode");
  var imag = document.createElement("img");
  imag.setAttribute("src","マイ鉛筆.png");
  lab.appendChild(imag);
  //mode.textContent="編集"
  document.getElementById('option1').appendChild(mode);
  document.getElementById('option1').appendChild(lab);

  mode = document.createElement("input");
  mode.setAttribute("type","radio");
  mode.setAttribute("name","mode");
  mode.setAttribute("id","mode_1");
  mode.setAttribute("value","1");
  lab = document.createElement("label");
  lab.setAttribute("for","mode_1");
  lab.setAttribute("class","mode");
  var imag = document.createElement("img");
  imag.setAttribute("src","マイ消しゴム.png");
  lab.appendChild(imag);
  //mode.textContent="消しゴム"
  document.getElementById('option1').appendChild(mode);
  document.getElementById('option1').appendChild(lab);
  //-----
  //var sli = Object.assign(document.createElement("input"),{
  var sli = document.createElement("input");
  sli.setAttribute("id","mouse_slide");
  sli.setAttribute("type","range");
  sli.setAttribute("name","range-1");
  sli.setAttribute("value","0");
  sli.setAttribute("min","10");
  sli.setAttribute("max","50");
  sli.setAttribute("step","1");
  sli.addEventListener("input",mouse_sizes);
  document.getElementById('option1').appendChild(sli);
  //document.getElementById('mouse_slide').addEventListener('input', mouse_sizes)
  var col = document.createElement("input");
  col.setAttribute("type","color");
  col.setAttribute("id","colors");
  col.setAttribute("value","#000000");
  document.getElementById('option1').appendChild(col);

  var save = document.createElement("input")
  save.setAttribute("type","button")
  save.setAttribute("value","SAVE")
  save.addEventListener('click', function(){
    var can = document.getElementById("canvas");
  	var a = document.createElement('a');
  	a.href = canvas.toDataURL('image/jpeg', 0.85);
  	a.download = 'download.jpg';
  	a.click()
  })
  document.getElementById('option1').appendChild(save);

  //canvas_opthion
  /*
  var canop = document.createElement("input")
  canop.setAttribute("type","button")
  canop.setAttribute("value","SAVE")
  canop.addEventListener('click', function(){
    this.value = Math.random().toString(32).substring(2)
    var ccc = back_set[0]
    back_set[0] = back_set[1]
    back_set[1] = ccc
  })
  document.getElementById('canvas_option').appendChild(canop);
  */

  reload(n)
}
//<label><input type="radio" name="layer" value=0 onchange="on_layer()" checked>レイヤー1</label>
//<label><input type="radio" name="layer" value=1 onchange="on_layer()" >レイヤー2</label>
function layer_event(div){
  div.addEventListener('mousedown',function(){
    var id=this.parentElement.getAttribute('id')
    var pac=this.parentElement.children//
    var bnum = num
    num = [].slice.call(pac).indexOf(this)

    //ホールド状態かどうか
    var clas=document.getElementsByClassName('drag')
    if (clas.length>=1) {
      //document.getElementById("delete_layer").remove()
      for (var i = 0; i < clas.length; i++) {
        clas.item(i).remove()
      }
      var opa_class =document.getElementsByClassName('drag_now')
      for (var ii = 0; ii < opa_class.length; ii++) {
        opa_class.item(ii).classList.remove("drag_now");
      }
      document.body.removeAttribute("mousemove");
      layer_shuffle(bnum,num)
      layer_join()
    }else{//ホールド状態では無い場合

    //一定時間長押し
    this.value=setTimeout(function(){
      layer_dlete()
      var get = document.getElementById(id).children[num]
      c=get.children[1].cloneNode(true)
      c.setAttribute('class','drag');
      c.removeAttribute("mousedown");
      c.removeAttribute('value');
      document.getElementById('left_option').appendChild(c);
      //マウスに追従
      document.body.addEventListener("mousemove",function(e){
        var clas=document.getElementsByClassName("drag")
        if (clas.length>=1) {
          for (var i = 1; i < clas.length; i++) {
            clas.item(i).remove()
          }
          drag = document.getElementsByClassName("drag")[0];
          drag.style.top = e.clientY - 30 + "px";
        }
      }, false);
      //長押しされたレイヤーのCSS
      get.classList.add("drag_now");
      },1000)//10秒間
    }
  },false);

  //一定時間内にボタンを離した場合
  div.addEventListener('click',function(){
    clearInterval(this.value);
  });
  //一定時間内にボタンからカーソルを外した場合
  div.addEventListener('mouseleave',function(){
    clearInterval(this.value);
  })

  return div
}


function layer_sel(i){
  var id = Math.random().toString(32).substring(2)

  //input
  var input = document.createElement("input");
  input.setAttribute("type","radio");
  input.setAttribute("name","layer");
  input.setAttribute("class","layers");
  input.setAttribute("value",i);
  input.setAttribute("id",id);
  //input.setAttribute("onchange","on_layer()");
  input.setAttribute("onclick","on_layer()");
  input.setAttribute("display","none");
  input.setAttribute("style","display:none")
  if (i==0) {
    input.setAttribute("checked",true);
  }
  //label
  var lab = document.createElement("label");
  lab.setAttribute("for",id);
  lab.setAttribute("name",'layer_col');
  lab.setAttribute("class","layer");
  lab.style.backgroundColor=sel_path[i].col
  lab.style.color='#000000'
  //set
  var div = document.createElement("div");
  div.appendChild(input)
  div.appendChild(lab)

  /*event*/
  div=layer_event(div)

  document.getElementById('layers').appendChild(div);
}

function layer_set(li){
  var n=li.length
  for (var i = 0; i < n; i++) {
    layer_sel(i)
  }
  layer_join()
}

function layer_join(){
  document.getElementById('indent').innerHTML=""
  var lab = document.createElement("label");
  lab.setAttribute("name",'layer_col');
  lab.setAttribute("class","layer");
  lab.style.backgroundColor='#ff7f7f';
  lab.style.color='#ffeeee'
  var imag = document.createElement("img");
  imag.setAttribute("src","プラス.png");
  lab.appendChild(imag);
  //set
  var div = document.createElement("div");
  div.appendChild(lab)
  div.addEventListener('mousedown',function(){
    //save
    save_path.push(gets_path())
    save_log = []

    layer_sel(0)
    layer_push()
    console.log(111)
  })
  document.getElementById('indent').appendChild(div)
}


function layer_dlete(){
  document.getElementById('indent').innerHTML=""
  var lab = document.createElement("label");
  lab.setAttribute("name",'layer_col');
  lab.setAttribute("class","layer");
  lab.style.backgroundColor='#afeeee';
  lab.style.color='#afeeee'
  var imag = document.createElement("img");
  imag.setAttribute("src","マイナス.png");
  lab.appendChild(imag);
  //set
  var div = document.createElement("div");
  div.appendChild(lab)
  div.addEventListener('mousedown',function(){
    //save
    save_path.push(gets_path())
    save_log = []

    var opa_class =document.getElementsByClassName('drag_now')
    for (var ii = 0; ii < opa_class.length; ii++) {
      opa_class.item(ii).classList.remove("drag_now");
    }
    var clas=document.getElementsByClassName('drag')
    for (var i = 0; i < clas.length; i++) {
      clas.item(i).remove()
    }
    document.getElementById("layers").children[num].remove()

    document.body.removeAttribute("mousemove");
    this.remove()
    layer_pop(num)
    layer_join()
  })

  document.getElementById('indent').appendChild(div)
}
