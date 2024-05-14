import React, { useState, useEffect } from "react";
import { Label, Input, FormGroup, Button, Spinner } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import ProductDropFile from "./ProductDropFile";
import { useMutation, useQueryClient } from "react-query";
import useApi from "../../hooks/useApi";
import useSnackbarStatus from "../../hooks/useSnackbarStatus";
import { cacheKeys } from "../../api/CacheKeys";

const DataListSidebar = ({ show, handleSidebar, data }) => {
  const api = useApi({ formData: true });
  const queryClient = useQueryClient();
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
  const [resetFiles, setresetFiles] = useState(false);
  useEffect(() => {
    if (data !== null) {
      setFormData({
        url: data?.url,
        name: data?.name,
        usdzFile: "",
        glbFile: "",
        poster: "",
        model_placement: data?.model_placement,
      });
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

  const { mutate: mutateCreate, isLoading: isLoadingCreate } = useMutation(
    (body) => api.createProduct(body),
    {
      onSuccess: (data) => {
        setresetFiles(false);
        showMessage(data?.message, "success");
        queryClient.invalidateQueries(cacheKeys.products);
        queryClient.invalidateQueries(cacheKeys.dashboard);

        // clear state
        setFormData({
          url: "",
          name: "",
          usdzFile: "",
          glbFile: "",
          poster: "",
          model_placement: "floor",
        });
        setresetFiles(true);
      },
      onError: (error) => {
        console.log(error);
        showMessage(error.message);
      },
    }
  );

  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } = useMutation(
    (body) => api.updateProduct(body),
    {
      onSuccess: (data) => {
        setresetFiles(false);
        showMessage(data?.message, "success");
        queryClient.invalidateQueries(cacheKeys.products);

        // clear State
        setFormData({
          url: data?.product?.url,
          name: data?.product?.name,
          usdzFile: "",
          glbFile: "",
          poster: "",
          model_placement: data?.product?.model_placement,
        });
        setresetFiles(true);
      },
      onError: (error) => {
        console.log(error);
        showMessage(error.message);
      },
    }
  );

  const handleSubmit = () => {
    if (data !== null) {
      const body = {
        ...formData,
        product_id: data?.id,
        url: formData?.url === data?.url ? "" : formData?.url,
      };
      mutateUpdate(body);
    } else {
      setAddNew(true);
      mutateCreate(formData);
    }
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
            resetFiles={resetFiles}
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
            resetFiles={resetFiles}
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
            resetFiles={resetFiles}
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
            onChange={(e) =>
              setFormData({ ...formData, model_placement: e.target.value })
            }
          >
            <option value="floor">Floor</option>
            <option value="wall">Wall</option>
          </Input>
        </FormGroup>
      </PerfectScrollbar>
      <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
        {isLoadingCreate || isLoadingUpdate ? (
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
