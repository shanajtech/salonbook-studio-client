'use client';
import {useState} from 'react';
import {money,request} from '../lib/api';
import {useData} from '../lib/state';
import {useStudio} from './frame';
import {Loading,Problem,Empty} from './states';
import {Confirm} from './confirm';
export function AppointmentList({admin}){
 const {data,loading,error,reload}=useData('/appointments',true);
 const {notify}=useStudio();
 const [confirm,setConfirm]=useState(null),[busy,setBusy]=useState(false);
 async function change(row,status){
  setBusy(true);try{await request('/appointments/'+row._id,{secure:true,method:'PATCH',body:{status}});notify('Appointment '+status+'.');setConfirm(null);reload();}
  catch(err){notify(err.message,'error');}finally{setBusy(false);}
 }
 async function checkout(row){
  setBusy(true);try{const data=await request('/payments/checkout/'+row._id,{secure:true,method:'POST'});location.assign(data.url);}
  catch(err){notify(err.message,'error');setBusy(false);}
 }
 if(loading)return <Loading text="Loading appointments…"/>;
 if(error)return <Problem text={error.message} retry={reload}/>;
 if(!data.length)return <Empty text="There are no appointment requests yet." link={admin?null:'/services'}/>;
 return <div className="stack">{data.map(row=><article key={row._id} className="panel appointment"><img src={row.image} alt=""/><div><p className="kicker">{row.category}</p><h3>{row.serviceName}</h3><p>{row.appointmentDate} · {row.timeSlot} · {money(row.servicePrice)}</p><span className={'badge '+row.status}>{row.status}</span> <span className={'badge '+row.paymentStatus}>{row.paymentStatus}</span><details><summary>Appointment details</summary><p>Requested {new Date(row.createdAt).toLocaleDateString('en-GB',{timeZone:'Asia/Dhaka'})}</p>{admin&&row.customer&&<p>{row.customer.name} · {row.customer.email}</p>}{row.message&&<p>{row.message}</p>}</details></div><div className="stack">{admin&&row.status==='pending'&&<button className="button small" disabled={busy} onClick={()=>change(row,'confirmed')}>Confirm</button>}{(row.status==='pending'||(admin&&row.status==='confirmed'))&&<button className="outline small" disabled={busy} onClick={()=>setConfirm(row)}>Cancel appointment</button>}{!admin&&row.status==='confirmed'&&row.paymentStatus==='unpaid'&&<button className="button small" disabled={busy} onClick={()=>checkout(row)}>{busy?'Opening checkout…':'Pay now'}</button>}</div></article>)}{confirm&&<Confirm title="Cancel this appointment?" text={confirm.paymentStatus==='paid'?'Any refund must be arranged separately with the studio.':'This time will become available to other customers.'} close={()=>setConfirm(null)} action={()=>change(confirm,'cancelled')} busy={busy}/>}</div>
}
