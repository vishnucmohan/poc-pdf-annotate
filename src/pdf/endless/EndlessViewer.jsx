import React, { useState } from "react";
import { CgDebug, CgArrowsExpandDownRight } from "react-icons/cg";
import { RiImageEditFill } from "react-icons/ri";

import AnnotatablePage from "./AnnotatablePage";

const Range = (maxValue) => Array.from(Array(maxValue).keys());

const EndlessViewer = (props) => {
  const [debug, setDebug] = useState(false);

  const [annotationMode, setAnnotationMode] = useState("ANNOTATION");

  const onToggleRelationsMode = () => {
    if (annotationMode === "RELATIONS") setAnnotationMode("ANNOTATION");
    else setAnnotationMode("RELATIONS");
  };

  const onToggleImageMode = () => {
    if (annotationMode === "IMAGE") setAnnotationMode("ANNOTATION");
    else setAnnotationMode("IMAGE");
  };

  const handleKeyDownSearch = (event) => {
    if (event.key === "Enter") {
      console.log(event.target.value);
      var elmntToView = document.getElementById("dvpage_" + event.target.value);
      elmntToView.scrollIntoView();
    }
  };

  return (
    <div>
      <header>
        <button onClick={() => setDebug(!debug)}>
          <span className="inner">
            <CgDebug />
          </span>
        </button>

        <button
          className={annotationMode === "RELATIONS" ? "active" : null}
          onClick={onToggleRelationsMode}
        >
          <span className="inner">
            <CgArrowsExpandDownRight />
          </span>
        </button>

        <button
          className={annotationMode === "IMAGE" ? "active" : null}
          onClick={onToggleImageMode}
        >
          <span className="inner">
            <RiImageEditFill />
          </span>
        </button>
        <input
          type="number"
          id="pageNumber"
          className="toolbarField pageNumber"
          title="Page"
          size="4"
          min="1"
          autoComplete="off"
          max={props?.pdf?.numPages}
          onKeyDown={handleKeyDownSearch}
        ></input>
        <span
          id="numPages"
          className="toolbarLabel"
        >{`of ${props?.pdf?.numPages}`}</span>
      </header>

      <main>
        <div className="pdf-viewer-container">
          {Range(props.pdf.numPages).map((idx) => (
            <div id={`dvpage_${idx + 1}`} key={idx}>
              <AnnotatablePage
                key={idx}
                url={props.url}
                pdf={props.pdf}
                page={idx + 1}
                config={props.config}
                debug={debug}
                store={props.store}
                connections={props.connections}
                annotationMode={annotationMode}
                onCreateAnnotation={props.onCreateAnnotation}
                onUpdateAnnotation={props.onUpdateAnnotation}
                onDeleteAnnotation={props.onDeleteAnnotation}
                onCancelSelected={props.onCancelSelected}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EndlessViewer;
