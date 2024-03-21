import Header from './Header';
import Footer from './Footer';

export default function DefaultLayout({ children, bgColour, pageTitle, animated }) {
  return (
    <main>
      <Header animated={animated} />
      <div
        className='sm:min-h-screen overflow-hidden flex flex-col items-center justify-center py-4 sm:pt-20 sm:pb-10'
        style={{ backgroundColor: bgColour }}
      >
        <h1 className='text-3xl sm:text-4xl mb-8 text-left'>{pageTitle ? pageTitle : null}</h1>
        {children}
      </div>
      <Footer />
    </main>
  );
}
