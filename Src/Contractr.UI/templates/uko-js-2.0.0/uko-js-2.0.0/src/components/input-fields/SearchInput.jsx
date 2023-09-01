import { InputBase, styled } from "@mui/material";
import SearchIcon from "icons/SearchIcon";
// styled component
const StyledInputBase = styled(InputBase)(({ theme, disable_border }) => ({
  height: 45,
  fontSize: 12,
  width: "100%",
  maxWidth: 350,
  fontWeight: 600,
  padding: "0 1rem",
  borderRadius: "8px",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  border: disable_border
    ? "none"
    : `1px solid ${theme.palette.action.disabled}`,
  [theme.breakpoints.down(500)]: {
    maxWidth: "100%",
  },
  "::placeholder": {
    color: theme.palette.text.disabled,
  },
})); // ------------------------------------------------------------

// ------------------------------------------------------------
const SearchInput = (props) => {
  const { icon_style = {}, disable_border = false } = props;
  return (
    <StyledInputBase
      disable_border={disable_border ? 1 : 0}
      startAdornment={
        <SearchIcon
          sx={{
            fontSize: 18,
            marginRight: 1,
            color: "text.disabled",
            ...icon_style,
          }}
        />
      }
      {...props}
    />
  );
};

export default SearchInput;
