import React from "react";
import { Form, Col } from "react-bootstrap";
import "./DropDown.css";
import { initialData } from "../../data/productData";

const PriceDropDownMenu = ({
  formData,
  setFormData,
  value,
  onChange,
  disabled,
}) => {
  const handleTypeChange = (event) => {
    setFormData({
      ...formData,
      type: event.target.value,
    });
  };

  return (
    <React.Fragment>
      {!value && !onChange ? (
        <Form.Group as={Col} controlId="formGrid">
          <Form.Label>Μονάδα μέτρησης</Form.Label>
          <Form.Control
            as="select"
            value={formData.type}
            onChange={handleTypeChange}
            className="custom-dropdown"
          >
            <option value="">Επιλέξτε</option>
            {initialData.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      ) : (
        <Form.Group as={Col} controlId="formGrid">
          <Form.Control
            as="select"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="custom-dropdown"
            disabled={disabled}
          >
            <option value="">Επιλέξτε</option>
            {initialData.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      )}
    </React.Fragment>
  );
};

export default PriceDropDownMenu;
