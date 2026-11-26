import Link from 'next/link';
export const metadata={title:'Privacy | SalonBook Studio'};
export default function Privacy(){
 return <section className="wrap section"><h1 className="page-title">Privacy notice</h1><div className="panel stack profile-form">
  <p>SalonBook Studio is a student appointment-booking project. Use sample booking details when evaluating the app.</p>
  <h2>Account information</h2><p>We use your name and email to manage your account. If you use Google sign-in, Google provides your name, email and profile picture for authentication and display. We do not request Google Drive or Gmail access.</p>
  <h2>Appointments and payments</h2><p>We store appointment times, selected services and any optional booking note. Studio administrators can view bookings to confirm or cancel them. When Stripe Checkout is used, Stripe handles card information. SalonBook stores the payment reference, amount and status.</p>
  <h2>Hosting and photos</h2><p>The app is hosted on Vercel and stores application records in MongoDB Atlas. Administrators upload service photos to ImgBB, which hosts the resulting images.</p>
  <p>For questions or account and data removal requests, email <a href="mailto:shanajj3399@gmail.com">shanajj3399@gmail.com</a>.</p><Link href="/">Return to SalonBook Studio</Link>
 </div></section>
}
