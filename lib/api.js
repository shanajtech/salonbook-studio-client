export async function request(path,options={}){
  const {secure=false,body,method='GET',signal}=options;
  const headers={};
  if(secure) {
    const token=await request('/auth/token',{signal});
    if(!token.token) throw Object.assign(new Error('Please sign in.'),{status:401});
    headers.Authorization='Bearer '+token.token;
  }
  if(body!==undefined) headers['Content-Type']='application/json';
  const res=await fetch('/api'+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal,cache:'no-store'});
  const data=await res.json().catch(()=>null);
  if(!res.ok || !data) throw Object.assign(new Error(data?.error||data?.message||'The service is temporarily unavailable.'),{status:res.status});
  return data;
}
export const money=value=>'৳'+Number(value).toLocaleString('en-BD');
export const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Dhaka'}).format(new Date());
