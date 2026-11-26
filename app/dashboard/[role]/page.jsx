import {Suspense} from 'react';
import {notFound} from 'next/navigation';
import {Guard} from '../../../components/guard';
import {Dashboard} from '../../../components/dashboard';
import {Loading} from '../../../components/states';
export default async function Page({params}){const {role}=await params;if(!['customer','admin'].includes(role))notFound();return <Guard role={role}><Suspense fallback={<Loading/>}><Dashboard role={role}/></Suspense></Guard>}
