import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";

import RegisterJWT from "./RegisterJWT";
import registerImg from "../../../../assets/img/pages/register.jpg";
import "../../../../assets/scss/pages/authentication.scss";

const Register = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <Row className="m-0 justify-content-center">
      <Col
        sm="8"
        xl="7"
        lg="10"
        md="8"
        className="d-flex justify-content-center"
      >
        <Card className="bg-authentication rounded-0 mb-0 w-100">
          <Row className="m-0">
            <Col
              lg="6"
              className="d-lg-block d-none text-center align-self-center px-1 py-0"
            >
              <img className="mr-1" src={registerImg} alt="registerImg" />
            </Col>
            <Col lg="6" md="12" className="p-0">
              <Card className="rounded-0 mb-0 p-2">
                <CardHeader className="pb-1 pt-50">
                  <CardTitle>
                    <h4 className="mb-0">Create Account</h4>
                  </CardTitle>
                </CardHeader>
                <p className="px-2 auth-title mb-0">
                  Fill the below form to create a new account.
                </p>
                <CardBody className="pt-1 pb-50">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <RegisterJWT />
                    </TabPane>
                    {/* <TabPane tabId="2">
                        <RegisterFirebase />
                      </TabPane>
                      <TabPane tabId="3">
                        <RegisterAuth0 />
                      </TabPane> */}
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;
