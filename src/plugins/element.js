import Vue from 'vue'
import {MessageBox, Dialog, Pagination, Switch, Table,TableColumn, Row,Col, Button, Form, FormItem, Input, Message,Container,Header,Aside,Main,Menu,Submenu,MenuItem,MenuItemGroup,Carousel,CarouselItem,Breadcrumb,BreadcrumbItem,Card } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$confirm=MessageBox.confirm
Vue.prototype.$message = Message
