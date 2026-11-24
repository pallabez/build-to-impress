(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();class Au{ctx=null;master;musicGain;musicTimer=null;musicStep=0;musicMode=null;sfxOn=!0;musicOn=!0;unlock(){if(this.ctx){this.ctx.resume();return}const t=window.AudioContext??window.webkitAudioContext;t&&(this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=.6,this.master.connect(this.ctx.destination),this.musicGain=this.ctx.createGain(),this.musicGain.gain.value=0,this.musicGain.connect(this.master))}tone(t,e,i={}){const s=this.ctx;if(!s)return;const r=s.currentTime+(i.at??0),a=s.createOscillator(),o=s.createGain();a.type=i.type??"sine",a.frequency.setValueAtTime(t,r),i.slide&&a.frequency.exponentialRampToValueAtTime(Math.max(30,t*i.slide),r+e);const l=i.vol??.3;o.gain.setValueAtTime(1e-4,r),o.gain.exponentialRampToValueAtTime(l,r+(i.attack??.008)),o.gain.exponentialRampToValueAtTime(1e-4,r+e),a.connect(o).connect(i.out??this.master),a.start(r),a.stop(r+e+.05)}noise(t,e,i=0,s=800){const r=this.ctx;if(!r)return;const a=r.currentTime+i,o=r.createBuffer(1,Math.ceil(r.sampleRate*t),r.sampleRate),l=o.getChannelData(0);for(let f=0;f<l.length;f++)l[f]=(Math.random()*2-1)*(1-f/l.length);const c=r.createBufferSource();c.buffer=o;const h=r.createBiquadFilter();h.type="highpass",h.frequency.value=s;const u=r.createGain();u.gain.value=e,c.connect(h).connect(u).connect(this.master),c.start(a)}play(t){if(!(!this.sfxOn||!this.ctx))switch(t){case"pop":this.tone(520,.12,{type:"triangle",slide:1.9,vol:.25});break;case"click":this.tone(900,.05,{type:"square",vol:.06});break;case"drop":this.tone(240,.12,{type:"sine",slide:.6,vol:.3}),this.noise(.05,.05,0,2e3);break;case"delete":this.tone(400,.16,{type:"sawtooth",slide:.4,vol:.08});break;case"whoosh":this.noise(.45,.12,0,600);break;case"star":this.tone(1046,.18,{type:"triangle",vol:.18}),this.tone(1568,.25,{type:"sine",vol:.12,at:.05});break;case"tick":this.tone(1200,.04,{type:"square",vol:.05});break;case"coin":this.tone(988,.08,{type:"square",vol:.07}),this.tone(1318,.2,{type:"square",vol:.07,at:.07});break;case"reveal":[523,659,784].forEach((e,i)=>this.tone(e,.5,{type:"triangle",vol:.15,at:i*.06}));break;case"buzz":this.tone(110,.35,{type:"sawtooth",vol:.1});break;case"fanfare":[523,659,784,1046].forEach((e,i)=>this.tone(e,.28,{type:"triangle",vol:.2,at:i*.11})),this.tone(1046,.9,{type:"sine",vol:.18,at:.5}),this.tone(1318,.9,{type:"sine",vol:.12,at:.5});break}}music(t){if(t===this.musicMode||(this.musicMode=t,this.musicTimer!==null&&(clearInterval(this.musicTimer),this.musicTimer=null),!this.ctx))return;const e=this.musicGain.gain;if(e.cancelScheduledValues(this.ctx.currentTime),e.setTargetAtTime(t&&this.musicOn?t==="reveal"?.32:.26:0,this.ctx.currentTime,.4),!t)return;const s=60/(t==="build"?92:112);this.musicStep=0,this.musicTimer=window.setInterval(()=>this.musicTick(t,s),s*1e3)}setMusicOn(t){this.musicOn=t,this.ctx&&this.musicGain.gain.setTargetAtTime(t&&this.musicMode?.26:0,this.ctx.currentTime,.3)}musicTick(t,e){if(!this.ctx||!this.musicOn)return;const i=t==="build"?[[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]]:[[56,60,63,67],[58,62,65,69],[48,51,55,60],[58,62,65,69]],s=this.musicStep++,r=Math.floor(s/4)%4,a=i[r],o=h=>440*Math.pow(2,(h-69)/12),l=this.musicGain;if(s%4===0){for(const h of a)this.tone(o(h),e*3.8,{type:"sine",vol:.05,attack:.25,out:l});this.tone(o(a[0]-12),e*1.8,{type:"triangle",vol:.09,out:l})}s%4===2&&this.tone(o(a[0]-12),e*.9,{type:"triangle",vol:.07,out:l});const c=[0,2,1,3,2,1][s%6];s%8!==7&&this.tone(o(a[c]+12),e*.7,{type:"triangle",vol:t==="build"?.035:.05,out:l}),t==="reveal"&&s%2===1&&this.noiseOut(.05,.03)}noiseOut(t,e){const i=this.ctx;if(!i)return;const s=i.createBuffer(1,Math.ceil(i.sampleRate*t),i.sampleRate),r=s.getChannelData(0);for(let c=0;c<r.length;c++)r[c]=(Math.random()*2-1)*(1-c/r.length);const a=i.createBufferSource();a.buffer=s;const o=i.createBiquadFilter();o.type="highpass",o.frequency.value=6e3;const l=i.createGain();l.gain.value=e,a.connect(o).connect(l).connect(this.musicGain),a.start()}}const Jt=new Au;/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const dl="187",hs={ROTATE:0,DOLLY:1,PAN:2},ls={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ru=0,dc=1,Cu=2,Hr=1,Y0=2,Os=3,Bi=0,cn=1,Zn=2,Fi=0,Gs=1,fo=2,pc=3,mc=4,Pu=5,as=100,Lu=101,Du=102,Iu=103,Nu=104,Uu=200,Fu=201,Ou=202,Bu=203,q0=204,$0=205,zu=206,ku=207,Gu=208,Hu=209,Vu=210,Wu=211,Xu=212,Yu=213,qu=214,po=0,mo=1,go=2,qs=3,_o=4,vo=5,xo=6,yo=7,pl=0,$u=1,Zu=2,hi=0,ml=1,gl=2,_l=3,sr=4,vl=5,xl=6,yl=7,Z0=300,ps=301,$s=302,Ea=303,Ta=304,Qr=1e3,ci=1001,Mo=1002,je=1003,Ku=1004,cr=1005,pn=1006,Aa=1007,bi=1008,Sn=1009,K0=1010,J0=1011,Zs=1012,Ml=1013,jn=1014,zn=1015,mn=1016,Sl=1017,bl=1018,ms=1020,Q0=35902,j0=35899,th=1021,eh=1022,Kn=1023,Ti=1026,wi=1027,wl=1028,El=1029,zi=1030,Tl=1031,Al=1033,Vr=33776,Wr=33777,Xr=33778,Yr=33779,So=35840,bo=35841,wo=35842,Eo=35843,To=36196,Ao=37492,Ro=37496,Co=37488,Po=37489,jr=37490,Lo=37491,Do=37808,Io=37809,No=37810,Uo=37811,Fo=37812,Oo=37813,Bo=37814,zo=37815,ko=37816,Go=37817,Ho=37818,Vo=37819,Wo=37820,Xo=37821,Yo=36492,qo=36494,$o=36495,Zo=36283,Ko=36284,ta=36285,Jo=36286,Ju=3200,ea=0,Qu=1,yi="",ln="srgb",na="srgb-linear",ia="linear",we="srgb",Ra=7680,ju=519,tf=512,ef=513,nf=514,nh=515,sf=516,rf=517,ih=518,sh=519,af=35044,gc="300 es",kn=2e3,Ks=2001;function of(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function sa(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function lf(){const n=sa("canvas");return n.style.display="block",n}const _c={};function vc(...n){const t="THREE."+n.shift();console.log(t,...n)}function rh(n){const t=n[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=n[1];e&&e.isStackTrace?n[0]+=" "+e.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function qt(...n){n=rh(n);const t="THREE."+n.shift();{const e=n[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...n)}}function _e(...n){n=rh(n);const t="THREE."+n.shift();{const e=n[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...n)}}function qr(...n){const t=n.join(" ");t in _c||(_c[t]=!0,qt(...n))}function cf(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}const hf={[po]:po,[go]:xo,[_o]:_o,[qs]:vo,[mo]:mo,[xo]:go,[yo]:yo,[vo]:qs};class Ri{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let xc=1234567;const Hs=Math.PI/180,Js=180/Math.PI;function Hi(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(nn[n&255]+nn[n>>8&255]+nn[n>>16&255]+nn[n>>24&255]+"-"+nn[t&255]+nn[t>>8&255]+"-"+nn[t>>16&15|64]+nn[t>>24&255]+"-"+nn[e&63|128]+nn[e>>8&255]+"-"+nn[e>>16&255]+nn[e>>24&255]+nn[i&255]+nn[i>>8&255]+nn[i>>16&255]+nn[i>>24&255]).toLowerCase()}function ne(n,t,e){return Math.max(t,Math.min(e,n))}function Rl(n,t){return(n%t+t)%t}function uf(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function ff(n,t,e){return n!==t?(e-n)/(t-n):0}function Vs(n,t,e){return(1-e)*n+e*t}function df(n,t,e,i){return Vs(n,t,1-Math.exp(-e*i))}function pf(n,t=1){return t-Math.abs(Rl(n,t*2)-t)}function mf(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function gf(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function _f(n,t){return n+Math.floor(Math.random()*(t-n+1))}function vf(n,t){return n+Math.random()*(t-n)}function xf(n){return n*(.5-Math.random())}function yf(n){n!==void 0&&(xc=n);let t=xc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Mf(n){return n*Hs}function Sf(n){return n*Js}function bf(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function wf(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function ah(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Ef(n,t,e,i,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+i)/2),h=a((t+i)/2),u=r((t-i)/2),f=a((t-i)/2),d=r((i-t)/2),g=a((i-t)/2);switch(s){case"XYX":n.set(o*h,l*u,l*f,o*c);break;case"YZY":n.set(l*f,o*h,l*u,o*c);break;case"ZXZ":n.set(l*u,l*f,o*h,o*c);break;case"XZX":n.set(o*h,l*g,l*d,o*c);break;case"YXY":n.set(l*d,o*h,l*g,o*c);break;case"ZYZ":n.set(l*g,l*d,o*h,o*c);break;default:qt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Cl(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function oh(n,t){if(t.constructor===Float32Array)return n;const e=Cl(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/e,-1)}function lh(n,t){if(t.constructor===Float32Array)return n;const e=Cl(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*e)}const Pl={DEG2RAD:Hs,RAD2DEG:Js,generateUUID:Hi,clamp:ne,euclideanModulo:Rl,mapLinear:uf,inverseLerp:ff,lerp:Vs,damp:df,pingpong:pf,smoothstep:mf,smootherstep:gf,randInt:_f,randFloat:vf,randFloatSpread:xf,seededRandom:yf,degToRad:Mf,radToDeg:Sf,isPowerOfTwo:bf,ceilPowerOfTwo:wf,floorPowerOfTwo:ah,setQuaternionFromProperEuler:Ef,normalize:lh,denormalize:oh},Ql=class Ql{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*i-a*s+t.x,this.y=r*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Ql.prototype.isVector2=!0;let ot=Ql;class ti{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3],f=r[a+0],d=r[a+1],g=r[a+2],v=r[a+3];if(u!==v||l!==f||c!==d||h!==g){let m=l*f+c*d+h*g+u*v;m<0&&(f=-f,d=-d,g=-g,v=-v,m=-m);let p=1-o;if(m<.9995){const y=Math.acos(m),w=Math.sin(y);p=Math.sin(p*y)/w,o=Math.sin(o*y)/w,l=l*p+f*o,c=c*p+d*o,h=h*p+g*o,u=u*p+v*o}else{l=l*p+f*o,c=c*p+d*o,h=h*p+g*o,u=u*p+v*o;const y=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=y,c*=y,h*=y,u*=y}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[a],f=r[a+1],d=r[a+2],g=r[a+3];return t[e]=o*g+h*u+l*d-c*f,t[e+1]=l*g+h*f+c*u-o*d,t[e+2]=c*g+h*d+o*f-l*u,t[e+3]=h*g-o*u-l*f-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(r/2),f=l(i/2),d=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"YXZ":this._x=f*h*u+c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"ZXY":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u-f*d*g;break;case"ZYX":this._x=f*h*u-c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u+f*d*g;break;case"YZX":this._x=f*h*u+c*d*g,this._y=c*d*u+f*h*g,this._z=c*h*g-f*d*u,this._w=c*h*u-f*d*g;break;case"XZY":this._x=f*h*u-c*d*g,this._y=c*d*u-f*h*g,this._z=c*h*g+f*d*u,this._w=c*h*u+f*d*g;break;default:qt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=i+o+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(i>o&&i>u){const d=2*Math.sqrt(1+i-o-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>u){const d=2*Math.sqrt(1+o-i-u);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-i-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const jl=class jl{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(yc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(yc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*i),h=2*(o*e-r*s),u=2*(r*i-a*e);return this.x=e+l*c+a*u-o*h,this.y=i+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Ca.copy(this).projectOnVector(t),this.sub(Ca)}reflect(t){return this.sub(Ca.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};jl.prototype.isVector3=!0;let P=jl;const Ca=new P,yc=new ti,tc=class tc{constructor(t,e,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,l,c)}set(t,e,i,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],d=i[5],g=i[8],v=s[0],m=s[3],p=s[6],y=s[1],w=s[4],M=s[7],R=s[2],T=s[5],_=s[8];return r[0]=a*v+o*y+l*R,r[3]=a*m+o*w+l*T,r[6]=a*p+o*M+l*_,r[1]=c*v+h*y+u*R,r[4]=c*m+h*w+u*T,r[7]=c*p+h*M+u*_,r[2]=f*v+d*y+g*R,r[5]=f*m+d*w+g*T,r[8]=f*p+d*M+g*_,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,f=o*l-h*r,d=c*r-a*l,g=e*u+i*f+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*c-h*i)*v,t[2]=(o*i-s*a)*v,t[3]=f*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-o*e)*v,t[6]=d*v,t[7]=(i*l-c*e)*v,t[8]=(a*e-i*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return qr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Pa.makeScale(t,e)),this}rotate(t){return qr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Pa.makeRotation(-t)),this}translate(t,e){return qr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Pa.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};tc.prototype.isMatrix3=!0;let Kt=tc;const Pa=new Kt,Mc=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Sc=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Tf(){const n={enabled:!0,workingColorSpace:na,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===we&&(s.r=ui(s.r),s.g=ui(s.g),s.b=ui(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===we&&(s.r=us(s.r),s.g=us(s.g),s.b=us(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===yi?ia:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[na]:{primaries:t,whitePoint:i,transfer:ia,toXYZ:Mc,fromXYZ:Sc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ln},outputColorSpaceConfig:{drawingBufferColorSpace:ln}},[ln]:{primaries:t,whitePoint:i,transfer:we,toXYZ:Mc,fromXYZ:Sc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ln}}}),n}const pe=Tf();function ui(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function us(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Wi;class Af{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Wi===void 0&&(Wi=sa("canvas")),Wi.width=t.width,Wi.height=t.height;const s=Wi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Wi}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=sa("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ui(r[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(ui(e[i]/255)*255):e[i]=ui(e[i]);return{data:e,width:t.width,height:t.height}}else return qt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Rf=0;class Ll{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Rf++}),this.uuid=Hi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(La(s[a].image)):r.push(La(s[a]))}else r=La(s);i.url=r}return e||(t.images[this.uuid]=i),i}}function La(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Af.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(qt("Texture: Unable to serialize Texture."),{})}let Cf=0;const Da=new P;class rn extends Ri{constructor(t=rn.DEFAULT_IMAGE,e=rn.DEFAULT_MAPPING,i=ci,s=ci,r=pn,a=bi,o=Kn,l=Sn,c=rn.DEFAULT_ANISOTROPY,h=yi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cf++}),this.uuid=Hi(),this.name="",this.source=new Ll(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Da).x}get height(){return this.source.getSize(Da).y}get depth(){return this.source.getSize(Da).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){qt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){qt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Z0)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Qr:t.x=t.x-Math.floor(t.x);break;case ci:t.x=t.x<0?0:1;break;case Mo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Qr:t.y=t.y-Math.floor(t.y);break;case ci:t.y=t.y<0?0:1;break;case Mo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}rn.DEFAULT_IMAGE=null;rn.DEFAULT_MAPPING=Z0;rn.DEFAULT_ANISOTROPY=1;const ec=class ec{constructor(t=0,e=0,i=0,s=1){this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(c+1)/2,M=(d+1)/2,R=(p+1)/2,T=(h+f)/4,_=(u+v)/4,S=(g+m)/4;return w>M&&w>R?w<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(w),s=T/i,r=_/i):M>R?M<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),i=T/s,r=S/s):R<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),i=_/r,s=S/r),this.set(i,s,r,e),this}let y=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-v)/y,this.z=(f-h)/y,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ec.prototype.isVector4=!0;let Ne=ec;class Pf extends Ri{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ne(0,0,t,e),this.scissorTest=!1,this.viewport=new Ne(0,0,t,e),this.textures=[];const s=i.count;for(let r=0;r<s;r++)this.textures[r]=new rn({width:t,height:e,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:pn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Ll(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class gn extends Pf{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class ch extends rn{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Lf extends rn{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}const fa=class fa{constructor(t,e,i,s,r,a,o,l,c,h,u,f,d,g,v,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,a,o,l,c,h,u,f,d,g,v,m)}set(t,e,i,s,r,a,o,l,c,h,u,f,d,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new fa().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,i=t.elements,s=1/Xi.setFromMatrixColumn(t,0).length(),r=1/Xi.setFromMatrixColumn(t,1).length(),a=1/Xi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,r=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*h,d=a*u,g=o*h,v=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=d+g*c,e[5]=f-v*c,e[9]=-o*l,e[2]=v-f*c,e[6]=g+d*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,d=l*u,g=c*h,v=c*u;e[0]=f+v*o,e[4]=g*o-d,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=d*o-g,e[6]=v+f*o,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,d=l*u,g=c*h,v=c*u;e[0]=f-v*o,e[4]=-a*u,e[8]=g+d*o,e[1]=d+g*o,e[5]=a*h,e[9]=v-f*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,d=a*u,g=o*h,v=o*u;e[0]=l*h,e[4]=g*c-d,e[8]=f*c+v,e[1]=l*u,e[5]=v*c+f,e[9]=d*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,d=a*c,g=o*l,v=o*c;e[0]=l*h,e[4]=v-f*u,e[8]=g*u+d,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*u+g,e[10]=f-v*u}else if(t.order==="XZY"){const f=a*l,d=a*c,g=o*l,v=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+v,e[5]=a*h,e[9]=d*u-g,e[2]=g*u-d,e[6]=o*h,e[10]=v*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Df,t,If)}lookAt(t,e,i){const s=this.elements;return _n.subVectors(t,e),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),mi.crossVectors(i,_n),mi.lengthSq()===0&&(Math.abs(i.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),mi.crossVectors(i,_n)),mi.normalize(),hr.crossVectors(_n,mi),s[0]=mi.x,s[4]=hr.x,s[8]=_n.x,s[1]=mi.y,s[5]=hr.y,s[9]=_n.y,s[2]=mi.z,s[6]=hr.z,s[10]=_n.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],d=i[13],g=i[2],v=i[6],m=i[10],p=i[14],y=i[3],w=i[7],M=i[11],R=i[15],T=s[0],_=s[4],S=s[8],I=s[12],C=s[1],N=s[5],k=s[9],q=s[13],D=s[2],H=s[6],J=s[10],z=s[14],lt=s[3],$=s[7],nt=s[11],at=s[15];return r[0]=a*T+o*C+l*D+c*lt,r[4]=a*_+o*N+l*H+c*$,r[8]=a*S+o*k+l*J+c*nt,r[12]=a*I+o*q+l*z+c*at,r[1]=h*T+u*C+f*D+d*lt,r[5]=h*_+u*N+f*H+d*$,r[9]=h*S+u*k+f*J+d*nt,r[13]=h*I+u*q+f*z+d*at,r[2]=g*T+v*C+m*D+p*lt,r[6]=g*_+v*N+m*H+p*$,r[10]=g*S+v*k+m*J+p*nt,r[14]=g*I+v*q+m*z+p*at,r[3]=y*T+w*C+M*D+R*lt,r[7]=y*_+w*N+M*H+R*$,r[11]=y*S+w*k+M*J+R*nt,r[15]=y*I+w*q+M*z+R*at,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],d=t[14],g=t[3],v=t[7],m=t[11],p=t[15],y=l*d-c*f,w=o*d-c*u,M=o*f-l*u,R=a*d-c*h,T=a*f-l*h,_=a*u-o*h;return e*(v*y-m*w+p*M)-i*(g*y-m*R+p*T)+s*(g*w-v*R+p*_)-r*(g*M-v*T+m*_)}determinantAffine(){const t=this.elements,e=t[0],i=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-i*(r*h-o*l)+s*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],d=t[11],g=t[12],v=t[13],m=t[14],p=t[15],y=e*o-i*a,w=e*l-s*a,M=e*c-r*a,R=i*l-s*o,T=i*c-r*o,_=s*c-r*l,S=h*v-u*g,I=h*m-f*g,C=h*p-d*g,N=u*m-f*v,k=u*p-d*v,q=f*p-d*m,D=y*q-w*k+M*N+R*C-T*I+_*S;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const H=1/D;return t[0]=(o*q-l*k+c*N)*H,t[1]=(s*k-i*q-r*N)*H,t[2]=(v*_-m*T+p*R)*H,t[3]=(f*T-u*_-d*R)*H,t[4]=(l*C-a*q-c*I)*H,t[5]=(e*q-s*C+r*I)*H,t[6]=(m*M-g*_-p*w)*H,t[7]=(h*_-f*M+d*w)*H,t[8]=(a*k-o*C+c*S)*H,t[9]=(i*C-e*k-r*S)*H,t[10]=(g*T-v*M+p*y)*H,t[11]=(u*M-h*T-d*y)*H,t[12]=(o*I-a*N-l*S)*H,t[13]=(e*N-i*I+s*S)*H,t[14]=(v*w-g*R-m*y)*H,t[15]=(h*R-u*w+f*y)*H,this}scale(t){const e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),r=1-i,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,a){return this.set(1,i,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,f=r*c,d=r*h,g=r*u,v=a*h,m=a*u,p=o*u,y=l*c,w=l*h,M=l*u,R=i.x,T=i.y,_=i.z;return s[0]=(1-(v+p))*R,s[1]=(d+M)*R,s[2]=(g-w)*R,s[3]=0,s[4]=(d-M)*T,s[5]=(1-(f+p))*T,s[6]=(m+y)*T,s[7]=0,s[8]=(g+w)*_,s[9]=(m-y)*_,s[10]=(1-(f+v))*_,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let a=Xi.set(s[0],s[1],s[2]).length();const o=Xi.set(s[4],s[5],s[6]).length(),l=Xi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),In.copy(this);const c=1/a,h=1/o,u=1/l;return In.elements[0]*=c,In.elements[1]*=c,In.elements[2]*=c,In.elements[4]*=h,In.elements[5]*=h,In.elements[6]*=h,In.elements[8]*=u,In.elements[9]*=u,In.elements[10]*=u,e.setFromRotationMatrix(In),i.x=a,i.y=o,i.z=l,this}makePerspective(t,e,i,s,r,a,o=kn,l=!1){const c=this.elements,h=2*r/(e-t),u=2*r/(i-s),f=(e+t)/(e-t),d=(i+s)/(i-s);let g,v;if(l)g=r/(a-r),v=a*r/(a-r);else if(o===kn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Ks)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,a,o=kn,l=!1){const c=this.elements,h=2/(e-t),u=2/(i-s),f=-(e+t)/(e-t),d=-(i+s)/(i-s);let g,v;if(l)g=1/(a-r),v=a/(a-r);else if(o===kn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===Ks)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};fa.prototype.isMatrix4=!0;let be=fa;const Xi=new P,In=new be,Df=new P(0,0,0),If=new P(1,1,1),mi=new P,hr=new P,_n=new P,bc=new be,wc=new ti;class fi{constructor(t=0,e=0,i=0,s=fi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ne(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ne(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:qt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return bc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(bc,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return wc.setFromEuler(this),this.setFromQuaternion(wc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}fi.DEFAULT_ORDER="XYZ";class Dl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Nf=0;const Ec=new P,Yi=new ti,si=new be,ur=new P,As=new P,Uf=new P,Ff=new ti,Tc=new P(1,0,0),Ac=new P(0,1,0),Rc=new P(0,0,1),Cc={type:"added"},Of={type:"removed"},qi={type:"childadded",child:null},Ia={type:"childremoved",child:null};class Xe extends Ri{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Nf++}),this.uuid=Hi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xe.DEFAULT_UP.clone();const t=new P,e=new fi,i=new ti,s=new P(1,1,1);function r(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new be},normalMatrix:{value:new Kt}}),this.matrix=new be,this.matrixWorld=new be,this.matrixAutoUpdate=Xe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Yi.setFromAxisAngle(t,e),this.quaternion.multiply(Yi),this}rotateOnWorldAxis(t,e){return Yi.setFromAxisAngle(t,e),this.quaternion.premultiply(Yi),this}rotateX(t){return this.rotateOnAxis(Tc,t)}rotateY(t){return this.rotateOnAxis(Ac,t)}rotateZ(t){return this.rotateOnAxis(Rc,t)}translateOnAxis(t,e){return Ec.copy(t).applyQuaternion(this.quaternion),this.position.add(Ec.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Tc,t)}translateY(t){return this.translateOnAxis(Ac,t)}translateZ(t){return this.translateOnAxis(Rc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(si.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?ur.copy(t):ur.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),As.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?si.lookAt(As,ur,this.up):si.lookAt(ur,As,this.up),this.quaternion.setFromRotationMatrix(si),s&&(si.extractRotation(s.matrixWorld),Yi.setFromRotationMatrix(si),this.quaternion.premultiply(Yi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(_e("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Cc),qi.child=t,this.dispatchEvent(qi),qi.child=null):_e("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Of),Ia.child=t,this.dispatchEvent(Ia),Ia.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),si.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),si.multiply(t.parent.matrixWorld)),t.applyMatrix4(si),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Cc),qi.child=t,this.dispatchEvent(qi),qi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,t,Uf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,Ff,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,i=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*s,r[13]+=i-r[1]*e-r[5]*i-r[9]*s,r[14]+=s-r[2]*e-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),d=a(t.animations),g=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Xe.DEFAULT_UP=new P(0,1,0);Xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class On extends Xe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Bf={type:"move"};class Na{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new On,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new On,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new On,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,i),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,g=.005;c.inputState.pinching&&f>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Bf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new On;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const hh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},gi={h:0,s:0,l:0},fr={h:0,s:0,l:0};function Ua(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class Qt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ln){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,pe.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=pe.workingColorSpace){return this.r=t,this.g=e,this.b=i,pe.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=pe.workingColorSpace){if(t=Rl(t,1),e=ne(e,0,1),i=ne(i,0,1),e===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+e):i+e-i*e,a=2*i-r;this.r=Ua(a,r,t+1/3),this.g=Ua(a,r,t),this.b=Ua(a,r,t-1/3)}return pe.colorSpaceToWorking(this,s),this}setStyle(t,e=ln){function i(r){r!==void 0&&parseFloat(r)<1&&qt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:qt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);qt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ln){const i=hh[t.toLowerCase()];return i!==void 0?this.setHex(i,e):qt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ui(t.r),this.g=ui(t.g),this.b=ui(t.b),this}copyLinearToSRGB(t){return this.r=us(t.r),this.g=us(t.g),this.b=us(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ln){return pe.workingToColorSpace(sn.copy(this),t),Math.round(ne(sn.r*255,0,255))*65536+Math.round(ne(sn.g*255,0,255))*256+Math.round(ne(sn.b*255,0,255))}getHexString(t=ln){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=pe.workingColorSpace){pe.workingToColorSpace(sn.copy(this),e);const i=sn.r,s=sn.g,r=sn.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=pe.workingColorSpace){return pe.workingToColorSpace(sn.copy(this),e),t.r=sn.r,t.g=sn.g,t.b=sn.b,t}getStyle(t=ln){pe.workingToColorSpace(sn.copy(this),t);const e=sn.r,i=sn.g,s=sn.b;return t!==ln?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(gi),this.setHSL(gi.h+t,gi.s+e,gi.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(gi),t.getHSL(fr);const i=Vs(gi.h,fr.h,e),s=Vs(gi.s,fr.s,e),r=Vs(gi.l,fr.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const sn=new Qt;Qt.NAMES=hh;class Il extends Xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fi,this.environmentIntensity=1,this.environmentRotation=new fi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Nn=new P,ri=new P,Fa=new P,ai=new P,$i=new P,Zi=new P,Pc=new P,Oa=new P,Ba=new P,za=new P,ka=new Ne,Ga=new Ne,Ha=new Ne;class Bn{constructor(t=new P,e=new P,i=new P){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),Nn.subVectors(t,e),s.cross(Nn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){Nn.subVectors(s,e),ri.subVectors(i,e),Fa.subVectors(t,e);const a=Nn.dot(Nn),o=Nn.dot(ri),l=Nn.dot(Fa),c=ri.dot(ri),h=ri.dot(Fa),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,d=(c*l-o*h)*f,g=(a*h-o*l)*f;return r.set(1-d-g,g,d)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,ai)===null?!1:ai.x>=0&&ai.y>=0&&ai.x+ai.y<=1}static getInterpolation(t,e,i,s,r,a,o,l){return this.getBarycoord(t,e,i,s,ai)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ai.x),l.addScaledVector(a,ai.y),l.addScaledVector(o,ai.z),l)}static getInterpolatedAttribute(t,e,i,s,r,a){return ka.setScalar(0),Ga.setScalar(0),Ha.setScalar(0),ka.fromBufferAttribute(t,e),Ga.fromBufferAttribute(t,i),Ha.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(ka,r.x),a.addScaledVector(Ga,r.y),a.addScaledVector(Ha,r.z),a}static isFrontFacing(t,e,i,s){return Nn.subVectors(i,e),ri.subVectors(t,e),Nn.cross(ri).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Nn.subVectors(this.c,this.b),ri.subVectors(this.a,this.b),Nn.cross(ri).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Bn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Bn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return Bn.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return Bn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Bn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,r=this.c;let a,o;$i.subVectors(s,i),Zi.subVectors(r,i),Oa.subVectors(t,i);const l=$i.dot(Oa),c=Zi.dot(Oa);if(l<=0&&c<=0)return e.copy(i);Ba.subVectors(t,s);const h=$i.dot(Ba),u=Zi.dot(Ba);if(h>=0&&u<=h)return e.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),e.copy(i).addScaledVector($i,a);za.subVectors(t,r);const d=$i.dot(za),g=Zi.dot(za);if(g>=0&&d<=g)return e.copy(r);const v=d*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(i).addScaledVector(Zi,o);const m=h*g-d*u;if(m<=0&&u-h>=0&&d-g>=0)return Pc.subVectors(r,s),o=(u-h)/(u-h+(d-g)),e.copy(s).addScaledVector(Pc,o);const p=1/(m+v+f);return a=v*p,o=f*p,e.copy(i).addScaledVector($i,a).addScaledVector(Zi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class En{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Un):Un.fromBufferAttribute(r,a),Un.applyMatrix4(t.matrixWorld),this.expandByPoint(Un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),dr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),dr.copy(i.boundingBox)),dr.applyMatrix4(t.matrixWorld),this.union(dr)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Un),Un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Rs),pr.subVectors(this.max,Rs),Ki.subVectors(t.a,Rs),Ji.subVectors(t.b,Rs),Qi.subVectors(t.c,Rs),_i.subVectors(Ji,Ki),vi.subVectors(Qi,Ji),Di.subVectors(Ki,Qi);let e=[0,-_i.z,_i.y,0,-vi.z,vi.y,0,-Di.z,Di.y,_i.z,0,-_i.x,vi.z,0,-vi.x,Di.z,0,-Di.x,-_i.y,_i.x,0,-vi.y,vi.x,0,-Di.y,Di.x,0];return!Va(e,Ki,Ji,Qi,pr)||(e=[1,0,0,0,1,0,0,0,1],!Va(e,Ki,Ji,Qi,pr))?!1:(mr.crossVectors(_i,vi),e=[mr.x,mr.y,mr.z],Va(e,Ki,Ji,Qi,pr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(oi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),oi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),oi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),oi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),oi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),oi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),oi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),oi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(oi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const oi=[new P,new P,new P,new P,new P,new P,new P,new P],Un=new P,dr=new En,Ki=new P,Ji=new P,Qi=new P,_i=new P,vi=new P,Di=new P,Rs=new P,pr=new P,mr=new P,Ii=new P;function Va(n,t,e,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Ii.fromArray(n,r);const o=s.x*Math.abs(Ii.x)+s.y*Math.abs(Ii.y)+s.z*Math.abs(Ii.z),l=t.dot(Ii),c=e.dot(Ii),h=i.dot(Ii);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const He=new P,gr=new ot;let zf=0;class Jn extends Ri{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:zf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=af,this.updateRanges=[],this.gpuType=zn,this.version=0,this._normalizationScale=t!==void 0?Cl(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)gr.fromBufferAttribute(this,e),gr.applyMatrix3(t),this.setXY(e,gr.x,gr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyMatrix3(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyMatrix4(t),this.setXYZ(e,He.x,He.y,He.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.applyNormalMatrix(t),this.setXYZ(e,He.x,He.y,He.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)He.fromBufferAttribute(this,e),He.transformDirection(t),this.setXYZ(e,He.x,He.y,He.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=this._denormalize(i)),i}setComponent(t,e,i){return this.normalized&&(i=this._normalize(i)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),i=this._normalize(i)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),i=this._normalize(i),s=this._normalize(s)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){const e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):oh(t,this.array)}_normalize(t){const e=this._normalizationScale;return e!==void 0?Math.round(t*e):lh(t,this.array)}}class uh extends Jn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class fh extends Jn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class le extends Jn{constructor(t,e,i){super(new Float32Array(t),e,i)}}const kf=new En,Cs=new P,Wa=new P;class Ss{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):kf.setFromPoints(t).getCenter(i);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Cs.subVectors(t,this.center);const e=Cs.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Cs,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Wa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Cs.copy(t.center).add(Wa)),this.expandByPoint(Cs.copy(t.center).sub(Wa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let Gf=0;const Tn=new be,Xa=new Xe,ji=new P,vn=new En,Ps=new En,Ke=new P;class Ve extends Ri{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Gf++}),this.uuid=Hi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(of(t)?fh:uh)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Kt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Tn.makeRotationFromQuaternion(t),this.applyMatrix4(Tn),this}rotateX(t){return Tn.makeRotationX(t),this.applyMatrix4(Tn),this}rotateY(t){return Tn.makeRotationY(t),this.applyMatrix4(Tn),this}rotateZ(t){return Tn.makeRotationZ(t),this.applyMatrix4(Tn),this}translate(t,e,i){return Tn.makeTranslation(t,e,i),this.applyMatrix4(Tn),this}scale(t,e,i){return Tn.makeScale(t,e,i),this.applyMatrix4(Tn),this}lookAt(t){return Xa.lookAt(t),Xa.updateMatrix(),this.applyMatrix4(Xa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ji).negate(),this.translate(ji.x,ji.y,ji.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new le(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&qt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new En);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){_e("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const r=e[i];vn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ke.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(Ke),Ke.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(Ke)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&_e('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ss);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){_e("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const i=this.boundingSphere.center;if(vn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Ps.setFromBufferAttribute(o),this.morphTargetsRelative?(Ke.addVectors(vn.min,Ps.min),vn.expandByPoint(Ke),Ke.addVectors(vn.max,Ps.max),vn.expandByPoint(Ke)):(vn.expandByPoint(Ps.min),vn.expandByPoint(Ps.max))}vn.getCenter(i);let s=0;for(let r=0,a=t.count;r<a;r++)Ke.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Ke));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ke.fromBufferAttribute(o,c),l&&(ji.fromBufferAttribute(t,c),Ke.add(ji)),s=Math.max(s,i.distanceToSquared(Ke))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&_e('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){_e("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new Jn(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(i.count);for(let I=0;I<i.count;I++)o[I]=new P,l[I]=new P;const h=new P,u=new P,f=new P,d=new ot,g=new ot,v=new ot,m=new P,p=new P;function y(I,C,N){c[I]=c[C]=c[N]=1,h.fromBufferAttribute(i,I),u.fromBufferAttribute(i,C),f.fromBufferAttribute(i,N),d.fromBufferAttribute(r,I),g.fromBufferAttribute(r,C),v.fromBufferAttribute(r,N),u.sub(h),f.sub(h),g.sub(d),v.sub(d);const k=1/(g.x*v.y-v.x*g.y);isFinite(k)&&(m.copy(u).multiplyScalar(v.y).addScaledVector(f,-g.y).multiplyScalar(k),p.copy(f).multiplyScalar(g.x).addScaledVector(u,-v.x).multiplyScalar(k),o[I].add(m),o[C].add(m),o[N].add(m),l[I].add(p),l[C].add(p),l[N].add(p))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let I=0,C=w.length;I<C;++I){const N=w[I],k=N.start,q=N.count;for(let D=k,H=k+q;D<H;D+=3)y(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const M=new P,R=new P,T=new P,_=new P;function S(I){T.fromBufferAttribute(s,I),_.copy(T);const C=o[I];M.copy(C),M.sub(T.multiplyScalar(T.dot(C))).normalize(),R.crossVectors(_,C);const k=R.dot(l[I])<0?-1:1;a.setXYZW(I,M.x,M.y,M.z,k)}for(let I=0,C=i.count;I<C;++I)c[I]&&S(I);this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new Jn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,h=new P,u=new P;if(t)for(let f=0,d=t.count;f<d;f+=3){const g=t.getX(f+0),v=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Ke.fromBufferAttribute(t,e),Ke.normalize(),t.setXYZ(e,Ke.x,Ke.y,Ke.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let d=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?d=l[v]*o.data.stride+o.offset:d=l[v]*h;for(let p=0;p<h;p++)f[g++]=c[d++]}return new Jn(f,h,u)}if(this.index===null)return qt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ve,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,i);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=t(f,i);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ya=new P,Hf=new P,Vf=new Kt;class qn{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Ya.subVectors(i,e).cross(Hf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){const s=t.delta(Ya),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Vf.getNormalMatrix(t),s=this.coplanarPoint(Ya).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let Wf=0;class Vi extends Ri{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=Hi(),this.name="",this.type="Material",this.blending=Gs,this.side=Bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=q0,this.blendDst=$0,this.blendEquation=as,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qt(0,0,0),this.blendAlpha=0,this.depthFunc=qs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ju,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ra,this.stencilZFail=Ra,this.stencilZPass=Ra,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){qt(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){qt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Qt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new qn().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ot().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ot().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const li=new P,qa=new P,_r=new P,vr=new P;class da{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,li)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=li.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(li.copy(this.origin).addScaledVector(this.direction,e),li.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){qa.copy(t).add(e).multiplyScalar(.5),_r.copy(e).sub(t).normalize(),vr.copy(this.origin).sub(qa);const r=t.distanceTo(e)*.5,a=-this.direction.dot(_r),o=vr.dot(this.direction),l=-vr.dot(_r),c=vr.lengthSq(),h=Math.abs(1-a*a);let u,f,d,g;if(h>0)if(u=a*l-o,f=a*o-l,g=r*h,u>=0)if(f>=-g)if(f<=g){const v=1/h;u*=v,f*=v,d=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),d=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),d=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(qa).addScaledVector(_r,f),d}intersectSphere(t,e){if(t.radius<0)return null;li.subVectors(t.center,this.origin);const i=li.dot(this.direction),s=li.dot(li)-i*i,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(i=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,li)!==null}intersectTriangle(t,e,i,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=t.x-a.x,f=t.y-a.y,d=t.z-a.z,g=e.x-a.x,v=e.y-a.y,m=e.z-a.z,p=i.x-a.x,y=i.y-a.y,w=i.z-a.z,M=Math.abs(l),R=Math.abs(c),T=Math.abs(h);let _,S,I,C,N,k,q,D,H,J,z,lt;if(M>=R&&M>=T?(I=l,k=u,H=g,lt=p,l>=0?(_=c,S=h,C=f,N=d,q=v,D=m,J=y,z=w):(_=h,S=c,C=d,N=f,q=m,D=v,J=w,z=y)):R>=T?(I=c,k=f,H=v,lt=y,c>=0?(_=h,S=l,C=d,N=u,q=m,D=g,J=w,z=p):(_=l,S=h,C=u,N=d,q=g,D=m,J=p,z=w)):(I=h,k=d,H=m,lt=w,h>=0?(_=l,S=c,C=u,N=f,q=g,D=v,J=p,z=y):(_=c,S=l,C=f,N=u,q=v,D=g,J=y,z=p)),I===0)return null;const $=_/I,nt=S/I,at=1/I,Dt=C-$*k,Ht=N-nt*k,Q=q-$*H,bt=D-nt*H,It=J-$*lt,Vt=z-nt*lt,G=It*bt-Vt*Q,ut=Dt*Vt-Ht*It,Gt=Q*Ht-bt*Dt;if(s){if(G<0||ut<0||Gt<0)return null}else if((G<0||ut<0||Gt<0)&&(G>0||ut>0||Gt>0))return null;const Pt=G+ut+Gt;if(Pt===0)return null;const pt=at*(G*k+ut*H+Gt*lt);return(Pt>0?pt<0:pt>0)?null:this.at(pt/Pt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Nl extends Vi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fi,this.combine=pl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Lc=new be,Ni=new da,xr=new Ss,Dc=new P,yr=new P,Mr=new P,Sr=new P,$a=new P,br=new P,Ic=new P,wr=new P;class ie extends Xe{constructor(t=new Ve,e=new Nl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){br.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&($a.fromBufferAttribute(u,t),a?br.addScaledVector($a,h):br.addScaledVector($a.sub(e),h))}e.add(br)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),xr.copy(i.boundingSphere),xr.applyMatrix4(r),Ni.copy(t.ray).recast(t.near),!(xr.containsPoint(Ni.origin)===!1&&(Ni.intersectSphere(xr,Dc)===null||Ni.origin.distanceToSquared(Dc)>(t.far-t.near)**2))&&(Lc.copy(r).invert(),Ni.copy(t.ray).applyMatrix4(Lc),!(i.boundingBox!==null&&Ni.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Ni)))}_computeIntersections(t,e,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=a[m.materialIndex],y=Math.max(m.start,d.start),w=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let M=y,R=w;M<R;M+=3){const T=o.getX(M),_=o.getX(M+1),S=o.getX(M+2);s=Er(this,p,t,i,c,h,u,T,_,S),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const y=o.getX(m),w=o.getX(m+1),M=o.getX(m+2);s=Er(this,a,t,i,c,h,u,y,w,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const m=f[g],p=a[m.materialIndex],y=Math.max(m.start,d.start),w=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let M=y,R=w;M<R;M+=3){const T=M,_=M+1,S=M+2;s=Er(this,p,t,i,c,h,u,T,_,S),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const y=m,w=m+1,M=m+2;s=Er(this,a,t,i,c,h,u,y,w,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Xf(n,t,e,i,s,r,a,o){let l;if(t.side===cn?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,t.side===Bi,o),l===null)return null;wr.copy(o),wr.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(wr);return c<e.near||c>e.far?null:{distance:c,point:wr.clone(),object:n}}function Er(n,t,e,i,s,r,a,o,l,c){n.getVertexPosition(o,yr),n.getVertexPosition(l,Mr),n.getVertexPosition(c,Sr);const h=Xf(n,t,e,i,yr,Mr,Sr,Ic);if(h){const u=new P;Bn.getBarycoord(Ic,yr,Mr,Sr,u),s&&(h.uv=Bn.getInterpolatedAttribute(s,o,l,c,u,new ot)),r&&(h.uv1=Bn.getInterpolatedAttribute(r,o,l,c,u,new ot)),a&&(h.normal=Bn.getInterpolatedAttribute(a,o,l,c,u,new P),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new P,materialIndex:0};Bn.getNormal(yr,Mr,Sr,f.normal),h.face=f,h.barycoord=u}return h}class dh extends rn{constructor(t=null,e=1,i=1,s,r,a,o,l,c=je,h=je,u,f){super(null,a,o,l,c,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Nc extends Jn{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ts=new be,Uc=new be,Tr=[],Fc=new En,Yf=new be,Ls=new ie,Ds=new Ss;class qf extends ie{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Nc(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Yf)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new En),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,ts),Fc.copy(t.boundingBox).applyMatrix4(ts),this.boundingBox.union(Fc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ss),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,ts),Ds.copy(t.boundingSphere).applyMatrix4(ts),this.boundingSphere.union(Ds)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),this.morphTexture=t.morphTexture!==null?t.morphTexture.clone():null,this.instanceColor=t.instanceColor!==null?t.instanceColor.clone():null,this.count=t.count,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=t*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(t,e){const i=this.matrixWorld,s=this.count;if(Ls.geometry=this.geometry,Ls.material=this.material,Ls.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ds.copy(this.boundingSphere),Ds.applyMatrix4(i),t.ray.intersectsSphere(Ds)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ts),Uc.multiplyMatrices(i,ts),Ls.matrixWorld=Uc,Ls.raycast(t,Tr);for(let a=0,o=Tr.length;a<o;a++){const l=Tr[a];l.instanceId=r,l.object=this,e.push(l)}Tr.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Nc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const i=e.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new dh(new Float32Array(s*this.count),s,this.count,wl,zn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;return r[l]=o,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Ui=new Ss,$f=new ot(.5,.5),Ar=new P;class Qs{constructor(t=new qn,e=new qn,i=new qn,s=new qn,r=new qn,a=new qn){this.planes=[t,e,i,s,r,a]}set(t,e,i,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=kn,i=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],d=r[7],g=r[8],v=r[9],m=r[10],p=r[11],y=r[12],w=r[13],M=r[14],R=r[15];if(s[0].setComponents(c-a,d-h,p-g,R-y).normalize(),s[1].setComponents(c+a,d+h,p+g,R+y).normalize(),s[2].setComponents(c+o,d+u,p+v,R+w).normalize(),s[3].setComponents(c-o,d-u,p-v,R-w).normalize(),i)s[4].setComponents(l,f,m,M).normalize(),s[5].setComponents(c-l,d-f,p-m,R-M).normalize();else if(s[4].setComponents(c-l,d-f,p-m,R-M).normalize(),e===kn)s[5].setComponents(c+l,d+f,p+m,R+M).normalize();else if(e===Ks)s[5].setComponents(l,f,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ui.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ui.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ui)}intersectsSprite(t){Ui.center.set(0,0,0);const e=$f.distanceTo(t.center);return Ui.radius=.7071067811865476+e,Ui.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ui)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Ar.x=s.normal.x>0?t.max.x:t.min.x,Ar.y=s.normal.y>0?t.max.y:t.min.y,Ar.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ar)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const Oc=new be;class Ul{constructor(){this.coordinateSystem=kn,this._frustums=[],this._count=0}setFromArrayCamera(t){const e=t.cameras,i=this._frustums;for(let s=0;s<e.length;s++){const r=e[s];Oc.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new Qs),i[s].setFromProjectionMatrix(Oc,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsObject(t))return!0;return!1}intersectsSprite(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsSprite(t))return!0;return!1}intersectsSphere(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsSphere(t))return!0;return!1}intersectsBox(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsBox(t))return!0;return!1}containsPoint(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;const e=this._frustums,i=t._frustums;for(let s=0;s<t._count;s++)e[s]===void 0&&(e[s]=new Qs),e[s].copy(i[s]);return this._count=t._count,this}clone(){return new Ul().copy(this)}}class ph extends Vi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ra=new P,aa=new P,Bc=new be,Is=new da,Rr=new Ss,Za=new P,zc=new P;class Zf extends Xe{constructor(t=new Ve,e=new ph){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,r=e.count;s<r;s++)ra.fromBufferAttribute(e,s-1),aa.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=ra.distanceTo(aa);t.setAttribute("lineDistance",new le(i,1))}else qt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const i=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Rr.copy(i.boundingSphere),Rr.applyMatrix4(s),Rr.radius+=r,t.ray.intersectsSphere(Rr)===!1)return;Bc.copy(s).invert(),Is.copy(t.ray).applyMatrix4(Bc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,f=i.attributes.position;if(h!==null){const d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=d,m=g-1;v<m;v+=c){const p=h.getX(v),y=h.getX(v+1),w=Cr(this,t,Is,l,p,y,v);w&&e.push(w)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(d),p=Cr(this,t,Is,l,v,m,g-1);p&&e.push(p)}}else{const d=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let v=d,m=g-1;v<m;v+=c){const p=Cr(this,t,Is,l,v,v+1,v);p&&e.push(p)}if(this.isLineLoop){const v=Cr(this,t,Is,l,g-1,d,g-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Cr(n,t,e,i,s,r,a){const o=n.geometry.attributes.position;if(ra.fromBufferAttribute(o,s),aa.fromBufferAttribute(o,r),e.distanceSqToSegment(ra,aa,Za,zc)>i)return;Za.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Za);if(!(c<t.near||c>t.far))return{distance:c,point:zc.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const kc=new P,Gc=new P;class Kf extends Zf{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,r=e.count;s<r;s+=2)kc.fromBufferAttribute(e,s),Gc.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+kc.distanceTo(Gc);t.setAttribute("lineDistance",new le(i,1))}else qt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class mh extends rn{constructor(t=[],e=ps,i,s,r,a,o,l,c,h){super(t,e,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Jf extends rn{constructor(t,e,i,s,r,a,o,l,c){super(t,e,i,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class gs extends rn{constructor(t,e,i=jn,s,r,a,o=je,l=je,c,h=Ti,u=1){if(h!==Ti&&h!==wi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ll(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class gh extends gs{constructor(t,e=jn,i=ps,s,r,a=je,o=je,l,c=Ti){const h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,i,s,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class _h extends rn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class dn extends Ve{constructor(t=1,e=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,d=0;g("z","y","x",-1,-1,i,e,t,a,r,0),g("z","y","x",1,-1,i,e,-t,a,r,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,r,4),g("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new le(c,3)),this.setAttribute("normal",new le(h,3)),this.setAttribute("uv",new le(u,2));function g(v,m,p,y,w,M,R,T,_,S,I){const C=M/_,N=R/S,k=M/2,q=R/2,D=T/2,H=_+1,J=S+1;let z=0,lt=0;const $=new P;for(let nt=0;nt<J;nt++){const at=nt*N-q;for(let Dt=0;Dt<H;Dt++){const Ht=Dt*C-k;$[v]=Ht*y,$[m]=at*w,$[p]=D,c.push($.x,$.y,$.z),$[v]=0,$[m]=0,$[p]=T>0?1:-1,h.push($.x,$.y,$.z),u.push(Dt/_),u.push(1-nt/S),z+=1}}for(let nt=0;nt<S;nt++)for(let at=0;at<_;at++){const Dt=f+at+H*nt,Ht=f+at+H*(nt+1),Q=f+(at+1)+H*(nt+1),bt=f+(at+1)+H*nt;l.push(Dt,Ht,bt),l.push(Ht,Q,bt),lt+=6}o.addGroup(d,lt,I),d+=lt,f+=z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class Fl extends Ve{constructor(t=1,e=1,i=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:s,heightSegments:r},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=e/2,u=Math.PI/2*t,f=e,d=2*u+f,g=i*2+r,v=s+1,m=new P,p=new P;for(let y=0;y<=g;y++){let w=0,M=0,R=0,T=0;if(y<=i){const I=y/i,C=I*Math.PI/2;M=-h-t*Math.cos(C),R=t*Math.sin(C),T=-t*Math.cos(C),w=I*u}else if(y<=i+r){const I=(y-i)/r;M=-h+I*e,R=t,T=0,w=u+I*f}else{const I=(y-i-r)/i,C=I*Math.PI/2;M=h+t*Math.sin(C),R=t*Math.cos(C),T=t*Math.sin(C),w=u+f+I*u}const _=Math.max(0,Math.min(1,w/d));let S=0;y===0?S=.5/s:y===g&&(S=-.5/s);for(let I=0;I<=s;I++){const C=I/s,N=C*Math.PI*2,k=Math.sin(N),q=Math.cos(N);p.x=-R*q,p.y=M,p.z=R*k,o.push(p.x,p.y,p.z),m.set(-R*q,T,R*k),m.normalize(),l.push(m.x,m.y,m.z),c.push(C+S,_)}if(y>0){const I=(y-1)*v;for(let C=0;C<s;C++){const N=I+C,k=I+C+1,q=y*v+C,D=y*v+C+1;a.push(N,k,q),a.push(k,D,q)}}}this.setIndex(a),this.setAttribute("position",new le(o,3)),this.setAttribute("normal",new le(l,3)),this.setAttribute("uv",new le(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fl(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class rr extends Ve{constructor(t=1,e=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],d=[];let g=0;const v=[],m=i/2;let p=0;y(),a===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new le(u,3)),this.setAttribute("normal",new le(f,3)),this.setAttribute("uv",new le(d,2));function y(){const M=new P,R=new P;let T=0;const _=(e-t)/i;for(let S=0;S<=r;S++){const I=[],C=S/r,N=C*(e-t)+t;for(let k=0;k<=s;k++){const q=k/s,D=q*l+o,H=Math.sin(D),J=Math.cos(D);R.x=N*H,R.y=-C*i+m,R.z=N*J,u.push(R.x,R.y,R.z),M.set(H,_,J).normalize(),f.push(M.x,M.y,M.z),d.push(q,1-C),I.push(g++)}v.push(I)}for(let S=0;S<s;S++)for(let I=0;I<r;I++){const C=v[I][S],N=v[I+1][S],k=v[I+1][S+1],q=v[I][S+1];(t>0||I!==0)&&(h.push(C,N,q),T+=3),(e>0||I!==r-1)&&(h.push(N,k,q),T+=3)}c.addGroup(p,T,0),p+=T}function w(M){const R=g,T=new ot,_=new P;let S=0;const I=M===!0?t:e,C=M===!0?1:-1;for(let k=1;k<=s;k++)u.push(0,m*C,0),f.push(0,C,0),d.push(.5,.5),g++;const N=g;for(let k=0;k<=s;k++){const D=k/s*l+o,H=Math.cos(D),J=Math.sin(D);_.x=I*J,_.y=m*C,_.z=I*H,u.push(_.x,_.y,_.z),f.push(0,C,0),T.x=H*.5+.5,T.y=J*.5*C+.5,d.push(T.x,T.y),g++}for(let k=0;k<s;k++){const q=R+k,D=N+k;M===!0?h.push(D,D+1,q):h.push(D+1,D,q),S+=3}c.addGroup(p,S,M===!0?1:2),p+=S}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rr(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ol extends rr{constructor(t=1,e=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,i,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Ol(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ei{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){qt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),r+=i.distanceTo(s),e.push(r),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let s=0;const r=i.length;let a;e?a=e:a=t*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(r-1);const h=i[s],f=i[s+1]-h,d=(a-h)/f;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ot:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new P,s=[],r=[],a=[],o=new P,l=new be;for(let d=0;d<=t;d++){const g=d/t;s[d]=this.getTangentAt(g,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),f<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ne(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,g))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(ne(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],d*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}}class Bl extends ei{constructor(t=0,e=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ot){const i=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Qf extends Bl{constructor(t,e,i,s,r,a){super(t,e,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function zl(){let n=0,t=0,e=0,i=0;function s(r,a,o,l){n=r,t=o,e=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let f=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+u)+(l-o)/u;f*=h,d*=h,s(a,o,f,d)},calc:function(r){const a=r*r,o=a*r;return n+t*r+e*a+i*o}}}const Hc=new P,Vc=new P,Ka=new zl,Ja=new zl,Qa=new zl;class vh extends ei{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new P){const i=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Vc.subVectors(s[0],s[1]).add(s[0]),c=Vc);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Hc.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Hc),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),d),v=Math.pow(u.distanceToSquared(f),d),m=Math.pow(f.distanceToSquared(h),d);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Ka.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,v,m),Ja.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,v,m),Qa.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Ka.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Ja.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Qa.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return i.set(Ka.calc(l),Ja.calc(l),Qa.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new P().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Wc(n,t,e,i,s){const r=(i-t)*.5,a=(s-e)*.5,o=n*n,l=n*o;return(2*e-2*i+r+a)*l+(-3*e+3*i-2*r-a)*o+r*n+e}function jf(n,t){const e=1-n;return e*e*t}function td(n,t){return 2*(1-n)*n*t}function ed(n,t){return n*n*t}function Ws(n,t,e,i){return jf(n,t)+td(n,e)+ed(n,i)}function nd(n,t){const e=1-n;return e*e*e*t}function id(n,t){const e=1-n;return 3*e*e*n*t}function sd(n,t){return 3*(1-n)*n*n*t}function rd(n,t){return n*n*n*t}function Xs(n,t,e,i,s){return nd(n,t)+id(n,e)+sd(n,i)+rd(n,s)}class xh extends ei{constructor(t=new ot,e=new ot,i=new ot,s=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new ot){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Xs(t,s.x,r.x,a.x,o.x),Xs(t,s.y,r.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ad extends ei{constructor(t=new P,e=new P,i=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new P){const i=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(Xs(t,s.x,r.x,a.x,o.x),Xs(t,s.y,r.y,a.y,o.y),Xs(t,s.z,r.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class yh extends ei{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class od extends ei{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Mh extends ei{constructor(t=new ot,e=new ot,i=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new ot){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(Ws(t,s.x,r.x,a.x),Ws(t,s.y,r.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Sh extends ei{constructor(t=new P,e=new P,i=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new P){const i=e,s=this.v0,r=this.v1,a=this.v2;return i.set(Ws(t,s.x,r.x,a.x),Ws(t,s.y,r.y,a.y),Ws(t,s.z,r.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class bh extends ei{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){const i=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(Wc(o,l.x,c.x,h.x,u.x),Wc(o,l.y,c.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new ot().fromArray(s))}return this}}var oa=Object.freeze({__proto__:null,ArcCurve:Qf,CatmullRomCurve3:vh,CubicBezierCurve:xh,CubicBezierCurve3:ad,EllipseCurve:Bl,LineCurve:yh,LineCurve3:od,QuadraticBezierCurve:Mh,QuadraticBezierCurve3:Sh,SplineCurve:bh});class ld extends ei{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new oa[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this.cacheLengths=null,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new oa[s.type]().fromJSON(s))}return this.cacheLengths=null,this}}class Xc extends ld{constructor(t){super(),this.type="Path",this.currentPoint=new ot,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new yh(this.currentPoint.clone(),new ot(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const r=new Mh(this.currentPoint.clone(),new ot(t,e),new ot(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,r,a){const o=new xh(this.currentPoint.clone(),new ot(t,e),new ot(i,s),new ot(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new bh(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,i,s,r,a),this}absarc(t,e,i,s,r,a){return this.absellipse(t,e,i,i,s,r,a),this}ellipse(t,e,i,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,s,r,a,o,l),this}absellipse(t,e,i,s,r,a,o,l){const c=new Bl(t,e,i,s,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class wh extends Xc{constructor(t){super(t),this.uuid=Hi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new Xc().fromJSON(s))}return this}}function cd(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let r=Eh(n,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=pd(n,t,r,e)),n.length>80*e){o=n[0],l=n[1];let h=o,u=l;for(let f=e;f<s;f+=e){const d=n[f],g=n[f+1];d<o&&(o=d),g<l&&(l=g),d>h&&(h=d),g>u&&(u=g)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return js(r,a,e,o,l,c,0),a}function Eh(n,t,e,i,s){let r;if(s===Ed(n,t,e,i)>0)for(let a=t;a<e;a+=i)r=Yc(a/i|0,n[a],n[a+1],r);else for(let a=e-i;a>=t;a-=i)r=Yc(a/i|0,n[a],n[a+1],r);return r&&_s(r,r.next)&&(er(r),r=r.next),r}function ki(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(_s(e,e.next)||Ue(e.prev,e,e.next)===0)){if(er(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function js(n,t,e,i,s,r,a){if(!n)return;!a&&r&&xd(n,i,s,r);let o=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(r?ud(n,i,s,r):hd(n)){t.push(l.i,n.i,c.i),er(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=fd(ki(n),t),js(n,t,e,i,s,r,2)):a===2&&dd(n,t,e,i,s,r):js(ki(n),t,e,i,s,r,1);break}}}function hd(n){const t=n.prev,e=n,i=n.next;if(Ue(t,e,i)>=0)return!1;const s=t.x,r=e.x,a=i.x,o=t.y,l=e.y,c=i.y,h=Math.min(s,r,a),u=Math.min(o,l,c),f=Math.max(s,r,a),d=Math.max(o,l,c);let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=d&&Bs(s,o,r,l,a,c,g.x,g.y)&&Ue(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function ud(n,t,e,i){const s=n.prev,r=n,a=n.next;if(Ue(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,f=a.y,d=Math.min(o,l,c),g=Math.min(h,u,f),v=Math.max(o,l,c),m=Math.max(h,u,f),p=Qo(d,g,t,e,i),y=Qo(v,m,t,e,i);let w=n.prevZ,M=n.nextZ;for(;w&&w.z>=p&&M&&M.z<=y;){if(w.x>=d&&w.x<=v&&w.y>=g&&w.y<=m&&w!==s&&w!==a&&Bs(o,h,l,u,c,f,w.x,w.y)&&Ue(w.prev,w,w.next)>=0||(w=w.prevZ,M.x>=d&&M.x<=v&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&Bs(o,h,l,u,c,f,M.x,M.y)&&Ue(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;w&&w.z>=p;){if(w.x>=d&&w.x<=v&&w.y>=g&&w.y<=m&&w!==s&&w!==a&&Bs(o,h,l,u,c,f,w.x,w.y)&&Ue(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;M&&M.z<=y;){if(M.x>=d&&M.x<=v&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&Bs(o,h,l,u,c,f,M.x,M.y)&&Ue(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function fd(n,t){let e=n;do{const i=e.prev,s=e.next.next;!_s(i,s)&&Ah(i,e,e.next,s)&&tr(i,s)&&tr(s,i)&&(t.push(i.i,e.i,s.i),er(e),er(e.next),e=n=s),e=e.next}while(e!==n);return ki(e)}function dd(n,t,e,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Sd(a,o)){let l=Rh(a,o);a=ki(a,a.next),l=ki(l,l.next),js(a,t,e,i,s,r,0),js(l,t,e,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function pd(n,t,e,i){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*i,l=r<a-1?t[r+1]*i:n.length,c=Eh(n,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push(Md(c))}s.sort(md);for(let r=0;r<s.length;r++)e=gd(s[r],e);return e}function md(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=i-s}return e}function gd(n,t){const e=_d(n,t);if(!e)return t;const i=Rh(e,n);return ki(i,i.next),ki(e,e.next)}function _d(n,t){let e=t;const i=n.x,s=n.y;let r=-1/0,a;if(_s(n,e))return e;do{if(_s(n,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=i&&u>r&&(r=u,a=e.x<e.next.x?e:e.next,u===i))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(i>=e.x&&e.x>=l&&i!==e.x&&Th(s<c?i:r,s,l,c,s<c?r:i,s,e.x,e.y)){const u=Math.abs(s-e.y)/(i-e.x);tr(e,n)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&vd(a,e)))&&(a=e,h=u)}e=e.next}while(e!==o);return a}function vd(n,t){return Ue(n.prev,n,t.prev)<0&&Ue(t.next,n,n.next)<0}function xd(n,t,e,i){let s=n;do s.z===0&&(s.z=Qo(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,yd(s)}function yd(n){let t,e=1;do{let i=n,s;n=null;let r=null;for(t=0;i;){t++;let a=i,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,e*=2}while(t>1);return n}function Qo(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function Md(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Th(n,t,e,i,s,r,a,o){return(s-a)*(t-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(i-o)}function Bs(n,t,e,i,s,r,a,o){return!(n===a&&t===o)&&Th(n,t,e,i,s,r,a,o)}function Sd(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!bd(n,t)&&(tr(n,t)&&tr(t,n)&&wd(n,t)&&(Ue(n.prev,n,t.prev)||Ue(n,t.prev,t))||_s(n,t)&&Ue(n.prev,n,n.next)>0&&Ue(t.prev,t,t.next)>0)}function Ue(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function _s(n,t){return n.x===t.x&&n.y===t.y}function Ah(n,t,e,i){const s=Lr(Ue(n,t,e)),r=Lr(Ue(n,t,i)),a=Lr(Ue(e,i,n)),o=Lr(Ue(e,i,t));return!!(s!==r&&a!==o||s===0&&Pr(n,e,t)||r===0&&Pr(n,i,t)||a===0&&Pr(e,n,i)||o===0&&Pr(e,t,i))}function Pr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Lr(n){return n>0?1:n<0?-1:0}function bd(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Ah(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function tr(n,t){return Ue(n.prev,n,n.next)<0?Ue(n,t,n.next)>=0&&Ue(n,n.prev,t)>=0:Ue(n,t,n.prev)<0||Ue(n,n.next,t)<0}function wd(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,r=(n.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Rh(n,t){const e=jo(n.i,n.x,n.y),i=jo(t.i,t.x,t.y),s=n.next,r=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,r.next=i,i.prev=r,i}function Yc(n,t,e,i){const s=jo(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function er(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function jo(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ed(n,t,e,i){let s=0;for(let r=t,a=e-i;r<e;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class Td{static triangulate(t,e,i=2){return cd(t,e,i)}}class cs{static area(t){const e=t.length;let i=0;for(let s=e-1,r=0;r<e;s=r++)i+=t[s].x*t[r].y-t[r].x*t[s].y;return i*.5}static isClockWise(t){return cs.area(t)<0}static triangulateShape(t,e){const i=[],s=[],r=[];qc(t),$c(i,t);let a=t.length;e.forEach(qc);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,$c(i,e[l]);const o=Td.triangulate(i,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function qc(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function $c(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class kl extends Ve{constructor(t=new wh([new ot(.5,.5),new ot(-.5,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new le(s,3)),this.setAttribute("uv",new le(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,y=e.UVGenerator!==void 0?e.UVGenerator:Ad;let w,M=!1,R,T,_,S;if(p){w=p.getSpacedPoints(h),M=!0,f=!1;const j=p.isCatmullRomCurve3?p.closed:!1;R=p.computeFrenetFrames(h,j),T=new P,_=new P,S=new P}f||(m=0,d=0,g=0,v=0);const I=o.extractPoints(c);let C=I.shape;const N=I.holes;if(!cs.isClockWise(C)){C=C.reverse();for(let j=0,xt=N.length;j<xt;j++){const gt=N[j];cs.isClockWise(gt)&&(N[j]=gt.reverse())}}function q(j){const gt=10000000000000001e-36;let Nt=j[0];for(let At=1;At<=j.length;At++){const te=At%j.length,zt=j[te],ce=zt.x-Nt.x,ue=zt.y-Nt.y,ye=ce*ce+ue*ue,B=Math.max(Math.abs(zt.x),Math.abs(zt.y),Math.abs(Nt.x),Math.abs(Nt.y)),ke=gt*B*B;if(ye<=ke){j.splice(te,1),At--;continue}Nt=zt}}q(C),N.forEach(q);const D=N.length,H=C;for(let j=0;j<D;j++){const xt=N[j];C=C.concat(xt)}function J(j,xt,gt){return xt||_e("ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(xt,gt)}const z=C.length;function lt(j,xt,gt){let Nt,At,te;const zt=j.x-xt.x,ce=j.y-xt.y,ue=gt.x-j.x,ye=gt.y-j.y,B=zt*zt+ce*ce,ke=zt*ye-ce*ue;if(Math.abs(ke)>Number.EPSILON){const oe=Math.sqrt(B),Ae=Math.sqrt(ue*ue+ye*ye),wt=xt.x-ce/oe,Fe=xt.y+zt/oe,Yt=gt.x-ye/Ae,Zt=gt.y+ue/Ae,A=((Yt-wt)*ye-(Zt-Fe)*ue)/(zt*ye-ce*ue);Nt=wt+zt*A-j.x,At=Fe+ce*A-j.y;const x=Nt*Nt+At*At;if(x<=2)return new ot(Nt,At);te=Math.sqrt(x/2)}else{let oe=!1;zt>Number.EPSILON?ue>Number.EPSILON&&(oe=!0):zt<-Number.EPSILON?ue<-Number.EPSILON&&(oe=!0):Math.sign(ce)===Math.sign(ye)&&(oe=!0),oe?(Nt=-ce,At=zt,te=Math.sqrt(B)):(Nt=zt,At=ce,te=Math.sqrt(B/2))}return new ot(Nt/te,At/te)}const $=[];for(let j=0,xt=H.length,gt=xt-1,Nt=j+1;j<xt;j++,gt++,Nt++)gt===xt&&(gt=0),Nt===xt&&(Nt=0),$[j]=lt(H[j],H[gt],H[Nt]);const nt=[];let at,Dt=$.concat();for(let j=0,xt=D;j<xt;j++){const gt=N[j];at=[];for(let Nt=0,At=gt.length,te=At-1,zt=Nt+1;Nt<At;Nt++,te++,zt++)te===At&&(te=0),zt===At&&(zt=0),at[Nt]=lt(gt[Nt],gt[te],gt[zt]);nt.push(at),Dt=Dt.concat(at)}let Ht;if(m===0)Ht=cs.triangulateShape(H,N);else{const j=[],xt=[];for(let gt=0;gt<m;gt++){const Nt=gt/m,At=d*Math.cos(Nt*Math.PI/2),te=g*Math.sin(Nt*Math.PI/2)+v;for(let zt=0,ce=H.length;zt<ce;zt++){const ue=J(H[zt],$[zt],te);ut(ue.x,ue.y,-At),Nt===0&&j.push(ue)}for(let zt=0,ce=D;zt<ce;zt++){const ue=N[zt];at=nt[zt];const ye=[];for(let B=0,ke=ue.length;B<ke;B++){const oe=J(ue[B],at[B],te);ut(oe.x,oe.y,-At),Nt===0&&ye.push(oe)}Nt===0&&xt.push(ye)}}Ht=cs.triangulateShape(j,xt)}const Q=Ht.length,bt=g+v;for(let j=0;j<z;j++){const xt=f?J(C[j],Dt[j],bt):C[j];M?(_.copy(R.normals[0]).multiplyScalar(xt.x),T.copy(R.binormals[0]).multiplyScalar(xt.y),S.copy(w[0]).add(_).add(T),ut(S.x,S.y,S.z)):ut(xt.x,xt.y,0)}for(let j=1;j<=h;j++)for(let xt=0;xt<z;xt++){const gt=f?J(C[xt],Dt[xt],bt):C[xt];M?(_.copy(R.normals[j]).multiplyScalar(gt.x),T.copy(R.binormals[j]).multiplyScalar(gt.y),S.copy(w[j]).add(_).add(T),ut(S.x,S.y,S.z)):ut(gt.x,gt.y,u/h*j)}for(let j=m-1;j>=0;j--){const xt=j/m,gt=d*Math.cos(xt*Math.PI/2),Nt=g*Math.sin(xt*Math.PI/2)+v;for(let At=0,te=H.length;At<te;At++){const zt=J(H[At],$[At],Nt);ut(zt.x,zt.y,u+gt)}for(let At=0,te=N.length;At<te;At++){const zt=N[At];at=nt[At];for(let ce=0,ue=zt.length;ce<ue;ce++){const ye=J(zt[ce],at[ce],Nt);M?ut(ye.x,ye.y+w[h-1].y,w[h-1].x+gt):ut(ye.x,ye.y,u+gt)}}}It(),Vt();function It(){const j=s.length/3;if(f){let xt=0,gt=z*xt;for(let Nt=0;Nt<Q;Nt++){const At=Ht[Nt];Gt(At[2]+gt,At[1]+gt,At[0]+gt)}xt=h+m*2,gt=z*xt;for(let Nt=0;Nt<Q;Nt++){const At=Ht[Nt];Gt(At[0]+gt,At[1]+gt,At[2]+gt)}}else{for(let xt=0;xt<Q;xt++){const gt=Ht[xt];Gt(gt[2],gt[1],gt[0])}for(let xt=0;xt<Q;xt++){const gt=Ht[xt];Gt(gt[0]+z*h,gt[1]+z*h,gt[2]+z*h)}}i.addGroup(j,s.length/3-j,0)}function Vt(){const j=s.length/3;let xt=0;G(H,xt),xt+=H.length;for(let gt=0,Nt=N.length;gt<Nt;gt++){const At=N[gt];G(At,xt),xt+=At.length}i.addGroup(j,s.length/3-j,1)}function G(j,xt){let gt=j.length;for(;--gt>=0;){const Nt=gt;let At=gt-1;At<0&&(At=j.length-1);for(let te=0,zt=h+m*2;te<zt;te++){const ce=z*te,ue=z*(te+1),ye=xt+Nt+ce,B=xt+At+ce,ke=xt+At+ue,oe=xt+Nt+ue;Pt(ye,B,ke,oe)}}}function ut(j,xt,gt){l.push(j),l.push(xt),l.push(gt)}function Gt(j,xt,gt){pt(j),pt(xt),pt(gt);const Nt=s.length/3,At=y.generateTopUV(i,s,Nt-3,Nt-2,Nt-1);Xt(At[0]),Xt(At[1]),Xt(At[2])}function Pt(j,xt,gt,Nt){pt(j),pt(xt),pt(Nt),pt(xt),pt(gt),pt(Nt);const At=s.length/3,te=y.generateSideWallUV(i,s,At-6,At-3,At-2,At-1);Xt(te[0]),Xt(te[1]),Xt(te[3]),Xt(te[1]),Xt(te[2]),Xt(te[3])}function pt(j){s.push(l[j*3+0]),s.push(l[j*3+1]),s.push(l[j*3+2])}function Xt(j){r.push(j.x),r.push(j.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return Rd(e,i,t)}static fromJSON(t,e){const i=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];i.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new oa[s.type]().fromJSON(s)),new kl(i,t.options)}}const Ad={generateTopUV:function(n,t,e,i,s){const r=t[e*3],a=t[e*3+1],o=t[i*3],l=t[i*3+1],c=t[s*3],h=t[s*3+1];return[new ot(r,a),new ot(o,l),new ot(c,h)]},generateSideWallUV:function(n,t,e,i,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[i*3],h=t[i*3+1],u=t[i*3+2],f=t[s*3],d=t[s*3+1],g=t[s*3+2],v=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ot(a,1-l),new ot(c,1-u),new ot(f,1-g),new ot(v,1-p)]:[new ot(o,1-l),new ot(h,1-u),new ot(d,1-g),new ot(m,1-p)]}};function Rd(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const r=n[i];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Gl extends Ve{constructor(t=[new ot(0,-.5),new ot(.5,0),new ot(0,.5)],e=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:s},e=Math.floor(e),s=ne(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,u=new P,f=new ot,d=new P,g=new P,v=new P;let m=0,p=0;for(let y=0;y<=t.length-1;y++)switch(y){case 0:m=t[y+1].x-t[y].x,p=t[y+1].y-t[y].y,d.x=p*1,d.y=-m,d.z=p*0,v.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:v.normalize(),l.push(v.x,v.y,v.z);break;default:m=t[y+1].x-t[y].x,p=t[y+1].y-t[y].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),l.push(d.x,d.y,d.z),v.copy(g)}for(let y=0;y<=e;y++){const w=i+y*h*s,M=Math.sin(w),R=Math.cos(w);for(let T=0;T<=t.length-1;T++){u.x=t[T].x*M,u.y=t[T].y,u.z=t[T].x*R,a.push(u.x,u.y,u.z),f.x=y/e,f.y=T/(t.length-1),o.push(f.x,f.y);const _=l[3*T+0]*M,S=l[3*T+1],I=l[3*T+0]*R;c.push(_,S,I)}}for(let y=0;y<e;y++)for(let w=0;w<t.length-1;w++){const M=w+y*t.length,R=M,T=M+t.length,_=M+t.length+1,S=M+1;r.push(R,T,S),r.push(_,S,T)}this.setIndex(r),this.setAttribute("position",new le(a,3)),this.setAttribute("uv",new le(o,2)),this.setAttribute("normal",new le(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gl(t.points,t.segments,t.phiStart,t.phiLength)}}class pa extends Ve{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=t/o,f=e/l,d=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const y=p*f-a;for(let w=0;w<c;w++){const M=w*u-r;g.push(M,-y,0),v.push(0,0,1),m.push(w/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){const w=y+c*p,M=y+c*(p+1),R=y+1+c*(p+1),T=y+1+c*p;d.push(w,M,T),d.push(M,R,T)}this.setIndex(d),this.setAttribute("position",new le(g,3)),this.setAttribute("normal",new le(v,3)),this.setAttribute("uv",new le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pa(t.width,t.height,t.widthSegments,t.heightSegments)}}class Hl extends Ve{constructor(t=.5,e=1,i=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:r,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const o=[],l=[],c=[],h=[];let u=t;const f=(e-t)/s,d=new P,g=new ot;for(let v=0;v<=s;v++){for(let m=0;m<=i;m++){const p=r+m/i*a;d.x=u*Math.cos(p),d.y=u*Math.sin(p),l.push(d.x,d.y,d.z),c.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,h.push(g.x,g.y)}u+=f}for(let v=0;v<s;v++){const m=v*(i+1);for(let p=0;p<i;p++){const y=p+m,w=y,M=y+i+1,R=y+i+2,T=y+1;o.push(w,M,T),o.push(M,R,T)}}this.setIndex(o),this.setAttribute("position",new le(l,3)),this.setAttribute("normal",new le(c,3)),this.setAttribute("uv",new le(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hl(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class bs extends Ve{constructor(t=1,e=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new P,f=new P,d=[],g=[],v=[],m=[];for(let p=0;p<=i;p++){const y=[],w=p/i,M=a+w*o,R=t*Math.cos(M),T=Math.sqrt(t*t-R*R);let _=0;p===0&&a===0?_=.5/e:p===i&&l===Math.PI&&(_=-.5/e);for(let S=0;S<=e;S++){const I=S/e,C=s+I*r;u.x=-T*Math.cos(C),u.y=R,u.z=T*Math.sin(C),g.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),m.push(I+_,1-w),y.push(c++)}h.push(y)}for(let p=0;p<i;p++)for(let y=0;y<e;y++){const w=h[p][y+1],M=h[p][y],R=h[p+1][y],T=h[p+1][y+1];(p!==0||a>0)&&d.push(w,M,T),(p!==i-1||l<Math.PI)&&d.push(M,R,T)}this.setIndex(d),this.setAttribute("position",new le(g,3)),this.setAttribute("normal",new le(v,3)),this.setAttribute("uv",new le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bs(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Vl extends Ve{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},i=Math.floor(i),s=Math.floor(s);const l=[],c=[],h=[],u=[],f=new P,d=new P,g=new P;for(let v=0;v<=i;v++){const m=a+v/i*o;for(let p=0;p<=s;p++){const y=p/s*r;d.x=(t+e*Math.cos(m))*Math.cos(y),d.y=(t+e*Math.cos(m))*Math.sin(y),d.z=e*Math.sin(m),c.push(d.x,d.y,d.z),f.x=t*Math.cos(y),f.y=t*Math.sin(y),g.subVectors(d,f).normalize(),h.push(g.x,g.y,g.z),u.push(p/s),u.push(v/i)}}for(let v=1;v<=i;v++)for(let m=1;m<=s;m++){const p=(s+1)*v+m-1,y=(s+1)*(v-1)+m-1,w=(s+1)*(v-1)+m,M=(s+1)*v+m;l.push(p,y,M),l.push(y,w,M)}this.setIndex(l),this.setAttribute("position",new le(c,3)),this.setAttribute("normal",new le(h,3)),this.setAttribute("uv",new le(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vl(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}}class Wl extends Ve{constructor(t=new Sh(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),e=64,i=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:i,radialSegments:s,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new P,l=new P,c=new ot;let h=new P;const u=[],f=[],d=[],g=[];v(),this.setIndex(g),this.setAttribute("position",new le(u,3)),this.setAttribute("normal",new le(f,3)),this.setAttribute("uv",new le(d,2));function v(){for(let w=0;w<e;w++)m(w);m(r===!1?e:0),y(),p()}function m(w){h=t.getPointAt(w/e,h);const M=a.normals[w],R=a.binormals[w];for(let T=0;T<=s;T++){const _=T/s*Math.PI*2,S=Math.sin(_),I=-Math.cos(_);l.x=I*M.x+S*R.x,l.y=I*M.y+S*R.y,l.z=I*M.z+S*R.z,l.normalize(),f.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,u.push(o.x,o.y,o.z)}}function p(){for(let w=1;w<=e;w++)for(let M=1;M<=s;M++){const R=(s+1)*(w-1)+(M-1),T=(s+1)*w+(M-1),_=(s+1)*w+M,S=(s+1)*(w-1)+M;g.push(R,T,S),g.push(T,_,S)}}function y(){for(let w=0;w<=e;w++)for(let M=0;M<=s;M++)c.x=w/e,c.y=M/s,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new Wl(new oa[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}function vs(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];if(Zc(s))s.isRenderTargetTexture?(qt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone();else if(Array.isArray(s))if(Zc(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][i]=r}else t[e][i]=s.slice();else t[e][i]=s}}return t}function on(n){const t={};for(let e=0;e<n.length;e++){const i=vs(n[e]);for(const s in i)t[s]=i[s]}return t}function Zc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function Cd(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Ch(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:pe.workingColorSpace}const nr={clone:vs,merge:on};var Pd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ld=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class bn extends Vi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pd,this.fragmentShader=Ld,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=vs(t.uniforms),this.uniformsGroups=Cd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const i in t.uniforms){const s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=e[s.value]||null;break;case"c":this.uniforms[i].value=new Qt().setHex(s.value);break;case"v2":this.uniforms[i].value=new ot().fromArray(s.value);break;case"v3":this.uniforms[i].value=new P().fromArray(s.value);break;case"v4":this.uniforms[i].value=new Ne().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Kt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new be().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class Ph extends bn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class yn extends Vi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ea,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Dd extends Vi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ea,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fi,this.combine=pl,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Id extends Vi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ju,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Nd extends Vi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Xl extends Xe{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Qt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class Lh extends Xl{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const ja=new be,Kc=new P,Jc=new P;class Dh{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.mapType=Sn,this.map=null,this.mapPass=null,this.matrix=new be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Qs,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new Ne(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;Kc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Kc),Jc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Jc),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,s){ja.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(ja,t.coordinateSystem,t.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===Ks||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(ja)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Dr=new P,Ir=new ti,Vn=new P;class Ih extends Xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new be,this.projectionMatrix=new be,this.projectionMatrixInverse=new be,this.coordinateSystem=kn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Dr,Ir,Vn),Vn.x===1&&Vn.y===1&&Vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Dr,Ir,Vn.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(Dr,Ir,Vn),Vn.x===1&&Vn.y===1&&Vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Dr,Ir,Vn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const xi=new P,Qc=new ot,jc=new ot;class Mn extends Ih{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Js*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Hs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Js*2*Math.atan(Math.tan(Hs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){xi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(xi.x,xi.y).multiplyScalar(-t/xi.z),xi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(xi.x,xi.y).multiplyScalar(-t/xi.z)}getViewSize(t,e){return this.getViewBounds(t,Qc,jc),e.subVectors(jc,Qc)}setViewOffset(t,e,i,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Hs*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Ud extends Dh{constructor(){super(new Mn(90,1,.5,500)),this.isPointLightShadow=!0}}class Nh extends Xl{constructor(t,e,i=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Ud}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class Yl extends Ih{constructor(t=-1,e=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-t,a=i+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Fd extends Dh{constructor(){super(new Yl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Uh extends Xl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xe.DEFAULT_UP),this.updateMatrix(),this.target=new Xe,this.shadow=new Fd}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const es=-90,ns=1;class tl extends Xe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Mn(es,ns,t,e);s.layers=this.layers,this.add(s);const r=new Mn(es,ns,t,e);r.layers=this.layers,this.add(r);const a=new Mn(es,ns,t,e);a.layers=this.layers,this.add(a);const o=new Mn(es,ns,t,e);o.layers=this.layers,this.add(o);const l=new Mn(es,ns,t,e);l.layers=this.layers,this.add(l);const c=new Mn(es,ns,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===kn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ks)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,2,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,3,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.mipmapsAutoUpdate=v,t.setRenderTarget(i,5,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Od extends Mn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}}class Bd{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=zd.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function zd(){this._document.hidden===!1&&this.reset()}const t0=new be;class kd{constructor(t,e,i=0,s=1/0){this.ray=new da(t,e),this.near=i,this.far=s,this.camera=null,this.layers=new Dl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):_e("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return t0.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(t0),this}intersectObject(t,e=!0,i=[]){return el(t,this,i,e),i.sort(e0),i}intersectObjects(t,e=!0,i=[]){for(let s=0,r=t.length;s<r;s++)el(t[s],this,i,e);return i.sort(e0),i}}function e0(n,t){return n.distance-t.distance}function el(n,t,e,i){let s=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)el(r[a],t,e,!0)}}class Gd{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,qt("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}class nl{constructor(t=1,e=0,i=0){this.radius=t,this.phi=e,this.theta=i}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=ne(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(ne(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Hd extends Kf{constructor(t,e=16776960){const i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),s=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],r=new Ve;r.setIndex(new Jn(i,1)),r.setAttribute("position",new le(s,3)),super(r,new ph({color:e,toneMapped:!1})),this.box=t,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(t){const e=this.box;e.isEmpty()||(e.getCenter(this.position),e.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(t))}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class Vd extends Ri{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function n0(n,t,e,i){const s=Wd(i);switch(e){case th:return n*t;case wl:return n*t/s.components*s.byteLength;case El:return n*t/s.components*s.byteLength;case zi:return n*t*2/s.components*s.byteLength;case Tl:return n*t*2/s.components*s.byteLength;case eh:return n*t*3/s.components*s.byteLength;case Kn:return n*t*4/s.components*s.byteLength;case Al:return n*t*4/s.components*s.byteLength;case Vr:case Wr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Xr:case Yr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case bo:case Eo:return Math.max(n,16)*Math.max(t,8)/4;case So:case wo:return Math.max(n,8)*Math.max(t,8)/2;case To:case Ao:case Co:case Po:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ro:case jr:case Lo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Do:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Io:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case No:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Uo:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Fo:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Oo:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Bo:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case zo:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case ko:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Go:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Ho:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Vo:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Wo:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Xo:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Yo:case qo:case $o:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Zo:case Ko:return Math.ceil(n/4)*Math.ceil(t/4)*8;case ta:case Jo:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Wd(n){switch(n){case Sn:case K0:return{byteLength:1,components:1};case Zs:case J0:case mn:return{byteLength:2,components:1};case Sl:case bl:return{byteLength:2,components:4};case jn:case Ml:case zn:return{byteLength:4,components:1};case Q0:case j0:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:dl}}));typeof window<"u"&&(window.__THREE__?qt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=dl);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Fh(){let n=null,t=!1,e=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),e(r,a)}return{start:function(){t!==!0&&e!==null&&n!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function Xd(n){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=n.HALF_FLOAT:d=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=n.SHORT;else if(c instanceof Uint32Array)d=n.UNSIGNED_INT;else if(c instanceof Int32Array)d=n.INT;else if(c instanceof Int8Array)d=n.BYTE;else if(c instanceof Uint8Array)d=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((d,g)=>d.start-g.start);let f=0;for(let d=1;d<u.length;d++){const g=u[f],v=u[d];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++f,u[f]=v)}u.length=f+1;for(let d=0,g=u.length;d<g;d++){const v=u[d];n.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(n.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Yd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,qd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,$d=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Zd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Jd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Qd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,jd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,tp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,ep=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,np=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ip=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,sp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,rp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ap=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,op=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,lp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,hp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,up=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,fp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,dp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,pp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,mp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,gp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,_p=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,yp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Mp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Sp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,wp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Ep=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Tp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ap=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Rp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Cp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Pp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Lp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Dp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ip=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Np=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Up=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Fp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Op=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Bp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,kp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Hp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Vp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Wp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Yp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,qp=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,$p=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Qp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,jp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,em=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,im=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,rm=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,am=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,om=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,lm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,hm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,um=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,pm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,mm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_m=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ym=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Mm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Sm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Em=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Tm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Am=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Rm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Cm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Pm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Lm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Dm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Im=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Um=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Om=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Bm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,zm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,km=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Wm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ym=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$m=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Km=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Qm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,jm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,tg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ng=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ag=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,og=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,hg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ug=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,fg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,dg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,gg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_g=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,yg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,wg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ae={alphahash_fragment:Yd,alphahash_pars_fragment:qd,alphamap_fragment:$d,alphamap_pars_fragment:Zd,alphatest_fragment:Kd,alphatest_pars_fragment:Jd,aomap_fragment:Qd,aomap_pars_fragment:jd,batching_pars_vertex:tp,batching_vertex:ep,begin_vertex:np,beginnormal_vertex:ip,bsdfs:sp,iridescence_fragment:rp,bumpmap_pars_fragment:ap,clipping_planes_fragment:op,clipping_planes_pars_fragment:lp,clipping_planes_pars_vertex:cp,clipping_planes_vertex:hp,color_fragment:up,color_pars_fragment:fp,color_pars_vertex:dp,color_vertex:pp,common:mp,defaultnormal_vertex:gp,displacementmap_pars_vertex:_p,displacementmap_vertex:vp,emissivemap_fragment:xp,emissivemap_pars_fragment:yp,colorspace_fragment:Mp,colorspace_pars_fragment:Sp,envmap_fragment:bp,envmap_common_pars_fragment:wp,envmap_pars_fragment:Ep,envmap_pars_vertex:Tp,envmap_physical_pars_fragment:Op,envmap_vertex:Ap,fog_vertex:Rp,fog_pars_vertex:Cp,fog_fragment:Pp,fog_pars_fragment:Lp,gradientmap_pars_fragment:Dp,lightmap_pars_fragment:Ip,lights_lambert_fragment:Np,lights_lambert_pars_fragment:Up,lights_pars_begin:Fp,lights_toon_fragment:Bp,lights_toon_pars_fragment:zp,lights_phong_fragment:kp,lights_phong_pars_fragment:Gp,lights_physical_fragment:Hp,lights_physical_pars_fragment:Vp,lights_fragment_begin:Wp,lights_fragment_maps:Xp,lights_fragment_end:Yp,lightprobes_pars_fragment:qp,logdepthbuf_fragment:$p,logdepthbuf_pars_fragment:Zp,logdepthbuf_pars_vertex:Kp,logdepthbuf_vertex:Jp,map_fragment:Qp,map_pars_fragment:jp,map_particle_fragment:tm,map_particle_pars_fragment:em,metalnessmap_fragment:nm,metalnessmap_pars_fragment:im,morphinstance_vertex:sm,morphcolor_vertex:rm,morphnormal_vertex:am,morphtarget_pars_vertex:om,morphtarget_vertex:lm,normal_fragment_begin:cm,normal_fragment_maps:hm,normal_pars_fragment:um,normal_pars_vertex:fm,normal_vertex:dm,normalmap_pars_fragment:pm,clearcoat_normal_fragment_begin:mm,clearcoat_normal_fragment_maps:gm,clearcoat_pars_fragment:_m,iridescence_pars_fragment:vm,opaque_fragment:xm,packing:ym,premultiplied_alpha_fragment:Mm,project_vertex:Sm,dithering_fragment:bm,dithering_pars_fragment:wm,roughnessmap_fragment:Em,roughnessmap_pars_fragment:Tm,shadowmap_pars_fragment:Am,shadowmap_pars_vertex:Rm,shadowmap_vertex:Cm,shadowmask_pars_fragment:Pm,skinbase_vertex:Lm,skinning_pars_vertex:Dm,skinning_vertex:Im,skinnormal_vertex:Nm,specularmap_fragment:Um,specularmap_pars_fragment:Fm,tonemapping_fragment:Om,tonemapping_pars_fragment:Bm,transmission_fragment:zm,transmission_pars_fragment:km,uv_pars_fragment:Gm,uv_pars_vertex:Hm,uv_vertex:Vm,worldpos_vertex:Wm,background_vert:Xm,background_frag:Ym,backgroundCube_vert:qm,backgroundCube_frag:$m,cube_vert:Zm,cube_frag:Km,depth_vert:Jm,depth_frag:Qm,distance_vert:jm,distance_frag:tg,equirect_vert:eg,equirect_frag:ng,linedashed_vert:ig,linedashed_frag:sg,meshbasic_vert:rg,meshbasic_frag:ag,meshlambert_vert:og,meshlambert_frag:lg,meshmatcap_vert:cg,meshmatcap_frag:hg,meshnormal_vert:ug,meshnormal_frag:fg,meshphong_vert:dg,meshphong_frag:pg,meshphysical_vert:mg,meshphysical_frag:gg,meshtoon_vert:_g,meshtoon_frag:vg,points_vert:xg,points_frag:yg,shadow_vert:Mg,shadow_frag:Sg,sprite_vert:bg,sprite_frag:wg},Ct={common:{diffuse:{value:new Qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new Qt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},$n={basic:{uniforms:on([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.fog]),vertexShader:ae.meshbasic_vert,fragmentShader:ae.meshbasic_frag},lambert:{uniforms:on([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new Qt(0)},envMapIntensity:{value:1}}]),vertexShader:ae.meshlambert_vert,fragmentShader:ae.meshlambert_frag},phong:{uniforms:on([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new Qt(0)},specular:{value:new Qt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ae.meshphong_vert,fragmentShader:ae.meshphong_frag},standard:{uniforms:on([Ct.common,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.roughnessmap,Ct.metalnessmap,Ct.fog,Ct.lights,{emissive:{value:new Qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ae.meshphysical_vert,fragmentShader:ae.meshphysical_frag},toon:{uniforms:on([Ct.common,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.gradientmap,Ct.fog,Ct.lights,{emissive:{value:new Qt(0)}}]),vertexShader:ae.meshtoon_vert,fragmentShader:ae.meshtoon_frag},matcap:{uniforms:on([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,{matcap:{value:null}}]),vertexShader:ae.meshmatcap_vert,fragmentShader:ae.meshmatcap_frag},points:{uniforms:on([Ct.points,Ct.fog]),vertexShader:ae.points_vert,fragmentShader:ae.points_frag},dashed:{uniforms:on([Ct.common,Ct.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ae.linedashed_vert,fragmentShader:ae.linedashed_frag},depth:{uniforms:on([Ct.common,Ct.displacementmap]),vertexShader:ae.depth_vert,fragmentShader:ae.depth_frag},normal:{uniforms:on([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,{opacity:{value:1}}]),vertexShader:ae.meshnormal_vert,fragmentShader:ae.meshnormal_frag},sprite:{uniforms:on([Ct.sprite,Ct.fog]),vertexShader:ae.sprite_vert,fragmentShader:ae.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ae.background_vert,fragmentShader:ae.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:ae.backgroundCube_vert,fragmentShader:ae.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ae.cube_vert,fragmentShader:ae.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ae.equirect_vert,fragmentShader:ae.equirect_frag},distance:{uniforms:on([Ct.common,Ct.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ae.distance_vert,fragmentShader:ae.distance_frag},shadow:{uniforms:on([Ct.lights,Ct.fog,{color:{value:new Qt(0)},opacity:{value:1}}]),vertexShader:ae.shadow_vert,fragmentShader:ae.shadow_frag}};$n.physical={uniforms:on([$n.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Kt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new Qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new Qt(0)},specularColor:{value:new Qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:ae.meshphysical_vert,fragmentShader:ae.meshphysical_frag};const Nr={r:0,b:0,g:0},Eg=new be,Oh=new Kt;Oh.set(-1,0,0,0,1,0,0,0,1);function Tg(n,t,e,i,s,r){const a=new Qt(0);let o=s===!0?0:1,l,c,h=null,u=0,f=null;function d(y){let w=y.isScene===!0?y.background:null;if(w&&w.isTexture){const M=y.backgroundBlurriness>0;w=t.get(w,M)}return w}function g(y){let w=!1;const M=d(y);M===null?m(a,o):M&&M.isColor&&(m(M,1),w=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?e.buffers.color.setClear(0,0,0,1,r):R==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(n.autoClear||w)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function v(y,w){const M=d(w);M&&M.isCubeTexture?(c===void 0&&(c=new ie(new dn(1,1,1),new bn({name:"BackgroundCubeMaterial",uniforms:vs($n.backgroundCube.uniforms),vertexShader:$n.backgroundCube.vertexShader,fragmentShader:$n.backgroundCube.fragmentShader,side:cn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(R,T,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Eg.makeRotationFromEuler(w.backgroundRotation)).transpose(),M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Oh),c.material.toneMapped=pe.getTransfer(M.colorSpace)!==we,(h!==M||u!==M.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,h=M,u=M.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new ie(new pa(2,2),new bn({name:"BackgroundMaterial",uniforms:vs($n.background.uniforms),vertexShader:$n.background.vertexShader,fragmentShader:$n.background.fragmentShader,side:Bi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=pe.getTransfer(M.colorSpace)!==we,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||u!==M.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,h=M,u=M.version,f=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function m(y,w){y.getRGB(Nr,Ch(n)),e.buffers.color.setClear(Nr.r,Nr.g,Nr.b,w,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,w=1){a.set(y),o=w,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(y){o=y,m(a,o)},render:g,addToRenderList:v,dispose:p}}function Ag(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null);let r=s,a=!1;function o(N,k,q,D,H){let J=!1;const z=u(N,D,q,k);r!==z&&(r=z,c(r.object)),J=d(N,D,q,H),J&&g(N,D,q,H),H!==null&&t.update(H,n.ELEMENT_ARRAY_BUFFER),(J||a)&&(a=!1,M(N,k,q,D),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function l(){return n.createVertexArray()}function c(N){return n.bindVertexArray(N)}function h(N){return n.deleteVertexArray(N)}function u(N,k,q,D){const H=D.wireframe===!0;let J=i[k.id];J===void 0&&(J={},i[k.id]=J);const z=N.isInstancedMesh===!0?N.id:0;let lt=J[z];lt===void 0&&(lt={},J[z]=lt);let $=lt[q.id];$===void 0&&($={},lt[q.id]=$);let nt=$[H];return nt===void 0&&(nt=f(l()),$[H]=nt),nt}function f(N){const k=[],q=[],D=[];for(let H=0;H<e;H++)k[H]=0,q[H]=0,D[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:q,attributeDivisors:D,object:N,attributes:{},index:null}}function d(N,k,q,D){const H=r.attributes,J=k.attributes;let z=0;const lt=q.getAttributes();for(const $ in lt)if(lt[$].location>=0){const at=H[$];let Dt=J[$];if(Dt===void 0&&($==="instanceMatrix"&&N.instanceMatrix&&(Dt=N.instanceMatrix),$==="instanceColor"&&N.instanceColor&&(Dt=N.instanceColor)),at===void 0||at.attribute!==Dt||Dt&&at.data!==Dt.data)return!0;z++}return r.attributesNum!==z||r.index!==D}function g(N,k,q,D){const H={},J=k.attributes;let z=0;const lt=q.getAttributes();for(const $ in lt)if(lt[$].location>=0){let at=J[$];at===void 0&&($==="instanceMatrix"&&N.instanceMatrix&&(at=N.instanceMatrix),$==="instanceColor"&&N.instanceColor&&(at=N.instanceColor));const Dt={};Dt.attribute=at,at&&at.data&&(Dt.data=at.data),H[$]=Dt,z++}r.attributes=H,r.attributesNum=z,r.index=D}function v(){const N=r.newAttributes;for(let k=0,q=N.length;k<q;k++)N[k]=0}function m(N){p(N,0)}function p(N,k){const q=r.newAttributes,D=r.enabledAttributes,H=r.attributeDivisors;q[N]=1,D[N]===0&&(n.enableVertexAttribArray(N),D[N]=1),H[N]!==k&&(n.vertexAttribDivisor(N,k),H[N]=k)}function y(){const N=r.newAttributes,k=r.enabledAttributes;for(let q=0,D=k.length;q<D;q++)k[q]!==N[q]&&(n.disableVertexAttribArray(q),k[q]=0)}function w(N,k,q,D,H,J,z){z===!0?n.vertexAttribIPointer(N,k,q,H,J):n.vertexAttribPointer(N,k,q,D,H,J)}function M(N,k,q,D){v();const H=D.attributes,J=q.getAttributes(),z=k.defaultAttributeValues;for(const lt in J){const $=J[lt];if($.location>=0){let nt=H[lt];if(nt===void 0&&(lt==="instanceMatrix"&&N.instanceMatrix&&(nt=N.instanceMatrix),lt==="instanceColor"&&N.instanceColor&&(nt=N.instanceColor)),nt!==void 0){const at=nt.normalized,Dt=nt.itemSize,Ht=t.get(nt);if(Ht===void 0)continue;const Q=Ht.buffer,bt=Ht.type,It=Ht.bytesPerElement,Vt=bt===n.INT||bt===n.UNSIGNED_INT||nt.gpuType===Ml;if(nt.isInterleavedBufferAttribute){const G=nt.data,ut=G.isInterleavedBuffer===!0?G.stride:G.itemSize,Gt=nt.offset;if(G.isInstancedInterleavedBuffer||G.isInstancedBufferAttribute){for(let Pt=0;Pt<$.locationSize;Pt++)p($.location+Pt,G.meshPerAttribute);N.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let Pt=0;Pt<$.locationSize;Pt++)m($.location+Pt);n.bindBuffer(n.ARRAY_BUFFER,Q);for(let Pt=0;Pt<$.locationSize;Pt++)w($.location+Pt,Dt/$.locationSize,bt,at,ut*It,(Gt+Dt/$.locationSize*Pt)*It,Vt)}else{if(nt.isInstancedBufferAttribute){for(let G=0;G<$.locationSize;G++)p($.location+G,nt.meshPerAttribute);N.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let G=0;G<$.locationSize;G++)m($.location+G);n.bindBuffer(n.ARRAY_BUFFER,Q);for(let G=0;G<$.locationSize;G++)w($.location+G,Dt/$.locationSize,bt,at,Dt*It,Dt/$.locationSize*G*It,Vt)}}else if(z!==void 0){const at=z[lt];if(at!==void 0)switch(at.length){case 2:n.vertexAttrib2fv($.location,at);break;case 3:n.vertexAttrib3fv($.location,at);break;case 4:n.vertexAttrib4fv($.location,at);break;default:n.vertexAttrib1fv($.location,at)}}}}y()}function R(){I();for(const N in i){const k=i[N];for(const q in k){const D=k[q];for(const H in D){const J=D[H];for(const z in J)h(J[z].object),delete J[z];delete D[H]}}delete i[N]}}function T(N){if(i[N.id]===void 0)return;const k=i[N.id];for(const q in k){const D=k[q];for(const H in D){const J=D[H];for(const z in J)h(J[z].object),delete J[z];delete D[H]}}delete i[N.id]}function _(N){for(const k in i){const q=i[k];for(const D in q){const H=q[D];if(H[N.id]===void 0)continue;const J=H[N.id];for(const z in J)h(J[z].object),delete J[z];delete H[N.id]}}}function S(N){for(const k in i){const q=i[k],D=N.isInstancedMesh===!0?N.id:0,H=q[D];if(H!==void 0){for(const J in H){const z=H[J];for(const lt in z)h(z[lt].object),delete z[lt];delete H[J]}delete q[D],Object.keys(q).length===0&&delete i[k]}}}function I(){C(),a=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:C,dispose:R,releaseStatesOfGeometry:T,releaseStatesOfObject:S,releaseStatesOfProgram:_,initAttributes:v,enableAttribute:m,disableUnusedAttributes:y}}function Rg(n,t,e){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),e.update(c,i,1)}function a(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),e.update(c,i,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let f=0;for(let d=0;d<h;d++)f+=c[d];e.update(f,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Cg(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const _=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(_){return!(_!==Kn&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){const S=_===mn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(_!==Sn&&_!==zn&&!S&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(qt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=e.logarithmicDepthBuffer===!0&&u===!1;e.reversedDepthBuffer===!0&&u===!1&&qt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&u===!0&&qt("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),w=n.getParameter(n.MAX_VARYING_VECTORS),M=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:y,maxVaryings:w,maxFragmentUniforms:M,maxSamples:R,samples:T}}function Pg(n){const t=this;let e=null,i=0,s=!1,r=!1;const a=new qn,o=new Kt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||i!==0||s;return s=f,i=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const y=r?0:i,w=y*4;let M=p.clippingState||null;l.value=M,M=h(g,f,w,d);for(let R=0;R!==w;++R)M[R]=e[R];p.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,f,d,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=d+v*4,y=f.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let w=0,M=d;w!==v;++w,M+=4)a.copy(u[w]).applyMatrix4(y,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}class ql extends gn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new mh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new dn(5,5,5),r=new bn({name:"CubemapFromEquirect",uniforms:vs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:cn,blending:Fi});r.uniforms.tEquirect.value=e;const a=new ie(s,r),o=e.minFilter;return e.minFilter===bi&&(e.minFilter=pn),new tl(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(r)}}const i0=256,Lg=3,Dg=20,Bh=256,zh=16,Ig=3,Ng=new P,Ug=new Qt;class xs{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new tl(1,10,null),this._boxMesh=new ie(new dn(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,i=.1,s=100,r={}){const{size:a=256,position:o=Ng}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),h=this._getSourceTarget(!0);e>0&&(h.texture.mipmapsAutoUpdate=!1);const u=l.autoClear,f=l.autoClearColor,d=l.autoClearDepth,g=l.autoClearStencil,v=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,v===null&&(t.background=l.getClearColor(Ug));const m=new tl(i,s,h);return m.position.copy(o),m.update(l,t),l.autoClear=u,l.autoClearColor=f,l.autoClearDepth=d,l.autoClearStencil=g,t.background=v,e>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,e)),this._applyPMREM(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=a0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=r0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(i0,ah(t))}_fromTexture(t,e){t.mapping===ps||t.mapping===$s?this._setSize(t.image.length===0?i0:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);const i=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(i),i}_allocateTarget(){const t=this._cubeSize,e=s0(t,!1,!1),i=Math.log2(t)-Lg;for(let s=0;s<=i;s++)e.texture.mipmaps.push({width:t>>s,height:t>>s});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){const e=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==e||t&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=s0(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,i){const s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=t,r.activeMipmapLevel=e;const a=t.width>>e;t.viewport.set(0,0,a,a),r.update(this._renderer,s),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===ps||t.mapping===$s?(this._cubemapMaterial===null&&(this._cubemapMaterial=a0()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=r0()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Fg(),this._integrationMaterial=Og());const e=this._cubeSize,i=t.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/zh);for(let a=0;a<=i;a++){const o=xs.lodToRoughness(a,i);if(a>i-Ig)r.roughness.value=o,this._renderCube(t,a,this._integrationMaterial);else{const l=o>0?Math.log2(e)+.5*Math.log2(6/(Bh*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(t,a,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=Bg());const i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(t,0,i),s.envMap.value=t.texture,this._renderCube(r,0,i)}}function s0(n,t,e){return new ql(n,{minFilter:bi,generateMipmaps:t,type:mn,colorSpace:na,depthBuffer:e})}function ar(n,t,e){return new bn({name:n,uniforms:t,vertexShader:ae.cube_vert,fragmentShader:e,side:cn,blending:Fi,depthTest:!1,depthWrite:!1})}function Fg(){return ar("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Bh}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Og(){return ar("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:zh}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Bg(){return ar("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Dg}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function r0(){return ar("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function a0(){return ar("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function zg(n){let t=new WeakMap,e=new WeakMap,i=null;function s(f,d=!1){return f==null?null:d?a(f):r(f)}function r(f){if(f&&f.isTexture){const d=f.mapping;if(d===Ea||d===Ta)if(t.has(f)){const g=t.get(f).texture;return o(g,f.mapping)}else{const g=f.image;if(g&&g.height>0){const v=new ql(g.height);return v.fromEquirectangularTexture(n,f),t.set(f,v),f.addEventListener("dispose",c),o(v.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture&&f.isPMREMTexture!==!0){const d=f.mapping,g=d===Ea||d===Ta,v=d===ps||d===$s;if(g||v){let m=e.get(f);const p=m!==void 0?m.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==p)return i===null&&(i=new xs(n)),m=g?i.fromEquirectangular(f,m):i.fromCubemap(f,m),m.texture.pmremVersion=f.pmremVersion,e.set(f,m),m.texture;if(m!==void 0)return m.texture;{const y=f.image;return g&&y&&y.height>0||v&&y&&l(y)?(i===null&&(i=new xs(n)),m=g?i.fromEquirectangular(f):i.fromCubemap(f),m.texture.pmremVersion=f.pmremVersion,e.set(f,m),f.addEventListener("dispose",h),m.texture):null}}}return f}function o(f,d){return d===Ea?f.mapping=ps:d===Ta&&(f.mapping=$s),f}function l(f){let d=0;const g=6;for(let v=0;v<g;v++)f[v]!==void 0&&d++;return d===g}function c(f){const d=f.target;d.removeEventListener("dispose",c);const g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function h(f){const d=f.target;d.removeEventListener("dispose",h);const g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function u(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:u}}function kg(n){const t={};function e(i){if(t[i]!==void 0)return t[i];const s=n.getExtension(i);return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&qr("WebGLRenderer: "+i+" extension not supported."),s}}}function Gg(n,t,e,i){const s={},r=new WeakMap,a=new FinalizationRegistry(g=>delete s[g]);function o(g){l(g.target)}function l(g){g.index!==null&&t.remove(g.index);for(const m in g.attributes)t.remove(g.attributes[m]);g.removeEventListener("dispose",o),delete s[g.id],a.unregister(g);const v=r.get(g);v&&(t.remove(v),r.delete(g)),i.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,e.memory.geometries--}function c(g,v){return s[v.id]!==void 0||(v.addEventListener("dispose",o),s[v.id]=new WeakRef(v),a.register(v,v.id,v),e.memory.geometries++),v}function h(g){const v=g.attributes;for(const m in v)t.update(v[m],n.ARRAY_BUFFER)}function u(g){const v=g.index,m=g.attributes.position;let p=0;if(m===void 0)return;const y=v!==null?v.array.length:m.array.length/3-1,w=m.count>=65535?fh:uh,M=new w(Math.ceil(y/3)*6,1),R=M.array;if(v!==null){const _=v.array;p=v.version;for(let S=0,I=0;S<y;S+=3){const C=_[S+0],N=_[S+1],k=_[S+2];R[I++]=C,R[I++]=N,R[I++]=N,R[I++]=k,R[I++]=k,R[I++]=C}}else{p=m.version;for(let _=0,S=0;_<y;_+=3){const I=_+0,C=_+1,N=_+2;R[S++]=I,R[S++]=C,R[S++]=C,R[S++]=N,R[S++]=N,R[S++]=I}}M.version=p;const T=r.get(g);T&&t.remove(T),r.set(g,M)}function f(g){const v=r.get(g);if(v){const m=g.index;m!==null&&v.version<m.version&&u(g)}else u(g);return r.get(g)}function d(){for(const g in s){const v=s[g].deref();v!==void 0&&l(v)}}return{get:c,update:h,getWireframeAttribute:f,dispose:d}}function Hg(n,t,e){let i;function s(u){i=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,f){n.drawElements(i,f,r,u*a),e.update(f,i,1)}function c(u,f,d){d!==0&&(n.drawElementsInstanced(i,f,r,u*a,d),e.update(f,i,d))}function h(u,f,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,u,0,d);let v=0;for(let m=0;m<d;m++)v+=f[m];e.update(v,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Vg(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(r/3);break;case n.LINES:e.lines+=o*(r/2);break;case n.LINE_STRIP:e.lines+=o*(r-1);break;case n.LINE_LOOP:e.lines+=o*r;break;case n.POINTS:e.points+=o*r;break;default:_e("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Wg(n,t,e){const i=new WeakMap,s=new Ne;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=i.get(o);if(f===void 0||f.count!==u){let C=function(){S.dispose(),i.delete(o),o.removeEventListener("dispose",C)};var d=C;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let M=0;g===!0&&(M=1),v===!0&&(M=2),m===!0&&(M=3);let R=o.attributes.position.count*M,T=1;R>t.maxTextureSize&&(T=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const _=new Float32Array(R*T*4*u),S=new ch(_,R,T,u);S.type=zn,S.needsUpdate=!0;const I=M*4;for(let N=0;N<u;N++){const k=p[N],q=y[N],D=w[N],H=R*T*4*N;for(let J=0;J<k.count;J++){const z=J*I;g===!0&&(s.fromBufferAttribute(k,J),_[H+z+0]=s.x,_[H+z+1]=s.y,_[H+z+2]=s.z,_[H+z+3]=0),v===!0&&(s.fromBufferAttribute(q,J),_[H+z+4]=s.x,_[H+z+5]=s.y,_[H+z+6]=s.z,_[H+z+7]=0),m===!0&&(s.fromBufferAttribute(D,J),_[H+z+8]=s.x,_[H+z+9]=s.y,_[H+z+10]=s.z,_[H+z+11]=D.itemSize===4?s.w:1)}}f={count:u,texture:S,size:new ot(R,T)},i.set(o,f),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",v),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function Xg(n,t,e,i,s){let r=new WeakMap;function a(c){const h=s.render.frame,u=c.geometry,f=t.get(c,u);if(r.get(f)!==h&&(t.update(f),r.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return f}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}const Yg={[ml]:"LINEAR_TONE_MAPPING",[gl]:"REINHARD_TONE_MAPPING",[_l]:"CINEON_TONE_MAPPING",[sr]:"ACES_FILMIC_TONE_MAPPING",[xl]:"AGX_TONE_MAPPING",[yl]:"NEUTRAL_TONE_MAPPING",[vl]:"CUSTOM_TONE_MAPPING"};function qg(n,t,e,i,s,r){const a=new gn(t,e,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const h=new Ve;h.setAttribute("position",new le([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new le([0,2,0,0,2,0],2));const u=new Ph({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new ie(h,u),d=new Yl(-1,1,1,-1,0,1);let g=null,v=null,m=!1,p,y=null,w=[],M=!1;this.setSize=function(R,T){a.setSize(R,T),o!==null&&o.setSize(R,T),l!==null&&l.setSize(R,T);for(let _=0;_<w.length;_++){const S=w[_];S.setSize&&S.setSize(R,T)}},this.setEffects=function(R){w=R,M=w.length>0&&w[0].isRenderPass===!0;const T=a.width,_=a.height;w.length>0&&o===null&&(o=new gn(T,_,{type:mn,depthBuffer:!1,stencilBuffer:!1}),l=new gn(T,_,{type:mn,depthBuffer:!1,stencilBuffer:!1}));const S=s===!0&&w.some(I=>I.needsDepthTexture===!0);S!==(a.depthTexture!==null)&&(S===!0&&c===null&&(c=new gs(T,_),r===!0&&(c.format=wi,c.type=ms)),a.dispose(),a.depthTexture=S?c:null,a.resolveDepthBuffer=S,a.storeMultisampledDepthBuffer=S);for(let I=0;I<w.length;I++){const C=w[I];C.setSize&&C.setSize(T,_),S&&C.needsDepthTexture===!0&&C.setDepthTexture&&C.setDepthTexture(c)}},this.begin=function(R,T){if(m||R.toneMapping===hi&&w.length===0)return!1;if(y=T,T!==null){const _=T.width,S=T.height;(a.width!==_||a.height!==S)&&this.setSize(_,S)}return M===!1&&R.setRenderTarget(a),p=R.toneMapping,R.toneMapping=hi,!0},this.hasRenderPass=function(){return M},this.end=function(R,T){R.toneMapping=p,m=!0;let _=a,S=o;for(let I=0;I<w.length;I++){const C=w[I];C.enabled!==!1&&(C.render(R,S,_,T),C.needsSwap!==!1&&(_=S,S=S===o?l:o))}if(g!==R.outputColorSpace||v!==R.toneMapping){g=R.outputColorSpace,v=R.toneMapping,u.defines={},pe.getTransfer(g)===we&&(u.defines.SRGB_TRANSFER="");const I=Yg[v];I&&(u.defines[I]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=_.texture,R.setRenderTarget(y),R.render(f,d),y=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}const kh=new rn,Gh=new gs(1,1),Hh=new gh(1),Vh=new ch,Wh=new Lf,Xh=new mh,o0=[],l0=[],c0=new Float32Array(16),h0=new Float32Array(9),u0=new Float32Array(4);function ws(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let r=o0[s];if(r===void 0&&(r=new Float32Array(s),o0[s]=r),t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(r,o)}return r}function Ye(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function qe(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ma(n,t){let e=l0[t];e===void 0&&(e=new Int32Array(t),l0[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function $g(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Zg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;n.uniform2fv(this.addr,t),qe(e,t)}}function Kg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ye(e,t))return;n.uniform3fv(this.addr,t),qe(e,t)}}function Jg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;n.uniform4fv(this.addr,t),qe(e,t)}}function Qg(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ye(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),qe(e,t)}else{if(Ye(e,i))return;u0.set(i),n.uniformMatrix2fv(this.addr,!1,u0),qe(e,i)}}function jg(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ye(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),qe(e,t)}else{if(Ye(e,i))return;h0.set(i),n.uniformMatrix3fv(this.addr,!1,h0),qe(e,i)}}function t_(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ye(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),qe(e,t)}else{if(Ye(e,i))return;c0.set(i),n.uniformMatrix4fv(this.addr,!1,c0),qe(e,i)}}function e_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function n_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;n.uniform2iv(this.addr,t),qe(e,t)}}function i_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ye(e,t))return;n.uniform3iv(this.addr,t),qe(e,t)}}function s_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;n.uniform4iv(this.addr,t),qe(e,t)}}function r_(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function a_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ye(e,t))return;n.uniform2uiv(this.addr,t),qe(e,t)}}function o_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ye(e,t))return;n.uniform3uiv(this.addr,t),qe(e,t)}}function l_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ye(e,t))return;n.uniform4uiv(this.addr,t),qe(e,t)}}function ga(n){return n.version===0&&(n.compareFunction=sh,n.needsUpdate=!0),n}function c_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=ga(Gh):r=kh,e.setTexture2D(t||r,s)}function h_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Wh,s)}function u_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=ga(Hh):r=Xh,e.setTextureCube(t||r,s)}function f_(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Vh,s)}function d_(n){switch(n){case 5126:return $g;case 35664:return Zg;case 35665:return Kg;case 35666:return Jg;case 35674:return Qg;case 35675:return jg;case 35676:return t_;case 5124:case 35670:return e_;case 35667:case 35671:return n_;case 35668:case 35672:return i_;case 35669:case 35673:return s_;case 5125:return r_;case 36294:return a_;case 36295:return o_;case 36296:return l_;case 35678:case 36198:case 36298:case 36306:case 35682:return c_;case 35679:case 36299:case 36307:return h_;case 35680:case 36300:case 36308:case 36293:return u_;case 36289:case 36303:case 36311:case 36292:return f_}}function p_(n,t){n.uniform1fv(this.addr,t)}function m_(n,t){const e=ws(t,this.size,2);n.uniform2fv(this.addr,e)}function g_(n,t){const e=ws(t,this.size,3);n.uniform3fv(this.addr,e)}function __(n,t){const e=ws(t,this.size,4);n.uniform4fv(this.addr,e)}function v_(n,t){const e=ws(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function x_(n,t){const e=ws(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function y_(n,t){const e=ws(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function M_(n,t){n.uniform1iv(this.addr,t)}function S_(n,t){n.uniform2iv(this.addr,t)}function b_(n,t){n.uniform3iv(this.addr,t)}function w_(n,t){n.uniform4iv(this.addr,t)}function E_(n,t){n.uniform1uiv(this.addr,t)}function T_(n,t){n.uniform2uiv(this.addr,t)}function A_(n,t){n.uniform3uiv(this.addr,t)}function R_(n,t){n.uniform4uiv(this.addr,t)}function C_(n,t,e){const i=this.cache,s=t.length,r=ma(e,s);Ye(i,r)||(n.uniform1iv(this.addr,r),qe(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=ga(Gh):a=kh;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function P_(n,t,e){const i=this.cache,s=t.length,r=ma(e,s);Ye(i,r)||(n.uniform1iv(this.addr,r),qe(i,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Wh,r[a])}function L_(n,t,e){const i=this.cache,s=t.length,r=ma(e,s);Ye(i,r)||(n.uniform1iv(this.addr,r),qe(i,r));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=ga(Hh):a=Xh;for(let o=0;o!==s;++o)e.setTextureCube(t[o]||a,r[o])}function D_(n,t,e){const i=this.cache,s=t.length,r=ma(e,s);Ye(i,r)||(n.uniform1iv(this.addr,r),qe(i,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Vh,r[a])}function I_(n){switch(n){case 5126:return p_;case 35664:return m_;case 35665:return g_;case 35666:return __;case 35674:return v_;case 35675:return x_;case 35676:return y_;case 5124:case 35670:return M_;case 35667:case 35671:return S_;case 35668:case 35672:return b_;case 35669:case 35673:return w_;case 5125:return E_;case 36294:return T_;case 36295:return A_;case 36296:return R_;case 35678:case 36198:case 36298:case 36306:case 35682:return C_;case 35679:case 36299:case 36307:return P_;case 35680:case 36300:case 36308:case 36293:return L_;case 36289:case 36303:case 36311:case 36292:return D_}}class N_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=d_(e.type)}}class U_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=I_(e.type)}}class F_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],i)}}}const to=/(\w+)(\])?(\[|\.)?/g;function f0(n,t){n.seq.push(t),n.map[t.id]=t}function O_(n,t,e){const i=n.name,s=i.length;for(to.lastIndex=0;;){const r=to.exec(i),a=to.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){f0(e,c===void 0?new N_(o,n,t):new U_(o,n,t));break}else{let u=e.map[o];u===void 0&&(u=new F_(o),f0(e,u)),e=u}}}class $r{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);O_(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,i,s){const r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function d0(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const B_=37297;let z_=0;function k_(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const p0=new Kt;function G_(n){pe._getMatrix(p0,pe.workingColorSpace,n);const t=`mat3( ${p0.elements.map(e=>e.toFixed(4))} )`;switch(pe.getTransfer(n)){case ia:return[t,"LinearTransferOETF"];case we:return[t,"sRGBTransferOETF"];default:return qt("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function m0(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+k_(n.getShaderSource(t),o)}else return r}function H_(n,t){const e=G_(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const V_={[ml]:"Linear",[gl]:"Reinhard",[_l]:"Cineon",[sr]:"ACESFilmic",[xl]:"AgX",[yl]:"Neutral",[vl]:"Custom"};function W_(n,t){const e=V_[t];return e===void 0?(qt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ur=new P;function X_(){pe.getLuminanceCoefficients(Ur);const n=Ur.x.toFixed(4),t=Ur.y.toFixed(4),e=Ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Y_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(zs).join(`
`)}function q_(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function $_(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(t,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function zs(n){return n!==""}function g0(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function _0(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Z_=/^[ \t]*#include +<([\w\d./]+)>/gm;function il(n){return n.replace(Z_,K_)}function K_(n,t){const e=ae[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return il(e)}const J_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function v0(n){return n.replace(J_,Q_)}function Q_(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function x0(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const j_={[Hr]:"SHADOWMAP_TYPE_PCF",[Os]:"SHADOWMAP_TYPE_VSM"};function t1(n){return j_[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const e1={[$s]:"ENVMAP_MODE_REFRACTION"};function n1(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":e1[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const i1={[pl]:"ENVMAP_BLENDING_MULTIPLY",[$u]:"ENVMAP_BLENDING_MIX",[Zu]:"ENVMAP_BLENDING_ADD"};function s1(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":i1[n.combine]||"ENVMAP_BLENDING_NONE"}function r1(n,t,e,i){const s=n.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=t1(e),c=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=n1(e),u=s1(e),f=Y_(e),d=q_(r),g=s.createProgram();let v,m,p=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d].filter(zs).join(`
`),v.length>0&&(v+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d].filter(zs).join(`
`),m.length>0&&(m+=`
`)):(v=[x0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(zs).join(`
`),m=[x0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==hi?"#define TONE_MAPPING":"",e.toneMapping!==hi?ae.tonemapping_pars_fragment:"",e.toneMapping!==hi?W_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ae.colorspace_pars_fragment,H_("linearToOutputTexel",e.outputColorSpace),X_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(zs).join(`
`)),a=il(a),a=g0(a,e),a=_0(a,e),o=il(o),o=g0(o,e),o=_0(o,e),a=v0(a),o=v0(o),e.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,v=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,m=["#define varying in",e.glslVersion===gc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===gc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=p+v+a,w=p+m+o,M=d0(s,s.VERTEX_SHADER,y),R=d0(s,s.FRAGMENT_SHADER,w);s.attachShader(g,M),s.attachShader(g,R),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function T(C){if(n.debug.checkShaderErrors){const N=s.getProgramInfoLog(g)||"",k=s.getShaderInfoLog(M)||"",q=s.getShaderInfoLog(R)||"",D=N.trim(),H=k.trim(),J=q.trim();let z=!0,lt=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(z=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,g,M,R);else{const $=m0(s,M,"vertex"),nt=m0(s,R,"fragment");_e("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+D+`
`+$+`
`+nt)}else D!==""?qt("WebGLProgram: Program Info Log:",D):(H===""||J==="")&&(lt=!1);lt&&(C.diagnostics={runnable:z,programLog:D,vertexShader:{log:H,prefix:v},fragmentShader:{log:J,prefix:m}})}s.deleteShader(M),s.deleteShader(R),_=new $r(s,g),S=$_(s,g)}let _;this.getUniforms=function(){return _===void 0&&T(this),_};let S;this.getAttributes=function(){return S===void 0&&T(this),S};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(g,B_)),I},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=z_++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=M,this.fragmentShader=R,this}let a1=0;class o1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){const s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new l1(t),e.set(t,i)),i}}class l1{constructor(t){this.id=a1++,this.code=t,this.usedTimes=0}}function c1(n){return n===zi||n===jr||n===ta}function h1(n,t,e,i,s,r){const a=new Dl,o=new o1,l=new Set,c=[],h=new Map,u=i.logarithmicDepthBuffer,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(_){return l.add(_),_===0?"uv":`uv${_}`}function g(_,S,I,C,N,k){const q=C.fog,D=N.geometry,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?C.environment:null,J=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,z=t.get(_.envMap||H,J),lt=f[_.type];let $=i.precision;_.precision!==null&&($=i.getMaxPrecision(_.precision),$!==_.precision&&qt("WebGLProgram.getParameters:",_.precision,"not supported, using",$,"instead."));const nt=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,at=nt!==void 0?nt.length:0;let Dt=0;D.morphAttributes.position!==void 0&&(Dt=1),D.morphAttributes.normal!==void 0&&(Dt=2),D.morphAttributes.color!==void 0&&(Dt=3);let Ht,Q,bt,It;if(lt){const Rt=$n[lt];Ht=Rt.vertexShader,Q=Rt.fragmentShader}else{Ht=_.vertexShader,Q=_.fragmentShader;const Rt=o.getVertexShaderStage(_),Ee=o.getFragmentShaderStage(_);o.update(_,Rt,Ee),bt=Rt.id,It=Ee.id}const Vt=n.getRenderTarget(),G=n.state.buffers.depth.getReversed(),ut=N.isInstancedMesh===!0,Gt=N.isBatchedMesh===!0,Pt=!!_.map,pt=!!_.matcap,Xt=!!z,j=Xt&&z.isPMREMTexture===!0,xt=!!_.aoMap,gt=!!_.lightMap,Nt=!!_.bumpMap&&_.wireframe===!1,At=!!_.normalMap,te=!!_.displacementMap,zt=!!_.emissiveMap,ce=!!_.metalnessMap,ue=!!_.roughnessMap,ye=_.anisotropy>0,B=_.clearcoat>0,ke=_.diffuseRoughness>0,oe=_.dispersion>0,Ae=_.retroreflectivity>0,wt=_.iridescence>0,Fe=_.sheen>0,Yt=_.transmission>0,Zt=ye&&!!_.anisotropyMap,A=B&&!!_.clearcoatMap,x=B&&!!_.clearcoatNormalMap,W=B&&!!_.clearcoatRoughnessMap,ht=ke&&!!_.diffuseRoughnessMap,rt=wt&&!!_.iridescenceMap,_t=wt&&!!_.iridescenceThicknessMap,Et=Fe&&!!_.sheenColorMap,tt=Fe&&!!_.sheenRoughnessMap,et=!!_.specularMap,yt=!!_.specularColorMap,L=!!_.specularIntensityMap,it=Yt&&!!_.transmissionMap,K=Yt&&!!_.thicknessMap,Mt=!!_.gradientMap,mt=!!_.alphaMap,vt=_.alphaTest>0,kt=!!_.alphaHash,re=!!_.extensions;let ft=hi;_.toneMapped&&(Vt===null||Vt.isXRRenderTarget===!0)&&(ft=n.toneMapping);const Wt=j?z.isCompressedCubeTexture?z.image[0].mipmaps:z.mipmaps:null,ee={shaderID:lt,shaderType:_.type,shaderName:_.name,vertexShader:Ht,fragmentShader:Q,defines:_.defines,customVertexShaderID:bt,customFragmentShaderID:It,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:$,batching:Gt,batchingColor:Gt&&N._colorsTexture!==null,instancing:ut,instancingColor:ut&&N.instanceColor!==null,instancingMorph:ut&&N.morphTexture!==null,outputColorSpace:Vt===null?n.outputColorSpace:Vt.isXRRenderTarget===!0?Vt.texture.colorSpace:pe.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:Pt,matcap:pt,envMap:Xt,envMapMode:Xt&&z.mapping,envMapPMREM:j,envMapMaxLod:j?Wt.length-1:null,envMapSize:j?Wt[0].width:null,aoMap:xt,lightMap:gt,bumpMap:Nt,normalMap:At,displacementMap:te,emissiveMap:zt,normalMapObjectSpace:At&&_.normalMapType===Qu,normalMapTangentSpace:At&&_.normalMapType===ea,packedNormalMap:At&&_.normalMapType===ea&&c1(_.normalMap.format),metalnessMap:ce,roughnessMap:ue,anisotropy:ye,anisotropyMap:Zt,clearcoat:B,clearcoatMap:A,clearcoatNormalMap:x,clearcoatRoughnessMap:W,diffuseRoughness:ke,diffuseRoughnessMap:ht,dispersion:oe,retroreflection:Ae,iridescence:wt,iridescenceMap:rt,iridescenceThicknessMap:_t,sheen:Fe,sheenColorMap:Et,sheenRoughnessMap:tt,specularMap:et,specularColorMap:yt,specularIntensityMap:L,transmission:Yt,transmissionMap:it,thicknessMap:K,gradientMap:Mt,opaque:_.transparent===!1&&_.blending===Gs&&_.alphaToCoverage===!1,alphaMap:mt,alphaTest:vt,alphaHash:kt,combine:_.combine,mapUv:Pt&&d(_.map.channel),aoMapUv:xt&&d(_.aoMap.channel),lightMapUv:gt&&d(_.lightMap.channel),bumpMapUv:Nt&&d(_.bumpMap.channel),normalMapUv:At&&d(_.normalMap.channel),displacementMapUv:te&&d(_.displacementMap.channel),emissiveMapUv:zt&&d(_.emissiveMap.channel),metalnessMapUv:ce&&d(_.metalnessMap.channel),roughnessMapUv:ue&&d(_.roughnessMap.channel),anisotropyMapUv:Zt&&d(_.anisotropyMap.channel),clearcoatMapUv:A&&d(_.clearcoatMap.channel),clearcoatNormalMapUv:x&&d(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:W&&d(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ht&&d(_.diffuseRoughnessMap.channel),iridescenceMapUv:rt&&d(_.iridescenceMap.channel),iridescenceThicknessMapUv:_t&&d(_.iridescenceThicknessMap.channel),sheenColorMapUv:Et&&d(_.sheenColorMap.channel),sheenRoughnessMapUv:tt&&d(_.sheenRoughnessMap.channel),specularMapUv:et&&d(_.specularMap.channel),specularColorMapUv:yt&&d(_.specularColorMap.channel),specularIntensityMapUv:L&&d(_.specularIntensityMap.channel),transmissionMapUv:it&&d(_.transmissionMap.channel),thicknessMapUv:K&&d(_.thicknessMap.channel),alphaMapUv:mt&&d(_.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(At||ye),vertexNormals:!!D.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!D.attributes.uv&&(Pt||mt),fog:!!q,useFog:_.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||D.attributes.normal===void 0&&At===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:G,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:at,morphTextureStride:Dt,numSunLights:S.sun.length,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numSunLightShadows:S.sunShadowMap.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:k.filter(Rt=>Rt.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:ft,decodeVideoTexture:Pt&&_.map.isVideoTexture===!0&&pe.getTransfer(_.map.colorSpace)===we,decodeVideoTextureEmissive:zt&&_.emissiveMap.isVideoTexture===!0&&pe.getTransfer(_.emissiveMap.colorSpace)===we,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Zn,flipSided:_.side===cn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:re&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(re&&_.extensions.multiDraw===!0||Gt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return ee.vertexUv1s=l.has(1),ee.vertexUv2s=l.has(2),ee.vertexUv3s=l.has(3),l.clear(),ee}function v(_){const S=[];if(_.shaderID?S.push(_.shaderID):(S.push(_.customVertexShaderID),S.push(_.customFragmentShaderID)),_.defines!==void 0)for(const I in _.defines)S.push(I),S.push(_.defines[I]);return _.isRawShaderMaterial===!1&&(m(S,_),p(S,_),S.push(n.outputColorSpace)),S.push(_.customProgramCacheKey),S.join()}function m(_,S){_.push(S.precision),_.push(S.outputColorSpace),_.push(S.envMapMode),_.push(S.envMapPMREM),_.push(S.envMapMaxLod),_.push(S.envMapSize),_.push(S.mapUv),_.push(S.alphaMapUv),_.push(S.lightMapUv),_.push(S.aoMapUv),_.push(S.bumpMapUv),_.push(S.normalMapUv),_.push(S.displacementMapUv),_.push(S.emissiveMapUv),_.push(S.metalnessMapUv),_.push(S.roughnessMapUv),_.push(S.anisotropyMapUv),_.push(S.clearcoatMapUv),_.push(S.clearcoatNormalMapUv),_.push(S.clearcoatRoughnessMapUv),_.push(S.diffuseRoughnessMapUv),_.push(S.iridescenceMapUv),_.push(S.iridescenceThicknessMapUv),_.push(S.sheenColorMapUv),_.push(S.sheenRoughnessMapUv),_.push(S.specularMapUv),_.push(S.specularColorMapUv),_.push(S.specularIntensityMapUv),_.push(S.transmissionMapUv),_.push(S.thicknessMapUv),_.push(S.combine),_.push(S.fogExp2),_.push(S.sizeAttenuation),_.push(S.morphTargetsCount),_.push(S.numSunLights),_.push(S.numDirLights),_.push(S.numPointLights),_.push(S.numSpotLights),_.push(S.numSpotLightMaps),_.push(S.numHemiLights),_.push(S.numRectAreaLights),_.push(S.numSunLightShadows),_.push(S.numDirLightShadows),_.push(S.numPointLightShadows),_.push(S.numSpotLightShadows),_.push(S.numSpotLightShadowsWithMaps),_.push(S.numLightProbes),_.push(S.numLightProbeGrids),_.push(S.shadowMapType),_.push(S.toneMapping),_.push(S.numClippingPlanes),_.push(S.numClipIntersection),_.push(S.depthPacking)}function p(_,S){a.disableAll(),S.instancing&&a.enable(0),S.instancingColor&&a.enable(1),S.instancingMorph&&a.enable(2),S.matcap&&a.enable(3),S.envMap&&a.enable(4),S.normalMapObjectSpace&&a.enable(5),S.normalMapTangentSpace&&a.enable(6),S.clearcoat&&a.enable(7),S.iridescence&&a.enable(8),S.alphaTest&&a.enable(9),S.vertexColors&&a.enable(10),S.vertexAlphas&&a.enable(11),S.vertexUv1s&&a.enable(12),S.vertexUv2s&&a.enable(13),S.vertexUv3s&&a.enable(14),S.vertexTangents&&a.enable(15),S.anisotropy&&a.enable(16),S.alphaHash&&a.enable(17),S.batching&&a.enable(18),S.dispersion&&a.enable(19),S.retroreflection&&a.enable(24),S.diffuseRoughness&&a.enable(25),S.batchingColor&&a.enable(20),S.gradientMap&&a.enable(21),S.packedNormalMap&&a.enable(22),S.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),S.numLightProbeGrids>0&&a.enable(22),S.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function y(_){const S=f[_.type];let I;if(S){const C=$n[S];I=nr.clone(C.uniforms)}else I=_.uniforms;return I}function w(_,S){let I=h.get(S);return I!==void 0?++I.usedTimes:(I=new r1(n,S,_,s),c.push(I),h.set(S,I)),I}function M(_){if(--_.usedTimes===0){const S=c.indexOf(_);c[S]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function R(_){o.remove(_)}function T(){o.dispose()}return{getParameters:g,getProgramCacheKey:v,getUniforms:y,acquireProgram:w,releaseProgram:M,releaseShaderCache:R,programs:c,dispose:T}}function u1(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function f1(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.materialVariant!==t.materialVariant?n.materialVariant-t.materialVariant:n.z!==t.z?n.z-t.z:n.id-t.id}function y0(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function M0(){const n=[];let t=0;const e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function a(f){let d=0;return f.isInstancedMesh&&(d+=2),f.isSkinnedMesh&&(d+=1),d}function o(f,d,g,v,m,p){let y=n[t];return y===void 0?(y={id:f.id,object:f,geometry:d,material:g,materialVariant:a(f),groupOrder:v,renderOrder:f.renderOrder,z:m,group:p},n[t]=y):(y.id=f.id,y.object=f,y.geometry=d,y.material=g,y.materialVariant=a(f),y.groupOrder=v,y.renderOrder=f.renderOrder,y.z=m,y.group=p),t++,y}function l(f,d,g,v,m,p,y){y.reversedDepth===!0&&(m=-m);const w=o(f,d,g,v,m,p);g.transmission>0?i.push(w):g.transparent===!0?s.push(w):e.push(w)}function c(f,d,g,v,m,p){const y=o(f,d,g,v,m,p);g.transmission>0?i.unshift(y):g.transparent===!0?s.unshift(y):e.unshift(y)}function h(f,d){e.length>1&&e.sort(f||f1),i.length>1&&i.sort(d||y0),s.length>1&&s.sort(d||y0)}function u(){for(let f=t,d=n.length;f<d;f++){const g=n[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:u,sort:h}}function d1(){let n=new WeakMap;function t(i,s){const r=n.get(i);let a;return r===void 0?(a=new M0,n.set(i,[a])):s>=r.length?(a=new M0,r.push(a)):a=r[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function p1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new P,color:new Qt};break;case"SpotLight":e={position:new P,direction:new P,color:new Qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Qt,groundColor:new Qt};break;case"RectAreaLight":e={color:new Qt,position:new P,halfWidth:new P,halfHeight:new P};break}return n[t.id]=e,e}}}function m1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let g1=0;function _1(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function v1(n){const t=new p1,e=m1(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new P);const s=new P,r=new be,a=new be;function o(c){let h=0,u=0,f=0;for(let k=0;k<9;k++)i.probe[k].set(0,0,0);let d=0,g=0,v=0,m=0,p=0,y=0,w=0,M=0,R=0,T=0,_=0,S=0,I=0,C=0;c.sort(_1);for(let k=0,q=c.length;k<q;k++){const D=c[k],H=D.color,J=D.intensity,z=D.distance;let lt=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===zi?lt=D.shadow.map.texture:lt=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)h+=H.r*J,u+=H.g*J,f+=H.b*J;else if(D.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(D.sh.coefficients[$],J);C++}else if(D.isSunLight){const $=t.get(D);if($.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const nt=D.shadow,at=e.get(D);at.shadowIntensity=nt.intensity,at.shadowBias=nt.bias,at.shadowNormalBias=nt.normalBias,at.shadowRadius=nt.radius,at.shadowMapSize.copy(nt.mapSize).multiply(nt.getFrameExtents()),i.sunShadow[g]=at,i.sunShadowMap[g]=lt;const Dt=nt.getViewportCount();for(let Ht=0;Ht<Dt;Ht++)i.sunShadowMatrix[v+Ht]=nt.getMatrix(Ht),i.sunShadowCascade[v+Ht]=nt._cascadeData[Ht];v+=Dt,g++}i.sun[d]=$,d++}else if(D.isDirectionalLight){const $=t.get(D);if($.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const nt=D.shadow,at=e.get(D);at.shadowIntensity=nt.intensity,at.shadowBias=nt.bias,at.shadowNormalBias=nt.normalBias,at.shadowRadius=nt.radius,at.shadowMapSize=nt.mapSize,i.directionalShadow[m]=at,i.directionalShadowMap[m]=lt,i.directionalShadowMatrix[m]=D.shadow.matrix,R++}i.directional[m]=$,m++}else if(D.isSpotLight){const $=t.get(D);$.position.setFromMatrixPosition(D.matrixWorld),$.color.copy(H).multiplyScalar(J),$.distance=z,$.coneCos=Math.cos(D.angle),$.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),$.decay=D.decay,i.spot[y]=$;const nt=D.shadow;if(D.map&&(i.spotLightMap[S]=D.map,S++,nt.updateMatrices(D),D.castShadow&&I++),i.spotLightMatrix[y]=nt.matrix,D.castShadow){const at=e.get(D);at.shadowIntensity=nt.intensity,at.shadowBias=nt.bias,at.shadowNormalBias=nt.normalBias,at.shadowRadius=nt.radius,at.shadowMapSize=nt.mapSize,i.spotShadow[y]=at,i.spotShadowMap[y]=lt,_++}y++}else if(D.isRectAreaLight){const $=t.get(D);$.color.copy(H).multiplyScalar(J),$.halfWidth.set(D.width*.5,0,0),$.halfHeight.set(0,D.height*.5,0),i.rectArea[w]=$,w++}else if(D.isPointLight){const $=t.get(D);if($.color.copy(D.color).multiplyScalar(D.intensity),$.distance=D.distance,$.decay=D.decay,D.castShadow){const nt=D.shadow,at=e.get(D);at.shadowIntensity=nt.intensity,at.shadowBias=nt.bias,at.shadowNormalBias=nt.normalBias,at.shadowRadius=nt.radius,at.shadowMapSize=nt.mapSize,at.shadowCameraNear=nt.camera.near,at.shadowCameraFar=nt.camera.far,i.pointShadow[p]=at,i.pointShadowMap[p]=lt,i.pointShadowMatrix[p]=D.shadow.matrix,T++}i.point[p]=$,p++}else if(D.isHemisphereLight){const $=t.get(D);$.skyColor.copy(D.color).multiplyScalar(J),$.groundColor.copy(D.groundColor).multiplyScalar(J),i.hemi[M]=$,M++}}w>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ct.LTC_FLOAT_1,i.rectAreaLTC2=Ct.LTC_FLOAT_2):(i.rectAreaLTC1=Ct.LTC_HALF_1,i.rectAreaLTC2=Ct.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;const N=i.hash;(N.sunLength!==d||N.directionalLength!==m||N.pointLength!==p||N.spotLength!==y||N.rectAreaLength!==w||N.hemiLength!==M||N.numSunShadows!==g||N.numDirectionalShadows!==R||N.numPointShadows!==T||N.numSpotShadows!==_||N.numSpotMaps!==S||N.numLightProbes!==C)&&(i.sun.length=d,i.directional.length=m,i.spot.length=y,i.rectArea.length=w,i.point.length=p,i.hemi.length=M,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=v,i.sunShadowCascade.length=v,i.directionalShadow.length=R,i.directionalShadowMap.length=R,i.directionalShadowMatrix.length=R,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=_,i.spotShadowMap.length=_,i.spotLightMatrix.length=_+S-I,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=I,i.numLightProbes=C,N.sunLength=d,N.directionalLength=m,N.pointLength=p,N.spotLength=y,N.rectAreaLength=w,N.hemiLength=M,N.numSunShadows=g,N.numDirectionalShadows=R,N.numPointShadows=T,N.numSpotShadows=_,N.numSpotMaps=S,N.numLightProbes=C,i.version=g1++)}function l(c,h){let u=0,f=0,d=0,g=0,v=0,m=0;const p=h.matrixWorldInverse;for(let y=0,w=c.length;y<w;y++){const M=c[y];if(M.isSunLight){const R=i.sun[u];R.direction.setFromMatrixPosition(M.matrixWorld),R.direction.transformDirection(p),u++}else if(M.isDirectionalLight){const R=i.directional[f];R.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(p),f++}else if(M.isSpotLight){const R=i.spot[g];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(p),R.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(p),g++}else if(M.isRectAreaLight){const R=i.rectArea[v];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(p),a.identity(),r.copy(M.matrixWorld),r.premultiply(p),a.extractRotation(r),R.halfWidth.set(M.width*.5,0,0),R.halfHeight.set(0,M.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),v++}else if(M.isPointLight){const R=i.point[d];R.position.setFromMatrixPosition(M.matrixWorld),R.position.applyMatrix4(p),d++}else if(M.isHemisphereLight){const R=i.hemi[m];R.direction.setFromMatrixPosition(M.matrixWorld),R.direction.transformDirection(p),m++}}}return{setup:o,setupView:l,state:i}}function S0(n){const t=new v1(n),e=[],i=[],s=[];function r(u){h.camera=u,e.length=0,i.length=0,s.length=0}function a(u){u.isLightProbeGrid?s.push(u):e.push(u)}function o(u){i.push(u)}function l(){t.setup(e),s.sort((u,f)=>u.priority-f.priority||u.id-f.id)}function c(u){t.setupView(e,u)}const h={lightsArray:e,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function x1(n){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new S0(n),t.set(s,[o])):r>=a.length?(o=new S0(n),a.push(o)):o=a[r],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const y1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,M1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,S1=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],b1=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],b0=new be,Ns=new P,eo=new P;function w1(n,t,e){let i=new Qs;const s=new ot,r=new ot,a=new Ne,o=new Id,l=new Nd,c={},h=e.maxTextureSize,u={[Bi]:cn,[cn]:Bi,[Zn]:Zn},f=new bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:y1,fragmentShader:M1}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const g=new Ve;g.setAttribute("position",new Jn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ie(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hr;let p=this.type;this.render=function(T,_,S){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===Y0&&(qt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Hr);const I=n.getRenderTarget(),C=n.getActiveCubeFace(),N=n.getActiveMipmapLevel(),k=n.state;k.setBlending(Fi),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const q=p!==this.type;q&&_.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(H=>H.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,H=T.length;D<H;D++){const J=T[D],z=J.shadow;if(z===void 0){qt("WebGLShadowMap:",J,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const lt=z.getFrameExtents();s.multiply(lt),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/lt.x),s.x=r.x*lt.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/lt.y),s.y=r.y*lt.y,z.mapSize.y=r.y));const $=n.state.buffers.depth.getReversed();if(z.camera._reversedDepth=$,z.map===null||q===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===Os){if(J.isPointLight){qt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new gn(s.x,s.y,{format:zi,type:mn,minFilter:pn,magFilter:pn,generateMipmaps:!1}),z.map.texture.name=J.name+".shadowMap",z.map.depthTexture=new gs(s.x,s.y,zn),z.map.depthTexture.name=J.name+".shadowMapDepth",z.map.depthTexture.format=Ti,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=je,z.map.depthTexture.magFilter=je}else J.isPointLight?(z.map=new ql(s.x),z.map.depthTexture=new gh(s.x,jn)):(z.map=new gn(s.x,s.y),z.map.depthTexture=new gs(s.x,s.y,jn)),z.map.depthTexture.name=J.name+".shadowMap",z.map.depthTexture.format=Ti,this.type===Hr?(z.map.depthTexture.compareFunction=$?ih:nh,z.map.depthTexture.minFilter=pn,z.map.depthTexture.magFilter=pn):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=je,z.map.depthTexture.magFilter=je);z.camera.updateProjectionMatrix()}z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==s.x||z.map.height!==s.y)&&z.map.setSize(s.x,s.y);const nt=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();J.isPointLight!==!0&&z.updateMatrices(J,S);const at=(z.camera.layers.mask&4294967294)!==0?z.camera.layers:S.layers;for(let Dt=0;Dt<nt;Dt++){const Ht=z.getCamera(Dt);if(J.isPointLight){const Q=z.camera,bt=z.matrix,It=J.distance||Q.far;It!==Q.far&&(Q.far=It,Q.updateProjectionMatrix()),Ns.setFromMatrixPosition(J.matrixWorld),Q.position.copy(Ns),eo.copy(Q.position),eo.add(S1[Dt]),Q.up.copy(b1[Dt]),Q.lookAt(eo),Q.updateMatrixWorld(),bt.makeTranslation(-Ns.x,-Ns.y,-Ns.z),b0.multiplyMatrices(Q.projectionMatrix,Q.matrixWorldInverse),z._frustum.setFromProjectionMatrix(b0,Q.coordinateSystem,Q.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)n.setRenderTarget(z.map,Dt),n.clear();else{Dt===0&&(n.setRenderTarget(z.map),n.clear());const Q=z.getViewport(Dt);a.set(r.x*Q.x,r.y*Q.y,r.x*Q.z,r.y*Q.w),k.viewport(a)}i=z.getFrustum(Dt),M(_,S,Ht,J,at,this.type)}z.isPointLightShadow!==!0&&this.type===Os&&y(z,S),z.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(I,C,N)};function y(T,_){const S=t.update(v);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null?T.mapPass=new gn(s.x,s.y,{format:zi,type:mn}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),f.uniforms.shadow_pass.value=T.map.depthTexture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(_,null,S,f,v,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(_,null,S,d,v,null)}function w(T,_,S,I){let C=null;const N=S.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(N!==void 0)C=N;else if(C=S.isPointLight===!0?l:o,n.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){const k=C.uuid,q=_.uuid;let D=c[k];D===void 0&&(D={},c[k]=D);let H=D[q];H===void 0&&(H=C.clone(),D[q]=H,_.addEventListener("dispose",R)),C=H}if(C.visible=_.visible,C.wireframe=_.wireframe,I===Os?C.side=_.shadowSide!==null?_.shadowSide:_.side:C.side=_.shadowSide!==null?_.shadowSide:u[_.side],C.alphaMap=_.alphaMap,C.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,C.map=_.map,C.clipShadows=_.clipShadows,C.clippingPlanes=_.clippingPlanes,C.clipIntersection=_.clipIntersection,C.displacementMap=_.displacementMap,C.displacementScale=_.displacementScale,C.displacementBias=_.displacementBias,C.wireframeLinewidth=_.wireframeLinewidth,C.linewidth=_.linewidth,S.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const k=n.properties.get(C);k.light=S}return C}function M(T,_,S,I,C,N){if(T.visible===!1)return;if(T.layers.test(C)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&N===Os)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,T.matrixWorld);const D=t.update(T),H=T.material;if(Array.isArray(H)){const J=D.groups;for(let z=0,lt=J.length;z<lt;z++){const $=J[z],nt=H[$.materialIndex];if(nt&&nt.visible){const at=w(T,nt,I,N);T.onBeforeShadow(n,T,_,S,D,at,$),n.renderBufferDirect(S,null,D,at,T,$),T.onAfterShadow(n,T,_,S,D,at,$)}}}else if(H.visible){const J=w(T,H,I,N);T.onBeforeShadow(n,T,_,S,D,J,null),n.renderBufferDirect(S,null,D,J,T,null),T.onAfterShadow(n,T,_,S,D,J,null)}}const q=T.children;for(let D=0,H=q.length;D<H;D++)M(q[D],_,S,I,C,N)}function R(T){T.target.removeEventListener("dispose",R);for(const S in c){const I=c[S],C=T.target.uuid;C in I&&(I[C].dispose(),delete I[C])}}}function E1(n,t){function e(){let L=!1;const it=new Ne;let K=null;const Mt=new Ne(0,0,0,0);return{setMask:function(mt){K!==mt&&!L&&(n.colorMask(mt,mt,mt,mt),K=mt)},setLocked:function(mt){L=mt},setClear:function(mt,vt,kt,re,ft){ft===!0&&(mt*=re,vt*=re,kt*=re),it.set(mt,vt,kt,re),Mt.equals(it)===!1&&(n.clearColor(mt,vt,kt,re),Mt.copy(it))},reset:function(){L=!1,K=null,Mt.set(-1,0,0,0)}}}function i(){let L=!1,it=!1,K=null,Mt=null,mt=null;return{setReversed:function(vt){if(it!==vt){const kt=t.get("EXT_clip_control");vt?kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.ZERO_TO_ONE_EXT):kt.clipControlEXT(kt.LOWER_LEFT_EXT,kt.NEGATIVE_ONE_TO_ONE_EXT),it=vt;const re=mt;mt=null,this.setClear(re)}},getReversed:function(){return it},setTest:function(vt){vt?G(n.DEPTH_TEST):ut(n.DEPTH_TEST)},setMask:function(vt){K!==vt&&!L&&(n.depthMask(vt),K=vt)},setFunc:function(vt){if(it&&(vt=hf[vt]),Mt!==vt){switch(vt){case po:n.depthFunc(n.NEVER);break;case mo:n.depthFunc(n.ALWAYS);break;case go:n.depthFunc(n.LESS);break;case qs:n.depthFunc(n.LEQUAL);break;case _o:n.depthFunc(n.EQUAL);break;case vo:n.depthFunc(n.GEQUAL);break;case xo:n.depthFunc(n.GREATER);break;case yo:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Mt=vt}},setLocked:function(vt){L=vt},setClear:function(vt){mt!==vt&&(mt=vt,it&&(vt=1-vt),n.clearDepth(vt))},reset:function(){L=!1,K=null,Mt=null,mt=null,it=!1}}}function s(){let L=!1,it=null,K=null,Mt=null,mt=null,vt=null,kt=null,re=null,ft=null;return{setTest:function(Wt){L||(Wt?G(n.STENCIL_TEST):ut(n.STENCIL_TEST))},setMask:function(Wt){it!==Wt&&!L&&(n.stencilMask(Wt),it=Wt)},setFunc:function(Wt,ee,Rt){(K!==Wt||Mt!==ee||mt!==Rt)&&(n.stencilFunc(Wt,ee,Rt),K=Wt,Mt=ee,mt=Rt)},setOp:function(Wt,ee,Rt){(vt!==Wt||kt!==ee||re!==Rt)&&(n.stencilOp(Wt,ee,Rt),vt=Wt,kt=ee,re=Rt)},setLocked:function(Wt){L=Wt},setClear:function(Wt){ft!==Wt&&(n.clearStencil(Wt),ft=Wt)},reset:function(){L=!1,it=null,K=null,Mt=null,mt=null,vt=null,kt=null,re=null,ft=null}}}const r=new e,a=new i,o=new s;let l={};const c=new WeakMap;let h={},u={},f={},d=new WeakMap,g=[],v=null,m=!1,p=null,y=null,w=null,M=null,R=null,T=null,_=null,S=new Qt(0,0,0),I=0,C=!1,N=null,k=null,q=null,D=null,H=null;const J=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,lt=0;const $=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(lt=parseFloat(/^WebGL (\d)/.exec($)[1]),z=lt>=1):$.indexOf("OpenGL ES")!==-1&&(lt=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),z=lt>=2);let nt=null,at={};const Dt=n.getParameter(n.SCISSOR_BOX),Ht=n.getParameter(n.VIEWPORT),Q=new Ne().fromArray(Dt),bt=new Ne().fromArray(Ht);function It(L,it,K,Mt){const mt=new Uint8Array(4),vt=n.createTexture();n.bindTexture(L,vt),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let kt=0;kt<K;kt++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(it,0,n.RGBA,1,1,Mt,0,n.RGBA,n.UNSIGNED_BYTE,mt):n.texImage2D(it+kt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,mt);return vt}const Vt={};Vt[n.TEXTURE_2D]=It(n.TEXTURE_2D,n.TEXTURE_2D,1),Vt[n.TEXTURE_CUBE_MAP]=It(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Vt[n.TEXTURE_2D_ARRAY]=It(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Vt[n.TEXTURE_3D]=It(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),G(n.DEPTH_TEST),a.setFunc(qs),Nt(!1),At(dc),G(n.CULL_FACE),xt(Fi);function G(L){h[L]!==!0&&(n.enable(L),h[L]=!0)}function ut(L){h[L]!==!1&&(n.disable(L),h[L]=!1)}function Gt(L,it){return f[L]!==it?(n.bindFramebuffer(L,it),f[L]=it,L===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=it),L===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=it),!0):!1}function Pt(L,it){let K=g,Mt=!1;if(L){K=d.get(it),K===void 0&&(K=[],d.set(it,K));const mt=L.textures;if(K.length!==mt.length||K[0]!==n.COLOR_ATTACHMENT0){for(let vt=0,kt=mt.length;vt<kt;vt++)K[vt]=n.COLOR_ATTACHMENT0+vt;K.length=mt.length,Mt=!0}}else K[0]!==n.BACK&&(K[0]=n.BACK,Mt=!0);Mt&&n.drawBuffers(K)}function pt(L){return v!==L?(n.useProgram(L),v=L,!0):!1}const Xt={[as]:n.FUNC_ADD,[Lu]:n.FUNC_SUBTRACT,[Du]:n.FUNC_REVERSE_SUBTRACT};Xt[Iu]=n.MIN,Xt[Nu]=n.MAX;const j={[Uu]:n.ZERO,[Fu]:n.ONE,[Ou]:n.SRC_COLOR,[q0]:n.SRC_ALPHA,[Vu]:n.SRC_ALPHA_SATURATE,[Gu]:n.DST_COLOR,[zu]:n.DST_ALPHA,[Bu]:n.ONE_MINUS_SRC_COLOR,[$0]:n.ONE_MINUS_SRC_ALPHA,[Hu]:n.ONE_MINUS_DST_COLOR,[ku]:n.ONE_MINUS_DST_ALPHA,[Wu]:n.CONSTANT_COLOR,[Xu]:n.ONE_MINUS_CONSTANT_COLOR,[Yu]:n.CONSTANT_ALPHA,[qu]:n.ONE_MINUS_CONSTANT_ALPHA};function xt(L,it,K,Mt,mt,vt,kt,re,ft,Wt){if(L===Fi){m===!0&&(ut(n.BLEND),m=!1);return}if(m===!1&&(G(n.BLEND),m=!0),L!==Pu){if(L!==p||Wt!==C){if((y!==as||R!==as)&&(n.blendEquation(n.FUNC_ADD),y=as,R=as),Wt)switch(L){case Gs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case fo:n.blendFunc(n.ONE,n.ONE);break;case pc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case mc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:_e("WebGLState: Invalid blending: ",L);break}else switch(L){case Gs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case fo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case pc:_e("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case mc:_e("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:_e("WebGLState: Invalid blending: ",L);break}w=null,M=null,T=null,_=null,S.set(0,0,0),I=0,p=L,C=Wt}return}mt=mt||it,vt=vt||K,kt=kt||Mt,(it!==y||mt!==R)&&(n.blendEquationSeparate(Xt[it],Xt[mt]),y=it,R=mt),(K!==w||Mt!==M||vt!==T||kt!==_)&&(n.blendFuncSeparate(j[K],j[Mt],j[vt],j[kt]),w=K,M=Mt,T=vt,_=kt),(re.equals(S)===!1||ft!==I)&&(n.blendColor(re.r,re.g,re.b,ft),S.copy(re),I=ft),p=L,C=!1}function gt(L,it){L.side===Zn?ut(n.CULL_FACE):G(n.CULL_FACE);let K=L.side===cn;it&&(K=!K),Nt(K),L.blending===Gs&&L.transparent===!1?xt(Fi):xt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const Mt=L.stencilWrite;o.setTest(Mt),Mt&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),zt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?G(n.SAMPLE_ALPHA_TO_COVERAGE):ut(n.SAMPLE_ALPHA_TO_COVERAGE)}function Nt(L){N!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),N=L)}function At(L){L!==Ru?(G(n.CULL_FACE),L!==k&&(L===dc?n.cullFace(n.BACK):L===Cu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ut(n.CULL_FACE),k=L}function te(L){L!==q&&(z&&n.lineWidth(L),q=L)}function zt(L,it,K){L?(G(n.POLYGON_OFFSET_FILL),(D!==it||H!==K)&&(D=it,H=K,a.getReversed()&&(it=-it,K=-K),n.polygonOffset(it,K))):ut(n.POLYGON_OFFSET_FILL)}function ce(L){L?G(n.SCISSOR_TEST):ut(n.SCISSOR_TEST)}function ue(L){L===void 0&&(L=n.TEXTURE0+J-1),nt!==L&&(n.activeTexture(L),nt=L)}function ye(L,it,K){K===void 0&&(nt===null?K=n.TEXTURE0+J-1:K=nt);let Mt=at[K];Mt===void 0&&(Mt={type:void 0,texture:void 0},at[K]=Mt),(Mt.type!==L||Mt.texture!==it)&&(nt!==K&&(n.activeTexture(K),nt=K),n.bindTexture(L,it||Vt[L]),Mt.type=L,Mt.texture=it)}function B(){const L=at[nt];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function ke(){try{n.compressedTexImage2D(...arguments)}catch(L){_e("WebGLState:",L)}}function oe(){try{n.compressedTexImage3D(...arguments)}catch(L){_e("WebGLState:",L)}}function Ae(){try{n.texSubImage2D(...arguments)}catch(L){_e("WebGLState:",L)}}function wt(){try{n.texSubImage3D(...arguments)}catch(L){_e("WebGLState:",L)}}function Fe(){try{n.compressedTexSubImage2D(...arguments)}catch(L){_e("WebGLState:",L)}}function Yt(){try{n.compressedTexSubImage3D(...arguments)}catch(L){_e("WebGLState:",L)}}function Zt(){try{n.texStorage2D(...arguments)}catch(L){_e("WebGLState:",L)}}function A(){try{n.texStorage3D(...arguments)}catch(L){_e("WebGLState:",L)}}function x(){try{n.texImage2D(...arguments)}catch(L){_e("WebGLState:",L)}}function W(){try{n.texImage3D(...arguments)}catch(L){_e("WebGLState:",L)}}function ht(L){return u[L]!==void 0?u[L]:n.getParameter(L)}function rt(L,it){u[L]!==it&&(n.pixelStorei(L,it),u[L]=it)}function _t(L){Q.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),Q.copy(L))}function Et(L){bt.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),bt.copy(L))}function tt(L,it){let K=c.get(it);K===void 0&&(K=new WeakMap,c.set(it,K));let Mt=K.get(L);Mt===void 0&&(Mt=n.getUniformBlockIndex(it,L.name),n.uniformBlockBinding(it,Mt,Mt),K.set(L,Mt))}function et(L,it,K){const mt=c.get(it).get(L);l[mt]!==K&&(n.bindBufferBase(n.UNIFORM_BUFFER,mt,K),l[mt]=K)}function yt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},u={},nt=null,at={},f={},l={},d=new WeakMap,g=[],v=null,m=!1,p=null,y=null,w=null,M=null,R=null,T=null,_=null,S=new Qt(0,0,0),I=0,C=!1,N=null,k=null,q=null,D=null,H=null,Q.set(0,0,n.canvas.width,n.canvas.height),bt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:G,disable:ut,bindFramebuffer:Gt,drawBuffers:Pt,useProgram:pt,setBlending:xt,setMaterial:gt,setFlipSided:Nt,setCullFace:At,setLineWidth:te,setPolygonOffset:zt,setScissorTest:ce,activeTexture:ue,bindTexture:ye,unbindTexture:B,compressedTexImage2D:ke,compressedTexImage3D:oe,texImage2D:x,texImage3D:W,pixelStorei:rt,getParameter:ht,updateUBOMapping:tt,uniformBlockBinding:et,texStorage2D:Zt,texStorage3D:A,texSubImage2D:Ae,texSubImage3D:wt,compressedTexSubImage2D:Fe,compressedTexSubImage3D:Yt,scissor:_t,viewport:Et,reset:yt}}function T1(n,t,e,i,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ot,h=new WeakMap,u=new Set;let f;const d=new WeakMap,g=new Set,v=new FinalizationRegistry(A=>g.delete(A));let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(A,x){return m?new OffscreenCanvas(A,x):sa("canvas")}function y(A,x,W){let ht=1;const rt=Zt(A);if((rt.width>W||rt.height>W)&&(ht=W/Math.max(rt.width,rt.height)),ht<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const _t=Math.floor(ht*rt.width),Et=Math.floor(ht*rt.height);f===void 0&&(f=p(_t,Et));const tt=x?p(_t,Et):f;return tt.width=_t,tt.height=Et,tt.getContext("2d").drawImage(A,0,0,_t,Et),qt("WebGLRenderer: Texture has been resized from ("+rt.width+"x"+rt.height+") to ("+_t+"x"+Et+")."),tt}else return"data"in A&&qt("WebGLRenderer: Image in DataTexture is too big ("+rt.width+"x"+rt.height+")."),A;return A}function w(A){return A.generateMipmaps}function M(A){n.generateMipmap(A)}function R(A){return A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?n.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function T(A,x,W,ht,rt,_t=!1){if(A!==null){if(n[A]!==void 0)return n[A];qt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let Et;ht&&(Et=t.get("EXT_texture_norm16"),Et||qt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let tt=x;if(x===n.RED&&(W===n.FLOAT&&(tt=n.R32F),W===n.HALF_FLOAT&&(tt=n.R16F),W===n.UNSIGNED_BYTE&&(tt=n.R8),W===n.UNSIGNED_SHORT&&Et&&(tt=Et.R16_EXT),W===n.SHORT&&Et&&(tt=Et.R16_SNORM_EXT)),x===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(tt=n.R8UI),W===n.UNSIGNED_SHORT&&(tt=n.R16UI),W===n.UNSIGNED_INT&&(tt=n.R32UI),W===n.BYTE&&(tt=n.R8I),W===n.SHORT&&(tt=n.R16I),W===n.INT&&(tt=n.R32I)),x===n.RG&&(W===n.FLOAT&&(tt=n.RG32F),W===n.HALF_FLOAT&&(tt=n.RG16F),W===n.UNSIGNED_BYTE&&(tt=n.RG8),W===n.UNSIGNED_SHORT&&Et&&(tt=Et.RG16_EXT),W===n.SHORT&&Et&&(tt=Et.RG16_SNORM_EXT)),x===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&(tt=n.RG8UI),W===n.UNSIGNED_SHORT&&(tt=n.RG16UI),W===n.UNSIGNED_INT&&(tt=n.RG32UI),W===n.BYTE&&(tt=n.RG8I),W===n.SHORT&&(tt=n.RG16I),W===n.INT&&(tt=n.RG32I)),x===n.RGB_INTEGER&&(W===n.UNSIGNED_BYTE&&(tt=n.RGB8UI),W===n.UNSIGNED_SHORT&&(tt=n.RGB16UI),W===n.UNSIGNED_INT&&(tt=n.RGB32UI),W===n.BYTE&&(tt=n.RGB8I),W===n.SHORT&&(tt=n.RGB16I),W===n.INT&&(tt=n.RGB32I)),x===n.RGBA_INTEGER&&(W===n.UNSIGNED_BYTE&&(tt=n.RGBA8UI),W===n.UNSIGNED_SHORT&&(tt=n.RGBA16UI),W===n.UNSIGNED_INT&&(tt=n.RGBA32UI),W===n.BYTE&&(tt=n.RGBA8I),W===n.SHORT&&(tt=n.RGBA16I),W===n.INT&&(tt=n.RGBA32I)),x===n.RGB&&(W===n.UNSIGNED_SHORT&&Et&&(tt=Et.RGB16_EXT),W===n.SHORT&&Et&&(tt=Et.RGB16_SNORM_EXT),W===n.UNSIGNED_INT_5_9_9_9_REV&&(tt=n.RGB9_E5),W===n.UNSIGNED_INT_10F_11F_11F_REV&&(tt=n.R11F_G11F_B10F)),x===n.RGBA){const et=_t?ia:pe.getTransfer(rt);W===n.FLOAT&&(tt=n.RGBA32F),W===n.HALF_FLOAT&&(tt=n.RGBA16F),W===n.UNSIGNED_BYTE&&(tt=et===we?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT&&Et&&(tt=Et.RGBA16_EXT),W===n.SHORT&&Et&&(tt=Et.RGBA16_SNORM_EXT),W===n.UNSIGNED_SHORT_4_4_4_4&&(tt=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(tt=n.RGB5_A1)}return(tt===n.R16F||tt===n.R32F||tt===n.RG16F||tt===n.RG32F||tt===n.RGBA16F||tt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),tt}function _(A,x){let W;return A?x===null||x===jn||x===ms?W=n.DEPTH24_STENCIL8:x===zn?W=n.DEPTH32F_STENCIL8:x===Zs&&(W=n.DEPTH24_STENCIL8,qt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===jn||x===ms?W=n.DEPTH_COMPONENT24:x===zn?W=n.DEPTH_COMPONENT32F:x===Zs&&(W=n.DEPTH_COMPONENT16),W}function S(A,x){return w(A)===!0||A.isFramebufferTexture&&A.minFilter!==je&&A.minFilter!==pn?Math.log2(Math.max(x.width,x.height))+1:A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?x.mipmaps.length:1}function I(A){const x=new WeakRef(A);i.get(A).__ref=x,g.add(x),v.register(A,x,x)}function C(A){const x=i.get(A).__ref;x!==void 0&&(g.delete(x),v.unregister(x))}function N(A){q(A.target)}function k(A){D(A.target)}function q(A){A.removeEventListener("dispose",N),C(A),J(A),A.isVideoTexture&&h.delete(A),A.isHTMLTexture&&u.delete(A)}function D(A){A.removeEventListener("dispose",k),C(A),lt(A)}function H(){for(const A of g){const x=A.deref();x!==void 0&&(x.isRenderTarget===!0?D(x):q(x))}g.clear(),u.clear()}function J(A){const x=i.get(A);if(x.__webglInit===void 0)return;const W=A.source,ht=d.get(W);if(ht){const rt=ht[x.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&z(A),Object.keys(ht).length===0&&d.delete(W)}i.remove(A)}function z(A){const x=i.get(A);n.deleteTexture(x.__webglTexture);const W=A.source,ht=d.get(W);delete ht[x.__cacheKey],a.memory.textures--}function lt(A){const x=i.get(A);x.__depthDisposeCallback&&x.__depthDisposeCallback();const W=A.depthTexture;if(W&&W.renderTarget===A&&q(W),A.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(x.__webglFramebuffer[rt]))for(let _t=0;_t<x.__webglFramebuffer[rt].length;_t++)n.deleteFramebuffer(x.__webglFramebuffer[rt][_t]);else n.deleteFramebuffer(x.__webglFramebuffer[rt]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[rt])}else{if(Array.isArray(x.__webglFramebuffer))for(let rt=0;rt<x.__webglFramebuffer.length;rt++)n.deleteFramebuffer(x.__webglFramebuffer[rt]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let rt=0;rt<x.__webglColorRenderbuffer.length;rt++)x.__webglColorRenderbuffer[rt]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[rt]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const ht=A.textures;for(let rt=0,_t=ht.length;rt<_t;rt++){const Et=i.get(ht[rt]);Et.__webglTexture&&(n.deleteTexture(Et.__webglTexture),a.memory.textures--),i.remove(ht[rt])}i.remove(A)}let $=0;function nt(){$=0}function at(){return $}function Dt(A){$=A}function Ht(){const A=$;return A>=s.maxTextures&&qt("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+s.maxTextures),$+=1,A}function Q(A){const x=[];return x.push(A.wrapS),x.push(A.wrapT),x.push(A.wrapR||0),x.push(A.magFilter),x.push(A.minFilter),x.push(A.anisotropy),x.push(A.internalFormat),x.push(A.format),x.push(A.type),x.push(A.generateMipmaps),x.push(A.mipmapsAutoUpdate),x.push(A.premultiplyAlpha),x.push(A.flipY),x.push(A.unpackAlignment),x.push(A.colorSpace),x.join()}function bt(A,x){const W=i.get(A);if(A.isVideoTexture&&Fe(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&W.__version!==A.version){const ht=A.image;if(ht===null)qt("WebGLRenderer: Texture marked for update but no image data found.");else if(ht.complete===!1)qt("WebGLRenderer: Texture marked for update but image is incomplete");else{gt(W,A,x);return}}else A.isExternalTexture&&(W.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+x)}function It(A,x){const W=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&W.__version!==A.version){gt(W,A,x);return}else A.isExternalTexture&&(W.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+x)}function Vt(A,x){const W=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&W.__version!==A.version){gt(W,A,x);return}e.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+x)}function G(A,x){const W=i.get(A);if(A.version>0&&W.__version!==A.version){Nt(W,A,x);return}e.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+x)}const ut={[Qr]:n.REPEAT,[ci]:n.CLAMP_TO_EDGE,[Mo]:n.MIRRORED_REPEAT},Gt={[je]:n.NEAREST,[Ku]:n.NEAREST_MIPMAP_NEAREST,[cr]:n.NEAREST_MIPMAP_LINEAR,[pn]:n.LINEAR,[Aa]:n.LINEAR_MIPMAP_NEAREST,[bi]:n.LINEAR_MIPMAP_LINEAR},Pt={[tf]:n.NEVER,[sh]:n.ALWAYS,[ef]:n.LESS,[nh]:n.LEQUAL,[nf]:n.EQUAL,[ih]:n.GEQUAL,[sf]:n.GREATER,[rf]:n.NOTEQUAL};function pt(A,x){if(x.type===zn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===pn||x.magFilter===Aa||x.magFilter===cr||x.magFilter===bi||x.minFilter===pn||x.minFilter===Aa||x.minFilter===cr||x.minFilter===bi)&&qt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,ut[x.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,ut[x.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,ut[x.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,Gt[x.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,Gt[x.minFilter]),x.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,Pt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===je||x.minFilter!==cr&&x.minFilter!==bi||x.type===zn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");n.texParameterf(A,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Xt(A,x){let W=!1;A.__webglInit===void 0&&(A.__webglInit=!0,x.addEventListener("dispose",N),I(x));const ht=x.source;let rt=d.get(ht);rt===void 0&&(rt={},d.set(ht,rt));const _t=Q(x);if(_t!==A.__cacheKey){rt[_t]===void 0&&(rt[_t]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,W=!0),rt[_t].usedTimes++;const Et=rt[A.__cacheKey];Et!==void 0&&(rt[A.__cacheKey].usedTimes--,Et.usedTimes===0&&z(x)),A.__cacheKey=_t,A.__webglTexture=rt[_t].texture}return W}function j(A,x,W){return Math.floor(Math.floor(A/W)/x)}function xt(A,x,W,ht){const _t=A.updateRanges;if(_t.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,W,ht,x.data);else{_t.sort((L,it)=>L.start-it.start);let Et=0;for(let L=1;L<_t.length;L++){const it=_t[Et],K=_t[L],Mt=it.start+it.count,mt=j(K.start,x.width,4),vt=j(it.start,x.width,4);K.start<=Mt+1&&mt===vt&&j(K.start+K.count-1,x.width,4)===mt?it.count=Math.max(it.count,K.start+K.count-it.start):(++Et,_t[Et]=K)}_t.length=Et+1;const tt=e.getParameter(n.UNPACK_ROW_LENGTH),et=e.getParameter(n.UNPACK_SKIP_PIXELS),yt=e.getParameter(n.UNPACK_SKIP_ROWS);e.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let L=0,it=_t.length;L<it;L++){const K=_t[L],Mt=Math.floor(K.start/4),mt=Math.ceil(K.count/4),vt=Mt%x.width,kt=Math.floor(Mt/x.width),re=mt,ft=1;e.pixelStorei(n.UNPACK_SKIP_PIXELS,vt),e.pixelStorei(n.UNPACK_SKIP_ROWS,kt),e.texSubImage2D(n.TEXTURE_2D,0,vt,kt,re,ft,W,ht,x.data)}A.clearUpdateRanges(),e.pixelStorei(n.UNPACK_ROW_LENGTH,tt),e.pixelStorei(n.UNPACK_SKIP_PIXELS,et),e.pixelStorei(n.UNPACK_SKIP_ROWS,yt)}}function gt(A,x,W){let ht=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(ht=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(ht=n.TEXTURE_3D);const rt=Xt(A,x),_t=x.source;e.bindTexture(ht,A.__webglTexture,n.TEXTURE0+W);const Et=i.get(_t);if(_t.version!==Et.__version||rt===!0){if(e.activeTexture(n.TEXTURE0+W),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const ft=pe.getPrimaries(pe.workingColorSpace),Wt=x.colorSpace===yi?null:pe.getPrimaries(x.colorSpace),ee=x.colorSpace===yi||ft===Wt?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee)}e.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment);let et=y(x.image,!1,s.maxTextureSize);et=Yt(x,et);const yt=r.convert(x.format,x.colorSpace),L=r.convert(x.type);let it=T(x.internalFormat,yt,L,x.normalized,x.colorSpace,x.isVideoTexture);pt(ht,x);let K;const Mt=x.mipmaps,mt=x.isVideoTexture!==!0,vt=Et.__version===void 0||rt===!0,kt=_t.dataReady,re=S(x,et);if(x.isDepthTexture)it=_(x.format===wi,x.type),vt&&(mt?e.texStorage2D(n.TEXTURE_2D,1,it,et.width,et.height):e.texImage2D(n.TEXTURE_2D,0,it,et.width,et.height,0,yt,L,null));else if(x.isDataTexture)if(Mt.length>0){mt&&vt&&e.texStorage2D(n.TEXTURE_2D,re,it,Mt[0].width,Mt[0].height);for(let ft=0,Wt=Mt.length;ft<Wt;ft++)K=Mt[ft],mt?kt&&e.texSubImage2D(n.TEXTURE_2D,ft,0,0,K.width,K.height,yt,L,K.data):e.texImage2D(n.TEXTURE_2D,ft,it,K.width,K.height,0,yt,L,K.data);x.generateMipmaps=!1}else mt?(vt&&e.texStorage2D(n.TEXTURE_2D,re,it,et.width,et.height),kt&&xt(x,et,yt,L)):e.texImage2D(n.TEXTURE_2D,0,it,et.width,et.height,0,yt,L,et.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){mt&&vt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,re,it,Mt[0].width,Mt[0].height,et.depth);for(let ft=0,Wt=Mt.length;ft<Wt;ft++)if(K=Mt[ft],x.format!==Kn)if(yt!==null)if(mt){if(kt)if(x.layerUpdates.size>0){const ee=n0(K.width,K.height,x.format,x.type);for(const Rt of x.layerUpdates){const Ee=K.data.subarray(Rt*ee/K.data.BYTES_PER_ELEMENT,(Rt+1)*ee/K.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ft,0,0,Rt,K.width,K.height,1,yt,Ee)}}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ft,0,0,0,K.width,K.height,et.depth,yt,K.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ft,it,K.width,K.height,et.depth,0,K.data,0,0);else qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else mt?kt&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,ft,0,0,0,K.width,K.height,et.depth,yt,L,K.data):e.texImage3D(n.TEXTURE_2D_ARRAY,ft,it,K.width,K.height,et.depth,0,yt,L,K.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{mt&&vt&&e.texStorage2D(n.TEXTURE_2D,re,it,Mt[0].width,Mt[0].height);for(let ft=0,Wt=Mt.length;ft<Wt;ft++)K=Mt[ft],x.format!==Kn?yt!==null?mt?kt&&e.compressedTexSubImage2D(n.TEXTURE_2D,ft,0,0,K.width,K.height,yt,K.data):e.compressedTexImage2D(n.TEXTURE_2D,ft,it,K.width,K.height,0,K.data):qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):mt?kt&&e.texSubImage2D(n.TEXTURE_2D,ft,0,0,K.width,K.height,yt,L,K.data):e.texImage2D(n.TEXTURE_2D,ft,it,K.width,K.height,0,yt,L,K.data)}else if(x.isDataArrayTexture)if(mt){if(vt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,re,it,et.width,et.height,et.depth),kt)if(x.layerUpdates.size>0){const ft=n0(et.width,et.height,x.format,x.type);for(const Wt of x.layerUpdates){const ee=et.data.subarray(Wt*ft/et.data.BYTES_PER_ELEMENT,(Wt+1)*ft/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Wt,et.width,et.height,1,yt,L,ee)}x.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,yt,L,et.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,it,et.width,et.height,et.depth,0,yt,L,et.data);else if(x.isData3DTexture)mt?(vt&&e.texStorage3D(n.TEXTURE_3D,re,it,et.width,et.height,et.depth),kt&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,yt,L,et.data)):e.texImage3D(n.TEXTURE_3D,0,it,et.width,et.height,et.depth,0,yt,L,et.data);else if(x.isFramebufferTexture){if(vt)if(mt)e.texStorage2D(n.TEXTURE_2D,re,it,et.width,et.height);else{let ft=et.width,Wt=et.height;for(let ee=0;ee<re;ee++)e.texImage2D(n.TEXTURE_2D,ee,it,ft,Wt,0,yt,L,null),ft>>=1,Wt>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in n){const ft=n.canvas;if(ft.hasAttribute("layoutsubtree")||ft.setAttribute("layoutsubtree","true"),et.parentNode!==ft){ft.appendChild(et),u.add(x),ft.onpaint=Wt=>{const ee=Wt.changedElements;for(const Rt of u)ee.includes(Rt.image)&&(Rt.needsUpdate=!0)},ft.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,et);else{const ee=n.RGBA,Rt=n.RGBA,Ee=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,ee,Rt,Ee,et)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(Mt.length>0){if(mt&&vt){const ft=Zt(Mt[0]);e.texStorage2D(n.TEXTURE_2D,re,it,ft.width,ft.height)}for(let ft=0,Wt=Mt.length;ft<Wt;ft++)K=Mt[ft],mt?kt&&e.texSubImage2D(n.TEXTURE_2D,ft,0,0,yt,L,K):e.texImage2D(n.TEXTURE_2D,ft,it,yt,L,K);x.generateMipmaps=!1}else if(mt){if(vt){const ft=Zt(et);e.texStorage2D(n.TEXTURE_2D,re,it,ft.width,ft.height)}kt&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,yt,L,et)}else e.texImage2D(n.TEXTURE_2D,0,it,yt,L,et);w(x)&&x.mipmapsAutoUpdate===!0&&M(ht),Et.__version=_t.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function Nt(A,x,W){if(x.image.length!==6)return;const ht=Xt(A,x),rt=x.source;e.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+W);const _t=i.get(rt);if(rt.version!==_t.__version||ht===!0){e.activeTexture(n.TEXTURE0+W);const Et=pe.getPrimaries(pe.workingColorSpace),tt=x.colorSpace===yi?null:pe.getPrimaries(x.colorSpace),et=x.colorSpace===yi||Et===tt?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);const yt=x.isCompressedTexture||x.image[0].isCompressedTexture,L=x.image[0]&&x.image[0].isDataTexture,it=[];for(let Rt=0;Rt<6;Rt++)!yt&&!L?it[Rt]=y(x.image[Rt],!0,s.maxCubemapSize):it[Rt]=L?x.image[Rt].image:x.image[Rt],it[Rt]=Yt(x,it[Rt]);const K=it[0],Mt=r.convert(x.format,x.colorSpace),mt=r.convert(x.type);let vt=T(x.internalFormat,Mt,mt,x.normalized,x.colorSpace);const kt=x.isVideoTexture!==!0,re=_t.__version===void 0||ht===!0,ft=rt.dataReady;let Wt=S(x,K);pt(n.TEXTURE_CUBE_MAP,x);let ee;if(x.isDepthTexture){if(vt=_(x.format===wi,x.type),re)if(kt)e.texStorage2D(n.TEXTURE_CUBE_MAP,1,vt,K.width,K.height);else for(let Rt=0;Rt<6;Rt++)e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,0,vt,K.width,K.height,0,Mt,mt,null)}else if(yt){kt&&re&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Wt,vt,K.width,K.height);for(let Rt=0;Rt<6;Rt++){ee=it[Rt].mipmaps;for(let Ee=0;Ee<ee.length;Ee++){const $e=ee[Ee];x.format!==Kn?Mt!==null?kt?ft&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,Ee,0,0,$e.width,$e.height,Mt,$e.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,Ee,vt,$e.width,$e.height,0,$e.data):qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):kt?ft&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,Ee,0,0,$e.width,$e.height,Mt,mt,$e.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,Ee,vt,$e.width,$e.height,0,Mt,mt,$e.data)}}}else{if(ee=x.mipmaps,kt&&re){ee.length>0&&Wt++;const Rt=Zt(it[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Wt,vt,Rt.width,Rt.height)}for(let Rt=0;Rt<6;Rt++)if(L){kt?ft&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,0,0,0,it[Rt].width,it[Rt].height,Mt,mt,it[Rt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,0,vt,it[Rt].width,it[Rt].height,0,Mt,mt,it[Rt].data);for(let Ee=0;Ee<ee.length;Ee++){const di=ee[Ee].image[Rt].image;kt?ft&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,Ee+1,0,0,di.width,di.height,Mt,mt,di.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,Ee+1,vt,di.width,di.height,0,Mt,mt,di.data)}}else{kt?ft&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,0,0,0,Mt,mt,it[Rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,0,vt,Mt,mt,it[Rt]);for(let Ee=0;Ee<ee.length;Ee++){const $e=ee[Ee];kt?ft&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,Ee+1,0,0,Mt,mt,$e.image[Rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Rt,Ee+1,vt,Mt,mt,$e.image[Rt])}}}w(x)&&x.mipmapsAutoUpdate===!0&&M(n.TEXTURE_CUBE_MAP),_t.__version=rt.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function At(A,x,W,ht,rt,_t){const Et=r.convert(W.format,W.colorSpace),tt=r.convert(W.type),et=T(W.internalFormat,Et,tt,W.normalized,W.colorSpace),yt=i.get(x),L=i.get(W);if(L.__renderTarget=x,!yt.__hasExternalTextures){const it=Math.max(1,x.width>>_t),K=Math.max(1,x.height>>_t);rt===n.TEXTURE_3D||rt===n.TEXTURE_2D_ARRAY?e.texImage3D(rt,_t,et,it,K,x.depth,0,Et,tt,null):e.texImage2D(rt,_t,et,it,K,0,Et,tt,null)}e.bindFramebuffer(n.FRAMEBUFFER,A),wt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ht,rt,L.__webglTexture,0,Ae(x)):(rt===n.TEXTURE_2D||rt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ht,rt,L.__webglTexture,_t),e.bindFramebuffer(n.FRAMEBUFFER,null)}function te(A,x,W){if(n.bindRenderbuffer(n.RENDERBUFFER,A),x.depthBuffer){const ht=x.depthTexture,rt=ht&&ht.isDepthTexture?ht.type:null,_t=_(x.stencilBuffer,rt),Et=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;wt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ae(x),_t,x.width,x.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ae(x),_t,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,_t,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Et,n.RENDERBUFFER,A)}else{const ht=x.textures;for(let rt=0;rt<ht.length;rt++){const _t=ht[rt],Et=r.convert(_t.format,_t.colorSpace),tt=r.convert(_t.type),et=T(_t.internalFormat,Et,tt,_t.normalized,_t.colorSpace);wt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ae(x),et,x.width,x.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ae(x),et,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,et,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function zt(A,x,W){const ht=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(n.FRAMEBUFFER,A),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const rt=i.get(x.depthTexture);rt.__renderTarget=x;const _t=ht?x.depthTexture.image[0]:x.depthTexture.image;(!rt.__webglTexture||_t.width!==x.width||_t.height!==x.height)&&(_t.width=x.width,_t.height=x.height,x.depthTexture.needsUpdate=!0),ht?G(x.depthTexture,0):bt(x.depthTexture,0);const Et=rt.__webglTexture,tt=Ae(x),et=ht?n.TEXTURE_CUBE_MAP_POSITIVE_X+W:n.TEXTURE_2D,yt=x.depthTexture.format===wi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===Ti)wt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,yt,et,Et,0,tt):n.framebufferTexture2D(n.FRAMEBUFFER,yt,et,Et,0);else if(x.depthTexture.format===wi)wt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,yt,et,Et,0,tt):n.framebufferTexture2D(n.FRAMEBUFFER,yt,et,Et,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ce(A){const x=i.get(A),W=A.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==A.depthTexture){const ht=A.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),ht){const rt=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,ht.removeEventListener("dispose",rt)};ht.addEventListener("dispose",rt),x.__depthDisposeCallback=rt}x.__boundDepthTexture=ht}if(A.depthTexture&&!x.__autoAllocateDepthBuffer)if(W)for(let ht=0;ht<6;ht++)zt(x.__webglFramebuffer[ht],A,ht);else A.texture.mipmaps.length>0?zt(x.__webglFramebuffer[0],A,0):zt(x.__webglFramebuffer,A,0);else if(W){x.__webglDepthbuffer=[];for(let ht=0;ht<6;ht++)if(e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[ht]),x.__webglDepthbuffer[ht]===void 0)x.__webglDepthbuffer[ht]=n.createRenderbuffer(),te(x.__webglDepthbuffer[ht],A,!1);else{const rt=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,_t=x.__webglDepthbuffer[ht];n.bindRenderbuffer(n.RENDERBUFFER,_t),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,_t)}}else if(A.texture.mipmaps.length>0?e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),te(x.__webglDepthbuffer,A,!1);else{const rt=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,_t=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,_t),n.framebufferRenderbuffer(n.FRAMEBUFFER,rt,n.RENDERBUFFER,_t)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function ue(A,x,W){const ht=i.get(A);x!==void 0&&At(ht.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&ce(A)}function ye(A){const x=A.texture,W=i.get(A),ht=i.get(x);A.addEventListener("dispose",k),I(A);const rt=A.textures,_t=A.isWebGLCubeRenderTarget===!0,Et=rt.length>1;if(Et||(ht.__webglTexture===void 0&&(ht.__webglTexture=n.createTexture()),ht.__version=x.version,a.memory.textures++),_t){W.__webglFramebuffer=[];for(let tt=0;tt<6;tt++)if(x.mipmaps.length>0){W.__webglFramebuffer[tt]=[];for(let et=0;et<x.mipmaps.length;et++)W.__webglFramebuffer[tt][et]=n.createFramebuffer()}else W.__webglFramebuffer[tt]=n.createFramebuffer()}else{if(x.mipmaps.length>0){W.__webglFramebuffer=[];for(let tt=0;tt<x.mipmaps.length;tt++)W.__webglFramebuffer[tt]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(Et)for(let tt=0,et=rt.length;tt<et;tt++){const yt=i.get(rt[tt]);yt.__webglTexture===void 0&&(yt.__webglTexture=n.createTexture(),a.memory.textures++)}if(A.samples>0&&wt(A)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let tt=0;tt<rt.length;tt++){const et=rt[tt];W.__webglColorRenderbuffer[tt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[tt]);const yt=r.convert(et.format,et.colorSpace),L=r.convert(et.type),it=T(et.internalFormat,yt,L,et.normalized,et.colorSpace,A.isXRRenderTarget===!0),K=Ae(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,K,it,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+tt,n.RENDERBUFFER,W.__webglColorRenderbuffer[tt])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),te(W.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(_t){e.bindTexture(n.TEXTURE_CUBE_MAP,ht.__webglTexture),pt(n.TEXTURE_CUBE_MAP,x);for(let tt=0;tt<6;tt++)if(x.mipmaps.length>0)for(let et=0;et<x.mipmaps.length;et++)At(W.__webglFramebuffer[tt][et],A,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+tt,et);else At(W.__webglFramebuffer[tt],A,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0);w(x)?M(n.TEXTURE_CUBE_MAP):x.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,x.mipmaps.length-1),e.unbindTexture()}else if(Et){for(let tt=0,et=rt.length;tt<et;tt++){const yt=rt[tt],L=i.get(yt);let it=n.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(it=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(it,L.__webglTexture),pt(it,yt),At(W.__webglFramebuffer,A,yt,n.COLOR_ATTACHMENT0+tt,it,0),w(yt)&&M(it)}e.unbindTexture()}else{let tt=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(tt=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(tt,ht.__webglTexture),pt(tt,x),x.mipmaps.length>0)for(let et=0;et<x.mipmaps.length;et++)At(W.__webglFramebuffer[et],A,x,n.COLOR_ATTACHMENT0,tt,et);else At(W.__webglFramebuffer,A,x,n.COLOR_ATTACHMENT0,tt,0);w(x)?M(tt):x.mipmaps.length>0&&n.texParameteri(tt,n.TEXTURE_MAX_LEVEL,x.mipmaps.length-1),e.unbindTexture()}A.depthBuffer&&ce(A)}function B(A){const x=A.textures;for(let W=0,ht=x.length;W<ht;W++){const rt=x[W];if(w(rt)&&rt.mipmapsAutoUpdate===!0){const _t=R(A),Et=i.get(rt).__webglTexture;e.bindTexture(_t,Et),M(_t),e.unbindTexture()}}}const ke=[];function oe(A){if(A.samples>0){if(wt(A)===!1){const x=A.textures,W=A.width,ht=A.height;let rt=n.COLOR_BUFFER_BIT;const _t=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Et=i.get(A),tt=x.length>1;if(tt)for(let yt=0;yt<x.length;yt++)e.bindFramebuffer(n.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Et.__webglMultisampledFramebuffer),A.texture.mipmaps.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Et.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Et.__webglFramebuffer);for(let yt=0;yt<x.length;yt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(rt|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(rt|=n.STENCIL_BUFFER_BIT)),tt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Et.__webglColorRenderbuffer[yt]);const L=i.get(x[yt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,L,0)}n.blitFramebuffer(0,0,W,ht,0,0,W,ht,rt,n.NEAREST),l===!0&&(ke.length=0,ke.push(n.COLOR_ATTACHMENT0+yt),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&ke.push(_t),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ke))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),tt)for(let yt=0;yt<x.length;yt++){e.bindFramebuffer(n.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.RENDERBUFFER,Et.__webglColorRenderbuffer[yt]);const L=i.get(x[yt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Et.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.TEXTURE_2D,L,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Et.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&l){const x=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function Ae(A){return Math.min(s.maxSamples,A.samples)}function wt(A){const x=i.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Fe(A){const x=a.render.frame;h.get(A)!==x&&(h.set(A,x),A.update())}function Yt(A,x){const W=A.colorSpace,ht=A.format,rt=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||W!==na&&W!==yi&&(pe.getTransfer(W)===we?(ht!==Kn||rt!==Sn)&&qt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):_e("WebGLTextures: Unsupported texture color space:",W)),x}function Zt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=Ht,this.resetTextureUnits=nt,this.getTextureUnits=at,this.setTextureUnits=Dt,this.setTexture2D=bt,this.setTexture2DArray=It,this.setTexture3D=Vt,this.setTextureCube=G,this.rebindTextures=ue,this.setupRenderTarget=ye,this.updateRenderTargetMipmap=B,this.updateMultisampleRenderTarget=oe,this.setupDepthRenderbuffer=ce,this.setupFrameBufferTexture=At,this.useMultisampledRTT=wt,this.dispose=H}function A1(n,t){function e(i,s=yi){let r;const a=pe.getTransfer(s);if(i===Sn)return n.UNSIGNED_BYTE;if(i===Sl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===bl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Q0)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===j0)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===K0)return n.BYTE;if(i===J0)return n.SHORT;if(i===Zs)return n.UNSIGNED_SHORT;if(i===Ml)return n.INT;if(i===jn)return n.UNSIGNED_INT;if(i===zn)return n.FLOAT;if(i===mn)return n.HALF_FLOAT;if(i===th)return n.ALPHA;if(i===eh)return n.RGB;if(i===Kn)return n.RGBA;if(i===Ti)return n.DEPTH_COMPONENT;if(i===wi)return n.DEPTH_STENCIL;if(i===wl)return n.RED;if(i===El)return n.RED_INTEGER;if(i===zi)return n.RG;if(i===Tl)return n.RG_INTEGER;if(i===Al)return n.RGBA_INTEGER;if(i===Vr||i===Wr||i===Xr||i===Yr)if(a===we)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Vr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Wr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Yr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Vr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Wr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Xr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Yr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===So||i===bo||i===wo||i===Eo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===So)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===bo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===wo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Eo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===To||i===Ao||i===Ro||i===Co||i===Po||i===jr||i===Lo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===To||i===Ao)return a===we?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Ro)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Co)return r.COMPRESSED_R11_EAC;if(i===Po)return r.COMPRESSED_SIGNED_R11_EAC;if(i===jr)return r.COMPRESSED_RG11_EAC;if(i===Lo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Do||i===Io||i===No||i===Uo||i===Fo||i===Oo||i===Bo||i===zo||i===ko||i===Go||i===Ho||i===Vo||i===Wo||i===Xo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Do)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Io)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===No)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Uo)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Fo)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Oo)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Bo)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===zo)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ko)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Go)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ho)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Vo)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Wo)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Xo)return a===we?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Yo||i===qo||i===$o)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===Yo)return a===we?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===qo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===$o)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Zo||i===Ko||i===ta||i===Jo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Zo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Ko)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ta)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Jo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ms?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const R1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,C1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class P1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new _h(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new bn({vertexShader:R1,fragmentShader:C1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ie(new pa(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class L1 extends Ri{constructor(t,e){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,g=null;const v=typeof XRWebGLBinding<"u",m=new P1,p={},y=e.getContextAttributes();let w=null,M=null;const R=[],T=[],_=new ot;let S=null,I=null;const C=new Mn;C.viewport=new Ne;const N=new Mn;N.viewport=new Ne;const k=[C,N],q=new Od;let D=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let bt=R[Q];return bt===void 0&&(bt=new Na,R[Q]=bt),bt.getTargetRaySpace()},this.getControllerGrip=function(Q){let bt=R[Q];return bt===void 0&&(bt=new Na,R[Q]=bt),bt.getGripSpace()},this.getHand=function(Q){let bt=R[Q];return bt===void 0&&(bt=new Na,R[Q]=bt),bt.getHandSpace()};function J(Q){const bt=T.indexOf(Q.inputSource);if(bt===-1)return;const It=R[bt];It!==void 0&&(It.update(Q.inputSource,Q.frame,c||a),It.dispatchEvent({type:Q.type,data:Q.inputSource}))}function z(){s.removeEventListener("select",J),s.removeEventListener("selectstart",J),s.removeEventListener("selectend",J),s.removeEventListener("squeeze",J),s.removeEventListener("squeezestart",J),s.removeEventListener("squeezeend",J),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",lt);for(let Q=0;Q<R.length;Q++){const bt=T[Q];bt!==null&&(T[Q]=null,R[Q].disconnect(bt))}D=null,H=null,m.reset();for(const Q in p)delete p[Q];if(t.setRenderTarget(w),d=null,f=null,u=null,s=null,M=null,Ht.stop(),i.isPresenting=!1,t.setPixelRatio(S),t.setSize(_.width,_.height,!1),I!==null){const Q=I.camera;Q.fov=I.fov,Q.zoom=I.zoom,Q.updateProjectionMatrix(),I=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,i.isPresenting===!0&&qt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,i.isPresenting===!0&&qt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(w=t.getRenderTarget(),s.addEventListener("select",J),s.addEventListener("selectstart",J),s.addEventListener("selectend",J),s.addEventListener("squeeze",J),s.addEventListener("squeezestart",J),s.addEventListener("squeezeend",J),s.addEventListener("end",z),s.addEventListener("inputsourceschange",lt),y.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(_),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let It=null,Vt=null,G=null;y.depth&&(G=y.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,It=y.stencil?wi:Ti,Vt=y.stencil?ms:jn);const ut={colorFormat:e.RGBA8,depthFormat:G,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(ut),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),M=new gn(f.textureWidth,f.textureHeight,{format:Kn,type:Sn,depthTexture:new gs(f.textureWidth,f.textureHeight,Vt,void 0,void 0,void 0,void 0,void 0,void 0,It),stencilBuffer:y.stencil,colorSpace:t.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{const It={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,It),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new gn(d.framebufferWidth,d.framebufferHeight,{format:Kn,type:Sn,colorSpace:t.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ht.setContext(s),Ht.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function lt(Q){for(let bt=0;bt<Q.removed.length;bt++){const It=Q.removed[bt],Vt=T.indexOf(It);Vt>=0&&(T[Vt]=null,R[Vt].disconnect(It))}for(let bt=0;bt<Q.added.length;bt++){const It=Q.added[bt];let Vt=T.indexOf(It);if(Vt===-1){for(let ut=0;ut<R.length;ut++)if(ut>=T.length){T.push(It),Vt=ut;break}else if(T[ut]===null){T[ut]=It,Vt=ut;break}if(Vt===-1)break}const G=R[Vt];G&&G.connect(It)}}function $(Q,bt){bt===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(bt.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let bt=Q.near,It=Q.far;m.texture!==null&&(m.depthNear>0&&(bt=m.depthNear),m.depthFar>0&&(It=m.depthFar)),q.near=N.near=C.near=bt,q.far=N.far=C.far=It,(D!==q.near||H!==q.far)&&(s.updateRenderState({depthNear:q.near,depthFar:q.far}),D=q.near,H=q.far),q.layers.mask=Q.layers.mask|6,C.layers.mask=q.layers.mask&-5,N.layers.mask=q.layers.mask&-3;const Vt=Q.parent,G=q.cameras;$(q,Vt);for(let ut=0;ut<G.length;ut++)$(G[ut],Vt);q.projectionMatrix.copy(C.projectionMatrix),q.projectionMatrixInverse.copy(C.projectionMatrixInverse),I===null&&Q.isPerspectiveCamera&&(I={camera:Q,fov:Q.fov,zoom:Q.zoom}),nt(Q,q,Vt)};function nt(Q,bt,It){It===null?Q.matrix.copy(bt.matrixWorld):(Q.matrix.copy(It.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(bt.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(bt.projectionMatrix),Q.projectionMatrixInverse.copy(bt.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Js*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return q},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(Q){l=Q,f!==null&&(f.fixedFoveation=Q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(q)},this.getCameraTexture=function(Q){return p[Q]};let at=null;function Dt(Q,bt){if(h=bt.getViewerPose(c||a),g=bt,h!==null){const It=h.views;d!==null&&(t.setRenderTargetFramebuffer(M,d.framebuffer),t.setRenderTarget(M));let Vt=!1;It.length!==q.cameras.length&&(q.cameras.length=0,Vt=!0);for(let Pt=0;Pt<It.length;Pt++){const pt=It[Pt];let Xt=null;if(d!==null)Xt=d.getViewport(pt);else{const xt=u.getViewSubImage(f,pt);Xt=xt.viewport,Pt===0&&(t.setRenderTargetTextures(M,xt.colorTexture,xt.depthStencilTexture),t.setRenderTarget(M))}let j=k[Pt];j===void 0&&(j=new Mn,j.layers.enable(Pt),j.viewport=new Ne,k[Pt]=j),j.matrix.fromArray(pt.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(pt.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(Xt.x,Xt.y,Xt.width,Xt.height),Pt===0&&(q.matrix.copy(j.matrix),q.matrix.decompose(q.position,q.quaternion,q.scale)),Vt===!0&&q.cameras.push(j)}const G=s.enabledFeatures;if(G&&G.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=i.getBinding();const Pt=u.getDepthInformation(It[0]);Pt&&Pt.isValid&&Pt.texture&&m.init(Pt,s.renderState)}if(G&&G.includes("camera-access")&&v){t.state.unbindTexture(),u=i.getBinding();for(let Pt=0;Pt<It.length;Pt++){const pt=It[Pt].camera;if(pt){let Xt=p[pt];Xt||(Xt=new _h,p[pt]=Xt);const j=u.getCameraImage(pt);Xt.sourceTexture=j}}}}for(let It=0;It<R.length;It++){const Vt=T[It],G=R[It];Vt!==null&&G!==void 0&&G.update(Vt,bt,c||a)}at&&at(Q,bt),bt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:bt}),g=null}const Ht=new Fh;Ht.setAnimationLoop(Dt),this.setAnimationLoop=function(Q){at=Q},this.dispose=function(){}}}const D1=new be,Yh=new Kt;Yh.set(-1,0,0,0,1,0,0,0,1);function I1(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Ch(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,y,w,M){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&d(m,p,M)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,y,w):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===cn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===cn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=t.get(p),w=y.envMap,M=y.envMapRotation;w&&(m.envMap.value=w,m.envMapRotation.value.setFromMatrix4(D1.makeRotationFromEuler(M)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Yh),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,y,w){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=w*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,y){m.ior.value=p.ior,p.diffuseRoughness>0&&(m.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(m.diffuseRoughnessMap.value=p.diffuseRoughnessMap,e(p.diffuseRoughnessMap,m.diffuseRoughnessMapTransform))),p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===cn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,m.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const y=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function N1(n,t,e,i){let s={},r={};function a(y,w){const M=w.program;i.uniformBlockBinding(y,M,s[y.id])}function o(y,w){let M=s[y.id];M===void 0&&(g(y),M=l(y),s[y.id]=M,y.addEventListener("dispose",m));const R=w.program;i.updateUBOMapping(y,R);const T=t.render.frame;r[y.id]!==T&&(c(y),r[y.id]=T)}function l(y){const w=n.createBuffer(),M=y.__size,R=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,M,R),n.bindBuffer(n.UNIFORM_BUFFER,null),w}function c(y){const w=s[y.id],M=y.uniforms,R=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,w);for(let T=0,_=M.length;T<_;T++){const S=M[T];if(Array.isArray(S))for(let I=0,C=S.length;I<C;I++)h(S[I],T,I,R);else h(S,T,0,R)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function h(y,w,M,R){if(f(y,w,M,R)===!0){const T=y.__offset,_=y.value;if(Array.isArray(_)){let S=0;for(let I=0;I<_.length;I++){const C=_[I],N=v(C,!0);u(C,y.__data,S),S+=N.storage/Float32Array.BYTES_PER_ELEMENT}}else u(_,y.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,T,y.__data)}}function u(y,w,M){typeof y=="number"||typeof y=="boolean"?w[M]=y:y.isMatrix3?(w[M]=y.elements[0],w[M+1]=y.elements[1],w[M+2]=y.elements[2],w[M+3]=0,w[M+4]=y.elements[3],w[M+5]=y.elements[4],w[M+6]=y.elements[5],w[M+7]=0,w[M+8]=y.elements[6],w[M+9]=y.elements[7],w[M+10]=y.elements[8],w[M+11]=0):ArrayBuffer.isView(y)?w.set(y.subarray(0,w.length-M),M):y.toArray(w,M)}function f(y,w,M,R){const T=y.value,_=w+"_"+M;if(Array.isArray(T)){R[_]===void 0&&(R[_]=[]);const S=R[_];let I=!1;for(let C=0;C<T.length;C++)d(T[C],S,C)===!0&&(I=!0);return I}return d(T,R,_)}function d(y,w,M){if(w[M]===void 0)return typeof y=="number"||typeof y=="boolean"?w[M]=y:ArrayBuffer.isView(y)?w[M]=y.slice():w[M]=y.clone(),!0;{const R=w[M];if(typeof y=="number"||typeof y=="boolean"){if(R!==y)return w[M]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(R.equals(y)===!1)return R.copy(y),!0}}return!1}function g(y){const w=y.uniforms;let M=0;const R=16;for(let _=0,S=w.length;_<S;_++){const I=Array.isArray(w[_])?w[_]:[w[_]];for(let C=0,N=I.length;C<N;C++){const k=I[C],q=Array.isArray(k.value)?k.value:[k.value],D=Array.isArray(w[_])||Array.isArray(k.value);let H=M;for(let z=0,lt=q.length;z<lt;z++){const $=q[z],nt=v($,D),at=M%R,Dt=at%nt.boundary,Ht=at+Dt;M+=Dt,Ht!==0&&R-Ht<nt.storage&&(M+=R-Ht),z===0&&(H=M),M+=nt.storage}const J=k.type==="int"?Int32Array:k.type==="uint"?Uint32Array:Float32Array;k.__data=new J((M-H)/Float32Array.BYTES_PER_ELEMENT),k.__offset=H}}const T=M%R;return T>0&&(M+=R-T),y.__size=M,y.__cache={},this}function v(y,w){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=16,M.storage=48):y.isMatrix4?(M.boundary=16,M.storage=64):y.isTexture?qt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(M.boundary=16,M.storage=y.byteLength):qt("WebGLRenderer: Unsupported uniform value type.",y),w===!0&&(M.boundary=16,M.storage=Math.ceil(M.storage/16)*16),M}function m(y){const w=y.target;w.removeEventListener("dispose",m),n.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function p(){for(const y in s)n.deleteBuffer(s[y]);s={},r={}}return{bind:a,update:o,dispose:p}}const U1=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Wn=null;function F1(){return Wn===null&&(Wn=new dh(U1,16,16,zi,mn),Wn.name="DFG_LUT",Wn.minFilter=pn,Wn.magFilter=pn,Wn.wrapS=ci,Wn.wrapT=ci,Wn.generateMipmaps=!1,Wn.needsUpdate=!0),Wn}class qh{constructor(t={}){const{canvas:e=lf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1,outputBufferType:d=Sn}=t;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const v=d,m=new Set([Al,Tl,El]),p=new Set([Sn,jn,Zs,ms,Sl,bl]),y=new Uint32Array(4),w=new Int32Array(4),M={textures:[],min:[],max:[],resolution:[]};let R=null,T=null;const _=[],S=[];let I=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=hi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let N=!1,k=null,q=null,D=null,H=null;this._outputColorSpace=ln;let J=0,z=0,lt=null,$=-1,nt=null;const at=new Ne,Dt=new Ne;let Ht=null;const Q=new Qt(0);let bt=0,It=e.width,Vt=e.height,G=1,ut=null,Gt=null;const Pt=new Ne(0,0,It,Vt),pt=new Ne(0,0,It,Vt);let Xt=!1;const j=new Qs,xt=new Ul;let gt=!1,Nt=!1;const At=new be,te=new P,zt=new Ne,ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ue=!1;function ye(){return lt===null?G:1}let B=i;function ke(b,U){return e.getContext(b,U)}let oe,Ae,wt,Fe,Yt,Zt,A,x,W,ht,rt,_t,Et,tt,et,yt,L,it,K,Mt,mt,vt,kt;try{const b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${dl}`),e.addEventListener("webglcontextlost",Wt,!1),e.addEventListener("webglcontextrestored",ee,!1),e.addEventListener("webglcontextcreationerror",Rt,!1),B===null){const U="webgl2";if(B=ke(U,b),B===null)throw ke(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}re()}catch(b){throw e.removeEventListener("webglcontextlost",Wt,!1),e.removeEventListener("webglcontextrestored",ee,!1),e.removeEventListener("webglcontextcreationerror",Rt,!1),_e("WebGLRenderer: "+b.message),b}function re(){oe=new kg(B),oe.init(),mt=new A1(B,oe),Ae=new Cg(B,oe,t,mt),wt=new E1(B,oe),Ae.reversedDepthBuffer&&f&&wt.buffers.depth.setReversed(!0),q=B.createFramebuffer(),D=B.createFramebuffer(),H=B.createFramebuffer(),Fe=new Vg(B),Yt=new u1,Zt=new T1(B,oe,wt,Yt,Ae,mt,Fe),A=new zg(C),x=new Xd(B),vt=new Ag(B,x),W=new Gg(B,x,Fe,vt),ht=new Xg(B,W,x,vt,Fe),it=new Wg(B,Ae,Zt),et=new Pg(Yt),rt=new h1(C,A,oe,Ae,vt,et),_t=new I1(C,Yt),Et=new d1,tt=new x1(oe),L=new Tg(C,A,wt,ht,g,l),yt=new w1(C,ht,Ae),kt=new N1(B,Fe,Ae,wt),K=new Rg(B,oe,Fe),Mt=new Hg(B,oe,Fe),Fe.programs=rt.programs,C.capabilities=Ae,C.extensions=oe,C.properties=Yt,C.renderLists=Et,C.shadowMap=yt,C.state=wt,C.info=Fe}v!==Sn&&(I=new qg(v,e.width,e.height,o,s,r));const ft=new L1(C,B);this.xr=ft,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const b=oe.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=oe.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(b){b!==void 0&&(G=b,this.setSize(It,Vt,!1))},this.getSize=function(b){return b.set(It,Vt)},this.setSize=function(b,U,Z=!0){if(ft.isPresenting){qt("WebGLRenderer: Can't change size while VR device is presenting.");return}It=b,Vt=U,e.width=Math.floor(b*G),e.height=Math.floor(U*G),Z===!0&&(e.style.width=b+"px",e.style.height=U+"px"),I!==null&&I.setSize(e.width,e.height),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(It*G,Vt*G).floor()},this.setDrawingBufferSize=function(b,U,Z){It=b,Vt=U,G=Z,e.width=Math.floor(b*Z),e.height=Math.floor(U*Z),this.setViewport(0,0,b,U)},this.setEffects=function(b){if(v===Sn){_e("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let U=0;U<b.length;U++)if(b[U].isOutputPass===!0){qt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}I.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(at)},this.getViewport=function(b){return b.copy(Pt)},this.setViewport=function(b,U,Z,V){b.isVector4?Pt.set(b.x,b.y,b.z,b.w):Pt.set(b,U,Z,V),wt.viewport(at.copy(Pt).multiplyScalar(ye()).round())},this.getScissor=function(b){return b.copy(pt)},this.setScissor=function(b,U,Z,V){b.isVector4?pt.set(b.x,b.y,b.z,b.w):pt.set(b,U,Z,V),wt.scissor(Dt.copy(pt).multiplyScalar(ye()).round())},this.getScissorTest=function(){return Xt},this.setScissorTest=function(b){wt.setScissorTest(Xt=b)},this.setOpaqueSort=function(b){ut=b},this.setTransparentSort=function(b){Gt=b},this.getClearColor=function(b){return b.copy(L.getClearColor())},this.setClearColor=function(){L.setClearColor(...arguments)},this.getClearAlpha=function(){return L.getClearAlpha()},this.setClearAlpha=function(){L.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,Z=!0){let V=0;if(b){let X=!1;if(lt!==null){const Tt=lt.texture.format;X=m.has(Tt)}if(X){const Tt=lt.texture.type,Ut=p.has(Tt),St=L.getClearColor(),Lt=L.getClearAlpha(),Bt=St.r,jt=St.g,fe=St.b;Ut?(y[0]=Bt,y[1]=jt,y[2]=fe,y[3]=Lt,B.clearBufferuiv(B.COLOR,0,y)):(w[0]=Bt,w[1]=jt,w[2]=fe,w[3]=Lt,B.clearBufferiv(B.COLOR,0,w))}else V|=B.COLOR_BUFFER_BIT}U&&(V|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Z&&(V|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&B.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),k=b},this.dispose=function(){e.removeEventListener("webglcontextlost",Wt,!1),e.removeEventListener("webglcontextrestored",ee,!1),e.removeEventListener("webglcontextcreationerror",Rt,!1),L.dispose(),Et.dispose(),tt.dispose(),Zt.dispose(),Yt.dispose(),A.dispose(),ht.dispose(),W.dispose(),vt.dispose(),kt.dispose(),rt.dispose(),ft.dispose(),ft.removeEventListener("sessionstart",ic),ft.removeEventListener("sessionend",sc),Ci.stop()};function Wt(b){b.preventDefault(),vc("WebGLRenderer: Context Lost."),N=!0}function ee(){vc("WebGLRenderer: Context Restored."),N=!1;const b=Fe.autoReset,U=yt.enabled,Z=yt.autoUpdate,V=yt.needsUpdate,X=yt.type;re(),Fe.autoReset=b,yt.enabled=U,yt.autoUpdate=Z,yt.needsUpdate=V,yt.type=X}function Rt(b){_e("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Ee(b){const U=b.target;U.removeEventListener("dispose",Ee),$e(U)}function $e(b){di(b),Yt.remove(b)}function di(b){const U=Yt.get(b).programs;U!==void 0&&(U.forEach(function(Z){rt.releaseProgram(Z)}),b.isShaderMaterial&&rt.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,Z,V,X,Tt){U===null&&(U=ce);const Ut=X.isMesh&&X.matrixWorld.determinantAffine()<0,St=wu(b,U,Z,V,X);wt.setMaterial(V,Ut);let Lt=Z.index,Bt=1;if(V.wireframe===!0){if(Lt=W.getWireframeAttribute(Z),Lt===void 0)return;Bt=2}const jt=Z.drawRange,fe=Z.attributes.position;let Ft=jt.start*Bt,de=(jt.start+jt.count)*Bt;Tt!==null&&(Ft=Math.max(Ft,Tt.start*Bt),de=Math.min(de,(Tt.start+Tt.count)*Bt)),Lt!==null?(Ft=Math.max(Ft,0),de=Math.min(de,Lt.count)):fe!=null&&(Ft=Math.max(Ft,0),de=Math.min(de,fe.count));const Ge=de-Ft;if(Ge<0||Ge===1/0)return;vt.setup(X,V,St,Z,Lt);let Pe,Re=K;if(Lt!==null&&(Pe=x.get(Lt),Re=Mt,Re.setIndex(Pe)),X.isMesh)V.wireframe===!0?(wt.setLineWidth(V.wireframeLinewidth*ye()),Re.setMode(B.LINES)):Re.setMode(B.TRIANGLES);else if(X.isLine){let tn=V.linewidth;tn===void 0&&(tn=1),wt.setLineWidth(tn*ye()),X.isLineSegments?Re.setMode(B.LINES):X.isLineLoop?Re.setMode(B.LINE_LOOP):Re.setMode(B.LINE_STRIP)}else X.isPoints?Re.setMode(B.POINTS):X.isSprite&&Re.setMode(B.TRIANGLES);if(X.isBatchedMesh)if(oe.get("WEBGL_multi_draw"))Re.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const tn=X._multiDrawStarts,Ot=X._multiDrawCounts,an=X._multiDrawCount,Me=Lt?x.get(Lt).bytesPerElement:1,Pi=Yt.get(V).currentProgram.getUniforms();for(let en=0;en<an;en++)Pi.setValue(B,"_gl_DrawID",en),Re.render(tn[en]/Me,Ot[en])}else if(X.isInstancedMesh)Re.renderInstances(Ft,Ge,X.count);else if(Z.isInstancedBufferGeometry){const tn=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,Ot=Math.min(Z.instanceCount,tn);Re.renderInstances(Ft,Ge,Ot)}else Re.render(Ft,Ge)};function nc(b,U,Z,V){k!==null&&b.isNodeMaterial&&k.setObject(V,b),gt===!0&&et.setState(b,Z,!1),b.transparent===!0&&b.side===Zn&&b.forceSinglePass===!1?(b.side=cn,b.needsUpdate=!0,Ts(b,U,V),b.side=Bi,b.needsUpdate=!0,Ts(b,U,V),b.side=Zn):Ts(b,U,V)}this.compile=function(b,U,Z=null){Z===null&&(Z=b),k!==null&&k.renderStart(b,U,Z),T=tt.get(Z),T.init(U),S.push(T),Z.traverseVisible(function(X){X.isLight&&X.layers.test(U.layers)&&(T.pushLight(X),X.castShadow&&T.pushShadow(X))}),b!==Z&&b.traverseVisible(function(X){X.isLight&&X.layers.test(U.layers)&&(T.pushLight(X),X.castShadow&&T.pushShadow(X))}),T.setupLights(),k!==null&&k.updateLights(T.state.lightsArray),Nt=this.localClippingEnabled,gt=et.init(this.clippingPlanes,Nt),gt===!0&&et.setGlobalState(this.clippingPlanes,U),k!==null&&yt.render(T.state.shadowsArray,Z,U);const V=new Set;return b.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const Tt=X.material;if(Tt)if(Array.isArray(Tt))for(let Ut=0;Ut<Tt.length;Ut++){const St=Tt[Ut];nc(St,Z,U,X),V.add(St)}else nc(Tt,Z,U,X),V.add(Tt)}),T=S.pop(),k!==null&&k.renderEnd(),V},this.compileAsync=function(b,U,Z=null){const V=this.compile(b,U,Z);return new Promise(X=>{function Tt(){if(V.forEach(function(Ut){const Lt=Yt.get(Ut).currentProgram;(Lt===void 0||Lt.isReady())&&V.delete(Ut)}),V.size===0){X(b);return}setTimeout(Tt,10)}oe.get("KHR_parallel_shader_compile")!==null?Tt():setTimeout(Tt,10)})};let ba=null;function Su(b){ba&&ba(b)}function ic(){Ci.stop()}function sc(){Ci.start()}const Ci=new Fh;Ci.setAnimationLoop(Su),typeof self<"u"&&Ci.setContext(self),this.setAnimationLoop=function(b){ba=b,ft.setAnimationLoop(b),b===null?Ci.stop():Ci.start()},ft.addEventListener("sessionstart",ic),ft.addEventListener("sessionend",sc),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){_e("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;k!==null&&k.renderStart(b,U);const Z=ft.enabled===!0&&ft.isPresenting===!0,V=I!==null&&(lt===null||Z)&&I.begin(C,lt);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ft.enabled===!0&&ft.isPresenting===!0&&(I===null||I.isCompositing()===!1)&&(ft.cameraAutoUpdate===!0&&ft.updateCamera(U),U=ft.getCamera()),b.isScene===!0&&b.onBeforeRender(C,b,U,lt),T=tt.get(b,S.length),T.init(U),T.state.textureUnits=Zt.getTextureUnits(),S.push(T),At.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),U.isArrayCamera?xt.setFromArrayCamera(U):j.setFromProjectionMatrix(At,kn,U.reversedDepth),Nt=this.localClippingEnabled,gt=et.init(this.clippingPlanes,Nt),R=Et.get(b,_.length),R.init(),_.push(R),this.info.render.frame++,ft.enabled===!0&&ft.isPresenting===!0){const Ut=C.xr.getDepthSensingMesh();Ut!==null&&wa(Ut,U,-1/0,C.sortObjects)}wa(b,U,0,C.sortObjects),R.finish(),k!==null&&k.updateLights(T.state.lightsArray),C.sortObjects===!0&&R.sort(ut,Gt),ue=ft.enabled===!1||ft.isPresenting===!1||ft.hasDepthSensing()===!1,ue&&L.addToRenderList(R,b),this.info.autoReset===!0&&this.info.reset(),gt===!0&&et.beginShadows();const X=T.state.shadowsArray;if(yt.render(X,b,U),gt===!0&&et.endShadows(),(V&&I.hasRenderPass())===!1){const Ut=R.opaque,St=R.transmissive;if(T.setupLights(),U.isArrayCamera){const Lt=U.cameras;if(St.length>0)for(let Bt=0,jt=Lt.length;Bt<jt;Bt++){const fe=Lt[Bt];ac(Ut,St,b,fe)}ue&&L.render(b);for(let Bt=0,jt=Lt.length;Bt<jt;Bt++){const fe=Lt[Bt];rc(R,b,fe,fe.viewport)}}else St.length>0&&ac(Ut,St,b,U),ue&&L.render(b),rc(R,b,U)}lt!==null&&z===0&&(Zt.updateMultisampleRenderTarget(lt),Zt.updateRenderTargetMipmap(lt)),V&&I.end(C),b.isScene===!0&&b.onAfterRender(C,b,U),vt.resetDefaultState(),$=-1,nt=null,S.pop(),S.length>0?(T=S[S.length-1],Zt.setTextureUnits(T.state.textureUnits),gt===!0&&et.setGlobalState(C.clippingPlanes,T.state.camera)):T=null,_.pop(),_.length>0?R=_[_.length-1]:R=null,k!==null&&k.renderEnd()};function wa(b,U,Z,V){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)Z=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)T.pushLight(b),b.castShadow&&T.pushShadow(b);else if(b.isSprite){const Ut=U.isArrayCamera?xt:j;if(!b.frustumCulled||b.intersectsFrustum(Ut)){V&&zt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(At);const St=ht.update(b),Lt=b.material;Lt.visible&&R.push(b,St,Lt,Z,zt.z,null,U)}}else if(b.isMesh||b.isLine||b.isPoints){const Ut=U.isArrayCamera?xt:j;if(!b.frustumCulled||b.intersectsFrustum(Ut)){const St=ht.update(b),Lt=b.material;if(V&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),zt.copy(b.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),zt.copy(St.boundingSphere.center)),zt.applyMatrix4(b.matrixWorld).applyMatrix4(At)),Array.isArray(Lt)){const Bt=St.groups;for(let jt=0,fe=Bt.length;jt<fe;jt++){const Ft=Bt[jt],de=Lt[Ft.materialIndex];de&&de.visible&&R.push(b,St,de,Z,zt.z,Ft,U)}}else Lt.visible&&R.push(b,St,Lt,Z,zt.z,null,U)}}}const Tt=b.children;for(let Ut=0,St=Tt.length;Ut<St;Ut++)wa(Tt[Ut],U,Z,V)}function rc(b,U,Z,V){const{opaque:X,transmissive:Tt,transparent:Ut}=b;T.setupLightsView(Z),gt===!0&&et.setGlobalState(C.clippingPlanes,Z),V&&wt.viewport(at.copy(V)),X.length>0&&or(X,U,Z),Tt.length>0&&or(Tt,U,Z),Ut.length>0&&or(Ut,U,Z),wt.buffers.depth.setTest(!0),wt.buffers.depth.setMask(!0),wt.buffers.color.setMask(!0),wt.setPolygonOffset(!1)}function ac(b,U,Z,V){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[V.id]===void 0){const Ft=oe.has("EXT_color_buffer_half_float")||oe.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[V.id]=new gn(1,1,{generateMipmaps:!0,type:Ft?mn:Sn,minFilter:bi,samples:Math.max(4,Ae.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:pe.workingColorSpace})}const Tt=T.state.transmissionRenderTarget[V.id],Ut=V.viewport||at;Tt.setSize(Ut.z*C.transmissionResolutionScale,Ut.w*C.transmissionResolutionScale);const St=C.getRenderTarget(),Lt=C.getActiveCubeFace(),Bt=C.getActiveMipmapLevel();C.setRenderTarget(Tt),C.getClearColor(Q),bt=C.getClearAlpha(),bt<1&&C.setClearColor(16777215,.5),C.clear(),ue&&L.render(Z);const jt=C.toneMapping;C.toneMapping=hi;const fe=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),T.setupLightsView(V),gt===!0&&et.setGlobalState(C.clippingPlanes,V),or(b,Z,V),Zt.updateMultisampleRenderTarget(Tt),Zt.updateRenderTargetMipmap(Tt),oe.has("WEBGL_multisampled_render_to_texture")===!1){let Ft=!1;for(let de=0,Ge=U.length;de<Ge;de++){const Pe=U[de],{object:Re,geometry:tn,material:Ot,group:an}=Pe;if(Ot.side===Zn&&Re.layers.test(V.layers)){const Me=Ot.side;Ot.side=cn,Ot.needsUpdate=!0,oc(Re,Z,V,tn,Ot,an),Ot.side=Me,Ot.needsUpdate=!0,Ft=!0}}Ft===!0&&(Zt.updateMultisampleRenderTarget(Tt),Zt.updateRenderTargetMipmap(Tt))}C.setRenderTarget(St,Lt,Bt),C.setClearColor(Q,bt),fe!==void 0&&(V.viewport=fe),C.toneMapping=jt}function or(b,U,Z){const V=U.isScene===!0?U.overrideMaterial:null;for(let X=0,Tt=b.length;X<Tt;X++){const Ut=b[X],{object:St,geometry:Lt,group:Bt}=Ut;let jt=Ut.material;jt.allowOverride===!0&&V!==null&&(jt=V),St.layers.test(Z.layers)&&oc(St,U,Z,Lt,jt,Bt)}}function oc(b,U,Z,V,X,Tt){k!==null&&X.isNodeMaterial&&k.setObject(b,X),b.onBeforeRender(C,U,Z,V,X,Tt),b.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),X.onBeforeRender(C,U,Z,V,b,Tt),X.transparent===!0&&X.side===Zn&&X.forceSinglePass===!1?(X.side=cn,X.needsUpdate=!0,C.renderBufferDirect(Z,U,V,X,b,Tt),X.side=Bi,X.needsUpdate=!0,C.renderBufferDirect(Z,U,V,X,b,Tt),X.side=Zn):C.renderBufferDirect(Z,U,V,X,b,Tt),b.onAfterRender(C,U,Z,V,X,Tt)}function lc(b){let U=0;for(const Z of b)Z.texture!==null&&U++;return U}function Ts(b,U,Z){U.isScene!==!0&&(U=ce);const V=Yt.get(b),X=T.state.lights,Tt=T.state.shadowsArray,Ut=X.state.version,St=rt.getParameters(b,X.state,Tt,U,Z,T.state.lightProbeGridArray),Lt=rt.getProgramCacheKey(St);let Bt=V.programs;V.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?U.environment:null,V.fog=U.fog;const jt=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;V.envMap=A.get(b.envMap||V.environment,jt),V.envMapRotation=V.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Bt===void 0&&(b.addEventListener("dispose",Ee),Bt=new Map,V.programs=Bt,V.programVariants=new Map);let fe=Bt.get(Lt);if(fe!==void 0){if(V.currentProgram===fe&&V.lightsStateVersion===Ut)return hc(b,St),fe}else St.uniforms=rt.getUniforms(b),k!==null&&b.isNodeMaterial&&k.build(b,Z,St),b.onBeforeCompile(St,C),fe=rt.acquireProgram(St,Lt),Bt.set(Lt,fe),V.uniforms=St.uniforms;const Ft=V.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ft.clippingPlanes=et.uniform),hc(b,St),V.needsLights=Tu(b),V.lightsStateVersion=Ut,V.needsLights&&(Ft.ambientLightColor.value=X.state.ambient,Ft.lightProbe.value=X.state.probe,Ft.sunLights.value=X.state.sun,Ft.sunLightShadows.value=X.state.sunShadow,Ft.directionalLights.value=X.state.directional,Ft.directionalLightShadows.value=X.state.directionalShadow,Ft.spotLights.value=X.state.spot,Ft.spotLightShadows.value=X.state.spotShadow,Ft.rectAreaLights.value=X.state.rectArea,Ft.ltc_1.value=X.state.rectAreaLTC1,Ft.ltc_2.value=X.state.rectAreaLTC2,Ft.pointLights.value=X.state.point,Ft.pointLightShadows.value=X.state.pointShadow,Ft.hemisphereLights.value=X.state.hemi,Ft.sunShadowMatrix.value=X.state.sunShadowMatrix,Ft.sunShadowCascade.value=X.state.sunShadowCascade,Ft.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ft.spotLightMatrix.value=X.state.spotLightMatrix,Ft.spotLightMap.value=X.state.spotLightMap,Ft.pointShadowMatrix.value=X.state.pointShadowMatrix),V.numLightProbeGrids=lc(T.state.lightProbeGridArray),V.currentProgram=fe,V.uniformsList=null,fe}function bu(b,U,Z,V,X){const Tt=Yt.get(b),Ut=Tt.currentProgram.id+","+V+","+X;let St=Tt.programVariants.get(Ut);return St===void 0?(St=Ts(b,U,Z),Tt.programVariants.set(Ut,St)):(Tt.currentProgram=St,Tt.uniformsList=null,Tt.outputColorSpace=V,Tt.toneMapping=X),St}function cc(b){if(b.uniformsList===null){const U=b.currentProgram.getUniforms();b.uniformsList=$r.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function hc(b,U){const Z=Yt.get(b);Z.outputColorSpace=U.outputColorSpace,Z.batching=U.batching,Z.batchingColor=U.batchingColor,Z.instancing=U.instancing,Z.instancingColor=U.instancingColor,Z.instancingMorph=U.instancingMorph,Z.skinning=U.skinning,Z.morphTargets=U.morphTargets,Z.morphNormals=U.morphNormals,Z.morphColors=U.morphColors,Z.morphTargetsCount=U.morphTargetsCount,Z.numClippingPlanes=U.numClippingPlanes,Z.numIntersection=U.numClipIntersection,Z.vertexAlphas=U.vertexAlphas,Z.vertexTangents=U.vertexTangents,Z.toneMapping=U.toneMapping}function wu(b,U,Z,V,X){U.isScene!==!0&&(U=ce),Zt.resetTextureUnits();const Tt=U.fog,Ut=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?U.environment:null,St=lt===null?C.outputColorSpace:lt.isXRRenderTarget===!0?lt.texture.colorSpace:pe.workingColorSpace,Lt=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Bt=A.get(V.envMap||Ut,Lt),jt=V.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,fe=!!Z.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ft=!!Z.morphAttributes.position,de=!!Z.morphAttributes.normal,Ge=!!Z.morphAttributes.color;let Pe=hi;V.toneMapped&&(lt===null||lt.isXRRenderTarget===!0)&&(Pe=C.toneMapping);const Re=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,tn=Re!==void 0?Re.length:0,Ot=Yt.get(V),an=T.state.lights;if(gt===!0&&(Nt===!0||b!==nt)){const Ie=b===nt&&V.id===$;et.setState(V,b,Ie)}let Me=!1,Pi=!1;V.version===Ot.__version?Ot.needsLights&&Ot.lightsStateVersion!==an.state.version||X.isBatchedMesh&&Ot.batching===!1||!X.isBatchedMesh&&Ot.batching===!0||X.isBatchedMesh&&Ot.batchingColor===!0&&X._colorsTexture===null||X.isBatchedMesh&&Ot.batchingColor===!1&&X._colorsTexture!==null||X.isInstancedMesh&&Ot.instancing===!1||!X.isInstancedMesh&&Ot.instancing===!0||X.isSkinnedMesh&&Ot.skinning===!1||!X.isSkinnedMesh&&Ot.skinning===!0||X.isInstancedMesh&&Ot.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ot.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ot.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ot.instancingMorph===!1&&X.morphTexture!==null||Ot.envMap!==Bt||V.fog===!0&&Ot.fog!==Tt||Ot.numClippingPlanes!==void 0&&(Ot.numClippingPlanes!==et.numPlanes||Ot.numIntersection!==et.numIntersection)||Ot.vertexAlphas!==jt||Ot.vertexTangents!==fe||Ot.morphTargets!==Ft||Ot.morphNormals!==de||Ot.morphColors!==Ge||Ot.morphTargetsCount!==tn||Ot.numLightProbeGrids!==lc(T.state.lightProbeGridArray)?Me=!0:(Ot.outputColorSpace!==St||Ot.toneMapping!==Pe)&&(Pi=!0):(Me=!0,Ot.__version=V.version);let en=Ot.currentProgram;(Me===!0||Pi===!0)&&(en=Pi===!0?bu(V,U,X,St,Pe):Ts(V,U,X),k&&V.isNodeMaterial&&k.onUpdateProgram(V,en,Ot));let lr=!1,pi=!1,Li=!1;const ge=en.getUniforms(),Je=Ot.uniforms;if(wt.useProgram(en.program)&&(lr=!0,pi=!0,Li=!0),V.id!==$&&($=V.id,pi=!0),lr||nt!==b){wt.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),ge.setValue(B,"projectionMatrix",b.projectionMatrix),ge.setValue(B,"viewMatrix",b.matrixWorldInverse);const Ze=ge.map.cameraPosition;Ze!==void 0&&Ze.setValue(B,te.setFromMatrixPosition(b.matrixWorld)),Ae.logarithmicDepthBuffer&&ge.setValue(B,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&ge.setValue(B,"isOrthographic",b.isOrthographicCamera===!0),nt!==b&&(nt=b,pi=!0,Li=!0)}if(Ot.needsLights&&(an.state.sunShadowMap.length>0&&ge.setValue(B,"sunShadowMap",an.state.sunShadowMap,Zt),an.state.directionalShadowMap.length>0&&ge.setValue(B,"directionalShadowMap",an.state.directionalShadowMap,Zt),an.state.spotShadowMap.length>0&&ge.setValue(B,"spotShadowMap",an.state.spotShadowMap,Zt),an.state.pointShadowMap.length>0&&ge.setValue(B,"pointShadowMap",an.state.pointShadowMap,Zt)),X.isSkinnedMesh){ge.setOptional(B,X,"bindMatrix"),ge.setOptional(B,X,"bindMatrixInverse");const Ie=X.skeleton;Ie&&(Ie.boneTexture===null&&Ie.computeBoneTexture(),ge.setValue(B,"boneTexture",Ie.boneTexture,Zt))}X.isBatchedMesh&&(ge.setOptional(B,X,"batchingTexture"),ge.setValue(B,"batchingTexture",X._matricesTexture,Zt),ge.setOptional(B,X,"batchingIdTexture"),ge.setValue(B,"batchingIdTexture",X._indirectTexture,Zt),ge.setOptional(B,X,"batchingColorTexture"),X._colorsTexture!==null&&ge.setValue(B,"batchingColorTexture",X._colorsTexture,Zt));const Dn=Z.morphAttributes;if((Dn.position!==void 0||Dn.normal!==void 0||Dn.color!==void 0)&&it.update(X,Z,en),(pi||Ot.receiveShadow!==X.receiveShadow)&&(Ot.receiveShadow=X.receiveShadow,ge.setValue(B,"receiveShadow",X.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&U.environment!==null&&(Je.envMapIntensity.value=U.environmentIntensity),Je.dfgLUT!==void 0&&(Je.dfgLUT.value=F1()),pi){if(ge.setValue(B,"toneMappingExposure",C.toneMappingExposure),Ot.needsLights&&Eu(Je,Li),Tt&&V.fog===!0&&_t.refreshFogUniforms(Je,Tt),_t.refreshMaterialUniforms(Je,V,G,Vt,T.state.transmissionRenderTarget[b.id]),Ot.needsLights&&Ot.numLightProbeGrids>0){const Ie=M;let Ze=0;for(const ii of T.state.lightProbeGridArray)ii.texture!==null&&(Ie.textures[Ze]=ii.texture,Ie.min[Ze]=ii.boundingBox.min,Ie.max[Ze]=ii.boundingBox.max,Ie.resolution[Ze]=ii.resolution,Ze++);for(const ii in Ie)Ie[ii].length=Ze;Je.probesSH.value=Ie.textures,Je.probesMin.value=Ie.min,Je.probesMax.value=Ie.max,Je.probesResolution.value=Ie.resolution}$r.upload(B,cc(Ot),Je,Zt)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&($r.upload(B,cc(Ot),Je,Zt),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&ge.setValue(B,"center",X.center),ge.setValue(B,"modelViewMatrix",X.modelViewMatrix),ge.setValue(B,"normalMatrix",X.normalMatrix),ge.setValue(B,"modelMatrix",X.matrixWorld),V.uniformsGroups!==void 0){const Ie=V.uniformsGroups;for(let Ze=0,ii=Ie.length;Ze<ii;Ze++){const fc=Ie[Ze];kt.update(fc,en),kt.bind(fc,en)}}return en}function Eu(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.sunLights.needsUpdate=U,b.sunLightShadows.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function Tu(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return J},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return lt},this.setRenderTargetTextures=function(b,U,Z){const V=Yt.get(b);V.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),Yt.get(b.texture).__webglTexture=U,Yt.get(b.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:Z,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){const Z=Yt.get(b);Z.__webglFramebuffer=U,Z.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(b,U=0,Z=0){lt=b,J=U,z=Z;let V=null,X=!1,Tt=!1;if(b){const St=Yt.get(b);if(St.__useDefaultFramebuffer!==void 0){wt.bindFramebuffer(B.FRAMEBUFFER,St.__webglFramebuffer),at.copy(b.viewport),Dt.copy(b.scissor),Ht=b.scissorTest,wt.viewport(at),wt.scissor(Dt),wt.setScissorTest(Ht),$=-1;return}else if(St.__webglFramebuffer===void 0)Zt.setupRenderTarget(b);else if(St.__hasExternalTextures)Zt.rebindTextures(b,Yt.get(b.texture).__webglTexture,Yt.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const jt=b.depthTexture;if(St.__boundDepthTexture!==jt){if(jt!==null&&Yt.has(jt)&&(b.width!==jt.image.width||b.height!==jt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Zt.setupDepthRenderbuffer(b)}}const Lt=b.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(Tt=!0);const Bt=Yt.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Bt[U])?V=Bt[U][Z]:V=Bt[U],X=!0):b.samples>0&&Zt.useMultisampledRTT(b)===!1?V=Yt.get(b).__webglMultisampledFramebuffer:Array.isArray(Bt)?V=Bt[Z]:V=Bt,at.copy(b.viewport),Dt.copy(b.scissor),Ht=b.scissorTest}else at.copy(Pt).multiplyScalar(G).floor(),Dt.copy(pt).multiplyScalar(G).floor(),Ht=Xt;if(Z!==0&&(V=q),wt.bindFramebuffer(B.FRAMEBUFFER,V)&&wt.drawBuffers(b,V),wt.viewport(at),wt.scissor(Dt),wt.setScissorTest(Ht),X){const St=Yt.get(b.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+U,St.__webglTexture,Z)}else if(Tt){const St=U;for(let Lt=0;Lt<b.textures.length;Lt++){const Bt=Yt.get(b.textures[Lt]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+Lt,Bt.__webglTexture,Z,St)}}else if(b!==null&&Z!==0){const St=Yt.get(b.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,St.__webglTexture,Z)}$=-1};function uc(b){const U=Yt.get(b);return(U.__readFormat!==b.format||U.__readType!==b.type)&&(U.__readFormat=b.format,U.__readType=b.type,U.__formatReadable=Ae.textureFormatReadable(b.format),U.__typeReadable=Ae.textureTypeReadable(b.type)),U}this.readRenderTargetPixels=function(b,U,Z,V,X,Tt,Ut,St=0){if(!(b&&b.isWebGLRenderTarget)){_e("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=Yt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ut!==void 0&&(Lt=Lt[Ut],Array.isArray(Lt)&&(Lt=Lt[0])),Lt){wt.bindFramebuffer(B.FRAMEBUFFER,Lt);try{const Bt=b.textures[St],jt=Bt.format,fe=Bt.type;b.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+St);const Ft=uc(Bt);if(Ft.__formatReadable===!1){_e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ft.__typeReadable===!1){_e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-V&&Z>=0&&Z<=b.height-X&&B.readPixels(U,Z,V,X,mt.convert(jt),mt.convert(fe),Tt)}finally{const Bt=lt!==null?Yt.get(lt).__webglFramebuffer:null;wt.bindFramebuffer(B.FRAMEBUFFER,Bt)}}},this.readRenderTargetPixelsAsync=async function(b,U,Z,V,X,Tt,Ut,St=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=Yt.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Ut!==void 0&&(Lt=Lt[Ut],Array.isArray(Lt)&&(Lt=Lt[0])),Lt)if(U>=0&&U<=b.width-V&&Z>=0&&Z<=b.height-X){wt.bindFramebuffer(B.FRAMEBUFFER,Lt);const Bt=b.textures[St],jt=Bt.format,fe=Bt.type;b.textures.length>1&&B.readBuffer(B.COLOR_ATTACHMENT0+St);const Ft=uc(Bt);if(Ft.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ft.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const de=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,de),B.bufferData(B.PIXEL_PACK_BUFFER,Tt.byteLength,B.STREAM_READ),B.readPixels(U,Z,V,X,mt.convert(jt),mt.convert(fe),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);const Ge=lt!==null?Yt.get(lt).__webglFramebuffer:null;wt.bindFramebuffer(B.FRAMEBUFFER,Ge);const Pe=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await cf(B,Pe,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,de),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,Tt),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer(de),B.deleteSync(Pe),Tt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,Z=0){const V=Math.pow(2,-Z),X=Math.floor(b.image.width*V),Tt=Math.floor(b.image.height*V),Ut=U!==null?U.x:0,St=U!==null?U.y:0;Zt.setTexture2D(b,0),B.copyTexSubImage2D(B.TEXTURE_2D,Z,0,0,Ut,St,X,Tt),wt.unbindTexture()},this.copyTextureToTexture=function(b,U,Z=null,V=null,X=0,Tt=0){let Ut,St,Lt,Bt,jt,fe,Ft,de,Ge;const Pe=b.isCompressedTexture?b.mipmaps[Tt]:b.image;if(Z!==null)Ut=Z.max.x-Z.min.x,St=Z.max.y-Z.min.y,Lt=Z.isBox3?Z.max.z-Z.min.z:1,Bt=Z.min.x,jt=Z.min.y,fe=Z.isBox3?Z.min.z:0;else{const ge=Math.pow(2,-X);Ut=Math.floor(Pe.width*ge),St=Math.floor(Pe.height*ge),b.isDataArrayTexture?Lt=Pe.depth:b.isData3DTexture?Lt=Math.floor(Pe.depth*ge):Lt=1,Bt=0,jt=0,fe=0}V!==null?(Ft=V.x,de=V.y,Ge=V.z):(Ft=0,de=0,Ge=0);const Re=mt.convert(U.format),tn=mt.convert(U.type);let Ot;U.isData3DTexture?(Zt.setTexture3D(U,0),Ot=B.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Zt.setTexture2DArray(U,0),Ot=B.TEXTURE_2D_ARRAY):(Zt.setTexture2D(U,0),Ot=B.TEXTURE_2D),wt.activeTexture(B.TEXTURE0),wt.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,U.flipY),wt.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),wt.pixelStorei(B.UNPACK_ALIGNMENT,U.unpackAlignment);const an=wt.getParameter(B.UNPACK_ROW_LENGTH),Me=wt.getParameter(B.UNPACK_IMAGE_HEIGHT),Pi=wt.getParameter(B.UNPACK_SKIP_PIXELS),en=wt.getParameter(B.UNPACK_SKIP_ROWS),lr=wt.getParameter(B.UNPACK_SKIP_IMAGES);wt.pixelStorei(B.UNPACK_ROW_LENGTH,Pe.width),wt.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Pe.height),wt.pixelStorei(B.UNPACK_SKIP_PIXELS,Bt),wt.pixelStorei(B.UNPACK_SKIP_ROWS,jt),wt.pixelStorei(B.UNPACK_SKIP_IMAGES,fe);const pi=b.isDataArrayTexture||b.isData3DTexture,Li=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){const ge=Yt.get(b),Je=Yt.get(U),Dn=Yt.get(ge.__renderTarget),Ie=Yt.get(Je.__renderTarget);wt.bindFramebuffer(B.READ_FRAMEBUFFER,Dn.__webglFramebuffer),wt.bindFramebuffer(B.DRAW_FRAMEBUFFER,Ie.__webglFramebuffer);for(let Ze=0;Ze<Lt;Ze++)pi&&(B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Yt.get(b).__webglTexture,X,fe+Ze),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Yt.get(U).__webglTexture,Tt,Ge+Ze)),B.blitFramebuffer(Bt,jt,Bt+Ut,jt+St,Ft,de,Ft+Ut,de+St,B.DEPTH_BUFFER_BIT,B.NEAREST);wt.bindFramebuffer(B.READ_FRAMEBUFFER,null),wt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(X!==0||b.isRenderTargetTexture||Yt.has(b)){const ge=Yt.get(b),Je=Yt.get(U);wt.bindFramebuffer(B.READ_FRAMEBUFFER,D),wt.bindFramebuffer(B.DRAW_FRAMEBUFFER,H);for(let Dn=0;Dn<Lt;Dn++)pi?B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,ge.__webglTexture,X,fe+Dn):B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,ge.__webglTexture,X),Li?B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Je.__webglTexture,Tt,Ge+Dn):B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,Je.__webglTexture,Tt),X!==0?B.blitFramebuffer(Bt,jt,Bt+Ut,jt+St,Ft,de,Ft+Ut,de+St,B.COLOR_BUFFER_BIT,B.NEAREST):Li?B.copyTexSubImage3D(Ot,Tt,Ft,de,Ge+Dn,Bt,jt,Ut,St):B.copyTexSubImage2D(Ot,Tt,Ft,de,Bt,jt,Ut,St);wt.bindFramebuffer(B.READ_FRAMEBUFFER,null),wt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else Li?b.isDataTexture||b.isData3DTexture?B.texSubImage3D(Ot,Tt,Ft,de,Ge,Ut,St,Lt,Re,tn,Pe.data):U.isCompressedArrayTexture?B.compressedTexSubImage3D(Ot,Tt,Ft,de,Ge,Ut,St,Lt,Re,Pe.data):B.texSubImage3D(Ot,Tt,Ft,de,Ge,Ut,St,Lt,Re,tn,Pe):b.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,Tt,Ft,de,Ut,St,Re,tn,Pe.data):b.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,Tt,Ft,de,Pe.width,Pe.height,Re,Pe.data):B.texSubImage2D(B.TEXTURE_2D,Tt,Ft,de,Ut,St,Re,tn,Pe);wt.pixelStorei(B.UNPACK_ROW_LENGTH,an),wt.pixelStorei(B.UNPACK_IMAGE_HEIGHT,Me),wt.pixelStorei(B.UNPACK_SKIP_PIXELS,Pi),wt.pixelStorei(B.UNPACK_SKIP_ROWS,en),wt.pixelStorei(B.UNPACK_SKIP_IMAGES,lr),Tt===0&&U.generateMipmaps===!0&&U.mipmapsAutoUpdate===!0&&B.generateMipmap(Ot),wt.unbindTexture()},this.initRenderTarget=function(b){Yt.get(b).__webglFramebuffer===void 0&&Zt.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Zt.setTextureCube(b,0):b.isData3DTexture?Zt.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Zt.setTexture2DArray(b,0):Zt.setTexture2D(b,0),wt.unbindTexture()},this.resetState=function(){J=0,z=0,lt=null,wt.reset(),vt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=pe._getDrawingBufferColorSpace(t),e.unpackColorSpace=pe._getUnpackColorSpace()}}function O1(n,t=!1){const e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),r={},a={},o=n[0].morphTargetsRelative,l=new Ve;l.morphTargetsRelative=o;let c=0;for(let h=0;h<n.length;++h){const u=n[h];let f=0,d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const g in u.attributes){if(!i.has(g))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+g+'" attribute exists among all geometries, or in none of them.'),null;r[g]===void 0&&(r[g]=[]),r[g].push(u.attributes[g]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const g in u.morphAttributes){if(!s.has(g))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;if(u.morphAttributes[g].length!==n[0].morphAttributes[g].length)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have the same number of morph targets for the "'+g+'" morph attribute.'),null;a[g]===void 0&&(a[g]=[]),a[g].push(u.morphAttributes[g]),d++}if(d!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of morph attributes."),null;if(t){let g;if(e)g=u.index.count;else if(u.attributes.position!==void 0)g=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,g,h),c+=g}}if(e){let h=0;const u=[];for(let f=0;f<n.length;++f){const d=n[f].index;for(let g=0;g<d.count;++g)u.push(d.getX(g)+h);h+=n[f].attributes.position.count}l.setIndex(u)}for(const h in r){const u=w0(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let v=0;v<a[h].length;++v)d.push(a[h][v][f]);const g=w0(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}}return l}function w0(n){let t,e,i,s=-1,r=0;for(let c=0;c<n.length;++c){const h=n[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new Jn(a,e,i);let l=0;for(let c=0;c<n.length;++c){const h=n[c];if(h.isInterleavedBufferAttribute){const u=l/e;for(let f=0,d=h.count;f<d;f++)for(let g=0;g<e;g++){const v=h.getComponent(f,g);o.setComponent(f+u,g,v)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}const Us=new P;function An(n,t,e,i,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Us.copy(t),Us[i]=0,Us.normalize();const c=.5*a/(a+o),h=1-Us.angleTo(n)/l;return Math.sign(Us[e])===1?h*c:o/(a+o)+c+c*(1-h)}class $l extends dn{constructor(t=1,e=1,i=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(t/2,e/2,i/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:i,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new P,c=new P,h=new P(t,e,i).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,d=this.attributes.uv.array,g=u.length/6,v=new P,m=.5/a;for(let p=0,y=0;p<u.length;p+=3,y+=2)switch(l.fromArray(u,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[p+0]=h.x*Math.sign(l.x)+c.x*r,u[p+1]=h.y*Math.sign(l.y)+c.y*r,u[p+2]=h.z*Math.sign(l.z)+c.z*r,f[p+0]=c.x,f[p+1]=c.y,f[p+2]=c.z,Math.floor(p/g)){case 0:v.set(1,0,0),d[y+0]=An(v,c,"z","y",r,i),d[y+1]=1-An(v,c,"y","z",r,e);break;case 1:v.set(-1,0,0),d[y+0]=1-An(v,c,"z","y",r,i),d[y+1]=1-An(v,c,"y","z",r,e);break;case 2:v.set(0,1,0),d[y+0]=1-An(v,c,"x","z",r,t),d[y+1]=An(v,c,"z","x",r,i);break;case 3:v.set(0,-1,0),d[y+0]=1-An(v,c,"x","z",r,t),d[y+1]=1-An(v,c,"z","x",r,i);break;case 4:v.set(0,0,1),d[y+0]=1-An(v,c,"x","y",r,t),d[y+1]=1-An(v,c,"y","x",r,e);break;case 5:v.set(0,0,-1),d[y+0]=An(v,c,"x","y",r,t),d[y+1]=1-An(v,c,"y","x",r,e);break}}static fromJSON(t){return new $l(t.width,t.height,t.depth,t.segments,t.radius)}}const E0=new Map;function ni(n,t){let e=E0.get(n);return e||(e=t(),E0.set(n,e)),e}function Hn(n,t={}){return t.at&&n.position.set(t.at[0],t.at[1],t.at[2]),t.rot&&n.rotation.set(t.rot[0],t.rot[1],t.rot[2]),t.scale&&n.scale.set(t.scale[0],t.scale[1],t.scale[2]),n}function E(n,t,e,i,s={},r=.04){const a=Math.min(r,n/2-.001,t/2-.001,e/2-.001),o=ni(`rbox:${n}:${t}:${e}:${a}`,()=>new $l(n,t,e,3,Math.max(a,.001)));return Hn(new ie(o,i),s)}function Ce(n,t,e,i,s={}){const r=ni(`box:${n}:${t}:${e}`,()=>new dn(n,t,e));return Hn(new ie(r,i),s)}function Y(n,t,e,i,s={},r=24){const a=ni(`cyl:${n}:${t}:${e}:${r}`,()=>new rr(n,t,e,r));return Hn(new ie(a,i),s)}function F(n,t,e={},i=24){const s=ni(`sph:${n}:${i}`,()=>new bs(n,i,Math.max(8,Math.round(i*.66))));return Hn(new ie(s,t),e)}function ys(n,t,e,i,s={},r=24){const a=ni(`sphc:${n}:${e}:${i}:${r}`,()=>new bs(n,r,16,0,Math.PI*2,e,i));return Hn(new ie(a,t),s)}function Te(n,t,e,i={},s=24){const r=ni(`cone:${n}:${t}:${s}`,()=>new Ol(n,t,s));return Hn(new ie(r,e),i)}function $t(n,t,e,i={},s=Math.PI*2){const r=ni(`tor:${n}:${t}:${s}`,()=>new Vl(n,t,12,32,s));return Hn(new ie(r,e),i)}function Pn(n,t,e,i={}){const s=ni(`cap:${n}:${t}`,()=>new Fl(n,t,6,16));return Hn(new ie(s,e),i)}function ve(n,t,e={},i=32){const s=`lathe:${i}:${n.map(a=>a.join(",")).join(";")}`,r=ni(s,()=>new Gl(n.map(([a,o])=>new ot(a,o)),i));return Hn(new ie(r,t),e)}function Oe(n,t,e,i={},s=.01){const r=`ext:${t}:${s}:${n.map(o=>o.join(",")).join(";")}`,a=ni(r,()=>{const o=new wh(n.map(([c,h])=>new ot(c,h)));return new kl(o,{depth:t,bevelEnabled:s>0,bevelSize:s,bevelThickness:s,bevelSegments:2})});return Hn(new ie(a,e),i)}function $h(n=1){const t=[];for(let e=0;e<=40;e++){const i=e/40*Math.PI*2,s=16*Math.pow(Math.sin(i),3),r=13*Math.cos(i)-5*Math.cos(2*i)-2*Math.cos(3*i)-Math.cos(4*i);t.push([s/34*n,r/34*n])}return t}function Ei(n,t,e=5){const i=[];for(let s=0;s<e*2;s++){const r=s/(e*2)*Math.PI*2+Math.PI/2,a=s%2===0?n:t;i.push([Math.cos(r)*a,Math.sin(r)*a])}return i}function st(n,t={}){const e=new On;for(const i of n)e.add(i);return Hn(e,t)}function Fr(n,t,e,i,s,r=.06){const a=n/2-r,o=t/2-r;return[Y(i,i*.8,e,s,{at:[a,e/2,o]},12),Y(i,i*.8,e,s,{at:[-a,e/2,o]},12),Y(i,i*.8,e,s,{at:[a,e/2,-o]},12),Y(i,i*.8,e,s,{at:[-a,e/2,-o]},12)]}const Be=Math.PI,Qe=Math.PI/2,B1=new P(0,1,0),Fn={dark:"#2e2a2b",iron:"#3a3533",wood:"#9a6a44",woodDark:"#6e4a30",white:"#f6f2ea",chrome:"#cfd5dc",gold:"#e2b54a",bulb:"#fff1c4",flame:"#ffa53a",flameCore:"#ffe58a",sky:"#a9dcff"},me=n=>({dark:n.fixed(Fn.dark,{roughness:.6}),iron:n.fixed(Fn.iron,{roughness:.5,metalness:.4}),wood:n.fixed(Fn.wood,{roughness:.75}),woodDark:n.fixed(Fn.woodDark,{roughness:.75}),white:n.fixed(Fn.white,{roughness:.85}),chrome:n.fixed(Fn.chrome,{metalness:.85,roughness:.25}),gold:n.fixed(Fn.gold,{metalness:.7,roughness:.3}),bulb:n.fixed(Fn.bulb,{emissive:!0}),flame:n.fixed(Fn.flame,{emissive:!0}),flameCore:n.fixed(Fn.flameCore,{emissive:!0}),sky:n.fixed(Fn.sky,{emissive:!0,roughness:.2}),acrylic:n.fixed("#ffffff",{opacity:.22,roughness:.1})});function xn(n,t,e,i,s=12){const r=new P(t[0]-n[0],t[1]-n[1],t[2]-n[2]),a=r.length(),o=Y(e,e,a,i,{at:[(n[0]+t[0])/2,(n[1]+t[1])/2,(n[2]+t[2])/2]},s);return o.quaternion.setFromUnitVectors(B1,r.normalize()),o}function Or(n,t,e,i=!1,s=64){const r=new vh(n.map(a=>new P(a[0],a[1],a[2])),i,"centripetal");return new ie(new Wl(r,s,t,10,i),e)}function Xn(n){const t=new Map;for(const i of n){i.updateMatrix();const s=i.geometry.index?i.geometry.toNonIndexed():i.geometry.clone();s.applyMatrix4(i.matrix);for(const o of Object.keys(s.attributes))o!=="position"&&o!=="normal"&&o!=="uv"&&s.deleteAttribute(o);s.clearGroups();const r=i.material,a=t.get(r);a?a.push(s):t.set(r,[s])}const e=[];for(const[i,s]of t){const r=O1(s);r&&e.push(new ie(r,i));for(const a of s)a.dispose()}return e}function no(n){const t=new En().setFromObject(n,!0);return n.position.x-=(t.min.x+t.max.x)/2,n.position.z-=(t.min.z+t.max.z)/2,st([n])}function z1(n){let t=n>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Oi(n,t){return n[(t%n.length+n.length)%n.length]}function Cn(n,t,e,i,s=32){return Y(n,n,t,e,{at:i,rot:[Qe,0,0]},s)}const io=[];function k1(n,t,e){if(io.length===0){const i=new bs(n,16,12).toNonIndexed(),s=i.getAttribute("position"),r=[[],[],[]];for(let a=0;a<s.count/3;a++){let o=0,l=0,c=0;for(let v=0;v<3;v++)o+=s.getX(a*3+v),l+=s.getY(a*3+v),c+=s.getZ(a*3+v);const h=Math.hypot(o,l,c)||1,u=Math.floor((Math.atan2(c,o)+Be)/(2*Be)*16),f=Math.floor(Math.acos(l/h)/Be*12),d=(Math.imul(u*31+f*17+7,2654435761)>>>0)%9===0?2:(u+f)%2,g=r[d];for(let v=0;v<3;v++)g.push(s.getX(a*3+v),s.getY(a*3+v),s.getZ(a*3+v))}i.dispose();for(const a of r){const o=new Ve;o.setAttribute("position",new le(a,3)),o.computeVertexNormals(),io.push(o)}}return io.map((i,s)=>{const r=new ie(i,t[s]);return r.position.set(e[0],e[1],e[2]),r})}function G1(n){const t=new En().setFromObject(n,!0);return n.position.x-=(t.min.x+t.max.x)/2,n.position.y-=t.min.y,n.position.z-=(t.min.z+t.max.z)/2,st([n])}function Br(n,t,e,i,s,r,a,o,l){let c=i,h=.25;for(;;){const u=.035+t()*.035;if(c+u>s)break;const f=Math.min(a,.19+t()*.11),d=.2+t()*.04;n.push(E(u,f,d,Oi(e,Math.floor(t()*97)),{at:[c+u/2,r+f/2,o]},.008)),c+=u+.004,h=f}if(l){const f=Math.min(a-.02,h),d=.32,g=c+.045/2*Math.cos(d)+f/2*Math.sin(d),v=r+f/2*Math.cos(d)+.045/2*Math.sin(d);n.push(E(.045,f,.21,Oi(e,Math.floor(t()*97)),{at:[g,v,o],rot:[0,0,d]},.008))}}function so(n,t,e,i,s){const o=n/2,l=n*1.18,c=[E(n+.01,.06,.025,e,{at:[0,o-.06/2,o]},.01),E(n+.01,.06,.025,e,{at:[0,-o+.06/2,o]},.01),E(.06,n,.025,e,{at:[-o+.06/2,0,o]},.01),E(.06,n,.025,e,{at:[o-.06/2,0,o]},.01),E(l,.06,.025,e,{at:[0,0,o],rot:[0,0,Be/4]},.01),E(.025,.06,n+.01,e,{at:[o,o-.06/2,0]},.01),E(.025,.06,n+.01,e,{at:[o,-o+.06/2,0]},.01),E(.025,n,.06,e,{at:[o,0,o-.06/2]},.01),E(.025,n,.06,e,{at:[o,0,-o+.06/2]},.01),E(.025,.06,l,e,{at:[o,0,0],rot:[-Be/4,0,0]},.01),E(.025,.06,n+.01,e,{at:[-o,o-.06/2,0]},.01),E(.025,.06,n+.01,e,{at:[-o,-o+.06/2,0]},.01),E(.025,n,.06,e,{at:[-o,0,o-.06/2]},.01),E(.025,n,.06,e,{at:[-o,0,-o+.06/2]},.01),E(.025,.06,l,e,{at:[-o,0,0],rot:[Be/4,0,0]},.01)];return st([E(n-.02,n,n-.02,t,{},.02),...Xn(c)],{at:i,rot:[0,s,0]})}const T0=[[-.72,0],[.72,0],[.72,.35],[.66,.55],[.5,.72],[.34,.9],[.26,1.1],[.2,1.32],[.08,1.5],[-.12,1.6],[-.38,1.62],[-.6,1.55],[-.72,1.38]];function H1(n,t,e,i){const s=[];for(let r=0;r<n.length;r++){const a=Oi(n,r),o=Oi(n,r+1);s.push(xn([a[0],a[1],e],[o[0],o[1],e],t,i)),s.push(F(t,i,{at:[a[0],a[1],e]},12))}return Xn(s)}function A0(n,t,e){const i=n/2-.05,s=t/2-.05;return[E(n,t,.02,e.acrylic,{at:[0,0,.01]},.008),...[-1,1].flatMap(r=>[-1,1].map(a=>Cn(.015,.03,e.chrome,[r*i,a*s,.035],12)))]}const V1=[{id:"sofa",name:"Sofa",category:"furniture",placement:"floor",tags:["cozy","modern"],size:{w:2,h:.86,d:.9},defaultColors:{primary:"#3f7f8c",secondary:"#f2c879"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n),s=[...Fr(1.8,.8,.1,.035,i.dark,.08),E(1.8,.22,.82,t,{at:[0,.21,.02]},.06),E(.2,.56,.9,t,{at:[-.9,.38,0]},.09),E(.2,.56,.9,t,{at:[.9,.38,0]},.09),E(1.62,.75,.22,t,{at:[0,.475,-.34]},.09)];for(const r of[-.54,0,.54])s.push(E(.53,.15,.62,e,{at:[r,.395,.1]},.06)),s.push(E(.52,.4,.15,e,{at:[r,.66,-.17],rot:[-.15,0,0]},.07));return st(s)}},{id:"armchair",name:"Armchair",category:"furniture",placement:"floor",tags:["cozy","retro"],size:{w:.96,h:.9,d:.83},defaultColors:{primary:"#d9934a",secondary:"#f3e3c3"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n);return st([...Fr(.78,.7,.14,.035,i.wood,.06),E(.84,.22,.78,t,{at:[0,.25,.02]},.08),E(.16,.46,.8,t,{at:[-.4,.37,.01]},.08),E(.16,.46,.8,t,{at:[.4,.37,.01]},.08),E(.8,.62,.18,t,{at:[0,.59,-.33]},.09),E(.62,.13,.62,e,{at:[0,.425,.08]},.06),E(.6,.42,.14,e,{at:[0,.68,-.19],rot:[-.12,0,0]},.07),F(.025,i.gold,{at:[0,.69,-.11]},12)])}},{id:"bed",name:"Bed",category:"furniture",placement:"floor",tags:["bedroom","cozy"],size:{w:1.58,h:1,d:2.18},defaultColors:{primary:"#8c6a9e",secondary:"#9fd0e0"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n);return st([...Fr(1.5,2,.1,.04,i.dark,.08),E(1.5,.26,2,t,{at:[0,.23,0]},.05),E(1.4,.2,1.9,i.white,{at:[0,.45,.02]},.06),E(1.48,.2,1.32,e,{at:[0,.5,.33]},.07),E(1.47,.07,.16,i.white,{at:[0,.58,-.3]},.03),E(.58,.14,.36,i.white,{at:[-.34,.62,-.7]},.07),E(.58,.14,.36,i.white,{at:[.34,.62,-.7]},.07),E(1.58,1,.12,t,{at:[0,.5,-1.04]},.06),E(1.3,.48,.06,e,{at:[0,.72,-.96]},.03),E(1.58,.52,.1,t,{at:[0,.26,1.03]},.05)])}},{id:"canopy_bed",name:"Canopy Bed",category:"furniture",placement:"floor",tags:["royal","bedroom","fantasy","luxury"],size:{w:1.8,h:2.35,d:2.23},defaultColors:{primary:"#6d3b52",secondary:"#d8b4e2"},slots:2,price:150,build(n){const t=n.primary,e=n.secondary,i=me(n),s=.82,r=1.04,a=[E(1.56,.3,2,t,{at:[0,.2,0]},.05),E(1.46,.2,1.9,i.white,{at:[0,.45,.02]},.06),E(1.52,.2,1.3,e,{at:[0,.5,.33]},.07),E(.56,.14,.34,i.white,{at:[-.33,.62,-.7]},.07),E(.56,.14,.34,i.white,{at:[.33,.62,-.7]},.07),E(1.56,.9,.1,t,{at:[0,.75,-.98]},.05),E(1.72,.08,.08,t,{at:[0,2.16,r]},.03),E(1.72,.08,.08,t,{at:[0,2.16,-r]},.03),E(.08,.08,2.16,t,{at:[s,2.16,0]},.03),E(.08,.08,2.16,t,{at:[-s,2.16,0]},.03),E(1.66,.03,2.1,e,{at:[0,2.21,0]},.01),E(1.76,.22,.04,e,{at:[0,2.06,r+.06]},.015),E(.04,.22,2.2,e,{at:[s+.06,2.06,0]},.015),E(.04,.22,2.2,e,{at:[-s-.06,2.06,0]},.015)];for(const o of[-1,1])for(const l of[-1,1]){a.push(Y(.06,.06,2.2,t,{at:[o*s,1.1,l*r]},16)),a.push(F(.075,i.gold,{at:[o*s,2.27,l*r]},16));const c=l>0,h=c?o*(s-.19):o*(s+.02),u=c?r+.02:l*(r-.19),f=c?[1,1,.3]:[.3,1,1];a.push(Y(.18,.06,1,e,{at:[h,1.45,u],scale:f},16)),a.push(Y(.06,.19,.75,e,{at:[h,.575,u],scale:f},16)),a.push(F(.07,i.gold,{at:[h,.95,u],scale:c?[1.2,.7,.6]:[.6,.7,1.2]},12))}return st(a)}},{id:"coffee_table",name:"Coffee Table",category:"furniture",placement:"floor",tags:["modern","cozy"],size:{w:1.1,h:.42,d:.6},surfaceHeight:.42,defaultColors:{primary:"#c8946a",secondary:"#c9a45c"},slots:1,price:0,build(n){const t=n.primary,e=n.secondary;return st([E(1.1,.07,.6,t,{at:[0,.385,0]},.03),E(.94,.04,.44,t,{at:[0,.12,0]},.015),...Fr(1.04,.54,.35,.028,e,.06)])}},{id:"dining_table",name:"Dining Table",category:"furniture",placement:"floor",tags:["kitchen","cafe","rustic"],size:{w:1.6,h:.76,d:.9},surfaceHeight:.76,defaultColors:{primary:"#b5835a",secondary:"#6e4a30"},slots:1,price:0,build(n){const t=n.primary,e=n.secondary,i=[];for(const s of[-.3,0,.3])i.push(E(1.6,.08,.296,t,{at:[0,.72,s]},.02));for(const s of[-.7,.7])for(const r of[-.36,.36])i.push(E(.09,.68,.09,e,{at:[s,.34,r]},.02));return i.push(E(1.36,.1,.04,e,{at:[0,.63,.37]},.015)),i.push(E(1.36,.1,.04,e,{at:[0,.63,-.37]},.015)),i.push(E(.04,.1,.66,e,{at:[.71,.63,0]},.015)),i.push(E(.04,.1,.66,e,{at:[-.71,.63,0]},.015)),st(i)}},{id:"desk",name:"Desk",category:"furniture",placement:"floor",tags:["office","science"],size:{w:1.3,h:.76,d:.67},surfaceHeight:.76,defaultColors:{primary:"#c8a27a",secondary:"#5c8c7a"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n),s=[E(1.3,.06,.65,t,{at:[0,.73,0]},.025),E(.44,.7,.6,t,{at:[.41,.35,0]},.03),E(.06,.7,.06,t,{at:[-.6,.35,.27]},.02),E(.06,.7,.06,t,{at:[-.6,.35,-.27]},.02),E(.74,.34,.03,t,{at:[-.18,.52,-.27]},.012)];for(const r of[.57,.36,.15])s.push(E(.38,.18,.03,e,{at:[.41,r,.305]},.02)),s.push(F(.022,i.gold,{at:[.41,r,.33]},12));return st(s)}},{id:"chair",name:"Chair",category:"furniture",placement:"floor",tags:["office","cafe","modern"],size:{w:.46,h:.91,d:.47},defaultColors:{primary:"#e07a5f",secondary:"#f4e9d8"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=[E(.46,.06,.46,t,{at:[0,.43,0]},.025),E(.4,.05,.4,e,{at:[0,.475,.01]},.022),E(.05,.48,.05,t,{at:[-.19,.67,-.205]},.02),E(.05,.48,.05,t,{at:[.19,.67,-.205]},.02),E(.46,.24,.06,t,{at:[0,.79,-.205]},.028)];for(const s of[-.19,.19])for(const r of[-.19,.19])i.push(Y(.025,.02,.4,t,{at:[s,.2,r]},12));return st(i)}},{id:"stool",name:"Bar Stool",category:"furniture",placement:"floor",tags:["cafe","retro","kitchen"],size:{w:.44,h:.75,d:.44},surfaceHeight:.75,defaultColors:{primary:"#d64550",secondary:"#f4e9d8"},slots:1,price:0,build(n){const t=n.primary,e=me(n);return st([Y(.17,.19,.04,e.chrome,{at:[0,.02,0]},24),Y(.035,.035,.62,e.chrome,{at:[0,.35,0]},16),$t(.15,.018,e.chrome,{at:[0,.28,0],rot:[Qe,0,0]}),E(.3,.025,.025,e.chrome,{at:[0,.28,0]},.01),E(.025,.025,.3,e.chrome,{at:[0,.28,0]},.01),Y(.07,.05,.04,e.chrome,{at:[0,.66,0]},16),Y(.2,.2,.09,t,{at:[0,.705,0]},32),$t(.2,.022,e.chrome,{at:[0,.68,0],rot:[Qe,0,0]})])}},{id:"bookshelf",name:"Bookshelf",category:"furniture",placement:"floor",tags:["cozy","office","magic"],size:{w:.9,h:1.8,d:.35},surfaceHeight:1.8,defaultColors:{primary:"#8a5a3c",secondary:"#e8d6b0"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=["#c0392b","#2e86ab","#f4a259","#5b8e7d","#8e5572","#f2d0a4","#3d405b"].map(c=>n.fixed(c,{roughness:.8})),s=[E(.06,1.8,.35,t,{at:[-.42,.9,0]},.02),E(.06,1.8,.35,t,{at:[.42,.9,0]},.02),E(.8,.06,.33,t,{at:[0,1.77,0]},.015),E(.8,.06,.33,t,{at:[0,.07,0]},.015),E(.8,.04,.3,t,{at:[0,.02,-.01]},.01),E(.8,1.72,.03,e,{at:[0,.9,-.155]},.01)],r=[.52,.94,1.36];for(const c of r)s.push(E(.8,.05,.33,t,{at:[0,c,0]},.015));const a=z1(7),o=[],l=.01;Br(o,a,i,-.38,.3,.1,.36,l,!0),Br(o,a,i,-.38,-.05,.545,.33,l,!0);for(let c=0;c<3;c++)o.push(E(.24-c*.02,.045,.19-c*.01,Oi(i,c+2),{at:[.22,.545+.0225+c*.045,l],rot:[0,.12*(c-1),0]},.01));return Br(o,a,i,-.38,.38,.965,.33,l,!1),Br(o,a,i,.02,.38,1.385,.32,l,!1),st([...s,...Xn(o)])}},{id:"dresser",name:"Dresser",category:"furniture",placement:"floor",tags:["bedroom","retro"],size:{w:1.04,h:.85,d:.57},surfaceHeight:.85,defaultColors:{primary:"#7fb7a4",secondary:"#f4ead5"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n),s=[E(1,.72,.5,t,{at:[0,.46,0]},.04),E(1.04,.04,.53,t,{at:[0,.83,0]},.015),E(.44,.17,.03,e,{at:[-.235,.71,.255]},.02),E(.44,.17,.03,e,{at:[.235,.71,.255]},.02),E(.92,.19,.03,e,{at:[0,.5,.255]},.02),E(.92,.19,.03,e,{at:[0,.27,.255]},.02)];for(const a of[-.42,.42])for(const o of[-.18,.18])s.push(Y(.03,.02,.1,i.woodDark,{at:[a,.05,o]},12));const r=[[-.235,.71,.28],[.235,.71,.28],[-.25,.5,.28],[.25,.5,.28],[-.25,.27,.28],[.25,.27,.28]];for(const a of r)s.push(F(.025,i.gold,{at:a},12));return st(s)}},{id:"counter",name:"Kitchen Counter",category:"furniture",placement:"floor",tags:["kitchen","cafe"],size:{w:1.22,h:.92,d:.64},surfaceHeight:.92,defaultColors:{primary:"#86b6d9",secondary:"#f1ede4"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n),s=[E(1.12,.08,.5,i.dark,{at:[0,.04,-.03]},.01),E(1.18,.82,.56,t,{at:[0,.49,-.02]},.02),E(1.22,.05,.64,e,{at:[0,.895,0]},.015)];for(const r of[-.29,.29])s.push(E(.54,.14,.03,t,{at:[r,.77,.275]},.015)),s.push(E(.54,.54,.03,t,{at:[r,.39,.275]},.015)),s.push(E(.14,.025,.025,i.chrome,{at:[r,.77,.3]},.01));return s.push(E(.025,.16,.025,i.chrome,{at:[-.06,.52,.3]},.01)),s.push(E(.025,.16,.025,i.chrome,{at:[.06,.52,.3]},.01)),st(s)}},{id:"stove",name:"Stove",category:"furniture",placement:"floor",tags:["kitchen","food"],size:{w:.76,h:1.08,d:.69},surfaceHeight:.92,defaultColors:{primary:"#efe6d2",secondary:"#2b2b2e"},slots:1,price:60,build(n){const t=n.primary,e=me(n),i=n.fixed("#1b1b1d",{roughness:.5}),s=n.fixed("#55504c",{roughness:.4,metalness:.5}),r=n.fixed("#2a2230",{roughness:.15}),a=[E(.76,.86,.62,t,{at:[0,.47,0]},.04),E(.72,.02,.58,e.dark,{at:[0,.9,0]},.008),E(.76,.18,.08,t,{at:[0,.99,-.27]},.03),E(.68,.1,.03,e.dark,{at:[0,.8,.31]},.015),E(.66,.44,.03,t,{at:[0,.43,.32]},.02),E(.44,.2,.02,r,{at:[0,.45,.335]},.008),E(.66,.1,.03,t,{at:[0,.12,.32]},.015),E(.16,.025,.025,e.chrome,{at:[0,.12,.345]},.01),xn([-.25,.6,.36],[.25,.6,.36],.015,e.chrome),E(.025,.025,.04,e.chrome,{at:[-.22,.6,.34]},.008),E(.025,.025,.04,e.chrome,{at:[.22,.6,.34]},.008)];for(const o of[-.25,-.09,.09,.25])a.push(Cn(.03,.03,e.chrome,[o,.8,.34],16));for(const o of[-.17,.17])for(const l of[-.14,.14])a.push(Y(.085,.085,.02,i,{at:[o,.92,l]},24)),a.push($t(.05,.012,s,{at:[o,.932,l],rot:[Qe,0,0]}));for(const o of[-.32,.32])for(const l of[-.25,.25])a.push(Y(.03,.03,.04,e.dark,{at:[o,.02,l]},12));return no(st(a))}},{id:"fridge",name:"Retro Fridge",category:"furniture",placement:"floor",tags:["kitchen","retro"],size:{w:.74,h:1.68,d:.75},defaultColors:{primary:"#a8dcc8",secondary:"#f4ead5"},slots:1,price:60,build(n){const t=n.primary,e=me(n),i=[E(.74,1.62,.66,t,{at:[0,.87,0]},.14),E(.68,.44,.04,t,{at:[0,1.42,.34]},.06),E(.68,1.06,.04,t,{at:[0,.64,.34]},.06),Pn(.022,.14,e.chrome,{at:[.26,1.34,.4]}),Pn(.022,.3,e.chrome,{at:[.26,.95,.4]}),E(.16,.05,.02,e.chrome,{at:[0,1.08,.365]},.008)];for(const s of[1.28,1.4])i.push(E(.03,.03,.05,e.chrome,{at:[.26,s,.375]},.008));for(const s of[.85,1.05])i.push(E(.03,.03,.05,e.chrome,{at:[.26,s,.375]},.008));for(const s of[-.28,.28])for(const r of[-.24,.24])i.push(Y(.03,.035,.06,e.dark,{at:[s,.03,r]},12));return no(st(i))}},{id:"throne",name:"Throne",category:"furniture",placement:"floor",tags:["royal","luxury","fantasy"],size:{w:1,h:2.19,d:.82},defaultColors:{primary:"#9b2335",secondary:"#e3b341"},slots:2,price:200,build(n){const t=n.primary,e=n.secondary,i=n.fixed("#ff3b5c",{roughness:.15,metalness:.2}),s=[E(.84,.36,.7,e,{at:[0,.3,.02]},.04),E(.66,.24,.03,t,{at:[0,.3,.375]},.012),E(.68,.12,.6,t,{at:[0,.53,.05]},.05),E(.12,.3,.66,e,{at:[-.42,.62,.03]},.04),E(.12,.3,.66,e,{at:[.42,.62,.03]},.04),E(.14,.06,.62,t,{at:[-.42,.79,.02]},.025),E(.14,.06,.62,t,{at:[.42,.79,.02]},.025),F(.08,e,{at:[-.42,.72,.36]},16),F(.08,e,{at:[.42,.72,.36]},16),E(.9,1.45,.14,e,{at:[0,1.18,-.29]},.05),E(.66,1.12,.05,t,{at:[0,1.12,-.2]},.05),F(.09,e,{at:[0,1.98,-.29]},16),Te(.05,.14,e,{at:[0,2.12,-.29]},16),F(.07,e,{at:[-.42,1.95,-.29]},16),F(.07,e,{at:[.42,1.95,-.29]},16),F(.06,i,{at:[0,1.79,-.21],scale:[1,1.2,.6]},16)];for(const r of[-.38,.38])for(const a of[-.28,.32])s.push(F(.065,e,{at:[r,.065,a]},12));return st(s)}},{id:"bathtub",name:"Clawfoot Tub",category:"furniture",placement:"floor",tags:["luxury","glam"],size:{w:1.62,h:.83,d:.77},defaultColors:{primary:"#f2b8c6",secondary:"#e2b54a"},slots:1,price:120,build(n){const t=n.primary,e=n.secondary,i=me(n),s=n.fixed("#9fd8ef",{opacity:.85,roughness:.1}),r=n.fixed("#ffd23f",{roughness:.5}),a=n.fixed("#ff8c42",{roughness:.5}),o=2.1,l=[Y(.36,.31,.42,t,{at:[0,.36,0],scale:[o,1,1]},40),$t(.345,.04,t,{at:[0,.57,0],rot:[Qe,0,0],scale:[o,1,1]}),Y(.33,.33,.02,s,{at:[0,.565,0],scale:[o,1,1]},40),xn([-.68,.5,0],[-.68,.8,0],.025,i.chrome),xn([-.68,.8,0],[-.55,.76,0],.022,i.chrome),F(.035,i.chrome,{at:[-.68,.66,.08]},12),F(.035,i.chrome,{at:[-.68,.66,-.08]},12),F(.06,i.white,{at:[.35,.58,.08],scale:[1,.7,1]},16),F(.045,i.white,{at:[.45,.585,-.06],scale:[1,.7,1]},16),F(.05,i.white,{at:[.25,.58,-.1],scale:[1,.7,1]},16),F(.06,r,{at:[-.12,.6,.05],scale:[1.2,.8,1]},16),F(.04,r,{at:[-.07,.67,.05]},16),Te(.018,.04,a,{at:[-.03,.665,.05],rot:[0,0,-Qe]},12)];for(const c of[-.5,.5])for(const h of[-.2,.2])l.push(Y(.035,.05,.12,e,{at:[c,.13,h]},12)),l.push(F(.055,e,{at:[c,.055,h]},12));return st(l)}},{id:"piano",name:"Grand Piano",category:"furniture",placement:"floor",tags:["music","luxury","glam"],size:{w:1.48,h:1.81,d:1.91},defaultColors:{primary:"#1f1d24",secondary:"#e2b54a"},slots:1,price:180,build(n){const t=n.primary,e=n.secondary,i=me(n),s=n.fixed("#151515",{roughness:.4}),r=.62,a=st([Oe(T0,.02,t,{at:[.72,0,0],rot:[-Qe,0,0]},.01)],{at:[-.72,.95,0],rot:[0,0,r]}),o=.3,l=.95+(o+.72)*Math.tan(r)-.02,c=[],h=1.3/21;for(let f=0;f<20;f++)[0,1,3,4,5].includes(f%7)&&c.push(E(.032,.03,.1,s,{at:[-.65+(f+1)*h,.81,.15]},.006));const u=[Oe(T0,.3,t,{at:[0,.62,0],rot:[-Qe,0,0]},.02),E(1.46,.1,.28,t,{at:[0,.72,.13]},.03),E(1.3,.035,.17,i.white,{at:[0,.785,.17]},.008),...Xn(c),E(.08,.14,.28,t,{at:[-.69,.79,.13]},.03),E(.08,.14,.28,t,{at:[.69,.79,.13]},.03),E(.6,.2,.03,t,{at:[0,1.04,-.06],rot:[-.25,0,0]},.012),a,xn([o,.94,-.5],[o,l,-.5],.015,t),Y(.06,.045,.62,t,{at:[-.6,.31,-.12]},16),Y(.06,.045,.62,t,{at:[.6,.31,-.12]},16),Y(.06,.045,.62,t,{at:[-.4,.31,-1.4]},16),E(.14,.5,.05,t,{at:[0,.35,-.1]},.02),E(.04,.025,.09,e,{at:[-.04,.05,-.04]},.008),E(.04,.025,.09,e,{at:[.04,.05,-.04]},.008)];return no(st(u))}},{id:"arcade",name:"Arcade Cabinet",category:"furniture",placement:"floor",tags:["games","retro","neon"],size:{w:.69,h:1.75,d:.68},defaultColors:{primary:"#2b2d6e",secondary:"#ff5fa2"},slots:2,light:{color:"#64f0ff",intensity:1.5,distance:2.5,offset:[0,1.3,.4]},price:150,build(n){const t=n.primary,e=n.secondary,i=n.fixed("#26232e",{roughness:.6}),s=n.fixed("#141218",{roughness:.4}),r=n.fixed("#64f0ff",{emissive:!0}),a=n.fixed("#ffe066",{emissive:!0}),o=n.fixed("#ff9f1c",{emissive:!0}),l=[E(.64,.95,.62,t,{at:[0,.475,-.02]},.03),E(.64,.78,.46,t,{at:[0,1.36,-.1]},.03),E(.03,.95,.64,e,{at:[-.33,.475,-.02]},.012),E(.03,.95,.64,e,{at:[.33,.475,-.02]},.012),E(.03,.78,.48,e,{at:[-.33,1.36,-.1]},.012),E(.03,.78,.48,e,{at:[.33,1.36,-.1]},.012),E(.64,.08,.32,i,{at:[0,.98,.17]},.02),E(.58,.5,.04,s,{at:[0,1.3,.13],rot:[-.15,0,0]},.02),E(.5,.4,.02,r,{at:[0,1.3,.155],rot:[-.15,0,0]},.008),E(.64,.18,.08,e,{at:[0,1.66,.12]},.02),E(.54,.1,.02,a,{at:[0,1.66,.165]},.008),E(.2,.22,.02,i,{at:[0,.55,.3]},.008),E(.03,.06,.012,o,{at:[-.05,.58,.312]},.004),E(.03,.06,.012,o,{at:[.05,.58,.312]},.004),Y(.015,.015,.08,me(n).dark,{at:[-.14,1.06,.18]},8),F(.035,n.fixed("#e63946",{roughness:.3}),{at:[-.14,1.1,.18]},16)];return["#ffd166","#06d6a0","#ef476f"].forEach((h,u)=>l.push(Y(.025,.025,.02,n.fixed(h,{roughness:.3}),{at:[.03+u*.075,1.03,.18]},16))),st(l)}},{id:"beanbag",name:"Beanbag",category:"furniture",placement:"floor",tags:["cute","games","cozy"],size:{w:.9,h:.67,d:1},defaultColors:{primary:"#ff8fab",secondary:"#fff0f3"},slots:1,price:40,build(n){const t=n.primary,e=n.secondary;return G1(st([ve([[0,0],[.3,.01],[.42,.08],[.45,.2],[.4,.34],[.3,.46],[.17,.55],[0,.58]],t,{at:[0,.1,-.1],rot:[-.35,0,0],scale:[1,1,.9]},40),F(.4,t,{at:[0,.17,.08],scale:[1.1,.42,.9]},36),E(.09,.06,.03,e,{at:[.24,.2,.39],rot:[.3,.45,0]},.01)]))}},{id:"hammock",name:"Hammock",category:"furniture",placement:"floor",tags:["beach","tropical"],size:{w:2.6,h:1.5,d:.84},defaultColors:{primary:"#f28c5b",secondary:"#f7e3b0"},slots:2,price:90,build(n){const t=n.primary,e=n.secondary,i=me(n),s=n.fixed("#d9c49a",{roughness:.9}),r=o=>.5+.3*(o/.8)**2,a=[];for(const o of[-1,1]){a.push(E(.16,.08,.8,i.wood,{at:[o*1.22,.04,0]},.03)),a.push(Y(.06,.07,1.35,i.wood,{at:[o*1.22,.755,0]},16)),a.push(F(.07,i.wood,{at:[o*1.22,1.43,0]},16)),a.push(E(.05,.05,.84,i.wood,{at:[o*.92,r(.92),0]},.02));for(const l of[-.38,0,.38])a.push(xn([o*.92,r(.92),l],[o*1.2,1.36,0],.012,s,8))}a.push(E(2.44,.06,.1,i.wood,{at:[0,.03,0]},.02));for(let o=0;o<9;o++){const l=-.8+o*.2;a.push(E(.215,.03,.78,o%2?e:t,{at:[l,r(l),0],rot:[0,0,Math.atan(.9375*l)]},.012))}for(const o of[-.39,.39]){const l=[];for(let c=0;c<=10;c++){const h=-.9+c*.18;l.push([h,r(h)+.01,o])}a.push(Or(l,.018,s,!1,32))}return a.push(E(.28,.1,.46,i.white,{at:[-.62,.74,0],rot:[0,0,-.5]},.05)),st(a)}},{id:"vanity",name:"Vanity Table",category:"furniture",placement:"floor",tags:["glam","bedroom"],size:{w:1,h:1.46,d:.45},surfaceHeight:.76,defaultColors:{primary:"#f5d0dc",secondary:"#e2b54a"},slots:2,light:{color:"#fff1c9",intensity:1.2,distance:2.5,offset:[0,1.14,0]},price:120,build(n){const t=n.primary,e=n.secondary,i=me(n),s=n.fixed("#dfe8ee",{metalness:.9,roughness:.08}),r=1.14,a=-.17,o=[E(1,.05,.45,t,{at:[0,.735,0]},.02),E(.9,.12,.4,t,{at:[0,.65,0]},.02),E(.4,.08,.02,e,{at:[0,.65,.205]},.008),F(.02,i.gold,{at:[0,.65,.22]},12),E(.1,.12,.06,t,{at:[0,.82,a]},.02),$t(.28,.035,e,{at:[0,r,a]}),Cn(.28,.02,s,[0,r,a])];for(const c of[-.44,.44])for(const h of[-.17,.17])o.push(Y(.03,.02,.71,t,{at:[c,.355,h]},12));const l=[];for(let c=0;c<9;c++){const h=(-35+c*31.25)*(Be/180);l.push(F(.03,i.bulb,{at:[Math.cos(h)*.28,r+Math.sin(h)*.28,a+.035]},12))}return st([...o,...Xn(l)])}},{id:"fireplace",name:"Fireplace",category:"furniture",placement:"floor",tags:["cozy","winter","rustic"],size:{w:1.56,h:1.14,d:.53},surfaceHeight:1.14,defaultColors:{primary:"#b86a4b",secondary:"#6e4a30"},slots:2,light:{color:"#ff8a3a",intensity:2.5,distance:4,offset:[0,.35,.25]},price:80,build(n){const t=n.primary,e=n.secondary,i=me(n),s=n.fixed("#8b8681",{roughness:.9}),r=n.fixed("#1c1414",{roughness:1}),a=n.fixed("#8f4632",{roughness:.9}),o=n.fixed("#6b4428",{roughness:.9}),l=[],c=[[-.6,.25],[-.45,.5],[-.58,.78],[.47,.32],[.6,.6],[.44,.9],[-.2,.95],[.18,.82]];for(const[h,u]of c)l.push(E(.16,.07,.02,a,{at:[h,u,.205]},.008));return st([E(1.5,.08,.52,s,{at:[0,.04,.06]},.02),E(.36,.98,.4,t,{at:[-.52,.57,0]},.03),E(.36,.98,.4,t,{at:[.52,.57,0]},.03),E(.7,.36,.4,t,{at:[0,.88,0]},.03),E(.72,.64,.24,r,{at:[0,.4,-.08]},.01),E(1.56,.08,.5,e,{at:[0,1.1,.04]},.025),...Xn(l),Y(.05,.05,.42,o,{at:[0,.13,0],rot:[0,.3,Qe]},12),Y(.05,.05,.42,o,{at:[0,.13,.04],rot:[0,-.3,Qe]},12),Te(.12,.34,i.flame,{at:[0,.34,.02]},16),Te(.08,.24,i.flame,{at:[-.13,.29,.03]},16),Te(.08,.22,i.flame,{at:[.13,.28,0]},16),Te(.06,.2,i.flameCore,{at:[0,.3,.07]},16)])}},{id:"tv_stand",name:"TV + Stand",category:"furniture",placement:"floor",tags:["modern","games"],size:{w:1.3,h:1.26,d:.47},defaultColors:{primary:"#d9c3a5",secondary:"#4f7c8a"},slots:2,price:60,build(n){const t=n.primary,e=n.secondary,i=me(n),s=n.fixed("#1b1b20",{roughness:.4}),r=n.fixed("#22303f",{roughness:.12}),a=n.fixed("#3d5672",{roughness:.1}),o=n.fixed("#2a2a30",{roughness:.9}),l=[E(1.3,.42,.42,t,{at:[0,.28,0]},.03),E(.38,.34,.025,e,{at:[-.43,.28,.215]},.015),E(.38,.34,.025,e,{at:[.43,.28,.215]},.015),F(.02,i.gold,{at:[-.27,.28,.235]},12),F(.02,i.gold,{at:[.27,.28,.235]},12),E(.4,.3,.02,o,{at:[0,.28,.205]},.008),E(.22,.05,.16,i.white,{at:[0,.165,.13]},.015),E(.36,.03,.2,s,{at:[0,.505,-.05]},.012),E(.06,.12,.04,s,{at:[0,.58,-.07]},.015),E(1.1,.64,.06,s,{at:[0,.94,-.06]},.02),E(1.02,.56,.01,r,{at:[0,.94,-.026]},.004),E(.06,.5,.004,a,{at:[.22,.95,-.02],rot:[0,0,.5]},.0015),E(.03,.5,.004,a,{at:[.3,.95,-.02],rot:[0,0,.5]},.0015)];for(const c of[-.58,.58])for(const h of[-.16,.16])l.push(Y(.025,.018,.07,i.dark,{at:[c,.035,h]},12));return st(l)}},{id:"crates",name:"Crate Stack",category:"furniture",placement:"floor",tags:["industrial","rustic"],size:{w:1.04,h:.92,d:.53},surfaceHeight:.92,defaultColors:{primary:"#c89a5e",secondary:"#9a6b3f"},slots:1,price:0,build(n){const t=n.primary,e=n.secondary;return st([so(.48,t,e,[-.255,.24,0],.04),so(.48,t,e,[.255,.24,.01],-.05),so(.44,t,e,[0,.7,0],.15)])}},{id:"lab_bench",name:"Lab Bench",category:"furniture",placement:"floor",tags:["science","industrial"],size:{w:1.62,h:1.64,d:.72},surfaceHeight:.92,defaultColors:{primary:"#e9eef2",secondary:"#2f3a45"},slots:2,price:100,build(n){const t=n.primary,e=n.secondary,i=me(n),s=n.fixed("#7cf29a",{opacity:.75,roughness:.1,emissive:!0}),r=n.fixed("#ff7ac8",{opacity:.75,roughness:.1,emissive:!0}),a=n.fixed("#6fd3ff",{opacity:.75,roughness:.1,emissive:!0}),o=n.fixed("#e8f6ff",{opacity:.4,roughness:.05}),l=[E(1.5,.06,.55,i.dark,{at:[0,.03,-.03]},.01),E(1.56,.81,.62,t,{at:[0,.465,-.02]},.02),E(1.62,.05,.7,e,{at:[0,.895,0]},.015),Y(.02,.02,.52,i.chrome,{at:[-.72,1.18,-.28]},12),Y(.02,.02,.52,i.chrome,{at:[.72,1.18,-.28]},12),E(1.5,.04,.2,e,{at:[0,1.42,-.27]},.012),Te(.065,.13,s,{at:[-.45,1.505,-.27]},20),Y(.022,.022,.07,o,{at:[-.45,1.6,-.27]},12),F(.065,r,{at:[-.18,1.505,-.27]},20),Y(.022,.022,.08,o,{at:[-.18,1.6,-.27]},12),E(.24,.04,.08,i.wood,{at:[.35,1.46,-.27]},.012),Pn(.018,.1,a,{at:[.28,1.53,-.27]}),Pn(.018,.1,s,{at:[.35,1.53,-.27]}),Pn(.018,.1,r,{at:[.42,1.53,-.27]}),xn([.55,.92,-.25],[.55,1.1,-.25],.016,i.chrome),$t(.06,.016,i.chrome,{at:[.61,1.1,-.25]},Be),xn([.67,1.1,-.25],[.67,1.04,-.25],.016,i.chrome)];for(const c of[-.51,0,.51])l.push(E(.48,.66,.025,t,{at:[c,.45,.3]},.015)),l.push(E(.025,.14,.025,i.chrome,{at:[c+.18,.62,.325]},.01));return st(l)}},{id:"floor_lamp",name:"Floor Lamp",category:"lighting",placement:"floor",tags:["modern","cozy"],size:{w:.44,h:1.63,d:.44},defaultColors:{primary:"#2f2f35",secondary:"#f2e3c6"},slots:2,light:{color:"#ffd9a0",intensity:2,distance:4,offset:[0,1.4,0]},price:0,build(n){const t=n.primary,e=n.secondary,i=me(n);return st([Y(.16,.18,.04,t,{at:[0,.02,0]},32),Y(.02,.02,1.3,t,{at:[0,.69,0]},12),Y(.035,.04,.06,i.gold,{at:[0,1.36,0]},12),Y(.15,.22,.3,e,{at:[0,1.48,0]},32),Y(.205,.205,.01,i.bulb,{at:[0,1.325,0]},32),F(.05,i.bulb,{at:[0,1.31,0]},16)])}},{id:"table_lamp",name:"Table Lamp",category:"lighting",placement:"surface",tags:["cozy","bedroom"],size:{w:.3,h:.47,d:.3},defaultColors:{primary:"#6fa8a0",secondary:"#f6e7c8"},slots:2,light:{color:"#ffd9a0",intensity:1.2,distance:2.5,offset:[0,.33,0]},price:0,build(n){const t=n.primary,e=n.secondary,i=me(n);return st([ve([[0,0],[.07,0],[.08,.02],[.1,.08],[.095,.14],[.06,.19],[.03,.21],[.025,.24],[0,.24]],t),Y(.015,.015,.08,i.gold,{at:[0,.28,0]},12),Y(.1,.15,.18,e,{at:[0,.38,0]},32),Y(.14,.14,.008,i.bulb,{at:[0,.287,0]},32)])}},{id:"pendant",name:"Pendant Lamp",category:"lighting",placement:"ceiling",tags:["modern","industrial","cafe"],size:{w:.44,h:.89,d:.44},defaultColors:{primary:"#2f5d50",secondary:"#e2b54a"},slots:1,light:{color:"#ffd9a0",intensity:2.5,distance:4.5,offset:[0,-.8,0]},price:0,build(n){const t=n.primary,e=me(n),i=[[0,-.025],[.06,-.03],[.13,-.07],[.18,-.15],[.2,-.24],[.22,-.24],[.2,-.14],[.14,-.05],[.06,-.005],[0,0]];return st([Y(.07,.07,.03,t,{at:[0,-.015,0]},24),Y(.011,.011,.55,e.dark,{at:[0,-.3,0]},8),Y(.035,.04,.07,t,{at:[0,-.6,0]},16),ve(i,t,{at:[0,-.62,0]},40),F(.055,e.bulb,{at:[0,-.83,0]},16)])}},{id:"chandelier",name:"Chandelier",category:"lighting",placement:"ceiling",tags:["royal","luxury","glam"],size:{w:.85,h:.73,d:.82},defaultColors:{primary:"#d8b04c",secondary:"#f8f1e2"},slots:1,light:{color:"#ffe2a8",intensity:3,distance:5,offset:[0,-.42,0]},price:120,build(n){const t=n.primary,e=n.secondary,i=me(n),s=n.fixed("#e8f4ff",{opacity:.6,roughness:.05}),r=.38,a=[Y(.08,.06,.04,t,{at:[0,-.02,0]},24),Y(.015,.015,.3,t,{at:[0,-.19,0]},8),ve([[0,0],[.06,.02],[.09,.08],[.05,.16],[.04,.22],[.07,.26],[0,.28]],t,{at:[0,-.6,0]}),$t(r,.02,t,{at:[0,-.55,0],rot:[Qe,0,0]}),F(.04,t,{at:[0,-.62,0]},16),Te(.04,.1,s,{at:[0,-.68,0],rot:[Be,0,0]},12)],o=[];for(let l=0;l<6;l++){const c=l/6*Be*2,h=Math.cos(c)*r,u=Math.sin(c)*r;o.push(xn([Math.cos(c)*.06,-.48,Math.sin(c)*.06],[h,-.55,u],.018,t)),o.push(Y(.045,.03,.04,t,{at:[h,-.53,u]},16)),o.push(Y(.022,.022,.1,e,{at:[h,-.46,u]},12)),o.push(F(.03,i.bulb,{at:[h,-.38,u],scale:[1,1.5,1]},12));const f=c+Be/6;o.push(Te(.025,.07,s,{at:[Math.cos(f)*r,-.6,Math.sin(f)*r],rot:[Be,0,0]},10))}return st([...a,...Xn(o)])}},{id:"disco_ball",name:"Disco Ball",category:"lighting",placement:"ceiling",tags:["party","retro","glam"],size:{w:.5,h:.77,d:.5},defaultColors:{primary:"#55585f",secondary:"#ff7ad9"},slots:1,light:{color:"#f2f6ff",intensity:2,distance:5,offset:[0,-.52,0]},price:100,build(n){const t=n.primary,e=n.fixed("#f6f8fc",{metalness:.85,roughness:.1}),i=n.fixed("#c4cbd6",{metalness:.9,roughness:.2}),s=n.fixed("#ffffff",{emissive:!0});return st([Y(.04,.04,.03,t,{at:[0,-.015,0]},16),Y(.012,.012,.25,t,{at:[0,-.155,0]},8),Y(.04,.05,.04,t,{at:[0,-.29,0]},16),...k1(.25,[e,i,s],[0,-.52,0])])}},{id:"lava_lamp",name:"Lava Lamp",category:"lighting",placement:"surface",tags:["retro","neon"],size:{w:.15,h:.43,d:.15},defaultColors:{primary:"#5b4b8a",secondary:"#ff4f7a"},slots:2,light:{color:"secondary",intensity:1.2,distance:2.5,offset:[0,.25,0]},price:0,build(n){const t=n.primary,e=n.secondary,i=n.fixed("#ffcf7a",{opacity:.55,emissive:!0});return st([ve([[0,0],[.075,0],[.075,.015],[.045,.13],[0,.13]],t),ve([[.042,.13],[.058,.22],[.045,.32],[.03,.37],[0,.37]],i),ve([[0,.36],[.034,.36],[.02,.43],[0,.43]],t),F(.032,e,{at:[.005,.16,0],scale:[1.3,.7,1.3]},16),F(.022,e,{at:[-.01,.235,.005],scale:[1,1.35,1]},16),F(.018,e,{at:[.012,.295,-.005]},16),F(.013,e,{at:[-.006,.34,0]},12)])}},{id:"string_lights",name:"String Lights",category:"lighting",placement:"wall",tags:["cozy","party","winter"],size:{w:1.84,h:.36,d:.075},defaultColors:{primary:"#2e4a3a",secondary:"#ffd25e"},slots:1,light:{color:"#ffd9a0",intensity:1.5,distance:3,offset:[0,0,.15]},price:0,build(n){const t=n.primary,e=me(n),i=n.fixed("#2e4a3a",{roughness:.7}),s=["#ffd25e","#ff7aa8","#7ad7ff","#9cff8a"].map(u=>n.fixed(u,{emissive:!0})),r=.16,a=.22,o=.04,l=[],c=[];for(const u of[-.9,0,.9])c.push(E(.04,.04,.04,e.dark,{at:[u,r,.02]},.01));let h=0;for(const[u,f]of[[-.9,0],[0,.9]]){const d=v=>r-a*4*v*(1-v),g=[];for(let v=0;v<=12;v++){const m=v/12;g.push([u+(f-u)*m,d(m),o])}l.push(Or(g,.01,i,!1,48));for(let v=0;v<7;v++){const m=(v+.5)/7,p=u+(f-u)*m,y=d(m);c.push(Y(.018,.018,.035,t,{at:[p,y-.022,o]},8)),c.push(F(.035,Oi(s,h++),{at:[p,y-.075,o],scale:[1,1.3,1]},12))}}return st([...l,...Xn(c)])}},{id:"neon_heart",name:"Neon Heart",category:"lighting",placement:"wall",tags:["neon","cute"],size:{w:.72,h:.66,d:.075},defaultColors:{primary:"#ff4f9a",secondary:"#ffffff"},slots:1,light:{color:"primary",intensity:1.6,distance:3,offset:[0,0,.15]},price:60,build(n){const t=n.primary,e=me(n),i=$h(.7).slice(0,-1),s=i.map(o=>o[1]),r=(Math.max(...s)+Math.min(...s))/2,a=i.map(([o,l])=>[o,l-r,.05]);return st([...A0(.72,.66,e),Or(a,.022,t,!0,120)])}},{id:"neon_bolt",name:"Neon Bolt",category:"lighting",placement:"wall",tags:["neon","games"],size:{w:.5,h:.95,d:.075},defaultColors:{primary:"#ffe14a",secondary:"#ffffff"},slots:1,light:{color:"primary",intensity:1.6,distance:3,offset:[0,0,.15]},price:60,build(n){const t=n.primary,e=me(n),i=[[-.05,.35],[.15,.35],[.04,.06],[.16,.06],[-.12,-.35],[-.02,-.04],[-.14,-.04]].map(([s,r])=>[(s-.01)*1.2,r*1.2]);return st([...A0(.5,.95,e),...H1(i,.022,.05,t)])}},{id:"lantern",name:"Lantern",category:"lighting",placement:"surface",tags:["rustic","fantasy","spooky"],size:{w:.22,h:.53,d:.22},defaultColors:{primary:"#3d3a35",secondary:"#e2b54a"},slots:1,light:{color:"#ffb85c",intensity:1.5,distance:3,offset:[0,.16,0]},price:0,build(n){const t=n.primary,e=me(n),i=n.fixed("#fff1cf",{opacity:.3,roughness:.1}),s=[0,Be/4,0],r=[Y(.135,.15,.04,t,{at:[0,.02,0],rot:s},4),E(.15,.24,.15,i,{at:[0,.16,0]},.01),Y(.03,.03,.08,e.white,{at:[0,.08,0]},12),F(.022,e.flame,{at:[0,.15,0],scale:[1,1.6,1]},12),Y(.135,.135,.03,t,{at:[0,.295,0],rot:s},4),Te(.15,.1,t,{at:[0,.36,0],rot:s},4),F(.025,t,{at:[0,.42,0]},12),$t(.05,.012,t,{at:[0,.47,0]})];for(const a of[-.08,.08])for(const o of[-.08,.08])r.push(E(.025,.24,.025,t,{at:[a,.16,o]},.008));return st(r)}},{id:"paper_lantern",name:"Paper Lantern",category:"lighting",placement:"ceiling",tags:["cute","cozy"],size:{w:.47,h:.75,d:.47},defaultColors:{primary:"#ffb3c7",secondary:"#e05a7a"},slots:1,light:{color:"#ffd9b0",intensity:1.6,distance:3.5,offset:[0,-.53,0]},price:30,build(n){const t=n.primary,e=n.secondary,i=me(n),s=.22,r=.9,a=-.34-s*r,o=[Y(.011,.011,.3,i.dark,{at:[0,-.15,0]},8),Y(.06,.06,.04,e,{at:[0,-.32,0]},20),F(s,t,{at:[0,a,0],scale:[1,r,1]},32),Y(.07,.07,.03,e,{at:[0,a-s*r+.01,0]},20),Y(.055,.055,.006,i.bulb,{at:[0,a-s*r-.008,0]},20)];for(const l of[-.165,-.11,-.055,0,.055,.11,.165])o.push($t(Math.sqrt(s*s-l*l)-.003,.008,t,{at:[0,a+l*r,0],rot:[Qe,0,0]}));return st(o)}},{id:"window",name:"Window",category:"wall",placement:"wall",tags:["cozy","nature"],size:{w:1.12,h:1.26,d:.16},defaultColors:{primary:"#f4efe6",secondary:"#c9a27a"},slots:1,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n),s=n.fixed("#ffffff",{emissive:!0}),r=.03;return st([E(.86,1.06,.02,i.sky,{at:[0,r,.02]},.005),F(.07,s,{at:[-.22,r+.32,.032],scale:[1.4,.8,.15]},16),F(.055,s,{at:[-.13,r+.34,.032],scale:[1.2,.9,.15]},16),F(.06,s,{at:[.2,r-.2,.032],scale:[1.5,.8,.15]},16),E(.08,1.2,.1,t,{at:[-.46,r,.05]},.02),E(.08,1.2,.1,t,{at:[.46,r,.05]},.02),E(1,.08,.1,t,{at:[0,r+.56,.05]},.02),E(1,.08,.1,t,{at:[0,r-.56,.05]},.02),E(.05,1.04,.06,t,{at:[0,r,.05]},.015),E(.84,.05,.06,t,{at:[0,r,.05]},.015),E(1.12,.06,.16,e,{at:[0,-.6,.08]},.02)])}},{id:"arch_window",name:"Arched Window",category:"wall",placement:"wall",tags:["royal","fantasy"],size:{w:1,h:1.59,d:.15},defaultColors:{primary:"#f4efe6",secondary:"#c9b28a"},slots:1,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n),s=[];for(let a=0;a<=20;a++){const o=a/20*Be;s.push([Math.cos(o)*.38,Math.sin(o)*.38])}const r=.3;return st([E(.74,1,.02,i.sky,{at:[0,-.2,.02]},.005),Oe(s,.01,i.sky,{at:[0,r,.01]},0),E(.09,1.05,.1,t,{at:[-.405,-.225,.05]},.02),E(.09,1.05,.1,t,{at:[.405,-.225,.05]},.02),E(.9,.09,.1,t,{at:[0,-.705,.05]},.02),$t(.405,.045,t,{at:[0,r,.05]},Be),E(.045,1.36,.06,t,{at:[0,.02,.05]},.015),E(.74,.045,.06,t,{at:[0,-.2,.05]},.015),E(.74,.045,.06,t,{at:[0,r,.05]},.015),xn([0,r,.05],[.27,r+.27,.05],.02,t),xn([0,r,.05],[-.27,r+.27,.05],.02,t),E(.1,.14,.12,e,{at:[0,.72,.06]},.02),E(1,.06,.15,e,{at:[0,-.77,.075]},.02)])}},{id:"painting",name:"Painting",category:"wall",placement:"wall",tags:["luxury","cozy"],size:{w:.8,h:.6,d:.05},defaultColors:{primary:"#c79a3b",secondary:"#f3ead8"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=n.fixed("#f5c542",{roughness:.8}),s=n.fixed("#2a9d8f",{roughness:.8}),r=n.fixed("#e76f51",{roughness:.8}),a=n.fixed("#264653",{roughness:.8});return st([E(.8,.07,.05,t,{at:[0,.265,.025]},.02),E(.8,.07,.05,t,{at:[0,-.265,.025]},.02),E(.07,.6,.05,t,{at:[-.365,0,.025]},.02),E(.07,.6,.05,t,{at:[.365,0,.025]},.02),E(.68,.48,.02,e,{at:[0,0,.015]},.005),Cn(.08,.01,i,[.16,.1,.03]),Oe([[-.32,-.2],[-.05,.12],[.2,-.2]],.006,s,{at:[0,0,.026]},0),Oe([[0,-.2],[.18,.02],[.33,-.2]],.006,r,{at:[0,0,.028]},0),E(.66,.06,.01,a,{at:[0,-.2,.03]},.004)])}},{id:"poster",name:"Poster",category:"wall",placement:"wall",tags:["retro","games","music"],size:{w:.64,h:.87,d:.022},defaultColors:{primary:"#2b2350",secondary:"#ffb347"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=n.fixed("#c0398a",{roughness:.8}),s=n.fixed("#ffd9f0",{roughness:.8}),r=n.fixed("#fffbe8",{opacity:.7,roughness:.6}),a=[E(.6,.84,.012,t,{at:[0,0,.006]},.004),Cn(.17,.006,e,[0,.1,.015],40),Oe([[-.28,-.12],[-.1,.06],[.08,-.12]],.004,i,{at:[0,0,.017]},0),Oe([[-.02,-.12],[.14,.02],[.28,-.12]],.004,i,{at:[0,0,.017]},0),E(.44,.05,.004,s,{at:[0,-.24,.014]},.0015),E(.3,.025,.004,s,{at:[0,-.31,.014]},.0015),E(.1,.04,.004,r,{at:[-.27,.41,.015],rot:[0,0,.6]},.0015),E(.1,.04,.004,r,{at:[.27,.41,.015],rot:[0,0,-.6]},.0015)];for(let o=0;o<3;o++)a.push(E(.36,.02+o*.006,.004,t,{at:[0,.06-o*.045,.02]},.0015));return st(a)}},{id:"mirror",name:"Mirror",category:"wall",placement:"wall",tags:["glam","luxury"],size:{w:.63,h:1,d:.1},defaultColors:{primary:"#d6b25e",secondary:"#f0d9a0"},slots:1,price:0,build(n){const t=n.primary,e=n.secondary,i=n.fixed("#dfe8ee",{metalness:.9,roughness:.08}),s=n.fixed("#ffffff",{opacity:.5,roughness:.1});return st([$t(.27,.045,t,{at:[0,-.025,.045],scale:[1,1.5,1]}),Y(.27,.27,.02,i,{at:[0,-.025,.03],rot:[Qe,0,0],scale:[1,1,1.5]},40),E(.05,.3,.005,s,{at:[-.1,.1,.042],rot:[0,0,-.5]},.002),F(.05,e,{at:[0,.455,.05]},16),F(.03,e,{at:[-.075,.44,.05]},12),F(.03,e,{at:[.075,.44,.05]},12)])}},{id:"clock",name:"Wall Clock",category:"wall",placement:"wall",tags:["retro","office","kitchen"],size:{w:.42,h:.42,d:.075},defaultColors:{primary:"#d9534f",secondary:"#e2b54a"},slots:1,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n),s=n.fixed("#2b2b30",{roughness:.6}),r=[];for(let o=0;o<12;o++){const l=o/12*Be*2,c=o%3===0;r.push(E(.02,c?.05:.025,.006,s,{at:[Math.sin(l)*.14,Math.cos(l)*.14,.042],rot:[0,0,-l]},.002))}const a=(o,l,c)=>E(.02,o,.008,s,{at:[Math.sin(l)*o*.4,Math.cos(l)*o*.4,c],rot:[0,0,-l]},.003);return st([Cn(.19,.02,t,[0,0,.01]),$t(.18,.03,t,{at:[0,0,.035]}),Cn(.17,.02,i.white,[0,0,.03]),...Xn(r),a(.1,(10+10/60)/12*Be*2,.046),a(.15,10/60*Be*2,.052),F(.02,e,{at:[0,0,.055]},12)])}},{id:"wall_shelf",name:"Wall Shelf",category:"wall",placement:"wall",tags:["modern","cozy"],size:{w:.9,h:.24,d:.25},surfaceHeight:.125,defaultColors:{primary:"#c9a27a",secondary:"#3a3a40"},slots:1,price:0,build(n){const t=n.primary,e=n.secondary,i=[[0,0],[.2,0],[.03,-.03],[0,-.18]];return st([E(.9,.05,.25,t,{at:[0,.1,.125]},.015),Oe(i,.035,e,{at:[-.3+.0175,.075,.006],rot:[0,-Qe,0]},.006),Oe(i,.035,e,{at:[.3+.0175,.075,.006],rot:[0,-Qe,0]},.006)])}},{id:"curtains",name:"Curtains",category:"wall",placement:"wall",tags:["cozy","royal"],size:{w:1.89,h:1.6,d:.21},defaultColors:{primary:"#b23a48",secondary:"#e2b54a"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n),s=[Y(.022,.022,1.76,i.iron,{at:[0,.72,.12],rot:[0,0,Qe]},12),F(.045,i.iron,{at:[-.9,.72,.12]},12),F(.045,i.iron,{at:[.9,.72,.12]},12),E(.04,.04,.12,i.iron,{at:[-.8,.72,.06]},.01),E(.04,.04,.12,i.iron,{at:[.8,.72,.06]},.01),E(1.7,.18,.06,e,{at:[0,.71,.18]},.03)];for(const r of[-1,1]){for(let a=0;a<4;a++)s.push(Pn(.055,1.38,t,{at:[r*(.5+a*.1),-.06,.1+a%2*.03],scale:[1,1,.7]}));s.push(E(.46,.05,.13,e,{at:[r*.65,-.2,.12]},.02))}return st(s)}},{id:"bunting",name:"Bunting",category:"wall",placement:"wall",tags:["party","sporty"],size:{w:1.64,h:.36,d:.04},defaultColors:{primary:"#ff6b6b",secondary:"#4dabf7"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n),s=n.fixed("#fff3c9",{roughness:.8}),r=n.fixed("#f6f2ea",{roughness:.8}),a=h=>.15-.16*(1-(h/.8)**2),o=[];for(let h=0;h<=16;h++){const u=-.8+h*.1;o.push([u,a(u),.03])}const l=[t,e,s],c=[E(.04,.04,.04,i.dark,{at:[-.8,.15,.02]},.01),E(.04,.04,.04,i.dark,{at:[.8,.15,.02]},.01),Or(o,.01,r,!1,48)];for(let h=0;h<9;h++){const u=-.64+h*.16;c.push(Oe([[-.065,0],[.065,0],[0,-.17]],.008,Oi(l,h),{at:[u,a(u),.024],rot:[0,0,Math.atan(.5*u)]},.004))}return st(c)}},{id:"tapestry",name:"Tapestry",category:"wall",placement:"wall",tags:["fantasy","royal","magic"],size:{w:1.22,h:1.58,d:.08},defaultColors:{primary:"#5b2a86",secondary:"#e2b54a"},slots:2,price:50,build(n){const t=n.primary,e=n.secondary,i=me(n);return st([Oe([[-.46,.6],[.46,.6],[.46,-.38],[0,-.66],[-.46,-.38]],.01,e,{at:[0,0,.005]},.005),Oe([[-.4,.56],[.4,.56],[.4,-.35],[0,-.59],[-.4,-.35]],.006,t,{at:[0,0,.024]},.004),Oe(Ei(.15,.065),.006,i.gold,{at:[0,.08,.036]},.003),Cn(.08,.006,i.gold,[-.17,.36,.038]),Cn(.07,.008,t,[-.135,.385,.042]),Oe(Ei(.05,.022),.004,i.gold,{at:[.2,.36,.036]},.002),Oe(Ei(.04,.018),.004,i.gold,{at:[.2,-.2,.036]},.002),Oe(Ei(.035,.016),.004,i.gold,{at:[-.22,-.16,.036]},.002),Y(.025,.025,1.1,i.wood,{at:[0,.6,.04],rot:[0,0,Qe]},12),F(.04,i.wood,{at:[-.57,.6,.04]},12),F(.04,i.wood,{at:[.57,.6,.04]},12),xn([-.5,.6,.03],[0,.78,.02],.01,i.dark,6),xn([.5,.6,.03],[0,.78,.02],.01,i.dark,6),E(.04,.04,.04,i.dark,{at:[0,.78,.02]},.01),F(.025,e,{at:[0,-.665,.03]},12),Te(.03,.1,e,{at:[0,-.73,.03],rot:[Be,0,0]},12)])}},{id:"porthole",name:"Porthole",category:"wall",placement:"wall",tags:["ocean","space"],size:{w:.68,h:.6,d:.135},defaultColors:{primary:"#c99a3d",secondary:"#8c6a2a"},slots:1,price:60,build(n){const t=n.primary,e=n.secondary,i=n.fixed("#4aa3d8",{emissive:!0,roughness:.15}),s=n.fixed("#ffffff",{opacity:.55,roughness:.1}),r=[];for(let a=0;a<8;a++){const o=a/8*Be*2+Be/8;r.push(F(.022,e,{at:[Math.cos(o)*.24,Math.sin(o)*.24,.11]},12))}return st([Cn(.3,.03,t,[0,0,.015],40),$t(.24,.055,t,{at:[0,0,.06]}),Cn(.2,.02,i,[0,0,.045],40),E(.03,.14,.006,s,{at:[-.08,.06,.058],rot:[0,0,-.6]},.002),...Xn(r),E(.06,.12,.05,e,{at:[.31,0,.045]},.015),E(.06,.08,.06,e,{at:[-.31,0,.05]},.015)])}},{id:"door",name:"Door",category:"wall",placement:"wall",tags:["rustic"],size:{w:1.04,h:2.1,d:.1},defaultColors:{primary:"#a86b3c",secondary:"#5a4636"},slots:2,price:0,build(n){const t=n.primary,e=n.secondary,i=me(n),s=[E(.08,2.1,.1,e,{at:[-.48,0,.05]},.02),E(.08,2.1,.1,e,{at:[.48,0,.05]},.02),E(1.04,.08,.1,e,{at:[0,1.01,.05]},.02),E(.28,.28,.012,i.sky,{at:[0,.55,.074]},.004),E(.36,.04,.03,e,{at:[0,.71,.08]},.01),E(.36,.04,.03,e,{at:[0,.39,.08]},.01),E(.04,.36,.03,e,{at:[-.16,.55,.08]},.01),E(.04,.36,.03,e,{at:[.16,.55,.08]},.01),E(.02,.28,.02,e,{at:[0,.55,.082]},.006),E(.28,.02,.02,e,{at:[0,.55,.082]},.006),E(.42,.06,.02,i.iron,{at:[-.2,.15,.08]},.008),E(.42,.06,.02,i.iron,{at:[-.2,-.75,.08]},.008),Cn(.04,.015,i.iron,[.3,-.05,.075],16),$t(.05,.012,i.iron,{at:[.3,-.1,.09]})],r=[];for(let a=0;a<5;a++)r.push(E(.168,2.02,.05,t,{at:[-.348+a*.174,-.04,.045]},.015));return st([...s,...r])}}],ct=Math.PI,_a=new P(0,1,0),W1=new P(0,0,1),R0=new Map;function Zh(n,t){let e=R0.get(n);return e||(e=t(),R0.set(n,e)),e}function va(n,t={}){return t.at&&n.position.set(t.at[0],t.at[1],t.at[2]),t.rot&&n.rotation.set(t.rot[0],t.rot[1],t.rot[2]),t.scale&&n.scale.set(t.scale[0],t.scale[1],t.scale[2]),n}const hn=n=>new P(n[0],n[1],n[2]),xa=(n,t)=>hn(n).distanceTo(hn(t));function Ln(n,t,e=1){return[n[0]+t[0]*e,n[1]+t[1]*e,n[2]+t[2]*e]}function la(n,t){return[Math.sin(n)*Math.cos(t),Math.sin(t),Math.cos(n)*Math.cos(t)]}function ze(n,t,e){return[Math.sin(t)*n,e,Math.cos(t)*n]}function ya(n,t,e){const i=hn(t),s=hn(e);return n.position.copy(i.clone().add(s).multiplyScalar(.5)),n.quaternion.setFromUnitVectors(_a,s.sub(i).normalize()),n}function se(n,t,e,i,s=12){return ya(Y(e,e,xa(n,t),i,{},s),n,t)}function xe(n,t,e,i){return ya(Pn(e,Math.max(.002,xa(n,t)),i),n,t)}function ca(n,t,e,i,s,r=.012){return ya(E(e,xa(n,t),i,s,{},r),n,t)}function X1(n){const t=n.clone().normalize(),e=new P().crossVectors(_a,t);e.lengthSq()<1e-8&&e.set(1,0,0),e.normalize();const i=new P().crossVectors(t,e);return new ti().setFromRotationMatrix(new be().makeBasis(e,i,t))}function Y1(n){const t=n.clone().normalize(),e=new P().crossVectors(t,_a);e.lengthSq()<1e-8&&e.set(1,0,0),e.normalize();const i=new P().crossVectors(e,t);return new ti().setFromRotationMatrix(new be().makeBasis(e,t,i))}function Ai(n,t,e,i,s){const r=F(.5,s,{},16),a=hn(n),o=hn(t);return r.scale.set(e,i,a.distanceTo(o)),r.position.copy(a.clone().add(o).multiplyScalar(.5)),r.quaternion.copy(X1(o.sub(a))),r}function Kh(n,t,e){return n.position.copy(hn(t)),n.quaternion.setFromUnitVectors(_a,hn(e).normalize()),n}function fs(n,t,e){return n.position.copy(hn(t)),n.quaternion.setFromUnitVectors(W1,hn(e).normalize()),n}function Gn(n,t,e,i={},s=.01){return va(st([Oe(n,t,e,{at:[0,0,-t/2]},s)]),i)}function sl(n,t,e,i,s,r,a={}){const o=Zh(`sp:${n}:${e}:${i}:${s}:${r}`,()=>new bs(n,24,12,e,i,s,r));return va(new ie(o,t),a)}function Jh(n,t,e,i,s,r,a={}){const o=Zh(`flute:${n}:${t}:${e}:${i}:${s}`,()=>{const l=new rr(n,t,e,i*6,1),c=l.getAttribute("position");for(let h=0;h<c.count;h++){const u=c.getX(h),f=c.getZ(h);if(Math.hypot(u,f)<1e-6)continue;const g=1+s*Math.cos(i*Math.atan2(f,u));c.setX(h,u*g),c.setZ(h,f*g)}return l.computeVertexNormals(),l});return va(new ie(o,r),a)}function rl(n,t,e,i,s){const r=t*Math.sin(i)*Math.sin(s),a=e*Math.cos(i),o=t*Math.sin(i)*Math.cos(s);return{pos:[n[0]+r,n[1]+a,n[2]+o],n:[r/(t*t),a/(e*e),o/(t*t)]}}function Qh(n,t=5){const e=[];for(let s=0;s<60;s++){const r=s/60*ct*2,a=n*(.5+.5*Math.abs(Math.cos(t/2*r)));e.push([Math.cos(r)*a,Math.sin(r)*a])}return e}function q1(n,t){const i=l=>t/2*Math.pow(Math.sin(ct*(.06+.94*l)),.7),s=(l,c)=>c.some(h=>Math.abs(l-h)<.013)?.28:1,r=[.325,.525,.725],a=[.425,.625,.825],o=[];for(let l=0;l<=40;l++){const c=l/40;o.push([i(c)*s(c,r),c*n])}for(let l=39;l>=0;l--){const c=l/40;o.push([-i(c)*s(c,a),c*n])}return o.push([0,.07*n]),o}function $1(){const e=[];for(let s=0;s<=28;s++){const r=s/28*.615,a=Math.sqrt(Math.max(0,.19*.19-(r-.19)**2)),o=Math.sqrt(Math.max(0,.145*.145-(r-.47)**2)),l=r>.2&&r<.5?.11:0;e.push([Math.max(a,o,l),r])}const i=[...e];for(let s=27;s>=1;s--){const r=e[s];r&&i.push([-r[0],r[1]])}return i}function Z1(n,t){const i=r=>t/2*Math.pow(Math.sin(ct*(.08+.92*r)),.6),s=[];for(let r=0;r<=26;r++)s.push([i(r/26),r/26*n]);for(let r=25;r>=0;r--)s.push([-i(r/26),r/26*n]);return s}function C0(n){const t=[];for(let e=0;e<=16;e++){const i=e/16*ct;t.push([Math.cos(i)*n,Math.sin(i)*n])}return t}const dt={ink:n=>n.fixed("#2a2631",{roughness:.45}),white:n=>n.fixed("#fbf7ef",{roughness:.6}),gold:n=>n.fixed("#f2c14e",{metalness:.8,roughness:.3}),steel:n=>n.fixed("#bcc3cc",{metalness:.7,roughness:.35}),glass:n=>n.fixed("#d8f0ff",{opacity:.32,roughness:.05}),wood:n=>n.fixed("#b98552",{roughness:.8}),darkWood:n=>n.fixed("#6e4529",{roughness:.8}),leaf:n=>n.fixed("#4f9a4a",{roughness:.7}),stem:n=>n.fixed("#3f7d3a",{roughness:.7}),soil:n=>n.fixed("#5a3d2b",{roughness:1}),blush:n=>n.fixed("#ff9db0",{roughness:.7}),orange:n=>n.fixed("#ff8a2a",{roughness:.6}),glow:(n,t)=>n.fixed(t,{emissive:!0})};function Ma(n,t,e){return[[0,0],[n,0],[n+.015,.03],[t,e*.86],[t+.02,e*.88],[t+.02,e],[t,e],[t-.005,e-.02],[0,e-.02]]}function K1(n){const t=n.fixed("#f6f0e0",{roughness:.9}),e=[[.28,.06,.2,n.primary,.06],[.25,.05,.18,n.fixed("#3f6fb5"),-.14],[.27,.055,.19,n.secondary,.1],[.22,.045,.16,n.fixed("#e0b44a"),-.22]],i=[];let s=0;for(const[r,a,o,l,c]of e)i.push(st([E(r,a,o,l,{at:[0,a/2,0]},.008),Ce(r+.004,a*.68,o-.02,t,{at:[0,a/2,-.012]})],{at:[0,s,0],rot:[0,c,0]})),s+=a;return i.push(Ce(.02,.05,.006,n.fixed("#d8443c"),{at:[.04,s-.03,.084],rot:[0,-.22,0]})),st(i)}function J1(n){const t=n.fixed("#f7f3ec",{roughness:.3}),e=[ve([[0,0],[.09,0],[.09,.012],[.035,.03],[.022,.09],[.035,.105],[0,.105]],t),Y(.17,.16,.016,t,{at:[0,.113,0]},40),Y(.13,.13,.1,n.primary,{at:[0,.171,0]},40),Y(.136,.136,.022,n.secondary,{at:[0,.226,0]},40),Y(.085,.085,.075,n.primary,{at:[0,.274,0]},32),Y(.09,.09,.02,n.secondary,{at:[0,.317,0]},32),F(.026,n.fixed("#d42a3a",{roughness:.25}),{at:[0,.352,0]}),se([0,.37,0],[.012,.4,0],.004,dt.stem(n),6)];for(let i=0;i<6;i++){const s=i/6*ct*2+.3;e.push(Pn(.016,.026,n.secondary,{at:ze(.131,s,.205)}))}for(let i=0;i<5;i++){const s=i/5*ct*2;e.push(F(.017,n.secondary,{at:ze(.068,s,.33)},12))}return st(e)}function Q1(n){const t=dt.steel(n),e=dt.white(n);return st([E(.32,.05,.3,n.primary,{at:[0,.025,0]},.02),E(.32,.27,.14,n.primary,{at:[0,.18,-.08]},.03),E(.32,.08,.3,n.primary,{at:[0,.34,0]},.03),E(.27,.02,.24,n.secondary,{at:[0,.388,-.01]},.008),Ce(.2,.01,.12,t,{at:[0,.055,.07]}),Y(.045,.04,.04,t,{at:[0,.282,.07]}),Y(.042,.036,.03,t,{at:[0,.248,.07]}),xe([0,.246,.11],[0,.238,.19],.015,dt.ink(n)),ve([[0,0],[.03,0],[.034,.055],[.029,.055],[.026,.008],[0,.008]],e,{at:[0,.06,.07]}),Y(.028,.028,.004,n.fixed("#5b3420"),{at:[0,.105,.07]}),Y(.032,.032,.012,e,{at:[.085,.34,.152],rot:[ct/2,0,0]}),$t(.032,.007,n.secondary,{at:[.085,.34,.157]}),Y(.015,.015,.014,n.secondary,{at:[-.04,.34,.153],rot:[ct/2,0,0]},12),Y(.015,.015,.014,n.secondary,{at:[-.09,.34,.153],rot:[ct/2,0,0]},12),se([.135,.3,.09],[.15,.17,.12],.01,t)])}function j1(n){const t=n.fixed("#d8f0ff",{opacity:.35,roughness:.05}),e=n.fixed("#b5895a",{roughness:.9}),i=st([ve([[0,0],[.05,.003],[.068,.035],[.07,.065],[.055,.1],[.022,.12],[.02,.165],[0,.165]],t),ve([[0,.006],[.046,.009],[.062,.035],[.064,.062],[0,.062]],dt.glow(n,"#5dff8a")),Y(.024,.02,.035,e,{at:[0,.175,0]},12),Y(.028,.028,.012,n.secondary,{at:[0,.195,0]},12)],{at:[-.075,0,0]}),s=st([ve([[0,0],[.04,0],[.04,.15],[.02,.18],[.017,.22],[0,.22]],t),Y(.035,.035,.12,dt.glow(n,"#b06bff"),{at:[0,.063,0]}),Y(.042,.042,.05,n.primary,{at:[0,.085,0]}),Y(.021,.017,.035,e,{at:[0,.23,0]},12),Y(.025,.025,.012,n.secondary,{at:[0,.25,0]},12)],{at:[.04,0,-.045]}),r=st([ve([[0,0],[.06,0],[.062,.008],[.022,.09],[.02,.12],[0,.12]],t),ve([[0,.005],[.055,.006],[.04,.045],[0,.045]],dt.glow(n,"#ff6bb5")),Y(.022,.018,.03,e,{at:[0,.13,0]},12),Y(.04,.05,.022,n.primary,{at:[0,.035,0]},24)],{at:[.07,0,.07]});return st([i,s,r])}function tv(n){const t=dt.glow(n,"#59f26e"),e=dt.glow(n,"#b6ff9e"),i=n.fixed("#efe6cf"),s=[ve([[0,.08],[.18,.09],[.3,.15],[.37,.27],[.375,.36],[.34,.46],[.3,.51],[.29,.52]],n.primary,{},40),Y(.3,.3,.02,t,{at:[0,.505,0]},40),$t(.3,.04,n.primary,{at:[0,.53,0],rot:[ct/2,0,0]}),$t(.05,.016,n.secondary,{at:[.365,.42,0],rot:[0,ct/2,0]}),$t(.05,.016,n.secondary,{at:[-.365,.42,0],rot:[0,ct/2,0]}),F(.05,e,{at:[.08,.52,.06]},16),F(.035,e,{at:[-.1,.515,.12]},16),F(.03,e,{at:[.15,.515,-.1]},16),F(.042,e,{at:[-.06,.52,-.14]},16),xe([-.06,.45,-.04],[-.17,.7,-.09],.025,i),F(.034,i,{at:[-.195,.715,-.07]},12),F(.034,i,{at:[-.15,.73,-.12]},12)];for(let r=0;r<3;r++){const a=r/3*ct*2+ct/6;s.push(xe(ze(.18,a,.16),ze(.25,a,.045),.045,n.secondary))}return st(s)}function ev(n){const t=[ve([[0,0],[.1,0],[.1,.02],[.085,.04],[.068,.06],[.075,.075],[0,.075]],n.primary),$t(.072,.012,n.secondary,{at:[0,.068,0],rot:[ct/2,0,0]}),F(.11,n.fixed("#c3b0ff",{opacity:.5,roughness:.05,emissive:!0}),{at:[0,.155,0]},32),F(.05,dt.glow(n,"#efe6ff"),{at:[0,.15,0]},16),F(.028,dt.glow(n,"#9f7bff"),{at:[.04,.18,.02]},12)];for(let e=0;e<3;e++){const i=e/3*ct*2;t.push(xe(ze(.072,i,.07),ze(.1,i,.125),.013,n.secondary))}return st(t)}function nv(n){const t=n.fixed("#231d26",{roughness:.9});return st([F(.085,n.primary,{at:[0,.12,-.005],scale:[1,.95,1.05]}),E(.12,.06,.09,n.primary,{at:[0,.055,.03]},.028),E(.094,.04,.08,n.primary,{at:[0,.02,.045]},.016),Ce(.07,.008,.02,t,{at:[0,.04,.082]}),Ce(.004,.03,.02,t,{at:[-.012,.035,.084]}),Ce(.004,.03,.02,t,{at:[.012,.035,.084]}),F(.029,t,{at:[-.035,.112,.071],scale:[1,1.05,.35]},16),F(.029,t,{at:[.035,.112,.071],scale:[1,1.05,.35]},16),Te(.015,.028,t,{at:[0,.07,.077],rot:[.3,0,ct]},3)])}function iv(n){const t=dt.glow(n,"#ffb347"),e=dt.glow(n,"#fff4c2"),i=dt.ink(n),s=[Y(.14,.13,.02,n.secondary,{at:[0,.01,0]},32),$t(.135,.01,n.secondary,{at:[0,.02,0],rot:[ct/2,0,0]})],r=[[-.05,0,.035,.2],[.06,.03,.03,.14],[.01,-.07,.028,.09]];for(const[a,o,l,c]of r){const h=.02+c;s.push(Y(l,l,c,n.primary,{at:[a,.02+c/2,o]},20),Pn(.009,.03,n.primary,{at:[a+l*.9,h-.025,o+l*.3]}),Y(.003,.003,.016,i,{at:[a,h+.008,o]},6),F(.02,t,{at:[a,h+.03,o],scale:[.7,1.4,.7]},12),F(.009,e,{at:[a,h+.024,o+.008]},8))}return st(s)}function sv(n){const t=n.fixed("#3b2a22",{roughness:.6});return st([E(.18,.06,.18,t,{at:[0,.03,0]},.012),E(.13,.05,.13,t,{at:[0,.085,0]},.012),E(.1,.032,.01,n.secondary,{at:[0,.03,.092]},.004),Y(.018,.035,.06,n.primary,{at:[0,.14,0]}),F(.03,n.primary,{at:[0,.172,0]}),ve([[0,.17],[.04,.18],[.075,.22],[.095,.29],[.1,.34],[.09,.34],[.084,.295],[.066,.235],[0,.21]],n.primary),$t(.042,.012,n.primary,{at:[.1,.275,0],rot:[0,0,-.2]}),$t(.042,.012,n.primary,{at:[-.1,.275,0],rot:[0,0,.2]}),Gn(Ei(.035,.016),.008,n.secondary,{at:[0,.27,.088],rot:[-.25,0,0]},.003)])}function rv(n){const t=dt.ink(n);return st([F(.1,n.primary,{at:[0,.125,0],scale:[1,1.1,.9]}),F(.07,n.secondary,{at:[0,.115,.055],scale:[1,1.1,.5]}),F(.085,n.primary,{at:[0,.29,0]}),F(.035,n.primary,{at:[-.065,.36,-.005]},16),F(.035,n.primary,{at:[.065,.36,-.005]},16),F(.02,n.secondary,{at:[-.065,.36,.022],scale:[1,1,.5]},12),F(.02,n.secondary,{at:[.065,.36,.022],scale:[1,1,.5]},12),F(.04,n.secondary,{at:[0,.268,.07],scale:[1.1,.8,.8]},16),F(.014,t,{at:[0,.283,.1]},10),F(.012,t,{at:[-.033,.31,.074]},10),F(.012,t,{at:[.033,.31,.074]},10),xe([-.08,.19,.01],[-.115,.11,.05],.032,n.primary),xe([.08,.19,.01],[.115,.11,.05],.032,n.primary),xe([-.06,.04,.03],[-.065,.04,.11],.04,n.primary),xe([.06,.04,.03],[.065,.04,.11],.04,n.primary),Y(.028,.028,.01,n.secondary,{at:[-.065,.04,.152],rot:[ct/2,0,0]},16),Y(.028,.028,.01,n.secondary,{at:[.065,.04,.152],rot:[ct/2,0,0]},16),Te(.022,.04,n.fixed("#e8475a"),{at:[-.022,.215,.08],rot:[0,0,ct/2]},12),Te(.022,.04,n.fixed("#e8475a"),{at:[.022,.215,.08],rot:[0,0,-ct/2]},12),F(.012,n.fixed("#e8475a"),{at:[0,.215,.082]},8)])}function av(n){const t=n.fixed("#4f8fd0",{roughness:.5}),e=n.fixed("#7cc46a",{roughness:.7}),i=.13,s=[[1.1,.9,.5,.55],[1.5,.6,1.25,.7],[2.6,1.1,.35,.6],[3.9,.8,1,.8],[5.2,.9,.45,.5],[.2,.5,1.6,.5]],r=st([F(i,t,{at:[0,.155,0]},32),...s.map(([a,o,l,c])=>sl(i+.004,e,a,o,l,c,{at:[0,.155,0]})),$t(.155,.011,n.secondary,{at:[0,.155,0],rot:[0,0,ct/2]},ct),F(.016,n.secondary,{at:[0,.31,0]},12)],{at:[0,.1,0],rot:[0,0,-.38]});return st([ve([[0,0],[.11,0],[.11,.015],[.08,.035],[0,.035]],n.primary),Y(.014,.018,.075,n.secondary,{at:[0,.07,0]},12),r])}function ov(n){const t=dt.steel(n),e=n.fixed("#18161c",{roughness:.3});return st([E(.44,.1,.36,n.primary,{at:[0,.05,0]},.025),E(.42,.012,.34,n.secondary,{at:[0,.102,0]},.005),Y(.15,.15,.016,dt.ink(n),{at:[-.055,.115,0]},40),Y(.142,.142,.008,e,{at:[-.055,.127,0]},40),$t(.1,.003,n.fixed("#3a3640"),{at:[-.055,.131,0],rot:[ct/2,0,0]}),Y(.045,.045,.01,n.fixed("#e8574a"),{at:[-.055,.128,0]},24),Y(.007,.007,.02,t,{at:[-.055,.138,0]},8),Y(.03,.035,.03,t,{at:[.16,.12,-.11]},16),F(.022,t,{at:[.165,.15,-.15]},12),xe([.16,.15,-.12],[.075,.15,.08],.009,t),E(.03,.016,.045,dt.ink(n),{at:[.07,.143,.1],rot:[0,.4,0]},.005),E(.12,.06,.012,n.fixed("#3a3640",{roughness:.9}),{at:[-.11,.05,.181]},.005),Y(.018,.018,.015,t,{at:[.11,.05,.184],rot:[ct/2,0,0]},12),Y(.018,.018,.015,t,{at:[.165,.05,.184],rot:[ct/2,0,0]},12)])}function lv(n){const t=dt.ink(n),e=dt.steel(n),i=[E(.5,.26,.14,n.primary,{at:[0,.13,0]},.04),E(.13,.08,.02,t,{at:[0,.14,.07]},.008),Ce(.08,.03,.008,n.fixed("#8fc9dc",{roughness:.2}),{at:[0,.14,.081]}),$t(.17,.018,t,{at:[0,.26,-.02],scale:[1,.45,1]},ct),se([.2,.25,-.04],[.36,.42,-.04],.008,e,8),F(.015,e,{at:[.36,.42,-.04]},8)];for(const s of[-.15,.15])i.push(Y(.075,.075,.02,t,{at:[s,.12,.068],rot:[ct/2,0,0]},32),$t(.078,.012,n.secondary,{at:[s,.12,.078]}),F(.03,e,{at:[s,.12,.078],scale:[1,1,.5]},16));for(let s=0;s<4;s++)i.push(E(.03,.02,.03,n.secondary,{at:[-.06+s*.04,.265,.03]},.006));return st(i)}function ro(n,t,e,i,s,r,a){const o=[E(n,t,e,i,{at:[0,t/2,0]},.015),Ce(n+.006,t+.006,.04,s,{at:[0,t/2,0]}),Ce(.04,t+.006,e+.006,s,{at:[0,t/2,0]})];return a&&o.push($t(.035,.012,s,{at:[-.034,t+.025,0],rot:[0,0,.6]}),$t(.035,.012,s,{at:[.034,t+.025,0],rot:[0,0,-.6]}),F(.018,s,{at:[0,t+.012,0]},12)),va(st(o),r)}function cv(n){return st([ro(.3,.26,.28,n.primary,n.secondary,{at:[-.1,0,0],rot:[0,.15,0]},!1),ro(.16,.14,.16,n.secondary,n.primary,{at:[-.1,.26,0],rot:[0,-.35,0]},!0),ro(.2,.18,.2,n.fixed("#f6f1e7"),n.secondary,{at:[.18,0,.08],rot:[0,-.2,0]},!0)])}function hv(n){const s=dt.glow(n,"#ffb02e"),r=[F(.16,n.primary,{at:[0,.115,0],scale:[1,.115/.16,1]},32)];for(let h=0;h<8;h++)r.push(F(.16,n.primary,{at:[0,.115,0],rot:[0,h*ct/8,0],scale:[.42,.115/.16*.97,1.07]},24));r.push(Y(.018,.026,.06,n.secondary,{at:[.005,.24,0],rot:[0,0,-.25]},10),Ai([.015,.232,0],[.09,.25,-.04],.05,.012,n.secondary));const a=(h,u)=>{const f=1-(h/.16)**2-((u-.115)/.115)**2,d=.16*1.02*Math.sqrt(Math.max(.02,f));return{pos:[h,u,d],n:[h/(.16*.16),(u-.115)/(.115*.115),d/(.16*.16)]}},o=[[-.028,-.018],[.028,-.018],[0,.024]];for(const h of[-.055,.055]){const u=a(h,.15);r.push(fs(Gn(o,.012,s,{},.004),u.pos,u.n))}const l=a(0,.115);return r.push(fs(Gn([[-.014,-.01],[.014,-.01],[0,.014]],.012,s,{},.003),l.pos,l.n)),[[-.066,.026],[-.033,.038],[0,.03],[.033,.038],[.066,.026]].forEach(([h,u],f)=>{const d=a(h,.072+3*h*h+(f%2===0?.004:-.004));r.push(fs(E(.031,u,.02,s,{},.006),d.pos,d.n))}),st(r)}function uv(n){const e=[],i=[0,0,-.096];for(let s=0;s<7;s++){const r=-.95+s*1.9/6,a=.4-.08*Math.abs(r),o=1-.15*Math.abs(r),l=.07*1.6,c=.06*1.6;e.push(F(l,n.primary,{at:[i[0]+Math.sin(r)*c,a*l,i[2]+Math.cos(r)*c],rot:[0,r,0],scale:[.3,a,o]},20))}return e.push(E(.07*1.6,.022*1.6,.03*1.6,n.primary,{at:[0,.011*1.6,i[2]-.004]},.01)),e.push(Gn(Ei(.075,.032),.012,n.secondary,{at:[.2,.012,.07],rot:[-ct/2,0,.3]},.006)),st(e)}function fv(n){const t=n.fixed("#f5c542",{metalness:.8,roughness:.3}),e=.78,i=[Oe(C0(.25),e,n.primary,{at:[-e/2,0,.25],rot:[0,ct/2,0]})];for(const o of[-.28,.28])i.push(Oe(C0(.262),.05,n.secondary,{at:[o-.025,0,.25],rot:[0,ct/2,0]},.008));const s=st(i,{at:[0,.4,-.25],rot:[-1.5,0,0]}),r=[E(.8,.4,.5,n.primary,{at:[0,.2,0]},.03),E(.06,.41,.51,n.secondary,{at:[-.28,.2,0]},.01),E(.06,.41,.51,n.secondary,{at:[.28,.2,0]},.01),E(.81,.05,.51,n.secondary,{at:[0,.025,0]},.01),E(.1,.12,.02,n.secondary,{at:[0,.32,.255]},.01),Ce(.02,.04,.01,dt.ink(n),{at:[0,.31,.267]}),s,ys(.3,t,0,ct/2,{at:[0,.38,0],scale:[1.2,.35,.75]}),F(.04,n.fixed("#e0304e",{roughness:.15}),{at:[-.12,.47,.05]},6),F(.035,n.fixed("#2fb37a",{roughness:.15}),{at:[.17,.45,-.02]},6)],a=[[.05,.478,.08,.3],[-.22,.43,.12,-.5],[.24,.42,.13,.6],[.3,.405,.2,1.2],[-.02,.47,-.1,-.2]];for(const[o,l,c,h]of a)r.push(Y(.035,.035,.01,t,{at:[o,l,c],rot:[h,0,h*.5]},16));return st(r)}function dv(n){const t=dt.steel(n),e=dt.ink(n);return st([E(.18,.04,.22,n.primary,{at:[0,.02,.01]},.015),E(.06,.2,.06,n.primary,{at:[0,.14,-.07]},.02),ca([0,.22,-.07],[0,.31,-.02],.06,.06,n.primary,.02),E(.05,.03,.09,n.primary,{at:[0,.13,-.03]},.01),E(.14,.018,.12,e,{at:[0,.13,.03]},.006),Ce(.075,.006,.026,n.fixed("#cfeaff",{opacity:.6}),{at:[0,.141,.035]}),Y(.02,.02,.008,dt.glow(n,"#fff2b0"),{at:[0,.044,.03]},16),E(.07,.05,.08,n.primary,{at:[0,.31,0]},.02),Y(.03,.03,.12,n.secondary,{at:[0,.25,.03]},20),Y(.04,.04,.025,t,{at:[0,.185,.03]},20),Y(.012,.009,.04,t,{at:[0,.16,.03]},10),se([.015,.18,.03],[.03,.155,.045],.01,t,10),se([0,.33,-.005],[0,.39,-.06],.02,e,16),Y(.032,.032,.022,n.secondary,{at:[-.045,.17,-.07],rot:[0,0,ct/2]},16),Y(.032,.032,.022,n.secondary,{at:[.045,.17,-.07],rot:[0,0,ct/2]},16)])}function pv(n){const t=st([E(.34,.23,.014,n.primary,{at:[0,.115,0]},.006),Ce(.3,.19,.004,dt.glow(n,"#8fd3ff"),{at:[0,.12,.008]}),Ce(.12,.07,.004,dt.glow(n,"#ffd0f0"),{at:[-.06,.15,.0095]}),Ce(.1,.02,.004,dt.glow(n,"#fff6c8"),{at:[.07,.08,.0095]}),Y(.03,.03,.004,n.secondary,{at:[.07,.14,-.008],rot:[ct/2,0,0]},20),Gn(Ei(.03,.014),.003,n.secondary,{at:[-.07,.08,-.009]},.001)],{at:[0,.02,-.115],rot:[-.3,0,0]});return st([E(.34,.02,.24,n.primary,{at:[0,.01,0]},.006),Ce(.29,.004,.1,dt.ink(n),{at:[0,.021,-.035]}),Ce(.1,.003,.06,n.fixed("#cfd3da"),{at:[0,.0205,.07]}),t])}function mv(n){const t=dt.white(n),e=[ve([[0,0],[.09,0],[.095,.01],[.085,.06],[.07,.065],[0,.065]],n.primary),$t(.089,.008,n.secondary,{at:[0,.032,0],rot:[ct/2,0,0]}),Y(.072,.072,.012,t,{at:[0,.075,0]},24),Y(.008,.008,.03,dt.darkWood(n),{at:[0,.09,0]},8),Te(.04,.06,n.fixed("#3f8f5a"),{at:[0,.125,0]},16),Te(.028,.045,n.fixed("#3f8f5a"),{at:[0,.158,0]},16),F(.008,dt.glow(n,"#ffe066"),{at:[0,.184,0]},8),F(.085,n.fixed("#e6f6ff",{opacity:.28,roughness:.05}),{at:[0,.14,0]},32)],i=[[.04,.17,.03],[-.045,.19,0],[.02,.2,-.04],[-.03,.12,.05],[.05,.11,-.02],[-.02,.16,-.05]];for(const s of i)e.push(F(.006,t,{at:s},6));return st(e)}function gv(n){return st([ve([[0,0],[.042,0],[.045,.005],[.045,.1],[.038,.1],[.038,.01],[0,.01]],n.primary),Y(.038,.038,.005,n.fixed("#5b3420",{roughness:.3}),{at:[0,.085,0]},24),$t(.027,.009,n.primary,{at:[.05,.052,0]}),Y(.0465,.0465,.014,n.secondary,{at:[0,.075,0]},32),Gn($h(.032),.004,n.secondary,{at:[0,.04,.046]},.002)])}function _v(n){const t=dt.orange(n),e=n.fixed("#e0383e",{roughness:.35}),i=n.fixed("#9fd14a",{roughness:.35}),s=n.fixed("#7a3f9a",{roughness:.3}),r=[ve([[0,0],[.07,0],[.075,.012],[.12,.04],[.155,.085],[.165,.1],[.152,.1],[.14,.087],[.105,.052],[0,.044]],n.primary),F(.05,t,{at:[-.05,.085,.02]},20),F(.05,t,{at:[.055,.085,-.045]},20),F(.045,e,{at:[.045,.085,.06],scale:[1,.9,1]},20),F(.042,i,{at:[-.06,.08,-.07],scale:[1,.9,1]},20),se([.045,.12,.06],[.05,.14,.062],.005,dt.darkWood(n),6),$t(.085,.022,n.fixed("#ffd84a",{roughness:.5}),{at:[0,.135,-.01],rot:[ct/2-.25,0,.5]},1.7)],a=[[.1,.11,.01],[.12,.1,.035],[.105,.095,.05],[.125,.125,.02],[.11,.13,.045]];for(const o of a)r.push(F(.02,s,{at:o},12));return st(r)}function vv(n){const t=[ve(Ma(.15,.19,.38),n.primary),Y(.185,.185,.012,dt.soil(n),{at:[0,.356,0]},32)],e=[[4,.42,1.25,.55,.3],[5,.4,.85,.42,0],[5,.38,.45,.32,.6]];for(const[i,s,r,a,o]of e)for(let l=0;l<i;l++){const c=l/i*ct*2+o,h=[0,s,0];t.push(Ai(h,Ln(h,la(c,r),a),.16,.025,n.secondary))}return st(t)}function xv(n){const t=dt.stem(n),e=[ve(Ma(.17,.21,.4),n.primary),Y(.205,.205,.012,dt.soil(n),{at:[0,.376,0]},32)],i=[[.3,.12,.95,.45,.5,.44],[1.55,.16,.8,.25,.48,.42],[2.75,.15,.9,.35,.5,.44],[3.95,.17,.76,.2,.46,.4],[5.15,.14,.86,.35,.48,.42],[.9,.04,1.02,1.05,.36,.3]];for(const[s,r,a,o,l,c]of i){const h=ze(r,s,a);e.push(se([0,.37,0],h,.012,t,8));const u=Gn(q1(l,c),.008,n.secondary,{},.006);u.position.copy(hn(h)),u.quaternion.copy(Y1(hn(la(s,o)))),e.push(u)}return st(e)}function yv(n){const t=n.fixed("#ff7fb0");return st([ve(Ma(.07,.088,.14),n.primary),Y(.085,.085,.01,dt.soil(n),{at:[0,.122,0]},24),Pn(.055,.17,n.secondary,{at:[0,.26,0]}),xe([.03,.22,0],[.11,.22,0],.032,n.secondary),xe([.11,.22,0],[.11,.31,0],.032,n.secondary),xe([-.03,.27,0],[-.1,.27,0],.028,n.secondary),xe([-.1,.27,0],[-.1,.33,0],.028,n.secondary),Gn(Qh(.035),.01,t,{at:[0,.41,0],rot:[-ct/2,0,0]},.004),F(.013,n.fixed("#ffd84a"),{at:[0,.418,0]},10)])}function Mv(n){const t=n.fixed("#9a7048",{roughness:.9}),e=[ve(Ma(.24,.3,.46),n.primary),Y(.295,.295,.012,dt.soil(n),{at:[0,.436,0]},32)],i=[];for(let a=0;a<=5;a++)i.push([.14*(a/5)**2,.42+a*.38,0]);for(let a=0;a<5;a++){const o=i[a],l=i[a+1];!o||!l||e.push(ya(Y(.11-a*.008,.088-a*.008,xa(o,l)+.02,t,{},12),o,l))}const s=i[5]??[0,2.32,0];for(let a=0;a<8;a++){const o=a/8*ct*2+.3,l=a%2===0?.45:.3,c=Ln(s,la(o,l),.62),h=Ln(c,la(o,-.6),.58);e.push(Ai(s,c,.32,.035,n.secondary),Ai(c,h,.26,.035,n.secondary))}const r=n.fixed("#6b4a2b");for(let a=0;a<3;a++)e.push(F(.075,r,{at:Ln(s,ze(.09,a*2.1+.5,-.08))},12));return st(e)}function Sv(n){const t=n.fixed("#c9a878",{roughness:.9}),e=[$t(.03,.008,dt.steel(n),{at:[0,-.04,0]}),ve([[0,-.68],[.09,-.68],[.15,-.63],[.175,-.54],[.185,-.5],[.165,-.5],[0,-.51]],n.primary)];for(let s=0;s<3;s++)e.push(se([0,-.07,0],ze(.16,s/3*ct*2+.5,-.5),.008,t,6));for(let s=0;s<5;s++){const r=s/5*ct*2+.2;e.push(Ai([0,-.47,0],ze(.25,r,-.53),.13,.03,n.secondary))}const i=[[.2,.72],[1.7,.55],[3.2,.68],[4.7,.5]];for(const[s,r]of i){const a=ze(.2,s,-.52),o=ze(.24,s,-.52-r);e.push(se(a,o,.01,dt.stem(n),6));for(let l=0;l<3;l++){const c=.3+l*.3,h=[a[0]+(o[0]-a[0])*c,a[1]+(o[1]-a[1])*c,a[2]+(o[2]-a[2])*c],u=l%2===0?1:-1,f=[Math.cos(s)*u*.1,-.05,-Math.sin(s)*u*.1];e.push(Ai(h,Ln(h,f),.075,.022,n.secondary))}}return st(e)}function bv(n){const t=dt.stem(n),e=n.fixed("#ffd84a"),i=n.fixed("#fffaf0"),s=[ve([[0,0],[.06,0],[.08,.06],[.075,.13],[.045,.19],[.04,.22],[.052,.24],[.036,.24],[0,.23]],n.primary),Ai([0,.24,0],[.12,.32,.04],.05,.012,dt.leaf(n)),Ai([0,.24,0],[-.11,.3,-.03],.05,.012,dt.leaf(n))],r=[[[0,.5,.02],n.secondary],[[-.1,.45,.04],i],[[.1,.46,-.02],n.secondary],[[-.05,.42,-.09],n.secondary],[[.07,.41,.09],i]],a=[0,.2,0];for(const[o,l]of r){s.push(se(a,o,.008,t,6));const c=[o[0]-a[0],o[1]-a[1]+.25,o[2]-a[2]];s.push(fs(Gn(Qh(.055),.01,l,{},.005),o,c));const h=hn(c).normalize().multiplyScalar(.012);s.push(F(.018,e,{at:[o[0]+h.x,o[1]+h.y,o[2]+h.z]},12))}return st(s)}function wv(n){const t=dt.darkWood(n);return st([E(.36,.08,.22,n.primary,{at:[0,.045,0]},.02),E(.38,.02,.24,n.primary,{at:[0,.085,0]},.008),E(.05,.01,.05,n.primary,{at:[-.13,.005,0]},.004),E(.05,.01,.05,n.primary,{at:[.13,.005,0]},.004),Ce(.33,.012,.19,n.fixed("#6f9a4c"),{at:[0,.092,0]}),F(.035,n.fixed("#9a9aa2"),{at:[.12,.1,.05],scale:[1.3,.7,1]},7),xe([.03,.09,0],[-.03,.16,.01],.026,t),xe([-.03,.16,.01],[.04,.24,-.01],.022,t),xe([.04,.24,-.01],[0,.3,0],.018,t),xe([.04,.24,-.01],[.12,.27,.02],.014,t),xe([-.03,.16,.01],[-.11,.2,.03],.014,t),F(.09,n.secondary,{at:[0,.33,0],scale:[1.2,.5,.9]},16),F(.07,n.secondary,{at:[.14,.285,.02],scale:[1.2,.5,.9]},16),F(.065,n.secondary,{at:[-.13,.22,.03],scale:[1.2,.5,.9]},16)])}function Ev(n){const t=dt.white(n),e=dt.ink(n),i=[ve([[0,0],[.2,0],[.22,.03],[.17,.2],[.14,.5],[.15,.62],[0,.62]],n.secondary),Y(.42,.3,.04,n.fixed("#f3dcc8"),{at:[0,.6,0]},40),ys(.46,n.primary,0,ct/2,{at:[0,.6,0],scale:[1,.68,1]},40),$t(.44,.03,n.primary,{at:[0,.6,0],rot:[ct/2,0,0]}),F(.022,e,{at:[-.05,.34,.15]},12),F(.022,e,{at:[.05,.34,.15]},12),F(.025,dt.blush(n),{at:[-.09,.3,.133],scale:[1,.6,.4]},12),F(.025,dt.blush(n),{at:[.09,.3,.133],scale:[1,.6,.4]},12),$t(.022,.006,e,{at:[0,.31,.157],rot:[0,0,ct]},ct),Y(.05,.06,.16,n.secondary,{at:[.38,.08,.18]},16),ys(.11,n.primary,0,ct/2,{at:[.38,.15,.18],scale:[1,.7,1]}),F(.025,t,{at:[.38,.226,.18],scale:[1,.35,1]},12)],s=[[0,0],[.85,.3],[.9,1.6],[.95,2.9],[.85,4.3],[1,5.4],[.55,1]];for(const[r,a]of s){const o=rl([0,.6,0],.46,.313,r,a);i.push(Kh(F(.07,t,{scale:[1,.3,1]},16),o.pos,o.n))}return st(i)}function Tv(n){const t=dt.gold(n),e=[Y(.2,.16,.25,n.fixed("#c9a46a",{roughness:.8}),{at:[0,.125,0]},20),$t(.19,.02,n.fixed("#a8834e"),{at:[0,.2,0],rot:[ct/2,0,0]}),Y(.05,.05,.15,dt.darkWood(n),{at:[0,.3,0]},12)],i=[[.3,.62,.7,[.3,1.9,3.5,5.1]],[.68,.48,.6,[1,3.1,5.2]],[1.02,.34,.52,[.5,2.6,4.7]]];let s=0;for(const[r,a,o,l]of i){e.push(Te(a,o,n.primary,{at:[0,r+o/2,0]},28));for(const c of l)e.push(F(.06,s%2===0?n.secondary:t,{at:ze(a*(1-.14)+.015,c,r+.14*o-.02)},16)),s++}return e.push(Gn(Ei(.11,.05),.03,dt.glow(n,"#ffd84a"),{at:[0,1.6,0]},.01)),st(e)}function Av(n){const t=n.primary,e=[F(.2,n.fixed("#8a8f98",{roughness:1}),{at:[0,.1,0],scale:[1.5,.5,1.1]},7)],i=[[[0,.12,0],[0,.35,0],.05],[[0,.35,0],[-.18,.55,.03],.042],[[0,.35,0],[.15,.6,-.02],.042],[[-.18,.55,.03],[-.28,.75,.05],.035],[[-.18,.55,.03],[-.1,.8,.08],.035],[[.15,.6,-.02],[.25,.82,0],.035],[[.15,.6,-.02],[.08,.78,-.08],.035],[[0,.3,0],[.06,.46,.14],.038],[[.06,.46,.14],[.12,.64,.2],.032]];for(const[s,r,a]of i)e.push(xe(s,r,a,t));return e.push(F(.12,n.secondary,{at:[.26,.1,.12],scale:[1,.75,1]},20),Y(.045,.035,.22,n.secondary,{at:[-.26,.16,.1]},14),Y(.038,.03,.16,n.secondary,{at:[-.18,.13,.17]},14),Y(.03,.03,.005,n.fixed("#3a1f2a"),{at:[-.26,.272,.1]},14)),st(e)}function Rv(n){const t=dt.ink(n),e=$t(.115,.022,n.primary,{at:[0,.024,-.005]},ct*.9);return e.rotation.order="YXZ",e.rotation.set(ct/2,ct/2,0),st([F(.1,n.primary,{at:[0,.115,-.01],scale:[.9,1.15,1]}),F(.06,n.secondary,{at:[0,.13,.06],scale:[1,1.2,.6]}),F(.06,n.primary,{at:[-.065,.055,-.02]},16),F(.06,n.primary,{at:[.065,.055,-.02]},16),xe([-.04,.025,.075],[-.04,.12,.06],.025,n.primary),xe([.04,.025,.075],[.04,.12,.06],.025,n.primary),F(.027,n.secondary,{at:[-.04,.02,.085],scale:[1,.7,1.2]},12),F(.027,n.secondary,{at:[.04,.02,.085],scale:[1,.7,1.2]},12),F(.075,n.primary,{at:[0,.27,.025],scale:[1.15,1,1]}),Te(.032,.055,n.primary,{at:[-.052,.345,.02],rot:[0,0,.3]},12),Te(.032,.055,n.primary,{at:[.052,.345,.02],rot:[0,0,-.3]},12),Te(.018,.032,n.secondary,{at:[-.05,.342,.036],rot:[0,0,.3]},10),Te(.018,.032,n.secondary,{at:[.05,.342,.036],rot:[0,0,-.3]},10),F(.03,n.secondary,{at:[0,.25,.085],scale:[1.4,.8,.8]},12),F(.01,dt.blush(n),{at:[0,.262,.108]},8),F(.012,t,{at:[-.032,.285,.088],scale:[1,1.3,.6]},10),F(.012,t,{at:[.032,.285,.088],scale:[1,1.3,.6]},10),e,F(.026,n.secondary,{at:[.115*Math.sin(ct*.9),.026,-.005+.115*-Math.cos(ct*.9)]},12)])}function Cv(n){const t=dt.ink(n),e=n.fixed("#f6e7cf"),i=n.fixed("#e0383e");return st([F(.16,n.primary,{at:[0,.2,-.03],scale:[.9,1.1,1.05]}),F(.1,e,{at:[0,.22,.06],scale:[1,1.2,.6]},16),F(.1,n.primary,{at:[-.1,.095,-.06]},16),F(.1,n.primary,{at:[.1,.095,-.06]},16),xe([-.065,.04,.1],[-.065,.22,.08],.04,n.primary),xe([.065,.04,.1],[.065,.22,.08],.04,n.primary),F(.05,e,{at:[-.065,.03,.13],scale:[1,.6,1.3]},12),F(.05,e,{at:[.065,.03,.13],scale:[1,.6,1.3]},12),F(.13,n.primary,{at:[0,.42,.05]}),F(.07,e,{at:[0,.38,.15],scale:[1,.8,1.1]},16),F(.025,t,{at:[0,.405,.225]},12),F(.018,t,{at:[-.05,.45,.155]},10),F(.018,t,{at:[.05,.45,.155]},10),F(.025,dt.blush(n),{at:[0,.345,.2],scale:[1,.5,1]},10),F(.07,n.secondary,{at:[-.13,.4,.04],rot:[0,0,.3],scale:[.45,1,.8]},16),F(.07,n.secondary,{at:[.13,.4,.04],rot:[0,0,-.3],scale:[.45,1,.8]},16),$t(.105,.02,i,{at:[0,.31,.02],rot:[ct/2-.2,0,0]}),F(.022,dt.gold(n),{at:[0,.28,.13]},10),xe([0,.13,-.17],[0,.23,-.26],.025,n.primary)])}function Pv(n){const t=n.fixed("#f3f6ff",{opacity:.88,emissive:!0}),e=dt.ink(n),i=[Y(.28,.28,.006,n.fixed("#1c1a2a",{opacity:.22}),{at:[0,.003,0]},32),ve([[0,.32],[.3,.3],[.36,.34],[.34,.55],[.3,.8],[.27,.98],[.2,1.12],[.11,1.19],[0,1.21]],t),xe([-.28,.72,.02],[-.42,.82,.08],.055,t),xe([.28,.72,.02],[.42,.82,.08],.055,t),F(.045,e,{at:[-.09,.92,.258],scale:[.8,1.2,.5]},16),F(.045,e,{at:[.09,.92,.258],scale:[.8,1.2,.5]},16),F(.035,e,{at:[0,.8,.292],scale:[.8,1.1,.4]},16),F(.03,dt.blush(n),{at:[-.155,.84,.245],scale:[1,.6,.4]},12),F(.03,dt.blush(n),{at:[.155,.84,.245],scale:[1,.6,.4]},12)];for(let s=0;s<9;s++)i.push(F(.075,t,{at:ze(.3,s/9*ct*2,.33),rot:[0,s/9*ct*2,0],scale:[1,.75,.8]},16));return st(i)}function Lv(n){const t=dt.ink(n),e=dt.steel(n),i=dt.glow(n,"#5ff2ff");return st([E(.16,.08,.22,t,{at:[-.12,.04,.02]},.03),E(.16,.08,.22,t,{at:[.12,.04,.02]},.03),Y(.05,.05,.22,e,{at:[-.12,.18,0]},16),Y(.05,.05,.22,e,{at:[.12,.18,0]},16),E(.46,.38,.32,n.primary,{at:[0,.47,0]},.06),E(.26,.16,.02,t,{at:[0,.5,.162]},.01),F(.022,dt.glow(n,"#ff5a5a"),{at:[-.07,.53,.175]},10),F(.022,dt.glow(n,"#ffe066"),{at:[0,.53,.175]},10),F(.022,dt.glow(n,"#6dff8a"),{at:[.07,.53,.175]},10),E(.18,.03,.01,n.secondary,{at:[0,.46,.172]},.005),Y(.06,.06,.06,e,{at:[0,.68,0]},16),E(.34,.26,.28,n.primary,{at:[0,.83,0]},.06),Y(.045,.045,.02,i,{at:[-.075,.86,.143],rot:[ct/2,0,0]},20),Y(.045,.045,.02,i,{at:[.075,.86,.143],rot:[ct/2,0,0]},20),E(.14,.04,.02,t,{at:[0,.76,.142]},.008),Y(.04,.04,.04,n.secondary,{at:[-.19,.83,0],rot:[0,0,ct/2]},16),Y(.04,.04,.04,n.secondary,{at:[.19,.83,0],rot:[0,0,ct/2]},16),se([0,.96,0],[0,1.04,0],.01,e,8),F(.035,n.secondary,{at:[0,1.06,0]},16),xe([-.27,.58,0],[-.31,.36,.03],.05,n.primary),xe([.27,.58,0],[.31,.36,.03],.05,n.primary),$t(.045,.018,n.secondary,{at:[-.315,.29,.035],rot:[0,ct/2,0]},ct*1.4),$t(.045,.018,n.secondary,{at:[.315,.29,.035],rot:[0,ct/2,0]},ct*1.4)])}function Dv(n){const t=[[.2,.78],[.21,.26],[.44,.01],[.5,.01],[.5,.2],[.26,.55]],e=[ve([[0,.2],[.17,.2],[.22,.32],[.25,.6],[.255,.9],[.24,1.15],[.2,1.3],[0,1.3]],n.primary,{},40),ve([[0,1.26],[.205,1.27],[.19,1.42],[.13,1.58],[.06,1.7],[0,1.76]],n.secondary,{},40),Y(.12,.16,.16,dt.steel(n),{at:[0,.14,0]},24),Y(.258,.258,.05,n.secondary,{at:[0,.75,0]},40),$t(.075,.02,n.secondary,{at:[0,1,.248]}),Y(.07,.07,.02,n.fixed("#9fe3ff",{emissive:!0}),{at:[0,1,.243],rot:[ct/2,0,0]},24)];for(const i of[ct/2,7*ct/6,11*ct/6])e.push(st([Gn(t,.035,n.secondary,{},.01)],{rot:[0,i,0]}));return st(e)}function Iv(n){const t=$t(.5,.07,n.secondary,{scale:[1,1,.16]});return st([Y(.05,.05,.02,dt.ink(n),{at:[0,-.01,0]},16),se([0,-.02,0],[0,-.51,0],.008,n.fixed("#e8e2d0"),6),F(.3,n.primary,{at:[0,-.8,0]},40),sl(.304,n.secondary,0,ct*2,1,.22,{at:[0,-.8,0]}),sl(.304,n.secondary,0,ct*2,1.85,.14,{at:[0,-.8,0]}),st([st([t],{rot:[ct/2,0,0]})],{at:[0,-.8,0],rot:[.35,0,.2]}),F(.06,n.fixed("#d8d4cc"),{at:[.45,-.55,.15]},16),se([.45,-.02,.15],[.45,-.49,.15],.006,n.fixed("#e8e2d0"),6)])}function Nv(n){const t=n.fixed("#8a5a35",{roughness:.8}),e=dt.ink(n),i=[0,.95,0],s=[];for(const c of[0,2*ct/3,4*ct/3]){const h=ze(.42,c,.03);s.push(se(Ln(i,[0,-.02,0]),Ln(h,[0,.01,0]),.022,t,10)),s.push(F(.03,e,{at:h},10))}s.push(F(.06,e,{at:i},16),Y(.045,.045,.1,e,{at:[0,1,0]},16));const r=new P(.75,.6,-.28).normalize(),a=[r.x,r.y,r.z],o=[0,1.1,0],l=(c,h=0)=>Ln(Ln(o,a,c),[0,h,0]);return s.push(se(l(-.42),l(.52),.075,n.primary,24),se(l(.48),l(.68),.092,n.secondary,24),se(l(.67),l(.69),.075,n.fixed("#9fd6ff",{roughness:.1}),24),se(l(-.06),l(.06),.082,n.secondary,24),se(l(-.46),l(-.41),.06,e,16),se(l(-.3,.06),l(-.3,.16),.022,e,12),se(l(-.12,.11),l(.16,.11),.022,dt.steel(n),12)),st(s)}function Uv(n){const t=n.fixed("#3fa45a"),e=dt.steel(n),i=(r,a,o)=>{const l=n.fixed(r,{roughness:.4});return st([F(.05,l,{scale:[1.4,1,.5]},16),Te(.035,.05,l,{at:[-.085,0,0],rot:[0,0,-ct/2],scale:[1,1,.4]},12)],{at:a,rot:[0,o?ct:0,0]})},s=[E(1,.7,.45,n.primary,{at:[0,.35,0]},.03),E(.44,.54,.02,n.secondary,{at:[-.235,.36,.228]},.01),E(.44,.54,.02,n.secondary,{at:[.235,.36,.228]},.01),F(.018,e,{at:[-.05,.4,.245]},10),F(.018,e,{at:[.05,.4,.245]},10),E(1,.04,.45,n.secondary,{at:[0,.72,0]},.01),E(1.02,.05,.47,n.secondary,{at:[0,1.285,0]},.015),Ce(.97,.5,.42,n.fixed("#6cc8f0",{opacity:.42,roughness:.1}),{at:[0,.99,0]}),Ce(.96,.05,.41,n.fixed("#e6c78f",{roughness:1}),{at:[0,.765,0]}),xe([-.35,.78,-.1],[-.38,1.05,-.12],.025,t),xe([-.28,.78,-.12],[-.25,.98,-.1],.022,t),xe([.35,.78,-.13],[.38,1.1,-.1],.025,t),F(.08,n.fixed("#8d8a96",{roughness:1}),{at:[.22,.79,-.08],scale:[1.4,.8,1]},7),i("#ff8a2a",[-.15,1.05,.05],!1),i("#ffd84a",[.15,.92,.02],!0),i("#ff6bb5",[.05,1.15,-.08],!1)];for(const r of[-.485,.485])for(const a of[-.21,.21])s.push(Ce(.03,.52,.03,n.secondary,{at:[r,1,a]}));return st(s)}function Fv(n){const i=st([Oe(Z1(1.9,.55),.03,n.primary,{at:[0,0,-.015]},.012),E(.06,1.5579999999999998,.062,n.secondary,{at:[0,.8929999999999999,0]},.02),E(.02,.1,.09,n.secondary,{at:[0,.2,-.06]},.008)],{at:[0,.03,.02],rot:[-.12,0,0]});return st([E(.5,.08,.26,n.fixed("#8b5a3c",{roughness:.8}),{at:[0,.04,0]},.02),i])}function Ov(n){const t=n.fixed("#c79a62",{roughness:.8}),e=[[.32,.45],[.2,.34],[.07,.3],[-.06,.36],[-.18,.6],[-.3,.88]],i=.022,s=e.map((l,c)=>{const h=e[Math.max(0,c-1)]??l,u=e[Math.min(e.length-1,c+1)]??l,f=u[0]-h[0],d=u[1]-h[1],g=Math.hypot(f,d)||1;return[l[0]+-d/g*i,l[1]+f/g*i]}),r=[...e,...s.reverse()],a=[],o=.1;for(let l=0;l<5;l++){const c=-.25+l*o;a.push(Oe(r,o-.008,l%2===0?n.primary:n.secondary,{at:[c+o-.004,0,0],rot:[0,-ct/2,0]},.004))}for(const l of[-.28,.28])a.push(ca([l,.02,.42],[l,.95,-.36],.035,.05,t),ca([l,.02,-.4],[l,.47,.34],.035,.05,t));return a.push(se([-.31,.46,.33],[.31,.46,.33],.02,t),se([-.31,.9,-.315],[.31,.9,-.315],.02,t),se([-.31,.05,-.37],[.31,.05,-.37],.02,t)),st(a)}function Bv(n){const t=dt.gold(n),e=[E(.5,.08,.5,n.primary,{at:[0,.04,0]},.02),Jh(.15,.17,.7,12,.05,n.primary,{at:[0,.43,0]}),E(.44,.07,.44,n.primary,{at:[0,.815,0]},.02),E(.38,.1,.38,n.secondary,{at:[0,.9,0]},.05),ve([[.1,.94],[.118,.94],[.122,1.02],[.104,1.02],[.1,.94]],t),ys(.1,n.secondary,0,ct/2,{at:[0,.98,0],scale:[1,.7,1]})];for(const s of[-.18,.18])for(const r of[-.18,.18])e.push(F(.022,t,{at:[s,.86,r]},10));for(let s=0;s<5;s++)e.push(Te(.026,.07,t,{at:ze(.11,s/5*ct*2,1.055)},10));return[n.fixed("#e0304e",{roughness:.15}),n.fixed("#3b6fe0",{roughness:.15}),n.fixed("#2fb37a",{roughness:.15})].forEach((s,r)=>e.push(F(.018,s,{at:ze(.122,(r-1)*.7,.98)},8))),st(e)}function zv(n){const t=n.fixed("#c9ccd4",{metalness:.8,roughness:.3}),e=[Y(.03,.03,.05,n.primary,{at:[0,.12,0]},16),Y(.022,.022,1.28,n.primary,{at:[0,.76,0]},12),Y(.034,.034,.06,n.secondary,{at:[0,.85,0]},16),F(.03,n.primary,{at:[0,1.4,0]},12)];for(const o of[ct/3,ct,5*ct/3]){const l=ze(.3,o,.025);e.push(se([0,.12,0],l,.02,n.primary,8),F(.025,dt.ink(n),{at:l},10))}const i=[0,1.4,0],s=[0,1.49,.09],r=hn(s).sub(hn(i)).normalize(),a=Ln(s,[r.x,r.y,r.z],.045);return e.push(se(i,s,.03,n.secondary,16),F(.065,t,{at:Ln(a,[r.x,r.y,r.z],.01)},20),fs($t(.064,.011,n.secondary),Ln(a,[r.x,r.y,r.z],.01),[r.x,r.y,r.z])),st(e)}function kv(n){const t=dt.darkWood(n),e=dt.ink(n),i=st([Oe($1(),.08,n.primary,{at:[0,0,-.04]},.015),Y(.05,.05,.006,e,{at:[0,.4,.055],rot:[ct/2,0,0]},24),$t(.058,.007,n.secondary,{at:[0,.4,.056]}),E(.12,.03,.016,t,{at:[0,.15,.06]},.006),E(.055,.44,.035,t,{at:[0,.81,.03]},.01),E(.085,.16,.03,t,{at:[0,1.09,.025]},.012),Ce(.028,.95,.004,n.fixed("#efe9dc"),{at:[0,.625,.062]})],{at:[0,.06,.04],rot:[-.28,0,0]}),s=[0,.74,-.2];return st([i,E(.36,.035,.07,e,{at:[0,.07,.06]},.01),E(.03,.06,.03,e,{at:[-.16,.1,.09]},.01),E(.03,.06,.03,e,{at:[.16,.1,.09]},.01),se([-.16,.06,.06],[-.16,.015,-.05],.014,e,8),se([.16,.06,.06],[.16,.015,-.05],.014,e,8),se([-.16,.015,-.05],s,.014,e,8),se([.16,.015,-.05],s,.014,e,8),se(s,[0,.015,-.44],.014,e,8),E(.1,.04,.05,e,{at:[0,.76,-.185]},.012)],{at:[0,0,.17]})}function Gv(n){const t=dt.steel(n),e=[];for(const s of[-.42,.42])e.push(E(.06,.04,.56,n.primary,{at:[s,.02,0]},.012),ca([s,.02,.2],[s,.74,-.15],.05,.05,n.primary));const i=[[.28,.074,.065],[.58,-.072,.05]];for(const[s,r,a]of i){e.push(E(.92,.035,.24,n.primary,{at:[0,s,r]},.01),E(.92,.04,.025,n.primary,{at:[0,s+.03,r+.11]},.01));const o=s+.0175+a;for(const l of[-.21,.21])e.push(se([l-.12,o,r],[l+.12,o,r],.016,t,10),Y(a,a,.07,n.secondary,{at:[l-.1,o,r],rot:[0,0,ct/2]},6),Y(a,a,.07,n.secondary,{at:[l+.1,o,r],rot:[0,0,ct/2]},6))}return st(e)}function Hv(n){const t=n.fixed("#26232b",{roughness:.9}),e=n.fixed("#6b4a2b",{roughness:.9}),i=dt.ink(n),s=(o,l)=>Math.sqrt(Math.max(0,.16*.16-o*o-(l-1)**2)),r=(o,l)=>Math.sqrt(Math.max(0,.22*.22-o*o-(l-.7)**2)),a=[F(.3,n.primary,{at:[0,.279,0],scale:[1,.93,1]},32),F(.22,n.primary,{at:[0,.7,0]},32),F(.16,n.primary,{at:[0,1,0]},28),Y(.15,.15,.025,i,{at:[0,1.13,0]},24),Y(.1,.1,.18,i,{at:[0,1.23,0]},24),Y(.103,.103,.04,n.secondary,{at:[0,1.165,0]},24),Te(.03,.14,dt.orange(n),{at:[0,.99,.2],rot:[ct/2,0,0]},12),F(.022,t,{at:[-.055,1.05,s(.055,1.05)]},10),F(.022,t,{at:[.055,1.05,s(.055,1.05)]},10),$t(.15,.045,n.secondary,{at:[0,.86,0],rot:[ct/2,0,0]}),E(.08,.22,.03,n.secondary,{at:[.08,.76,r(.08,.76)+.02],rot:[.2,0,.15]},.012),se([.2,.75,0],[.45,.92,0],.015,e,6),se([.4,.886,0],[.47,.86,.02],.012,e,6),se([-.2,.75,0],[-.45,.92,0],.015,e,6),se([-.4,.886,0],[-.46,.95,.02],.012,e,6)];for(const o of[-.05,0,.05]){const l=.94+4*o*o;a.push(F(.012,t,{at:[o,l,s(o,l)]},8))}for(const o of[.62,.7,.78])a.push(F(.025,t,{at:[0,o,r(0,o)]},10));return st(a)}function Vv(n){const t=dt.ink(n),e=dt.white(n),i=dt.orange(n);return st([F(.22,n.primary,{at:[0,.297,0],scale:[1,1.35,.95]},32),F(.18,e,{at:[0,.27,.125],scale:[.9,1.2,.6]},24),F(.028,t,{at:[-.062,.45,.17]},12),F(.028,t,{at:[.062,.45,.17]},12),F(.009,e,{at:[-.054,.46,.195]},6),F(.009,e,{at:[.07,.46,.195]},6),Te(.035,.07,i,{at:[0,.41,.215],rot:[ct/2,0,0]},12),F(.025,dt.blush(n),{at:[-.1,.4,.16],scale:[1,.6,.4]},10),F(.025,dt.blush(n),{at:[.1,.4,.16],scale:[1,.6,.4]},10),F(.1,n.primary,{at:[-.21,.3,0],rot:[0,0,.4],scale:[.25,1,.5]},16),F(.1,n.primary,{at:[.21,.3,0],rot:[0,0,-.4],scale:[.25,1,.5]},16),F(.06,i,{at:[-.08,.024,.12],scale:[1,.4,1.4]},12),F(.06,i,{at:[.08,.024,.12],scale:[1,.4,1.4]},12),ys(.158,n.secondary,0,ct/2,{at:[0,.52,0]},24),$t(.152,.022,n.secondary,{at:[0,.525,0],rot:[ct/2,0,0]}),F(.042,e,{at:[0,.69,0]},12)])}function Wv(n){const t=dt.gold(n),e=dt.ink(n),i=[E(.85,.18,.42,n.fixed("#efe8f7",{roughness:.5}),{at:[0,.09,0]},.03),Pn(.15,.32,n.primary,{at:[0,.56,0],rot:[0,0,ct/2]}),xe([.22,.62,0],[.32,.86,0],.085,n.primary),F(.11,n.primary,{at:[.34,.9,0],scale:[1.1,1,.9]}),F(.075,n.fixed("#ffd6e5"),{at:[.44,.85,0],scale:[1.1,.9,.9]},16),F(.016,e,{at:[.385,.93,.087]},10),F(.016,e,{at:[.385,.93,-.087]},10),Te(.028,.18,t,{at:[.37,1.07,0],rot:[0,0,-.35]},12),Te(.03,.07,n.primary,{at:[.29,1.01,.05],rot:[.3,0,.2]},10),Te(.03,.07,n.primary,{at:[.29,1.01,-.05],rot:[-.3,0,.2]},10),F(.065,n.secondary,{at:[.19,.8,0],scale:[1,1,.75]},16),F(.065,n.secondary,{at:[.235,.92,0],scale:[1,1,.75]},16),F(.06,n.secondary,{at:[.29,1,0],scale:[1,1,.75]},16),F(.07,n.secondary,{at:[-.33,.58,0],scale:[1,1,.75]},16),F(.075,n.secondary,{at:[-.38,.47,0],scale:[1,1,.75]},16)];for(const s of[-.17,.17])for(const r of[-.08,.08])i.push(xe([s,.2,r],[s,.5,r],.05,n.primary),Y(.058,.064,.05,t,{at:[s,.205,r]},12));return st(i)}function Xv(n){const t=n.fixed("#c9a060",{roughness:1}),e=n.fixed("#8a6a3e",{roughness:1}),i=dt.glow(n,"#ffcf5a"),s=[Y(.08,.07,.03,e,{at:[0,.015,0]},16),$t(.1,.045,t,{at:[0,.045,0],rot:[ct/2,0,0]}),se([-.13,.05,.03],[-.17,.08,.09],.008,e,6),se([.12,.06,-.06],[.18,.09,-.08],.008,e,6),se([.04,.07,.12],[.08,.1,.17],.008,e,6),F(.1,n.primary,{at:[0,.19,0],scale:[1,1.3,1]},32)],r=[[.5,.3],[.9,2],[.7,3.5],[1.2,4.6],[.35,5.5],[1.3,1.1],[1.1,2.9]];for(const[o,l]of r){const c=rl([0,.19,0],.1,.13,o,l);s.push(Kh(F(.02,n.secondary,{scale:[1,.35,1]},12),c.pos,c.n))}const a=[[.9,0,.6],[1.05,.12,-.6],[1.2,0,.6]];for(const[o,l,c]of a){const h=rl([0,.19,0],.101,.131,o,l),u=fs(E(.01,.035,.008,i,{},.003),h.pos,h.n);u.rotateZ(c),s.push(u)}return st(s)}function Yv(n){const t=["#ff5a5a","#ffd84a","#5ac8ff","#7cff9a","#ffffff","#c38bff","#ff9a3c","#5ac8ff"],e=[Jh(.32,.25,.38,16,.04,n.primary,{at:[0,.19,0]}),Y(.3,.3,.04,n.fixed("#a86a3f"),{at:[0,.38,0]},32),$t(.25,.1,n.secondary,{at:[0,.45,0],rot:[ct/2,0,0]}),F(.16,n.secondary,{at:[0,.47,0],scale:[1,.6,1]},24),$t(.17,.09,n.secondary,{at:[0,.6,0],rot:[ct/2,0,0]}),$t(.08,.08,n.secondary,{at:[0,.73,0],rot:[ct/2,0,0]}),F(.07,n.fixed("#d42a3a",{roughness:.25}),{at:[0,.84,0]},20),se([0,.9,0],[.03,.96,-.01],.006,dt.stem(n),6)];return t.forEach((i,s)=>{const r=s/t.length*ct*2+.2;e.push(Pn(.012,.03,n.fixed(i),{at:ze(.3,r,.535),rot:[ct/2,r+s,.4*s]}))}),st(e)}function qv(n){const e=[Y(.06,.06,.02,dt.ink(n),{at:[0,-.01,0]},16),se([0,-.02,0],[0,-.37,0],.008,n.fixed("#e8e2d0"),6),ve([[0,-.1],[.2,-.1],[.42,-.02],[.46,0],[.42,.04],[.2,.08],[0,.08]],n.primary,{at:[0,-.6,0]},40),$t(.44,.025,n.secondary,{at:[0,-.6,0],rot:[ct/2,0,0]}),ys(.17,n.fixed("#bfe8ff",{opacity:.4,roughness:.05}),0,ct/2,{at:[0,-.53,0]}),F(.07,n.fixed("#7ddc6a"),{at:[0,-.47,0]},16),F(.022,dt.ink(n),{at:[-.028,-.45999999999999996,.058],scale:[.8,1.2,.6]},10),F(.022,dt.ink(n),{at:[.028,-.45999999999999996,.058],scale:[.8,1.2,.6]},10),Y(.17,.17,.02,dt.glow(n,"#9dffb0"),{at:[0,-.705,0]},32)];for(let i=0;i<8;i++)e.push(F(.026,dt.glow(n,i%2===0?"#fff07a":"#ff7ad9"),{at:ze(.44,i/8*ct*2,-.6+.022)},10));return st(e)}const $v=[{id:"rug_round",name:"Round Rug",category:"decor",placement:"floor",tags:["cozy","cute"],price:0,size:{w:1.9,h:.02,d:1.9},slots:2,defaultColors:{primary:"#e7a6a1",secondary:"#f6e3c8"},build:n=>{const t=[Y(.85,.85,.012,n.primary,{at:[0,.006,0]},48),Y(.7,.7,.016,n.secondary,{at:[0,.008,0]},48),Y(.56,.56,.018,n.primary,{at:[0,.009,0]},48),Y(.3,.3,.02,n.secondary,{at:[0,.01,0]},40)];for(let e=0;e<16;e++)t.push(Y(.1,.1,.012,n.primary,{at:ze(.85,e/16*ct*2,.006)},16));return st(t)}},{id:"rug_rect",name:"Rug",category:"decor",placement:"floor",tags:["cozy","modern"],price:0,size:{w:2.34,h:.022,d:1.5},slots:2,defaultColors:{primary:"#4f6d8f",secondary:"#e9d8b4"},build:n=>{const t=n.fixed("#f3e9d2",{roughness:1});return st([E(2.2,.014,1.5,n.secondary,{at:[0,.007,0]},.006),Ce(1.95,.018,1.25,n.primary,{at:[0,.009,0]}),Ce(1.5,.02,.85,n.secondary,{at:[0,.01,0]}),Ce(1.42,.021,.77,n.primary,{at:[0,.0105,0]}),Ce(.42,.022,.42,n.secondary,{at:[0,.011,0],rot:[0,ct/4,0]}),Ce(.07,.01,1.4,t,{at:[-1.135,.005,0]}),Ce(.07,.01,1.4,t,{at:[1.135,.005,0]})])}},{id:"books",name:"Book Stack",category:"decor",placement:"surface",tags:["office","cozy","magic"],price:0,size:{w:.29,h:.21,d:.22},slots:2,defaultColors:{primary:"#b5443c",secondary:"#3f8a68"},build:K1},{id:"cake",name:"Cake Stand",category:"decor",placement:"surface",tags:["food","cafe","cute","party"],price:0,size:{w:.34,h:.4,d:.34},slots:2,defaultColors:{primary:"#f6c9d6",secondary:"#fff7f0"},build:J1},{id:"coffee_machine",name:"Coffee Machine",category:"decor",placement:"surface",tags:["cafe","kitchen"],price:40,size:{w:.32,h:.4,d:.35},slots:1,defaultColors:{primary:"#d9473f",secondary:"#c9ccd4"},build:Q1},{id:"potions",name:"Potion Bottles",category:"decor",placement:"surface",tags:["magic","spooky","science"],price:50,size:{w:.28,h:.26,d:.22},slots:1,defaultColors:{primary:"#efe1bf",secondary:"#b3262e"},light:{color:"#8dff9f",intensity:1,distance:2,offset:[0,.1,0]},build:j1},{id:"cauldron",name:"Cauldron",category:"decor",placement:"floor",tags:["magic","spooky"],price:80,size:{w:.76,h:.76,d:.75},slots:1,defaultColors:{primary:"#33303a",secondary:"#5a5560"},light:{color:"#6dff7a",intensity:2.5,distance:3.5,offset:[0,.65,0]},build:tv},{id:"crystal_ball",name:"Crystal Ball",category:"decor",placement:"surface",tags:["magic","spooky","fantasy"],price:60,size:{w:.22,h:.27,d:.22},slots:2,defaultColors:{primary:"#4a3566",secondary:"#e2b84a"},light:{color:"#b48cff",intensity:1.6,distance:2.5,offset:[0,.16,0]},build:ev},{id:"skull",name:"Skull",category:"decor",placement:"surface",tags:["spooky"],price:0,size:{w:.17,h:.2,d:.19},slots:1,defaultColors:{primary:"#efe6cf",secondary:"#2a2631"},build:nv},{id:"candles",name:"Candles",category:"lighting",placement:"surface",tags:["spooky","cozy","magic"],price:0,size:{w:.29,h:.28,d:.29},slots:2,defaultColors:{primary:"#f7efdc",secondary:"#c99a3c"},light:{color:"#ffb45a",intensity:2,distance:3.5,offset:[0,.25,0]},build:iv},{id:"trophy",name:"Trophy",category:"decor",placement:"surface",tags:["sporty","glam"],price:50,size:{w:.31,h:.34,d:.2},slots:1,defaultColors:{primary:"#f2c14e",secondary:"#e8e2d0"},build:sv},{id:"teddy",name:"Teddy Bear",category:"decor",placement:"surface",tags:["cute","bedroom"],price:0,size:{w:.29,h:.4,d:.25},slots:2,defaultColors:{primary:"#b07a4e",secondary:"#f1d9b5"},build:rv},{id:"globe",name:"Globe",category:"decor",placement:"surface",tags:["office","retro"],price:30,size:{w:.3,h:.41,d:.27},slots:2,defaultColors:{primary:"#8a5a35",secondary:"#d9a441"},build:av},{id:"record_player",name:"Record Player",category:"decor",placement:"surface",tags:["music","retro"],price:70,size:{w:.44,h:.17,d:.37},slots:2,defaultColors:{primary:"#3c7a8c",secondary:"#efe6d6"},build:ov},{id:"boombox",name:"Boombox",category:"decor",placement:"surface",tags:["music","retro","party"],price:50,size:{w:.62,h:.43,d:.16},slots:2,defaultColors:{primary:"#e0503c",secondary:"#f2c14e"},build:lv},{id:"gifts",name:"Gift Boxes",category:"decor",placement:"surface",tags:["party","winter"],price:40,size:{w:.56,h:.47,d:.35},slots:2,defaultColors:{primary:"#d8443c",secondary:"#f2c14e"},build:cv},{id:"pumpkin",name:"Jack-o'-Lantern",category:"lighting",placement:"surface",tags:["spooky"],price:0,size:{w:.34,h:.27,d:.34},slots:1,defaultColors:{primary:"#f08a24",secondary:"#5f7d2e"},light:{color:"#ff9a2e",intensity:2,distance:3,offset:[0,.12,.2]},build:hv},{id:"shell",name:"Seashell",category:"decor",placement:"surface",tags:["beach","ocean"],price:0,size:{w:.43,h:.09,d:.27},slots:2,defaultColors:{primary:"#f6c1a8",secondary:"#ff8a5c"},build:uv},{id:"chest",name:"Treasure Chest",category:"decor",placement:"floor",tags:["ocean","fantasy","royal"],price:90,size:{w:.81,h:.92,d:.77},slots:2,defaultColors:{primary:"#8a5a35",secondary:"#e2b84a"},build:fv},{id:"microscope",name:"Microscope",category:"decor",placement:"surface",tags:["science"],price:60,size:{w:.18,h:.4,d:.22},slots:2,defaultColors:{primary:"#f2f0ea",secondary:"#3a7bd5"},build:dv},{id:"laptop",name:"Laptop",category:"decor",placement:"surface",tags:["office","modern"],price:0,size:{w:.34,h:.24,d:.31},slots:1,defaultColors:{primary:"#c9ccd4",secondary:"#ff7ab6"},build:pv},{id:"snow_globe",name:"Snow Globe",category:"decor",placement:"surface",tags:["winter","cute"],price:30,size:{w:.19,h:.23,d:.19},slots:1,defaultColors:{primary:"#b5443c",secondary:"#e2b84a"},build:mv},{id:"mug",name:"Mug",category:"decor",placement:"surface",tags:["cafe","cozy","kitchen"],price:0,size:{w:.13,h:.1,d:.1},slots:2,defaultColors:{primary:"#f4efe6",secondary:"#e8576a"},build:gv},{id:"fruit_bowl",name:"Fruit Bowl",category:"decor",placement:"surface",tags:["kitchen","food","tropical"],price:0,size:{w:.33,h:.18,d:.33},slots:1,defaultColors:{primary:"#c98a52",secondary:"#e9d8b4"},build:_v},{id:"plant",name:"Potted Plant",category:"plants",placement:"floor",tags:["nature","modern"],price:0,size:{w:.55,h:.94,d:.56},slots:2,defaultColors:{primary:"#f2ede4",secondary:"#4f9a4a"},build:vv},{id:"monstera",name:"Monstera",category:"plants",placement:"floor",tags:["nature","tropical"],price:0,size:{w:1.18,h:1.34,d:1.13},slots:2,defaultColors:{primary:"#c9704a",secondary:"#2f8a4a"},build:xv},{id:"cactus",name:"Cactus",category:"plants",placement:"surface",tags:["nature","beach"],price:0,size:{w:.27,h:.43,d:.22},slots:2,defaultColors:{primary:"#d9805a",secondary:"#5fae5a"},build:yv},{id:"palm",name:"Palm Tree",category:"plants",placement:"floor",tags:["tropical","beach"],price:60,size:{w:1.98,h:2.59,d:1.98},slots:2,defaultColors:{primary:"#e8d3a8",secondary:"#3f9a4a"},build:Mv},{id:"vine",name:"Hanging Vine",category:"plants",placement:"ceiling",tags:["nature","cozy"],price:30,size:{w:.54,h:1.24,d:.54},slots:2,defaultColors:{primary:"#d9805a",secondary:"#4fa24a"},build:Sv},{id:"flowers",name:"Flower Vase",category:"plants",placement:"surface",tags:["nature","cute","pastel"],price:0,size:{w:.31,h:.53,d:.29},slots:2,defaultColors:{primary:"#9fd3e6",secondary:"#ff9ec4"},build:bv},{id:"bonsai",name:"Bonsai",category:"plants",placement:"surface",tags:["nature","modern"],price:40,size:{w:.43,h:.38,d:.24},slots:2,defaultColors:{primary:"#3c4a5c",secondary:"#5f9e4a"},build:wv},{id:"mushroom",name:"Giant Mushroom",category:"plants",placement:"floor",tags:["fantasy","magic","nature","cute"],price:70,size:{w:.96,h:.93,d:.94},slots:2,defaultColors:{primary:"#e0443c",secondary:"#f6ead6"},build:Ev},{id:"xmas_tree",name:"Festive Tree",category:"plants",placement:"floor",tags:["winter","party"],price:90,size:{w:1.24,h:1.72,d:1.24},slots:2,defaultColors:{primary:"#2f7d4a",secondary:"#e0383e"},light:{color:"#ffd36b",intensity:2,distance:4,offset:[0,1.6,0]},build:Tv},{id:"coral",name:"Coral",category:"plants",placement:"floor",tags:["ocean"],price:0,size:{w:.69,h:.85,d:.45},slots:2,defaultColors:{primary:"#ff7a8a",secondary:"#ffb347"},build:Av},{id:"cat",name:"Cat",category:"fun",placement:"surface",tags:["cute","cozy"],price:0,size:{w:.26,h:.38,d:.27},slots:2,defaultColors:{primary:"#f0a050",secondary:"#fff4e4"},build:Rv},{id:"dog",name:"Dog",category:"fun",placement:"floor",tags:["cute","sporty"],price:40,size:{w:.4,h:.56,d:.53},slots:2,defaultColors:{primary:"#d9a066",secondary:"#8a5a35"},build:Cv},{id:"ghost",name:"Ghost",category:"fun",placement:"floor",tags:["spooky"],price:60,size:{w:.95,h:1.21,d:.72},slots:1,defaultColors:{primary:"#f3f6ff",secondary:"#2a2631"},light:{color:"#d6e2ff",intensity:1.5,distance:3,offset:[0,.8,0]},build:Pv},{id:"robot",name:"Robot",category:"fun",placement:"floor",tags:["science","space","games"],price:90,size:{w:.72,h:1.09,d:.36},slots:2,defaultColors:{primary:"#8fb8c9",secondary:"#e0503c"},build:Lv},{id:"rocket",name:"Rocket",category:"fun",placement:"floor",tags:["space"],price:90,size:{w:.9,h:1.76,d:.78},slots:2,defaultColors:{primary:"#f2f0ea",secondary:"#e0443c"},build:Dv},{id:"planet",name:"Hanging Planet",category:"fun",placement:"ceiling",tags:["space"],price:60,size:{w:1.12,h:1.1,d:1.07},slots:2,defaultColors:{primary:"#e8a25a",secondary:"#f6dca8"},build:Iv},{id:"telescope",name:"Telescope",category:"fun",placement:"floor",tags:["space","science"],price:70,size:{w:.96,h:1.58,d:.73},slots:2,defaultColors:{primary:"#2f4a7a",secondary:"#d9a441"},build:Nv},{id:"aquarium",name:"Aquarium",category:"fun",placement:"floor",tags:["ocean","nature"],price:100,size:{w:1.02,h:1.31,d:.5},slots:2,defaultColors:{primary:"#6e4529",secondary:"#2a2631"},build:Uv},{id:"surfboard",name:"Surfboard",category:"fun",placement:"floor",tags:["beach","sporty"],price:50,size:{w:.57,h:1.94,d:.36},slots:2,defaultColors:{primary:"#5ac8e0",secondary:"#ffd84a"},build:Fv},{id:"deck_chair",name:"Deck Chair",category:"fun",placement:"floor",tags:["beach","tropical"],price:0,size:{w:.62,h:.96,d:.84},slots:2,defaultColors:{primary:"#3f8fd0",secondary:"#fbf7ef"},build:Ov},{id:"crown",name:"Crown Pedestal",category:"fun",placement:"floor",tags:["royal","glam","luxury"],price:80,size:{w:.5,h:1.09,d:.5},slots:2,defaultColors:{primary:"#f1ece4",secondary:"#a8203a"},build:Bv},{id:"mic",name:"Mic Stand",category:"fun",placement:"floor",tags:["music","glam","party"],price:0,size:{w:.57,h:1.59,d:.52},slots:2,defaultColors:{primary:"#2b2833",secondary:"#e0b545"},build:zv},{id:"guitar",name:"Guitar",category:"fun",placement:"floor",tags:["music","retro"],price:70,size:{w:.41,h:1.19,d:.56},slots:1,defaultColors:{primary:"#d98a3c",secondary:"#f2e2c0"},build:kv},{id:"weights",name:"Weight Rack",category:"fun",placement:"floor",tags:["sporty"],price:40,size:{w:.92,h:.75,d:.56},slots:2,defaultColors:{primary:"#3a3740",secondary:"#e0443c"},build:Gv},{id:"snowman",name:"Snowman",category:"fun",placement:"floor",tags:["winter","cute"],price:50,size:{w:.94,h:1.32,d:.6},slots:2,defaultColors:{primary:"#f7f9ff",secondary:"#e0383e"},build:Hv},{id:"penguin",name:"Penguin",category:"fun",placement:"floor",tags:["winter","cute","ocean"],price:50,size:{w:.51,h:.73,d:.46},slots:2,defaultColors:{primary:"#2c3a55",secondary:"#e0443c"},build:Vv},{id:"unicorn",name:"Unicorn Statue",category:"fun",placement:"floor",tags:["fantasy","cute","pastel"],price:120,size:{w:.98,h:1.16,d:.42},slots:2,defaultColors:{primary:"#fbf7ff",secondary:"#c3a6ff"},build:Wv},{id:"dragon_egg",name:"Dragon Egg",category:"fun",placement:"surface",tags:["fantasy","magic"],price:80,size:{w:.36,h:.32,d:.32},slots:2,defaultColors:{primary:"#4fb39a",secondary:"#e2b84a"},light:{color:"#ffb347",intensity:1,distance:2,offset:[0,.2,.06]},build:Xv},{id:"cupcake",name:"Giant Cupcake",category:"fun",placement:"floor",tags:["food","cute","pastel"],price:40,size:{w:.7,h:.96,d:.7},slots:2,defaultColors:{primary:"#9fd3e6",secondary:"#ffc4d8"},build:Yv},{id:"ufo",name:"Hanging UFO",category:"fun",placement:"ceiling",tags:["space","neon"],price:80,size:{w:.93,h:.71,d:.93},slots:2,defaultColors:{primary:"#c9ccd4",secondary:"#7a5cff"},light:{color:"#9dffb0",intensity:2,distance:3,offset:[0,-.75,0]},build:qv}],Sa=[...V1,...$v],Zv=new Map(Sa.map(n=>[n.id,n]));function Qn(n){const t=Zv.get(n);if(!t)throw new Error(`Unknown item: ${n}`);return t}const Kv=[{id:"furniture",label:"Furniture"},{id:"decor",label:"Decor"},{id:"lighting",label:"Lighting"},{id:"plants",label:"Plants"},{id:"wall",label:"Walls"},{id:"fun",label:"Fun"}],al="bti.profile.v1",Jv=12;function ao(){return{name:"",coins:120,xp:0,unlocked:[],rounds:0,wins:0,bestStars:0,gallery:[],settings:{music:!0,sfx:!0,seconds:240,glow:!0},coached:!1}}function Qv(){try{const n=localStorage.getItem(al);if(!n)return ao();const t=JSON.parse(n),e=ao();return{...e,...t,settings:{...e.settings,...t.settings??{}}}}catch{return ao()}}function jv(n){try{localStorage.setItem(al,JSON.stringify(n))}catch{try{localStorage.setItem(al,JSON.stringify({...n,gallery:n.gallery.slice(0,3)}))}catch{}}}function tx(n,t){n.gallery.unshift(t),n.gallery=n.gallery.slice(0,Jv)}function ol(n){let t=1,e=0,i=100;for(;n>=e+i;)e+=i,t++,i=t*100;return{level:t,into:n-e,need:i}}const P0=["Intern Decorator","Cushion Fluffer","Paint Swatch Pro","Room Whisperer","Trend Setter","Interior Icon","Design Legend"];function jh(n){return P0[Math.min(P0.length-1,Math.floor((n-1)/2))]}class Zl{s;constructor(t){this.s=t>>>0||1}next(){let t=this.s+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}range(t,e){return t+(e-t)*this.next()}int(t,e){return Math.floor(this.range(t,e+1))}chance(t){return this.next()<t}pick(t){if(t.length===0)throw new Error("pick from empty array");return t[Math.floor(this.next()*t.length)]}weighted(t,e){let i=0;for(const r of t)i+=Math.max(0,e(r));if(i<=0)return this.pick(t);let s=this.next()*i;for(const r of t)if(s-=Math.max(0,e(r)),s<=0)return r;return t[t.length-1]}shuffle(t){for(let e=t.length-1;e>0;e--){const i=Math.floor(this.next()*(e+1)),s=t[e];t[e]=t[i],t[i]=s}return t}noise(){return(this.next()+this.next()+this.next())/1.5-1}}const ex=[{name:"Madame Velour",vibe:"Theme purist",avatar:{skin:"#e8b796",hair:"#2b1b17",top:"#7b1e3b",hairStyle:2},weights:{theme:3,style:1.5,detail:1,layout:1},generosity:-.3,loves:["royal","luxury"],skill:.86},{name:"DJ Spritz",vibe:"Colour snob",avatar:{skin:"#8d5a3b",hair:"#ff4d8d",top:"#2de2e6",hairStyle:1},weights:{theme:1,style:3,detail:1,layout:1.2},generosity:0,loves:["neon","music","party"],skill:.7},{name:"Grandma Pearl",vibe:"Loves a knick-knack",avatar:{skin:"#f1c9a5",hair:"#e9e4dc",top:"#a7c957",hairStyle:3},weights:{theme:1,style:1,detail:3,layout:1},generosity:.35,loves:["cozy","cute","food"],skill:.62},{name:"Chad Minimal",vibe:"Less is more",avatar:{skin:"#d9a37e",hair:"#111014",top:"#e9e4dc",hairStyle:0},weights:{theme:1,style:1.5,detail:.5,layout:3},generosity:-.2,loves:["modern","industrial"],skill:.55},{name:"Baby Pixel",vibe:"Easily delighted",avatar:{skin:"#ffd9b8",hair:"#ffd23f",top:"#ff8fb1",hairStyle:4},weights:{theme:1,style:1,detail:1.5,layout:1},generosity:.45,loves:["cute","games","pastel"],skill:.32},{name:"Sir Decorsalot",vibe:"Big energy",avatar:{skin:"#c68a63",hair:"#8a5a33",top:"#1d3557",hairStyle:5},weights:{theme:1.5,style:1,detail:2,layout:1.5},generosity:.1,loves:["fantasy","royal","rustic"],skill:.74},{name:"Moonbean",vibe:"After-dark aesthetic",avatar:{skin:"#a86b4a",hair:"#5a189a",top:"#14213d",hairStyle:2},weights:{theme:2,style:2,detail:1,layout:1},generosity:-.05,loves:["spooky","magic","space"],skill:.66},{name:"Coco Crumb",vibe:"Snack-driven",avatar:{skin:"#f0c09a",hair:"#b5651d",top:"#ffd6a5",hairStyle:1},weights:{theme:1.5,style:1,detail:1.5,layout:1.5},generosity:.2,loves:["food","cafe","kitchen"],skill:.45}],ir=[{id:"villain_bedroom",name:"Villain's Cozy Bedroom",pitch:"Evil plans by day. Fluffy slippers by night.",tags:{spooky:1,cozy:.9,bedroom:.9,magic:.6,royal:.5,luxury:.4},palette:["#3b1f4a","#6d2a5c","#9b1d3a","#1f1a2e","#c9a227","#e6d7f0"],walls:["diamond","stripes","plain"],floors:["carpet","herringbone","marble"],moods:["night","spooky"]},{id:"mars_cafe",name:"Café on Mars",pitch:"Best flat white in the solar system. Gravity sold separately.",tags:{space:1,cafe:1,food:.6,modern:.5,neon:.4,science:.3},palette:["#c4492d","#e8794a","#f3c89b","#2b2d42","#8d99ae","#f5f0e8"],walls:["panels","tiles","plain","stars"],floors:["metal","sand","tiles"],moods:["golden","neon"]},{id:"jungle_hangout",name:"Jungle Treehouse Hangout",pitch:"Somewhere between a jungle and a sleepover.",tags:{nature:1,tropical:1,cozy:.6,rustic:.6,cute:.3},palette:["#2f6b3a","#5fa052","#a7c957","#8a5a33","#f2e8cf","#e9a23b"],walls:["panels","plain","stripes"],floors:["planks","grass","herringbone"],moods:["day","golden"]},{id:"retro_arcade",name:"Retro Arcade Basement",pitch:"Insert coin. Never leave.",tags:{games:1,retro:1,neon:1,party:.5,music:.5},palette:["#ff3c8e","#2de2e6","#f6f740","#7b2ff7","#14111f","#ff8a3d"],walls:["check","diamond","plain","stars"],floors:["checker","carpet","tiles"],moods:["neon","night"]},{id:"witch_kitchen",name:"Witch's Kitchen",pitch:"Tonight's special: soup that answers back.",tags:{magic:1,spooky:.9,kitchen:.9,food:.5,rustic:.5,nature:.3},palette:["#2e4a3a","#6b8f3e","#4b2e4f","#c46a2b","#1d1b1a","#d8c99b"],walls:["brick","panels","plain"],floors:["stone","planks","checker"],moods:["spooky","night","golden"]},{id:"cotton_candy",name:"Cotton Candy Dream",pitch:"Everything is soft. Everything is pink. Everything is fine.",tags:{cute:1,pastel:1,fantasy:.6,party:.4,food:.4,bedroom:.3},palette:["#ffc2d9","#ffd6a5","#cdb4ff","#a0e7e5","#fffaf0","#ff8fb1"],walls:["polka","stripes","waves","stars"],floors:["carpet","checker","marble"],moods:["day","golden"]},{id:"beach_shack",name:"Beach Shack Getaway",pitch:"Sand in everything. No regrets.",tags:{beach:1,tropical:.9,ocean:.8,sporty:.4,nature:.4,cozy:.3},palette:["#f4d8a6","#2ec4b6","#118ab2","#ff9f68","#fffdf6","#e4572e"],walls:["panels","stripes","waves","plain"],floors:["sand","planks"],moods:["day","golden"]},{id:"winter_cabin",name:"Snowed-In Cabin",pitch:"The roads are closed. The cocoa is not.",tags:{winter:1,cozy:1,rustic:.9,party:.3,nature:.3},palette:["#7a3b2e","#b5651d","#2f4858","#e9ecef","#9b2226","#f2cc8f"],walls:["panels","check","brick","plain"],floors:["planks","herringbone","carpet"],moods:["golden","night"]},{id:"mad_lab",name:"Mad Scientist's Lab",pitch:"It's alive! (Please sign the waiver.)",tags:{science:1,industrial:.7,spooky:.5,neon:.5,space:.4,office:.3},palette:["#39ff14","#1b263b","#415a77","#e0e1dd","#8338ec","#ffbe0b"],walls:["tiles","panels","plain"],floors:["metal","tiles","checker"],moods:["neon","night","spooky"]},{id:"royal_throne",name:"Royal Throne Room",pitch:"Bow before the tasteful curtains.",tags:{royal:1,luxury:1,glam:.6,fantasy:.5},palette:["#7b1e3b","#c9a227","#1d3557","#f1e3c6","#3c1642","#e9c46a"],walls:["diamond","stripes","brick","plain"],floors:["marble","carpet","checker"],moods:["golden","day"]},{id:"popstar_dressing",name:"Pop Star Dressing Room",pitch:"Five minutes to showtime. Where are my sunglasses?",tags:{glam:1,music:1,party:.7,luxury:.6,neon:.4},palette:["#ff4d8d","#ffd166","#9b5de5","#f8f9fa","#111111","#00bbf9"],walls:["stars","stripes","plain","polka"],floors:["marble","checker","carpet"],moods:["neon","golden"]},{id:"underwater_office",name:"Underwater Office",pitch:"Quarterly reports, but make it nautical.",tags:{ocean:1,office:1,modern:.4,science:.3,nature:.3},palette:["#03396c","#005b96","#6497b1","#b3cde0","#f9c74f","#ffffff"],walls:["waves","tiles","panels","plain"],floors:["sand","tiles","carpet"],moods:["day","neon"]},{id:"haunted_party",name:"Haunted Birthday Party",pitch:"The guest of honour died in 1887. Bring cake anyway.",tags:{spooky:1,party:1,food:.5,cute:.4,magic:.3},palette:["#ff7b00","#2d0a31","#7400b8","#80ffdb","#111111","#f7f7f7"],walls:["stripes","polka","brick","plain"],floors:["checker","planks","stone"],moods:["spooky","night"]},{id:"dragon_lair",name:"Dragon's Cosy Lair",pitch:"Hoards gold. Also hoards cushions.",tags:{fantasy:1,magic:.8,royal:.6,cozy:.6,nature:.3},palette:["#9d0208","#e85d04","#ffba08","#370617","#6a994e","#3d405b"],walls:["brick","plain","diamond"],floors:["stone","carpet","grass"],moods:["golden","night"]}];new Map(ir.map(n=>[n.id,n]));function tu(n){let t=n.replace("#","");t.length===3&&(t=t.split("").map(i=>i+i).join(""));const e=parseInt(t,16);return[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}function oo(n){return n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function L0(n){const[t,e,i]=tu(n),s=oo(t),r=oo(e),a=oo(i),o=Math.cbrt(.4122214708*s+.5363325363*r+.0514459929*a),l=Math.cbrt(.2119034982*s+.6806995451*r+.1073969566*a),c=Math.cbrt(.0883024619*s+.2817188376*r+.6299787005*a);return{L:.2104542553*o+.793617785*l-.0040720468*c,a:1.9779984951*o-2.428592205*l+.4505937099*c,b:.0259040371*o+.7827717662*l-.808675766*c}}function nx(n,t){return Math.hypot(n.L-t.L,n.a-t.a,n.b-t.b)}function zr(n,t){const e=L0(n);let i=1/0;for(const s of t)i=Math.min(i,nx(e,L0(s)));return Math.max(0,Math.min(1,1-i/.22))}function eu(n){const[t,e,i]=tu(n),s=Math.max(t,e,i),r=Math.min(t,e,i),a=(s+r)/2;if(s===r)return{h:0,s:0,l:a};const o=s-r,l=a>.5?o/(2-s-r):o/(s+r);let c=0;return s===t?c=(e-i)/o+(e<i?6:0):s===e?c=(i-t)/o+2:c=(t-e)/o+4,{h:c*60,s:l,l:a}}function D0(n){const{h:t,s:e,l:i}=eu(n);return e>.3&&i>.45&&(t>=300||t<=12)}function nu(n){const{h:t,s:e,l:i}=eu(n);return e<.15||i<.1||i>.93?-1:Math.round(t/40)%9}const os=["#fffaf2","#e9e4dc","#b8b2a7","#6b6862","#2b2a28","#111014","#f8c8d8","#ff8fb1","#e83f6f","#b5172f","#7b1e3b","#4b1d3f","#ffd6a5","#ffa552","#e8692c","#b5651d","#8a5a33","#5a3a22","#fff1a8","#ffd23f","#c9a227","#a7c957","#5fa052","#2f6b3a","#a0e7e5","#2ec4b6","#118ab2","#2b59c3","#1d3557","#14213d","#e0c3fc","#cdb4ff","#9b5de5","#7b2ff7","#5a189a","#39ff14"],ix=new Set(["sofa","armchair","chair","stool","bed","canopy_bed","throne","beanbag","deck_chair","hammock"]),sx=new Set(["cat","dog","penguin"]),iu=[{id:"pink3",text:"Use at least 3 pink things",check:n=>n.items.filter(t=>D0(t.primary)||D0(t.secondary)).length>=3},{id:"glow2",text:"Add 3 or more light sources",check:(n,t)=>n.items.filter(e=>t(e.item).glows).length>=3},{id:"giant",text:"Make something giant",check:n=>n.items.some(t=>t.scale>=1.6)},{id:"no_seats",text:"No chairs, sofas or beds allowed",check:n=>n.items.length>=4&&!n.items.some(t=>ix.has(t.item))},{id:"pet",text:"Every room needs a pet",check:n=>n.items.some(t=>sx.has(t.item))},{id:"maximal",text:"Maximalist: 25 items or more",check:n=>n.items.length>=25},{id:"minimal",text:"Minimalist: 10 items or fewer",check:n=>n.items.length>=4&&n.items.length<=10},{id:"stack",text:"Put 3 things on top of furniture",check:n=>n.items.filter(t=>!t.wall&&t.y>.05&&t.y<3).length>=3},{id:"one_colour",text:"Mostly one colour",check:n=>{if(n.items.length<5)return!1;const t=new Map;for(const e of n.items){const i=nu(e.primary);t.set(i,(t.get(i)??0)+1)}return Math.max(...t.values())/n.items.length>=.6}},{id:"wall_art",text:"Hang 4 things on the walls",check:n=>n.items.filter(t=>t.wall).length>=4},{id:"after_dark",text:"Set it after dark",check:n=>n.mood==="night"||n.mood==="spooky"||n.mood==="neon"}];new Map(iu.map(n=>[n.id,n]));const he={halfW:4,halfD:3,height:3.2},su=["plain","stripes","polka","check","brick","panels","stars","waves","tiles","diamond"],ru=["planks","checker","carpet","tiles","grass","sand","stone","herringbone","metal","marble"],au=["day","golden","night","neon","spooky"];function ll(){return{wall:{pattern:"plain",color:"#efe6da",accent:"#d9c9b4"},floor:{pattern:"planks",color:"#c89a6a",accent:"#a87a4e"},mood:"day",items:[]}}function rx(n){return JSON.parse(JSON.stringify(n))}let I0=0;function N0(){return I0+=1,`i${Date.now().toString(36)}${I0.toString(36)}`}const cl=60;function ou(n){return{tags:n.tags,category:n.category,placement:n.placement,glows:!!n.light,bulk:Math.cbrt(Math.max(1e-4,n.size.w*n.size.h*n.size.d)),slots:n.slots}}const Rn=n=>Math.max(0,Math.min(1,n));function lu(n,t){let e=0;for(const i of n)e=Math.max(e,t.tags[i]??0);return e}function ax(n,t,e,i){const s=n.items,r=s.length,a=s.map(z=>i(z.item)),l=a.map(z=>lu(z.tags,t)).reduce((z,lt)=>z+lt,0),c=r?l/r:0,h=.55*Rn(l/7)+.45*c,u=(t.walls.includes(n.wall.pattern)?.3:0)+(t.floors.includes(n.floor.pattern)?.3:0)+(t.moods.includes(n.mood)?.4:0),f=r?.8*h+.2*u:.2*u;let d=5,g=3*zr(n.wall.color,t.palette)+2*zr(n.floor.color,t.palette);const v=new Set;s.forEach((z,lt)=>{const $=a[lt],nt=Math.max(.2,Math.min(1.2,$.bulk*z.scale));d+=nt,g+=nt*zr(z.primary,t.palette),$.slots===2&&(d+=nt*.5,g+=nt*.5*zr(z.secondary,t.palette));const at=nu(z.primary);at>=0&&v.add(at)});const m=g/d,p=v.size,y=r===0?.3:p<=1?.65:p<=4?1:Math.max(.35,1-(p-4)*.12),w=r===0?.6*m:.75*m+.25*y,M=new Set(s.map(z=>z.item)).size,R=s.filter(z=>!z.wall&&z.y>.05&&z.y<he.height-.1).length,T=s.filter(z=>z.wall).length,_=.45*Rn(Math.sqrt(r/18))+.25*Rn(M/11)+.15*Rn(R/3)+.15*Rn(T/3),S=new Set;let I=0,C=0;for(const z of s){if(z.wall)continue;const lt=Math.min(3,Math.max(0,Math.floor((z.x+he.halfW)/(he.halfW*2)*4))),$=Math.min(2,Math.max(0,Math.floor((z.z+he.halfD)/(he.halfD*2)*3)));S.add($*4+lt),I+=z.x,C++}const N=Rn(S.size/12/.7),k=a.filter(z=>z.glows).length,q=Rn(k/2)*.8+(n.mood!=="day"?.2:.1),D=C?1-Rn(Math.abs(I/C)/2.5):0,H=r>40?(r-40)/40:0,J=Rn(.45*N+.25*q+.3*D-H);return{theme:Rn(f),style:Rn(w),detail:Rn(_),layout:J,twist:e?e.check(n,i):!1}}function ox(n,t){const e=t.theme+t.style+t.detail+t.layout;return(n.theme*t.theme+n.style*t.style+n.detail*t.detail+n.layout*t.layout)/e}function lx(n,t,e,i){const s=ox(t,n.weights),r=n.loves.some(l=>e.has(l))?.25:0,a=Math.max(0,Math.min(1,(s-.45)/.6)),o=1+4.2*Math.pow(a,1.15)+n.generosity+r+(t.twist?.45:0)+i.noise()*.45;return Math.max(1,Math.min(5,Math.round(o)))}function cx(n,t){const e=new Set;for(const i of n.items)for(const s of t(i.item).tags)e.add(s);return e}const hx={theme:["Nailed the brief.","I walked in and knew the theme instantly.","This is the theme. Frame it."],style:["Those colours! Chef's kiss.","The palette is so put-together.","Colour story: immaculate."],detail:["So many little details to find.","I could look at this all day.","The effort shows everywhere."],layout:["Beautifully balanced room.","The lighting is doing a lot of work. Love it.","Every corner earns its place."]},ux={theme:["Cute, but where's the theme?","I'm not getting the brief from this.","Needs more of the theme, darling."],style:["The colours are fighting each other.","Try a tighter palette next time.","Some of these colours wandered in from another room."],detail:["Feels a bit empty.","Needs more stuff! More!","Add some little details to reward a closer look."],layout:["Everything's crammed in one corner.","Needs some lighting love.","Spread things out a bit."]};function fx(n,t,e){const s=["theme","style","detail","layout"].map(o=>({a:o,v:t[o],w:n.weights[o]})),r=[...s].sort((o,l)=>l.v*l.w-o.v*o.w)[0],a=[...s].sort((o,l)=>o.v/o.w-l.v/l.w)[0];return r.v>=.62&&(a.v>.35||e.chance(.5))?e.pick(hx[r.a]):e.pick(ux[a.a])}function cu(n,t,e,i,s){const r=new Zl(i),a=ll(),o=w=>r.chance(Math.min(.95,w));a.wall.pattern=o(e)?r.pick(n.walls):r.pick(su),a.floor.pattern=o(e)?r.pick(n.floors):r.pick(ru),a.mood=o(e)?r.pick(n.moods):r.pick(au);const l=()=>o(e*.95+.05)?r.pick(n.palette):r.pick(os);a.wall.color=l(),a.wall.accent=l(),a.floor.color=l(),a.floor.accent=l();const c=Math.max(3,Math.round(5+e*20+r.range(-2,3))),h=w=>{const M=lu(w.tags,n);return .06+(1-e)*.4+M*M*8*e},u=[],f=(w,M,R)=>u.every(T=>T.def.placement==="wall"||T.def.size.h<.06||Math.hypot(T.it.x-w,T.it.z-M)>T.r+R-.05),d=(n.tags.neon??0)>.3||(n.tags.spooky??0)>.6,g=(w,M)=>r.chance(.3+(1-e)*.2)?w.defaultColors[M]:l(),v=(w,M,R,T,_={})=>({uid:`b${i.toString(36)}_${u.length}`,item:w.id,x:M,y:R,z:T,rot:0,scale:r.chance(.15)?Math.round(r.range(.8,1.35)*10)/10:1,primary:g(w,"primary"),secondary:g(w,"secondary"),finish:w.light&&(w.tags.includes("neon")||w.id==="paper_lantern")||d&&w.light&&r.chance(.6)?"glow":r.chance(.15)?"gloss":"matte",..._}),m=s.filter(w=>w.placement==="floor"&&w.category==="furniture"&&w.size.w>.9),p=w=>r.weighted(w,h);let y=0;for(;u.length<c&&y++<c*8;){const w=u.length===0&&m.length?p(m):p(s),M=Math.max(w.size.w,w.size.d)/2;let R=null;if(w.placement==="wall"){const T=r.chance(.65),_=(T?he.halfW:he.halfD)-w.size.w/2-.15,S=r.range(-_,_),I=w.id==="door"?w.size.h/2:Math.min(he.height-w.size.h/2-.1,r.range(1.3,2.1));R=T?v(w,S,I,-3,{wall:"back"}):v(w,-4,I,S,{wall:"left"})}else if(w.placement==="ceiling")R=v(w,r.range(-4+.8,he.halfW-.8),he.height,r.range(-3+.8,he.halfD-.8));else if(w.placement==="surface"){const T=u.filter(_=>_.def.surfaceHeight!==void 0&&_.def.placement!=="wall"&&_.def.placement!=="ceiling");if(T.length&&r.chance(.5+e*.4)){const _=r.pick(T),S=Math.max(0,Math.min(_.def.size.w,_.def.size.d)*_.it.scale*.3);R=v(w,_.it.x+r.range(-S,S),(_.def.surfaceHeight??0)*_.it.scale,_.it.z+r.range(-S*.5,S*.5))}else{const _=U0(r,M,f);_&&(R=v(w,_[0],0,_[1],{rot:_[2]}))}}else{const _=w.size.h<.06?[r.range(-1.5,1.5),r.range(-1,1.2),r.chance(.5)?0:Math.PI/2]:U0(r,M,f);_&&(R=v(w,_[0],0,_[1],{rot:_[2]}))}R&&u.push({it:R,def:w,r:M*R.scale})}return a.items=u.map(w=>w.it),a}function U0(n,t,e){for(let i=0;i<24;i++){const s=n.next();let r,a,o;if(s<.45?(r=n.range(-4+t+.1,he.halfW-t-.1),a=-3+t+.08,o=0):s<.7?(r=-4+t+.08,a=n.range(-3+t+.1,he.halfD-t-.1),o=Math.PI/2):(r=n.range(-4+t+.3,he.halfW-t-.3),a=n.range(-3+t+.3,he.halfD-t-.3),o=n.pick([0,Math.PI/2,-Math.PI/4,Math.PI/4])),e(r,a,t))return[r,a,o]}return null}const Fs="you";class dx{constructor(t,e,i,s=Math.random()*2**32>>>0,r={}){this.seconds=t,this.defs=i,this.rng=new Zl(s),this.theme=(r.themeId?ir.find(l=>l.id===r.themeId):void 0)??this.rng.pick(ir),this.twist=r.twist===!1?null:this.rng.pick(iu);const a=new Map(i.map(l=>[l.id,ou(l)]));this.info=l=>{const c=a.get(l);if(!c)throw new Error(`Unknown item ${l}`);return c};const o=this.rng.shuffle([...ex]).slice(0,5);this.contestants=[{id:Fs,name:e||"You",isPlayer:!0,avatar:{skin:"#e0a77f",hair:"#2b1b17",top:"#ff5a4e",hairStyle:1}},...o.map((l,c)=>({id:`bot${c}`,name:l.name,isPlayer:!1,persona:l,avatar:l.avatar}))];for(const l of this.contestants)if(l.persona){const c=Math.max(.15,Math.min(.98,l.persona.skill+this.rng.range(-.12,.12)));this.designs.set(l.id,cu(this.theme,this.twist,c,this.rng.int(1,1e9),i))}}theme;twist;contestants;designs=new Map;playerVotes=new Map;votes=new Map;order=[];rng;info;submit(t){this.designs.set(Fs,t);const e=this.contestants.filter(s=>!s.isPlayer).map(s=>s.id),i=this.rng.int(2,Math.min(4,e.length));this.order=[...e.slice(0,i),Fs,...e.slice(i)];for(const s of this.order){const r=this.designs.get(s),a=this.breakdown(s),o=cx(r,this.info),l=[];for(const c of this.contestants){if(c.id===s||!c.persona)continue;const h=lx(c.persona,a,o,this.rng);l.push({from:c.id,stars:h,comment:fx(c.persona,a,this.rng)})}this.votes.set(s,l)}}breakdownCache=new Map;breakdown(t){let e=this.breakdownCache.get(t);return e||(e=ax(this.designs.get(t),this.theme,this.twist,this.info),this.breakdownCache.set(t,e)),e}rooms(){return this.order.map(t=>({contestant:this.contestants.find(e=>e.id===t),design:this.designs.get(t)}))}votesFor(t){return this.votes.get(t)??[]}castVote(t,e){t!==Fs&&this.playerVotes.set(t,Math.max(1,Math.min(5,Math.round(e))))}results(){const t=this.order.map(i=>{const s=[...this.votesFor(i)],r=this.playerVotes.get(i);r!==void 0&&s.push({from:Fs,stars:r});const a=s.length?s.reduce((o,l)=>o+l.stars,0)/s.length:0;return{contestant:this.contestants.find(o=>o.id===i),design:this.designs.get(i),votes:s,stars:Math.round(a*100)/100,breakdown:this.breakdown(i),place:0}}),e=i=>i.breakdown.theme+i.breakdown.style+i.breakdown.detail+i.breakdown.layout;return t.sort((i,s)=>s.stars-i.stars||e(s)-e(i)),t.forEach((i,s)=>i.place=s+1),t}rewards(){const t=this.results().find(r=>r.contestant.isPlayer),e=[{label:"Took part",coins:20}],i=[0,80,50,30,15,10,5][t.place]??5;return e.push({label:`Finished ${Ys(t.place)}`,coins:i}),e.push({label:`${t.stars.toFixed(1)} stars`,coins:Math.round(t.stars*8)}),t.breakdown.twist&&this.twist&&e.push({label:"Twist bonus",coins:30}),{coins:e.reduce((r,a)=>r+a.coins,0),xp:Math.round(30+t.stars*12+(t.place===1?40:0)),lines:e}}}function Ys(n){const t=["th","st","nd","rd"],e=n%100;return n+(t[(e-20)%10]??t[e]??t[0])}const F0={type:"change"},Kl={type:"start"},hu={type:"end"},kr=new da,O0=new qn,px=Math.cos(70*Pl.DEG2RAD),We=new P,un=2*Math.PI,Se={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},lo=1e-6;class mx extends Vd{constructor(t,e=null){super(t,e),this.state=Se.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:hs.ROTATE,MIDDLE:hs.DOLLY,RIGHT:hs.PAN},this.touches={ONE:ls.ROTATE,TWO:ls.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new ti,this._lastTargetPosition=new P,this._quat=new ti().setFromUnitVectors(t.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new nl,this._sphericalDelta=new nl,this._scale=1,this._panOffset=new P,this._rotateStart=new ot,this._rotateEnd=new ot,this._rotateDelta=new ot,this._panStart=new ot,this._panEnd=new ot,this._panDelta=new ot,this._dollyStart=new ot,this._dollyEnd=new ot,this._dollyDelta=new ot,this._dollyDirection=new P,this._mouse=new ot,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=_x.bind(this),this._onPointerDown=gx.bind(this),this._onPointerUp=vx.bind(this),this._onContextMenu=Ex.bind(this),this._onMouseWheel=Mx.bind(this),this._onKeyDown=Sx.bind(this),this._onTouchStart=bx.bind(this),this._onTouchMove=wx.bind(this),this._onMouseDown=xx.bind(this),this._onMouseMove=yx.bind(this),this._interceptControlDown=Tx.bind(this),this._interceptControlUp=Ax.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=Se.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(F0),this.update(),this.state=Se.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;We.copy(e).sub(this.target),We.applyQuaternion(this._quat),this._spherical.setFromVector3(We),this.autoRotate&&this.state===Se.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=un:i>Math.PI&&(i-=un),s<-Math.PI?s+=un:s>Math.PI&&(s-=un),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(We.setFromSpherical(this._spherical),We.applyQuaternion(this._quatInverse),e.copy(this.target).add(We),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=We.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new P(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new P(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=We.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(kr.origin.copy(this.object.position),kr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(kr.direction))<px?this.object.lookAt(this.target):(O0.setFromNormalAndCoplanarPoint(this.object.up,this.target),kr.intersectPlane(O0,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>lo||8*(1-this._lastQuaternion.dot(this.object.quaternion))>lo||this._lastTargetPosition.distanceToSquared(this.target)>lo?(this.dispatchEvent(F0),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?un/60*this.autoRotateSpeed*t:un/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){We.setFromMatrixColumn(e,0),We.multiplyScalar(-t),this._panOffset.add(We)}_panUp(t,e){this.screenSpacePanning===!0?We.setFromMatrixColumn(e,1):(We.setFromMatrixColumn(e,0),We.crossVectors(this.object.up,We)),We.multiplyScalar(t),this._panOffset.add(We)}_pan(t,e){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;We.copy(s).sub(this.target);let r=We.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/i.clientHeight,this.object.matrix),this._panUp(2*e*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=t-i.left,r=e-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientY),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(un*this._rotateDelta.x/e.clientHeight),this._rotateUp(un*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(un*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-un*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(un*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-un*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),r=.5*(t.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(un*this._rotateDelta.x/e.clientHeight),this._rotateUp(un*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ot,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function gx(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function _x(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function vx(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(hu),this.state=Se.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function xx(n){let t;switch(n.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case hs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Se.DOLLY;break;case hs.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Se.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Se.ROTATE}break;case hs.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Se.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Se.PAN}break;default:this.state=Se.NONE}this.state!==Se.NONE&&this.dispatchEvent(Kl)}function yx(n){switch(this.state){case Se.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Se.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Se.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Mx(n){this.enabled===!1||this.enableZoom===!1||this.state!==Se.NONE||(n.preventDefault(),this.dispatchEvent(Kl),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(hu))}function Sx(n){this.enabled!==!1&&this._handleKeyDown(n)}function bx(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case ls.ROTATE:if(this.enableRotate===!1){this.state=Se.NONE;break}this._handleTouchStartRotate(n),this.state=Se.TOUCH_ROTATE;break;case ls.PAN:if(this.enablePan===!1){this.state=Se.NONE;break}this._handleTouchStartPan(n),this.state=Se.TOUCH_PAN;break;default:this.state=Se.NONE}break;case 2:switch(this.touches.TWO){case ls.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Se.TOUCH_DOLLY_PAN;break;case ls.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Se.TOUCH_DOLLY_ROTATE;break;default:this.state=Se.NONE}break;default:this.state=Se.NONE}this.state!==Se.NONE&&this.dispatchEvent(Kl)}function wx(n){switch(this._trackPointer(n),this.state){case Se.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Se.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Se.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Se.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Se.NONE}}function Ex(n){this.enabled!==!1&&n.preventDefault()}function Tx(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Ax(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class uu extends Il{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const t=new dn;t.deleteAttribute("uv");const e=new yn({side:cn}),i=new yn,s=new Nh(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);const r=new ie(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new qf(t,i,6),o=new Xe;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new ie(t,is(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new ie(t,is(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new ie(t,is(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const u=new ie(t,is(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const f=new ie(t,is(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);const d=new ie(t,is(100));d.position.set(0,20,0),d.scale.set(1,.1,1),this.add(d)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function is(n){return new Dd({color:0,emissive:16777215,emissiveIntensity:n})}const Zr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Es{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Rx=new Yl(-1,1,1,-1,0,1);class Cx extends Ve{constructor(){super(),this.setAttribute("position",new le([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new le([0,2,0,0,2,0],2))}}const Px=new Cx;class Jl{constructor(t){this._mesh=new ie(Px,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Rx)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Lx extends Es{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof bn?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=nr.clone(t.uniforms),this.material=new bn({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new Jl(this.material)}render(t,e,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class B0 extends Es{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,i){const s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(i),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}}class Dx extends Es{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Ix{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const i=t.getSize(new ot);this._width=i.width,this._height=i.height,e=new gn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:mn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Lx(Zr),this.copyPass.material.blending=Fi,this.timer=new Bd}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const e=this.renderer.getRenderTarget();let i=!1;for(let s=0,r=this.passes.length;s<r;s++){const a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}B0!==void 0&&(a instanceof B0?i=!0:a instanceof Dx&&(i=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ot);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const i=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(i,s),this.renderTarget2.setSize(i,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(i,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Nx extends Es{constructor(t,e,i=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=i,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Qt}render(t,e,i){const s=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=s}}const Ux={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Qt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Ms extends Es{constructor(t,e=1,i,s){super(),this.strength=e,this.radius=i,this.threshold=s,this.resolution=t!==void 0?new ot(t.x,t.y):new ot(256,256),this.clearColor=new Qt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new gn(r,a,{type:mn,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const u=new gn(r,a,{type:mn,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);const f=new gn(r,a,{type:mn,depthBuffer:!1});f.texture.name="UnrealBloomPass.v"+h,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=Ux;this.highPassUniforms=nr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new bn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new ot(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=nr.clone(Zr.uniforms),this.blendMaterial=new bn({uniforms:this.copyUniforms,vertexShader:Zr.vertexShader,fragmentShader:Zr.fragmentShader,premultipliedAlpha:!0,blending:fo,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Qt,this._oldClearAlpha=1,this._basic=new Nl,this._fsQuad=new Jl(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let i=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(i,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(i,s),this.renderTargetsVertical[r].setSize(i,s),this.separableBlurMaterials[r].uniforms.invSize.value=new ot(1/i,1/s),i=Math.round(i/2),s=Math.round(s/2)}render(t,e,i,s,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Ms.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Ms.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(i),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[],i=t/3;for(let a=0;a<t;a++)e.push(.39894*Math.exp(-.5*a*a/(i*i))/i);const s=[],r=[];for(let a=1;a<t;a+=2){const o=e[a],l=a+1<t?e[a+1]:0,c=o+l;s.push((a*o+(a+1)*l)/c),r.push(c)}return new bn({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new ot(.5,.5)},direction:{value:new ot(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(t){return new bn({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}Ms.BlurDirectionX=new ot(1,0);Ms.BlurDirectionY=new ot(0,1);const Gr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Fx extends Es{constructor(){super(),this.isOutputPass=!0,this.uniforms=nr.clone(Gr.uniforms),this.material=new Ph({name:Gr.name,uniforms:this.uniforms,vertexShader:Gr.vertexShader,fragmentShader:Gr.fragmentShader}),this._fsQuad=new Jl(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},pe.getTransfer(this._outputColorSpace)===we&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ml?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===gl?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===_l?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===sr?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===xl?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===yl?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===vl&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const z0=256,k0=new Map;function ha(n,t){let e=k0.get(n);if(e)return e;e=document.createElement("canvas"),e.width=e.height=z0;const i=e.getContext("2d");return t(i,z0),k0.set(n,e),e}function Kr(n,t){const e=new Qt(n),i={h:0,s:0,l:0};return e.getHSL(i),e.setHSL(i.h,i.s,Math.max(0,Math.min(1,i.l+t))),`#${e.getHexString()}`}function Jr(n,t,e=.05){const i=n.getImageData(0,0,t,t);let s=7;for(let r=0;r<i.data.length;r+=4){s=s*16807%2147483647;const a=(s/2147483647-.5)*255*e;i.data[r]=(i.data[r]??0)+a,i.data[r+1]=(i.data[r+1]??0)+a,i.data[r+2]=(i.data[r+2]??0)+a}n.putImageData(i,0,0)}function fu(n,t,e){return(i,s)=>{switch(i.fillStyle=t,i.fillRect(0,0,s,s),i.fillStyle=e,i.strokeStyle=e,n){case"plain":break;case"stripes":for(let r=0;r<4;r++)i.fillRect(r*(s/4),0,s/10,s);break;case"polka":for(const[r,a]of[[.25,.25],[.75,.75],[.75,.25],[.25,.75]])r===.75&&a===.25||r===.25&&a===.75||(i.beginPath(),i.arc(r*s,a*s,s*.07,0,Math.PI*2),i.fill());i.beginPath(),i.arc(0,0,s*.07,0,Math.PI*2),i.arc(s,0,s*.07,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(0,s,s*.07,0,Math.PI*2),i.arc(s,s,s*.07,0,Math.PI*2),i.fill();break;case"check":i.globalAlpha=.45;for(let r=0;r<4;r+=2)i.fillRect(r*(s/4),0,s/4,s),i.fillRect(0,r*(s/4),s,s/4);i.globalAlpha=1;break;case"brick":{const a=s/2,o=s/6;i.fillStyle=e,i.fillRect(0,0,s,s),i.fillStyle=t;for(let l=0;l<6;l++){const c=l%2?a/2:0;for(let h=-a;h<s+a;h+=a)i.fillRect(h+c+3,l*o+3,a-6,o-6)}break}case"panels":i.lineWidth=6,i.fillStyle=Kr(t,-.04);for(let r=0;r<4;r++)i.fillRect(r*(s/4)+2,0,s/4-4,s);i.fillStyle=e;for(let r=0;r<4;r++)i.fillRect(r*(s/4)-2,0,4,s);break;case"stars":for(const[r,a,o]of[[.2,.3,.06],[.7,.15,.04],[.55,.65,.07],[.12,.82,.035],[.88,.85,.05]])Ox(i,r*s,a*s,o*s);break;case"waves":i.lineWidth=s*.035;for(let r=0;r<3;r++){i.beginPath();for(let a=0;a<=s;a+=4){const o=(r+.5)*(s/3)+Math.sin(a/s*Math.PI*4)*s*.04;a===0?i.moveTo(a,o):i.lineTo(a,o)}i.stroke()}break;case"tiles":i.lineWidth=4;for(let r=0;r<=4;r++)i.beginPath(),i.moveTo(r*(s/4),0),i.lineTo(r*(s/4),s),i.moveTo(0,r*(s/4)),i.lineTo(s,r*(s/4)),i.stroke();break;case"diamond":i.globalAlpha=.6,i.beginPath(),i.moveTo(s/2,0),i.lineTo(s,s/2),i.lineTo(s/2,s),i.lineTo(0,s/2),i.closePath(),i.lineWidth=5,i.stroke(),i.globalAlpha=1,i.beginPath(),i.arc(s/2,s/2,s*.05,0,Math.PI*2),i.fill();break}Jr(i,s,.035)}}function Ox(n,t,e,i){n.beginPath();for(let s=0;s<10;s++){const r=s/10*Math.PI*2-Math.PI/2,a=s%2?i*.45:i;n.lineTo(t+Math.cos(r)*a,e+Math.sin(r)*a)}n.closePath(),n.fill()}function du(n,t,e){return(i,s)=>{switch(i.fillStyle=t,i.fillRect(0,0,s,s),n){case"planks":{const a=s/5;for(let o=0;o<5;o++){i.fillStyle=Kr(t,o*37%5*.012-.02),i.fillRect(0,o*a,s,a),i.fillStyle=e,i.fillRect(0,o*a,s,3);const l=o*.37%1*s;i.fillRect(l,o*a,3,a)}break}case"herringbone":{i.fillStyle=e,i.save(),i.lineWidth=3,i.strokeStyle=e;const r=s/4;for(let a=-s;a<s*2;a+=r)for(let o=-s;o<s*2;o+=r*2)i.strokeRect(o+a/r%2*r,a,r*2,r/2);i.restore();break}case"checker":i.fillStyle=e,i.fillRect(0,0,s/2,s/2),i.fillRect(s/2,s/2,s/2,s/2);break;case"tiles":i.strokeStyle=e,i.lineWidth=5;for(let r=0;r<=2;r++)i.beginPath(),i.moveTo(r*(s/2),0),i.lineTo(r*(s/2),s),i.moveTo(0,r*(s/2)),i.lineTo(s,r*(s/2)),i.stroke();break;case"carpet":Jr(i,s,.12),i.strokeStyle=e,i.globalAlpha=.25,i.lineWidth=2;for(let r=0;r<s;r+=16)i.beginPath(),i.moveTo(r,0),i.lineTo(r,s),i.stroke();i.globalAlpha=1;break;case"grass":i.strokeStyle=e,i.lineWidth=2;for(let r=0;r<380;r++){const a=r*97%s,o=r*61%s;i.beginPath(),i.moveTo(a,o),i.lineTo(a+(r%5-2),o-7-r%6),i.stroke()}break;case"sand":Jr(i,s,.16),i.strokeStyle=e,i.globalAlpha=.35,i.lineWidth=3;for(let r=0;r<4;r++){i.beginPath();for(let a=0;a<=s;a+=4){const o=r*(s/4)+20+Math.sin(a/s*Math.PI*2+r)*10;a===0?i.moveTo(a,o):i.lineTo(a,o)}i.stroke()}i.globalAlpha=1;break;case"stone":{i.fillStyle=e,i.fillRect(0,0,s,s),[[0,0,.55,.45],[.55,0,.45,.6],[0,.45,.35,.55],[.35,.45,.2,.55],[.55,.6,.45,.4]].forEach(([a,o,l,c],h)=>{i.fillStyle=Kr(t,h%3*.03-.03),Bx(i,a*s+4,o*s+4,l*s-8,c*s-8,14),i.fill()});break}case"metal":i.fillStyle=Kr(t,-.05);for(let r=0;r<s;r+=s/8)for(let a=r/(s/8)%2?s/16:0;a<s;a+=s/8)i.fillRect(a,r+s/32,s/14,s/40);i.strokeStyle=e,i.lineWidth=3,i.strokeRect(1,1,s-2,s-2);break;case"marble":i.strokeStyle=e,i.globalAlpha=.4,i.lineWidth=2;for(let r=0;r<6;r++){i.beginPath();let a=r*53%s,o=0;for(i.moveTo(a,o);o<s;)a+=Math.sin(o*.05+r)*6,o+=8,i.lineTo(a,o);i.stroke()}i.globalAlpha=.15,i.lineWidth=2,i.strokeRect(0,0,s,s),i.globalAlpha=1;break}n!=="carpet"&&n!=="sand"&&Jr(i,s,.04)}}function Bx(n,t,e,i,s,r){n.beginPath(),n.moveTo(t+r,e),n.arcTo(t+i,e,t+i,e+s,r),n.arcTo(t+i,e+s,t,e+s,r),n.arcTo(t,e+s,t,e,r),n.arcTo(t,e,t+i,e,r),n.closePath()}function pu(n,t,e){const i=new Jf(n);return i.wrapS=i.wrapT=Qr,i.repeat.set(t,e),i.colorSpace=ln,i.anisotropy=8,i}function G0(n,t,e,i,s){const r=n==="brick"||n==="tiles"?1:.8;return pu(ha(`w:${n}:${t}:${e}`,fu(n,t,e)),i*r,s*r)}function zx(n,t,e,i,s){const r=n==="checker"||n==="tiles"?.75:.6;return pu(ha(`f:${n}:${t}:${e}`,du(n,t,e)),i*r,s*r)}function H0(n,t,e,i){return(n==="wall"?ha(`w:${t}:${e}:${i}`,fu(t,e,i)):ha(`f:${t}:${e}:${i}`,du(t,e,i))).toDataURL()}const hl={day:{sky:"#fff6e8",ground:"#b9a58f",hemi:1.15,sun:"#fff1dc",sunI:2.3,sunPos:[6,10,7],env:.55,lamp:.7,label:"Daylight"},golden:{sky:"#ffd9a8",ground:"#7a5a4a",hemi:.85,sun:"#ffaf5f",sunI:2.4,sunPos:[9,4.5,4],env:.4,lamp:1.1,label:"Golden hour"},night:{sky:"#7083c4",ground:"#1a1a2e",hemi:.6,sun:"#a9bbff",sunI:.55,sunPos:[4,9,6],env:.16,lamp:2.4,label:"Night"},neon:{sky:"#ff6bd6",ground:"#2de2e6",hemi:.55,sun:"#b48cff",sunI:.5,sunPos:[6,8,6],env:.16,lamp:2.6,label:"Neon"},spooky:{sky:"#86d69a",ground:"#2d0a31",hemi:.5,sun:"#9fd9b4",sunI:.45,sunPos:[-3,8,7],env:.12,lamp:2.4,label:"Spooky"}},V0=10,kx={disco_ball:(n,t)=>{n.rotation.y=t*.9},ghost:(n,t,e)=>{n.position.y=.06+Math.sin(t*1.8+e)*.06,n.rotation.z=Math.sin(t*1.3+e)*.05},ufo:(n,t,e)=>{n.rotation.y=t*1.2,n.position.y=Math.sin(t*1.5+e)*.04},planet:(n,t)=>{n.rotation.y=t*.35},paper_lantern:(n,t,e)=>{n.rotation.z=Math.sin(t*.9+e)*.04},chandelier:(n,t,e)=>{n.rotation.z=Math.sin(t*.7+e)*.015},pendant:(n,t,e)=>{n.rotation.z=Math.sin(t*.8+e)*.02},dragon_egg:(n,t,e)=>{n.rotation.z=Math.sin(t*7+e)*.03*Math.max(0,Math.sin(t*.6+e))}},W0=new Map;function mu(n,t={}){const e=`${n}:${t.roughness??""}:${t.metalness??""}:${t.opacity??""}:${t.emissive?1:0}`;let i=W0.get(e);if(!i){const s=new yn({color:n,roughness:t.roughness??.7,metalness:t.metalness??0});t.opacity!==void 0&&t.opacity<1&&(s.transparent=!0,s.opacity=t.opacity,s.depthWrite=!1),t.emissive&&(s.emissive=new Qt(n),s.emissiveIntensity=1.6,s.toneMapped=!0),i=s,W0.set(e,i)}return i}function ua(n,t,e){switch(n.color.set(t),n.emissive.set(0),n.emissiveIntensity=0,e){case"matte":n.roughness=.82,n.metalness=0;break;case"gloss":n.roughness=.16,n.metalness=.05;break;case"metal":n.roughness=.3,n.metalness=.9;break;case"glow":n.roughness=.5,n.metalness=0,n.emissive.set(t),n.emissiveIntensity=1.5;break}n.needsUpdate=!0}class Gx{constructor(t){this.host=t,this.renderer=new qh({antialias:!0,alpha:!0,preserveDrawingBuffer:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Y0,this.renderer.toneMapping=sr,this.renderer.toneMappingExposure=1.05,this.renderer.outputColorSpace=ln,this.renderer.setClearColor(0,0),t.appendChild(this.renderer.domElement),this.renderer.domElement.classList.add("room-canvas");const e=new xs(this.renderer);this.scene.environment=e.fromScene(new uu,.04).texture,this.hemi=new Lh("#fff","#888",1),this.scene.add(this.hemi),this.sun=new Uh("#fff",2),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048);const i=this.sun.shadow.camera;i.left=-7,i.right=7,i.top=7,i.bottom=-7,i.near=.5,i.far=30,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.02,this.sun.shadow.radius=4,this.scene.add(this.sun,this.sun.target);for(let s=0;s<V0;s++){const r=new Nh("#fff",0,4,2);this.pool.push(r),this.scene.add(r)}this.scene.add(this.shell,this.itemsGroup),this.selection=this.makeSelection(),this.scene.add(this.selection),this.camera.position.set(9.5,7.2,11.5),this.controls=new mx(this.camera,this.renderer.domElement),this.controls.target.set(-.3,.9,-.4),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.enablePan=!1,this.controls.minDistance=6,this.controls.maxDistance=30,this.controls.minPolarAngle=.18*Math.PI,this.controls.maxPolarAngle=.47*Math.PI,this.controls.minAzimuthAngle=-.12*Math.PI,this.controls.maxAzimuthAngle=.58*Math.PI,this.controls.update(),this.composer=new Ix(this.renderer),this.composer.addPass(new Nx(this.scene,this.camera)),this.bloom=new Ms(new ot(512,512),.55,.5,.86),this.composer.addPass(this.bloom),this.composer.addPass(new Fx),this.resizeObs=new ResizeObserver(()=>this.resize()),this.resizeObs.observe(t),this.resize(),this.renderer.setAnimationLoop(()=>this.frame())}renderer;scene=new Il;camera=new Mn(32,1,.1,100);controls;composer;bloom;hemi;sun;pool=[];shell=new On;itemsGroup=new On;nodes=new Map;backWall;leftWall;floor;shellKey="";mood="day";selection;selectedUid=null;pops=new Map;frameHooks=new Set;clock=new Gd;ray=new kd;resizeObs;bloomEnabled=!0;dispose(){this.renderer.setAnimationLoop(null),this.resizeObs.disconnect(),this.controls.dispose(),this.renderer.dispose()}onFrame(t){return this.frameHooks.add(t),()=>this.frameHooks.delete(t)}resize(){const t=Math.max(1,this.host.clientWidth),e=Math.max(1,this.host.clientHeight);this.renderer.setSize(t,e,!1),this.composer.setSize(t,e),this.bloom.resolution.set(t/2,e/2),this.camera.aspect=t/e,this.camera.fov=t/e<.8?46:t/e<1.2?38:32,this.applyShift()}shiftFrac=0;shiftUp=0;setShift(t,e=0){this.shiftFrac=t,this.shiftUp=e,this.applyShift()}applyShift(){const t=Math.max(1,this.host.clientWidth),e=Math.max(1,this.host.clientHeight),i=t>760,s=i?this.shiftFrac:0,r=i?0:this.shiftUp;s||r?this.camera.setViewOffset(t,e,-s*t,r*e,t,e):this.camera.clearViewOffset(),this.camera.updateProjectionMatrix()}frame(){const t=Math.min(.05,this.clock.getDelta()),e=this.clock.elapsedTime;for(const[i,s]of this.pops){const r=this.nodes.get(i),a=(performance.now()-s)/320;if(!r||a>=1){r?.inner.scale.setScalar(1),this.pops.delete(i);continue}const o=1+.18*Math.sin(a*Math.PI)-(1-a)*(1-a)*.9*(1-a);r.inner.scale.setScalar(Math.max(.05,o))}if(this.selectedUid){const i=this.selection.children[0];i&&(i.rotation.z=e*.6)}for(const i of this.nodes.values()){const s=kx[i.def.id];s&&s(i.inner,e,i.root.id)}for(const i of this.frameHooks)i(t,e);this.controls.enabled&&this.controls.update(),this.bloomEnabled?this.composer.render():this.renderer.render(this.scene,this.camera)}buildShell(t){const e=JSON.stringify([t.wall,t.floor]);if(e===this.shellKey)return;this.shellKey=e;for(const v of[...this.shell.children])if(this.shell.remove(v),v instanceof ie){v.geometry.dispose();const m=Array.isArray(v.material)?v.material:[v.material];for(const p of m)p.map?.dispose(),p.dispose()}const i=.22,s=new yn({color:co(t.wall.color,-.1),roughness:.8}),r=v=>new yn({map:v,roughness:.92}),a=he.halfW*2,o=he.halfD*2,l=he.height,c=new yn({map:zx(t.floor.pattern,t.floor.color,t.floor.accent,a+i,o),roughness:Hx(t.floor.pattern),metalness:t.floor.pattern==="metal"?.5:0}),h=new yn({color:co(t.floor.color,-.22),roughness:.8});this.floor=new ie(new dn(a+i,.3,o),[h,h,c,h,h,h]),this.floor.position.set(-i/2,-.15,0),this.floor.receiveShadow=!0,this.floor.userData.surface="floor";const u=new ie(new dn(a+i+.3,.18,o+.3),new yn({color:"#2a2233",roughness:.6}));u.position.set(-i/2,-.39,0),u.receiveShadow=!0,this.backWall=new ie(new dn(a+i,l,i),[s,s,s,s,r(G0(t.wall.pattern,t.wall.color,t.wall.accent,a+i,l)),s]),this.backWall.position.set(-i/2,l/2,-3-i/2),this.backWall.userData.surface="back",this.leftWall=new ie(new dn(i,l,o),[r(G0(t.wall.pattern,`#${co(t.wall.color,-.03).getHexString()}`,t.wall.accent,o,l)),s,s,s,s,s]),this.leftWall.position.set(-4-i/2,l/2,0),this.leftWall.userData.surface="left";for(const v of[this.backWall,this.leftWall])v.receiveShadow=!0,v.castShadow=!0;const f=new yn({color:t.wall.accent,roughness:.6}),d=new ie(new dn(a,.14,.04),f);d.position.set(0,.07,-3+.02);const g=new ie(new dn(.04,.14,o),f);g.position.set(-4+.02,.07,0);for(const v of[d,g])v.receiveShadow=!0;this.shell.add(this.floor,u,this.backWall,this.leftWall,d,g)}setMood(t){this.mood=t;const e=hl[t];this.hemi.color.set(e.sky),this.hemi.groundColor.set(e.ground),this.hemi.intensity=e.hemi,this.sun.color.set(e.sun),this.sun.intensity=e.sunI,this.sun.position.set(...e.sunPos),this.sun.target.position.set(0,0,0),this.scene.environmentIntensity=e.env,this.bloom.strength=t==="day"?.25:t==="golden"?.35:.55,this.bloom.threshold=t==="day"?1.4:1.1,this.bloom.radius=.4}sync(t){this.buildShell(t),(t.mood!==this.mood||!this.shellKeySet)&&(this.setMood(t.mood),this.shellKeySet=!0);const e=new Set;for(const i of t.items){e.add(i.uid);let s=this.nodes.get(i.uid);(!s||s.def.id!==i.item)&&(s&&this.removeNode(i.uid),s=this.makeNode(i),this.nodes.set(i.uid,s),this.itemsGroup.add(s.root)),this.updateNode(s,i)}for(const i of[...this.nodes.keys()])e.has(i)||this.removeNode(i);this.assignLights(t),this.updateSelection(t)}shellKeySet=!1;pop(t){this.pops.set(t,performance.now())}makeNode(t){const e=Qn(t.item),i=new yn,s=new yn,r={primary:i,secondary:s,fixed:mu},a=e.build(r);a.traverse(c=>{if(c instanceof ie){const h=c.material,u=!(h.transparent&&h.opacity<.5);c.castShadow=u&&e.size.h>.04,c.receiveShadow=!0}});const o=new On;o.add(a);const l=new On;return l.add(o),l.userData.uid=t.uid,{root:l,inner:o,def:e,primary:i,secondary:s,key:""}}updateNode(t,e){const i=`${e.primary}|${e.secondary}|${e.finish}`;i!==t.key&&(t.key=i,ua(t.primary,e.primary,e.finish),ua(t.secondary,e.secondary,e.finish==="glow"&&!t.def.light?"gloss":e.finish));const s=t.root;s.scale.setScalar(e.scale),e.wall==="back"?(s.position.set(e.x,e.y,-3),s.rotation.set(0,0,0)):e.wall==="left"?(s.position.set(-4,e.y,e.z),s.rotation.set(0,Math.PI/2,0)):(s.position.set(e.x,e.y,e.z),s.rotation.set(0,e.rot,0))}removeNode(t){const e=this.nodes.get(t);e&&(this.itemsGroup.remove(e.root),e.primary.dispose(),e.secondary.dispose(),this.nodes.delete(t))}assignLights(t){const e=hl[this.mood],i=t.items.filter(s=>Qn(s.item).light).slice(0,V0);this.pool.forEach((s,r)=>{const a=i[r];if(!a){s.intensity=0;return}const l=Qn(a.item).light,c=this.nodes.get(a.uid);c.root.updateMatrixWorld(!0),s.position.copy(c.root.localToWorld(new P(...l.offset)));const h=l.color==="primary"?a.primary:l.color==="secondary"?a.secondary:l.color;s.color.set(h);const u=a.finish==="glow"?1.4:1;s.intensity=l.intensity*e.lamp*.55*u*a.scale,s.distance=l.distance*Math.max(.6,a.scale)*(e.lamp>2?1.4:1)})}makeSelection(){const t=new On,e=new ie(new Hl(.92,1,48,1,0,Math.PI*1.7),new Nl({color:"#ffd23f",transparent:!0,opacity:.95,depthTest:!1,side:Zn}));e.rotation.x=-Math.PI/2,e.renderOrder=10;const i=new Hd(new En,new Qt("#ffd23f"));return i.material.depthTest=!1,i.material.transparent=!0,i.material.opacity=.6,i.renderOrder=10,t.add(e,i),t.visible=!1,t}select(t){this.selectedUid=t}updateSelection(t){const e=this.selectedUid?this.nodes.get(this.selectedUid):void 0,i=t.items.find(c=>c.uid===this.selectedUid);if(!e||!i){this.selection.visible=!1;return}this.selection.visible=!0,e.root.updateMatrixWorld(!0);const s=new En().setFromObject(e.inner),r=this.selection.children[0];this.selection.children[1].box.copy(s.expandByScalar(.03));const o=s.getSize(new P),l=s.getCenter(new P);i.wall?r.visible=!1:(r.visible=!0,r.position.set(l.x,s.min.y+.02,l.z),r.scale.setScalar(Math.max(o.x,o.z)*.62+.1))}setRay(t){this.ray.setFromCamera(t,this.camera)}pickItem(t){this.setRay(t);const e=this.ray.intersectObjects(this.itemsGroup.children,!0);for(const i of e){let s=i.object;for(;s&&s.userData.uid===void 0;)s=s.parent;if(s)return s.userData.uid}return null}floorPoint(t,e=0){this.setRay(t);const i=new P;return this.ray.ray.intersectPlane(new qn(new P(0,1,0),-e),i)?i:null}wallPoint(t){this.setRay(t);const i=this.ray.intersectObjects([this.backWall,this.leftWall],!1)[0];return i?{point:i.point,normal:new P,surface:i.object.userData.surface}:null}surfacePoint(t,e){this.setRay(t);const i=this.itemsGroup.children.filter(r=>r.userData.uid!==e),s=this.ray.intersectObjects(i,!0);for(const r of s){if(!r.face)continue;return r.face.normal.clone().transformDirection(r.object.matrixWorld).y>.65&&r.point.y<he.height-.3?r.point:null}return null}itemScreenPos(t){const e=this.nodes.get(t);if(!e)return null;const i=new En().setFromObject(e.inner),s=new P((i.min.x+i.max.x)/2,i.max.y,(i.min.z+i.max.z)/2).project(this.camera),r=this.renderer.domElement.getBoundingClientRect();return{x:r.left+(s.x+1)/2*r.width,y:r.top+(1-s.y)/2*r.height}}setOrbit(t,e,i,s=new P(-.3,.9,-.4)){const r=new nl(i,e,t);this.camera.position.setFromSpherical(r).add(s),this.controls.target.copy(s),this.camera.lookAt(s)}fitDist(){const t=Pl.degToRad(this.camera.fov),e=2*Math.atan(Math.tan(t/2)*this.camera.aspect),i=Math.min(t,e),r=this.host.clientWidth>760?this.shiftFrac:0;return 5.3/Math.sin(i/2)*(1+Math.abs(r)*1.2)}resetCamera(){this.setOrbit(.62,.36*Math.PI,this.fitDist()),this.controls.update()}snapshot(t=360){this.bloomEnabled?this.composer.render():this.renderer.render(this.scene,this.camera);const e=this.renderer.domElement,i=Math.round(e.height/e.width*t),s=document.createElement("canvas");s.width=t,s.height=i;const r=s.getContext("2d"),a=getComputedStyle(document.body),o=r.createRadialGradient(t*.55,i*.4,0,t*.55,i*.4,t*.8);return o.addColorStop(0,a.getPropertyValue("--bg-a").trim()||"#ffe9d4"),o.addColorStop(1,a.getPropertyValue("--bg-b").trim()||"#f7c9d4"),r.fillStyle=o,r.fillRect(0,0,t,i),r.drawImage(e,0,0,t,i),s.toDataURL("image/jpeg",.82)}}function co(n,t){const e=new Qt(n),i={h:0,s:0,l:0};return e.getHSL(i),e.setHSL(i.h,i.s,Math.max(0,Math.min(1,i.l+t)))}function Hx(n){return n==="marble"?.25:n==="tiles"||n==="checker"?.45:n==="metal"?.4:.85}class Vx{design=ll();selected=null;past=[];future=[];listeners=new Set;subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}emit(t){for(const e of this.listeners)e(t)}reset(t=ll()){this.design=rx(t),this.selected=null,this.past=[],this.future=[],this.emit("reset")}checkpoint(){this.past.push(JSON.stringify(this.design)),this.past.length>80&&this.past.shift(),this.future=[]}canUndo(){return this.past.length>0}canRedo(){return this.future.length>0}undo(){const t=this.past.pop();t&&(this.future.push(JSON.stringify(this.design)),this.design=JSON.parse(t),this.selected&&!this.find(this.selected)&&(this.selected=null),this.emit("history"))}redo(){const t=this.future.pop();t&&(this.past.push(JSON.stringify(this.design)),this.design=JSON.parse(t),this.selected&&!this.find(this.selected)&&(this.selected=null),this.emit("history"))}find(t){return this.design.items.find(e=>e.uid===t)}get selectedItem(){return this.selected?this.find(this.selected):void 0}select(t){t!==this.selected&&(this.selected=t,this.emit("select"))}isFull(){return this.design.items.length>=cl}add(t,e){if(this.isFull())return null;this.checkpoint();const i={uid:N0(),item:t.id,x:0,y:0,z:0,rot:0,scale:1,primary:t.defaultColors.primary,secondary:t.defaultColors.secondary,finish:"matte"},s=e?.x??0,r=e?.z??0;if(t.placement==="wall"){const a=r+he.halfD;s+he.halfW<a*.8?(i.wall="left",i.x=-4,i.z=r):(i.wall="back",i.x=s,i.z=-3),i.y=t.id==="door"?t.size.h/2:Math.min(1.7,he.height-t.size.h/2-.1)}else{const a=this.freeSpot(t,s,r);i.x=a.x,i.z=a.z,i.y=0,t.placement==="ceiling"&&(i.y=he.height)}return gu(t)&&(i.finish="glow"),ho(i,t),this.design.items.push(i),this.selected=i.uid,this.emit("add"),i}freeSpot(t,e,i){const s=t.size.h<.06,r=Math.max(t.size.w,t.size.d)/2,a=this.design.items.filter(l=>!l.wall).map(l=>{const c=Qn(l.item);return{o:l,d:c,r:Math.max(c.size.w,c.size.d)/2*l.scale}}).filter(l=>l.d.size.h>=.06&&l.d.placement==="ceiling"==(t.placement==="ceiling"));if(s)return{x:e,z:i};const o=(l,c)=>Math.abs(l)<=he.halfW-r*.6&&Math.abs(c)<=he.halfD-r*.6&&a.every(h=>Math.hypot(h.o.x-l,h.o.z-c)>=(h.r+r)*.8);for(let l=0;l<=8;l++){const c=l*.45,h=l===0?1:l*6;for(let u=0;u<h;u++){const f=u/h*Math.PI*2+l,d=e+Math.cos(f)*c,g=i+Math.sin(f)*c;if(o(d,g))return{x:d,z:g}}}return{x:e,z:i}}duplicate(t){const e=this.find(t);if(!e||this.isFull())return null;this.checkpoint();const i=Qn(e.item),s={...e,uid:N0()};return s.wall==="left"?s.z+=.6:s.wall==="back"?s.x+=.6:(s.x+=.6,s.z+=.3),ho(s,i),this.design.items.push(s),this.selected=s.uid,this.emit("add"),s}remove(t){const e=this.design.items.findIndex(i=>i.uid===t);e<0||(this.checkpoint(),this.design.items.splice(e,1),this.selected===t&&(this.selected=null),this.emit("remove"))}patch(t,e,i="patch"){const s=this.find(t);s&&(Object.assign(s,e),ho(s,Qn(s.item)),this.emit(i))}edit(t,e){this.checkpoint(),this.patch(t,e,"edit")}setColor(t,e,i){this.edit(t,{[e]:i})}setFinish(t,e){this.edit(t,{finish:e})}rotate(t,e){const i=this.find(t);!i||i.wall||this.edit(t,{rot:Wx(i.rot+e)})}setRoom(t){this.checkpoint(),t.mood&&(this.design.mood=t.mood),t.wall&&Object.assign(this.design.wall,t.wall),t.floor&&Object.assign(this.design.floor,t.floor),this.emit("room")}}function gu(n){return!!n.light&&(n.tags.includes("neon")||n.id==="paper_lantern")}function Wx(n){const t=Math.PI*2;return(n%t+t)%t}function ho(n,t){const e=n.scale;n.scale=Math.max(.4,Math.min(2.5,e));const i=t.size.w*n.scale/2;if(n.wall){const h=n.wall==="back"?he.halfW:he.halfD,u=n.wall==="back"?n.x:n.z,f=Math.max(-h+i+.02,Math.min(h-i-.02,u));n.wall==="back"?(n.x=f,n.z=-3):(n.z=f,n.x=-4);const d=t.size.h*n.scale/2;n.y=Math.max(d,Math.min(he.height-d,n.y));return}const s=t.size.w*n.scale,r=t.size.d*n.scale,a=Math.abs(Math.cos(n.rot)),o=Math.abs(Math.sin(n.rot)),l=(s*a+r*o)/2,c=(s*o+r*a)/2;n.x=Math.max(-4+Math.min(l,he.halfW),Math.min(he.halfW-Math.min(l,he.halfW)*.6,n.x)),n.z=Math.max(-3+Math.min(c,he.halfD),Math.min(he.halfD-Math.min(c,he.halfD)*.6,n.z)),t.placement==="ceiling"?n.y=he.height:n.y=Math.max(0,Math.min(he.height-t.size.h*n.scale,n.y))}class Xx{constructor(t,e,i){this.view=t,this.editor=e,this.canvas=i,i.addEventListener("pointerdown",this.down,{capture:!0}),window.addEventListener("pointermove",this.move),window.addEventListener("pointerup",this.up),window.addEventListener("pointercancel",this.up)}dragging=null;downAt=null;pending=null;enabled=!0;onDragged=null;dispose(){this.canvas.removeEventListener("pointerdown",this.down,{capture:!0}),window.removeEventListener("pointermove",this.move),window.removeEventListener("pointerup",this.up),window.removeEventListener("pointercancel",this.up)}ndc(t){const e=this.canvas.getBoundingClientRect();return new ot((t.clientX-e.left)/e.width*2-1,-((t.clientY-e.top)/e.height)*2+1)}overCanvas(t){const e=this.canvas.getBoundingClientRect();return document.elementFromPoint(t.clientX,t.clientY)===this.canvas&&t.clientX>=e.left&&t.clientX<=e.right&&t.clientY>=e.top&&t.clientY<=e.bottom}beginCatalogDrag(t,e){this.pending={def:t,x:e.clientX,y:e.clientY,pointerId:e.pointerId}}consumedCatalogPress=!1;down=t=>{if(!this.enabled||t.button>0)return;const e=this.view.pickItem(this.ndc(t));this.downAt={x:t.clientX,y:t.clientY,onItem:!!e},e&&(t.stopImmediatePropagation(),this.view.controls.enabled=!1,this.editor.select(e),this.startDrag(e,t))};startDrag(t,e){const i=this.editor.find(t);if(!i)return;const s=Qn(i.item),r=new ot;let a=0;if(s.placement==="wall"){const o=this.view.wallPoint(this.ndc(e));o&&(a=i.y-o.point.y)}else{const o=this.view.floorPoint(this.ndc(e),s.placement==="ceiling"?0:i.y);o&&r.set(i.x-o.x,i.z-o.z)}this.dragging={uid:t,offset:r,yOffset:a,moved:!1,pointerId:e.pointerId}}move=t=>{if(this.pending&&t.pointerId===this.pending.pointerId){if(Math.hypot(t.clientX-this.pending.x,t.clientY-this.pending.y)>12&&this.overCanvas(t)){const c=this.view.floorPoint(this.ndc(t))??new P,h=this.editor.add(this.pending.def,{x:c.x,z:c.z});this.consumedCatalogPress=!0,this.pending=null,h&&(Jt.play("pop"),this.view.pop(h.uid),this.view.controls.enabled=!1,this.dragging={uid:h.uid,offset:new ot,yOffset:0,moved:!0,pointerId:t.pointerId},this.editor.checkpoint())}return}const e=this.dragging;if(!e||t.pointerId!==e.pointerId)return;const i=this.editor.find(e.uid);if(!i)return;if(!e.moved){if(this.downAt&&Math.hypot(t.clientX-this.downAt.x,t.clientY-this.downAt.y)<4)return;e.moved=!0,this.editor.checkpoint()}const s=Qn(i.item),r=this.ndc(t);if(s.placement==="wall"){const l=this.view.wallPoint(r);if(!l)return;const c=l.point.y+e.yOffset;l.surface==="back"?this.editor.patch(e.uid,{wall:"back",x:l.point.x,y:c,z:-3},"drag"):this.editor.patch(e.uid,{wall:"left",z:l.point.z,y:c,x:-4},"drag");return}if(s.placement==="surface"){const l=this.view.surfacePoint(r,e.uid);if(l){this.editor.patch(e.uid,{x:l.x,z:l.z,y:l.y},"drag");return}}const a=this.view.floorPoint(r,0);if(!a)return;const o=s.placement==="ceiling"?he.height:0;this.editor.patch(e.uid,{x:a.x+e.offset.x,z:a.z+e.offset.y,y:o},"drag")};up=t=>{if(this.pending&&t.pointerId===this.pending.pointerId){this.pending=null;return}const e=this.dragging;if(e&&t.pointerId===e.pointerId){this.dragging=null,this.view.controls.enabled=!0,e.moved&&(Jt.play("drop"),this.editor.emit("commit"),this.onDragged?.()),this.downAt=null;return}this.downAt&&!this.downAt.onItem&&Math.hypot(t.clientX-this.downAt.x,t.clientY-this.downAt.y)<5&&t.target===this.canvas&&this.editor.select(null),this.downAt=null}}function O(n,t=null,...e){const i=document.createElement(n);if(t)for(const[s,r]of Object.entries(t))r==null||r===!1||(s.startsWith("on")&&typeof r=="function"?i.addEventListener(s.slice(2).toLowerCase(),r):s==="class"?i.className=String(r):s==="html"?i.innerHTML=String(r):r===!0?i.setAttribute(s,""):i.setAttribute(s,String(r)));for(const s of e)Yx(i,s);return i}function Yx(n,t){t==null||t===!1||n.append(typeof t=="string"||typeof t=="number"?String(t):t)}function wn(n){for(;n.firstChild;)n.removeChild(n.firstChild)}function De(n){const t=document.createElement("span");return t.className="svg",t.innerHTML=n,t}const fn=n=>new Promise(t=>setTimeout(t,n));function ss(n,t="info",e=2600){let i=document.getElementById("toasts");i||(i=O("div",{id:"toasts","aria-live":"polite"}),document.body.append(i));const s=O("div",{class:`toast toast-${t}`},n);i.append(s),setTimeout(()=>s.classList.add("out"),e),setTimeout(()=>s.remove(),e+400)}const Le={undo:'<svg viewBox="0 0 24 24"><path d="M9 7 4 12l5 5M4 12h11a5 5 0 0 1 0 10h-3"/></svg>',redo:'<svg viewBox="0 0 24 24"><path d="m15 7 5 5-5 5M20 12H9a5 5 0 0 0 0 10h3"/></svg>',rotL:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/></svg>',rotR:'<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/></svg>',copy:'<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',trash:'<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',camera:'<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',close:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',music:'<svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',sound:'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></svg>',star:'<svg viewBox="0 0 24 24"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',lock:'<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',check:'<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>',coin:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1 1.3-1.8 3-1.8s3 .8 3 1.8-1.3 1.6-3 2-3 1-3 2 1.3 1.8 3 1.8 3-.8 3-1.8"/></svg>',home:'<svg viewBox="0 0 24 24"><path d="M3 11 12 4l9 7M5 10v10h14V10"/></svg>',grid:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>'},X0=192;let Yn=null,Mi,ks;const _u=new Map,vu=[];let ul=!1;function qx(){Yn=new qh({antialias:!0,alpha:!0,preserveDrawingBuffer:!0}),Yn.setSize(X0,X0,!1),Yn.setPixelRatio(1),Yn.toneMapping=sr,Yn.outputColorSpace=ln,Yn.setClearColor(0,0),Mi=new Il;const n=new xs(Yn);Mi.environment=n.fromScene(new uu,.04).texture,Mi.environmentIntensity=.6,Mi.add(new Lh("#fff8ee","#9b8a7a",1.4));const t=new Uh("#ffffff",2.2);t.position.set(3,5,4),Mi.add(t),ks=new Mn(30,1,.01,100)}function $x(n){const t=_u.get(n.id);return t?Promise.resolve(t):new Promise(e=>{vu.push({def:n,resolve:e}),ul||xu()})}function xu(){ul=!0;const n=vu.splice(0,6);if(n.length===0){ul=!1;return}for(const{def:t,resolve:e}of n)try{e(Zx(t))}catch(i){console.warn("thumb failed",t.id,i),e("")}requestAnimationFrame(xu)}function Zx(n){Yn||qx();const t=new yn,e=new yn;ua(t,n.defaultColors.primary,gu(n)?"glow":"matte"),ua(e,n.defaultColors.secondary,"matte");const i=n.build({primary:t,secondary:e,fixed:mu}),s=new On;s.add(i),s.rotation.y=n.placement==="wall"?-.25:-.55,Mi.add(s);const r=new En().setFromObject(s),a=r.getSize(new P),o=r.getCenter(new P),c=(Math.max(a.x,a.y,a.z)*.62+.001)/Math.sin(Pl.degToRad(ks.fov/2)),h=n.placement==="wall"?.12:n.placement==="ceiling"?-.05:a.y<.1?.9:.32;ks.position.set(o.x,o.y+c*Math.sin(h),o.z+c*Math.cos(h)),ks.lookAt(o),Yn.render(Mi,ks);const u=Yn.domElement.toDataURL("image/png");return Mi.remove(s),t.dispose(),e.dispose(),_u.set(n.id,u),u}const Kx=[{id:"matte",label:"Matte"},{id:"gloss",label:"Gloss"},{id:"metal",label:"Metal"},{id:"glow",label:"Glow"}],Jx=n=>ou(Qn(n));function Qx(n,t){return new Promise(e=>{const i=new Vx,s=n.view,r=new Xx(s,i,s.renderer.domElement);let a="furniture",o=t.seconds,l=!1,c=null;s.select(null),s.sync(i.design),s.resetCamera(),s.setShift(.04,.16),s.controls.autoRotate=!1,s.controls.enabled=!0,n.backdrop(i.design.mood),Jt.music("build");const h=O("div",{class:"timer",role:"timer","aria-live":"off"},"4:00"),u=t.twist?O("div",{class:"twist-chip",title:"Optional bonus challenge"},De(Le.check),t.twist.text):null,f=O("div",{class:"coins"},De(Le.coin),String(n.profile.coins)),d=O("button",{class:"btn btn-primary",id:"done-btn",onclick:()=>bt(!1)},"I'm done"),g=O("header",{class:"build-top"},O("div",{class:"theme-card"},O("div",{class:"eyebrow"},"Theme"),O("div",{class:"theme-name"},t.theme.name),u),h,O("div",{class:"top-right"},f,d)),v=O("nav",{class:"tabs",role:"tablist"}),m=O("div",{class:"catalog-grid"}),p=O("aside",{class:"catalog panel"},v,m),y=O("aside",{class:"inspector panel",hidden:!0}),w=O("span",{class:"count"}),M=O("button",{class:"icon-btn",title:"Undo (Ctrl+Z)","aria-label":"Undo",onclick:()=>{i.undo(),Jt.play("click")}},De(Le.undo)),R=O("button",{class:"icon-btn",title:"Redo (Ctrl+Shift+Z)","aria-label":"Redo",onclick:()=>{i.redo(),Jt.play("click")}},De(Le.redo)),T=O("button",{class:"icon-btn",title:"Reset view","aria-label":"Reset view",onclick:()=>s.resetCamera()},De(Le.camera)),_=O("div",{class:"build-tools"},M,R,T,w),S=O("div",{class:"screen build-screen"},g,p,y,_);wn(n.ui),n.ui.append(S);const I=[{id:"room",label:"Room"},...Kv];function C(){wn(v);for(const G of I)v.append(O("button",{class:`tab${G.id===a?" on":""}`,role:"tab","aria-selected":String(G.id===a),onclick:()=>{a=G.id,c=null,Jt.play("click"),C(),k()}},G.label))}function N(G){return G.price===0||n.profile.unlocked.includes(G.id)}function k(){if(wn(m),m.classList.toggle("room-tab",a==="room"),a==="room"){J();return}const G=Sa.filter(ut=>ut.category===a).sort((ut,Gt)=>+!N(ut)-+!N(Gt)||ut.price-Gt.price);for(const ut of G){const Gt=N(ut),Pt=O("img",{alt:"",draggable:"false"});$x(ut).then(Xt=>{Xt&&(Pt.src=Xt)});const pt=O("button",{class:`item-card${Gt?"":" locked"}${c===ut.id?" armed":""}`,title:Gt?`${ut.name}: tap to add, or drag into the room`:`${ut.name}: unlock for ${ut.price} coins`},O("span",{class:"thumb"},Pt),O("span",{class:"label"},ut.name),Gt?null:O("span",{class:"price"},c===ut.id?"Tap to buy":O("span",null,De(Le.lock),String(ut.price))));pt.addEventListener("pointerdown",Xt=>{r.consumedCatalogPress=!1,Gt&&r.beginCatalogDrag(ut,Xt)}),pt.addEventListener("click",()=>{if(!r.consumedCatalogPress){if(!Gt)return q(ut);D(ut)}}),m.append(pt)}}function q(G){if(c!==G.id){c=G.id,Jt.play("click"),k();return}if(n.profile.coins<G.price){Jt.play("buzz"),ss(`You need ${G.price-n.profile.coins} more coins. Win rounds to earn them.`,"warn"),c=null,k();return}n.profile.coins-=G.price,n.profile.unlocked.push(G.id),n.save(),c=null,Jt.play("coin"),ss(`Unlocked ${G.name}!`,"good"),f.lastChild.textContent=String(n.profile.coins),k()}function D(G){if(i.isFull()){ss(`Rooms hold up to ${cl} items.`,"warn");return}const ut=s.controls.target,Gt=i.add(G,{x:ut.x+.3,z:ut.z+.6});Gt&&(s.pop(Gt.uid),Jt.play("pop"),Dt("drag"))}function H(G,ut,Gt,Pt){return O("div",{class:"swatch-block"},Pt?O("div",{class:"mini-label"},Pt):null,O("div",{class:"swatches"},...G.map(pt=>O("button",{class:`swatch${pt.toLowerCase()===ut.toLowerCase()?" on":""}`,style:`--c:${pt}`,title:pt,"aria-label":`Colour ${pt}`,onclick:()=>{Gt(pt),Jt.play("click")}})),O("label",{class:"swatch custom",title:"Custom colour"},O("input",{type:"color",value:ut,"aria-label":"Custom colour",onchange:pt=>Gt(pt.target.value)}))))}function J(){const G=i.design,ut=O("div",{class:"pattern-grid"},...su.map(pt=>O("button",{class:`pattern${G.wall.pattern===pt?" on":""}`,title:pt,"aria-label":`Wallpaper ${pt}`,onclick:()=>i.setRoom({wall:{pattern:pt}})},O("img",{src:H0("wall",pt,G.wall.color,G.wall.accent),alt:""}),O("span",null,uo(pt))))),Gt=O("div",{class:"pattern-grid"},...ru.map(pt=>O("button",{class:`pattern${G.floor.pattern===pt?" on":""}`,title:pt,"aria-label":`Floor ${pt}`,onclick:()=>i.setRoom({floor:{pattern:pt}})},O("img",{src:H0("floor",pt,G.floor.color,G.floor.accent),alt:""}),O("span",null,uo(pt))))),Pt=O("div",{class:"chips"},...au.map(pt=>O("button",{class:`chip mood-${pt}${G.mood===pt?" on":""}`,onclick:()=>{i.setRoom({mood:pt}),n.backdrop(pt)}},hl[pt].label)));m.append(O("section",{class:"room-sec"},O("h3",null,"Lighting mood"),Pt),O("section",{class:"room-sec"},O("h3",null,"Wallpaper"),ut,H(t.theme.palette,G.wall.color,pt=>i.setRoom({wall:{color:pt}}),"Theme colours"),H(os,G.wall.color,pt=>i.setRoom({wall:{color:pt}}),"Main colour"),H(os,G.wall.accent,pt=>i.setRoom({wall:{accent:pt}}),"Pattern colour")),O("section",{class:"room-sec"},O("h3",null,"Floor"),Gt,H(t.theme.palette,G.floor.color,pt=>i.setRoom({floor:{color:pt}}),"Theme colours"),H(os,G.floor.color,pt=>i.setRoom({floor:{color:pt}}),"Main colour"),H(os,G.floor.accent,pt=>i.setRoom({floor:{accent:pt}}),"Pattern colour")))}let z="primary";function lt(){const G=i.selectedItem;if(y.hidden=!G,S.classList.toggle("has-selection",!!G),wn(y),!G)return;const ut=Qn(G.item);ut.slots===1&&(z="primary");const Gt=ut.slots===2?O("div",{class:"seg"},O("button",{class:z==="primary"?"on":"",onclick:()=>{z="primary",lt()}},O("i",{style:`--c:${G.primary}`}),"Main"),O("button",{class:z==="secondary"?"on":"",onclick:()=>{z="secondary",lt()}},O("i",{style:`--c:${G.secondary}`}),"Accent")):null,Pt=G[z],pt=O("output",null,`${Math.round(G.scale*100)}%`),Xt=O("input",{type:"range",min:"0.5",max:"2.2",step:"0.05",value:String(G.scale),"aria-label":"Size"});Xt.addEventListener("pointerdown",()=>i.checkpoint()),Xt.addEventListener("keydown",()=>i.checkpoint()),Xt.addEventListener("input",()=>{i.patch(G.uid,{scale:Number(Xt.value)},"slide"),pt.textContent=`${Math.round(Number(Xt.value)*100)}%`}),y.append(O("div",{class:"insp-head"},O("div",null,O("div",{class:"eyebrow"},uo(ut.category)),O("h2",null,ut.name)),O("button",{class:"icon-btn ghost","aria-label":"Close",onclick:()=>i.select(null)},De(Le.close))),Gt??"",H(t.theme.palette,Pt,j=>i.setColor(G.uid,z,j),"Theme colours"),H(os,Pt,j=>i.setColor(G.uid,z,j),"All colours"),O("div",{class:"mini-label"},"Finish"),O("div",{class:"chips"},...Kx.map(j=>O("button",{class:`chip${G.finish===j.id?" on":""}`,onclick:()=>{i.setFinish(G.uid,j.id),Jt.play("click")}},j.label))),O("div",{class:"mini-label row"},"Size",pt),Xt,O("div",{class:"insp-actions"},G.wall?null:O("button",{class:"icon-btn",title:"Rotate left (Q)","aria-label":"Rotate left",onclick:()=>i.rotate(G.uid,Math.PI/4)},De(Le.rotL)),G.wall?null:O("button",{class:"icon-btn",title:"Rotate right (E)","aria-label":"Rotate right",onclick:()=>i.rotate(G.uid,-Math.PI/4)},De(Le.rotR)),O("button",{class:"icon-btn",title:"Duplicate (Ctrl+D)","aria-label":"Duplicate",onclick:()=>{const j=i.duplicate(G.uid);j&&(s.pop(j.uid),Jt.play("pop"))}},De(Le.copy)),O("button",{class:"icon-btn danger",title:"Delete (Del)","aria-label":"Delete",onclick:()=>{i.remove(G.uid),Jt.play("delete")}},De(Le.trash))))}function $(){M.disabled=!i.canUndo(),R.disabled=!i.canRedo(),w.textContent=`${i.design.items.length} / ${cl} items`,u&&t.twist&&u.classList.toggle("met",t.twist.check(i.design,Jx))}i.subscribe(G=>{s.select(i.selected),s.sync(i.design),!(G==="drag"||G==="slide")&&($(),(G==="room"||G==="history"||G==="reset")&&(n.backdrop(i.design.mood),a==="room"&&k()),lt())});const nt=G=>{if(G.target?.tagName==="INPUT"&&G.target.type!=="range")return;const ut=G.ctrlKey||G.metaKey,Gt=i.selected;if(ut&&G.key.toLowerCase()==="z"){G.preventDefault(),G.shiftKey?i.redo():i.undo();return}if(ut&&G.key.toLowerCase()==="y"){G.preventDefault(),i.redo();return}if(Gt){if(G.key==="Delete"||G.key==="Backspace")G.preventDefault(),i.remove(Gt),Jt.play("delete");else if(ut&&G.key.toLowerCase()==="d"){G.preventDefault();const Pt=i.duplicate(Gt);Pt&&s.pop(Pt.uid)}else if(G.key.toLowerCase()==="q")i.rotate(Gt,Math.PI/4);else if(G.key.toLowerCase()==="e")i.rotate(Gt,-Math.PI/4);else if(G.key==="Escape")i.select(null);else if(G.key.startsWith("Arrow")){G.preventDefault();const Pt=i.find(Gt),pt=G.shiftKey?.25:.05,Xt=G.key==="ArrowRight"?pt:G.key==="ArrowLeft"?-pt:0,j=G.key==="ArrowDown"?pt:G.key==="ArrowUp"?-pt:0;Pt.wall==="back"?i.edit(Gt,{x:Pt.x+Xt,y:Pt.y-j}):Pt.wall==="left"?i.edit(Gt,{z:Pt.z+Xt,y:Pt.y-j}):i.edit(Gt,{x:Pt.x+Xt,z:Pt.z+j})}}};window.addEventListener("keydown",nt);const at=new Set;function Dt(G){if(n.profile.coached||at.has(G))return;at.add(G);const ut={start:"Tap an item to add it, or drag it straight into the room.",drag:"Drag items to move them. Drag empty space to look around.",room:"Open the Room tab to change the wallpaper, floor and lighting."}[G];ss(ut,"info",4200)}r.onDragged=()=>{at.has("room")||setTimeout(()=>Dt("room"),600)},Dt("start");const Ht=G=>`${Math.floor(G/60)}:${String(Math.max(0,G)%60).padStart(2,"0")}`;h.textContent=Ht(o);const Q=window.setInterval(()=>{o-=1,h.textContent=Ht(o),h.classList.toggle("hurry",o<=30),o<=10&&o>0&&Jt.play("tick"),o===60&&ss("One minute left!","warn"),o<=0&&bt(!0)},1e3);function bt(G,ut=!1){if(l)return;if(!G&&!ut&&i.design.items.length<3){Vt();return}l=!0,window.clearInterval(Q),window.removeEventListener("keydown",nt),r.dispose(),i.select(null),s.select(null),s.sync(i.design),Jt.play(G?"buzz":"whoosh"),n.profile.coached=!0,n.save();const Gt=O("div",{class:"times-up"},G?"Time's up!":"Locked in!");S.append(Gt),setTimeout(()=>e(i.design),1300)}let It=!1;function Vt(){if(It){bt(!1,!0);return}It=!0,d.textContent="Submit anyway?",ss("Your room is nearly empty. Add a few more things to impress the judges.","warn"),setTimeout(()=>{It=!1,d.textContent="I'm done"},3500)}C(),k(),lt(),$()})}function uo(n){return n.charAt(0).toUpperCase()+n.slice(1).replace(/_/g," ")}function jx(n){const t=n.profile;let e=-1;n.view.controls.enabled=!0,n.view.setShift(.12,.22);const i=O("div",{class:"gallery-info"}),s=O("div",{class:"gallery-grid"},...t.gallery.map((a,o)=>O("button",{class:"gallery-card",onclick:()=>r(o)},a.thumb?O("img",{src:a.thumb,alt:`${a.themeName} room`}):O("div",{class:"no-thumb"}),O("div",{class:"gc-name"},a.themeName),O("div",{class:"gc-meta"},De(Le.star),`${a.stars.toFixed(1)} · ${Ys(a.place)} of ${a.of}`))));function r(a){const o=t.gallery[a];o&&(e=a,Jt.play("click"),n.view.sync(o.design),n.view.select(null),n.backdrop(o.design.mood),n.view.resetCamera(),s.querySelectorAll(".gallery-card").forEach((l,c)=>l.classList.toggle("on",c===e)),wn(i),i.append(O("b",null,o.themeName),` · ${new Date(o.date).toLocaleDateString()} · drag to look around`))}return wn(n.ui),n.ui.append(O("div",{class:"screen gallery-screen"},O("div",{class:"gallery-panel panel"},O("div",{class:"gallery-head"},O("h2",null,"My rooms"),O("button",{class:"btn",onclick:()=>{Jt.play("click"),n.goTitle()}},De(Le.home),"Back")),s),i)),r(0),()=>{}}function ds(n,t=56){const e=[`<path d="M18 27c0-9 6-15 14-15s14 6 14 15c-3-4-7-6-14-6s-11 2-14 6z" fill="${n.hair}"/>`,`<g fill="${n.hair}"><circle cx="20" cy="22" r="7"/><circle cx="28" cy="15" r="7"/><circle cx="37" cy="15" r="7"/><circle cx="45" cy="22" r="7"/><circle cx="17" cy="30" r="5"/><circle cx="47" cy="30" r="5"/></g>`,`<path d="M16 30c0-11 7-18 16-18s16 7 16 18v18h-6V28c-3-4-6-5-10-5s-7 1-10 5v20h-6z" fill="${n.hair}"/>`,`<g fill="${n.hair}"><circle cx="32" cy="9" r="6"/><path d="M18 27c0-9 6-15 14-15s14 6 14 15c-3-3-8-5-14-5s-11 2-14 5z"/></g>`,`<g fill="${n.hair}"><circle cx="14" cy="30" r="6"/><circle cx="50" cy="30" r="6"/><path d="M18 27c0-9 6-15 14-15s14 6 14 15c-4-2-8-6-14-6s-10 4-14 6z"/></g>`,`<path d="M18 26c0-10 5-16 14-16 6 0 11 2 14 7-5-2-9 0-12 4-4-2-10-1-16 5z" fill="${n.hair}"/>`][n.hairStyle%6];return`<svg class="avatar" width="${t}" height="${t}" viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="32" cy="32" r="31" fill="var(--avatar-bg)"/>
    <clipPath id="c${n.hairStyle}${n.top.slice(1)}"><circle cx="32" cy="32" r="31"/></clipPath>
    <g clip-path="url(#c${n.hairStyle}${n.top.slice(1)})">
      <path d="M10 66c0-13 10-20 22-20s22 7 22 20z" fill="${n.top}"/>
      <rect x="28" y="38" width="8" height="9" rx="3" fill="${n.skin}"/>
      <ellipse cx="32" cy="29" rx="13" ry="14" fill="${n.skin}"/>
      ${e}
      <circle cx="27" cy="30" r="1.8" fill="#221a2c"/><circle cx="37" cy="30" r="1.8" fill="#221a2c"/>
      <path d="M28 36c2.5 2 5.5 2 8 0" stroke="#221a2c" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <circle cx="24" cy="34" r="2.4" fill="#ff8fb1" opacity=".45"/><circle cx="40" cy="34" r="2.4" fill="#ff8fb1" opacity=".45"/>
    </g>
  </svg>`}function yu(n){n.controls.enabled=!1;const t=performance.now();return n.onFrame(()=>{const e=(performance.now()-t)/1e3;n.setOrbit(.42+.34*Math.sin(e*.13),(.34+.03*Math.sin(e*.21))*Math.PI,n.fitDist()*(.97+Math.sin(e*.17)*.05))})}const ty=n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2;function ey(n,t){n.controls.enabled=!1;const e=performance.now();let i=()=>{};return{done:new Promise(r=>{i=n.onFrame(()=>{const a=Math.min(1,(performance.now()-e)/t),o=ty(a);n.setOrbit(1.08-.82*o,(.29+.1*o)*Math.PI,n.fitDist()*(1.12-.36*o)),a>=1&&(i(),r())})}),stop:()=>i()}}async function ny(n,t,e){const i=t.results(),s=i.find(_=>_.contestant.isPlayer),r=t.rewards(),a=n.profile,o=ol(a.xp);a.coins+=r.coins,a.xp+=r.xp,a.rounds+=1,s.place===1&&(a.wins+=1),a.bestStars=Math.max(a.bestStars,s.stars),tx(a,{themeName:t.theme.name,stars:s.stars,place:s.place,of:i.length,date:new Date().toISOString(),thumb:e.get(s.contestant.id)??"",design:s.design}),n.save();const l=ol(a.xp);n.view.sync(s.design),n.backdrop(s.design.mood);const c=yu(n.view);n.view.setShift(0),Jt.music(null);const h=O("div",{class:"podium"},...[1,0,2].map(_=>{const S=i[_];return S?O("div",{class:`pod pod-${S.place}${S.contestant.isPlayer?" me":""}`},O("div",{class:"pod-thumb"},e.get(S.contestant.id)?O("img",{src:e.get(S.contestant.id),alt:`${S.contestant.name}'s room`}):null),O("div",{class:"pod-who"},O("span",{html:ds(S.contestant.avatar,34)}),O("span",null,S.contestant.isPlayer?"You":S.contestant.name)),O("div",{class:"pod-stars"},De(Le.star),S.stars.toFixed(1)),O("div",{class:"pod-step"},Ys(S.place))):O("div")})),u=O("ol",{class:"standings",start:"4"},...i.slice(3).map(_=>O("li",{class:_.contestant.isPlayer?"me":""},O("span",{html:ds(_.contestant.avatar,28)}),O("span",{class:"st-name"},_.contestant.isPlayer?"You":_.contestant.name),O("span",{class:"st-stars"},De(Le.star),_.stars.toFixed(1))))),f=["theme","style","detail","layout"].map(_=>{const S={theme:"On theme",style:"Colour",detail:"Detail",layout:"Layout"}[_],I=s.breakdown[_];return O("div",{class:"bar-row"},O("span",null,S),O("div",{class:"bar"},O("i",{style:`--v:${Math.round(I*100)}%`})),O("span",{class:"bar-v"},iy(I)))}),d=O("div",{class:"comments"},...s.votes.filter(_=>_.comment).slice(0,3).map(_=>{const S=t.contestants.find(I=>I.id===_.from);return O("div",{class:"comment"},O("span",{html:ds(S.avatar,30)}),O("div",null,O("b",null,S.name),` “${_.comment}”`))})),g=O("b",null,"+0"),v=O("div",{class:"rewards"},...r.lines.map(_=>O("div",{class:"rw-line"},O("span",null,_.label),O("span",null,`+${_.coins}`))),O("div",{class:"rw-total"},O("span",null,De(Le.coin),"Coins"),g)),m=O("div",{class:"level"},O("div",{class:"lv-top"},O("b",null,`Level ${l.level}`),O("span",null,jh(l.level))),O("div",{class:"bar"},O("i",{style:`--v:${Math.round(l.into/l.need*100)}%`})));let p=()=>{};const y=new Promise(_=>p=_),w=s.place===1?"You won!":s.place<=3?`You placed ${Ys(s.place)}!`:`You placed ${Ys(s.place)}`,M=O("section",{class:"results-card panel"},O("div",{class:"eyebrow"},t.theme.name),O("h1",{class:"results-head"},w),h,i.length>3?u:null),R=O("section",{class:"score-card panel"},O("div",{class:"score-top"},O("div",null,O("div",{class:"eyebrow"},"Your score"),O("div",{class:"big-stars"},De(Le.star),s.stars.toFixed(1))),t.twist?O("div",{class:`twist-result${s.breakdown.twist?" met":""}`},s.breakdown.twist?De(Le.check):null,s.breakdown.twist?"Twist done":"Twist missed"):null),...f,d,v,m,O("div",{class:"results-actions"},O("button",{class:"btn btn-primary btn-big",onclick:()=>{Jt.play("click"),p("again")}},"Play again"),O("button",{class:"btn",onclick:()=>{Jt.play("click"),p("home")}},De(Le.home),"Home")));wn(n.ui),n.ui.append(O("div",{class:"screen results-screen"},M,R)),s.place===1?(Jt.play("fanfare"),sy(n.ui)):Jt.play("reveal"),l.level>o.level&&(await fn(900),m.classList.add("up"),Jt.play("fanfare"));for(let _=0;_<=r.coins;_+=Math.max(1,Math.round(r.coins/24)))g.textContent=`+${_}`,await fn(30);g.textContent=`+${r.coins}`,Jt.play("coin");const T=await y;return c(),T}function iy(n){return n>=.85?"A+":n>=.72?"A":n>=.6?"B":n>=.45?"C":n>=.3?"D":"E"}function sy(n){const t=O("div",{class:"confetti","aria-hidden":"true"}),e=["#ff5a4e","#ffd23f","#3cc9a6","#b9a3ff","#ff8fb1"];for(let i=0;i<90;i++)t.append(O("i",{style:`--x:${Math.random()*100}vw;--d:${1.8+Math.random()*1.8}s;--r:${Math.random()*720-360}deg;--c:${e[i%e.length]};--delay:${Math.random()*.6}s`}));n.append(t),setTimeout(()=>t.remove(),4500)}async function ry(n,t){const e=n.view,i=new Map,s=t.rooms();Jt.music("reveal"),n.view.setShift(0,.05);const r=O("div",{class:"curtain closed"},O("div",{class:"curtain-l"}),O("div",{class:"curtain-r"})),a=O("div",{class:"name-card"}),o=O("div",{class:"reveal-foot"}),l=O("div",{class:"reveal-progress"}),c=O("div",{class:"screen reveal-screen"},l,a,o,r);wn(n.ui),n.ui.append(c),await fn(400);for(let h=0;h<s.length;h++){const{contestant:u,design:f}=s[h];e.select(null),e.sync(f),n.backdrop(f.mood),e.setOrbit(1.08,.29*Math.PI,e.fitDist()*1.12),wn(l),l.append(...s.map((g,v)=>O("span",{class:v<h?"done":v===h?"now":""}))),wn(a),a.append(O("span",{class:"nc-avatar",html:ds(u.avatar,64)}),O("div",null,O("div",{class:"eyebrow"},`Room ${h+1} of ${s.length}`),O("div",{class:"nc-name"},u.isPlayer?"Your room":u.name),u.persona?O("div",{class:"nc-vibe"},u.persona.vibe):O("div",{class:"nc-vibe"},"Strike a pose"))),a.classList.remove("in"),wn(o),await fn(250),r.classList.replace("closed","open"),Jt.play("reveal"),a.classList.add("in");const d=ey(e,u.isPlayer?9e3:7500);if(u.isPlayer){await fn(1200),o.append(O("div",{class:"foot-title"},"The judges are voting…"));const g=O("div",{class:"vote-list"});o.append(g);for(const v of t.votesFor(u.id)){const m=t.contestants.find(p=>p.id===v.from);g.append(O("div",{class:"vote-bubble"},O("span",{html:ds(m.avatar,40)}),O("div",null,O("div",{class:"vb-stars","aria-label":`${v.stars} stars`},...[1,2,3,4,5].map(p=>O("span",{class:p<=v.stars?"on":""},De(Le.star)))),O("div",{class:"vb-comment"},`“${v.comment??""}”`),O("div",{class:"vb-name"},m.name)))),Jt.play("star"),await fn(1100)}await d.done,i.set(u.id,e.snapshot()),await fn(900)}else{await fn(1400);const g=O("div",{class:"foot-title"},`Rate ${u.name}'s room`),v=O("div",{class:"rate-stars",role:"radiogroup","aria-label":"Your rating"}),m=O("div",{class:"rate-timer"},O("i"));o.append(g,v,m);const y=await new Promise(w=>{let M=null;const R=[1,2,3,4,5].map(T=>{const _=O("button",{class:"rate-star",role:"radio","aria-label":`${T} star${T>1?"s":""}`},De(Le.star));return _.addEventListener("mouseenter",()=>R.forEach((S,I)=>S.classList.toggle("hover",I<T))),_.addEventListener("mouseleave",()=>R.forEach(S=>S.classList.remove("hover"))),_.addEventListener("click",()=>{M===null&&(M=T,R.forEach((S,I)=>S.classList.toggle("on",I<T)),Jt.play("star"),w(T))}),_});v.append(...R),setTimeout(()=>w(M),11e3)});y!==null?(t.castVote(u.id,y),g.textContent=["","Ouch.","Fair.","Not bad!","Love it!","Obsessed!"][y]??""):g.textContent="No vote this time",m.remove(),await d.done,i.set(u.id,e.snapshot()),await fn(500)}d.stop(),r.classList.replace("open","closed"),Jt.play("whoosh"),await fn(650)}return i}async function ay(n,t){const e=O("div",{class:"reel-name"},"…"),i=O("p",{class:"pitch"}),s=O("div",{class:"twist-card",hidden:!0}),r=O("div",{class:"lineup",hidden:!0},...t.contestants.map(h=>O("div",{class:`lineup-person${h.isPlayer?" me":""}`},O("span",{html:ds(h.avatar,52)}),O("span",null,h.isPlayer?"You":h.name)))),a=O("button",{class:"btn btn-primary btn-big",hidden:!0},`Start building · ${Math.round(t.seconds/60)} min`),o=O("div",{class:"theme-reveal panel"},O("div",{class:"eyebrow"},"Today's theme"),O("div",{class:"reel"},e),i,s,r,a);wn(n.ui),n.ui.append(O("div",{class:"screen center-screen dim"},o));const l=ir.map(h=>h.name).filter(h=>h!==t.theme.name);let c=50;for(let h=0;h<16;h++)e.textContent=l[h%l.length],e.classList.remove("tick"),e.offsetWidth,e.classList.add("tick"),Jt.play("tick"),await fn(c),c*=1.17;e.textContent=t.theme.name,e.classList.add("landed"),Jt.play("reveal"),await fn(350),i.textContent=t.theme.pitch,i.classList.add("in"),await fn(700),t.twist&&(s.hidden=!1,s.append(O("div",{class:"eyebrow"},"Bonus twist"),O("div",null,t.twist.text),O("small",null,"Optional. Pull it off for bonus stars and coins.")),Jt.play("star"),await fn(600)),r.hidden=!1,a.hidden=!1,a.focus(),await new Promise(h=>a.addEventListener("click",()=>{Jt.play("whoosh"),h()},{once:!0}))}function oy(n){const t=n.profile,e=new Zl(Date.now()/1e3|0),i=e.pick(ir),s=cu(i,null,.95,e.int(1,1e9),Sa);n.view.select(null),n.view.sync(s),n.backdrop(s.mood);const r=yu(n.view);n.view.setShift(.2,.3),Jt.music(null);const a=ol(t.xp),o=O("input",{id:"player-name",class:"name-input",maxlength:"16",placeholder:"Your designer name",value:t.name,autocomplete:"off","aria-label":"Your designer name"});o.addEventListener("input",()=>{t.name=o.value.trim(),n.save()});const l=O("button",{class:"btn btn-primary btn-big",id:"play-btn",onclick:()=>{Jt.unlock(),Jt.play("whoosh"),n.startRound()}},"Play"),c=O("button",{class:"btn",onclick:()=>{Jt.unlock(),Jt.play("click"),n.goGallery()},disabled:t.gallery.length===0},De(Le.grid),"My rooms"),u=O("div",{class:"seg small",role:"radiogroup","aria-label":"Round length"},...[180,240,300].map(v=>O("button",{class:t.settings.seconds===v?"on":"",role:"radio","aria-checked":String(t.settings.seconds===v),onclick:m=>{t.settings.seconds=v,n.save(),u.querySelectorAll("button").forEach(p=>p.classList.remove("on")),m.currentTarget.classList.add("on")}},`${v/60} min`))),f=(v,m,p,y)=>{const w=O("button",{class:`toggle${p()?" on":""}`,"aria-pressed":String(p()),title:v},De(m),v);return w.addEventListener("click",()=>{y(!p()),n.save(),w.classList.toggle("on",p()),w.setAttribute("aria-pressed",String(p()))}),w},d=O("div",{class:"title-panel panel"},O("div",{class:"logo"},O("span",{class:"logo-build"},"Build"),O("span",{class:"logo-to"},"to"),O("span",{class:"logo-impress"},"Impress")),O("p",{class:"tagline"},"You get a theme and a few minutes. Decorate the room, then tour everyone's and vote for your favourite."),o,O("div",{class:"title-actions"},l,c),O("div",{class:"settings-row"},u,f("Music",Le.music,()=>t.settings.music,v=>{t.settings.music=v,Jt.setMusicOn(v)}),f("Sounds",Le.sound,()=>t.settings.sfx,v=>{t.settings.sfx=v,Jt.sfxOn=v}),f("Glow",Le.star,()=>t.settings.glow,v=>{t.settings.glow=v,n.view.bloomEnabled=v})),O("div",{class:"profile-strip"},O("span",null,O("b",null,`Level ${a.level}`),` · ${jh(a.level)}`),O("span",{class:"coins"},De(Le.coin),String(t.coins)),O("span",null,`${t.wins} win${t.wins===1?"":"s"}`))),g=O("div",{class:"showcase-tag"},O("span",{class:"eyebrow"},"Now showing"),O("span",null,i.name));return wn(n.ui),n.ui.append(O("div",{class:"screen title-screen"},d,g)),r}const ly=document.getElementById("stage"),cy=document.getElementById("ui"),Gi=Qv();Jt.sfxOn=Gi.settings.sfx;Jt.musicOn=Gi.settings.music;const Mu=new Gx(ly);Mu.bloomEnabled=Gi.settings.glow;let rs=null,fl=!1;const Si={view:Mu,ui:cy,profile:Gi,save:()=>jv(Gi),backdrop(n){document.body.dataset.mood=n},goTitle(){rs?.(),rs=oy(Si)},goGallery(){rs?.(),rs=jx(Si)},startRound(){fl||(rs?.(),rs=null,hy())}};async function hy(){fl=!0;try{let n=!0;for(;n;){const t=new dx(Gi.settings.seconds,Gi.name,Sa);await ay(Si,t);const e=await Qx(Si,t);t.submit(e);const i=await ry(Si,t);n=await ny(Si,t,i)==="again"}}finally{fl=!1}Si.goTitle()}window.addEventListener("pointerdown",()=>Jt.unlock(),{once:!0});Si.goTitle();document.body.classList.add("ready");
