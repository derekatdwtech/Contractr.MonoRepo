import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { config } from "../../config";
import { useFetch } from "../../hooks/useFetch";
import Input from "../../components/input";

const SignUpModal = ({ isShowing, toggle, onCreateCallback }) => {
  const [formData, setFormData] = useState({ });
  const { post } = useFetch();
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      zIndex: "10000",
      maxWidth: "600px",
    },
  };
  const onInputChange = (e) => {
    console.log(`${e.target.name}: ${e.target.value}`);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    console.log(formData);
  };

  const onSubmit = () => {

    post(`${config.API_URL}/Organization`, formData, true)
      .then((res) => {
        if (res.status === 204) {
          return res.json();
        }
        else {
            throw new Error("Failed to create organization");
        }
      })
      .then((data) => {
        console.log(data);
        onCreateCallback();
        toggle();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Modal
      isOpen={isShowing}
      onRequestClose={toggle}
      contentLabel="Create a new deal"
      style={customStyles}
    >
      <div className="bgc-white p-20 bd">
        <h6 className="c-grey-900">Create an Organization</h6>
        <div className="mT-30">
          <form>
            <Row>
              <Column size="lg-12">
                <h5>Welcome to Contractr!</h5>
                <p>
                  It appears you're new here. To begin using all the awesome
                  features, you'll need to setup an organization. This is
                  simple, just input the name of your organization below. Later on, you will be able to invite other users to your organziation!
                </p>
              </Column>
            </Row>
            <Row>
              <Column size={"md-12"}>
                <label className="form-label" htmlFor="name">
                  Organization Name*
                </label>
                <Input
                  name="name"
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </Column>
            </Row>
          </form>
        </div>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-primary text-white"
          onClick={() => onSubmit()}
          style={{ margin: "10px 0px 10px 10px" }}
        >
          Create
        </button>
      </div>
    </Modal>
  );
};

export default SignUpModal;
