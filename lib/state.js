'use client';
import {useEffect,useState,useCallback} from 'react';
import {request} from './api';
export function useData(path,secure=false){
  const [state,set]=useState({loading:true});
  const [version,update]=useState(0);
  const reload=useCallback(()=>update(value=>value+1),[]);
  useEffect(()=>{
    if(!path){set({loading:false});return;}
    const controller=new AbortController();
    set({loading:true});
    request(path,{secure,signal:controller.signal}).then(data=>{if(!controller.signal.aborted)set({data,loading:false})}).catch(error=>{if(!controller.signal.aborted)set({error,loading:false})});
    return ()=>controller.abort();
  },[path,version,secure]);
  return {...state,reload};
}
