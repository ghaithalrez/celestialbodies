import * as THREE from "three"
import Planet from "./planet";
export default class grav{
 planets =[] 
 gravityforce(b1, b2) {
   let y= b2.y-b1.y;
   let x=b2.x-b1.x;
   let G=100;
   let  theta=Math.atan(y/x);      
   let dist = Math.sqrt( (x*x)+(y*y))
   if(dist==0){}
   let fx=(x/dist)*(G * b1.mass * b2.mass) / (dist * dist+2);
   let fy=(y/dist)*(G * b1.mass * b2.mass) / (dist * dist+2);
   let xxx=new THREE.Vector2(fx,fy)
   return new THREE.Vector2(fx,fy)
 }  
 
 calcVelocity(b1, b2,t ){
   let vec = this.gravityforce(b1,b2);
   let a_vec = vec.divideScalar(b1.mass);
   let v_vec = a_vec.multiplyScalar(t);
   b1.xvelocity = v_vec.x + b1.xvelocity;
   b1.yvelocity = v_vec.y + b1.yvelocity;
   return new THREE.Vector2( b1.xvelocity, b1.yvelocity)
 }
  
}