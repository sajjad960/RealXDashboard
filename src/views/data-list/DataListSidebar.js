import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import ProductDropFile from "./ProductDropFile";

class DataListSidebar extends Component {
  state = {
    sku: "",
    name: "",
    usdzFile: "",
    glbFile: "",
    poster: "",
    model_placement: "",
  };

  addNew = false;
  updateFile = (type, newValue) => {
    this.setState({ [type]: newValue });
    console.log(this.state);
  };
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.sku !== prevState.sku) {
        this.setState({ sku: this.props.data.sku });
      }
      if (this.props.data.name !== prevState.name) {
        this.setState({ name: this.props.data.name });
      }
      if (this.props.data.category !== prevState.category) {
        this.setState({ category: this.props.data.category });
      }
      if (this.props.data.popularity.popValue !== prevState.popularity) {
        this.setState({
          popularity: {
            ...this.state.popularity,
            popValue: this.props.data.popularity.popValue,
          },
        });
      }
      if (this.props.data.order_status !== prevState.order_status) {
        this.setState({ order_status: this.props.data.order_status });
      }
      if (this.props.data.price !== prevState.price) {
        this.setState({ price: this.props.data.price });
      }
      if (this.props.data.img !== prevState.img) {
        this.setState({ img: this.props.data.img });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        sku: "",
        name: "",
        category: "Audio",
        order_status: "pending",
        price: "",
        img: "",
        popularity: {
          popValue: "",
        },
      });
    }
    if (this.addNew) {
      this.setState({
        sku: "",
        name: "",
        category: "Audio",
        order_status: "pending",
        price: "",
        img: "",
        popularity: {
          popValue: "",
        },
      });
    }
    this.addNew = false;
  }

  handleSubmit = (obj) => {
    if (this.props.data !== null) {
      this.props.updateData(obj);
    } else {
      this.addNew = true;
      this.props.addData(obj);
    }
    let params = Object.keys(this.props.dataParams).length
      ? this.props.dataParams
      : { page: 1, perPage: 4 };
    this.props.handleSidebar(false, true);
    this.props.getData(params);
  };

  render() {
    let { show, handleSidebar, data } = this.props;
    let { sku, name, model_placement } = this.state;
    return (
      <div
        className={classnames("data-list-sidebar", {
          show: show,
        })}
      >
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
              placeholder="Product Name"
              onChange={(e) => this.setState({ name: e.target.value })}
              id="data-name"
            />
            <Label
              for="data-name"
              style={{ fontSize: "1rem" }}
              className="text-bold-500"
            >
              SKU
            </Label>
            <Input
              type="text"
              value={sku}
              placeholder="Product SKU"
              onChange={(e) => this.setState({ sku: e.target.value })}
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
              updateStateFile={this.updateFile}
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
              updateStateFile={this.updateFile}
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
              updateStateFile={this.updateFile}
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
              sku
              value={model_placement}
              onChange={(e) =>
                this.setState({ model_placement: e.target.value })
              }
            >
              <option value="floor">Floor</option>
              <option value="wall">Wall</option>
            </Input>
          </FormGroup>
        </PerfectScrollbar>
        <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
          <Button color="primary" onClick={() => this.handleSubmit(this.state)}>
            {data !== null ? "Update" : "Submit"}
          </Button>
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
  }
}
export default DataListSidebar;
