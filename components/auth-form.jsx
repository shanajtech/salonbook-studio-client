'use client';
import Link from 'next/link';
import {useRouter,useSearchParams} from 'next/navigation';
import {useState} from 'react';
import {request} from '../lib/api';
import {useStudio} from './frame';
import {Problem} from './states';
export function AuthForm({signup=false}){
 const {refresh,notify}=useStudio(),router=useRouter(),params=useSearchParams();
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[show,setShow]=useState(false);
 const redirect=params.get('next');
 const safe=redirect&&/^\/services\/[a-f0-9]{24}$/.test(redirect)?redirect:null;
 async function submit(event){
  event.preventDefault();setBusy(true);setError('');
  const body=Object.fromEntries(new FormData(event.currentTarget));
  if(signup&&!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(body.password)){setError('Use six characters or more, including uppercase and lowercase letters.');setBusy(false);return;}
  if(!body.image)delete body.image;
  try{await request('/auth/'+(signup?'sign-up':'sign-in')+'/email',{method:'POST',body});
   const user=await refresh();
   if(!user)throw Error('Could not open your session. Please try again.');
   notify(signup?'Your account is ready.':'You are signed in.');
   router.replace(safe||'/dashboard/'+user.role);
  }catch(err){setError(err.message);notify(err.message,'error');}finally{setBusy(false);}
 }
 async function google(){
  setBusy(true);setError('');
  try{const result=await request('/auth/sign-in/social',{method:'POST',body:{provider:'google',callbackURL:location.origin+(safe||'/dashboard')}});
   if(!result.url)throw Error('Google sign-in is unavailable.');
   location.assign(result.url);
  }catch(err){setError(err.message);notify(err.message,'error');setBusy(false);}
 }
 return <section className="wrap auth-layout"><div className="auth-photo" role="img" aria-label="Salon studio"/><div className="auth-panel"><p className="kicker">SalonBook Studio</p><h1>{signup?'Create an account':'Welcome back'}</h1><form onSubmit={submit} className="stack">{signup&&<label>Full name<input name="name" required autoComplete="name" maxLength="100"/></label>}<label>Email<input name="email" type="email" required autoComplete="email"/></label><label>Password<input name="password" type={show?'text':'password'} required autoComplete={signup?'new-password':'current-password'}/></label><button className="text-button" type="button" onClick={()=>setShow(!show)}>{show?'Hide password':'Show password'}</button>{signup&&<label>Profile image URL<input type="url" name="image" placeholder="Optional"/></label>}{error&&<Problem text={error}/>}<button className="button" disabled={busy}>{busy?'Please wait…':signup?'Create account':'Sign in'}</button><button className="outline" type="button" onClick={google} disabled={busy}>Continue with Google</button></form><p>{signup?'Already have an account?':'New to SalonBook?'} <Link href={(signup?'/sign-in':'/sign-up')+(safe?'?next='+encodeURIComponent(safe):'')}>{signup?'Sign in':'Create an account'}</Link></p></div></section>
}
