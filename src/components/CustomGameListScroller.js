import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { getElementHeight, getElementWidth, screenSizeData } from "../utils/ScreenManager";

const CustomGameListScroller = ({ gameList, gameListIconClickFn, positionMangerObj, selectedGameItem }) => {
  //#region APIS & HOOKS

  //console.log(selectedGameItem);

  const screenData = useRef({});
  const selectedItemRef = useRef(selectedGameItem);
  const gameLoopRef = useRef();

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      cancelAnimationFrame(gameLoopRef.current);
    }

    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [shouldAnimate]);

  useEffect(() => {
    const scrollBox = document.getElementById("scrollBox");

    scrollBox.addEventListener("mousedown", (event) => {
      pointerDown(event);
    });
    scrollBox.addEventListener("mousemove", (event) => {
      pointerMove(event);
    });
    scrollBox.addEventListener("mouseup", (event) => {
      pointerUp(event);
    });
    scrollBox.addEventListener("mouseleave", (event) => {});
    // touch events
    scrollBox.addEventListener("touchstart", (event) => {
      pointerDown(event);
    });
    scrollBox.addEventListener("touchmove", (event) => {
      pointerMove(event);
    });
    scrollBox.addEventListener("touchend", (event) => {
      pointerUp(event);
    });

    setInitData();

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(gameLoopRef.current);
  }, []);

  // useEffect(() => {
  //   if (!screenData.current.isPointerDown) {
  //     snapAllGameListItems();
  //   }
  // }, [manualRenderCount]);

  const pointerStartPos = useRef(0);
  const pointerDown = (event) => {
    pointerStartPos.current = event.x;
    screenData.current.isPointerDown = true;
  };

  const pointerUp = (event) => {
    screenData.current.isPointerDown = false;
  };

  const pointerMove = (event) => {
    if (screenData.current.isPointerDown) {
      screenData.current.moveState = true;
      if (!shouldAnimate) {
        setShouldAnimate(true);
      }
      screenData.current.swipeDiff = event.changedTouches[0].pageX - pointerStartPos.current;
      pointerStartPos.current = event.changedTouches[0].pageX;
    }
  };
  //#endregion

  //#region REQUEST ANIMATION FRAME

  const gameLoop = () => {
    if (screenData.current.moveState) {
      if (screenData.current.isPointerDown) {
        if (screenData.current.swipeDiff) {
          updatePosition(screenData.current.swipeDiff, true);
        }
      } else {
        snapAllGameListItems();
      }

      gameListHolderRef.current.forEach((element, index) => {
        let xPos = positionManagerRef.current.find((o) => o.posIndex === index + 1)?.posX;
        element.style.left = `${xPos}px`;
      });

      screenData.current.swipeDiff = 0;

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    //console.log("Here");
  };

  //#endregion

  //#region SCROLL POSITION HANDLING

  const positionManagerRef = useRef(positionMangerObj);

  const setInitData = () => {
    var _offSet = (screenSizeData.currentScreenWidth * 28) / 100;

    console.log(screenSizeData.currentScreenWidth);

    var currentPosArray = [...positionManagerRef.current];
    currentPosArray.forEach((element, index) => {
      element.posX = index * _offSet;
      element.midPos = element.posX + _offSet * 0.5;
      element.posIndex = index + 1;
    });

    positionManagerRef.current = [...currentPosArray];

    gameListHolderRef.current.forEach((gameListItem, index) => {
      //let currentLeft = Number(gameListItem.style.left.replace("px", "") || 0);

      gameListItem.style.left = `${positionManagerRef.current[index].posX}px`;
      //console.log(positionManagerRef.current[index].posX);
    });

    let _selectedRegionIndex = 1;
    let _autoModeSpeed = 7;

    screenData.current = {
      width: screenSizeData.currentScreenWidth,
      offset: _offSet,
      leftBoundary: -_offSet,
      rightBoundary: 4 * _offSet,
      selectedRegion: _offSet * (_selectedRegionIndex + 0.5),
      isPointerDown: false,
      moveState: false,
      swipeDiff: 0,
      autoMoveSpeed: _autoModeSpeed,
    };

    setSelectedGameItem(positionManagerRef.current[1]?.posIndex - 1 ?? null);
  };

  const updatePosition = (dx, check) => {
    if (dx) {
      var currentPosArray = [...positionManagerRef.current];

      let boundaryCrossingItemArray = [];
      //MOVING LEFT SIDE
      if (dx < 0) {
        currentPosArray.forEach((element) => {
          if (element.posX < screenData.current.leftBoundary) {
            boundaryCrossingItemArray.push(element.posIndex);
          }
        });
        //MOVING RIGHT SIDE
      } else {
        currentPosArray.forEach((element) => {
          if (element.posX > screenData.current.rightBoundary) {
            boundaryCrossingItemArray.unshift(element.posIndex);
          }
        });
      }

      if (boundaryCrossingItemArray.length > 0) {
        if (dx < 0) {
          resetLeftMostItem(currentPosArray, boundaryCrossingItemArray, dx);
        } else {
          resetRightMostItems(currentPosArray, boundaryCrossingItemArray, dx);
        }
      } else {
        currentPosArray.forEach((element) => {
          element.posX += dx;
          element.midPos = element.posX + screenData.current.offset * 0.5;
        });

        positionManagerRef.current = [...currentPosArray];
      }

      if (check) {
        setSelectedGameItem();
      }
    }
  };

  const resetLeftMostItem = (posArray, posIndexArray, dx) => {
    let boundaryCrossingItems = [];

    posIndexArray.forEach((element, index) => {
      boundaryCrossingItems.push(posArray.splice(posArray.indexOf(posArray.find((o) => o.posIndex === element)), 1)[0]);
    });

    boundaryCrossingItems.forEach((element) => {
      posArray.push(element);
    });

    for (let i = 0; i < posArray.length; i++) {
      if (i === 0) {
        posArray[i].posX += dx;
      } else {
        posArray[i].posX = posArray[i - 1].posX + (screenSizeData.currentScreenWidth * 28) / 100;
      }

      posArray[i].midPos = posArray[i].posX + screenData.current.offset * 0.5;
    }

    positionManagerRef.current = [...posArray];
  };

  const resetRightMostItems = (posArray, posIndexArray, dx) => {
    let boundaryCrossingItems = [];

    posIndexArray.forEach((element, index) => {
      boundaryCrossingItems.push(posArray.splice(posArray.indexOf(posArray.find((o) => o.posIndex === element)), 1)[0]);
    });

    boundaryCrossingItems.forEach((element) => {
      posArray.unshift(element);
    });

    for (let i = posArray.length - 1; i >= 0; i--) {
      if (i === posArray.length - 1) {
        posArray[i].posX += dx;
      } else {
        posArray[i].posX = posArray[i + 1].posX - (screenSizeData.currentScreenWidth * 28) / 100;
      }
      posArray[i].midPos = posArray[i].posX + screenData.current.offset * 0.5;
    }

    positionManagerRef.current = [...posArray];
  };

  const snapAllGameListItems = () => {
    let item = positionManagerRef.current.find((o) => o.posIndex === selectedItemRef.current + 1);

    let diff = screenData.current.offset - item.posX;
    let offset = 0;
    //console.log(diff);
    if (Math.abs(diff) > screenData.current.autoMoveSpeed) {
      offset = diff > 0 ? screenData.current.autoMoveSpeed : -screenData.current.autoMoveSpeed;
    } else {
      offset = diff;
    }
    if (offset) {
      updatePosition(offset, false);
    } else {
      screenData.current.moveState = false;
      setShouldAnimate(false);
    }
  };

  const setSelectedGameItem = () => {
    let closestItemIndex = 0;
    let minDistance = Number.MAX_VALUE;

    for (let i = 0; i < positionManagerRef.current.length; i++) {
      let diff = Math.abs(positionManagerRef.current[i].midPos - screenData.current.selectedRegion);

      if (diff < minDistance) {
        minDistance = diff;
        closestItemIndex = positionManagerRef.current[i].posIndex - 1;
      }
    }

    if (selectedItemRef.current !== closestItemIndex) {
      selectedItemRef.current = closestItemIndex;
      gameListIconClickFn(gameList[selectedItemRef.current]?.index - 1 ?? null);
    }
  };

  //#endregion

  //#region GAME LIST ITEM
  const gameListHolderRef = useRef([]);

  const gameListItem = (item, index) => {
    return (
      <Box
        key={index}
        ref={(el) => (gameListHolderRef.current[index] = el)}
        style={{
          position: "absolute",
          width: getElementWidth(120),
          height: getElementHeight(200),
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "blue",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            width: getElementWidth(90),
            height: getElementWidth(90),
            borderRadius: "50%",
          }}
        >
          <div
            style={{
              backgroundImage: `url(${item.thumbnail})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              borderRadius: "50%",
              border: selectedItemRef.current === index ? "3px solid white" : "none",
              zIndex: "1",
              width: selectedItemRef.current === index ? getElementWidth(90) : getElementWidth(70),
              height: selectedItemRef.current === index ? getElementWidth(90) : getElementWidth(70),
              transition: `all 0.2s`,
              boxSizing: "border-box",
              boxShadow: selectedItemRef.current === index ? `0px 0px ${getElementWidth(35.23723220825195) + "px"} 0px rgba(255, 255, 255, 0.9)` : "none",
            }}
            onClick={() => {
              selectedItemRef.current = index;
              gameListIconClickFn(gameList[selectedItemRef.current].index - 1);
              screenData.current.moveState = true;
              setShouldAnimate(true);
            }}
          >
            <div
              style={{
                borderRadius: "50%",
                border: selectedItemRef.current === index ? "none" : "4.6px solid rgba(0, 0, 0, 0.5)",
                zIndex: "1",
                width: selectedItemRef.current === index ? getElementWidth(90) : `calc(${getElementWidth(70) + "px"} - 9.2px)`,
                height: selectedItemRef.current === index ? getElementWidth(90) : `calc(${getElementWidth(70) + "px"} - 9.2px)`,
              }}
            ></div>
          </div>
        </Box>
        <Box sx={{ height: getElementWidth(15), width: "100%" }}></Box>
        <Box
          sx={{
            //width: getElementWidth(72),
            height: getElementWidth(18),
          }}
        >
          <Typography
            style={{
              color: "white",
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
            fontFamily="Montserrat"
            fontSize={getElementWidth(14)}
            fontWeight="400"
            color="#FFFFFF"
            textAlign="center"
          >
            {item.name}
          </Typography>
        </Box>
      </Box>
    );
  };
  //#endregion

  return (
    <div
      id="scrollBox"
      style={{
        display: "flex",
        overflow: "auto",
        //paddingLeft: getElementWidth(16),
        overflowX: "hidden",
      }}
    >
      {gameList.map((item, index) => {
        return gameListItem(item, index);
      })}
    </div>
  );
};

export default CustomGameListScroller;
