// Importing CSS styles
import logo from './logo.svg';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css'
import './CSS/style.css'

// Importing React components
import LoginForm from './Components/LoginForm'
import NavBar from './Components/NavBar';
import HomepageHeader from './Components/HomepageHeader';
import RegisterForm from './Components/RegisterForm'
import CredentialsForm from './Components/CredentialsForm';
import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import HomepageContent from './Components/HomepageContent';
import AddDivForm from './Components/AddDivForm'
import AddOrgUnitForm from './Components/AddOrgUnitForm';
import UpdateForm from './Components/UpdateForm';
import AdminDashboard from './Components/AdminDashboard';
import AddAdminDivForm from './Components/AdminContent/AddAdminDivForm'


// Main App component function
function App() {
  // State variables using the useState hook
  const [token, setToken] = useState('');
  const [loginForm, setLoginForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    orgUnits: [],
    divisions: []
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [homepageData, setHomepageData] = useState({
    credentialsID: null,
    roleName: ''
  });

  const [credData, setCredData] = useState({
    token: '',
    collectionName: '',
    repoID: null, 
    credentialsID: null
  });

  const [updateData, setUpdateData] = useState({
    token: '',
    collectionName: '',
    oldUnitID: null,
    newUnitID: null,
    credentialsID: null
  });

  const [usernames, setUsernames] = useState([]);

  const [managementUser, setManagementUser] = useState(false);

  const [selectOPT, setSelectOPT] = useState("");

  // JSX structure for the main component
  return (
    <div>
      {/* Navigation bar component */}
      <NavBar
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        homepageData={homepageData}
        managementUser={managementUser}
        setManagementUser={setManagementUser}
      />

      {/* Routing configuration using React Router */}
      <Routes>
        {/* Homepage route */}
        <Route exact path='/' element={
          <div className='homepage-body'>
            {/* Homepage header component */}
            <HomepageHeader formData={formData} setFormData={setFormData} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            {/* Display homepage content if logged in */}
            { loggedIn ? <HomepageContent homepageData={homepageData} setHomepageData={setHomepageData} setUpdateData={setUpdateData} usernames={usernames} setUsernames={setUsernames} selectOPT={selectOPT} setSelectOPT={setSelectOPT}/> : null  }
          </div>
        } />
        {/* Login route */}
        <Route exact path='/login' element={<LoginForm loggedIn={loggedIn} setLoggedIn={setLoggedIn} formData={formData} setFormData={setFormData} homepageData={homepageData} setHomepageData={setHomepageData} token={token} setToken={setToken}/>} />
        {/* Register route */}
        <Route exact path='/register' element={<RegisterForm formData={formData} setFormData={setFormData} />} />
        {/* Credentials route */}
        <Route exact path='/credentials' element={<CredentialsForm formData={formData} setFormData={setFormData} />} />
        {/* Add Division form route */}
        <Route exact path='/add-division' element={<AddDivForm credData={credData} setCredData={setCredData} homepageData={homepageData} token={token}/>}/>
        {/* Add Organization Unit form route */}
        <Route exact path='/add-orgunit' element={<AddOrgUnitForm credData={credData} setCredData={setCredData} homepageData={homepageData} token={token}/>}/>
        {/* Update form route */}
        <Route exact path='/update-form' element={<UpdateForm updateData={updateData} setUpdateData={setUpdateData} homepageData={homepageData} token={token} selectOPT={selectOPT} setSelectOPT={setSelectOPT}/>}/>
        {/* Admin Dashboard route */}
        <Route exact path='/admin-dashboard' element={<AdminDashboard usernames={usernames} token={token} setUsernames={setUsernames} managementUser={managementUser} setManagementUser={setManagementUser} selectOPT={selectOPT} setSelectOPT={setSelectOPT}/> }/>
        {/* Add Division Admin form route */}
        <Route exact path='/add-divisionAdmin' element={<AddAdminDivForm />}/>
      </Routes>
    </div>
  );


}
// Exporting the App component as the default export
export default App;
