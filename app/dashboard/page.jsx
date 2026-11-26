'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Guard} from '../../components/guard';
import {useStudio} from '../../components/frame';
import {Loading} from '../../components/states';
function Jump(){const {user}=useStudio(),router=useRouter();useEffect(()=>router.replace('/dashboard/'+user.role),[router,user.role]);return <Loading/>}
export default function Page(){return <Guard><Jump/></Guard>}
