import React, { useContext, useEffect } from "react";
import Icon from "../../../components/icons";
import TableHead from "../../../components/table/components/TableHead";
import TableBody from "../../../components/table/components/TableBody";
import TableRow from "../../../components/table/components/TableRow";
import TableColumn from "../../../components/table/components/TableColumn";
import { config } from "../../../config";
import { OrganizationContext } from "../../../context/OrganizationContext";
import { useFetch } from "../../../helpers/useFetch";

const PendingDealsTable = (props) => {
  const headers = [
    "Name",
    "Description",
    "Start Date",
    "Projected Close",
    "View",
  ];
  const { deals, setDeals } = props;
  const { organization } = useContext(OrganizationContext);
  const { get } = useFetch();

  useEffect(() => {
    get(`${config.API_URL}/deal?organization=${organization.id}`, null, true)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        return [];
      })
      .then((data) => {
        if (data.length > 0) {
          setDeals(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [organization.id]);

  return (
    <table className="table">
      <TableHead headers={headers} />
      <TableBody>
        {deals &&
          deals.map((d, i) => (
            <TableRow key={i}>
              <TableColumn>{d.unique_name}</TableColumn>
              <TableColumn>{d.description}</TableColumn>
              <TableColumn>
                {new Date(d.start_date).toLocaleDateString()}
              </TableColumn>
              <TableColumn>
                {new Date(d.close_date).toLocaleDateString()}
              </TableColumn>
              <TableColumn>
                <a href={`/deals/${d.id}`} className="btn btn-primary">
                  <Icon variant="view-list-alt" color="white" />&nbsp;&nbsp;View
                </a>
              </TableColumn>
            </TableRow>
          ))}
      </TableBody>
    </table>
  );
};

export default PendingDealsTable;
