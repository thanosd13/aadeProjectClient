import React, { useState } from 'react';
import axios from 'axios';
import { SketchPicker } from 'react-color';
import { useSelector } from 'react-redux';

function GeneratePdf() {
  const [logo, setLogo] = useState(null);
  const [colors, setColors] = useState({
    primaryText: '#000000',
    secondaryText: '#FFFFFF',
    background: '#FFFFFF'
  });
  const [textSize, setTextSize] = useState(12);
  const [invoice, setInvoice] = useState({
    invoice_nr: 123,
    subtotal: 100,
    paid: 50,
    items: [
      { item: 'Item 1', description: 'A sample item', quantity: 1, amount: 50 },
      { item: 'Item 2', description: 'Another sample item', quantity: 1, amount: 50 }
    ],
    shipping: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      country: 'USA'
    }
  });
  const id = useSelector(state => state.auth.user.user.id);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleColorChange = (color, name) => {
    setColors((prevColors) => ({ ...prevColors, [name]: color.hex }));
  };

  const handleTextSizeChange = (event) => {
    setTextSize(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      logo,
      colors,
      textSize,
      invoice
    };

    try {
      const response = await axios.post('http://localhost:3000/generate-pdf', data, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoice.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const findUserData = () => {

    UserService.findUserData(id)
    .then(response => {
        if(response.status === 200) {
            setUserData(response.data);
        }
    }).catch(error => {
        if(error.response.status === 404) {
            setUserData([]); 
        }
    });
  } 

useEffect(() => {
  // findUserData();
}, []);

  return (
    <div>
      <h1>Προσαρμογή Τιμολογίου</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Λογότυπο:</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} />
          {logo && <img src={logo} alt="Logo Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
        </div>
        <div>
          <label>Πρωτεύον Χρώμα Κειμένου:</label>
          <SketchPicker color={colors.primaryText} onChange={(color) => handleColorChange(color, 'primaryText')} />
        </div>
        <div>
          <label>Δευτερεύον Χρώμα Κειμένου:</label>
          <SketchPicker color={colors.secondaryText} onChange={(color) => handleColorChange(color, 'secondaryText')} />
        </div>
        <div>
          <label>Χρώμα Φόντου:</label>
          <SketchPicker color={colors.background} onChange={(color) => handleColorChange(color, 'background')} />
        </div>
        <div>
          <label>Μέγεθος Κειμένου:</label>
          <input type="number" value={textSize} onChange={handleTextSizeChange} />
        </div>
        <button type="submit">Δημιουργία PDF</button>
      </form>
      <div style={{ border: '1px solid #000', margin: '20px 0', padding: '10px', backgroundColor: colors.background }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {logo && <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />}
          <div style={{ textAlign: 'right', color: colors.primaryText }}>
            <h1 style={{ margin: 0, fontSize: `${textSize}px` }}>ACME Inc.</h1>
            <div>123 Main Street</div>
            <div>New York, NY, 10025</div>
          </div>
        </div>
        <div style={{ marginTop: 20, color: colors.primaryText, fontSize: `${textSize}px` }}>
          <div>Invoice Number: {invoice.invoice_nr}</div>
          <div>Invoice Date: {new Date().toLocaleDateString()}</div>
          <div>Balance Due: {invoice.subtotal - invoice.paid}</div>
          <div style={{ marginTop: 20 }}>
            <div>{invoice.shipping.name}</div>
            <div>{invoice.shipping.address}</div>
            <div>{invoice.shipping.city}, {invoice.shipping.state}, {invoice.shipping.country}</div>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, color: colors.primaryText, fontSize: `${textSize}px` }}>
          <thead>
            <tr style={{ backgroundColor: colors.primaryText, color: colors.secondaryText }}>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Περιγραφή</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Ποσότητα</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Τιμή</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Σύνολο</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{item.item}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{item.quantity}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{item.amount / item.quantity}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{item.amount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>Σύνολο:</td>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{invoice.subtotal}</td>
            </tr>
          </tfoot>
        </table>
        <div style={{ textAlign: 'center', color: colors.primaryText, fontSize: `${textSize}px` }}>
          Payment is due within 15 days. Thank you for your business.
        </div>
      </div>
    </div>
  );
}

export default GeneratePdf;
