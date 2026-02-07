import React, { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { defaultDocContentPadding, docPaperWidth } from "./constants";

const minRulerScale = 8;
const scaleIndices = Array.from(
  { length: Math.round(docPaperWidth / minRulerScale) + 1 },
  (_, i) => i
);
const minDocContentWidth = 100;

export const Ruler = () => {
  const [leftMargin, setLeftMargin] = useState(defaultDocContentPadding);
  const [rightMargin, setRightMargin] = useState(defaultDocContentPadding);

  const [isDraggingLeftCursor, setIsDraggingLeftCursor] = useState(false);
  const [isDraggingRightCursor, setIsDraggingRightCursor] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  const handleMouseDownOnLeftCursor = () => {
    setIsDraggingLeftCursor(true);
  };
  const handleMouseDownOnRightCursor = () => {
    setIsDraggingRightCursor(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const isDragging = isDraggingLeftCursor || isDraggingRightCursor;
    if (!rulerRef.current || !isDragging) {
      return;
    }

    const rulerContainer = rulerRef.current.querySelector("#ruler-container");
    if (!rulerContainer) {
      return;
    }

    const rulerContainerRect = rulerContainer.getBoundingClientRect();
    const rawRelativeX = e.clientX - rulerContainerRect.left;
    // relativeX must not exceed the width of the doc paper([0, docPaperWidth])
    const relativeX = Math.max(0, Math.min(docPaperWidth, rawRelativeX));

    if (isDraggingLeftCursor) {
      const maxLeftMargin = docPaperWidth - rightMargin - minDocContentWidth;
      const newLeftMargin = Math.min(relativeX, maxLeftMargin);
      setLeftMargin(newLeftMargin);
    } else if (isDraggingRightCursor) {
      const maxRightMargin = docPaperWidth - leftMargin - minDocContentWidth;
      const newRightMargin = Math.min(
        docPaperWidth - relativeX,
        maxRightMargin
      );
      setRightMargin(newRightMargin);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingLeftCursor(false);
    setIsDraggingRightCursor(false);
  };

  // reset the cursor to the original position
  const handleDoubleClickLeftCursor = () => {
    setLeftMargin(defaultDocContentPadding);
  };
  const handleDoubleClickRightCursor = () => {
    setRightMargin(defaultDocContentPadding);
  };

  return (
    <div
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`w-[${docPaperWidth}px] mx-auto h-6 border-b border-gray-300 flex items-end relative select-none print:hidden`}
    >
      <div id="ruler-container" className="w-full h-full relative">
        <Marker
          position={leftMargin}
          isLeft={true}
          isDragging={isDraggingLeftCursor}
          onMouseDown={handleMouseDownOnLeftCursor}
          onDoubleClick={handleDoubleClickLeftCursor}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRightCursor}
          onMouseDown={handleMouseDownOnRightCursor}
          onDoubleClick={handleDoubleClickRightCursor}
        />
        <div className="absolute inset-x-0 bottom-0 h-full">
          <div className={`relative h-full w-[${docPaperWidth}px]`}>
            {scaleIndices.map((scaleIndex) => {
              const position = scaleIndex * minRulerScale;
              return (
                <div
                  key={scaleIndex}
                  className="absolute buttom-0 h-full"
                  style={{ left: `${position}px` }}
                >
                  {scaleIndex % 10 == 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500 " />
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {scaleIndex / 10 + 1}{" "}
                      </span>
                    </>
                  )}
                  {scaleIndex % 5 === 0 && scaleIndex % 10 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                  )}
                  {scaleIndex % 5 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  const translateClass = `${isLeft ? "-" : ""}translate-x-1/2`;
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group"
      style={{
        [isLeft ? "left" : "right"]: `${position}px`,
      }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown
        className={`absolute top-0 h-full fill-blue-500 transform ${translateClass}`}
      />
      <div
        className={`absolute top-4 transition-opacity duration-150 `}
        style={{
          height: "100vh",
          width: "1px",
          transform: "scaleX(0.5)",
          backgroundColor: "#3b72f6",
          [isLeft ? "left" : "right"]: 0,
          display: isDragging ? "block" : "none",
        }}
      />
    </div>
  );
};
