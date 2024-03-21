import DefaultLayout from '../layout/DefaultLayout';
import LoadingComponent from './LoadingComponent';

//Helps display the loading animation
export default function LoadingPartial() {
  const animated = false;

  return (
    <DefaultLayout animated={animated}>
      <div className='bg-themeMidPink m-auto p-10 rounded-full'>
        <LoadingComponent />
      </div>
      <p>Loading...</p>
    </DefaultLayout>
  );
}
