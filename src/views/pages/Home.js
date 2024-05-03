import React from "react";
import StatisticsCard from "../../components/@vuexy/statisticsCard/StatisticsCard";
import { Row, Col } from "reactstrap";
import {
  Monitor,
  UserCheck,
  Mail,
  Eye,
  MessageSquare,
  ShoppingBag,
  Heart,
  Smile,
  Truck,
  Cpu,
  Server,
  ShoppingCart,
  BarChart,
  Activity,
  AlertOctagon,
} from "react-feather";
import BarCharts from "../chart/BarChart";

class Home extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Col  lg="4" sm="6">
          <StatisticsCard
              hideChart
              iconRight
              iconBg="success"
              icon={<ShoppingCart className="success" size={22}  />}
              stat="20"
              statTitle="Total Products"
            />
          </Col>
          <Col  lg="4" sm="6">
          <StatisticsCard
              hideChart
              iconRight
              iconBg="success"
              icon={<Server className="success" size={22} />}
              stat="5"
              statTitle="Active Products"
            />
          </Col>
          <Col  lg="4" sm="6">
          <StatisticsCard
              hideChart
              iconRight
              iconBg="success"
              icon={<BarChart className="success" size={22} />}
              stat="+20%"
              statTitle="Performance"
            />
          </Col>
        </Row>
        <BarCharts/>
      </div>
    );
  }
}

export default Home;
