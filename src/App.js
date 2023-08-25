import { Backdrop, CircularProgress } from "@mui/material";
import Home from "./pages/Home";
import { screenSizeData } from "./utils/ScreenManager";
import { useWindowSize } from "./hooks/useWindowSize";

const App = () => {
  [screenSizeData.currentScreenWidth, screenSizeData.currentScreenHeight] = useWindowSize();

  let pageContent = (
    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );

  if (screenSizeData.currentScreenWidth > 0) {
    pageContent = <Home />;
  }

  return <>{pageContent}</>;
};

export default App;
