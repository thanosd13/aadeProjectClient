// import PropTypes from 'prop-types';
// import React, { useState } from 'react';
// import { Row, Col, Button, Alert } from 'react-bootstrap';

// import * as Yup from 'yup';
// import { Formik } from 'formik';

// const FirebaseLogin = ({ className, ...rest }) => {

//   const[formData, setFormData] = useState({
//     "email":"",
//     "password":""
//   })

//   const handleChange = () => {
//     console.log("test!");
//   };

//   return (
//     <React.Fragment>
//       <Formik>
//           <form className={className} {...rest}>
//             <div className="form-group mb-3">
//               <input
//                 className="form-control"
//                 placeholder="Διεύθυνση email"
//                 name="email"
//                 onChange={handleChange}
//                 type="email"
//                 value={formData.email}
//               />
//             {/* <small className="text-danger form-text">aaaa</small> */}
//             </div>
//             <div className="form-group mb-4">
//               <input
//                 className="form-control"
//                 placeholder="Κωδικός Πρόσβασης"
//                 name="password"
//                 onChange={handleChange}
//                 type="password"
//                 value={formData.password}
//               />
//               {/* <small className="text-danger form-text">aaa</small> */}
//             </div>

//               {/* <Col sm={12}>
//                 <Alert variant="danger">aaa</Alert>
//               </Col> */}

//             <Row>
//               <Col mt={2}>
//                 <Button className="btn-block" color="primary" size="large" type="submit" variant="primary">
//                   Signin
//                 </Button>
//               </Col>
//             </Row>
//           </form>
//       </Formik>

//       <hr />
//     </React.Fragment>
//   );
// };

// FirebaseLogin.propTypes = {
//   className: PropTypes.string
// };

// export default FirebaseLogin;
