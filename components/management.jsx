'use client';
import {useState} from 'react';
import {useData} from '../lib/state';
import {money,request} from '../lib/api';
import {useStudio} from './frame';
import {Empty,Loading,Problem} from './states';
import {Confirm} from './confirm';
export function ServicesAdmin(){
 const {data,loading,error,reload}=useData('/services/admin',true);
 const {notify}=useStudio();
 const [edit,setEdit]=useState(null),[remove,setRemove]=useState(null),[busy,setBusy]=useState(false);
 async function save(event){
  event.preventDefault();setBusy(true);
  const {image,...fields}=Object.fromEntries(new FormData(event.currentTarget));
  try{
   if(image?.size){
    if(!image.type.startsWith('image/')||image.size>5000000)throw Error('Choose an image smaller than 5 MB.');
    fields.imageData=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(Error('Could not read image.'));reader.readAsDataURL(image);});
   }
   await request('/services'+(edit._id?'/'+edit._id:''),{method:edit._id?'PUT':'POST',secure:true,body:fields});setEdit(null);notify('Service saved.');reload();
  }catch(err){notify(err.message,'error');}finally{setBusy(false);}
 }
 async function mutate(item,method){
  setBusy(true);try{const status=item.status==='active'?'inactive':'active';await request('/services/'+item._id+(method==='PATCH'?'/status':''),{method,secure:true,body:method==='PATCH'?{status}:undefined});notify(method==='PATCH'?'Service status updated.':'Service deleted.');setRemove(null);reload();}
  catch(err){notify(err.message,'error');}finally{setBusy(false);}
 }
 if(loading)return <Loading text="Loading services…"/>;
 if(error)return <Problem text={error.message} retry={reload}/>;
 return <div className="stack"><button className="button fit" onClick={()=>setEdit({status:'active'})} disabled={busy}>Add service</button>{edit&&<form className="panel stack" key={edit._id||'new'} onSubmit={save}><h2>{edit._id?'Edit service':'Add service'}</h2><div className="form-grid"><label>Service name<input name="serviceName" required defaultValue={edit.serviceName}/></label><label>Category<input name="category" required defaultValue={edit.category}/></label><label>Price (BDT)<input name="price" type="number" required min="0.01" step="0.01" defaultValue={edit.price}/></label><label>Duration (minutes)<input name="duration" type="number" required min="1" defaultValue={edit.duration}/></label><label>Service image<input name="image" type="file" accept="image/*" required={!edit._id}/></label><label>Status<select name="status" defaultValue={edit.status}><option value="active">Active</option><option value="inactive">Inactive</option></select></label></div><label>Description<textarea name="description" rows="3" required defaultValue={edit.description}/></label><div className="inline"><button className="button" disabled={busy}>{busy?'Saving…':'Save service'}</button><button type="button" className="outline" onClick={()=>setEdit(null)} disabled={busy}>Cancel</button></div></form>}{!data.length&&<Empty text="Add the studio’s first service."/>}{data.map(item=><article className="panel appointment" key={item._id}><img src={item.image} alt=""/><div><h3>{item.serviceName}</h3><p>{item.category} · {money(item.price)} · {item.duration} min</p><span className={'badge '+item.status}>{item.status}</span></div><div className="inline"><button className="outline small" onClick={()=>setEdit(item)} disabled={busy}>Edit</button><button className="outline small" onClick={()=>mutate(item,'PATCH')} disabled={busy}>{item.status==='active'?'Deactivate':'Activate'}</button><button className="outline small" onClick={()=>setRemove(item)} disabled={busy}>Delete</button></div></article>)}{remove&&<Confirm title="Delete this service?" text={'Remove '+remove.serviceName+' from the catalog.'} close={()=>setRemove(null)} action={()=>mutate(remove,'DELETE')} busy={busy}/>}</div>
}
export function UsersAdmin(){
 const {data,loading,error,reload}=useData('/account/users',true);
 const {notify}=useStudio(),[busy,setBusy]=useState(false);
 async function toggle(user){setBusy(true);try{await request('/account/users/'+user.id,{secure:true,method:'PATCH',body:{isBlocked:!user.isBlocked}});notify('Customer access updated.');reload();}catch(err){notify(err.message,'error');}finally{setBusy(false);}}
 if(loading)return <Loading text="Loading customers…"/>;
 if(error)return <Problem text={error.message} retry={reload}/>;
 if(!data.length)return <Empty text="No customers have registered yet."/>;
 return <div className="stack">{data.map(user=><article className="panel card-actions" key={user.id}><div><h3>{user.name}</h3><p>{user.email}</p><details><summary>Customer details</summary><p>{user.phone||'No phone number'}</p><p>{user.isBlocked?'Blocked':'Active'}</p></details></div><button className="outline small" disabled={busy} onClick={()=>toggle(user)}>{user.isBlocked?'Unblock':'Block'}</button></article>)}</div>
}
export function Transactions(){
 const {data,loading,error,reload}=useData('/payments/transactions',true);
 if(loading)return <Loading text="Loading transactions…"/>;
 if(error)return <Problem text={error.message} retry={reload}/>;
 if(!data.length)return <Empty text="No payment transactions have been recorded."/>;
 return <div className="stack">{data.map(row=><article key={row._id} className="panel"><div className="card-actions"><h3>{row.serviceName}</h3><strong>{money(row.amount)} {row.currency.toUpperCase()}</strong></div><p>{row.customer?.name} · {row.customer?.email}</p><p>Appointment {row.appointmentDate} · Recorded {new Date(row.createdAt).toLocaleDateString('en-GB')}</p><p><span className={'badge '+row.status}>{row.status}</span> <code title={row.stripeSessionId}>…{row.stripeSessionId.slice(-12)}</code></p></article>)}</div>;
}
