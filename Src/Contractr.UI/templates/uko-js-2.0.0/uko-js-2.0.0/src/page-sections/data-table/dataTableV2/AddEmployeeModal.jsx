import { Button, Grid, styled } from "@mui/material";
import AppModal from "components/AppModal";
import FlexBox from "components/flexbox/FlexBox";
import AppTextField from "components/input-fields/AppTextField";
import ImageUploadInput from "components/input-fields/ImageUploadInput";
import Scrollbar from "components/ScrollBar";
import { H2, H6 } from "components/Typography";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import axiosInstance from "utils/axios";
import * as Yup from "yup"; // component props interface

// styled components
const StyledAppModal = styled(AppModal)(({ theme }) => ({
  maxWidth: 450,
  minWidth: 200,
  [theme.breakpoints.down(325)]: {
    maxWidth: "100%",
  },
}));

const AddEmployeeModal = ({ open, onClose, edit, data }) => {
  const initialValues = {
    name: data?.name || "",
    username: data?.username || "",
    email: data?.email || "",
    avatar: data?.avatar || "",
    position: data?.role || "",
    experience: data?.experience || 1,
    team: data?.team || 1,
    phone: data?.phone || "",
    dateOfBirth: data?.dateOfBirth || "",
    address: data?.address || "",
    status: data?.status || "",
  };
  const fieldValidationSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short").required("Name is Required!"),
    username: Yup.string()
      .min(3, "Too Short")
      .required("Username is Required!"),
    email: Yup.string().required("Email is Required!"),
    // avatar: Yup.string().required("Avatar is Required!"),
    position: Yup.string().required("Position is Required!"),
    phone: Yup.string().required("Phone is Required!"),
    address: Yup.string().required("Address is Required!"),
    dateOfBirth: Yup.string().required("Date Of Birth is Required!"),
    experience: Yup.number().required("Experience is Required!"),
    team: Yup.number().required("Team Member is Required!"),
    status: Yup.string().required("Status is Required!"),
  });
  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema: fieldValidationSchema,
    onSubmit: (values) => {
      axiosInstance
        .post("/api/tableData2/new", {
          name: values.name,
          username: values.username,
          email: values.email,
          position: values.position,
          experience: values.experience,
          team: values.team,
          phone: values.phone,
          dateOfBirth: values.dateOfBirth,
          address: values.address,
          status: values.status,
        })
        .then(() => {
          onClose();
          toast.success("New Data Added Successfully");
        })
        .catch((error) => console.log(error));
    },
  });
  return (
    <StyledAppModal open={open} handleClose={onClose}>
      <H2 mb={2}>{edit ? "Edit Employee" : "Add new Employee"}</H2>

      <form onSubmit={handleSubmit}>
        <Scrollbar
          style={{
            maxHeight: 400,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <H6 mb={1}>Name</H6>
              <AppTextField
                fullWidth
                size="small"
                name="name"
                placeholder="Name"
                value={values.name}
                onChange={handleChange}
                helperText={touched.name && errors.name}
                error={Boolean(errors.name && touched.name)}
              />
            </Grid>

            <Grid item xs={6}>
              <H6 mb={1}>Username</H6>
              <AppTextField
                fullWidth
                size="small"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                value={values.username}
                helperText={touched.username && errors.username}
                error={Boolean(errors.username && touched.username)}
              />
            </Grid>

            <Grid item xs={6}>
              <H6 mb={1}>Email</H6>
              <AppTextField
                fullWidth
                size="small"
                name="email"
                placeholder="uilib@gmail.com"
                onChange={handleChange}
                value={values.email}
                helperText={touched.email && errors.email}
                error={Boolean(errors.email && touched.email)}
              />
            </Grid>

            <Grid item xs={6}>
              <H6 mb={1}>Date of Birth</H6>
              <AppTextField
                fullWidth
                size="small"
                name="dateOfBirth"
                placeholder="yyyy/mm/day"
                onChange={handleChange}
                value={values.dateOfBirth}
                helperText={touched.dateOfBirth && errors.dateOfBirth}
                error={Boolean(errors.dateOfBirth && touched.dateOfBirth)}
              />
            </Grid>

            <Grid item xs={6}>
              <H6 mb={1}>Phone</H6>
              <AppTextField
                fullWidth
                size="small"
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                value={values.phone}
                helperText={touched.phone && errors.phone}
                error={Boolean(errors.phone && touched.phone)}
              />
            </Grid>

            <Grid item xs={6}>
              <H6 mb={1}>Address</H6>
              <AppTextField
                fullWidth
                size="small"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                value={values.address}
                helperText={touched.address && errors.address}
                error={Boolean(errors.address && touched.address)}
              />
            </Grid>

            <Grid item xs={6}>
              <H6 mb={1}>Position</H6>
              <AppTextField
                fullWidth
                size="small"
                name="position"
                placeholder="developer"
                onChange={handleChange}
                value={values.position}
                helperText={touched.position && errors.position}
                error={Boolean(errors.position && touched.position)}
              />
            </Grid>

            <Grid item xs={6}>
              <H6 mb={1}>Experience</H6>
              <AppTextField
                fullWidth
                size="small"
                name="experience"
                type="number"
                placeholder="Experience"
                onChange={handleChange}
                value={values.experience}
                helperText={touched.experience && errors.experience}
                error={Boolean(errors.experience && touched.experience)}
              />
            </Grid>

            <Grid item xs={6}>
              <H6 mb={1}>Team</H6>
              <AppTextField
                fullWidth
                size="small"
                name="team"
                type="number"
                placeholder="Team Member"
                value={values.team}
                onChange={handleChange}
                helperText={touched.team && errors.team}
                error={Boolean(errors.team && touched.team)}
              />
            </Grid>

            <Grid item xs={6}>
              <H6 mb={1}>Status</H6>
              <AppTextField
                fullWidth
                size="small"
                name="status"
                placeholder="Full Time"
                value={values.status}
                onChange={handleChange}
                helperText={touched.status && errors.status}
                error={Boolean(errors.status && touched.status)}
              />
            </Grid>

            <Grid item xs={12}>
              <H6 mb={1}>Add Picture</H6>

              <ImageUploadInput handleOnChange={() => {}} />
            </Grid>
          </Grid>
        </Scrollbar>

        <FlexBox justifyContent="flex-end" gap={2} marginTop={4}>
          <Button fullWidth size="small" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth size="small" type="submit" variant="contained">
            Save
          </Button>
        </FlexBox>
      </form>
    </StyledAppModal>
  );
};

export default AddEmployeeModal;
