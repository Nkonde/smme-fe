import './App.css';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toPng } from 'html-to-image'; // Correct import for html-to-image

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .max(15, 'Must be 15 characters or less')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number should only contain numbers")
    .min(10, 'Phone number must be at least 10 digits')
    .optional(),
  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .optional(),
});

export default function Form() {
  const [showMoreFields, setShowMoreFields] = useState(false); // Manage visibility of extra fields

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Convert form to image and log base64 string on submit
      const formElement = document.getElementById('form-container'); // Get form container element
      try {
        // Capture the form image
        const dataUrl = await toPng(formElement, {
          width: formElement.offsetWidth, // Fixed width based on form's container
          height: formElement.offsetHeight, // Fixed height based on form's container
          style: {
            transform: 'scale(1)', // Ensure no scaling of the form
            transformOrigin: 'top left',
          },
          canvasWidth: formElement.offsetWidth * window.devicePixelRatio,  // Scale for high DPI
          canvasHeight: formElement.offsetHeight * window.devicePixelRatio, // Scale for high DPI
          pixelRatio: window.devicePixelRatio, // Ensure correct resolution on high-DPI screens
        });

        console.log('Base64 Image:', dataUrl); // Log the Base64 image to the console
      } catch (error) {
        console.error('Error taking screenshot:', error);
      }

      // Log form values to the console (for debugging)
      console.log('Form Submitted:', values);
    },
  });

  // Toggle extra fields visibility
  const toggleMoreFields = () => {
    setShowMoreFields(!showMoreFields);
  };

  return (
    <div className="form-container" id="form-container"> {/* Add id to form container */}
      <div className="form-box">
        <h2 className="form-header">Sign Up</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Name Input */}
          <div className="input-group">
            <label htmlFor="name" className="label">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="input-field"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="error-message">{formik.errors.name}</div>
            )}
          </div>

          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="input-field"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error-message">{formik.errors.email}</div>
            )}
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="input-field"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="error-message">{formik.errors.password}</div>
            )}
          </div>

          {/* Add More Fields Button */}
          <div className="input-group">
            <button
              type="button"
              className="add-more-btn"
              onClick={toggleMoreFields}
            >
              {showMoreFields ? 'Show Less' : 'Add More Fields'}
            </button>
          </div>

          {/* Conditional Fields (Phone & Address) */}
          {showMoreFields && (
            <>
              {/* Phone Input */}
              <div className="input-group">
                <label htmlFor="phone" className="label">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  className="input-field"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="error-message">{formik.errors.phone}</div>
                )}
              </div>

              {/* Address Input */}
              <div className="input-group">
                <label htmlFor="address" className="label">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                  className="input-field"
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="error-message">{formik.errors.address}</div>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}
