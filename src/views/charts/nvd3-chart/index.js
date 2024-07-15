import React from "react";
import { Row, Col, Card } from "react-bootstrap";

import LineChart from "./chart/LineChart";
import BarDiscreteChart from "./chart/BarDiscreteChart";
import PieDonutChart from "./chart/PieDonutChart";
import PieBasicChart from "./chart/PieBasicChart";
import MultiBarChart from "./chart/MultiBarChart";
import HorizontalBarChart from "./chart/HorizontalBarChart";

const Nvd3Chart = () => {
  return (
    <React.Fragment>
      <Row>
        {/* <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Line Chart</Card.Title>
            </Card.Header>
            <Card.Body>
              <LineChart />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Πωλήσεις ήνα</Card.Title>
            </Card.Header>
            <Card.Body>
              <BarDiscreteChart />
            </Card.Body>
          </Card>
        </Col> */}
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Πωλήσεις μήνα</Card.Title>
            </Card.Header>
            <Card.Body>
              <HorizontalBarChart />
            </Card.Body>
          </Card>
        </Col>
        {/* <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Pie Basic Chart</Card.Title>
            </Card.Header>
            <Card.Body className="text-center">
              <PieBasicChart />
            </Card.Body>
          </Card>
        </Col> */}
        <Col md={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Δημοφιλή προϊόντα</Card.Title>
            </Card.Header>
            <Card.Body className="text-center">
              <PieDonutChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Nvd3Chart;
