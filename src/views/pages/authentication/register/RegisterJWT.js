import React, { useState } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy";
import { Check, Eye, EyeOff } from "react-feather";
import { history } from "../../../../history";
import { useMutation } from "react-query";
import useApi from "../../../../hooks/useApi";
import useSnackbarStatus from "../../../../hooks/useSnackbarStatus";

const RegisterJWT = () => {
  const api = useApi({ formData: false });
  const showMessage = useSnackbarStatus();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    termsAccepted: false,
    passwordVisible: false,
    confirmPasswordVisible: false,
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    termsAccepted: false,
  });

  const handleChange = (e) => {
    e.persist();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const togglePasswordVisibility = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: !prevData[fieldName],
    }));
  };

  const validateField = (name, value) => {
    let errorMessage = "";
    switch (name) {
      case "email":
        errorMessage = !value ? "Email is required" : true;
        break;
      case "password":
        errorMessage = !value ? "Password is required" : true;
        break;
      case "confirmPassword":
        errorMessage =
          formData.password !== value ? "Passwords do not match" : true;
        break;
      case "name":
        errorMessage = !value ? "Name is required" : true;
        break;
      case "termsAccepted":
        errorMessage = formData.termsAccepted
          ? "Please accept the terms & conditions"
          : true;
        break;
      default:
        break;
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const { mutate } = useMutation((body) => api.register(body), {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
      showMessage(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      ...formData,
      termsAccepted: undefined,
      passwordVisible: undefined,
      confirmPasswordVisible: undefined,
    };
    mutate(body)
  };

  const isFormValid = () => {
    const { email, password, confirmPassword, name, termsAccepted } =
      formErrors;
    if (
      email === true &&
      password === true &&
      confirmPassword === true &&
      name === true &&
      termsAccepted === true
    ) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup className="form-label-group">
        <Input
          type="text"
          name="name"
          placeholder="Name*"
          value={formData.name}
          onChange={handleChange}
          onBlur={() => validateField("name", formData.name)}
        />
        <Label>Name</Label>
        {formErrors.name && (
          <span className="text-danger">{formErrors.name}</span>
        )}
      </FormGroup>
      <FormGroup className="form-label-group">
        <Input
          type="email"
          name="email"
          placeholder="Email*"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => validateField("email", formData.email)}
        />
        <Label>Email</Label>
        {formErrors.email && (
          <span className="text-danger">{formErrors.email}</span>
        )}
      </FormGroup>
      <FormGroup className="form-label-group">
        <Input
          type={formData.passwordVisible ? "text" : "password"}
          name="password"
          placeholder="Password*"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => validateField("password", formData.password)}
        />
        <Label>Password</Label>
        <Button
          className="password-toggle-btn"
          onClick={() => togglePasswordVisibility("passwordVisible")}
          style={{
            position: "absolute",
            top: formErrors.password ? "35%" : "45%",
            right: "10px",
            transform: "translateY(-50%)",
            padding: "4px",
          }}
        >
          {formData.passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}{" "}
          {/* Adjust the size as needed */}
        </Button>
        {formErrors.password && (
          <span className="text-danger">{formErrors.password}</span>
        )}
      </FormGroup>
      <FormGroup className="form-label-group">
        <Input
          type={formData.confirmPasswordVisible ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password*"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={() =>
            validateField("confirmPassword", formData.confirmPassword)
          }
        />
        <Label>Confirm Password</Label>
        <Button
          className="password-toggle-btn"
          onClick={() => togglePasswordVisibility("confirmPasswordVisible")}
          style={{
            position: "absolute",
            top: formErrors.confirmPassword ? "36%" : "45%",
            right: "10px",
            transform: "translateY(-50%)",
            padding: "4px",
          }}
        >
          {formData.confirmPasswordVisible ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </Button>
        {formErrors.confirmPassword && (
          <span className="text-danger">{formErrors.confirmPassword}</span>
        )}
      </FormGroup>
      <FormGroup>
        <Checkbox
          color="primary"
          icon={<Check className="vx-icon" size={16} />}
          label=" I accept the terms & conditions."
          defaultChecked={formData.termsAccepted}
          onChange={(e) => {
            e.persist();
            const isChecked = e.target.checked;
            setFormData((prevData) => ({
              ...prevData,
              termsAccepted: isChecked,
            }));
            validateField("termsAccepted", isChecked);
          }}
        />
        {formErrors.termsAccepted && (
          <span className="text-danger">{formErrors.termsAccepted}</span>
        )}
      </FormGroup>
      <div className="d-flex justify-content-between">
        <Button.Ripple
          color="primary"
          outline
          onClick={() => {
            history.push("/login");
          }}
        >
          Login
        </Button.Ripple>
        <Button.Ripple color="primary" type="submit" disabled={isFormValid()}>
          Register
        </Button.Ripple>
      </div>
    </Form>
  );
};

export default RegisterJWT;
