/**
=========================================================
* Contractr - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";

// Contractr components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftSelect from "components/SoftSelect";
import SoftDatePicker from "components/SoftDatePicker";
import SoftEditor from "components/SoftEditor";
import SoftDropzone from "components/SoftDropzone";
import SoftButton from "components/SoftButton";

// Contractr example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function NewDeal() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [editorValue, setEditorValue] = useState(
    ""
  );

  const handleSetStartDate = (newDate) => setStartDate(newDate);
  const handleSetEndDate = (newDate) => setEndDate(newDate);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={3} mb={4}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={9}>
            <Card sx={{ overflow: "visible" }}>
              <SoftBox p={2} lineHeight={1}>
                <SoftTypography variant="h6" fontWeight="medium">
                  New Deal
                </SoftTypography>
                <SoftTypography variant="button" fontWeight="regular" color="text">
                  Create a new deal
                </SoftTypography>
                <Divider />
                <SoftBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                >
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      Deal Name
                    </SoftTypography>
                  </SoftBox>
                  <SoftInput placeholder="Contractr" name="unique_name" />
                </SoftBox>
                <SoftBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                >
                  <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      Deal Description
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox mb={1.5} ml={0.5} mt={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="regular"
                      color="text"
                    >
                      Provide a brief description of the deal so Partners and Associates understand
                      some basic information.
                    </SoftTypography>
                  </SoftBox>
                  <SoftEditor value={editorValue} onChange={setEditorValue} name="description" />
                </SoftBox>

                <SoftBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                >
                  <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      Lead Partner
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                  name=""
                    defaultValue={[
                      { value: "John Smith", label: "John Smith" },
                      { value: "Jane Dawn", label: "Jane Dawn" },
                    ]}
                    options={[
                      { value: "Brian Baxter", label: "Brian Baxter" },
                      { value: "Mike Moore", label: "Mike Moore" },
                      { value: "Jessica Jones", label: "Partner 3" },
                      { value: "Partner 4", label: "Partner 4" },
                      { value: "Associate one", label: "Associate One", isDisabled: true },
                      { value: "Associate two", label: "Tabel Two" },
                      { value: "Associate three", label: "Associate Three" },
                    ]}
                    
                  />
                </SoftBox>

                <SoftBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="100%"
                >
                  <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      Assigned Associates
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    defaultValue={[
                      { value: "John Smith", label: "John Smith" },
                      { value: "Jane Dawn", label: "Jane Dawn" },
                    ]}
                    options={[
                      { value: "Brian Baxter", label: "Brian Baxter" },
                      { value: "Mike Moore", label: "Mike Moore" },
                      { value: "Jessica Jones", label: "Partner 3" },
                      { value: "Partner 4", label: "Partner 4" },
                      { value: "Associate one", label: "Associate One", isDisabled: true },
                      { value: "Associate two", label: "Tabel Two" },
                      { value: "Associate three", label: "Associate Three" },
                    ]}
                    isMulti
                    
                  />
                </SoftBox>

                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <SoftBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      height="100%"
                    >
                      <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Start Date
                        </SoftTypography>
                      </SoftBox>
                      <SoftDatePicker value={startDate} onChange={handleSetStartDate} name="start_date"/>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={6}>
                    <SoftBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      height="100%"
                    >
                      <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                          Projected Close Date
                        </SoftTypography>
                      </SoftBox>
                      <SoftDatePicker value={endDate} onChange={handleSetEndDate} name="end_date"/>
                    </SoftBox>
                  </Grid>
                </Grid>
                <SoftBox display="flex" justifyContent="flex-end" mt={3}>
                  <SoftBox mr={1}>
                    <SoftButton color="light">cancel</SoftButton>
                  </SoftBox>
                  <SoftButton variant="gradient" color="info">
                    create Deal
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NewDeal;
