import React, { useContext } from "react";
import { useState } from "react";
import Modal from "react-modal";
import Column from "../layout/Column";
import Row from "../layout/Row";
import { config } from "../../config";
import { useFetch } from "../../hooks/useFetch";
import Input from "../input";
import DatePicker from "../input/datepicker";
import Select from "../input/select";
import { OrganizationContext } from "../../context/OrganizationContext";

const NewTaskModal = ({ isShowing, toggle, onCreateCallBack }) => {
  const { post } = useFetch();
  const { organization } = useContext(OrganizationContext);
  const [formData, setFormData] = useState({
    start_date: new Date(Date.now()).toLocaleDateString(),
    close_date: new Date(Date.now()).toLocaleDateString(),
    buyor: "",
    seller: "",
  });
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const onInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = () => {
    formData.organization = organization.id;
    formData.start_date = new Date(formData.start_date).toISOString();
    formData.close_date = new Date(formData.close_date).toISOString();

    post(`${config.API_URL}/deal`, formData, true)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        onCreateCallBack(data);
      })
      .catch((err) => console.log(err));
  };
  
  return (
    <Modal
      isOpen={isShowing}
      onRequestClose={toggle}
      contentLabel="Create a new task"
      style={customStyles}
    >
      <div className="bgc-white p-20 bd">
        <h6 className="c-grey-900">Create new task</h6>
        <div className="mT-30">
          <form>
            <Row>
              <Column size={"md-12"}>
                <label className="form-label" htmlFor="title">
                  Title
                </label>
                <Input
                  name="title"
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </Column>
              <Column size="md-12">
                <label className="form-label" htmlFor="description">
                  Description
                </label>
                <Input
                  name="description"
                  onChange={(e) => onInputChange(e)}
                  required
                  type="multiline"
                />
              </Column>
            </Row>
            <Row>
              <Column size="md-6">
                <label className="form-label fw-500">Start Date*</label>
                <DatePicker
                  name="start_date"
                  selectedValue={formData["start_date"]}
                  onChange={(e) => onInputChange(e)}
                />
              </Column>
              <Column size="md-6">
                <label className="form-label fw-500">Projected End Date</label>
                <DatePicker
                  name="close_date"
                  selectedValue={formData["close_date"]}
                  onChange={(e) => onInputChange(e)}
                />
              </Column>
            </Row>
            <Row>
              <Column size="md-12">
                <label className="form-label" htmlFor="inputState">
                  Assign To
                </label>

                <Select name="associate"></Select>
              </Column>
            </Row>
          </form>
        </div>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary m-10"
          data-bs-dismiss="modal"
          aria-label="close"
          onClick={toggle}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary text-white"
          onClick={onSubmit}
        >
          Save changes
        </button>
      </div>
    </Modal>
  );
};

export default NewTaskModal;
