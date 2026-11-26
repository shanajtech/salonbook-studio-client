import {Guard} from '../../../components/guard';
import {ServiceDetail} from '../../../components/booking';
export default async function Page({params}){const {id}=await params;return <Guard><ServiceDetail id={id}/></Guard>}
