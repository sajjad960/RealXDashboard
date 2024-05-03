import React, { Component } from "react";
import {
  Button,
  Progress,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
} from "reactstrap";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import { history } from "../../history";
import {
  Edit,
  Trash,
  ChevronDown,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import { connect } from "react-redux";
import {
  getData,
  getInitialData,
  deleteData,
  updateData,
  addData,
  filterData,
} from "../../redux/actions/data-list/";
import Sidebar from "./DataListSidebar";
import Chip from "../../components/@vuexy/chips/ChipComponent";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";

import "../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../assets/scss/pages/data-list.scss";

const chipColors = {
  "on hold": "warning",
  delivered: "success",
  pending: "primary",
  canceled: "danger",
};

const selectedStyle = {
  rows: {
    selectedHighlighStyle: {
      backgroundColor: "rgba(115,103,240,.05)",
      color: "#7367F0 !important",
      boxShadow: "0 0 1px 0 #7367F0 !important",
      "&:hover": {
        transform: "translateY(0px) !important",
      },
    },
  },
};

const ActionsComponent = (props) => {
  return (
    <div className="data-list-action">
      <Edit
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          return props.currentData(props.row);
        }}
      />
      <Trash
        className="cursor-pointer"
        size={20}
        onClick={() => {
          props.deleteRow(props.row);
        }}
      />
    </div>
  );
};

const CustomHeader = (props) => {
  return (
    <div className="data-list-header d-flex justify-content-between flex-wrap">
      <div className="actions-left d-flex flex-wrap">
        {/* <UncontrolledDropdown className="data-list-dropdown mr-1">
          <DropdownToggle className="p-1" color="primary">
            <span className="align-middle mr-1">Actions</span>
            <ChevronDown size={15} />
          </DropdownToggle>
          <DropdownMenu tag="div" right>
            <DropdownItem tag="a">Delete</DropdownItem>
            <DropdownItem tag="a">Archive</DropdownItem>
            <DropdownItem tag="a">Print</DropdownItem>
            <DropdownItem tag="a">Export</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown> */}
        <Button
          className="add-new-btn"
          color="primary"
          onClick={() => props.handleSidebar(true, true)}
          outline
        >
          <Plus size={15} />
          <span className="align-middle">Add New</span>
        </Button>
      </div>
      <div className="actions-right d-flex flex-wrap mt-sm-0 mt-2">
        <UncontrolledDropdown className="data-list-rows-dropdown mr-1 d-md-block d-none">
          {/* <DropdownToggle color="" className="sort-dropdown">
            <span className="align-middle mx-50">
              {`${props.index[0]} - ${props.index[1]} of ${props.total}`}
            </span>
            <ChevronDown size={15} />
          </DropdownToggle> */}
          <DropdownMenu tag="div" right>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(4)}>
              4
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(10)}>
              10
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(15)}>
              15
            </DropdownItem>
            <DropdownItem tag="a" onClick={() => props.handleRowsPerPage(20)}>
              20
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        <div className="filter-section">
          <Input type="text" placeholder="Search By Product Name" onChange={(e) => props.handleFilter(e)} />
        </div>
      </div>
    </div>
  );
};

class DataListConfig extends Component {
  static getDerivedStateFromProps(props, state) {
    if (
      props.dataList.data.length !== state.data.length ||
      state.currentPage !== props.parsedFilter.page
    ) {
      return {
        data: props.dataList.data,
        allData: props.dataList.filteredData,
        totalPages: props.dataList.totalPages,
        currentPage: parseInt(props.parsedFilter.page) - 1,
        rowsPerPage: parseInt(props.parsedFilter.perPage),
        totalRecords: props.dataList.totalRecords,
        sortIndex: props.dataList.sortIndex,
      };
    }

    // Return null if the state hasn't changed
    return null;
  }

  state = {
    data: [],
    totalPages: 0,
    currentPage: 0,
    columns: [
      {
        name: "Image",
        selector: "img",
        minWidth: "220px",
        cell: (row) => <img src={row.img} height="100" alt={row.name} />,
      },
      {
        name: "Name",
        selector: "name",
        sortable: true,
        minWidth: "300px",
        cell: (row) => (
          <p title={row.name} className="text-truncate text-bold-500 mb-0">
            {row.name}
          </p>
        ),
      },
      {
        name: "Category",
        selector: "category",
        sortable: true,
      },
      {
        name: "Popularity",
        selector: "popularity",
        sortable: true,
        cell: (row) => (
          <Progress
            className="w-100 mb-0"
            color={row.popularity.color}
            value={row.popularity.popValue}
          />
        ),
      },
      {
        name: "Order Status",
        selector: "order_status",
        sortable: true,
        cell: (row) => (
          <Chip
            className="m-0"
            color={chipColors[row.order_status]}
            text={row.order_status}
          />
        ),
      },
      {
        name: "Price",
        selector: "price",
        sortable: true,
        cell: (row) => `$${row.price}`,
      },
      {
        name: "Actions",
        sortable: true,
        cell: (row) => (
          <ActionsComponent
            row={row}
            getData={this.props.getData}
            parsedFilter={this.props.parsedFilter}
            currentData={this.handleCurrentData}
            deleteRow={this.handleDelete}
          />
        ),
      },
    ],
    allData: [],
    value: "",
    rowsPerPage: 4,
    sidebar: false,
    currentData: null,
    selected: [],
    totalRecords: 0,
    sortIndex: [],
    addNew: "",
  };

  thumbView = this.props.thumbView;

  componentDidMount() {
    this.props.getData(this.props.parsedFilter);
    this.props.getInitialData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.thumbView) {
      this.thumbView = false;
      let columns = [
        {
          name: "Image",
          selector: "img",
          minWidth: "220px",
          cell: (row) => <img src={row.img} height="100" alt={row.name} />,
        },
        {
          name: "Name",
          selector: "name",
          sortable: true,
          minWidth: "250px",
          cell: (row) => (
            <p title={row.name} className="text-truncate text-bold-500 mb-0">
              {row.name}
            </p>
          ),
        },
        {
          name: "Category",
          selector: "category",
          sortable: true,
        },
        {
          name: "Popularity",
          selector: "popularity",
          sortable: true,
          cell: (row) => (
            <Progress
              className="w-100 mb-0"
              color={row.popularity.color}
              value={row.popularity.popValue}
            />
          ),
        },
        {
          name: "Order Status",
          selector: "order_status",
          sortable: true,
          cell: (row) => (
            <Chip
              className="m-0"
              color={chipColors[row.order_status]}
              text={row.order_status}
            />
          ),
        },
        {
          name: "Price",
          selector: "price",
          sortable: true,
          cell: (row) => `$${row.price}`,
        },
        {
          name: "Actions",
          sortable: true,
          cell: (row) => (
            <ActionsComponent
              row={row}
              getData={this.props.getData}
              parsedFilter={this.props.parsedFilter}
              currentData={this.handleCurrentData}
              deleteRow={this.handleDelete}
            />
          ),
        },
      ];
      this.setState({ columns });
    }
  }

  handleFilter = (e) => {
    this.setState({ value: e.target.value });
    this.props.filterData(e.target.value);
  };

  handleRowsPerPage = (value) => {
    let { parsedFilter, getData } = this.props;
    let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
    history.push(`/data-list/list-view?page=${page}&perPage=${value}`);
    this.setState({ rowsPerPage: value });
    getData({ page: parsedFilter.page, perPage: value });
  };

  handleSidebar = (boolean, addNew = false) => {
    this.setState({ sidebar: boolean });
    if (addNew === true) this.setState({ currentData: null, addNew: true });
  };

  handleDelete = (row) => {
    this.props.deleteData(row);
    this.props.getData(this.props.parsedFilter);
    if (this.state.data.length - 1 === 0) {
      let urlPrefix = this.props.thumbView
        ? "/data-list/thumb-view/"
        : "/data-list/list-view/";
      history.push(
        `${urlPrefix}list-view?page=${parseInt(
          this.props.parsedFilter.page - 1
        )}&perPage=${this.props.parsedFilter.perPage}`
      );
      this.props.getData({
        page: this.props.parsedFilter.page - 1,
        perPage: this.props.parsedFilter.perPage,
      });
    }
  };

  handleCurrentData = (obj) => {
    this.setState({ currentData: obj });
    this.handleSidebar(true);
  };

  handlePagination = (page) => {
    let { parsedFilter, getData } = this.props;
    let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 4;
    let urlPrefix = this.props.thumbView
      ? "/data-list/thumb-view/"
      : "/data-list/list-view/";
    history.push(
      `${urlPrefix}list-view?page=${page.selected + 1}&perPage=${perPage}`
    );
    getData({ page: page.selected + 1, perPage: perPage });
    this.setState({ currentPage: page.selected });
  };

  render() {
    let {
      columns,
      data,
      allData,
      totalPages,
      value,
      rowsPerPage,
      currentData,
      sidebar,
      totalRecords,
      sortIndex,
    } = this.state;
    return (
      <div
        className={`data-list ${
          this.props.thumbView ? "thumb-view" : "list-view"
        }`}
      >
        <DataTable
          columns={columns}
          data={value.length ? allData : data}
          pagination
          paginationServer
          paginationComponent={() => (
            <ReactPaginate
              previousLabel={<ChevronLeft size={15} />}
              nextLabel={<ChevronRight size={15} />}
              breakLabel="..."
              breakClassName="break-me"
              pageCount={totalPages}
              containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
              activeClassName="active"
              forcePage={
                this.props.parsedFilter.page
                  ? parseInt(this.props.parsedFilter.page - 1)
                  : 0
              }
              onPageChange={(page) => this.handlePagination(page)}
            />
          )}
          noHeader
          subHeader
          // selectableRows
          responsive
          pointerOnHover
          selectableRowsHighlight
          onSelectedRowsChange={(data) =>
            this.setState({ selected: data.selectedRows })
          }
          customStyles={selectedStyle}
          subHeaderComponent={
            <CustomHeader
              handleSidebar={this.handleSidebar}
              handleFilter={this.handleFilter}
              handleRowsPerPage={this.handleRowsPerPage}
              rowsPerPage={rowsPerPage}
              total={totalRecords}
              index={sortIndex}
            />
          }
          sortIcon={<ChevronDown />}
          selectableRowsComponent={Checkbox}
          selectableRowsComponentProps={{
            color: "primary",
            icon: <Check className="vx-icon" size={12} />,
            label: "",
            size: "sm",
          }}
        />
        <Sidebar
          show={sidebar}
          data={currentData}
          updateData={this.props.updateData}
          addData={this.props.addData}
          handleSidebar={this.handleSidebar}
          thumbView={this.props.thumbView}
          getData={this.props.getData}
          dataParams={this.props.parsedFilter}
          addNew={this.state.addNew}
        />
        <div
          className={classnames("data-list-overlay", {
            show: sidebar,
          })}
          onClick={() => this.handleSidebar(false, true)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataList: {
      data: [
        {
          id: 5,
          category: "Fitness",
          price: "199.99",
          popularity: {
            popValue: "87",
            color: "success",
          },
          img: "/static/media/homepod.e3172634.png",
          order_status: "canceled",
          name: "Altec Lansing - Portable Bluetooth Speaker",
        },
        {
          id: 6,
          category: "Computers",
          price: "39.99",
          popularity: {
            popValue: "55",
            color: "warning",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "canceled",
          name: "Altec Lansing - Bluetooth Speaker",
        },
        {
          id: 7,
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "on hold",
          name: "Altec Lansing - Mini H2O Bluetooth Speaker",
          category: "Computers",
          price: "39.99",
          popularity: {
            popValue: "99",
            color: "success",
          },
        },
        {
          id: 8,
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "canceled",
          name: "Altec Lansing - Bluetooth Speaker",
          category: "Fitness",
          price: "39.99",
          popularity: {
            popValue: "91",
            color: "success",
          },
        },
      ],
      params: {
        page: "2",
        perPage: "4",
      },
      allData: [
        {
          id: 1,
          order_status: "on hold",
          name: "Apple Watch series 4 GPS",
          category: "Computers",
          price: "69.99",
          popularity: {
            popValue: "97",
            color: "success",
          },
          img: "/static/media/apple-watch.c51a5f8c.png",
        },
        {
          id: 2,
          popularity: {
            popValue: "83",
            color: "success",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "delivered",
          name: "Beats HeadPhones",
          category: "Computers",
          price: "69.99",
        },
        {
          id: 3,
          price: "199.99",
          popularity: {
            popValue: "57",
            color: "warning",
          },
          img: "/static/media/homepod.e3172634.png",
          order_status: "canceled",
          name: "Altec Lansing - Bluetooth Speaker",
          category: "Audio",
        },
        {
          id: 4,
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "delivered",
          name: "Altec Lansing - Bluetooth Speaker",
          category: "Computers",
          price: "199.99",
          popularity: {
            popValue: "65",
            color: "primary",
          },
        },
        {
          id: 5,
          category: "Fitness",
          price: "199.99",
          popularity: {
            popValue: "87",
            color: "success",
          },
          img: "/static/media/homepod.e3172634.png",
          order_status: "canceled",
          name: "Altec Lansing - Portable Bluetooth Speaker",
        },
        {
          id: 6,
          category: "Computers",
          price: "39.99",
          popularity: {
            popValue: "55",
            color: "warning",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "canceled",
          name: "Altec Lansing - Bluetooth Speaker",
        },
        {
          id: 7,
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "on hold",
          name: "Altec Lansing - Mini H2O Bluetooth Speaker",
          category: "Computers",
          price: "39.99",
          popularity: {
            popValue: "99",
            color: "success",
          },
        },
        {
          id: 8,
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "canceled",
          name: "Altec Lansing - Bluetooth Speaker",
          category: "Fitness",
          price: "39.99",
          popularity: {
            popValue: "91",
            color: "success",
          },
        },
        {
          id: 9,
          order_status: "delivered",
          name: "Altec Lansing - Mini H2O Bluetooth Speaker",
          category: "Fitness",
          price: "39.99",
          popularity: {
            popValue: "52",
            color: "warning",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
        },
        {
          id: 10,
          category: "Computers",
          price: "39.99",
          popularity: {
            popValue: "64",
            color: "primary",
          },
          img: "/static/media/apple-watch.c51a5f8c.png",
          order_status: "canceled",
          name: "Altec Lansing - Mini H2O Bluetooth Speaker",
        },
        {
          id: 11,
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "canceled",
          name: "Altec Lansing - Bluetooth Speaker",
          category: "Fitness",
          price: "99.99",
          popularity: {
            popValue: "93",
            color: "success",
          },
        },
        {
          id: 12,
          popularity: {
            popValue: "75",
            color: "success",
          },
          img: "/static/media/apple-watch.c51a5f8c.png",
          order_status: "pending",
          name: "Altec Lansing - Bluetooth Speaker",
          category: "Fitness",
          price: "99.99",
        },
        {
          id: 13,
          img: "/static/media/apple-watch.c51a5f8c.png",
          order_status: "delivered",
          name: "Altec Lansing - Bluetooth Speaker",
          category: "Audio",
          price: "99.99",
          popularity: {
            popValue: "88",
            color: "success",
          },
        },
        {
          id: 14,
          order_status: "delivered",
          name: "Altec Lansing - Bluetooth Speaker",
          category: "Computers",
          price: "99.99",
          popularity: {
            popValue: "86",
            color: "success",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
        },
        {
          id: 15,
          order_status: "on hold",
          name: "Aluratek - Bluetooth Audio Receiver",
          category: "Computers",
          price: "29.99",
          popularity: {
            popValue: "62",
            color: "primary",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
        },
        {
          id: 16,
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "canceled",
          name: "Aluratek - Bluetooth Audio Transmitter",
          category: "Audio",
          price: "29.99",
          popularity: {
            popValue: "51",
            color: "warning",
          },
        },
        {
          id: 17,
          img: "/static/media/macbook-pro.e723c891.png",
          order_status: "pending",
          name: "Aluratek - iStream Bluetooth Audio Receiver",
          category: "Fitness",
          price: "29.99",
          popularity: {
            popValue: "51",
            color: "warning",
          },
        },
        {
          id: 18,
          order_status: "on hold",
          name: "Antec - Nano Diamond Thermal Compound",
          category: "Fitness",
          price: "14.99",
          popularity: {
            popValue: "65",
            color: "primary",
          },
          img: "/static/media/macbook-pro.e723c891.png",
        },
        {
          id: 19,
          order_status: "on hold",
          name: "Antec - SmartBean Bluetooth Adapter",
          category: "Computers",
          price: "39.99",
          popularity: {
            popValue: "63",
            color: "primary",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
        },
        {
          id: 20,
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "on hold",
          name: "Basis - Peak Fitness and Sleep Tracker",
          category: "Fitness",
          price: "199.99",
          popularity: {
            popValue: "72",
            color: "success",
          },
        },
        {
          id: 21,
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "canceled",
          name: "Basis - Peak Fitness and Sleep Tracker",
          category: "Fitness",
          price: "199.99",
          popularity: {
            popValue: "77",
            color: "success",
          },
        },
        {
          id: 22,
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "delivered",
          name: "Beats by Dr. Dre - 3' USB-to-Micro USB Cable",
          category: "Computers",
          price: "19.99",
          popularity: {
            popValue: "65",
            color: "primary",
          },
        },
        {
          id: 23,
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "delivered",
          name: "Beats by Dr. Dre - Bike Mount for Pill Speakers",
          category: "Audio",
          price: "49.99",
          popularity: {
            popValue: "60",
            color: "primary",
          },
        },
        {
          id: 24,
          price: "49.99",
          popularity: {
            popValue: "59",
            color: "warning",
          },
          img: "/static/media/homepod.e3172634.png",
          order_status: "on hold",
          name: "Beats by Dr. Dre - Support Stand for Speakers",
          category: "Audio",
        },
        {
          id: 25,
          popularity: {
            popValue: "87",
            color: "success",
          },
          img: "/static/media/magic-mouse.3cf7a781.png",
          order_status: "on hold",
          name: "Beats by Dr. Dre - Support Stand for Pill Speakers",
          category: "Computers",
          price: "49.99",
        },
        {
          id: 26,
          img: "/static/media/magic-mouse.3cf7a781.png",
          order_status: "delivered",
          name: "Beats by Dr. Dre - Support Stand for Pill Speakers",
          category: "Fitness",
          price: "49.99",
          popularity: {
            popValue: "95",
            color: "success",
          },
        },
        {
          id: 27,
          img: "/static/media/macbook-pro.e723c891.png",
          order_status: "canceled",
          name: "Beats by Dr. Dre - Support Stand for Speakers",
          category: "Audio",
          price: "49.99",
          popularity: {
            popValue: "98",
            color: "success",
          },
        },
        {
          id: 28,
          category: "Fitness",
          price: "49.99",
          popularity: {
            popValue: "75",
            color: "success",
          },
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "delivered",
          name: "Beats by Dr. Dre - Support Stand",
        },
        {
          id: 29,
          img: "/static/media/homepod.e3172634.png",
          order_status: "pending",
          name: "Beats by Dr. Dre - Pill 2.0 Bluetooth Speaker",
          category: "Audio",
          price: "199.99",
          popularity: {
            popValue: "81",
            color: "success",
          },
        },
        {
          id: 30,
          category: "Computers",
          price: "199.99",
          popularity: {
            popValue: "91",
            color: "success",
          },
          img: "/static/media/macbook-pro.e723c891.png",
          order_status: "canceled",
          name: "Beats by Dr. Dre - Pill 2.0 Bluetooth Speaker",
        },
        {
          id: 31,
          popularity: {
            popValue: "79",
            color: "success",
          },
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "canceled",
          name: "Beats by Dr. Dre - Bluetooth Speaker",
          category: "Fitness",
          price: "199.99",
        },
        {
          id: 32,
          order_status: "on hold",
          name: "Beats by Dr. Dre - Portable Speaker + Headphones",
          category: "Fitness",
          price: "699.99",
          popularity: {
            popValue: "95",
            color: "success",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
        },
        {
          id: 33,
          price: "199.99",
          popularity: {
            popValue: "90",
            color: "success",
          },
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "on hold",
          name: "Beats by Dr. Dre - Pill 2.0 Portable Stereo Speaker",
          category: "Fitness",
        },
        {
          id: 34,
          order_status: "delivered",
          name: "Bose® - SoundLink® III Cover",
          category: "Fitness",
          price: "34.99",
          popularity: {
            popValue: "81",
            color: "success",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
        },
        {
          id: 35,
          img: "/static/media/magic-mouse.3cf7a781.png",
          order_status: "delivered",
          name: "Bose® - Bose® SoundLink® III Cover",
          category: "Computers",
          price: "34.99",
          popularity: {
            popValue: "81",
            color: "success",
          },
        },
        {
          id: 36,
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "on hold",
          name: "Bose® - SoundLink® III Cover",
          category: "Audio",
          price: "34.99",
          popularity: {
            popValue: "69",
            color: "success",
          },
        },
        {
          id: 37,
          category: "Audio",
          price: "24.99",
          popularity: {
            popValue: "95",
            color: "success",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "canceled",
          name: "Bose® - SoundLink® Mini Soft Cover",
        },
        {
          id: 38,
          order_status: "on hold",
          name: "Bose® - SoundLink® Color Bluetooth Speaker",
          category: "Audio",
          price: "129.99",
          popularity: {
            popValue: "100",
            color: "success",
          },
          img: "/static/media/apple-watch.c51a5f8c.png",
        },
        {
          id: 39,
          img: "/static/media/apple-watch.c51a5f8c.png",
          order_status: "pending",
          name: "Bose® - SoundLink® Color Bluetooth Speaker",
          category: "Fitness",
          price: "129.99",
          popularity: {
            popValue: "89",
            color: "success",
          },
        },
        {
          id: 40,
          order_status: "pending",
          name: "Bose® - SoundLink® Color Bluetooth Speaker",
          category: "Computers",
          price: "129.99",
          popularity: {
            popValue: "75",
            color: "success",
          },
          img: "/static/media/magic-mouse.3cf7a781.png",
        },
        {
          id: 41,
          img: "/static/media/homepod.e3172634.png",
          order_status: "pending",
          name: "Bose® - SoundLink® Color Bluetooth Speaker",
          category: "Fitness",
          price: "129.99",
          popularity: {
            popValue: "54",
            color: "warning",
          },
        },
        {
          id: 42,
          popularity: {
            popValue: "98",
          },
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "delivered",
          name: "Bose® - SoundLink® Color Bluetooth Speaker",
          category: "Computers",
          price: "129.99",
        },
        {
          id: 43,
          price: "24.99",
          popularity: {
            popValue: "95",
            color: "success",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "pending",
          name: "Bose® - SoundLink® Color Carry Case",
          category: "Computers",
        },
        {
          id: 44,
          popularity: {
            popValue: "76",
            color: "success",
          },
          img: "/static/media/homepod.e3172634.png",
          order_status: "on hold",
          name: "Bose® - SoundLink® III Cover",
          category: "Fitness",
          price: "34.99",
        },
        {
          id: 45,
          popularity: {
            popValue: "98",
            color: "success",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "canceled",
          name: "Bose® - SoundLink® III Cover",
          category: "Audio",
          price: "34.99",
        },
        {
          id: 46,
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "pending",
          name: "Bose® - SoundLink® III Cover",
          category: "Fitness",
          price: "34.99",
          popularity: {
            popValue: "70",
            color: "success",
          },
        },
        {
          id: 48,
          order_status: "pending",
          name: "Bose® - Mini Bluetooth Speaker II",
          category: "Computers",
          price: "199.99",
          popularity: {
            popValue: "62",
            color: "primary",
          },
          img: "/static/media/magic-mouse.3cf7a781.png",
        },
        {
          id: 49,
          order_status: "canceled",
          name: "Bose® - Bluetooth Speaker II",
          category: "Audio",
          price: "199.99",
          popularity: {
            popValue: "63",
            color: "primary",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
        },
        {
          id: 50,
          category: "Fitness",
          price: "24.99",
          popularity: {
            popValue: "90",
            color: "success",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "on hold",
          name: "Bose® - SoundLink® Mini Bluetooth Speaker Soft Cover",
        },
        {
          id: 51,
          popularity: {
            popValue: "98",
            color: "success",
          },
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "canceled",
          name: "Bose® - Bluetooth Speaker Soft Cover",
          category: "Fitness",
          price: "24.99",
        },
        {
          id: 52,
          order_status: "on hold",
          name: "Bose® - Bluetooth Speaker Soft Cover",
          category: "Computers",
          price: "24.99",
          popularity: {
            popValue: "55",
            color: "warning",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
        },
        {
          id: 53,
          order_status: "pending",
          name: "Bose® - Bluetooth Speaker",
          category: "Audio",
          price: "24.99",
          popularity: {
            popValue: "53",
            color: "warning",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
        },
        {
          id: 54,
          category: "Fitness",
          price: "24.99",
          popularity: {
            popValue: "82",
            color: "success",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "pending",
          name: "Bose® - SoundLink® Mini Bluetooth Speaker Soft Cover",
        },
        {
          id: 55,
          img: "/static/media/magic-mouse.3cf7a781.png",
          order_status: "on hold",
          name: "Bose® - Bluetooth Speaker Travel Bag",
          category: "Computers",
          price: "44.99",
          popularity: {
            popValue: "78",
            color: "success",
          },
        },
        {
          id: 56,
          popularity: {
            popValue: "81",
            color: "success",
          },
          img: "/static/media/magic-mouse.3cf7a781.png",
          order_status: "canceled",
          name: "Bose® - SoundLink® Mini Soft Cover",
          category: "Computers",
          price: "24.99",
        },
        {
          id: 57,
          price: "24.99",
          popularity: {
            popValue: "94",
            color: "success",
          },
          img: "/static/media/macbook-pro.e723c891.png",
          order_status: "pending",
          name: "Bose® - SoundLink® Mini Soft Cover",
          category: "Computers",
        },
        {
          id: 58,
          price: "299.99",
          popularity: {
            popValue: "97",
            color: "success",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "pending",
          name: "Bose® - Bluetooth Speaker III",
          category: "Fitness",
        },
        {
          id: 59,
          popularity: {
            popValue: "89",
            color: "success",
          },
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "delivered",
          name: "Bose® - SoundLink® Soft Cover",
          category: "Computers",
          price: "24.99",
        },
        {
          id: 60,
          price: "99.99",
          popularity: {
            popValue: "53",
            color: "warning",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "on hold",
          name: "Bose® - Bluetooth Music Adapter",
          category: "Computers",
        },
        {
          id: 61,
          order_status: "canceled",
          name: "Bowers & Wilkins - Bluetooth Speaker",
          category: "Computers",
          price: "349.98",
          popularity: {
            popValue: "79",
            color: "success",
          },
          img: "/static/media/jbl-speaker.66807511.png",
        },
        {
          id: 62,
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "on hold",
          name: "BRAVEN - Balance Portable Bluetooth Speaker",
          category: "Fitness",
          price: "129.99",
          popularity: {
            popValue: "82",
            color: "success",
          },
        },
        {
          id: 63,
          category: "Computers",
          price: "129.99",
          popularity: {
            popValue: "80",
            color: "success",
          },
          img: "/static/media/apple-watch.c51a5f8c.png",
          order_status: "pending",
          name: "BRAVEN - Balance Portable Bluetooth Speaker",
        },
        {
          id: 64,
          price: "199.99",
          popularity: {
            popValue: "86",
            color: "success",
          },
          img: "/static/media/homepod.e3172634.png",
          order_status: "pending",
          name: "BRAVEN - Outdoor Speaker",
          category: "Computers",
        },
        {
          id: 65,
          category: "Fitness",
          price: "199.99",
          popularity: {
            popValue: "61",
            color: "primary",
          },
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "pending",
          name: "BRAVEN - BRV-X Outdoor Speaker",
        },
        {
          id: 66,
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "on hold",
          name: "BRAVEN - Portable Bluetooth Speaker",
          category: "Fitness",
          price: "299.99",
          popularity: {
            popValue: "85",
            color: "success",
          },
        },
        {
          id: 67,
          popularity: {
            popValue: "81",
            color: "success",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "on hold",
          name: "BRAVEN - Portable Bluetooth Speaker",
          category: "Fitness",
          price: "99.99",
        },
        {
          id: 68,
          img: "/static/media/apple-watch.c51a5f8c.png",
          order_status: "on hold",
          name: "BRAVEN - Wireless Bluetooth Speaker",
          category: "Audio",
          price: "99.99",
          popularity: {
            popValue: "50",
            color: "warning",
          },
        },
        {
          id: 69,
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "delivered",
          name: "BRAVEN - Wireless Bluetooth Speaker",
          category: "Fitness",
          price: "99.99",
          popularity: {
            popValue: "93",
            color: "success",
          },
        },
        {
          id: 70,
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "pending",
          name: "BRAVEN - Wireless Bluetooth Speaker",
          category: "Fitness",
          price: "99.99",
          popularity: {
            popValue: "51",
            color: "warning",
          },
        },
        {
          id: 71,
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "pending",
          name: "Craig - Tower Speaker",
          category: "Fitness",
          price: "69.99",
          popularity: {
            popValue: "77",
            color: "success",
          },
        },
        {
          id: 72,
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "canceled",
          name: "Craig - Portable Wireless Speaker",
          category: "Computers",
          price: "29.99",
          popularity: {
            popValue: "89",
            color: "success",
          },
        },
        {
          id: 73,
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "pending",
          name: "Definitive Technology - Wireless Speaker",
          category: "Computers",
          price: "399.98",
          popularity: {
            popValue: "81",
            color: "success",
          },
        },
        {
          id: 74,
          price: "699.98",
          popularity: {
            popValue: "76",
            color: "success",
          },
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "pending",
          name: "Definitive Technology - Wireless Speaker",
          category: "Fitness",
        },
        {
          id: 75,
          category: "Fitness",
          price: "399.98",
          popularity: {
            popValue: "88",
            color: "success",
          },
          img: "/static/media/magic-mouse.3cf7a781.png",
          order_status: "pending",
          name: "Denon - Wireless Speaker",
        },
        {
          id: 76,
          popularity: {
            popValue: "100",
            color: "success",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "canceled",
          name: "Denon - HEOS 7 Wireless Speaker",
          category: "Audio",
          price: "599.98",
        },
        {
          id: 77,
          order_status: "canceled",
          name: "ECOXGEAR - Waterproof Bluetooth Speaker",
          category: "Computers",
          price: "129.99",
          popularity: {
            popValue: "52",
            color: "warning",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
        },
        {
          id: 78,
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "pending",
          name: "Fitbit - Charge HR Activity Tracker + Heart Rate (Large)",
          category: "Audio",
          price: "149.99",
          popularity: {
            popValue: "66",
            color: "primary",
          },
        },
        {
          id: 79,
          price: "149.99",
          popularity: {
            popValue: "66",
            color: "primary",
          },
          img: "/static/media/apple-watch.c51a5f8c.png",
          order_status: "delivered",
          name: "Fitbit - Charge HR Activity Tracker + Heart Rate (Large)",
          category: "Audio",
        },
        {
          id: 80,
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "canceled",
          name: "Fitbit - Activity Tracker + Heart Rate (Large)",
          category: "Computers",
          price: "149.99",
          popularity: {
            popValue: "96",
            color: "success",
          },
        },
        {
          id: 81,
          img: "/static/media/apple-watch.c51a5f8c.png",
          order_status: "on hold",
          name: "Fitbit - Charge HR Activity Tracker + Heart Rate (Small)",
          category: "Fitness",
          price: "149.99",
          popularity: {
            popValue: "92",
            color: "success",
          },
        },
        {
          id: 82,
          category: "Computers",
          price: "149.99",
          popularity: {
            popValue: "82",
            color: "success",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "delivered",
          name: "Fitbit - Charge HR Activity Tracker + Heart Rate (Small)",
        },
        {
          id: 83,
          img: "/static/media/apple-watch.c51a5f8c.png",
          order_status: "pending",
          name: "Fitbit - Activity Tracker + Heart Rate (Small)",
          category: "Computers",
          price: "149.99",
          popularity: {
            popValue: "100",
            color: "success",
          },
        },
        {
          id: 84,
          img: "/static/media/apple-watch.c51a5f8c.png",
          order_status: "pending",
          name: "Fitbit - Activity Tracker + Sleep Wristband",
          category: "Fitness",
          price: "149.99",
          popularity: {
            popValue: "100",
            color: "success",
          },
        },
        {
          id: 85,
          popularity: {
            popValue: "52",
            color: "warning",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "pending",
          name: "Fitbit - Activity Tracker (Large)",
          category: "Fitness",
          price: "129.99",
        },
        {
          id: 86,
          popularity: {
            popValue: "51",
            color: "warning",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "on hold",
          name: "Fitbit - Charge Wireless Activity Tracker (Large)",
          category: "Computers",
          price: "129.99",
        },
        {
          id: 87,
          category: "Computers",
          price: "129.99",
          popularity: {
            popValue: "80",
            color: "success",
          },
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "pending",
          name: "Fitbit - Charge Wireless Activity Tracker (Large)",
        },
        {
          id: 88,
          price: "129.99",
          popularity: {
            popValue: "99",
            color: "success",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "on hold",
          name: "Fitbit - Charge Wireless Activity Tracker (Small)",
          category: "Fitness",
        },
        {
          id: 89,
          category: "Computers",
          price: "129.99",
          popularity: {
            popValue: "75",
            color: "success",
          },
          img: "/static/media/macbook-pro.e723c891.png",
          order_status: "on hold",
          name: "Fitbit - Activity Tracker (Small)",
        },
        {
          id: 90,
          order_status: "pending",
          name: "Fitbit - Charge Wireless Activity Tracker (Small)",
          category: "Fitness",
          price: "129.99",
          popularity: {
            popValue: "80",
            color: "success",
          },
          img: "/static/media/macbook-pro.e723c891.png",
        },
        {
          id: 91,
          order_status: "delivered",
          name: "Fitbit - Charging Cable for Activity Trackers",
          category: "Fitness",
          price: "19.99",
          popularity: {
            popValue: "50",
            color: "warning",
          },
          img: "/static/media/macbook-pro.e723c891.png",
        },
        {
          id: 92,
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "delivered",
          name: "Fitbit - Clip for Activity and Sleep Trackers",
          category: "Fitness",
          price: "14.99",
          popularity: {
            popValue: "57",
            color: "warning",
          },
        },
        {
          id: 93,
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "on hold",
          name: "Fitbit - Clip for Wireless Activity and Sleep Trackers",
          category: "Audio",
          price: "14.99",
          popularity: {
            popValue: "80",
            color: "success",
          },
        },
        {
          id: 94,
          order_status: "canceled",
          name: "Fitbit - Clip for Zip Wireless Activity Trackers",
          category: "Audio",
          price: "14.99",
          popularity: {
            popValue: "78",
            color: "success",
          },
          img: "/static/media/jbl-speaker.66807511.png",
        },
        {
          id: 95,
          popularity: {
            popValue: "81",
            color: "success",
          },
          img: "/static/media/iphone-x.ff1daa9e.png",
          order_status: "on hold",
          name: 'Fitbit - Flex 1" USB Charging Cable',
          category: "Fitness",
          price: "14.99",
        },
        {
          id: 96,
          order_status: "canceled",
          name: 'Fitbit - Flex 1" USB Charging Cable',
          category: "Audio",
          price: "14.99",
          popularity: {
            popValue: "51",
            color: "warning",
          },
          img: "/static/media/jbl-speaker.66807511.png",
        },
        {
          id: 97,
          category: "Computers",
          price: "4.99",
          popularity: {
            popValue: "56",
            color: "warning",
          },
          img: "/static/media/jbl-speaker.66807511.png",
          order_status: "canceled",
          name: "Fitbit - Flex Clasp for Activity Trackers",
        },
        {
          id: 98,
          img: "/static/media/macbook-pro.e723c891.png",
          order_status: "on hold",
          name: "Fitbit - Flex Wireless Activity + Sleep Tracker Wristband",
          category: "Computers",
          price: "99.99",
          popularity: {
            popValue: "95",
            color: "success",
          },
        },
        {
          id: 99,
          order_status: "delivered",
          name: "Fitbit - Flex Wireless Activity + Sleep Tracker Wristband",
          category: "Audio",
          price: "99.99",
          popularity: {
            popValue: "85",
            color: "success",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
        },
        {
          id: 100,
          category: "Computers",
          price: "99.99",
          popularity: {
            popValue: "50",
            color: "warning",
          },
          img: "/static/media/ipad-pro.df7d3430.png",
          order_status: "pending",
          name: "Fitbit - Flex Wireless Activity and Sleep Wristband",
        },
      ],
      totalPages: 25,
      filteredData: [],
      totalRecords: 99,
      sortIndex: [5, 8],
    },
  };
};

export default connect(mapStateToProps, {
  getData,
  deleteData,
  updateData,
  addData,
  getInitialData,
  filterData,
})(DataListConfig);
