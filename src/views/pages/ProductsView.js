import React from "react"
import { Row, Col } from "reactstrap"
import ThumbViewConfig from "../data-list/DataListConfig"
class ProductsView extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row>
          <Col sm="12">
            <ThumbViewConfig/>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default ProductsView
