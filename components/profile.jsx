'use client';
import {useState} from 'react';
import {request} from '../lib/api';
import {useStudio} from './frame';
export function Profile(){const {user,refresh,notify}=useStudio(),[busy,setBusy]=useState(false);
 async function save(event){event.preventDefault();setBusy(true);const body=Object.fromEntries(new FormData(event.currentTarget));try{await request('/account/me',{method:'PATCH',body,secure:true});await refresh();notify('Profile updated.');}catch(err){notify(err.message,'error');}finally{setBusy(false);}}
 async function connectGoogle(){
  setBusy(true);
  try{
   const callbackURL=location.origin+'/dashboard/'+user.role+'?view=profile';
   const result=await request('/auth/link-social',{method:'POST',body:{provider:'google',callbackURL}});
   if(!result.url)throw Error('Google linking is unavailable.');
   location.assign(result.url);
  }catch(error){notify(error.message,'error');setBusy(false);}
 }
 return <form className="panel stack profile-form" onSubmit={save}><label>Email<input value={user.email} readOnly/></label><label>Full name<input name="name" defaultValue={user.name} required maxLength="100"/></label><label>Phone number<input name="phone" type="tel" defaultValue={user.phone} maxLength="35"/></label><label>Profile image URL<input name="image" type="url" defaultValue={user.image}/></label><button className="button fit" disabled={busy}>{busy?'Saving…':'Save changes'}</button><button type="button" className="outline fit" disabled={busy} onClick={connectGoogle}>Connect Google account</button></form>;
}
