import { useContext } from "react";
import { SettingsContext } from "../context/settingsContext";

const useSettings = () => useContext(SettingsContext);

export default useSettings;
