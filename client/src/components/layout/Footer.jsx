import heronLogo from '../../assets/heronLogo.png';

export default function Footer() {
  return (
    <>
      <div className='bg-themeMidBlue text-themePalePink text-center py-4 mt-2'>
        <div className='grid grid-cols-1 items-center gap-4 divide-y-2 p-4 divide-themePalePink sm:grid-cols-2 sm:divide-x-2 sm:divide-y-0'>
          <div className='m-auto text-center'>
            <img src={heronLogo} className='listSizeImage m-auto p-2' />
            <p>Created by the Heavenly Herons</p>
          </div>
          <p className='text-sm p-2 text-themeNavy'>
            Big thanks to Andrew and the tutors <br /> of COMPSCI 732 / SOFTENG 750
          </p>
        </div>
      </div>
    </>
  );
}
