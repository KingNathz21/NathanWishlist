const ALLOWED_ORIGINS = new Set(["https://kingnathz21.github.io"]);
const ADMIN_UID = "Jx8xZkBIpXgCnPRr409QGZLyrNK2";
const FIREBASE_PROJECT_ID = "rflofficial";

function response(data, status, origin) {
  return new Response(JSON.stringify(data), { status, headers: {
    "Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",
    "Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type, Authorization","Vary":"Origin",
    "X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY"
  }});
}
function decodePart(value) {
  const s=value.replace(/-/g,"+").replace(/_/g,"/");
  return Uint8Array.from(atob(s.padEnd(Math.ceil(s.length/4)*4,"=")),c=>c.charCodeAt(0));
}
let firebaseKeysPromise;
async function verifyAdmin(request, env) {
  const token=(request.headers.get("Authorization")||"").replace(/^Bearer\\s+/i,"");
  if(!token) throw new Error("Please sign in with Google.");
  const parts=token.split(".");
  if(parts.length!==3) throw new Error("Invalid sign-in token.");
  const decoder=new TextDecoder();
  const header=JSON.parse(decoder.decode(decodePart(parts[0])));
  const claims=JSON.parse(decoder.decode(decodePart(parts[1])));
  if(header.alg!=="RS256" || !header.kid) throw new Error("Invalid sign-in token.");
  if(!firebaseKeysPromise) firebaseKeysPromise=fetch("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com").then(r=>{if(!r.ok)throw new Error("Could not verify Firebase token.");return r.json();}).then(x=>x.keys||[]);
  let jwk=(await firebaseKeysPromise).find(k=>k.kid===header.kid);
  if(!jwk){firebaseKeysPromise=null;firebaseKeysPromise=fetch("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com").then(r=>r.json()).then(x=>x.keys||[]);jwk=(await firebaseKeysPromise).find(k=>k.kid===header.kid);}
  if(!jwk) throw new Error("Unknown Firebase signing key.");
  const key=await crypto.subtle.importKey("jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
  const valid=await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,decodePart(parts[2]),new TextEncoder().encode(parts[0]+"."+parts[1]));
  const now=Math.floor(Date.now()/1000),project=FIREBASE_PROJECT_ID;
  if(!valid||claims.aud!==project||claims.iss!=="https://securetoken.google.com/"+project||typeof claims.sub!=="string"||claims.exp<=now||claims.iat>now+300) throw new Error("Sign-in expired. Please sign in again.");
  if(claims.sub!==ADMIN_UID) throw new Error("This Google account is not authorised to manage this wishlist.");
  return claims.sub;
}
async function readBody(request) {
  if(!(request.headers.get("Content-Type")||"").includes("application/json")) throw new Error("Send JSON data.");
  const raw=await request.text();
  if(raw.length>16000) throw new Error("Request is too large.");
  return JSON.parse(raw||"{}");
}
function clean(value,max=500){return String(value??"").trim().slice(0,max);}
function normalise(body) {
  const name=clean(body.name,160),listType=body.listType;
  if(!name) throw new Error("An item name is required.");
  if(!["main","christmas"].includes(listType)) throw new Error("Choose a valid wishlist.");
  const price=body.price===""||body.price===null||body.price===undefined?null:Number(body.price);
  if(price!==null&&(!Number.isFinite(price)||price<0||price>1000000)) throw new Error("Enter a valid price.");
  const quantity=Math.max(1,Math.min(99,Math.floor(Number(body.quantity)||1)));
  const priority=["High","Medium","Low"].includes(body.priority)?body.priority:"Medium";
  return {listType,name,wishlist:clean(body.wishlist,80)||"General",category:clean(body.category,80)||"Other",
    brand:clean(body.brand,120),store:clean(body.store,120),description:clean(body.description,1000),
    notes:clean(body.notes,1000),image:clean(body.image,1000),link:clean(body.link,1000),
    dateAdded:clean(body.dateAdded,30)||new Date().toISOString().slice(0,10),price,quantity,priority,purchased:body.purchased===true};
}
async function listItems(env,listType) {
  const {results}=await env.WISHLIST_DB.prepare(`SELECT id,list_type AS listType,name,wishlist,category,brand,store,description,notes,image,link,date_added AS dateAdded,price,quantity,priority,purchased FROM wishlist_items WHERE list_type=? ORDER BY purchased ASC,created_at DESC,id DESC`).bind(listType).all();
  return results.map(x=>({...x,purchased:x.purchased===1}));
}
export default {
 async fetch(request,env) {
  const origin=request.headers.get("Origin")||"";
  if(!ALLOWED_ORIGINS.has(origin)) return new Response("Origin not allowed",{status:403});
  if(request.method==="OPTIONS") return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"GET, POST, PATCH, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization","Access-Control-Max-Age":"86400","Vary":"Origin"}});
  if(!env.WISHLIST_DB) return response({success:false,error:"Wishlist database is not configured."},503,origin);
  const url=new URL(request.url),path=url.pathname;
  try {
   if(path==="/api/health"&&request.method==="GET"){await env.WISHLIST_DB.prepare("SELECT 1").first();return response({success:true,service:"Nathan's Wishlist API",database:"connected"},200,origin);}
   if(path==="/api/items"&&request.method==="GET"){
    const list=url.searchParams.get("list");if(!["main","christmas"].includes(list))return response({success:false,error:"Use list=main or list=christmas."},400,origin);
    const items=await listItems(env,list);return response({success:true,list,total:items.length,items},200,origin);
   }
   if(path.startsWith("/api/admin/")){
    try{await verifyAdmin(request,env);}catch(error){return response({success:false,error:error.message||"Unauthorised"},401,origin);}
    if(path==="/api/admin/items"&&request.method==="GET"){
      const list=url.searchParams.get("list");if(!["main","christmas"].includes(list))return response({success:false,error:"Choose main or christmas."},400,origin);
      const items=await listItems(env,list);return response({success:true,items},200,origin);
    }
    if(path==="/api/admin/items"&&request.method==="POST"){
      const item=normalise(await readBody(request));
      const result=await env.WISHLIST_DB.prepare("INSERT INTO wishlist_items(list_type,name,wishlist,category,brand,store,description,notes,image,link,date_added,price,quantity,priority,purchased) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(item.listType,item.name,item.wishlist,item.category,item.brand,item.store,item.description,item.notes,item.image,item.link,item.dateAdded,item.price,item.quantity,item.priority,item.purchased?1:0).run();
      return response({success:true,id:result.meta.last_row_id},201,origin);
    }
    const match=path.match(/^\\/api\\/admin\\/items\\/(\\d+)$/);
    if(match){
      const id=Number(match[1]);if(!Number.isSafeInteger(id)||id<1)return response({success:false,error:"Invalid item ID."},400,origin);
      if(request.method==="PATCH"){
        const item=normalise(await readBody(request));
        const result=await env.WISHLIST_DB.prepare("UPDATE wishlist_items SET list_type=?,name=?,wishlist=?,category=?,brand=?,store=?,description=?,notes=?,image=?,link=?,date_added=?,price=?,quantity=?,priority=?,purchased=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(item.listType,item.name,item.wishlist,item.category,item.brand,item.store,item.description,item.notes,item.image,item.link,item.dateAdded,item.price,item.quantity,item.priority,item.purchased?1:0,id).run();
        return response({success:true,changes:result.meta.changes},200,origin);
      }
      if(request.method==="DELETE"){const result=await env.WISHLIST_DB.prepare("DELETE FROM wishlist_items WHERE id=?").bind(id).run();return response({success:true,changes:result.meta.changes},200,origin);}
    }
   }
   return response({success:false,error:"Not found."},404,origin);
  }catch(error){return response({success:false,error:error.message||"Request failed."},400,origin);}
 }
};
