import React, { useState, useEffect } from "react";
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
import Sidebar from "./DataListSidebar";
import Chip from "../../components/@vuexy/chips/ChipComponent";
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import { useQuery } from "react-query";
import { cacheKeys } from "../../api/CacheKeys";
import useApi from "../../hooks/useApi";
import useSnackbarStatus from "../../hooks/useSnackbarStatus";


import "../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../assets/scss/pages/data-list.scss";

const chipColors = {
  1: "success",
  0: "danger",
};
const statusName = {
  1: "active",
  0: "inactive"
}

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
        <div className="filter-section">
          <Input
            type="text"
            placeholder="Search By Product Name"
            onChange={(e) => props.handleFilter(e)}
          />
        </div>
      </div>
    </div>
  );
};

const DataListConfig = () => {
  const api = useApi({ formData: false });
  const showMessage = useSnackbarStatus();
  // const [data, setData] = useState([{
  //   id: 1,
  //   order_status: "on hold",
  //   name: "Apple Watch series 4 GPS",
  //   category: "Computers",
  //   price: "69.99",
  //   popularity: { popValue: "97", color: "success" },
  //   img: require("../../assets/img/elements/apple-watch.png")
  // },
  // {
  //   id: 2,
  //   popularity: { popValue: "83", color: "success" },
  //   img: require("../../assets/img/elements/iphone-x.png"),
  //   order_status: "delivered",
  //   name: "Beats HeadPhones",
  //   category: "Computers",
  //   price: "69.99"
  // },
  // {
  //   id: 3,
  //   price: "199.99",
  //   popularity: { popValue: "57", color: "warning" },
  //   img: require("../../assets/img/elements/homepod.png"),
  //   order_status: "canceled",
  //   name: "Altec Lansing - Bluetooth Speaker",
  //   category: "Audio"
  // },]);
  const [allData, setAllData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [value, setValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [sidebar, setSidebar] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [thumbView, setthumbView] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortIndex, setSortIndex] = useState([]);
  const [addNew, setAddNew] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [cacheKeys.products],
    queryFn: () => api.getProducts(),
    onError: (error) => {
      showMessage(error?.message);
    },
  });
console.log("product data", data);

  let columns = [
    {
      name: "Image",
      selector: "img",
      minWidth: "220px",
      cell: (row) => <img src={JSON.parse(row?.poster)?.posterFileLink} height="100" alt={row?.name ?? ""} />,
    },
    {
      name: "Name",
      selector: "name",
      sortable: true,
      minWidth: "250px",
      cell: (row) => (
        <p title={row?.name} className="text-truncate text-bold-500 mb-0">
          {row?.name}
        </p>
      ),
    },
    {
      name: "Url",
      selector: "url",
      sortable: true,
      cell: (row) => `${row?.url}`,
    },
    // {
    //   name: "Popularity",
    //   selector: "popularity",
    //   sortable: true,
    //   cell: (row) => (
    //     <Progress
    //       className="w-100 mb-0"
    //       color={row.popularity.color}
    //       value={row.popularity.popValue}
    //     />
    //   ),
    // },
    {
      name: "Status",
      selector: "status",
      sortable: true,
      cell: (row) => (
        <Chip
          className="m-0"
          color={chipColors[row?.status]}
          text={statusName[row?.status]}
        />
      ),
    },
    {
      name: "Views",
      selector: "product_views",
      sortable: true,
      cell: (row) => `${row?.product_log_details?.product_views ?? 0}`,
    },
    {
      name: "Actions",
      sortable: true,
      cell: (row) => (
        <ActionsComponent
          row={row}
          // getData={this.props.getData}
          // parsedFilter={this.props.parsedFilter}
          currentData={handleCurrentData}
          deleteRow={handleDelete}
        />
      ),
    },
  ];

  // Simulate Redux data
  const dataList = {
    data: [],
    params: {
      page: "2",
      perPage: "4",
    },
    allData: [],
    totalPages: 25,
    filteredData: [],
    totalRecords: 99,
    sortIndex: [5, 8],
  };

  // useEffect to simulate componentDidMount
  // useEffect(() => {
  //   // Simulate Redux actions
  //   setData(dataList.data);
  //   setAllData(dataList.allData);
  //   setTotalPages(dataList.totalPages);
  //   setCurrentPage(parseInt(dataList.params.page) - 1);
  //   setRowsPerPage(parseInt(dataList.params.perPage));
  //   setTotalRecords(dataList.totalRecords);
  //   setSortIndex(dataList.sortIndex);
  // }, [
  //   dataList.allData,
  //   dataList.data,
  //   dataList.params.page,
  //   dataList.params.perPage,
  //   dataList.sortIndex,
  //   dataList.totalPages,
  //   dataList.totalRecords,
  // ]);

  // useEffect to simulate componentDidUpdate
  // useEffect(() => {
  //   if (thumbView) {
  //     // Thumb view specific operations
  //     setColumns([
  //       {
  //         name: "Image",
  //         selector: "img",
  //         minWidth: "220px",
  //         cell: (row) => <img src={row.img} height="100" alt={row.name} />,
  //       },
  //       // Other column definitions...
  //     ]);
  //   }
  // }, [thumbView]);

  const handleFilter = (e) => {
    // setValue(e.target.value);
    // filterData(e.target.value);
  };

  const handleRowsPerPage = (value) => {
    // let page = parsedFilter.page !== undefined ? parsedFilter.page : 1;
    // history.push(`/data-list/list-view?page=${page}&perPage=${value}`);
    // setRowsPerPage(value);
    // getData({ page: parsedFilter.page, perPage: value });
  };

  const handleSidebar = (boolean, addNew = false) => {
    setSidebar(boolean);
    if (addNew === true) setCurrentData(null);
  };

  const handleDelete = (row) => {
    // deleteData(row);
    // getData(parsedFilter);
    // if (data.length - 1 === 0) {
    //   let urlPrefix = thumbView
    //     ? "/data-list/thumb-view/"
    //     : "/data-list/list-view/";
    //   history.push(
    //     `${urlPrefix}list-view?page=${parseInt(parsedFilter.page - 1)}&perPage=${parsedFilter.perPage}`
    //   );
    //   getData({
    //     page: parsedFilter.page - 1,
    //     perPage: parsedFilter.perPage,
    //   });
    // }
  };

  const handleCurrentData = (obj) => {
    setCurrentData(obj);
    handleSidebar(true);
  };

  const handlePagination = (page) => {
    // let perPage = parsedFilter.perPage !== undefined ? parsedFilter.perPage : 4;
    // history.push(`products?page=${page.selected + 1}&perPage=${perPage}`);
    // getData({ page: page.selected + 1, perPage: perPage });
    // setCurrentPage(page.selected);
  };

  return (
    <div className={`data-list ${thumbView ? "thumb-view" : "list-view"}`}>
      {/* DataTable component with required props */}
      <DataTable
        columns={columns}
        data={value.length ? allData : data?.data}
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
            // forcePage={
            //   props.parsedFilter.page
            //     ? parseInt(props.parsedFilter.page - 1)
            //     : 0
            // }
            onPageChange={(page) => handlePagination(page)}
          />
        )}
        noHeader
        subHeader
        // selectableRows
        responsive
        pointerOnHover
        selectableRowsHighlight
        // onSelectedRowsChange={(data) =>
        //   this.setState({ selected: data.selectedRows })
        // }
        customStyles={selectedStyle}
        subHeaderComponent={
          <CustomHeader
            handleSidebar={handleSidebar}
            handleFilter={handleFilter}
            handleRowsPerPage={handleRowsPerPage}
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
          // updateData={this.props.updateData}
          // addData={this.props.addData}
          handleSidebar={handleSidebar}
          thumbView={thumbView}
          // getData={this.props.getData}
          // dataParams={this.props.parsedFilter}
          addNew={addNew}
        />
        <div
          className={classnames("data-list-overlay", {
            show: sidebar,
          })}
          onClick={() => handleSidebar(false, true)}
        />
    </div>
  );
};

export default DataListConfig;
