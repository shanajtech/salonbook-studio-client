'use client';
import Link from 'next/link';
import {useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {money} from '../lib/api';
import {useData} from '../lib/state';
import {Empty,Loading,Problem} from './states';
export function Card({item}){return <article className="card"><Link href={'/services/'+item._id} className="card-image"><img src={item.image} alt={item.serviceName} loading="lazy"/></Link><div className="card-body"><div className="meta"><span>{item.category}</span><span>{item.duration} min</span></div><h3>{item.serviceName}</h3><p>{item.description}</p><div className="card-actions"><strong>{money(item.price)}</strong><Link className="outline" href={'/services/'+item._id}>View details</Link></div></div></article>}
export function Catalog({home=false}){
 const params=useSearchParams();
 const [q,setQ]=useState(params.get('q')||''),[category,setCategory]=useState(params.get('category')||''),[sort,setSort]=useState('');
 const query=new URLSearchParams({q,category,sort});
 const {data,loading,error,reload}=useData('/services?'+query);
 const items=data?.items||[];
 return <>{!home&&<div className="filters"><label>Search services<input value={q} onChange={e=>setQ(e.target.value)} placeholder="e.g. Botanical facial"/></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{[...new Set([category,...(data?.categories||[])])].filter(Boolean).map(c=><option key={c}>{c}</option>)}</select></label><label>Sort by<select value={sort} onChange={e=>setSort(e.target.value)}><option value="">Latest services</option><option value="asc">Price, low to high</option><option value="desc">Price, high to low</option></select></label></div>}
 {loading?<Loading text="Finding salon services…"/>:error?<Problem text={error.message} retry={reload}/>:items.length?<div className="cards">{(home?items.slice(0,6):items).map(item=><Card key={item._id} item={item}/>)}</div>:<Empty text="No services match your search."/>}
 {home&&data?.categories.length>0&&<section className="category-section"><p className="kicker">Find your treatment</p><h2>Browse by category</h2><div className="chips">{data.categories.map(name=><Link key={name} href={'/services?category='+encodeURIComponent(name)}>{name}</Link>)}</div></section>}</>
}
