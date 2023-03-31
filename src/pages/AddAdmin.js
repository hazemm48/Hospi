import React from "react";
import { Link } from "react-router-dom";

class AddAdmin extends React.Component {
  render() {
    return (
      <div className="main-content">
        <div className="container-fluid">
          <div className="section">
            <h5 className="page-title">Add Admin</h5>
          </div>
          <div className="section profile-section">
            <div className="card container">
              <div className="card-body">
                <div className="sub-section col-sm-8 col-md-12 col-lg-8">
                  <div className="sub-section-body">
                    <div className="user-password-form">
                      <form>
                      <div className="form-row">
                        <div className="form-group col-sm-8">
                          <label>Name</label>
                          <input className="form-control" />
                        </div>
                        <div className="form-group col-sm-8">
                          <label>Email</label>
                          <input className="form-control" />
                        </div>
                        <div className="form-group col-sm-8">
                          <label>Password</label>
                          <input className="form-control" type="password" />
                        </div>
                        <div className="form-group col-sm-8">
                          <label>Confirm Password</label>
                          <input className="form-control" type="password" />
                        </div>
                      </div>
                      <button className="btn btn-dark-red-f-gr mt-4">
                        <i className="las la-save" />
                        submit
                      </button>
                      </form>
                    </div>                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddAdmin;
