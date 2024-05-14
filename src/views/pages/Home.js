import React, { useEffect } from "react";
import StatisticsCard from "../../components/@vuexy/statisticsCard/StatisticsCard";
import { Row, Col, Spinner } from "reactstrap";
import { ShoppingCart, Server, BarChart } from "react-feather";
import BarCharts from "../chart/BarChart";
import { cacheKeys } from "../../api/CacheKeys";
import { useQuery } from "react-query";
import useApi from "../../hooks/useApi";
import useSnackbarStatus from "../../hooks/useSnackbarStatus";

const Home = () => {
  const api = useApi({ formData: false });
  const showMessage = useSnackbarStatus();

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: [cacheKeys.dashboard],
    queryFn: () => api.getDashboardData(),
    onError: (error) => {
      showMessage(error?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div>
      <Row>
        <Col lg="4" sm="6">
          {isLoading || isFetching ? (
            <Spinner color="primary" />
          ) : (
            <StatisticsCard
              hideChart
              iconRight
              iconBg="success"
              icon={<ShoppingCart className="success" size={22} />}
              stat={data?.totalProductsCount}
              statTitle="Total Products"
            />
          )}
        </Col>
        <Col lg="4" sm="6">
          {isLoading || isFetching ? (
            <Spinner color="primary" />
          ) : (
            <StatisticsCard
              hideChart
              iconRight
              iconBg="success"
              icon={<Server className="success" size={22} />}
              stat={data?.activeProductCount}
              statTitle="Active Products"
            />
          )}
        </Col>
        <Col lg="4" sm="6">
          {isLoading || isFetching ? (
            <Spinner color="primary" />
          ) : (
            <StatisticsCard
              hideChart
              iconRight
              iconBg="success"
              icon={<BarChart className="success" size={22} />}
              stat="+20%"
              statTitle="Performance"
            />
          )}
        </Col>
      </Row>
      <BarCharts topProducts={data?.topProducts} />
    </div>
  );
};

export default Home;
