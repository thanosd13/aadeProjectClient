import React from 'react';
import { Form, Col } from 'react-bootstrap';
import "./DropDown.css";
import { initialData } from '../../data/productData';

const PriceDropDownMenu = ({ formData, setFormData }) => {
  
  const handleTypeChange = (event) => {
    setFormData({
      ...formData,
      type: event.target.value
    });
  };

  return (
    <Form.Group as={Col} controlId="formGrid">
      <Form.Label>Μονάδα μέτρησης</Form.Label>
      <Form.Control as="select" value={formData.type} onChange={handleTypeChange} className="custom-dropdown">
        <option value="">Επιλέξτε</option>
        {initialData.map(item => (
          <option key={item.code} value={item.name}>{item.name}</option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default PriceDropDownMenu;
