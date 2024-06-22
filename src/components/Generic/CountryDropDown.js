// CountryDropdown.js
import React from 'react';
import { Form, Col } from 'react-bootstrap';
import "./DropDown.css";
import { initialData } from '../../data/countryData';

const countries = [
  { label: "Ελλάδα", value: "GR" },
  { label: "Ηνωμένο Βασίλειο", value: "UK" },
  { label: "Γερμανία", value: "DE" },
  { label: "ΗΠΑ", value: "US" },
  // Add more countries as needed
];

const CountryDropdown = ({ formData, setFormData }) => {
  const handleCountryChange = (event) => {
    setFormData({
      ...formData,
      country: event.target.value
    });
  };

  return (
    <Form.Group as={Col} controlId="formGridCountry">
      <Form.Label>Χώρα</Form.Label>
      <Form.Control as="select" value={formData.country} onChange={handleCountryChange} className="custom-dropdown">
        <option value="">Επιλέξτε χώρα</option>
        {initialData.map(country => (
          <option key={country.code} value={country.code}>{country.name}</option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default CountryDropdown;
