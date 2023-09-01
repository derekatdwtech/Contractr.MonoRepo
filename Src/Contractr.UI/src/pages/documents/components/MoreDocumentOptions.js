import { Menu, MenuItem } from "@mui/material";
import DownloadIcon from "../../../icons/DownloadIcon";
import DeleteIcon from "../../../icons/DeleteIcon";
import { Small } from "../../../components/Typography"; // component props interface
import { useFetch } from "../../../hooks/useFetch";
import { config } from "../../../config";

const MoreDocumentOptions = ({ anchorEl, handleMoreClose, pages, parent_document }) => {
  const { get } = useFetch();
  const downloadSignatureDocuments = () => {
    get(`${config.API_URL}/Document/${parent_document}/signature_pages/download`, null, true)
    .then((res) => res.blob())
    .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${parent_document}_signature_pages.zip`);
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
    })
    handleMoreClose();
  };
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMoreClose}
    >
      <MenuItem
        onClick={() => downloadSignatureDocuments()}
        sx={{
          "&:hover": {
            color: "primary.main",
          },
        }}
        disabled={pages.length == 0}
      >
        <DownloadIcon
          sx={{
            fontSize: 14,
            marginRight: 1,
          }}
        />
        <Small fontWeight={500}>Download Signature Pages</Small>
      </MenuItem>

      <MenuItem
        onClick={handleMoreClose}
        sx={{
          "&:hover": {
            color: "primary.main",
          },
        }}
      >
        <DownloadIcon
          sx={{
            fontSize: 14,
            marginRight: 1,
          }}
        />
        <Small fontWeight={500}>Download Original Document</Small>
      </MenuItem>

      <MenuItem
        onClick={handleMoreClose}
        sx={{
          "&:hover": {
            color: "primary.main",
          },
        }}
      >
        <DeleteIcon
          sx={{
            fontSize: 14,
            marginRight: 1,
          }}
        />
        <Small fontWeight={500}>Delete</Small>
      </MenuItem>
    </Menu>
  );
};

export default MoreDocumentOptions;
