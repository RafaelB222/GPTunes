import { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AppContext } from '../../AppContextProvider';
import ImageUploadForm from './ImageUploadForm';
import cities from '../../util/locationData.js';
import { LightButton } from '../reusables/NewButtons';
import { Link } from 'react-router-dom';

export const RegisterForm = () => {
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPass: '',
    location: '',
  };

  const { BASE_URL, navigate } = useContext(AppContext);

  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    confirmEmail: Yup.string()
      .email('Invalid email format')
      .oneOf([Yup.ref('email'), null], 'Emails must match')
      .required('Required'),
    password: Yup.string().required('Required'),
    confirmPass: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
    location: Yup.string().required('Required'),
  });

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('first_name', values.firstName);
      formData.append('last_name', values.lastName);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('location', values.location);
      formData.append('friends', []); // You can pass any default value for friends as needed
      formData.append('image', selectedImage);

      await axios.post(`${BASE_URL}/auth/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Registration successful');
      navigate('/login');
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setMessage('No Server Response');
      } else {
        setMessage('Registration Failed');
      }
    }
  };

  const handleFileInputChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setSelectedImage(selected);
      setMessage(null);
    } else {
      setSelectedImage(null);
      setMessage('Please select an image file.');
    }
  };

  return (
    <div className='w-full max-w-lg mx-auto mt-10 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className='w-full max-w-lg'>
          <h1 className='text-3xl font-semibold mb-8 text-gray-700'>Register Now</h1>

          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
              <label
                htmlFor='firstName'
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              >
                First Name
              </label>
              <Field
                type='text'
                id='firstName'
                name='firstName'
                placeholder='Jane'
                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              />
              <ErrorMessage name='firstName'>
                {(msg) => <div className='text-red-500 text-xs italic'>{msg}</div>}
              </ErrorMessage>
            </div>
            <div className='w-full md:w-1/2 px-3'>
              <label
                htmlFor='lastName'
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              >
                Last Name
              </label>
              <Field
                type='text'
                id='lastName'
                name='lastName'
                placeholder='Doe'
                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              />
              <ErrorMessage name='lastName'>
                {(msg) => <div className='text-red-500 text-xs italic'>{msg}</div>}
              </ErrorMessage>
            </div>
          </div>
          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full px-3'>
              <label
                htmlFor='email'
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              >
                Email
              </label>
              <Field
                type='email'
                id='email'
                name='email'
                placeholder='jane@example.com'
                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              />
              <ErrorMessage name='email'>
                {(msg) => <div className='text-red-500 text-xs italic'>{msg}</div>}
              </ErrorMessage>
            </div>
          </div>

          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full px-3'>
              <label
                htmlFor='confirmEmail'
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              >
                Confirm Email
              </label>
              <Field
                type='email'
                id='confirmEmail'
                name='confirmEmail'
                placeholder='jane@example.com'
                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              />
              <ErrorMessage name='confirmEmail'>
                {(msg) => <div className='text-red-500 text-xs italic'>{msg}</div>}
              </ErrorMessage>
            </div>
          </div>

          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full px-3'>
              <label
                htmlFor='password'
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              >
                Password
              </label>
              <Field
                type='password'
                id='password'
                name='password'
                placeholder='******************'
                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              />
              <ErrorMessage name='password'>
                {(msg) => <div className='text-red-500 text-xs italic'>{msg}</div>}
              </ErrorMessage>
            </div>
          </div>
          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full px-3'>
              <label
                htmlFor='confirmPass'
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              >
                Confirm Password
              </label>
              <Field
                type='password'
                id='confirmPass'
                name='confirmPass'
                placeholder='******************'
                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              />
              <ErrorMessage name='confirmPass'>
                {(msg) => <div className='text-red-500 text-xs italic'>{msg}</div>}
              </ErrorMessage>
            </div>
          </div>

          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full px-3'>
              <label
                htmlFor='location'
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              >
                Location
              </label>
              <Field
                as='select'
                id='location'
                name='location'
                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              >
                <option value=''>Select a location</option>
                {cities.map((city) => {
                  return (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  );
                })}
              </Field>
              <ErrorMessage name='location'>
                {(msg) => <div className='text-red-500 text-xs italic'>{msg}</div>}
              </ErrorMessage>
            </div>
          </div>
          <div className='flex flex-wrap -mx-3 mb-6'>
            <div className='w-full px-3'>
              <label
                htmlFor='image'
                className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
              >
                Profile Image
              </label>
              <ImageUploadForm
                className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                selectedFile={selectedImage}
                handleFileInputChange={handleFileInputChange}
                currentImage={selectedImage}
              />
              <ErrorMessage name='image'>
                {(msg) => <div className='text-red-500 text-xs italic'>{msg}</div>}
              </ErrorMessage>
            </div>
          </div>

          {message && <div className='text-red-500 text-xs italic mb-4'>{message}</div>}

          <div className='flex items-center justify-between'>
            <LightButton buttonText={'Register'} action={handleSubmit} />
            <Link
              to='/login'
              className='inline-block align-baseline font-bold text-sm text-themeMidPink hover:underline underline-offset-8'
            >
              Already have an account? Login
            </Link>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
export default RegisterForm;
