import { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AppContext } from '../../AppContextProvider';
import { LightButton } from '../reusables/NewButtons';

const LoginForm = () => {
  const { setAuth, setUser, navigate, BASE_URL } = useContext(AppContext);
  const [message, setMessage] = useState('');

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, values, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000, // Here we set a timeout of 5000 milliseconds (5 seconds)
      });
      const accessToken = response?.data?.accessToken;
      const userObj = response?.data?.user;

      setAuth(accessToken);
      setUser(userObj);
      setMessage('');
      navigate('/user-dashboard');
    } catch (err) {
      setTimeout(() => {
        if (err.code === 'ECONNABORTED') {
          setMessage('A timeout occurred while attempting to connect to the server');
        } else if (!err?.response) {
          setMessage('No Server Response');
        } else if (err.response?.status === 401) {
          setMessage('Invalid email or password');
        } else {
          setMessage('Login Failed');
        }
      }, 2000);
    }
  };

  return (
    <div className='w-full max-w-lg mx-auto mt-10 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full px-3'>
              <label className='accountTextLabels' htmlFor='email'>
                Email
              </label>
              <Field
                type='email'
                id='email'
                name='email'
                placeholder='you@example.com'
                className='accountFormCss'
              />
              <ErrorMessage name='email'>
                {(msg) => <div className='text-red-500 text-xs italic'>{msg}</div>}
              </ErrorMessage>
            </div>
          </div>
          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full px-3'>
              <label className='accountTextLabels' htmlFor='password'>
                Password
              </label>
              <Field
                type='password'
                id='password'
                name='password'
                placeholder='******************'
                className='accountFormCss mb-3'
              />
              <ErrorMessage name='password'>
                {(msg) => <div className='text-red-500 text-xs italic'>{msg}</div>}
              </ErrorMessage>
            </div>
          </div>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center'>
              <input id='remember-me' type='checkbox' className='mr-2' />
              <label htmlFor='remember-me' className='text-gray-700'>
                Remember me!
              </label>
            </div>
            <LightButton buttonText={'Submit'} action={handleSubmit} colour={'themeMidpink'} />
          </div>
          <div className='text-red-500 text-sm mt-1'>{message}</div>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginForm;
