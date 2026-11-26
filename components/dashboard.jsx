'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {useData} from '../lib/state';
import {Loading,Problem} from './states';
import {AppointmentList} from './appointments';
import {ServicesAdmin,UsersAdmin,Transactions} from './management';
import {Profile} from './profile';
import {useStudio} from './frame';
const customer={overview:'Overview',appointments:'My appointments',profile:'My profile'};
const admin={overview:'Overview',services:'Manage services',appointments:'Manage appointments',users:'Manage users',transactions:'Transactions',profile:'My profile'};
const labels={total:'Appointment requests',pending:'Pending',confirmed:'Confirmed',cancelled:'Cancelled',customers:'Registered customers',active:'Active services',paid:'Successful payments'};
export function Dashboard({role}){
 const options=role==='admin'?admin:customer;
 const {user}=useStudio();
 const selected=useSearchParams().get('view');
 const view=Object.hasOwn(options,selected)?selected:'overview';
 const content={overview:<Overview/>,appointments:<AppointmentList admin={role==='admin'}/>,services:<ServicesAdmin/>,users:<UsersAdmin/>,transactions:<Transactions/>,profile:<Profile/>};
 return <div className="wrap dashboard"><aside><div className="dashboard-identity">{user.image&&<img src={user.image} alt=""/>}<div><strong>{user.name}</strong><small>{role==='admin'?'Studio administrator':'Customer'}</small></div></div><nav aria-label="Dashboard">{Object.entries(options).map(([value,label])=><Link aria-current={value===view?'page':undefined} key={value} href={'/dashboard/'+role+'?view='+value}>{label}</Link>)}</nav></aside><section className="dashboard-content"><p className="kicker">SalonBook Studio</p><h1 className="page-title">{options[view]}</h1>{content[view]}</section></div>;
}
function Overview(){
 const {loading,error,data,reload}=useData('/account/overview',true);
 if(loading)return <Loading text="Loading dashboard…"/>;
 if(error)return <Problem text={error.message} retry={reload}/>;
 return <div className="metrics">{Object.entries(data).map(([key,value])=><article className="panel" key={key}><p>{labels[key]}</p><strong>{value}</strong></article>)}</div>;
}
