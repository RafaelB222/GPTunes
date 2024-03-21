import loader from './../../assets/loader.svg';

/**
 * Contains the Loading component when a page is still fetching data
 */
export default function LoadingComponent() {
  return (
    <>
      <img src={loader} alt='Loading...' />
    </>
  );
}
