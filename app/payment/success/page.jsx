'use client';
import {Suspense,useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {Guard} from '../../../components/guard';
import {Loading,Problem} from '../../../components/states';
import {useData} from '../../../lib/state';
function Result(){
 const ref=useSearchParams().get('ref');
 const {data,loading,error,reload}=useData(ref?'/payments/status/'+encodeURIComponent(ref):null,true);
 useEffect(()=>{if(data?.status!=='processing')return;const timer=setTimeout(reload,3000);return()=>clearTimeout(timer);},[data,reload]);
 return <section className="wrap section"><div className="panel profile-form">{!ref?<Problem text="No checkout reference was supplied."/>:error?<Problem text={error.message} retry={reload}/>:loading||data?.status==='processing'?<Loading text="Waiting for Stripe confirmation…"/>:<><p className="kicker">Stripe Checkout</p><h1 className="page-title">{data?.status==='paid'?'Payment confirmed':'Payment failed'}</h1><p>{data?.status==='paid'?'Your payment has been recorded.':'Return to your appointments to try again.'}</p></>}<Link className="button" href="/dashboard/customer?view=appointments">My appointments</Link></div></section>;
}
export default function Page(){return <Guard role="customer"><Suspense fallback={<Loading/>}><Result/></Suspense></Guard>}
