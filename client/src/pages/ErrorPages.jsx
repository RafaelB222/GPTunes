import { useLocation } from 'react-router-dom';
import DefaultLayout from '../components/layout/DefaultLayout';
import { useParams } from 'react-router-dom';

/**
 * Displays an error message when a specific profile or playlist page (using params) cannot be found.
 * Includes default 404 page.
 */
export default function ErrorPages() {
  const errorType = useParams();
  const { pathname } = useLocation();
  let message;
  if (errorType.errorType == 'profileNotFound') {
    message = "Sorry, we couldnt find the profile you're looking for!";
  } else if (errorType.errorType == 'playlistNotFound') {
    message = "Sorry, we couldn't find the playlist you're looking for!";
  } else {
    message = `Sorry, we couldn't find what you're looking for! Is the path "${pathname}" correct?`;
  }

  return (
    <DefaultLayout>
      <p>{message}</p>
    </DefaultLayout>
  );
}
