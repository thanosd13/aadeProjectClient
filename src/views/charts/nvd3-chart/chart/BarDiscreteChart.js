import React, { useState, useEffect } from "react";
import NVD3Chart from "react-nvd3";
import { useSelector } from "react-redux";
import UserService from "../../../../services/UserService";

const BarDiscreteChart = () => {
  const [invoices, setInvoices] = useState([]);
  const id = useSelector((state) => state.auth.user.user.id);

  useEffect(() => {
    UserService.getDailyTotalPrice(id)
      .then((response) => {
        if (response.status === 200) {
          setInvoices(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  // Transform the data to the format expected by NVD3Chart
  const datum = [
    {
      key: "Cumulative Return",
      values: invoices.map((invoice) => ({
        label: invoice.date,
        value: parseFloat(invoice.total_price),
        color: "#1de9b6",
      })),
    },
  ];

  return (
    <NVD3Chart
      tooltip={{ enabled: true }}
      type="discreteBarChart"
      datum={datum}
      x="label"
      y="value"
      height={300}
      showValues
    />
  );
};

export default BarDiscreteChart;
