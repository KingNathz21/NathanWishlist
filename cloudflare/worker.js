const ALLOWED_ORIGINS=new Set(["https://kingnathz21.github.io"]);
const ADMIN_UID="E74UwZ3YJBRwCcYHipBWBdpaXT43";
const FIREBASE_PROJECT_ID="rflofficial";
function response(data,status,origin){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"GET, POST, PATCH, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization","Vary":"Origin","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY"}});}
function decodePart(v){const s=v.replace(/-/g,"+").replace(/_/g,"/");return Uint8Array.from(atob(s.padEnd(Math.ceil(s.length/4)*4,"=")),c=>c.charCodeAt(0));}
let keysPromise;
async function verifyAdmin(request){
 const token=(request.headers.get("Authorization")||"").replace(/^Bearer\s+/i,"");if(!token)throw new Error("Please sign in with your email and password.");
 const p=token.split(".");if(p.length!==3)throw new Error("Invalid sign-in token.");
 const d=new TextDecoder(),h=JSON.parse(d.decode(decodePart(p[0]))),c=JSON.parse(d.decode(decodePart(p[1])));
 if(h.alg!=="RS256"||!h.kid)throw new Error("Invalid sign-in token.");
 if(!keysPromise)keysPromise=fetch("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com").then(r=>r.json()).then(x=>x.keys||[]);
 let jwk=(await keysPromise).find(k=>k.kid===h.kid);if(!jwk)throw new Error("Unknown Firebase signing key.");
 const key=await crypto.subtle.importKey("jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
 const valid=await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,decodePart(p[2]),new TextEncoder().encode(p[0]+"."+p[1]));
 const now=Math.floor(Date.now()/1000);
 if(!valid||c.aud!==FIREBASE_PROJECT_ID||c.iss!=="https://securetoken.google.com/"+FIREBASE_PROJECT_ID||typeof c.sub!=="string"||c.exp<=now||c.iat>now+300)throw new Error("Sign-in expired. Please sign in again.");
 if(c.sub!==ADMIN_UID)throw new Error("This account is not authorised.");
}
async function readBody(r){if(!(r.headers.get("Content-Type")||"").includes("application/json"))throw new Error("Send JSON data.");const raw=await r.text();if(raw.length>100000)throw new Error("Request too large.");return JSON.parse(raw||"{}");}
function clean(v,n=500){return String(v??"").trim().slice(0,n);}
function normalise(b){
 const name=clean(b.name,160);if(!name)throw new Error("An item name is required.");
 const lists=Array.isArray(b.listTypes)?[...new Set(b.listTypes)].filter(x=>["main","christmas"].includes(x)):[b.listType].filter(x=>["main","christmas"].includes(x));
 if(!lists.length)throw new Error("Select one or both wishlists.");
 const price=b.price===""||b.price==null?null:Number(b.price);if(price!==null&&(!Number.isFinite(price)||price<0||price>1000000))throw new Error("Enter a valid price.");
 return {lists,name,wishlist:clean(b.wishlist,80)||"General",category:clean(b.category,80)||"Other",brand:clean(b.brand,120),store:clean(b.store,120),description:clean(b.description,1000),notes:clean(b.notes,1000),image:clean(b.image,1500),link:clean(b.link,1500),dateAdded:clean(b.dateAdded,30)||new Date().toISOString().slice(0,10),price,quantity:Math.max(1,Math.min(99,Math.floor(Number(b.quantity)||1))),priority:["High","Medium","Low"].includes(b.priority)?b.priority:"Medium",purchased:b.purchased===true};
}
const fields="id,group_id AS groupId,list_type AS listType,name,wishlist,category,brand,store,description,notes,image,link,date_added AS dateAdded,price,original_price AS originalPrice,price_checked_at AS priceCheckedAt,quantity,priority,purchased,archived,(SELECT GROUP_CONCAT(list_type) FROM wishlist_items AS related WHERE related.group_id=wishlist_items.group_id) AS listTypesCsv";
async function listItems(env,list){
 const q=list==="archived"?"SELECT "+fields+" FROM wishlist_items WHERE archived=1 GROUP BY group_id ORDER BY updated_at DESC":"SELECT "+fields+" FROM wishlist_items WHERE list_type=? AND archived=0 ORDER BY purchased ASC,created_at DESC";
 const r=list==="archived"?await env.WISHLIST_DB.prepare(q).all():await env.WISHLIST_DB.prepare(q).bind(list).all();
 return r.results.map(x=>({...x,purchased:x.purchased===1,archived:x.archived===1,listTypes:(x.listTypesCsv||x.listType||"").split(",").filter(Boolean)}));
}
async function insertItem(env,item,gid,list){return env.WISHLIST_DB.prepare("INSERT INTO wishlist_items(group_id,list_type,name,wishlist,category,brand,store,description,notes,image,link,date_added,price,original_price,quantity,priority,purchased) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(gid,list,item.name,item.wishlist,item.category,item.brand,item.store,item.description,item.notes,item.image,item.link,item.dateAdded,item.price,item.price,item.quantity,item.priority,item.purchased?1:0).run();}

function priceFromOffer(value){
 if(value===null||value===undefined||value==="")return null;
 const n=Number(String(value).replace(/,/g,""));
 return Number.isFinite(n)&&n>0&&n<1000000?n:null;
}
function extractCurrentPrice(html){
 const metaAmount=getMeta(html,"product:price:amount")||getMeta(html,"og:price:amount")||getMeta(html,"price");
 const metaCurrency=getMeta(html,"product:price:currency")||getMeta(html,"og:price:currency");
 if(metaAmount&&(!metaCurrency||metaCurrency.toUpperCase()==="GBP")){const p=priceFromOffer(metaAmount);if(p!==null)return p;}
 const itemprop=/<[^>]+itemprop=["']price["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html)||/<[^>]+content=["']([^"']+)["'][^>]+itemprop=["']price["'][^>]*>/i.exec(html);
 const currencyMatch=/<[^>]+itemprop=["']priceCurrency["'][^>]+content=["']([^"']+)["'][^>]*>/i.exec(html);
 if(itemprop&&(!currencyMatch||currencyMatch[1].toUpperCase()==="GBP")){const p=priceFromOffer(itemprop[1]);if(p!==null)return p;}
 const scripts=html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
 function offerPrice(node){
  if(!node)return null;
  if(Array.isArray(node)){for(const x of node){const p=offerPrice(x);if(p!==null)return p;}return null;}
  if(typeof node!=="object")return null;
  const type=String(node["@type"]||"").toLowerCase();
  if(type.includes("offer")||Object.prototype.hasOwnProperty.call(node,"price")){
   const currency=String(node.priceCurrency||"").toUpperCase();
   if(!currency||currency==="GBP"){const p=priceFromOffer(node.price??node.lowPrice);if(p!==null)return p;}
  }
  if(node.offers){const p=offerPrice(node.offers);if(p!==null)return p;}
  if(node["@graph"]){const p=offerPrice(node["@graph"]);if(p!==null)return p;}
  return null;
 }
 for(const match of scripts){
  try{const data=JSON.parse(match[1]);const p=offerPrice(data);if(p!==null)return p;}catch{}
 }
 return null;
}
async function fetchCurrentPrice(rawUrl){
 const u=safeUrl(rawUrl);
 const r=await fetch(u.href,{headers:{"User-Agent":"Mozilla/5.0 (compatible; NathansWishlist/1.0)","Accept":"text/html,application/xhtml+xml"},signal:AbortSignal.timeout(9000),redirect:"follow"});
 if(!r.ok)throw new Error("Retailer returned "+r.status);
 const html=(await r.text()).slice(0,1500000);
 return extractCurrentPrice(html);
}
async function refreshPrices(env,list,force=false){
 const rows=await env.WISHLIST_DB.prepare("SELECT group_id AS groupId,MAX(link) AS link,MAX(price) AS price FROM wishlist_items WHERE list_type=? AND archived=0 AND purchased=0 AND link<>'' AND (?=1 OR price_checked_at IS NULL OR price_checked_at<=datetime('now','-12 hours')) GROUP BY group_id ORDER BY MIN(COALESCE(price_checked_at,'1970-01-01')) ASC LIMIT 40").bind(list,force?1:0).all();
 const updates=[];let checked=0,updated=0,notFound=0,failed=0;
 for(let offset=0;offset<rows.results.length;offset+=4){
  const batch=await Promise.all(rows.results.slice(offset,offset+4).map(async item=>{
   let current=null,ok=false;
   try{current=await fetchCurrentPrice(item.link);ok=true;}catch(e){console.warn("Wishlist price lookup failed:",item.link,e.message);}
   checked++;
   const checkedAt=new Date().toISOString();
   if(current!==null){if(item.price===null||Math.abs(Number(item.price)-current)>0.009){updated++;return env.WISHLIST_DB.prepare("UPDATE wishlist_items SET price=?,price_checked_at=?,updated_at=CURRENT_TIMESTAMP WHERE group_id=?").bind(current,checkedAt,item.groupId);}return env.WISHLIST_DB.prepare("UPDATE wishlist_items SET price_checked_at=? WHERE group_id=?").bind(checkedAt,item.groupId);}
   if(ok)notFound++;else failed++;
   return env.WISHLIST_DB.prepare("UPDATE wishlist_items SET price_checked_at=? WHERE group_id=?").bind(checkedAt,item.groupId);
  }));
  updates.push(...batch);
 }
 if(updates.length)await env.WISHLIST_DB.batch(updates);
 return {success:true,list,checked,updated,notFound,failed,skipped:Math.max(0,rows.results.length-checked)};
}

function safeUrl(raw){let u;try{u=new URL(raw);}catch{throw new Error("Enter a valid product URL.");}if(!["http:","https:"].includes(u.protocol)||u.username||u.password||u.hostname==="localhost"||u.hostname.endsWith(".local")||/^\d+(\.\d+){3}$/.test(u.hostname))throw new Error("That URL cannot be fetched.");return u;}
function getMeta(html,key){const patterns=[new RegExp('<meta[^>]+(?:property|name)=["]'+key+'["][^>]+content=["]([^"]*)["][^>]*>','i'),new RegExp('<meta[^>]+content=["]([^"]*)["][^>]+(?:property|name)=["]'+key+'["][^>]*>','i')];for(const re of patterns){const m=re.exec(html);if(m)return m[1].replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'");}return "";}
async function previewProduct(u){const r=await fetch(u.href,{headers:{"User-Agent":"Mozilla/5.0 (compatible; NathansWishlist/1.0)","Accept":"text/html"}});if(!r.ok)throw new Error("The retailer blocked the lookup ("+r.status+").");const html=(await r.text()).slice(0,1000000);const title=getMeta(html,"og:title")||getMeta(html,"twitter:title")||(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)||[])[1]||"";const image=getMeta(html,"og:image")||getMeta(html,"twitter:image");const description=getMeta(html,"og:description")||getMeta(html,"description");const p=getMeta(html,"product:price:amount")||getMeta(html,"og:price:amount");const currency=getMeta(html,"product:price:currency")||getMeta(html,"og:price:currency");const price=Number(p);return {success:true,title:title.replace(/<[^>]+>/g,"").trim().slice(0,160),image:image?new URL(image,u).href:"",description:description.slice(0,1000),price:p&&Number.isFinite(price)&&(!currency||currency==="GBP")?price:null,store:u.hostname.replace(/^www\./,"")};}
export default {async fetch(request,env){
 const origin=request.headers.get("Origin")||"";if(!ALLOWED_ORIGINS.has(origin))return new Response("Origin not allowed",{status:403});
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"GET, POST, PATCH, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type, Authorization","Access-Control-Max-Age":"86400","Vary":"Origin"}});
 const url=new URL(request.url),path=url.pathname;
 try{
  if(path==="/api/product-preview"&&request.method==="GET")return response(await previewProduct(safeUrl(url.searchParams.get("url")||"")),200,origin);
  if(!env.WISHLIST_DB)return response({success:false,error:"Wishlist database is not configured."},503,origin);
  if(path==="/api/health"&&request.method==="GET"){await env.WISHLIST_DB.prepare("SELECT 1").first();return response({success:true,database:"connected"},200,origin);}
  if(path==="/api/items"&&request.method==="GET"){const list=url.searchParams.get("list");if(!["main","christmas"].includes(list))return response({success:false,error:"Choose main or christmas."},400,origin);const items=await listItems(env,list);return response({success:true,items},200,origin);}
  if(path==="/api/prices/refresh"&&request.method==="POST"){const body=await readBody(request),list=body.list;if(!["main","christmas"].includes(list))return response({success:false,error:"Choose main or christmas."},400,origin);return response(await refreshPrices(env,list,false),200,origin);}
  if(path.startsWith("/api/admin/")){
   try{await verifyAdmin(request);}catch(e){return response({success:false,error:e.message},401,origin);}
   if(path==="/api/admin/prices/refresh"&&request.method==="POST"){const body=await readBody(request),list=body.list;if(!["main","christmas"].includes(list))return response({success:false,error:"Choose main or christmas."},400,origin);return response(await refreshPrices(env,list,true),200,origin);}
   if(path==="/api/admin/items"&&request.method==="GET"){const list=url.searchParams.get("list");if(!["main","christmas","archived"].includes(list))return response({success:false,error:"Choose a valid list."},400,origin);return response({success:true,items:await listItems(env,list)},200,origin);}
   if(path==="/api/admin/items"&&request.method==="POST"){const item=normalise(await readBody(request)),gid=crypto.randomUUID();for(const list of item.lists)await insertItem(env,item,gid,list);return response({success:true,groupId:gid},201,origin);}
   if(path==="/api/admin/import-existing"&&request.method==="POST"){const body=await readBody(request),source=Array.isArray(body.items)?body.items.slice(0,100):[];let imported=0,skipped=0;for(const raw of source){const item=normalise({...raw,listType:"main"});const exists=await env.WISHLIST_DB.prepare("SELECT id FROM wishlist_items WHERE list_type='main' AND name=? AND link=? LIMIT 1").bind(item.name,item.link).first();if(exists){skipped++;continue;}await insertItem(env,item,crypto.randomUUID(),"main");imported++;}return response({success:true,imported,skipped},200,origin);}
   const m=path.match(/^\/api\/admin\/items\/(\d+)(?:\/(archive|restore))?$/);
   if(m){const id=Number(m[1]),action=m[2]||"",row=await env.WISHLIST_DB.prepare("SELECT group_id FROM wishlist_items WHERE id=?").bind(id).first();if(!row)return response({success:false,error:"Item not found."},404,origin);
    if(action==="archive"||action==="restore"){const v=action==="archive"?1:0;await env.WISHLIST_DB.prepare("UPDATE wishlist_items SET archived=?,updated_at=CURRENT_TIMESTAMP WHERE group_id=?").bind(v,row.group_id).run();return response({success:true},200,origin);}
    if(request.method==="PATCH"){const item=normalise(await readBody(request));await env.WISHLIST_DB.prepare("UPDATE wishlist_items SET name=?,wishlist=?,category=?,brand=?,store=?,description=?,notes=?,image=?,link=?,date_added=?,price=?,quantity=?,priority=?,purchased=?,updated_at=CURRENT_TIMESTAMP WHERE group_id=?").bind(item.name,item.wishlist,item.category,item.brand,item.store,item.description,item.notes,item.image,item.link,item.dateAdded,item.price,item.quantity,item.priority,item.purchased?1:0,row.group_id).run();for(const list of item.lists){const exists=await env.WISHLIST_DB.prepare("SELECT id FROM wishlist_items WHERE group_id=? AND list_type=?").bind(row.group_id,list).first();if(!exists)await insertItem(env,item,row.group_id,list);}await env.WISHLIST_DB.prepare("DELETE FROM wishlist_items WHERE group_id=? AND list_type NOT IN ("+item.lists.map(()=>"?").join(",")+")").bind(row.group_id,...item.lists).run();return response({success:true},200,origin);}
    if(request.method==="DELETE"){await env.WISHLIST_DB.prepare("DELETE FROM wishlist_items WHERE group_id=?").bind(row.group_id).run();return response({success:true},200,origin);}
   }
  }
  return response({success:false,error:"Not found."},404,origin);
 }catch(e){return response({success:false,error:e.message||"Request failed."},400,origin);}
}};
