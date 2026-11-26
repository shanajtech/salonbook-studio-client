'use client';
import {useEffect,useRef} from 'react';
export function Confirm({title,text,close,action,busy}){
 const dialog=useRef(null);
 useEffect(()=>{const element=dialog.current;element.showModal();return()=>element.close();},[]);
 return <dialog ref={dialog} onCancel={event=>{event.preventDefault();if(!busy)close();}} aria-labelledby="dialog-title"><h2 id="dialog-title">{title}</h2><p>{text}</p><div className="card-actions"><button autoFocus className="outline" disabled={busy} onClick={close}>Go back</button><button className="button" disabled={busy} onClick={action}>{busy?'Please wait…':'Confirm'}</button></div></dialog>
}
