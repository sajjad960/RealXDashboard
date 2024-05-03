import React from "react"
import * as Icon from "react-feather"
const navigationConfig = [
  {
    id: "Dashboard",
    title: "Dashboard",
    type: "item",
    icon: <Icon.BarChart2 size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/"
  },
  {
    id: "products",
    title: "Products",
    type: "item",
    icon: <Icon.ShoppingBag size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/products"
  }
]

export default navigationConfig
