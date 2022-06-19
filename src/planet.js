import * as THREE from "three"
import grav from './gravity'

const textureLoader = new THREE.TextureLoader()
export default class Planet{

  x;y;z;ridus;mass;xvelocity;yvelocity;
  // create a planet
 constructor (position,mass,texture,velocity){

  this.mass=mass
  this.position = position
  this.position.z =0 
  this.x=position.x
  this.y=position.y
  this.z=0
  this.xvelocity=velocity.x+this.x;
   // console.log('xvelocity'+this.xvelocity)
  this.yvelocity=velocity.y+this.y;

  console.log('the  rad '+this.masstorad(mass))
  this.ridus = this.masstorad(mass)
  this.planetTexture = textureLoader.load('/textures/planets/'+texture+'.jpg') 
  this.planetMaterial = new THREE.MeshStandardMaterial({map:this.planetTexture})
  // this.planetMaterial.wireframe=ture
  this.planetGeometry = new THREE.SphereBufferGeometry(this.ridus,50,50)
  this.planetMesh = new THREE.Mesh(
   this.planetGeometry,
   this.planetMaterial 
  )
  this.planetMesh.position.copy(position)

  scene.add(this.planetMesh)
  if(texture=='star'){
    this.addLight()
  }
   //console.log(this.planetMesh)
   //  planets.push(this)  
   // q=planets;
   // console.log(q);
  }
  addLight(){
   const directionalLight = new THREE.DirectionalLight(0xffffff,0.9)
   directionalLight.position.copy(this.position)
   directionalLight.position.z +=1
   scene.add(directionalLight)
  }
  updateLightPosition(){
   
  }
 masstorad(mass){
     return Math.log(mass)/20
 }
 //move the planet 
 moveTo(x,y){
   this.planetMesh.position.x = x
  // this.planetMesh.position.
   this.planetMesh.position.y = y
   console.log(this.planetMesh.position);
 }

 vector1=new THREE.Vector2(0,0)
 moves(b2){
   let velocity =gra.calcVelocity(this, b2,t)
   this.x +=(velocity.x * t )
   this.y +=(velocity.y * t )
   // console.log('after : '+this.x)
   this.xvelocity=velocity.x
   this.yvelocity=velocity.y
   this.planetMesh.position.x =this.x;
   this.planetMesh.position.y = this.y;
 }
 increase(x,y){
   this.planetMesh.position.x = this.planetMesh.position.x+x
   this.planetMesh.position.y = this.planetMesh.position.y+y
   console.log(this.planetMesh.position);
 }
}
