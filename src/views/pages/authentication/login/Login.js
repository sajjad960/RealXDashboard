import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";
import { Mail, Lock } from "react-feather";
import { useMutation } from "react-query";
import { useHistory, Redirect } from "react-router-dom";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import loginImg from "../../../../assets/img/pages/login.png";
import "../../../../assets/scss/pages/authentication.scss";
import useApi from "../../../../hooks/useApi";
import useSnackbarStatus from "../../../../hooks/useSnackbarStatus";
import useRedirectIfTokenExists from "../../../../hooks/useRedirectIfTokenExists";
import useProfile from "../../../../hooks/useProfile";
import useAuthToken from "../../../../hooks/auth/useAuthToken"

const Login = () => {
  useRedirectIfTokenExists();
  const api = useApi({ formData: false });
  const { setProfile } = useProfile();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const showMessage = useSnackbarStatus();
  const {setAuthToken} = useAuthToken();


  const { mutate, isLoading } = useMutation((body) => api.login(body), {
    onSuccess: (data) => {
      console.log(data);
      setAuthToken(data?.token);
      setProfile(data);
      history.push("/");
    },
    onError: (error) => {
      console.log(error);
      showMessage(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      email: email,
      password: password,
    };
    mutate(body);
  };

  return (
    <Row className="m-0 justify-content-center">
      <Col
        sm="8"
        xl="7"
        lg="10"
        md="8"
        className="d-flex justify-content-center"
      >
        <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
          <Row className="m-0">
            <Col
              lg="6"
              className="d-lg-block d-none text-center align-self-center px-1 py-0"
            >
              <img src={loginImg} alt="loginImg" />
            </Col>
            <Col lg="6" md="12" className="p-0">
              <Card className="rounded-0 mb-0 px-2">
                <CardBody>
                  <h4>Login</h4>
                  <p>Welcome back, please login to your account.</p>
                  <form onSubmit={handleSubmit}>
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <div className="form-control-position">
                        <Mail size={15} />
                      </div>
                      <Label>Email</Label>
                    </FormGroup>
                    <FormGroup className="form-label-group position-relative has-icon-left">
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="form-control-position">
                        <Lock size={15} />
                      </div>
                      <Label>Password</Label>
                    </FormGroup>
                    <FormGroup className="d-flex justify-content-between align-items-center">
                      <div className="float-right">Forgot Password?</div>
                    </FormGroup>
                    <div className="d-flex justify-content-between">
                      <Button.Ripple
                        color="primary"
                        outline
                        onClick={() => history.push("/register")}
                      >
                        Register
                      </Button.Ripple>
                      {isLoading ? (
                        <Spinner color="primary" />
                      ) : (
                        <Button.Ripple color="primary" type="submit">
                          Login
                        </Button.Ripple>
                      )}
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
