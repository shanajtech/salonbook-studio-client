import './style.css';
import { Frame } from '../components/frame';
export const metadata={title:'SalonBook Studio | Beauty appointments in Dhaka',description:'Explore salon treatments and request your next appointment in Dhaka.'};
export default function Layout({children}){return <html lang="en"><body><Frame>{children}</Frame></body></html>}
