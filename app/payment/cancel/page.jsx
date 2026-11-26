import Link from 'next/link';
import {Guard} from '../../../components/guard';
export default function Page(){return <Guard role="customer"><section className="wrap section"><div className="panel profile-form"><p className="kicker">Stripe Checkout</p><h1 className="page-title">Checkout cancelled</h1><p>Your appointment is still in your dashboard. You can return to it to try paying again.</p><Link className="button" href="/dashboard/customer?view=appointments">My appointments</Link></div></section></Guard>}
