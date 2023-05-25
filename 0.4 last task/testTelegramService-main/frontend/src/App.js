import React from "react";
import {
    Admin,
    Resource,
    CustomRoutes,
    Menu,
    Layout
} from 'react-admin'
import authProvider from "./providers/authProvider";
import {i18nProvider} from "./providers/i18nProvider";
import {Settings} from "@mui/icons-material"
import './App.css';
import {
    Route,
    Routes,
    BrowserRouter
} from "react-router-dom"
import {ContactsList} from "./resources/Contact";
import {ChatList} from "./resources/Chat";
import {Instance} from "./resources/Instance";
import {HomePage} from "./pages/HomePage";
import {LoginPage} from "./pages/LoginPage";
import {Dashboard} from "./resources/Dashboard";
import {RegisterPage} from "./pages/RegisterPage";
import {DataProvider} from "./providers/DataProvider";
import {TelegramUsersList} from "./resources/TelegramUser";
import {MailingResourceList} from "./resources/Mailing";
import {ByKeyResourceList} from "./resources/Key";


const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem/>
        <Menu.Item to='instance' primaryText='Instance' leftIcon={<Settings/>}/>
        <Menu.ResourceItem name='contacts' />
        <Menu.ResourceItem name='chats' />
        <Menu.ResourceItem name='telegram_users' />
        <Menu.ResourceItem name='keyword' />
        <Menu.ResourceItem name='mailing' />
    </Menu>
)


const MyLayout = props => <Layout {...props} menu={MyMenu} />


const AdminPanel = () => (
    <Admin
        dashboard={Dashboard}
        dataProvider={DataProvider}
        authProvider={authProvider}
        i18nProvider={i18nProvider}
        basename='/account'
        loginPage={<LoginPage/>}
        layout={MyLayout}
    >
        <Resource name='contacts' list={ContactsList}/>
        <Resource name='chats' list={ChatList}/>
        <Resource name='telegram_users' list={TelegramUsersList}/>
        <Resource name='keyword' list={<ByKeyResourceList/>} />
        <Resource name='mailing' list={<MailingResourceList/>}/>
        <CustomRoutes>
            <Route path='instance' element={<Instance/>} />
        </CustomRoutes>
    </Admin>
)


function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path='/home' element={<HomePage/>} />
              <Route path='/account/*' element={<AdminPanel/>} />
              <Route path='/register/*' element={<RegisterPage/>} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
