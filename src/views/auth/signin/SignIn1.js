import React, { useState } from 'react';
import { Card, Button, Alert, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import { useDispatch } from 'react-redux';
import { login } from '../../../actions/auth';

const SignIn = ({ className, ...rest }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };



  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  const handleSubmit = (event) => {
    event.preventDefault(); 

    if(!validateEmail(formData.email)) {
      setError("Λάθος e-mail!");
      return;
    }

    if(!formData.email || !formData.password) {
      setError("Συμπληρώστε και τα δύο πεδία!");
      return;
    };

    dispatch(login(formData))
      .then(({ status }) => {  
        if(status === 200) {
          navigate("/app/epafes");
        }
      })
      .catch(error => {
        console.error("Login Failed, Error:", error);
        if (error.response && error.response.status === 401) {
          setError("Εισάγατε λάθος στοιχεία!");
        } else {
          setError("Κάποιο λάθος προέκυψε!");
        }
      });
  };
  

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" />
              </div>
              <h3 className="mb-4">Σύνδεση</h3>
              {error &&
                <Col sm={12}>
                  <Alert variant="danger">{error}</Alert>
                </Col>
              }
              <form className={className}>
                <div className="form-group mb-3">
                  <input
                    className="form-control"
                    placeholder="Διεύθυνση e-mail"
                    name="email"
                    onChange={handleChange}
                    type="email"
                    value={formData.email}
                  />
                </div>
                <div className="form-group mb-4">
                  <input
                    className="form-control"
                    placeholder="Κωδικός πρόσβασης"
                    name="password"
                    onChange={handleChange}
                    type="password"
                    value={formData.password}
                  />
                </div>
                <Row>
                  <Col mt={2}>
                    <Button onClick={handleSubmit} className="btn-block" type="submit" variant="primary">
                      Σύνδεση
                    </Button>
                  </Col>
                </Row>
              </form>
              <p className="mb-0 text-muted">
                Δεν έχετε λογαριασμό;{' '}
                <NavLink to="/auth/signup-1" className="f-w-400">
                  Εγγραφή
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignIn;
