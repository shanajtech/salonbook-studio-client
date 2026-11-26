'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useStudio} from './frame';
import {useData} from '../lib/state';
import {request,money,today} from '../lib/api';
import {Loading,Problem} from './states';
export function ServiceDetail({id}){
 const {data:item,error,loading,reload}=useData('/services/'+encodeURIComponent(id),true);
 const {user}=useStudio();
 if(loading)return <Loading text="Loading treatment…"/>;
 if(error)return <section className="wrap section"><Problem text={error.message} retry={error.status===404?null:reload}/><Link href="/services">Back to services</Link></section>;
 return <section className="wrap section"><Link href="/services">All services</Link><div className="details"><article><img src={item.image} alt={item.serviceName}/><p className="kicker">{item.category}</p><h1>{item.serviceName}</h1><p>{item.description}</p><p>{money(item.price)} · {item.duration} minutes</p></article>{user.role==='customer'&&<Booking item={item}/>}</div></section>;
}
function Booking({item}){
 const [date,setDate]=useState(''),[slot,setSlot]=useState(''),[busy,setBusy]=useState(false);
 const availability=useData(date?'/appointments/availability?date='+encodeURIComponent(date):null,true);
 const {notify}=useStudio(),router=useRouter();
 async function submit(event){
  event.preventDefault();if(!slot)return;
  const message=new FormData(event.currentTarget).get('message');
  setBusy(true);
  try{await request('/appointments',{secure:true,method:'POST',body:{serviceId:item._id,appointmentDate:date,timeSlot:slot,message}});notify('Appointment requested. The studio will review it.');router.push('/dashboard/customer?view=appointments');}
  catch(error){notify(error.message,'error');if(error.status===409){setSlot('');availability.reload();}}
  finally{setBusy(false);}
 }
 return <aside className="panel booking"><h2>Request an appointment</h2><p>{money(item.price)} · {item.duration} min</p><form className="stack" onSubmit={submit}><label>Appointment date<input type="date" min={today()} required value={date} onChange={e=>{setDate(e.target.value);setSlot('');}}/></label>{date&&<fieldset><legend>Available time slots (Dhaka)</legend>{availability.loading?<Loading text="Checking availability…"/>:availability.error?<Problem text={availability.error.message} retry={availability.reload}/>:<div className="slots">{availability.data?.map(({time,available})=><button className={slot===time?'button small':'outline small'} key={time} type="button" aria-pressed={slot===time} disabled={!available} onClick={()=>setSlot(time)}>{time}</button>)}</div>}</fieldset>}<label>Message (optional)<textarea name="message" maxLength="500" rows="3"/></label><button className="button" disabled={!slot||busy}>{busy?'Sending request…':'Request appointment'}</button><small>Payment opens after the studio confirms your appointment.</small></form></aside>
}
