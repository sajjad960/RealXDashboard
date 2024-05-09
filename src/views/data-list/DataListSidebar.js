import React, { useState, useEffect } from "react";
import { Label, Input, FormGroup, Button, Spinner } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import ProductDropFile from "./ProductDropFile";
import { useMutation } from "react-query";
import useApi from "../../hooks/useApi";
import useSnackbarStatus from "../../hooks/useSnackbarStatus";

const DataListSidebar = ({
  show,
  handleSidebar,
  data,
  updateData,
  addData,
  dataParams,
  getData,
}) => {
  const api = useApi({ formData: true });
  const showMessage = useSnackbarStatus();
  const [formData, setFormData] = useState({
    url: "",
    name: "",
    usdzFile: "",
    glbFile: "",
    poster: "",
    model_placement: "",
  });
  const [addNew, setAddNew] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  useEffect(() => {
    if (data !== null) {
      setFormData(data);
    } else {
      setFormData({
        url: "",
        name: "",
        usdzFile: "",
        glbFile: "",
        poster: "",
        model_placement: "floor",
      });
    }
    setAddNew(false);
  }, [data]);

  const updateFile = (type, newValue) => {
    setFormData({ ...formData, [type]: newValue });
  };
console.log(formData);
  const { mutate, isLoading: isLoadingCreate } = useMutation(
    (body) => api.createProduct(body),
    {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
        showMessage(error.message);
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const progress = (loaded / total) * 100;
        console.log({progress});
        // setUploadProgress(progress); // Update upload progress state
      },
    },
    
  );

  const handleSubmit = () => {
    // if (data !== null) {
    //   updateData(formData);
    // } else {
    //   setAddNew(true);
    //   addData(formData);
    // }
    // const params = Object.keys(dataParams).length
    //   ? dataParams
    //   : { page: 1, perPage: 4 };
    // handleSidebar(false, true);
    // getData(params);
    console.log("old formdat", formData);
    mutate(formData);
  };

  const { url, name, model_placement } = formData;

  return (
    <div className={classnames("data-list-sidebar", { show: show })}>
      <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
        <h4>{data !== null ? "UPDATE PRODUCT" : "ADD NEW PRODUCT"}</h4>
        <X size={20} onClick={() => handleSidebar(false, true)} />
      </div>
      <PerfectScrollbar
        className="data-list-fields px-2 mt-3"
        options={{ wheelPropagation: false }}
      >
        <FormGroup>
          <Label
            for="data-name"
            style={{ fontSize: "1rem" }}
            className="text-bold-500"
          >
            Name
          </Label>
          <Input
            type="text"
            value={name}
            required
            placeholder="Product Name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            id="data-name"
          />
          <Label
            for="data-name"
            style={{ fontSize: "1rem" }}
            className="text-bold-500"
          >
            URL
          </Label>
          <Input
            type="text"
            value={url}
            required
            placeholder="Product Url"
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            id="data-name"
          />
        </FormGroup>
        <FormGroup>
          <Label
            for="Poster"
            style={{ fontSize: "1rem" }}
            className="text-bold-500"
          >
            Poster
          </Label>
          <ProductDropFile
            updateStateFile={updateFile}
            dropFileType={"poster"}
          />
        </FormGroup>
        <FormGroup>
          <Label
            for="glb-model"
            style={{ fontSize: "1rem" }}
            className="text-bold-500"
          >
            GLB Model
          </Label>
          <ProductDropFile
            updateStateFile={updateFile}
            dropFileType={"glbFile"}
          />
        </FormGroup>
        <FormGroup>
          <Label
            for="usdz-model"
            style={{ fontSize: "1rem" }}
            className="text-bold-500"
          >
            USDZ Model
          </Label>
          <ProductDropFile
            updateStateFile={updateFile}
            dropFileType={"usdzFile"}
          />
        </FormGroup>
        <FormGroup>
          <Label
            for="model-placement"
            style={{ fontSize: "1rem" }}
            className="text-bold-500"
          >
            Model Placement
          </Label>
          <Input
            type="select"
            id="model-placement"
            value={model_placement}
            onChange={(e) => setFormData({ model_placement: e.target.value })}
          >
            <option value="floor">Floor</option>
            <option value="wall">Wall</option>
          </Input>
        </FormGroup>
      </PerfectScrollbar>
      <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
        {isLoadingCreate ? (
          <Spinner color="primary" />
        ) : (
          <Button color="primary" onClick={handleSubmit}>
            {data !== null ? "Update" : "Submit"}
          </Button>
        )}

        <Button
          className="ml-1"
          color="danger"
          outline
          onClick={() => handleSidebar(false, true)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DataListSidebar;
