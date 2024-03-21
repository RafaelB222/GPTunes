import { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import ImageUploadForm from './ImageUploadForm';
import { AppContext } from '../../AppContextProvider';
import { LightButton } from '../reusables/NewButtons';
import cities from '../../util/locationData.js';

export const EditAccountForm = ({ closeForm }) => {
  const { user, auth, BASE_URL, setUser } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState(null);

  const initialValues = {
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    location: user.location,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
  });

  const handleSave = async (values) => {
    try {
      const formData = new FormData();
      formData.append('first_name', values.firstName);
      formData.append('last_name', values.lastName);
      formData.append('location', values.location);
      formData.append('image', selectedImage);

      const response = await axios.patch(`${BASE_URL}/auth/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${auth}`,
        },
      });
      setUser(response.data);
      // now the form is closed when the user clicks save
      closeForm();
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        console.log(err);
      } else {
        console.log(err.response);
      }
    }
  };

  const handleFileInputChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setSelectedImage(selected);
    } else {
      setSelectedImage(null);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSave}>
      <Form className='w-full max-w-lg'>
        <div className='flex flex-wrap -mx-3 mb-6'>
          <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
            <label className='accountTextLabels' htmlFor='grid-first-name'>
              First Name
            </label>
            <Field
              className='accountFormCss'
              type='text'
              id='grid-first-name'
              name='firstName'
              placeholder='Jane'
            />
            <ErrorMessage
              name='firstName'
              render={(msg) => <p className='text-red-500 text-xs italic'>{msg}</p>}
            />
          </div>
          <div className='w-full md:w-1/2 px-3'>
            <label className='accountTextLabels' htmlFor='grid-last-name'>
              Last Name
            </label>
            <Field
              className='accountFormCss'
              type='text'
              id='grid-last-name'
              name='lastName'
              placeholder='Doe'
            />
            <ErrorMessage
              name='lastName'
              render={(msg) => <p className='text-red-500 text-xs italic'>{msg}</p>}
            />
          </div>
        </div>
        <Field
          className='accountFormCss'
          type='email'
          id='grid-email'
          name='email'
          placeholder={user.email}
          disabled
        />
        <div className='flex flex-wrap -mx-3 mb-6 mt-3'>
          <div className='w-full px-3 mb-6 md:mb-0'>
            <label className='accountTextLabels' htmlFor='grid-location'>
              Location
            </label>
            <div className='relative'>
              <Field as='select' className='accountFormCss ' id='grid-location' name='location'>
                {cities.map((city) => {
                  return (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  );
                })}
              </Field>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'></div>
            </div>
          </div>
        </div>
        <div className='mb-4 col-span-2'>
          <label htmlFor='image' className='block mb-2 text-lg font-medium text-gray-700'>
            Upload a profile picture
          </label>
          <ImageUploadForm
            selectedFile={selectedImage}
            handleFileInputChange={handleFileInputChange}
            currentImage={`${BASE_URL}/${user.image_url}`}
          />
        </div>
        <div className='text-center'>
          <LightButton buttonText='Save' type='submit' />
        </div>
      </Form>
    </Formik>
  );
};
