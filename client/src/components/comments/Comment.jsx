import { getTimeSinceCreation } from '../../util/timeUtils.js';
import { useContext } from 'react';
import { AppContext } from '../../AppContextProvider';
import moment from 'moment';

const Comment = ({ comment, isLast }) => {
  const { navigate, IMAGE_URL } = useContext(AppContext);

  const handleNavigate = () => {
    navigate(`/user/${comment.author._id}`);
  };

  const formattedDate = moment(comment.createdAt).format('YYYY-MM-DDTHH:mm:ssZ');
  const displayDate = moment(comment.createdAt).format('MMM DD, YYYY');
  const displayTime = moment(comment.createdAt).format('h:mm A');
  const timeSinceCreation = getTimeSinceCreation(formattedDate);

  return (
    <article
      className={`p-6 text-base rounded-md bg-themePalePink dark:bg-themeNavy ${
        isLast ? 'border-b-0' : 'border-b border-gray-200'
      } w-full`}
    >
      <footer className='flex justify-between items-center mb-2'>
        <div className='flex items-center'>
          <img
            className='mr-2 w-10 h-10 object-cover rounded-full cursor-pointer hover:opacity-80'
            src={IMAGE_URL + comment.author.image_url}
            alt={comment.author.first_name + ' ' + comment.author.last_name}
            onClick={handleNavigate}
          />
          <p className='inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white'>
            {comment.author.first_name} {comment.author.last_name}
          </p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            <time dateTime={formattedDate} title={formattedDate}>
              {`${displayDate} at ${displayTime} (${timeSinceCreation})`}
            </time>
          </p>
        </div>
      </footer>
      <p className='text-gray-500 dark:text-gray-400'>{comment.content}</p>
    </article>
  );
};

export default Comment;
