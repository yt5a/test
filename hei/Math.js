function missing_line(p1,p2,p3,p4) {//線分p1,2と線分p3,4の交差判定
  var tc1 = (p1[0] - p2[0]) * (p3[1] - p1[1]) + (p1[1] - p2[1]) * (p1[0] - p3[0])
  var tc2 = (p1[0] - p2[0]) * (p4[1] - p1[1]) + (p1[1] - p2[1]) * (p1[0] - p4[0])
  var td1 = (p3[0] - p4[0]) * (p1[1] - p3[1]) + (p3[1] - p4[1]) * (p3[0] - p1[0])
  var td2 = (p3[0] - p4[0]) * (p2[1] - p3[1]) + (p3[1] - p4[1]) * (p3[0] - p2[0])
  return tc1*tc2<0 && td1*td2<0
};

function tri_in(a,b,c,p){
  function vec(a, b){
    return [a[0] - b[0], a[1] - b[1]]
  }
  ab = vec(b, a);
  bp = vec(p, b);

  bc = vec(c, b);
  cp = vec(p, c);

  ca = vec(a, c);
  ap = vec(p, a);
  //外積を求める
  c1 = ab[0] * bp[1]  - ab[1] * bp[0]
  c2 = bc[0] * cp[1]  - bc[1] * cp[0]
  c3 = ca[0] * ap[1]  - ca[1] * ap[0]

  //外積の向き　正負がそろっていれば内側
  //return (c1 > 0 and c2 > 0 and c3 > 0)or(c1 < 0 and c2 < 0 and c3 < 0)
  return (c1 >= 0 && c2 >= 0 && c3 >= 0)||(c1 <= 0 && c2 <= 0 && c3 <= 0)
}


function p_ellipse_line_point(ox,oy,px,py,r){
  var op=Math.sqrt((ox-px)**2+(oy-py)**2)
  var y=Math.sqrt(op**2-r**2)*r/op
  var x=Math.sqrt(r**2-y**2)
  var AB = Math.atan2(y,x)*180/Math.PI;
  var ang = 90-Math.atan2(px-ox,py-oy)*180/Math.PI;

  sets=[]
  for (var i = 1; i > -2; i-=2) {
    xx=r * Math.cos((AB*i+ang) * Math.PI/180)
    yy=r * Math.sin((AB*i+ang) * Math.PI/180)
    a=Math.atan2(py-yy,px-xx)*180/Math.PI
    if (a<=0){
      a=180+Math.abs(180+a)
    }
    sets.push([xx,yy,a])
  }
  return sets
}

//3点の間の角度
function tri_ang(sp,kp,mp){
  function vec(a,b){
    return [a[0] - b[0], a[1] - b[1]]
  }
  ang=vec(kp,sp)
  ang=Math.atan2(ang[0],ang[1])*180/Math.PI

  ll=vec(mp,sp)
  get=Math.atan2(ll[0],ll[1])*180/Math.PI-ang

  if(get>180){
    get=get-360
  }else if(get<-180){
    get=get+360
  }
  return get
}

//RGB→カラーコード
function rgbTo16(col){
  return "#" + col.match(/\d+/g).map(function(a){return ("0" + parseInt(a).toString(16)).slice(-2)}).join("");
}
