'use client';
import {useEffect} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {useStudio} from './frame';
import {Loading} from './states';
export function Guard({role,children}){
 const {authLoading,user}=useStudio(),router=useRouter(),path=usePathname();
 useEffect(()=>{
  if(authLoading)return;
  if(!user)router.replace('/sign-in?next='+encodeURIComponent(path));
  else if(role&&user.role!==role)router.replace('/dashboard/'+user.role);
 },[authLoading,user,role,router,path]);
 if(authLoading||!user||(role&&user.role!==role))return <Loading text="Checking your access…"/>;
 return children;
}
