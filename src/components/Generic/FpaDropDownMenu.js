import "./DropDown.css";
import React from 'react';
import { Form, Col } from 'react-bootstrap';
import { initialData } from "../../data/fpaData";


const FpaDropDownMenu = ({ formData, setFormData }) => {
    
    const handleFpaChange = (event) => {
        const fpaValue = parseFloat(event.target.value); // Convert VAT value to a number
        setFormData(prevFormData => {
          const price = parseFloat(prevFormData.price); // Ensure price is treated as a number
          const finalPrice = price + (price * (fpaValue / 100)); // Calculate final price including VAT
          return {
            ...prevFormData,
            fpa: event.target.value,
            final_price: finalPrice.toFixed(2) // Format final price to 2 decimal places
          };
        });
    };
      
  
    return (
      <Form.Group as={Col} controlId="formGrid">
        <Form.Label>Φ.Π.Α</Form.Label>
        <Form.Control as="select" value={formData.country} onChange={handleFpaChange} className="custom-dropdown">
          <option value="">Επιλέξτε</option>
          {initialData.map(item => (
            <option key={item.code} value={item.value}>{item.value}</option>
          ))}
        </Form.Control>
      </Form.Group>
    );
  };
  
  export default FpaDropDownMenu;