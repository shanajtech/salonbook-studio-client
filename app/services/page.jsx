import {Suspense} from 'react';
import {Catalog} from '../../components/catalog';
import {Loading} from '../../components/states';
export default function Browse(){return <section className="wrap section"><p className="kicker">SalonBook Studio</p><h1 className="page-title">Browse services</h1><p className="intro">Find a service by name, category or price.</p><Suspense fallback={<Loading/>}><Catalog/></Suspense></section>}
