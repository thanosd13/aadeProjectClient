import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { useSelector } from "react-redux";
import UserService from "../../../../services/UserService";

const HorizontalBarChart = () => {
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

  const dates = invoices.map((invoice) => invoice.date);
  const totalPrices = invoices.map((invoice) => invoice.total_price);

  const basicData = {
    labels: dates,
    datasets: [
      {
        label: "Πωλήσεις ανά ημέρα",
        backgroundColor: "#42A5F5",
        data: totalPrices,
      },
    ],
  };

  const getLightTheme = () => {
    let basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    let horizontalOptions = {
      indexAxis: "y",
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    return {
      basicOptions,
      horizontalOptions,
    };
  };

  const { basicOptions, horizontalOptions } = getLightTheme();

  return (
    <div>
      <div className="card">
        <Chart type="bar" data={basicData} options={horizontalOptions} />
      </div>
    </div>
  );
};

export default HorizontalBarChart;
