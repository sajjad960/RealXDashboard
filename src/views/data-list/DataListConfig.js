import React, { useState, useMemo, useEffect } from "react";
import { Button, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import { history } from "../../history";
import { useLocation } from "react-router-dom";
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
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { cacheKeys } from "../../api/CacheKeys";
import useApi from "../../hooks/useApi";
import useSnackbarStatus from "../../hooks/useSnackbarStatus";
import { FormGroup } from "reactstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Spinner from "../../components/@vuexy/spinner/Loading-spinner";
import AwesomeDebouncePromise from "awesome-debounce-promise";

import "../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../assets/scss/pages/data-list.scss";

const chipColors = {
  1: "success",
  0: "danger",
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
  const { name } = props.filterValues;
  const debouncedHandleFilter = AwesomeDebouncePromise(props.handleFilter, 500);
  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    debouncedHandleFilter(name, value);
  };

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
            name="name"
            // value={name}
            placeholder="Search By Product Name"
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

const StatusDropdown = ({ row, updateStatus }) => {
  const [status, setStatus] = useState(row.status);

  const handleChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    updateStatus(row.id, newStatus);
  };

  return (
    <FormGroup>
      <Input
        type="select"
        value={status}
        onChange={handleChange}
        style={{
          backgroundColor:
            chipColors[status] === "success" ? "rgb(143 217 112)" : "#F8D7DA",
          cursor: "pointer",
          fontWeight: "500",
          textAlign: "center",
          marginTop: "1.5rem",
          width: "100",
          padding: "6px",
        }}
      >
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </Input>
    </FormGroup>
  );
};

const ImageWithLoading = ({ src, alt }) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoaded = () => {
    setLoading(false); // Set loading to false when the image is loaded
  };

  return (
    <div style={{ position: "relative" }}>
      {loading && src && <div>Loading...</div>}
      <img
        src={src}
        alt={alt}
        height="100"
        onLoad={handleImageLoaded} // Call handleImageLoaded when the image is loaded
        style={{ display: loading ? "none" : "block" }} // Hide the image while loading
      />
    </div>
  );
};

const DataListConfig = () => {
  const api = useApi({ formData: false });
  const location = useLocation();

  const queryClient = useQueryClient();
  const showMessage = useSnackbarStatus();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [sidebar, setSidebar] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [copyDetails, setcopyDetails] = useState({
    copied: false,
    rowId: "",
  });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialFilters = {};
    queryParams.forEach((value, key) => {
      initialFilters[key] = value;
    });
    console.log("iam callijng", initialFilters);
    setFilters(initialFilters);
  }, [location.search]);

  const handlePages = (data) => {
    const totalProducts = data?.total;
    const perPage = 10;
    const calculatedPages = Math.ceil(totalProducts / perPage);
    setTotalPages(calculatedPages);
  };

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: [cacheKeys.products],
    queryFn: () => api.getProducts(filters),
    onSuccess: (data) => {
      console.log("pdata", data);
      handlePages(data);
    },
    onError: (error) => {
      showMessage(error?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, [filters, refetch]);
  console.log(isLoading, "isloading");
  const { mutate: mutateUpdate } = useMutation(
    (body) => api.updateProduct(body),
    {
      onSuccess: (data) => {
        if (Number(data?.product?.status) === 4) {
          showMessage("Product has beed deleted", "error");
        } else {
          showMessage(data?.message, "success");
        }
        queryClient.setQueryData([cacheKeys.products], (prevData) => {
          let updatedData;
          // For removing deleted product depends on status
          if (Number(data?.product?.status) === 4) {
            updatedData = prevData?.data?.filter(
              (item) => item?.id !== data?.product?.id
            );
          } else {
            // For updating status on product.
            updatedData = prevData?.data?.map((item) => {
              if (item?.id === data?.product?.id) {
                return { ...item, status: Number(data?.product?.status) };
              }
              return item;
            });
          }
          return {
            ...prevData,
            data: updatedData,
          };
        });
        queryClient.invalidateQueries(cacheKeys.dashboard);
      },
      onError: (error) => {
        console.log(error);
        showMessage(error.message);
      },
    }
  );

  const memoizedData = useMemo(() => {
    // Expensive computation here
    return data;
  }, [data]);

  let columns = [
    {
      name: "Image",
      selector: "img",
      minWidth: "220px",
      cell: (row) => (
        <ImageWithLoading
          src={JSON.parse(row?.poster)?.posterFileLink}
          alt={row?.name ?? ""}
        />
      ),
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
    {
      name: "Usdz",
      selector: "usdz",
      sortable: true,
      cell: (row) => {
        if (JSON.parse(row?.models)?.[0].usdzFile?.usdzFileLink) {
          return "Available";
        } else {
          return "Null";
        }
      },
    },
    {
      name: "Glb",
      selector: "glb",
      sortable: true,
      cell: (row) => {
        if (JSON.parse(row?.models)?.[0].glbFile?.glbFileLink) {
          return "Available";
        } else {
          return "Null";
        }
      },
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
      cell: (row) => <StatusDropdown row={row} updateStatus={updateStatus} />,
    },
    {
      name: "Views",
      selector: "product_views",
      sortable: true,
      cell: (row) => `${row?.product_log_details?.product_views ?? 0}`,
    },
    {
      name: "Links",
      selector: "link",
      cell: (row) => {
        const genaratedLink = `https://mysellbee.com/view/ar/user_id=${row?.user_id}/url=${row?.url}`;
        return (
          <div>
            <CopyToClipboard
              text={genaratedLink}
              onCopy={() =>
                setcopyDetails({
                  ...copyDetails,
                  copied: true,
                  rowId: row?.id,
                })
              }
            >
              {copyDetails?.copied && copyDetails?.rowId === row?.id ? (
                <button
                  style={{
                    backgroundColor: "#000000d6",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  Copied
                </button>
              ) : (
                <button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "9px",
                    borderRadius: "5px",
                  }}
                >
                  Copy
                </button>
              )}
            </CopyToClipboard>
          </div>
        );
      },
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

  const handleFilter = async (name, value) => {
    let updatedFilters = {};
    if (value.trim() !== "") {
      updatedFilters = {
        ...filters,
        [name]: value,
        page: 1,
      };
    }
    const queryString = new URLSearchParams(updatedFilters).toString();
    history.push({ search: queryString });

    setCurrentPage(0);
    setFilters(updatedFilters);
  };

  const handleSidebar = (boolean, addNew = false) => {
    setSidebar(boolean);
    // if (addNew === true) setCurrentData(null);
  };

  const handleDelete = (row) => {
    const body = {
      status: 4,
      product_id: row?.id,
      url: "",
    };
    mutateUpdate(body);
  };

  const handleCurrentData = (obj) => {
    setCurrentData(obj);
    handleSidebar(true);
  };

  const handlePagination = (page) => {
    setCurrentPage(page.selected);
    const updatedFilterWithPage = {
      ...filters,
      page: page?.selected + 1 ?? 1,
    };

    console.log("updated page filter", updatedFilterWithPage);
    const queryString = new URLSearchParams(updatedFilterWithPage).toString();
    history.push({ search: queryString });

    setFilters(updatedFilterWithPage);
  };

  const updateStatus = (id, status) => {
    const body = {
      status: Number(status),
      product_id: id,
      url: "",
    };
    mutateUpdate(body);
  };

  return (
    <div className={`data-list list-view}`}>
      {/* DataTable component with required props */}
      {isLoading || isFetching ? (
        <div className="mt-lg-5">
          <Spinner />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={memoizedData?.data ?? []}
          pagination
          paginationServer
          paginationComponent={() => (
            <ReactPaginate
              previousLabel={<ChevronLeft size={15} />}
              nextLabel={<ChevronRight size={15} />}
              breakLabel="..."
              breakClassName="break-me"
              pageCount={totalPages}
              containerClassName="vx-pagination separated-pagination pagination-center pagination-sm mb-0 mt-2"
              activeClassName="active"
              forcePage={currentPage}
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
              filterValues={filters}
              // handleRowsPerPage={handleRowsPerPage}
              // rowsPerPage={rowsPerPage}
              // total={totalRecords}
              // index={sortIndex}
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
      )}

      <Sidebar
        show={sidebar}
        data={currentData}
        // updateData={this.props.updateData}
        // addData={this.props.addData}
        handleSidebar={handleSidebar}
        // thumbView={thumbView}
        // getData={this.props.getData}
        // dataParams={this.props.parsedFilter}
        // addNew={addNew}
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
