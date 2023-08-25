import { Box } from "@mui/material";
import React, { useState } from "react";
import { getElementHeight, getElementWidth } from "../utils/ScreenManager";
import CustomGameListScroller from "../components/CustomGameListScroller";

const gameList = [
  { thumbnail: "assets/1.jpg", name: "One" },
  { thumbnail: "assets/2.jpg", name: "Two" },
  { thumbnail: "assets/3.jpg", name: "Three" },
  { thumbnail: "assets/4.jpg", name: "Four" },
  { thumbnail: "assets/5.jpg", name: "Five" },
  { thumbnail: "assets/6.jpg", name: "Six" },
  { thumbnail: "assets/7.jpg", name: "Seven" },
  { thumbnail: "assets/8.jpg", name: "Eight" },
  { thumbnail: "assets/9.jpg", name: "Nine" },
  { thumbnail: "assets/10.jpg", name: "Ten" },
  { thumbnail: "assets/11.jpg", name: "Eleven" },
  { thumbnail: "assets/12.jpg", name: "Twelve" },
];

const Home = () => {
  const [selectedGameItem, setSelectedGameItem] = useState(1);

  const gameListIconClickFn = (index) => {
    setSelectedGameItem(index);
  };

  let gameListContent = null;

  const createList = () => {
    let _gameList = [];
    gameList.forEach((element, index) => {
      _gameList.push({
        ...gameList[index],
        index: index + 1,
      });
    });

    let mutatedGameList = []; //ADDING A NEW INDEX PROPERTY

    _gameList.forEach((element, index) => {
      mutatedGameList.push({
        ..._gameList[index],
        posIndex: index + 1,
      });
    });

    let positionManagerObjArray = [];

    _gameList.forEach((element, index) => {
      positionManagerObjArray.push({ posX: 0, midPos: 0, id: index + 1 });
    });

    gameListContent = (
      <CustomGameListScroller
        gameList={mutatedGameList}
        gameListIconClickFn={gameListIconClickFn}
        positionMangerObj={positionManagerObjArray}
        selectedGameItem={selectedGameItem}
      />
    );
  };

  createList();

  return (
    <>
      <Box
        sx={{
          height: getElementHeight(612),
          backgroundColor: "green",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "50px",
        }}
      >
        {gameList[selectedGameItem].name}
      </Box>
      <Box
        sx={{
          height: getElementHeight(200),

          position: "relative",
          overflowX: "hidden",
        }}
      >
        {gameListContent}
      </Box>
    </>
  );
};

export default Home;
