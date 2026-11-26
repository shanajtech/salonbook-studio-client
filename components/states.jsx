import Link from 'next/link';
export function Loading({text='Loading…'}){return <div role="status" className="state"><span className="spinner"/>{text}</div>}
export function Problem({text,retry}){return <div className="state error" role="alert"><p>{text}</p>{retry&&<button className="outline" onClick={retry}>Try again</button>}</div>}
export function Empty({text,link}){return <div className="state"><p>{text}</p>{link&&<Link className="button" href={link}>Browse services</Link>}</div>}
