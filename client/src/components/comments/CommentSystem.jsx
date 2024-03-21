import { useState, useEffect, useContext } from 'react';
import Comment from './Comment';
import { AppContext } from '../../AppContextProvider';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BlueButton, LightLinkButton } from '../reusables/NewButtons.jsx';

const CommentSystem = () => {
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const { user, BASE_URL, auth } = useContext(AppContext);
  const { id: playlistId } = useParams();

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/playlist/comments/${playlistId}`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const addComment = (comment) => {
    setComments([...comments, comment]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const author = user;
    const content = e.target.elements.content.value;

    if (author && content) {
      const newComment = {
        content,
        author,
      };

      const response = await axios.post(
        `${BASE_URL}/playlist/comments/${playlistId}`,
        { content: newComment.content },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response) {
        addComment({ ...newComment, _id: response.data._id });
      }
    }
  };

  const handleShowAllCommentsToggle = () => {
    setShowAllComments(!showAllComments);
  };

  const renderComments = (allComments) => {
    const commentsToRender = showAllComments ? allComments : allComments.slice(0, 4);
    return commentsToRender.map((comment, index) => {
      const isLastComment = index === commentsToRender.length - 1;
      return <Comment key={comment._id} comment={comment} isLast={isLastComment} />;
    });
  };

  const allComments = renderComments(comments);
  const firstFourComments = allComments.slice(0, 3);
  const remainingComments = allComments.slice(4);

  return (
    <section className=' bg-themeNavy '>
      <div className='max-w-2xl mx-auto px-4 mb-12 bg-themeNavy'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-lg lg:text-2xl font-bold text-themePalePink dark:text-themePalePink mt-8'>
            Comments ({comments.length})
          </h2>
        </div>
        <form onSubmit={handleSubmit} className='mb-4'>
          <div className='py-2 px-4 mb-4 bg-themePalePink rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
            <label htmlFor='comment' className='sr-only'>
              Your comment
            </label>
            <textarea
              id='comment'
              name='content'
              rows='6'
              className='px-0 w-full text-sm bg-themePalePink text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-themePalePink dark:placeholder-gray-400 dark:bg-gray-800'
              placeholder='Write a comment...'
              required
            ></textarea>
          </div>
          <BlueButton buttonText='Post comment' />
        </form>
        <div className='comments'>
          {firstFourComments}
          {comments.length > 4 && (
            <div className='mt-4'>
              <LightLinkButton
                buttonText={showAllComments ? 'Hide' : 'Show more'}
                className='text-themeOrange  hover:text-themeMidPink hover:underline text-sm font-bold'
                action={handleShowAllCommentsToggle}
              ></LightLinkButton>
            </div>
          )}
          {showAllComments && remainingComments}
        </div>
      </div>
    </section>
  );
};

export default CommentSystem;
