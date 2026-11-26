'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {createContext,useContext,useEffect,useState} from 'react';
import {request} from '../lib/api';
import {Footer} from './footer';
const Context=createContext(null);
export const useStudio=()=>useContext(Context);
export function Frame({children}){
 const [user,setUser]=useState(null),[authLoading,setLoading]=useState(true),[notice,setNotice]=useState(null),[busy,setBusy]=useState(false);
 const router=useRouter();
 async function refresh(){
  try {const account=await request('/account/me',{secure:true});setUser(account);return account;}
  catch (error) {setUser(null);if(error.status===403){await request('/auth/sign-out',{method:'POST',body:{}}).catch(()=>{});throw error;}return null;}
  finally {setLoading(false);}
 }
 function notify(message,type='success'){setNotice({message,type});}
 useEffect(()=>{refresh().catch(error=>notify(error.message,'error'));},[]);
 useEffect(()=>{if(!notice)return;const timeout=setTimeout(()=>setNotice(null),5000);return()=>clearTimeout(timeout);},[notice]);
 async function logout(){setBusy(true);try{await request('/auth/sign-out',{method:'POST',body:{}});setUser(null);router.push('/');notify('Signed out.');}catch(error){notify(error.message,'error');}finally{setBusy(false);}}
 return <Context.Provider value={{user,authLoading,refresh,notify}}><a className="skip" href="#content">Skip to content</a><header className="site-header"><div className="wrap nav"><Link href="/" className="brand"><span aria-hidden="true" style={{display:"inline-grid",placeItems:"center",width:"1.8rem",height:"1.8rem",borderRadius:"50%",background:"#f1e4dc",color:"#682c28",font:"1.05rem system-ui",verticalAlign:"0.14em",marginRight:"0.16em"}}>✂</span> SalonBook<i> Studio</i></Link><nav aria-label="Main navigation"><Link href="/">Home</Link><Link href="/services">Browse services</Link></nav><div className="account">{authLoading?<span>Checking session…</span>:user?<details><summary>{user.name}</summary><div><Link href={'/dashboard/'+user.role}>Dashboard</Link><button disabled={busy} onClick={logout}>Sign out</button></div></details>:<><Link href="/sign-in">Sign in</Link><Link href="/sign-up" className="button small">Sign up</Link></>}</div></div></header><main id="content">{children}</main><Footer/>{notice&&<div className={'toast '+notice.type} role={notice.type==='error'?'alert':'status'}>{notice.message}<button aria-label="Dismiss notification" onClick={()=>setNotice(null)}>×</button></div>}</Context.Provider>
}
